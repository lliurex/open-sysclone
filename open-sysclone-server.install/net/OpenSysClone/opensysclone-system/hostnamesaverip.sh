#!/bin/bash
echo
echo
echo @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
echo "Your files /etc/hosts & /etc/hostname are generated"
NAME_END="$(ifconfig  | grep inet | cut -d ":"  -f2 | head -1| cut -d " " -f1| cut -d "." -f4)"
echo "client$NAME_END" > /tmp/hostname.old

cat <<EOF > /tmp/hosts.old
127.0.0.1       localhost
127.0.1.1       _@_CLIENT_@_

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
EOF

sed -e "s%_@_CLIENT_@_%client$NAME_END%g" -i /tmp/hosts.old
echo
echo
sleep 5
exit 0
