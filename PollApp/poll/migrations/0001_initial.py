# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Poll'
        db.create_table('poll_poll', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('timestamp', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('rating_container_label', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('rating_label_1', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('rating_label_2', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('rating_label_3', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('rating_label_4', self.gf('django.db.models.fields.CharField')(default='none', max_length=255)),
            ('multiple_container_label', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('multiple_answer_1', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('multiple_answer_2', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('multiple_answer_3', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('multiple_answer_4', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('multiple_answer_5', self.gf('django.db.models.fields.CharField')(default='none', max_length=255)),
            ('essay_question_label', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('poll', ['Poll'])

        # Adding model 'Response'
        db.create_table('poll_response', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('poll', self.gf('django.db.models.fields.related.ForeignKey')(related_name='responses', to=orm['poll.Poll'])),
            ('user_name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('user_email', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('user_opt', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('rating_choice_1', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('rating_choice_2', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('rating_choice_3', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('rating_choice_4', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('rating_choice_5', self.gf('django.db.models.fields.PositiveSmallIntegerField')(default=0)),
            ('multiple_choice', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('essay_answer', self.gf('django.db.models.fields.CharField')(max_length=255)),
        ))
        db.send_create_signal('poll', ['Response'])


    def backwards(self, orm):
        # Deleting model 'Poll'
        db.delete_table('poll_poll')

        # Deleting model 'Response'
        db.delete_table('poll_response')


    models = {
        'poll.poll': {
            'Meta': {'object_name': 'Poll'},
            'essay_question_label': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'multiple_answer_1': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'multiple_answer_2': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'multiple_answer_3': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'multiple_answer_4': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'multiple_answer_5': ('django.db.models.fields.CharField', [], {'default': "'none'", 'max_length': '255'}),
            'multiple_container_label': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rating_container_label': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rating_label_1': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rating_label_2': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rating_label_3': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'rating_label_4': ('django.db.models.fields.CharField', [], {'default': "'none'", 'max_length': '255'}),
            'timestamp': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        },
        'poll.response': {
            'Meta': {'object_name': 'Response'},
            'essay_answer': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'multiple_choice': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'poll': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'responses'", 'to': "orm['poll.Poll']"}),
            'rating_choice_1': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'rating_choice_2': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'rating_choice_3': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'rating_choice_4': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'rating_choice_5': ('django.db.models.fields.PositiveSmallIntegerField', [], {'default': '0'}),
            'user_email': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'user_name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'user_opt': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['poll']