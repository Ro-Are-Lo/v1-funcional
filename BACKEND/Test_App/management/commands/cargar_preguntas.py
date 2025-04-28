
import pandas as pd
from django.core.management.base import BaseCommand
from Test_app.models import Pregunta

class Command(BaseCommand):
    help = 'Carga preguntas desde un archivo Excel'

    def add_arguments(self, parser):
        parser.add_argument('archivo', type=str)

    def handle(self, *args, **kwargs):
        archivo = kwargs['archivo']
        df = pd.read_excel(archivo)

        for _, row in df.iterrows():
            Pregunta.objects.create(
                materia=row['materia'],  # No cambia, ya está igual
                tema='',  # Si no tienes columna 'tema' en el Excel, puedes dejar este campo vacío o asignarle algún valor predeterminado.
                pregunta=row['pregunta'],  # No cambia, ya está igual
                opa=row['opcion_a'],  # Cambiado de 'opa' a 'opcion_a'
                opb=row['opcion_b'],  # Cambiado de 'opb' a 'opcion_b'
                opc=row['opcion_c'],  # Cambiado de 'opc' a 'opcion_c'
                opcorrecta=row['correcta'].strip()  # Cambiado de 'opcorrecta' a 'correcta' y se elimina el espacio en blanco al final
            )

        self.stdout.write(self.style.SUCCESS("Preguntas cargadas correctamente"))