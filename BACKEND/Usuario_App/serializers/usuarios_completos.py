from rest_framework import serializers
from Usuario_App.models import CustomUser, EstudianteProfile, DocenteProfile

class EstudianteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstudianteProfile
        fields = ['edad', 'genero', 'ult_ano_es', 'carr_op_A', 'carr_op_B', 'carr_op_C']

class DocenteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocenteProfile
        fields = ['institucion', 'licenciatura']

class CustomUserWithProfileSerializer(serializers.ModelSerializer):
    estudiante_profile = EstudianteProfileSerializer(read_only=True)
    docente_profile = DocenteProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'last_name2', 'user_type', 
                  'is_active', 'is_staff', 'is_superuser', 'estudiante_profile', 'docente_profile']
