import axios from "axios";

export type ReviewPayload = {
  //reviewerName: string;
  //reviewerProfilePicture: string;
  //jobTitle: string;
  rating: number;
  comment: string;
  giver_id: number;
  receiver_id: number;
};

export const submitReview = async (data: ReviewPayload) => {
  try {
    const response = await axios.post("http://localhost:8000/api/rating", data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to submit review:", error.response?.data || error.message);
    throw new Error("Failed to submit review");
  }
};
