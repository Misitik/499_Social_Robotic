from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json 
from .models import diagloue, manner_savepoints, manner_users
def game2_menu(request):

    users = serialize('json',manner_users.objects.all())
    savepoints = serialize('json',manner_savepoints.objects.all())
    return render(request, 'game2/game2_start_menu.html', context = {'users': json.dumps(users), 'savepoints': json.dumps(savepoints)})


@csrf_exempt
def game2_game(request):

    
    if request.method == 'POST':
        dialogue = serialize('json', diagloue.objects.all())
        data = json.loads(request.body)

        request.session['data'] = data
        return redirect('/game2_game/')
    dialogue = serialize('json', diagloue.objects.all())
    saves = serialize('json', manner_savepoints.objects.all())
    user_data = request.session.get('data',[])
    print('fff')
    print(user_data)
    return render(request, 'game2/game2_game.html', context = {'dialogue': json.dumps(dialogue), 'saves': saves, 'user_data': json.dumps(user_data)})

@csrf_exempt
def load_log_manner(request,log_id):
    if request.method == 'PUT':
        try:
            log = manner_savepoints.objects.get(pk=log_id)
            data = json.loads(request.body)
            log.time = data['time']
            log.game_won = data['game_won']
            log.options_choosen = data['options_choosen']
            log.choosing_scenario = data['choosing_scenario']
            log.save()

            return JsonResponse({'status': 'success'})
        
        except manner_savepoints.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def save_log_manner(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        log = manner_savepoints(time=data['time'],
                                game_won=data['game_won'],
                                options_choosen=data['options_choosen'],
                                choosing_scenario=data['choosing_scenario']
        )
        log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def load_log_manner_user(request,log_id):
    if request.method == 'PUT':
        try:
            log = manner_users.objects.get(pk=log_id)
            data = json.loads(request.body)
            print(data)
            log.name = data['name']
            log.save_points = data['save_points']
            log.save()

            return JsonResponse({'status': 'success'})
        
        except manner_savepoints.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)


@csrf_exempt
def save_log_manner_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        log = manner_users(name=data['name'],
                           save_points = data['save_points']
        )
        log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)