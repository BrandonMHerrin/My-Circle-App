import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        async getAll() {
          return await cookieStore.getAll()
        },
        async setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              await cookieStore.set(name, value, {
                ...options,
                httpOnly: false,
                path: "/",
                sameSite: "lax",
              })
            }
          } catch (error) {
            // Safe to ignore in SSR
          }
        },
      },
    }
  )
}
