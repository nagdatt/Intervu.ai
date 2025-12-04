
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import { Toaster } from 'react-hot-toast'
import DashBoardPage from './pages/DashBoardPage.jsx'

function App() {
 const {isSignedIn,isLoaded} = useUser()
  if(!isLoaded){
    return null
  }
  return (
    <>

      <Routes>
        <Route path='/' element={!isSignedIn?<HomePage />:<Navigate to={"/dashboard"}/>} />
                <Route path='/dashboard' element={isSignedIn?<DashBoardPage />:<Navigate to={"/"}/>} />

        <Route path='/problems' element={isSignedIn===true?<ProblemsPage />:<Navigate to={"/"}/>} />

      </Routes>
    <Toaster toastOptions={{duration:3000}}/>

    </>
  )
}

export default App
