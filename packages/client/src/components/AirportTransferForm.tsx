import React from 'react'

export interface AirportTransferData {
  airport: string;
  transfer_type: 'arrival' | 'departure';
  flight_number: string;
  flight_time: string;
  airline?: string;
  terminal?: string;
}

interface AirportTransferFormProps {
  data: AirportTransferData;
  onChange: (data: AirportTransferData) => void;
  className?: string;
}

const airports = [
  { id: 'cdg', name: 'Charles de Gaulle Airport (CDG)', code: 'CDG' },
  { id: 'ory', name: 'Orly Airport (ORY)', code: 'ORY' },
  { id: 'lbg', name: 'Le Bourget Airport (LBG)', code: 'LBG' }
];

const airlines = [
  'Air France', 'British Airways', 'Lufthansa', 'Emirates', 'KLM',
  'American Airlines', 'Delta Air Lines', 'United Airlines', 'Turkish Airlines',
  'Swiss International', 'Alitalia', 'Iberia', 'Other'
];

const AirportTransferForm: React.FC<AirportTransferFormProps> = ({
  data,
  onChange,
  className = ''
}) => {
  const handleChange = (field: keyof AirportTransferData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const getTimeLabel = () => {
    return data.transfer_type === 'arrival' ? 'Arrival Time' : 'Departure Time';
  };

  const getFlightLabel = () => {
    return data.transfer_type === 'arrival' ? 'Arriving Flight' : 'Departing Flight';
  };

  return (
    <div className={`airport-transfer-form ${className}`}>
      <h4>Airport Transfer Details</h4>
      
      {/* Airport Selection */}
      <div className="form-group">
        <label htmlFor="airport">Airport *</label>
        <select
          id="airport"
          value={data.airport}
          onChange={(e) => handleChange('airport', e.target.value)}
          required
        >
          <option value="">Select Airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transfer Type */}
      <div className="form-group">
        <label>Transfer Type *</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="transfer_type"
              value="arrival"
              checked={data.transfer_type === 'arrival'}
              onChange={(e) => handleChange('transfer_type', e.target.value)}
            />
            <span className="radio-text">
              <strong>Arrival</strong> - Pick up from airport
            </span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="transfer_type"
              value="departure"
              checked={data.transfer_type === 'departure'}
              onChange={(e) => handleChange('transfer_type', e.target.value)}
            />
            <span className="radio-text">
              <strong>Departure</strong> - Drop off at airport
            </span>
          </label>
        </div>
      </div>

      {/* Flight Details */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="flight_number">{getFlightLabel()} Number *</label>
          <input
            type="text"
            id="flight_number"
            value={data.flight_number}
            onChange={(e) => handleChange('flight_number', e.target.value.toUpperCase())}
            placeholder="e.g., AF1234, BA456"
            required
          />
          <small className="form-help">
            Enter the flight number (e.g., AF1234, BA456)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="flight_time">{getTimeLabel()} *</label>
          <input
            type="time"
            id="flight_time"
            value={data.flight_time}
            onChange={(e) => handleChange('flight_time', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Optional Details */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="airline">Airline (Optional)</label>
          <select
            id="airline"
            value={data.airline || ''}
            onChange={(e) => handleChange('airline', e.target.value)}
          >
            <option value="">Select Airline</option>
            {airlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="terminal">Terminal (Optional)</label>
          <input
            type="text"
            id="terminal"
            value={data.terminal || ''}
            onChange={(e) => handleChange('terminal', e.target.value)}
            placeholder="e.g., Terminal 1, 2A, 2E"
          />
        </div>
      </div>

      {/* Transfer Information */}
      <div className="transfer-info">
        <div className="info-card">
          <h5>
            {data.transfer_type === 'arrival' ? '✈️ Arrival Information' : '🛫 Departure Information'}
          </h5>
          <ul>
            {data.transfer_type === 'arrival' ? (
              <>
                <li>Our driver will monitor your flight for delays</li>
                <li>Meet & greet service at arrivals hall</li>
                <li>Complimentary waiting time: 60 minutes</li>
                <li>Driver will have a sign with your name</li>
              </>
            ) : (
              <>
                <li>Recommended pickup time: 3 hours before international flights</li>
                <li>2 hours before domestic/EU flights</li>
                <li>Traffic conditions will be monitored</li>
                <li>Direct drop-off at departure terminal</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AirportTransferForm;
