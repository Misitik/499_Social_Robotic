from django.urls import path
from . import homepage, game1, game2, game3 # . represents the current directory
urlpatterns = [
    path('', homepage.start, name = 'start'),
    path('home/', homepage.home, name = 'home'),
    path('game1', game1.game1_menu, name = 'game1_menu'),
    path('game2', game2.game2_menu, name = 'game2_menu'),
    path('game3', game3.game3_menu, name = 'game3_menu'),
    #path('riddle-game/<int:riddle_id>/', views.riddle_game_with_qr, name='riddle_game'),
    #path('move-ball/', views.move_ball, name='move_ball'),
]
