export type TaskCreate = {
	title: string;
	description: string;
	status?: string;
	price: number;
	user_id: number;
	location_id: number;
};

export type TaskType = TaskCreate & {
	id: number;
	created_at: string;
};
