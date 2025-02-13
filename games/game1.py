from django.shortcuts import render

def game1_menu(request):
    '''
    Renders the "index.html" template using the variables defined in the "context" dictionary

    :param request: an HTTP request object
    :return: an HttpResponse object
    '''
    return render(request, 'game1_start_menu.html', context={
        'name': 'Mahinder, Ruiji and Gurneet', # The variable 'name' will be passed to the template
        'course': 'CPSC 499' # The variable 'course' will be passed to the template
    })

def game1_start(request):

    return render(request, 'game1_game.html')


def move_ship(request):
    # Fetch the current coordinates(x, y) from query parameters in the URL


    return render(request, 'game1_game.html')
