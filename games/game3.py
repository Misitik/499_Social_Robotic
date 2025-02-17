from django.shortcuts import render
from .models import planet_info
def game3_menu(request):

    return render(request, 'game3/game3_start_menu.html')

def game3_game(request):

    planets = planet_info.objects.all().values()
    return render(request, 'game3/game3_game.html', context = {"planets": planets, 'gi': 'gi'})