import django.db.models.deletion
from django.db import migrations, models


def populate_code_path(apps, schema_editor):
    NominalAccount = apps.get_model("ledger", "NominalAccount")
    for account in NominalAccount.objects.all():
        account.code_path = account.code
        account.save(update_fields=["code_path"])


class Migration(migrations.Migration):
    dependencies = [
        ("ledger", "0002_seed_default_nominals"),
    ]

    operations = [
        migrations.AddField(
            model_name="nominalaccount",
            name="parent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="children",
                to="ledger.nominalaccount",
            ),
        ),
        migrations.AddField(
            model_name="nominalaccount",
            name="code_path",
            field=models.CharField(default="", max_length=512, unique=False),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="nominalaccount",
            name="tags",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.RunPython(populate_code_path, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="nominalaccount",
            name="code",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="nominalaccount",
            name="code_path",
            field=models.CharField(max_length=512, unique=True),
        ),
        migrations.AlterModelOptions(
            name="nominalaccount",
            options={"ordering": ["code_path"]},
        ),
    ]
