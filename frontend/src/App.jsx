import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <h1>Intervu.ai</h1>
      <SignedOut>
        <SignInButton mode="modal" >
          <button>Sign Up Please</button>
        </SignInButton>
      </SignedOut>

        <SignedIn>
        <SignOutButton />
      </SignedIn>
    <UserButton/>

    </>
  )
}

export default App
