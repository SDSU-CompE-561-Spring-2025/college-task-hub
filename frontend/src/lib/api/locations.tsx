import axios from 'axios';
import { LocationType, LocationCreate } from '@/types/locations';

// Fetch Locations
export const fetchLocations = async (): Promise<LocationType[]> => {
	const token = localStorage.getItem('access_token');
	const response = await axios.get(`http://localhost:8000/api/location`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to fetch locations');
	}
	return response.data;
};

// Create Location component
export const createLocation = async (task: LocationCreate): Promise<LocationType> => {
	const token = localStorage.getItem('access_token');
	const response = await axios.post('http://localhost:8000/api/location', task, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (response.status !== 200) {
		throw new Error('Failed to create task');
	}
	return response.data;
};
