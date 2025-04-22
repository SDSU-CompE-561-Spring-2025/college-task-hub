import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignInCard = () => {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle className="text-xl font-bold">Login</CardTitle>
				<CardDescription>
					<p> Enter your information to log in to your account.</p>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Username</Label>
							<Input
								id="username"
								placeholder="Username or Email"
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">
								Password
								<Link
									href="/auth/forgot-password"
									className="ml-auto"
								>
									Forgot Password?
								</Link>
							</Label>
							<Input
								id="password"
								placeholder="Password"
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Sign In</Button>
			</CardFooter>
			<Link
				href="/auth/sign-up"
				className="flex justify-center"
			>
				Don't have an account? Sign Up
			</Link>
		</Card>
	);
};

export default SignInCard;
