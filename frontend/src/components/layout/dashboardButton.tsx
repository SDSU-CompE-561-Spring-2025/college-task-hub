// components/layout/DashboardButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

export type DashboardButtonProps = {
  /** Optional icon element (e.g. a lucide-react icon) */
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardButton({
  icon,
  children,
}: DashboardButtonProps) {
  return (
    <Button
      className={`
        bg-sky-200 hover:bg-sky-400 
        border-2 border-black 
        rounded-lg 
        h-45 w-45 
        flex flex-col items-center justify-center
        space-y-1 
      `}
    >
      {icon && <div className="flex-none text-black">{icon}</div>}
      <span className="flex-none text-sky-500 font-bold text-xl">
        {children}
      </span>
    </Button>
  );
}
