import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vehicle, BookingFormData, ItineraryStop } from '../types'
import { supabaseService } from '../lib/supabase'
import IncrementDecrementInput from './IncrementDecrementInput'
import AirportTransferForm, { AirportTransferData } from './AirportTransferForm'
import InternationalPhoneInput from './InternationalPhoneInput'
import { getThemesByAge, getThemeById } from '../utils/birthdayThemes'

interface EnhancedBookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  formSlug: string
}

const EnhancedBookingModal: React.FC<EnhancedBookingModalProps> = ({ isOpen, onClose, vehicle, formSlug }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const [airportTransferData, setAirportTransferData] = useState<AirportTransferData>({
    airport: '',
    transfer_type: 'arrival',
    flight_number: '',
    flight_time: '',
    airline: '',
    terminal: ''
  })

  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    booking_time: '',
    duration_hours: 1,
    service_type: 'hourly',
    special_requests: '',
    passenger_count: 1,
    vehicle_quantity: 1,
    pickup_address: '',
    dropoff_address: '',
    intermediate_stops: [],
    amenities: {
      champagne_bottles: 1,
      premium_water: true,
      flowers: false,
      decorations: false,
      birthday_decorations: false
    },
    entertainment_service: {
      type: 'none',
      verified_age: false
    },
    driver_instructions: ''
  })
  
  const [itineraryStops, setItineraryStops] = useState<ItineraryStop[]>([])
  const [showEntertainment, setShowEntertainment] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  // Auto-scroll to top when step changes (mobile optimization)
  useEffect(() => {
    if (modalContentRef.current) {
      const isMobile = window.innerWidth <= 768
      if (isMobile) {
        modalContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }, [currentStep])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Airport names mapping
  const airportNames = {
    'cdg': 'Charles de Gaulle Airport (CDG)',
    'ory': 'Orly Airport (ORY)',
    'lbg': 'Le Bourget Airport (LBG)'
  }

  // Auto-populate pickup address when airport transfer is selected
  useEffect(() => {
    if (formData.service_type === 'airport' && airportTransferData.airport && airportTransferData.transfer_type === 'arrival') {
      const airportName = airportNames[airportTransferData.airport as keyof typeof airportNames];
      if (airportName && formData.pickup_address !== airportName) {
        setFormData(prev => ({
          ...prev,
          pickup_address: airportName
        }));
      }
    }
  }, [formData.service_type, airportTransferData.airport, airportTransferData.transfer_type])

  // Calculate if additional vehicles are needed
  const needsAdditionalVehicles = (formData.passenger_count || 1) > 8
  const requiredVehicles = Math.ceil((formData.passenger_count || 1) / 8)

  // Calculate pricing with multi-vehicle discount
  const calculateTotalPrice = () => {
    if (!vehicle || !formData.service_type) return 0

    let basePrice = 0
    if (formData.service_type === 'airport') {
      basePrice = vehicle.pricing.airport
    } else if (formData.service_type === 'hourly' && formData.duration_hours) {
      const hours = formData.duration_hours
      if (hours === 1) basePrice = vehicle.pricing.hour_1
      else if (hours === 2) basePrice = vehicle.pricing.hour_2
      else if (hours === 3) basePrice = vehicle.pricing.hour_3
      else basePrice = Math.round(vehicle.pricing.hour_3 * (hours / 3))
    }

    // Calculate vehicle costs with multi-vehicle discount
    let vehicleCost = basePrice
    if (requiredVehicles > 1) {
      // First vehicle at full price, additional vehicles at 10% discount
      vehicleCost = basePrice + (basePrice * 0.9 * (requiredVehicles - 1))
    }

    // Add amenities cost
    const amenitiesCost = calculateAmenitiesCost()
    
    // Add entertainment service cost
    const entertainmentCost = calculateEntertainmentCost()

    return vehicleCost + amenitiesCost + entertainmentCost
  }

  const calculateAmenitiesCost = () => {
    let cost = 0
    const amenities = formData.amenities
    if (amenities) {
      // Additional champagne bottles (first one included)
      if (amenities.champagne_bottles > 1) {
        cost += (amenities.champagne_bottles - 1) * 50
      }
      if (amenities.flowers) cost += 75
      if (amenities.decorations) cost += 100

      // Birthday decorations
      if (amenities.birthday_decorations && amenities.birthday_theme) {
        const theme = getThemeById(amenities.birthday_theme)
        if (theme) {
          cost += theme.price
        }
      }
    }
    return cost
  }

  const calculateEntertainmentCost = () => {
    if (formData.entertainment_service?.type !== 'none') {
      return 200 // Base entertainment service fee
    }
    return 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name.startsWith('amenities.')) {
      const amenityKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities!,
          [amenityKey]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
        }
      }))
    } else if (name.startsWith('entertainment_service.')) {
      const serviceKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        entertainment_service: {
          ...prev.entertainment_service!,
          [serviceKey]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
      }))
    }
  }

  const addItineraryStop = () => {
    const newStop: ItineraryStop = {
      id: Date.now().toString(),
      address: '',
      order: itineraryStops.length + 1,
      type: 'intermediate'
    }
    setItineraryStops([...itineraryStops, newStop])
  }

  const updateItineraryStop = (id: string, address: string) => {
    setItineraryStops(stops => 
      stops.map(stop => 
        stop.id === id ? { ...stop, address } : stop
      )
    )
    
    // Update form data
    const addresses = itineraryStops
      .filter(stop => stop.id !== id || address)
      .map(stop => stop.id === id ? address : stop.address)
      .filter(addr => addr.trim())
    
    setFormData(prev => ({
      ...prev,
      intermediate_stops: addresses
    }))
  }

  const removeItineraryStop = (id: string) => {
    const updatedStops = itineraryStops.filter(stop => stop.id !== id)
    setItineraryStops(updatedStops)
    
    setFormData(prev => ({
      ...prev,
      intermediate_stops: updatedStops.map(stop => stop.address).filter(addr => addr.trim())
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setLoading(true)
    setError('')

    try {
      const bookingData: BookingFormData = {
        vehicle_id: vehicle.id,
        form_slug: formSlug,
        customer_name: formData.customer_name!,
        customer_email: formData.customer_email!,
        customer_phone: formData.customer_phone,
        booking_date: formData.booking_date!,
        booking_time: formData.booking_time,
        duration_hours: formData.duration_hours,
        service_type: formData.service_type as 'hourly' | 'airport' | 'custom',
        special_requests: formData.special_requests,
        wordpress_nonce: window.PCS_CFG.nonce,
        passenger_count: formData.passenger_count!,
        vehicle_quantity: requiredVehicles,
        pickup_address: formData.pickup_address!,
        dropoff_address: formData.dropoff_address!,
        intermediate_stops: formData.intermediate_stops!,
        amenities: formData.amenities!,
        entertainment_service: formData.entertainment_service,
        driver_instructions: formData.driver_instructions
      }

      const response = await supabaseService.createBooking(bookingData)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setCurrentStep(1)
          // Reset form data
          setFormData({
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            booking_date: '',
            booking_time: '',
            duration_hours: 1,
            service_type: 'hourly',
            special_requests: '',
            passenger_count: 1,
            vehicle_quantity: 1,
            pickup_address: '',
            dropoff_address: '',
            intermediate_stops: [],
            amenities: {
              champagne_bottles: 1,
              premium_water: true,
              flowers: false,
              decorations: false,
              birthday_decorations: false
            },
            entertainment_service: {
              type: 'none',
              verified_age: false
            },
            driver_instructions: ''
          })
          setItineraryStops([])
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

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
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
          ref={modalContentRef}
          className="enhanced-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Book {vehicle.name}</h2>
            <div className="step-indicator">
              <span className={currentStep >= 1 ? 'active' : ''}>1</span>
              <span className={currentStep >= 2 ? 'active' : ''}>2</span>
              <span className={currentStep >= 3 ? 'active' : ''}>3</span>
              <span className={currentStep >= 4 ? 'active' : ''}>4</span>
            </div>
            <button className="modal-close" onClick={onClose} type="button">
              ×
            </button>
          </div>

          {success ? (
            <div className="modal-body">
              <div className="success-message">
                <h3>Booking Request Submitted!</h3>
                <p>Thank you for your booking request. We'll contact you shortly to confirm the details.</p>
                <div className="booking-summary">
                  <p><strong>Total Price:</strong> €{calculateTotalPrice()}</p>
                  {requiredVehicles > 1 && (
                    <p><strong>Vehicles Required:</strong> {requiredVehicles} (10% discount applied to additional vehicles)</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error">{error}</div>}
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <h3>Personal Information</h3>
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
                      <label>Phone Number *</label>
                      <InternationalPhoneInput
                        value={formData.customer_phone || ''}
                        onChange={(value) => setFormData(prev => ({ ...prev, customer_phone: value }))}
                        placeholder="Enter your phone number"
                        required
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

                    <IncrementDecrementInput
                      label="Number of Passengers *"
                      value={formData.passenger_count || 1}
                      onChange={(value) => setFormData(prev => ({ ...prev, passenger_count: value }))}
                      min={1}
                      max={20}
                      suffix={formData.passenger_count === 1 ? 'passenger' : 'passengers'}
                    />
                    {needsAdditionalVehicles && (
                      <p className="form-note">
                        <strong>Note:</strong> {requiredVehicles} vehicles required for {formData.passenger_count} passengers.
                        Additional vehicles receive a 10% discount.
                      </p>
                    )}
                  </div>
                )}

                {/* Step 2: Service Details */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <h3>Service Details</h3>
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
                        <IncrementDecrementInput
                          label="Duration (Hours) *"
                          value={formData.duration_hours || 1}
                          onChange={(value) => setFormData(prev => ({ ...prev, duration_hours: value }))}
                          min={1}
                          max={10}
                          suffix={formData.duration_hours === 1 ? 'hour' : 'hours'}
                        />
                      )}

                      {formData.service_type === 'airport' && (
                        <AirportTransferForm
                          data={airportTransferData}
                          onChange={setAirportTransferData}
                        />
                      )}
                    </div>

                    <div className="pricing-preview">
                      <h4>Estimated Price: €{calculateTotalPrice()}</h4>
                      {requiredVehicles > 1 && (
                        <p className="multi-vehicle-note">
                          {requiredVehicles} vehicles required • 10% discount on additional vehicles
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Itinerary & Amenities */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <h3>Itinerary & Amenities</h3>

                    {/* Addresses */}
                    <div className="itinerary-section">
                      <h4>Pickup & Drop-off</h4>
                      <div className="form-group">
                        <label htmlFor="pickup_address">Pickup Address *</label>
                        <input
                          type="text"
                          id="pickup_address"
                          name="pickup_address"
                          value={formData.pickup_address}
                          onChange={handleInputChange}
                          placeholder="Enter pickup address"
                          required
                        />
                      </div>

                      {/* Intermediate Stops */}
                      {itineraryStops.map((stop, index) => (
                        <div key={stop.id} className="form-group intermediate-stop">
                          <label htmlFor={`stop_${stop.id}`}>Stop {index + 1}</label>
                          <div className="stop-input-group">
                            <input
                              type="text"
                              id={`stop_${stop.id}`}
                              value={stop.address}
                              onChange={(e) => updateItineraryStop(stop.id, e.target.value)}
                              placeholder="Enter stop address"
                            />
                            <button
                              type="button"
                              className="btn-remove-stop"
                              onClick={() => removeItineraryStop(stop.id)}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="btn btn-add-stop"
                        onClick={addItineraryStop}
                      >
                        + Add Stop
                      </button>

                      <div className="form-group">
                        <label htmlFor="dropoff_address">Drop-off Address *</label>
                        <input
                          type="text"
                          id="dropoff_address"
                          name="dropoff_address"
                          value={formData.dropoff_address}
                          onChange={handleInputChange}
                          placeholder="Enter drop-off address"
                          required
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="amenities-section">
                      <h4>Premium Amenities</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="amenities.champagne_bottles">Champagne Bottles</label>
                          <select
                            id="amenities.champagne_bottles"
                            name="amenities.champagne_bottles"
                            value={formData.amenities?.champagne_bottles}
                            onChange={handleInputChange}
                          >
                            {Array.from({ length: 5 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>
                                {num} bottle{num > 1 ? 's' : ''} {num === 1 ? '(included)' : `(+€${(num - 1) * 50})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="amenity-checkboxes">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="amenities.flowers"
                            checked={formData.amenities?.flowers}
                            onChange={handleInputChange}
                          />
                          Fresh Flowers (+€75)
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="amenities.decorations"
                            checked={formData.amenities?.decorations}
                            onChange={handleInputChange}
                          />
                          Special Decorations (+€100)
                        </label>
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="amenities.birthday_decorations"
                            checked={formData.amenities?.birthday_decorations}
                            onChange={handleInputChange}
                          />
                          Birthday Decorations (Age-specific themes)
                        </label>
                      </div>

                      {/* Birthday Decorations Details */}
                      {formData.amenities?.birthday_decorations && (
                        <div className="birthday-decorations-section">
                          <h5>🎂 Birthday Decoration Details</h5>
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="birthday_person_age">Birthday Person's Age *</label>
                              <IncrementDecrementInput
                                value={formData.amenities?.birthday_person_age || 1}
                                onChange={(value) => setFormData(prev => ({
                                  ...prev,
                                  amenities: {
                                    ...prev.amenities!,
                                    birthday_person_age: value
                                  }
                                }))}
                                min={1}
                                max={120}
                                suffix="years old"
                              />
                            </div>
                          </div>

                          {formData.amenities?.birthday_person_age && (
                            <div className="form-group">
                              <label htmlFor="birthday_theme">Decoration Theme *</label>
                              <select
                                id="birthday_theme"
                                value={formData.amenities?.birthday_theme || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  amenities: {
                                    ...prev.amenities!,
                                    birthday_theme: e.target.value
                                  }
                                }))}
                                required
                              >
                                <option value="">Select a theme</option>
                                {getThemesByAge(formData.amenities.birthday_person_age).map(theme => (
                                  <option key={theme.id} value={theme.id}>
                                    {theme.name} (+€{theme.price})
                                  </option>
                                ))}
                              </select>
                              {formData.amenities?.birthday_theme && (
                                <div className="theme-description">
                                  <p>{getThemeById(formData.amenities.birthday_theme)?.description}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="amenities-cost">
                        <p><strong>Amenities Total: €{calculateAmenitiesCost()}</strong></p>
                      </div>
                    </div>

                    {/* Entertainment Services */}
                    <div className="entertainment-section">
                      <h4>Entertainment Services (Optional)</h4>
                      <button
                        type="button"
                        className="collapsible-header"
                        onClick={() => setShowEntertainment(!showEntertainment)}
                      >
                        {showEntertainment ? 'Hide' : 'Show'} Entertainment Options
                      </button>

                      {showEntertainment && (
                        <motion.div
                          className="entertainment-content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="age-verification">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={ageVerified}
                                onChange={(e) => setAgeVerified(e.target.checked)}
                              />
                              I confirm that I am 18+ years old and understand that entertainment services are provided by licensed third-party professionals.
                            </label>
                          </div>

                          {ageVerified && (
                            <div className="entertainment-options">
                              <div className="form-group">
                                <label>Entertainment Service Type</label>
                                <div className="radio-group">
                                  <label className="radio-label" data-type="none">
                                    <input
                                      type="radio"
                                      name="entertainment_service.type"
                                      value="none"
                                      checked={formData.entertainment_service?.type === 'none'}
                                      onChange={handleInputChange}
                                    />
                                    <span>No Entertainment Service</span>
                                  </label>
                                  <label className="radio-label" data-type="male">
                                    <input
                                      type="radio"
                                      name="entertainment_service.type"
                                      value="male"
                                      checked={formData.entertainment_service?.type === 'male'}
                                      onChange={handleInputChange}
                                    />
                                    <span>Male Entertainment Professional (+€150/hour)</span>
                                  </label>
                                  <label className="radio-label" data-type="female">
                                    <input
                                      type="radio"
                                      name="entertainment_service.type"
                                      value="female"
                                      checked={formData.entertainment_service?.type === 'female'}
                                      onChange={handleInputChange}
                                    />
                                    <span>Female Entertainment Professional (+€150/hour)</span>
                                  </label>
                                </div>
                              </div>

                              {formData.entertainment_service?.type && formData.entertainment_service.type !== 'none' && (
                                <div className="form-group">
                                  <label htmlFor="entertainment_service.special_requests">Special Requests (Optional)</label>
                                  <textarea
                                    id="entertainment_service.special_requests"
                                    name="entertainment_service.special_requests"
                                    value={formData.entertainment_service?.special_requests || ''}
                                    onChange={handleInputChange}
                                    placeholder="Any specific requests or preferences..."
                                    rows={3}
                                  />
                                  <small className="form-note">
                                    All entertainment services are provided by licensed professionals and comply with local regulations.
                                  </small>
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Confirmation */}
                {currentStep === 4 && (
                  <div className="step-content">
                    <h3>Review & Confirmation</h3>
                    <p>Please review your booking details before submitting:</p>

                    {/* Booking Summary */}
                    <div className="booking-summary">
                      <div className="summary-section">
                        <h4>Vehicle Details</h4>
                        <p><strong>Vehicle:</strong> {vehicle.name}</p>
                        <p><strong>Passengers:</strong> Up to {vehicle.max_passengers} passengers</p>
                        <p><strong>Quantity:</strong> {formData.vehicle_quantity || 1} vehicle{(formData.vehicle_quantity || 1) > 1 ? 's' : ''}</p>
                      </div>

                      <div className="summary-section">
                        <h4>Contact Information</h4>
                        <p><strong>Name:</strong> {formData.customer_name}</p>
                        <p><strong>Email:</strong> {formData.customer_email}</p>
                        <p><strong>Phone:</strong> {formData.customer_phone}</p>
                      </div>

                      <div className="summary-section">
                        <h4>Service Details</h4>
                        <p><strong>Service Type:</strong> {formData.service_type === 'hourly' ? 'Hourly Rental' : formData.service_type === 'airport' ? 'Airport Transfer' : 'Custom Service'}</p>
                        {formData.service_type === 'hourly' && (
                          <p><strong>Duration:</strong> {formData.duration_hours || 1} hour{(formData.duration_hours || 1) > 1 ? 's' : ''}</p>
                        )}
                        {formData.service_type === 'airport' && (
                          <div>
                            <p><strong>Airport:</strong> {airportNames[airportTransferData.airport as keyof typeof airportNames] || airportTransferData.airport}</p>
                            <p><strong>Transfer Type:</strong> {airportTransferData.transfer_type === 'arrival' ? 'Arrival' : 'Departure'}</p>
                            {airportTransferData.flight_number && <p><strong>Flight:</strong> {airportTransferData.flight_number}</p>}
                          </div>
                        )}
                        <p><strong>Date & Time:</strong> {formData.booking_date} at {formData.booking_time}</p>
                      </div>

                      <div className="summary-section">
                        <h4>Addresses</h4>
                        <p><strong>Pickup:</strong> {formData.pickup_address}</p>
                        <p><strong>Drop-off:</strong> {formData.dropoff_address}</p>
                        {formData.intermediate_stops && formData.intermediate_stops.length > 0 && (
                          <div>
                            <p><strong>Stops:</strong></p>
                            <ul>
                              {formData.intermediate_stops.map((stop, index) => (
                                <li key={index}>{stop}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {(formData.amenities?.champagne_bottles && formData.amenities.champagne_bottles > 0 || formData.amenities?.premium_water || formData.amenities?.birthday_decorations) && (
                        <div className="summary-section">
                          <h4>Amenities</h4>
                          {formData.amenities?.champagne_bottles && formData.amenities.champagne_bottles > 0 && <p>• Champagne: {formData.amenities.champagne_bottles} bottle{formData.amenities.champagne_bottles > 1 ? 's' : ''}</p>}
                          {formData.amenities?.premium_water && <p>• Premium Water</p>}
                          {formData.amenities?.birthday_decorations && <p>• Birthday Decorations</p>}
                        </div>
                      )}

                      {formData.special_requests && (
                        <div className="summary-section">
                          <h4>Special Requests</h4>
                          <p>{formData.special_requests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Previous
                  </button>
                )}
                {currentStep < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EnhancedBookingModal
