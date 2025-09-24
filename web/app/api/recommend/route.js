import { NextResponse } from 'next/server'
import { mapQueriesFromInput } from '../../../lib/mapQueries'
import { normalizeProducts, dedupeAndLimit } from '../../../lib/normalize'
import { fetchFlipkartProducts } from '../../../lib/providers/flipkart'
import { fetchAmazonProducts } from '../../../lib/providers/amazon'
import { fetchAjioProducts } from '../../../lib/providers/ajio'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { skinTone, undertone, location } = body || {}
    if (!skinTone && !undertone) {
      return NextResponse.json({ error: 'skinTone or undertone is required' }, { status: 400 })
    }
    const queryPlan = mapQueriesFromInput({ skinTone, undertone, location })
    const [flipkart, amazon, ajio] = await Promise.all([
      fetchFlipkartProducts(queryPlan),
      fetchAmazonProducts(queryPlan),
      fetchAjioProducts(queryPlan)
    ])
    const normalized = [...flipkart, ...amazon, ...ajio].map(normalizeProducts).flat()
    const products = dedupeAndLimit(normalized, 40)
    return NextResponse.json({ products })
  } catch (e) {
    console.error('recommend error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


