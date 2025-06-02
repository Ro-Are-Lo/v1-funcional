from rest_framework import serializers
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.serializers.serializer_user import CustomUserSerializer

from Usuario_App.models.models_user import CustomUser

from Usuario_App.models.estudiantes import ResultadoMateria


class ResultadoMateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultadoMateria
        fields = ['materia', 'correctas', 'nota_parcial']

class EstudianteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    resultados = ResultadoMateriaSerializer(many=True, read_only=True)
    class Meta:
        model = EstudianteProfile
        fields = ['id', 'user', 'edad', 'genero', 'ult_ano_es','carr_op_A','carr_op_B','carr_op_C','fecha_realizacion', 'resultados']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        # Crear el usuario con los datos proporcionados
        user = CustomUser.objects.create_user(**user_data)
        # Crear el perfil del estudiante asociado
        estudiante = EstudianteProfile.objects.create(user=user, **validated_data)
        return estudiante


