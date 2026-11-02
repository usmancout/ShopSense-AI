# ShopSense AI — Smart Multi-Mart Price, Distance & Review Comparison Platform

**ShopSense AI** is a full-stack intelligent shopping comparison platform built with the **MERN Stack (MongoDB, Express.js, React + TypeScript, Node.js)** and **Hugging Face BERT (`@xenova/transformers`)**.

It empowers shoppers to search any product across local marts (**Martello Downtown**, **Martello West**, **Prodexa Central**, and **Storenta Plaza**) and compare:
1. **Real-Time Mart Prices** (with original prices and discounts)
2. **Live Distance (`km`) & Drive Time (`mins`)** from the customer's location using the Haversine formula
3. **Customer Reviews Classified as `Genuine Review` or `Fake Review`** by a local **66M-parameter Hugging Face DistilBERT Transformer model** (`Xenova/distilbert-base-uncased-finetuned-sst-2-english`)

---

## Project Screenshots

### 1. Landing Page — Light Mode & Dark Mode (Slate & Emerald Theme)
ShopSense AI features a unified **Slate & Emerald** design system (`Plus Jakarta Sans` typography) with instant **Light Mode / Dark Mode** switching persisted in `localStorage`.

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Landing Page Light Mode](docs/screenshots/1-landing-light.png) | ![Landing Page Dark Mode](docs/screenshots/2-landing-dark.png) |

---

### 2. Product Catalog Browsing (50 Products Across 6 Categories)
When customers browse the catalog without searching for a specific item, **ShopSense AI** displays clean, standard product cards with category, store, price, and rating filters—without cluttering the screen with mart locations.

![Browse Product Catalog](docs/screenshots/3-browse-catalog.png)

---

### 3. Specific Product Search — Side-by-Side Mart Comparison & Genuine/Fake Review Badges
When a customer searches for a specific product (e.g., `iPhone 16 Pro Max`) or clicks **`Compare Marts`**:
- **Only the marts where that product is actually in stock are shown** (some products are available at 1 mart, some at 2, 3, or all 4 marts).
- Each available mart card displays its **Price**, **Distance (`km`)** from the customer, and **Rating**.
- Clicking **`View Reviews`** opens the customer reviews for that mart, where each review carries a clear **`Genuine Review`** (green) or **`Fake Review`** (red) badge so the shopper can decide for themselves whether to prioritize a lower price, closer distance, or better reviews.

![Side-by-Side Mart Comparison and Review Authenticity Badges](docs/screenshots/4-mart-comparison-reviews.png)

---

### 4. About Page — Platform Overview & Architecture
![About ShopSense AI](docs/screenshots/5-about-page.png)

---

## How the Project Works (End-to-End Architecture)

```
+----------------------------------------------------------------------------+
|                        FRONTEND (React + TypeScript + Vite)                |
|  - Landing Page, Product Search, Dashboard, Wishlist, Auth, Light/Dark UI  |
|  - Calculates live GPS/Haversine distance (km) from user to each mart      |
|  - Shows normal cards on browse; shows available marts on product search   |
+---------------------------------------+------------------------------------+
                                        | REST API (Axios)
                                        v
+----------------------------------------------------------------------------+
|                     BACKEND (Node.js + Express + MongoDB)                  |
|  - GET  /api/products                  -> Search & filter 50 products      |
|  - GET  /api/marts                     -> 4 Marts with GPS coordinates     |
|  - GET  /api/stores/:storeName/products-> Dedicated Mart APIs              |
|  - POST /api/reviews/analyze           -> Live BERT Review Classifier API  |
+---------------------------------------+------------------------------------+
                                        | ONNX Runtime (Local Inference)
                                        v
+----------------------------------------------------------------------------+
|        HUGGING FACE BERT ENGINE (@xenova/transformers — DistilBERT)        |
|  - Model: Xenova/distilbert-base-uncased-finetuned-sst-2-english           |
|  - Tokenizes customer reviews with WordPiece & runs 6-layer Transformer    |
|  - Combines BERT sentiment probability + rating-sentiment consistency      |
|    + promotional spam detection to label reviews GENUINE or FAKE           |
+----------------------------------------------------------------------------+
```

