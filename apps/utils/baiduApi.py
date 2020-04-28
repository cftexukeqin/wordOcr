# encoding:utf-8

import requests
import base64
from django.conf import settings

'''
通用文字识别
'''

# encoding:utf-8
import requests


# client_id 为官网获取的AK， client_secret 为官网获取的SK
def get_token():
    host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id={0}&client_secret={1}'.format(settings.CLIENT_ID,settings.CLIENT_SECRET)
    response = requests.get(host)
    if response:
        resp_json = response.json()
        print(resp_json['access_token'])
        return resp_json['access_token']


# 二进制方式打开图片文件
def imgOCrApi(filepath):
    request_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"
    f = open(filepath, 'rb')
    img = base64.b64encode(f.read())
    token = get_token()
    params = {"image": img}
    access_token = token
    request_url = request_url + "?access_token=" + access_token
    headers = {'content-type': 'application/x-www-form-urlencoded'}
    response = requests.post(request_url, data=params, headers=headers)
    if response:
        return response.json()
