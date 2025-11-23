from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
def receive_data(request):
    temp = request.data.get("temp")
    hum = request.data.get("hum")
    print("Received:", temp, hum)

    return Response({"message": "Data received", "temp": temp, "hum": hum}, status=status.HTTP_200_OK)
