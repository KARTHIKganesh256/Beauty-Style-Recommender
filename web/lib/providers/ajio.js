export async function fetchAjioProducts(queryPlan) {
  try {
    const key = process.env.AJIO_RAPIDAPI_KEY
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4)

    if (!key) {
      return queries.map((q, i) => ({
        provider: 'ajio',
        product_id: `ajio-mock-${i}`,
        title: `Ajio sample for ${q}`,
        price: 549 + i * 40,
        currency: 'INR',
        url: 'https://www.ajio.com/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Ajio'
      }))
    }
    return queries.map((q, i) => ({
      provider: 'ajio',
      product_id: `ajio-${i}-${encodeURIComponent(q)}`,
      title: `Ajio: ${q}`,
      price: 579 + i * 45,
      currency: 'INR',
      url: 'https://www.ajio.com/',
      image_url: 'https://via.placeholder.com/300x300.png?text=Ajio'
    }))
  } catch (e) {
    console.error('Ajio fetch error', e)
    return []
  }
}


