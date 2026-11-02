/* RideStrong exercise animations
   A simple animated figure drawn in SVG. Each exercise is a list of key poses; the figure
   moves smoothly between them on a loop. Angles are in degrees: 0 points right (the way the
   figure faces), 90 points down, -90 points up. */
(function(){
const K=.86,L={torso:54*K,neck:6*K,headR:11*K,ua:29*K,fa:27*K,th:41*K,sh:40*K,ft:12*K};
const G=186; // floor line
const BASE={hip:[120,110],torso:-90,head:null,bend:0,face:1,uaN:96,faN:92,uaF:84,faF:88,thN:92,shN:91,thF:88,shF:89,ftN:0,ftF:0,sN:1,sF:1,lN:1,lF:1};
const C={skin:"#f2c4a0",skin2:"#dca883",shirt:"#6a5af9",shirt2:"#5546e0",shorts:"#22243a",shoe:"#ff7a59",shoe2:"#e8623f",hair:"#2a211c",db:"#2c2f3e",db2:"#8a8fa6",prop:"#ffffff",prop2:"#d9dbe8",mat:"#d9d3ff"};
const rad=a=>a*Math.PI/180,dir=a=>[Math.cos(rad(a)),Math.sin(rad(a))],add=(p,a,l)=>{const d=dir(a);return[p[0]+d[0]*l,p[1]+d[1]*l]};
function joints(p){const hip=p.hip,sh=add(hip,p.torso,L.torso),hd=p.head==null?p.torso:p.head,head=add(sh,hd,L.neck+L.headR);
 const eN=add(sh,p.uaN,L.ua*p.sN),hN=add(eN,p.faN,L.fa*p.sN),eF=add(sh,p.uaF,L.ua*p.sF),hF=add(eF,p.faF,L.fa*p.sF);
 const kN=add(hip,p.thN,L.th*p.lN),aN=add(kN,p.shN,L.sh*p.lN),tN=add(aN,p.ftN,L.ft),kF=add(hip,p.thF,L.th*p.lF),aF=add(kF,p.shF,L.sh*p.lF),tF=add(aF,p.ftF,L.ft);
 return{hip,sh,head,hd,eN,hN,eF,hF,kN,aN,tN,kF,aF,tF}}
/* two bone reach: point the upper and lower segment so the end lands on a target. s picks which way the middle joint bends */
function reach(root,l1,l2,t,s){const dx=t[0]-root[0],dy=t[1]-root[1],d=Math.min(Math.hypot(dx,dy),l1+l2-.01),a0=Math.atan2(dy,dx)*180/Math.PI,c=Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))),al=Math.acos(c)*180/Math.PI,a1=a0+s*al,mid=add(root,a1,l1),a2=Math.atan2(t[1]-mid[1],t[0]-mid[0])*180/Math.PI;return[a1,a2]}
/* build a pose: fill in defaults, move the whole figure so an anchor point lands where we want it, then reach hands and feet to their targets */
function pose(o){const p=Object.assign({},BASE,o);p.hip=(o.hip||BASE.hip).slice();
 if(o.at){const j=joints(p),pt=j[o.at[0]];p.hip=[p.hip[0]+o.at[1]-pt[0],p.hip[1]+o.at[2]-pt[1]]}
 if(o.g){const j=joints(p),m=Math.max(...o.g.map(k=>j[k][1]));p.hip[1]+=G-4-m}
 if(o.ik){const sh=add(p.hip,p.torso,L.torso),k=o.ik;
  if(k.N)[p.thN,p.shN]=reach(p.hip,L.th*p.lN,L.sh*p.lN,k.N,k.N[2]==null?-1:k.N[2]);
  if(k.F)[p.thF,p.shF]=reach(p.hip,L.th*p.lF,L.sh*p.lF,k.F,k.F[2]==null?-1:k.F[2]);
  if(k.hN)[p.uaN,p.faN]=reach(sh,L.ua*p.sN,L.fa*p.sN,k.hN,k.hN[2]==null?1:k.hN[2]);
  if(k.hF)[p.uaF,p.faF]=reach(sh,L.ua*p.sF,L.fa*p.sF,k.hF,k.hF[2]==null?1:k.hF[2])}
 return p}
