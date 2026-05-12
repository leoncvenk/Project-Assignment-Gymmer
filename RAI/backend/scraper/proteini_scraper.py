import json
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.proteini.si"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def poisci_izdelek(url):
    """
    Pridobi podatke o enem Proteini.si izdelku.
    """

    izdelki = []

    try:
        odgovor = requests.get(url, headers=HEADERS)

        if odgovor.status_code != 200:
            print("Napaka:", odgovor.status_code)
            return izdelki

        soup = BeautifulSoup(odgovor.text, "html.parser")

        print("\n=== VSI LINKI ===")

        linki = soup.find_all("a")

        print("Število linkov:", len(linki))

        for link in linki[:30]:
            href = link.get("href")

            if href:
                print(href)

        # naslov
        naslov = soup.find("h1")

        if naslov:
            naslov = naslov.text.strip()
        else:
            naslov = "Ni naslova"

        # cena
        cena_element = soup.find("div", class_="price")

        if cena_element:
            cena = cena_element.text.strip()
        else:
            cena = "Ni cene"

        izdelek = {
            "trgovina": "Proteini.si",
            "url": url,
            "ime_izdelka": naslov,
            "cena": cena,
            "hranilne_vrednosti": {}
        }

        izdelki.append(izdelek)

        return izdelki

    except Exception as e:
        print("Napaka:", e)
        return izdelki


# TEST
print("=== PROTEINI SCRAPER ===")

url = "https://www.proteini.si/sl/energijska-hrana/energijske-ploscice"

rezultati = poisci_izdelek(url)

print("\nNajdenih izdelkov:", len(rezultati))

print("\nPrimer prvega izdelka:")
print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

with open("proteini_honey_bar.json", "w", encoding="utf-8") as file:
    json.dump(rezultati, file, indent=4, ensure_ascii=False)

print("\nJSON shranjen v proteini_honey_bar.json")