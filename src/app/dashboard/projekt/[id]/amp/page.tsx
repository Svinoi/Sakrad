'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const STANDARD_REGLER = [
  'Hjälm, skyddsglasögon och varselkläder ska bäras på arbetsplatsen.',
  'Alla som vistas på arbetsplatsen ska kunna styrka sin identitet med giltigt ID-kort, körkort eller ID06-kort.',
  'Rökning är förbjuden på hela arbetsplatsen.',
  'Alkohol och droger är absolut förbjudet.',
  'Alla olyckor och tillbud ska rapporteras omedelbart till BAS-U.',
  'Håll arbetsplatsen ren och ordnad — eget material och avfall tas om hand.',
]

type Risk = {
  id: string
  namn: string
  atgard: string
  niva: 'hog' | 'medel' | 'lag'
}

const STANDARD_RISKER: Risk[] = [
  { id: '1', namn: 'Ras i schakt', atgard: 'Spontlåda ska alltid användas vid djup över 1 meter.', niva: 'hog' },
  { id: '2', namn: 'Trafik intill arbetsplats', atgard: 'Avspärrning och varningsskyltar ska finnas.', niva: 'medel' },
  { id: '3', namn: 'Fallrisk vid schaktkant', atgard: 'Avspärrning minst 1 meter från schaktkant.', niva: 'lag' },
]

type Sektion = 'projekt' | 'org' | 'regler' | 'risker' | 'sign'

