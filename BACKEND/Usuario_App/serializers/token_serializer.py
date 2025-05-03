# Usuario_App/serializers/token_serializer.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from Usuario_App.models.models_user import CustomUser

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agrega datos personalizados al token si quieres
        token['user_type'] = user.user_type
        return token

    def validate(self, attrs):
        username_field = CustomUser.USERNAME_FIELD
        attrs[username_field] = attrs.pop("email")

        data = super().validate(attrs)

        # Agrega info del usuario a la respuesta
        data['user'] = {
            "id": self.user.id,
            "email": self.user.email,
            "user_type": self.user.user_type,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }

        return data