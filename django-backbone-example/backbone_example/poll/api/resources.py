from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields
from poll.models import Poll, Response


class PollResource(ModelResource):

    def determine_format(self, request):
        return "application/json"

    class Meta:
        queryset = Poll.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']


class ResponseResource(ModelResource):
    poll = fields.ForeignKey(PollResource, 'id')

    def determine_format(self, request):
        return "application/json"

    class Meta:
        queryset = Response.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
