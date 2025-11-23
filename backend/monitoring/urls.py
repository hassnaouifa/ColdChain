from django.urls import path
from .views import post_mesure, list_mesures

urlpatterns = [
    path('post/', post_mesure, name='post_mesure'),       # POST depuis ESP8266
    path('mesures/', list_mesures, name='list_mesures'),  # GET pour récupérer toutes les mesures
]


