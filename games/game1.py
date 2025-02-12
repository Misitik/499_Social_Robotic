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
    x = int(request.GET.get('x', 220)) # X-coordinate of BALL (Default = 220)
    y = int(request.GET.get('y', 220)) # Y-coordinate of BALL (Default = 220)

    # Checks if direction is passed by the USER through the clicks of ARROW BUTTONS
    if 'direction' in request.GET:
        direction = request.GET.get('direction')

        if direction == 'up':
            y = max(y - 10, 0)  # Lower Bound = 0px (TOP)
        elif direction == 'down':
            y = min(y + 10, 450)  # Upped Bound = 450px (BOTTOM))
        elif direction == 'left':
            x = max(x - 10, 0)  # Lower Bound = 0px (LEFT)
        elif direction == 'right':
            x = min(x + 10, 450)  # Upper Bound = 450px (RIGHT)

    context = {
        'x': x,
        'y': y
    }

    return render(request, 'game1_game.html', context)
