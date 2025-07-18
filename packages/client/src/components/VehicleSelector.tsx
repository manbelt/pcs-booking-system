import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Vehicle } from '../types'
import EnhancedImage from './EnhancedImage'

interface VehicleSelectorProps {
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  onVehicleSelect: (vehicle: Vehicle) => void
  onBookingClick: (vehicleId: string) => void
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onBookingClick
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all')

  // Get unique brands from vehicles
  const brands: string[] = ['all', ...new Set(vehicles.map(v => v.brand).filter(Boolean) as string[])]

  // Filter vehicles by selected brand
  const filteredVehicles = selectedBrand === 'all'
    ? vehicles
    : vehicles.filter(v => v.brand === selectedBrand)

  const getBrandDisplayName = (brand: string) => {
    switch (brand) {
      case 'chrysler': return 'Chrysler'
      case 'lincoln': return 'Lincoln'
      case 'hummer': return 'Hummer'
      case 'all': return 'All Vehicles'
      default: return brand.charAt(0).toUpperCase() + brand.slice(1)
    }
  }

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'chrysler': return '🏛️'
      case 'lincoln': return '⭐'
      case 'hummer': return '🚗'
      case 'all': return '🚙'
      default: return '🚗'
    }
  }

  return (
    <div className="vehicle-selector">
      {/* Brand Filter */}
      <div className="brand-filter">
        <h3>Choose Your Limousine</h3>
        <div className="brand-tabs">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`brand-tab ${selectedBrand === brand ? 'active' : ''}`}
              onClick={() => setSelectedBrand(brand)}
            >
              <span className="brand-icon">{getBrandIcon(brand)}</span>
              <span className="brand-name">{getBrandDisplayName(brand)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBrand}
          className="vehicle-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredVehicles.length === 0 ? (
            <div className="no-vehicles">
              <h4>No vehicles available</h4>
              <p>Please select a different brand or check back later.</p>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                className={`vehicle-option ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => onVehicleSelect(vehicle)}
              >
                {/* Vehicle Image */}
                <div className="vehicle-images">
                  <EnhancedImage
                    src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].url : ''}
                    alt={`${vehicle.name} - Luxury Limousine`}
                    fallbackSrc="/api/placeholder/400/250"
                    className="vehicle-image"
                  />
                </div>

                <div className="vehicle-header">
                  <h4>{vehicle.name}</h4>
                  <span className="brand-badge">{getBrandDisplayName(vehicle.brand || '')}</span>
                </div>
                
                <div className="vehicle-details">
                  <div className="passenger-info">
                    <span className="icon">👥</span>
                    <span>Up to {vehicle.max_passengers} passengers</span>
                  </div>
                  
                  {vehicle.description && (
                    <p className="vehicle-description">{vehicle.description}</p>
                  )}
                  
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="vehicle-features">
                      <h5>Features:</h5>
                      <ul>
                        {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                        {vehicle.features.length > 3 && (
                          <li>+{vehicle.features.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pricing-summary">
                  <div className="price-item">
                    <span>1 Hour</span>
                    <span>€{vehicle.pricing.hour_1}</span>
                  </div>
                  <div className="price-item">
                    <span>3 Hours</span>
                    <span>€{vehicle.pricing.hour_3}</span>
                  </div>
                  <div className="price-item">
                    <span>Airport</span>
                    <span>€{vehicle.pricing.airport}</span>
                  </div>
                </div>

                <button
                  className="select-vehicle-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onBookingClick(vehicle.id)
                  }}
                >
                  Book This Vehicle
                </button>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default VehicleSelector
