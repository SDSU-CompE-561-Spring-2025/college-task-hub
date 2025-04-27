import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import AddressBar from '@/components/ui/addressBar';
import { Button } from '@/components/ui/button';
import DashboardButton from '@/components/layout/dashboardButton';
import { User, PlusSquare } from 'lucide-react';

export default function Home() {
	return (
		<div>
			<Layout isHomePage={true}>
				
				<div className="flex flex-col items-center justify-center text-black">
					<div className="pt-10">
        				<AddressBar />
					</div>
      				<div className="flex pt-30 pb-30 space-x-25" >

						<DashboardButton icon={<User size={64} />}> Do Tasks! </DashboardButton>
						<DashboardButton icon={<PlusSquare size={64}/>}> Post Tasks! </DashboardButton>

					</div>


    				{/* Learn More */}
    				<div className="pb-10 mt-10 text-center">
    					<p className="font-semibold text-lg">Learn More ↓</p>
    				</div>

				</div>
			</Layout>
		</div>
	);
}
