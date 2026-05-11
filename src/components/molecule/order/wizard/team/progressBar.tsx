import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectWizardStep } from '@/store/wizard/wizard.selector';

const routesOrder = ['/plan', '/team', '/seat', '/review', '/agreement', '/checkout'];
const TOTAL_STEPS = routesOrder.length;

const ProgressBar = () => {
  const step = useSelector(selectWizardStep);
  const location = useLocation();
  const idx = Math.max(0, routesOrder.indexOf(location.pathname));

  const percent = (() => {
    if (idx >= 0) return Math.max(0, Math.min(100, Math.round(((idx + 1) / TOTAL_STEPS) * 100)));
    return Math.max(0, Math.min(100, Math.round(((step + 1) / TOTAL_STEPS) * 100)));
  })();

  return (
    <div className="w-full h-1 bg-primary-alpha-10 overflow-hidden">
      <div className="h-1 bg-primary-base" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default ProgressBar;