from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie import fields
from poll.models import Poll, Response


class PollResource(ModelResource):
    question1_avg = fields.FloatField(readonly=True)
    question2_avg = fields.FloatField(readonly=True)
    question3_avg = fields.FloatField(readonly=True)
    question4_avg = fields.FloatField(readonly=True)

    multianswr1_num = fields.FloatField(readonly=True)
    multianswr2_num = fields.FloatField(readonly=True)
    multianswr3_num = fields.FloatField(readonly=True)
    multianswr4_num = fields.FloatField(readonly=True)

    def determine_format(self, request):
        return "application/json"

    class Meta:
        queryset = Poll.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']

    def _dehydrate_questionX_avg(self, attr, bundle):
        total = 0.0

        # Make sure we don't have to worry about "divide by zero" errors.
        if not bundle.obj.responses.count():
            return None

        # We'll run over all the ``Rating`` objects & calculate an average.
        for response in bundle.obj.responses.all():
            total += getattr(response, attr)

        return round(total / bundle.obj.responses.count(), 2)

    def _dehydrate_multianswrX_num(self, attr, bundle):
        total = 0.0

        # Make sure we don't have to worry about "divide by zero" errors.
        if not bundle.obj.responses.count():
            return None

        # We'll run over all the ``Choice`` objects & calculate an average.
        for response in bundle.obj.responses.all():
            print '+++++++Answer'
            print getattr(response, 'multiple_choice')
            print attr
            print getattr(bundle.obj, attr)
            print getattr(response, 'multiple_choice')
            if getattr(bundle.obj, attr) == getattr(response, 'multiple_choice'):
                print 'Matched'
                total += 1

        return total

    def dehydrate_question1_avg(self, bundle):
        return self._dehydrate_questionX_avg('rating_choice_1', bundle)

    def dehydrate_question2_avg(self, bundle):
        return self._dehydrate_questionX_avg('rating_choice_2', bundle)

    def dehydrate_question3_avg(self, bundle):
        return self._dehydrate_questionX_avg('rating_choice_3', bundle)

    def dehydrate_question4_avg(self, bundle):
        return self._dehydrate_questionX_avg('rating_choice_4', bundle)

    def dehydrate_multianswr1_num(self, bundle):
        return self._dehydrate_multianswrX_num('multiple_answer_1', bundle)

    def dehydrate_multianswr2_num(self, bundle):
        return self._dehydrate_multianswrX_num('multiple_answer_2', bundle)

    def dehydrate_multianswr3_num(self, bundle):
        return self._dehydrate_multianswrX_num('multiple_answer_3', bundle)

    def dehydrate_multianswr4_num(self, bundle):
        return self._dehydrate_multianswrX_num('multiple_answer_4', bundle)


class ResponseResource(ModelResource):
    poll = fields.ForeignKey(PollResource, 'poll')

    def determine_format(self, request):
        return "application/json"

    class Meta:
        queryset = Response.objects.all()
        authorization = Authorization()
        list_allowed_methods = ['get', 'post']
