import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BackgroundWrapper from './components/BackgroundWrapper.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BackgroundWrapper>
          <App />
        </BackgroundWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
