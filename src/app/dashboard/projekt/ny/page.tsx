'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ENT_KLICKBARA = [
  {
    key: 'abt06',
    label: 'Totalentreprenad',
    desc: 'ABT06 — ni designar och utför',
    basp: 'Ditt företag',
    basu: 'Ditt företag',
    hint: 'Vid ABT06 kan ni vara både BAS-P och BAS-U om ni ansvarar för projektering och utförande.',
  },
  {
    key: 'ab04',
    label: 'Utförandeentreprenad',
    desc: 'AB04 — byggherren designar, ni utför',
    basp: 'Byggherren',
    basu: 'Ditt företag',
    hint: 'Vid AB04 är byggherren normalt BAS-P. Ni tar BAS-U om det framgår av handlingarna.',
  },
]

type Step = 0 | 1 | 2

export default function NyttProjektPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    namn: '',
    projekt_nummer: '',
    byggherren: '',
    gata: '',
    gata_nummer: '',
    ort: '',
    start_datum: '',
    slut_datum: '',
    entreprenad_form: '',
    annan_entreprenad: '',
    bas_p_foretag: '',
    bas_p_person: '',
    bas_u_foretag: '',
    bas_u_person: '',
    skyddsombud_namn: '',
    skyddsombud_telefon: '',
  })

  const selectedEnt = ENT_KLICKBARA.find(o => o.key === form.entreprenad_form)
  const step0Valid = form.namn.trim() && form.byggherren.trim()
  const step1Valid = form.entreprenad_form === 'annan'
    ? form.annan_entreprenad.trim().length > 0
    : form.entreprenad_form !== ''

  function selectKlickbar(opt: typeof ENT_KLICKBARA[0]) {
    setForm(f => ({
      ...f,
      entreprenad_form: opt.key,
      annan_entreprenad: '',
      bas_p_foretag: opt.basp,
      bas_u_foretag: opt.basu,
    }))
  }

  function handleAnnan(val: string) {
    setForm(f => ({
      ...f,
      entreprenad_form: val.trim() ? 'annan' : '',
      annan_entreprenad: val,
      bas_p_foretag: '',
      bas_u_foretag: '',
    }))
  }

  async function handleCreate() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    // Demo: navigera till projektdetaljsidan
    router.push('/dashboard/projekt/1')
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="bg-navy-800 px-5 pt-12 pb-5">
        <button
          onClick={() => step > 0 ? setStep((step - 1) as Step) : router.back()}
          className="text-navy-200 text-sm flex items-center gap-1.5 mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {step > 0 ? 'Tillbaka' : 'Avbryt'}
        </button>
        <h1 className="text-white text-xl font-serif font-bold">Nytt projekt</h1>
        <p className="text-navy-200 text-sm mt-0.5">Steg {step + 1} av 3</p>
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
              ${i <= step ? 'bg-gold-500' : 'bg-navy-600'}`} />
          ))}
        </div>
      </div>

      <div className="px-4 py-6">

        {/* STEG 0 */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Projektnamn *</label>
              <input className="input-field" placeholder="t.ex. VA-ledning Storån etapp 2"
                value={form.namn} onChange={e => setForm(f => ({ ...f, namn: e.target.value }))} autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Projektnummer</label>
                <input className="input-field" placeholder="101 202"
                  value={form.projekt_nummer} onChange={e => setForm(f => ({ ...f, projekt_nummer: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Byggherren *</label>
                <input className="input-field" placeholder="Företag / Kommun"
                  value={form.byggherren} onChange={e => setForm(f => ({ ...f, byggherren: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Byggplatsens adress</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                <div className="col-span-3">
                  <input className="input-field" placeholder="Gatunamn"
                    value={form.gata} onChange={e => setForm(f => ({ ...f, gata: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <input className="input-field" placeholder="Nr"
                    value={form.gata_nummer} onChange={e => setForm(f => ({ ...f, gata_nummer: e.target.value }))} />
                </div>
              </div>
              <input className="input-field" placeholder="Ort"
                value={form.ort} onChange={e => setForm(f => ({ ...f, ort: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Projektperiod</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Från</label>
                  <input type="date" className="input-field"
                    value={form.start_datum} onChange={e => setForm(f => ({ ...f, start_datum: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Till</label>
                  <input type="date" className="input-field"
                    value={form.slut_datum} onChange={e => setForm(f => ({ ...f, slut_datum: e.target.value }))} />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mt-2" disabled={!step0Valid} onClick={() => setStep(1)}>
              Nästa →
            </button>
          </div>
        )}

        {/* STEG 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {ENT_KLICKBARA.map(opt => (
                <button key={opt.key} onClick={() => selectKlickbar(opt)}
                  className={`text-left p-4 rounded-xl border-2 transition-all
                    ${form.entreprenad_form === opt.key
                      ? 'border-navy-600 bg-navy-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2
                    ${form.entreprenad_form === opt.key ? 'bg-navy-800' : 'bg-navy-50'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={form.entreprenad_form === opt.key ? '#E8A020' : '#0F2240'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="font-serif font-bold text-xs text-navy-800 mb-0.5">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Annan form — skriv in</label>
              <input className={`input-field ${form.entreprenad_form === 'annan' ? 'border-navy-600 ring-2 ring-navy-100' : ''}`}
                placeholder="t.ex. Samverkan, Generalentreprenad..."
                value={form.annan_entreprenad} onChange={e => handleAnnan(e.target.value)} />
            </div>
            {selectedEnt && (
              <div className="bg-gold-50 border border-gold-200 rounded-xl p-3.5">
                <p className="text-xs text-gold-900 leading-relaxed">
                  <span className="font-semibold">Roller föreslås: </span>{selectedEnt.hint}
                </p>
              </div>
            )}
            <button className="btn-primary w-full" disabled={!step1Valid} onClick={() => setStep(2)}>
              Nästa →
            </button>
          </div>
        )}

        {/* STEG 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {[
              { label: 'BAS-P', auto: form.entreprenad_form !== 'annan', foretag: 'bas_p_foretag', person: 'bas_p_person' },
              { label: 'BAS-U', auto: form.entreprenad_form !== 'annan', foretag: 'bas_u_foretag', person: 'bas_u_person' },
            ].map(r => (
              <div key={r.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{r.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-navy-50 text-navy-600 font-medium">
                    {r.auto ? 'Auto' : 'Manuellt'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Företag</label>
                    <input className="input-field text-xs"
                      value={form[r.foretag as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [r.foretag]: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Kontaktperson</label>
                    <input className="input-field text-xs" placeholder="Namn"
                      value={form[r.person as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [r.person]: e.target.value }))} />
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Skyddsombud</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-gray-600 font-medium">Manuellt</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Namn</label>
                  <input className="input-field text-xs" placeholder="Namn"
                    value={form.skyddsombud_namn}
                    onChange={e => setForm(f => ({ ...f, skyddsombud_namn: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Telefon</label>
                  <input className="input-field text-xs" placeholder="070-xxx xx xx" type="tel"
                    value={form.skyddsombud_telefon}
                    onChange={e => setForm(f => ({ ...f, skyddsombud_telefon: e.target.value }))} />
                </div>
              </div>
            </div>
            <button className="btn-accent w-full" disabled={saving} onClick={handleCreate}>
              {saving ? 'Skapar projekt...' : 'Skapa projekt'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
