# Document Retrieval Improvements

## Problem
The RAG system was only retrieving **3 document chunks** per query, which meant:
- If the answer was in chunk 4, 5, or later, it wouldn't be found
- Small chunk size (1000 chars) meant less context per chunk
- No diversity in retrieval - could get 3 very similar chunks

## Solution: Enhanced Retrieval Strategy

### 1. **Increased Document Retrieval**
- **Before:** 3 chunks per query
- **After:** 8 chunks per query
- **Impact:** 2.6x more document coverage per query

### 2. **Larger Chunks with Better Overlap**
- **Before:** 1000 chars per chunk, 200 overlap
- **After:** 1500 chars per chunk, 300 overlap
- **Impact:** 50% more context per chunk, better context preservation across boundaries

### 3. **MMR (Maximum Marginal Relevance) Search**
- **Before:** Simple similarity search (could return 8 very similar chunks)
- **After:** MMR search with diversity parameter
- **Impact:** Gets diverse, relevant chunks instead of redundant ones
- **Settings:**
  - `fetch_k`: Fetches 20 candidates, then selects 8 diverse ones
  - `lambda_mult`: 0.7 (balances relevance 70% and diversity 30%)

### 4. **Increased Context Budget**
- **Before:** 2000 chars max per chunk, 1000 tokens max response
- **After:** 3000 chars max per chunk, 1500 tokens max response
- **Impact:** More complete answers with better context

## How RAG Works (Important to Understand)

**RAG does NOT read the entire document at once.** Instead:

1. **Document Ingestion:**
   - PDF is split into chunks (1500 chars each)
   - Each chunk is embedded (converted to vector)
   - Chunks stored in vector database

2. **Query Processing:**
   - Your question is embedded (converted to vector)
   - Vector search finds most similar chunks (8 chunks)
   - Only those 8 chunks are sent to LLM

3. **Why This Works:**
   - Semantic search finds relevant sections even if keywords don't match
   - Only relevant parts are sent to LLM (saves tokens)
   - Can handle large documents efficiently

4. **Limitations:**
   - If answer is in chunk 9, 10, etc., it won't be found
   - That's why we increased from 3 to 8 chunks
   - MMR ensures those 8 chunks are diverse and cover different sections

## Current Settings

```python
max_retrieved_docs: 8        # Number of chunks retrieved per query
chunk_size: 1500              # Characters per chunk
chunk_overlap: 300            # Overlap between chunks
max_context_length: 3000      # Max chars per chunk in context
max_tokens: 1500              # Max response tokens
```

## For Even Better Coverage

If you need even more coverage, you can adjust in `.env`:

```env
MAX_RETRIEVED_DOCS=12         # More chunks (uses more tokens)
CHUNK_SIZE=2000               # Larger chunks (more context per chunk)
CHUNK_OVERLAP=400             # More overlap (better context preservation)
```

## Trade-offs

- **More chunks** = Better coverage but more tokens
- **Larger chunks** = More context but less granular search
- **More overlap** = Better context preservation but more storage

The current settings (8 chunks, 1500 chars) provide a good balance between coverage and token efficiency.

