import os
import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Check API key early
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not set in environment or .env file.")
    sys.exit(1)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# List of subtopics to ensure variety
subtopics = [
    "historical events of the Indian Constitution (e.g., adoption, effective date)",
    "articles of the Indian Constitution",
    "amendments to the Indian Constitution",
    "key figures involved in drafting or implementing the Indian Constitution",
    "fundamental rights and duties",
    "structure of the Indian government (e.g., President, Parliament)",
    "Directive Principles of State Policy",
    "judicial system and the Supreme Court",
    "elections and the Election Commission",
    "Preamble of the Indian Constitution"
]

# In-memory cache for recent questions (to avoid repetition)
recent_questions = []

def generate_content(user_query, system_prompt_text):
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")

        # Combine system prompt and user query
        prompt = f"{system_prompt_text}\n\nUser query: {user_query}"

        # Generate content
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=1.0,  # Increased for more variety
                top_p=0.9,
                top_k=40,
                max_output_tokens=8192,
            )
        )

        response_text = response.text
        if not response_text:
            response_text = "".join(
                part.text
                for candidate in getattr(response, "candidates", [])
                for part in getattr(getattr(candidate, "content", None), "parts", [])
                if hasattr(part, "text")
            )
        
        # Clean up markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "").strip()
            
        return response_text
    except Exception as e:
        print(f"[Learn Server] API Error: {str(e)}")
        raise ValueError(f"Content generation failed: {str(e)}")

@app.route('/generate-question', methods=['POST'])
def generate_question():
    try:
        # Randomly select a subtopic
        subtopic = random.choice(subtopics)
        
        # System prompt with subtopic and anti-repetition instruction
        system_prompt = f"""
        You are an educational AI. Generate ONE multiple-choice question about the Indian Constitution, focusing on {subtopic}.
        - Provide a unique question that has not been recently asked.
        - Ensure the question is distinct from these recent questions: {', '.join(recent_questions[-5:])}.
        - Provide the question text.
        - Give exactly 4 answer options.
        - Specify the correct option as the answer.
        - Include a brief hint suitable for learning.
        - Keep it easy and learning-oriented.
        Format the response as JSON:
        {{
            "question": "Question text",
            "options": ["opt1", "opt2", "opt3", "opt4"],
            "answer": "correct option text",
            "hint": "learning hint"
        }}
        """

        data = request.get_json()
        user_input = data.get('query', 'Generate a question now')

        response_text = generate_content(user_input, system_prompt)
        print(f"[Learn Server] Raw response: {response_text[:200]}...")
        question_data = json.loads(response_text)
        
        # Add question to recent_questions (store only the last 5 to limit memory)
        recent_questions.append(question_data['question'])
        if len(recent_questions) > 5:
            recent_questions.pop(0)
        
        return jsonify(question_data)
    except json.JSONDecodeError as e:
        print(f"[Learn Server] JSON Parse Error: {str(e)}")
        print(f"[Learn Server] Raw response was: {response_text}")
        return jsonify({'error': f"Invalid JSON response: {str(e)}", 'raw_response': response_text}), 500
    except Exception as e:
        print(f"[Learn Server] Server Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "raw_response": response_text if 'response_text' in locals() else None}), 500

@app.route('/generate', methods=['POST'])
def generate_endpoint():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

    user_query = data['query']
    print(f"[Learn Server] Received query: {user_query}")

    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        print("[Learn Server] Error: systemprompt.txt not found")
        return jsonify({'error': 'System prompt file not found.'}), 500

    try:
        response_text = generate_content(user_query, system_prompt_text)
        print(f"[Learn Server] Raw response: {response_text[:200]}...")
        response_json = json.loads(response_text)
        return jsonify(response_json)
    except json.JSONDecodeError as e:
        print(f"[Learn Server] JSON Parse Error: {str(e)}")
        print(f"[Learn Server] Raw response was: {response_text}")
        return jsonify({'error': f"Invalid JSON response: {str(e)}", 'raw_response': response_text}), 500
    except Exception as e:
        print(f"[Learn Server] Server Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def command_line_generate():
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        print("Error: System prompt file not found.")
        return

    user_query = input("Enter Article no: ")
    try:
        response_text = generate_content(user_query, system_prompt_text)
        print(response_text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        command_line_generate()
    else:
        print("[Learn Server] Starting on port 5000...")
        app.run(host="0.0.0.0", port=5000, debug=True)
