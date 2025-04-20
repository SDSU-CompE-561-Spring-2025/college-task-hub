import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Header = () => {
	return (
		<header className="flex flex-col items-center p-4 bg-black text-white">
			<div className="text-center text-7xl font-bold mb-4">TaskU</div>
			<nav className="flex justify-between items-center w-full max-w-6xl mx-auto">
				<Button
					variant="ghost"
					className="bg-gray-700 hover:bg-gray-600 text-white"
				>
					<Link
						href="/"
						className="hover:text-gray-400 flex items-center"
					>
						<ChevronRight />
						Home
					</Link>
				</Button>
			</nav>
		</header>
	);
};

export default Header;
