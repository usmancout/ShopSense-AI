# ShopSense AI — Smart Multi-Mart Price, Distance & Review Comparison Platform

**ShopSense AI** is a full-stack intelligent shopping comparison platform built with the **MERN Stack (MongoDB, Express.js, React + TypeScript, Node.js)**, **Hugging Face BERT (`@xenova/transformers`)**, and a **384-Dimensional RAG (Retrieval-Augmented Generation) + Vector Database Engine**.

It empowers shoppers to search products by exact name or natural conversational phrases across local marts (**Martello Downtown**, **Martello West**, **Prodexa Central**, and **Storenta Plaza**) and compare:
1. **Real-Time Mart Prices** (with original prices and discounts across 50+ products per mart and real-life product photography)
2. **Live Distance (`km`) & Drive Time (`mins`)** from the customer's location using the Haversine formula
3. **Customer Reviews Classified as `Genuine Review` or `Fake Review`** by a local **66M-parameter Hugging Face DistilBERT Transformer model** (`Xenova/distilbert-base-uncased-finetuned-sst-2-english`)
4. **ShopSense AI Shopping Assistant Chatbot (RAG + Vector DB)** that embeds mart products into 384-dimensional vectors in MongoDB (`ProductVector`) and `vector_store.json`, retrieves top matching items via Cosine Similarity, and displays interactive comparison cards

---

## Project Screenshots

### 1. Landing Page — Light Mode & Dark Mode (Slate & Emerald Theme)
ShopSense AI features a unified **Slate & Emerald** design system (`Plus Jakarta Sans` typography) with instant **Light Mode / Dark Mode** switching persisted in `localStorage`.

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Landing Page Light Mode](docs/screenshots/1-landing-light.png) | ![Landing Page Dark Mode](docs/screenshots/2-landing-dark.png) |

---

### 2. Product Catalog Browsing (50+ Products per Mart Across 6 Categories)
When customers browse the catalog without searching for a specific item, **ShopSense AI** displays clean product cards with real-life product photography, store filters, price range controls, and rating filters—without cluttering the screen with mart locations.

![Browse Product Catalog](docs/screenshots/3-browse-catalog.png)

---

### 3. Specific & Conversational Product Search — Side-by-Side Mart Comparison & Genuine/Fake Review Badges
When a customer searches for a specific product (e.g., `iPhone 16 Pro Max`), a conversational request (e.g., `I want Nike shoes and a shirt`), or clicks **`Compare Marts`**:
- **Only the marts where that product is actually in stock are shown** (some products are available at 1 mart, some at 2, 3, or all 4 marts).
- Each available mart row displays its **Price**, **Distance (`km`)** from the customer, and **Rating**.
- Clicking **`Customer Reviews`** opens the customer reviews for that mart, where each review carries a clear **`Genuine Review`** (green) or **`Fake Review`** (red) badge so the shopper can decide whether to prioritize a lower price, closer distance, or verified reviews.

![Side-by-Side Mart Comparison and Review Authenticity Badges](docs/screenshots/4-mart-comparison-reviews.png)

---

### 4. Conversational & Multi-Item Natural Language Search (`"I want Nike shoes and a shirt"`)
Customers can search using natural language sentences or multi-item requests (e.g., `"I want Nike shoes and a shirt"`). The search engine parses each item clause and displays all matching products with their available marts, live prices, and distances.

![Conversational Multi-Item Search](docs/screenshots/6-natural-language-search.png)

---

### 5. ShopSense AI Shopping Assistant Chatbot (RAG + Vector Database)
The floating **Ask ShopSense AI** assistant is accessible from the bottom-right corner of every page. Powered by a **384-Dimensional RAG + Vector Database pipeline**, it fetches product embeddings from the marts, computes Cosine Similarity against the customer's query (e.g., `"I want Nike shoes and a shirt"` or `"Best laptop under $1500"`), and renders clean interactive product cards showing the **Best Genuine Pick**, **Fake Review Alerts**, **`Compare Marts`**, and **`Directions`** links. When a customer says `"ok"` or `"thanks"`, the assistant asks *"Do you want something else?"* with **`Suggest Products`** and **`Leave`** buttons.

![ShopSense AI Shopping Assistant Chatbot](docs/screenshots/7-ai-chatbot.png)

---

### 6. About Page — Platform Overview & Architecture
![About ShopSense AI](docs/screenshots/5-about-page.png)

---

## How the Project Works (End-to-End Architecture)

