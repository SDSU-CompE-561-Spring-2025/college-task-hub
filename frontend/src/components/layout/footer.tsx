import React from 'react';
import { Hammer } from 'lucide-react';

const Footer = () => {
	return (
		<footer className="flex flex-col bg-stone-800 text-emerald-50 p-4">
			<div className="flex items-center justify-center">
				<Hammer
					size={32}
					className="mr-2"
				/>
				<span className="text-3xl font-bold">TaskU</span>
			</div>
			<div className="text-center mt-4">
				<p className="text-sm">&copy; {new Date().getFullYear()} TaskU. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
