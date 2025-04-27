from django.db import models
from .models_user import CustomUser

class DocenteProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='docente_profile')
    
    institucion = models.CharField(max_length=255)
    licenciatura = models.CharField(max_length=255)

    def __str__(self):
        return f"Docente: {self.institucion} {self.licenciatura}"
    