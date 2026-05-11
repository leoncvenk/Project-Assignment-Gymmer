import requests
import json

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

BASE_URL = "https://mercatoronline.si"


def pridobi_povezane_izdelke(product_id):
    """
    Pridobi povezane/podobne izdelke za podan Mercator product ID.
    """

    url = f"{BASE_URL}/products/products/getAjaxRelatedProducts"

    payload = {
        "productIds[]": product_id,
        "type": "crossale"
    }

    print("=== MERCATOR SCRAPER ===")
    print(f"Odpiram endpoint: {url}")
    print(f"Product ID: {product_id}")

    try:
        odgovor = requests.post(url, headers=HEADERS, data=payload)

        if odgovor.status_code != 200:
            print(f"Napaka pri POST requestu: {odgovor.status_code}")
            return []

        podatki = odgovor.json()
        izdelki = []

        for item in podatki.get("products", []):
            data = item.get("data", {})

            izdelek = {
                "trgovina": "Mercator",
                "url": BASE_URL + item.get("url", ""),
                "ime_izdelka": data.get("name", ""),
                "cena": data.get("current_price", ""),
                "hranilne_vrednosti": {}
            }

            izdelki.append(izdelek)

        return izdelki

    except Exception as e:
        print(f"Napaka pri pridobivanju izdelkov: {e}")
        return []


if __name__ == "__main__":
    rezultati = pridobi_povezane_izdelke("17931243")

    print("\nScrapanje končano.")

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))
    else:
        print("Ni najdenih izdelkov.")