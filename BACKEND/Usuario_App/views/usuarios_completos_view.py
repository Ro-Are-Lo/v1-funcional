from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Usuario_App.serializers.usuarios_completos import CustomUserWithProfileSerializer
from Usuario_App.models import CustomUser

class CustomUserProfileDetailViewCom(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtener todos los usuarios
        users = CustomUser.objects.all()
        # Serializar todos los usuarios junto con sus perfiles
        serializer = CustomUserWithProfileSerializer(users, many=True)
        return Response(serializer.data)
