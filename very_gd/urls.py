"""very.gd URL Configuration"""
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from rest_framework import routers

from media_portal.users.auth.views import MediaPortalAuthToken as VeryGDAuthToken
from media_portal.users.views import MembersViewSet, MemberCreateView

from media_portal.payment.views import available_stripe_plans
from media_portal.policy.urls import urlpatterns as policy_urls
from media_portal.admin import admin_site

from project.views import ProjectViewSet, PublicProjectViewSet
from scene.views import SceneViewSet
from panel.views import PanelImageViewSet

router = routers.DefaultRouter(trailing_slash=False)

router.register(r'users', MembersViewSet, base_name='users')

router.register(r'project', ProjectViewSet, base_name='project')

router.register(r'public/project', PublicProjectViewSet, base_name='public_project')

router.register(r'panel', PanelImageViewSet, base_name='panel')

router.register(r'scene', SceneViewSet, base_name='scene')

urlpatterns = router.urls

urlpatterns = [
    url(r'^plans/available/?$', available_stripe_plans, name='available_plans'),

    # TODO(andrew.silvernail): password reset link TBD
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/?$', lambda r: r,
        name='password_reset_confirm'),
    url(r'^auth/token/?', VeryGDAuthToken.as_view()),
    url(r'^users/signup/?$', MemberCreateView.as_view({'post': 'create'}), name='member-create'),
    url(r'^admin/?', admin_site.urls, name='admin'),
    url(r'^policy/?', include(policy_urls)),
    url(r'^docs/?', include('rest_framework_docs.urls')),

] + urlpatterns

if hasattr(settings, 'MEDIA_URL') and hasattr(settings, 'MEDIA_ROOT') and settings.MEDIA_URL and settings.MEDIA_ROOT:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
