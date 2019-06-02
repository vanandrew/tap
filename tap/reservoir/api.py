from .models import *

# grab list of availiable fields
def fields():
    fields = [f.name for f in BIDSFile._meta.get_fields()]
    fields.sort()
    return fields

# return list of unique field values
def unique_field(field):
    uf = BIDSFile.objects.order_by().values(field).distinct()
    return [f[field] for f in uf if f[field] != None]

# return query
def query(filter_dict,sub,ses):
    # construct query
    query_dict = dict()
    if sub:
        query_dict['subject__subject__exact'] = sub
    if ses:
        query_dict['session__session__exact'] = ses

    # TODO: add more complex sql queries; for now use exact
    # TODO: add better error handling when key in filter_dict not availiable field
    # add each filter query to the query dictionary
    for key in filter_dict:
        query_dict['{}__exact'.format(key)] = filter_dict[key]

    # get/filter data
    files = BIDSFile.objects.filter(**query_dict)

    # return filtered files
    return files
