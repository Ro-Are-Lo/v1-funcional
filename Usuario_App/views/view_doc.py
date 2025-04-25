from Usuario_App.models.docente import DocenteProfile
from Usuario_App.serializers.serializer_doce import DocenteProfileSerializer
from rest_framework import generics

class DocenteProfileListCreateView(generics.ListCreateAPIView):
    queryset = DocenteProfile.objects.all()
    serializer_class = DocenteProfileSerializer
