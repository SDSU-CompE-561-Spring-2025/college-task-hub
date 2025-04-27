import Link from 'next/link';
import React from 'react';
import Layout from '@/components/layout/layout';
import AddressBar from '@/components/ui/addressBar';
import { Button } from '@/components/ui/button';


export default function Home() {
	return (
		<div>
			<Layout isHomePage={true}>
				
				<div className="flex flex-col items-center justify-center text-black">
					<div className="pt-10">
        				<AddressBar />
					</div>
      				<div className="flex p-30 space-x-25" >
						<Button className="bg-sky-200 hover:bg-sky-400 border-2 border-black rounded-lg h-45 w-45">
						</Button>

						<Button className="bg-sky-200 hover:bg-sky-400 border-2 border-black rounded-lg h-45 w-45">

						</Button>
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
