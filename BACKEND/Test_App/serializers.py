from rest_framework import serializers
from .models import Pregunta

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = ['id', 'materia', 'tema', 'pregunta', 'opa', 'opb', 'opc','opd', 'opcorrecta']