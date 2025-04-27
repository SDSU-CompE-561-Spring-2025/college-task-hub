'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const HomeHeader = () => {
	const pathname = usePathname();
	const isActive = (href: string): boolean => pathname === href;

	return (
		<header className="bg-sky-500 text-white p-4 relative h-[250px] flex flex-col items-center justify-center">
			{/* sign in and sign up buttons */}
			<div className="absolute top-4 right-4 space-x-4">
				<Link href="/signin">
					<Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-4 text-lg font-semibold hover:cursor-pointer">
						Sign In
					</Button>
				</Link>
				<Link href="/signup">
					<Button className="bg-white text-sky-600 hover:bg-gray-100 rounded-lg px-4 text-lg font-semibold hover:cursor-pointer">
						Sign Up
					</Button>
				</Link>
			</div>

			{/* title */}
			<h1 className="text-8xl font-bold text-white mb-6">
				Task<span className="font-normal font-serif">U</span>
			</h1>

			{/* tagline */}
			<p className="text-black font-light text-2xl mt-5">
				Discover job opportunities and find people to assist with your tasks here!
			</p>
		</header>
	);
};

export default HomeHeader;
