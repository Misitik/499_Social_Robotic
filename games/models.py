from django.db import models

# Create your models here.
class planet_info(models.Model):
    name = models.CharField(max_length = 10)
    info = models.TextField()
    question = models.TextField()
    answer = models.CharField(max_length = 10)

class diagloue(models.Model):
    name = models.CharField(max_length = 20)
    character_name = models.CharField(max_length = 10)
    dialogue = models.TextField()
    option_1 = models.TextField()
    option_2 = models.TextField()
    option_3 = models.TextField()
    option_1_branch = models.CharField(max_length = 20)
    option_2_branch = models.CharField(max_length = 20)
    option_3_branch = models.CharField(max_length = 20)
    option_1_hint = models.TextField(null = True)
    option_2_hint = models.TextField(null = True)
    option_3_hint = models.TextField(null = True)
    game_over = models.BooleanField(False)
    game_win = models.BooleanField(False)
    correct_option = models.IntegerField(default = 1)
    ending_message = models.TextField(null = True)

    

