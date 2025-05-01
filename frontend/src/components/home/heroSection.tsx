'use client';
import React from 'react';
import AddressBar from '@/components/ui/addressBar';
import DashboardButton from '@/components/layout/dashboardButton';
import ToolClusterLeft from '@/components/home/toolClusterLeft';
import ToolClusterRight from '@/components/home/toolClusterRight';
import { UserCheck, Watch, Wrench, Wifi, Truck, Smartphone } from 'lucide-react';

export default function HeroSection() {
  return (
    <>
      <div className="pt-10">
        <AddressBar />
      </div>

      <div className="flex w-full justify-between items-center pt-30 pb-36 space-x-25 overflow-hidden">
        
        <ToolClusterLeft />

        <DashboardButton
          icon={
            <>
              <Wrench size={32} />
              <Truck size={32} />
              <Wifi size={32} />
            </>
          }
        >
          Do Tasks!
        </DashboardButton>

        <DashboardButton
          icon={
            <>
              <UserCheck size={32} />
              <Watch size={32} />
              <Smartphone size={32} />
            </>
          }
        >
          Post Tasks!
        </DashboardButton>

        <ToolClusterRight />
      </div>
    </>
  );
}
