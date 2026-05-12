'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

type DokStatus = 'klar' | 'vantar' | 'utkast' | 'saknas'

type Dokument = {
  id: string
  typ: string
  titel: string
  status: DokStatus
  signerat: number
  totalt: number
  href: string
}

type Observation = {
  id: string
  kategori: 'risk' | 'skada' | 'bra'
  beskrivning: string
  plats: string
  tid: string
  av: string
  bild: boolean
}

const MOCK_PROJEKT = {
  id: '1',
  namn: 'VA-ledning Storån etapp 2',
  projekt_nummer: '101 200',
  byggherren: 'Nystad Energi AB',
  besoksadress: 'Storågatan 4, Nystad',
  entreprenad_form: 'ABT06',
  start_datum: '2026-03-01',
  slut_datum: '2026-10-31',
  status: 'aktiv',
  bas_p_foretag: 'Nystad Energi AB',
  bas_p_person: 'Tommy Johansson',
  bas_u_foretag: 'Pollex AB',
  bas_u_person: 'Erik Lindgren',
  skyddsombud_namn: 'Anna Svensson',
  skyddsombud_telefon: '070-123 45 67',
}

const MOCK_DOKUMENT: Dokument[] = [
  { id: 'd1', typ: 'amp', titel: 'Arbetsmiljöplan (AMP)', status: 'vantar', signerat: 1, totalt: 3, href: 'amp' },
  { id: 'd2', typ: 'risk', titel: 'Riskbedömning', status: 'utkast', signerat: 0, totalt: 3, href: 'riskbedomning' },
  { id: 'd3', typ: 'arbetsberedning', titel: 'Arbetsberedning schakt', status: 'saknas', signerat: 0, totalt: 0, href: 'riskbedomning' },
]

const MOCK_OBS: Observation[] = [
  { id: 'o1', kategori: 'risk', beskrivning: 'Löst räcke vid schaktgropen sektion B', plats: 'Sektion B', tid: 'Idag 08:42', av: 'Kalle S.', bild: true },
  { id: 'o2', kategori: 'bra', beskrivning: 'Spontlåda korrekt monterad hela sträckan', plats: 'Sektion A', tid: 'Igår 14:10', av: 'Erik L.', bild: false },
]

function dokStatusStilar(s: DokStatus) {
  if (s === 'klar') return { badge: 'bg-success-50 text-success-700', text: 'Klar', border: 'border-l-success-500' }
  if (s === 'vantar') return { badge: 'bg-gold-50 text-gold-700', text: 'Väntar', border: 'border-l-gold-500' }
  if (s === 'utkast') return { badge: 'bg-navy-50 text-navy-600', text: 'Utkast', border: 'border-l-navy-400' }
  return { badge: 'bg-cream-200 text-gray-500', text: 'Saknas', border: 'border-l-gray-300' }
}

function obsKatStilar(k: Observation['kategori']) {
  if (k === 'risk') return { bg: 'bg-danger-50', icon: 'text-danger-600', label: 'Risk' }
  if (k === 'skada') return { bg: 'bg-gold-50', icon: 'text-gold-600', label: 'Skada' }
  return { bg: 'bg-success-50', icon: 'text-success-600', label: 'Bra' }
}

type Tab = 'oversikt' | 'dokument' | 'observationer'

