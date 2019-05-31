import os
from bids import BIDSLayout
from django.shortcuts import render
from django.http import JsonResponse
from .models import *

# Home Page
def home(request):
    return render(request, 'reservoir/home.html')

def api(request):
    # Get filenames
    start = int(request.GET['start'])
    end = start + int(request.GET['length'])
    filenames = BIDSFile.objects.all()

    # filter list
    filtered_list = [[f.filename, f.path] for f in filenames[start:end]]

    # create response and return
    response = {
        "draw": int(request.GET['draw']),
        "recordsTotal": len(filenames),
        "recordsFiltered": len(filenames),
        "data": filtered_list
    }

    return JsonResponse(response)

# Executive Summary
def test(request):
    return render(request, 'sub-NDARINV0A4P0LWM/ses-baselineYear1Arm1/files/executivesummary/executive_summary_sub-NDARINV0A4P0LWM.html')
