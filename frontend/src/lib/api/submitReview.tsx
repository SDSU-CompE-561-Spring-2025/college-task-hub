import axios from "axios";

export type ReviewPayload = {
  rating: number;
  comment: string;
  giver_id: number;
  receiver_id: number;
  job_title: string;
};

export const submitReview = async (data: ReviewPayload) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post("http://localhost:8000/api/rating", data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to submit review:", error.response?.data || error.message);
    throw new Error("Failed to submit review");
  }
};
