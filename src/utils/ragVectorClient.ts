import { Product, mockProducts } from '../data/products';

export const EMBEDDING_DIM = 384;
export const EMBEDDING_MODEL_ID = 'shopsense-hybrid-384d-v1';

const SEMANTIC_CONCEPTS: string[][] = [
  ['smartphone', 'phone', 'phones', 'mobile', 'iphone', 'galaxy', 'pixel', 'oneplus', 'xiaomi', 'android', '5g', 'cellular'],
  ['laptop', 'laptops', 'notebook', 'macbook', 'xps', 'zephyrus', 'spectre', 'ultrabook', 'computer', 'pc'],
  ['tv', 'television', 'qled', 'oled', 'smart-tv', 'screen', 'display', '4k', 'uhd'],
  ['earbuds', 'earphones', 'airpods', 'buds', 'in-ear', 'tws'],
  ['headphones', 'headset', 'wh-1000xm5', 'quietcomfort', 'over-ear', 'noise-canceling', 'anc'],
  ['console', 'playstation', 'ps5', 'xbox', 'nintendo', 'switch', 'gaming', 'video-game'],
  ['tablet', 'ipad', 'stylus', 'touchscreen'],
  ['camera', 'dslr', 'mirrorless', 'canon', 'leica', 'photography', 'lens'],
  ['mouse', 'logitech', 'mx-master', 'cursor', 'trackpad'],
  ['keyboard', 'keychron', 'mechanical', 'switches', 'typing'],
  ['shoes', 'shoe', 'sneakers', 'sneaker', 'footwear', 'jordan', 'pegasus', 'air-force', 'ultraboost', '990v6', 'velocity'],
  ['shirt', 'shirts', 't-shirt', 'tshirt', 'polo', 'top', 'crewneck', 'oxford', 'button-down', 'dri-fit'],
  ['jeans', 'denim', 'pants', 'trousers', '511', 'levis'],
  ['jacket', 'coat', 'puffer', 'nuptse', 'trucker', 'sherpa', 'outerwear', 'winter'],
  ['sunglasses', 'glasses', 'shades', 'eyewear', 'aviator', 'holbrook', 'polarized', 'ray-ban', 'oakley'],
  ['watch', 'wristwatch', 'smartwatch', 'chronograph', 'automatic', 'tissot', 'fossil', 'garmin'],
  ['bag', 'tote', 'handbag', 'purse', 'duffel', 'backpack', 'luggage'],
  ['cooker', 'instant-pot', 'pressure-cooker', 'slow-cooker', 'rice-maker'],
  ['vacuum', 'dyson', 'roomba', 'irobot', 'cleaner', 'suction', 'cordless'],
  ['coffee', 'espresso', 'breville', 'nespresso', 'barista', 'latte', 'cappuccino'],
  ['airfryer', 'air-fryer', 'ninja', 'fryer', 'roast'],
  ['mixer', 'kitchenaid', 'baking', 'dough', 'stand-mixer'],
  ['bulb', 'hue', 'lighting', 'lamp', 'led', 'ambiance', 'smart-bulb'],
  ['chair', 'ergonomic', 'office-chair', 'lumbar', 'mesh-chair', 'desk-chair', 'furniture'],
  ['blender', 'vitamix', 'smoothie', 'juicer'],
  ['purifier', 'air-purifier', 'hepa', 'levoit', 'filtration'],
  ['thermostat', 'ecobee', 'heating', 'cooling', 'temperature'],
  ['book', 'books', 'hardcover', 'reading', 'bestseller', 'author'],
  ['finance', 'money', 'investing', 'wealth', 'economics'],
  ['habits', 'productivity', 'focus', 'deep-work', 'self-help'],
  ['programming', 'coding', 'software', 'clean-code', 'pragmatic', 'data-intensive', 'engineering'],
  ['yoga', 'pilates', 'mat', 'manduka', 'stretching'],
  ['dumbbell', 'dumbbells', 'weights', 'bowflex', 'strength', 'lifting'],
  ['massager', 'theragun', 'percussion', 'recovery', 'muscle'],
  ['racket', 'racquet', 'tennis', 'badminton', 'wilson', 'yonex'],
  ['bottle', 'flask', 'hydro-flask', 'tumbler', 'hydration', 'water-bottle'],
  ['basketball', 'spalding', 'ball', 'court', 'hoop'],
  ['suspension', 'trx', 'resistance', 'bodyweight'],
  ['foundation', 'makeup', 'fenty', 'cosmetics', 'matte'],
  ['styler', 'airwrap', 'hair-dryer', 'curler', 'haircare'],
  ['perfume', 'fragrance', 'cologne', 'dior', 'sauvage', 'chanel', 'eau-de-parfum', 'scent'],
  ['serum', 'vitamin-c', 'niacinamide', 'la-roche-posay', 'ordinary', 'anti-aging'],
  ['cleanser', 'cerave', 'face-wash', 'hydrating', 'skincare', 'facial'],
  ['trimmer', 'shaver', 'oneblade', 'grooming', 'beard', 'razor'],
  ['apple', 'ios', 'm3', 'm4', 'magsafe'],
  ['samsung', 'galaxy'],
  ['sony', 'playstation'],
  ['nike', 'jordan', 'dri-fit'],
  ['adidas', 'ultraboost'],
  ['levis', 'denim'],
  ['dyson', 'v15', 'airwrap'],
  ['philips', 'hue', 'oneblade'],
  ['electronics', 'tech', 'gadget', 'gadgets'],
  ['fashion', 'apparel', 'clothing', 'wear', 'outfit'],
  ['home', 'kitchen', 'appliance', 'appliances', 'garden'],
  ['sports', 'fitness', 'gym', 'workout', 'exercise', 'athletic', 'running'],
  ['beauty', 'personal-care', 'skin', 'grooming'],
  ['martello', 'mart1', 'mart2'],
  ['prodexa', 'mart3'],
  ['storenta', 'mart4']
];

