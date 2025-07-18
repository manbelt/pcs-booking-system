import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import VehicleSelector from './components/VehicleSelector'
import EnhancedBookingModal from './components/EnhancedBookingModal'
import ErrorBoundary from './components/ErrorBoundary'
import { Vehicle, Form } from './types'
import { supabaseService } from './lib/supabase'
import './styles/index.css'

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showVehicleSelector, setShowVehicleSelector] = useState(true)

  // Get configuration from WordPress
  const config = window.PCS_CFG || {
    supabaseUrl: '',
    supabaseKey: '',
    formSlug: 'limousine',
    nonce: '',
    ajaxUrl: '',
    apiUrl: '',
    restNonce: ''
  }

  useEffect(() => {
    const initializeApp = async () => {
      if (!config.supabaseUrl || !config.supabaseKey) {
        setError('Supabase configuration is missing. Please check your WordPress plugin settings.')
        setLoading(false)
        return
      }

      // Initialize Supabase client
      supabaseService.init(config.supabaseUrl, config.supabaseKey)

      // Fetch vehicles and forms
      await fetchData()
    }

    initializeApp()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await supabaseService.fetchVehicles(config.formSlug)
      
      if (response.success && response.data) {
        setVehicles(response.data.vehicles)
        setForms(response.data.forms)
      } else {
        setError(response.error || 'Failed to load vehicles')
      }
    } catch (err) {
      setError('An unexpected error occurred while loading vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleBookingClick = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      setSelectedVehicle(vehicle)
      setIsModalOpen(true)
      setShowVehicleSelector(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
    setShowVehicleSelector(true)
  }

  // Get page title based on form
  const getPageTitle = () => {
    if (forms.length > 0) {
      const currentForm = forms.find(form => form.slug === config.formSlug)
      return currentForm?.title || 'Vehicle Booking'
    }
    return 'Vehicle Booking'
  }

  // Filter vehicles based on current form
  const getFilteredVehicles = () => {
    if (forms.length === 0) return vehicles
    
    const currentFormVehicleIds = forms
      .filter(form => form.slug === config.formSlug)
      .map(form => form.vehicle_id)
    
    if (currentFormVehicleIds.length === 0) return vehicles
    
    return vehicles.filter(vehicle => currentFormVehicleIds.includes(vehicle.id))
  }

  const filteredVehicles = getFilteredVehicles()

  if (loading) {
    return (
      <div id="pcs-booking-root">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div id="pcs-booking-root">
        <div className="error">
          <h3>Error Loading Booking System</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchData}
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div id="pcs-booking-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <header className="booking-header">
          <h1>{getPageTitle()}</h1>
          <p>Choose from our premium fleet of luxury vehicles for your special occasion.</p>
        </header>

        {showVehicleSelector && (
          <VehicleSelector
            vehicles={filteredVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={handleVehicleSelect}
            onBookingClick={handleBookingClick}
          />
        )}
      </motion.div>

      <EnhancedBookingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        vehicle={selectedVehicle}
        formSlug={config.formSlug}
      />
      </div>
    </ErrorBoundary>
  )
}

export default App
