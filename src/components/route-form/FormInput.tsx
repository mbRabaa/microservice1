
import React from 'react';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  min?: string;
  max?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  min, 
  max 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        type={type}
        className="w-full"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
      />
    </div>
  );
};

export default FormInput;
