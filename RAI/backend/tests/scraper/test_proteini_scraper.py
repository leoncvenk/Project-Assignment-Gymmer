from unittest.mock import patch, Mock

from scraper.proteini_scraper import poisci_izdelke_kategorije


def test_poisci_izdelke_kategorije_vrne_pravilno_strukturo():
    category_response = Mock()
    category_response.status_code = 200
    category_response.text = """
    <html>
        <body>
            <a href="/sl/beljakovine/test-product">Test product</a>
        </body>
    </html>
    """

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
        "scraper.proteini_scraper.requests.get",
        side_effect=[category_response, product_response]
    ):
        rezultat = poisci_izdelke_kategorije(
            "https://www.proteini.si/sl/vsi-izdelki/?product_group=2"
        )

    assert len(rezultat) == 1
    assert rezultat[0]["trgovina"] == "Proteini.si"
    assert rezultat[0]["url"] == "https://www.proteini.si/sl/beljakovine/test-product"
    assert rezultat[0]["ime_izdelka"] == "TEST PROTEIN"
    assert rezultat[0]["cena"] == "19,99 €"
    assert rezultat[0]["hranilne_vrednosti"]["energijska vrednost"] == "1500 kJ/350 kcal"
    assert rezultat[0]["hranilne_vrednosti"]["beljakovine"] == "25 g"