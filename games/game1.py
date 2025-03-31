from django.shortcuts import redirect, render
from .models import planet_info
from django.http import JsonResponse
from django.core.serializers import serialize
from .models import savepoint, space_users
from rest_framework import serializers
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser 
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json 
from django.views import View

class update_log_serializer(serializers.ModelSerializer):
    class Meta:
        model = savepoint
        fields = '__all__'

class update_log_serializer_view(generics.UpdateAPIView):
    queryset = savepoint.objects.all()
    serializer_class = update_log_serializer

@csrf_exempt
def save_log(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        log = savepoint(stars_visited=data['stars_visited'], 
                        past_x_position = data['past_x_position'],
                        past_y_position=data['past_y_position'],
                        time=data['time'],
                        clicks=data['clicks'],
                        x_pos=data['x_pos'],
                        y_pos=data['y_pos'],
                        game_won=data['game_won'])
        log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)




@csrf_exempt
def update_log(request, log_id):
   
    if request.method == 'PUT':
        try:
            log = savepoint.objects.get(pk=log_id)
            data = json.loads(request.body)
            log.stars_visited=data['stars_visited']
            log.past_x_position = data['past_x_position']
            log.past_y_position=data['past_y_position']
            log.time=data['time']
            log.clicks=data['clicks']
            log.x_pos=data['x_pos']
            log.y_pos=data['y_pos']
            log.game_won=data['game_won']
            log.save()
   
            return JsonResponse({'status': 'success'})

        except savepoint.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def save_log_space_user(request):
    if request.method == 'POST':
            data = json.loads(request.body)
            log = space_users(name=data['name'],
                            save_points = data['save_points']
            )
            log.save()
            return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def load_log_space_user(request, log_id):
    if request.method == 'PUT':
        try:
            log = space_users.objects.get(pk=log_id)
            data = json.loads(request.body)
            print(data)
            log.name = data['name']
            log.save_points = data['save_points']
            log.save()

            return JsonResponse({'status': 'success'})
        
        except space_users.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)



def game1_menu(request):
    '''
    Renders the "index.html" template using the variables defined in the "context" dictionary

    :param request: an HTTP request object
    :return: an HttpResponse object
    '''

    space_userss = serialize('json', space_users.objects.all()) 
    space_saves = serialize('json', savepoint.objects.all())
    return render(request, 'game1/game1_start_menu.html', context={
       'space_users': json.dumps(space_userss), 'space_saves': json.dumps(space_saves)
    })

def game1_start(request):

    planets = serialize('json', planet_info.objects.all())
    loadpoint = -1
    save_points = serialize('json', savepoint.objects.all())

    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets), 'loadpoint': loadpoint,'save_points': save_points})

@csrf_exempt
def move_ship(request):
    # Fetch the current coordinates(x, y) from query parameters in the URL
    if request.method == 'POST':
        data = json.loads(request.body)
        request.session['data'] = data
        return redirect('/game1_game/')
    planets = serialize('json', planet_info.objects.all())
    save_points = serialize('json', savepoint.objects.all())
    user_data = request.session.get('data',[])
    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets), 'save_points': json.dumps(save_points), 'user_data': json.dumps(user_data)})

def get_item(request, planet_name):
    data = {'id': 'id', 'name': planet_name, 'description': 'planet_description'}
    return JsonResponse(data)