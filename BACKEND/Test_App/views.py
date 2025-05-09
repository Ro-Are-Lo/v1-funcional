import requests
from rest_framework.response import Response
from rest_framework import status

from Usuario_App.models.estudiantes import EstudianteProfile
from .models import Pregunta
from rest_framework.views import APIView
from .serializers import PreguntaSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView 


# Diccionario de materias clave y sus carreras asociadas
MATERIA_CARRERAS = {
    "matematicas": [
        "Ingeniería Civil", "Ingeniería Industrial", "Ingeniería Eléctrica",
        "Física", "Matemática", "Informática", "Estadística", "Economía"
    ],
    "fisica": [
        "Ingeniería Electrónica", "Ingeniería Mecánica", "Física",
        "Ingeniería Petrolera", "Ingeniería Química"
    ],
    "quimica": [
        "Ingeniería Química", "Bioquímica", "Química Farmacéutica", "Medicina",
        "Ciencias Químicas"
    ],
    "biologia": [
        "Biología", "Bioquímica", "Medicina", "Zootecnia", "Veterinaria"
    ],
    "lenguaje": [
        "Derecho", "Comunicación Social", "Literatura", "Historia", "Lingüística",
        "Ciencias Políticas", "Psicología"
    ],
    "sociales": [
        "Sociología", "Antropología", "Trabajo Social", "Comunicación Social",
        "Ciencias de la Educación", "Turismo", "Psicología"
    ]
}

def normalizar_materia(nombre_materia):
    nombre_materia = nombre_materia.lower()
    if "biología" in nombre_materia:
        return "biologia"
    elif "física" in nombre_materia:
        return "fisica"
    elif "química" in nombre_materia:
        return "quimica"
    elif "matemática" in nombre_materia or "matemáticas" in nombre_materia:
        return "matematicas"
    elif "lengua" in nombre_materia or "lenguaje" in nombre_materia or "inglés" in nombre_materia:
        return "lenguaje"
    elif "sociales" in nombre_materia or "historia" in nombre_materia or "geografía" in nombre_materia:
        return "sociales"
    else:
        return None


class EvaluarRespuestasView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        respuestas = request.data.get('respuestas', [])
        materia_raw = request.data.get('materia', None)

        if not respuestas or not materia_raw:
            return Response({"error": "Se deben enviar respuestas y materia."}, status=400)

        materia_general = normalizar_materia(materia_raw)
        if not materia_general:
            return Response({"error": f"Materia '{materia_raw}' no es válida o no está mapeada."}, status=400)

        correctas = 0

        for respuesta in respuestas:
            try:
                pregunta = Pregunta.objects.get(id=respuesta['id'])
                if normalizar_materia(pregunta.materia) != materia_general:
                    continue
                if pregunta.opcorrecta == respuesta['respuesta']:
                    correctas += 1
            except Pregunta.DoesNotExist:
                return Response({"error": f"Pregunta con id {respuesta['id']} no encontrada."}, status=404)

        carreras_recomendadas = []
        if correctas >= 6 and materia_general in MATERIA_CARRERAS:
            carreras_recomendadas = MATERIA_CARRERAS[materia_general][:3]
            recomendacion = "Te recomendamos las siguientes carreras: " + ", ".join(carreras_recomendadas)
        else:
            recomendacion = "Te recomendamos repasar los temas o explorar carreras de humanidades."

        try:
            perfil = EstudianteProfile.objects.get(user=request.user)
            perfil.carr_op_A = carreras_recomendadas[0] if len(carreras_recomendadas) > 0 else None
            perfil.carr_op_B = carreras_recomendadas[1] if len(carreras_recomendadas) > 1 else None
            perfil.carr_op_C = carreras_recomendadas[2] if len(carreras_recomendadas) > 2 else None
            perfil.save()
        except EstudianteProfile.DoesNotExist:
            return Response({"error": "Perfil de estudiante no encontrado."}, status=404)

        return Response({
            "correctas": correctas,
            "recomendacion": recomendacion
        }, status=200)


    # def post(self, request, *args, **kwargs):                #PARA VER SI LOS CAMBIOS SE HICIERON BIEN 
    #     # Accede al usuario autenticado con request.user
    #     print("Usuario autenticado:", request.user)
    #     print("Token JWT:", request.auth)  # ← esto debería mostrar el token JWT
    #     print("Payload recibido:", request.data)

    #     # Obtén las respuestas y materia del request
    #     respuestas = request.data.get('respuestas', [])
    #     materia_general = request.data.get('materia', None)

    #     # Validación de datos
    #     if not respuestas or not materia_general:
    #         return Response({"error": "Se deben enviar respuestas y materia."}, status=400)

    #     # Variables para el conteo de respuestas correctas
    #     correctas = 0
    #     correctas_por_materia = {}

    #     for respuesta in respuestas:
    #         try:
    #             pregunta = Pregunta.objects.get(id=respuesta['id'])
    #             if pregunta.opcorrecta == respuesta['respuesta']:
    #                 correctas += 1
    #                 materia = pregunta.materia.lower()
    #                 correctas_por_materia[materia] = correctas_por_materia.get(materia, 0) + 1
    #         except Pregunta.DoesNotExist:
    #             return Response({"error": f"Pregunta con id {respuesta['id']} no encontrada."}, status=404)

    #     # Recomendación basada en desempeño por materia
    #     carreras_recomendadas = set()
    #     for materia, cantidad in correctas_por_materia.items():
    #         if cantidad >= 2 and materia in MATERIA_CARRERAS:  # Ajustar el umbral según lo necesites
    #             carreras_recomendadas.update(MATERIA_CARRERAS[materia])

    #     # Genera la recomendación
    #     if carreras_recomendadas:
    #         recomendacion = "Te recomendamos las siguientes carreras: " + ", ".join(sorted(carreras_recomendadas))
    #     else:
    #         recomendacion = "Te recomendamos repasar los temas o explorar carreras de humanidades."

    #     # Enviar la recomendación a la app `usuarios`
    #     try:
    #         response = self.enviar_recomendacion_a_usuarios(request.user.id, recomendacion)
    #         if response.status_code == 200:
    #             return Response({
    #                 "correctas": correctas,  # Total de respuestas correctas
    #                 "recomendacion": recomendacion  # Mandamos la recomendación
    #             })
    #         else:
    #             return Response({"error": "No se pudo enviar la recomendación a la app de usuarios."}, status=500)
    #     except requests.exceptions.RequestException as e:
    #         return Response({"error": str(e)}, status=500)

    def enviar_recomendacion_a_usuarios(self, id, carr_op_A):
        """
        Enviar la recomendación de carrera a la app 'usuarios'.
        """
        url = "http://127.0.0.1:8000/login/estudiantes/perfil/"
        data = {
            "id": id,
            "carr_op_A": carr_op_A,
        }

        # Obtener el token JWT
        token = self.request.auth  # Aquí tomamos el token JWT
        if not token:
            raise Exception("No se encontró el token JWT")

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"  # Agregar el token JWT en el header
        }

        # Hacer la solicitud POST con los datos
        response = requests.post(url, json=data, headers=headers)
        return response


class ListarPreguntasView(APIView):
    """
    Devuelve un número fijo de preguntas por materia (por ejemplo, 10 por materia).
    """
    def get(self, request, *args, **kwargs):
        preguntas_finales = []
        materias = Pregunta.objects.values_list('materia', flat=True).distinct()

        for materia in materias:
            preguntas = Pregunta.objects.filter(materia=materia).order_by('?')[:10]
            preguntas_finales.extend(preguntas)

        serializer = PreguntaSerializer(preguntas_finales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
