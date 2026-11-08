from ninja import Router, Schema, Status
from ninja.errors import HttpError
from ninja.security import django_auth

from ledger.models import AccountType, NominalAccount

router = Router(tags=["nominal-ledger"])


class NominalAccountOut(Schema):
    id: int
    parent_id: int | None
    code: str
    code_path: str
    name: str
    account_type: str
    statement_class: str
    tags: list[str]
    is_active: bool


class NominalAccountIn(Schema):
    parent_id: int | None = None
    code: str
    name: str
    account_type: str
    tags: list[str] | None = None


def _normalize_tags(raw: list[str] | None) -> list[str]:
    if not raw:
        return []
    seen: set[str] = set()
    tags: list[str] = []
    for item in raw:
        tag = item.strip()
        if not tag:
            continue
        key = tag.casefold()
        if key in seen:
            continue
        seen.add(key)
        tags.append(tag)
    return tags


def _account_out(account: NominalAccount) -> NominalAccountOut:
    return NominalAccountOut(
        id=account.id,
        parent_id=account.parent_id,
        code=account.code,
        code_path=account.code_path,
        name=account.name,
        account_type=account.account_type,
        statement_class=account.statement_class,
        tags=list(account.tags or []),
        is_active=account.is_active,
    )


def _valid_account_type(value: str) -> str:
    normalized = value.strip().lower()
    valid = {choice.value for choice in AccountType}
    if normalized not in valid:
        raise HttpError(
            400,
            f"Invalid account type. Choose one of: {', '.join(sorted(valid))}.",
        )
    return normalized


def _resolve_parent(parent_id: int | None) -> NominalAccount | None:
    if parent_id is None:
        return None
    parent = NominalAccount.objects.filter(pk=parent_id).first()
    if parent is None:
        raise HttpError(400, "Parent account not found.")
    return parent


def _validate_new_code_path(parent: NominalAccount | None, code: str) -> str:
    segment = code.strip()
    if not segment:
        raise HttpError(400, "Code is required.")
    if "/" in segment:
        raise HttpError(400, "Code cannot contain '/'.")
    path = segment if parent is None else f"{parent.code_path}/{segment}"
    if NominalAccount.objects.filter(code_path__iexact=path).exists():
        raise HttpError(
            400,
            "An account with that code already exists at this level in the hierarchy.",
        )
    return path


@router.get("/accounts", auth=django_auth, response={200: list[NominalAccountOut]})
def list_accounts(request):
    accounts = NominalAccount.objects.all()
    return [_account_out(a) for a in accounts]


@router.post(
    "/accounts",
    auth=django_auth,
    response={201: NominalAccountOut},
)
def create_account(request, data: NominalAccountIn):
    code = data.code.strip()
    name = data.name.strip()
    if not code:
        raise HttpError(400, "Code is required.")
    if not name:
        raise HttpError(400, "Name is required.")
    account_type = _valid_account_type(data.account_type)
    parent = _resolve_parent(data.parent_id)
    if parent is not None and account_type != parent.account_type:
        raise HttpError(
            400,
            "Account type must match the parent nominal's type.",
        )
    _validate_new_code_path(parent, code)
    tags = _normalize_tags(data.tags)
    account = NominalAccount(
        parent=parent,
        code=code,
        name=name,
        account_type=account_type,
        tags=tags,
    )
    account.save()
    return Status(201, _account_out(account))
