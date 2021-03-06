# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-01-12 14:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AvgReadingsByDay',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('R3913', models.FloatField(default=0.0, null=True)),
                ('R3929', models.FloatField(default=0.0, null=True)),
                ('R3943', models.FloatField(default=0.0, null=True)),
                ('R3957', models.FloatField(default=0.0, null=True)),
                ('R3909', models.FloatField(default=0.0, null=True)),
                ('R3911', models.FloatField(default=0.0, null=True)),
                ('R3925', models.FloatField(default=0.0, null=True)),
                ('R3939', models.FloatField(default=0.0, null=True)),
                ('R3953', models.FloatField(default=0.0, null=True)),
                ('R3927', models.FloatField(default=0.0, null=True)),
                ('R3941', models.FloatField(default=0.0, null=True)),
                ('R3955', models.FloatField(default=0.0, null=True)),
                ('R3903', models.FloatField(default=0.0, null=True)),
                ('R3919', models.FloatField(default=0.0, null=True)),
                ('R3933', models.FloatField(default=0.0, null=True)),
                ('R3947', models.FloatField(default=0.0, null=True)),
                ('R3905', models.FloatField(default=0.0, null=True)),
                ('R3921', models.FloatField(default=0.0, null=True)),
                ('R3935', models.FloatField(default=0.0, null=True)),
                ('R3949', models.FloatField(default=0.0, null=True)),
                ('R3901', models.FloatField(default=0.0, null=True)),
                ('R3917', models.FloatField(default=0.0, null=True)),
                ('R3931', models.FloatField(default=0.0, null=True)),
                ('R3945', models.FloatField(default=0.0, null=True)),
                ('R3907', models.FloatField(default=0.0, null=True)),
                ('R3923', models.FloatField(default=0.0, null=True)),
                ('R3937', models.FloatField(default=0.0, null=True)),
                ('R3951', models.FloatField(default=0.0, null=True)),
                ('R3915', models.FloatField(default=0.0, null=True)),
                ('R3861', models.FloatField(default=0.0, null=True)),
                ('R3863', models.FloatField(default=0.0, null=True)),
                ('R3865', models.FloatField(default=0.0, null=True)),
                ('R3867', models.FloatField(default=0.0, null=True)),
                ('R3869', models.FloatField(default=0.0, null=True)),
                ('R3871', models.FloatField(default=0.0, null=True)),
                ('R3959', models.FloatField(default=0.0, null=True)),
                ('R3961', models.FloatField(default=0.0, null=True)),
                ('R3963', models.FloatField(default=0.0, null=True)),
                ('R3965', models.FloatField(default=0.0, null=True)),
                ('R3967', models.FloatField(default=0.0, null=True)),
                ('R3969', models.FloatField(default=0.0, null=True)),
                ('R3971', models.FloatField(default=0.0, null=True)),
                ('R3973', models.FloatField(default=0.0, null=True)),
                ('R3975', models.FloatField(default=0.0, null=True)),
                ('R3977', models.FloatField(default=0.0, null=True)),
                ('R3979', models.FloatField(default=0.0, null=True)),
                ('R3881', models.FloatField(default=0.0, null=True)),
                ('R3883', models.FloatField(default=0.0, null=True)),
                ('R3885', models.FloatField(default=0.0, null=True)),
                ('R3887', models.FloatField(default=0.0, null=True)),
                ('R3889', models.FloatField(default=0.0, null=True)),
                ('R3891', models.FloatField(default=0.0, null=True)),
                ('R3993', models.FloatField(default=0.0, null=True)),
                ('R3995', models.FloatField(default=0.0, null=True)),
                ('R3997', models.FloatField(default=0.0, null=True)),
                ('R3999', models.FloatField(default=0.0, null=True)),
                ('R3981', models.FloatField(default=0.0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Readings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('R3913', models.FloatField(default=0.0, null=True)),
                ('R3929', models.FloatField(default=0.0, null=True)),
                ('R3943', models.FloatField(default=0.0, null=True)),
                ('R3957', models.FloatField(default=0.0, null=True)),
                ('R3909', models.FloatField(default=0.0, null=True)),
                ('R3911', models.FloatField(default=0.0, null=True)),
                ('R3925', models.FloatField(default=0.0, null=True)),
                ('R3939', models.FloatField(default=0.0, null=True)),
                ('R3953', models.FloatField(default=0.0, null=True)),
                ('R3927', models.FloatField(default=0.0, null=True)),
                ('R3941', models.FloatField(default=0.0, null=True)),
                ('R3955', models.FloatField(default=0.0, null=True)),
                ('R3903', models.FloatField(default=0.0, null=True)),
                ('R3919', models.FloatField(default=0.0, null=True)),
                ('R3933', models.FloatField(default=0.0, null=True)),
                ('R3947', models.FloatField(default=0.0, null=True)),
                ('R3905', models.FloatField(default=0.0, null=True)),
                ('R3921', models.FloatField(default=0.0, null=True)),
                ('R3935', models.FloatField(default=0.0, null=True)),
                ('R3949', models.FloatField(default=0.0, null=True)),
                ('R3901', models.FloatField(default=0.0, null=True)),
                ('R3917', models.FloatField(default=0.0, null=True)),
                ('R3931', models.FloatField(default=0.0, null=True)),
                ('R3945', models.FloatField(default=0.0, null=True)),
                ('R3907', models.FloatField(default=0.0, null=True)),
                ('R3923', models.FloatField(default=0.0, null=True)),
                ('R3937', models.FloatField(default=0.0, null=True)),
                ('R3951', models.FloatField(default=0.0, null=True)),
                ('R3915', models.FloatField(default=0.0, null=True)),
                ('R3861', models.FloatField(default=0.0, null=True)),
                ('R3863', models.FloatField(default=0.0, null=True)),
                ('R3865', models.FloatField(default=0.0, null=True)),
                ('R3867', models.FloatField(default=0.0, null=True)),
                ('R3869', models.FloatField(default=0.0, null=True)),
                ('R3871', models.FloatField(default=0.0, null=True)),
                ('R3959', models.FloatField(default=0.0, null=True)),
                ('R3961', models.FloatField(default=0.0, null=True)),
                ('R3963', models.FloatField(default=0.0, null=True)),
                ('R3965', models.FloatField(default=0.0, null=True)),
                ('R3967', models.FloatField(default=0.0, null=True)),
                ('R3969', models.FloatField(default=0.0, null=True)),
                ('R3971', models.FloatField(default=0.0, null=True)),
                ('R3973', models.FloatField(default=0.0, null=True)),
                ('R3975', models.FloatField(default=0.0, null=True)),
                ('R3977', models.FloatField(default=0.0, null=True)),
                ('R3979', models.FloatField(default=0.0, null=True)),
                ('R3881', models.FloatField(default=0.0, null=True)),
                ('R3883', models.FloatField(default=0.0, null=True)),
                ('R3885', models.FloatField(default=0.0, null=True)),
                ('R3887', models.FloatField(default=0.0, null=True)),
                ('R3889', models.FloatField(default=0.0, null=True)),
                ('R3891', models.FloatField(default=0.0, null=True)),
                ('R3993', models.FloatField(default=0.0, null=True)),
                ('R3995', models.FloatField(default=0.0, null=True)),
                ('R3997', models.FloatField(default=0.0, null=True)),
                ('R3999', models.FloatField(default=0.0, null=True)),
                ('R3981', models.FloatField(default=0.0, null=True)),
            ],
        ),
    ]
