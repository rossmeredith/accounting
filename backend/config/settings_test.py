"""Test settings: in-memory SQLite so pytest can run with sockets fully disabled."""

from .settings import *  # noqa: F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

ALLOWED_HOSTS = ["testserver", "127.0.0.1", "localhost"]

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
