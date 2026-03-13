from flask import Flask, render_template, request, jsonify, session
from services.ai_chat import get_ai_response
import os

app = Flask(__name__)
app.secret_key = "secret123"


@app.route("/")
def home():

    if "chat_history" not in session:
        session["chat_history"] = []

    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    user_text = data.get("text", "")
    topic = data.get("topic", "")

    chat_history = session.get("chat_history", [])

    if topic and len(chat_history) == 0:
        chat_history.append({
            "role": "system",
            "content": f"You are an English speaking practice assistant. The conversation topic is: {topic}. Ask relevant questions and help improve grammar."
        })

    chat_history.append({
        "role": "user",
        "content": user_text
    })

    ai_reply = get_ai_response(chat_history)

    chat_history.append({
        "role": "assistant",
        "content": ai_reply
    })

    session["chat_history"] = chat_history

    return jsonify({"reply": ai_reply})


@app.route("/clear_chat", methods=["POST"])
def clear_chat():

    session["chat_history"] = []

    return jsonify({"status": "chat cleared"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))