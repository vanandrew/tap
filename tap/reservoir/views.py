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

    # adjust response for table type
    if request.POST['tabletype'] == 'files':
        # get size of all records
        recordsTotal = BIDSFile.objects.count()

        # filter filenames via search bar; sort filenames
        search_value = request.POST['search[value]']
        dir = {'asc': 'filename', 'desc': '-filename'}[request.POST['order[0][dir]']]
        recordsFiltered = BIDSFile.objects.filter(filename__contains=search_value).order_by(dir)

        # TODO: OBVIOUSLY BAD CODE! REFACTOR
        # format final list
        if end == -1:
            data = [[f.filename, f.path] for f in recordsFiltered]
        else:
            data = [[f.filename, f.path] for f in recordsFiltered[start:end]]
    elif request.POST['tabletype'] == 'subjects':
        # get size of all records
        recordsTotal = Subject.objects.count()

        # filter subjects via search bar; sort subjects
        search_value = request.POST['search[value]']
        dir = {'asc': 'subject', 'desc': '-subject'}[request.POST['order[0][dir]']]
        recordsFiltered = Subject.objects.filter(subject__contains=search_value).order_by(dir)

        # TODO: OBVIOUSLY BAD CODE! REFACTOR
        # format final list
        if end == -1:
            data = [[f.subject,] for f in recordsFiltered]
        else:
            data = [[f.subject,] for f in recordsFiltered[start:end]]

    # create response and return
    response = {
        "draw": int(request.POST['draw']),
        "recordsTotal": recordsTotal,
        "recordsFiltered": len(recordsFiltered),
        "data": data
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
def api_unique(request,field):
    return JsonResponse({field: api.unique_field(field)})

# Query file list
def api_query(request,sub=None,ses=None):
    files = api.query(request.GET.dict(),sub,ses)
    return JsonResponse({'path': [f.path for f in files]})
