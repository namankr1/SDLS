#!/home/mathewjimson/Djangosdls/virtualenvsdls/bin/python
#/usr/bin/perl
#system("/home/mathewjimson/Djangosdls/virtualenvsdls/bin/python /home/mathewjimson/Djangosdls/sdls/substationdatalogger/wsgi.py 2>&1");

#/home/mathewjimson/Djangosdls/virtualenvsdls/bin/python
import sys, os
sys.path.insert(0,"/home/mathewjimson/Djangosdls/sdls/substationdatalogger")
sys.path.insert(0,"/home/mathewjimson/Djangosdls/sdls")
os.environ['DJANGO_SETTINGS_MODULE'] = 'substationdatalogger.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "substationdatalogger.settings")
 
from flup.server.fcgi import WSGIServer
from django.core.handlers.wsgi import WSGIHandler
from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

application = get_wsgi_application()
application = DjangoWhiteNoise(application)
WSGIServer(application).run()
