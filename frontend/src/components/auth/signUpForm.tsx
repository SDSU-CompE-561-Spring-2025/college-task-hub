import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/api/users';
import { UserCreate } from '@/types/users';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
	// Use state to manage form data
	const [formData, setFormData] = useState<UserCreate>({
		name: '',
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const validate = () => {
		const newErrors: typeof errors = {};
		const [firstName, lastName] = formData.name.trim().split(' ');

		if (!firstName) newErrors.firstName = 'First name is required.';
		if (!lastName) newErrors.lastName = 'Last name is required.';

		if (!formData.email) {
			newErrors.email = 'Email is required.';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Enter a valid email.';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required.';
		} else if (!PASSWORD_REGEX.test(formData.password)) {
			newErrors.password =
				'Password must be at least 8 characters, include 1 letter and 1 number.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		
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

	const getNameParts = () => formData.name.trim().split(' ');

	return (
		<form onSubmit={handleSubmit} noValidate>
			{/* First and Last Name */}
			<div className="flex flex-row mx-2 my-4 gap-x-8">
				<div className="w-full">
					<h1 className="font-semibold">First Name</h1>
					<input
						type="text"
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100"
						value={getNameParts()[0] || ''}
						onChange={(e) =>
							setFormData({
								...formData,
								name: `${e.target.value} ${getNameParts()[1] || ''}`.trim(),
							})
						}
					/>
					{errors.firstName && (
						<p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
					)}
				</div>

				<div className="w-full">
					<h1 className="font-semibold">Last Name</h1>
					<input
						type="text"
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100"
						value={getNameParts()[1] || ''}
						onChange={(e) =>
							setFormData({
								...formData,
								name: `${getNameParts()[0] || ''} ${e.target.value}`.trim(),
							})
						}
					/>
					{errors.lastName && (
						<p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
					)}
				</div>
			</div>

			{/* Email */}
			<div className="mx-2 my-4">
				<h1 className="font-semibold">Email</h1>
				<input
					type="email"
					placeholder="Required"
					className="w-full p-2 rounded-lg bg-gray-100"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
				{errors.email && (
					<p className="text-red-600 text-sm mt-1">{errors.email}</p>
				)}
			</div>

			{/* Password */}
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
				{errors.password && (
					<p className="text-red-600 text-sm mt-1">{errors.password}</p>
				)}
			</div>

			{/* Submit */}
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