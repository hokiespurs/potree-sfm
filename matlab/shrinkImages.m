imnames = dirname('*');
SMALLSIZE = 256;
BIGSIZE = 4096;

starttime=now;

for i=1:1:numel(imnames)
    % get output filename
    [~,justname] = fileparts(imnames{i});
    smallname = ['../02_THUMBNAILS/' justname '.JPG'];
    bigname = imnames{i};
    if ~exist(smallname,'file')
        % read image
        I = imread(imnames{i});
        [m,n,p]=size(I);
        % resize images so square power of 2
        Ismall = imresize(I,[SMALLSIZE SMALLSIZE]);
        Ibig = imresize(I,[BIGSIZE BIGSIZE]);
        
        imwrite(Ismall,smallname);
        imwrite(Ibig,bigname);%overwrite current images
    end
    loopStatus(starttime,i,numel(imnames),1);
end