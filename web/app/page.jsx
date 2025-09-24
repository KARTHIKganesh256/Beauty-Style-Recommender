"use client"
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

export default function Page() {
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
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const sendMagic = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email for a magic link')
  }

  const recommend = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recommend', {
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

  const save = async (p) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <h1 className="text-xl font-semibold mb-2">Beauty & Style Recommender</h1>
          <p className="text-sm text-gray-600 mb-4">Sign in to continue</p>
          <Auth onSend={sendMagic} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Beauty & Style Recommender</h1>
          <span className="text-sm text-gray-600">{user.email}</span>
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
          {products.map(p => (
            <ProductCard key={`${p.provider}-${p.product_id}`} p={p} onSave={() => save(p)} />
          ))}
        </div>
      </main>
    </div>
  )
}

function Auth({ onSend }) {
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const handlePasswordFlow = async () => {
    setBusy(true)
    setMsg('')
    try {
      if (mode === 'signUp') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setMsg('Signed in!')
      }
    } catch (e) {
      setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button className={`px-3 py-1 rounded ${mode==='signIn'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={() => setMode('signIn')}>Sign in</button>
        <button className={`px-3 py-1 rounded ${mode==='signUp'?'bg-blue-600 text-white':'bg-gray-200'}`} onClick={() => setMode('signUp')}>Sign up</button>
      </div>
      <div className="flex flex-col gap-2">
        <input className="border p-2 rounded" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-zinc-800 text-white rounded px-3 py-2" disabled={busy} onClick={handlePasswordFlow}>
          {busy ? 'Please wait…' : (mode==='signUp' ? 'Create account' : 'Sign in')}
        </button>
        <div className="text-center text-sm text-gray-500">or</div>
        <button className="bg-emerald-600 text-white rounded px-3 py-2" disabled={busy} onClick={async () => { setBusy(true); setMsg(''); await onSend(email); setBusy(false); }}>
          {busy ? 'Sending…' : 'Send magic link to email'}
        </button>
        {msg && <div className="text-sm text-gray-700 mt-2">{msg}</div>}
      </div>
    </div>
  )
}

function ProductCard({ p, onSave }) {
  return (
    <div className="border rounded overflow-hidden bg-white shadow-sm flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-medium line-clamp-2 mb-2">{p.title}</div>
        <div className="text-sm text-gray-700 mb-3">{p.currency} {p.price}</div>
        <div className="mt-auto flex gap-2">
          <a className="flex-1 bg-zinc-800 text-white text-center py-2 rounded" href={p.url} target="_blank" rel="noreferrer">
            Open on {p.provider}
          </a>
          {onSave && (
            <button className="bg-emerald-600 text-white px-3 rounded" onClick={onSave}>Save</button>
          )}
        </div>
      </div>
    </div>
  )
}


