import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vehicle } from '../types'
import { supabaseService } from '../lib/supabase'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  formSlug: string
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, vehicle, formSlug }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    duration_hours: 1,
    service_type: 'hourly',
    special_requests: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setLoading(true)
    setError('')

    try {
      const bookingData = {
        vehicle_id: vehicle.id,
        form_slug: formSlug,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        duration_hours: formData.duration_hours,
        service_type: formData.service_type as 'hourly' | 'airport' | 'custom',
        special_requests: formData.special_requests,
        wordpress_nonce: window.PCS_CFG.nonce,
        passenger_count: 1,
        vehicle_quantity: 1,
        pickup_address: '',
        dropoff_address: '',
        intermediate_stops: [],
        amenities: {
          champagne_bottles: 1,
          premium_water: true,
          flowers: false,
          decorations: false
        },
        entertainment_service: {
          type: 'none' as const,
          verified_age: false
        },
        driver_instructions: ''
      }

      const response = await supabaseService.createBooking(bookingData)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            booking_date: '',
            booking_time: '',
            duration_hours: 1,
            service_type: 'hourly',
            special_requests: ''
          })
        }, 2000)
      } else {
        setError(response.error || 'Failed to create booking')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    if (!vehicle || !formData.service_type) return 0

    if (formData.service_type === 'airport') {
      return vehicle.pricing.airport
    } else if (formData.service_type === 'hourly' && formData.duration_hours) {
      const hours = formData.duration_hours
      if (hours === 1) return vehicle.pricing.hour_1
      if (hours === 2) return vehicle.pricing.hour_2
      if (hours === 3) return vehicle.pricing.hour_3
      return Math.round(vehicle.pricing.hour_3 * (hours / 3))
    }
    return 0
  }

  if (!isOpen || !vehicle) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Book {vehicle.name}</h2>
            <button className="modal-close" onClick={onClose} type="button">
              ×
            </button>
          </div>

          {success ? (
            <div className="modal-body">
              <div className="success-message">
                <h3>Booking Request Submitted!</h3>
                <p>Thank you for your booking request. We'll contact you shortly to confirm the details.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error">{error}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customer_name">Full Name *</label>
                    <input
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customer_email">Email Address *</label>
                    <input
                      type="email"
                      id="customer_email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="customer_phone">Phone Number</label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="booking_date">Date *</label>
                    <input
                      type="date"
                      id="booking_date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking_time">Time</label>
                    <input
                      type="time"
                      id="booking_time"
                      name="booking_time"
                      value={formData.booking_time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="service_type">Service Type *</label>
                    <select
                      id="service_type"
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="hourly">Hourly Rental</option>
                      <option value="airport">Airport Transfer</option>
                      <option value="custom">Custom Service</option>
                    </select>
                  </div>
                  {formData.service_type === 'hourly' && (
                    <div className="form-group">
                      <label htmlFor="duration_hours">Duration (Hours) *</label>
                      <select
                        id="duration_hours"
                        name="duration_hours"
                        value={formData.duration_hours}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={1}>1 Hour</option>
                        <option value={2}>2 Hours</option>
                        <option value={3}>3 Hours</option>
                        <option value={4}>4 Hours</option>
                        <option value={5}>5 Hours</option>
                        <option value={6}>6 Hours</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="special_requests">Special Requests</label>
                  <textarea
                    id="special_requests"
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                <div className="pricing-summary">
                  <h4>Estimated Price: €{calculatePrice()}</h4>
                  <p className="pricing-note">Final price will be confirmed upon booking approval.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookingModal
