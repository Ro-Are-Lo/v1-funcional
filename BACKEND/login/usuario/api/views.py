from rest_framework import viewsets
from usuario.models import Usuario
from usuario.api.serializers import UsuarioSerializer 

class UsuarioViewSet(viewsets.ModelViewSet):  # Corregido

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

