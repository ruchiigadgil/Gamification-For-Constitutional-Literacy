import os
import json
import google.generativeai as genai
from google.generativeai.types import GenerationConfig, HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv
import sys
import concurrent.futures
import random
import time
from flask import Flask, jsonify, request
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Check API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not set in environment or .env file. Please set a valid API key.")
    sys.exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def generate_content(system_prompt_text):
    try:
        # Configure the Generative AI client
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Generate content
        response = model.generate_content(
            system_prompt_text,
            generation_config=GenerationConfig(
                temperature=1.5,  # Increased for more variability
                top_p=0.95,      # Adjusted for diverse outputs
                top_k=60,        # Expanded sampling range
                max_output_tokens=4096,
                response_mime_type="application/json"
            ),
            safety_settings={
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            }
        )

        response_text = response.text

        # Remove code block markers if present
        if response_text.startswith("```json") and response_text.endswith("```"):
            response_text = response_text.strip("```json").strip("```")

        return response_text
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        return None

def run_with_timeout(system_prompt_text, timeout=30):
    # Wrapper to run generate_content with a timeout
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(generate_content, system_prompt_text)
        try:
            return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            print("Error: API call timed out after 30 seconds. Check your internet connection or API key.")
            return None
        except Exception as e:
            print(f"Error during execution: {str(e)}")
            return None

def get_questions():
    # Read the system prompt from file
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        print("Error: systemprompt.txt file not found in the current directory.")
        return None

    # Add a unique seed and dynamic instruction for uniqueness
    random_seed = random.randint(1, 1000000) + int(time.time() * 1000)  # Combine random int with timestamp
    system_prompt_text += f"\n\nRandom Seed: {random_seed}. You MUST use this seed to generate a completely unique set of questions, distinct from any previous sets. Select different articles, schedules, or amendments each time, and vary the question structure, focus, and content significantly. Do NOT repeat any questions or use similar phrasing from previous generations."

    # Log the seed for debugging
    print(f"Generated seed: {random_seed}")

    # Generate content with timeout
    response_text = run_with_timeout(system_prompt_text)
    if not response_text:
        return None

    # Parse JSON output
    try:
        response_json = json.loads(response_text)
        # Log the generated questions for debugging
        print(f"Generated questions: {json.dumps(response_json, indent=2)}")
        return response_json
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON response: {str(e)}")
        print("Raw response:", response_text)
        return None

@app.route('/questions', methods=['GET'])
def questions_endpoint():
    # Add cache-busting parameter
    _ = request.args.get('_', str(time.time()))  # Ignore cache-busting param, just to force unique requests
    questions_data = get_questions()
    if questions_data is None:
        return jsonify({"error": "Failed to generate questions"}), 500
    return jsonify(questions_data)

if __name__ == "__main__":
    app.run(port=5003, debug=True)