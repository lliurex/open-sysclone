<?php

// Adding in PXE Menu OpenSysClone Restore Image in HDD local from server, multicast mode

$MenuEntryList=array();
$MenuEntry=new stdClass();
$MenuEntry->id="opensysclone";
$MenuEntry->label="OSC: Restaurar MltCast {{ NAME_FILE }}";
$MenuEntry->menuString='LABEL Restaurar MltCast  {{ NAME_FILE }}
MENU LABEL OpenSysClone: Restaurar Imagen Multicast {{ NAME_FILE }}
KERNEL opensysclone-system/vmlinuz
APPEND initrd=opensysclone-system/initrd.img boot=live union=overlay config noswap noprompt vga=788 ethdevice-timeout=60 fetch={{ OPENSYSCLONE_SQUASHFS_PROTOCOL }}://{{ SRV_IP }}/{{ PATH_SQUASHFS }}/filesystem.squashfs ocs_prerun="ip addr | grep inet | grep 10." ocs_prerun2="mount -t nfs {{ SRV_IP }}:{{ PATH_FILE }} /home/partimag" ocs_prerun3="busybox tftp -g -r /opensysclone-system/testservermount.sh -l /tmp/testservermount.sh {{ SRV_IP }}" ocs_prerun4="bash /tmp/testservermount.sh" ocs_prerun5="sleep 5" ocs_prerun6="busybox tftp -g -r /opensysclone-system/{{ HOST_OPERATION }} -l /tmp/ejecuta.sh {{ SRV_IP }}" ocs_prerun7="bash /tmp/ejecuta.sh" ocs_postrun="echo @@@@@@@@@@@@@@@@@@@@@@@; sleep 3; echo RESTORING_HOSTNAME_FILES ; echo @@@@@@@@@@@@@@@@"  ocs_postrun2="busybox tftp -g -r /opensysclone-system/hostnamerestore.sh -l /tmp/ejecuta.sh {{ SRV_IP }}" ocs_postrun3="bash /tmp/ejecuta.sh ; {{  FINAL_ACTION }}" ocs_live_run="ocs-sr  -g auto -e1 auto -e2  -r -k1 -j2 -x -p command --mcast-port 2232 multicast_restoredisk {{ NAME_FILE }} {{ HDD_DISK }}" keyboard-layouts=NONE ocs_live_batch="no" locales="es_ES.UTF-8" nolocales';
array_push($MenuEntryList, $MenuEntry);

// "Return" MenuEntryListObject
$MenuEntryListObject=$MenuEntryList;



?>
