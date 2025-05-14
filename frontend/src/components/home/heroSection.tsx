'use client';
import React, { useState, useEffect } from 'react';
import AddressBar from '@/components/ui/addressBar';
import DashboardButton from '@/components/home/dashboardButton';
import ToolClusterLeft from '@/components/home/toolClusterLeft';
import ToolClusterRight from '@/components/home/toolClusterRight';
import { UserCheck, Watch, Wrench, Wifi, Truck, Smartphone, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/auth/signInForm';
import RoleSelector from '../auth/roleSelector';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useSearchParams } from 'next/navigation';

export default function HeroSection() {
	const router = useRouter();
	const [roleToSignIn, setRoleToSignIn] = useState<null | 'performer' | 'poster'>(null);

	const searchParams = useSearchParams();
	const showSignInParam = searchParams.get('showSignIn');

	useEffect(() => {
		if (showSignInParam === 'performer' || showSignInParam === 'poster') {
			setRoleToSignIn(showSignInParam);
			const url = new URL(window.location.href);
			url.searchParams.delete('showSignIn');
			window.history.replaceState({}, '', url.toString());
		}
	}, [showSignInParam]);

	const handleNavigation = (role: 'performer' | 'poster') => {
		const token = localStorage.getItem('access_token');
		if (token) {
			router.push(`/dashboard/${role}`);
		} else {
			setRoleToSignIn(role);
		}
	};

	return (
		<>
			<div className="pt-10">
				<AddressBar />
			</div>

			<div className="flex w-full justify-between items-center pt-30 pb-24 space-x-25 overflow-hidden">
				<ToolClusterLeft />

				<DashboardButton
					onClick={() => handleNavigation('performer')}
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
					onClick={() => handleNavigation('poster')}
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

				<ToolClusterRight />
			</div>

			<Dialog
				open={!!roleToSignIn}
				onOpenChange={(open) => !open && setRoleToSignIn(null)}
			>
				<DialogContent className="[&>button]:hidden backdrop-blur-sm bg-white dark:bg-gray-900/80">
					<DialogClose asChild={true}>
						<div className="flex flex-row justify-self-end rounded-full p-1 hover:bg-gray-100">
							<XIcon onClick={() => setRoleToSignIn(null)} />
						</div>
					</DialogClose>
					<DialogTitle className="text-5xl mb-4">Sign In</DialogTitle>
					<RoleSelector
						role={roleToSignIn}
						setRole={setRoleToSignIn}
					/>

					<SignInForm
						role={roleToSignIn ?? 'performer'}
						onSuccess={() => setRoleToSignIn(null)}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
