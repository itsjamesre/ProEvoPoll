from tastypie.api import Api
from resources import PollResource, ResponseResource

v1 = Api("v1")
v1.register(PollResource())
v1.register(ResponseResource())
