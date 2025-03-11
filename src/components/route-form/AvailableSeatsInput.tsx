
import React from 'react';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface AvailableSeatsInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  lowSeatsWarning: string;
}

const AvailableSeatsInput: React.FC<AvailableSeatsInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  lowSeatsWarning
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        type="number"
        className="w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min="1"
        max="50"
      />
      {value < 10 && (
        <div className="flex items-center text-sm text-amber-500 mt-1">
          <Info className="h-4 w-4 mr-1" />
          {lowSeatsWarning}
        </div>
      )}
    </div>
  );
};

export default AvailableSeatsInput;
