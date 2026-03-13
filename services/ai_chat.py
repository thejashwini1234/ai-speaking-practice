import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ai_response(chat_history):

    messages = [
        {
            "role": "system",
            "content": """You are an English speaking practice assistant.

For every user sentence:
1. Provide the corrected sentence.
2. Explain the grammar mistake briefly.
3. Continue the conversation naturally.

Respond in this format:

Correction:
<correct sentence>

Explanation:
<short explanation>

AI Response:
<continue conversation>"""
        }
    ]

    messages.extend(chat_history)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages
    )

    return response.choices[0].message.content