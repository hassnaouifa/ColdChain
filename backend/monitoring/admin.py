from django.contrib import admin

# Register your models here.
from .models import Dht11, Role, TemperatureConfig, User

admin.site.register(Dht11)
admin.site.register(Role)
admin.site.register(TemperatureConfig)
admin.site.register(User)
