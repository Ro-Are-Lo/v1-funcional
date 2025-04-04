from django.db import models 

class Usuario(models.Model):
    idusuario = models.CharField(max_length=16)
    password = models.CharField(max_length=16)  
    tipoderol = models.CharField(max_length=16)

    def __str__(self):
        return str(self.idusuario)
    