function hasAjioKey() {
  return !!process.env.AJIO_RAPIDAPI_KEY;
}

export async function fetchAjioProducts(queryPlan) {
  try {
    const queries = [
      ...queryPlan.makeupQueries,
      ...queryPlan.skincareQueries,
      ...queryPlan.clothingQueries
    ].slice(0, 4);

    if (!hasAjioKey()) {
      return queries.map((q, i) => ({
        provider: 'ajio',
        product_id: `ajio-mock-${i}`,
        title: `Ajio sample for ${q}`,
        price: 549 + i * 40,
        currency: 'INR',
        url: 'https://www.ajio.com/',
        image_url: 'https://via.placeholder.com/300x300.png?text=Ajio'
      }));
    }

    // If key exists, integrate RapidAPI/Apify flow here.
    return queries.map((q, i) => ({
      provider: 'ajio',
      product_id: `ajio-${i}-${encodeURIComponent(q)}`,
      title: `Ajio: ${q}`,
      price: 579 + i * 45,
      currency: 'INR',
      url: 'https://www.ajio.com/',
      image_url: 'https://via.placeholder.com/300x300.png?text=Ajio'
    }));
  } catch (e) {
    console.error('Ajio fetch error', e);
    return [];
  }
}


