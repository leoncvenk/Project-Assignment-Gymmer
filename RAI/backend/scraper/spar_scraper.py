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