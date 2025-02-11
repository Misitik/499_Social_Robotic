from django.shortcuts import render
from django.http import HttpResponse
from .models import ToDoItem
from . import templates

def members(request):
    items = ToDoItem.objects.all().values()
    return render(request, "home.html", {'name': 'money', 'todos': items})

def todos(request):
    items = ToDoItem.objects.all().values()
    return render(request, 'todos.html', {'todos': items})

def details(request):
    item = 