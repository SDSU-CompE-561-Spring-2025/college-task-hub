'use client';

import React from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import HeaderButton from './headerButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import clsx from 'clsx';

const Header = () => {
	const pathname = usePathname();
	const isActive = (href: string): boolean => pathname === href;

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [role, setRole] = useState<'performer' | 'poster'>('performer'); // default to 'performer'

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Job Post', href: '/job-post' },
		{ name: 'Profile', href: '/profile' },
	];

	const router = useRouter();

	const toggleDropdown = () => { setDropdownOpen((prev) => !prev); };	
	const switchRole = (newRole: 'performer' | 'poster') => { 
		setRole(newRole);	
		setDropdownOpen(false); 
		router.push(`/dashboard/${newRole}`);
	};

	return (
		<header className="bg-sky-500 text-white py-4 px-6">
			<nav className="max-w-6xl mx-auto flex justify-center gap-36 items-start">
				{/* Left links */}
				<div className="flex space-x-6 mt-14 items-center relative">
				  	{/* Home link */}
				  	<HeaderButton key="Home" href="/" label="Home" />

				  	{/* Dashboard dropdown */}
				  	<div className="relative">
				  	  	<Button
				  	  	  	variant="ghost"
							className={clsx(
								'text-2xl font-semibold px-6 py-2 rounded-lg transition-colors',
								isActive('/dashboard') // ✅ this is the fix
									? 'bg-sky-600 text-white hover:bg-sky-600 hover:text-white'
									: 'text-white hover:bg-sky-600 hover:text-white'
							)}
							onClick={() => setDropdownOpen((prev) => !prev)}
				  	  	>
				  	  	Dashboard
				  	  	</Button>

				  	  	{dropdownOpen && (
				  	  	  	<div className="absolute top-full left-0 mt-2 w-36 bg-sky-200 shadow-lg rounded-md z-50">
				  	  	  	  	<Link
				  	  	  	  	  	href="/dashboard/performer"
				  	  	  	  	  	className="block px-4 py-2 text-gray-700 rounded-t-lg hover:bg-sky-300"
				  	  	  	  	  	onClick={() => setDropdownOpen(false)}
				  	  	  	  	>
				  	  	  	  	Performer
				  	  	  	  	</Link>
				  	  	  	  	<Link
				  	  	  	  	  	href="/dashboard/poster"
				  	  	  	  	  	className="block px-4 py-2 text-gray-700 rounded-b-lg hover:bg-sky-300"
				  	  	  	  	  	onClick={() => setDropdownOpen(false)}
				  	  	  	  	>
				  	  	  	  	Poster
				  	  	  	  	</Link>
				  	  	  	</div>
				  	  	)}
				  	</div>
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
