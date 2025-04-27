import React from 'react';
import Header from './header'; 
import HomeHeader from './homeHeader';
import Footer from './footer';

type LayoutProps = {
  children: React.ReactNode;
  isHomePage?: boolean; 
};

const Layout = ({ children, isHomePage }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* conditionally render header based on isHomePage prop */}
      {isHomePage ? <HomeHeader /> : <Header />}
      
      {/* main content grows to fill available space */}
      <main className="flex-grow">{children}</main>
      
      <Footer />
    </div>
  );
};

export default Layout;