from django.urls import path
from .views import (
    BMICalculatorView,
    CalorieBurnView,
    HeartRateZoneView,
    CalculationHistoryView
)

urlpatterns = [
    path('bmi/', BMICalculatorView.as_view(), name='bmi-calculator'),
    path('calorie-burn/', CalorieBurnView.as_view(), name='calorie-burn'),
    path('heart-rate-zones/', HeartRateZoneView.as_view(), name='heart-rate-zones'),
    path('history/', CalculationHistoryView.as_view(), name='calculation-history'),
]
