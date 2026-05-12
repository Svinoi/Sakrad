'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Niva = 'hog' | 'medel' | 'lag'

type Risk = {
  id: string
  namn: string
  arbetsmoment: string
  sannolikhet: number
  konsekvens: number
  riskvarde: number
  niva: Niva
  atgard: string
  ansvarig: string
  datum: string
}

const STANDARD_RISKER: Risk[] = [
  {
    id: '1',
    namn: 'Ras i schakt',
    arbetsmoment: 'Schaktning och grävning',
    sannolikhet: 3,
    konsekvens: 5,
    riskvarde: 15,
    niva: 'hog',
    atgard: 'Spontlåda ska alltid användas vid schaktdjup över 1 meter. Kontrolleras dagligen.',
    ansvarig: '',
    datum: '',
  },
  {
    id: '2',
    namn: 'Trafik intill arbetsplats',
    arbetsmoment: 'Alla arbetsmoment',
    sannolikhet: 2,
    konsekvens: 3,
    riskvarde: 6,
    niva: 'medel',
    atgard: 'Avspärrning och varningsskyltar ska finnas.',
    ansvarig: '',
    datum: '',
  },
  {
    id: '3',
    namn: 'Fallrisk vid schaktkant',
    arbetsmoment: 'Schaktning',
    sannolikhet: 1,
    konsekvens: 3,
    riskvarde: 3,
    niva: 'lag',
    atgard: 'Avspärrning minst 1 meter från schaktkant.',
    ansvarig: '',
    datum: '',
  },
]

function beraknaRisk(s: number, k: number): { riskvarde: number; niva: Niva } {
  const rv = s * k
  const niva: Niva = rv >= 10 ? 'hog' : rv >= 5 ? 'medel' : 'lag'
  return { riskvarde: rv, niva }
}

function nivaStilar(niva: Niva) {
  if (niva === 'hog') return {
    border: 'border-l-danger-500',
    badge: 'bg-danger-50 text-danger-700',
    box: 'bg-danger-50 border-danger-200',
    num: 'text-danger-700',
    label: 'Hög risk',
    desc: 'Åtgärd krävs omedelbart',
  }
  if (niva === 'medel') return {
    border: 'border-l-gold-500',
    badge: 'bg-gold-50 text-gold-700',
    box: 'bg-gold-50 border-gold-200',
    num: 'text-gold-700',
    label: 'Medel risk',
    desc: 'Planera åtgärd inom kort',
  }
  return {
    border: 'border-l-success-500',
    badge: 'bg-success-50 text-success-700',
    box: 'bg-success-50 border-success-200',
    num: 'text-success-700',
    label: 'Låg risk',
    desc: 'Bevaka och dokumentera',
  }
}

const TOM_RISK: Omit<Risk, 'id' | 'riskvarde' | 'niva'> = {
  namn: '',
  arbetsmoment: '',
  sannolikhet: 0,
  konsekvens: 0,
  atgard: '',
  ansvarig: '',
  datum: '',
}

type Vy = 'lista' | 'redigera' | 'ny'

