import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai.errors import APIError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key="AIzaSyBrfahMNA2dZvSu9wf-QsoZb89FPJPOS9M") 

MODEL_NAME = "gemini-2.5-flash"

class ChatRequest(BaseModel):
    message: str

chat_session = client.chats.create(model=MODEL_NAME)

@app.post("/chat")
async def chat_api(req: ChatRequest):
    try:
        response = chat_session.send_message(req.message)
        return {"response": response.text}

    except APIError as e:
        return {"response": f"API Error: {str(e)}"}

    except Exception as e:
        return {"response": f"Unknown Error: {str(e)}"}
