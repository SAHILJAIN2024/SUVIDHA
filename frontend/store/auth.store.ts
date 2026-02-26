import { create } from "zustand";
import { User, Role } from "@/types";
import { mockUsers } from "@/services/mock-data";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (user: User, token: string) => void;
    logout: () => void;
    switchRole: (role: Role) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    login: (user, token) => {
        // Set cookie for middleware route protection
        document.cookie = `suvidha-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({ user, token, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        // Remove auth cookie
        document.cookie = "suvidha-auth-token=; path=/; max-age=0";
        set({ user: null, token: null, isAuthenticated: false });
    },

    switchRole: (role) => {
        const matchedUser = mockUsers.find((u) => u.role === role);
        if (matchedUser) {
            set({ user: matchedUser, isAuthenticated: true });
        } else {
            set((state) => ({
                user: state.user ? { ...state.user, role } : null,
            }));
        }
    },

    setLoading: (isLoading) => set({ isLoading }),
}));
