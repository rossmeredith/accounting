"""Default chart of accounts (UK-style SME nominals)."""

from dataclasses import dataclass
from typing import Literal

AccountTypeSlug = Literal["asset", "liability", "equity", "income", "expense"]


@dataclass(frozen=True)
class DefaultNominalChild:
    code: str
    name: str


@dataclass(frozen=True)
class DefaultNominalGroup:
    code: str
    name: str
    account_type: AccountTypeSlug
    children: tuple[DefaultNominalChild, ...]


DEFAULT_NOMINAL_TREE: tuple[DefaultNominalGroup, ...] = (
    DefaultNominalGroup(
        code="CA",
        name="Current assets",
        account_type="asset",
        children=(
            DefaultNominalChild("1000", "Bank current account"),
            DefaultNominalChild("1100", "Trade debtors"),
            DefaultNominalChild("1200", "Other debtors"),
        ),
    ),
    DefaultNominalGroup(
        code="FA",
        name="Fixed assets",
        account_type="asset",
        children=(DefaultNominalChild("1500", "Tangible fixed assets"),),
    ),
    DefaultNominalGroup(
        code="CL",
        name="Current liabilities",
        account_type="liability",
        children=(
            DefaultNominalChild("2000", "Trade creditors"),
            DefaultNominalChild("2100", "VAT control"),
            DefaultNominalChild("2200", "PAYE/NI liability"),
        ),
    ),
    DefaultNominalGroup(
        code="EQ",
        name="Equity",
        account_type="equity",
        children=(
            DefaultNominalChild("3000", "Share capital"),
            DefaultNominalChild("3100", "Retained earnings"),
            DefaultNominalChild("3200", "Profit and loss account"),
        ),
    ),
    DefaultNominalGroup(
        code="INC",
        name="Income",
        account_type="income",
        children=(
            DefaultNominalChild("4000", "Sales"),
            DefaultNominalChild("4100", "Other operating income"),
        ),
    ),
    DefaultNominalGroup(
        code="EXP",
        name="Expenses",
        account_type="expense",
        children=(
            DefaultNominalChild("5000", "Purchases"),
            DefaultNominalChild("5100", "Rent"),
            DefaultNominalChild("5200", "Salaries and wages"),
            DefaultNominalChild("5300", "General administration"),
            DefaultNominalChild("5400", "Depreciation"),
            DefaultNominalChild("6100", "Interest payable"),
        ),
    ),
)

# Flat codes from the legacy single-level seed (pre-hierarchy).
LEGACY_FLAT_NOMINAL_CODES: tuple[str, ...] = (
    "1000",
    "1100",
    "1200",
    "1500",
    "2000",
    "2100",
    "2200",
    "3000",
    "3100",
    "3200",
    "4000",
    "4100",
    "5000",
    "5100",
    "5200",
    "5300",
    "5400",
    "6100",
)


def default_nominal_account_count() -> int:
    groups = len(DEFAULT_NOMINAL_TREE)
    children = sum(len(g.children) for g in DEFAULT_NOMINAL_TREE)
    return groups + children


def seed_default_nominal_tree(NominalAccount) -> None:
    """Create default groups and children (idempotent by code_path)."""
    for group in DEFAULT_NOMINAL_TREE:
        parent, _ = NominalAccount.objects.get_or_create(
            code_path=group.code,
            defaults={
                "code": group.code,
                "name": group.name,
                "account_type": group.account_type,
                "is_active": True,
                "tags": [],
            },
        )
        for child in group.children:
            child_path = f"{parent.code_path}/{child.code}"
            NominalAccount.objects.get_or_create(
                code_path=child_path,
                defaults={
                    "parent_id": parent.pk,
                    "code": child.code,
                    "name": child.name,
                    "account_type": group.account_type,
                    "is_active": True,
                    "tags": [],
                },
            )
