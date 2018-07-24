from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^insertReadings/',views.insertReadings,name="PiDataInsert"),
	url(r'^getLatestReading/',views.getLatestReading,name="LatestReading"),
	url(r'^getReadingsByDate/',views.getReadingsByDate,name="ReadingsByDate"),
	url(r'^get24hrReadings/',views.get24hrReadings,name="get24hrReadings"),
	url(r'^checkLogin/',views.checkLogin,name="checkLogin"),
	url(r'^checkLogout/',views.checkLogout,name="checkLogout")
]