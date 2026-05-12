// DEMO-LÄGE — ingen Supabase behövs
// Byt ut denna fil mot den riktiga när du kopplar in Supabase

export function createClient() {
  return {
    auth: {
      signInWithOtp: async () => ({ error: null }),
      getUser: async () => ({
        data: {
          user: { id: 'demo-user-123', email: 'demo@sakrad.se' }
        }
      }),
      signOut: async () => ({ error: null }),
    },
    from: (tabell: string) => ({
      insert: (data: unknown) => ({
        select: () => ({
          single: async () => ({
            data: { id: 'demo-' + Date.now(), ...((data as Record<string, unknown>) ?? {}) },
            error: null,
          })
        })
      }),
      select: (kolumner?: string) => ({
        eq: (kol: string, val: unknown) => ({
          data: [],
          error: null,
        })
      }),
      update: (data: unknown) => ({
        eq: (kol: string, val: unknown) => ({
          data: null,
          error: null,
        })
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => ({
          data: { path },
          error: null,
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: URL.createObjectURL(new Blob()) }
        }),
      }),
    },
  }
}
