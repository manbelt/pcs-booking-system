import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import { Vehicle, VehicleImage } from '../types'
import { supabaseService } from '../lib/supabase'
import EnhancedImage from './EnhancedImage'

interface VehicleCardProps {
  vehicle: Vehicle
  onBookingClick: (vehicleId: string) => void
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onBookingClick }) => {
  const [images, setImages] = useState<VehicleImage[]>([])
  const [loading, setLoading] = useState(true)
  const [ownPlaylist, setOwnPlaylist] = useState(false)
  const [adultEntertainment, setAdultEntertainment] = useState(false)
  const [showAdultDetails, setShowAdultDetails] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const response = await supabaseService.fetchVehicleImages(vehicle.id)
      if (response.success && response.data) {
        setImages(response.data.images)
      }
      setLoading(false)
    }

    fetchImages()
  }, [vehicle.id])

  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: images.length > 1,
    adaptiveHeight: true
  }

  const amenities = "Champagne bottle, premium water, crystal glassware, ambient LED lighting, high-grade sound system, professional chauffeur, door-to-door service in Paris"

  return (
    <motion.div
      className="vehicle-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Image Carousel */}
      <div className="vehicle-carousel">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((image) => (
              <div key={image.id} className="carousel-slide">
                <EnhancedImage
                  src={image.url}
                  alt={`${vehicle.name} - Image ${image.rank}`}
                  fallbackSrc="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
                  className="vehicle-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="carousel-slide">
            <EnhancedImage
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"
              alt={`${vehicle.name} - Default Image`}
              className="vehicle-image"
            />
          </div>
        )}
      </div>

      {/* Vehicle Information */}
      <div className="vehicle-info">
        <h3 className="vehicle-name">{vehicle.name}</h3>
        <p className="vehicle-passengers">Seats up to {vehicle.max_passengers} passengers</p>

        {/* Pricing Table */}
        <div className="pricing-table">
          <h4>Pricing</h4>
          <div className="pricing-row">
            <span className="pricing-label">1 Hour</span>
            <span className="pricing-value">€{vehicle.pricing.hour_1}</span>
          </div>
          <div className="pricing-row">
            <span className="pricing-label">2 Hours</span>
            <span className="pricing-value">€{vehicle.pricing.hour_2}</span>
          </div>
          <div className="pricing-row">
            <span className="pricing-label">3 Hours</span>
            <span className="pricing-value">€{vehicle.pricing.hour_3}</span>
          </div>
          <div className="pricing-row">
            <span className="pricing-label">Airport Transfer</span>
            <span className="pricing-value">€{vehicle.pricing.airport}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="amenities">
          <h4>Included Amenities</h4>
          <p className="amenities-list">{amenities}</p>
        </div>

        {/* Options */}
        <div className="vehicle-options">
          <div className="option-checkbox">
            <input
              type="checkbox"
              id={`playlist-${vehicle.id}`}
              checked={ownPlaylist}
              onChange={(e) => setOwnPlaylist(e.target.checked)}
            />
            <label htmlFor={`playlist-${vehicle.id}`}>
              I'll provide my own playlist/beverages
            </label>
          </div>

          <div className="collapsible-option">
            <button
              className="collapsible-header"
              onClick={() => setShowAdultDetails(!showAdultDetails)}
              type="button"
            >
              Adult entertainment available (additional fee)
            </button>
            {showAdultDetails && (
              <motion.div
                className="collapsible-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.15 }}
              >
                <p>
                  Professional entertainment services available upon request. 
                  Additional fees apply. All services are provided by licensed 
                  third-party professionals. Please inquire for details and pricing.
                </p>
                <div className="option-checkbox" style={{ marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id={`adult-${vehicle.id}`}
                    checked={adultEntertainment}
                    onChange={(e) => setAdultEntertainment(e.target.checked)}
                  />
                  <label htmlFor={`adult-${vehicle.id}`}>
                    I'm interested in entertainment services
                  </label>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Booking Button */}
        <button
          className="btn btn-primary"
          onClick={() => onBookingClick(vehicle.id)}
        >
          Request this vehicle
        </button>
      </div>
    </motion.div>
  )
}

export default VehicleCard
