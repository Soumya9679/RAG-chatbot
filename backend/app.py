from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from pydantic import BaseModel

from rag import ask_rag

# FASTAPI APP

app = FastAPI()

# ENABLE CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST MODEL

class Query(BaseModel):
    question: str

# CHAT ENDPOINT

@app.post("/chat")

def chat(query: Query):

    answer = ask_rag(query.question)

    return {
        "answer": answer
    }