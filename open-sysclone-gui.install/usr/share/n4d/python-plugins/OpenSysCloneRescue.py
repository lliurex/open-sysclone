import sys
import tempfile
import threading
import os

import syslog

import subprocess as s
import re
import os.path


class OpenSysCloneRescue:

	# Templates variables
	RESCUE_PATH="/net/OpenSysClone/opensysclone-system/pxe-rescue"
	FLOPPY_FILE="ipxe.dsk"
	USB_FILE="ipxe.usb"
	CDROM_FILE="ipxe.iso"
	DEV_DIRECTORY="/dev"
	

	def __init__(self):
		self.excludepaht = ['/','/boot','/home']
	#def init


	def get_devices(self):
		cmd = s.Popen(["lsblk","-o","RM,TYPE,NAME,SIZE,MODEL"],stdout=s.PIPE)
		list_output = cmd.stdout.readlines()
		list_output.pop(0)
		result = []
		for item in list_output:
			aux = item.strip()
			
			aux_splited = re.match(r'\s*(\S*)\s*(\S*)\s*(\S*)\s*(\S*)\s*(.*)',aux)
			volume = {}
			if aux_splited.group(2) == 'disk':
				volume['name'] = aux_splited.group(3)
				volume['size'] = aux_splited.group(4)
				volume['model'] = aux_splited.group(5)
				cmd1 = s.Popen(["lsblk",os.path.join('/dev',volume['name']),"-o","MOUNTPOINT"],stdout=s.PIPE)
				mountpointsdevice = map(str.strip,cmd1.stdout.readlines())
				found = False
				for point in self.excludepaht:
					if point in mountpointsdevice:
						found = True
				if not found:
					result.append(volume)
		return {'status':True,'msg':result}


	def rescuepxe_floppy (self):
		
		#Method to generate floppy rescue boot PXE
		
		try:
			#File to make floppy disk
			BOOT_FILE=OpenSysCloneRescue.RESCUE_PATH+"/"+OpenSysCloneRescue.FLOPPY_FILE
			
			if os.path.dirname(BOOT_FILE):
				syslog.syslog(syslog.LOG_ERR, "DIRECTORY FOR THE FILE %s" %(BOOT_FILE))
				os.system('cat %s > /dev/fd0' %(BOOT_FILE))
				COMMENT_END = "Waiting while FLOPPY Disk boot is creating"
				return [True, str(COMMENT_END)]
			else:
				COMMENT_END = "File to format %s floppy doesn't exists" %(BOOT_FILE)
				return [False,str(COMMENT_END)]
				
		except Exception as e:

			return [False,str(e)]
	
	#def rescuepxe_floppy
	
	
	def rescuepxe_usb (self,DEVICE):
		
		#Method to generate USB rescue boot PXE
		try:
			#File to make USB disk
			BOOT_FILE=OpenSysCloneRescue.RESCUE_PATH+"/"+OpenSysCloneRescue.USB_FILE
			DEV_FILE=OpenSysCloneRescue.DEV_DIRECTORY+"/"+DEVICE
			
			if os.path.dirname(DEV_FILE):
				if os.path.dirname(BOOT_FILE):
					syslog.syslog(syslog.LOG_ERR, "DIRECTORY FOR THE FILE %s and USB directory is %s" %(BOOT_FILE,DEV_FILE))
					os.system('dd if=%s of=%s' %(BOOT_FILE,DEV_FILE))
					os.system ('sync')
					COMMENT_END = "Your USB Disk boot is created"
					return [True, str(COMMENT_END)]
				else:
					COMMENT_END = "File to format %s USB doesn't exists" %(BOOT_FILE)
					return [False,str(COMMENT_END)]
			else:
					COMMENT_END = "USB directory in %s doesn't exists" %(DEV_FILE)
					return [False,str(COMMENT_END)]
					
		except Exception as e:

			return [False,str(e)]
	
	#def rescuepxe_usb
	
	
	
	def rescuepxe_cdrom(self,DEVICE):
		
		#Method to generate CDROM rescue boot PXE
		
		try:
			#File to make CDROM disk
			BOOT_FILE=OpenSysCloneRescue.RESCUE_PATH+"/"+OpenSysCloneRescue.CDROM_FILE
			DEV_FILE=OpenSysCloneRescue.DEV_DIRECTORY+"/"+DEVICE
			
			if os.path.dirname(DEV_FILE):
				if os.path.dirname(BOOT_FILE):
					syslog.syslog(syslog.LOG_ERR, "DIRECTORY FOR THE FILE %s and CDROM directory is %s" %(BOOT_FILE,DEV_FILE))
					os.system('cdrecord dev=%s -v -eject -speed=4 %s' %(DEV_FILE,BOOT_FILE))
					COMMENT_END = "Waiting while CDROM Disk boot is creating"
					return [True, str(COMMENT_END)]
				else:
					COMMENT_END = "File to format %s CDROM doesn't exists" %(BOOT_FILE)
					return [False,str(COMMENT_END)]
			else:
					COMMENT_END = "CDROM directory in %s doesn't exists" %(DEV_FILE)
					return [False,str(COMMENT_END)]
					
		except Exception as e:

			return [False,str(e)]
	
	#def rescuepxe_cdrom
	
	
	def rescuepxe_cdrom_test(self,DEVICE):
		
		#Method to generate CDROM rescue boot PXE
		
		try:
			#File to make CDROM disk
			DEV_FILE=OpenSysCloneRescue.DEV_DIRECTORY+"/"+DEVICE
			
			if os.path.dirname(DEV_FILE):
				#Obtengo mediante bash si el disco es grabable o no
				#instruction="udisks --show-info /dev/sr0 | grep media | grep optical |cut -d ':' -f 2| sed 's%[[:blank:]]*%%g'"
				instruction="udisks --show-info /dev/sr0 | grep media | grep optical |cut -d ':' -f 2"
				output=subprocess.check_output(instruction, shell=True)
				x='cd_r'
				if (x in output):
					COMMENT_END = "It's a CD-Rom"
					return [True, str(COMMENT_END)]
				else:
					COMMENT_END = "Is not a CD-Rom in device"
					return [False, str(COMMENT_END)]
					
		except Exception as e:

			return [False,str(e)]
	
	#def rescuepxe_cdrom_blank_test
	
	
	
	
	
	
	
	def rescuepxe_cdrom_blank_test(self,DEVICE):
		
		#Method to generate CDROM rescue boot PXE
		
		try:
			#File to make CDROM disk
			DEV_FILE=OpenSysCloneRescue.DEV_DIRECTORY+"/"+DEVICE
			
			if os.path.dirname(DEV_FILE):
				instruction="udisks --show-info /dev/sr0 | grep blank | cut -d ':' -f 2"
				output=subprocess.check_output(instruction, shell=True)
				x='1'
				if (x in output):
					COMMENT_END = "CD-Rom is blank"
					return [True, str(COMMENT_END)]
				else:
					COMMENT_END = "CD-Rom is full"
					return [False, str(COMMENT_END)]
					
		except Exception as e:

			return [False,str(e)]
	
	#def rescuepxe_cdrom_blank_test