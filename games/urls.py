from django.urls import path
from . import homepage, game1, game2, game3 # . represents the current directory

urlpatterns = [
    path('', homepage.start, name = 'start'),
    path('home/', homepage.home, name = 'home'),
    path('game1_menu', game1.game1_menu, name = 'game1_menu'),
    path('game1_game/', game1.move_ship, name = 'game1_start'),
    path('game2_menu', game2.game2_menu, name = 'game2_menu'),
    path('game2_game/', game2.game2_game, name = 'game2_play'),
    path('game3_menu', game3.game3_menu, name = 'game3_menu'),
    path('game3_game', game3.game3_game, name = 'game3_play'),
    path('api/save-log/', game1.save_log, name = 'save_log'),
    path('api/load-log/<int:log_id>/', game1.update_log, name='update_log'),
    path('api/save-log-space-user/', game1.save_log_space_user, name = 'save_log_space_user'),
    path('api/load-log-space-user/<int:log_id>/', game1.load_log_space_user, name = 'load_log_space_user'),
    path('api/save-log-manner/', game2.save_log_manner, name = 'save_log_manner'),
    path('api/load-log-manner/<int:log_id>/', game2.load_log_manner, name = 'load_log_manner'),
    path('api/save-log-manner-user/', game2.save_log_manner_user, name = 'save_log_manner_user'),
    path('api/load-log-manner-user/<int:log_id>/', game2.load_log_manner_user, name = 'load_log_manner_user'),
    #path('riddle-game/<int:riddle_id>/', views.riddle_game_with_qr, name='riddle_game'),
    #path('move-ball/', views.move_ball, name='move_ball'),
]
