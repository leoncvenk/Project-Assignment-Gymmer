import { api } from "./api";
import {
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from "../types/auth";

export async function register(data: RegisterRequest) {
    const response = await api.post("/auth/register", data);
    return response.data;
}

export async function login(data: LoginRequest) {
    const response = await api.post("/auth/login", data);
    return response.data;
}

export async function getCurrentUser(token: string): Promise<CurrentUserResponse> {
    const response = await api.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    return response.data;
}