const ANG=["torso","uaN","faN","uaF","faF","thN","shN","thF","shF","ftN","ftF"];
function lerpAng(a,b,t){let d=((b-a+540)%360)-180;return a+d*t}
function mix(a,b,t){const p={hip:[a.hip[0]+(b.hip[0]-a.hip[0])*t,a.hip[1]+(b.hip[1]-a.hip[1])*t]};ANG.forEach(k=>p[k]=lerpAng(a[k],b[k],t));
 p.head=lerpAng(a.head==null?a.torso:a.head,b.head==null?b.torso:b.head,t);["bend","sN","sF","lN","lF"].forEach(k=>p[k]=a[k]+(b[k]-a[k])*t);p.face=t<.5?a.face:b.face;return p}
const ease=t=>.5-Math.cos(Math.PI*t)/2;

/* ---------- the exercises ---------- */
const S={}; // id -> {f:[poses], db, props, front, t, hold}
const stand=o=>pose(Object.assign({g:["aN","aF"]},o));
const ft0={ftN:0,ftF:0};
// handy pieces
const plankAt=(ank,shd,x)=>{const hip=[ank[0]+.625*(shd[0]-ank[0]),ank[1]+.625*(shd[1]-ank[1])];return Object.assign({hip:hip,torso:Math.atan2(shd[1]-hip[1],shd[0]-hip[0])*180/Math.PI},x)};
const squatLow={torso:-55,thN:18,shN:112,thF:14,shF:110,ftN:0,ftF:0};
const armsFwd={uaN:-4,faN:-4,uaF:2,faF:0};
const goblet={uaN:75,faN:-95,uaF:80,faF:-100};
const lieBack={torso:180,head:180,uaN:6,faN:4,uaF:2,faF:0};

