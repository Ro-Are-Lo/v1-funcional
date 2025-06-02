from django.urls import path

from .views import (EvaluarRespuestasView,ListarPreguntasView,ListarResultadosView)

from Test_App.File_upload import UploadExcelView

urlpatterns = [
    path('evaluar-respuestas/', EvaluarRespuestasView.as_view(), name='evaluar-respuestas'),
    path('preguntas/', ListarPreguntasView.as_view(), name='preguntas'),
    path('upload-excel/', UploadExcelView.as_view(), name='upload-excel'),
    path('resultados/', ListarResultadosView.as_view(), name='listar_resultados'),  # ← NUEVO
]


# from django.urls import path


# # from .views import MateriaListView, PreguntasAleatoriasView,
# from .views import EvaluarRespuestasView, ListarPreguntasView
# from Test_App.File_upload import UploadExcelView
# urlpatterns = [
#     # path('materias/', MateriaListView.as_view(), name='materias'),
#     # path('preguntas-aleatorias/', PreguntasAleatoriasView.as_view(), name='preguntas-aleatorias'),
#     path('evaluar-respuestas/', EvaluarRespuestasView.as_view(), name='evaluar-respuestas'),
#     path('preguntas/', ListarPreguntasView.as_view(), name='preguntas'),
#      path('upload-excel/', UploadExcelView.as_view(), name='upload-excel'),
#      path('resultados/', ListarResultadosView.as_view(), name='listar_resultados'),  # ← NUEVO
# ]



