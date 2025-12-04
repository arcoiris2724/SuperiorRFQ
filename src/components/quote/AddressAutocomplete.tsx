import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Prediction {
  place_id: string;
  description: string;
}

interface AddressData {
  address: string;
  lat: number;
  lng: number;
  components: Record<string, string>;
}

interface Props {
  value: string;
  onChange: (data: AddressData | null) => void;
  placeholder?: string;
}

const AddressAutocomplete: React.FC<Props> = ({ value, onChange, placeholder = 'Enter delivery address' }) => {
  const [input, setInput] = useState(value);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPredictions = async (text: string) => {
    if (text.length < 3) { setPredictions([]); return; }
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('places-autocomplete', {
        body: { action: 'autocomplete', input: text }
      });
      setPredictions(data?.predictions || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Autocomplete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    onChange(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 300);
  };

  const selectPlace = async (prediction: Prediction) => {
    setInput(prediction.description);
    setShowDropdown(false);
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('places-autocomplete', {
        body: { action: 'details', placeId: prediction.place_id }
      });
      if (data?.result) {
        const { formatted_address, geometry, address_components } = data.result;
        const components: Record<string, string> = {};
        address_components?.forEach((c: any) => {
          components[c.types[0]] = c.long_name;
        });
        onChange({
          address: formatted_address,
          lat: geometry.location.lat,
          lng: geometry.location.lng,
          components
        });
      }
    } catch (err) {
      console.error('Place details error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />}
        {!loading && input && <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      </div>
      {showDropdown && predictions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onClick={() => selectPlace(p)}
              className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-start gap-3 border-b last:border-0"
            >
              <MapPin className="w-5 h-5 text-[#1A8B06] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{p.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
