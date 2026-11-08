from django.db import migrations

from ledger.default_accounts import LEGACY_FLAT_NOMINAL_CODES, seed_default_nominal_tree


def reseed_hierarchical_defaults(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    NominalAccount.objects.filter(
        parent__isnull=True,
        code__in=LEGACY_FLAT_NOMINAL_CODES,
    ).delete()
    seed_default_nominal_tree(NominalAccount)


def unseed_hierarchical_defaults(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    from ledger.default_accounts import DEFAULT_NOMINAL_TREE

    paths: list[str] = []
    for group in DEFAULT_NOMINAL_TREE:
        paths.append(group.code)
        for child in group.children:
            paths.append(f"{group.code}/{child.code}")
    NominalAccount.objects.filter(code_path__in=paths).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("ledger", "0003_hierarchical_nominals"),
    ]

    operations = [
        migrations.RunPython(
            reseed_hierarchical_defaults, unseed_hierarchical_defaults
        ),
    ]
