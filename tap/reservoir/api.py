from .models import *

# grab list of availiable fields
def fields():
    fields = [f.name for f in BIDSFile._meta.get_fields()]
    return fields

# return list of unique field values
def unique_field(field):
    uf = BIDSFile.objects.order_by().values(field).distinct()
    return [f[field] for f in uf if f[field] != None]

def query(request,sub,ses):
    # construct query
    query_dict = dict()
    if sub:
        query_dict['subject__subject__exact'] = sub
    if ses:
        query_dict['session__session__exact'] = ses

    # get/filter data
    files = BIDSFile.objects.filter(**query_dict)

    # return file paths
    return [f.path for f in files]
