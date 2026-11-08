from django.db import migrations, models


def backfill_statement_class(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    balance_sheet = {"asset", "liability", "equity"}
    for account in NominalAccount.objects.all():
        if account.account_type in balance_sheet:
            account.statement_class = "balance_sheet"
        else:
            account.statement_class = "profit_or_loss"
        account.save(update_fields=["statement_class"])


class Migration(migrations.Migration):
    dependencies = [
        ("ledger", "0004_hierarchical_default_nominals"),
    ]

    operations = [
        migrations.AddField(
            model_name="nominalaccount",
            name="statement_class",
            field=models.CharField(
                choices=[
                    ("balance_sheet", "Balance sheet"),
                    ("profit_or_loss", "Profit or loss"),
                ],
                default="balance_sheet",
                max_length=20,
            ),
            preserve_default=False,
        ),
        migrations.RunPython(backfill_statement_class, migrations.RunPython.noop),
    ]
