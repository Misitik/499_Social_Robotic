from django.shortcuts import render
def game2_menu(request):
    '''
    Renders the "index.html" template using the variables defined in the "context" dictionary

    :param request: an HTTP request object
    :return: an HttpResponse object
    '''
    return render(request, 'game2.html', context={
        'name': 'John', # The variable 'name' will be passed to the template
        'course': 'CPSC 499' # The variable 'course' will be passed to the template
    })