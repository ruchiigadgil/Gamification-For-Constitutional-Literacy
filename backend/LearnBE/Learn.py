# import os
# import base64
# import json
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# # from google import genai
# from google.genai import types
# import google.generativeai as genai 
# from dotenv import load_dotenv
# import sys

# # Load environment variables
# load_dotenv()

# # Check API key early
# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     print("Error: GEMINI_API_KEY not set in environment or .env file. Follow instructions to create and set it.")
#     sys.exit(1)

# # Initialize Flask app
# app = Flask(_name_)
# CORS(app)  # Enable CORS for all routes

# def generate_content(user_query, system_prompt_text):
#     try:
#         # Initialize GENAI client (exact from original)
#         client = genai.Client(api_key=api_key)
#         model = "gemini-2.0-flash"

#         contents = [
#             types.Content(
#                 role="user",
#                 parts=[
#                     types.Part.from_text(text=user_query),
#                 ]
#             )
#         ]

#         tools = [
#             types.Tool(google_search=types.GoogleSearch())
#         ]

#         generate_content_config = types.GenerateContentConfig(
#             temperature=2,
#             top_p=0.95,
#             top_k=40,
#             max_output_tokens=8192,
#             tools=tools,
#             response_mime_type="text/plain",
#             system_instruction=[
#                 types.Part.from_text(text=system_prompt_text)
#             ]
#         )

#         # Collect response from GENAI (streaming, exact from original)
#         response_text = ""
#         for chunk in client.models.generate_content_stream(
#             model=model,
#             contents=contents,
#             config=generate_content_config,
#         ):
#             response_text += chunk.text

#         # Remove code block markers if present (exact from front.py)
#         if response_text.startswith("json") and response_text.endswith(""):
#             response_text = response_text.strip("json").strip("")

#         return response_text
#     except Exception as e:
#         raise ValueError(f"Content generation failed: {str(e)}")

# # @app.route('/generate', methods=['POST'])
# # def generate_endpoint():
# #     data = request.get_json()

# #     # Validate input (exact from front.py)
# #     if not data or 'query' not in data:
# #         return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

# #     user_query = data['query']

# #     # Read system prompt from file (exact)
# #     try:
# #         with open("systemprompt.txt", "r", encoding="utf-8") as sp:
# #             system_prompt_text = sp.read()
# #     except FileNotFoundError:
# #         return jsonify({'error': 'System prompt file not found.'}), 500

# #     try:
# #         response_text = generate_content(user_query, system_prompt_text)
# #         # Parse the JSON string (exact from front.py)
# #         response_json = json.loads(response_text)
# #         return jsonify(response_json)
# #     except json.JSONDecodeError as e:
# #         return jsonify({'error': f"Invalid JSON response: {str(e)}"}), 500
# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500

# @app.route('/generate', methods=['POST'])
# def generate_endpoint():
#     data = request.get_json()
#     if not data or 'query' not in data:
#         return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

#     user_query = data['query']
#     try:
#         with open("systemprompt.txt", "r", encoding="utf-8") as sp:
#             system_prompt_text = sp.read()
#     except FileNotFoundError:
#         return jsonify({'error': 'System prompt file not found.'}), 500

#     try:
#         response_text = generate_content(user_query, system_prompt_text)
#         print(f"Raw response: {response_text}")  # Debug
#         return jsonify({'response': response_text})  # Return text directly
#     except Exception as e:
#         print(f"Server Error: {str(e)}")  # Debug
#         return jsonify({'error': str(e)}), 500

# def command_line_generate():
#     # Read the system prompt from external file (exact from llm.py)
#     try:
#         with open("systemprompt.txt", "r", encoding="utf-8") as sp:
#             system_prompt_text = sp.read()
#     except FileNotFoundError:
#         print("Error: System prompt file not found.")
#         return

#     user_query = input("Enter Article no: ")

#     try:
#         response_text = generate_content(user_query, system_prompt_text)
#         print(response_text)  # Exact output from llm.py (no JSON parse here, as per original)
#     except Exception as e:
#         print(f"Error: {str(e)}")

# if _name_ == "_main_":
#     # Run in Flask mode by default, or CLI with --cli (to mimic running front.py or llm.py)
#     if len(sys.argv) > 1 and sys.argv[1] == "--cli":
#         command_line_generate()
#     else:
#         app.run(host="0.0.0.0", port=5000)



import os
import json
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

def generate_content(user_query, system_prompt_text):
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        # Use the latest flash model that supports generate_content
        model = genai.GenerativeModel("gemini-2.5-flash")

        # Combine system prompt and user query
        prompt = f"{system_prompt_text}\n\nUser query: {user_query}"

        # Generate content
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=8192,
            )
        )

        response_text = response.text
        if not response_text:
            # Fallback in case text is empty, collect parts manually
            response_text = "".join(
                part.text
                for candidate in getattr(response, "candidates", [])
                for part in getattr(getattr(candidate, "content", None), "parts", [])
                if hasattr(part, "text")
            )
        
        # Try to clean up the response if it has markdown code blocks
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "").strip()
        elif response_text.startswith("```"):
            response_text = response_text.replace("```", "").strip()
            
        return response_text
    except Exception as e:
        print(f"[Learn Server] API Error: {str(e)}")  # Debug
        raise ValueError(f"Content generation failed: {str(e)}")

@app.route('/generate', methods=['POST'])
def generate_endpoint():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

    user_query = data['query']
    print(f"[Learn Server] Received query: {user_query}")  # Debug

    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        print("[Learn Server] Error: systemprompt.txt not found")  # Debug
        return jsonify({'error': 'System prompt file not found.'}), 500

    try:
        response_text = generate_content(user_query, system_prompt_text)
        print(f"[Learn Server] Raw response: {response_text[:200]}...")  # Debug (truncated)
        response_json = json.loads(response_text)  # Parse JSON to ensure validity
        return jsonify(response_json)  # Return parsed JSON to match frontend expectations
    except json.JSONDecodeError as e:
        print(f"[Learn Server] JSON Parse Error: {str(e)}")  # Debug
        print(f"[Learn Server] Raw response was: {response_text}")
        return jsonify({'error': f"Invalid JSON response: {str(e)}", 'raw_response': response_text}), 500
    except Exception as e:
        print(f"[Learn Server] Server Error: {str(e)}")  # Debug
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# code for gemini based mcqs
@app.route('/generate-question', methods=['POST'])
def generate_question():
    try:
        # System prompt: guide Gemini to generate a question
        system_prompt = """
        You are an educational AI. Generate ONE multiple-choice question about the Indian Constitution.
        - Provide the question
        - Give 4 answer options
        - Indicate which option is correct
        - Give a small hint suitable for learning
        Format the response as JSON:
        {
            "question": "Question text",
            "options": ["opt1", "opt2", "opt3", "opt4"],
            "answer": "correct option text",
            "hint": "learning hint"
        }
        Keep it easy and learning-oriented.
        """

        user_input = "Generate a question now"

        response_text = generate_content(user_input, system_prompt)
        # parse JSON
        question_data = json.loads(response_text)
        return jsonify(question_data)
    except Exception as e:
        return jsonify({"error": str(e), "raw_response": response_text}), 500



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