from django.db import models
import json


class CalculationHistory(models.Model):
    user_name = models.CharField(max_length=255, default='Anonymous')
    calculation_type = models.CharField(max_length=50)  # 'BMI', 'CalorieBurn', 'HeartRateZone'
    inputs_json = models.TextField(default='{}')
    result = models.TextField()  # Store result as JSON string
    steps_json = models.TextField(default='[]')  # Store steps as JSON array
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.calculation_type} - {self.created_at}"

    class Meta:
        ordering = ['-created_at']
