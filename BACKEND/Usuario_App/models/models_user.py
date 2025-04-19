from django.contrib.auth.models import AbstractUser
from django.db import models

# NOTA PONER UN INIT EN CADA ARCHIO PARA QUE DJNGO RECONOSCA QUE ES UN MODELO 
# usuario personalizado
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USER_TYPE_CHOICES = [
        ('docente', 'Docente'),
        ('estudiante', 'Estudiante'),
        # ('admin', 'Admin'),
        
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} - {self.user_type}"