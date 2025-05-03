# Usuario_App/views/token_view.py
from rest_framework_simplejwt.views import TokenObtainPairView
from Usuario_App.serializers.token_serializer import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
