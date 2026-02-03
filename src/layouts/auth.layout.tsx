import { Logo } from '@/components/atomic/logo';
import Image from '../assets/auth-cover.jpg';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-week-50">
        <div className='md:flex flex-1 '>
            <div className='md:w-6/12 flex flex-col justify-between gap-4 min-h-screen px-4 py-8 sm:px-12 md:px-16 lg:px-24'>
                <Logo />
                <Outlet />
                <div className='text-sm text-text-sub-600'>&copy; {new Date().getFullYear()} Cubicles. All rights reserved.</div>
            </div>
            <div className='hidden md:block md:w-6/12 max-h-screen'>
                <img src={Image} alt="Auth Illustration" className='w-full h-full object-cover'/>
            </div>
        </div>
    </div>
  );
};

export default AuthLayout;