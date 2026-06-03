import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import AuthPage          from './pages/AuthPage'
import Header            from './components/Header'
import Home              from './pages/Home'
import Dashboard         from './pages/Dashboard'
import { AuthProvider }  from './context/AuthContext'
import PrivateRoute      from './routes/PrivateRoute'
import Profile           from './pages/Profile'
import JobRecommendations from './pages/JobRecommendations'
import ResumeUpload      from './pages/ResumeUpload'
import MockInterview     from './pages/MockInterview'
import MockTests         from './pages/MockTest'
import MockTestDetails   from './pages/MockTestDetails'
import MyResults         from './pages/MyResults'
import ResultDetails     from './pages/ResultDetails'
import CreateMockTest    from './pages/CreateMockTest'
import InterviewHistory  from './pages/InterviewHistory'
import ChatBot           from './components/ChatBot'
import AIFloatingChat    from './components/AiFloatingChat'
import ResumeAnalyzer    from './pages/ResumeAnalyzer'
import OnboardingWizard  from './pages/OnboardingWizard'
import NotFound          from './pages/NotFound'

// Hides Header + FloatingChat on auth / onboarding pages
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hiddenRoutes = ['/sign-in', '/sign-up', '/onboarding'];
  const isHidden = hiddenRoutes.includes(location.pathname);
  return (
    <div className="blueprint-grid min-h-screen">
      {!isHidden && <Header />}
      {!isHidden && <AIFloatingChat />}
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={2000} />
        <AppLayout>
          <Routes>
            {/* Public routes */}
            <Route path="/"          element={<Home />} />
            <Route path="/sign-up"   element={<AuthPage />} />
            <Route path="/sign-in"   element={<AuthPage />} />
            <Route path="/jobs"      element={<JobRecommendations />} />
            <Route path="/resume"    element={<ResumeUpload />} />

            {/* Onboarding — private, but skips the onboarding redirect itself */}
            <Route
              path="/onboarding"
              element={
                <PrivateRoute skipOnboardingCheck={true}>
                  <OnboardingWizard />
                </PrivateRoute>
              }
            />

            {/* Protected routes */}
            <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/interview"       element={<PrivateRoute><MockInterview /></PrivateRoute>} />
            <Route path="/interview-history" element={<PrivateRoute><InterviewHistory /></PrivateRoute>} />
            <Route path="/mock-test"       element={<PrivateRoute><MockTests /></PrivateRoute>} />
            <Route path="/mock-test/create" element={<PrivateRoute adminOnly={true}><CreateMockTest /></PrivateRoute>} />
            <Route path="/mock-test/:id"   element={<PrivateRoute><MockTestDetails /></PrivateRoute>} />
            <Route path="/my-results"      element={<PrivateRoute><MyResults /></PrivateRoute>} />
            <Route path="/result/:id"      element={<PrivateRoute><ResultDetails /></PrivateRoute>} />
            <Route path="/ai-chat"         element={<PrivateRoute><ChatBot /></PrivateRoute>} />
            <Route path="/resume-analyzer" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
