from rest_framework import generics
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.serializers.serializer_est import EstudianteProfileSerializer

class EstudianteProfileListCreateView(generics.ListCreateAPIView):
    queryset = EstudianteProfile.objects.all()
    serializer_class = EstudianteProfileSerializer

    def get_serializer_context(self):
        # Asegurarse de que el contexto pase el 'user_type'
        context = super().get_serializer_context()
        context['user_type'] = 'estudiante'  # Esto garantiza que el serializer sepa que es un estudiante
        return context

    def perform_create(self, serializer):
        # Guardar el perfil del estudiante y asignar los valores correctos al usuario
        user_profile = serializer.save()
        user = user_profile.user
        user.user_type = 'estudiante'
        user.is_staff = False
        user.is_active = True
        user.is_superuser = False
        user.save()

        return user