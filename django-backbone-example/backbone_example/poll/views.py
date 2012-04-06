from django.views.generic.base import TemplateView
from django.http import Http404

from api import v1
from .models import Poll


class IndexView(TemplateView):
    template_name = 'index.html'

    def get_polls(self):
        tr = v1.canonical_resource_for('poll')
        return tr.id


class DetailView(TemplateView):
    template_name = 'index.html'

    def get_detail(self, pk):
        tr = v1.canonical_resource_for('poll')

        try:
            poll = tr.cached_obj_get(pk=pk)
        except Poll.DoesNotExist:
            raise Http404

        bundle = tr.full_dehydrate(tr.build_bundle(obj=poll))
        data = bundle.data
        return data

    def get_context_data(self, **kwargs):
        base = super(DetailView, self).get_context_data(**kwargs)
        base['data'] = self.get_detail(base['params']['pk'])
        return base
