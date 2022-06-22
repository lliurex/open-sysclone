<?php

// Adding in PXE Menu OpenSysClone Restore Image in HDD local from server, unicast mode

$MenuEntryList=array();
$MenuEntry=new stdClass();
$MenuEntry->id="opensysclone";
$MenuEntry->label="OSC: Restaurar Imagen {{ NAME_FILE }}";
$MenuEntry->menuString='LABEL Restaurar Imagen {{ NAME_FILE }}
MENU LABEL OpenSysClone: Restaurar Imagen {{ NAME_FILE }}
KERNEL opensysclone-system/vmlinuz
APPEND initrd=opensysclone-system/initrd.img boot=live union=overlay config noswap noprompt vga=788 ethdevice-timeout=60 fetch={{ OPENSYSCLONE_SQUASHFS_PROTOCOL }}://{{ SRV_IP }}/{{ PATH_SQUASHFS }}/filesystem.squashfs ocs_prerun1="ip addr | grep inet | grep 10." ocs_prerun2="mount -t nfs {{ SRV_IP }}:{{ PATH_FILE }} /home/partimag" ocs_prerun3="busybox tftp -g -r /opensysclone-system/testservermount.sh -l /tmp/testservermount.sh {{ SRV_IP }}" ocs_prerun4="bash /tmp/testservermount.sh" ocs_prerun5="sleep 5" ocs_prerun6="busybox tftp -g -r /opensysclone-system/{{ HOST_OPERATION }} -l /tmp/ejecuta.sh {{ SRV_IP }}" ocs_prerun7="bash /tmp/ejecuta.sh" ocs_live_run="ocs-sr -j2 -g auto -e1 auto -e2  -r -k1 -p command restoredisk {{ NAME_FILE }} {{ HDD_DISK }}" ocs_postrun1="busybox tftp -g -r /opensysclone-system/hostnamerestore.sh -l /tmp/ejecuta.sh {{ SRV_IP }}" ocs_postrun2="bash /tmp/ejecuta.sh ; {{  FINAL_ACTION }}" keyboard-layouts=NONE ocs_live_batch="no" locales="es_ES.UTF-8" nolocales';
array_push($MenuEntryList, $MenuEntry);

// "Return" MenuEntryListObject
$MenuEntryListObject=$MenuEntryList;

?>
