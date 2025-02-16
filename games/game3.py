from django.shortcuts import render
def game3_menu(request):

    return render(request, 'game3_start_menu.html')

def game3_game(request):

    return render(request, 'game3_game.html')