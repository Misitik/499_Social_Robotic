# Generated by Django 5.1.4 on 2025-02-20 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_planet_info_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='planet_info',
            name='answer',
            field=models.CharField(default='true', max_length=10),
            preserve_default=False,
        ),
    ]