### 1. Multi-Mart Catalog & Varied Stock Availability (50 Products, 4 Marts)
The backend seeds **50 products** across **6 categories** (*Electronics, Fashion, Home & Garden, Books, Sports, Beauty*) distributed across **4 marts in Lahore**:
- **Martello Downtown** — *Johar Town Main Blvd, Lahore* (`31.4697, 74.2728`)
- **Martello West** — *Wapda Town Roundabout, Lahore* (`31.4312, 74.2644`)
- **Prodexa Central** — *MM Alam Road, Gulberg III, Lahore* (`31.5102, 74.3441`)
- **Storenta Plaza** — *DHA Phase 5 Commercial, Lahore* (`31.4625, 74.4085`)

Not every product is sold at every mart—some products are stocked at **1 mart**, some at **2 marts**, some at **3 marts**, and some at all **4 marts**. If a product is not available at a particular mart, that mart is automatically excluded from the comparison view.

### 2. Real Hugging Face BERT Review Authenticity Classifier
Located in `SSA-server/server/services/bert.service.js`:
1. **Transformer Inference:** Uses `@xenova/transformers` to load `Xenova/distilbert-base-uncased-finetuned-sst-2-english` locally in Node.js (no external API key required).
2. **Contextual Sentiment & Softmax Confidence:** Each review is tokenized and passed through the BERT model to extract `bertSentiment` (`POSITIVE` / `NEGATIVE`) and `bertSentimentScore` (`0.000` – `1.000`).
3. **Authenticity Classification (`GENUINE` vs. `FAKE`):**
   - **Sentiment–Rating Contradiction:** Flags 5-star reviews where BERT detects strong `NEGATIVE` sentiment and complaint terminology, or 1-star reviews with positive hyperbole.
   - **Promotional Bot Hyperbole:** Flags reviews with extreme BERT positive scores paired with generic spam phrases (`"100% original"`, `"buy now"`, `"A++++"`, `"best product ever"`), excessive exclamation marks, and zero concrete buyer details.
   - **Verified Buyer Experience:** Reviews mentioning concrete product/store details (factory seal, serial verification, warranty card, checkout wait time, evening parking) are labeled `GENUINE`.
4. **Genuine Rating Adjustment:** Filters out `FAKE` reviews to compute each mart's true `genuineRating` so bot-inflated 5-star reviews cannot mislead shoppers.

### 3. Customer-Driven Decision Making (No Biased Pre-Selection)
ShopSense AI never pre-selects a mart or pushes biased badges like *"Lowest Price"* or *"Best Choice"*. Instead, it gives the customer transparent data—**Price**, **Distance (`km`)**, **Rating**, and **Genuine/Fake Review badges**—so a customer who wants the lowest price even with lower reviews, or the closest mart to their home, can choose freely.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all 50 products (supports `?q=`, `?category=`, `?store=`, `?martId=`) |
| `GET` | `/api/marts` | Fetch all 4 mart locations with GPS coordinates (`lat`, `lng`) |
| `GET` | `/api/stores/:storeName/products` | Fetch products for a specific store (`martello`, `prodexa`, `storenta`) |
| `POST` | `/api/reviews/analyze` | Run live Hugging Face BERT classification on custom review text(s) |
| `POST` | `/api/auth/signup` | Register a new user account |
| `POST` | `/api/auth/signin` | Authenticate user and receive JWT token |
| `GET` | `/api/user/dashboard` | Fetch personalized user dashboard, wishlist, search history & AI recommendations |

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
MONGODB_URI=mongodb://127.0.0.1:27017/shopsenseai
JWT_SECRET=shopsense_super_secret_jwt_key_2025
FRONTEND_URL=http://localhost:5173
```
*(Note: If local MongoDB is not running, the backend automatically starts an in-memory MongoDB server and seeds all 50 products with BERT review analysis.)*

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
- **Backend:** Node.js, Express.js, Mongoose / MongoDB, JSON Web Tokens (JWT), bcrypt
- **AI / NLP:** Hugging Face `@xenova/transformers` (`Xenova/distilbert-base-uncased-finetuned-sst-2-english` via ONNX Runtime)
- **Geolocation:** Browser Geolocation API + Haversine Distance Formula (`km` & estimated drive time)
