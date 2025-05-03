'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface HeaderButtonProps {
	href: string;
	label: string;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ href, label }) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
        <Button
        	asChild
        	variant="ghost"
        	className={clsx(
        		'text-2xl font-semibold px-6 py-2 rounded-lg transition-colors',
        		isActive
        			? 'bg-sky-600 text-white hover:bg-sky-600 hover:text-white'
        			: 'text-white hover:bg-sky-600 hover:text-white'
        	)}
        >
        	<Link href={href}>{label}</Link>
        </Button>
	);
};

export default HeaderButton;
