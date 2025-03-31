import json
from django.shortcuts import render
from .models import map_user, map_savepoint
def game3_menu(request):
    
    #map_users = map_user.objects.all().values()
    #map_savepoints = map_savepoint.objects.all().values()
    return render(request, 'game3/game3_start_menu.html', context = {
        #'map_users': json.dumps(map_users),
        #'map_savepoint': json.dumps(map_savepoints)
    })


def game3_game(request):

   # map_savepoints = map_savepoint.objects.all().values()
    return render(request, 'game3/game3_game.html', context = {
        # 'map_savepoint': json.dumps(map_savepoints), 
    })

