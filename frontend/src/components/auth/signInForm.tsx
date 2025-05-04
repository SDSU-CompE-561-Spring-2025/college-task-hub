// components/SignInForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/api/users';
import { UserSignIn } from '@/types/users';
import { useRouter } from 'next/navigation';

export default function SignInForm({ onSuccess }: { onSuccess?: () => void }) {
	const router = useRouter();
	const [formData, setFormData] = useState<UserSignIn>({
		email: '',
		password: '',
		grant_type: 'password',
		scope: '',
		client_id: null,
		client_secret: null,
	});
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await signIn(formData);
			console.log('User signed in successfully:', response);
			if (onSuccess) {
				onSuccess(); // Call the onSuccess callback if provided
			}
			router.push('/dashboard'); // Redirect to the home page after successful sign-in
		} catch (error) {
			console.error('Error signing in:', error);
		}
	};
	const [showPassword, setShowPassword] = useState(false);

	return (
		<form onSubmit={handleSubmit}>
			<div className="mx-2 my-4">
				<h1 className="font-semibold">Email</h1>
				<input
					type="email"
					placeholder="Required"
					className="w-full p-2 rounded-lg bg-gray-100"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
			</div>

			<div className="mx-2 my-4">
				<h1 className="font-semibold">Password</h1>
				<div className="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100 pr-10"
						value={formData.password}
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					/>
					<button
						type="button"
						className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
						onClick={() => setShowPassword((prev) => !prev)}
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>

			<div className="flex justify-center mt-8">
				<Button
					className="bg-sky-500 text-xl rounded-lg p-5 cursor-pointer hover:bg-sky-600"
					type="submit"
				>
					Sign In Now
				</Button>
			</div>
			<div className="flex justify-center mt-2 mb-4 text-sm cursor-pointer">
				<h1>Forgot Password?</h1>
			</div>

			<p className="text-gray-400 text-sm text-center mx-12">
				By tapping the “Sign In Now" button, you agree to TaskU’s Terms, including a waiver of your
				jury trial right, and Privacy Policy. We may text you a verification code. Msg & data rates
				apply.
			</p>
		</form>
	);
}
