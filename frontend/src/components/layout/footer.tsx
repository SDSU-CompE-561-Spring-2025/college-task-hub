import React from 'react';
import { Hammer } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="flex flex-col bg-gradient-to-r from-sky-900 via-sky-700 to-sky-600 text-emerald-50 p-4">
			<div className="flex items-center justify-center">
				<Hammer
					size={32}
					className="mr-2"
				/>
				<Link
					href="/"
					className="text-3xl font-bold"
				>
					TaskU
				</Link>
			</div>
			<div className="text-center mt-4">
				<p className="text-sm">&copy; {new Date().getFullYear()} TaskU. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
