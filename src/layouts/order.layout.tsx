import { Button } from '@/components/atomic/button';
import { Logo } from '@/components/atomic/logo';
import ErrorStatus from '@/components/molecule/order/wizard/errorStatus';
import ProgressBar from '@/components/molecule/order/wizard/team/progressBar';
import { ArrowLeft, ArrowRight, X, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/auth/auth.slice';
// import Image from '../assets/auth-cover.jpg';
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectWizardCategories, selectWizardSelected } from '@/store/wizard/wizard.selector';
import useWizard from '@/hooks/wizard/wizard.hook';

const OrderWizardLayout: React.FC = () => {
    const selected = useSelector(selectWizardSelected);
    const categories = useSelector(selectWizardCategories);
    const navigate = useNavigate();
    const dispatch = useDispatch();
        const { prev, next } = useWizard();
        const location = useLocation();

        const routesOrder = ['/team','/seat','/review','/agreement','/checkout'];
        const currentIndex = Math.max(0, routesOrder.indexOf(location.pathname));

        const handleBack = () => {
            if (currentIndex > 0) {
                prev();
                navigate(routesOrder[currentIndex - 1]);
            } else {
                navigate('/login');
            }
        };

        const handleNext = () => {
            if (currentIndex < routesOrder.length - 1) {
                next();
                navigate(routesOrder[currentIndex + 1]);
            } else {
                navigate('/checkout');
            }
        };

    const totalProfessionals = selected.reduce((sum, s) => sum + (s.qty || 0), 0);
    const subtotal = selected.reduce((sum, s) => {
        const cat = categories.find((c) => String(c.id) === String(s.categoryId));
        const price = cat ? Number(cat.price ?? 0) : 0;
        return sum + price * (s.qty || 0);
    }, 0);
    const unit = categories[0]?.unit ?? '/ day';

    return (
    <div className="min-h-screen bg-background-week-50">
        {/* Appbar */}
        <div className='border-b border-stroke-soft-200'>
            <div className='max-w-7xl mx-auto  p-4 flex justify-between'>
                <Logo />
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={async () => { await dispatch(logoutUser()); navigate('/login'); }}>
                        <LogOut className="mr-2" /> Logout
                    </Button>
                    <Button size="icon" variant={'ghost'} className='rounded-full'>
                        <X/>
                    </Button>
                </div>
            </div>
        </div>
        {/* Forms */}
        <div className='max-w-7xl mx-auto px-4 pt-8 pb-48 min-h-screen'>
            <Outlet />
        </div>
        {/* Bottombar */}
        <div className='fixed bottom-0 left-0 right-0 bg-background-white-0 border-t border-stroke-soft-200'>
            {/* <ErrorStatus /> */}
            <ProgressBar />
            <div className='max-w-7xl mx-auto p-2 md:p-6 flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-2'>
                <Button variant='tertiary' onClick={handleBack}>
                    <ArrowLeft/>
                    Back
                </Button>
                <div className='hidden md:flex gap-10'>
                    <div>
                        <p>Total Professionals</p>
                        <h6>{totalProfessionals} Selected</h6>
                    </div>
                    <div>
                        <p>Estimated Subtotal</p>
                        <h6>${subtotal} {unit}</h6>
                    </div>
                </div>
                <Button onClick={handleNext} className='hover:shadow-xl shadow-primary-alpha-16'>
                    {currentIndex === 0 ? 'Proceed seat selection' : 'Next'}
                    <ArrowRight/>
                </Button>
            </div>
        </div>
    </div>
  );
};

export default OrderWizardLayout;