```
+----------------------------------------------------------------------------+
|                        FRONTEND (React + TypeScript + Vite)                |
|  - Landing Page, Product Search, AI Chatbot, Dashboard, Wishlist, Auth     |
|  - Conversational multi-item search ("I want Nike shoes and a shirt")      |
|  - Calculates live GPS/Haversine distance (km) from user to each mart      |
|  - Shows normal cards on browse; shows available marts on product search   |
+---------------------------------------+------------------------------------+
                                        | REST API (Axios + Client Vector Fallback)
                                        v
+----------------------------------------------------------------------------+
|                     BACKEND (Node.js + Express + MongoDB)                  |
|  - GET  /api/products                  -> Search & filter catalog          |
|  - GET  /api/marts                     -> 4 Marts with GPS coordinates     |
|  - GET  /api/stores/:storeName/products-> Dedicated Mart APIs              |
|  - POST /api/reviews/analyze           -> Live BERT Review Classifier API  |
|  - POST /api/chat                      -> RAG + Vector DB Chatbot API      |
|  - GET  /api/products/vector-status    -> Vector DB telemetry & status     |
|  - POST /api/auth/forgot-password      -> Gmail SMTP Password Reset Email  |
+-------------------+-----------------------------------+--------------------+
                    |                                   |
                    v                                   v
+---------------------------------------+ +----------------------------------+
|   RAG + 384-D VECTOR DATABASE ENGINE  | | HUGGING FACE BERT ENGINE         |
|  - Model: shopsense-hybrid-384d-v1    | | (@xenova/transformers DistilBERT)|
|  - Indexes 80 mart products into      | | - Tokenizes customer reviews     |
|    MongoDB ProductVector collection   | | - Classifies each review as      |
|    and server/data/vector_store.json  | |   GENUINE or FAKE based on       |
|  - Cosine Similarity + Hybrid Lexical | |   sentiment & spam patterns      |
+---------------------------------------+ +----------------------------------+
```

### 1. Multi-Mart Catalog & Real-Life Product Photography (50+ Products per Mart)
The platform stocks **80 distinct products** across **6 categories** (*Electronics, Fashion, Home & Garden, Books, Sports, Beauty*) distributed across **4 marts in Lahore** so that every mart carries more than 50 products:
- **Martello Downtown** — *Johar Town Main Blvd, Lahore* (`31.4697, 74.2728`) — **56 products in stock**
- **Martello West** — *Wapda Town Roundabout, Lahore* (`31.4312, 74.2644`) — **52 products in stock**
- **Prodexa Central** — *MM Alam Road, Gulberg III, Lahore* (`31.5102, 74.3441`) — **60 products in stock**
- **Storenta Plaza** — *DHA Phase 5 Commercial, Lahore* (`31.4625, 74.4085`) — **55 products in stock**

Not every product is sold at every mart—some products are stocked at **1 mart**, some at **2 marts**, some at **3 marts**, and some at all **4 marts**. If a product is not available at a particular mart, that mart is automatically excluded from the comparison view. Every product is paired with a real-life high-resolution product photograph (`productImage.helper.js` and `src/data/products.ts`).

### 2. RAG (Retrieval-Augmented Generation) & 384-D Vector Database Chatbot
Located in `SSA-server/server/services/vectorDb.service.js`, `SSA-server/server/models/productVector.model.js`, and `src/components/ChatBot.tsx`:
1. **Mart Product Ingestion & Knowledge Chunking:** Fetches all 80 products and their mart offers across Martello Downtown, Martello West, Prodexa Central, and Storenta Plaza, constructing a structured RAG document for each product (including price range, available marts, best genuine mart pick, and fake review warnings).
2. **384-Dimensional Dense Embeddings (`shopsense-hybrid-384d-v1`):** Encodes each product into a 384-dimensional L2-normalized vector combining 60 domain concept dimensions with 324 signed unigram, bigram, and character 3-gram random projection dimensions.
3. **Vector Database Persistence:** Stores all 80 product vectors in the MongoDB `productvectors` collection (`ProductVector` model) and persists a local vector index snapshot at `SSA-server/server/data/vector_store.json`.
4. **Cosine Similarity Retrieval (`POST /api/chat`):** Decomposes single or multi-item user queries (e.g., `"I want Nike shoes and a shirt"` or `"Best laptop under $1500"`), embeds each query into the 384-D vector space, computes Cosine Similarity (`cosineSimilarity(queryVec, docVec)`) combined with hybrid lexical verification and budget filtering, and returns the matching product cards directly inside the chat window.
5. **Interactive Follow-Up Controls:** When a customer replies `"ok"`, `"thanks"`, or `"done"`, the assistant asks *"Do you want something else?"* and provides **`Suggest Products`** and **`Leave`** action buttons.

