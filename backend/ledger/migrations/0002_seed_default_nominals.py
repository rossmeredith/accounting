from django.db import migrations

# Frozen flat seed (superseded by 0004_hierarchical_default_nominals).
_LEGACY_FLAT = (
    ("1000", "Bank current account", "asset"),
    ("1100", "Trade debtors", "asset"),
    ("1200", "Other debtors", "asset"),
    ("1500", "Tangible fixed assets", "asset"),
    ("2000", "Trade creditors", "liability"),
    ("2100", "VAT control", "liability"),
    ("2200", "PAYE/NI liability", "liability"),
    ("3000", "Share capital", "equity"),
    ("3100", "Retained earnings", "equity"),
    ("3200", "Profit and loss account", "equity"),
    ("4000", "Sales", "income"),
    ("4100", "Other operating income", "income"),
    ("5000", "Purchases", "expense"),
    ("5100", "Rent", "expense"),
    ("5200", "Salaries and wages", "expense"),
    ("5300", "General administration", "expense"),
    ("5400", "Depreciation", "expense"),
    ("6100", "Interest payable", "expense"),
)


def seed_default_nominals(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    for code, name, account_type in _LEGACY_FLAT:
        NominalAccount.objects.get_or_create(
            code=code,
            defaults={
                "name": name,
                "account_type": account_type,
                "is_active": True,
            },
        )


def unseed_default_nominals(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    codes = [code for code, _, _ in _LEGACY_FLAT]
    NominalAccount.objects.filter(code__in=codes).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("ledger", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_default_nominals, unseed_default_nominals),
    ]
