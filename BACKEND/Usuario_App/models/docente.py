from django.db import models
from .models_user import CustomUser

class DocenteProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='docente_profile')
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    institucion = models.CharField(max_length=255)
    licenciatura = models.CharField(max_length=255)

    def __str__(self):
        return f"Docente: {self.nombre} {self.apellido_paterno}"
    