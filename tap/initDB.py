#!/usr/bin/env python

import os
import shutil
import tempfile
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tap.settings")
import django
django.setup()

import json
from reservoir.models import *
from bids import BIDSLayout

# set the input ABCD data path
input_data = '/mnt/Daenerys/ABCD/data/abcdbids_input'
#input_data = '/home/vanandrew/ABCDtest'

# get list of files/folders in bids directory
bids_list = os.listdir(input_data)

# get subjects
subjects = [f.split('sub-')[-1] for f in bids_list if 'sub-' in f]

# get jsons
jsons = [f for f in bids_list if '.json' in f]

# loop over all subjects
for sub in subjects:
    # copy single subject data to temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        print('Creating Symlinks...')
        # create symlinks in temp dir
        os.symlink(os.path.join(input_data,'sub-{}'.format(sub)),os.path.join(temp_dir,'sub-{}'.format(sub)))
        for j in jsons:
            os.symlink(os.path.join(input_data,j),os.path.join(temp_dir,j))

        # get layout on temp dir
        print('Loading data...')
        layout = BIDSLayout(temp_dir)

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
                print('Loading Session {} from Subject {}'.format(metadata['session'],sub))
            except Session.DoesNotExist:
                try: # try to get the unlinked session
                    ses_obj = Session.objects.get(session=metadata['session'])
                    print('Loading Session {}'.format(metadata['session']))
                except Session.DoesNotExist:
                    print('Adding Session: {}'.format(metadata['session']))
                    ses_obj = Session(session=metadata['session'])
                    ses_obj.save()

                # add subject to the session
                ses_obj.subjects.add(sub_obj)
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
