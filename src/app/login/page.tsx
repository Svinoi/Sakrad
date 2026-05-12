'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Demo-läge: logga in direkt utan Supabase
    await new Promise(r => setTimeout(r, 600))
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logotyp */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 bg-gold-500 rounded-xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#0F2240" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold text-navy-800">Säkrad</span>
        </div>

        <div className="card">
          <h2 className="font-serif text-lg text-navy-800 mb-1">Logga in</h2>
          <p className="text-sm text-gray-500 mb-5">
            Du får en länk i din e-post — inget lösenord behövs.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                E-postadress
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="namn@foretag.se"
                defaultValue="demo@sakrad.se"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Loggar in...' : 'Logga in →'}
            </button>
          </form>

          {/* Demo-badge */}
          <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-xl">
            <p className="text-xs text-gold-900 text-center">
              Demo-läge — klicka Logga in för att testa appen
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Säkrad — Arbetsmiljö & dokumentation
        </p>
      </div>
    </main>
  )
}
