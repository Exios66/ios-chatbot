import os
import json
import logging
from typing import Dict, Any
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from llamaapi import LlamaAPI
import requests
import time

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

class WeatherAPI:
    def __init__(self):
        self.llama = LlamaAPI(os.getenv("LLAMA_API_TOKEN"))
        self.retry_attempts = 3
        self.retry_delay = 2

    def get_weather(self, location: str, days: int, unit: str = "celsius") -> Dict[str, Any]:
        api_request_json = {
            "model": "llama3.1-8b",
            "messages": [
                {"role": "user", "content": f"What is the weather like in {location} for the next {days} days?"},
            ],
            "functions": [
                {
                    "name": "get_current_weather",
                    "description": "Get the current weather and forecast for a given location",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA",
                            },
                            "days": {
                                "type": "number",
                                "description": "Number of days for the forecast",
                            },
                            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                        },
                    },
                    "required": ["location", "days"],
                }
            ],
            "stream": False,
            "function_call": "get_current_weather",
        }

        for attempt in range(self.retry_attempts):
            try:
                response = self.llama.run(api_request_json)
                response.raise_for_status()
                return response.json()
            except requests.exceptions.RequestException as e:
                logger.warning(f"API request failed (attempt {attempt + 1}/{self.retry_attempts}): {str(e)}")
                if attempt < self.retry_attempts - 1:
                    time.sleep(self.retry_delay)
                else:
                    logger.error("Max retry attempts reached. Unable to fetch weather data.")
                    raise

    def parse_weather_data(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            function_call = weather_data.get("choices", [{}])[0].get("function_call", {})
            if function_call.get("name") == "get_current_weather":
                weather_info = json.loads(function_call.get("arguments", "{}"))
                return {
                    "location": weather_info.get("location"),
                    "current_temp": weather_info.get("current_temperature"),
                    "conditions": weather_info.get("current_conditions"),
                    "forecast": weather_info.get("forecast", [])
                }
            else:
                logger.error("Unexpected response format from Llama API")
                return {}
        except json.JSONDecodeError:
            logger.error("Failed to parse weather data")
            return {}

weather_api = WeatherAPI()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    
    # Check if the user is asking about weather
    if "weather" in user_message.lower():
        # Extract location and days from the user message (you might want to use NLP for better extraction)
        location = "New York"  # Default location
        days = 3  # Default number of days
        unit = "celsius"  # Default unit
        
        # Try to extract location from the message
        location_keywords = ["in", "at", "for"]
        for keyword in location_keywords:
            if keyword in user_message.lower():
                location = user_message.lower().split(keyword)[1].strip().split()[0]
                break
        
        try:
            weather_data = weather_api.get_weather(location, days, unit)
            parsed_data = weather_api.parse_weather_data(weather_data)
            
            if parsed_data:
                response = f"Weather in {parsed_data['location']}:\n"
                response += f"Current Temperature: {parsed_data['current_temp']}\n"
                response += f"Conditions: {parsed_data['conditions']}\n\n"
                response += "Forecast:\n"
                for day in parsed_data['forecast']:
                    response += f"  {day['date']}: High {day['high']}, Low {day['low']}, {day['conditions']}\n"
            else:
                response = "I'm sorry, I couldn't retrieve the weather information at the moment."
        except Exception as e:
            logger.error(f"Error fetching weather data: {str(e)}")
            response = "I'm sorry, there was an error fetching the weather data. Please try again later."
    else:
        # Handle other types of messages here
        response = "I'm a weather chatbot. You can ask me about the weather in any location!"

    return jsonify({'message': response})

if __name__ == '__main__':
    app.run(debug=True)