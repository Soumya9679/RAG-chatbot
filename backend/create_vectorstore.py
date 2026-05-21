import pandas as pd

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_huggingface import (
    HuggingFaceEmbeddings
)

from langchain_community.vectorstores import (
    FAISS
)

# LOAD CSV

df = pd.read_csv("data/data.csv")

# CONVERT ROWS TO DOCUMENTS

documents = []

for index, row in df.iterrows():

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

# EMBEDDINGS

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# CREATE VECTOR STORE

vectorstore = FAISS.from_documents(
    chunks,
    embeddings
)

# SAVE LOCALLY

vectorstore.save_local("faiss_index")

print("FAISS index created successfully")