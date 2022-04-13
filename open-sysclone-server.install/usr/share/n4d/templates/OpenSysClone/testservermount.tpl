#!/bin/bash

if grep /home/partimag /proc/mounts > /dev/null 2>&1; then 
	echo
	echo @@@@@@@@@@@@@@@@@@@@@@@@@@@
	echo
	echo "Server unit is mounted in your machine, now we save the image in /net/OpenSysClone/imagenes"
	echo
	echo @@@@@@@@@@@@@@@@@@@@@@@@@@@
else
	echo
	echo @@@@@@@@@@@@@@@@@@@@@@@@@@@
	echo
	echo "Server is not Mounted, sorry we can't make your image in your server"
	echo "Please review your SERVER configuration and retry it again."
	echo "If this problem persist please contact with LliureX Team in Mestre a casa Forum"
	echo
	echo @@@@@@@@@@@@@@@@@@@@@@@@@@@
	echo
	echo
	echo
	read -n1 -r -p "Press any key to power off.........." key
	if [ "$key" = ' ' ]; then
		echo
	fi
	echo "--- Goodbye ---"
	echo "The system is shutting down"
	init 0
fi
