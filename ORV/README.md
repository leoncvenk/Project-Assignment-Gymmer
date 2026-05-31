# Gymmer CV - Modul za prepoznavo hrane in fitnes opreme

Ta repozitorij vsebuje kodo za pripravo podatkov in učenje modela računalniškega vida **YOLOv11** za prepoznavo hrane in fitnes opreme v aplikaciji **Gymmer**.

Trenutno je implementiran sistem za samodejen zajem in pripravo označenega podatkovnega nabora s platforme **Roboflow** ter **FastAPI** strežnik za integracijo z aplikacijo.

---

## 1. Pridobitev Roboflow API ključa

Za prenos podatkovnega nabora potrebuješ osebni API ključ.

1. Ustvari račun in se prijavi na [Roboflow](https://app.roboflow.com/).
2. V spodnjem levem kotu klikni na svojo profilno ikono in izberi **Settings**.
3. V levem meniju pod svojim delovnim prostorom (**Workspace**) klikni na **Roboflow API**.
4. Pod razdelkom **Private API Key** klikni na ikono za kopiranje (**Copy**).

> **Pozor:** Tega ključa nikoli ne deli javno!

---

## 2. Priprava lokalnega okolja

Za izolacijo knjižnic uporabljamo Python navidezno okolje `venv`.

Sledite spodnjim korakom v terminalu:

```bash
# 1. Ustvari navidezno okolje z imenom "venv"
python -m venv venv
```

Aktivacija navideznega okolja:

```bash
# Linux/macOS:
source venv/bin/activate
```

```bash
# Windows CMD/PowerShell:
venv\Scripts\activate
```

> Opomba: Ko je okolje aktivirano, se bo v terminalu pred tvojim uporabniškim imenom pojavil napis `(venv)`.

---

## 3. Namestitev odvisnosti

Ko je navidezno okolje aktivirano, namesti potrebne knjižnice za prenos podatkov, branje okoljskih spremenljivk in zagon API strežnika:

```bash
pip install -r requirements.txt
```

Če katera od knjižnic še ni vključena v `requirements.txt`, jih lahko namestiš tudi ročno:

```bash
pip install roboflow python-dotenv fastapi uvicorn python-multipart
```

---

## 4. Konfiguracija varnostnih spremenljivk

API ključa ne smemo trdo kodirati v skripte, zato uporabljamo `.env` datoteko, ki je ignorirana s strani Gita.

V korenski mapi projekta ustvari datoteko z natančnim imenom:

```bash
.env
```

Vanjo prilepi svoj API ključ v naslednjem formatu, brez presledkov okoli enačaja:

```env
ROBOFLOW_API_KEY="tvoj_skrivni_api_kljuc_tukaj"
```

---

## 5. Zagon skripte za prenos podatkov

Ko so nameščeni vsi paketi in je nastavljen `.env` dokument, zaženi skripto:

```bash
python prenos_podatkov.py
```

Skripta se bo avtenticirala pri Roboflow API-ju, ustvarila projektne mape in samodejno prenesla podatkovni nabor slik ter datoteko `data.yaml` v formatu, pripravljenem za YOLOv8.

### Pomembno za razvijalce

Pred vsakim potiskom kode preverite, da sta mapa `venv/` in datoteka `.env` vpisani v `.gitignore` dokument:

```gitignore
venv/
.env
```

---

## 6. Zagon API strežnika

Za integracijo z mobilno aplikacijo Gymmer je na voljo **FastAPI** strežnik, ki na enem mestu obdeluje prepoznavo hrane in fitnes opreme.

Za zagon strežnika v aktiviranem okolju poženite:

```bash
uvicorn api:app --host 127.0.0.1 --port 8001 --reload
```

Strežnik bo dostopen na lokalnem naslovu.

Za priročno preizkušanje API-ja preko Swagger UI odprite brskalnik na naslovu:

```text
http://127.0.0.1:8001/docs
```

---

## 7. API končne točke

Na voljo sta dve ločeni končni točki. Obe uporabljata `POST` zahtevek z naloženo sliko.

### Detekcija hrane

```http
POST /predict/food
```

Ta končna točka se uporablja za prepoznavo hrane.

### Detekcija fitnes opreme

```http
POST /predict/gym
```

Ta končna točka se uporablja za prepoznavo fitnes opreme.

---

## 8. Primer JSON odgovora

Ob uspešni prepoznavi API vrne strukturiran JSON format, ki se lahko v bazi uporabi za nadaljnjo logiko, na primer za izračun kalorij ali izbiro vaje.

```json
{
    "found": [
        {
            "item": "lat pull down machine",
            "confidence": 0.73
        }
    ]
}
```

---

## 9. Generiranje teme profila

Modul `profile_theme.py` iz naložene profilne slike ustvari preprosto vizualno temo profila.

Za obdelavo slike uporablja OpenCV postopke, s katerimi:

* naloži in normalizira vhodno sliko,
* zmanjša sliko za hitrejšo obdelavo,
* odstrani zelo temne, zelo svetle in premalo nasičene piksle,
* z algoritmom K-means izračuna dominantno barvo slike,
* ustvari sekundarno barvo za banner gradient,
* glede na svetlost ozadja izbere berljivo barvo besedila.

Dobljeni rezultat se lahko uporabi v spletni ali mobilni aplikaciji za samodejno ustvarjanje personaliziranega bannerja uporabniškega profila.

Primer uporabe:

```bash
python profile_theme.py test-images/burger.jpg
```
