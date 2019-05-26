from django.db import models

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
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
    )

    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
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

class Anat(BIDSFile):
    class Meta:
        verbose_name = "Anat"

class Fmap(BIDSFile):
    class Meta:
        verbose_name = "Fmap"

class Func(BIDSFile):
    task = models.CharField(
        "Task",
        max_length=255,
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Func"