export default function ProjektDetaljPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [tab, setTab] = useState<Tab>('oversikt')

  const p = MOCK_PROJEKT
  const klartaDok = MOCK_DOKUMENT.filter(d => d.status === 'klar').length
  const totaltDok = MOCK_DOKUMENT.length
  const progress = Math.round((klartaDok / totaltDok) * 100)

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">

      {/* Header */}
      <div className="bg-navy-800 px-5 pt-12 pb-0 flex-shrink-0">
        <button onClick={() => router.back()}
          className="text-navy-200 text-sm flex items-center gap-1.5 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Tillbaka
        </button>

        <h1 className="text-white font-serif text-lg font-bold leading-tight">
          {p.namn}
        </h1>
        <p className="text-navy-200 text-xs mt-1 mb-4">
          {p.byggherren} · {p.projekt_nummer} · {p.entreprenad_form}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-navy-200">{klartaDok} av {totaltDok} dokument klara</span>
            <span className="text-xs text-gold-500 font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full transition-all"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 -mb-px">
          {([
            { key: 'oversikt', label: 'Översikt' },
            { key: 'dokument', label: 'Dokument' },
            { key: 'observationer', label: 'Observationer' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors
                ${tab === t.key
                  ? 'border-gold-500 text-gold-500'
                  : 'border-transparent text-navy-300 hover:text-navy-100'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Innehåll */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* ÖVERSIKT */}
        {tab === 'oversikt' && (
          <div className="px-4 py-5 flex flex-col gap-4">

            {/* Snabbåtgärder */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link href={`/dashboard/projekt/${id}/amp`}
                className="bg-navy-800 text-white rounded-xl px-4 py-3 text-xs font-semibold
                           flex items-center gap-2 active:scale-95 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Öppna AMP
              </Link>
              <Link href={`/dashboard/projekt/${id}/riskbedomning`}
                className="bg-white border border-gray-200 text-navy-800 rounded-xl px-4 py-3
                           text-xs font-semibold flex items-center gap-2 active:scale-95 transition-transform">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Riskbedömning
              </Link>
              <Link href="/dashboard/rapportera"
                className="bg-gold-500 text-navy-900 rounded-xl px-4 py-3 text-xs font-semibold
                           flex items-center gap-2 active:scale-95 transition-transform col-span-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Rapportera observation
              </Link>
            </div>

            {/* Projektinfo */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-serif text-sm font-bold text-navy-800">Projektinfo</h2>
              </div>
              <div className="px-4 py-3 flex flex-col divide-y divide-cream-100">
                {[
                  { k: 'Adress', v: p.besoksadress },
                  { k: 'Entreprenadform', v: p.entreprenad_form },
                  { k: 'Startdatum', v: p.start_datum },
                  { k: 'Slutdatum', v: p.slut_datum },
                  { k: 'Status', v: p.status.charAt(0).toUpperCase() + p.status.slice(1) },
                ].map(r => (
                  <div key={r.k} className="flex justify-between items-center py-2">
                    <span className="text-xs text-gray-400">{r.k}</span>
                    <span className="text-xs font-medium text-navy-800">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organisation */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-serif text-sm font-bold text-navy-800">Organisation</h2>
              </div>
              <div className="px-4 py-3 flex flex-col divide-y divide-cream-100">
                {[
                  { k: 'BAS-P', v: `${p.bas_p_foretag}`, sub: p.bas_p_person },
                  { k: 'BAS-U', v: `${p.bas_u_foretag}`, sub: p.bas_u_person },
                  { k: 'Skyddsombud', v: p.skyddsombud_namn, sub: p.skyddsombud_telefon },
                ].map(r => (
                  <div key={r.k} className="flex justify-between items-center py-2">
                    <span className="text-xs text-gray-400">{r.k}</span>
                    <div className="text-right">
                      <div className="text-xs font-medium text-navy-800">{r.v}</div>
                      {r.sub && <div className="text-xs text-gray-400">{r.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* DOKUMENT */}
        {tab === 'dokument' && (
          <div className="px-4 py-5 flex flex-col gap-3">
            {MOCK_DOKUMENT.map(d => {
              const s = dokStatusStilar(d.status)
              return (
                <Link
                  key={d.id}
                  href={`/dashboard/projekt/${id}/${d.href}`}
                  className={`bg-white rounded-xl border-l-4 p-4 flex items-center gap-3
                             active:scale-98 transition-transform ${s.border}`}
                >
                  <div className="w-9 h-9 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#0F2240" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-serif font-bold text-navy-800 truncate">
                      {d.titel}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {d.status === 'saknas'
                        ? 'Inte skapad ännu'
                        : `${d.signerat} av ${d.totalt} signerat`}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                      {s.text}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              )
            })}

            {/* Skapa nytt dokument */}
            <button className="w-full border border-dashed border-navy-200 rounded-xl py-3
                               text-sm text-navy-600 flex items-center justify-center gap-2
                               hover:bg-navy-50 transition-colors mt-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Lägg till dokument
            </button>
          </div>
        )}

        {/* OBSERVATIONER */}
        {tab === 'observationer' && (
          <div className="px-4 py-5 flex flex-col gap-3">
            {MOCK_OBS.map(o => {
              const s = obsKatStilar(o.kategori)
              return (
                <div key={o.id}
                  className="bg-white rounded-xl p-4 flex gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                    {o.kategori === 'risk' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className={s.icon}>
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    )}
                    {o.kategori === 'bra' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className={s.icon}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-semibold ${s.icon}`}>{s.label}</span>
                      {o.bild && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                            <circle cx="12" cy="13" r="4"/>
                          </svg>
                          Bild
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-800 leading-relaxed">{o.beskrivning}</p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {o.av} · {o.plats} · {o.tid}
                    </p>
                  </div>
                </div>
              )
            })}

            {MOCK_OBS.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-400">Inga observationer ännu</p>
              </div>
            )}

            <Link href="/dashboard/rapportera"
              className="w-full bg-gold-500 text-navy-900 rounded-xl py-3 text-sm
                         font-serif font-bold flex items-center justify-center gap-2
                         active:scale-98 transition-transform mt-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Rapportera observation
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
