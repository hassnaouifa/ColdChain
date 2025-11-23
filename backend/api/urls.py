from django.urls import path
from .views import receive_data

urlpatterns = [
    path('post', receive_data),
]
