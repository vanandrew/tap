#!/usr/bin/env python

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tap.settings")
import django
django.setup()

import json
from reservoir.models import *
from bids import BIDSLayout

# set the input ABCD data path
#input_data = '/mnt/Daenerys/ABCD/data/abcdbids_input'
input_data = '/home/vanandrew/ABCDtest'

# load all data
print('Loading BIDS Dataset... (This may take a while)')
layout = BIDSLayout(input_data)
subjects = layout.get_subjects()

# loop over all subjects
for sub in subjects:
    # get subject files
    sub_files = layout.get(subject=sub,extension='.nii.gz')

    # check if subject with name exists, create if not exist
    try:
        sub_obj = Subject.objects.get(subject=sub)
        print('Loading Subject {}'.format(sub))
    except Subject.DoesNotExist:
        print('Adding Subject: {}'.format(sub))
        sub_obj = Subject(subject=sub)
        sub_obj.save()

    # create list of bid files objects
    bf_objs = list()
    for f in sub_files:
        # get metadata, lower case all keys, stringify lists
        metadata = f.get_entities(metadata='all')
        metadata.update({'path': f.path, 'filename': f.filename})
        metadata = {key.lower(): metadata[key] for key in metadata}
        metadata.update({key: json.dumps(metadata[key]) for key in metadata if type(metadata[key]) == list})

        # check if session with name exists, create if not exist
        try:
            ses_obj = sub_obj.sessions.get(session=metadata['session'])
        except Session.DoesNotExist:
            ses_obj = Session(session=metadata['session'],subject=sub_obj)
            ses_obj.save()

        # delete subject and session from metadata dict
        del metadata['session']
        del metadata['subject']

        # check if bids file object already created, if not
        # create BIDS file with metadata and append to list
        try:
            BIDSFile.objects.get(filename=f.filename)
            print('File: {} already exists. Skipping...'.format(f.filename))
        except BIDSFile.DoesNotExist:
            print('Adding File: {}'.format(f.filename))
            bf_objs.append(BIDSFile(**metadata,subject=sub_obj,session=ses_obj))

    # Bulk create the bids file objects
    if bf_objs:
        BIDSFile.objects.bulk_create(bf_objs)
