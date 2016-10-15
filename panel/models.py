from media_portal.album.content.base.models import AlbumImage, AlbumVideo

from django.db import models


class Tag(models.Model):
    type = models.CharField(max_length=16, blank=True, null=True)


class Panel(models.Model):
    class Meta:
        abstract = True

    tag = models.CharField(max_length=16, blank=True, null=True)
    related_tag = models.CharField(max_length=16, blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    is_panorama = models.BooleanField(default=False, null=False, blank=True, verbose_name='is-panorama')


class PanelImage(AlbumImage, Panel):
    album = models.ForeignKey('project.Project', related_name='images')


class PanelVideo(AlbumVideo, Panel):
    album = models.ForeignKey('project.Project', related_name='videos')
