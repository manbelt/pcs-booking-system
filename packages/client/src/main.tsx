import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress browser extension related errors
  if (event.reason && typeof event.reason === 'object') {
    const errorMessage = event.reason.message || event.reason.toString()
    if (errorMessage.includes('message channel') ||
        errorMessage.includes('Extension context') ||
        errorMessage.includes('chrome-extension')) {
      event.preventDefault()
      return
    }
  }
  console.warn('PCS Booking: Unhandled promise rejection:', event.reason)
})

// Global error handler for runtime errors
window.addEventListener('error', (event) => {
  // Suppress browser extension related errors
  if (event.message && (
    event.message.includes('message channel') ||
    event.message.includes('Extension context') ||
    event.message.includes('chrome-extension') ||
    event.message.includes('Cannot read properties of undefined')
  )) {
    event.preventDefault()
    return
  }
  console.warn('PCS Booking: Runtime error:', event.error)
})

// Wait for DOM to be ready
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('pcs-booking-root')

    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement)
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
    } else {
      console.error('PCS Booking: Root element not found. Make sure to include the [pcs_booking] shortcode.')
    }
  } catch (error) {
    console.error('PCS Booking: Failed to initialize app:', error)
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
