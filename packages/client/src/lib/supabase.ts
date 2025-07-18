import { createClient } from '@supabase/supabase-js'
import type { Vehicle, VehicleImage, ApiResponse } from '../types'

class SupabaseService {
  private client: any = null;

  init(supabaseUrl: string, supabaseKey: string) {
    if (!this.client) {
      this.client = createClient(supabaseUrl, supabaseKey)
    }
    return this.client
  }

  async fetchVehicles(formSlug?: string, vehicleType?: string): Promise<ApiResponse<{ vehicles: Vehicle[], forms: any[] }>> {
    try {
      // Defensive check for window.PCS_CFG
      if (!window.PCS_CFG || !window.PCS_CFG.supabaseUrl || !window.PCS_CFG.supabaseKey) {
        throw new Error('Supabase configuration is missing')
      }

      const params = new URLSearchParams()
      if (formSlug) params.append('form_slug', formSlug)
      if (vehicleType) params.append('type', vehicleType)

      // Fetch vehicles
      const vehiclesResponse = await fetch(`${window.PCS_CFG.supabaseUrl}/functions/v1/listVehicles?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.PCS_CFG.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!vehiclesResponse.ok) {
        throw new Error(`HTTP error! status: ${vehiclesResponse.status}`)
      }

      const vehiclesData = await vehiclesResponse.json()

      if (vehiclesData.success && vehiclesData.data?.vehicles) {
        // Fetch images for each vehicle
        const vehiclesWithImages = await Promise.all(
          vehiclesData.data.vehicles.map(async (vehicle: Vehicle) => {
            try {
              const imagesResponse = await this.fetchVehicleImages(vehicle.id)
              return {
                ...vehicle,
                images: imagesResponse.success ? imagesResponse.data?.images || [] : []
              }
            } catch (error) {
              console.warn(`Failed to fetch images for vehicle ${vehicle.id}:`, error)
              return { ...vehicle, images: [] }
            }
          })
        )

        return {
          success: true,
          data: {
            vehicles: vehiclesWithImages,
            forms: vehiclesData.data.forms || []
          }
        }
      }

      return vehiclesData
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles'
      }
    }
  }

  async fetchVehicleImages(vehicleId: string): Promise<ApiResponse<{ images: VehicleImage[] }>> {
    try {
      // Defensive check for window.PCS_CFG
      if (!window.PCS_CFG || !window.PCS_CFG.supabaseUrl || !window.PCS_CFG.supabaseKey) {
        throw new Error('Supabase configuration is missing')
      }

      const response = await fetch(`${window.PCS_CFG.supabaseUrl}/functions/v1/listImages?vehicle_id=${vehicleId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${window.PCS_CFG.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching vehicle images:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicle images'
      }
    }
  }

  async createBooking(bookingData: any): Promise<ApiResponse<{ booking_id: string, total_price: number, message: string }>> {
    try {
      // Defensive check for window.PCS_CFG
      if (!window.PCS_CFG || !window.PCS_CFG.supabaseUrl || !window.PCS_CFG.supabaseKey) {
        throw new Error('Supabase configuration is missing')
      }

      const response = await fetch(`${window.PCS_CFG.supabaseUrl}/functions/v1/createBooking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.PCS_CFG.supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating booking:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create booking'
      }
    }
  }
}

export const supabaseService = new SupabaseService()
