"use client";
import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import HeroSection from '@/components/home/heroSection';
import LearnMoreButton from '@/components/home/learnMoreButton';
import AboutSection from '@/components/home/aboutSection';

export default function Home() {
	return (
		<div>
			<Layout isHomePage={true}>
				
				<div className="flex flex-col items-center justify-center text-black">

					<HeroSection />

					<LearnMoreButton />

					<AboutSection />

				</div>
			</Layout>
		</div>
	);
}
