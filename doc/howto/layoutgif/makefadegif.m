function makefadegif(imagenames,t,alpha)

%% test data
imagenames = dirname('*.png');
t = [1 20 40 60 80];
alpha = nan(5,3);
alpha(:,1) = [1 0.1 1 0.1 1];
alpha(:,2) = [0 0.9 0 0.0 0];
alpha(:,3) = [0 0.0 0 0.9 0];
outputfilename = 'layout.gif';
delaytime = 0.5;
duplicate = 1;
clipy = 100:1125;
clipx = 1:1479;
imscale = 0.33;
%%
% makes a gif that fades between images using linear interpolation of alpha
% t values are framenum
nimages = numel(imagenames);
nframes = max(t(:));

for i=1:numel(imagenames)
   I{i} = imread(imagenames{i}); 
end

alphavals = nan(nframes,nimages);
for i=1:nimages
    alphavals(:,i) = interp1(t,alpha(:,i),1:nframes);
end

for i=1:nframes
    Iframe{i} = uint8(zeros(size(I{1})));
    for j=1:numel(imagenames)
        ialpha = alphavals(i,j);
        Iframe{i} = Iframe{i} + ialpha * I{j};
    end
    Iframe{i} = Iframe{i}(clipy,clipx,:);
    Iframe{i} = imresize(Iframe{i},imscale);
    
    image(Iframe{i});
    pause(0.5);
end

makeGif(Iframe,outputfilename,delaytime,duplicate)

end

function makeGif(Idata,outputfilename,delaytime,duplicate)
nimages = numel(Idata);
I=Idata{1};
[A,map]=rgb2ind(I,256);

imwrite(A,map,outputfilename,'gif','LoopCount',Inf,'DelayTime',delaytime);
for i=2:nimages
    fprintf('%.0f/%.0f...%s\n',i,nimages,datestr(now));
    I = Idata{i};
    [A,map]=rgb2ind(I,256);
    for j=1:duplicate
        imwrite(A,map,outputfilename,'gif','WriteMode','append','DelayTime',delaytime);
    end
end

end