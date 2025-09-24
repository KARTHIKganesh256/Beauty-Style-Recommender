export async function fetchAmazonProducts(queryPlan) {
  try {
    const access = process.env.AMAZON_ACCESS_KEY
    const secret = process.env.AMAZON_SECRET_KEY
    const tag = process.env.AMAZON_ASSOCIATE_TAG
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4)

    if (!access || !secret || !tag) {
      return queries.map((q, i) => ({
        provider: 'amazon',
        product_id: `amz-mock-${i}`,
        title: `Amazon sample for ${q}`,
        price: 699 + i * 60,
        currency: 'INR',
        url: 'https://www.amazon.in/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Amazon'
      }))
    }
    return queries.map((q, i) => ({
      provider: 'amazon',
      product_id: `amz-${i}-${encodeURIComponent(q)}`,
      title: `Amazon: ${q}`,
      price: 749 + i * 80,
      currency: 'INR',
      url: 'https://www.amazon.in/',
      image_url: 'https://via.placeholder.com/300x300.png?text=Amazon'
    }))
  } catch (e) {
    console.error('Amazon fetch error', e)
    return []
  }
}


