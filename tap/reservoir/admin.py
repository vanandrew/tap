from django.contrib import admin
from .models import *

class SubjectAdmin(admin.ModelAdmin):
    pass

class SessionAdmin(admin.ModelAdmin):
    pass

class BIDSFileAdmin(admin.ModelAdmin):
    pass

admin.site.register(Subject,SubjectAdmin)
admin.site.register(Session,SessionAdmin)
admin.site.register(BIDSFile,BIDSFileAdmin)

admin.site.site_title = 'tap Admin'
admin.site.site_header = 'tap Admin'
admin.site.index_title = 'tap Admin Home'
