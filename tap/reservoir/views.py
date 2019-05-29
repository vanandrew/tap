import os
from bids import BIDSLayout
from django.shortcuts import render
from django.http import JsonResponse
from .models import *

# Home Page
def home(request):
    return render(request, 'reservoir/home.html')

def api(request):
    # Get subjects
    start = int(request.GET['start'])
    end = start + int(request.GET['length'])
    subs = Subject.objects.all()[start:end]

    # get subject names
    name = [sub.subject for sub in subs]

    # create response and return
    response = {
        "draw": int(request.GET['draw']),
        "recordsTotal": len(subs),
        "recordsFiltered": len(subs),
        "data": [[n,]for n in name]
    }
    return JsonResponse(response)

# Executive Summary
def test(request):
    return render(request, 'sub-NDARINV0A4P0LWM/ses-baselineYear1Arm1/files/executivesummary/executive_summary_sub-NDARINV0A4P0LWM.html')
