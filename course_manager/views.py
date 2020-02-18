from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView  # Import TemplateView
import json
import logging

logger = logging.getLogger(__name__)


class HomePageView(TemplateView):
    template_name = "index.html"


def get_check_if_admin(request):
    """
   this API is checking if admin in the course
   """
    logger.debug(get_check_if_admin.__name__)
    data = {'isAdmin': True}

    logger.info(f"Session from course_id: {request.session['course_id']}")
    return HttpResponse(json.dumps(data))


def admin_task(request):
    """
    This is called for performing admin related task like creating section, adding users via sis process
    :param request:
    :return:
    """
    logger.debug(admin_task.__name__)
    task = json.loads(request.body.decode("utf-8"))
    logger.info(f"Admin Task perfomed is {task}")
    course_id = request.session['course_id']
    return HttpResponse(json.dumps({'resp': True, 'course_id': course_id}))
