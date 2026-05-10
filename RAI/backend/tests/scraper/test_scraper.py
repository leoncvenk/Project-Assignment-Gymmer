import pytest
from unittest.mock import patch, MagicMock

from scraper.scraper import pridobi_podatke_izdelka

def test_pridobi_podatke_izdelka_uspesno():
    lazni_html = """
    <html>
        <body>
            <h1>Testni Izdelek</h1>
            <table>
                <tr><td>Energijska vrednost</td><td>100 kcal</td></tr>
                <tr><td>Maščobe</td><td>5 g</td></tr>
            </table>
        </body>
    </html>
    """
    
    with patch('scraper.scraper.requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.text = lazni_html
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        test_url = "https://www.tus.si/izdelki/test"
        rezultat = pridobi_podatke_izdelka(test_url)
        
        assert rezultat["ime_izdelka"] == "Testni Izdelek"
        assert rezultat["url"] == test_url
        assert rezultat["hranilne_vrednosti"]["Energijska vrednost"] == "100 kcal"
        assert rezultat["hranilne_vrednosti"]["Maščobe"] == "5 g"