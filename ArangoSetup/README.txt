To setup Arango Database for Kimchi

1> Install Arangodb 2.5.0
https://www.arangodb.com/repositories/Windows7/x86_64/ArangoDB-2.5.0-win64.exe 

2> (optionally) Update configuration and firewall rule
	2-1> goto   C:\Users\Public\Documents\ArangoDB 2.5.0\etc\arangodb
	2-2> open arangod.conf
		endpoint = tcp://0.0.0.0:8529
	2-3> From windows, "Allow an App through Windows Firewall", add "Arango Server" to the list

3> Goto 
  http://127.0.0.1:8529/

4> Goto [Application] tab, and Add Application
	4-1> Select Mount location  /Apps/KimchiBoard
	4-2> Select "Zip"
	4-3> Upload App.zip file under (git) kimchi\ArangoSetup
	4-4> Refresh page and check KimchiBoard is created. 

5> Goto [Collection] tab
	5-1> Open Apps_KimchiBoard_Boards / Import (git)  kimchi\Website\SampleJson\board.json
	5-1> Open Apps_KimchiBoard_Lists / Import (git)  kimchi\Website\SampleJson\list.json
	5-1> Open Apps_KimchiBoard_Items / Import (git)  kimchi\Website\SampleJson\item.json