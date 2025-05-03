from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Usuario_App.serializers.serializer_user import CustomUserSerializer
from Usuario_App.serializers.serializer_est import EstudianteProfileSerializer
from Usuario_App.models.estudiantes import EstudianteProfile


class CustomUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = CustomUserSerializer(user).data

        try:
            estudiante_profile = EstudianteProfile.objects.get(user=user)
            estudiante_data = EstudianteProfileSerializer(estudiante_profile).data
        except EstudianteProfile.DoesNotExist:
            estudiante_data = None

        return Response({
            "user": user_data,
            "estudiante_profile": estudiante_data
        })
