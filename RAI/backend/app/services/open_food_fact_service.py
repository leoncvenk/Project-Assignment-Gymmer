import httpx

OPEN_FOOD_FACTS_BASE_URL = "https://world.openfoodfacts.org/api/v2/product"


class OpenFoodFactsService:
    async def get_product_by_barcode(
        self,
        barcode: str,
    ) -> dict | None:
        normalized_barcode = barcode.strip()

        if normalized_barcode == "":
            return None

        url = f"{OPEN_FOOD_FACTS_BASE_URL}/{normalized_barcode}.json"

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)

        if response.status_code != 200:
            return None

        payload = response.json()

        if payload.get("status") != 1:
            return None

        product = payload.get("product")

        if not product:
            return None

        return product