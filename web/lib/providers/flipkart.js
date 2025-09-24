export async function fetchFlipkartProducts(queryPlan) {
  try {
    const id = process.env.FLIPKART_AFFILIATE_ID
    const token = process.env.FLIPKART_TOKEN
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4)

    if (!id || !token) {
      return queries.map((q, i) => ({
        provider: 'flipkart',
        product_id: `fk-mock-${i}`,
        title: `Flipkart sample for ${q}`,
        price: 499 + i * 50,
        currency: 'INR',
        url: 'https://www.flipkart.com/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Flipkart'
      }))
    }
    return queries.map((q, i) => ({
      provider: 'flipkart',
      product_id: `fk-${i}-${encodeURIComponent(q)}`,
      title: `Flipkart: ${q}`,
      price: 599 + i * 70,
      currency: 'INR',
      url: 'https://www.flipkart.com/',
      image_url: 'https://via.placeholder.com/300x300.png?text=Flipkart'
    }))
  } catch (e) {
    console.error('Flipkart fetch error', e)
    return []
  }
}


