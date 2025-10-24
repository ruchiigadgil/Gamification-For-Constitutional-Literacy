import os
import sys
import subprocess
import time
import logging
import atexit
import threading

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Server configurations
LEARN_PORT = 5000
ASK_PORT = 5001

# Process holders
learn_process = None
ask_process = None

def start_server(script_path, port, server_name):
    try:
        logger.info(f"Starting {server_name} on port {port}...")
        # Construct full path to the script
        script_full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), script_path)
        if not os.path.exists(script_full_path):
            logger.error(f"Error: {script_full_path} not found")
            return None
        # Set working directory to the script's directory
        script_dir = os.path.dirname(script_full_path)
        # Set environment to include current path and root path
        env = os.environ.copy()
        env['PYTHONPATH'] = os.pathsep.join([os.getcwd(), os.path.dirname(os.path.abspath(__file__)), script_dir])
        # Run the script in server mode (avoid --cli)
        process = subprocess.Popen(
            [sys.executable, "-u", script_full_path],
            cwd=script_dir,  # Set cwd to script's directory for .env and systemprompt.txt
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            env=env
        )
        logger.info(f"{server_name} started with PID: {process.pid}")
        # Thread to print output (uncommented to show server logs)
        def print_output():
            for line in process.stdout:
                logger.info(f"[{server_name}] {line.strip()}")
        threading.Thread(target=print_output, daemon=True).start()
        return process
    except Exception as e:
        logger.error(f"Error starting {server_name}: {str(e)}")
        return None

def start_servers():
    global learn_process, ask_process
    learn_process = start_server("LearnBE/Learn.py", LEARN_PORT, "Learn Server")
    ask_process = start_server("LlmBE/Ask.py", ASK_PORT, "Ask Server")
    
    # Wait for servers to start (simple delay)
    time.sleep(5)  # Adjust if needed
    logger.info("Servers started, waiting for requests...")

# def start_servers():
#     global learn_process, ask_process
#     learn_process = start_server("LearnBE/Learn.py", LEARN_PORT, "Learn Server")
#     ask_process = start_server("app.py", ASK_PORT, "Ask Server")  # Change to root app.py
#     time.sleep(5)  # Adjust if needed
#     logger.info("Servers started, waiting for requests...")

def cleanup_processes():
    global learn_process, ask_process
    for process, name in [
        (learn_process, "Learn Server"),
        (ask_process, "Ask Server")
    ]:
        if process:
            process.terminate()
            process.wait()  # Ensure process is fully terminated
            logger.info(f"Stopped {name}")

if __name__ == "__main__":
    atexit.register(cleanup_processes)
    start_servers()
    
    # Keep the main process alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        cleanup_processes()