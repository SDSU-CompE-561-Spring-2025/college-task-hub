// components/layout/DashboardButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

export type DashboardButtonProps = {
	icon?: React.ReactNode;
	children: React.ReactNode;
	onClick?: () => void;
};

export default function DashboardButton({ icon, children, onClick }: DashboardButtonProps) {
	return (
		<Button
			onClick={onClick}
			className={`
        bg-sky-200 hover:bg-sky-400 
        border-2 border-black 
        rounded-lg 
        h-64 w-64 
        flex flex-col items-center justify-center
        space-y-1 
        cursor-pointer
      `}
		>
			{icon && <div className="flex flex-row space-x-2 text-black max-w-none">{icon}</div>}
			<span className="flex-none text-sky-500 font-bold text-xl">{children}</span>
		</Button>
	);
}
