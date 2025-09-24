export function normalizeProducts(item) {
  if (!item) return []
  if (Array.isArray(item)) return item.map(normalizeProducts).flat()
  const provider = item.provider || 'unknown'
  const productId = item.product_id || item.id || item.asin || item.sku || ''
  const title = item.title || item.name || ''
  const price = Number(item.price || item.listPrice || 0) || 0
  const currency = item.currency || item.currencyCode || 'INR'
  const url = item.url || item.link || item.detailPageURL || '#'
  const imageUrl = item.image_url || item.image || item.imageURL || item.thumbnail || ''
  return [{ provider, product_id: String(productId), title, price, currency, url, image_url: imageUrl }]
}

export function dedupeAndLimit(items, limit = 40) {
  const seen = new Set()
  const out = []
  for (const it of items) {
    const key = `${it.provider}:${it.product_id}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(it)
    if (out.length >= limit) break
  }
  return out
}