export default function RiskbedomningPage() {
  const router = useRouter()
  const [vy, setVy] = useState<Vy>('lista')
  const [risker, setRisker] = useState<Risk[]>(STANDARD_RISKER)
  const [valdRisk, setValdRisk] = useState<Risk | null>(null)
  const [nyForm, setNyForm] = useState<Omit<Risk, 'id' | 'riskvarde' | 'niva'>>(TOM_RISK)
  const [sparar, setSparar] = useState(false)

  function oppnaRisk(r: Risk) {
    setValdRisk({ ...r })
    setVy('redigera')
  }

  function sparaRedigerad() {
    if (!valdRisk) return
    setRisker(prev => prev.map(r => r.id === valdRisk.id ? valdRisk : r))
    setVy('lista')
  }

  function sparaNy() {
    const { riskvarde, niva } = beraknaRisk(nyForm.sannolikhet, nyForm.konsekvens)
    const nyRisk: Risk = {
      ...nyForm,
      id: Date.now().toString(),
      riskvarde,
      niva,
    }
    setRisker(prev => [...prev, nyRisk])
    setNyForm(TOM_RISK)
    setVy('lista')
  }

  function uppdateraSan(v: number, form: 'redigera' | 'ny') {
    if (form === 'redigera' && valdRisk) {
      const { riskvarde, niva } = beraknaRisk(v, valdRisk.konsekvens)
      setValdRisk({ ...valdRisk, sannolikhet: v, riskvarde, niva })
    } else {
      const k = nyForm.konsekvens
      setNyForm(f => ({ ...f, sannolikhet: v }))
    }
  }

  function uppdateraKon(v: number, form: 'redigera' | 'ny') {
    if (form === 'redigera' && valdRisk) {
      const { riskvarde, niva } = beraknaRisk(valdRisk.sannolikhet, v)
      setValdRisk({ ...valdRisk, konsekvens: v, riskvarde, niva })
    } else {
      setNyForm(f => ({ ...f, konsekvens: v }))
    }
  }

  async function publicera() {
    setSparar(true)
    await new Promise(r => setTimeout(r, 800))
    router.back()
  }

  const nyValid = nyForm.namn.trim() &&
    nyForm.sannolikhet > 0 &&
    nyForm.konsekvens > 0 &&
    nyForm.atgard.trim()

  const nyBeraknad = nyForm.sannolikhet > 0 && nyForm.konsekvens > 0
    ? beraknaRisk(nyForm.sannolikhet, nyForm.konsekvens)
    : null

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">

      {/* LISTA */}
      {vy === 'lista' && (
        <>
          <div className="bg-navy-800 px-5 pt-12 pb-4 flex-shrink-0">
            <button onClick={() => router.back()}
              className="text-navy-200 text-sm flex items-center gap-1.5 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Tillbaka
            </button>
            <h1 className="text-white font-serif text-xl font-bold">Riskbedömning</h1>
            <p className="text-navy-200 text-xs mt-1">{risker.length} risker · Utkast</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
            <h2 className="font-serif text-sm font-bold text-navy-800 mb-3">Identifierade risker</h2>
            <div className="flex flex-col gap-3">
              {risker
                .sort((a, b) => b.riskvarde - a.riskvarde)
                .map(r => {
                  const s = nivaStilar(r.niva)
                  return (
                    <button
                      key={r.id}
                      onClick={() => oppnaRisk(r)}
                      className={`bg-white rounded-xl border-l-4 p-3.5 text-left
                                  active:scale-98 transition-transform ${s.border}`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-serif font-bold text-sm text-navy-800 flex-1 pr-2">
                          {r.namn}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${s.badge}`}>
                          {r.niva === 'hog' ? 'HÖG' : r.niva === 'medel' ? 'MEDEL' : 'LÅG'} · {r.riskvarde}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        S:{r.sannolikhet} × K:{r.konsekvens} · {r.atgard.slice(0, 50)}{r.atgard.length > 50 ? '…' : ''}
                      </p>
                    </button>
                  )
                })}
            </div>

            <button
              onClick={() => setVy('ny')}
              className="w-full mt-3 border border-dashed border-navy-200 rounded-xl py-3
                         text-sm text-navy-600 flex items-center justify-center gap-2
                         hover:bg-navy-50 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Lägg till risk
            </button>
          </div>

          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white
                          border-t border-gray-200 px-4 py-3 flex gap-3">
            <button className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm
                               text-gray-600 bg-cream-100">
              Spara utkast
            </button>
            <button
              onClick={publicera}
              disabled={sparar}
              className="flex-[2] bg-navy-800 text-white rounded-xl py-2.5 text-sm
                         font-serif font-bold disabled:opacity-70"
            >
              {sparar ? 'Publicerar...' : 'Publicera →'}
            </button>
          </div>
        </>
      )}

      {/* REDIGERA RISK */}
      {vy === 'redigera' && valdRisk && (() => {
        const s = nivaStilar(valdRisk.niva)
        return (
          <>
            <div className="bg-navy-800 px-5 pt-12 pb-4 flex-shrink-0">
              <button onClick={() => setVy('lista')}
                className="text-navy-200 text-sm flex items-center gap-1.5 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Tillbaka
              </button>
              <h1 className="text-white font-serif text-xl font-bold">{valdRisk.namn}</h1>
              <p className="text-navy-200 text-xs mt-1">Redigera risk</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Riskbeskrivning</label>
                  <input className="input-field" value={valdRisk.namn}
                    onChange={e => setValdRisk(v => v ? { ...v, namn: e.target.value } : v)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Arbetsmoment</label>
                  <input className="input-field" value={valdRisk.arbetsmoment}
                    onChange={e => setValdRisk(v => v ? { ...v, arbetsmoment: e.target.value } : v)} />
                </div>
                <Skala
                  label="Sannolikhet"
                  vald={valdRisk.sannolikhet}
                  onChange={v => uppdateraSan(v, 'redigera')}
                  minLabel="Osannolikt"
                  maxLabel="Nästan säkert"
                />
                <Skala
                  label="Konsekvens"
                  vald={valdRisk.konsekvens}
                  onChange={v => uppdateraKon(v, 'redigera')}
                  minLabel="Försumbar"
                  maxLabel="Katastrofal"
                />
                <RiskVardeBox riskvarde={valdRisk.riskvarde} niva={valdRisk.niva} s={s} />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Åtgärd</label>
                  <textarea className="input-field" rows={3} value={valdRisk.atgard}
                    onChange={e => setValdRisk(v => v ? { ...v, atgard: e.target.value } : v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Ansvarig</label>
                    <input className="input-field" placeholder="Namn" value={valdRisk.ansvarig}
                      onChange={e => setValdRisk(v => v ? { ...v, ansvarig: e.target.value } : v)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Åtgärdas senast</label>
                    <input className="input-field" type="date" value={valdRisk.datum}
                      onChange={e => setValdRisk(v => v ? { ...v, datum: e.target.value } : v)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white
                            border-t border-gray-200 px-4 py-3 flex gap-3">
              <button onClick={() => setVy('lista')}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-500 bg-cream-100">
                Avbryt
              </button>
              <button onClick={sparaRedigerad}
                className="flex-[2] bg-navy-800 text-white rounded-xl py-2.5 text-sm font-serif font-bold">
                Spara risk
              </button>
            </div>
          </>
        )
      })()}

      {/* NY RISK */}
      {vy === 'ny' && (
        <>
          <div className="bg-navy-800 px-5 pt-12 pb-4 flex-shrink-0">
            <button onClick={() => setVy('lista')}
              className="text-navy-200 text-sm flex items-center gap-1.5 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Tillbaka
            </button>
            <h1 className="text-white font-serif text-xl font-bold">Ny risk</h1>
            <p className="text-navy-200 text-xs mt-1">Lägg till riskbedömning</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Riskbeskrivning *</label>
                <input className="input-field" placeholder="Vad kan gå fel?"
                  value={nyForm.namn}
                  onChange={e => setNyForm(f => ({ ...f, namn: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Arbetsmoment</label>
                <input className="input-field" placeholder="t.ex. Schaktning, Lyft, Elarbete..."
                  value={nyForm.arbetsmoment}
                  onChange={e => setNyForm(f => ({ ...f, arbetsmoment: e.target.value }))} />
              </div>
              <Skala
                label="Sannolikhet"
                vald={nyForm.sannolikhet}
                onChange={v => uppdateraSan(v, 'ny')}
                minLabel="Osannolikt"
                maxLabel="Nästan säkert"
              />
              <Skala
                label="Konsekvens"
                vald={nyForm.konsekvens}
                onChange={v => uppdateraKon(v, 'ny')}
                minLabel="Försumbar"
                maxLabel="Katastrofal"
              />
              {nyBeraknad ? (
                <RiskVardeBox
                  riskvarde={nyBeraknad.riskvarde}
                  niva={nyBeraknad.niva}
                  s={nivaStilar(nyBeraknad.niva)}
                />
              ) : (
                <div className="bg-cream-200 border border-cream-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400">Välj sannolikhet och konsekvens för att se riskvärdet</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Åtgärd *</label>
                <textarea className="input-field" rows={3}
                  placeholder="Vad ska göras för att minska risken?"
                  value={nyForm.atgard}
                  onChange={e => setNyForm(f => ({ ...f, atgard: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Ansvarig</label>
                  <input className="input-field" placeholder="Namn"
                    value={nyForm.ansvarig}
                    onChange={e => setNyForm(f => ({ ...f, ansvarig: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Åtgärdas senast</label>
                  <input className="input-field" type="date"
                    value={nyForm.datum}
                    onChange={e => setNyForm(f => ({ ...f, datum: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white
                          border-t border-gray-200 px-4 py-3 flex gap-3">
            <button onClick={() => setVy('lista')}
              className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-500 bg-cream-100">
              Avbryt
            </button>
            <button onClick={sparaNy} disabled={!nyValid}
              className="flex-[2] bg-navy-800 text-white rounded-xl py-2.5 text-sm
                         font-serif font-bold disabled:opacity-40">
              Spara risk
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Skala({
  label, vald, onChange, minLabel, maxLabel
}: {
  label: string
  vald: number
  onChange: (v: number) => void
  minLabel: string
  maxLabel: string
}) {
  const farger = ['', 'bg-success-500', 'bg-success-300', 'bg-gold-500', 'bg-danger-400', 'bg-danger-600']
  const textfarger = ['', 'text-success-700', 'text-success-600', 'text-gold-700', 'text-danger-600', 'text-danger-700']

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        {vald > 0 && (
          <span className={`text-xs font-bold ${textfarger[vald]}`}>{vald}</span>
        )}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`flex-1 h-9 rounded-lg text-sm font-bold border transition-all
              ${vald === v
                ? `${farger[v]} text-white border-transparent`
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{minLabel}</span>
        <span className="text-xs text-gray-400">{maxLabel}</span>
      </div>
    </div>
  )
}

function RiskVardeBox({
  riskvarde, niva, s
}: {
  riskvarde: number
  niva: Niva
  s: ReturnType<typeof nivaStilar>
}) {
  return (
    <div className={`border rounded-xl p-4 text-center ${s.box}`}>
      <div className={`font-serif text-4xl font-bold ${s.num}`}>{riskvarde}</div>
      <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${s.num}`}>
        {s.label}
      </div>
      <div className={`text-xs mt-1 opacity-80 ${s.num}`}>{s.desc}</div>
    </div>
  )
}
