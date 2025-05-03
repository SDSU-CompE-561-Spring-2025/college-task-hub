import axios from 'axios';

export type UsersUpdate = {
  //name: string; // maps to "school" in your frontend form
  skills: string;
  email: string;
  phone_number: string;
  city: string;
};

export type UsersResponse = {
  id: number;
  name: string;
  skills: string;
  email: string;
  phone_number: string;
  roles: string;
  rating: number;
  city: string;
};

export const updateProfile = async (
  userId: number,
  data: UsersUpdate
): Promise<UsersResponse> => {
  try {
    const response = await axios.put(`http://localhost:8000/api/user/${userId}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Update failed:", error.response?.data || error.message);
    throw new Error('Failed to update profile');
  }
};
