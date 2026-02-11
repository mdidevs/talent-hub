
import React from 'react';
import { useSelector } from 'react-redux';
import { selectWizardStep } from '@/store/wizard/wizard.selector';

const TOTAL_STEPS = 5;

const ProgressBar = () => {
  const step = useSelector(selectWizardStep);
  const percent = Math.max(0, Math.min(100, Math.round(((step + 1) / TOTAL_STEPS) * 100)));

  return (
    <div className="w-full h-1 bg-primary-alpha-10 overflow-hidden">
      <div className="h-1 bg-primary-base" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default ProgressBar;