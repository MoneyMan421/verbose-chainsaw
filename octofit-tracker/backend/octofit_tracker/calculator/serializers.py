from rest_framework import serializers
from .models import CalculationHistory


class CalculationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationHistory
        fields = ['id', 'user_name', 'calculation_type', 'inputs_json', 'result', 'steps_json', 'created_at']
        read_only_fields = ['id', 'created_at']
