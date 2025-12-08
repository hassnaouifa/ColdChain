from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import DHT11serialize
from .models import Dht11
from monitoring.alerts import send_email_alert, send_telegram_alert, send_whatsapp_alert

@api_view(['POST'])
def post_mesure(request):
    serializer = DHT11serialize(data=request.data)
    if serializer.is_valid():
        mesure = serializer.save()

        # Vérifier les seuils
        if mesure.temp < 2 or mesure.temp > 8:
            message = f"🚨 Alerte température ! Valeur: {mesure.temp}°C"
            send_telegram_alert(message)
            send_email_alert("Alerte Température", message, ["destinataire@gmail.com"])
            send_whatsapp_alert(message, "NUMERO_DESTINATAIRE")

        if mesure.hum < 30 or mesure.hum > 70:
            message = f"🚨 Alerte humidité ! Valeur: {mesure.hum}%"
            send_telegram_alert(message)
            send_email_alert("Alerte Humidité", message, ["destinataire@gmail.com"])
            send_whatsapp_alert(message, "NUMERO_DESTINATAIRE")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
