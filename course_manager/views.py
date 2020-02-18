from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView  # Import TemplateView
import json


# Add the two views we have been talking about  all this time :)
class HomePageView(TemplateView):
    template_name = "index.html"


def get_check_if_admin(request):
    """
   this API is checking if admin in the course
   """
    data = {'isAdmin': True}
    print(data)
    print(f"Session from course_id: {request.session['course_id']}")
    return HttpResponse(json.dumps(data))


def admin_task(request):
    task = json.loads(request.body.decode("utf-8"))
    print(task)
    course_id = request.session['course_id']
    return HttpResponse(json.dumps({'resp': True, 'course_id': course_id}))
