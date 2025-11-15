# Token Usage Optimization Guide

This application is optimized to minimize OpenAI token consumption while maintaining quality responses.

## Current Optimizations

### 1. **Limited Document Retrieval**
- **Default**: Retrieves only **3 most relevant chunks** (instead of 5)
- **Impact**: Reduces context tokens by ~40%
- **Configurable**: Set `MAX_RETRIEVED_DOCS` in `.env`

### 2. **Truncated Document Chunks**
- **Default**: Max 2000 characters per chunk
- **Impact**: Prevents extremely long documents from consuming tokens
- **Configurable**: Set `MAX_CONTEXT_LENGTH` in `.env`

### 3. **Limited Chat History**
- **Default**: Keeps only **last 6 messages** (3 exchanges)
- **Impact**: Older context doesn't consume tokens
- **Configurable**: Set `MAX_CHAT_HISTORY_MESSAGES` in `.env`

### 4. **Response Token Limit**
- **Default**: Max 1000 tokens per response
- **Impact**: Prevents extremely long responses
- **Configurable**: Set `MAX_TOKENS` in `.env`

### 5. **Efficient Model Usage**
- Uses `gpt-4o` by default (good balance of cost/quality)
- Consider using `gpt-4o-mini` for even lower costs

## Estimated Token Usage Per Query

**Typical query breakdown:**
- System prompt: ~150 tokens
- Context (3 chunks × 2000 chars): ~1500 tokens
- Chat history (6 messages): ~300 tokens
- User question: ~50 tokens
- **Total Input**: ~2000 tokens
- **Output**: ~500-1000 tokens
- **Total per query**: ~2500-3000 tokens

**Cost estimate (gpt-4o):**
- Input: $0.005 per 1K tokens
- Output: $0.015 per 1K tokens
- **Per query**: ~$0.02-0.03

## Further Optimization Options

### Option 1: Use Cheaper Model
Edit `.env`:
```
OPENAI_MODEL_NAME=gpt-4o-mini
```
- **Savings**: ~70% cost reduction
- **Trade-off**: Slightly lower quality

### Option 2: Reduce Retrieved Documents
Edit `.env`:
```
MAX_RETRIEVED_DOCS=2
```
- **Savings**: ~33% fewer context tokens
- **Trade-off**: May miss relevant information

### Option 3: Shorter Context
Edit `.env`:
```
MAX_CONTEXT_LENGTH=1500
```
- **Savings**: ~25% fewer context tokens
- **Trade-off**: Less context per document

### Option 4: Less Chat History
Edit `.env`:
```
MAX_CHAT_HISTORY_MESSAGES=4
```
- **Savings**: ~33% fewer history tokens
- **Trade-off**: Less conversational context

## Monitoring Token Usage

The application doesn't currently track token usage, but you can:
1. Monitor usage in OpenAI dashboard
2. Add logging to track tokens per request
3. Set up billing alerts in OpenAI

## Best Practices

1. **Ask specific questions** - More specific = less context needed
2. **Upload focused documents** - Smaller, relevant PDFs use fewer tokens
3. **Start new sessions** - Old chat history accumulates tokens
4. **Use gpt-4o-mini** - For non-critical queries, saves 70% cost

## Configuration

Add these to your `.env` file for fine-tuning:

```env
# Token optimization settings
MAX_RETRIEVED_DOCS=3          # Number of document chunks (2-5 recommended)
MAX_CHAT_HISTORY_MESSAGES=6   # Chat history messages (4-10 recommended)
MAX_CONTEXT_LENGTH=2000       # Max chars per chunk (1500-3000 recommended)
MAX_TOKENS=1000               # Max response tokens (500-2000 recommended)
```

## Cost Comparison

| Model | Input Cost | Output Cost | Est. per Query |
|-------|-----------|-------------|----------------|
| gpt-4o | $0.005/1K | $0.015/1K | ~$0.02-0.03 |
| gpt-4o-mini | $0.15/1M | $0.60/1M | ~$0.001-0.002 |

**Recommendation**: Use `gpt-4o-mini` for most queries to save ~90% on costs!

