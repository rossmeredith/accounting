import json

import pytest

from ledger.default_accounts import default_nominal_account_count
from ledger.models import NominalAccount
from tests.test_auth_api import _csrf_headers, _register


def _create_nominal_payload(
    code="4900",
    name="Consulting income",
    account_type="income",
    parent_id=None,
    tags=None,
):
    body = {
        "code": code,
        "name": name,
        "account_type": account_type,
    }
    if parent_id is not None:
        body["parent_id"] = parent_id
    if tags is not None:
        body["tags"] = tags
    return body


@pytest.mark.django_db
def test_default_nominal_accounts_seeded():
    assert NominalAccount.objects.count() == default_nominal_account_count()
    assert NominalAccount.objects.filter(code="CA", name="Current assets").exists()
    assert NominalAccount.objects.filter(code="FA", name="Fixed assets").exists()
    assert NominalAccount.objects.filter(code="CL", name="Current liabilities").exists()
    current_assets = NominalAccount.objects.get(code="CA")
    assert current_assets.statement_class == "balance_sheet"
    income = NominalAccount.objects.get(code="INC")
    assert income.statement_class == "profit_or_loss"
    bank = NominalAccount.objects.get(code_path="CA/1000")
    assert bank.parent.code == "CA"
    assert bank.statement_class == "balance_sheet"
    assert bank.name == "Bank current account"


@pytest.mark.django_db
def test_list_nominal_accounts_requires_auth(client):
    response = client.get("/api/nominal-ledger/accounts")
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_and_list_nominal_account__api(client):
    _register(client)
    headers = _csrf_headers(client)
    seeded_count = NominalAccount.objects.count()
    income = NominalAccount.objects.get(code="INC")

    create = client.post(
        "/api/nominal-ledger/accounts",
        data=json.dumps(
            _create_nominal_payload(
                code="4900",
                parent_id=income.id,
                tags=["revenue", "consulting"],
            ),
        ),
        content_type="application/json",
        **headers,
    )
    assert create.status_code == 201
    body = create.json()
    assert body["code"] == "4900"
    assert body["code_path"] == "INC/4900"
    assert body["parent_id"] == income.id
    assert body["tags"] == ["revenue", "consulting"]
    assert body["statement_class"] == "profit_or_loss"

    listing = client.get("/api/nominal-ledger/accounts")
    assert listing.status_code == 200
    assert len(listing.json()) == seeded_count + 1


@pytest.mark.django_db
def test_create_child_account_type_must_match_parent__api(client):
    _register(client)
    headers = _csrf_headers(client)
    current_assets = NominalAccount.objects.get(code="CA")

    mismatch = client.post(
        "/api/nominal-ledger/accounts",
        data=json.dumps(
            _create_nominal_payload(
                code="9999",
                name="Wrong branch",
                account_type="expense",
                parent_id=current_assets.id,
            ),
        ),
        content_type="application/json",
        **headers,
    )
    assert mismatch.status_code == 400
    assert "parent" in mismatch.json()["detail"].lower()


@pytest.mark.django_db
def test_create_nominal_duplicate_path_same_parent__api(client):
    _register(client)
    headers = _csrf_headers(client)
    bank = NominalAccount.objects.get(code_path="CA/1000")

    duplicate = client.post(
        "/api/nominal-ledger/accounts",
        data=json.dumps(
            _create_nominal_payload(
                code="1000",
                name="Other",
                account_type="asset",
                parent_id=bank.parent_id,
            ),
        ),
        content_type="application/json",
        **headers,
    )
    assert duplicate.status_code == 400
    assert "hierarchy" in duplicate.json()["detail"].lower()


@pytest.mark.django_db
def test_same_code_under_different_parents__api(client):
    _register(client)
    headers = _csrf_headers(client)
    current_assets = NominalAccount.objects.get(code="CA")
    current_liabilities = NominalAccount.objects.get(code="CL")

    child_a = client.post(
        "/api/nominal-ledger/accounts",
        data=json.dumps(
            _create_nominal_payload(
                code="99",
                name="Det A",
                account_type="asset",
                parent_id=current_assets.id,
            ),
        ),
        content_type="application/json",
        **headers,
    )
    child_b = client.post(
        "/api/nominal-ledger/accounts",
        data=json.dumps(
            _create_nominal_payload(
                code="99",
                name="Det B",
                account_type="liability",
                parent_id=current_liabilities.id,
            ),
        ),
        content_type="application/json",
        **headers,
    )
    assert child_a.status_code == 201
    assert child_b.status_code == 201
    assert child_a.json()["code_path"] == "CA/99"
    assert child_b.json()["code_path"] == "CL/99"
