
import sys
import tempfile
import threading
import os
import glob
from jinja2 import Environment
from jinja2.loaders import FileSystemLoader
import shutil
import n4d.responses
import n4d.server.core as n4dcore


class OpenSysClone:

	# Templates variables
	TEMPLATES_PATH="/usr/share/n4d/templates/OpenSysClone/"
	SAVE_IMAGE_TPL="SaveImage.tpl"
	PXE_DESTINATION="/var/www/ipxeboot/pxemenu.d/70-OpenSysClone.php"
	PATH_FILE="/net/OpenSysClone/"
	USER_PATH_FILE="imagenes"
	NAME_FILE="autoname"
	HDD_DISK="sda1"
	FINAL_ACTION="poweroff"
	MIN_CLIENTS = "8"
	MAX_WAIT = "100"
	UDP_PATH="/net/OpenSysClone/prueba"
	INTERFACE="eth0"
	HOST_OPERATION="hostnamesaver.sh"
	TEST_DISK='no'
	EXPORT_NFS_PATH="/etc/exports.d/"
	EXPORT_NFS_NAME="opensysclone_nfs.exports"
	BASH_SCRIPTS=["testservermount","hostnamesaver","hostnamesaverip","hostnamerestore","hostnamechanger"]
	BASH_SCRIPTS_DESTINATION="/net/OpenSysClone/opensysclone-system/"
	

	def __init__(self):
		self.core=n4dcore.Core.get_core()
	#def init
	
	#def startup(self,options):
	#	if objects["VariablesManager"].get_variable('OPENSYSCLONE_SQUASHFS_PROTOCOL') is None:
	#		objects["VariablesManager"].init_variable('OPENSYSCLONE_SQUASHFS_PROTOCOL')

	#def startup

	def write_menu_pxe(self, aux_save_image_tpl=SAVE_IMAGE_TPL, aux_user_path_file = USER_PATH_FILE, aux_name_file = NAME_FILE , aux_hdd_disk = HDD_DISK ,aux_final_action=FINAL_ACTION,aux_testdisk=TEST_DISK, aux_host_operation=HOST_OPERATION):
			
		try:	

			# save_path, name_file, hdd_disk, final_action
			environment_variables = {}
			aux_path_file=self.PATH_FILE+aux_user_path_file
			
			# Get the values from free server
			#if  objects.has_key("VariablesManager"):
			#	environment_variables=objects["VariablesManager"].get_variable_list(["SRV_IP","OPENSYSCLONE_SQUASHFS_PROTOCOL"])
			INTERNAL_NETWORK_VARIABLES_DICT=self.core.get_variable_list(["SRV_IP","OPENSYSCLONE_SQUASHFS_PROTOCOL"])
			if ( INTERNAL_NETWORK_VARIABLES_DICT['status'] == 0 ):
				INTERNAL_NETWORK_VARIABLES=INTERNAL_NETWORK_VARIABLES_DICT['return']
			else:
				e='[OPENSYSCLONE](nfs_export_start)Internal variables are unavailable.'
				return n4d.responses.build_successful_call_response([False,str(e)])
	
			#Prepare PATH to TFTP or HTTP protocol
			protocolo=INTERNAL_NETWORK_VARIABLES['OPENSYSCLONE_SQUASHFS_PROTOCOL']
			
			if protocolo=="http":
				path_squashfs="ipxeboot/opensysclone-system"
			else:
				path_squashfs="opensysclone-system"

			if aux_testdisk=="yes":
				path_testdisk="-fsck-src-part-y"
			else:
				path_testdisk="-sfsck"
			
			environment_variables["PATH_SQUASHFS"]=path_squashfs
			environment_variables["PATH_FILE"]=aux_path_file
			environment_variables["NAME_FILE"]=aux_name_file
			environment_variables["HDD_DISK"]=aux_hdd_disk
			environment_variables["FINAL_ACTION"]=aux_final_action
			environment_variables["HOST_OPERATION"]=aux_host_operation
			environment_variables["OPENSYSCLONE_SQUASHFS_PROTOCOL"]=protocolo
			environment_variables["SRV_IP"]=INTERNAL_NETWORK_VARIABLES['SRV_IP']
			environment_variables["TEST_DISK"]=path_testdisk
			
			path_to_work=tempfile.mkdtemp()
			filename=path_to_work+"OpenSysClone.pxe"
			
			# Create temporal environment for jinja
			env = Environment(loader=FileSystemLoader(OpenSysClone.TEMPLATES_PATH))
			tmpl = env.get_template(aux_save_image_tpl)
			
			# Render the template with diferent values		
			textrendered=tmpl.render(environment_variables)

			#Create a temporal for nsswitch
			tmp,filename=tempfile.mkstemp()
			f = open(filename,'w')
			f.writelines(textrendered)
			f.close()

			# Using the ultimate chmod
			self.uchmod(filename,0o644)

			# Copy unitaria
			shutil.copy(filename,OpenSysClone.PXE_DESTINATION)
			
			
			#Clonezillas Bash Scripts
			for filename_bash in OpenSysClone.BASH_SCRIPTS:
				path_to_work=tempfile.mkdtemp()
				filename=path_to_work+filename_bash+".sh"

				# Create temporal environment for jinja
				env = Environment(loader=FileSystemLoader(OpenSysClone.TEMPLATES_PATH))
				aux_bash_script_tpl=filename_bash+".tpl"
				tmpl = env.get_template(aux_bash_script_tpl)

				# Render the template with diferent values		
				textrendered=tmpl.render(environment_variables)

				#Create a temporal for nsswitch
				tmp,filename=tempfile.mkstemp()
				f = open(filename,'w')
				f.writelines(textrendered)
				f.close()

				# Using the ultimate chmod
				self.uchmod(filename,0o644)
				
				# Copy unitaria
				filename_dest=OpenSysClone.BASH_SCRIPTS_DESTINATION+filename_bash+".sh"
				shutil.copy(filename,filename_dest)


			COMMENT_END = "PXE menu is prepared with protocol %s for SQUASHFS, your requirements have writed in this file %s" %(protocolo,OpenSysClone.PXE_DESTINATION)
			#return [True,str(COMMENT_END),[protocolo,OpenSysClone.PXE_DESTINATION]]
			return n4d.responses.build_successful_call_response([True,str(COMMENT_END),[protocolo,OpenSysClone.PXE_DESTINATION]])
		
		except Exception as e:
			print('EXCEPTION')
			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, str(e), 1)
	
	
	#def write_menu_pxe
	
	
	
	def del_menu_pxe(self, AUX_PXE_DESTINATION=PXE_DESTINATION):
		
		try:	
			# Remove obsolete file for PXE menu
			if os.path.isfile(AUX_PXE_DESTINATION):
				os.remove (AUX_PXE_DESTINATION)
				COMMENT_END = "Remove obsolete file %s for PXE menu" %(AUX_PXE_DESTINATION)
			
				#return [True, str(COMMENT_END),[AUX_PXE_DESTINATION]]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END),[AUX_PXE_DESTINATION]])
			else:
				COMMENT_END = "PXE file was delete before"
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			
		except Exception as e:

				#return [False,str(e)]
				return n4d.responses.build_failed_call_responses(False, str(e), 2)
	#def del_menu_pxe
	
	
	
	def nfs_export_start (self, AUX_USER_PATH_FILE=USER_PATH_FILE):
		try:
			AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
			# Get the values from free server
			#if  objects.has_key("VariablesManager"):
				#INTERNAL_NETWORK_VARIABLES=objects["VariablesManager"].get_variable_list(["INTERNAL_NETWORK","INTERNAL_MASK"])
			INTERNAL_NETWORK_VARIABLES_DICT=self.core.get_variable_list(["INTERNAL_NETWORK","INTERNAL_MASK"])
			if ( INTERNAL_NETWORK_VARIABLES_DICT['status'] == 0 ):
				INTERNAL_NETWORK_VARIABLES=INTERNAL_NETWORK_VARIABLES_DICT['return']
			else:
				e='[OPENSYSCLONE](nfs_export_start)Internal variables are unavailable.'
				return n4d.responses.build_successful_call_response([False,str(e)])
			#Export file to write or read OpenSysClone in the server to network range
			#With new file arguments
			if os.path.dirname(AUX_PATH_FILE):
				result = os.system('mkdir -p %s'%self.EXPORT_NFS_PATH)
				try:
					fich = open(self.EXPORT_NFS_PATH+"/"+self.EXPORT_NFS_NAME,"w")
					fich.write(str(AUX_PATH_FILE)+"\t"+str(INTERNAL_NETWORK_VARIABLES["INTERNAL_NETWORK"])+"/"+str(INTERNAL_NETWORK_VARIABLES["INTERNAL_MASK"])+"(rw,insecure,no_root_squash,async,no_subtree_check)\n")
					fich.close()
				except Exception as e:
					#return [False,'Export failed: '+str(e)]
					return n4d.responses.build_failed_call_responses(False, 'Export failed: '+str(e), 2)
				#cmd='exportfs -o rw,insecure,no_root_squash,async,no_subtree_check  %s/%s:%s'%(INTERNAL_NETWORK_VARIABLES["INTERNAL_NETWORK"],INTERNAL_NETWORK_VARIABLES["INTERNAL_MASK"],AUX_PATH_FILE)
				#cmd='service nfs-kernel-server restart'
				#Comprueba que el servicoo de NFS esta arrancado por defecto
				test=os.system("pidof nfsd")
				if test!=0 :
					cmd2='service nfs-kernel-server restart'
					os.system(cmd2)
				cmd='exportfs -ra'
				#print cmd
				os.system(cmd)
				COMMENT_END = "NFS is sharing %s to my internal network %s/%s" %(AUX_PATH_FILE,INTERNAL_NETWORK_VARIABLES["INTERNAL_NETWORK"],INTERNAL_NETWORK_VARIABLES["INTERNAL_MASK"])
				#return [True, str(COMMENT_END)]
				print(str(COMMENT_END))
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			else:
				#return [False,str(e)]
				return n4d.responses.build_successful_call_response([False,str(e)])

				
		except Exception as e:
			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, 'Export failed: '+str(e), 2)
	#def nfs_export
	
	
	
	def nfs_export_stop (self,AUX_USER_PATH_FILE=USER_PATH_FILE):
	
			#Restart nfs service to restart default parameters and stop extra parameters
		
		#try:	
		#	os.system('service nfs-kernel-server restart')
		#	COMMENT_END = "The NFS system is restarted with defaults parameters and suprimed OpeSysClone shared parameters"
		#	return [True, str(COMMENT_END)]
			
		#except Exception as e:

		#	return [False,str(e)]	
		try:
			AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
			
			# Get the values from free server
			#if  objects.has_key("VariablesManager"):
			#	INTERNAL_NETWORK_VARIABLES=objects["VariablesManager"].get_variable_list(["INTERNAL_NETWORK","INTERNAL_MASK"])
			INTERNAL_NETWORK_VARIABLES_DICT=self.core.get_variable_list(["INTERNAL_NETWORK","INTERNAL_MASK"])
			if ( INTERNAL_NETWORK_VARIABLES_DICT['status'] == 0 ):
				INTERNAL_NETWORK_VARIABLES=INTERNAL_NETWORK_VARIABLES_DICT['return']
			else:
				e='[OPENSYSCLONE](nfs_export_start)Internal variables are unavailable.'
				return n4d.responses.build_successful_call_response([False,str(e)])
				
			
			#Cancel the export file to write or read OpenSysClone in the server to network range
			#Deleting file with arguments and restarting the service
			
			if os.path.dirname(AUX_PATH_FILE):
				result = os.system("rm -f %s"%self.EXPORT_NFS_PATH+"/"+self.EXPORT_NFS_NAME)
				os.system('service nfs-kernel-server restart')
				#os.system('exportfs -u  %s/%s:%s'%(INTERNAL_NETWORK_VARIABLES["INTERNAL_NETWORK"],INTERNAL_NETWORK_VARIABLES["INTERNAL_MASK"],AUX_PATH_FILE))
				COMMENT_END = "NFS is NOT SHARING %s to my internal network %s/%s" %(AUX_PATH_FILE,INTERNAL_NETWORK_VARIABLES["INTERNAL_NETWORK"],INTERNAL_NETWORK_VARIABLES["INTERNAL_MASK"])
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			else:
				#return [False,str(e)]
				return n4d.responses.build_successful_call_response([False, str(COMMENT_END)])
				
		except Exception as e:

			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, 'Export failed: '+str(e), 3)
		
		
	#def nfs_export_stop
	
	
	def uchmod(self,file,mode):
		
		try:
		#Method to change file attributes
		
			prevmask = os.umask(0)
			os.chmod(file,mode)
			os.umask(prevmask)
			return n4d.responses.build_successful_call_response([True])
			
		except Exception as e:

			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, 'Export failed: '+str(e), 4)
	#def uchmod
	
	
	def aux_send_multicast_file (self, AUX_USER_PATH_FILE=USER_PATH_FILE, AUX_NAME_FILE=NAME_FILE, AUX_MIN_CLIENTS=MIN_CLIENTS, AUX_MAX_WAIT=MAX_WAIT,AUX_INTERFACE=INTERFACE,AUX_UDP_PATH=UDP_PATH):
	
			try:
				#Method to restart nfs service to restart default parameters and stop extra parameters
				AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
				os.system('killall udp-sender')
				#Inicializo el puerto de UDP que debe ser 2232 para la primera particion y +2 para cada una de las siguientes
				AUX_UDP_PORT=2232
				INSTRUCTION = ''
				
				#Obtengo las particiones a clonar y las meto en una lista
				tmp=set()
				
				for item in glob.glob(AUX_UDP_PATH+"/*.gz.*"):
					#Para obtener las particiones he de eliminar primero la primera parte del path puesto que puede llevar puntos y luego no haria bien el split
					item=item.replace(AUX_UDP_PATH+"/","")
					#Corto por el primer punto y me quedo con la primera parte
					item=item.split(".")[0]
					#Elimino las cadenas iguales
					tmp.add(item)
				
				AUX_PARTITIONS_LIST=sorted(tmp)
				
				print(AUX_PARTITIONS_LIST)
				
				#Recorro la lista de particiones y creo la instruccion
				
				for PARTITION in AUX_PARTITIONS_LIST :
					INSTRUCTION += 'cat %s/%s*.gz.* | udp-sender --full-duplex --retries-until-drop 100 --min-clients %s --max-wait %s --interface %s --nokbd --mcast-all-addr 224.0.0.1 --portbase %s --ttl 1;'%((AUX_UDP_PATH),(PARTITION),(AUX_MIN_CLIENTS),(AUX_MAX_WAIT),(AUX_INTERFACE),(AUX_UDP_PORT))
					AUX_UDP_PORT=AUX_UDP_PORT+2
				
				os.system ('%s'%INSTRUCTION)
				COMMENT_END = "Instruction in server for MULTICAST is: %s" %(INSTRUCTION)
			
				#print COMMENT_END
			
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			
			except Exception as e:

				#return [False,str(e)]
				return n4d.responses.build_failed_call_responses(False, 'aux_send_multicast_file: '+str(e), 5)
			
			#os.system('cat %(AUX_UDP_PATH)s/*.gz.* | udp-sender --full-duplex --min-clients %(AUX_MIN_CLIENTS)s --max-wait %(AUX_MAX_WAIT)s --interface %(AUX_INTERFACE)s --nokbd --mcast-all-addr 224.0.0.1 --portbase %(AUX_UDP_PORT)s --ttl 1' % locals ())
			
	#def aux_send_multicast_file
	
	
	def send_multicast_file (self, AUX_USER_PATH_FILE=USER_PATH_FILE, AUX_NAME_FILE=NAME_FILE, AUX_MIN_CLIENTS=MIN_CLIENTS, AUX_MAX_WAIT=MAX_WAIT):
		
			#Method to execute multiprocess
			
			try:
				AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
				# Get the values from free server
				#if  objects.has_key("VariablesManager"):
				#	INTERFACE=objects["VariablesManager"].get_variable("INTERNAL_INTERFACE")
				INTERFACE_DICT=self.core.get_variable("INTERNAL_INTERFACE")
				if ( INTERFACE_DICT['status'] == 0 ):
					INTERFACE=INTERFACE_DICT['return']
				else:
					e='[OPENSYSCLONE](nfs_export_start)Internal variables are unavailable.'
					return n4d.responses.build_successful_call_response([False,str(e)])				
			
				#Get the UDP path to export in multicast mode
				UDP_PATH=AUX_PATH_FILE+"/"+AUX_NAME_FILE
				
				if os.path.exists(UDP_PATH):
				
					COMMENT_END = "UDP is in multicast mode for my internal network interface %s" %(INTERFACE)
					
					
					#Instructions to execute multiprocess
					t = threading.Thread(target=self.aux_send_multicast_file,args=(AUX_PATH_FILE,AUX_NAME_FILE,AUX_MIN_CLIENTS,AUX_MAX_WAIT,INTERFACE,UDP_PATH))
					t.daemon=True
					t.start()
					#return [True, str(COMMENT_END)]
					return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
				else:
					COMMENT_END = "Your image don't exists in this directory"
					#return [False,str(COMMENT_END)]
					return n4d.responses.build_successful_call_response([False,str(COMMENT_END)])
					
			except Exception as e:

				#return [False,str(e)]
				return n4d.responses.build_failed_call_responses(False, 'send_multicast_file: '+str(e), 6)

			
	#def send_multicast_file
	
	
	def list_img (self, AUX_USER_PATH_FILE=USER_PATH_FILE):
		
		#Method to list our ISOS in Server
		
		try:
			AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
			LIST_DIR=os.listdir(AUX_PATH_FILE)
		
			#return [True,LIST_DIR]
			return n4d.responses.build_successful_call_response([True,LIST_DIR])

		except Exception as e:

			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, 'list_img: '+str(e), 7)



	def check_path (self, AUX_USER_PATH_FILE=USER_PATH_FILE):
		
		#Method to make our dir to save images
		
		try:
			AUX_PATH_FILE=self.PATH_FILE+AUX_USER_PATH_FILE
			
			if os.path.exists(AUX_PATH_FILE):
				COMMENT_END = "Path file exists, do nothing"
				#OLD N4D RESPONSE
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			else:
				os.makedirs(AUX_PATH_FILE,0o777)
				os.chmod(AUX_PATH_FILE,0o777)
				COMMENT_END = "Path file is created now %s" %(AUX_PATH_FILE)
				#OLD N4D RESPONSE
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])


		except Exception as e:
			#OLD N4D RESPONSE
			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, str(e), 9)
				
				
	def del_image (self, DIR_FILE_DELETE):
		
		#Method to delete our save images
		
		try:
			AUX1_PATH_FILE=self.PATH_FILE+self.USER_PATH_FILE
			AUX_PATH_FILE=AUX1_PATH_FILE+"/"+DIR_FILE_DELETE
			
			if os.path.exists(AUX_PATH_FILE):
				os.system('rm -R  %s'%(AUX_PATH_FILE))
				COMMENT_END = "Path file is deleted %s" %(AUX_PATH_FILE)
				#return [True, str(COMMENT_END)]
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])
			else:
				COMMENT_END = "Path file isn't exists %s" %(AUX_PATH_FILE)
				#return [True, str(COMMENT_END)]	
				return n4d.responses.build_successful_call_response([True, str(COMMENT_END)])		

		except Exception as e:

			#return [False,str(e)]
			return n4d.responses.build_failed_call_responses(False, str(e), 10)
				
	#def list_img
	
	
	


	 
