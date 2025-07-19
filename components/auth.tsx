'use client'

import { signIn, signOut } from 'next-auth/react'

export const LoginButton = () => {
  return <button className='bg-custom-pearl text-black rounded-md p-2 mr-4' onClick={() => signIn()}>Sign in</button>
}

export const LogoutButton = () => {
  return <button className='bg-custom-wine-500 text-white hover:bg-custom-wine-600 rounded-md p-2 mr-4'  onClick={() => signOut()}>Sign Out</button>
}