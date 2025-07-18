export interface Vehicle {
  id: string;
  name: string;
  max_passengers: number;
  active: boolean;
  vehicle_type?: string;
  brand?: string;
  description?: string;
  features?: string[];
  images?: VehicleImage[];
  pricing: {
    hour_1: number;
    hour_2: number;
    hour_3: number;
    airport: number;
  };
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  rank: number;
  created_at?: string;
}

export interface Form {
  id: string;
  slug: string;
  title: string;
  vehicle_id: string;
  type: string;
}

export interface BookingFormData {
  vehicle_id: string;
  form_slug: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_date: string;
  booking_time?: string;
  duration_hours?: number;
  service_type: 'hourly' | 'airport' | 'custom';
  special_requests?: string;
  wordpress_nonce: string;
  // Enhanced features
  passenger_count: number;
  vehicle_quantity: number;
  pickup_address: string;
  dropoff_address: string;
  intermediate_stops: string[];
  amenities: BookingAmenities;
  entertainment_service?: EntertainmentService;
  driver_instructions?: string;
}

export interface BookingAmenities {
  champagne_bottles: number;
  premium_water: boolean;
  flowers: boolean;
  decorations: boolean;
  birthday_decorations: boolean;
  birthday_person_age?: number;
  birthday_theme?: string;
  custom_requests?: string;
}

export interface EntertainmentService {
  type: 'male' | 'female' | 'none';
  verified_age: boolean;
  special_requests?: string;
  additional_notes?: string;
}

export interface ItineraryStop {
  id: string;
  address: string;
  order: number;
  type: 'pickup' | 'intermediate' | 'dropoff';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PCSConfig {
  supabaseUrl: string;
  supabaseKey: string;
  formSlug: string;
  nonce: string;
  ajaxUrl: string;
  apiUrl: string;
  restNonce: string;
}

// Extend Window interface to include PCS_CFG
declare global {
  interface Window {
    PCS_CFG: PCSConfig;
  }
}
