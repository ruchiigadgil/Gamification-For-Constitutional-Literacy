from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

# Load environment variables from parent directory if not found
env_path = os.path.join(os.path.dirname(__file__), '.env')
if not os.path.exists(env_path):
    env_path = os.path.join(os.path.dirname(__file__), 'LlmBE', '.env')
load_dotenv(env_path)

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in .env")
    print(f"Tried loading from: {env_path}")
    exit(1)

print(f"✅ API Key loaded: {GEMINI_API_KEY[:20]}...")
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/generate', methods=['POST'])
def generate_case():
    try:
        data = request.get_json()
        case_type = data.get('caseType')
        
        if not case_type:
            return jsonify({'error': 'Missing caseType parameter'}), 400

        # Define conflict resolution scenarios
        case_scenarios = {
            'property': {
                'title': 'The Garden Sharing Story',
                'topic': 'Two neighbors Ravi and Meena both want to use the same garden space. Ravi says his family has been planting flowers there for many years. Meena found old papers showing the land might be hers. They both respect each other and want a peaceful solution that makes everyone happy.'
            },
            'investigation': {
                'title': 'The School Library Conflict',
                'topic': 'A student forgot to return an important school book. Another student needs it urgently for a project. The librarian wants to help both students. They need to find a fair way to share resources and be responsible. This is about learning cooperation and honesty.'
            }
        }

        if case_type not in case_scenarios:
            return jsonify({'error': 'Invalid case type. Use "property" or "investigation"'}), 400

        scenario = case_scenarios[case_type]
        
        # Create prompt for Gemini - use SAFE conflict resolution language
        prompt = f"""Generate a child-friendly conflict resolution story for educational purposes about Indian Constitution values.

This is NOT about legal judgement, NOT about crime, NOT about guilt, and NOT real legal guidance.
This is a POSITIVE learning story about values, cooperation, and peaceful problem-solving.

Topic: {scenario['topic']}

Create a JSON object with this EXACT structure (return ONLY JSON, no markdown, no extra text):

{{
  "caseTitle": "{scenario['title']}",
  "summary": "Brief 2-3 sentence positive explanation of the situation",
  "personA_name": "Name of first person",
  "personB_name": "Name of second person",
  "personA_dialogues": [
    "Simple dialogue 1 from Person A (1-2 sentences, friendly tone)",
    "Simple dialogue 2 from Person A",
    "Simple dialogue 3 from Person A",
    "Simple dialogue 4 from Person A",
    "Simple dialogue 5 from Person A"
  ],
  "personB_dialogues": [
    "Simple dialogue 1 from Person B (1-2 sentences, friendly tone)",
    "Simple dialogue 2 from Person B",
    "Simple dialogue 3 from Person B",
    "Simple dialogue 4 from Person B",
    "Simple dialogue 5 from Person B"
  ],
  "mcq": {{
    "who_needs_to_improve": ["Person A name", "Person B name", "Both need to cooperate", "Both handled it well"],
    "reason": ["Positive reason option 1", "Positive reason option 2", "Positive reason option 3", "Positive reason option 4"],
    "learning_point": [
      "Right to Equality - Article 14",
      "Right to Freedom - Article 19",
      "Right against Exploitation - Article 23",
      "Right to Constitutional Remedies - Article 32"
    ]
  }},
  "correctAnswers": {{
    "who_needs_to_improve": "Pick one option from the first MCQ",
    "reason": "Pick one option from reason MCQ",
    "learning_point": "Pick one Article from learning_point options"
  }},
  "positive_resolution": "Explain a constructive, peaceful way to solve this situation in 2-3 simple sentences"
}}

IMPORTANT RULES:
- Keep everything educational, positive, and friendly
- NO words like: guilty, crime, punishment, verdict, judge, blame
- Use words like: cooperation, understanding, improvement, learning, peaceful resolution
- Focus on moral values and constitutional learning
- Each dialogue should be simple and constructive (1-2 sentences)
- Make all options positive and educational
- Return ONLY the JSON object, nothing else"""

        # Call Gemini API with relaxed safety settings for educational content
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Use the most permissive safety settings for educational content
        from google.generativeai.types import HarmCategory, HarmBlockThreshold
        
        safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                max_output_tokens=2048,
            ),
            safety_settings=safety_settings
        )

        # Check if response was blocked
        if not response.candidates:
            return jsonify({
                'error': 'Content generation was blocked by safety filters. Please try again.',
                'blocked': True
            }), 400
            
        # Check finish reason
        finish_reason = response.candidates[0].finish_reason
        if finish_reason != 1:  # 1 = STOP (normal completion)
            print(f"⚠️ Finish reason: {finish_reason}")
            if finish_reason == 2:  # SAFETY
                return jsonify({
                    'error': 'Content blocked by safety filters. This is an educational simulation.',
                    'finish_reason': 'SAFETY'
                }), 400
            elif finish_reason == 3:  # RECITATION
                return jsonify({
                    'error': 'Content blocked due to recitation. Please try again.',
                    'finish_reason': 'RECITATION'
                }), 400

        # Extract text from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text.replace('```json', '').replace('```', '').strip()
        elif response_text.startswith('```'):
            response_text = response_text.replace('```', '').strip()

        # Try to find JSON in the response
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            response_text = json_match.group(0)

        # Parse JSON
        try:
            case_data = json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response was: {response_text}")
            return jsonify({
                'error': 'Failed to parse model response',
                'raw_response': response_text[:500]
            }), 500

        # Validate required fields
        required_fields = ['summary', 'personA_dialogues', 'personB_dialogues', 'mcq', 'correctAnswers', 'positive_resolution']
        for field in required_fields:
            if field not in case_data:
                return jsonify({'error': f'Missing required field: {field}'}), 500

        return jsonify(case_data), 200

    except Exception as e:
        print(f"Error in generate_case: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'Courtroom Simulator'}), 200

if __name__ == '__main__':
    print("🏛️ Courtroom Simulator Backend Starting...")
    print(f"📡 Server running on http://localhost:5005")
    app.run(host='0.0.0.0', port=5005, debug=True)
