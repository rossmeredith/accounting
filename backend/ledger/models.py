from django.core.exceptions import ValidationError
from django.db import models


class AccountType(models.TextChoices):
    ASSET = "asset", "Asset"
    LIABILITY = "liability", "Liability"
    EQUITY = "equity", "Equity"
    INCOME = "income", "Income"
    EXPENSE = "expense", "Expense"


class StatementClass(models.TextChoices):
    BALANCE_SHEET = "balance_sheet", "Balance sheet"
    PROFIT_OR_LOSS = "profit_or_loss", "Profit or loss"


def statement_class_for_account_type(account_type: str) -> str:
    if account_type in {
        AccountType.ASSET,
        AccountType.LIABILITY,
        AccountType.EQUITY,
    }:
        return StatementClass.BALANCE_SHEET
    return StatementClass.PROFIT_OR_LOSS


class NominalAccount(models.Model):
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="children",
    )
    code = models.CharField(max_length=20)
    code_path = models.CharField(max_length=512, unique=True)
    name = models.CharField(max_length=255)
    account_type = models.CharField(max_length=20, choices=AccountType.choices)
    statement_class = models.CharField(
        max_length=20,
        choices=StatementClass.choices,
    )
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["code_path"]

    def __str__(self) -> str:
        return f"{self.code_path} — {self.name}"

    def clean(self) -> None:
        super().clean()
        if self.parent_id and self.parent_id == self.pk:
            raise ValidationError("An account cannot be its own parent.")
        if self.parent_id:
            if self.parent and self.account_type != self.parent.account_type:
                raise ValidationError(
                    "Account type must match the parent nominal's type."
                )
            ancestor = self.parent
            while ancestor is not None:
                if ancestor.pk == self.pk:
                    raise ValidationError("Circular parent chain is not allowed.")
                ancestor = ancestor.parent

    def build_code_path(self) -> str:
        code = self.code.strip()
        if not self.parent_id:
            return code
        parent = self.parent
        if parent is None:
            parent = NominalAccount.objects.get(pk=self.parent_id)
        return f"{parent.code_path}/{code}"

    def save(self, *args, **kwargs):
        self.statement_class = statement_class_for_account_type(self.account_type)
        self.code_path = self.build_code_path()
        self.full_clean()
        super().save(*args, **kwargs)
