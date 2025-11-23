from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import DHT11serialize
from .models import Dht11

@api_view(['POST'])
def post_mesure(request):
    serializer = DHT11serialize(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_mesures(request):
    mesures = Dht11.objects.all().order_by('-created_at')
    serializer = DHT11serialize(mesures, many=True)
    return Response(serializer.data)
