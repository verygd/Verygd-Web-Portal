# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-12 00:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20161101_0011'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersettings',
            name='site',
            field=models.OneToOneField(default=1, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_settings', to='sites.Site'),
        ),
    ]
