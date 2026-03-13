const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")
const pauseBtn = document.getElementById("pauseBtn")
const resumeBtn = document.getElementById("resumeBtn")

const voiceSelect = document.getElementById("voiceSelect")

const chatContainer = document.getElementById("chatContainer")

const grammarText = document.getElementById("grammarText")
const aiText = document.getElementById("aiText")

const pronounceBtn = document.getElementById("pronounceBtn")
const wordInput = document.getElementById("wordInput")

const sendBtn = document.getElementById("sendBtn")
const chatInput = document.getElementById("chatInput")

const clearChat = document.getElementById("clearChat")
const downloadChat = document.getElementById("downloadChat")

const darkMode = document.getElementById("darkMode")

const topicSelect = document.getElementById("topicSelect")

const timer = document.getElementById("timer")

const stopPracticeBtn = document.getElementById("stopPracticeBtn")

let sessionStartTime = Date.now()
let messageCount = 0
let wordCount = 0

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.lang = "en-US"

let voices = []


/* LOAD VOICES */

function loadVoices(){

voices = window.speechSynthesis.getVoices()

voiceSelect.innerHTML=""

voices.forEach((voice,index)=>{

let option=document.createElement("option")

option.value=index
option.textContent=voice.name

voiceSelect.appendChild(option)

})

}

window.speechSynthesis.onvoiceschanged = loadVoices



/* CHAT MESSAGE */

function addMessage(role,text){

const msg = document.createElement("div")

msg.classList.add("message")

if(role === "user"){
msg.classList.add("user")
}
else{
msg.classList.add("ai")
}

msg.innerText = text

chatContainer.appendChild(msg)

chatContainer.scrollTop = chatContainer.scrollHeight

saveChatHistory()

}



/* SAVE CHAT */

function saveChatHistory(){

localStorage.setItem("chatHistory", chatContainer.innerHTML)

}



/* LOAD CHAT + TIMER */

window.onload = ()=>{

let savedChat = localStorage.getItem("chatHistory")

if(savedChat){
chatContainer.innerHTML = savedChat
}

loadVoices()

const minutes = Math.floor(seconds / 60)
const sec = seconds % 60

timer.innerText =
String(minutes).padStart(2,"0") + ":" + String(sec).padStart(2,"0")

}



/* SEND MESSAGE TO AI */

async function sendToAI(text){

addMessage("user",text)

messageCount++

let words = text.trim().split(/\s+/).length
wordCount += words

const topic = topicSelect.value

const response = await fetch("/chat",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({text:text,topic:topic})

})

const data = await response.json()

const reply = data.reply

const parts = reply.split("AI Response:")

if(parts.length>1){

grammarText.innerText = parts[0]

aiText.innerText = parts[1]

addMessage("ai",parts[0]+"\n\n"+parts[1])

speak(parts[1])

}
else{

aiText.innerText = reply

addMessage("ai",reply)

speak(reply)

}

}





/* SEND BUTTON */

sendBtn.addEventListener("click", sendMessage)

function sendMessage(){

let text = chatInput.value.trim()

if(text === ""){
alert("Please type a message")
return
}

chatInput.value = ""

sendToAI(text)

}

/* SEND WITH ENTER KEY */

if(chatInput){

chatInput.addEventListener("keydown", function(event){

if(event.key === "Enter"){

event.preventDefault()

sendBtn.click()

}

})

}



/* SPEECH RECOGNITION */

recognition.onresult = function(event){

const text = event.results[0][0].transcript

sendToAI(text)

}

startBtn.onclick = ()=> recognition.start()

stopBtn.onclick = ()=> recognition.stop()



/* SPEECH SYNTHESIS */

pauseBtn.onclick = ()=> window.speechSynthesis.pause()

resumeBtn.onclick = ()=> window.speechSynthesis.resume()



function speak(text){

const speech = new SpeechSynthesisUtterance(text)

const voiceIndex = voiceSelect.value

if(voices[voiceIndex]) speech.voice = voices[voiceIndex]

speech.rate = 1.2

window.speechSynthesis.speak(speech)

}



/* WORD PRONOUNCE */

pronounceBtn.onclick = ()=>{

const word = wordInput.value

if(word==="") return

speak(word)

}



/* CLEAR CHAT */

clearChat.onclick = ()=>{

localStorage.removeItem("chatHistory")

chatContainer.innerHTML=""

}



/* DOWNLOAD CHAT */

downloadChat.onclick = ()=>{

let text = chatContainer.innerText

let blob = new Blob([text],{type:"text/plain"})

let link = document.createElement("a")

link.href = URL.createObjectURL(blob)

link.download = "conversation.txt"

link.click()

}



/* DARK MODE */

if(darkMode){
darkMode.onclick = ()=>{
document.body.classList.toggle("dark-mode")
}
}



/* SESSION TIMER */

let seconds = 0
let timerInterval = null

function updateTimer(){

seconds++

const minutes = Math.floor(seconds / 60)
const sec = seconds % 60

timer.innerText =
String(minutes).padStart(2,"0") + ":" + String(sec).padStart(2,"0")

}

/* START TIMER WHEN PAGE LOADS */

window.onload = ()=>{

loadVoices()

timer.innerText = "00:00"

timerInterval = setInterval(updateTimer,1000)

let savedChat = localStorage.getItem("chatHistory")

if(savedChat){
chatContainer.innerHTML = savedChat
}

}

stopPracticeBtn.onclick = () => {

let sessionEndTime = Date.now()

let durationSeconds = Math.floor((sessionEndTime - sessionStartTime) / 1000)

let minutes = Math.floor(durationSeconds / 60)
let seconds = durationSeconds % 60

let avgWords = messageCount > 0 ? Math.round(wordCount / messageCount) : 0

let topic = topicSelect.value || "General Conversation"

let report = `
SESSION REPORT

Topic: ${topic}

Practice Time: ${minutes} min ${seconds} sec

Messages Sent: ${messageCount}

Words Spoken: ${wordCount}

Average Words per Message: ${avgWords}
`

alert(report)

}