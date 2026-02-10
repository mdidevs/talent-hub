import { Button } from '@/components/atomic/button';
import { Logo } from '@/components/atomic/logo';
import ErrorStatus from '@/components/molecule/order/wizard/errorStatus';
import ProgressBar from '@/components/molecule/order/wizard/team/progressBar';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
// import Image from '../assets/auth-cover.jpg';
import React from 'react';
import { Outlet } from 'react-router-dom';

const OrderWizardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-week-50">
        {/* Appbar */}
        <div className='border-b border-stroke-soft-200'>
            <div className='max-w-7xl mx-auto  p-4 flex justify-between'>
                <Logo />
                <Button size="icon" variant={'ghost'} className='rounded-full'>
                    <X/>
                </Button>
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
                <Button variant='tertiary' >
                    <ArrowLeft/>
                    Back
                </Button>
                <div className='hidden md:flex gap-10'>
                    <div>
                        <p>Total Professionals</p>
                        <h6>6 Selected</h6>
                    </div>
                    <div>
                        <p>Estimated Subtotal</p>
                        <h6>$192 / day</h6>
                    </div>
                </div>
                <Button className='hover:shadow-xl shadow-primary-alpha-16'>
                    Proceed seat selection
                    <ArrowRight/>
                </Button>
            </div>
        </div>
    </div>
  );
};

export default OrderWizardLayout;