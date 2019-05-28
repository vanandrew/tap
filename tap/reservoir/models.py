import os
import json
from django.db import models
from django.conf import settings
from bids.layout import config

# Define base BIDS data model used by session, but also subject if no session is defined
class BaseBIDSDataClass(models.Model):
    path = models.TextField(
        "Path"
    )

    class Meta:
        abstract = True

class Subject(BaseBIDSDataClass):
    subject = models.CharField(
        "Subject",
        max_length = 255,
        primary_key=True
    )
 
    class Meta:
        verbose_name = "Subject"

    def __str__(self):
        return self.subject

class Session(BaseBIDSDataClass):
    session = models.CharField(
        "Session",
        max_length=255,
    )
 
    subject = models.ForeignKey(
        "Subject",
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Session"

    def __str__(self):
        return self.session

def createmetafield(metafields,key):
    # detect field type
    metatype = type(metafields[key])
 
    # create int field
    if metatype == int:
        return models.IntegerField(
            key,
            blank=True,
            null=True
        )
    elif metatype == float:
        return models.FloatField(
            key,
            blank=True,
            null=True
        )
    # create character field
    elif metatype == str or metatype == list:
        return models.CharField(
            key,
            max_length=255,
            blank=True,
            null=True
        )
    # raise validation error if no match
    else:
        raise ValueError("Could not find matching type for {}. Check BIDSMetaTemplates.".format(metatype))

# Define a base BIDS File model
class BIDSFile(models.Model):
    filename = models.CharField(
        "Filename",
        max_length=255,
        primary_key=True
    )

    sidecar = models.CharField(
        "JSON Sidecar", 
        max_length=255,
        blank=True,
        null=True
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
    )

    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    path = models.TextField(
        "Path"
    )

    # load entities file
    entities_json = os.path.join(config.__path__._path[0],'bids.json')
    with open(entities_json,'r') as entities_file:
        entities_dict = json.load(entities_file)

    # create fields
    for entry in entities_dict['entities']:
        if entry['name'] != 'subject' and entry['name'] != 'session':
            vars()[entry['name'].lower()] = models.CharField(
                entry['name'],
                max_length=255,
                blank=True,
                null=True
            )

    # load template file
    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/anat.json'),'r') as metafile:
        metafields = json.load(metafile)

    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/fmap.json'),'r') as metafile:
        metafields.update(json.load(metafile))

    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/func.json'),'r') as metafile:
        metafields.update(json.load(metafile))

    # create fields
    for key in metafields:
        if key.lower() not in [field.lower() for field in vars()]:
            vars()[key.lower()] = createmetafield(metafields,key) 
 
    class Meta:
        verbose_name = "BIDS File"
 
    def __str__(self):
        return self.filename

