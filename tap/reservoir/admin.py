from django.contrib import admin
from .models import *

class SubjectAdmin(admin.ModelAdmin):
    pass

class SessionAdmin(admin.ModelAdmin):
    pass

class AnatAdmin(admin.ModelAdmin):
    pass

class FmapAdmin(admin.ModelAdmin):
    pass

class FuncAdmin(admin.ModelAdmin):
    pass

admin.site.register(Subject,SubjectAdmin)
admin.site.register(Session,SessionAdmin)
admin.site.register(Anat,AnatAdmin)
admin.site.register(Fmap,FmapAdmin)
admin.site.register(Func,FuncAdmin)

admin.site.site_title = 'tap Admin'
admin.site.site_header = 'tap Admin'
admin.site.index_title = 'tap Admin Home'
