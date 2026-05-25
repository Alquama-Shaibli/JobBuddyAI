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
import ResumeUpload from './pages/resumeUpload'
import MockInterview from './pages/MockInterview'
import MockTests from './pages/MockTest'
import MockTestDetails from './pages/MockTestDetails'
import MyResults from './pages/MyResults'
import ResultDetails from './pages/ResultDetails'
import CreateMockTest from './pages/CreateMockTest'
import InterviewHistory from './pages/InterviewHistory'
import ChatBot from './components/ChatBot'
import AIFloatingChat from './components/AiFloatingChat'
import ResumeAnalyzer from './pages/ResumeAnalyzer'

function App() {


  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={2000} />
          <Header />
          <AIFloatingChat />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route
              path="/interview"
              element={
                <PrivateRoute>
                  <MockInterview />
                </PrivateRoute>
              }
            />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* <Routes> */}

            {/* ALL MOCK TESTS */}
            <Route
              path="/mock-test"
              element={
                <PrivateRoute>
                  <MockTests />
                </PrivateRoute>
              }
            />

            {/* SINGLE TEST PAGE */}
            <Route
              path="/mock-test/:id"
              element={
                <PrivateRoute>
                  <MockTestDetails />
                </PrivateRoute>
              }
            />

            {/* Result */}
            <Route
              path="/my-results"
              element={
                <PrivateRoute>
                  <MyResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/result/:id"
              element={
                <PrivateRoute>
                  <ResultDetails />
                </PrivateRoute>
              }
            />

            {/* test create */}
            <Route
              path="/mock-test/create"
              element={
                <PrivateRoute adminOnly={true}>
                  <CreateMockTest />
                </PrivateRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <PrivateRoute>
                  <MockInterview />
                </PrivateRoute>
              }
            />

            <Route
              path="/interview-history"
              element={
                  <PrivateRoute>
                      <InterviewHistory />
                  </PrivateRoute>
              }
            />

            <Route
              path="/ai-chat"
              element={
                  <PrivateRoute>
                      <ChatBot />
                  </PrivateRoute>
              }
            />

            <Route path="/resume-analyzer" 
            element={
              <PrivateRoute>
                <ResumeAnalyzer />
              </PrivateRoute>
            } />

            {/* </Routes> */}

            {/* <Route path='/jobs' element={<Jobs/>} /> */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App
