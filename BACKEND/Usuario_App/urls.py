from django.urls import path

# Importamos las vistas desde los archivos correctos
from Usuario_App.views.view_user import CustomUserListCreateView
from Usuario_App.views.view_doc import DocenteProfileListCreateView
from Usuario_App.views.view_est import EstudianteProfileListCreateView
from Usuario_App.views.token_view import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from Usuario_App.endpoint.EstudianteProfileDetailView import EstudianteProfileDetailView
from Usuario_App.endpoint.CustomUserProfileView import CustomUserProfileView
# from Usuario_App.views.view_resp import GuardarRespuestasView

urlpatterns = [
   
    path('usuarios/', CustomUserListCreateView.as_view(), name='usuarios'),
    path('docentes/', DocenteProfileListCreateView.as_view(), name='docentes'),
    path('estudiantes/', EstudianteProfileListCreateView.as_view(), name='estudiantes'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('estudiantes/perfil/', EstudianteProfileDetailView.as_view(), name='perfil_estudiante'),
    path('usuarios/perfil/', CustomUserProfileView.as_view (), name='perfil_usuario'),
    # path('api/guardar-respuestas/', GuardarRespuestasView.as_view(), name='guardar_respuestas'),

]
