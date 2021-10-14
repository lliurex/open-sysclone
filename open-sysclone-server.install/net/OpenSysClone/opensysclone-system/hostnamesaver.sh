#!/bin/bash


mkdir  -p /mnt/test


for f in $(ls -1 /dev/sda*); do 
	echo "Working with $f"
	mount $f /mnt/test
	if [  -e /mnt/test/etc/hostname ] ; then
		echo
		echo
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hostname is saved in /tmp/hostname.old"
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp  /mnt/test/etc/hostname  /tmp/hostname.old
	fi
	if [ -e /mnt/test/etc/hosts ] ; then
		echo
		echo
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		echo "Hosts is saved in /tmp/hosts.old"
		echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		cp /mnt/test/etc/hosts	/tmp/hosts.old
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
done

umount -l /mnt/test
sleep 5 

# If not exits then generated it automagically (or almost)
if [ ! -e /tmp/hostname.old ] ; then

	NAME_END="$(ifconfig  | grep inet | cut -d ":"  -f2 | head -1| awk -F " " '{print $2}' | cut -d "." -f 4)"
	echo "client$NAME_END" > /tmp/hostname.old

	cat <<EOF > /tmp/hosts.old
127.0.0.1	localhost
127.0.1.1	_@_CLIENT_@_

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
EOF

	sed -e "s%_@_CLIENT_@_%client$NAME_END%g" -i /tmp/hosts.old

fi



exit 0
