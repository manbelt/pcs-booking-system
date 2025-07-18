import React, { useState, useEffect } from 'react'

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  format?: string;
}

interface InternationalPhoneInputProps {
  value: string;
  onChange: (value: string, country?: Country) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultCountry?: string; // Country code like 'FR', 'US', etc.
}

const countries: Country[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', format: '+33 X XX XX XX XX' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', format: '+1 XXX XXX XXXX' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', format: '+44 XXXX XXXXXX' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', format: '+49 XXX XXXXXXX' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', format: '+34 XXX XXX XXX' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', format: '+39 XXX XXX XXXX' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', format: '+31 X XXXX XXXX' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', format: '+32 XXX XX XX XX' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', format: '+41 XX XXX XX XX' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', format: '+43 XXX XXXXXXX' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: '+1 XXX XXX XXXX' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', format: '+61 XXX XXX XXX' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', format: '+81 XX XXXX XXXX' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', format: '+86 XXX XXXX XXXX' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', format: '+55 XX XXXXX XXXX' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', format: '+7 XXX XXX XX XX' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', format: '+91 XXXXX XXXXX' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971', format: '+971 XX XXX XXXX' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', format: '+966 XX XXX XXXX' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', format: '+90 XXX XXX XX XX' }
];

const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter phone number',
  required = false,
  className = '',
  defaultCountry = 'FR'
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return countries.find(c => c.code === defaultCountry) || countries[0];
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-detect country from phone number
  useEffect(() => {
    if (value && value.startsWith('+')) {
      const detectedCountry = detectCountryFromNumber(value);
      if (detectedCountry) {
        setSelectedCountry(detectedCountry);
        // Remove dial code and any leading spaces/formatting
        const numberWithoutCode = value.replace(detectedCountry.dialCode, '').replace(/^\s+/, '');
        setPhoneNumber(numberWithoutCode);
      }
    } else if (value && !value.startsWith('+')) {
      // If value doesn't start with +, treat as local number
      setPhoneNumber(value);
    } else if (!value) {
      setPhoneNumber('');
    }
  }, [value]);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detectCountryFromNumber = (number: string): Country | null => {
    // Sort by dial code length (longest first) to match more specific codes first
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    
    for (const country of sortedCountries) {
      if (number.startsWith(country.dialCode)) {
        return country;
      }
    }
    return null;
  };

  const formatPhoneNumber = (number: string, country: Country): string => {
    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    
    // Apply basic formatting based on country
    if (country.code === 'FR') {
      // French format: +33 X XX XX XX XX
      return digits.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    } else if (country.code === 'US' || country.code === 'CA') {
      // US/Canada format: +1 XXX XXX XXXX
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (country.code === 'GB') {
      // UK format: +44 XXXX XXXXXX
      return digits.replace(/(\d{4})(\d{6})/, '$1 $2');
    }
    
    // Default formatting: add spaces every 3 digits
    return digits.replace(/(\d{3})/g, '$1 ').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Check if user pasted a full international number
    if (inputValue.startsWith('+') && inputValue.length > selectedCountry.dialCode.length) {
      const detectedCountry = detectCountryFromNumber(inputValue);
      if (detectedCountry && detectedCountry.code !== selectedCountry.code) {
        setSelectedCountry(detectedCountry);
        const numberWithoutCode = inputValue.replace(detectedCountry.dialCode, '').replace(/^\s+/, '');
        const formattedNumber = formatPhoneNumber(numberWithoutCode, detectedCountry);
        setPhoneNumber(formattedNumber);
        onChange(inputValue, detectedCountry);
        return;
      }
    }

    const formattedNumber = formatPhoneNumber(inputValue, selectedCountry);
    setPhoneNumber(formattedNumber);

    const fullNumber = selectedCountry.dialCode + ' ' + formattedNumber;
    onChange(fullNumber, selectedCountry);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    const fullNumber = country.dialCode + ' ' + phoneNumber;
    onChange(fullNumber, country);
  };

  return (
    <div className={`international-phone-input ${className}`}>
      <div className="phone-input-container">
        {/* Country Selector */}
        <div className="country-selector">
          <button
            type="button"
            className="country-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select country"
          >
            <span className="country-flag">{selectedCountry.flag}</span>
            <span className="country-code">{selectedCountry.dialCode}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
          
          {isDropdownOpen && (
            <div className="country-dropdown">
              <div className="dropdown-search">
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="country-list">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    <span className="country-dial-code">{country.dialCode}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="no-countries">
                    <span>No countries found</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className="phone-number-input"
        />
      </div>
      
      {/* Format Example */}
      {selectedCountry.format && (
        <small className="format-example">
          Format: {selectedCountry.format}
        </small>
      )}
    </div>
  );
};

export default InternationalPhoneInput;
