import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import './index.css'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

function ThemedToaster() {
  return (
    <Toaster
      theme="system"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            '!bg-white !border-slate-200 !text-slate-900 dark:!bg-slate-900 dark:!border-slate-700 dark:!text-slate-100',
          title: '!text-slate-900 dark:!text-slate-100',
          description: '!text-slate-600 dark:!text-slate-400',
        },
      }}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <ThemedToaster />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)
