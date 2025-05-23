
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from Usuario_App.serializers.serializer_user import CustomUserSerializer
from Usuario_App.serializers.serializer_est import EstudianteProfileSerializer
from Usuario_App.serializers.serializer_doce import DocenteProfileSerializer
from Usuario_App.models.estudiantes import EstudianteProfile
from Usuario_App.models.docente import DocenteProfile


class CustomUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = CustomUserSerializer(user).data

        estudiante_data = None
        docente_data = None

        try:
            estudiante_profile = EstudianteProfile.objects.get(user=user)
            estudiante_data = EstudianteProfileSerializer(estudiante_profile).data
        except EstudianteProfile.DoesNotExist:
            pass

        try:
            docente_profile = DocenteProfile.objects.get(user=user)
            docente_data = DocenteProfileSerializer(docente_profile).data
        except DocenteProfile.DoesNotExist:
            pass

        return Response({
            "user": user_data,
            "estudiante_profile": estudiante_data,
            "docente_profile": docente_data
        })



    def put(self, request):
        user = request.user
        user_serializer = CustomUserSerializer(user, data=request.data.get('user'), partial=True)
        
        response_data = {}

        if user_serializer.is_valid():
            user_serializer.save()
            response_data['user'] = user_serializer.data
        else:
            return Response(user_serializer.errors, status=400)

        # Estudiante
        try:
            estudiante_profile = EstudianteProfile.objects.get(user=user)
            estudiante_serializer = EstudianteProfileSerializer(estudiante_profile, data=request.data.get('estudiante_profile'), partial=True)
            if estudiante_serializer.is_valid():
                estudiante_serializer.save()
                response_data['estudiante_profile'] = estudiante_serializer.data
            else:
                return Response(estudiante_serializer.errors, status=400)
        except EstudianteProfile.DoesNotExist:
            pass

        # Docente
        try:
            docente_profile = DocenteProfile.objects.get(user=user)
            docente_serializer = DocenteProfileSerializer(docente_profile, data=request.data.get('docente_profile'), partial=True)
            if docente_serializer.is_valid():
                docente_serializer.save()
                response_data['docente_profile'] = docente_serializer.data
            else:
                return Response(docente_serializer.errors, status=400)
        except DocenteProfile.DoesNotExist:
            pass

        return Response(response_data)




# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from Usuario_App.serializers.serializer_user import CustomUserSerializer
# from Usuario_App.serializers.serializer_est import EstudianteProfileSerializer
# from Usuario_App.models.estudiantes import EstudianteProfile


# class CustomUserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         user_data = CustomUserSerializer(user).data

#         try:
#             estudiante_profile = EstudianteProfile.objects.get(user=user)
#             estudiante_data = EstudianteProfileSerializer(estudiante_profile).data
#         except EstudianteProfile.DoesNotExist:
#             estudiante_data = None

#         return Response({
#             "user": user_data,
#             "estudiante_profile": estudiante_data
#         })
