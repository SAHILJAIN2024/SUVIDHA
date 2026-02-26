import { create } from "zustand";

interface UIState {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    theme: "light" | "dark" | "system";
    kioskMode: boolean;
    highContrast: boolean;
    fontScale: "normal" | "large" | "xl";
    modalOpen: string | null;

    toggleSidebar: () => void;
    toggleSidebarCollapse: () => void;
    setTheme: (theme: "light" | "dark" | "system") => void;
    toggleKioskMode: () => void;
    toggleHighContrast: () => void;
    setFontScale: (scale: "normal" | "large" | "xl") => void;
    openModal: (id: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    theme: "light",
    kioskMode: false,
    highContrast: false,
    fontScale: "normal",
    modalOpen: null,

    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setTheme: (theme) => set({ theme }),
    toggleKioskMode: () => set((s) => ({ kioskMode: !s.kioskMode })),
    toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
    setFontScale: (fontScale) => set({ fontScale }),
    openModal: (id) => set({ modalOpen: id }),
    closeModal: () => set({ modalOpen: null }),
}));
