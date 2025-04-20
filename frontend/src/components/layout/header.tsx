import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Header = () => {
	return (
		<header className="bg-sky-700 text-emerald-50 p-2">
			<nav className="w-full">
				<div className="grid grid-cols-5 items-end">
					{/* Home */}
					<Button
						variant="link"
						className="w-full text-emerald-50"
					>
						<Link
							href="/"
							className="flex items-center justify-center text-xl hover:text-white"
						>
							<ChevronRight />
							Home
						</Link>
					</Button>

					{/* Dashboard */}
					<Button
						variant="link"
						className="w-full text-emerald-50"
					>
						<Link
							href="/dashboard"
							className="flex items-center justify-center text-xl hover:text-white"
						>
							<ChevronRight />
							Dashboard
						</Link>
					</Button>

					{/* Center Title */}
					<span className="flex items-center justify-center text-7xl font-bold">TaskU</span>

					{/* Tasks */}
					<Button
						variant="link"
						className="w-full text-emerald-50"
					>
						<Link
							href="/tasks"
							className="flex items-center justify-center text-xl hover:text-white"
						>
							<ChevronRight />
							Tasks
						</Link>
					</Button>

					{/* Profile */}
					<Button
						variant="link"
						className="w-full text-emerald-50"
					>
						<Link
							href="/profile"
							className="flex items-center justify-center text-xl hover:text-white"
						>
							<ChevronRight />
							Profile
						</Link>
					</Button>
				</div>
			</nav>
		</header>
	);
};

export default Header;
