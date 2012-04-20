from django.contrib import admin
from .models import Poll, Response


class PollAdmin(admin.ModelAdmin):
    pass


class ResponseAdmin(admin.ModelAdmin):
    search_fields = ['user_email', ]
    list_display = ['poll', 'user_name', 'user_email', ]
    list_filter = ['poll', ]

admin.site.register(Poll, PollAdmin)
admin.site.register(Response, ResponseAdmin)
