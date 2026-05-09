from django.contrib import admin
from .models import CalculationHistory


@admin.register(CalculationHistory)
class CalculationHistoryAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'calculation_type', 'created_at']
    list_filter = ['calculation_type', 'created_at']
    search_fields = ['user_name', 'calculation_type']
    readonly_fields = ['created_at']
