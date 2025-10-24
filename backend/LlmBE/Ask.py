import os
import base64
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Check API key early
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not set")
    sys.exit(1)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def generate_content(user_query, system_prompt_text):
    try:
        # Initialize GENAI client (exact from both files)
        client = genai.Client(api_key=api_key)
        model = "gemini-2.0-flash-exp"

        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=user_query),
                ]
            )
        ]

        # Try without Google Search tool first to avoid quota/rate limit issues
        # tools = [
        #     types.Tool(google_search=types.GoogleSearch())
        # ]

        generate_content_config = types.GenerateContentConfig(
            temperature=0.7,  # Reduced from 2 to 0.7 for more stable responses
            top_p=0.95,
            top_k=40,
            max_output_tokens=8192,
            # tools=tools,  # Commented out to avoid google search issues
            response_mime_type="text/plain",
            system_instruction=[
                types.Part.from_text(text=system_prompt_text)
            ]
        )

        # Collect response from GENAI (streaming, exact from both files)
        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            response_text += chunk.text

        # Remove code block markers if present (exact from front.py)
        if response_text.startswith("```json") and response_text.endswith("```"):
            response_text = response_text.strip("```json").strip("```")

        return response_text
    except Exception as e:
        raise ValueError(f"Content generation failed: {str(e)}")

@app.route('/generate2', methods=['POST'])
def generate_endpoint():
    # Validate input (exact from front.py)
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

    user_query = data['query']

    # Read system prompt from file (exact)
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        return jsonify({'error': 'System prompt file not found.'}), 500

    try:
        response_text = generate_content(user_query, system_prompt_text)
        # Parse the JSON string (exact from front.py)
        response_json = json.loads(response_text)
        return jsonify(response_json)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")
        print(f"Response was: {response_text}")
        return jsonify({'error': f"Invalid JSON response: {str(e)}", 'raw_response': response_text}), 500
    except Exception as e:
        print(f"Error in generate_endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

def command_line_generate():
    # Read the system prompt from external file (exact from article.py)
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        print("Error: System prompt file not found.")
        return

    user_query = input("Enter doubt: ")  # Exact prompt from article.py

    try:
        response_text = generate_content(user_query, system_prompt_text)
        print(response_text)  # Exact output from article.py (no JSON parse)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Run in Flask mode by default, or CLI with --cli
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        command_line_generate()
    else:
        app.run(host="0.0.0.0", port=5001, debug=True)  # Exact port and debug from front.py