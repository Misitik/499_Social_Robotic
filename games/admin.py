from django.contrib import admin
from .models import planet_info
# Register your models here.
@admin.register(planet_info)
class RequestDemoAdmin(admin.ModelAdmin):
  list_display = [field.name for field in 
planet_info._meta.get_fields()]