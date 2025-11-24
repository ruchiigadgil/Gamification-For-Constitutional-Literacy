import os
import base64
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import sys
from transformers import pipeline

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

# Load DistilBART summarizer once at startup (fast on CPU, great for kids)
print("🔄 Loading summarization model for easy language...")
summarizer = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6"
)
print("✅ Summarizer ready!")

def summarize_text(text):
    """
    Always simplify and summarize text into easy words for kids.
    Works on both short and long responses.
    """
    try:
        # Short text - make it simple and concise
        if len(text) < 400:
            summary = summarizer(
                text,
                max_length=80,
                min_length=20,
                do_sample=False
            )
            return summary[0]["summary_text"]

        # Long text - break into chunks and summarize each
        chunks = []
        for i in range(0, len(text), 800):
            part = text[i:i+800]
            summary = summarizer(
                part,
                max_length=120,
                min_length=40,
                do_sample=False
            )
            chunks.append(summary[0]["summary_text"])
        
        # Join all summarized chunks
        return " ".join(chunks)

    except Exception as e:
        print(f"⚠️ Summarization error: {e}")
        # If summarization fails, return original text
        return text

def generate_content(user_query, system_prompt_text):
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        # Use the same stable model as Learn.py to avoid API/version mismatches
        model = genai.GenerativeModel("gemini-2.5-flash")

        # Combine system prompt and user query
        prompt = f"{system_prompt_text}\n\nUser query: {user_query}"

        # Generate content
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
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

        # Remove code block markers if present
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "").strip()

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
        
        # Parse the JSON response from Gemini
        response_json = json.loads(response_text)
        
        # 🌟 ALWAYS simplify all text fields into easy words for kids
        print("📝 Simplifying response for easy understanding...")
        for key, value in response_json.items():
            if isinstance(value, str) and value.strip():
                # Summarize/simplify each text field
                response_json[key] = summarize_text(value)
                print(f"✅ Simplified '{key}' field")
        
        print("🎉 Response ready in easy language!")
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