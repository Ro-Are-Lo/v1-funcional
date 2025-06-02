
from django.db import models
from .models_user import CustomUser
from django.core.exceptions import ValidationError

import datetime

def validate_edad(value):
    if value < 0 or value > 120:
        raise ValidationError("La edad debe estar entre 0 y 120 años.")
    
GENERO_CHOICES = [
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('O', 'Otro'),
]

#años atraidos por impor datetime
def obtener_lista_años():
    return [(r, r) for r in range(1900, datetime.datetime.now().year + 1)]


class EstudianteProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='estudiante_profile')
   
    edad = models.PositiveIntegerField(validators=[validate_edad])
    genero = models.CharField(max_length=1, choices=GENERO_CHOICES, default='O')

    ult_ano_es = models.PositiveIntegerField(choices= obtener_lista_años(),default=datetime.datetime.now().year)

    carr_op_A = models.CharField(max_length=30, null=True, blank=True)
    carr_op_B = models.CharField(max_length=30, null=True,blank=True)
    carr_op_C = models.CharField(max_length=30, null=True,blank=True)

    # fecha de realizacion del test
    fecha_realizacion = models.DateTimeField(null=True, blank=True, default=None)
    
    def __str__(self):
        return f"Estudiante: {self.genero}, {self.edad} , {self.carr_op_A} , {self.carr_op_B}, {self.carr_op_C} , {self.ult_ano_es}, {self.fecha_realizacion}"
    
    
class ResultadoMateria(models.Model):
    estudiante = models.ForeignKey('EstudianteProfile', on_delete=models.CASCADE, related_name='resultados')
    materia = models.CharField(max_length=30)
    correctas = models.PositiveIntegerField()
    nota_parcial = models.FloatField()  # porcentaje

    class Meta:
        unique_together = ('estudiante', 'materia')  # evita duplicados

    def __str__(self):
        return f"{self.estudiante.user.username} - {self.materia}: {self.correctas} correctas ({self.nota_parcial}%)"
