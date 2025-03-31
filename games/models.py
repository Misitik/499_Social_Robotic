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

class savepoint(models.Model):
    stars_visited = models.JSONField(default=[0,0,0,0,0,0,0,0,0], blank=True)
    past_x_position = models.JSONField(blank = True)
    past_y_position = models.JSONField(blank = True)
    time = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    x_pos = models.FloatField(default=0)
    y_pos = models.FloatField(default=0)
    game_won = models.BooleanField(default=False)

    def get_clicks(self):
        return self.clicks
    
    def get_stars(self):
        return self.stars_visited
    
    def get_time(self):
        return self.time
class space_users(models.Model):
    name = models.CharField(max_length=30)
    save_points=models.JSONField(blank=True)

class manner_savepoints(models.Model):
    time = models.IntegerField(default=0)
    game_won = models.BooleanField(default=False)
    options_choosen= models.JSONField(blank=True)
    choosing_scenario= models.JSONField(blank=True)

class manner_users(models.Model):
    name = models.CharField(max_length=30)
    save_points=models.JSONField(blank=True)

class map_user(models.Model):
    name = models.CharField(max_length=30)
    save_points=models.JSONField(blank=True)

class map_savepoint(models.Model):
    time = models.IntegerField(default=0)
    game_won = models.BooleanField(default=False)
    map_draged = models.JSONField(blank=True)
    map_correct = models.JSONField(blank=True)
    current_drags = models.JSONField(blank=True)


    



