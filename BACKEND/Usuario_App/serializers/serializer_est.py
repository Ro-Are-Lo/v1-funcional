from rest_framework import serializers
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.serializers.serializer_user import CustomUserSerializer



class EstudianteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = EstudianteProfile
        fields = ['id', 'user', 'nombre', 'apellido_paterno', 'apellido_materno', 'edad']
