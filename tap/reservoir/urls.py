"""tap URL Configuration

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
from django.urls import path, re_path
from . import views
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('', views.home, name='home'),
    path('api', views.api, name='api'),
    path('test', views.test, name='test'),
]
if settings.DEBUG:
    urlpatterns += [ re_path(r'^abcd/(?P<path>.*)$', serve, {
                        'document_root': '/mnt/Daenerys/ABCD/data',
                        'show_indexes': True
                    })
                   ]
