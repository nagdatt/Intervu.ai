
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import { Toaster } from 'react-hot-toast'

function App() {
 const {isSignedIn} = useUser()
 console.log("isSignedIn:", isSignedIn);
  return (
    <>
      <h1 className='text-red-300'>Intervu.ai</h1>

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/problems' element={isSignedIn===true?<ProblemsPage />:<Navigate to={"/"}/>} />

      </Routes>
    <Toaster toastOptions={{duration:3000}}/>

    </>
  )
}

export default App
