#!/bin/bash


mkdir  -p /mnt/test
NAME_END="$(ifconfig  | grep inet | cut -d ":"  -f2 | head -1| cut -d " " -f1| cut -d "." -f4)"


for f in $(ls -1 /dev/sda*); do 
	echo "Working with $f"
	mount $f /mnt/test
	if [ ! -e /mnt/test/etc/hostname ] ; then
		echo "client$NAME_END"  > /mnt/test/etc/hostname 
	fi
done

exit 0
