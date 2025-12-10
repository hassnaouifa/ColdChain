from rest_framework import serializers
from .models import Dht11, Role, User, TemperatureConfig
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class Dht11Serializer(serializers.ModelSerializer):
    # Pour recevoir temp/hum depuis l'ESP
    temp = serializers.FloatField(write_only=True)
    hum = serializers.FloatField(write_only=True)

    class Meta:
        model = Dht11
        fields = ['id', 'sensor_id', 'timestamp', 'temperature', 'humidity', 'temp', 'hum']
        read_only_fields = ['id', 'timestamp', 'temperature', 'humidity']

    def create(self, validated_data):
        # Mappe temp/hum vers temperature/humidity
        temperature = validated_data.pop('temp')
        humidity = validated_data.pop('hum')
        validated_data['temperature'] = temperature
        validated_data['humidity'] = humidity
        return Dht11.objects.create(**validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ajoute temp/hum pour que React lise les valeurs
        ret['temp'] = instance.temperature
        ret['hum'] = instance.humidity
        return ret


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class TemperatureConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureConfig
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Ajoute des champs simples au lieu de l'objet entier
        token['username'] = user.username
        token['role_id'] = user.role.id if user.role else None
        token['role_name'] = str(user.role) if user.role else None

        return token