from django.shortcuts import render
from .models import planet_info
from django.http import JsonResponse
from django.core.serializers import serialize
from .models import savepoint
from rest_framework import serializers
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
import json 

@csrf_exempt
def save_log(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        log = savepoint(stars_visited=data['stars_visited'], 
                        past_x_position = data['past_x_position'],
                        past_y_position=data['pas_y_position'],
                        time=data['time'],
                        clicks=data['clicks'],
                        x_pos=data['x_pos'],
                        y_pos=data['y_pos'],
                        game_won=data['game_won'])
        log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)


def game1_menu(request):
    '''
    Renders the "index.html" template using the variables defined in the "context" dictionary

    :param request: an HTTP request object
    :return: an HttpResponse object
    '''
    return render(request, 'game1/game1_start_menu.html', context={
        'name': 'Mahinder, Ruiji and Gurneet', # The variable 'name' will be passed to the template
        'course': 'CPSC 499' # The variable 'course' will be passed to the template
    })

def game1_start(request):

    planets = serialize('json', planet_info.objects.all())

    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets)})


def move_ship(request):
    # Fetch the current coordinates(x, y) from query parameters in the URL
    planets = serialize('json', planet_info.objects.all())

    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets)})


def get_item(request, planet_name):
    data = {'id': 'id', 'name': planet_name, 'description': 'planet_description'}
    return JsonResponse(data)