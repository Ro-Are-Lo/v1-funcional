from django.urls import path
# from .views import MateriaListView, PreguntasAleatoriasView,
from .views import EvaluarRespuestasView, ListarPreguntasView

urlpatterns = [
    # path('materias/', MateriaListView.as_view(), name='materias'),
    # path('preguntas-aleatorias/', PreguntasAleatoriasView.as_view(), name='preguntas-aleatorias'),
    path('evaluar-respuestas/', EvaluarRespuestasView.as_view(), name='evaluar-respuestas'),
    path('preguntas/', ListarPreguntasView.as_view(), name='preguntas'),
]



