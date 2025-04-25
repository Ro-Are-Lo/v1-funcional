
from django.db import models
from .models_user import CustomUser
from django.core.exceptions import ValidationError


def validate_edad(value):
    if value < 0 or value > 120:
        raise ValidationError("La edad debe estar entre 0 y 120 años.")
    
GENERO_CHOICES = [
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('O', 'Otro'),
]



class EstudianteProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='estudiante_profile')
    apellido_materno = models.CharField(max_length=100)
    edad = models.PositiveIntegerField(validators=[validate_edad])
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES, default='O')

    def __str__(self):
        return f"Estudiante: {self.apellido_materno}, {self.edad} "
    
