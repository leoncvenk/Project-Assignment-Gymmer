import requests
import json
import time
import os

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

BASE_URL = "https://mercatoronline.si"

def poisci_izdelke(iskalni_niz, limit=100, offset=0):
    """
    Poišče Mercator izdelke glede na iskalni niz.
    """

    url = f"{BASE_URL}/products/browseProducts/getProducts"

    print("=== MERCATOR SEARCH SCRAPER ===")
    print(f"Iščem izdelke za: {iskalni_niz}")

    izdelki = []
    offset = 0

    try:
        while True:
            params = {
                "limit": limit,
                "offset": offset,
                "filterData[search]": iskalni_niz,
                "from": offset,
                "_": int(time.time() * 1000)
            }

            print(f"\nPridobivam izdelke od offseta: {offset}")

            odgovor = requests.get(url, headers=HEADERS, params=params)

            if odgovor.status_code != 200:
                print(f"Napaka pri GET requestu: {odgovor.status_code}")
                break

            podatki = odgovor.json()
            products = podatki.get("products", [])

            if not products:
                print("Ni več izdelkov.")
                break

            for item in products:
                data = item.get("data", {})

                izdelek = {
                    "trgovina": "Mercator",
                    "url": BASE_URL + item.get("url", ""),
                    "ime_izdelka": data.get("name", ""),
                    "cena": data.get("current_price", ""),
                    "hranilne_vrednosti": {}
                }

                izdelki.append(izdelek)

            print(f"Dodanih izdelkov: {len(products)}")

            offset += limit
            time.sleep(0.5)

        return izdelki

    except Exception as e:
        print(f"Napaka pri iskanju izdelkov: {e}")
        return []

def shrani_v_json(izdelki, ime_datoteke):
    """
    Shrani izdelke v JSON datoteko.
    """

    os.makedirs("data", exist_ok=True)

    pot = os.path.join("data", ime_datoteke)

    with open(pot, "w", encoding="utf-8") as datoteka:
        json.dump(izdelki, datoteka, indent=4, ensure_ascii=False)

    print(f"\nJSON shranjen v: {pot}")

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

    iskanje = input("Vnesi iskalni niz: ")

    rezultati = poisci_izdelke(iskanje)

    print("\nScrapanje končano.")
    print(f"Najdenih izdelkov: {len(rezultati)}")

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

        shrani_v_json(rezultati, "mercator_mleko.json")

    else:
        print("Ni najdenih izdelkov.")