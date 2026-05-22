# RAG Chatbot

An enterprise-grade, locally-hosted Retrieval-Augmented Generation (RAG) chatbot workspace. This system retrieves context from a local vector database to answer queries using a local LLM, paired with a modern, fully-responsive dashboard interface.

---

## Project Structure

```
├── backend/            # FastAPI RAG Server
│   ├── app.py          # FastAPI Endpoints (CORS enabled)
│   ├── rag.py          # RAG pipeline logic (LangChain, Ollama, FAISS)
│   ├── requirements.txt
│   └── faiss_index/    # Local vectorstore database index
└── frontend/           # React + Vite Client Dashboard
    ├── src/
    │   ├── components/
    │   │   ├── ChatBox.jsx   # Interactive workspace layout & model sliders
    │   │   └── Message.jsx   # Glassmorphic chat bubbles & copy actions
    │   ├── index.css         # Tailwind v4 entry point & markdown styling
    │   └── main.jsx
    └── package.json
```

---

## Technology Stack

### Backend
- **Core Server**: FastAPI
- **LLM Orchestration**: LangChain Community & LangChain Ollama
- **Local Model**: Ollama (`qwen2.5:1.5b`)
- **Embeddings**: HuggingFace Sentence-Transformers (`all-MiniLM-L6-v2`)
- **Vector Database**: FAISS (Facebook AI Similarity Search)

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Markdown Handling**: React Markdown

---

## Setup and Running

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Ollama**: Download and install [Ollama](https://ollama.com).

### 2. Running the Backend
1. Open Ollama and pull the model:
   ```bash
   ollama pull qwen2.5:1.5b
   ```
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

### 3. Running the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Build the static production bundle:
   ```bash
   npm run build
   ```
