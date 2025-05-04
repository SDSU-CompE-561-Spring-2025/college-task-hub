export type UserCreate = {
	name: string;
	email: string;
	password: string;
};

export type UserType = UserCreate & {
	id: number;
};

export type AccessToken = {
	access_token: string;
	token_type: string;
};

export type UserSignIn = {
	email: string;
	password: string;
	grant_type: 'password';
	scope: string;
	client_id: string | null;
	client_secret: string | null;
};
