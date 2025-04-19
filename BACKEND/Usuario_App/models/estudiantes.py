
from django.db import models
from .models_user import CustomUser

class EstudianteProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='estudiante_profile')
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    edad = models.CharField(max_length=100)

    def __str__(self):
        return f"Estudiante: {self.nombre} {self.apellido_paterno}"
    