S.Bodyweight_Squat={f:[stand({at:["aN",122,182],uaN:60,faN:20,uaF:65,faF:25}),pose(Object.assign({at:["aN",122,182]},squatLow,armsFwd))]};
S.Goblet_Squat={db:"goblet",f:[stand(Object.assign({at:["aN",122,182]},goblet)),pose(Object.assign({at:["aN",122,182]},squatLow,{uaN:105,faN:-60,uaF:110,faF:-65}))]};
S.Freehand_Jump_Squat={t:650,hold:120,f:[pose(Object.assign({at:["aN",122,182]},squatLow,{uaN:140,faN:130,uaF:145,faF:135})),pose({at:["aN",120,168],torso:-92,thN:92,shN:92,thF:90,shF:92,ftN:60,ftF:62,uaN:-55,faN:-60,uaF:-50,faF:-55}),pose(Object.assign({at:["aN",122,182]},squatLow,{uaN:140,faN:130,uaF:145,faF:135}))]};
S.Knee_Tuck_Jump={t:600,hold:120,f:[pose(Object.assign({at:["aN",122,182]},squatLow,{uaN:140,faN:130,uaF:145,faF:135})),pose({hip:[124,108],torso:-86,thN:-12,shN:84,thF:-8,shF:88,ftN:40,ftF:40,uaN:30,faN:-30,uaF:34,faF:-26})]};
// split squat (static lunge), front leg is the near leg
const splitTop={at:["aN",150,182],torso:-90,thN:70,shN:100,thF:118,shF:118,ftF:35,uaN:95,faN:92,uaF:85,faF:88};
const splitLow={at:["aN",150,182],torso:-88,thN:8,shN:98,thF:96,shF:172,ftF:105};
S.Split_Squats={f:[pose(splitTop),pose(splitLow)]};
S.Bodyweight_Walking_Lunge={f:[stand({at:["aN",110,182]}),pose(Object.assign({},splitLow,{at:["aN",150,182]})),stand({at:["aN",150,182],thF:85})]};
S.Dumbbell_Rear_Lunge={db:"both",f:[stand({at:["aN",150,182],thF:90}),pose(Object.assign({},splitLow,{uaN:92,faN:90,uaF:88,faF:90}))]};
S.Split_Squat_with_Dumbbells={db:"both",props:[{box:[40,158,50,28]}],f:[pose({hip:[128,113],torso:-90,ftF:165,uaN:92,faN:90,uaF:88,faF:90,ik:{N:[162,182],F:[80,151]}}),pose({hip:[124,137],torso:-86,ftF:165,uaN:92,faN:90,uaF:88,faF:90,ik:{N:[162,182],F:[80,151]}})]};
// hinges
S["Stiff-Legged_Dumbbell_Deadlift"]={db:"both",f:[stand({at:["aN",128,182],uaN:92,faN:90,uaF:88,faF:90}),pose({at:["aN",128,182],torso:-18,head:-30,thN:102,shN:82,thF:100,shF:84,uaN:92,faN:90,uaF:88,faF:90})]};
S["Kettlebell_One-Legged_Deadlift"]={db:"F",f:[stand({at:["aN",128,182],thF:96,shF:104,uaF:88,faF:90}),pose({at:["aN",128,182],torso:-14,head:-24,thN:98,shN:84,thF:186,shF:184,ftF:95,uaN:150,faN:160,uaF:90,faF:90})]};
S.Vertical_Swing={db:"one",t:700,hold:120,f:[pose({at:["aN",128,182],torso:-25,head:-40,thN:70,shN:100,thF:68,shF:102,uaN:120,faN:125,uaF:118,faF:123}),stand({at:["aN",128,182],uaN:-6,faN:-6,uaF:-4,faF:-4})]};
// step up onto a box (box top at y 146)
S.Dumbbell_Step_Ups={db:"both",props:[{box:[134,160,64,26]}],f:[pose({hip:[128,117],torso:-80,uaN:92,faN:90,uaF:88,faF:90,ik:{N:[160,156],F:[112,182]}}),pose({hip:[154,90],torso:-90,ftF:30,uaN:92,faN:90,uaF:88,faF:90,ik:{N:[160,156],F:[142,140]}})]};
S.Standing_Dumbbell_Calf_Raise={db:"both",f:[stand({at:["tN",134,182],uaN:92,faN:90,uaF:88,faF:90}),pose({at:["tN",134,182],ftN:48,ftF:48,uaN:92,faN:90,uaF:88,faF:90})]};
// floor work on the back, head to the left
const bridgeLow={torso:180,head:180,uaN:4,faN:2,uaF:2,faF:0};
S.Butt_Lift_Bridge={props:[{mat:1}],f:[pose(Object.assign({at:["aN",168,182],hip:[120,175],thN:-40,shN:72,thF:-42,shF:70,ftN:0,ftF:0},bridgeLow)),pose(Object.assign({at:["aN",168,182],torso:158,head:172,thN:-10,shN:88,thF:-12,shF:86,uaN:16,faN:14,uaF:14,faF:12}))]};
S.Single_Leg_Glute_Bridge={props:[{mat:1}],f:[pose(Object.assign({at:["aN",168,182],thN:-40,shN:72,thF:-40,shF:-40,ftF:-40},bridgeLow)),pose(Object.assign({at:["aN",168,182],torso:158,head:172,thN:-10,shN:88,thF:-12,shF:-12,ftF:-12,uaN:16,faN:14,uaF:14,faF:12}))]};
S.Dead_Bug={props:[{mat:1}],f:[pose(Object.assign({g:["hip","sh"]},lieBack,{uaN:-90,faN:-90,uaF:-88,faF:-88,thN:-90,shN:0,thF:-88,shF:2})),pose(Object.assign({g:["hip","sh"]},lieBack,{uaN:-90,faN:-90,uaF:188,faF:186,thN:-6,shN:-4,thF:-88,shF:2})),pose(Object.assign({g:["hip","sh"]},lieBack,{uaN:-90,faN:-90,uaF:-88,faF:-88,thN:-90,shN:0,thF:-88,shF:2})),pose(Object.assign({g:["hip","sh"]},lieBack,{uaN:186,faN:186,uaF:-88,faF:-88,thN:-90,shN:0,thF:-8,shF:-6}))]};
S.Reverse_Crunch={props:[{mat:1}],f:[pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-80,shN:5,thF:-78,shF:7})),pose({g:["sh"],torso:172,head:180,uaN:6,faN:4,uaF:2,faF:0,thN:-125,shN:-35,thF:-123,shF:-33})]};
S.Flutter_Kicks={t:450,hold:60,props:[{mat:1}],f:[pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-8,shN:-8,ftN:-60,thF:-24,shF:-24,ftF:-70})),pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-24,shN:-24,ftN:-70,thF:-8,shF:-8,ftF:-60}))]};
S.Hamstring_Stretch={props:[{mat:1}],hold:900,f:[pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-62,shN:-62,ftN:-150,thF:0,shF:0,ftF:-80,uaN:-55,faN:-30,uaF:-50,faF:-28})),pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-82,shN:-82,ftN:-170,thF:0,shF:0,ftF:-80,uaN:-70,faN:-50,uaF:-66,faF:-46}))]};
S.IT_Band_and_Glute_Stretch={props:[{mat:1}],hold:900,f:[pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-55,shN:-55,lN:.85,ftN:-140,thF:0,shF:0,ftF:-80,uaN:-60,faN:-20,uaF:4,faF:2})),pose(Object.assign({g:["hip","sh"]},lieBack,{thN:-70,shN:-70,lN:.75,ftN:-150,thF:0,shF:0,ftF:-80,uaN:-72,faN:-36,uaF:4,faF:2}))]};
S["Bent-Arm_Dumbbell_Pullover"]={db:"one",props:[{mat:1}],f:[pose(Object.assign({at:["aN",168,182]},lieBack,{thN:-45,shN:65,thF:-47,shF:63,uaN:-92,faN:-92,uaF:-90,faF:-90})),pose(Object.assign({at:["aN",168,182]},lieBack,{thN:-45,shN:65,thF:-47,shF:63,uaN:200,faN:178,uaF:202,faF:180}))]};
// face down
S.Superman={props:[{mat:1}],f:[pose({g:["hip","sh"],torso:180,head:180,face:-1,uaN:180,faN:180,uaF:182,faF:182,thN:0,shN:0,ftN:90,thF:2,shF:2,ftF:90}),pose({g:["hip"],torso:194,head:200,face:-1,uaN:198,faN:200,uaF:200,faF:202,thN:-10,shN:-10,ftN:80,thF:-8,shF:-8,ftF:80})]};
// plank family, head to the right
const highPlank={torso:-12,head:-10,uaN:90,faN:90,uaF:88,faF:88,thN:172,shN:172,ftN:100,thF:170,shF:170,ftF:100};
S.Plank={props:[{mat:1}],hold:1400,f:[pose(plankAt([44,176],[157,155],{head:-8,uaN:90,faN:0,uaF:88,faF:-2,ftN:100,ftF:100,ik:{N:[44,176],F:[46,176]}})),pose(plankAt([44,176],[157,153],{head:-10,uaN:92,faN:0,uaF:90,faF:-2,ftN:100,ftF:100,ik:{N:[44,176],F:[46,176]}}))]};
S.Pushups={props:[{mat:1}],f:[pose(plankAt([44,176],[150,134],{head:-18,ftN:100,ftF:100,ik:{N:[44,176],F:[46,176],hN:[152,182],hF:[150,182]}})),pose(plankAt([44,176],[157,160],{head:-6,ftN:100,ftF:100,ik:{N:[44,176],F:[46,176],hN:[152,182],hF:[150,182]}}))]};
S["Incline_Push-Up"]={props:[{box:[160,128,60,58]}],f:[pose(plankAt([60,176],[165,80],{head:-40,ftN:80,ftF:80,ik:{N:[60,176],F:[62,176],hN:[172,126],hF:[170,126]}})),pose(plankAt([60,176],[156,104],{head:-34,ftN:80,ftF:80,ik:{N:[60,176],F:[62,176],hN:[172,126],hF:[170,126]}}))]};
S.Mountain_Climbers={t:380,hold:40,props:[{mat:1}],f:[pose(plankAt([44,176],[150,134],{head:-18,ftN:110,ftF:100,ik:{N:[122,170],F:[46,176],hN:[152,182],hF:[150,182]}})),pose(plankAt([44,176],[150,134],{head:-18,ftN:100,ftF:110,ik:{N:[44,176],F:[124,170],hN:[152,182],hF:[150,182]}}))]};
S.Side_Bridge={props:[{mat:1}],hold:1400,f:[pose({at:["aN",50,180],torso:-16,head:-18,uaN:90,faN:0,uaF:-90,faF:-90,thN:174,shN:176,ftN:100,thF:172,shF:174,ftF:100}),pose({at:["aN",50,180],torso:-12,head:-14,uaN:92,faN:0,uaF:-88,faF:-88,thN:176,shN:177,ftN:100,thF:174,shF:175,ftF:100})]};
S.Inchworm={props:[{mat:1}],t:1100,f:[pose({hip:[86,113],torso:72,head:85,ik:{N:[80,182],F:[82,182],hN:[112,182],hF:[110,182]}}),pose({hip:[92,116],torso:28,head:35,ik:{N:[80,182],F:[82,182],hN:[146,182],hF:[144,182]}}),pose(plankAt([80,176],[182,134],{head:-18,ftN:100,ftF:100,ik:{N:[80,176],F:[82,176],hN:[184,182],hF:[182,182]}}))]};
// kneeling and all fours, head to the right
const fours={torso:-2,head:4,uaN:90,faN:90,uaF:88,faF:88,thN:90,shN:180,ftN:180,thF:88,shF:180,ftF:180};
S.Cat_Stretch={props:[{mat:1}],hold:700,f:[pose(Object.assign({at:["kN",92,180]},fours,{bend:-14,head:40})),pose(Object.assign({at:["kN",92,180]},fours,{bend:10,head:-30}))]};
S.Childs_Pose={props:[{mat:1}],hold:1200,f:[pose({at:["kN",112,180],torso:22,head:30,thN:30,shN:182,ftN:180,thF:28,shF:182,ftF:180,uaN:4,faN:2,uaF:2,faF:0,bend:-6}),pose({at:["kN",112,180],torso:18,head:26,thN:36,shN:182,ftN:180,thF:34,shF:182,ftF:180,uaN:2,faN:0,uaF:0,faF:-2,bend:-8})]};
S.Kneeling_Hip_Flexor={props:[{mat:1}],hold:1000,f:[pose({at:["kF",100,180],torso:-90,thN:10,shN:96,thF:96,shF:180,ftF:180,uaN:108,faN:40,uaF:112,faF:44}),pose({at:["kF",100,180],torso:-96,head:-90,thN:-4,shN:100,thF:112,shF:180,ftF:180,uaN:-100,faN:-95,uaF:-98,faF:-92})]};
S.Worlds_Greatest_Stretch={props:[{mat:1}],hold:700,f:[pose({at:["aN",160,182],torso:-25,head:-20,thN:18,shN:100,thF:162,shF:168,ftF:100,uaN:96,faN:92,uaF:94,faF:90}),pose({at:["aN",160,182],torso:-32,head:-80,thN:18,shN:100,thF:162,shF:168,ftF:100,uaN:-96,faN:-96,uaF:94,faF:90})]};
// standing stretches and mobility
S.Quad_Stretch={hold:1000,props:[{wall:206}],f:[stand({at:["aF",128,182],thN:96,shN:-95,ftN:-150,uaN:120,faN:150,uaF:-4,faF:-2}),stand({at:["aF",128,182],thN:104,shN:-88,ftN:-150,uaN:126,faN:156,uaF:-4,faF:-2})]};
S.Calf_Stretch_Hands_Against_Wall={hold:1000,props:[{wall:200}],f:[pose({at:["aF",86,182],torso:-58,head:-50,thN:58,shN:102,thF:118,shF:118,ftF:0,uaN:-6,faN:-6,uaF:-8,faF:-8}),pose({at:["aF",86,182],torso:-50,head:-44,thN:50,shN:104,thF:122,shF:122,ftF:0,uaN:-2,faN:-2,uaF:-4,faF:-4})]};
S.Chest_And_Front_Of_Shoulder_Stretch={hold:1000,f:[stand({at:["aN",122,182],uaN:118,faN:118,uaF:116,faF:116}),stand({at:["aN",122,182],torso:-84,head:-86,uaN:150,faN:155,uaF:148,faF:153})]};
S.Standing_Hip_Circles={t:600,hold:60,props:[{wall:200}],f:[stand({at:["aF",126,182],uaN:-4,faN:-4,thN:20,shN:110,ftN:20}),stand({at:["aF",126,182],uaN:-4,faN:-4,thN:-10,shN:80,ftN:0,lN:.85}),stand({at:["aF",126,182],uaN:-4,faN:-4,thN:60,shN:130,ftN:60,lN:.8}),stand({at:["aF",126,182],uaN:-4,faN:-4,thN:100,shN:120,ftN:40})]};
// upper body
S.Dumbbell_Shoulder_Press={db:"both",f:[stand({at:["aN",122,182],uaN:82,faN:-92,uaF:86,faF:-88}),stand({at:["aN",122,182],uaN:-93,faN:-91,uaF:-89,faF:-89})]};
S["One-Arm_Dumbbell_Row"]={db:"N",props:[{box:[50,150,116,36]}],f:[pose({hip:[92,111],torso:-6,head:0,thF:90,shF:180,ftF:180,ik:{N:[100,182],hF:[154,147],hN:[142,152]}}),pose({hip:[92,111],torso:-8,head:-2,thF:90,shF:180,ftF:180,ik:{N:[100,182],hF:[154,147],hN:[124,120]}})]};
S.Reverse_Flyes={db:"both",f:[pose({at:["aN",128,182],torso:-24,head:-30,thN:104,shN:82,thF:102,shF:84,uaN:90,faN:92,uaF:88,faF:90}),pose({at:["aN",128,182],torso:-24,head:-30,thN:104,shN:82,thF:102,shF:84,uaN:-10,faN:-6,uaF:0,faF:2,sN:.45,sF:.45})]};
S.External_Rotation={db:"N",front:1,f:[stand({at:["aN",136,182],thN:86,thF:94,uaN:92,faN:180,uaF:88,faF:92}),stand({at:["aN",136,182],thN:86,thF:94,uaN:92,faN:-8,uaF:88,faF:92})]};
S.Farmers_Walk={db:"both",t:480,hold:0,f:[stand({at:["aN",122,182],thN:70,shN:96,thF:108,shF:118,ftF:20,uaN:92,faN:90,uaF:88,faF:90}),stand({at:["aN",122,182],thN:92,shN:90,thF:90,shF:100,uaN:92,faN:90,uaF:88,faF:90}),stand({at:["aF",122,182],thF:70,shF:96,thN:108,shN:118,ftN:20,uaN:92,faN:90,uaF:88,faF:90}),stand({at:["aF",122,182],thF:92,shF:90,thN:90,shN:100,uaN:92,faN:90,uaF:88,faF:90})]};
S.Arm_Circles={front:1,t:300,hold:0,f:[0,1,2,3].map(i=>stand({at:["aN",136,182],thN:84,thF:96,uaN:[-6,4,6,-4][i],faN:[-6,4,6,-4][i],uaF:[186,176,174,184][i],faF:[186,176,174,184][i]}))};
// front view moves
S.Dumbbell_Side_Bend={db:"N",front:1,f:[stand({at:["aN",136,182],thN:84,thF:96,uaN:90,faN:90,uaF:92,faF:92}),stand({at:["aN",136,182],thN:84,thF:96,torso:-72,head:-74,uaN:78,faN:80,uaF:100,faF:100}),stand({at:["aN",136,182],thN:84,thF:96,torso:-104,head:-102,uaN:94,faN:94,uaF:110,faF:108})]};
S.Lateral_Bound={front:1,t:520,hold:200,f:[pose({at:["aN",86,182],torso:-80,thN:70,shN:105,thF:60,shF:-40,ftF:0,uaN:120,faN:120,uaF:30,faF:10}),pose({at:["aF",156,182],torso:-100,thF:110,shF:75,thN:120,shN:220,ftN:180,uaF:60,faF:60,uaN:150,faN:170})]};
S.Russian_Twist={db:"one",props:[{mat:1}],t:600,hold:150,f:[pose({g:["hip"],torso:-130,head:-110,thN:-35,shN:30,thF:-37,shF:28,ftN:10,ftF:10,uaN:30,faN:60,uaF:34,faF:64,sN:.9,sF:.8}),pose({g:["hip"],torso:-128,head:-112,thN:-35,shN:30,thF:-37,shF:28,ftN:10,ftF:10,uaN:-30,faN:-10,uaF:-26,faF:-6,sN:.75,sF:.85})]};

