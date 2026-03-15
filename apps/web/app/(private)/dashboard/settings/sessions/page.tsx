import SessionManagement from "@/features/auth/components/SessionManagement"
import { getAuthUser } from "@/features/auth/data/getAuthUser"
import { auth } from "@/lib/better-auth/auth"
import { Metadata } from "next"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Session",
}

export default async function SessionPage() {
  const { session } = await getAuthUser()
  const sessions = await auth.api.listSessions({ headers: await headers() })

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold">Sessions</h2>
      <SessionManagement
        sessions={sessions}
        currentSessionToken={session.token}
      />
    </div>
  )
}