const STOP_WORDS = new Set([
  'i', 'want', 'need', 'looking', 'for', 'buy', 'get', 'show', 'me', 'find', 'search',
  'some', 'a', 'an', 'the', 'please', 'can', 'you', 'give', 'have', 'in', 'at', 'from',
  'with', 'good', 'best', 'cheap', 'price', 'near', 'my', 'house', 'mart', 'store',
  'to', 'of', 'is', 'are', 'something', 'like', 'that', 'and', 'or', 'also', 'plus'
]);

function fnv1aHash(str: string, seed = 2166136261): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function stemToken(token: string): string {
  if (token.length <= 3) return token;
  if (token.endsWith('ies') && token.length > 4) return token.slice(0, -3) + 'y';
  if (token.endsWith('es') && (token.endsWith('shes') || token.endsWith('ches') || token.endsWith('xes'))) {
    return token.slice(0, -2);
  }
  if (token.endsWith('s') && !token.endsWith('ss') && !token.endsWith('us')) {
    return token.slice(0, -1);
  }
  return token;
}

export function tokenizeText(text: string): string[] {
  return String(text || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

export function generateEmbedding(text: string): number[] {
  const vec = new Float32Array(EMBEDDING_DIM);
  const tokens = tokenizeText(text);
  const stemmedTokens = tokens.map(stemToken);
  const tokenSet = new Set([...tokens, ...stemmedTokens]);

  for (let i = 0; i < SEMANTIC_CONCEPTS.length; i++) {
    const group = SEMANTIC_CONCEPTS[i];
    let hits = 0;
    for (const term of group) {
      if (tokenSet.has(term) || tokenSet.has(stemToken(term))) {
        hits += 1;
      }
    }
    if (hits > 0) {
      vec[i] = 2.5 * Math.min(2.0, 1 + Math.log1p(hits));
    }
  }

  const hashOffset = SEMANTIC_CONCEPTS.length;
  const hashSpace = EMBEDDING_DIM - hashOffset;

  for (const tok of stemmedTokens) {
    const h1 = fnv1aHash(`u:${tok}`, 2166136261);
    const h2 = fnv1aHash(`u2:${tok}`, 1469598103);
    vec[hashOffset + (h1 % hashSpace)] += (h1 & 1) === 0 ? 1.8 : -1.8;
    vec[hashOffset + (h2 % hashSpace)] += (h2 & 1) === 0 ? 1.2 : -1.2;

    const padded = `<${tok}>`;
    for (let j = 0; j <= padded.length - 3; j++) {
      const tri = padded.slice(j, j + 3);
      const ht = fnv1aHash(`c:${tri}`);
      vec[hashOffset + (ht % hashSpace)] += (ht & 1) === 0 ? 0.35 : -0.35;
    }
  }

  for (let i = 0; i < stemmedTokens.length - 1; i++) {
    const bg = `${stemmedTokens[i]}_${stemmedTokens[i + 1]}`;
    const hb = fnv1aHash(`b:${bg}`);
    vec[hashOffset + (hb % hashSpace)] += (hb & 1) === 0 ? 1.1 : -1.1;
  }

  let normSq = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    normSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(normSq) || 1;
  const out = new Array<number>(EMBEDDING_DIM);
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    out[i] = Number((vec[i] / norm).toFixed(6));
  }
  return out;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

export interface VectorRecord {
  productId: string;
  product: Product;
  embedding: number[];
  lowestPrice: number;
}

let cachedVectorIndex: VectorRecord[] | null = null;

export function getClientVectorIndex(): VectorRecord[] {
  if (cachedVectorIndex) return cachedVectorIndex;
  cachedVectorIndex = mockProducts.map(product => {
    const weightedInput = [
      product.name,
      product.name,
      product.brand,
      product.category,
      (product.tags || []).join(' '),
      (product.features || []).join(' '),
      product.description
    ].join(' ');
    return {
      productId: product.id,
      product,
      embedding: generateEmbedding(weightedInput),
      lowestPrice: product.lowestPrice ?? product.price
    };
  });
  return cachedVectorIndex;
}

export function searchClientVectorDB(rawQuery: string, maxBudget: number | null = null, topK = 4): {
  products: Product[];
  topSimilarity: number;
} {
  const index = getClientVectorIndex();
  const cleaned = rawQuery
    .replace(/(?:under|below|less than|max|budget(?:\s+of)?)\s*\$?\s*\d+/gi, '')
    .replace(/\b(?:cheapest|lowest|price|nearest|closest|near|me|genuine|fake|reviews|recommend|suggest|which|mart|has|where|can|buy|find|show|want|need|looking|for|some|please|give|get)\b/gi, ' ')
    .trim();

  const subQueries = (cleaned || rawQuery)
    .split(/\b(?:and|or|also|plus|with)\b|[,&+]/i)
    .map(s => s.trim())
    .filter(s => tokenizeText(s).length > 0);

  const activeSubQueries = subQueries.length > 0 ? subQueries : [rawQuery];
  const candidates = maxBudget !== null ? index.filter(r => r.lowestPrice <= maxBudget) : index;

  const selected = new Map<string, { rec: VectorRecord; hybridScore: number; cosine: number }>();
  const perClauseLimit = Math.max(2, Math.ceil(topK / activeSubQueries.length));

  for (const subQuery of activeSubQueries) {
    const queryTokens = tokenizeText(subQuery);
    const queryStems = queryTokens.map(stemToken);
    const queryVec = generateEmbedding(subQuery);

    const scored = candidates
      .map(rec => {
        const cosine = cosineSimilarity(queryVec, rec.embedding);
        const identityText = `${rec.product.name} ${rec.product.brand} ${rec.product.category} ${(rec.product.tags || []).join(' ')}`.toLowerCase();
        const identityStems = new Set(tokenizeText(identityText).map(stemToken));

        let matched = 0;
        for (const qStem of queryStems) {
          if (identityStems.has(qStem)) {
            matched += 1;
          } else {
            const sharesConcept = SEMANTIC_CONCEPTS.some(
              group =>
                group.some(g => stemToken(g) === qStem) &&
                group.some(g => identityStems.has(stemToken(g)))
            );
            if (sharesConcept) matched += 0.9;
          }
        }

        const coverage = queryStems.length > 0 ? matched / queryStems.length : 0;
        const hybridScore = cosine * 0.55 + coverage * 0.45;
        return { rec, cosine, coverage, hybridScore };
      })
      .filter(item => item.coverage >= 0.45 || item.cosine >= 0.32)
      .sort((a, b) => b.hybridScore - a.hybridScore || a.rec.lowestPrice - b.rec.lowestPrice);

    for (const hit of scored.slice(0, perClauseLimit)) {
      const prev = selected.get(hit.rec.productId);
      if (!prev || hit.hybridScore > prev.hybridScore) {
        selected.set(hit.rec.productId, hit);
      }
    }
  }

  const ranked = [...selected.values()]
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, topK);

  return {
    products: ranked.map(r => r.rec.product),
    topSimilarity: ranked[0]?.hybridScore ?? 0
  };
}
