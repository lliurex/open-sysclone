#!/usr/bin/env python
import os
import sys
from jinja2 import Environment
from jinja2.loaders import FileSystemLoader
import tempfile
import fnmatch
	
class OpenSysCloneExport: 
	
	def __init__(self):
		#self.tftppath = '/var/lib/tftpboot/ltsp/OpenSysClone'
		#tftppath exclusive for OpenSysClone
		self.tftppath = '/net/OpenSysClone/opensysclone-system/OpenSysClone'		
		self.export_options = 'ro,insecure,no_root_squash,async,no_subtree_check'
		self.templates_path="/usr/share/n4d/templates/OpenSysClone/"
		self.pxe_path = "/var/www/ipxeboot/pxemenu.d/70-OpenSysClone.php"
		self.export_nfs_iso_path = "/etc/exports.d/"
		#Obsolete name, at this time the file dissapear with PXE line is erased
		#self.export_nfs_iso_name = "opensysclone_iso.exports"
		self.export_nfs_iso_name = "opensysclone_nfs.exports"
	#def init

	def startup(self,options):
		pass
	#def startup

	def sanity_check(self):
		if not os.path.exists(self.tftppath):
			os.mkdir(self.tftppath)
	#def sanity_check

	def mount_iso(self,iso_path):
		if os.path.exists(iso_path) :
			self.sanity_check()
			result = os.system('umount "%s"'%(self.tftppath))
			result = os.system('mount -o loop "%s" "%s"'%(iso_path,self.tftppath))
			return [True,'Mounted']
			if result == 0 or result == 32 or result == 8192:
				return [True,'Mounted']
			else:
				return [False,'mount_failed']
		return [False,'path_failed']
	#def mount_iso

	def add_entry_exportfs(self):
		
		inetwork=objects["VariablesManager"].get_variable("INTERNAL_NETWORK")
		imask=objects["VariablesManager"].get_variable("INTERNAL_MASK")
		if inetwork == None or imask == None:
			return False
		
		# Now is time for .exports file
		result = os.system('mkdir -p %s'%self.export_nfs_iso_path)
		try:
			fich = open(self.export_nfs_iso_path+"/"+self.export_nfs_iso_name,"w")
			fich.write(self.tftppath+"\t"+inetwork+"/"+str(imask)+"("+str(self.export_options)+")\n")
			fich.close()
			os.system('exportfs -ra')
		except Exception as e:
			return [False,'Export failed: '+str(e)]
		
		if result == 0 :
			return [True,'Exported']
		else:
			return [False,'export_failed']
	#def add_entry_exportfs

	def del_entry_exportfs(self):
		# I am not sure about this mechanism
		result = os.system('rm -f "%s"'%self.export_nfs_iso_path+"/"+self.export_nfs_iso_name)
		result2 =os.system('service nfs-kernel-server restart')
		if result == 0 :
			return [True,'Delete export entry']
		else:
			return [False,'delete_failed']
	#def del_entry_exportfs
	
	
	def find(self,pattern, path):
	
	#Function to find any file in directory, and returns array with your pattern files
		
		valor = [ ]
		for root, dirs, files in os.walk(path):
			for name in files:
				if fnmatch.fnmatch(name, pattern):
					#valor.append(os.path.join(root, name))
					valor.append(name)
		return valor

	def write_pxe(self,name):
		try:	
			# save_path, name_file, hdd_disk, final_action
			environment_variables = {}
			
			# Get the values from free server
			environment_variables["SRV_IP"] = objects["VariablesManager"].get_variable("SRV_IP")
			environment_variables["NAME_ISO"] = name
			environment_variables["EXPORT_PATH"]= self.tftppath
			environment_variables["TFTP_PATH"] = os.path.join(self.tftppath,'casper','vmlinuz')
			environment_variables["VMLINUZ_PATH"]= os.path.join('OpenSysClone','casper','vmlinuz')
			#os.system('ls "%s" | grep initrd'%(self.tftppath+"/"+"casper"))
			#buscamos el initrd dentro del directorio tenga la extension que tenga
			
			INITRD = self.find('initrd*z', '%s'%(self.tftppath))
			print ("El initrd encontrado es: %s"%INITRD)
			
			#POR DEFECTO EL INITRD QUE SE VA A USAR ES EL PRIMERO DE LA LIST ENCONTRADO
			environment_variables["INITRD_PATH"] = os.path.join('OpenSysClone','casper',INITRD[ 0 ])
			
			# Create temporal environment for jinja
			env = Environment(loader=FileSystemLoader(self.templates_path))
			tmpl = env.get_template('export-iso.tpl')
			
			# Render the template with diferent values		
			textrendered=tmpl.render(environment_variables)
			
			#Create a temporal for nsswitch
			tmp,filename=tempfile.mkstemp()
			f = open(filename,'w')
			f.writelines(textrendered)
			f.close()
			
			# Using the ultimate chmod
			self.uchmod(filename,0644)
			
			# Copy unitaria
			shutil.copy(filename,self.pxe_path)
			return [True,str(self.pxe_path)]
		
		except Exception as e:

			return [False,str(e)]
	#def write_pxe

	def uchmod(self,file,mode):
		
		try:
		#Method to change file attributes
		
			prevmask = os.umask(0)
			os.chmod(file,mode)
			os.umask(prevmask)
			
		except Exception as e:

			return [False,str(e)]	
	#def uchmod

	def export_iso(self,iso_path,name):
		result = self.mount_iso(iso_path)
		if not result[0]:
			return [False,result[1]]
		result = self.add_entry_exportfs()
		if not result[0]:
			return [False,result[1]]
		result = self.write_pxe(name)
		if not result[0]:
			return [False,result[1]]
		return [True,'Export iso correctly']
	
#class OpenCloneSysExport

