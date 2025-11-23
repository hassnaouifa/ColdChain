# monitoring/models.py
from django.db import models

class Dht11(models.Model):
    sensor_id = models.IntegerField(default=1)  # <--- Valeur par défaut
    temp = models.FloatField()
    hum = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sensor {self.sensor_id} - Temp: {self.temp}°C, Hum: {self.hum}%"
