from rest_framework import serializers
from Usuario_App.models.docente import DocenteProfile
from Usuario_App.serializers.serializer_user import CustomUserSerializer
from Usuario_App.models.models_user import CustomUser

class DocenteProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = DocenteProfile
        fields = ['id', 'user',   'institucion', 'licenciatura']

    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create_user(**user_data)
        docente = DocenteProfile.objects.create(user=user, **validated_data)
        return docente