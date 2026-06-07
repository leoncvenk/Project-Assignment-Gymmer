from pathlib import Path
import shutil
import sys
from uuid import uuid4


def get_project_root() -> Path:
    """
    Vrne root mapo projekta Project-Assignment-Gymmer.

    Trenutna datoteka:
    RAI/backend/app/services/cartoon_avatar_service.py

    Zato gremo 4 nivoje navzgor:
    services -> app -> backend -> RAI -> root projekta
    """
    return Path(__file__).resolve().parents[4]


def get_orv_path() -> Path:
    """
    Vrne pot do ORV mape.
    """
    return get_project_root() / "ORV"


def get_avatar_output_dir() -> Path:
    """
    Vrne mapo, kamor RAI backend shrani generirane cartoon avatarje.
    """
    output_dir = get_project_root() / "RAI" / "backend" / "uploads" / "cartoon-avatars"
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir


def generate_cartoon_avatar_for_image(image_path: str | Path) -> str:
    """
    Iz obstoječe profilne slike generira cartoon avatar z ORV modulom avatar_cartoon.py.

    Vrne URL, ki ga lahko frontend uporabi za prikaz slike, npr.:
    /uploads/cartoon-avatars/avatar_ab12cd34.png
    """
    orv_path = get_orv_path()

    if not orv_path.exists():
        raise FileNotFoundError(f"ORV folder was not found: {orv_path}")

    if str(orv_path) not in sys.path:
        sys.path.append(str(orv_path))

    from avatar_cartoon import generate_cartoon_avatar

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image was not found: {image_path}")

    output_dir = get_avatar_output_dir()

    result = generate_cartoon_avatar(
        image_path=image_path,
        output_dir=output_dir,
        color_count=5,
        max_size=512,
    )

    generated_path = Path(result["avatar_path"])

    final_filename = f"cartoon_avatar_{uuid4().hex[:8]}.png"
    final_path = output_dir / final_filename

    shutil.move(str(generated_path), str(final_path))

    return f"/uploads/cartoon-avatars/{final_filename}"