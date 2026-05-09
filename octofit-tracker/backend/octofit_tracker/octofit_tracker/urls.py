"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request):
    """API root endpoint that lists all available API resources"""
    return Response({
        'calculator': {
            'bmi': reverse('bmi-calculator', request=request),
            'calorie-burn': reverse('calorie-burn', request=request),
            'heart-rate-zones': reverse('heart-rate-zones', request=request),
            'history': reverse('calculation-history', request=request),
        },
        'resources': {
            'users': reverse('users', request=request),
            'teams': reverse('teams', request=request),
            'activities': reverse('activities', request=request),
            'leaderboard': reverse('leaderboard', request=request),
            'workouts': reverse('workouts', request=request),
        }
    })


@api_view(['GET'])
def users_stub(request):
    """Stub endpoint for users"""
    return Response({'users': []})


@api_view(['GET'])
def teams_stub(request):
    """Stub endpoint for teams"""
    return Response({'teams': []})


@api_view(['GET'])
def activities_stub(request):
    """Stub endpoint for activities"""
    return Response({'activities': []})


@api_view(['GET'])
def leaderboard_stub(request):
    """Stub endpoint for leaderboard"""
    return Response({'leaderboard': []})


@api_view(['GET'])
def workouts_stub(request):
    """Stub endpoint for workouts"""
    return Response({'workouts': []})


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/calculator/', include('calculator.urls')),
    path('api/users/', users_stub, name='users'),
    path('api/teams/', teams_stub, name='teams'),
    path('api/activities/', activities_stub, name='activities'),
    path('api/leaderboard/', leaderboard_stub, name='leaderboard'),
    path('api/workouts/', workouts_stub, name='workouts'),
]

