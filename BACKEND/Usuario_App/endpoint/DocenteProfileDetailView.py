from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from Usuario_App.models.docente import DocenteProfile
from Usuario_App.serializers.serializer_doce import DocenteProfileSerializer
from Usuario_App.models.models_user import CustomUser
from Usuario_App.serializers.serializer_user import CustomUserSerializer

class DocenteProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            perfil = DocenteProfile.objects.get(user=request.user)
            serializer = DocenteProfileSerializer(perfil)
            return Response(serializer.data)
        except DocenteProfile.DoesNotExist:
            return Response({'error': 'Perfil no encontrado'}, status=404)

    def patch(self, request):
        try:
            perfil = DocenteProfile.objects.get(user=request.user)
            user_data = request.data.get('user', {})
            perfil_data = {key: value for key, value in request.data.items() if key != 'user'}

            if user_data:
                user_serializer = CustomUserSerializer(perfil.user, data=user_data, partial=True)
                if user_serializer.is_valid():
                    user_serializer.save()
                else:
                    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            perfil_serializer = DocenteProfileSerializer(perfil, data=perfil_data, partial=True)
            if perfil_serializer.is_valid():
                perfil_serializer.save()
                return Response(perfil_serializer.data)
            return Response(perfil_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DocenteProfile.DoesNotExist:
            return Response({'error': 'Perfil no encontrado'}, status=404)


class DocenteProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            perfil = DocenteProfile.objects.get(user=request.user)
            user_data = request.data.get('user', {})
            perfil_data = request.data.get('perfil', {})

            user_serializer = CustomUserSerializer(perfil.user, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            perfil_serializer = DocenteProfileSerializer(perfil, data=perfil_data, partial=True)
            if perfil_serializer.is_valid():
                perfil_serializer.save()
                return Response(perfil_serializer.data)
            return Response(perfil_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except DocenteProfile.DoesNotExist:
            return Response({'detail': 'Perfil no encontrado'}, status=status.HTTP_404_NOT_FOUND)
