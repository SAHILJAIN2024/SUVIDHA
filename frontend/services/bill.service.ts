import { authFetch } from "./authFetch";

export const getMyBills = async () => {
  return authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bills/my`
  );
};