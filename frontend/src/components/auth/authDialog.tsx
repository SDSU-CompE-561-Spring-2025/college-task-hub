'use client';

import { useState } from 'react';
import { SignInDialog } from './signInDialog';
import { SignUpDialog } from './signUpDialog';

export function AuthDialogs() {
	const [signInOpen, setSignInOpen] = useState(false);
	const [signUpOpen, setSignUpOpen] = useState(false);

	return (
		<>
			<SignInDialog
				open={signInOpen}
				setOpen={setSignInOpen}
			/>
			<SignUpDialog
				open={signUpOpen}
				setOpen={setSignUpOpen}
				onSignUpSuccess={() => {
					setSignUpOpen(false);
					setTimeout(() => setSignInOpen(true), 300); // slight delay to allow modal transition
				}}
			/>
		</>
	);
}
