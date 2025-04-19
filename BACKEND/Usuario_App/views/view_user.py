# views/view_user.py
from rest_framework import generics
from Usuario_App.models.models_user import CustomUser
from Usuario_App.serializers.serializer_user import CustomUserSerializer

class CustomUserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
