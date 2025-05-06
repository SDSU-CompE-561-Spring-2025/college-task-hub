'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SignInForm from './signInForm';
import RoleSelector from './roleSelector';
import { XIcon } from 'lucide-react';

export function SignInDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [role, setRole] = useState<'performer' | 'poster'>('performer');

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-4 text-lg font-semibold hover:cursor-pointer">
					Sign In
				</Button>
			</DialogTrigger>

			<DialogContent className="[&>button]:hidden backdrop-blur-sm bg-white dark:bg-gray-900/80">
				<DialogClose asChild={true}>
					<div className="flex flex-row justify-self-end rounded-full p-1 hover:bg-gray-100">
						<XIcon onClick={() => setOpen(false)} />
					</div>
				</DialogClose>

				<DialogTitle className="text-5xl mb-4">Sign In</DialogTitle>

				<RoleSelector
					role={role}
					setRole={setRole}
				/>

				<SignInForm role={role} onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
