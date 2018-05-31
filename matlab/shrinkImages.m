imnames = dirname('*');
starttime=now;
for i=1:numel(imnames)
    I = imread(imnames{i});
    Ismaller = imresize(I,[256 256]);
    [~,justname] = fileparts(imnames{i});
    outname = ['../02_THUMBNAILS/' justname '.JPG'];
    imwrite(Ismaller,outname);
    loopStatus(starttime,i,numel(imnames),1);
end