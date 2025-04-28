from django.urls import path
from .views import MateriaListView, PreguntasAleatoriasView, EvaluarRespuestasView

urlpatterns = [
    path('materias/', MateriaListView.as_view(), name='materias'),
    path('preguntas-aleatorias/', PreguntasAleatoriasView.as_view(), name='preguntas-aleatorias'),
    path('evaluar-respuestas/', EvaluarRespuestasView.as_view(), name='evaluar-respuestas'),
]


