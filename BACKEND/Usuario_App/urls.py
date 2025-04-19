from django.urls import path

# Importamos las vistas desde los archivos correctos
from Usuario_App.views.view_user import CustomUserListCreateView
from Usuario_App.views.view_doc import DocenteProfileListCreateView
from Usuario_App.views.view_est import EstudianteProfileListCreateView



urlpatterns = [
   
    path('usuarios/', CustomUserListCreateView.as_view(), name='usuarios'),
    path('docentes/', DocenteProfileListCreateView.as_view(), name='docentes'),
    path('estudiantes/', EstudianteProfileListCreateView.as_view(), name='estudiantes'),
]