/* ---------- drawing ---------- */
const NS="http://www.w3.org/2000/svg";
function el(t,a,parent){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);parent&&parent.appendChild(e);return e}
let gid=0;function build(svg,spec){svg.innerHTML="";svg.setAttribute("viewBox","0 0 240 200");const id="rsbg"+(++gid);
 if(!svg.classList.contains("clear"))el("rect",{x:0,y:0,width:240,height:200,fill:"url(#"+id+")"},svg);
 const defs=el("defs",{},svg),g=el("radialGradient",{id:id,cx:"50%",cy:"40%",r:"75%"},defs);el("stop",{offset:"0%","stop-color":"#ffffff"},g);el("stop",{offset:"100%","stop-color":"#efedff"},g);
 el("line",{x1:0,y1:G,x2:240,y2:G,stroke:svg.classList.contains("clear")?"rgba(0,0,0,.08)":"#dcdcef","stroke-width":2},svg);
 (spec.props||[]).forEach(p=>{if(p.mat)el("rect",{x:24,y:G-3,width:192,height:4,rx:2,fill:C.mat},svg);if(p.box)el("rect",{x:p.box[0],y:p.box[1],width:p.box[2],height:p.box[3],rx:5,fill:C.prop,stroke:C.prop2,"stroke-width":2},svg);if(p.wall)el("rect",{x:p.wall,y:20,width:240-p.wall,height:G-20,fill:"rgba(255,255,255,.7)"},svg)});
 const shadow=el("ellipse",{cx:120,cy:G+1,rx:34,ry:4,fill:"#000",opacity:.08},svg);
 const line=(c,w)=>el("line",{stroke:c,"stroke-width":w,"stroke-linecap":"round"},svg),circ=(c,r)=>el("circle",{r:r,fill:c},svg);
 const front=!!spec.front,sk2=front?C.skin:C.skin2,sh2=front?C.shoe:C.shoe2;
 const e={shadow};
 e.uaF=line(sk2,7.6);e.faF=line(sk2,6.8);e.hF=circ(sk2,4.2);
 e.dbF=el("g",{},svg);
 e.thF=line(sk2,10.8);e.shF=line(sk2,9);e.ftF=line(sh2,6.4);e.shortsF=line(front?C.shorts:"#181a2c",13.5);
 e.torso=el("path",{fill:"none",stroke:C.shirt,"stroke-width":front?23:19.5,"stroke-linecap":"round"},svg);
 e.hips=circ(C.shorts,10.5);
 e.neck=line(C.skin,7);e.hair=circ(C.hair,10.2);e.head=circ(C.skin,9);
 e.thN=line(C.skin,10.8);e.shN=line(C.skin,9);e.ftN=line(C.shoe,6.4);e.shortsN=line(C.shorts,13.5);
 e.uaN=line(C.skin,7.6);e.sleeveN=line(C.shirt,9.5);e.faN=line(C.skin,6.8);e.hN=circ(C.skin,4.2);
 e.dbN=el("g",{},svg);
 if(front){e.sleeveF=line(C.shirt,9.5);svg.insertBefore(e.sleeveF,e.faF)}
 const mkdb=(g)=>{const r=el("rect",{x:-9,y:-3,width:18,height:6,rx:3,fill:C.db2},g);el("rect",{x:-9,y:-8,width:6,height:16,rx:2,fill:C.db},g);el("rect",{x:3,y:-8,width:6,height:16,rx:2,fill:C.db},g);return g};
 if(spec.db==="both"||spec.db==="F")mkdb(e.dbF);if(spec.db==="both"||spec.db==="N"||spec.db==="one"||spec.db==="goblet")mkdb(e.dbN);
 svg._e=e;svg._spec=spec}
