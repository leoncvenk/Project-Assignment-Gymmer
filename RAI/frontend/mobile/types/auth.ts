export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    access_token: string;
    token_type: string;
}

export type CurrentUserResponse = {
    id: string;
    username: string;
    email: string;
    profile_completed: boolean;
}