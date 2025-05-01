import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import AddressBar from '@/components/ui/addressBar';
import { Button } from '@/components/ui/button';
import DashboardButton from '@/components/layout/dashboardButton';
import { UserCheck, Watch, Wrench, Wifi, Truck, Smartphone } from 'lucide-react';

export default function Home() {
	return (
		<div>
			<Layout isHomePage={true}>
				
				<div className="flex flex-col items-center justify-center text-black">
					<div className="pt-10">
        				<AddressBar />
					</div>

      				<div className="flex w-full justify-between items-center pt-20 pb-30 space-x-25 overflow-hidden" >

					  	<div className="relative w-70">
					    		<img
					    		  src="/images/frame.png"
					    		  alt="frame"
					    		  className="max-w-none w-64 h-auto rotate-150 -ml-35"
					    		/>

					    		<img
					    		  src="/images/broom.png"
					    		  alt="overlay"
					    		  className="max-w-none absolute left-0 top-[90%] w-40 h-auto -ml-10"
					    		/>
					  	</div>

						  <DashboardButton
							icon={
								<>
									<Wrench size={32} />
									<Truck size={32} />
						    		<Wifi size={32} />
								</>
							}
							>
						  Do Tasks!
						</DashboardButton>
						<DashboardButton
							icon={
								<>
									<UserCheck size={32} />
						    		<Watch size={32} />
									<Smartphone size={32} />
								</>
							}
							>
						  Post Tasks!
						</DashboardButton>

						<div className="relative w-70">
								<img
					    		  src="/images/router.webp"
					    		  alt="overlay"
					    		  className="max-w-none absolute right-0 top-[-70%] w-40 h-auto -mr-15"
					    		/>

					    		<img
					    		  src="/images/drill.png"
					    		  alt="drill"
					    		  className="max-w-none w-76 h-auto right-0 rotate-25 -mr-24"
					    		/>

					    		<img
					    		  src="/images/paintbrush.png"
					    		  alt="overlay"
					    		  className="max-w-none absolute right-0 top-[80%] -rotate-60 w-40 h-auto -ml-20"
					    		/>
					  	</div>

					</div>

    				{/* Learn More */}
    				<div className="pb-30 mt-10 text-center">
    					<p className="font-semibold text-lg">Learn More ↓</p>
    				</div>

					<div className="max-w-2xl mx-auto px-4 pb-30 mt-10 text-center">
						<h1 id="about" className="text-5xl pb-10">About</h1>
						<p className="text-xl">Looking for a way to earn extra cash around your class schedule? Our free platform connects college students with quick, flexible gigs—everything from dog-walking and tutoring to helping someone move—so you can pick up work whenever you have a spare hour. Simply sign up, build your profile with your skills and location, and browse available tasks; when a job that matches you pops up nearby, you’ll get a notification and can choose to accept or decline in one click. No long-term commitment, no hidden fees—just on-demand work that fits your life. Ready to make money on your terms? Learn more today!</p>
					</div>

					<div className="max-w-2xl mx-auto px-4 pb-30 mt-10 text-center">
						<h1 id="Developers" className="text-5xl pb-10">Developers</h1>
						<h3 className="text-xl">Grace Peebles</h3>
						<h3 className="text-xl">Konrad Kapusta</h3>
						<h3 className="text-xl">Omar Badr</h3>
						<h3 className="text-xl">Robert Rodarte</h3>
						<h3 className="text-xl">Tori Nguyen</h3>
					</div>

				</div>
			</Layout>
		</div>
	);
}
