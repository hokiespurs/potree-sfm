SET POTREE=".\PotreeConverter_1.6_windows_x64\PotreeConverter.exe"
SET LASFILE=".\lasdata\magtree.las"
SET DIRNAME=".\potreeoutput"
SET HTMLNAME="magtree"
SET PROJ="+proj=lcc +lat_1=46 +lat_2=44.33333333333334 +lat_0=43.66666666666666 +lon_0=-120.5 +x_0=2500000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs"
%POTREE% %LASFILE% -o %DIRNAME% -p %HTMLNAME% --projection %PROJ% --overwrite
