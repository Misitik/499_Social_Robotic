from django.shortcuts import render
def game2_menu(request):

    return render(request, 'game2/game2_start_menu.html')

def game2_game(request):

    return render(request, 'game2/game2_game.html')