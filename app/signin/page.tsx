import { Suspense } from 'react'
import SignIn from "@/components/signin";
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  
  return (
    <Suspense 
      fallback={<div className='w-screen h-screen flex items-center justify-center'>
        <Loader2 className='size-10 sm:size-14 md:size-16 text-purple-500 animate-spin' />
      </div>}> 
      <SignIn />
    </Suspense>
  )
}