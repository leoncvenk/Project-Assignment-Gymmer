import json
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.proteini.si"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def poisci_izdelek(url):
    """
    Pridobi podatke o Proteini.si izdelkih.
    """

    izdelki = []

    try:
        odgovor = requests.get(url, headers=HEADERS)

        if odgovor.status_code != 200:
            print("Napaka:", odgovor.status_code)
            return izdelki

        soup = BeautifulSoup(odgovor.text, "html.parser")

        print("\n=== ISKANJE PRODUKTOV ===")

        linki = soup.find_all("a")

        produkt_linki = []

        for link in linki:
            href = link.get("href")

            if not href:
                continue

            if "/sl/energijska-hrana/energijske-ploscice/" in href:

                # odstrani query parameterje
                href = href.split("?")[0]

                # odstrani duplicate
                if href not in produkt_linki:
                    produkt_linki.append(href)

        print("Najdenih produkt linkov:", len(produkt_linki))

        for link in produkt_linki[:10]:
            print(link)

        # loop čez vse produkte
        for produkt_url in produkt_linki:

            poln_url = BASE_URL + produkt_url

            try:
                produkt_odgovor = requests.get(poln_url, headers=HEADERS)

                if produkt_odgovor.status_code != 200:
                    continue

                produkt_soup = BeautifulSoup(produkt_odgovor.text, "html.parser")

                tekst = produkt_soup.get_text("\n", strip=True)

                if "Hranil" in tekst or "Energijska" in tekst or "Beljakovine" in tekst:
                    print("\n=== MOŽNE HRANILNE VREDNOSTI ===")

                    vrstice = tekst.split("\n")

                    for i, vrstica in enumerate(vrstice):
                        if "energijska" in vrstica.lower() or "beljakovine" in vrstica.lower():
                            for okolica in vrstice[max(0, i - 5): i + 20]:
                                print(okolica)
                            print("=== KONEC ===")
                            break

                # naslov
                naslov = produkt_soup.find("h1")

                if naslov:
                    naslov = naslov.text.strip()
                else:
                    naslov = "Ni naslova"

                # cena
                cena_element = produkt_soup.find("div", class_="price")

                if cena_element:
                    cena = cena_element.text.strip()
                else:
                    cena = "Ni cene"

                izdelek = {
                    "trgovina": "Proteini.si",
                    "url": poln_url,
                    "ime_izdelka": naslov,
                    "cena": cena,
                    "hranilne_vrednosti": {}
                }

                izdelki.append(izdelek)

            except Exception as e:
                print("Napaka pri produktu:", e)

        return izdelki

    except Exception as e:
        print("Napaka:", e)
        return izdelki


# TEST
print("=== PROTEINI SCRAPER ===")

url = "https://www.proteini.si/sl/energijska-hrana/energijske-ploscice"

rezultati = poisci_izdelek(url)

print("\nNajdenih izdelkov:", len(rezultati))

if rezultati:
    print("\nPrimer prvega izdelka:")
    print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

with open("proteini_honey_bar.json", "w", encoding="utf-8") as file:
    json.dump(rezultati, file, indent=4, ensure_ascii=False)

print("\nJSON shranjen v proteini_honey_bar.json")