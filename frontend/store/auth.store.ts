import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (user: User, token: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: (user, token) => {
                // Set cookie for middleware route protection
                document.cookie = `suvidha-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                // Remove cookie
                document.cookie =
                    "suvidha-auth-token=; path=/; max-age=0";

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: "suvidha-auth-storage", // localStorage key
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);