import { AppHeader } from '@/components/dashboard/AppHeader'
import { getProfileName, requireUser } from '@/lib/data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser()
  const name = await getProfileName()
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader name={name} email={user.email ?? ''} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
