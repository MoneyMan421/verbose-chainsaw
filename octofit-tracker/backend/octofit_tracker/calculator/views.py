from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import logging
from .models import CalculationHistory
from .serializers import CalculationHistorySerializer

logger = logging.getLogger(__name__)


class BMICalculatorView(APIView):
    """Calculate BMI and return category with step-by-step explanation"""
    
    def post(self, request):
        try:
            height_cm = float(request.data.get('height_cm'))
            weight_kg = float(request.data.get('weight_kg'))
            user_name = request.data.get('user_name', 'Anonymous')
            
            if height_cm <= 0 or weight_kg <= 0:
                return Response(
                    {'error': 'Height and weight must be positive values'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate BMI
            height_m = height_cm / 100
            bmi = weight_kg / (height_m ** 2)
            
            # Determine category
            if bmi < 18.5:
                category = 'Underweight'
            elif bmi < 25:
                category = 'Normal weight'
            elif bmi < 30:
                category = 'Overweight'
            else:
                category = 'Obese'
            
            # Create step-by-step explanation
            steps = [
                f"Step 1: Convert height from cm to meters: {height_cm}cm ÷ 100 = {height_m}m",
                f"Step 2: Calculate height squared: {height_m}m × {height_m}m = {height_m ** 2:.4f}m²",
                f"Step 3: Calculate BMI: {weight_kg}kg ÷ {height_m ** 2:.4f}m² = {bmi:.2f}",
                f"Step 4: Determine category: BMI {bmi:.2f} falls into '{category}' category"
            ]
            
            result = {
                'bmi': round(bmi, 2),
                'category': category,
                'height_cm': height_cm,
                'weight_kg': weight_kg
            }
            
            # Save to history
            CalculationHistory.objects.create(
                user_name=user_name,
                calculation_type='BMI',
                inputs_json=json.dumps({'height_cm': height_cm, 'weight_kg': weight_kg}),
                result=json.dumps(result),
                steps_json=json.dumps(steps)
            )
            
            return Response({
                'result': result,
                'steps': steps,
                'category': category
            }, status=status.HTTP_200_OK)
        
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid input data. Height and weight must be numbers.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception('Unexpected error in calculator view: %s', e)
            return Response(
                {'error': 'An internal server error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CalorieBurnView(APIView):
    """Calculate calories burned during activity with step-by-step explanation"""
    
    # MET values (Metabolic Equivalent of Task) for different activities
    MET_VALUES = {
        'walking': 3.5,
        'running': 9.8,
        'cycling': 7.5,
        'swimming': 8.0
    }
    
    def post(self, request):
        try:
            weight_kg = float(request.data.get('weight_kg'))
            duration_minutes = float(request.data.get('duration_minutes'))
            activity_type = request.data.get('activity_type', 'walking').lower()
            user_name = request.data.get('user_name', 'Anonymous')
            
            if activity_type not in self.MET_VALUES:
                return Response(
                    {'error': f'Activity type must be one of: {", ".join(self.MET_VALUES.keys())}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if weight_kg <= 0 or duration_minutes <= 0:
                return Response(
                    {'error': 'Weight and duration must be positive values'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate calories burned: Calories = MET × weight(kg) × duration(hours)
            met_value = self.MET_VALUES[activity_type]
            duration_hours = duration_minutes / 60
            calories_burned = met_value * weight_kg * duration_hours
            
            # Create step-by-step explanation
            steps = [
                f"Step 1: Identify activity MET value: {activity_type.capitalize()} = {met_value} MET",
                f"Step 2: Convert duration to hours: {duration_minutes} minutes ÷ 60 = {duration_hours:.2f} hours",
                f"Step 3: Apply formula: Calories = MET × Weight(kg) × Duration(hours)",
                f"Step 4: Calculate: {met_value} × {weight_kg}kg × {duration_hours:.2f}h = {calories_burned:.2f} calories burned"
            ]
            
            result = {
                'calories_burned': round(calories_burned, 2),
                'activity_type': activity_type,
                'weight_kg': weight_kg,
                'duration_minutes': duration_minutes,
                'met_value': met_value
            }
            
            # Save to history
            CalculationHistory.objects.create(
                user_name=user_name,
                calculation_type='CalorieBurn',
                inputs_json=json.dumps({
                    'weight_kg': weight_kg,
                    'duration_minutes': duration_minutes,
                    'activity_type': activity_type
                }),
                result=json.dumps(result),
                steps_json=json.dumps(steps)
            )
            
            return Response({
                'result': result,
                'steps': steps
            }, status=status.HTTP_200_OK)
        
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid input data. Weight and duration must be numbers.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception('Unexpected error in calculator view: %s', e)
            return Response(
                {'error': 'An internal server error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HeartRateZoneView(APIView):
    """Calculate max heart rate and training zones with explanations"""
    
    def post(self, request):
        try:
            age = int(request.data.get('age'))
            user_name = request.data.get('user_name', 'Anonymous')
            
            if age <= 0 or age > 150:
                return Response(
                    {'error': 'Age must be between 1 and 150'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate max heart rate using Karvonen formula
            max_hr = 220 - age
            
            # Calculate training zones (percentage of max HR)
            zones = {
                'Zone 1 (Recovery)': {
                    'percentage': '50-60%',
                    'min_bpm': round(max_hr * 0.50),
                    'max_bpm': round(max_hr * 0.60),
                    'description': 'Very light exercise, good for recovery and warm-up'
                },
                'Zone 2 (Aerobic)': {
                    'percentage': '60-70%',
                    'min_bpm': round(max_hr * 0.60),
                    'max_bpm': round(max_hr * 0.70),
                    'description': 'Light to moderate exercise, builds endurance'
                },
                'Zone 3 (Tempo)': {
                    'percentage': '70-80%',
                    'min_bpm': round(max_hr * 0.70),
                    'max_bpm': round(max_hr * 0.80),
                    'description': 'Moderate to hard exercise, improves lactate threshold'
                },
                'Zone 4 (Threshold)': {
                    'percentage': '80-90%',
                    'min_bpm': round(max_hr * 0.80),
                    'max_bpm': round(max_hr * 0.90),
                    'description': 'Hard exercise, builds power and speed'
                },
                'Zone 5 (Maximum)': {
                    'percentage': '90-100%',
                    'min_bpm': round(max_hr * 0.90),
                    'max_bpm': round(max_hr * 1.00),
                    'description': 'Maximum effort, anaerobic zone'
                }
            }
            
            # Create step-by-step explanation
            steps = [
                f"Step 1: Calculate max heart rate: 220 - {age} = {max_hr} bpm",
                f"Step 2: Calculate heart rate zones using percentages of max HR",
                f"Step 3: Zone 1 (50-60%): {zones['Zone 1 (Recovery)']['min_bpm']}-{zones['Zone 1 (Recovery)']['max_bpm']} bpm - {zones['Zone 1 (Recovery)']['description']}",
                f"Step 4: Zone 2 (60-70%): {zones['Zone 2 (Aerobic)']['min_bpm']}-{zones['Zone 2 (Aerobic)']['max_bpm']} bpm - {zones['Zone 2 (Aerobic)']['description']}",
                f"Step 5: Zone 3 (70-80%): {zones['Zone 3 (Tempo)']['min_bpm']}-{zones['Zone 3 (Tempo)']['max_bpm']} bpm - {zones['Zone 3 (Tempo)']['description']}",
                f"Step 6: Zone 4 (80-90%): {zones['Zone 4 (Threshold)']['min_bpm']}-{zones['Zone 4 (Threshold)']['max_bpm']} bpm - {zones['Zone 4 (Threshold)']['description']}",
                f"Step 7: Zone 5 (90-100%): {zones['Zone 5 (Maximum)']['min_bpm']}-{zones['Zone 5 (Maximum)']['max_bpm']} bpm - {zones['Zone 5 (Maximum)']['description']}"
            ]
            
            result = {
                'age': age,
                'max_heart_rate': max_hr,
                'zones': zones
            }
            
            # Save to history
            CalculationHistory.objects.create(
                user_name=user_name,
                calculation_type='HeartRateZone',
                inputs_json=json.dumps({'age': age}),
                result=json.dumps(result),
                steps_json=json.dumps(steps)
            )
            
            return Response({
                'result': result,
                'steps': steps
            }, status=status.HTTP_200_OK)
        
        except ValueError:
            return Response(
                {'error': 'Invalid input data. Age must be a number.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.exception('Unexpected error in calculator view: %s', e)
            return Response(
                {'error': 'An internal server error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CalculationHistoryView(APIView):
    """Get all calculation history entries"""
    
    def get(self, request):
        try:
            history = CalculationHistory.objects.all()
            serializer = CalculationHistorySerializer(history, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception('Unexpected error in calculator view: %s', e)
            return Response(
                {'error': 'An internal server error occurred. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
