export type TaskCreate = {
	title: string;
	description: string;
	status: 'unassigned' | 'in-progress' | 'completed';
	price: number;
	user_id: number;
	location_id: number;
	duration: string;
	avatar?: string;
	category?: string;
};

export type TaskType = TaskCreate & {
	id: number;
	created_at: string;
	hasApplied?: boolean;
};
