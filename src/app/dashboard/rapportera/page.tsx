'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Kategori = 'risk' | 'skada' | 'bra'

const KATEGORIER = [
  {
    key: 'risk' as Kategori,
    label: 'Risk / tillbud',
    desc: 'Något kan gå fel',
    border: 'border-danger-500 bg-danger-50',
    knapp: 'bg-danger-500 text-white',
    ikon: '#D94F2B',
    check: 'text-danger-600',
  },
  {
    key: 'skada' as Kategori,
    label: 'Skada / fel',
    desc: 'Något har gått fel',
    border: 'border-gold-500 bg-gold-50',
    knapp: 'bg-gold-500 text-navy-900',
    ikon: '#E8A020',
    check: 'text-gold-600',
  },
  {
    key: 'bra' as Kategori,
    label: 'Bra observation',
    desc: 'Något görs rätt',
    border: 'border-success-500 bg-success-50',
    knapp: 'bg-success-500 text-white',
    ikon: '#2A7A50',
    check: 'text-success-600',
  },
]

export default function RapporteraPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [kategori, setKategori] = useState<Kategori | null>(null)
  const [bilder, setBilder] = useState<{ url: string; namn: string }[]>([])
  const [beskrivning, setBeskrivning] = useState('')
  const [skickar, setSkickar] = useState(false)
  const [skickad, setSkickad] = useState(false)

  function hanteraBilder(e: React.ChangeEvent<HTMLInputElement>) {
    const filer = Array.from(e.target.files ?? [])
    const nya = filer.map(f => ({
      url: URL.createObjectURL(f),
      namn: f.name,
    }))
    setBilder(prev => [...prev, ...nya].slice(0, 5))
  }

  async function skicka() {
    if (!kategori) return
    setSkickar(true)
    await new Promise(r => setTimeout(r, 700))
    setSkickad(true)
    setSkickar(false)
  }

  const vald = KATEGORIER.find(k => k.key === kategori)

  if (skickad) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5
          ${kategori === 'bra' ? 'bg-success-50' : kategori === 'skada' ? 'bg-gold-50' : 'bg-danger-50'}`}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke={vald?.ikon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy-800 mb-2">Rapport skickad</h1>
        <p className="text-sm text-gray-500 mb-1">{vald?.label} har rapporterats.</p>
        <p className="text-xs text-gray-400 mb-8">Projektledaren får en notis direkt.</p>
        <button
          onClick={() => { setSkickad(false); setKategori(null); setBilder([]); setBeskrivning('') }}
          className="btn-primary w-full max-w-xs mb-3"
        >
          Rapportera igen
        </button>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500">
          Tillbaka till hem
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <div className="bg-navy-800 px-5 pt-12 pb-5 flex-shrink-0">
        <button onClick={() => router.back()}
          className="text-navy-200 text-sm flex items-center gap-1.5 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Tillbaka
        </button>
        <h1 className="text-white font-serif text-xl font-bold">Rapportera observation</h1>
        <p className="text-navy-200 text-xs mt-1">VA-ledning Storån etapp 2</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">

        {/* Kategori */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-3">Vad handlar det om? *</label>
          <div className="flex flex-col gap-2.5">
            {KATEGORIER.map(k => (
              <button key={k.key} onClick={() => setKategori(k.key)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left
                           transition-all active:scale-98
                           ${kategori === k.key ? k.border : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${kategori === k.key ? 'opacity-100' : 'bg-gray-100'}`}
                  style={kategori === k.key ? { background: k.ikon } : {}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke={kategori === k.key ? '#fff' : '#999'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {k.key === 'risk' && <>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </>}
                    {k.key === 'skada' && <>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </>}
                    {k.key === 'bra' && <polyline points="20 6 9 17 4 12"/>}
                  </svg>
                </div>
                <div>
                  <div className={`text-sm font-semibold font-serif
                    ${kategori === k.key ? k.check : 'text-navy-800'}`}>
                    {k.label}
                  </div>
                  <div className="text-xs text-gray-500">{k.desc}</div>
                </div>
                {kategori === k.key && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    strokeLinejoin="round" className={`ml-auto ${k.check}`}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bilder */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-3">
            Bilder <span className="text-gray-400 font-normal">(max 5)</span>
          </label>
          {bilder.length < 5 && (
            <button onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-navy-200 rounded-xl py-5
                         flex flex-col items-center gap-2 mb-3 hover:bg-navy-50
                         active:scale-98 transition-all">
              <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#0F2240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-navy-800">Ta foto eller välj bild</span>
              <span className="text-xs text-gray-400">Tryck här</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            multiple className="hidden" onChange={hanteraBilder} />
          {bilder.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {bilder.map((b, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden
                                        border border-gray-200 flex-shrink-0">
                  <img src={b.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setBilder(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-navy-800 bg-opacity-80
                               rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              {bilder.length < 5 && (
                <button onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl
                             flex items-center justify-center hover:border-navy-200 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Beskrivning */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Beskriv vad du ser <span className="text-gray-400 font-normal">(valfritt)</span>
          </label>
          <textarea className="input-field" rows={3}
            placeholder="t.ex. Löst räcke vid schaktgropen på sektion B..."
            value={beskrivning} onChange={e => setBeskrivning(e.target.value)} />
        </div>

        {/* Plats */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Plats</label>
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#0F2240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-sm text-gray-600">Storågatan 4, Nystad</span>
            <span className="ml-auto text-xs text-success-600 font-medium">GPS</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto
                      bg-white border-t border-gray-200 px-4 py-3">
        <button onClick={skicka} disabled={!kategori || skickar}
          className={`w-full rounded-xl py-3 text-sm font-serif font-bold
                      transition-all active:scale-98
                      ${kategori ? vald!.knapp : 'bg-gray-200 text-gray-400'}`}>
          {skickar ? 'Skickar...' : 'Skicka rapport'}
        </button>
      </div>
    </div>
  )
}
