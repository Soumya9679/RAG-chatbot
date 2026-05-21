import os

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

from langchain_community.vectorstores import (
    FAISS
)

from langchain_google_genai import (
    ChatGoogleGenerativeAI
)

# API KEY

os.environ["GOOGLE_API_KEY"] = "AIzaSyDjNd-ffQWUQlNk_V54SUTsIvgwM8MzTCk"

# EMBEDDING MODEL

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# LOAD VECTOR DB

vectorstore = FAISS.load_local(
    "faiss_index",
    embeddings,
    allow_dangerous_deserialization=True
)

# RETRIEVER

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3}
)

# LLM

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)

# MAIN FUNCTION

def ask_rag(question):

    # RETRIEVE DOCUMENTS

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

    # LLM RESPONSE

    response = llm.invoke(prompt)

    return response.content