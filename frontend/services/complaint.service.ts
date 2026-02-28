import { authFetch } from "./authFetch";

export const getMyComplaints = async () => {
  return authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/my`
  );
};