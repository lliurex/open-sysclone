#!/bin/bash


mkdir  -p /mnt/test
#NAME_END="$(ifconfig  | grep inet | cut -d ":"  -f2 | head -1| cut -d " " -f1| cut -d "." -f4 | cut -d "." -f 4)"


for f in $(ls -1 /dev/sda*); do
        echo "*******************************"	
	echo "  changing files in with $f"
	echo "********************************"
	mount $f /mnt/test
	if [  -e /mnt/test/etc/hostname ] ; then
		echo
                echo
                echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hostame is restored in your image"
		cat /tmp/hostname.old
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp  /tmp/hostname.old  /mnt/test/etc/hostname 
	fi
	if [ -e /mnt/test/etc/hosts ] ; then
		echo
                echo
                echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hosts is restored in your image"
		cat /tmp/hostname.old
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp /tmp/hosts.old /mnt/test/etc/hosts
		echo
		echo
	fi
	echo "Testing machine ID"
	if [ -e /mnt/test/etc/machine-id  ]; then
		echo "Machine ID Old: $(cat /mnt/test/etc/machine-id)"
		chmod +w /mnt/test/etc/machine-id
		cp /dev/null /mnt/test/etc/machine-id
		echo "New MAchineID Valor: $(cat /mnt/test/etc/machine-id)"
	else
		echo "File not exists"
	fi
	umount -l /mnt/test
	sleep 5
done

exit 0
