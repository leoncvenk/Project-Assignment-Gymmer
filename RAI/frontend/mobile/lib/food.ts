import { api } from "./api";
import { Food, FoodSearchParams } from "types/food";
import { getAuthToken } from "./auth";

export async function searchFoods(params: FoodSearchParams): Promise<Food[]> {
    const token = await getAuthToken()

    const response = await api.get("/foods", {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}