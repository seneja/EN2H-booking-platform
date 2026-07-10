import React, { ReactNode } from 'react';
import { Sidebar, TopNav } from './Sidebar';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopNav />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};
