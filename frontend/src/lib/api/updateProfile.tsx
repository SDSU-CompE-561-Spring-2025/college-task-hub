import axios from 'axios';

export type UsersUpdate = {
  skills?: string;
  email: string;
  phone_number?: string;
  roles: string;
  name: string;
  rating: number;
   
};

export type UsersResponse = {
  id: number;
  name: string;
  skills: string;
  email: string;
  phone_number: string;
  roles: string;
  rating: number;
  //city: string;
};

export const updateProfile = async (
  userId: number,
  data: UsersUpdate
): Promise<UsersResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    console.log("Submitting profile update with data:", data);
    const response = await axios.put(`http://localhost:8000/api/user/${userId}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Update failed:", error.response?.data || error.message);
    throw new Error('Failed to update profile');
  }
};