const set=(n,a)=>{for(const k in a)n.setAttribute(k,a[k])};
const ln=(n,a,b)=>set(n,{x1:a[0].toFixed(1),y1:a[1].toFixed(1),x2:b[0].toFixed(1),y2:b[1].toFixed(1)});
const ptAt=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function draw(svg,p){const e=svg._e,j=joints(p),spec=svg._spec;
 ln(e.uaF,j.sh,j.eF);ln(e.faF,j.eF,j.hF);set(e.hF,{cx:j.hF[0],cy:j.hF[1]});if(e.sleeveF)ln(e.sleeveF,j.sh,ptAt(j.sh,j.eF,.45));
 ln(e.thF,j.hip,j.kF);ln(e.shF,j.kF,j.aF);ln(e.ftF,j.aF,j.tF);ln(e.shortsF,j.hip,ptAt(j.hip,j.kF,.5));
 const mid=ptAt(j.hip,j.sh,.5),dx=j.sh[0]-j.hip[0],dy=j.sh[1]-j.hip[1],len=Math.hypot(dx,dy)||1,b=p.bend||0,cx=mid[0]+(-dy/len)*b,cy=mid[1]+(dx/len)*b;
 e.torso.setAttribute("d","M"+j.hip[0].toFixed(1)+" "+j.hip[1].toFixed(1)+" Q"+cx.toFixed(1)+" "+cy.toFixed(1)+" "+j.sh[0].toFixed(1)+" "+j.sh[1].toFixed(1));
 set(e.hips,{cx:j.hip[0],cy:j.hip[1]});
 const hd=p.head==null?p.torso:p.head,fd=dir(hd+90*(p.face||1));
 ln(e.neck,j.sh,add(j.sh,hd,L.neck+3));set(e.hair,{cx:j.head[0]-fd[0]*1.8,cy:j.head[1]-fd[1]*1.8});set(e.head,{cx:j.head[0]+fd[0]*1.4,cy:j.head[1]+fd[1]*1.4});
 ln(e.thN,j.hip,j.kN);ln(e.shN,j.kN,j.aN);ln(e.ftN,j.aN,j.tN);ln(e.shortsN,j.hip,ptAt(j.hip,j.kN,.5));
 ln(e.uaN,j.sh,j.eN);ln(e.sleeveN,j.sh,ptAt(j.sh,j.eN,.45));ln(e.faN,j.eN,j.hN);set(e.hN,{cx:j.hN[0],cy:j.hN[1]});
 const rot=(a)=>(a*180/Math.PI);
 if(spec.db){const place=(g,h,f,vert)=>{const ang=vert?90:(spec.front?0:rot(Math.atan2(h[1]-f[1],h[0]-f[0]))+90);g.setAttribute("transform","translate("+h[0].toFixed(1)+" "+h[1].toFixed(1)+") rotate("+ang.toFixed(0)+")"+(spec.front?"":" scale(.82)"))};
  if(spec.db==="one"||spec.db==="goblet"){const m=ptAt(j.hN,j.hF,.5);place(e.dbN,[m[0],m[1]+(spec.db==="goblet"?2:0)],j.eN,spec.db==="goblet")}
  else{if(spec.db!=="F")place(e.dbN,j.hN,j.eN);if(spec.db!=="N")place(e.dbF,j.hF,j.eF)}}
 const xs=[j.aN[0],j.aF[0],j.tN[0],j.tF[0],j.hip[0]];set(e.shadow,{cx:((Math.min(...xs)+Math.max(...xs))/2).toFixed(1),rx:Math.max(20,(Math.max(...xs)-Math.min(...xs))/2+14).toFixed(1)})}
