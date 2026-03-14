import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import './index.css'
import { Toaster } from 'sonner'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          theme="dark"
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                '!bg-slate-900 !border-slate-700 !text-slate-100',
              title: '!text-slate-100',
              description: '!text-slate-400',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
