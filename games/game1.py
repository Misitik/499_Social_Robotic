from django.shortcuts import render
from .models import planet_info
from django.http import JsonResponse
from django.core.serializers import serialize
from .models import savepoint
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


class savepoint_view(APIView):
    def put(self, request, id, format=None):
        try:
            obj = savepoint.objects.get(id=id)  # Fetch object by ID
            serializer = update_log_serializer(obj, data=request.data)  # Validate & update
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except savepoint.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
def update_log(request, log_id):
   
    if request.method == 'PUT':
        try:
            log = savepoint.objects.get(pk=log_id)
            serializer = update_log_serializer(log, data=request.body) 
            if serializer.is_valid(): 
                serializer.save() 
            return JsonResponse(serializer.data, status=status.HTTP_200_OK) 

        except savepoint.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )
    

    
            return JsonResponse({'status': 'failed', 'message': 'log not found'}, status=404)
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
    loadpoint = -1
    save_points = serialize('json', savepoint.objects.all())

    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets), 'loadpoint': loadpoint,'save_points': save_points})


def move_ship(request):
    # Fetch the current coordinates(x, y) from query parameters in the URL
    planets = serialize('json', planet_info.objects.all())
    loadpoint = -1
    save_points = serialize('json', savepoint.objects.all())

    return render(request, 'game1/game1_game.html', context = {'planets': json.dumps(planets), 'loadpoint': loadpoint,'save_points': save_points})


def get_item(request, planet_name):
    data = {'id': 'id', 'name': planet_name, 'description': 'planet_description'}
    return JsonResponse(data)