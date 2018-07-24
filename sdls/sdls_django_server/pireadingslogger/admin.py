from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.Readings)
admin.site.register(models.AvgReadingsByDay)