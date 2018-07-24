from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Readings(models.Model):
	"""Table for holding readings recived from Raspberry PI"""
	registers = ["3913","3929","3943","3957","3909","3911","3925","3939","3953","3927","3941","3955","3903","3919","3933","3947","3905","3921","3935","3949","3901","3917","3931","3945","3907","3923","3937","3951","3915","3861","3863","3865","3867","3869","3871","3959","3961","3963","3965","3967","3969","3971","3973","3975","3977","3979","3881","3883","3885","3887","3889","3891","3993","3995","3997","3999","3981"]
	datetime = models.DateTimeField()
	for r in registers:
		exec('R'+r+'=models.FloatField(null=True,default=0.0)')
class AvgReadingsByDay(models.Model):
	"""Table for holding readings recived from Raspberry PI"""
	registers = ["3913","3929","3943","3957","3909","3911","3925","3939","3953","3927","3941","3955","3903","3919","3933","3947","3905","3921","3935","3949","3901","3917","3931","3945","3907","3923","3937","3951","3915","3861","3863","3865","3867","3869","3871","3959","3961","3963","3965","3967","3969","3971","3973","3975","3977","3979","3881","3883","3885","3887","3889","3891","3993","3995","3997","3999","3981"]
	datetime = models.DateTimeField()
	for r in registers:
		exec('R'+r+'=models.FloatField(null=True,default=0.0)')

