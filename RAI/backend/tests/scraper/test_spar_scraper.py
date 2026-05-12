import pytest
from unittest.mock import MagicMock

from scraper.spar_scraper import pridobi_hranilne_vrednosti

def test_pridobi_hranilne_vrednosti_spar_uspesno():

    lazni_html = """
    <div>
        <h2>Povprečna hranilna vrednost</h2>
        <p>Energijska vrednost: 282 kcal</p>
        <p>Maščobe: 1,00 g</p>
        <p>Ogljikovi hidrati: 58,00 g</p>
    </div>
    """
    
    mock_page = MagicMock()
    mock_page.content.return_value = lazni_html
    
    test_url = "https://online.spar.si/p/testni-izdelek"
    rezultat = pridobi_hranilne_vrednosti(mock_page, test_url)
    
    assert "Maščobe" in rezultat
    assert rezultat["Maščobe"] == "1,00 g"
    assert "Ogljikovi hidrati" in rezultat
    assert rezultat["Ogljikovi hidrati"] == "58,00 g"
    
    mock_page.goto.assert_called_once_with(test_url, wait_until="networkidle")