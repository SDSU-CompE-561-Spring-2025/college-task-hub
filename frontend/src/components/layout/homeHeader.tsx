'use client';

import React, { useEffect, useState } from 'react';
import { AuthDialogs } from '../auth/authDialog';
import { usePathname } from 'next/navigation';

const HomeHeader = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<header className="bg-sky-500 text-white p-4 relative h-[250px] flex flex-col items-center justify-center">
			{/* Sign in and sign up buttons */}
			<div className="absolute top-4 right-4 space-x-4">{isClient && <AuthDialogs />}</div>

			<h1 className="text-8xl font-bold text-white mb-6">
				Task<span className="font-normal font-serif">U</span>
			</h1>

			<p className="text-black font-light text-2xl mt-5">
				Discover job opportunities and find people to assist with your tasks here!
			</p>
		</header>
	);
};

export default HomeHeader;
