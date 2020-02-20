from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView  # Import TemplateView
import json, logging
import pandas as pd

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


def route_section_data(request):
    """
    This view will receive POST section data from the React frontend and then submits a POST to the Canvas API
    :param request:
    :return: HttpResponse
    """
    
    # Parse section data from the front end
    logger.debug(route_section_data.__name__)
    request_body = json.loads(request.body.decode("utf-8"))
    logger.debug(request_body)
    course_id = request.session['course_id']

    return HttpResponse(json.dumps({'resp': True, 'course_id': course_id}))
