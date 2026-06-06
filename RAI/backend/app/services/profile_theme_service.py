from pathlib import Path
import sys


def get_project_root() -> Path:
    """
    Vrne root mapo projekta Project-Assignment-Gymmer.

    Trenutna datoteka:
    RAI/backend/app/services/profile_theme_service.py

    Zato gremo 4 nivoje navzgor:
    services -> app -> backend -> RAI -> root projekta
    """
    return Path(__file__).resolve().parents[4]


def get_orv_path() -> Path:
    """
    Vrne pot do ORV mape.
    """
    return get_project_root() / "ORV"


def generate_profile_theme_for_image(image_path: str | Path) -> dict:
    """
    Iz slike generira barvno temo profila z ORV modulom profile_theme.py.

    Vrne:
    {
        "dominant_color": "#...",
        "secondary_color": "#...",
        "text_color": "#...",
        "banner_gradient": "linear-gradient(...)"
    }
    """
    orv_path = get_orv_path()

    if not orv_path.exists():
        raise FileNotFoundError(f"ORV folder was not found: {orv_path}")

    if str(orv_path) not in sys.path:
        sys.path.append(str(orv_path))

    from profile_theme import generate_profile_theme

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image was not found: {image_path}")

    return generate_profile_theme(image_path)