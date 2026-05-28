# Gymmer CV - Modul za prepoznavo hrane

Ta repozitorij vsebuje kodo za pripravo podatkov in učenje modela računalniškega vida (YOLOv8) za prepoznavo hrane v aplikaciji Gymmer. Trenutno je implementiran sistem za samodejen zajem in pripravo označenega podatkovnega nabora s platforme Roboflow.

## 1. Pridobitev Roboflow API ključa

Za prenos podatkovnega nabora potrebuješ osebni API ključ.
1. Ustvari račun in se prijavi na [Roboflow](https://app.roboflow.com/).
2. V spodnjem levem kotu klikni na svojo profilno ikono in izberi **Settings**.
3. V levem meniju pod svojim delovnim prostorom (Workspace) klikni na **Roboflow API**.
4. Pod razdelkom **Private API Key** klikni na ikono za kopiranje (Copy). *Pozor: Tega ključa nikoli ne deli javno!*

## 2. Priprava lokalnega okolja

Za izolacijo knjižnic uporabljamo Python navidezno okolje (venv). Sledite spodnjim korakom v terminalu (Linux/macOS):

```bash
# 1. Ustvari navidezno okolje z imenom "venv"
python -m venv venv

# 2. Aktiviraj navidezno okolje
source venv/bin/activate
```
Opomba: Ko je okolje aktivirano, se bo v terminalu pred tvojim uporabniškim imenom pojavil napis (venv)).

## 3. Namestitev odvisnosti
Ko je navidezno okolje aktivirano, namesti potrebne knjižnice za prenos podatkov in branje okoljskih spremenljivk:

```Bash
pip install -r requirements.txt
```

```Bash
pip install roboflow python-dotenv
```

## 4. Konfiguracija varnostnih spremenljivk
API ključa ne smemo trdo kodirati v skripte, zato uporabljamo .env datoteko, ki je ignorirana s strani Gita.

V korenski mapi projekta ustvari datoteko z natančnim imenom .env

Vanjo prilepi svoj API ključ v naslednjem formatu (brez presledkov okoli enačaja):

```env
ROBOFLOW_API_KEY="tvoj_skrivni_api_kljuc_tukaj" 
```
## 5. Zagon skripte za prenos podatkov
Ko so nameščeni vsi paketi in je nastavljen .env dokument, preprosto poženite skripto:

```Bash
python prenos_podatkov.py
```
Skripta se bo avtenticirala pri Roboflow API-ju, ustvarila projektne mape in samodejno prenesla podatkovni nabor slik ter datoteko data.yaml v formatu, pripravljenem za YOLOv8.

### Pomembno za razvijalce: 
Pred vsakim potiskom kode (git push) preverite, da sta mapi venv/ ter datoteka .env vpisani v vašem .gitignore dokumentu!

## Generiranje teme profila
Modul `profile_theme.py` iz naložene profilne slike ustvari preprosto vizualno temo profila.

Za obdelavo slike uporablja OpenCV postopke, s katerimi:
- naloži in normalizira vhodno sliko,
- zmanjša sliko za hitrejšo obdelavo,
- odstrani zelo temne, zelo svetle in premalo nasičene piksle,
- z algoritmom K-means izračuna dominantno barvo slike,
- ustvari sekundarno barvo za banner gradient,
- glede na svetlost ozadja izbere berljivo barvo besedila.

Dobljeni rezultat se lahko uporabi v spletni ali mobilni aplikaciji za samodejno ustvarjanje personaliziranega bannerja uporabniškega profila.

Primer uporabe:

```bash
python profile_theme.py test-images/burger.jpg
