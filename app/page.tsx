import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { User } from '@/components/user'
import { LoginButton, LogoutButton } from '@/components/auth'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className='p-4 space-y-4'>
      <LoginButton />
      <LogoutButton  />
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client Call</h2>
      <User />

      <br />
      <br />
      <Link href={"/profile"}>
        go to profile
      </Link>
    </main>
  )
}