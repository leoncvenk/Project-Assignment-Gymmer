import requests
from bs4 import BeautifulSoup
import time
import json

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def pridobi_povezave_izdelkov():
    vse_povezave = set()
    trenutna_stran = 1
    print("=== KORAK 1: Iskanje izdelkov s filtri (Hrana in pijača) ===")
    
    while True:
        url_strani = f"https://www.tus.si/aktualno/akcijska-ponudba/aktualno-iz-kataloga/page/{trenutna_stran}/?swoof=1&product_cat_m=zamrznjeno%2Csladko-in-slano%2Calkoholne-pijace%2Cbrezalkoholne-pijace%2Chlajeni-in-mlecni-izdelki%2Ckruh-in-pekovski-izdelki%2Cmednarodna-hrana%2Cmeso-delikatesa-in-ribe%2Csadje-in-zelenjava%2Cshramba"
        odgovor = requests.get(url_strani, headers=HEADERS)
        
        if odgovor.status_code != 200:
            print(f"Stran {trenutna_stran} ne obstaja več. Končujem iskanje povezav.")
            break
            
        soup = BeautifulSoup(odgovor.text, 'html.parser')
        najdeni_na_tej_strani = 0
        
        for a_znacka in soup.find_all('a', href=True):
            href = a_znacka['href']
            if 'https://www.tus.si/izdelki/' in href:
                stari_count = len(vse_povezave)
                vse_povezave.add(href)
                if len(vse_povezave) > stari_count:
                    najdeni_na_tej_strani += 1
                    
        if najdeni_na_tej_strani == 0:
            break
            
        print(f"Najdeno {najdeni_na_tej_strani} izdelkov na strani {trenutna_stran}.")
        trenutna_stran += 1
        time.sleep(0.5)

    return list(vse_povezave)

def pridobi_podatke_izdelka(url):
    podatki_izdelka = {
        "url": url,
        "ime_izdelka": "Neznano",
        "hranilne_vrednosti": {}
    }
    
    try:
        odgovor_izdelka = requests.get(url, headers=HEADERS)
        soup_izdelka = BeautifulSoup(odgovor_izdelka.text, 'html.parser')
        
        h1 = soup_izdelka.find('h1')
        if h1:
            podatki_izdelka["ime_izdelka"] = h1.text.strip()
            
        tabele = soup_izdelka.find_all('table')
        for tabela in tabele:
            for vrstica in tabela.find_all('tr'):
                celice = vrstica.find_all(['td', 'th'])
                if len(celice) == 2:
                    kljuc = celice[0].text.strip()
                    vrednost = celice[1].text.strip()
                    if kljuc and vrednost:
                        podatki_izdelka["hranilne_vrednosti"][kljuc] = vrednost
                        
    except Exception as e:
        print(f"Napaka pri izdelku {url}: {e}")
        
    return podatki_izdelka