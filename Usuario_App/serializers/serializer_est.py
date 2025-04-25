from rest_framework import serializers
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.serializers.serializer_user import CustomUserSerializer

from Usuario_App.models.models_user import CustomUser

class EstudianteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = EstudianteProfile
        fields = ['id', 'user' ,'apellido_materno', 'edad','genero']

    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create_user(**user_data)
        estudiante = EstudianteProfile.objects.create(user=user, **validated_data)
        return estudiante