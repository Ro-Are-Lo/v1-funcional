# serializers.py
from rest_framework import serializers
from Usuario_App.models.models_user import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'user_type', 'is_active', 'is_staff']
