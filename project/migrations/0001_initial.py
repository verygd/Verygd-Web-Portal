# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-09-30 05:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('panel', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('description', models.CharField(blank=True, max_length=128, null=True)),
                ('decade', models.CharField(blank=True, max_length=16, null=True)),
                ('cover_image', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cover_for_album', to='panel.PanelImage')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='albums', to='users.Member')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]