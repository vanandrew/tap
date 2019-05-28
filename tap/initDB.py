#!/usr/bin/env python

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tap.settings")
import django
django.setup()

from reservoir.models import *
from bids import BIDSLayout

# set the input ABCD data path
#input_data = '/mnt/Daenerys/ABCD/data/abcdbids_input'
input_data = '/home/vanandrew/ABCDtest'

# load all data
layout = BIDSLayout(input_data)
subjects = layout.get_subjects()

# loop over all subjects
#for sub in subjects:
sub = subjects[0]
sub_files = layout.get(subject=sub,extension='.nii.gz')
#for f in sub_files:
f = sub_files[0]
print(f)
print(f.path)
print(f.filename)
print(f.dirname)
print(f.get_entities(metadata='all'))
print(f.get_associations())
print([fs for fs in f.get_associations() if fs.entities['extension'] == 'json'])
