import os
from bids import BIDSLayout
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    # set root abcd directory
    # TODO: do not hard code this in the future
    abcd_root = '/mnt/Daenerys/ABCD/data'

    # get bids layout
    layout = BIDSLayout(os.path.join(abcd_root,'abcdbids_input'))

    return HttpResponse('Test')
