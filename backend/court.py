from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
import re

from google import genai
from google.genai import types

# Load environment variables
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

# Initialize client with API key
client = genai.Client(api_key=GEMINI_API_KEY)

# Define case scenarios with names
case_scenarios = {
    'murder': {
        'title': 'The Mystery of the Missing Necklace',
        'topic': 'During a family festival, Grandma\'s gold necklace vanished. Aryan and Rohan were near the room.',
        'personA_name': 'Aryan',
        'personB_name': 'Rohan',
        'guilty': 'Rohan',
        'reason': 'They lied to the court about their actions',
        'article': 'Article 21 - Right to Life and Personal Liberty'
    },
    'property': {
        'title': 'The Two Brothers and Papa\'s Farm',
        'topic': 'Brothers Vikram and Ajay fight over their late father\'s farm. Vikram wants more land, Ajay has letters.',
        'personA_name': 'Vikram',
        'personB_name': 'Ajay',
        'guilty': 'Vikram',
        'reason': 'They tried to take something that wasn\'t theirs',
        'article': 'Article 14 - Right to Equality'
    }
}

@app.route('/generate', methods=['POST'])
def generate_case():
    try:
        data = request.get_json()
        case_type = data.get('caseType')
        
        if not case_type:
            return jsonify({'error': 'Missing caseType parameter'}), 400

        if case_type not in case_scenarios:
            return jsonify({'error': 'Invalid case type. Use "murder" or "property"'}), 400

        scenario = case_scenarios[case_type]
        
        # Ultra-compact prompt
        prompt = f"""Create educational courtroom story JSON for kids (10-14) about {scenario['topic']}

Return ONLY this JSON structure (no markdown, no extra text):

{{"caseTitle":"{scenario['title']}","summary":"Brief 2-sentence summary","personA_name":"{scenario['personA_name']}","personB_name":"{scenario['personB_name']}","personA_dialogues":["Short statement 1","Short statement 2","Short statement 3","Short statement 4","Short statement 5"],"personB_dialogues":["Short statement 1","Short statement 2","Short statement 3 with clue","Short statement 4","Short statement 5"],"mcq":{{"guilty":["{scenario['personA_name']}","{scenario['personB_name']}","Both are guilty","No one is guilty"],"reason":["They lied to the court about their actions","They tried to take something that wasn't theirs","They broke a family promise or trust","They disrespected elders or fairness"],"article":["Article 14 - Right to Equality","Article 19 - Right to Freedom","Article 21 - Right to Life and Personal Liberty","Article 39 - Principles of Policy for Fair Distribution"]}},"correctAnswers":{{"guilty":"{scenario['guilty']}","reason":"{scenario['reason']}","article":"{scenario['article']}"}},"verdict_explanation":"2 sentences explaining verdict positively","judge_tip":"Short wise tip about honesty"}}

Rules: Keep dialogues SHORT (max 15 words each). Make {scenario['guilty']} guilty through subtle clues. Kid-friendly tone. also try to hint who is the guilty"""

        # Safety settings - allow fictional content
        safety_settings = [
            types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="BLOCK_NONE"),
            types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_NONE"),
            types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="BLOCK_NONE"),
            types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="BLOCK_NONE")
        ]

        # Generate content with retry logic
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        safety_settings=safety_settings,
                        temperature=0.6,
                        top_p=0.9,
                        max_output_tokens=3000,
                    )
                )

                # Check if response was blocked
                if not response.candidates or len(response.candidates) == 0:
                    print(f"⚠️ Attempt {attempt + 1}: No candidates returned")
                    if attempt == max_retries - 1:
                        return jsonify({
                            'error': 'Content generation blocked. Please try again.',
                            'blocked': True
                        }), 400
                    continue

                candidate = response.candidates[0]
                finish_reason = str(candidate.finish_reason)
                
                print(f"✅ Attempt {attempt + 1}: Finish reason = {finish_reason}")

                # Check finish reason
                if "SAFETY" in finish_reason:
                    print(f"⚠️ Attempt {attempt + 1}: Blocked by safety filters")
                    if attempt == max_retries - 1:
                        return jsonify({
                            'error': 'Safety filters triggered. This is educational fiction. Please try again.',
                            'finish_reason': 'SAFETY'
                        }), 400
                    continue

                # Extract text - handle None case
                if not hasattr(candidate.content, 'parts') or not candidate.content.parts:
                    print(f"⚠️ Attempt {attempt + 1}: No content parts")
                    if attempt == max_retries - 1:
                        return jsonify({'error': 'Empty response from model'}), 500
                    continue

                response_text = ""
                for part in candidate.content.parts:
                    if hasattr(part, 'text') and part.text:
                        response_text += part.text

                if not response_text:
                    print(f"⚠️ Attempt {attempt + 1}: Empty text")
                    if attempt == max_retries - 1:
                        return jsonify({'error': 'Empty response text'}), 500
                    continue

                response_text = response_text.strip()
                print(f"📝 Response length: {len(response_text)} chars")

                # Clean markdown if present
                if '```json' in response_text:
                    response_text = response_text.split('```json')[1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[1].split('```')[0].strip()

                # Extract JSON
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if not json_match:
                    print(f"⚠️ Attempt {attempt + 1}: No JSON found in response")
                    print(f"Response preview: {response_text[:300]}")
                    if attempt == max_retries - 1:
                        return jsonify({'error': 'Failed to extract JSON from response'}), 500
                    continue

                # Parse JSON
                try:
                    case_data = json.loads(json_match.group(0))
                except json.JSONDecodeError as e:
                    print(f"⚠️ Attempt {attempt + 1}: JSON parse error: {e}")
                    print(f"JSON preview: {json_match.group(0)[:300]}")
                    if attempt == max_retries - 1:
                        return jsonify({'error': 'Invalid JSON format from model'}), 500
                    continue

                # Validate required fields
                required = ['summary', 'personA_dialogues', 'personB_dialogues', 'mcq', 'correctAnswers', 'verdict_explanation', 'judge_tip']
                missing = [f for f in required if f not in case_data]
                if missing:
                    print(f"⚠️ Attempt {attempt + 1}: Missing fields: {missing}")
                    if attempt == max_retries - 1:
                        return jsonify({'error': f'Missing required fields: {missing}'}), 500
                    continue

                # Validate dialogues length
                if len(case_data.get('personA_dialogues', [])) != 5 or len(case_data.get('personB_dialogues', [])) != 5:
                    print(f"⚠️ Attempt {attempt + 1}: Invalid dialogue count")
                    if attempt == max_retries - 1:
                        return jsonify({'error': 'Invalid number of dialogues'}), 500
                    continue

                # Success!
                print(f"✅ Successfully generated case on attempt {attempt + 1}")
                return jsonify(case_data), 200

            except Exception as inner_e:
                print(f"⚠️ Attempt {attempt + 1} error: {str(inner_e)}")
                if attempt == max_retries - 1:
                    raise

        # If we get here, all retries failed
        return jsonify({'error': 'Failed after multiple attempts. Please try again.'}), 500

    except Exception as e:
        print(f"❌ Error in generate_case: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'Junior Judge Courtroom - Ready for Justice!'}), 200

if __name__ == '__main__':
    print("🏛️ Junior Judge Courtroom Backend Starting...")
    print(f"📡 Server running on http://localhost:5005")
    app.run(host='0.0.0.0', port=5005, debug=True)