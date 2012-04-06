from tastypie.resources import ModelResource
from tastypie.authorization import Authorization

from poll.models import Poll, Response


class PollResource(ModelResource):
    class Meta:
        queryset = Poll.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']


class ResponseResource(ModelResource):
    class Meta:
        queryset = Response.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
