# Generated by Django 5.1.4 on 2025-03-31 03:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0010_map_savepoint_map_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='map_savepoint',
            name='current_drags',
            field=models.JSONField(blank=True, default=[]),
            preserve_default=False,
        ),
    ]
