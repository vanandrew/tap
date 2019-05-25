import os
from bids import BIDSLayout
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    # set root abcd directory
    # TODO: do not hard code this in the future
    #abcd_root = '/mnt/Daenerys/ABCD/data'

    # get bids layout
    #layout = BIDSLayout(os.path.join(abcd_root,'abcdbids_input'))

    return render(request, 'reservoir/home.html')

def test(request):
    return render(request, 'sub-NDARINV0A4P0LWM/ses-baselineYear1Arm1/files/executivesummary/executive_summary_sub-NDARINV0A4P0LWM.html')
