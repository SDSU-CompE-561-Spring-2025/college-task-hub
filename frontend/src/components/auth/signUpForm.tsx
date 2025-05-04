import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/api/users';
import { UserCreate } from '@/types/users';

export default function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
	// Use state to manage form data
	const [formData, setFormData] = useState<UserCreate>({
		name: '',
		email: '',
		password: '',
	});

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await signUp(formData);
			console.log('User signed up successfully:', response);
			if (onSuccess) {
				onSuccess(); // Call the onSuccess callback if provided
			}
		} catch (error) {
			console.error('Error signing up:', error);
		}
	};

	const [showPassword, setShowPassword] = useState(false);

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-row mx-2 my-4 gap-x-8">
				<div>
					<h1 className="font-semibold">First Name</h1>
					<input
						type="text"
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100"
						value={formData.name.split(' ')[0]} // Extract the first name
						onChange={(e) =>
							setFormData({
								...formData,
								name: `${e.target.value} ${formData.name.split(' ')[1] || ''}`.trim(),
							})
						}
					/>
				</div>

				<div>
					<h1 className="font-semibold">Last Name</h1>
					<input
						type="text"
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100"
						value={formData.name.split(' ')[1] || ''} // Extract the last name
						onChange={(e) =>
							setFormData({
								...formData,
								name: `${formData.name.split(' ')[0] || ''} ${e.target.value}`.trim(),
							})
						}
					/>
				</div>
			</div>

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
						type={showPassword ? 'text' : 'password'} // 👈 toggle type
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

			<div className="flex justify-center mt-8 mb-8">
				<Button
					className="bg-sky-500 text-xl rounded-lg p-5 cursor-pointer hover:bg-sky-600"
					type="submit"
				>
					Create Account
				</Button>
			</div>

			<p className="text-gray-400 text-sm text-center mx-12">
				By tapping the “Create Account" button, you agree to TaskU’s Terms, including a waiver of
				your jury trial right, and Privacy Policy.
			</p>
		</form>
	);
}
