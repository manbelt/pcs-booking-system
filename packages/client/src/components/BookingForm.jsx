import React from 'react'
import { Car, Phone, Mail, Calendar } from 'lucide-react'

const BookingForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-[#c5a46d] mr-3" />
            <h1 className="playfair text-4xl font-bold text-white">
              Private Car Service Paris
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Luxury limousine booking platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="playfair text-2xl font-semibold text-white mb-6 text-center">
            Book Your Luxury Experience
          </h2>

          <form className="space-y-6">
            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a46d] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a46d] focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            {/* Service Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Service Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c5a46d] focus:border-transparent"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Service Type
              </label>
              <select className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#c5a46d] focus:border-transparent">
                <option value="">Select a service</option>
                <option value="airport">Airport Transfer</option>
                <option value="city">City Tour</option>
                <option value="business">Business Meeting</option>
                <option value="event">Special Event</option>
                <option value="wedding">Wedding</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#c5a46d] hover:bg-[#b8956a] text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Book Your Luxury Experience
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-slate-300 text-sm">
              Need immediate assistance? Call us at{' '}
              <a href="tel:+33123456789" className="text-[#c5a46d] hover:underline">
                +33 1 23 45 67 89
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
