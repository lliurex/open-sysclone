<?php

// Adding in PXE Menu OpenSysClone Save Image from HDD local in server
$MenuEntryList=array();
$MenuEntry=new stdClass();
$MenuEntry->id="opensysclone";
$MenuEntry->label="OSC: Crear en el server la imagen {{ NAME_FILE }}";
$MenuEntry->menuString='LABEL Grabar Imagen {{ NAME_FILE }}
MENU LABEL OpenSysClone Grabar Imagen {{ NAME_FILE }}
KERNEL opensysclone-system/vmlinuz
APPEND initrd=opensysclone-system/initrd.img boot=live union=overlay config noswap nolocales edd=on nomodeset noprompt nosplash ocs_prerun="ip addr | grep inet | grep 10." ocs_prerun2="mount -t nfs {{ SRV_IP }}:{{ PATH_FILE }} /home/partimag" ocs_prerun3="busybox tftp -g -r /opensysclone-system/testservermount.sh -l /tmp/testservermount.sh {{ SRV_IP }}" ocs_prerun4="bash /tmp/testservermount.sh" ocs_prerun5="sleep 5" ocs_live_run="ocs-sr {{ TEST_DISK }} -j2 -q2 -z1p -scs -i 4096 -p {{ FINAL_ACTION }} savedisk {{ NAME_FILE }} {{ HDD_DISK }}" ocs_live_extra_param="" keyboard-layouts=NONE ocs_live_batch="no" ocs_lang="es_ES.UTF-8" vga=788 ethdevice-timeout=60 fetch={{ OPENSYSCLONE_SQUASHFS_PROTOCOL }}://{{ SRV_IP }}/{{ PATH_SQUASHFS }}/filesystem.squashfs';
array_push($MenuEntryList, $MenuEntry);

// "Return" MenuEntryListObject
$MenuEntryListObject=$MenuEntryList;



?>
