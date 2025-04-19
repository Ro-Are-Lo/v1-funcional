from rest_framework import serializers
from Usuario_App.models.docente import DocenteProfile
from Usuario_App.serializers.serializer_user import CustomUserSerializer

class DocenteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = DocenteProfile
        fields = ['id', 'user', 'nombre', 'apellido_paterno', 'apellido_materno', 'institucion', 'licenciatura']
