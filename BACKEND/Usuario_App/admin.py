from django.contrib import admin
from Usuario_App.models.models_user import CustomUser
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.models.docente import DocenteProfile

admin.site.register(CustomUser)
admin.site.register(EstudianteProfile)
admin.site.register(DocenteProfile)
