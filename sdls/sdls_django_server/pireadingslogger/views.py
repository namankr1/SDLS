from django.shortcuts import render
import json
from django.http import JsonResponse
from . import services
import hashlib
import string
import random

# Create your views here.
def checkLogin(request):
    if request.method == 'POST':
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
            
        try:
            #sha-256 hashing of password
            if jsonin['username'] == 'jimsonmathew' and jsonin['password'] == 'iitpatna_1111':
                try:
                    try:
                        inputfile = open('secure_key.txt','r')
                        lines = inputfile.readlines()
                        inputfile.close()
                        secure_key, count = lines[0].split("\t")
                        count = int(count)
                        count = count + 1
                    except:
                        secure_key = ""
                        count = 1
                    if(secure_key==""):
                        secure_key = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(32))
                        count = 1
                    inputfile = open('secure_key.txt','w')
                    inputfile.write(secure_key)
                    inputfile.write("\t")
                    inputfile.write(str(count))
                    inputfile.close()
                    return JsonResponse({'status':'ok','message':secure_key})
                except:
                    return JsonResponse({'status':'err','message':'Some error occured at server'})
            return JsonResponse({'status':'err','message':'Invalid login info'})
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})

def checkLogout(request):
    if request.method == 'POST':
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        
        try:
            try:
                inputfile = open('secure_key.txt','r')
                lines = inputfile.readlines()
                inputfile.close()
                secure_key, count = lines[0].split("\t")
                if jsonin['username'] == 'jimsonmathew' and jsonin['key'] == secure_key:
                    count = int(count)
                    count = count-1
                    if count <= 0:
                        secure_key = ""
                        count = 0
                    inputfile = open('secure_key.txt','w')
                    inputfile.write(secure_key)
                    inputfile.write("\t")
                    inputfile.write(str(count))
                    inputfile.close()
                    return JsonResponse({'status':'ok','message':'done'})
            except:
                return JsonResponse({'status':'err','message':'Some error occured at server'})
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
            
def insertReadings(request):
    if request.method == 'POST':
        result = 0
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        hashob = hashlib.sha256(str.encode('iitpatna_1111'))
        if jsonin['key']==hashob.hexdigest():
            pass
        else:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to insert data'})
        try:
            result = services.insertReadings(jsonin['date'],jsonin['time'],jsonin['readings'])
        except:
            return JsonResponse({'status':'err','message':'Insertion not successful'})
        if result == 1:
            return JsonResponse({'status':'ok','message':'Insertion successful'})
        else:
            return JsonResponse({'status':'err','message':'Insertion not successful'})

def getLatestReading(request):
    if request.method == 'POST':
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        try:
            inputfile = open('secure_key.txt','r')
            lines = inputfile.readlines()
            inputfile.close()
            secure_key, count = lines[0].split("\t")
        except:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        if jsonin['key']==secure_key:
            pass
        else:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        result = 0
        try:
            result = services.getLatestReading()
        except:
            return JsonResponse({'status':'err','message':'Server encountered an error'})
        return JsonResponse({'status':'ok','result':result})
    else:
        return JsonResponse({'status':'err','message':'Invalid request method'})

def getReadingsByDate(request):
    if request.method == 'POST':
        result = 0
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        try:
            inputfile = open('secure_key.txt','r')
            lines = inputfile.readlines()
            inputfile.close()
            secure_key, count = lines[0].split("\t")
        except:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        if jsonin['key']==secure_key:
            pass
        else:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        try:
            result = services.getReadingsByDate(jsonin['start_date'],jsonin['end_date'])
            return JsonResponse({'status':'ok','result':result})
        except:
            return JsonResponse({'status':'err','message':'Retrieval not successful'})
    else:
        return JsonResponse({'status':'err','message':'Bad request'})

def get24hrReadings(request):
    if request.method == 'POST':
        jsonin = None
        try:
            jsonin = json.loads(request.body)
        except:
            return JsonResponse({'status':'err','message':'Data given to server is invalid'})
        try:
            inputfile = open('secure_key.txt','r')
            lines = inputfile.readlines()
            inputfile.close()
            secure_key, count = lines[0].split("\t")
        except:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        if jsonin['key']==secure_key:
            pass
        else:
            return JsonResponse({'status':'err','message':'Unauthorized attempt to read data'})
        result = 0
        try:
            result = services.get24hrReadings()
        except:
            return JsonResponse({'status':'err','message':'Server encountered an error'})
        return JsonResponse({'status':'ok','result':result})
    else:
        return JsonResponse({'status':'err','message':'Invalid request method'})
