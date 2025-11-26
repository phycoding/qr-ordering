# Bing Image Search API Integration

This project uses Bing Image Search API to fetch real food images for menu items.

## Setup Instructions

### 1. Get Bing Image Search API Key

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new **Cognitive Services** resource
3. Select **Bing Search v7** API
4. Choose the **Free tier** (F1) - 3 calls per second, 1000 calls per month
5. Copy your API key from the **Keys and Endpoint** section

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your Bing API key:
   ```
   BING_SEARCH_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Fetch Images

Run the Bing image fetcher script:

```bash
python backend/fetch_bing_images.py
```

This will:
- Search for real food images using Bing Image Search API
- Update all 150 menu items with actual food photos
- Use fallback images if API key is not configured
- Rate limit to 3 requests per second (Bing API limit)

## Fallback Behavior

If no API key is provided, the script will automatically use Lorem Picsum placeholder images instead. This ensures the application works even without the Bing API subscription.

## API Limits

**Free Tier (F1):**
- 3 calls per second
- 1,000 calls per month
- Perfect for initial setup and testing

**Paid Tier (S1):**
- 10 calls per second
- Pay per transaction
- For production use with frequent updates

## Cost Estimate

- **Free tier**: $0 (1000 calls/month)
- **Paid tier**: ~$7 per 1000 transactions

For 150 menu items, you'll use 150 API calls once during setup.
