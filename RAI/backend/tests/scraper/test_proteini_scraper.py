from unittest.mock import patch, Mock

from scraper.proteini_scraper import poisci_vse_izdelke


def test_poisci_vse_izdelke_vrne_pravilno_strukturo():
    ajax_response = Mock()
    ajax_response.status_code = 200
    ajax_response.json.return_value = {
        "status": "OK",
        "content": """
        <html>
            <body>
                <a href="/sl/beljakovine/test-product" class="product-box">
                    Test product
                </a>
            </body>
        </html>
        """
    }

    empty_ajax_response = Mock()
    empty_ajax_response.status_code = 200
    empty_ajax_response.json.return_value = {
        "status": "OK",
        "content": ""
    }

    product_response = Mock()
    product_response.status_code = 200
    product_response.text = """
    <html>
        <body>
            <h1>TEST PROTEIN</h1>
            <div class="price">19,99 €</div>
            <table>
                <tr>
                    <td>energijska vrednost</td>
                    <td>1500 kJ/350 kcal</td>
                </tr>
                <tr>
                    <td>beljakovine</td>
                    <td>25 g</td>
                </tr>
            </table>
        </body>
    </html>
    """

    with patch(
        "scraper.proteini_scraper.requests.post",
        side_effect=[ajax_response, empty_ajax_response]
    ), patch(
        "scraper.proteini_scraper.requests.get",
        side_effect=[product_response]
    ):
        rezultat = poisci_vse_izdelke("https://www.proteini.si/sl/vsi-izdelki/")

    assert len(rezultat) == 1
    assert rezultat[0]["trgovina"] == "Proteini.si"
    assert rezultat[0]["url"] == "https://www.proteini.si/sl/beljakovine/test-product"
    assert rezultat[0]["ime_izdelka"] == "TEST PROTEIN"
    assert rezultat[0]["cena"] == "19,99 €"
    assert rezultat[0]["hranilne_vrednosti"]["energijska vrednost"] == "1500 kJ/350 kcal"
    assert rezultat[0]["hranilne_vrednosti"]["beljakovine"] == "25 g"