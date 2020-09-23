#!/bin/bash


mkdir  -p /mnt/test
#NAME_END="$(ifconfig  | grep inet | cut -d ":"  -f2 | head -1| cut -d " " -f1| cut -d "." -f4)"


for f in $(ls -1 /dev/sda*); do 
	echo "Working with $f"
	mount $f /mnt/test
	if [  -e /mnt/test/etc/hostname ] ; then
		echo
                echo
                echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hostame is restored in your image"
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp  /tmp/hostname.old  /mnt/test/etc/hostname 
	fi
	if [ -e /mnt/test/etc/hosts ] ; then
		echo
                echo
                echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hosts is restored in your image"
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp /tmp/hosts.old /mnt/test/etc/hosts
		echo
		echo
		sleep 5
	fi
	umount -l /mnt/test 
done

exit 0
