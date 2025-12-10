from django.db import models
from django.contrib.auth.models import AbstractUser

# Rôle des utilisateurs
class Role(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

# User personnalisé
class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

# Modèle DHT11 : températures et humidités reçues
class Dht11(models.Model):
    sensor_id = models.IntegerField(default=1)
    temperature = models.FloatField()
    humidity = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Capteur {self.sensor_id} - {self.temperature}°C / {self.humidity}%"

# Configuration des seuils
class TemperatureConfig(models.Model):
    sensor_id = models.IntegerField(default=1)
    min_temp = models.FloatField(default=2.0)
    max_temp = models.FloatField(default=8.0)
    min_hum = models.FloatField(default=30.0)
    max_hum = models.FloatField(default=70.0)

    def __str__(self):
        return f"Seuils capteur {self.sensor_id}"
