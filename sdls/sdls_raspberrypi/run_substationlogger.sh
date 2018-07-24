#!/bin/sh

#creating necessary directories
if [ ! -d "/home/pi/substationlogger/logs" ]
then
	/bin/mkdir -p "/home/pi/substationlogger/logs"
fi

if [ ! -d "/home/pi/substationlogger/data_entries" ]
then
	/bin/mkdir -p "/home/pi/substationlogger/data_entries"
fi

while true
do
	curr_month=$(/bin/date '+%Y-%m')
	prev_month=$(/bin/date -d "$curr_month-15 last month" '+%Y-%m')
	curr_day=$(/bin/date '+%Y-%m-%d')

	#deleting all previous month logs
	/usr/bin/find /home/pi/substationlogger/logs/ ! -regex "\(.*log_$curr_month.*\)\|\(.*log_$prev_month.*\)" -type f -delete

	#deleting all previous month entries
	/usr/bin/find /home/pi/substationlogger/data_entries/ ! -regex "\(.*data_$curr_month.*\)\|\(.*data_$prev_month.*\)" -type f -delete

	# logging reboot info
	/bin/echo "$(/bin/date '+%d-%m-%Y %H:%M:%S') reboot" >>"/home/pi/substationlogger/logs/log_$curr_day.log"

	echo "compiling"
	# compiling if not compiled
	if [ ! -e "/home/pi/substationlogger/sample_upload" ]
	then
		/bin/echo "$(date '+%d-%m-%Y %H:%M:%S') compiling $(g++ /home/pi/substationlogger/substationlogger.cpp -o /home/pi/substationlogger/substationlogger `pkg-config --libs --cflags libmodbus` -lcurl)" >>"/home/pi/substationlogger/logs/log_$curr_day.log"
	fi

	#now running the code for a month unless some error comes
	while [ "$(/bin/date '+%Y-%m')" = "$curr_month" ]
	do
		#logging error
		curr_day=$(/bin/date '+%Y-%m-%d')
		/bin/echo "$(/bin/date '+%d-%m-%Y %H:%M:%S')" >>"/home/pi/substationlogger/logs/log_$curr_day.log"
		/home/pi/substationlogger/substationlogger >>"/home/pi/substationlogger/logs/log_$curr_day.log"
		/bin/sleep 1m
	done
done
