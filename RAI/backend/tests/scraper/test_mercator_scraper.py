from unittest.mock import patch, Mock

from scraper.mercator_scraper import poisci_izdelke


def test_poisci_izdelke_vrne_pravilno_strukturo():
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "products": [
            {
                "data": {
                    "name": "Sveže mleko, Mercator, 1 l",
                    "current_price": "1.15"
                },
                "url": "/izdelek/123/sveze-mleko-mercator-1-l"
            }
        ]
    }

    empty_response = Mock()
    empty_response.status_code = 200
    empty_response.json.return_value = {
        "products": []
    }

    with patch("scraper.mercator_scraper.requests.get", side_effect=[mock_response, empty_response]):
        rezultat = poisci_izdelke("mleko")

    assert len(rezultat) == 1
    assert rezultat[0]["trgovina"] == "Mercator"
    assert rezultat[0]["url"] == "https://mercatoronline.si/izdelek/123/sveze-mleko-mercator-1-l"
    assert rezultat[0]["ime_izdelka"] == "Sveže mleko, Mercator, 1 l"
    assert rezultat[0]["cena"] == "1.15"
    assert rezultat[0]["hranilne_vrednosti"] == {}