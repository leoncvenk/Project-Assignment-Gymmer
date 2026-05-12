import json
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.proteini.si"
KATEGORIJA_URL = "https://www.proteini.si/sl/vsi-izdelki/?product_group=2"
KATEGORIJA_IME = "beljakovine"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}


def poisci_izdelke_kategorije(kategorija_url):
    """
    Pridobi izdelke iz izbrane Proteini.si kategorije.
    """

    izdelki = []

    try:
        odgovor = requests.get(kategorija_url, headers=HEADERS)

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

            href = href.split("?")[0]

            if not href.startswith("/sl/"):
                continue

            neproduktni_linki = [
                "/sl/",
                "/sl/vsi-izdelki/",
                "/sl/nasi-junaki",
                "/sl/prodajna-mesta",
                "/sl/profil",
                "/sl/kosarica",
                "/sl/cilji",
                "/sl/sporti",
                "/sl/nasveti",
            ]

            if href in neproduktni_linki:
                continue

            if href not in produkt_linki:
                produkt_linki.append(href)

        print(f"Najdenih produkt linkov: {len(produkt_linki)}")

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

    rezultati = poisci_izdelke_kategorije(KATEGORIJA_URL)

    print("\nNajdenih izdelkov:", len(rezultati))

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

    shrani_v_json(rezultati, f"proteini_{KATEGORIJA_IME}.json")