import os

from dotenv import load_dotenv

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

from langchain_community.vectorstores import (
    FAISS
)

from langchain_google_genai import (
    ChatGoogleGenerativeAI
)

# LOAD ENV VARIABLES

load_dotenv()

# API KEY

google_api_key = os.getenv("GOOGLE_API_KEY")

# EMBEDDING MODEL

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# LOAD FAISS DATABASE

vectorstore = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

# RETRIEVER

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3}
)

# GEMINI MODEL

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=google_api_key
)

# MAIN RAG FUNCTION

def ask_rag(question):

    # RETRIEVE RELEVANT DOCS

    docs = retriever.invoke(question)

    # CREATE CONTEXT

    context = "\n".join([
        doc.page_content for doc in docs
    ])

    # PROMPT

    prompt = f"""
    You are a helpful AI assistant.

    Answer ONLY from the provided context.

    If the answer is not found,
    say:
    "I could not find that information."

    Context:
    {context}

    Question:
    {question}
    """

    # GET RESPONSE

    response = llm.invoke(prompt)

    return response.content