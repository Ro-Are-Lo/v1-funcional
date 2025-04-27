# serializers.py
from rest_framework import serializers
from Usuario_App.models.models_user import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'last_name2', 'password', 'user_type', 'is_active', 'is_staff', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Obtener el user_type desde el contexto (viene desde la vista)
        user_type = self.context.get('user_type', None)

        if user_type == 'estudiante':
            # Eliminar campos que no deben mostrarse en el serializer de estudiantes
            self.fields.pop('is_staff', None)
            self.fields.pop('is_superuser', None)
            self.fields.pop('user_type', None)
        elif user_type == 'docente':
            # Eliminar campos que no deben mostrarse en el serializer de docentes
            self.fields.pop('is_active', None)
            self.fields.pop('user_type', None)

    def create(self, validated_data):
        # Crear el usuario con los datos validados
        user = CustomUser.objects.create_user(**validated_data)
        return user