import Link from 'next/link'

const mockProjekt = [
  {
    id: '1',
    namn: 'VA-ledning Storån etapp 2',
    byggherren: 'Nystad Energi AB',
    projekt_nummer: '101 200',
    entreprenad: 'ABT06',
    status: 'aktiv' as const,
    dokStatus: '3/3 signerat',
    progress: 72,
  },
  {
    id: '2',
    namn: 'Dagvattenledning Centrum',
    byggherren: 'Kommunfastigheter AB',
    projekt_nummer: '101 201',
    entreprenad: 'AB04',
    status: 'varning' as const,
    dokStatus: 'AMP saknas',
    progress: 35,
  },
  {
    id: '3',
    namn: 'Fjärrvärme Nord',
    byggherren: 'Energibolaget',
    projekt_nummer: '101 202',
    entreprenad: 'AB04',
    status: 'klart' as const,
    dokStatus: 'Klart',
    progress: 100,
  },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Mobil header — döljs på desktop */}
      <div className="lg:hidden bg-navy-800 px-5 pt-12 pb-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#0F2240" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-bold text-white">Säkrad</span>
        </div>
        <p className="text-navy-200 text-sm">God morgon</p>
        <h1 className="text-white text-xl mt-0.5">Projektöversikt</h1>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block mb-8">
        <p className="text-gray-500 text-sm">God morgon, Erik</p>
        <h1 className="font-serif text-3xl font-bold text-navy-800 mt-1">Projektöversikt</h1>
      </div>

      <div className="px-4 lg:px-0 py-5 lg:py-0 flex flex-col gap-5 lg:gap-8">

        {/* Snabbval */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-4">
          {[
            { href: '/dashboard/projekt/ny', label: 'Nytt projekt', cls: 'bg-navy-800 text-white' },
            { href: '/dashboard/rapportera', label: 'Rapportera', cls: 'bg-gold-500 text-navy-900' },
            { href: '/dashboard/projekt/1/amp', label: 'Skapa AMP', cls: 'bg-white text-navy-800 border border-gray-200' },
            { href: '/dashboard/projekt/1/riskbedomning', label: 'Riskbedömning', cls: 'bg-white text-navy-800 border border-gray-200' },
          ].map(s => (
            <Link key={s.href} href={s.href}
              className={`${s.cls} rounded-xl px-4 py-3 lg:py-4 text-sm font-medium
                         active:scale-95 transition-transform text-center lg:text-left`}>
              {s.label}
            </Link>
          ))}
        </div>

        {/* Projektkort */}
        <div>
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="font-serif text-base lg:text-lg font-bold text-navy-800">
              Aktiva projekt
            </h2>
            <Link href="/dashboard/projekt/ny"
              className="text-sm text-navy-600 hover:text-navy-800 hidden lg:block">
              + Nytt projekt
            </Link>
          </div>

          {/* Desktop: tabell / Mobil: kort */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Projekt</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Byggherren</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Form</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Framsteg</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {mockProjekt.map((p, i) => (
                  <tr key={p.id}
                    className={`border-b border-gray-50 last:border-none hover:bg-cream-100
                                transition-colors cursor-pointer`}>
                    <td className="px-5 py-4">
                      <div className="font-serif font-bold text-sm text-navy-800">{p.namn}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.projekt_nummer}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.byggherren}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{p.entreprenad}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full
                            ${p.status === 'varning' ? 'bg-gold-500' :
                              p.status === 'klart' ? 'bg-success-500' : 'bg-navy-800'}`}
                            style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{p.progress}%</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{p.dokStatus}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                        ${p.status === 'varning' ? 'bg-gold-50 text-gold-700 border border-gold-200' :
                          p.status === 'klart' ? 'bg-success-50 text-success-700' :
                          'bg-navy-50 text-navy-700'}`}>
                        {p.status === 'varning' ? 'Åtgärd' :
                         p.status === 'klart' ? 'Klart' : 'Aktiv'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/projekt/${p.id}`}
                        className="text-xs text-navy-600 hover:text-navy-800 font-medium">
                        Öppna →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil: kort */}
          <div className="lg:hidden flex flex-col gap-3">
            {mockProjekt.map(p => (
              <Link key={p.id} href={`/dashboard/projekt/${p.id}`}
                className={`bg-white rounded-xl border-l-4 p-4 active:scale-99 transition-transform
                  ${p.status === 'varning' ? 'border-l-gold-500' :
                    p.status === 'klart' ? 'border-l-success-500' : 'border-l-navy-800'}`}>
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-serif font-bold text-sm text-navy-800 flex-1 pr-2">{p.namn}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0
                    ${p.status === 'varning' ? 'bg-gold-50 text-gold-900 border border-gold-300' :
                      p.status === 'klart' ? 'bg-success-50 text-success-700' : 'bg-navy-50 text-navy-800'}`}>
                    {p.status === 'varning' ? 'Åtgärd' : p.status === 'klart' ? 'Klart' : 'Aktiv'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {p.byggherren} · {p.projekt_nummer} · {p.entreprenad}
                </p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full
                    ${p.status === 'varning' ? 'bg-gold-500' :
                      p.status === 'klart' ? 'bg-success-500' : 'bg-navy-800'}`}
                    style={{ width: `${p.progress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{p.dokStatus}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