### 3. Real Hugging Face BERT Review Authenticity Classifier
Located in `SSA-server/server/services/bert.service.js`:
1. **Transformer Inference:** Uses `@xenova/transformers` to load `Xenova/distilbert-base-uncased-finetuned-sst-2-english` locally in Node.js (no external API key required).
2. **Contextual Sentiment & Softmax Confidence:** Each review is tokenized and passed through the BERT model to extract `bertSentiment` (`POSITIVE` / `NEGATIVE`) and `bertSentimentScore` (`0.000` – `1.000`).
3. **Authenticity Classification (`GENUINE` vs. `FAKE`):**
   - **Sentiment–Rating Contradiction:** Flags 5-star reviews where BERT detects strong `NEGATIVE` sentiment and complaint terminology, or 1-star reviews with positive hyperbole.
   - **Promotional Bot Hyperbole:** Flags reviews with extreme BERT positive scores paired with generic spam phrases (`"100% original"`, `"buy now"`, `"A++++"`, `"best product ever"`), excessive exclamation marks, and zero concrete buyer details.
   - **Verified Buyer Experience:** Reviews mentioning concrete product/store details (factory seal, serial verification, warranty card, checkout wait time, evening parking) are labeled `GENUINE`.
4. **Genuine Rating Adjustment:** Filters out `FAKE` reviews to compute each mart's true `genuineRating` so bot-inflated 5-star reviews cannot mislead shoppers.

### 4. Gmail SMTP Password Reset Flow
Located in `SSA-server/server/config/email.js`, `SSA-server/server/services/email.service.js`, and `src/components/ForgotPasswordModal.tsx`:
- Customers can request a password reset link from the Sign In page (`POST /api/auth/forgot-password`).
- `SSA-server` generates a signed 15-minute JWT reset token and dispatches an HTML password reset email via Gmail SMTP (`nodemailer`) directly to the customer's inbox.
- Clicking the link opens `/reset-password/:token` (`ResetPasswordPage.tsx`), updating the password in MongoDB (`POST /api/auth/reset-password/:token`).

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch & search products (supports conversational `?q=`, `?category=`, `?store=`, `?martId=`) |
| `GET` | `/api/marts` | Fetch all 4 mart locations with GPS coordinates (`lat`, `lng`) |
| `GET` | `/api/stores/:storeName/products` | Fetch products for a specific store (`martello`, `prodexa`, `storenta`) |
| `POST` | `/api/reviews/analyze` | Run live Hugging Face BERT classification on custom review text(s) |
| `POST` | `/api/chat` | RAG + 384-D Vector Database Conversational AI Assistant endpoint |
| `GET` | `/api/products/vector-status` | Inspect Vector DB indexing status, dimension (`384`), and total vectors (`80`) |
| `POST` | `/api/auth/signup` | Register a new customer account |
| `POST` | `/api/auth/login` | Authenticate customer and receive JWT token |
| `POST` | `/api/auth/forgot-password` | Send a password reset link email to the customer via Gmail SMTP |
| `POST` | `/api/auth/reset-password/:token` | Verify reset token and update customer password |
| `GET` | `/api/auth/dashboard` | Fetch personalized user dashboard, wishlist, search history & recommendations |

### Example: Test Live BERT Classification (`POST /api/reviews/analyze`)
```bash
curl -X POST http://localhost:5000/api/reviews/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "reviews": [
      {
        "user": "ShopBot_99",
        "rating": 5,
        "text": "Best product ever!!! 100% original buy now A++++!!"
      },
      {
        "user": "Ali R.",
        "rating": 5,
        "text": "Picked up from Gulberg branch. Factory sealed box and staff verified the warranty card at the counter."
      }
    ]
  }'
```

---

## Getting Started (Run Locally)

### 1. Clone the Repositories
```bash
# Clone Frontend
git clone https://github.com/usmancout/ShopSense-AI.git
cd ShopSense-AI

# Clone Backend inside the project (or in a separate folder)
git clone https://github.com/usmancout/SSA-server.git
```

### 2. Start the Backend Server (`SSA-server/server`)
```bash
cd SSA-server/server
npm install
```
Create a `.env` file in `SSA-server/server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopsenseai
JWT_SECRET=shopsense_super_secret_jwt_key_2025
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_google_app_password
```
*(Note: On startup, the backend automatically seeds all 80 products with real-life product photography, runs Hugging Face BERT review analysis, and indexes all 80 product embeddings into the 384-D Vector Database.)*

```bash
npm start
```

### 3. Start the Frontend Application
Open a new terminal in the root `ShopSense-AI` directory:
```bash
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Light & Dark Mode), Lucide Icons, React Router v6, Axios
- **Backend:** Node.js, Express.js, Mongoose / MongoDB, Nodemailer (Gmail SMTP), JSON Web Tokens (JWT), bcrypt
- **AI / NLP & Vector Search:** Hugging Face `@xenova/transformers` (`Xenova/distilbert-base-uncased-finetuned-sst-2-english` via ONNX Runtime) + 384-D RAG Vector Database (`ProductVector` in MongoDB & `vector_store.json`) with Cosine Similarity retrieval
- **Geolocation:** Browser Geolocation API + Haversine Distance Formula (`km` & estimated drive time)
