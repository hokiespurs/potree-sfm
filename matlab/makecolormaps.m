% make cmap images
outdir= '../assets/cmapimages/';
dat = importdata('../doc/cmaps.txt');
nlines = [2 11 11 7 11 11 11];
IMGHEIGHT = 50;
IMGWIDTH = 10;

startind = cumsum([1 nlines]);
for i=1:numel(nlines)
    useind = startind(i):startind(i+1)-1;
    N = dat(useind,1);
    r = dat(useind,2);
    g = dat(useind,3);
    b = dat(useind,4);

    cmap = zeros(IMGHEIGHT,1,3);
    cmap(:,1,1) = interp1(N,r,linspace(0,1,IMGHEIGHT));
    cmap(:,1,2) = interp1(N,g,linspace(0,1,IMGHEIGHT));
    cmap(:,1,3) = interp1(N,b,linspace(0,1,IMGHEIGHT));
    
    outimage = flipud(repmat(cmap,1,IMGWIDTH,1));
    
    subplot(1,7,i)
    imshow(outimage);
    imwrite(outimage,[outdir sprintf('Colormap_%02.f.png',i)]);
end