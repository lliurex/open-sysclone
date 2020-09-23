<?php
     
// Checking Boot from ISO
	$MenuEntryList=array();
$MenuEntry=new stdClass();
$MenuEntry->id="opensysclone";
$MenuEntry->label="OSC: Arranca ISO {{ NAME_ISO }}";
$MenuEntry->menuString='LABEL Arranca ISO{{ NAME_ISO }}
MENU LABEL OpenSysClone: Arranca desde la iso {{ NAME_ISO }}
KERNEL opensysclone-system/{{ VMLINUZ_PATH }}
APPEND initrd=opensysclone-system/{{ INITRD_PATH }} boot=casper netboot=nfs nfsroot={{ SRV_IP }}:{{EXPORT_PATH}} --';
array_push($MenuEntryList, $MenuEntry);

// "Return" MenuEntryListObject
$MenuEntryListObject=$MenuEntryList;
?>
