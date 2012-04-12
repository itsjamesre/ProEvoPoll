from django.db import models


class Poll(models.Model):
    title = models.CharField(("Title"), max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    rating_container_label = models.CharField(("Rating Container Label"), max_length=255)
    rating_label_1 = models.CharField(("Rating Label One"), max_length=255)
    rating_label_2 = models.CharField(("Rating Label Two"), max_length=255)
    rating_label_3 = models.CharField(("Rating Label Three"), max_length=255)
    rating_label_4 = models.CharField(("Rating Label Four"), max_length=255)

    multiple_container_label = models.CharField(("Multiple Choice Question"), max_length=255)
    multiple_answer_1 = models.CharField(("Multiple Choice One"), max_length=255)
    multiple_answer_2 = models.CharField(("Multiple Choice Two"), max_length=255)
    multiple_answer_3 = models.CharField(("Multiple Choice Three"), max_length=255)
    multiple_answer_4 = models.CharField(("Multiple Choice Four"), max_length=255)

    essay_question_label = models.CharField(("Essay Question"), max_length=255)

    def __unicode__(self):
        return self.title


class Response(models.Model):
    poll = models.ForeignKey(Poll, related_name='responses')

    user_name = models.CharField(("Full Name"), max_length=255)
    user_email = models.CharField(("Work Email"), max_length=255)
    rating_choice_1 = models.PositiveSmallIntegerField(("Rating Choice One"), default=0)
    rating_choice_2 = models.PositiveSmallIntegerField(("Rating Choice Two"), default=0)
    rating_choice_3 = models.PositiveSmallIntegerField(("Rating Choice Three"), default=0)
    rating_choice_4 = models.PositiveSmallIntegerField(("Rating Choice Four"), default=0)

    multiple_choice = models.CharField(("Multiple Choice Answer"), max_length=255)

    essay_answer = models.CharField(("Essay Answer"), max_length=255)
