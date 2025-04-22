'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
	const pathname = usePathname();
	const isActive = (href: string): boolean => pathname === href;

	return (
		<header className="bg-gradient-to-r from-sky-900 via-white-700 to-sky-600 text-white p-4 shadow-md">
			<nav className="flex space-x-4">
				<div className="space-x-8 items-end flex items-center justify-center text-xl">
					{/* Home and Center Title */}
					<Link
						href="/"
						className="text-white text-7xl font-bold drop-shadow-xl"
					>
						TaskU
					</Link>

					{/* Dashboard */}
					<Button
						variant="link"
						className={isActive('/dashboard') ? 'text-white underline' : 'text-white'}
					>
						<Link
							href="/dashboard"
							className="text-xl"
						>
							Dashboard
						</Link>
					</Button>

					{/* Tasks */}
					<Button
						variant="link"
						className={isActive('/tasks') ? 'text-white underline' : 'text-white'}
					>
						<Link
							href="/tasks"
							className="text-xl"
						>
							Tasks
						</Link>
					</Button>

					{/* Profile */}
					<Button
						variant="link"
						className={isActive('/profile') ? 'text-white underline' : 'text-white'}
					>
						<Link
							href="/profile"
							className="text-xl"
						>
							Profile
						</Link>
					</Button>
				</div>
			</nav>
		</header>
	);
};

export default Header;
