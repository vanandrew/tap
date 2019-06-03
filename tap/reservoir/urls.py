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
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('', views.home, name='home'),
    path('table', views.table, name='table'),
    path('subject/<sub>', views.subject, name='subject'),
    path('summary/<sub>/<ses>', views.exec_summary, name='exec_summary'),

    # API
    path('api/v1/fields', views.api_fields, name='api_fields'),
    path('api/v1/unique', views.api_unique, name='api_unique'),
    path('api/v1/unique/<field>', views.api_unique, name='api_unique'),
    path('api/v1/query', views.api_query, name='api_query'),
    path('api/v1/query/<sub>', views.api_query, name='api_query'),
    path('api/v1/query/<sub>/<ses>', views.api_query, name='api_query')
]
if settings.DEBUG:
    urlpatterns += [ re_path(r'^abcd/(?P<path>.*)$', serve, {
                        'document_root': settings.ABCD_FILES,
                        'show_indexes': True
                    })
                   ]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
