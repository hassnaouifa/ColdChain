from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    post_mesure,
    list_mesures,
    RoleViewSet,
    UserViewSet,
    TemperatureConfigViewSet,
    Dht11ListView,
    Dht11StatsView,
    UserDetailView
)

router = DefaultRouter()
router.register(r'roles', RoleViewSet)
router.register(r'users', UserViewSet)
router.register(r'configs', TemperatureConfigViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # ESP8266 POST
    path('post/', post_mesure, name='post-mesure'),

    # Liste brute des mesures
    path('mesures/', list_mesures, name='mesures'),

    # Authentification JWT

    # Détails utilisateur
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # Endpoints protégés
    path('mesures/list/', Dht11ListView.as_view(), name='dht11-list'),

    # Stats : hour / day / month / year
    path('mesures/stats/<str:interval>/', Dht11StatsView.as_view(), name='dht11-stats'),

    path('api-auth/', include('rest_framework.urls')),  # login/logout DRF

]
