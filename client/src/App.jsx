import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function SignIn({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const sendMagicLink = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Check your email for a magic link.')
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) onSignedIn(session.user)
    })
    return () => authListener.subscription.unsubscribe()
  }, [onSignedIn])

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <input className="w-full border p-2 rounded mb-3" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading} onClick={sendMagicLink}>
        {loading ? 'Sending...' : 'Send magic link'}
      </button>
      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </div>
  )
}

function ProductCard({ p, onSave }) {
  return (
    <div className="border rounded overflow-hidden bg-white shadow-sm flex flex-col">
      <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-medium line-clamp-2 mb-2">{p.title}</div>
        <div className="text-sm text-gray-700 mb-3">{p.currency} {p.price}</div>
        <div className="mt-auto flex gap-2">
          <a className="flex-1 bg-zinc-800 text-white text-center py-2 rounded" href={p.url} target="_blank" rel="noreferrer">
            Open on {p.provider}
          </a>
          {onSave && (
            <button className="bg-emerald-600 text-white px-3 rounded" onClick={() => onSave(p)}>Save</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [skinTone, setSkinTone] = useState('')
  const [undertone, setUndertone] = useState('neutral')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user)
    })
  }, [])

  const recommend = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${apiBase}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skinTone, undertone, location })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setProducts(json.products || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const saveProduct = async (p) => {
    if (!user) return
    const { error } = await supabase.from('recommendations').insert({
      user_id: user.id,
      provider: p.provider,
      product_id: p.product_id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      url: p.url,
      image_url: p.image_url
    })
    if (error) alert(error.message)
    else alert('Saved!')
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <SignIn onSignedIn={setUser} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Beauty & Style Recommender</h1>
          <div className="text-sm text-gray-600">Signed in as {user.email}</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input className="border p-2 rounded" placeholder="Skin tone (e.g., #c68642 or III)" value={skinTone} onChange={e => setSkinTone(e.target.value)} />
          <select className="border p-2 rounded" value={undertone} onChange={e => setUndertone(e.target.value)}>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="neutral">Neutral</option>
          </select>
          <input className="border p-2 rounded" placeholder="Location (optional)" value={location} onChange={e => setLocation(e.target.value)} />
          <button className="bg-blue-600 text-white rounded px-4" onClick={recommend} disabled={loading}>{loading ? 'Finding…' : 'Find Products'}</button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={`${p.provider}-${p.product_id}`} p={p} onSave={saveProduct} />
          ))}
        </div>
      </main>
    </div>
  )
}


