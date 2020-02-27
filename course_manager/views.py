# standard libraries
import json, logging
from datetime import datetime

# Django libraries
from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView  # Import TemplateView

# third-party libraries
import pandas as pd
import requests
# from canvasapi import Canvas
# import io

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
    :param: request
    :return: HttpResponse
    """
    
    # Parse section data from the front end
    logger.debug(route_section_data.__name__)
    data_ = request.POST['data']
    logger.info(data_)
    course_sis_id = request.session['course_sis_id']

    sections_df = pd.DataFrame(json.loads(data_))
    sections_df = sections_df.rename(columns={'id_prefix': 'section_id'})
    logger.info(sections_df.head())

    # Add timestamp and 'CCM' to section ids
    append_timestamp = (lambda x: f'{x}_{datetime.now().isoformat(timespec="milliseconds")}_CCM')
    sections_df['section_id'] = sections_df['section_id'].map(append_timestamp)

    # Add status and course_sis_id
    sections_df = sections_df.assign(**{
      'status': 'active',
      'course_id': course_sis_id
    })

    logger.info(sections_df.head())
    csv_binary_str = sections_df.to_csv()

    # output = io.StringIO(csv_binary_str)
    # canvas_instance = Canvas(settings.CANVAS_INSTANCE, settings.CANVAS_API_TOKEN)
    # account = canvas_instance.get_account(1)
    # resp = account.create_sis_import(output)
    # logger.info(resp.id)
    # logger.info(resp.workflow_state)

    url = f"{settings.CANVAS_INSTANCE}/api/v1/accounts/{settings.CANVAS_ROOT_ACCOUNT_ID}/sis_imports"

    headers = {
      'Content-Type': 'text/plain',
      'Authorization': f'Bearer {settings.CANVAS_API_TOKEN}'
    }

    response = requests.post(url, headers=headers, data=csv_binary_str)
    data_json = json.loads(response.text.encode('utf8'))

    logger.info(response.text.encode('utf8'))

    return HttpResponse(json.dumps({'resp': True, 'job_tracking_id': data_json['id']}))

def route_user_section_data(request):
    """
    This view receives POST user and section data from the React frontend and then submits a POST to the Canvas API
    :param: request
    :return: HttpResponse
    """

    # Parse user section data from the front end
    logger.debug(route_user_section_data.__name__)
    data_ = request.POST['data']
    logger.info(data_)
    course_sis_id = request.session['course_sis_id']

    user_section_df = pd.DataFrame(json.loads(data_))
    logger.info(user_section_df.head())

    # Add status and course_sis_id
    user_section_df = user_section_df.assign(**{
        'status': 'active',
        'course_id': course_sis_id
    })
    logger.info(user_section_df.head())

    csv_binary_str = user_section_df.to_csv()
    url = f"{settings.CANVAS_INSTANCE}/api/v1/accounts/{settings.CANVAS_ROOT_ACCOUNT_ID}/sis_imports"
    headers = {
        'Content-Type': 'text/plain',
        'Authorization': f'Bearer {settings.CANVAS_API_TOKEN}'
    }

    response = requests.post(url, headers=headers, data=csv_binary_str)
    data_json = json.loads(response.text.encode('utf8'))
    logger.info(data_json)

    return HttpResponse(json.dumps({'resp': True, 'job_tracking_id': data_json['id']}))


