import fetch from 'node-fetch';

function buildHeaders() {
  const id = process.env.FLIPKART_AFFILIATE_ID;
  const token = process.env.FLIPKART_TOKEN;
  if (!id || !token) return null;
  return { 'Fk-Affiliate-Id': id, 'Fk-Affiliate-Token': token };
}

export async function fetchFlipkartProducts(queryPlan) {
  try {
    const headers = buildHeaders();
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4);

    if (!headers) {
      // Fallback mock when credentials absent
      return queries.map((q, i) => ({
        provider: 'flipkart',
        product_id: `fk-mock-${i}`,
        title: `Flipkart sample for ${q}`,
        price: 499 + i * 50,
        currency: 'INR',
        url: 'https://www.flipkart.com/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Flipkart'
      }));
    }

    // Flipkart public product search API is limited; this is a placeholder.
    // Replace with actual affiliate feed/catalog lookup.
    const results = [];
    for (const [i, q] of queries.entries()) {
      // Placeholder: simulate a minimal response per query
      results.push({
        provider: 'flipkart',
        product_id: `fk-${i}-${encodeURIComponent(q)}`,
        title: `Flipkart: ${q}`,
        price: 599 + i * 70,
        currency: 'INR',
        url: 'https://www.flipkart.com/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Flipkart'
      });
    }
    return results;
  } catch (e) {
    console.error('Flipkart fetch error', e);
    return [];
  }
}


