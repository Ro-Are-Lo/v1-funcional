# views/view_user.py
# views_description.py

"""
En las vistas (views) defines cómo tu aplicación responde a las solicitudes del frontend.
Básicamente, controlas qué información se envía o se recibe desde el servidor, cómo se procesa, y qué acción tomar.

En pocas palabras, las vistas son el puente entre el cliente (frontend) y tu modelo de datos (backend).

Por ejemplo:
- GET: Obtener datos (como listar usuarios o mostrar detalles de un usuario).
- POST: Crear nuevos datos (como registrar un usuario).
- PUT o PATCH: Actualizar datos existentes (como modificar el perfil de un usuario).
- DELETE: Eliminar datos (como borrar un usuario).

También puedes agregar reglas específicas (permisos, lógica personalizada, etc.)
para definir qué puede hacer cada usuario en tu aplicación.

Las vistas son el corazón del funcionamiento de tu API.
"""

# Fin del archivo
from rest_framework import generics
from Usuario_App.models.models_user import CustomUser
from Usuario_App.serializers.serializer_user import CustomUserSerializer
from rest_framework.permissions import AllowAny


class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    
    def get_serializer_context(self):
        # Asegurarse de que el contexto pase el 'user_type'
        context = super().get_serializer_context()
        context['user_type'] = 'admin'  # Esto garantiza que el serializer sepa que es un estudiante
        return context

    def perform_create(self, serializer):
        user = serializer.save()  # Esto ya es un CustomUser
        user.user_type = 'admin'
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save()

        return user