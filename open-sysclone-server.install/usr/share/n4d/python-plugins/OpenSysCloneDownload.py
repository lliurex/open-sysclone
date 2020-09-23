#!/usr/bin/env python
import os
import sys
import urllib
from sgmllib import SGMLParser

class OpenSysCloneDownload(SGMLParser):

        def __init__(self):
                self.pathiso="/net/OpenSysClone/"

        def reset(self):
		SGMLParser.reset(self)
		self.urls = []
		
	def start_a(self, attrs):
		href = [v for k, v in attrs if k=='href']
		self.urls.extend(href)
		
        def downloadIso(self,name,path,url):
                
                try:
                        
                except: Exception as e:
                        return str (e);
                
                pass:
                
        def deleteIso(self):
                pass:
            
if __name__ == "__main__":
	usock = urllib.urlopen("http://releases.lliurex.net/")
	
	parser = URLLister()
	parser.feed(usock.read())
	
	parser.close()
	usock.close()
	
	for url in parser.urls: 
		url1=glob.glob(url)
		print url 
#		for url1 in parser.urls:
#		        print url1



