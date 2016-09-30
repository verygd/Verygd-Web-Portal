# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from very_gd.tests.strategies import VeryGDTestStrategies
from users.tests import TestVeryGDUsers
from media_portal.album.tests.tests import TestImageAPI


class TestProject(TestImageAPI):
    def __init__(self, *args, **kwargs):
        super(TestProject, self).__init__(*args, **kwargs)

        self.strategies = VeryGDTestStrategies()
        self.users = TestVeryGDUsers()

    def test_images(self):
        super(TestProject, self).test_images()

    def test_list_images(self):
        super(TestProject, self).test_list_images()

    def test_tag_with_image(self):
        response, msg = self.add_image(self.member, self.album_id, tag='tag', related_tag='related_tag', order=5)

        self.assertEquals(response.status_code, 201, 'got {0} expected 201'.format(response.status_code))

        response, image_meta = self.get_as(self.member, '/images/{0}'.format(msg['id']))

        self.assertEquals(response.status_code, 200, 'got {0} expected 201'.format(response.status_code))

        self.assertTrue('tag' in image_meta and image_meta['tag'] == 'tag')
        self.assertTrue('related_tag' in image_meta and image_meta['related_tag'] == 'related_tag')

        self.assertTrue('order' in image_meta and image_meta['order'] == 5)
