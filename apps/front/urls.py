from django.urls import path
from .views import index,upload_file,imgOcr,send_file


app_name = 'front'

urlpatterns = [
    path('',index,name='index'),
    path('upload/',upload_file,name='upload_file'),
    path('imgocr/',imgOcr,name='imgocr'),
    path('file/',send_file,name='sendfile'),
]