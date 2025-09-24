// Minimal PAAPI v5 placeholder with mock fallback. Implement full signing if keys provided.
import crypto from 'crypto';

function hasAmazonCreds() {
  return (
    !!process.env.AMAZON_ACCESS_KEY &&
    !!process.env.AMAZON_SECRET_KEY &&
    !!process.env.AMAZON_ASSOCIATE_TAG
  );
}

export async function fetchAmazonProducts(queryPlan) {
  try {
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4);

    if (!hasAmazonCreds()) {
      return queries.map((q, i) => ({
        provider: 'amazon',
        product_id: `amz-mock-${i}`,
        title: `Amazon sample for ${q}`,
        price: 699 + i * 60,
        currency: 'INR',
        url: 'https://www.amazon.in/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Amazon'
      }));
    }

    // If you have credentials, implement PAAPI search here.
    // To keep this template runnable without creds, return minimal simulated items.
    return queries.map((q, i) => ({
      provider: 'amazon',
      product_id: `amz-${i}-${encodeURIComponent(q)}`,
      title: `Amazon: ${q}`,
      price: 749 + i * 80,
      currency: 'INR',
      url: 'https://www.amazon.in/',
      image_url: 'https://via.placeholder.com/300x300.png?text=Amazon'
    }));
  } catch (e) {
    console.error('Amazon fetch error', e);
    return [];
  }
}


