from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time
import json
import os
import urllib.parse

BASE_URL = "https://online.spar.si"

def shrani_v_json(izdelki, ime_datoteke):
    """
    Shrani izdelke v JSON datoteko.
    """
    os.makedirs("data", exist_ok=True)
    pot = os.path.join("data", ime_datoteke)

    with open(pot, "w", encoding="utf-8") as datoteka:
        json.dump(izdelki, datoteka, indent=4, ensure_ascii=False)

    print(f"\nJSON shranjen v: {pot}")

    def pridobi_hranilne_vrednosti(page, url_izdelka):
    """
    Iz strani posameznega izdelka pridobi hranilne vrednosti.
    """
    hranilne_vrednosti = {}

    try:
        page.goto(url_izdelka, wait_until="networkidle")
        time.sleep(1)

        soup = BeautifulSoup(page.content(), "html.parser")
        iskalni_niz = soup.find(string=lambda text: text and "Povprečna hranilna vrednost" in text)

        if iskalni_niz and iskalni_niz.parent and iskalni_niz.parent.parent:
            blok = iskalni_niz.parent.parent
            for vrstica in list(blok.stripped_strings):
                if ":" in vrstica:
                    deli = vrstica.split(":", 1)
                    hranilne_vrednosti[deli[0].strip()] = deli[1].strip()

        return hranilne_vrednosti

    except Exception as e:
        print(f"Napaka pri hranilnih vrednostih za {url_izdelka}: {e}")
        return hranilne_vrednosti
    
    def poisci_izdelke(page, iskalni_niz, limit=3):
    """
    Poišče Spar izdelke glede na iskalni niz.
    """
    varni_niz = urllib.parse.quote(iskalni_niz)
    url = f"{BASE_URL}/search?name={varni_niz}"

    print("=== SPAR SEARCH SCRAPER ===")
    print(f"Iščem izdelke za: {iskalni_niz}")

    izdelki = []

    try:
        page.goto(url, wait_until="networkidle")

        try:
            page.locator('button:has-text("Sprejmi")').first.click(timeout=2000)
        except:
            pass
            
        try:
            page.wait_for_selector('a[href*="/p/"]', timeout=10000)
        except Exception:
            pass

        soup = BeautifulSoup(page.content(), "html.parser")
        povezave_izdelkov = []

        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/p/' in href:
                poln_url = f"{BASE_URL}{href}" if href.startswith('/') else href
                if poln_url not in povezave_izdelkov:
                    povezave_izdelkov.append(poln_url)

        print(f"Najdenih unikatnih povezav: {len(povezave_izdelkov)}")

        for url_izdelka in povezave_izdelkov[:limit]:
            izdelek = {
                "trgovina": "Spar",
                "url": url_izdelka,
                "ime_izdelka": "Neznano",
                "hranilne_vrednosti": {}
            }
            izdelki.append(izdelek)

        if izdelki:
            print(f"\nPridobivam hranilne vrednosti za izbrane izdelke...")
            for izdelek in izdelki:
                print(f"Odpiram: {izdelek['url']}")
                izdelek["hranilne_vrednosti"] = pridobi_hranilne_vrednosti(page, izdelek["url"])
                
                soup_izd = BeautifulSoup(page.content(), "html.parser")
                h1 = soup_izd.find('h1')
                if h1:
                    izdelek["ime_izdelka"] = h1.text.strip()

        return izdelki

    except Exception as e:
        print(f"Napaka pri iskanju izdelkov: {e}")
        return []
    
    if __name__ == "__main__":
    iskanje = input("Vnesi iskalni niz (npr. testenine): ")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        rezultati = poisci_izdelke(page, iskanje, limit=3)

        browser.close()

    print("\nScrapanje končano.")
    print(f"Najdenih in obdelanih izdelkov: {len(rezultati)}")

    if rezultati:
        print("\nPrimer prvega izdelka:")
        print(json.dumps(rezultati[0], indent=4, ensure_ascii=False))

        cisto_ime = iskanje.replace(" ", "_").lower()
        shrani_v_json(rezultati, f"spar_{cisto_ime}.json")
    else:
        print("Ni najdenih izdelkov.")