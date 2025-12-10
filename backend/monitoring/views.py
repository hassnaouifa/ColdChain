from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import timedelta

from .models import Dht11, Role, User, TemperatureConfig
from .serializers import Dht11Serializer, RoleSerializer, UserSerializer, TemperatureConfigSerializer
from .alerts import send_email_alert, send_telegram_alert, send_whatsapp_alert


# ---------------------------
# VIEWSETS CRUD
# ---------------------------

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [AllowAny]  # plus d'auth

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # plus d'auth

class TemperatureConfigViewSet(viewsets.ModelViewSet):
    queryset = TemperatureConfig.objects.all()
    serializer_class = TemperatureConfigSerializer
    permission_classes = [AllowAny]  # plus d'auth


# ---------------------------
# POST MESURE (ESP8266)
# ---------------------------

@api_view(['POST'])
@permission_classes([AllowAny])  # plus d'auth
def post_mesure(request):
    print("DATA RECEIVED:", request.data)
    serializer = Dht11Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------
# GET : LISTE DES MESURES
# ---------------------------

@api_view(['GET'])
@permission_classes([AllowAny])  # plus d'auth
def list_mesures(request):
    mesures = Dht11.objects.all().order_by('-timestamp')
    serializer = Dht11Serializer(mesures, many=True)
    return Response(serializer.data)


# ---------------------------
# VUES DETAIL/STAT MESURES
# ---------------------------

# Détails d'un utilisateur
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # plus d'auth

# Liste des mesures brutes
class Dht11ListView(generics.ListAPIView):
    queryset = Dht11.objects.all().order_by('-timestamp')
    serializer_class = Dht11Serializer
    permission_classes = [AllowAny]  # plus d'auth

# Mesures filtrées par intervalle
class Dht11StatsView(APIView):
    permission_classes = [AllowAny]  # plus d'auth

    def get(self, request, interval=None):
        now = timezone.now()
        if interval == "hour":
            start = now - timedelta(hours=1)
        elif interval == "day":
            start = now - timedelta(days=1)
        elif interval == "month":
            start = now - timedelta(days=30)
        elif interval == "year":
            start = now - timedelta(days=365)
        else:
            return Response({"error": "Intervalle invalide"}, status=400)

        mesures = Dht11.objects.filter(timestamp__gte=start)
        serializer = Dht11Serializer(mesures, many=True)
        return Response(serializer.data)
