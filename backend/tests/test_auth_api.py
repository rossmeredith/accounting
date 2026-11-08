import json

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

User = get_user_model()


def _csrf_headers(client):
    client.get("/api/auth/csrf")
    token = client.cookies["csrftoken"].value
    return {"HTTP_X_CSRFTOKEN": token}


def _register(client, email="alice@example.com", password="Str0ngPass!"):
    headers = _csrf_headers(client)
    return client.post(
        "/api/auth/register",
        data=json.dumps({"email": email, "password": password}),
        content_type="application/json",
        **headers,
    )


@pytest.mark.django_db
def test_register_login_me_logout(client):
    response = _register(client)
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "alice@example.com"

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "alice@example.com"

    headers = _csrf_headers(client)
    out = client.post("/api/auth/logout", **headers)
    assert out.status_code == 200

    me = client.get("/api/auth/me")
    assert me.status_code == 401


@pytest.mark.django_db
def test_login_normalizes_email(client):
    _register(client, email="Bob@Example.com")
    headers = _csrf_headers(client)
    client.post("/api/auth/logout", **headers)

    headers = _csrf_headers(client)
    login = client.post(
        "/api/auth/login",
        data=json.dumps(
            {"email": "bob@example.com", "password": "Str0ngPass!"},
        ),
        content_type="application/json",
        **headers,
    )
    assert login.status_code == 200
    assert login.json()["email"] == "bob@example.com"


@pytest.mark.django_db
def test_password_change(client):
    _register(client)
    headers = _csrf_headers(client)
    bad = client.post(
        "/api/auth/password/change",
        data=json.dumps(
            {
                "current_password": "wrong",
                "new_password": "NewStr0ngPass!",
            },
        ),
        content_type="application/json",
        **headers,
    )
    assert bad.status_code == 400

    ok = client.post(
        "/api/auth/password/change",
        data=json.dumps(
            {
                "current_password": "Str0ngPass!",
                "new_password": "NewStr0ngPass!",
            },
        ),
        content_type="application/json",
        **headers,
    )
    assert ok.status_code == 200

    client.post("/api/auth/logout", **headers)
    headers = _csrf_headers(client)
    login = client.post(
        "/api/auth/login",
        data=json.dumps(
            {"email": "alice@example.com", "password": "NewStr0ngPass!"},
        ),
        content_type="application/json",
        **headers,
    )
    assert login.status_code == 200


@pytest.mark.django_db
def test_password_reset_flow(client):
    _register(client, email="reset@example.com")
    headers = _csrf_headers(client)
    client.post("/api/auth/logout", **headers)

    headers = _csrf_headers(client)
    request_reset = client.post(
        "/api/auth/password/reset",
        data=json.dumps({"email": "reset@example.com"}),
        content_type="application/json",
        **headers,
    )
    assert request_reset.status_code == 200
    assert len(mail.outbox) == 1

    user = User.objects.get(email="reset@example.com")
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    confirm = client.post(
        "/api/auth/password/reset/confirm",
        data=json.dumps(
            {
                "uid": uid,
                "token": token,
                "new_password": "ResetStr0ng1!",
            },
        ),
        content_type="application/json",
        **headers,
    )
    assert confirm.status_code == 200

    login = client.post(
        "/api/auth/login",
        data=json.dumps(
            {"email": "reset@example.com", "password": "ResetStr0ng1!"},
        ),
        content_type="application/json",
        **headers,
    )
    assert login.status_code == 200
