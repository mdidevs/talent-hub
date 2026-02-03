import React from 'react';
import { Outlet } from 'react-router-dom';

const BasicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-week-50">
      <Outlet />
    </div>
  );
};

export default BasicLayout;
