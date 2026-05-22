import os
import pandas as pd

from dotenv import load_dotenv

# from langchain_google_genai import (
#     GoogleGenerativeAIEmbeddings
# )

from langchain_community.vectorstores import (
    FAISS
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

# LOAD ENV

load_dotenv()

# LOAD API KEY

google_api_key = os.getenv("GOOGLE_API_KEY")

# LOAD CSV

df = pd.read_csv("data/data.csv")

# CONVERT ROWS TO TEXT

documents = []

for _, row in df.iterrows():

    text = ""

    for column in df.columns:

        text += f"{column}: {row[column]}\n"

    documents.append(text)

# CHUNKING

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = splitter.create_documents(documents)

# GEMINI EMBEDDINGS


from langchain_huggingface import (
    HuggingFaceEmbeddings
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# CREATE VECTOR STORE

vectorstore = FAISS.from_documents(
    chunks,
    embeddings
)

# SAVE

vectorstore.save_local("faiss_index")

print("FAISS index created successfully")