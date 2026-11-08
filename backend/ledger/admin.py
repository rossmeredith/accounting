from django.contrib import admin

from .models import NominalAccount


@admin.register(NominalAccount)
class NominalAccountAdmin(admin.ModelAdmin):
    list_display = (
        "code_path",
        "code",
        "name",
        "account_type",
        "statement_class",
        "is_active",
    )
    list_filter = ("statement_class", "account_type", "is_active")
    search_fields = ("code", "code_path", "name")
    raw_id_fields = ("parent",)