function poseAt(spec,ms){const f=spec.f,n=f.length,tr=spec.t||900,hold=spec.hold==null?280:spec.hold,seg=tr+hold,total=seg*n,t=ms%total,i=Math.floor(t/seg),r=t-i*seg;if(r<hold)return f[i];return mix(f[i],f[(i+1)%n],ease((r-hold)/tr))}

/* ---------- public ---------- */
const live=new Set();let raf=null,start=performance.now();
function loop(now){raf=null;let any=false;live.forEach(svg=>{if(!svg.isConnected){live.delete(svg);return}any=true;const r=svg.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;draw(svg,poseAt(svg._spec,now-start+(svg._off||0)))});if(any)raf=requestAnimationFrame(loop)}
window.RSAnim={has:id=>!!S[id],ids:()=>Object.keys(S),
 svg(id,cls){return S[id]?'<svg class="fig '+(cls||"")+'" data-fig="'+id+'" role="img" aria-label="Animated demonstration"></svg>':""},
 mount(root){(root||document).querySelectorAll("svg.fig[data-fig]").forEach(svg=>{if(svg._e)return;const spec=S[svg.dataset.fig];if(!spec)return;build(svg,spec);svg._off=Math.random()*200;draw(svg,spec.f[0]);live.add(svg)});if(!raf&&live.size)raf=requestAnimationFrame(loop)},
 frame(svg,id,i){const spec=S[id];build(svg,spec);draw(svg,spec.f[i%spec.f.length])},
 count:id=>S[id]?S[id].f.length:0};
})();
