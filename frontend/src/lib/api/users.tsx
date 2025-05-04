import axios from 'axios';
import { AccessToken, UserCreate, UserType, UserSignIn } from '@/types/users';

// Sign up function
export const signUp = async (userData: UserCreate): Promise<UserType[]> => {
	try {
		const response = await axios.post('http://localhost:8000/api/user', userData);
		return response.data;
	} catch (error) {
		console.error('Error signing up:', error);
		throw error;
	}
};

// Sign in function
export const signIn = async (data: UserSignIn): Promise<AccessToken> => {
	try {
		const response = await axios.post(
			'http://localhost:8000/api/user/token',
			{
				username: data.email,
				password: data.password,
				grant_type: 'password',
				scope: '',
				client_id: null,
				client_secret: null,
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		localStorage.setItem('access_token', response.data.access_token);
		return response.data;
	} catch (error) {
		console.error('Error signing in:', error);
		throw error;
	}
};
