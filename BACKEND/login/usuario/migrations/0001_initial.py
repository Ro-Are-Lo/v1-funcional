# Generated by Django 5.2 on 2025-04-03 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idusuario', models.CharField(max_length=16, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('tipoderol', models.CharField(choices=[('admin', 'Administrador'), ('moderador', 'Moderador'), ('usuario', 'Usuario')], default='usuario', max_length=16)),
            ],
        ),
    ]
