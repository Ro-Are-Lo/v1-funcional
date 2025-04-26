"""
CAMPOS DE ABSTRACT USER

Campo	Tipo	Descripción
id	AutoField (implícito)	ID del usuario (clave primaria).
password	CharField	Contraseña hasheada del usuario.
last_login	DateTimeField	Última vez que el usuario inició sesión.
is_superuser	BooleanField	Si el usuario tiene permisos de superusuario.
username	CharField	Nombre de usuario (único).
first_name	CharField	Primer nombre del usuario.
last_name	CharField	Apellido del usuario.
email	EmailField	Dirección de correo electrónico.
is_staff	BooleanField	Si puede acceder al admin de Django.
is_active	BooleanField	Si el usuario está activo.
date_joined	DateTimeField	Cuándo se creó la cuenta.
groups	ManyToManyField	Grupos a los que pertenece el usuario.
user_permissions	ManyToManyField	Permisos individuales asignados al usuario.

comentamelo esto para un .py
"""














from django.contrib.auth.models import AbstractUser
from django.db import models





# NOTA PONER UN INIT EN CADA ARCHIO PARA QUE DJNGO RECONOSCA QUE ES UN MODELO 
# usuario personalizado
class CustomUser(AbstractUser):
    
    email = models.EmailField(unique=True)
    
#creando lo roles 
# puedes meter los roles que quieras

    USER_TYPE_CHOICES = [
        ('docente', 'Docente'),
        ('estudiante', 'Estudiante'),
        ('admin', 'Admin'),
        
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    last_name2 = models.CharField(max_length=50, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} - {self.user_type} - {self.last_name2}"
    
"""
definiremos aqui la tabla usuarios con n los campos que diceñe en la vbase dedatos la tabla usuarios




"""