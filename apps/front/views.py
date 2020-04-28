from django.shortcuts import render,redirect,reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.conf import settings
from django.http import HttpResponse,FileResponse

import os

from apps.utils import restful
from apps.utils.baiduApi import imgOCrApi
import csv


# Create your views here.


@login_required(login_url='/user/login/')
def index(request):
    return render(request,'front/index.html')


#文件上传
@require_POST
def upload_file(request):
    file = request.FILES.get('file')
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT,name),'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL+name)
    return restful.result(message="上传完成",data={'url':url})


# 文字识别视图函数
@require_POST
def imgOcr(request):
    imgurl = request.POST.get("imgurl")
    img_filename = imgurl.split("/")[-1]
    txt_filename = img_filename.split(".")[0]+'.txt'
    file_path = os.path.join(settings.MEDIA_ROOT, img_filename)
    txturl = request.build_absolute_uri(settings.MEDIA_URL+txt_filename)
    respDict = imgOCrApi(file_path)
    wordslist = []
    context = ""
    if respDict['words_result']:
        for item in respDict['words_result']:
            wordslist.append(item['words'])
            context = "".join(wordslist)
            with open(os.path.join(settings.UEDITOR_UPLOAD_PATH,txt_filename),'w') as fp:
                fp.write(context)
        print(context)
        return restful.result(
            data=
                {
                    'context': context,
                    't_filename':txt_filename
                }
        )
    else:
        return restful.result(data={'context':context})

@require_POST
def send_file(request):
    txturl = request.GET.get("txturl")
    filename = txturl.split("/")[-1]
    print(filename)
    file = open(os.path.join(settings.UEDITOR_UPLOAD_PATH,filename),'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="test.txt"'
    return response
