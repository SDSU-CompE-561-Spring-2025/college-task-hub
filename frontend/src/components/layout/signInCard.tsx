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
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					<Link href="/auth/sign-up">New to TaskU? Sign Up</Link>
					<br />
					<Link href="/auth/forgot-password">Forgot Password?</Link>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Username</Label>
							<Input
								id="username"
								placeholder="Username"
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Password</Label>
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
		</Card>
	);
};

export default SignInCard;
