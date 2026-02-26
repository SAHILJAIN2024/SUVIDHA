import { mockUsers } from "./mock-data";
import { User, Role } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(
    email: string,
    _password: string
): Promise<{ user: User; token: string } | null> {
    await delay(600);
    const user = mockUsers.find((u) => u.email === email);
    if (user) {
        return { user, token: "mock-jwt-token-" + user.id };
    }
    // For demo, allow any login with default citizen role
    return {
        user: { ...mockUsers[0], email, name: email.split("@")[0] },
        token: "mock-jwt-token-demo",
    };
}

export async function register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
}): Promise<{ user: User; token: string }> {
    await delay(800);
    const newUser: User = {
        id: `u${mockUsers.length + 1}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "citizen",
        ward: "Ward 12",
        aadhaarVerified: false,
        createdAt: new Date().toISOString(),
    };
    return { user: newUser, token: "mock-jwt-token-" + newUser.id };
}

export async function getCurrentUser(role?: Role): Promise<User> {
    await delay(200);
    if (role) {
        const user = mockUsers.find((u) => u.role === role);
        if (user) return user;
    }
    return mockUsers[0];
}
