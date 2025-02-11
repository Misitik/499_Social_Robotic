from django.urls import path
from . import homepage, game1, game2, game3 # . represents the current directory
urlpatterns = [
    path('', homepage.home, name = 'home'),
    #path('riddle-game/<int:riddle_id>/', views.riddle_game_with_qr, name='riddle_game'),
    #path('move-ball/', views.move_ball, name='move_ball'),
]
