import { useState, Component } from 'react'
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

/* ── Global Error Boundary ── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', background: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
          <h2 style={{ color: '#f87171', marginBottom: 16 }}>⚠ Runtime Error (check console for full trace)</h2>
          <pre style={{ background: '#1e293b', padding: 20, borderRadius: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#fca5a5', fontSize: 14 }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ background: '#1e293b', padding: 20, borderRadius: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#94a3b8', fontSize: 12, marginTop: 12 }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import Profile from './pages/Profile'
import JobRecommendations from './pages/JobRecommendations'
import ResumeUpload from './pages/ResumeUpload'
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
import OnboardingWizard from './pages/OnboardingWizard'
import NotFound from './pages/NotFound'

// Hides header on auth/onboarding pages
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
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={2000} />
          <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<ResumeUpload />} />

            {/* Onboarding — private but skips the onboarding check itself */}
            <Route
              path="/onboarding"
              element={
                <PrivateRoute skipOnboardingCheck={true}>
                  <OnboardingWizard />
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
            <Route path="/jobs" element={<JobRecommendations />} />
            <Route path="/sign-up" element={<AuthPage />} />
            <Route path="/sign-in" element={<AuthPage />} />
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

            <Route path="*" element={<NotFound />} />

          </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App
