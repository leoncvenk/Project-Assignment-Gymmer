import AsyncStorage from "@react-native-async-storage/async-storage"

import { api } from "./api";

import {
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest
} from "../types/auth";

const AUTH_TOKEN_KEY = "auth_token";

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

export async function saveAuthToken(token: string) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token)
}

export async function getAuthToken() {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY)
}

export async function removeAuthToken() {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY)
}