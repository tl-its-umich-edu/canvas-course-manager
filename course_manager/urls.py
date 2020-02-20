"""course_manager URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.HomePageView.as_view(), name='home'), # Notice the URL has been named
    path('lti/', include('django_lti_auth.urls')),
    path('isAdmin/', login_required(views.get_check_if_admin), name='get_check_if_admin'),
    path('sendAdminTask/', login_required(views.admin_task), name='admin_task'),
    path('routeSectionData/', login_required(views.route_section_data), name='route_section_data')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

