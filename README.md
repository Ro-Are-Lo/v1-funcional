nueva version del pryecto rehecho todo con text requiments para hacer funcionar todo solo se nesesita ejecutr los servidores per nates de eso este codigo
Primero, crea un entorno virtual para aislar las dependencias:
python -m venv env
Luego actívalo:

En Windows:
env\Scripts\activate

luego 
pip install -r requirements.txt
Esto instalará Django y todas las librerías necesarias para tu proyecto.

Corre migraciones (si no hay base de datos todavía)

python manage.py migrate

Corre el servidor

python manage.py runserver
