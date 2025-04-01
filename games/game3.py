import json
from django.shortcuts import render, redirect
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import map_user, map_savepoint
from rest_framework import status

def game3_menu(request):
    
    map_users = serialize('json', map_user.objects.all())
    map_savepoints = serialize('json', map_savepoint.objects.all())
    return render(request, 'game3/game3_start_menu.html', context = {
        'map_users': json.dumps(map_users),
        'map_saves': json.dumps(map_savepoints)
    })

@csrf_exempt
def game3_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        request.session['data'] = data
        return redirect('/game3_game/')
    map_savepoints = serialize('json', map_savepoint.objects.all())
    user_data = request.session.get('data',[])
    return render(request, 'game3/game3_game.html', context = {
         'map_savepoints': json.dumps(map_savepoints), 
         'user_data': json.dumps(user_data)
    })


@csrf_exempt
def save_log_map(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        log = map_savepoint(
                        time=data['time'],
                        game_won=data['game_won'],
                        map_draged=data['map_draged'],
                        map_correct=data['map_correct'],
                        current_drags=data['current_drags'])
                

        log.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)


@csrf_exempt
def load_log_map(request, log_id):
   
    if request.method == 'PUT':
        try:
            log = map_savepoint.objects.get(pk=log_id)
            data = json.loads(request.body)
            log.time=data['time']
            log.game_won=data['game_won']
            log.map_draged=data['map_draged'],
            log.map_correct=data['map_correct'],
            log.current_drags=data['current_drags']
            log.save()
   
            return JsonResponse({'status': 'success'})

        except map_savepoint.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def save_log_map_user(request):
    if request.method == 'POST':
            data = json.loads(request.body)
            log = map_user(name=data['name'],
                            save_points = data['save_points']
            )
            log.save()
            return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'failed'}, status=400)

@csrf_exempt
def load_log_map_user(request, log_id):
    if request.method == 'PUT':
        try:
            log =  map_user.objects.get(pk=log_id)
            data = json.loads(request.body)
            print(data)
            log.name = data['name']
            log.save_points = data['save_points']
            log.save()

            return JsonResponse({'status': 'success'})
        
        except  map_user.DoesNotExist:
            return JsonResponse({'message': 'the save point dont exist'},status=status.HTTP_404_NOT_FOUND )

    return JsonResponse({'status': 'failed'}, status=400)

