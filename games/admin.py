from django.contrib import admin
from .models import planet_info
from .models import diagloue
from .models import savepoint, space_users,manner_savepoints,manner_users

# Register your models here.
@admin.register(planet_info)
class RequestDemoAdmin(admin.ModelAdmin):
  list_display = [field.name for field in 
planet_info._meta.get_fields()]
  
admin.site.register(diagloue)
admin.site.register(savepoint)
admin.site.register(space_users)
admin.site.register(manner_users)
admin.site.register(manner_savepoints)