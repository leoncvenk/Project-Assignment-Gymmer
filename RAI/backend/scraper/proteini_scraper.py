import json
import requests
import time
from bs4 import BeautifulSoup

BASE_URL = "https://www.proteini.si"
VSI_IZDELKI_URL = "https://www.proteini.si/sl/vsi-izdelki/"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def poisci_vse_izdelke(url):
    """
    Pridobi vse izdelke iz Proteini.si z ajax pagination.
    """

    izdelki = []
    produkt_linki = []
    page = 1

    try:
        #while True: (za vse izdelke)
        while page <= 3:
            ajax_url = f"{url}?sorti=5&sort=5&page={page}&ajax=1"

            print(f"\nPridobivam stran: {page}")

            odgovor = requests.post(ajax_url, headers=HEADERS)

            if odgovor.status_code != 200:
                print("Napaka:", odgovor.status_code)
                break

            podatki = odgovor.json()
            html = podatki.get("content", "")

            if not html:
                print("Ni več vsebine.")
                break

            soup = BeautifulSoup(html, "html.parser")

            novi_linki = []

            produkti = soup.find_all("a", class_="product-box")

            for produkt in produkti:
                href = produkt.get("href")

                if not href:
                    continue

                href = href.split("?")[0]

                if href not in produkt_linki:
                    produkt_linki.append(href)
                    novi_linki.append(href)

            print(f"Novi produkti na strani: {len(novi_linki)}")
            print(f"Skupaj produkt linkov: {len(produkt_linki)}")

            if len(novi_linki) == 0:
                break

            page += 1
            time.sleep(0.3)

        print(f"\nSkupaj najdenih produkt linkov: {len(produkt_linki)}")

        for produkt_url in produkt_linki:
            poln_url = BASE_URL + produkt_url

            try:
                produkt_odgovor = requests.get(poln_url, headers=HEADERS)

                if produkt_odgovor.status_code != 200:
                    continue

                produkt_soup = BeautifulSoup(produkt_odgovor.text, "html.parser")

                naslov = produkt_soup.find("h1")

                if naslov:
                    naslov = naslov.text.strip()
                else:
                    naslov = "Ni naslova"

                cena_element = produkt_soup.find("div", class_="price")

                if cena_element:
                    cena = cena_element.text.strip()
                else:
                    cena = "Ni cene"

                hranilne_vrednosti = {}

                tabela = produkt_soup.find("table")

                if tabela:
                    vrstice = tabela.find_all("tr")

                    for vrstica in vrstice:
                        stolpci = vrstica.find_all(["td", "th"])

                        podatki = [
                            stolpec.get_text(strip=True)
                            for stolpec in stolpci
                        ]

                        if len(podatki) >= 2:
                            kljuc = podatki[0]
                            vrednost = podatki[1]

                            if kljuc != "":
                                hranilne_vrednosti[kljuc] = vrednost

                izdelek = {
                    "trgovina": "Proteini.si",
                    "url": poln_url,
                    "ime_izdelka": naslov,
                    "cena": cena,
                    "hranilne_vrednosti": hranilne_vrednosti
                }

                izdelki.append(izdelek)

            except Exception as e:
                print("Napaka pri produktu:", e)

        return izdelki

    except Exception as e:
        print("Napaka:", e)
        return izdelki


def shrani_v_json(izdelki, ime_datoteke):
    """
    Shrani izdelke v JSON datoteko.
    """

    with open(ime_datoteke, "w", encoding="utf-8") as file:
        json.dump(izdelki, file, indent=4, ensure_ascii=False)

    print(f"\nJSON shranjen v {ime_datoteke}")


if __name__ == "__main__":

    print("=== PROTEINI SCRAPER ===")

    rezultati = poisci_vse_izdelke(VSI_IZDELKI_URL)

    print("\nNajdenih izdelkov:", len(rezultati))

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

    shrani_v_json(rezultati, "proteini_vsi_izdelki.json")