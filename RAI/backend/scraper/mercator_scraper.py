import requests
from bs4 import BeautifulSoup
import time
import json

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

BASE_URL = "https://mercatoronline.si"


def pridobi_povezavo_strani():
    """
    Vrne URL glavne strani z izdelki.
    """

    return f"{BASE_URL}/brskaj"


def pridobi_izdelke():
    """
    Pridobi vse izdelke iz Mercator spletne trgovine.
    """

    url = pridobi_povezavo_strani()

    print("=== MERCATOR SCRAPER ===")
    print(f"Odpiram stran: {url}")

    vsi_izdelki = []

    try:
        odgovor = requests.get(url, headers=HEADERS)

        if odgovor.status_code != 200:
            print(f"Napaka pri dostopu do strani: {odgovor.status_code}")
            return []

        soup = BeautifulSoup(odgovor.text, "html.parser")

        produkti = soup.find_all(
            "div",
            class_="box item product rotation size11"
        )

        print(f"Najdenih produktov: {len(produkti)}")

        for produkt in produkti:

            izdelek = {
                "trgovina": "Mercator",
                "url": "",
                "ime_izdelka": "",
                "cena": "",
                "hranilne_vrednosti": {}
            }

            vsi_izdelki.append(izdelek)

        return vsi_izdelki

    except Exception as e:
        print(f"Napaka pri scrapanju: {e}")
        return []


if __name__ == "__main__":

    rezultati = pridobi_izdelke()

    print("\nScrapanje končano.")

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))