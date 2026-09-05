from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/temples/', include('apps.temples.urls')),
    path('api/v1/donations/', include('apps.donations.urls')),
    path('api/v1/recurring/', include('apps.recurring.urls')),
    path('api/v1/receipts/', include('apps.receipts.urls')),
    path('api/v1/initiatives/', include('apps.initiatives.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