export default function AmpPage() {
  const router = useRouter()
  const params = useParams()
  const projektId = params.id as string

  const [oppna, setOppna] = useState<Sektion[]>(['projekt'])
  const [regler, setRegler] = useState<string[]>(STANDARD_REGLER)
  const [nyRegel, setNyRegel] = useState('')
  const [laggTillRegel, setLaggTillRegel] = useState(false)
  const [risker, setRisker] = useState<Risk[]>(STANDARD_RISKER)
  const [forstaHjalp, setForstaHjalp] = useState('')
  const [sparar, setSparar] = useState(false)

  function toggleSektion(s: Sektion) {
    setOppna(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function addRegel() {
    if (!nyRegel.trim()) return
    setRegler(r => [...r, nyRegel.trim()])
    setNyRegel('')
    setLaggTillRegel(false)
  }

  function removeRegel(i: number) {
    setRegler(r => r.filter((_, idx) => idx !== i))
  }

  function nivaBadge(niva: Risk['niva']) {
    if (niva === 'hog') return { label: 'HÖG', cls: 'bg-danger-50 text-danger-700 border border-danger-200' }
    if (niva === 'medel') return { label: 'MEDEL', cls: 'bg-gold-50 text-gold-700 border border-gold-200' }
    return { label: 'LÅG', cls: 'bg-success-50 text-success-700 border border-success-200' }
  }

  function nivaBar(niva: Risk['niva']) {
    if (niva === 'hog') return 'border-l-danger-500'
    if (niva === 'medel') return 'border-l-gold-500'
    return 'border-l-success-500'
  }

  async function handlePublicera() {
    setSparar(true)
    await new Promise(r => setTimeout(r, 800))
    router.push(`/dashboard/projekt/${projektId}`)
  }

  const isOpen = (s: Sektion) => oppna.includes(s)

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">

      {/* Header */}
      <div className="bg-navy-800 px-5 pt-12 pb-4 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="text-navy-200 text-sm flex items-center gap-1.5 mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Tillbaka
        </button>
        <h1 className="text-white font-serif text-xl font-bold">Arbetsmiljöplan</h1>
        <p className="text-navy-200 text-xs mt-1">AMP · Utkast · VA-ledning Storån etapp 2</p>
      </div>

      {/* Sektioner */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* 1. Projektuppgifter */}
        <Section
          title="Projektuppgifter"
          icon="folder"
          iconBg="bg-navy-50"
          auto
          open={isOpen('projekt')}
          onToggle={() => toggleSektion('projekt')}
        >
          <InfoRad label="Projektnamn" value="VA-ledning Storån etapp 2" />
          <InfoRad label="Projektnummer" value="101 200" />
          <InfoRad label="Byggherren" value="Nystad Energi AB" />
          <InfoRad label="Adress" value="Storågatan 4, Nystad" />
          <InfoRad label="Entreprenadform" value="ABT06" />
          <InfoRad label="Period" value="2026-03-01 – 2026-10-31" />
        </Section>

        {/* 2. Organisation */}
        <Section
          title="Organisation"
          icon="users"
          iconBg="bg-navy-50"
          auto
          open={isOpen('org')}
          onToggle={() => toggleSektion('org')}
        >
          <InfoRad label="BAS-P" value="Nystad Energi AB" />
          <InfoRad label="BAS-U" value="Pollex AB · Erik Lindgren" />
          <InfoRad label="Skyddsombud" value="Anna Svensson · 070-123 45 67" />
          <InfoRad label="SOS Alarm" value="112" />
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Första hjälpen-ansvarig
            </label>
            <input
              className="input-field"
              placeholder="Namn och telefonnummer"
              value={forstaHjalp}
              onChange={e => setForstaHjalp(e.target.value)}
            />
          </div>
        </Section>

        {/* 3. Ordningsregler */}
        <Section
          title="Ordningsregler"
          icon="list-check"
          iconBg="bg-gold-50"
          open={isOpen('regler')}
          onToggle={() => toggleSektion('regler')}
        >
          <div className="flex flex-col gap-2.5 mb-3">
            {regler.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 group">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-800 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 flex-1 leading-relaxed">{r}</p>
                <button
                  onClick={() => removeRegel(i)}
                  className="text-gray-300 hover:text-danger-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {laggTillRegel ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="input-field text-xs"
                rows={2}
                placeholder="Skriv in ny ordningsregel..."
                value={nyRegel}
                onChange={e => setNyRegel(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setLaggTillRegel(false); setNyRegel('') }}
                  className="flex-1 text-xs text-gray-500 border border-gray-200 rounded-lg py-1.5 bg-white"
                >
                  Avbryt
                </button>
                <button
                  onClick={addRegel}
                  disabled={!nyRegel.trim()}
                  className="flex-1 text-xs bg-navy-800 text-white rounded-lg py-1.5 font-medium disabled:opacity-40"
                >
                  Lägg till
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setLaggTillRegel(true)}
              className="w-full border border-dashed border-navy-200 rounded-lg py-2 text-xs text-navy-600
                         flex items-center justify-center gap-1.5 hover:bg-navy-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Lägg till regel
            </button>
          )}
        </Section>

        {/* 4. Risker */}
        <Section
          title="Risker och åtgärder"
          icon="alert-triangle"
          iconBg="bg-danger-50"
          open={isOpen('risker')}
          onToggle={() => toggleSektion('risker')}
        >
          <div className="flex flex-col gap-2.5 mb-3">
            {risker.map(r => {
              const badge = nivaBadge(r.niva)
              return (
                <div key={r.id} className={`bg-cream-100 rounded-xl border-l-4 p-3 ${nivaBar(r.niva)}`}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-serif font-bold text-navy-800 flex-1 pr-2">{r.namn}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.atgard}</p>
                </div>
              )
            })}
          </div>
          <button
            className="w-full border border-dashed border-navy-200 rounded-lg py-2 text-xs text-navy-600
                       flex items-center justify-center gap-1.5 hover:bg-navy-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Lägg till risk
          </button>
        </Section>

        {/* 5. Underskrifter */}
        <Section
          title="Underskrifter"
          icon="pen"
          iconBg="bg-success-50"
          open={isOpen('sign')}
          onToggle={() => toggleSektion('sign')}
        >
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Publicera AMP:en för att skicka ut signeringsförfrågan till berörda.
          </p>
          {[
            { namn: 'Erik Lindgren', roll: 'BAS-U · Pollex AB' },
            { namn: 'Tommy Johansson', roll: 'Byggherren · Nystad Energi' },
            { namn: 'Anna Svensson', roll: 'Skyddsombud' },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between bg-cream-100 rounded-xl p-3 mb-2">
              <div>
                <div className="text-xs font-medium text-navy-800">{p.namn}</div>
                <div className="text-xs text-gray-400">{p.roll}</div>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-400">
                Väntar
              </span>
            </div>
          ))}
          <button
            className="w-full border border-dashed border-navy-200 rounded-lg py-2 text-xs text-navy-600
                       flex items-center justify-center gap-1.5 hover:bg-navy-50 transition-colors mt-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Lägg till person
          </button>
        </Section>

      </div>

      {/* Botten */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200
                      px-4 py-3 flex gap-3">
        <button className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 bg-cream-100">
          Spara utkast
        </button>
        <button
          onClick={handlePublicera}
          disabled={sparar}
          className="flex-2 bg-navy-800 text-white rounded-xl py-2.5 text-sm font-serif font-bold
                     flex-[2] disabled:opacity-70"
        >
          {sparar ? 'Publicerar...' : 'Publicera AMP →'}
        </button>
      </div>
    </div>
  )
}

function Section({
  title, icon, iconBg, auto, open, onToggle, children
}: {
  title: string
  icon: string
  iconBg: string
  auto?: boolean
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-cream-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-cream-100 hover:bg-cream-200 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${iconBg}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#0F2240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {icon === 'folder' && <><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></>}
              {icon === 'users' && <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>}
              {icon === 'list-check' && <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>}
              {icon === 'alert-triangle' && <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
              {icon === 'pen' && <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>}
            </svg>
          </div>
          <span className="font-serif font-bold text-sm text-navy-800">{title}</span>
          {auto && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                             bg-gold-50 text-gold-700 font-medium border border-gold-200">
              Auto
            </span>
          )}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

function InfoRad({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-cream-100 last:border-none">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-medium text-navy-800 text-right">{value}</span>
    </div>
  )
}
