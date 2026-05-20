import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import SignIn from './pages/SignIn'
import { Home } from './pages/Home'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'

function App() {


  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer position='top-right' autoClose={2000} />
          <Header/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/jobs' element={<Jobs/>} />
            <Route path='/sign-up' element={<SignUp/>} />
            <Route path='/sign-in' element={<SignIn/>} />
              <Route path='/profile' element={
                <PrivateRoute>
                  <Profile/>
                </PrivateRoute>
              } />
            <Route path='/dashboard' element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            } />
            {/* <Route path='/jobs' element={<Jobs/>} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
