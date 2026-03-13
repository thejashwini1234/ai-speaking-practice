AI Speaking Practice Web Application
Overview

AI Speaking Practice is a web application designed to help users improve their English speaking skills through interactive conversations with an AI assistant. Users can select a conversation topic and practice speaking while the system provides AI-generated responses to continue the conversation and help improve grammar and fluency.

The application uses Flask for the backend, JavaScript for the frontend, and the Groq API to generate AI responses.

Features

Topic-based English speaking practice

Interactive AI conversation assistant

Real-time chat interface

AI-generated responses using Groq API

Session-based chat history

Option to clear conversation and start a new practice session

Technologies Used

Python

Flask

HTML

CSS

JavaScript

Groq API

Web Speech API

Project Structure

AI-SPEAKING-PRACTICE

│

├── app.py

├── requirements.txt

├── services

│   └── ai_chat.py

│

├── static

│   ├── script.js

│   └── style.css

│

└── templates
    └── index.html
Installation and Setup
1. Clone the repository
git clone https://github.com/thejashwini1234/ai-speaking-practice.git
2. Navigate to the project folder
cd ai-speaking-practice
3. Install dependencies
pip install -r requirements.txt
4. Create a .env file

Add your Groq API key in a .env file.

GROQ_API_KEY=your_api_key_here
SECRET_KEY=your_secret_key

5. Run the application
python app.py

6. Open in browser
http://127.0.0.1:5000

How It Works

The user selects a conversation topic.

The user sends a message through the chat interface.

The message is sent to the Flask backend.

The backend sends the conversation history to the Groq API.

The AI generates a response and continues the conversation.

The conversation history is stored in the session.
