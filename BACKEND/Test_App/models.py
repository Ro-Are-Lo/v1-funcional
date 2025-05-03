from django.db import models

# Create your models here.



class Pregunta(models.Model):
    materia = models.CharField(max_length=100)
    tema = models.CharField(max_length=100, blank= True , null= True)
    pregunta = models.TextField()
    opa = models.CharField(max_length=255)
    opb = models.CharField(max_length=255)
    opc = models.CharField(max_length=255)
    opd = models.CharField(max_length=255, blank= True)

    opcorrecta = models.CharField(max_length=250)  # A, B o C

    def __str__(self):
        return f"{self.materia} - {self.pregunta}"
