import os
from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from . import api

# Home Page
def home(request):
    return render(request, 'reservoir/home.html',{
        'fields': api.fields()
    })

# Table AJAX Call
@csrf_exempt
def table(request):
    # grab start and end of request
    start = int(request.POST['start'])
    end = start + int(request.POST['length'])

    # get filters and fields
    include = [{key.replace('[',']').split(']')[-2]: request.POST[key]} for key in request.POST if 'include' in key]
    exclude = [{key.replace('[',']').split(']')[-2]: request.POST[key]} for key in request.POST if 'exclude' in key]
    fields = [field.lower() for field in request.POST.getlist('fields[]')]

    # return subject data if in fields
    if 'subject' in fields:
        Object = Subject
        sorter = 'subject'

    else: # else return file data
        Object = BIDSFile
        sorter = 'filename'

    # get size of all records
    recordsTotal = Object.objects.count()

    # filter by includes/excludes
    include_dict = dict()
    exclude_dict = dict()
    for i in include:
        for key in i:
            include_dict['{}__contains'.format(key)] = i[key]
    for e in exclude:
        for key in e:
            exclude_dict['{}__contains'.format(key)] = e[key]

    # filter via search bar; sort
    search_value = request.POST['search[value]']
    dir = {'asc': sorter, 'desc': '-{}'.format(sorter)}[request.POST['order[0][dir]']]
    recordsFiltered = Object.objects.filter(**include_dict).exclude(**exclude_dict).filter(
        **{'{}__contains'.format(sorter): search_value}).order_by(dir).only(*fields)

    # format data TODO: This is slow... figure out a faster formatting...
    data = [[getattr(r,f) for f in fields] for r in recordsFiltered]

    # create response and return
    response = {
        "draw": int(request.POST['draw']),
        "recordsTotal": recordsTotal,
        "recordsFiltered": len(recordsFiltered),
        "data": data[start:end]
    }
    return JsonResponse(response)

# Subject
def subject(request,sub):
    # get subject
    s = Subject.objects.get(subject=sub)

    # get list of all sessions
    ses = s.sessions.all()

    # get total number of sessions
    num_sessions = ses.count()

    # get total number of Files
    num_files = s.bidsfiles.count()

    return render(request, 'reservoir/subject.html', {
        'subject': sub,
        'sessions': ses,
        'num_sessions': num_sessions,
        'num_files': num_files,
        'fields': api.fields()
    })

# Executive Summary
def exec_summary(request,sub,ses):
    return redirect('/abcd/sub-{0}/ses-{1}/files/executivesummary/executive_summary_sub-{0}.html'.format(
        sub,ses
    ),permanent=True)

"""
    API Views
"""

# List Availiable Fields
def api_fields(request):
    return JsonResponse({'fields': api.fields()})

# Get unique values for field
def api_unique(request,field=None):
    if field:
        return JsonResponse({field: api.unique_field(field)})
    else:
        return JsonResponse({})

# Query file list
def api_query(request,sub=None,ses=None):
    files = api.query(request.GET.dict(),sub,ses)
    return JsonResponse({'path': [f.path for f in files]})
