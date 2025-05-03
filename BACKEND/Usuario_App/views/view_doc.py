from Usuario_App.models.docente import DocenteProfile
from Usuario_App.serializers.serializer_doce import DocenteProfileSerializer
from rest_framework import generics

class DocenteProfileListCreateView(generics.ListCreateAPIView):
    queryset = DocenteProfile.objects.all()
    serializer_class = DocenteProfileSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user_type'] = 'docente'
        return context

    def perform_create(self, serializer):
        user_profile = serializer.save()
        user = user_profile.user
        user.user_type = 'docente'
        user.is_staff = True
        user.is_active = True
        user.is_superuser = False
        user.save()

        return user