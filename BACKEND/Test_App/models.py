from django.db import models

# Create your models here.
# en app llamada preguntas/models.py


class Pregunta(models.Model):
    materia = models.CharField(max_length=100)
    tema = models.CharField(max_length=100)
    pregunta = models.TextField()
    opa = models.CharField(max_length=255)
    opb = models.CharField(max_length=255)
    opc = models.CharField(max_length=255)
    opcorrecta = models.CharField(max_length=50)  # A, B o C

    def __str__(self):
        return f"{self.materia} - {self.pregunta}"
