import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BookingForm from './components/BookingForm'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Routes>
          <Route path="/" element={<BookingForm />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
