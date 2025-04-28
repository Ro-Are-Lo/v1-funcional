# preguntas/views.py

import requests
from rest_framework.response import Response
from rest_framework import status
from .models import Pregunta
from rest_framework.views import APIView

class EvaluarRespuestasView(APIView):
    """
    Recibe respuestas, las evalúa y devuelve la recomendación de carrera,
    y envía esta recomendación a la app `usuarios`.
    """
    def post(self, request, *args, **kwargs):
        respuestas = request.data.get('respuestas', [])
        materia = request.data.get('materia', None)

        if not respuestas or not materia:
            return Response({"error": "Se deben enviar respuestas y materia."}, status=400)

        # Validar las respuestas y contar las correctas
        correctas = 0
        for respuesta in respuestas:
            try:
                pregunta = Pregunta.objects.get(id=respuesta['id'])
                if pregunta.opcorrecta == respuesta['respuesta']:
                    correctas += 1
            except Pregunta.DoesNotExist:
                return Response({"error": f"Pregunta con id {respuesta['id']} no encontrada."}, status=404)

        # Recomendación de carrera
        if correctas >= 7:
            recomendacion = "Te recomendamos las siguientes carreras: Ingeniería, Ciencia de Datos."
        elif correctas >= 6:
            recomendacion = "Te recomendamos las siguientes carreras: Matemáticas, Física."
        else:
            recomendacion = "Te recomendamos repasar los temas o explorar carreras de humanidades."

        # Enviar la recomendación a la app `usuarios`
        try:
            response = self.enviar_recomendacion_a_usuarios(request.user.id, recomendacion)
            if response.status_code == 200:
                return Response({"correctas": correctas, "recomendacion": recomendacion})
            else:
                return Response({"error": "No se pudo enviar la recomendación a la app de usuarios."}, status=500)
        except requests.exceptions.RequestException as e:
            return Response({"error": str(e)}, status=500)



    #ESTO ENVIARA LAS CARRAS OPTIMAS AL ESTUDIANTE
    

    def enviar_recomendacion_a_usuarios(self, usuario_id, recomendacion):
        """
        Enviar la recomendación de carrera a la app 'usuarios'.
        """
        url = "http://localhost:8001/api/usuarios/guardar_recomendacion/"  # URL de la app `usuarios`

        data = {
            "usuario_id": usuario_id,
            "recomendacion": recomendacion,
        }

        headers = {"Content-Type": "application/json"}

        # Realizar la petición POST
        response = requests.post(url, json=data, headers=headers)
        return response
