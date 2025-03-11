
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel: () => void;
  cancelLabel: string;
  submitLabel: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  cancelLabel, 
  submitLabel 
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="ghost" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" className="bg-tunisbus hover:bg-tunisbus-dark">
        {submitLabel}
      </Button>
    </div>
  );
};

export default FormActions;
