'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import HeaderButton from './headerButton';

const Header = () => {
	const pathname = usePathname();
	const isActive = (href: string): boolean => pathname === href;

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Job Post', href: '/job-post' },
		{ name: 'Profile', href: '/profile' },
	];

	return (
		<header className="bg-sky-500 text-white py-4 px-6">
			<nav className="max-w-6xl mx-auto flex justify-center gap-36 items-start">
				{/* Left links */}
				<div className="flex space-x-6 mt-14">
					{navLinks.slice(0, 2).map((link) => (
						<HeaderButton key={link.name} href={link.href} label={link.name} />
					))}
				</div>

				{/* Center logo */}
				<h1 className="text-8xl font-bold text-white">
					Task<span className="font-normal font-serif">U</span>
				</h1>

				{/* Right links */}
				<div className="flex space-x-6 mt-14">
					{navLinks.slice(2).map((link) => (
						<HeaderButton key={link.name} href={link.href} label={link.name} />
					))}
				</div>
			</nav>
		</header>
	);
};

export default Header;
