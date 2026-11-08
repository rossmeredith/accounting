"""Paired with frontend/e2e/sign-up.spec.ts (test-fixtures/sign-up.json)."""

import json

import pytest
from django.contrib.auth import get_user_model

from .sign_up_fixtures import SIGN_UP

User = get_user_model()


def _csrf_headers(client):
    client.get("/api/auth/csrf")
    token = client.cookies["csrftoken"].value
    return {"HTTP_X_CSRFTOKEN": token}


def _post_register(client, payload: dict):
    headers = _csrf_headers(client)
    return client.post(
        "/api/auth/register",
        data=json.dumps(payload),
        content_type="application/json",
        **headers,
    )


@pytest.mark.django_db
def test_sign_up__success(client):
    """Pair: sign-up.spec.ts — sign up success."""
    payload = SIGN_UP["success"]
    assert User.objects.filter(email=payload["email"]).exists() is False

    response = _post_register(client, payload)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == payload["email"]
    assert isinstance(body["id"], int)

    user = User.objects.get(email=payload["email"])
    assert user.check_password(payload["password"]) is True

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == payload["email"]


@pytest.mark.django_db
def test_sign_up__rejects_duplicate_email(client):
    """Pair: sign-up.spec.ts — sign up shows error when email is taken."""
    payload = SIGN_UP["duplicate_email"]
    first = _post_register(client, payload)
    assert first.status_code == 201

    headers = _csrf_headers(client)
    client.post("/api/auth/logout", **headers)

    duplicate = _post_register(client, payload)
    assert duplicate.status_code == 400
    assert User.objects.filter(email=payload["email"]).count() == 1
