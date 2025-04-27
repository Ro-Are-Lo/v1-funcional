from django.contrib import admin
from Usuario_App.models.models_user import CustomUser
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.models.docente import DocenteProfile

# Registro de CustomUser con personalización
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'last_name2', 'user_type']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'last_name2']
    
    # Aplicamos un filtro para 'user_type' para poder filtrar los usuarios por tipo de rol
    list_filter = ['user_type']  # Puedes agregar más campos aquí para filtrar por otros campos
    
    # Mostrar todos los campos en el formulario del admin (incluyendo los campos de AbstractUser)
    fields = ['email', 'username', 'password', 'first_name', 'last_name', 'last_name2', 'user_type', 
              'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'groups', 'user_permissions']

    def __str__(self):
        return f"{self.email} - {self.user_type} - {self.last_name2}"

# Registro de EstudianteProfile con personalización
@admin.register(EstudianteProfile)
class EstudianteProfileAdmin(admin.ModelAdmin):
    # Accedemos a los campos de CustomUser a través de la relación 'user'
    list_display = ['get_nombre_completo', 'user_email', 'user_username', 'edad', 'genero', 
                    'ult_ano_es', 'carr_op_A', 'carr_op_B', 'carr_op_C']
    search_fields = ['user__email', 'user__username', 'user__first_name', 'user__last_name']
    
    # Puedes filtrar por algunos campos del modelo EstudianteProfile
    list_filter = ['genero', 'ult_ano_es']
    
    # Mostrar solo los campos de EstudianteProfile
    fields = ['user', 'edad', 'genero', 'ult_ano_es', 'carr_op_A', 'carr_op_B', 'carr_op_C']
    
    def __str__(self):
        return f"Estudiante: {self.user.first_name} {self.user.last_name}"

    # Métodos para acceder a los campos del modelo CustomUser a través de la relación 'user'
    def get_nombre_completo(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name} {obj.user.last_name2 or ''}".strip()
    get_nombre_completo.short_description = 'Nombre completo'

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def user_username(self, obj):
        return obj.user.username
    user_username.short_description = 'Username'

    
# Registro de DocenteProfile sin personalización (si no es necesario modificarlo)
admin.site.register(DocenteProfile)
