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