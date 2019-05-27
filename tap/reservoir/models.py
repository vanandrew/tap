import os
import json
from django.db import models
from django.conf import settings

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

# Define a base BIDS File model
class BIDSFile(models.Model):
    filename = models.CharField(
        "Filename",
        max_length=255,
        primary_key=True
    )

    sidecar = models.CharField(
        "JSON Sidecar", 
        max_length=255
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

    run = models.IntegerField(
        "Run",
        blank=True,
        null=True
    )

    class Meta:
        abstract = True

    def __str__(self):
        return self.filename

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

class Anat(BIDSFile):
    # load template file
    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/anat.json'),'r') as metafile:
        metafields = json.load(metafile)

    # create fields
    for key in metafields:
        vars()[key] = createmetafield(metafields,key) 

    class Meta:
        verbose_name = "Anat"

class Fmap(BIDSFile):
    # load template file
    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/fmap.json'),'r') as metafile:
        metafields = json.load(metafile)

    # create fields
    for key in metafields:
        vars()[key] = createmetafield(metafields,key)

    class Meta:
        verbose_name = "Fmap"

class Func(BIDSFile):
    # load template file
    with open(os.path.join(settings.BASE_DIR,'reservoir/BIDSMetaTemplates/func.json'),'r') as metafile:
        metafields = json.load(metafile)

    # create fields
    for key in metafields:
        vars()[key] = createmetafield(metafields,key)

    task = models.CharField(
        "Task",
        max_length=255,
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Func"
