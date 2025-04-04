from rest_framework.routers import DefaultRouter
from usuario.api.views import UsuarioViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'usuario', UsuarioViewSet, basename='Usuario')
urlpatterns = router.urls


urlpatterns = [
    path('', include(router.urls)),
]
