import * as React from 'react';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const TaskCard = () => {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create Task</CardTitle>
				<CardDescription>Name, Describe, Post!</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Name of your task"
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Description</Label>
							<Input
								id="description"
								placeholder="Describe your task"
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Price</Label>
							<Input
								id="price"
								placeholder="Set your price"
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Create</Button>
			</CardFooter>
		</Card>
	);
};

export default TaskCard;
