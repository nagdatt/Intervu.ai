import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import React from 'react'
import toast from 'react-hot-toast'

function HomePage() {

  return (
    <>
    <button className='btn btn-primary' onClick={()=>{
        toast.success("This is success toast")
    }}>Test Home Button</button>
    <SignedOut>
        <SignInButton>
            <button className='btn btn-primary'>Login</button>
        </SignInButton>
    </SignedOut>
    <SignedIn>
        <SignOutButton>

              <button className='btn btn-secondary'>Logout</button>
        </SignOutButton>
    </SignedIn>
    <UserButton />
    </>
    
  )
}

export default HomePage