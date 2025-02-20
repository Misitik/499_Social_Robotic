from django.db import models

# Create your models here.
class planet_info(models.Model):
    name = models.CharField(max_length = 10)
    info = models.TextField()
    question = models.TextField()
    answer = models.CharField(max_length = 10)
