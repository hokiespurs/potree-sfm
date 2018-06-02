% fname = 'G:\www_lidar\pointcloud\solarpanels\03_POSES\opk.txt';
% imagelocation = 'http://research.engr.oregonstate.edu/lidar/pointcloud/solarpanels/';
%IMAGEDIM = [5472 3648];
%FOCAL = 3648.05798;
FNAME = 'G:\www_lidar\pointcloud\divicarina\assets\03_POSES\opk.txt';
IMAGELOCATION = 'http://research.engr.oregonstate.edu/lidar/pointcloud/divicarina/assets/';
FOCAL = 3093.95123;
IMAGEDIM = [4000 3000];


dat = importdata(FNAME);
dname = fileparts(FNAME);
names = dat.textdata(3:end);
Xc = dat.data(:,1);
Yc = dat.data(:,2);
Zc = dat.data(:,3);
r11 = dat.data(:,7);
r12 = dat.data(:,8);
r13 = dat.data(:,9);
r21 = dat.data(:,10);
r22 = dat.data(:,11);
r23 = dat.data(:,12);
r31 = dat.data(:,13);
r32 = dat.data(:,14);
r33 = dat.data(:,15);

R = nan(3,3,numel(names));
R(1,1,:) = r11;
R(1,2,:) = r12;
R(1,3,:) = r13;
R(2,1,:) = r21;
R(2,2,:) = r22;
R(2,3,:) = r23;
R(3,1,:) = r31;
R(3,2,:) = r32;
R(3,3,:) = r33;

for i=1:numel(r11)
   R(:,:,i)= diag([1,-1,-1])*R(:,:,i);
end

[yaw,pitch,roll]=dcm2angle(R,'xyz');

Rx = yaw+pi;
Ry = -pitch;
Rz = -roll;

Rx(Rx>pi)=Rx(Rx>pi)-(2*pi);
Ry(Ry>pi)=Ry(Ry>pi)-(2*pi);
Rz(Rz>pi)=Rz(Rz>pi)-(2*pi);

roll  = Rx;
pitch = Ry;
yaw   = Rz;

roll = roll*180/pi;
pitch = pitch*180/pi;
yaw = yaw*180/pi;

fid = fopen([dname '/cameras.js'],'w+t');
fprintf(fid,'var camdir=''%s'';\n',IMAGELOCATION);

fprintf(fid,'var camname=[');
fprintf(fid,'''%s'',',names{1:end-1});
fprintf(fid,'''%s''];\n',names{end});

fprintf(fid,'var camX=[');
fprintf(fid,'%.3f,',Xc(1:end-1));
fprintf(fid,'%.3f];\n',Xc(end));

fprintf(fid,'var camY=[');
fprintf(fid,'%.3f,',Yc(1:end-1));
fprintf(fid,'%.3f];\n',Yc(end));

fprintf(fid,'var camZ=[');
fprintf(fid,'%.3f,',Zc(1:end-1));
fprintf(fid,'%.3f];\n',Zc(end));

fprintf(fid,'var camRoll=[');
fprintf(fid,'%.3f,',roll(1:end-1));
fprintf(fid,'%.3f];\n',roll(end));

fprintf(fid,'var camPitch=[');
fprintf(fid,'%.3f,',pitch(1:end-1));
fprintf(fid,'%.3f];\n',pitch(end));

fprintf(fid,'var camYaw=[');
fprintf(fid,'%.3f,',yaw(1:end-1));
fprintf(fid,'%.3f];\n',yaw(end));

fprintf(fid,'var camFocal=%.2f;\n',FOCAL);

fprintf(fid,'var camPix=[%.0f,%.0f];\n',IMAGEDIM);

fclose(fid);

figure(1)
subplot(3,1,1);hold on
plot(roll)

subplot(3,1,2);hold on
plot(pitch)

subplot(3,1,3);hold on
plot(yaw)

