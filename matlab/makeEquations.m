%%
syms f cx cy Xc Yc Zc Xw Yw Zw Rx Ry Rz
K = [f 0 cx;0 f cy;0 0 1];
R_ROLL = [1 0 0; 0 cos(Rx) sin(Rx); 0 -sin(Rx) cos(Rx)];
R_PITCH = [cos(Ry) 0 -sin(Ry); 0 1 0;sin(Ry) 0 cos(Ry)];
R_YAW = [cos(Rz) sin(Rz) 0; -sin(Rz) cos(Rz) 0; 0 0 1];

R = R_YAW * R_PITCH * R_ROLL;

UVS = K * R * [eye(3) [-Xc;-Yc;-Zc]] * [Xw;Yw;Zw;1];

pixx = UVS(1)/UVS(3);
pixy = UVS(2)/UVS(3);
s = UVS(3);

strXeqn = sprintf('pixx = %s',pixx);
strYeqn = sprintf('pixy = %s',pixy);
strSeqn = sprintf('s = %s',s);

oldstr = {'sin','cos','^'}; 
newstr = {'Math.sin',...
             'Math.cos',...
             '**'};
         
for i=1:numel(oldstr)
    strXeqn = strrep(strXeqn,oldstr{i},newstr{i});
    strYeqn = strrep(strYeqn,oldstr{i},newstr{i});
    strSeqn = strrep(strSeqn,oldstr{i},newstr{i});
end

fprintf('%s\n',strXeqn);
fprintf('%s\n',strYeqn);
fprintf('%s\n',strSeqn);
%%
syms f cx cy Xc Yc Zc Xw Yw Zw Rx Ry Rz
syms pixx pixy s
K = [f 0 cx;0 f cy;0 0 1];
R_ROLL = [1 0 0; 0 cos(Rx) sin(Rx); 0 -sin(Rx) cos(Rx)];
R_PITCH = [cos(Ry) 0 -sin(Ry); 0 1 0;sin(Ry) 0 cos(Ry)];
R_YAW = [cos(Rz) sin(Rz) 0; -sin(Rz) cos(Rz) 0; 0 0 1];

R = R_YAW * R_PITCH * R_ROLL;

UVS = K * R * [eye(3) [-Xc;-Yc;-Zc]] * [Xw;Yw;Zw;1];

Eqn(1,1) = pixx == UVS(1)/UVS(3);
Eqn(2,1) = pixy == UVS(2)/UVS(3);
Eqn(3,1) = s == UVS(3);
Eqn(4,1) = Zw == 0;

sol = solve(Eqn,[Xw Yw Zw s]);
%%
syms f cx cy Xc Yc Zc Rx Ry Rz
K = [f 0 cx;0 f cy;0 0 1];
R_ROLL = [1 0 0; 0 cos(Rx) sin(Rx); 0 -sin(Rx) cos(Rx)];
R_PITCH = [cos(Ry) 0 -sin(Ry); 0 1 0;sin(Ry) 0 cos(Ry)];
R_YAW = [cos(Rz) sin(Rz) 0; -sin(Rz) cos(Rz) 0; 0 0 1];

R = R_YAW * R_PITCH * R_ROLL;

P = K * R * [eye(3) [-Xc;-Yc;-Zc]];

oldstr = {'sin','cos','^'}; 
newstr = {'Math.sin',...
             'Math.cos',...
             '**'};
str = [];
for i=0:2
    for j=0:3
        str{j+1} = sprintf('%s',P(i+1,j+1));
        for k=1:numel(oldstr)
            str{j+1} = strrep(str{j+1},oldstr{k},newstr{k});
        end
    end
    fprintf('let P%i = [%s,\n\t\t%s,\n\t\t%s,\n\t\t%s];\n',i+1,str{1},str{2},str{3},str{4});
end
fprintf('return [P1, P2, P3];\n');
%% syms f cx cy Xc Yc Zc Rx Ry Rz
syms f cx cy Xc Yc Zc pan tilt
K = [f 0 cx;0 f cy;0 0 1];
R_PITCH = [cos(tilt) 0 -sin(tilt); 0 1 0;sin(tilt) 0 cos(tilt)];
R_YAW = [cos(pan) sin(pan) 0; -sin(pan) cos(pan) 0; 0 0 1];

R =  R_PITCH * R_YAW;

P = K * R * [eye(3) [-Xc;-Yc;-Zc]];

oldstr = {'sin','cos','^'}; 
newstr = {'Math.sin',...
             'Math.cos',...
             '**'};
str = [];
for i=0:2
    for j=0:3
        str{j+1} = sprintf('%s',P(i+1,j+1));
        for k=1:numel(oldstr)
            str{j+1} = strrep(str{j+1},oldstr{k},newstr{k});
        end
    end
    fprintf('let P%i = [%s,\n\t\t%s,\n\t\t%s,\n\t\t%s];\n',i+1,str{1},str{2},str{3},str{4});
end
fprintf('return [P1, P2, P3];\n');