from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
import json 
from .models import diagloue
def game2_menu(request):

    return render(request, 'game2/game2_start_menu.html')

def game2_game(request, ):

    dialogue = serialize('json', diagloue.objects.all())
    username = request.GET.get('userInput', 'Dante')

    return render(request, 'game2/game2_game.html', context = {'dialogue': json.dumps(dialogue), 'username': username})