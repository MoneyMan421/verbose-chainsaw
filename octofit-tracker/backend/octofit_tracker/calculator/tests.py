from django.test import TestCase
from .models import CalculationHistory


class CalculationHistoryModelTest(TestCase):
    def test_create_calculation_history(self):
        calc = CalculationHistory.objects.create(
            user_name='Test User',
            calculation_type='BMI',
            inputs_json='{"height_cm": 170, "weight_kg": 70}',
            result='{"bmi": 24.22, "category": "Normal weight"}',
            steps_json='["Step 1", "Step 2"]'
        )
        self.assertEqual(calc.user_name, 'Test User')
        self.assertEqual(calc.calculation_type, 'BMI')
