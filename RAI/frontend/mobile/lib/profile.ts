import { api } from "./api";
import { CreateProfileRequest, ProfileResponse } from "types/profile";

export async function createProfile(
    token: string,
    payload: CreateProfileRequest,
): Promise<ProfileResponse> {
    const response = await api.put("/profiles/me", payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}