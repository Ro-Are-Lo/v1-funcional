from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import pandas as pd
from .models import Pregunta

@method_decorator(csrf_exempt, name='dispatch')
class UploadExcelView(View):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')  # Obtener el archivo del formulario
        if not file:
            return JsonResponse({'error': 'No se envió ningún archivo'}, status=400)

        try:
            # Cargar el archivo Excel
            df = pd.read_excel(file)

            # Normalizar los nombres de las columnas (convertir a minúsculas y quitar espacios)
            df.columns = df.columns.str.strip().str.lower()

            # Verifica las columnas
            required_columns = ['materia', 'tema', 'pregunta', 'opa', 'opb', 'opc', 'opd', 'opcorrecta']
            
            # Verificar si las columnas requeridas existen
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return JsonResponse({'error': f'Faltan las siguientes columnas en el archivo: {", ".join(missing_columns)}'}, status=400)

            preguntas = []
            for _, row in df.iterrows():
                preguntas.append(Pregunta(
                    materia=row['materia'],
                    tema=row.get('tema', ''),  # Si 'tema' falta, asignar vacío por defecto
                    pregunta=row['pregunta'],
                    opa=row['opa'],
                    opb=row['opb'],
                    opc=row['opc'],
                    opd=row['opd'],
                    opcorrecta=row['opcorrecta']
                ))

            # Insertar las preguntas en la base de datos
            Pregunta.objects.bulk_create(preguntas)
            return JsonResponse({'message': 'Preguntas cargadas correctamente'})

        except Exception as e:
            # Si ocurre un error, devolver un error 500 con el mensaje de excepción
            return JsonResponse({'error': f'Ocurrió un error al procesar el archivo: {str(e)}'}, status=500)
