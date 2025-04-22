import React from 'react';
import Header from './header';
import Footer from './footer';

const Layout = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			{/* Main content grows to fill available space */}
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
