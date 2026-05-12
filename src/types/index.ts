export type Role = 'admin' | 'projektledare' | 'yrkesarbetare' | 'extern'

export type EntreprenadForm =
  | 'ab04'
  | 'abt06'
  | 'generalentreprenad'
  | 'samverkan'

export interface Organisation {
  id: string
  namn: string
  org_nummer?: string
  skapad_at: string
}

export interface Projekt {
  id: string
  org_id: string
  namn: string
  projekt_nummer?: string
  byggherren: string
  besoksadress?: string
  start_datum?: string
  slut_datum?: string
  entreprenad_form: EntreprenadForm
  bas_p_foretag?: string
  bas_p_person?: string
  bas_u_foretag?: string
  bas_u_person?: string
  skyddsombud_namn?: string
  skyddsombud_telefon?: string
  status: 'aktiv' | 'avslutat' | 'pausat'
  skapad_at: string
}

export interface Dokument {
  id: string
  projekt_id: string
  typ: 'amp' | 'riskbedomning' | 'arbetsberedning' | 'incident' | 'egenkontroll'
  titel: string
  status: 'utkast' | 'publicerat' | 'arkiverat'
  skapad_av: string
  skapad_at: string
  uppdaterad_at: string
}

export interface Anvandare {
  id: string
  email: string
  namn?: string
  roll: Role
  org_id: string
}
