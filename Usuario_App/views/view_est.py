from rest_framework import generics
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.serializers.serializer_est import EstudianteProfileSerializer

class EstudianteProfileListCreateView(generics.ListCreateAPIView):
    queryset = EstudianteProfile.objects.all()
    serializer_class = EstudianteProfileSerializer
    