from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import requests
import time
import os

app = Flask(__name__)
CORS(app)
 
# Define backend service URLs
SERVICES = {
    "genai-v1": "http://localhost:5001/generate9",
    "genai-v2": "http://localhost:5002/generate8"
}

# Start the backend servers automatically
backend_processes = []

def start_backend_services():
    print("Starting backend services...")
    # Adjust these paths as per your folder structure
    backend1 = subprocess.Popen(["python", "backend1.py"], cwd="connection")
    backend2 = subprocess.Popen(["python", "backend2.py"], cwd="connection")
    backend_processes.extend([backend1, backend2])

    # Wait a bit to let services spin up
    time.sleep(3)

@app.route('/generate/<service_name>', methods=['POST'])
def route_to_service(service_name):
    if service_name not in SERVICES:
        return jsonify({"error": "Invalid service requested."}), 404

    try:
        response = requests.post(
            SERVICES[service_name],
            json=request.get_json()
        )
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to connect to {service_name}: {str(e)}"}), 500

if __name__ == '__main__':
    start_backend_services()
    try:
        app.run(host='0.0.0.0', port=5000)
    finally:
        print("Shutting down backend services...")
        for proc in backend_processes:
            proc.terminate()
