import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/api/users';
import { UserCreate } from '@/types/users';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const NAME_REGEX = /^[A-Za-z]+ [A-Za-z]+$/;

export default function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
	const [formData, setFormData] = useState<UserCreate>({
		name: '',
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [serverError, setServerError] = useState<string | null>(null);

	const validate = () => {
		const newErrors: typeof errors = {};
		const [firstName, lastName] = formData.name.trim().split(' ');

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required.';
		} else if (!NAME_REGEX.test(formData.name.trim())) {
			newErrors.name = 'Name must contain only letters and include both first and last name.';
		} else if (firstName.length < 2 || lastName.length < 2) {
			newErrors.name = 'First and last name must be at least 2 characters long.';
		}

		// Email validation
		if (!formData.email) {
			newErrors.email = 'Email is required.';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Enter a valid email.';
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = 'Password is required.';
		} else if (!PASSWORD_REGEX.test(formData.password)) {
			newErrors.password =
				'Password must be at least 8 characters, include 1 letter and 1 number.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError(null);
		
		if (!validate()) return;
		
		try {
			const response = await signUp(formData);
			console.log('User signed up successfully:', response);
			if (onSuccess) {
				onSuccess();
			}
		} catch (error: any) {
			console.error('Error signing up:', error);
			
			// Handle specific error cases
			if (error.response?.status === 409) {
				setServerError('An account with this email already exists.');
			} else if (error.response?.status === 422) {
				// Handle validation errors from the server
				const validationErrors = error.response.data.detail;
				if (Array.isArray(validationErrors)) {
					const errorMessages = validationErrors.map(err => err.msg).join(', ');
					setServerError(errorMessages);
				} else {
					setServerError('Invalid input. Please check your information and try again.');
				}
			} else {
				setServerError('An unexpected error occurred. Please try again later.');
			}
		}
	};

	const getNameParts = () => formData.name.trim().split(' ');

	return (
		<form onSubmit={handleSubmit} noValidate>
			{serverError && (
				<div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
					{serverError}
				</div>
			)}

			{/* First and Last Name */}
			<div className="flex flex-row mx-2 my-4 gap-x-8">
				<div className="w-full">
					<h1 className="font-semibold">First Name</h1>
					<input
						type="text"
						placeholder="Required"
						className="w-full p-2 rounded-lg bg-gray-100"
						value={getNameParts()[0] || ''}
						onChange={(e) => {
							const value = e.target.value.replace(/[^A-Za-z]/g, '');
							setFormData({
								...formData,
								name: `${value} ${getNameParts()[1] || ''}`.trim(),
							});
						}}
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
						onChange={(e) => {
							const value = e.target.value.replace(/[^A-Za-z]/g, '');
							setFormData({
								...formData,
								name: `${getNameParts()[0] || ''} ${value}`.trim(),
							});
						}}
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
				By tapping the "Create Account" button, you agree to TaskU's Terms, including a waiver of
				your jury trial right, and Privacy Policy.
			</p>
		</form>
	);
}