(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const Do="179",bh=0,al=1,Th=2,Lc=1,Lo=2,Ni=3,an=0,$e=1,Je=2,ki=0,nn=1,Mi=2,ol=3,ll=4,Eh=5,Sn=100,Ah=101,Ch=102,Rh=103,Ph=104,Dh=200,Lh=201,Ih=202,Uh=203,Oa=204,Ba=205,Nh=206,Fh=207,Oh=208,Bh=209,zh=210,kh=211,Hh=212,Vh=213,Gh=214,za=0,ka=1,Ha=2,es=3,Va=4,Ga=5,Wa=6,Xa=7,Io=0,Wh=1,Xh=2,sn=0,Ic=1,Uc=2,Nc=3,Xr=4,Fc=5,Oc=6,Bc=7,zc=300,is=301,ns=302,qa=303,ja=304,qr=306,Us=1e3,bn=1001,Ya=1002,ri=1003,qh=1004,$s=1005,_i=1006,Qr=1007,Ji=1008,Ci=1009,kc=1010,Hc=1011,Ns=1012,Uo=1013,An=1014,Ei=1015,Hi=1016,No=1017,Fo=1018,Fs=1020,Vc=35902,Gc=1021,Wc=1022,di=1023,Os=1026,Bs=1027,Oo=1028,Bo=1029,Xc=1030,zo=1031,ko=1033,Rr=33776,Pr=33777,Dr=33778,Lr=33779,Ka=35840,$a=35841,Za=35842,Ja=35843,Qa=36196,to=37492,eo=37496,io=37808,no=37809,so=37810,ro=37811,ao=37812,oo=37813,lo=37814,co=37815,ho=37816,uo=37817,fo=37818,po=37819,mo=37820,go=37821,Ir=36492,_o=36494,vo=36495,qc=36283,xo=36284,Mo=36285,yo=36286,jh=3200,Yh=3201,Ho=0,Kh=1,Zi="",Be="srgb",ss="srgb-linear",Or="linear",te="srgb",Ln=7680,cl=519,$h=512,Zh=513,Jh=514,jc=515,Qh=516,tu=517,eu=518,iu=519,So=35044,hl="300 es",Ai=2e3,Br=2001;class cs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const s=n.indexOf(e);s!==-1&&n.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,t);t.target=null}}}const He=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ul=1234567;const Ps=Math.PI/180,zs=180/Math.PI;function Vi(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(He[r&255]+He[r>>8&255]+He[r>>16&255]+He[r>>24&255]+"-"+He[t&255]+He[t>>8&255]+"-"+He[t>>16&15|64]+He[t>>24&255]+"-"+He[e&63|128]+He[e>>8&255]+"-"+He[e>>16&255]+He[e>>24&255]+He[i&255]+He[i>>8&255]+He[i>>16&255]+He[i>>24&255]).toLowerCase()}function Wt(r,t,e){return Math.max(t,Math.min(e,r))}function Vo(r,t){return(r%t+t)%t}function nu(r,t,e,i,n){return i+(r-t)*(n-i)/(e-t)}function su(r,t,e){return r!==t?(e-r)/(t-r):0}function Ds(r,t,e){return(1-e)*r+e*t}function ru(r,t,e,i){return Ds(r,t,1-Math.exp(-e*i))}function au(r,t=1){return t-Math.abs(Vo(r,t*2)-t)}function ou(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function lu(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function cu(r,t){return r+Math.floor(Math.random()*(t-r+1))}function hu(r,t){return r+Math.random()*(t-r)}function uu(r){return r*(.5-Math.random())}function du(r){r!==void 0&&(ul=r);let t=ul+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function fu(r){return r*Ps}function pu(r){return r*zs}function mu(r){return(r&r-1)===0&&r!==0}function gu(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function _u(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function vu(r,t,e,i,n){const s=Math.cos,a=Math.sin,o=s(e/2),l=a(e/2),c=s((t+i)/2),u=a((t+i)/2),h=s((t-i)/2),d=a((t-i)/2),p=s((i-t)/2),g=a((i-t)/2);switch(n){case"XYX":r.set(o*u,l*h,l*d,o*c);break;case"YZY":r.set(l*d,o*u,l*h,o*c);break;case"ZXZ":r.set(l*h,l*d,o*u,o*c);break;case"XZX":r.set(o*u,l*g,l*p,o*c);break;case"YXY":r.set(l*p,o*u,l*g,o*c);break;case"ZYZ":r.set(l*g,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function gi(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ee(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Kt={DEG2RAD:Ps,RAD2DEG:zs,generateUUID:Vi,clamp:Wt,euclideanModulo:Vo,mapLinear:nu,inverseLerp:su,lerp:Ds,damp:ru,pingpong:au,smoothstep:ou,smootherstep:lu,randInt:cu,randFloat:hu,randFloatSpread:uu,seededRandom:du,degToRad:fu,radToDeg:pu,isPowerOfTwo:mu,ceilPowerOfTwo:gu,floorPowerOfTwo:_u,setQuaternionFromProperEuler:vu,normalize:ee,denormalize:gi};class ht{constructor(t=0,e=0){ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Wt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Wt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*n+t.x,this.y=s*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Cn{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,a,o){let l=i[n+0],c=i[n+1],u=i[n+2],h=i[n+3];const d=s[a+0],p=s[a+1],g=s[a+2],_=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==d||c!==p||u!==g){let m=1-o;const f=l*d+c*p+u*g+h*_,w=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){const P=Math.sqrt(b),E=Math.atan2(P,f*w);m=Math.sin(m*E)/P,o=Math.sin(o*E)/P}const M=o*w;if(l=l*m+d*M,c=c*m+p*M,u=u*m+g*M,h=h*m+_*M,m===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=P,c*=P,u*=P,h*=P}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,n,s,a){const o=i[n],l=i[n+1],c=i[n+2],u=i[n+3],h=s[a],d=s[a+1],p=s[a+2],g=s[a+3];return t[e]=o*g+u*h+l*p-c*d,t[e+1]=l*g+u*d+c*h-o*p,t[e+2]=c*g+u*p+o*d-l*h,t[e+3]=u*g-o*h-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(n/2),h=o(s/2),d=l(i/2),p=l(n/2),g=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=i+o+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-n)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(u-l)/p,this._x=.25*p,this._y=(n+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-c)/p,this._x=(n+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-n)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Wt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=i*u+a*o+n*c-s*l,this._y=n*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-n*o,this._w=a*u-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,n=this._y,s=this._z,a=this._w;let o=a*t._w+i*t._x+n*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*n+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=a*h+this._w*d,this._x=i*h+this._x*d,this._y=n*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(t=0,e=0,i=0){T.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(dl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(dl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),u=2*(o*e-s*n),h=2*(s*i-a*e);return this.x=e+l*c+a*h-o*u,this.y=i+l*u+o*c-s*h,this.z=n+l*h+s*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Wt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ta.copy(this).projectOnVector(t),this.sub(ta)}reflect(t){return this.sub(ta.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Wt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ta=new T,dl=new Cn;class Bt{constructor(t,e,i,n,s,a,o,l,c){Bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c)}set(t,e,i,n,s,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=n,u[2]=o,u[3]=e,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],p=i[5],g=i[8],_=n[0],m=n[3],f=n[6],w=n[1],b=n[4],M=n[7],P=n[2],E=n[5],A=n[8];return s[0]=a*_+o*w+l*P,s[3]=a*m+o*b+l*E,s[6]=a*f+o*M+l*A,s[1]=c*_+u*w+h*P,s[4]=c*m+u*b+h*E,s[7]=c*f+u*M+h*A,s[2]=d*_+p*w+g*P,s[5]=d*m+p*b+g*E,s[8]=d*f+p*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-i*s*u+i*o*l+n*s*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*a-o*c,d=o*l-u*s,p=c*s-a*l,g=e*h+i*d+n*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(n*c-u*i)*_,t[2]=(o*i-n*a)*_,t[3]=d*_,t[4]=(u*e-n*l)*_,t[5]=(n*s-o*e)*_,t[6]=p*_,t[7]=(i*l-c*e)*_,t[8]=(a*e-i*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ea.makeScale(t,e)),this}rotate(t){return this.premultiply(ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ea=new Bt;function Yc(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function zr(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function xu(){const r=zr("canvas");return r.style.display="block",r}const fl={};function Qn(r){r in fl||(fl[r]=!0,console.warn(r))}function Mu(r,t,e){return new Promise(function(i,n){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const pl=new Bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ml=new Bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function yu(){const r={enabled:!0,workingColorSpace:ss,spaces:{},convert:function(n,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===te&&(n.r=Gi(n.r),n.g=Gi(n.g),n.b=Gi(n.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===te&&(n.r=ts(n.r),n.g=ts(n.g),n.b=ts(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Zi?Or:this.spaces[n].transfer},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,a){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return Qn("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return Qn("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(n,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[ss]:{primaries:t,whitePoint:i,transfer:Or,toXYZ:pl,fromXYZ:ml,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:i,transfer:te,toXYZ:pl,fromXYZ:ml,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),r}const Yt=yu();function Gi(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function ts(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let In;class Su{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{In===void 0&&(In=zr("canvas")),In.width=t.width,In.height=t.height;const n=In.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=In}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=zr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=Gi(s[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Gi(e[i]/255)*255):e[i]=Gi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let wu=0;class Go{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Vi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(ia(n[a].image)):s.push(ia(n[a]))}else s=ia(n);i.url=s}return e||(t.images[this.uuid]=i),i}}function ia(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Su.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bu=0;const na=new T;class Xe extends cs{constructor(t=Xe.DEFAULT_IMAGE,e=Xe.DEFAULT_MAPPING,i=bn,n=bn,s=_i,a=Ji,o=di,l=Ci,c=Xe.DEFAULT_ANISOTROPY,u=Zi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=Vi(),this.name="",this.source=new Go(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(na).x}get height(){return this.source.getSize(na).y}get depth(){return this.source.getSize(na).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==zc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Us:t.x=t.x-Math.floor(t.x);break;case bn:t.x=t.x<0?0:1;break;case Ya:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Us:t.y=t.y-Math.floor(t.y);break;case bn:t.y=t.y<0?0:1;break;case Ya:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=zc;Xe.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,i=0,n=1){ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(c+1)/2,M=(p+1)/2,P=(f+1)/2,E=(u+d)/4,A=(h+_)/4,D=(g+m)/4;return b>M&&b>P?b<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(b),n=E/i,s=A/i):M>P?M<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(M),i=E/n,s=D/n):P<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(P),i=A/s,n=D/s),this.set(i,n,s,e),this}let w=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(h-_)/w,this.z=(d-u)/w,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Wt(this.x,t.x,e.x),this.y=Wt(this.y,t.y,e.y),this.z=Wt(this.z,t.z,e.z),this.w=Wt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Wt(this.x,t,e),this.y=Wt(this.y,t,e),this.z=Wt(this.z,t,e),this.w=Wt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Wt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tu extends cs{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:_i,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new ne(0,0,t,e),this.scissorTest=!1,this.viewport=new ne(0,0,t,e);const n={width:t,height:e,depth:i.depth},s=new Xe(n);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:_i,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isArrayTexture=this.textures[n].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new Go(n)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xi extends Tu{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Kc extends Xe{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ri,this.minFilter=ri,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Eu extends Xe{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ri,this.minFilter=ri,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rn{constructor(t=new T(1/0,1/0,1/0),e=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(fi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(fi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=fi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,fi):fi.fromBufferAttribute(s,a),fi.applyMatrix4(t.matrixWorld),this.expandByPoint(fi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Zs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zs.copy(i.boundingBox)),Zs.applyMatrix4(t.matrixWorld),this.union(Zs)}const n=t.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fi),fi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(fs),Js.subVectors(this.max,fs),Un.subVectors(t.a,fs),Nn.subVectors(t.b,fs),Fn.subVectors(t.c,fs),Xi.subVectors(Nn,Un),qi.subVectors(Fn,Nn),hn.subVectors(Un,Fn);let e=[0,-Xi.z,Xi.y,0,-qi.z,qi.y,0,-hn.z,hn.y,Xi.z,0,-Xi.x,qi.z,0,-qi.x,hn.z,0,-hn.x,-Xi.y,Xi.x,0,-qi.y,qi.x,0,-hn.y,hn.x,0];return!sa(e,Un,Nn,Fn,Js)||(e=[1,0,0,0,1,0,0,0,1],!sa(e,Un,Nn,Fn,Js))?!1:(Qs.crossVectors(Xi,qi),e=[Qs.x,Qs.y,Qs.z],sa(e,Un,Nn,Fn,Js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Pi=[new T,new T,new T,new T,new T,new T,new T,new T],fi=new T,Zs=new Rn,Un=new T,Nn=new T,Fn=new T,Xi=new T,qi=new T,hn=new T,fs=new T,Js=new T,Qs=new T,un=new T;function sa(r,t,e,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){un.fromArray(r,s);const o=n.x*Math.abs(un.x)+n.y*Math.abs(un.y)+n.z*Math.abs(un.z),l=t.dot(un),c=e.dot(un),u=i.dot(un);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Au=new Rn,ps=new T,ra=new T;class Pn{constructor(t=new T,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Au.setFromPoints(t).getCenter(i);let n=0;for(let s=0,a=t.length;s<a;s++)n=Math.max(n,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ps.subVectors(t,this.center);const e=ps.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(ps,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ra.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ps.copy(t.center).add(ra)),this.expandByPoint(ps.copy(t.center).sub(ra))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Di=new T,aa=new T,tr=new T,ji=new T,oa=new T,er=new T,la=new T;class Tn{constructor(t=new T,e=new T(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Di)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Di.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Di.copy(this.origin).addScaledVector(this.direction,e),Di.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){aa.copy(t).add(e).multiplyScalar(.5),tr.copy(e).sub(t).normalize(),ji.copy(this.origin).sub(aa);const s=t.distanceTo(e)*.5,a=-this.direction.dot(tr),o=ji.dot(this.direction),l=-ji.dot(tr),c=ji.lengthSq(),u=Math.abs(1-a*a);let h,d,p,g;if(u>0)if(h=a*l-o,d=a*o-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,p=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),n&&n.copy(aa).addScaledVector(tr,d),p}intersectSphere(t,e){Di.subVectors(t.center,this.origin);const i=Di.dot(this.direction),n=Di.dot(Di)-i*i,s=t.radius*t.radius;if(n>s)return null;const a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,n=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,n=(t.min.x-d.x)*c),u>=0?(s=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),i>a||s>n||((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),h>=0?(o=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,Di)!==null}intersectTriangle(t,e,i,n,s){oa.subVectors(e,t),er.subVectors(i,t),la.crossVectors(oa,er);let a=this.direction.dot(la),o;if(a>0){if(n)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ji.subVectors(this.origin,t);const l=o*this.direction.dot(er.crossVectors(ji,er));if(l<0)return null;const c=o*this.direction.dot(oa.cross(ji));if(c<0||l+c>a)return null;const u=-o*ji.dot(la);return u<0?null:this.at(u/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Jt{constructor(t,e,i,n,s,a,o,l,c,u,h,d,p,g,_,m){Jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c,u,h,d,p,g,_,m)}set(t,e,i,n,s,a,o,l,c,u,h,d,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=n,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,n=1/On.setFromMatrixColumn(t,0).length(),s=1/On.setFromMatrixColumn(t,1).length(),a=1/On.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=a*u,p=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*u,p=l*h,g=c*u,_=c*h;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*u,p=l*h,g=c*u,_=c*h;e[0]=d-_*o,e[4]=-a*h,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*u,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*u,p=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=g*c-p,e[8]=d*c+_,e[1]=l*h,e[5]=_*c+d,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=_-d*h,e[8]=g*h+p,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=p*h+g,e[10]=d-_*h}else if(t.order==="XZY"){const d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+_,e[5]=a*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=o*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Cu,t,Ru)}lookAt(t,e,i){const n=this.elements;return ei.subVectors(t,e),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),Yi.crossVectors(i,ei),Yi.lengthSq()===0&&(Math.abs(i.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),Yi.crossVectors(i,ei)),Yi.normalize(),ir.crossVectors(ei,Yi),n[0]=Yi.x,n[4]=ir.x,n[8]=ei.x,n[1]=Yi.y,n[5]=ir.y,n[9]=ei.y,n[2]=Yi.z,n[6]=ir.z,n[10]=ei.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],w=i[3],b=i[7],M=i[11],P=i[15],E=n[0],A=n[4],D=n[8],y=n[12],x=n[1],R=n[5],B=n[9],F=n[13],z=n[2],q=n[6],G=n[10],K=n[14],V=n[3],rt=n[7],ut=n[11],Et=n[15];return s[0]=a*E+o*x+l*z+c*V,s[4]=a*A+o*R+l*q+c*rt,s[8]=a*D+o*B+l*G+c*ut,s[12]=a*y+o*F+l*K+c*Et,s[1]=u*E+h*x+d*z+p*V,s[5]=u*A+h*R+d*q+p*rt,s[9]=u*D+h*B+d*G+p*ut,s[13]=u*y+h*F+d*K+p*Et,s[2]=g*E+_*x+m*z+f*V,s[6]=g*A+_*R+m*q+f*rt,s[10]=g*D+_*B+m*G+f*ut,s[14]=g*y+_*F+m*K+f*Et,s[3]=w*E+b*x+M*z+P*V,s[7]=w*A+b*R+M*q+P*rt,s[11]=w*D+b*B+M*G+P*ut,s[15]=w*y+b*F+M*K+P*Et,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+s*l*h-n*c*h-s*o*d+i*c*d+n*o*p-i*l*p)+_*(+e*l*p-e*c*d+s*a*d-n*a*p+n*c*u-s*l*u)+m*(+e*c*h-e*o*p-s*a*h+i*a*p+s*o*u-i*c*u)+f*(-n*o*u-e*l*h+e*o*d+n*a*h-i*a*d+i*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],w=h*m*c-_*d*c+_*l*p-o*m*p-h*l*f+o*d*f,b=g*d*c-u*m*c-g*l*p+a*m*p+u*l*f-a*d*f,M=u*_*c-g*h*c+g*o*p-a*_*p-u*o*f+a*h*f,P=g*h*l-u*_*l-g*o*d+a*_*d+u*o*m-a*h*m,E=e*w+i*b+n*M+s*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=w*A,t[1]=(_*d*s-h*m*s-_*n*p+i*m*p+h*n*f-i*d*f)*A,t[2]=(o*m*s-_*l*s+_*n*c-i*m*c-o*n*f+i*l*f)*A,t[3]=(h*l*s-o*d*s-h*n*c+i*d*c+o*n*p-i*l*p)*A,t[4]=b*A,t[5]=(u*m*s-g*d*s+g*n*p-e*m*p-u*n*f+e*d*f)*A,t[6]=(g*l*s-a*m*s-g*n*c+e*m*c+a*n*f-e*l*f)*A,t[7]=(a*d*s-u*l*s+u*n*c-e*d*c-a*n*p+e*l*p)*A,t[8]=M*A,t[9]=(g*h*s-u*_*s-g*i*p+e*_*p+u*i*f-e*h*f)*A,t[10]=(a*_*s-g*o*s+g*i*c-e*_*c-a*i*f+e*o*f)*A,t[11]=(u*o*s-a*h*s-u*i*c+e*h*c+a*i*p-e*o*p)*A,t[12]=P*A,t[13]=(u*_*n-g*h*n+g*i*d-e*_*d-u*i*m+e*h*m)*A,t[14]=(g*o*n-a*_*n-g*i*l+e*_*l+a*i*m-e*o*m)*A,t[15]=(a*h*n-u*o*n+u*i*l-e*h*l-a*i*d+e*o*d)*A,this}scale(t){const e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,u*o+i,u*l-n*a,0,c*l-n*o,u*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,a){return this.set(1,i,s,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,u=a+a,h=o+o,d=s*c,p=s*u,g=s*h,_=a*u,m=a*h,f=o*h,w=l*c,b=l*u,M=l*h,P=i.x,E=i.y,A=i.z;return n[0]=(1-(_+f))*P,n[1]=(p+M)*P,n[2]=(g-b)*P,n[3]=0,n[4]=(p-M)*E,n[5]=(1-(d+f))*E,n[6]=(m+w)*E,n[7]=0,n[8]=(g+b)*A,n[9]=(m-w)*A,n[10]=(1-(d+_))*A,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;let s=On.set(n[0],n[1],n[2]).length();const a=On.set(n[4],n[5],n[6]).length(),o=On.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),t.x=n[12],t.y=n[13],t.z=n[14],pi.copy(this);const c=1/s,u=1/a,h=1/o;return pi.elements[0]*=c,pi.elements[1]*=c,pi.elements[2]*=c,pi.elements[4]*=u,pi.elements[5]*=u,pi.elements[6]*=u,pi.elements[8]*=h,pi.elements[9]*=h,pi.elements[10]*=h,e.setFromRotationMatrix(pi),i.x=s,i.y=a,i.z=o,this}makePerspective(t,e,i,n,s,a,o=Ai,l=!1){const c=this.elements,u=2*s/(e-t),h=2*s/(i-n),d=(e+t)/(e-t),p=(i+n)/(i-n);let g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===Ai)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Br)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,s,a,o=Ai,l=!1){const c=this.elements,u=2/(e-t),h=2/(i-n),d=-(e+t)/(e-t),p=-(i+n)/(i-n);let g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===Ai)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Br)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const On=new T,pi=new Jt,Cu=new T(0,0,0),Ru=new T(1,1,1),Yi=new T,ir=new T,ei=new T,gl=new Jt,_l=new Cn;class yi{constructor(t=0,e=0,i=0,n=yi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],u=n[9],h=n[2],d=n[6],p=n[10];switch(e){case"XYZ":this._y=Math.asin(Wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Wt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Wt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return gl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(gl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _l.setFromEuler(this),this.setFromQuaternion(_l,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yi.DEFAULT_ORDER="XYZ";class Wo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Pu=0;const vl=new T,Bn=new Cn,Li=new Jt,nr=new T,ms=new T,Du=new T,Lu=new Cn,xl=new T(1,0,0),Ml=new T(0,1,0),yl=new T(0,0,1),Sl={type:"added"},Iu={type:"removed"},zn={type:"childadded",child:null},ca={type:"childremoved",child:null};class oe extends cs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pu++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=oe.DEFAULT_UP.clone();const t=new T,e=new yi,i=new Cn,n=new T(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Jt},normalMatrix:{value:new Bt}}),this.matrix=new Jt,this.matrixWorld=new Jt,this.matrixAutoUpdate=oe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bn.setFromAxisAngle(t,e),this.quaternion.multiply(Bn),this}rotateOnWorldAxis(t,e){return Bn.setFromAxisAngle(t,e),this.quaternion.premultiply(Bn),this}rotateX(t){return this.rotateOnAxis(xl,t)}rotateY(t){return this.rotateOnAxis(Ml,t)}rotateZ(t){return this.rotateOnAxis(yl,t)}translateOnAxis(t,e){return vl.copy(t).applyQuaternion(this.quaternion),this.position.add(vl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(xl,t)}translateY(t){return this.translateOnAxis(Ml,t)}translateZ(t){return this.translateOnAxis(yl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Li.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?nr.copy(t):nr.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Li.lookAt(ms,nr,this.up):Li.lookAt(nr,ms,this.up),this.quaternion.setFromRotationMatrix(Li),n&&(Li.extractRotation(n.matrixWorld),Bn.setFromRotationMatrix(Li),this.quaternion.premultiply(Bn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Sl),zn.child=t,this.dispatchEvent(zn),zn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Iu),ca.child=t,this.dispatchEvent(ca),ca.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Li.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Li.multiply(t.parent.matrixWorld)),t.applyMatrix4(Li),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Sl),zn.child=t,this.dispatchEvent(zn),zn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,t,Du),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,Lu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));n.material=o}else n.material=s(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=n,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}}oe.DEFAULT_UP=new T(0,1,0);oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mi=new T,Ii=new T,ha=new T,Ui=new T,kn=new T,Hn=new T,wl=new T,ua=new T,da=new T,fa=new T,pa=new ne,ma=new ne,ga=new ne;class ui{constructor(t=new T,e=new T,i=new T){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),mi.subVectors(t,e),n.cross(mi);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(t,e,i,n,s){mi.subVectors(n,e),Ii.subVectors(i,e),ha.subVectors(t,e);const a=mi.dot(mi),o=mi.dot(Ii),l=mi.dot(ha),c=Ii.dot(Ii),u=Ii.dot(ha),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(c*l-o*u)*d,g=(a*u-o*l)*d;return s.set(1-p-g,g,p)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,Ui)===null?!1:Ui.x>=0&&Ui.y>=0&&Ui.x+Ui.y<=1}static getInterpolation(t,e,i,n,s,a,o,l){return this.getBarycoord(t,e,i,n,Ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ui.x),l.addScaledVector(a,Ui.y),l.addScaledVector(o,Ui.z),l)}static getInterpolatedAttribute(t,e,i,n,s,a){return pa.setScalar(0),ma.setScalar(0),ga.setScalar(0),pa.fromBufferAttribute(t,e),ma.fromBufferAttribute(t,i),ga.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(pa,s.x),a.addScaledVector(ma,s.y),a.addScaledVector(ga,s.z),a}static isFrontFacing(t,e,i,n){return mi.subVectors(i,e),Ii.subVectors(t,e),mi.cross(Ii).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mi.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),mi.cross(Ii).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return ui.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return ui.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,s){return ui.getInterpolation(t,this.a,this.b,this.c,e,i,n,s)}containsPoint(t){return ui.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ui.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,s=this.c;let a,o;kn.subVectors(n,i),Hn.subVectors(s,i),ua.subVectors(t,i);const l=kn.dot(ua),c=Hn.dot(ua);if(l<=0&&c<=0)return e.copy(i);da.subVectors(t,n);const u=kn.dot(da),h=Hn.dot(da);if(u>=0&&h<=u)return e.copy(n);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(i).addScaledVector(kn,a);fa.subVectors(t,s);const p=kn.dot(fa),g=Hn.dot(fa);if(g>=0&&p<=g)return e.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(Hn,o);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return wl.subVectors(s,n),o=(h-u)/(h-u+(p-g)),e.copy(n).addScaledVector(wl,o);const f=1/(m+_+d);return a=_*f,o=d*f,e.copy(i).addScaledVector(kn,a).addScaledVector(Hn,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const $c={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ki={h:0,s:0,l:0},sr={h:0,s:0,l:0};function _a(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class _t{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Yt.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=Yt.workingColorSpace){if(t=Vo(t,1),e=Wt(e,0,1),i=Wt(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=_a(a,s,t+1/3),this.g=_a(a,s,t),this.b=_a(a,s,t-1/3)}return Yt.colorSpaceToWorking(this,n),this}setStyle(t,e=Be){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const i=$c[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gi(t.r),this.g=Gi(t.g),this.b=Gi(t.b),this}copyLinearToSRGB(t){return this.r=ts(t.r),this.g=ts(t.g),this.b=ts(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return Yt.workingToColorSpace(Ve.copy(this),t),Math.round(Wt(Ve.r*255,0,255))*65536+Math.round(Wt(Ve.g*255,0,255))*256+Math.round(Wt(Ve.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.workingToColorSpace(Ve.copy(this),e);const i=Ve.r,n=Ve.g,s=Ve.b,a=Math.max(i,n,s),o=Math.min(i,n,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(n-s)/h+(n<s?6:0);break;case n:l=(s-i)/h+2;break;case s:l=(i-n)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.workingToColorSpace(Ve.copy(this),e),t.r=Ve.r,t.g=Ve.g,t.b=Ve.b,t}getStyle(t=Be){Yt.workingToColorSpace(Ve.copy(this),t);const e=Ve.r,i=Ve.g,n=Ve.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Ki),this.setHSL(Ki.h+t,Ki.s+e,Ki.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Ki),t.getHSL(sr);const i=Ds(Ki.h,sr.h,e),n=Ds(Ki.s,sr.s,e),s=Ds(Ki.l,sr.l,e);return this.setHSL(i,n,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*n,this.g=s[1]*e+s[4]*i+s[7]*n,this.b=s[2]*e+s[5]*i+s[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ve=new _t;_t.NAMES=$c;let Uu=0;class Wi extends cs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=nn,this.side=an,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oa,this.blendDst=Ba,this.blendEquation=Sn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ln,this.stencilZFail=Ln,this.stencilZPass=Ln,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==nn&&(i.blending=this.blending),this.side!==an&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Oa&&(i.blendSrc=this.blendSrc),this.blendDst!==Ba&&(i.blendDst=this.blendDst),this.blendEquation!==Sn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==es&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ln&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ln&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ln&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=n(t.textures),a=n(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ke extends Wi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Io,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ce=new T,rr=new ht;let Nu=0;class ke{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Nu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=So,this.updateRanges=[],this.gpuType=Ei,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)rr.fromBufferAttribute(this,e),rr.applyMatrix3(t),this.setXY(e,rr.x,rr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=gi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ee(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),n=ee(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),n=ee(n,this.array),s=ee(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==So&&(t.usage=this.usage),t}}class Zc extends ke{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Jc extends ke{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class Gt extends ke{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Fu=0;const ci=new Jt,va=new oe,Vn=new T,ii=new Rn,gs=new Rn,Ne=new T;class se extends cs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Yc(t)?Jc:Zc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Bt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ci.makeRotationFromQuaternion(t),this.applyMatrix4(ci),this}rotateX(t){return ci.makeRotationX(t),this.applyMatrix4(ci),this}rotateY(t){return ci.makeRotationY(t),this.applyMatrix4(ci),this}rotateZ(t){return ci.makeRotationZ(t),this.applyMatrix4(ci),this}translate(t,e,i){return ci.makeTranslation(t,e,i),this.applyMatrix4(ci),this}scale(t,e,i){return ci.makeScale(t,e,i),this.applyMatrix4(ci),this}lookAt(t){return va.lookAt(t),va.updateMatrix(),this.applyMatrix4(va.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vn).negate(),this.translate(Vn.x,Vn.y,Vn.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,s=t.length;n<s;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Gt(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const s=e[i];ii.setFromBufferAttribute(s),this.morphTargetsRelative?(Ne.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(Ne),Ne.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(Ne)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(t){const i=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ne.addVectors(ii.min,gs.min),ii.expandByPoint(Ne),Ne.addVectors(ii.max,gs.max),ii.expandByPoint(Ne)):(ii.expandByPoint(gs.min),ii.expandByPoint(gs.max))}ii.getCenter(i);let n=0;for(let s=0,a=t.count;s<a;s++)Ne.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(Ne));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ne.fromBufferAttribute(o,c),l&&(Vn.fromBufferAttribute(t,c),Ne.add(Vn)),n=Math.max(n,i.distanceToSquared(Ne))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<i.count;D++)o[D]=new T,l[D]=new T;const c=new T,u=new T,h=new T,d=new ht,p=new ht,g=new ht,_=new T,m=new T;function f(D,y,x){c.fromBufferAttribute(i,D),u.fromBufferAttribute(i,y),h.fromBufferAttribute(i,x),d.fromBufferAttribute(s,D),p.fromBufferAttribute(s,y),g.fromBufferAttribute(s,x),u.sub(c),h.sub(c),p.sub(d),g.sub(d);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(R),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(R),o[D].add(_),o[y].add(_),o[x].add(_),l[D].add(m),l[y].add(m),l[x].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let D=0,y=w.length;D<y;++D){const x=w[D],R=x.start,B=x.count;for(let F=R,z=R+B;F<z;F+=3)f(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const b=new T,M=new T,P=new T,E=new T;function A(D){P.fromBufferAttribute(n,D),E.copy(P);const y=o[D];b.copy(y),b.sub(P.multiplyScalar(P.dot(y))).normalize(),M.crossVectors(E,y);const R=M.dot(l[D])<0?-1:1;a.setXYZW(D,b.x,b.y,b.z,R)}for(let D=0,y=w.length;D<y;++D){const x=w[D],R=x.start,B=x.count;for(let F=R,z=R+B;F<z;F+=3)A(t.getX(F+0)),A(t.getX(F+1)),A(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ke(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const n=new T,s=new T,a=new T,o=new T,l=new T,c=new T,u=new T,h=new T;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);n.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),u.subVectors(a,s),h.subVectors(n,s),u.cross(h),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)n.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,s),h.subVectors(n,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ne.fromBufferAttribute(t,e),Ne.normalize(),t.setXYZ(e,Ne.x,Ne.y,Ne.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*u;for(let f=0;f<u;f++)d[g++]=c[p++]}return new ke(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new se,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=t(d,i);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(n[l]=u,s=!0)}s&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const c in n){const u=n[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bl=new Jt,dn=new Tn,ar=new Pn,Tl=new T,or=new T,lr=new T,cr=new T,xa=new T,hr=new T,El=new T,ur=new T;class qt extends oe{constructor(t=new se,e=new Ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(s&&o){hr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(xa.fromBufferAttribute(h,t),a?hr.addScaledVector(xa,u):hr.addScaledVector(xa.sub(e),u))}e.add(hr)}return e}raycast(t,e){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere),ar.applyMatrix4(s),dn.copy(t.ray).recast(t.near),!(ar.containsPoint(dn.origin)===!1&&(dn.intersectSphere(ar,Tl)===null||dn.origin.distanceToSquared(Tl)>(t.far-t.near)**2))&&(bl.copy(s).invert(),dn.copy(t.ray).applyMatrix4(bl),!(i.boundingBox!==null&&dn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,dn)))}_computeIntersections(t,e,i){let n;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),b=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let M=w,P=b;M<P;M+=3){const E=o.getX(M),A=o.getX(M+1),D=o.getX(M+2);n=dr(this,f,t,i,c,u,h,E,A,D),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const w=o.getX(m),b=o.getX(m+1),M=o.getX(m+2);n=dr(this,a,t,i,c,u,h,w,b,M),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=w,P=b;M<P;M+=3){const E=M,A=M+1,D=M+2;n=dr(this,f,t,i,c,u,h,E,A,D),n&&(n.faceIndex=Math.floor(M/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const w=m,b=m+1,M=m+2;n=dr(this,a,t,i,c,u,h,w,b,M),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}}}function Ou(r,t,e,i,n,s,a,o){let l;if(t.side===$e?l=i.intersectTriangle(a,s,n,!0,o):l=i.intersectTriangle(n,s,a,t.side===an,o),l===null)return null;ur.copy(o),ur.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(ur);return c<e.near||c>e.far?null:{distance:c,point:ur.clone(),object:r}}function dr(r,t,e,i,n,s,a,o,l,c){r.getVertexPosition(o,or),r.getVertexPosition(l,lr),r.getVertexPosition(c,cr);const u=Ou(r,t,e,i,or,lr,cr,El);if(u){const h=new T;ui.getBarycoord(El,or,lr,cr,h),n&&(u.uv=ui.getInterpolatedAttribute(n,o,l,c,h,new ht)),s&&(u.uv1=ui.getInterpolatedAttribute(s,o,l,c,h,new ht)),a&&(u.normal=ui.getInterpolatedAttribute(a,o,l,c,h,new T),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new T,materialIndex:0};ui.getNormal(or,lr,cr,d.normal),u.face=d,u.barycoord=h}return u}class Ae extends se{constructor(t=1,e=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};const o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,p=0;g("z","y","x",-1,-1,i,e,t,a,s,0),g("z","y","x",1,-1,i,e,-t,a,s,1),g("x","z","y",1,1,t,i,e,n,a,2),g("x","z","y",1,-1,t,i,-e,n,a,3),g("x","y","z",1,-1,t,e,i,n,s,4),g("x","y","z",-1,-1,t,e,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(u,3)),this.setAttribute("uv",new Gt(h,2));function g(_,m,f,w,b,M,P,E,A,D,y){const x=M/A,R=P/D,B=M/2,F=P/2,z=E/2,q=A+1,G=D+1;let K=0,V=0;const rt=new T;for(let ut=0;ut<G;ut++){const Et=ut*R-F;for(let kt=0;kt<q;kt++){const pe=kt*x-B;rt[_]=pe*w,rt[m]=Et*b,rt[f]=z,c.push(rt.x,rt.y,rt.z),rt[_]=0,rt[m]=0,rt[f]=E>0?1:-1,u.push(rt.x,rt.y,rt.z),h.push(kt/A),h.push(1-ut/D),K+=1}}for(let ut=0;ut<D;ut++)for(let Et=0;Et<A;Et++){const kt=d+Et+q*ut,pe=d+Et+q*(ut+1),re=d+(Et+1)+q*(ut+1),j=d+(Et+1)+q*ut;l.push(kt,pe,j),l.push(pe,re,j),V+=6}o.addGroup(p,V,y),p+=V,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ae(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function rs(r){const t={};for(const e in r){t[e]={};for(const i in r[e]){const n=r[e][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone():Array.isArray(n)?t[e][i]=n.slice():t[e][i]=n}}return t}function Ye(r){const t={};for(let e=0;e<r.length;e++){const i=rs(r[e]);for(const n in i)t[n]=i[n]}return t}function Bu(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Qc(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const ks={clone:rs,merge:Ye};var zu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ku=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ze extends Wi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zu,this.fragmentShader=ku,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=rs(t.uniforms),this.uniformsGroups=Bu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class th extends oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Jt,this.projectionMatrix=new Jt,this.projectionMatrixInverse=new Jt,this.coordinateSystem=Ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const $i=new T,Al=new ht,Cl=new ht;class ni extends th{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ps*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){$i.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set($i.x,$i.y).multiplyScalar(-t/$i.z),$i.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set($i.x,$i.y).multiplyScalar(-t/$i.z)}getViewSize(t,e){return this.getViewBounds(t,Al,Cl),e.subVectors(Cl,Al)}setViewOffset(t,e,i,n,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ps*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,s=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Gn=-90,Wn=1;class Hu extends oe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ni(Gn,Wn,t,e);n.layers=this.layers,this.add(n);const s=new ni(Gn,Wn,t,e);s.layers=this.layers,this.add(s);const a=new ni(Gn,Wn,t,e);a.layers=this.layers,this.add(a);const o=new ni(Gn,Wn,t,e);o.layers=this.layers,this.add(o);const l=new ni(Gn,Wn,t,e);l.layers=this.layers,this.add(l);const c=new ni(Gn,Wn,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===Ai)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Br)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,n),t.render(e,s),t.setRenderTarget(i,1,n),t.render(e,a),t.setRenderTarget(i,2,n),t.render(e,o),t.setRenderTarget(i,3,n),t.render(e,l),t.setRenderTarget(i,4,n),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,n),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class eh extends Xe{constructor(t=[],e=is,i,n,s,a,o,l,c,u){super(t,e,i,n,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Vu extends xi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new eh(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Ae(5,5,5),s=new ze({name:"CubemapFromEquirect",uniforms:rs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$e,blending:ki});s.uniforms.tEquirect.value=e;const a=new qt(n,s),o=e.minFilter;return e.minFilter===Ji&&(e.minFilter=_i),new Hu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(s)}}class yt extends oe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Gu={type:"move"};class Ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gu)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new yt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Xo{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new _t(t),this.density=e}clone(){return new Xo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Wu extends oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Xu{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=So,this.updateRanges=[],this.version=0,this.uuid=Vi()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,s=this.stride;n<s;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Vi()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const je=new T;class kr{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyMatrix4(t),this.setXYZ(e,je.x,je.y,je.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.applyNormalMatrix(t),this.setXYZ(e,je.x,je.y,je.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)je.fromBufferAttribute(this,e),je.transformDirection(t),this.setXYZ(e,je.x,je.y,je.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=gi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ee(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ee(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=gi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=gi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=gi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=gi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),n=ee(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ee(e,this.array),i=ee(i,this.array),n=ee(n,this.array),s=ee(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return new ke(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new kr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ih extends Wi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new _t(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Xn;const _s=new T,qn=new T,jn=new T,Yn=new ht,vs=new ht,nh=new Jt,fr=new T,xs=new T,pr=new T,Rl=new ht,ya=new ht,Pl=new ht;class qu extends oe{constructor(t=new ih){if(super(),this.isSprite=!0,this.type="Sprite",Xn===void 0){Xn=new se;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Xu(e,5);Xn.setIndex([0,1,2,0,2,3]),Xn.setAttribute("position",new kr(i,3,0,!1)),Xn.setAttribute("uv",new kr(i,2,3,!1))}this.geometry=Xn,this.material=t,this.center=new ht(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qn.setFromMatrixScale(this.matrixWorld),nh.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),jn.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qn.multiplyScalar(-jn.z);const i=this.material.rotation;let n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));const a=this.center;mr(fr.set(-.5,-.5,0),jn,a,qn,n,s),mr(xs.set(.5,-.5,0),jn,a,qn,n,s),mr(pr.set(.5,.5,0),jn,a,qn,n,s),Rl.set(0,0),ya.set(1,0),Pl.set(1,1);let o=t.ray.intersectTriangle(fr,xs,pr,!1,_s);if(o===null&&(mr(xs.set(-.5,.5,0),jn,a,qn,n,s),ya.set(0,1),o=t.ray.intersectTriangle(fr,pr,xs,!1,_s),o===null))return;const l=t.ray.origin.distanceTo(_s);l<t.near||l>t.far||e.push({distance:l,point:_s.clone(),uv:ui.getInterpolation(_s,fr,xs,pr,Rl,ya,Pl,new ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function mr(r,t,e,i,n,s){Yn.subVectors(r,e).addScalar(.5).multiply(i),n!==void 0?(vs.x=s*Yn.x-n*Yn.y,vs.y=n*Yn.x+s*Yn.y):vs.copy(Yn),r.copy(t),r.x+=vs.x,r.y+=vs.y,r.applyMatrix4(nh)}class sh extends Xe{constructor(t=null,e=1,i=1,n,s,a,o,l,c=ri,u=ri,h,d){super(null,a,o,l,c,u,n,s,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Dl extends ke{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Kn=new Jt,Ll=new Jt,gr=[],Il=new Rn,ju=new Jt,Ms=new qt,ys=new Pn;class hi extends qt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Dl(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,ju)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Kn),Il.copy(t.boundingBox).applyMatrix4(Kn),this.boundingBox.union(Il)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Kn),ys.copy(t.boundingSphere).applyMatrix4(Kn),this.boundingSphere.union(ys)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,a=t*s+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(Ms.geometry=this.geometry,Ms.material=this.material,Ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ys.copy(this.boundingSphere),ys.applyMatrix4(i),t.ray.intersectsSphere(ys)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,Kn),Ll.multiplyMatrices(i,Kn),Ms.matrixWorld=Ll,Ms.raycast(t,gr);for(let a=0,o=gr.length;a<o;a++){const l=gr[a];l.instanceId=s,l.object=this,e.push(l)}gr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Dl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new sh(new Float32Array(n*this.count),n,this.count,Oo,Ei));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Sa=new T,Yu=new T,Ku=new Bt;class xn{constructor(t=new T(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=Sa.subVectors(i,e).cross(Yu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Sa),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Ku.getNormalMatrix(t),n=this.coplanarPoint(Sa).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fn=new Pn,$u=new ht(.5,.5),_r=new T;class qo{constructor(t=new xn,e=new xn,i=new xn,n=new xn,s=new xn,a=new xn){this.planes=[t,e,i,n,s,a]}set(t,e,i,n,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ai,i=!1){const n=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],p=s[7],g=s[8],_=s[9],m=s[10],f=s[11],w=s[12],b=s[13],M=s[14],P=s[15];if(n[0].setComponents(c-a,p-u,f-g,P-w).normalize(),n[1].setComponents(c+a,p+u,f+g,P+w).normalize(),n[2].setComponents(c+o,p+h,f+_,P+b).normalize(),n[3].setComponents(c-o,p-h,f-_,P-b).normalize(),i)n[4].setComponents(l,d,m,M).normalize(),n[5].setComponents(c-l,p-d,f-m,P-M).normalize();else if(n[4].setComponents(c-l,p-d,f-m,P-M).normalize(),e===Ai)n[5].setComponents(c+l,p+d,f+m,P+M).normalize();else if(e===Br)n[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fn)}intersectsSprite(t){fn.center.set(0,0,0);const e=$u.distanceTo(t.center);return fn.radius=.7071067811865476+e,fn.applyMatrix4(t.matrixWorld),this.intersectsSphere(fn)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(_r.x=n.normal.x>0?t.max.x:t.min.x,_r.y=n.normal.y>0?t.max.y:t.min.y,_r.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(_r)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Hr extends Wi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Vr=new T,Gr=new T,Ul=new Jt,Ss=new Tn,vr=new Pn,wa=new T,Nl=new T;class jo extends oe{constructor(t=new se,e=new Hr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let n=1,s=e.count;n<s;n++)Vr.fromBufferAttribute(e,n-1),Gr.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=Vr.distanceTo(Gr);t.setAttribute("lineDistance",new Gt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),vr.copy(i.boundingSphere),vr.applyMatrix4(n),vr.radius+=s,t.ray.intersectsSphere(vr)===!1)return;Ul.copy(n).invert(),Ss.copy(t.ray).applyMatrix4(Ul);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=u.getX(_),w=u.getX(_+1),b=xr(this,t,Ss,l,f,w,_);b&&e.push(b)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(p),f=xr(this,t,Ss,l,_,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=xr(this,t,Ss,l,_,_+1,_);f&&e.push(f)}if(this.isLineLoop){const _=xr(this,t,Ss,l,g-1,p,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function xr(r,t,e,i,n,s,a){const o=r.geometry.attributes.position;if(Vr.fromBufferAttribute(o,n),Gr.fromBufferAttribute(o,s),e.distanceSqToSegment(Vr,Gr,wa,Nl)>i)return;wa.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(wa);if(!(c<t.near||c>t.far))return{distance:c,point:Nl.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Fl=new T,Ol=new T;class Zu extends jo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let n=0,s=e.count;n<s;n+=2)Fl.fromBufferAttribute(e,n),Ol.fromBufferAttribute(e,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Fl.distanceTo(Ol);t.setAttribute("lineDistance",new Gt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qs extends Wi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new _t(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Bl=new Jt,wo=new Tn,Mr=new Pn,yr=new T;class jr extends oe{constructor(t=new se,e=new qs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Mr.copy(i.boundingSphere),Mr.applyMatrix4(n),Mr.radius+=s,t.ray.intersectsSphere(Mr)===!1)return;Bl.copy(n).invert(),wo.copy(t.ray).applyMatrix4(Bl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=d,_=p;g<_;g++){const m=c.getX(g);yr.fromBufferAttribute(h,m),zl(yr,m,l,n,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=d,_=p;g<_;g++)yr.fromBufferAttribute(h,g),zl(yr,g,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function zl(r,t,e,i,n,s,a){const o=wo.distanceSqToPoint(r);if(o<e){const l=new T;wo.closestPointToPoint(r,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class kl extends Xe{constructor(t,e,i,n,s,a,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class rh extends Xe{constructor(t,e,i=An,n,s,a,o=ri,l=ri,c,u=Os,h=1){if(u!==Os&&u!==Bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,n,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Go(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Bi extends se{constructor(t=1,e=1,i=4,n=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:n,heightSegments:s},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),s=Math.max(1,Math.floor(s));const a=[],o=[],l=[],c=[],u=e/2,h=Math.PI/2*t,d=e,p=2*h+d,g=i*2+s,_=n+1,m=new T,f=new T;for(let w=0;w<=g;w++){let b=0,M=0,P=0,E=0;if(w<=i){const y=w/i,x=y*Math.PI/2;M=-u-t*Math.cos(x),P=t*Math.sin(x),E=-t*Math.cos(x),b=y*h}else if(w<=i+s){const y=(w-i)/s;M=-u+y*e,P=t,E=0,b=h+y*d}else{const y=(w-i-s)/i,x=y*Math.PI/2;M=u+t*Math.sin(x),P=t*Math.cos(x),E=t*Math.sin(x),b=h+d+y*h}const A=Math.max(0,Math.min(1,b/p));let D=0;w===0?D=.5/n:w===g&&(D=-.5/n);for(let y=0;y<=n;y++){const x=y/n,R=x*Math.PI*2,B=Math.sin(R),F=Math.cos(R);f.x=-P*F,f.y=M,f.z=P*B,o.push(f.x,f.y,f.z),m.set(-P*F,E,P*B),m.normalize(),l.push(m.x,m.y,m.z),c.push(x+D,A)}if(w>0){const y=(w-1)*_;for(let x=0;x<n;x++){const R=y+x,B=y+x+1,F=w*_+x,z=w*_+x+1;a.push(R,B,F),a.push(B,z,F)}}}this.setIndex(a),this.setAttribute("position",new Gt(o,3)),this.setAttribute("normal",new Gt(l,3)),this.setAttribute("uv",new Gt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bi(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Hs extends se{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const s=[],a=[],o=[],l=[],c=new T,u=new ht;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const p=i+h/e*n;c.x=t*Math.cos(p),c.y=t*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new Gt(a,3)),this.setAttribute("normal",new Gt(o,3)),this.setAttribute("uv",new Gt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Vt extends se{constructor(t=1,e=1,i=1,n=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),s=Math.floor(s);const u=[],h=[],d=[],p=[];let g=0;const _=[],m=i/2;let f=0;w(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new Gt(h,3)),this.setAttribute("normal",new Gt(d,3)),this.setAttribute("uv",new Gt(p,2));function w(){const M=new T,P=new T;let E=0;const A=(e-t)/i;for(let D=0;D<=s;D++){const y=[],x=D/s,R=x*(e-t)+t;for(let B=0;B<=n;B++){const F=B/n,z=F*l+o,q=Math.sin(z),G=Math.cos(z);P.x=R*q,P.y=-x*i+m,P.z=R*G,h.push(P.x,P.y,P.z),M.set(q,A,G).normalize(),d.push(M.x,M.y,M.z),p.push(F,1-x),y.push(g++)}_.push(y)}for(let D=0;D<n;D++)for(let y=0;y<s;y++){const x=_[y][D],R=_[y+1][D],B=_[y+1][D+1],F=_[y][D+1];(t>0||y!==0)&&(u.push(x,R,F),E+=3),(e>0||y!==s-1)&&(u.push(R,B,F),E+=3)}c.addGroup(f,E,0),f+=E}function b(M){const P=g,E=new ht,A=new T;let D=0;const y=M===!0?t:e,x=M===!0?1:-1;for(let B=1;B<=n;B++)h.push(0,m*x,0),d.push(0,x,0),p.push(.5,.5),g++;const R=g;for(let B=0;B<=n;B++){const z=B/n*l+o,q=Math.cos(z),G=Math.sin(z);A.x=y*G,A.y=m*x,A.z=y*q,h.push(A.x,A.y,A.z),d.push(0,x,0),E.x=q*.5+.5,E.y=G*.5*x+.5,p.push(E.x,E.y),g++}for(let B=0;B<n;B++){const F=P+B,z=R+B;M===!0?u.push(z,z+1,F):u.push(z+1,z,F),D+=3}c.addGroup(f,D,M===!0?1:2),f+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class bi extends Vt{constructor(t=1,e=1,i=32,n=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new bi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class js extends se{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const s=[],a=[];o(n),c(i),u(),this.setAttribute("position",new Gt(s,3)),this.setAttribute("normal",new Gt(s.slice(),3)),this.setAttribute("uv",new Gt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(w){const b=new T,M=new T,P=new T;for(let E=0;E<e.length;E+=3)p(e[E+0],b),p(e[E+1],M),p(e[E+2],P),l(b,M,P,w)}function l(w,b,M,P){const E=P+1,A=[];for(let D=0;D<=E;D++){A[D]=[];const y=w.clone().lerp(M,D/E),x=b.clone().lerp(M,D/E),R=E-D;for(let B=0;B<=R;B++)B===0&&D===E?A[D][B]=y:A[D][B]=y.clone().lerp(x,B/R)}for(let D=0;D<E;D++)for(let y=0;y<2*(E-D)-1;y++){const x=Math.floor(y/2);y%2===0?(d(A[D][x+1]),d(A[D+1][x]),d(A[D][x])):(d(A[D][x+1]),d(A[D+1][x+1]),d(A[D+1][x]))}}function c(w){const b=new T;for(let M=0;M<s.length;M+=3)b.x=s[M+0],b.y=s[M+1],b.z=s[M+2],b.normalize().multiplyScalar(w),s[M+0]=b.x,s[M+1]=b.y,s[M+2]=b.z}function u(){const w=new T;for(let b=0;b<s.length;b+=3){w.x=s[b+0],w.y=s[b+1],w.z=s[b+2];const M=m(w)/2/Math.PI+.5,P=f(w)/Math.PI+.5;a.push(M,1-P)}g(),h()}function h(){for(let w=0;w<a.length;w+=6){const b=a[w+0],M=a[w+2],P=a[w+4],E=Math.max(b,M,P),A=Math.min(b,M,P);E>.9&&A<.1&&(b<.2&&(a[w+0]+=1),M<.2&&(a[w+2]+=1),P<.2&&(a[w+4]+=1))}}function d(w){s.push(w.x,w.y,w.z)}function p(w,b){const M=w*3;b.x=t[M+0],b.y=t[M+1],b.z=t[M+2]}function g(){const w=new T,b=new T,M=new T,P=new T,E=new ht,A=new ht,D=new ht;for(let y=0,x=0;y<s.length;y+=9,x+=6){w.set(s[y+0],s[y+1],s[y+2]),b.set(s[y+3],s[y+4],s[y+5]),M.set(s[y+6],s[y+7],s[y+8]),E.set(a[x+0],a[x+1]),A.set(a[x+2],a[x+3]),D.set(a[x+4],a[x+5]),P.copy(w).add(b).add(M).divideScalar(3);const R=m(P);_(E,x+0,w,R),_(A,x+2,b,R),_(D,x+4,M,R)}}function _(w,b,M,P){P<0&&w.x===1&&(a[b]=w.x-1),M.x===0&&M.z===0&&(a[b]=P/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function f(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new js(t.vertices,t.indices,t.radius,t.details)}}class Wr extends js{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wr(t.radius,t.detail)}}class Ls extends js{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ls(t.radius,t.detail)}}class Yo extends js{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Yo(t.radius,t.detail)}}class En extends se{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const s=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,u=l+1,h=t/o,d=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<u;f++){const w=f*d-a;for(let b=0;b<c;b++){const M=b*h-s;g.push(M,-w,0),_.push(0,0,1),m.push(b/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let w=0;w<o;w++){const b=w+c*f,M=w+c*(f+1),P=w+1+c*(f+1),E=w+1+c*f;p.push(b,M,E),p.push(M,P,E)}this.setIndex(p),this.setAttribute("position",new Gt(g,3)),this.setAttribute("normal",new Gt(_,3)),this.setAttribute("uv",new Gt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.width,t.height,t.widthSegments,t.heightSegments)}}class Yr extends se{constructor(t=.5,e=1,i=32,n=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],u=[];let h=t;const d=(e-t)/n,p=new T,g=new ht;for(let _=0;_<=n;_++){for(let m=0;m<=i;m++){const f=s+m/i*a;p.x=h*Math.cos(f),p.y=h*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,u.push(g.x,g.y)}h+=d}for(let _=0;_<n;_++){const m=_*(i+1);for(let f=0;f<i;f++){const w=f+m,b=w,M=w+i+1,P=w+i+2,E=w+1;o.push(b,M,E),o.push(M,P,E)}}this.setIndex(o),this.setAttribute("position",new Gt(l,3)),this.setAttribute("normal",new Gt(c,3)),this.setAttribute("uv",new Gt(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yr(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class fe extends se{constructor(t=1,e=32,i=16,n=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new T,d=new T,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){const w=[],b=f/i;let M=0;f===0&&a===0?M=.5/e:f===i&&l===Math.PI&&(M=-.5/e);for(let P=0;P<=e;P++){const E=P/e;h.x=-t*Math.cos(n+E*s)*Math.sin(a+b*o),h.y=t*Math.cos(a+b*o),h.z=t*Math.sin(n+E*s)*Math.sin(a+b*o),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(E+M,1-b),w.push(c++)}u.push(w)}for(let f=0;f<i;f++)for(let w=0;w<e;w++){const b=u[f][w+1],M=u[f][w],P=u[f+1][w],E=u[f+1][w+1];(f!==0||a>0)&&p.push(b,M,E),(f!==i-1||l<Math.PI)&&p.push(M,P,E)}this.setIndex(p),this.setAttribute("position",new Gt(g,3)),this.setAttribute("normal",new Gt(_,3)),this.setAttribute("uv",new Gt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class vi extends se{constructor(t=1,e=.4,i=12,n=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:s},i=Math.floor(i),n=Math.floor(n);const a=[],o=[],l=[],c=[],u=new T,h=new T,d=new T;for(let p=0;p<=i;p++)for(let g=0;g<=n;g++){const _=g/n*s,m=p/i*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(_),h.y=(t+e*Math.cos(m))*Math.sin(_),h.z=e*Math.sin(m),o.push(h.x,h.y,h.z),u.x=t*Math.cos(_),u.y=t*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/n),c.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=n;g++){const _=(n+1)*p+g-1,m=(n+1)*(p-1)+g-1,f=(n+1)*(p-1)+g,w=(n+1)*p+g;a.push(_,m,w),a.push(m,f,w)}this.setIndex(a),this.setAttribute("position",new Gt(o,3)),this.setAttribute("normal",new Gt(l,3)),this.setAttribute("uv",new Gt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vi(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ju extends ze{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class We extends Wi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new _t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ho,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Qu extends We{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ht(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Wt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new _t(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new _t(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new _t(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class ba extends Wi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ho,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=Io,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class td extends Wi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ed extends Wi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Ko extends oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class id extends Ko{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new _t(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ta=new Jt,Hl=new T,Vl=new T;class ah{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=Ci,this.map=null,this.mapPass=null,this.matrix=new Jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qo,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Hl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Hl),Vl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vl),e.updateMatrixWorld(),Ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ta,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Gl=new Jt,ws=new T,Ea=new T;class nd extends ah{constructor(){super(new ni(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new ne(2,1,1,1),new ne(0,1,1,1),new ne(3,1,1,1),new ne(1,1,1,1),new ne(3,0,1,1),new ne(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(t,e=0){const i=this.camera,n=this.matrix,s=t.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),ws.setFromMatrixPosition(t.matrixWorld),i.position.copy(ws),Ea.copy(i.position),Ea.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(Ea),i.updateMatrixWorld(),n.makeTranslation(-ws.x,-ws.y,-ws.z),Gl.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gl,i.coordinateSystem,i.reversedDepth)}}class Vs extends Ko{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new nd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class $o extends th{constructor(t=-1,e=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class sd extends ah{constructor(){super(new $o(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Wl extends Ko{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.shadow=new sd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class rd extends ni{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class oh{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const Xl=new Jt;class zi{constructor(t,e,i=0,n=1/0){this.ray=new Tn(t,e),this.near=i,this.far=n,this.camera=null,this.layers=new Wo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Xl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Xl),this}intersectObject(t,e=!0,i=[]){return bo(t,this,i,e),i.sort(ql),i}intersectObjects(t,e=!0,i=[]){for(let n=0,s=t.length;n<s;n++)bo(t[n],this,i,e);return i.sort(ql),i}}function ql(r,t){return r.distance-t.distance}function bo(r,t,e,i){let n=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(n=!1),n===!0&&i===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)bo(s[a],t,e,!0)}}const jl=new ht;class ad{constructor(t=new ht(1/0,1/0),e=new ht(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=jl.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,jl).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}function Yl(r,t,e,i){const n=od(i);switch(e){case Gc:return r*t;case Oo:return r*t/n.components*n.byteLength;case Bo:return r*t/n.components*n.byteLength;case Xc:return r*t*2/n.components*n.byteLength;case zo:return r*t*2/n.components*n.byteLength;case Wc:return r*t*3/n.components*n.byteLength;case di:return r*t*4/n.components*n.byteLength;case ko:return r*t*4/n.components*n.byteLength;case Rr:case Pr:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Dr:case Lr:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case $a:case Ja:return Math.max(r,16)*Math.max(t,8)/4;case Ka:case Za:return Math.max(r,8)*Math.max(t,8)/2;case Qa:case to:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case eo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case io:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case no:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case so:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case ro:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case ao:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case oo:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case lo:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case co:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case ho:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case uo:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case fo:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case po:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case mo:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case go:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Ir:case _o:case vo:return Math.ceil(r/4)*Math.ceil(t/4)*16;case qc:case xo:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Mo:case yo:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function od(r){switch(r){case Ci:case kc:return{byteLength:1,components:1};case Ns:case Hc:case Hi:return{byteLength:2,components:1};case No:case Fo:return{byteLength:2,components:4};case An:case Uo:case Ei:return{byteLength:4,components:1};case Vc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Do}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Do);function lh(){let r=null,t=!1,e=null,i=null;function n(s,a){e(s,a),i=r.requestAnimationFrame(n)}return{start:function(){t!==!0&&e!==null&&(i=r.requestAnimationFrame(n),t=!0)},stop:function(){r.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function ld(r){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(r.bindBuffer(c,o),h.length===0)r.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){const g=h[d],_=h[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){const _=h[p];r.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:a}}var cd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ud=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,md=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_d=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,vd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Md=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Sd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ed=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ld=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Id=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ud=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Nd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Od=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zd="gl_FragColor = linearToOutputTexel( gl_FragColor );",kd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Vd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$d=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Zd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ef=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,nf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,of=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,cf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,uf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,df=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ff=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,gf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_f=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,xf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,bf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ef=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Af=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Df=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,If=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ff=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Of=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,zf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,qf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Yf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Kf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$f=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ep=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ip=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,np=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,lp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,_p=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,vp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,bp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ep=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ap=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Pp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ip=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Up=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Np=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Hp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zt={alphahash_fragment:cd,alphahash_pars_fragment:hd,alphamap_fragment:ud,alphamap_pars_fragment:dd,alphatest_fragment:fd,alphatest_pars_fragment:pd,aomap_fragment:md,aomap_pars_fragment:gd,batching_pars_vertex:_d,batching_vertex:vd,begin_vertex:xd,beginnormal_vertex:Md,bsdfs:yd,iridescence_fragment:Sd,bumpmap_pars_fragment:wd,clipping_planes_fragment:bd,clipping_planes_pars_fragment:Td,clipping_planes_pars_vertex:Ed,clipping_planes_vertex:Ad,color_fragment:Cd,color_pars_fragment:Rd,color_pars_vertex:Pd,color_vertex:Dd,common:Ld,cube_uv_reflection_fragment:Id,defaultnormal_vertex:Ud,displacementmap_pars_vertex:Nd,displacementmap_vertex:Fd,emissivemap_fragment:Od,emissivemap_pars_fragment:Bd,colorspace_fragment:zd,colorspace_pars_fragment:kd,envmap_fragment:Hd,envmap_common_pars_fragment:Vd,envmap_pars_fragment:Gd,envmap_pars_vertex:Wd,envmap_physical_pars_fragment:ef,envmap_vertex:Xd,fog_vertex:qd,fog_pars_vertex:jd,fog_fragment:Yd,fog_pars_fragment:Kd,gradientmap_pars_fragment:$d,lightmap_pars_fragment:Zd,lights_lambert_fragment:Jd,lights_lambert_pars_fragment:Qd,lights_pars_begin:tf,lights_toon_fragment:nf,lights_toon_pars_fragment:sf,lights_phong_fragment:rf,lights_phong_pars_fragment:af,lights_physical_fragment:of,lights_physical_pars_fragment:lf,lights_fragment_begin:cf,lights_fragment_maps:hf,lights_fragment_end:uf,logdepthbuf_fragment:df,logdepthbuf_pars_fragment:ff,logdepthbuf_pars_vertex:pf,logdepthbuf_vertex:mf,map_fragment:gf,map_pars_fragment:_f,map_particle_fragment:vf,map_particle_pars_fragment:xf,metalnessmap_fragment:Mf,metalnessmap_pars_fragment:yf,morphinstance_vertex:Sf,morphcolor_vertex:wf,morphnormal_vertex:bf,morphtarget_pars_vertex:Tf,morphtarget_vertex:Ef,normal_fragment_begin:Af,normal_fragment_maps:Cf,normal_pars_fragment:Rf,normal_pars_vertex:Pf,normal_vertex:Df,normalmap_pars_fragment:Lf,clearcoat_normal_fragment_begin:If,clearcoat_normal_fragment_maps:Uf,clearcoat_pars_fragment:Nf,iridescence_pars_fragment:Ff,opaque_fragment:Of,packing:Bf,premultiplied_alpha_fragment:zf,project_vertex:kf,dithering_fragment:Hf,dithering_pars_fragment:Vf,roughnessmap_fragment:Gf,roughnessmap_pars_fragment:Wf,shadowmap_pars_fragment:Xf,shadowmap_pars_vertex:qf,shadowmap_vertex:jf,shadowmask_pars_fragment:Yf,skinbase_vertex:Kf,skinning_pars_vertex:$f,skinning_vertex:Zf,skinnormal_vertex:Jf,specularmap_fragment:Qf,specularmap_pars_fragment:tp,tonemapping_fragment:ep,tonemapping_pars_fragment:ip,transmission_fragment:np,transmission_pars_fragment:sp,uv_pars_fragment:rp,uv_pars_vertex:ap,uv_vertex:op,worldpos_vertex:lp,background_vert:cp,background_frag:hp,backgroundCube_vert:up,backgroundCube_frag:dp,cube_vert:fp,cube_frag:pp,depth_vert:mp,depth_frag:gp,distanceRGBA_vert:_p,distanceRGBA_frag:vp,equirect_vert:xp,equirect_frag:Mp,linedashed_vert:yp,linedashed_frag:Sp,meshbasic_vert:wp,meshbasic_frag:bp,meshlambert_vert:Tp,meshlambert_frag:Ep,meshmatcap_vert:Ap,meshmatcap_frag:Cp,meshnormal_vert:Rp,meshnormal_frag:Pp,meshphong_vert:Dp,meshphong_frag:Lp,meshphysical_vert:Ip,meshphysical_frag:Up,meshtoon_vert:Np,meshtoon_frag:Fp,points_vert:Op,points_frag:Bp,shadow_vert:zp,shadow_frag:kp,sprite_vert:Hp,sprite_frag:Vp},st={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Bt}},envmap:{envMap:{value:null},envMapRotation:{value:new Bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Bt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0},uvTransform:{value:new Bt}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Bt},alphaMap:{value:null},alphaMapTransform:{value:new Bt},alphaTest:{value:0}}},Ti={basic:{uniforms:Ye([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Ye([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new _t(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Ye([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Ye([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Ye([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new _t(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Ye([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Ye([st.points,st.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Ye([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Ye([st.common,st.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Ye([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Ye([st.sprite,st.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Bt}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:Ye([st.common,st.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:Ye([st.lights,st.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};Ti.physical={uniforms:Ye([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Bt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Bt},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Bt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Bt},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Bt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Bt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const Sr={r:0,b:0,g:0},pn=new yi,Gp=new Jt;function Wp(r,t,e,i,n,s,a){const o=new _t(0);let l=s===!0?0:1,c,u,h=null,d=0,p=null;function g(b){let M=b.isScene===!0?b.background:null;return M&&M.isTexture&&(M=(b.backgroundBlurriness>0?e:t).get(M)),M}function _(b){let M=!1;const P=g(b);P===null?f(o,l):P&&P.isColor&&(f(P,1),M=!0);const E=r.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(b,M){const P=g(M);P&&(P.isCubeTexture||P.mapping===qr)?(u===void 0&&(u=new qt(new Ae(1,1,1),new ze({name:"BackgroundCubeMaterial",uniforms:rs(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(E,A,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(u)),pn.copy(M.backgroundRotation),pn.x*=-1,pn.y*=-1,pn.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(pn.y*=-1,pn.z*=-1),u.material.uniforms.envMap.value=P,u.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Gp.makeRotationFromEuler(pn)),u.material.toneMapped=Yt.getTransfer(P.colorSpace)!==te,(h!==P||d!==P.version||p!==r.toneMapping)&&(u.material.needsUpdate=!0,h=P,d=P.version,p=r.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):P&&P.isTexture&&(c===void 0&&(c=new qt(new En(2,2),new ze({name:"BackgroundMaterial",uniforms:rs(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=P,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(P.colorSpace)!==te,P.matrixAutoUpdate===!0&&P.updateMatrix(),c.material.uniforms.uvTransform.value.copy(P.matrix),(h!==P||d!==P.version||p!==r.toneMapping)&&(c.material.needsUpdate=!0,h=P,d=P.version,p=r.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,M){b.getRGB(Sr,Qc(r)),i.buffers.color.setClear(Sr.r,Sr.g,Sr.b,M,a)}function w(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,M=1){o.set(b),l=M,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(o,l)},render:_,addToRenderList:m,dispose:w}}function Xp(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=d(null);let s=n,a=!1;function o(x,R,B,F,z){let q=!1;const G=h(F,B,R);s!==G&&(s=G,c(s.object)),q=p(x,F,B,z),q&&g(x,F,B,z),z!==null&&t.update(z,r.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,M(x,R,B,F),z!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return r.createVertexArray()}function c(x){return r.bindVertexArray(x)}function u(x){return r.deleteVertexArray(x)}function h(x,R,B){const F=B.wireframe===!0;let z=i[x.id];z===void 0&&(z={},i[x.id]=z);let q=z[R.id];q===void 0&&(q={},z[R.id]=q);let G=q[F];return G===void 0&&(G=d(l()),q[F]=G),G}function d(x){const R=[],B=[],F=[];for(let z=0;z<e;z++)R[z]=0,B[z]=0,F[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:B,attributeDivisors:F,object:x,attributes:{},index:null}}function p(x,R,B,F){const z=s.attributes,q=R.attributes;let G=0;const K=B.getAttributes();for(const V in K)if(K[V].location>=0){const ut=z[V];let Et=q[V];if(Et===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(Et=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(Et=x.instanceColor)),ut===void 0||ut.attribute!==Et||Et&&ut.data!==Et.data)return!0;G++}return s.attributesNum!==G||s.index!==F}function g(x,R,B,F){const z={},q=R.attributes;let G=0;const K=B.getAttributes();for(const V in K)if(K[V].location>=0){let ut=q[V];ut===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ut=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ut=x.instanceColor));const Et={};Et.attribute=ut,ut&&ut.data&&(Et.data=ut.data),z[V]=Et,G++}s.attributes=z,s.attributesNum=G,s.index=F}function _(){const x=s.newAttributes;for(let R=0,B=x.length;R<B;R++)x[R]=0}function m(x){f(x,0)}function f(x,R){const B=s.newAttributes,F=s.enabledAttributes,z=s.attributeDivisors;B[x]=1,F[x]===0&&(r.enableVertexAttribArray(x),F[x]=1),z[x]!==R&&(r.vertexAttribDivisor(x,R),z[x]=R)}function w(){const x=s.newAttributes,R=s.enabledAttributes;for(let B=0,F=R.length;B<F;B++)R[B]!==x[B]&&(r.disableVertexAttribArray(B),R[B]=0)}function b(x,R,B,F,z,q,G){G===!0?r.vertexAttribIPointer(x,R,B,z,q):r.vertexAttribPointer(x,R,B,F,z,q)}function M(x,R,B,F){_();const z=F.attributes,q=B.getAttributes(),G=R.defaultAttributeValues;for(const K in q){const V=q[K];if(V.location>=0){let rt=z[K];if(rt===void 0&&(K==="instanceMatrix"&&x.instanceMatrix&&(rt=x.instanceMatrix),K==="instanceColor"&&x.instanceColor&&(rt=x.instanceColor)),rt!==void 0){const ut=rt.normalized,Et=rt.itemSize,kt=t.get(rt);if(kt===void 0)continue;const pe=kt.buffer,re=kt.type,j=kt.bytesPerElement,at=re===r.INT||re===r.UNSIGNED_INT||rt.gpuType===Uo;if(rt.isInterleavedBufferAttribute){const it=rt.data,Pt=it.stride,Dt=rt.offset;if(it.isInstancedInterleavedBuffer){for(let Nt=0;Nt<V.locationSize;Nt++)f(V.location+Nt,it.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Nt=0;Nt<V.locationSize;Nt++)m(V.location+Nt);r.bindBuffer(r.ARRAY_BUFFER,pe);for(let Nt=0;Nt<V.locationSize;Nt++)b(V.location+Nt,Et/V.locationSize,re,ut,Pt*j,(Dt+Et/V.locationSize*Nt)*j,at)}else{if(rt.isInstancedBufferAttribute){for(let it=0;it<V.locationSize;it++)f(V.location+it,rt.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let it=0;it<V.locationSize;it++)m(V.location+it);r.bindBuffer(r.ARRAY_BUFFER,pe);for(let it=0;it<V.locationSize;it++)b(V.location+it,Et/V.locationSize,re,ut,Et*j,Et/V.locationSize*it*j,at)}}else if(G!==void 0){const ut=G[K];if(ut!==void 0)switch(ut.length){case 2:r.vertexAttrib2fv(V.location,ut);break;case 3:r.vertexAttrib3fv(V.location,ut);break;case 4:r.vertexAttrib4fv(V.location,ut);break;default:r.vertexAttrib1fv(V.location,ut)}}}}w()}function P(){D();for(const x in i){const R=i[x];for(const B in R){const F=R[B];for(const z in F)u(F[z].object),delete F[z];delete R[B]}delete i[x]}}function E(x){if(i[x.id]===void 0)return;const R=i[x.id];for(const B in R){const F=R[B];for(const z in F)u(F[z].object),delete F[z];delete R[B]}delete i[x.id]}function A(x){for(const R in i){const B=i[R];if(B[x.id]===void 0)continue;const F=B[x.id];for(const z in F)u(F[z].object),delete F[z];delete B[x.id]}}function D(){y(),a=!0,s!==n&&(s=n,c(s.object))}function y(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:D,resetDefaultState:y,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:w}}function qp(r,t,e){let i;function n(c){i=c}function s(c,u){r.drawArrays(i,c,u),e.update(u,i,1)}function a(c,u,h){h!==0&&(r.drawArraysInstanced(i,c,u,h),e.update(u,i,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,i,1)}function l(c,u,h,d){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];e.update(g,i,1)}}this.setMode=n,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function jp(r,t,e,i){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(A){return!(A!==di&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const D=A===Hi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ci&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ei&&!D)}function l(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),w=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,E=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:b,maxFragmentUniforms:M,vertexTextures:P,maxSamples:E}}function Yp(r){const t=this;let e=null,i=0,n=!1,s=!1;const a=new xn,o=new Bt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||i!==0||n;return n=d,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,f=r.get(h);if(!n||g===null||g.length===0||s&&!m)s?u(null):c();else{const w=s?0:i,b=w*4;let M=f.clippingState||null;l.value=M,M=u(g,d,b,p);for(let P=0;P!==b;++P)M[P]=e[P];f.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,d,p,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,M=p;b!==_;++b,M+=4)a.copy(h[b]).applyMatrix4(w,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Kp(r){let t=new WeakMap;function e(a,o){return o===qa?a.mapping=is:o===ja&&(a.mapping=ns),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===qa||o===ja)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Vu(l.height);return c.fromEquirectangularTexture(r,a),t.set(a,c),a.addEventListener("dispose",n),e(c.texture,a.mapping)}else return null}}return a}function n(a){const o=a.target;o.removeEventListener("dispose",n);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const Zn=4,Kl=[.125,.215,.35,.446,.526,.582],wn=20,Aa=new $o,$l=new _t;let Ca=null,Ra=0,Pa=0,Da=!1;const Mn=(1+Math.sqrt(5))/2,$n=1/Mn,Zl=[new T(-Mn,$n,0),new T(Mn,$n,0),new T(-$n,0,Mn),new T($n,0,Mn),new T(0,Mn,-$n),new T(0,Mn,$n),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)],$p=new T;class Jl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,n=100,s={}){const{size:a=256,position:o=$p}=s;Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ec(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ca,Ra,Pa),this._renderer.xr.enabled=Da,t.scissorTest=!1,wr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ns?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ca=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),Da=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:_i,minFilter:_i,generateMipmaps:!1,type:Hi,format:di,colorSpace:ss,depthBuffer:!1},n=Ql(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ql(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zp(s)),this._blurMaterial=Jp(s,t,e)}return n}_compileMaterial(t){const e=new qt(this._lodPlanes[0],t);this._renderer.compile(e,Aa)}_sceneToCubeUV(t,e,i,n,s){const l=new ni(90,1,e,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor($l),h.toneMapping=sn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(n),h.clearDepth(),h.setRenderTarget(null));const _=new Ke({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),m=new qt(new Ae,_);let f=!1;const w=t.background;w?w.isColor&&(_.color.copy(w),t.background=null,f=!0):(_.color.copy($l),f=!0);for(let b=0;b<6;b++){const M=b%3;M===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[b],s.y,s.z)):M===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[b]));const P=this._cubeSize;wr(n,M*P,b>2?P:0,P,P),h.setRenderTarget(n),f&&h.render(m,l),h.render(t,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=d,t.background=w}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===is||t.mapping===ns;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=ec()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tc());const s=n?this._cubemapMaterial:this._equirectMaterial,a=new qt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;wr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Aa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodPlanes.length;for(let s=1;s<n;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Zl[(n-s-1)%Zl.length];this._blur(t,s-1,s,a,o)}e.autoClear=i}_blur(t,e,i,n,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,n,"latitudinal",s),this._halfBlur(a,t,i,i,n,"longitudinal",s)}_halfBlur(t,e,i,n,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new qt(this._lodPlanes[n],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*wn-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):wn;m>wn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${wn}`);const f=[];let w=0;for(let A=0;A<wn;++A){const D=A/_,y=Math.exp(-D*D/2);f.push(y),A===0?w+=y:A<m&&(w+=2*y)}for(let A=0;A<f.length;A++)f[A]=f[A]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-i;const M=this._sizeLods[n],P=3*M*(n>b-Zn?n-b+Zn:0),E=4*(this._cubeSize-M);wr(e,P,E,3*M,2*M),l.setRenderTarget(e),l.render(h,Aa)}}function Zp(r){const t=[],e=[],i=[];let n=r;const s=r-Zn+1+Kl.length;for(let a=0;a<s;a++){const o=Math.pow(2,n);e.push(o);let l=1/o;a>r-Zn?l=Kl[a-r+Zn-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,_=3,m=2,f=1,w=new Float32Array(_*g*p),b=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,D=E>2?0:-1,y=[A,D,0,A+2/3,D,0,A+2/3,D+1,0,A,D,0,A+2/3,D+1,0,A,D+1,0];w.set(y,_*g*E),b.set(d,m*g*E);const x=[E,E,E,E,E,E];M.set(x,f*g*E)}const P=new se;P.setAttribute("position",new ke(w,_)),P.setAttribute("uv",new ke(b,m)),P.setAttribute("faceIndex",new ke(M,f)),t.push(P),n>Zn&&n--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Ql(r,t,e){const i=new xi(r,t,e);return i.texture.mapping=qr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wr(r,t,e,i,n){r.viewport.set(t,e,i,n),r.scissor.set(t,e,i,n)}function Jp(r,t,e){const i=new Float32Array(wn),n=new T(0,1,0);return new ze({name:"SphericalGaussianBlur",defines:{n:wn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:Zo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function tc(){return new ze({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function ec(){return new ze({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ki,depthTest:!1,depthWrite:!1})}function Zo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Qp(r){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===qa||l===ja,u=l===is||l===ns;if(c||u){let h=t.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Jl(r)),h=c?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&n(p)?(e===null&&(e=new Jl(r)),h=c?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function n(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function tm(r){const t={};function e(i){if(t[i]!==void 0)return t[i];let n;switch(i){case"WEBGL_depth_texture":n=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=r.getExtension(i)}return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Qn("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function em(r,t,e,i){const n={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete n[d.id];const p=s.get(d);p&&(t.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return n[d.id]===!0||(d.addEventListener("dispose",a),n[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const p in d)t.update(d[p],r.ARRAY_BUFFER)}function c(h){const d=[],p=h.index,g=h.attributes.position;let _=0;if(p!==null){const w=p.array;_=p.version;for(let b=0,M=w.length;b<M;b+=3){const P=w[b+0],E=w[b+1],A=w[b+2];d.push(P,E,E,A,A,P)}}else if(g!==void 0){const w=g.array;_=g.version;for(let b=0,M=w.length/3-1;b<M;b+=3){const P=b+0,E=b+1,A=b+2;d.push(P,E,E,A,A,P)}}else return;const m=new(Yc(d)?Jc:Zc)(d,1);m.version=_;const f=s.get(h);f&&t.remove(f),s.set(h,m)}function u(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function im(r,t,e){let i;function n(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,p){r.drawElements(i,p,s,d*a),e.update(p,i,1)}function c(d,p,g){g!==0&&(r.drawElementsInstanced(i,p,s,d*a,g),e.update(p,i,g))}function u(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function h(d,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,d,0,_,0,g);let f=0;for(let w=0;w<g;w++)f+=p[w]*_[w];e.update(f,i,1)}}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function nm(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function sm(r,t,e){const i=new WeakMap,n=new ne;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let x=function(){D.dispose(),i.delete(o),o.removeEventListener("dispose",x)};var p=x;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let P=o.attributes.position.count*M,E=1;P>t.maxTextureSize&&(E=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const A=new Float32Array(P*E*4*h),D=new Kc(A,P,E,h);D.type=Ei,D.needsUpdate=!0;const y=M*4;for(let R=0;R<h;R++){const B=f[R],F=w[R],z=b[R],q=P*E*4*R;for(let G=0;G<B.count;G++){const K=G*y;g===!0&&(n.fromBufferAttribute(B,G),A[q+K+0]=n.x,A[q+K+1]=n.y,A[q+K+2]=n.z,A[q+K+3]=0),_===!0&&(n.fromBufferAttribute(F,G),A[q+K+4]=n.x,A[q+K+5]=n.y,A[q+K+6]=n.z,A[q+K+7]=0),m===!0&&(n.fromBufferAttribute(z,G),A[q+K+8]=n.x,A[q+K+9]=n.y,A[q+K+10]=n.z,A[q+K+11]=z.itemSize===4?n.w:1)}}d={count:h,texture:D,size:new ht(P,E)},i.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function rm(r,t,e,i){let n=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=t.get(l,u);if(n.get(h)!==c&&(t.update(h),n.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),n.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),n.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;n.get(d)!==c&&(d.update(),n.set(d,c))}return h}function a(){n=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}const ch=new Xe,ic=new rh(1,1),hh=new Kc,uh=new Eu,dh=new eh,nc=[],sc=[],rc=new Float32Array(16),ac=new Float32Array(9),oc=new Float32Array(4);function hs(r,t,e){const i=r[0];if(i<=0||i>0)return r;const n=t*e;let s=nc[n];if(s===void 0&&(s=new Float32Array(n),nc[n]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function Le(r,t){if(r.length!==t.length)return!1;for(let e=0,i=r.length;e<i;e++)if(r[e]!==t[e])return!1;return!0}function Ie(r,t){for(let e=0,i=t.length;e<i;e++)r[e]=t[e]}function Kr(r,t){let e=sc[t];e===void 0&&(e=new Int32Array(t),sc[t]=e);for(let i=0;i!==t;++i)e[i]=r.allocateTextureUnit();return e}function am(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function om(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;r.uniform2fv(this.addr,t),Ie(e,t)}}function lm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Le(e,t))return;r.uniform3fv(this.addr,t),Ie(e,t)}}function cm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;r.uniform4fv(this.addr,t),Ie(e,t)}}function hm(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Le(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,i))return;oc.set(i),r.uniformMatrix2fv(this.addr,!1,oc),Ie(e,i)}}function um(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Le(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,i))return;ac.set(i),r.uniformMatrix3fv(this.addr,!1,ac),Ie(e,i)}}function dm(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(Le(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Le(e,i))return;rc.set(i),r.uniformMatrix4fv(this.addr,!1,rc),Ie(e,i)}}function fm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function pm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;r.uniform2iv(this.addr,t),Ie(e,t)}}function mm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;r.uniform3iv(this.addr,t),Ie(e,t)}}function gm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;r.uniform4iv(this.addr,t),Ie(e,t)}}function _m(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function vm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Le(e,t))return;r.uniform2uiv(this.addr,t),Ie(e,t)}}function xm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Le(e,t))return;r.uniform3uiv(this.addr,t),Ie(e,t)}}function Mm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Le(e,t))return;r.uniform4uiv(this.addr,t),Ie(e,t)}}function ym(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s;this.type===r.SAMPLER_2D_SHADOW?(ic.compareFunction=jc,s=ic):s=ch,e.setTexture2D(t||s,n)}function Sm(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||uh,n)}function wm(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||dh,n)}function bm(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||hh,n)}function Tm(r){switch(r){case 5126:return am;case 35664:return om;case 35665:return lm;case 35666:return cm;case 35674:return hm;case 35675:return um;case 35676:return dm;case 5124:case 35670:return fm;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return gm;case 5125:return _m;case 36294:return vm;case 36295:return xm;case 36296:return Mm;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return Sm;case 35680:case 36300:case 36308:case 36293:return wm;case 36289:case 36303:case 36311:case 36292:return bm}}function Em(r,t){r.uniform1fv(this.addr,t)}function Am(r,t){const e=hs(t,this.size,2);r.uniform2fv(this.addr,e)}function Cm(r,t){const e=hs(t,this.size,3);r.uniform3fv(this.addr,e)}function Rm(r,t){const e=hs(t,this.size,4);r.uniform4fv(this.addr,e)}function Pm(r,t){const e=hs(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Dm(r,t){const e=hs(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function Lm(r,t){const e=hs(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function Im(r,t){r.uniform1iv(this.addr,t)}function Um(r,t){r.uniform2iv(this.addr,t)}function Nm(r,t){r.uniform3iv(this.addr,t)}function Fm(r,t){r.uniform4iv(this.addr,t)}function Om(r,t){r.uniform1uiv(this.addr,t)}function Bm(r,t){r.uniform2uiv(this.addr,t)}function zm(r,t){r.uniform3uiv(this.addr,t)}function km(r,t){r.uniform4uiv(this.addr,t)}function Hm(r,t,e){const i=this.cache,n=t.length,s=Kr(e,n);Le(i,s)||(r.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==n;++a)e.setTexture2D(t[a]||ch,s[a])}function Vm(r,t,e){const i=this.cache,n=t.length,s=Kr(e,n);Le(i,s)||(r.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||uh,s[a])}function Gm(r,t,e){const i=this.cache,n=t.length,s=Kr(e,n);Le(i,s)||(r.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||dh,s[a])}function Wm(r,t,e){const i=this.cache,n=t.length,s=Kr(e,n);Le(i,s)||(r.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||hh,s[a])}function Xm(r){switch(r){case 5126:return Em;case 35664:return Am;case 35665:return Cm;case 35666:return Rm;case 35674:return Pm;case 35675:return Dm;case 35676:return Lm;case 5124:case 35670:return Im;case 35667:case 35671:return Um;case 35668:case 35672:return Nm;case 35669:case 35673:return Fm;case 5125:return Om;case 36294:return Bm;case 36295:return zm;case 36296:return km;case 35678:case 36198:case 36298:case 36306:case 35682:return Hm;case 35679:case 36299:case 36307:return Vm;case 35680:case 36300:case 36308:case 36293:return Gm;case 36289:case 36303:case 36311:case 36292:return Wm}}class qm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Tm(e.type)}}class jm{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xm(e.type)}}class Ym{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let s=0,a=n.length;s!==a;++s){const o=n[s];o.setValue(t,e[o.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function lc(r,t){r.seq.push(t),r.map[t.id]=t}function Km(r,t,e){const i=r.name,n=i.length;for(La.lastIndex=0;;){const s=La.exec(i),a=La.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){lc(e,c===void 0?new qm(o,r,t):new jm(o,r,t));break}else{let h=e.map[o];h===void 0&&(h=new Ym(o),lc(e,h)),e=h}}}class Ur{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const s=t.getActiveUniform(e,n),a=t.getUniformLocation(e,s.name);Km(s,a,this)}}setValue(t,e,i,n){const s=this.map[e];s!==void 0&&s.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,s=t.length;n!==s;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function cc(r,t,e){const i=r.createShader(t);return r.shaderSource(i,e),r.compileShader(i),i}const $m=37297;let Zm=0;function Jm(r,t){const e=r.split(`
`),i=[],n=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=n;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const hc=new Bt;function Qm(r){Yt._getMatrix(hc,Yt.workingColorSpace,r);const t=`mat3( ${hc.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(r)){case Or:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function uc(r,t,e){const i=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Jm(r.getShaderSource(t),o)}else return s}function t0(r,t){const e=Qm(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function e0(r,t){let e;switch(t){case Ic:e="Linear";break;case Uc:e="Reinhard";break;case Nc:e="Cineon";break;case Xr:e="ACESFilmic";break;case Oc:e="AgX";break;case Bc:e="Neutral";break;case Fc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const br=new T;function i0(){Yt.getLuminanceCoefficients(br);const r=br.x.toFixed(4),t=br.y.toFixed(4),e=br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n0(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cs).join(`
`)}function s0(r){const t=[];for(const e in r){const i=r[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function r0(r,t){const e={},i=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=r.getActiveAttrib(t,n),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function Cs(r){return r!==""}function dc(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function fc(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(r){return r.replace(a0,l0)}const o0=new Map;function l0(r,t){let e=zt[t];if(e===void 0){const i=o0.get(t);if(i!==void 0)e=zt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return To(e)}const c0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pc(r){return r.replace(c0,h0)}function h0(r,t,e,i){let n="";for(let s=parseInt(t);s<parseInt(e);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function mc(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function u0(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Lc?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Lo?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Ni&&(t="SHADOWMAP_TYPE_VSM"),t}function d0(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case is:case ns:t="ENVMAP_TYPE_CUBE";break;case qr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function f0(r){let t="ENVMAP_MODE_REFLECTION";return r.envMap&&r.envMapMode===ns&&(t="ENVMAP_MODE_REFRACTION"),t}function p0(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Io:t="ENVMAP_BLENDING_MULTIPLY";break;case Wh:t="ENVMAP_BLENDING_MIX";break;case Xh:t="ENVMAP_BLENDING_ADD";break}return t}function m0(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function g0(r,t,e,i){const n=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=u0(e),c=d0(e),u=f0(e),h=p0(e),d=m0(e),p=n0(e),g=s0(s),_=n.createProgram();let m,f,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),f.length>0&&(f+=`
`)):(m=[mc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),f=[mc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==sn?"#define TONE_MAPPING":"",e.toneMapping!==sn?zt.tonemapping_pars_fragment:"",e.toneMapping!==sn?e0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,t0("linearToOutputTexel",e.outputColorSpace),i0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Cs).join(`
`)),a=To(a),a=dc(a,e),a=fc(a,e),o=To(o),o=dc(o,e),o=fc(o,e),a=pc(a),o=pc(o),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===hl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const b=w+m+a,M=w+f+o,P=cc(n,n.VERTEX_SHADER,b),E=cc(n,n.FRAGMENT_SHADER,M);n.attachShader(_,P),n.attachShader(_,E),e.index0AttributeName!==void 0?n.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&n.bindAttribLocation(_,0,"position"),n.linkProgram(_);function A(R){if(r.debug.checkShaderErrors){const B=n.getProgramInfoLog(_)||"",F=n.getShaderInfoLog(P)||"",z=n.getShaderInfoLog(E)||"",q=B.trim(),G=F.trim(),K=z.trim();let V=!0,rt=!0;if(n.getProgramParameter(_,n.LINK_STATUS)===!1)if(V=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,_,P,E);else{const ut=uc(n,P,"vertex"),Et=uc(n,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(_,n.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+q+`
`+ut+`
`+Et)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(G===""||K==="")&&(rt=!1);rt&&(R.diagnostics={runnable:V,programLog:q,vertexShader:{log:G,prefix:m},fragmentShader:{log:K,prefix:f}})}n.deleteShader(P),n.deleteShader(E),D=new Ur(n,_),y=r0(n,_)}let D;this.getUniforms=function(){return D===void 0&&A(this),D};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=n.getProgramParameter(_,$m)),x},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Zm++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=E,this}let _0=0;class v0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,n=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(n)===!1&&(a.add(n),n.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new x0(t),e.set(t,i)),i}}class x0{constructor(t){this.id=_0++,this.code=t,this.usedTimes=0}}function M0(r,t,e,i,n,s,a){const o=new Wo,l=new v0,c=new Set,u=[],h=n.logarithmicDepthBuffer,d=n.vertexTextures;let p=n.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return c.add(y),y===0?"uv":`uv${y}`}function m(y,x,R,B,F){const z=B.fog,q=F.geometry,G=y.isMeshStandardMaterial?B.environment:null,K=(y.isMeshStandardMaterial?e:t).get(y.envMap||G),V=K&&K.mapping===qr?K.image.height:null,rt=g[y.type];y.precision!==null&&(p=n.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const ut=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Et=ut!==void 0?ut.length:0;let kt=0;q.morphAttributes.position!==void 0&&(kt=1),q.morphAttributes.normal!==void 0&&(kt=2),q.morphAttributes.color!==void 0&&(kt=3);let pe,re,j,at;if(rt){const Qt=Ti[rt];pe=Qt.vertexShader,re=Qt.fragmentShader}else pe=y.vertexShader,re=y.fragmentShader,l.update(y),j=l.getVertexShaderID(y),at=l.getFragmentShaderID(y);const it=r.getRenderTarget(),Pt=r.state.buffers.depth.getReversed(),Dt=F.isInstancedMesh===!0,Nt=F.isBatchedMesh===!0,Se=!!y.map,jt=!!y.matcap,L=!!K,le=!!y.aoMap,Ct=!!y.lightMap,Zt=!!y.bumpMap,Tt=!!y.normalMap,me=!!y.displacementMap,pt=!!y.emissiveMap,Ht=!!y.metalnessMap,Ue=!!y.roughnessMap,we=y.anisotropy>0,C=y.clearcoat>0,v=y.dispersion>0,O=y.iridescence>0,X=y.sheen>0,$=y.transmission>0,W=we&&!!y.anisotropyMap,wt=C&&!!y.clearcoatMap,et=C&&!!y.clearcoatNormalMap,vt=C&&!!y.clearcoatRoughnessMap,xt=O&&!!y.iridescenceMap,Q=O&&!!y.iridescenceThicknessMap,ct=X&&!!y.sheenColorMap,It=X&&!!y.sheenRoughnessMap,Mt=!!y.specularMap,ot=!!y.specularColorMap,Ot=!!y.specularIntensityMap,I=$&&!!y.transmissionMap,tt=$&&!!y.thicknessMap,nt=!!y.gradientMap,ft=!!y.alphaMap,Z=y.alphaTest>0,Y=!!y.alphaHash,gt=!!y.extensions;let Ft=sn;y.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Ft=r.toneMapping);const ce={shaderID:rt,shaderType:y.type,shaderName:y.name,vertexShader:pe,fragmentShader:re,defines:y.defines,customVertexShaderID:j,customFragmentShaderID:at,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Nt,batchingColor:Nt&&F._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&F.instanceColor!==null,instancingMorph:Dt&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:it===null?r.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:ss,alphaToCoverage:!!y.alphaToCoverage,map:Se,matcap:jt,envMap:L,envMapMode:L&&K.mapping,envMapCubeUVHeight:V,aoMap:le,lightMap:Ct,bumpMap:Zt,normalMap:Tt,displacementMap:d&&me,emissiveMap:pt,normalMapObjectSpace:Tt&&y.normalMapType===Kh,normalMapTangentSpace:Tt&&y.normalMapType===Ho,metalnessMap:Ht,roughnessMap:Ue,anisotropy:we,anisotropyMap:W,clearcoat:C,clearcoatMap:wt,clearcoatNormalMap:et,clearcoatRoughnessMap:vt,dispersion:v,iridescence:O,iridescenceMap:xt,iridescenceThicknessMap:Q,sheen:X,sheenColorMap:ct,sheenRoughnessMap:It,specularMap:Mt,specularColorMap:ot,specularIntensityMap:Ot,transmission:$,transmissionMap:I,thicknessMap:tt,gradientMap:nt,opaque:y.transparent===!1&&y.blending===nn&&y.alphaToCoverage===!1,alphaMap:ft,alphaTest:Z,alphaHash:Y,combine:y.combine,mapUv:Se&&_(y.map.channel),aoMapUv:le&&_(y.aoMap.channel),lightMapUv:Ct&&_(y.lightMap.channel),bumpMapUv:Zt&&_(y.bumpMap.channel),normalMapUv:Tt&&_(y.normalMap.channel),displacementMapUv:me&&_(y.displacementMap.channel),emissiveMapUv:pt&&_(y.emissiveMap.channel),metalnessMapUv:Ht&&_(y.metalnessMap.channel),roughnessMapUv:Ue&&_(y.roughnessMap.channel),anisotropyMapUv:W&&_(y.anisotropyMap.channel),clearcoatMapUv:wt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:et&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:It&&_(y.sheenRoughnessMap.channel),specularMapUv:Mt&&_(y.specularMap.channel),specularColorMapUv:ot&&_(y.specularColorMap.channel),specularIntensityMapUv:Ot&&_(y.specularIntensityMap.channel),transmissionMapUv:I&&_(y.transmissionMap.channel),thicknessMapUv:tt&&_(y.thicknessMap.channel),alphaMapUv:ft&&_(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Tt||we),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(Se||ft),fog:!!z,useFog:y.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Pt,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:Et,morphTextureStride:kt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ft,decodeVideoTexture:Se&&y.map.isVideoTexture===!0&&Yt.getTransfer(y.map.colorSpace)===te,decodeVideoTextureEmissive:pt&&y.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(y.emissiveMap.colorSpace)===te,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Je,flipSided:y.side===$e,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:gt&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&y.extensions.multiDraw===!0||Nt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function f(y){const x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)x.push(R),x.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(w(x,y),b(x,y),x.push(r.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function w(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function b(y,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),y.push(o.mask)}function M(y){const x=g[y.type];let R;if(x){const B=Ti[x];R=ks.clone(B.uniforms)}else R=y.uniforms;return R}function P(y,x){let R;for(let B=0,F=u.length;B<F;B++){const z=u[B];if(z.cacheKey===x){R=z,++R.usedTimes;break}}return R===void 0&&(R=new g0(r,x,y,s),u.push(R)),R}function E(y){if(--y.usedTimes===0){const x=u.indexOf(y);u[x]=u[u.length-1],u.pop(),y.destroy()}}function A(y){l.remove(y)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:P,releaseProgram:E,releaseShaderCache:A,programs:u,dispose:D}}function y0(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function n(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:s}}function S0(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function gc(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function _c(){const r=[];let t=0;const e=[],i=[],n=[];function s(){t=0,e.length=0,i.length=0,n.length=0}function a(h,d,p,g,_,m){let f=r[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},r[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=_,f.group=m),t++,f}function o(h,d,p,g,_,m){const f=a(h,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?n.push(f):e.push(f)}function l(h,d,p,g,_,m){const f=a(h,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?n.unshift(f):e.unshift(f)}function c(h,d){e.length>1&&e.sort(h||S0),i.length>1&&i.sort(d||gc),n.length>1&&n.sort(d||gc)}function u(){for(let h=t,d=r.length;h<d;h++){const p=r[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:n,init:s,push:o,unshift:l,finish:u,sort:c}}function w0(){let r=new WeakMap;function t(i,n){const s=r.get(i);let a;return s===void 0?(a=new _c,r.set(i,[a])):n>=s.length?(a=new _c,s.push(a)):a=s[n],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function b0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new T,color:new _t};break;case"SpotLight":e={position:new T,direction:new T,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new T,color:new _t,distance:0,decay:0};break;case"HemisphereLight":e={direction:new T,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":e={color:new _t,position:new T,halfWidth:new T,halfHeight:new T};break}return r[t.id]=e,e}}}function T0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let E0=0;function A0(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function C0(r){const t=new b0,e=T0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new T);const n=new T,s=new Jt,a=new Jt;function o(c){let u=0,h=0,d=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,w=0,b=0,M=0,P=0,E=0,A=0;c.sort(A0);for(let y=0,x=c.length;y<x;y++){const R=c[y],B=R.color,F=R.intensity,z=R.distance,q=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=B.r*F,h+=B.g*F,d+=B.b*F;else if(R.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(R.sh.coefficients[G],F);A++}else if(R.isDirectionalLight){const G=t.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const K=R.shadow,V=e.get(R);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.directionalShadow[p]=V,i.directionalShadowMap[p]=q,i.directionalShadowMatrix[p]=R.shadow.matrix,w++}i.directional[p]=G,p++}else if(R.isSpotLight){const G=t.get(R);G.position.setFromMatrixPosition(R.matrixWorld),G.color.copy(B).multiplyScalar(F),G.distance=z,G.coneCos=Math.cos(R.angle),G.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),G.decay=R.decay,i.spot[_]=G;const K=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,K.updateMatrices(R),R.castShadow&&E++),i.spotLightMatrix[_]=K.matrix,R.castShadow){const V=e.get(R);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,i.spotShadow[_]=V,i.spotShadowMap[_]=q,M++}_++}else if(R.isRectAreaLight){const G=t.get(R);G.color.copy(B).multiplyScalar(F),G.halfWidth.set(R.width*.5,0,0),G.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=G,m++}else if(R.isPointLight){const G=t.get(R);if(G.color.copy(R.color).multiplyScalar(R.intensity),G.distance=R.distance,G.decay=R.decay,R.castShadow){const K=R.shadow,V=e.get(R);V.shadowIntensity=K.intensity,V.shadowBias=K.bias,V.shadowNormalBias=K.normalBias,V.shadowRadius=K.radius,V.shadowMapSize=K.mapSize,V.shadowCameraNear=K.camera.near,V.shadowCameraFar=K.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=q,i.pointShadowMatrix[g]=R.shadow.matrix,b++}i.point[g]=G,g++}else if(R.isHemisphereLight){const G=t.get(R);G.skyColor.copy(R.color).multiplyScalar(F),G.groundColor.copy(R.groundColor).multiplyScalar(F),i.hemi[f]=G,f++}}m>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=st.LTC_FLOAT_1,i.rectAreaLTC2=st.LTC_FLOAT_2):(i.rectAreaLTC1=st.LTC_HALF_1,i.rectAreaLTC2=st.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const D=i.hash;(D.directionalLength!==p||D.pointLength!==g||D.spotLength!==_||D.rectAreaLength!==m||D.hemiLength!==f||D.numDirectionalShadows!==w||D.numPointShadows!==b||D.numSpotShadows!==M||D.numSpotMaps!==P||D.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=M+P-E,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,D.directionalLength=p,D.pointLength=g,D.spotLength=_,D.rectAreaLength=m,D.hemiLength=f,D.numDirectionalShadows=w,D.numPointShadows=b,D.numSpotShadows=M,D.numSpotMaps=P,D.numLightProbes=A,i.version=E0++)}function l(c,u){let h=0,d=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let f=0,w=c.length;f<w;f++){const b=c[f];if(b.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(n),M.direction.transformDirection(m),h++}else if(b.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(n),M.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(b.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:i}}function vc(r){const t=new C0(r),e=[],i=[];function n(u){c.camera=u,e.length=0,i.length=0}function s(u){e.push(u)}function a(u){i.push(u)}function o(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:n,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function R0(r){let t=new WeakMap;function e(n,s=0){const a=t.get(n);let o;return a===void 0?(o=new vc(r),t.set(n,[o])):s>=a.length?(o=new vc(r),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const P0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function L0(r,t,e){let i=new qo;const n=new ht,s=new ht,a=new ne,o=new td({depthPacking:Yh}),l=new ed,c={},u=e.maxTextureSize,h={[an]:$e,[$e]:an,[Je]:Je},d=new ze({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:P0,fragmentShader:D0}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new se;g.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new qt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lc;let f=this.type;this.render=function(E,A,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const y=r.getRenderTarget(),x=r.getActiveCubeFace(),R=r.getActiveMipmapLevel(),B=r.state;B.setBlending(ki),B.buffers.depth.getReversed()?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const F=f!==Ni&&this.type===Ni,z=f===Ni&&this.type!==Ni;for(let q=0,G=E.length;q<G;q++){const K=E[q],V=K.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;n.copy(V.mapSize);const rt=V.getFrameExtents();if(n.multiply(rt),s.copy(V.mapSize),(n.x>u||n.y>u)&&(n.x>u&&(s.x=Math.floor(u/rt.x),n.x=s.x*rt.x,V.mapSize.x=s.x),n.y>u&&(s.y=Math.floor(u/rt.y),n.y=s.y*rt.y,V.mapSize.y=s.y)),V.map===null||F===!0||z===!0){const Et=this.type!==Ni?{minFilter:ri,magFilter:ri}:{};V.map!==null&&V.map.dispose(),V.map=new xi(n.x,n.y,Et),V.map.texture.name=K.name+".shadowMap",V.camera.updateProjectionMatrix()}r.setRenderTarget(V.map),r.clear();const ut=V.getViewportCount();for(let Et=0;Et<ut;Et++){const kt=V.getViewport(Et);a.set(s.x*kt.x,s.y*kt.y,s.x*kt.z,s.y*kt.w),B.viewport(a),V.updateMatrices(K,Et),i=V.getFrustum(),M(A,D,V.camera,K,this.type)}V.isPointLightShadow!==!0&&this.type===Ni&&w(V,D),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,r.setRenderTarget(y,x,R)};function w(E,A){const D=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new xi(n.x,n.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(A,null,D,d,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(A,null,D,p,_,null)}function b(E,A,D,y){let x=null;const R=D.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)x=R;else if(x=D.isPointLight===!0?l:o,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const B=x.uuid,F=A.uuid;let z=c[B];z===void 0&&(z={},c[B]=z);let q=z[F];q===void 0&&(q=x.clone(),z[F]=q,A.addEventListener("dispose",P)),x=q}if(x.visible=A.visible,x.wireframe=A.wireframe,y===Ni?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:h[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,D.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const B=r.properties.get(x);B.light=D}return x}function M(E,A,D,y,x){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&x===Ni)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,E.matrixWorld);const F=t.update(E),z=E.material;if(Array.isArray(z)){const q=F.groups;for(let G=0,K=q.length;G<K;G++){const V=q[G],rt=z[V.materialIndex];if(rt&&rt.visible){const ut=b(E,rt,y,x);E.onBeforeShadow(r,E,A,D,F,ut,V),r.renderBufferDirect(D,null,F,ut,E,V),E.onAfterShadow(r,E,A,D,F,ut,V)}}}else if(z.visible){const q=b(E,z,y,x);E.onBeforeShadow(r,E,A,D,F,q,null),r.renderBufferDirect(D,null,F,q,E,null),E.onAfterShadow(r,E,A,D,F,q,null)}}const B=E.children;for(let F=0,z=B.length;F<z;F++)M(B[F],A,D,y,x)}function P(E){E.target.removeEventListener("dispose",P);for(const D in c){const y=c[D],x=E.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}const I0={[za]:ka,[Ha]:Wa,[Va]:Xa,[es]:Ga,[ka]:za,[Wa]:Ha,[Xa]:Va,[Ga]:es};function U0(r,t){function e(){let I=!1;const tt=new ne;let nt=null;const ft=new ne(0,0,0,0);return{setMask:function(Z){nt!==Z&&!I&&(r.colorMask(Z,Z,Z,Z),nt=Z)},setLocked:function(Z){I=Z},setClear:function(Z,Y,gt,Ft,ce){ce===!0&&(Z*=Ft,Y*=Ft,gt*=Ft),tt.set(Z,Y,gt,Ft),ft.equals(tt)===!1&&(r.clearColor(Z,Y,gt,Ft),ft.copy(tt))},reset:function(){I=!1,nt=null,ft.set(-1,0,0,0)}}}function i(){let I=!1,tt=!1,nt=null,ft=null,Z=null;return{setReversed:function(Y){if(tt!==Y){const gt=t.get("EXT_clip_control");Y?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),tt=Y;const Ft=Z;Z=null,this.setClear(Ft)}},getReversed:function(){return tt},setTest:function(Y){Y?it(r.DEPTH_TEST):Pt(r.DEPTH_TEST)},setMask:function(Y){nt!==Y&&!I&&(r.depthMask(Y),nt=Y)},setFunc:function(Y){if(tt&&(Y=I0[Y]),ft!==Y){switch(Y){case za:r.depthFunc(r.NEVER);break;case ka:r.depthFunc(r.ALWAYS);break;case Ha:r.depthFunc(r.LESS);break;case es:r.depthFunc(r.LEQUAL);break;case Va:r.depthFunc(r.EQUAL);break;case Ga:r.depthFunc(r.GEQUAL);break;case Wa:r.depthFunc(r.GREATER);break;case Xa:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ft=Y}},setLocked:function(Y){I=Y},setClear:function(Y){Z!==Y&&(tt&&(Y=1-Y),r.clearDepth(Y),Z=Y)},reset:function(){I=!1,nt=null,ft=null,Z=null,tt=!1}}}function n(){let I=!1,tt=null,nt=null,ft=null,Z=null,Y=null,gt=null,Ft=null,ce=null;return{setTest:function(Qt){I||(Qt?it(r.STENCIL_TEST):Pt(r.STENCIL_TEST))},setMask:function(Qt){tt!==Qt&&!I&&(r.stencilMask(Qt),tt=Qt)},setFunc:function(Qt,Ri,wi){(nt!==Qt||ft!==Ri||Z!==wi)&&(r.stencilFunc(Qt,Ri,wi),nt=Qt,ft=Ri,Z=wi)},setOp:function(Qt,Ri,wi){(Y!==Qt||gt!==Ri||Ft!==wi)&&(r.stencilOp(Qt,Ri,wi),Y=Qt,gt=Ri,Ft=wi)},setLocked:function(Qt){I=Qt},setClear:function(Qt){ce!==Qt&&(r.clearStencil(Qt),ce=Qt)},reset:function(){I=!1,tt=null,nt=null,ft=null,Z=null,Y=null,gt=null,Ft=null,ce=null}}}const s=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,w=null,b=null,M=null,P=null,E=null,A=new _t(0,0,0),D=0,y=!1,x=null,R=null,B=null,F=null,z=null;const q=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,K=0;const V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=K>=1):V.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=K>=2);let rt=null,ut={};const Et=r.getParameter(r.SCISSOR_BOX),kt=r.getParameter(r.VIEWPORT),pe=new ne().fromArray(Et),re=new ne().fromArray(kt);function j(I,tt,nt,ft){const Z=new Uint8Array(4),Y=r.createTexture();r.bindTexture(I,Y),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let gt=0;gt<nt;gt++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(tt,0,r.RGBA,1,1,ft,0,r.RGBA,r.UNSIGNED_BYTE,Z):r.texImage2D(tt+gt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Z);return Y}const at={};at[r.TEXTURE_2D]=j(r.TEXTURE_2D,r.TEXTURE_2D,1),at[r.TEXTURE_CUBE_MAP]=j(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),at[r.TEXTURE_2D_ARRAY]=j(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),at[r.TEXTURE_3D]=j(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(r.DEPTH_TEST),a.setFunc(es),Zt(!1),Tt(al),it(r.CULL_FACE),le(ki);function it(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function Pt(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function Dt(I,tt){return h[I]!==tt?(r.bindFramebuffer(I,tt),h[I]=tt,I===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=tt),I===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=tt),!0):!1}function Nt(I,tt){let nt=p,ft=!1;if(I){nt=d.get(tt),nt===void 0&&(nt=[],d.set(tt,nt));const Z=I.textures;if(nt.length!==Z.length||nt[0]!==r.COLOR_ATTACHMENT0){for(let Y=0,gt=Z.length;Y<gt;Y++)nt[Y]=r.COLOR_ATTACHMENT0+Y;nt.length=Z.length,ft=!0}}else nt[0]!==r.BACK&&(nt[0]=r.BACK,ft=!0);ft&&r.drawBuffers(nt)}function Se(I){return g!==I?(r.useProgram(I),g=I,!0):!1}const jt={[Sn]:r.FUNC_ADD,[Ah]:r.FUNC_SUBTRACT,[Ch]:r.FUNC_REVERSE_SUBTRACT};jt[Rh]=r.MIN,jt[Ph]=r.MAX;const L={[Dh]:r.ZERO,[Lh]:r.ONE,[Ih]:r.SRC_COLOR,[Oa]:r.SRC_ALPHA,[zh]:r.SRC_ALPHA_SATURATE,[Oh]:r.DST_COLOR,[Nh]:r.DST_ALPHA,[Uh]:r.ONE_MINUS_SRC_COLOR,[Ba]:r.ONE_MINUS_SRC_ALPHA,[Bh]:r.ONE_MINUS_DST_COLOR,[Fh]:r.ONE_MINUS_DST_ALPHA,[kh]:r.CONSTANT_COLOR,[Hh]:r.ONE_MINUS_CONSTANT_COLOR,[Vh]:r.CONSTANT_ALPHA,[Gh]:r.ONE_MINUS_CONSTANT_ALPHA};function le(I,tt,nt,ft,Z,Y,gt,Ft,ce,Qt){if(I===ki){_===!0&&(Pt(r.BLEND),_=!1);return}if(_===!1&&(it(r.BLEND),_=!0),I!==Eh){if(I!==m||Qt!==y){if((f!==Sn||M!==Sn)&&(r.blendEquation(r.FUNC_ADD),f=Sn,M=Sn),Qt)switch(I){case nn:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Mi:r.blendFunc(r.ONE,r.ONE);break;case ol:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ll:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case nn:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Mi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ol:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ll:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,b=null,P=null,E=null,A.set(0,0,0),D=0,m=I,y=Qt}return}Z=Z||tt,Y=Y||nt,gt=gt||ft,(tt!==f||Z!==M)&&(r.blendEquationSeparate(jt[tt],jt[Z]),f=tt,M=Z),(nt!==w||ft!==b||Y!==P||gt!==E)&&(r.blendFuncSeparate(L[nt],L[ft],L[Y],L[gt]),w=nt,b=ft,P=Y,E=gt),(Ft.equals(A)===!1||ce!==D)&&(r.blendColor(Ft.r,Ft.g,Ft.b,ce),A.copy(Ft),D=ce),m=I,y=!1}function Ct(I,tt){I.side===Je?Pt(r.CULL_FACE):it(r.CULL_FACE);let nt=I.side===$e;tt&&(nt=!nt),Zt(nt),I.blending===nn&&I.transparent===!1?le(ki):le(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const ft=I.stencilWrite;o.setTest(ft),ft&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),pt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?it(r.SAMPLE_ALPHA_TO_COVERAGE):Pt(r.SAMPLE_ALPHA_TO_COVERAGE)}function Zt(I){x!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),x=I)}function Tt(I){I!==bh?(it(r.CULL_FACE),I!==R&&(I===al?r.cullFace(r.BACK):I===Th?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Pt(r.CULL_FACE),R=I}function me(I){I!==B&&(G&&r.lineWidth(I),B=I)}function pt(I,tt,nt){I?(it(r.POLYGON_OFFSET_FILL),(F!==tt||z!==nt)&&(r.polygonOffset(tt,nt),F=tt,z=nt)):Pt(r.POLYGON_OFFSET_FILL)}function Ht(I){I?it(r.SCISSOR_TEST):Pt(r.SCISSOR_TEST)}function Ue(I){I===void 0&&(I=r.TEXTURE0+q-1),rt!==I&&(r.activeTexture(I),rt=I)}function we(I,tt,nt){nt===void 0&&(rt===null?nt=r.TEXTURE0+q-1:nt=rt);let ft=ut[nt];ft===void 0&&(ft={type:void 0,texture:void 0},ut[nt]=ft),(ft.type!==I||ft.texture!==tt)&&(rt!==nt&&(r.activeTexture(nt),rt=nt),r.bindTexture(I,tt||at[I]),ft.type=I,ft.texture=tt)}function C(){const I=ut[rt];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function v(){try{r.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{r.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function X(){try{r.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{r.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(){try{r.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function wt(){try{r.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function et(){try{r.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{r.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xt(){try{r.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{r.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ct(I){pe.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),pe.copy(I))}function It(I){re.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),re.copy(I))}function Mt(I,tt){let nt=c.get(tt);nt===void 0&&(nt=new WeakMap,c.set(tt,nt));let ft=nt.get(I);ft===void 0&&(ft=r.getUniformBlockIndex(tt,I.name),nt.set(I,ft))}function ot(I,tt){const ft=c.get(tt).get(I);l.get(tt)!==ft&&(r.uniformBlockBinding(tt,ft,I.__bindingPointIndex),l.set(tt,ft))}function Ot(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),u={},rt=null,ut={},h={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,w=null,b=null,M=null,P=null,E=null,A=new _t(0,0,0),D=0,y=!1,x=null,R=null,B=null,F=null,z=null,pe.set(0,0,r.canvas.width,r.canvas.height),re.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:it,disable:Pt,bindFramebuffer:Dt,drawBuffers:Nt,useProgram:Se,setBlending:le,setMaterial:Ct,setFlipSided:Zt,setCullFace:Tt,setLineWidth:me,setPolygonOffset:pt,setScissorTest:Ht,activeTexture:Ue,bindTexture:we,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:xt,texImage3D:Q,updateUBOMapping:Mt,uniformBlockBinding:ot,texStorage2D:et,texStorage3D:vt,texSubImage2D:X,texSubImage3D:$,compressedTexSubImage2D:W,compressedTexSubImage3D:wt,scissor:ct,viewport:It,reset:Ot}}function N0(r,t,e,i,n,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,v){return p?new OffscreenCanvas(C,v):zr("canvas")}function _(C,v,O){let X=1;const $=we(C);if(($.width>O||$.height>O)&&(X=O/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const W=Math.floor(X*$.width),wt=Math.floor(X*$.height);h===void 0&&(h=g(W,wt));const et=v?g(W,wt):h;return et.width=W,et.height=wt,et.getContext("2d").drawImage(C,0,0,W,wt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+W+"x"+wt+")."),et}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){r.generateMipmap(C)}function w(C){return C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?r.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function b(C,v,O,X,$=!1){if(C!==null){if(r[C]!==void 0)return r[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let W=v;if(v===r.RED&&(O===r.FLOAT&&(W=r.R32F),O===r.HALF_FLOAT&&(W=r.R16F),O===r.UNSIGNED_BYTE&&(W=r.R8)),v===r.RED_INTEGER&&(O===r.UNSIGNED_BYTE&&(W=r.R8UI),O===r.UNSIGNED_SHORT&&(W=r.R16UI),O===r.UNSIGNED_INT&&(W=r.R32UI),O===r.BYTE&&(W=r.R8I),O===r.SHORT&&(W=r.R16I),O===r.INT&&(W=r.R32I)),v===r.RG&&(O===r.FLOAT&&(W=r.RG32F),O===r.HALF_FLOAT&&(W=r.RG16F),O===r.UNSIGNED_BYTE&&(W=r.RG8)),v===r.RG_INTEGER&&(O===r.UNSIGNED_BYTE&&(W=r.RG8UI),O===r.UNSIGNED_SHORT&&(W=r.RG16UI),O===r.UNSIGNED_INT&&(W=r.RG32UI),O===r.BYTE&&(W=r.RG8I),O===r.SHORT&&(W=r.RG16I),O===r.INT&&(W=r.RG32I)),v===r.RGB_INTEGER&&(O===r.UNSIGNED_BYTE&&(W=r.RGB8UI),O===r.UNSIGNED_SHORT&&(W=r.RGB16UI),O===r.UNSIGNED_INT&&(W=r.RGB32UI),O===r.BYTE&&(W=r.RGB8I),O===r.SHORT&&(W=r.RGB16I),O===r.INT&&(W=r.RGB32I)),v===r.RGBA_INTEGER&&(O===r.UNSIGNED_BYTE&&(W=r.RGBA8UI),O===r.UNSIGNED_SHORT&&(W=r.RGBA16UI),O===r.UNSIGNED_INT&&(W=r.RGBA32UI),O===r.BYTE&&(W=r.RGBA8I),O===r.SHORT&&(W=r.RGBA16I),O===r.INT&&(W=r.RGBA32I)),v===r.RGB&&O===r.UNSIGNED_INT_5_9_9_9_REV&&(W=r.RGB9_E5),v===r.RGBA){const wt=$?Or:Yt.getTransfer(X);O===r.FLOAT&&(W=r.RGBA32F),O===r.HALF_FLOAT&&(W=r.RGBA16F),O===r.UNSIGNED_BYTE&&(W=wt===te?r.SRGB8_ALPHA8:r.RGBA8),O===r.UNSIGNED_SHORT_4_4_4_4&&(W=r.RGBA4),O===r.UNSIGNED_SHORT_5_5_5_1&&(W=r.RGB5_A1)}return(W===r.R16F||W===r.R32F||W===r.RG16F||W===r.RG32F||W===r.RGBA16F||W===r.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function M(C,v){let O;return C?v===null||v===An||v===Fs?O=r.DEPTH24_STENCIL8:v===Ei?O=r.DEPTH32F_STENCIL8:v===Ns&&(O=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===An||v===Fs?O=r.DEPTH_COMPONENT24:v===Ei?O=r.DEPTH_COMPONENT32F:v===Ns&&(O=r.DEPTH_COMPONENT16),O}function P(C,v){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==ri&&C.minFilter!==_i?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function E(C){const v=C.target;v.removeEventListener("dispose",E),D(v),v.isVideoTexture&&u.delete(v)}function A(C){const v=C.target;v.removeEventListener("dispose",A),x(v)}function D(C){const v=i.get(C);if(v.__webglInit===void 0)return;const O=C.source,X=d.get(O);if(X){const $=X[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&y(C),Object.keys(X).length===0&&d.delete(O)}i.remove(C)}function y(C){const v=i.get(C);r.deleteTexture(v.__webglTexture);const O=C.source,X=d.get(O);delete X[v.__cacheKey],a.memory.textures--}function x(C){const v=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let $=0;$<v.__webglFramebuffer[X].length;$++)r.deleteFramebuffer(v.__webglFramebuffer[X][$]);else r.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)r.deleteFramebuffer(v.__webglFramebuffer[X]);else r.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&r.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&r.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&r.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&r.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=C.textures;for(let X=0,$=O.length;X<$;X++){const W=i.get(O[X]);W.__webglTexture&&(r.deleteTexture(W.__webglTexture),a.memory.textures--),i.remove(O[X])}i.remove(C)}let R=0;function B(){R=0}function F(){const C=R;return C>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+n.maxTextures),R+=1,C}function z(C){const v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function q(C,v){const O=i.get(C);if(C.isVideoTexture&&Ht(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&O.__version!==C.version){const X=C.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{at(O,C,v);return}}else C.isExternalTexture&&(O.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,O.__webglTexture,r.TEXTURE0+v)}function G(C,v){const O=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){at(O,C,v);return}e.bindTexture(r.TEXTURE_2D_ARRAY,O.__webglTexture,r.TEXTURE0+v)}function K(C,v){const O=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){at(O,C,v);return}e.bindTexture(r.TEXTURE_3D,O.__webglTexture,r.TEXTURE0+v)}function V(C,v){const O=i.get(C);if(C.version>0&&O.__version!==C.version){it(O,C,v);return}e.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+v)}const rt={[Us]:r.REPEAT,[bn]:r.CLAMP_TO_EDGE,[Ya]:r.MIRRORED_REPEAT},ut={[ri]:r.NEAREST,[qh]:r.NEAREST_MIPMAP_NEAREST,[$s]:r.NEAREST_MIPMAP_LINEAR,[_i]:r.LINEAR,[Qr]:r.LINEAR_MIPMAP_NEAREST,[Ji]:r.LINEAR_MIPMAP_LINEAR},Et={[$h]:r.NEVER,[iu]:r.ALWAYS,[Zh]:r.LESS,[jc]:r.LEQUAL,[Jh]:r.EQUAL,[eu]:r.GEQUAL,[Qh]:r.GREATER,[tu]:r.NOTEQUAL};function kt(C,v){if(v.type===Ei&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===_i||v.magFilter===Qr||v.magFilter===$s||v.magFilter===Ji||v.minFilter===_i||v.minFilter===Qr||v.minFilter===$s||v.minFilter===Ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(C,r.TEXTURE_WRAP_S,rt[v.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,rt[v.wrapT]),(C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY)&&r.texParameteri(C,r.TEXTURE_WRAP_R,rt[v.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,ut[v.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,ut[v.minFilter]),v.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,Et[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ri||v.minFilter!==$s&&v.minFilter!==Ji||v.type===Ei&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");r.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,n.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function pe(C,v){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",E));const X=v.source;let $=d.get(X);$===void 0&&($={},d.set(X,$));const W=z(v);if(W!==C.__cacheKey){$[W]===void 0&&($[W]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,O=!0),$[W].usedTimes++;const wt=$[C.__cacheKey];wt!==void 0&&($[C.__cacheKey].usedTimes--,wt.usedTimes===0&&y(v)),C.__cacheKey=W,C.__webglTexture=$[W].texture}return O}function re(C,v,O){return Math.floor(Math.floor(C/O)/v)}function j(C,v,O,X){const W=C.updateRanges;if(W.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,v.width,v.height,O,X,v.data);else{W.sort((Q,ct)=>Q.start-ct.start);let wt=0;for(let Q=1;Q<W.length;Q++){const ct=W[wt],It=W[Q],Mt=ct.start+ct.count,ot=re(It.start,v.width,4),Ot=re(ct.start,v.width,4);It.start<=Mt+1&&ot===Ot&&re(It.start+It.count-1,v.width,4)===ot?ct.count=Math.max(ct.count,It.start+It.count-ct.start):(++wt,W[wt]=It)}W.length=wt+1;const et=r.getParameter(r.UNPACK_ROW_LENGTH),vt=r.getParameter(r.UNPACK_SKIP_PIXELS),xt=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,v.width);for(let Q=0,ct=W.length;Q<ct;Q++){const It=W[Q],Mt=Math.floor(It.start/4),ot=Math.ceil(It.count/4),Ot=Mt%v.width,I=Math.floor(Mt/v.width),tt=ot,nt=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,Ot),r.pixelStorei(r.UNPACK_SKIP_ROWS,I),e.texSubImage2D(r.TEXTURE_2D,0,Ot,I,tt,nt,O,X,v.data)}C.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,et),r.pixelStorei(r.UNPACK_SKIP_PIXELS,vt),r.pixelStorei(r.UNPACK_SKIP_ROWS,xt)}}function at(C,v,O){let X=r.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=r.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=r.TEXTURE_3D);const $=pe(C,v),W=v.source;e.bindTexture(X,C.__webglTexture,r.TEXTURE0+O);const wt=i.get(W);if(W.version!==wt.__version||$===!0){e.activeTexture(r.TEXTURE0+O);const et=Yt.getPrimaries(Yt.workingColorSpace),vt=v.colorSpace===Zi?null:Yt.getPrimaries(v.colorSpace),xt=v.colorSpace===Zi||et===vt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);let Q=_(v.image,!1,n.maxTextureSize);Q=Ue(v,Q);const ct=s.convert(v.format,v.colorSpace),It=s.convert(v.type);let Mt=b(v.internalFormat,ct,It,v.colorSpace,v.isVideoTexture);kt(X,v);let ot;const Ot=v.mipmaps,I=v.isVideoTexture!==!0,tt=wt.__version===void 0||$===!0,nt=W.dataReady,ft=P(v,Q);if(v.isDepthTexture)Mt=M(v.format===Bs,v.type),tt&&(I?e.texStorage2D(r.TEXTURE_2D,1,Mt,Q.width,Q.height):e.texImage2D(r.TEXTURE_2D,0,Mt,Q.width,Q.height,0,ct,It,null));else if(v.isDataTexture)if(Ot.length>0){I&&tt&&e.texStorage2D(r.TEXTURE_2D,ft,Mt,Ot[0].width,Ot[0].height);for(let Z=0,Y=Ot.length;Z<Y;Z++)ot=Ot[Z],I?nt&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,ot.width,ot.height,ct,It,ot.data):e.texImage2D(r.TEXTURE_2D,Z,Mt,ot.width,ot.height,0,ct,It,ot.data);v.generateMipmaps=!1}else I?(tt&&e.texStorage2D(r.TEXTURE_2D,ft,Mt,Q.width,Q.height),nt&&j(v,Q,ct,It)):e.texImage2D(r.TEXTURE_2D,0,Mt,Q.width,Q.height,0,ct,It,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){I&&tt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ft,Mt,Ot[0].width,Ot[0].height,Q.depth);for(let Z=0,Y=Ot.length;Z<Y;Z++)if(ot=Ot[Z],v.format!==di)if(ct!==null)if(I){if(nt)if(v.layerUpdates.size>0){const gt=Yl(ot.width,ot.height,v.format,v.type);for(const Ft of v.layerUpdates){const ce=ot.data.subarray(Ft*gt/ot.data.BYTES_PER_ELEMENT,(Ft+1)*gt/ot.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,Ft,ot.width,ot.height,1,ct,ce)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ot.width,ot.height,Q.depth,ct,ot.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,Mt,ot.width,ot.height,Q.depth,0,ot.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?nt&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ot.width,ot.height,Q.depth,ct,It,ot.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Z,Mt,ot.width,ot.height,Q.depth,0,ct,It,ot.data)}else{I&&tt&&e.texStorage2D(r.TEXTURE_2D,ft,Mt,Ot[0].width,Ot[0].height);for(let Z=0,Y=Ot.length;Z<Y;Z++)ot=Ot[Z],v.format!==di?ct!==null?I?nt&&e.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,ot.width,ot.height,ct,ot.data):e.compressedTexImage2D(r.TEXTURE_2D,Z,Mt,ot.width,ot.height,0,ot.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?nt&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,ot.width,ot.height,ct,It,ot.data):e.texImage2D(r.TEXTURE_2D,Z,Mt,ot.width,ot.height,0,ct,It,ot.data)}else if(v.isDataArrayTexture)if(I){if(tt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ft,Mt,Q.width,Q.height,Q.depth),nt)if(v.layerUpdates.size>0){const Z=Yl(Q.width,Q.height,v.format,v.type);for(const Y of v.layerUpdates){const gt=Q.data.subarray(Y*Z/Q.data.BYTES_PER_ELEMENT,(Y+1)*Z/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Y,Q.width,Q.height,1,ct,It,gt)}v.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ct,It,Q.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Mt,Q.width,Q.height,Q.depth,0,ct,It,Q.data);else if(v.isData3DTexture)I?(tt&&e.texStorage3D(r.TEXTURE_3D,ft,Mt,Q.width,Q.height,Q.depth),nt&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ct,It,Q.data)):e.texImage3D(r.TEXTURE_3D,0,Mt,Q.width,Q.height,Q.depth,0,ct,It,Q.data);else if(v.isFramebufferTexture){if(tt)if(I)e.texStorage2D(r.TEXTURE_2D,ft,Mt,Q.width,Q.height);else{let Z=Q.width,Y=Q.height;for(let gt=0;gt<ft;gt++)e.texImage2D(r.TEXTURE_2D,gt,Mt,Z,Y,0,ct,It,null),Z>>=1,Y>>=1}}else if(Ot.length>0){if(I&&tt){const Z=we(Ot[0]);e.texStorage2D(r.TEXTURE_2D,ft,Mt,Z.width,Z.height)}for(let Z=0,Y=Ot.length;Z<Y;Z++)ot=Ot[Z],I?nt&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,ct,It,ot):e.texImage2D(r.TEXTURE_2D,Z,Mt,ct,It,ot);v.generateMipmaps=!1}else if(I){if(tt){const Z=we(Q);e.texStorage2D(r.TEXTURE_2D,ft,Mt,Z.width,Z.height)}nt&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,ct,It,Q)}else e.texImage2D(r.TEXTURE_2D,0,Mt,ct,It,Q);m(v)&&f(X),wt.__version=W.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function it(C,v,O){if(v.image.length!==6)return;const X=pe(C,v),$=v.source;e.bindTexture(r.TEXTURE_CUBE_MAP,C.__webglTexture,r.TEXTURE0+O);const W=i.get($);if($.version!==W.__version||X===!0){e.activeTexture(r.TEXTURE0+O);const wt=Yt.getPrimaries(Yt.workingColorSpace),et=v.colorSpace===Zi?null:Yt.getPrimaries(v.colorSpace),vt=v.colorSpace===Zi||wt===et?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,v.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const xt=v.isCompressedTexture||v.image[0].isCompressedTexture,Q=v.image[0]&&v.image[0].isDataTexture,ct=[];for(let Y=0;Y<6;Y++)!xt&&!Q?ct[Y]=_(v.image[Y],!0,n.maxCubemapSize):ct[Y]=Q?v.image[Y].image:v.image[Y],ct[Y]=Ue(v,ct[Y]);const It=ct[0],Mt=s.convert(v.format,v.colorSpace),ot=s.convert(v.type),Ot=b(v.internalFormat,Mt,ot,v.colorSpace),I=v.isVideoTexture!==!0,tt=W.__version===void 0||X===!0,nt=$.dataReady;let ft=P(v,It);kt(r.TEXTURE_CUBE_MAP,v);let Z;if(xt){I&&tt&&e.texStorage2D(r.TEXTURE_CUBE_MAP,ft,Ot,It.width,It.height);for(let Y=0;Y<6;Y++){Z=ct[Y].mipmaps;for(let gt=0;gt<Z.length;gt++){const Ft=Z[gt];v.format!==di?Mt!==null?I?nt&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt,0,0,Ft.width,Ft.height,Mt,Ft.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt,Ot,Ft.width,Ft.height,0,Ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?nt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt,0,0,Ft.width,Ft.height,Mt,ot,Ft.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt,Ot,Ft.width,Ft.height,0,Mt,ot,Ft.data)}}}else{if(Z=v.mipmaps,I&&tt){Z.length>0&&ft++;const Y=we(ct[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,ft,Ot,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(Q){I?nt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ct[Y].width,ct[Y].height,Mt,ot,ct[Y].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ot,ct[Y].width,ct[Y].height,0,Mt,ot,ct[Y].data);for(let gt=0;gt<Z.length;gt++){const ce=Z[gt].image[Y].image;I?nt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt+1,0,0,ce.width,ce.height,Mt,ot,ce.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt+1,Ot,ce.width,ce.height,0,Mt,ot,ce.data)}}else{I?nt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Mt,ot,ct[Y]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ot,Mt,ot,ct[Y]);for(let gt=0;gt<Z.length;gt++){const Ft=Z[gt];I?nt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt+1,0,0,Mt,ot,Ft.image[Y]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,gt+1,Ot,Mt,ot,Ft.image[Y])}}}m(v)&&f(r.TEXTURE_CUBE_MAP),W.__version=$.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Pt(C,v,O,X,$,W){const wt=s.convert(O.format,O.colorSpace),et=s.convert(O.type),vt=b(O.internalFormat,wt,et,O.colorSpace),xt=i.get(v),Q=i.get(O);if(Q.__renderTarget=v,!xt.__hasExternalTextures){const ct=Math.max(1,v.width>>W),It=Math.max(1,v.height>>W);$===r.TEXTURE_3D||$===r.TEXTURE_2D_ARRAY?e.texImage3D($,W,vt,ct,It,v.depth,0,wt,et,null):e.texImage2D($,W,vt,ct,It,0,wt,et,null)}e.bindFramebuffer(r.FRAMEBUFFER,C),pt(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,X,$,Q.__webglTexture,0,me(v)):($===r.TEXTURE_2D||$>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,X,$,Q.__webglTexture,W),e.bindFramebuffer(r.FRAMEBUFFER,null)}function Dt(C,v,O){if(r.bindRenderbuffer(r.RENDERBUFFER,C),v.depthBuffer){const X=v.depthTexture,$=X&&X.isDepthTexture?X.type:null,W=M(v.stencilBuffer,$),wt=v.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,et=me(v);pt(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,et,W,v.width,v.height):O?r.renderbufferStorageMultisample(r.RENDERBUFFER,et,W,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,W,v.width,v.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,wt,r.RENDERBUFFER,C)}else{const X=v.textures;for(let $=0;$<X.length;$++){const W=X[$],wt=s.convert(W.format,W.colorSpace),et=s.convert(W.type),vt=b(W.internalFormat,wt,et,W.colorSpace),xt=me(v);O&&pt(v)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,xt,vt,v.width,v.height):pt(v)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,xt,vt,v.width,v.height):r.renderbufferStorage(r.RENDERBUFFER,vt,v.width,v.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Nt(C,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(v.depthTexture);X.__renderTarget=v,(!X.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q(v.depthTexture,0);const $=X.__webglTexture,W=me(v);if(v.depthTexture.format===Os)pt(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,$,0,W):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,$,0);else if(v.depthTexture.format===Bs)pt(v)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,$,0,W):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Se(C){const v=i.get(C),O=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){const X=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){const $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=X}if(C.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const X=C.texture.mipmaps;X&&X.length>0?Nt(v.__webglFramebuffer[0],C):Nt(v.__webglFramebuffer,C)}else if(O){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=r.createRenderbuffer(),Dt(v.__webglDepthbuffer[X],C,!1);else{const $=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer[X];r.bindRenderbuffer(r.RENDERBUFFER,W),r.framebufferRenderbuffer(r.FRAMEBUFFER,$,r.RENDERBUFFER,W)}}else{const X=C.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=r.createRenderbuffer(),Dt(v.__webglDepthbuffer,C,!1);else{const $=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,W),r.framebufferRenderbuffer(r.FRAMEBUFFER,$,r.RENDERBUFFER,W)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function jt(C,v,O){const X=i.get(C);v!==void 0&&Pt(X.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),O!==void 0&&Se(C)}function L(C){const v=C.texture,O=i.get(C),X=i.get(v);C.addEventListener("dispose",A);const $=C.textures,W=C.isWebGLCubeRenderTarget===!0,wt=$.length>1;if(wt||(X.__webglTexture===void 0&&(X.__webglTexture=r.createTexture()),X.__version=v.version,a.memory.textures++),W){O.__webglFramebuffer=[];for(let et=0;et<6;et++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[et]=[];for(let vt=0;vt<v.mipmaps.length;vt++)O.__webglFramebuffer[et][vt]=r.createFramebuffer()}else O.__webglFramebuffer[et]=r.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let et=0;et<v.mipmaps.length;et++)O.__webglFramebuffer[et]=r.createFramebuffer()}else O.__webglFramebuffer=r.createFramebuffer();if(wt)for(let et=0,vt=$.length;et<vt;et++){const xt=i.get($[et]);xt.__webglTexture===void 0&&(xt.__webglTexture=r.createTexture(),a.memory.textures++)}if(C.samples>0&&pt(C)===!1){O.__webglMultisampledFramebuffer=r.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let et=0;et<$.length;et++){const vt=$[et];O.__webglColorRenderbuffer[et]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,O.__webglColorRenderbuffer[et]);const xt=s.convert(vt.format,vt.colorSpace),Q=s.convert(vt.type),ct=b(vt.internalFormat,xt,Q,vt.colorSpace,C.isXRRenderTarget===!0),It=me(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,It,ct,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+et,r.RENDERBUFFER,O.__webglColorRenderbuffer[et])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=r.createRenderbuffer(),Dt(O.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(W){e.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture),kt(r.TEXTURE_CUBE_MAP,v);for(let et=0;et<6;et++)if(v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)Pt(O.__webglFramebuffer[et][vt],C,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+et,vt);else Pt(O.__webglFramebuffer[et],C,v,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+et,0);m(v)&&f(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(wt){for(let et=0,vt=$.length;et<vt;et++){const xt=$[et],Q=i.get(xt);let ct=r.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ct=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(ct,Q.__webglTexture),kt(ct,xt),Pt(O.__webglFramebuffer,C,xt,r.COLOR_ATTACHMENT0+et,ct,0),m(xt)&&f(ct)}e.unbindTexture()}else{let et=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(et=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(et,X.__webglTexture),kt(et,v),v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)Pt(O.__webglFramebuffer[vt],C,v,r.COLOR_ATTACHMENT0,et,vt);else Pt(O.__webglFramebuffer,C,v,r.COLOR_ATTACHMENT0,et,0);m(v)&&f(et),e.unbindTexture()}C.depthBuffer&&Se(C)}function le(C){const v=C.textures;for(let O=0,X=v.length;O<X;O++){const $=v[O];if(m($)){const W=w(C),wt=i.get($).__webglTexture;e.bindTexture(W,wt),f(W),e.unbindTexture()}}}const Ct=[],Zt=[];function Tt(C){if(C.samples>0){if(pt(C)===!1){const v=C.textures,O=C.width,X=C.height;let $=r.COLOR_BUFFER_BIT;const W=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,wt=i.get(C),et=v.length>1;if(et)for(let xt=0;xt<v.length;xt++)e.bindFramebuffer(r.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,wt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,wt.__webglMultisampledFramebuffer);const vt=C.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,wt.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let xt=0;xt<v.length;xt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=r.STENCIL_BUFFER_BIT)),et){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,wt.__webglColorRenderbuffer[xt]);const Q=i.get(v[xt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Q,0)}r.blitFramebuffer(0,0,O,X,0,0,O,X,$,r.NEAREST),l===!0&&(Ct.length=0,Zt.length=0,Ct.push(r.COLOR_ATTACHMENT0+xt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ct.push(W),Zt.push(W),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Zt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ct))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),et)for(let xt=0;xt<v.length;xt++){e.bindFramebuffer(r.FRAMEBUFFER,wt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.RENDERBUFFER,wt.__webglColorRenderbuffer[xt]);const Q=i.get(v[xt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,wt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+xt,r.TEXTURE_2D,Q,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,wt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const v=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[v])}}}function me(C){return Math.min(n.maxSamples,C.samples)}function pt(C){const v=i.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ht(C){const v=a.render.frame;u.get(C)!==v&&(u.set(C,v),C.update())}function Ue(C,v){const O=C.colorSpace,X=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==ss&&O!==Zi&&(Yt.getTransfer(O)===te?(X!==di||$!==Ci)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function we(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=B,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=K,this.setTextureCube=V,this.rebindTextures=jt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=Pt,this.useMultisampledRTT=pt}function F0(r,t){function e(i,n=Zi){let s;const a=Yt.getTransfer(n);if(i===Ci)return r.UNSIGNED_BYTE;if(i===No)return r.UNSIGNED_SHORT_4_4_4_4;if(i===Fo)return r.UNSIGNED_SHORT_5_5_5_1;if(i===Vc)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===kc)return r.BYTE;if(i===Hc)return r.SHORT;if(i===Ns)return r.UNSIGNED_SHORT;if(i===Uo)return r.INT;if(i===An)return r.UNSIGNED_INT;if(i===Ei)return r.FLOAT;if(i===Hi)return r.HALF_FLOAT;if(i===Gc)return r.ALPHA;if(i===Wc)return r.RGB;if(i===di)return r.RGBA;if(i===Os)return r.DEPTH_COMPONENT;if(i===Bs)return r.DEPTH_STENCIL;if(i===Oo)return r.RED;if(i===Bo)return r.RED_INTEGER;if(i===Xc)return r.RG;if(i===zo)return r.RG_INTEGER;if(i===ko)return r.RGBA_INTEGER;if(i===Rr||i===Pr||i===Dr||i===Lr)if(a===te)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Rr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Pr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Dr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Lr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Rr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Pr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Dr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Lr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ka||i===$a||i===Za||i===Ja)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ka)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===$a)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Za)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ja)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qa||i===to||i===eo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Qa||i===to)return a===te?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===eo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===io||i===no||i===so||i===ro||i===ao||i===oo||i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===io)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===no)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===so)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ro)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ao)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===oo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===lo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===co)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ho)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===uo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===fo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===po)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===mo)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===go)return a===te?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ir||i===_o||i===vo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Ir)return a===te?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===_o)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===vo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===qc||i===xo||i===Mo||i===yo)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ir)return s.COMPRESSED_RED_RGTC1_EXT;if(i===xo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Mo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===yo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fs?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:e}}class fh extends Xe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const O0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class z0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new fh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ze({vertexShader:O0,fragmentShader:B0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qt(new En(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class k0 extends cs{constructor(t,e){super();const i=this;let n=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null;const _=new z0,m={},f=e.getContextAttributes();let w=null,b=null;const M=[],P=[],E=new ht;let A=null;const D=new ni;D.viewport=new ne;const y=new ni;y.viewport=new ne;const x=[D,y],R=new rd;let B=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let at=M[j];return at===void 0&&(at=new Ma,M[j]=at),at.getTargetRaySpace()},this.getControllerGrip=function(j){let at=M[j];return at===void 0&&(at=new Ma,M[j]=at),at.getGripSpace()},this.getHand=function(j){let at=M[j];return at===void 0&&(at=new Ma,M[j]=at),at.getHandSpace()};function z(j){const at=P.indexOf(j.inputSource);if(at===-1)return;const it=M[at];it!==void 0&&(it.update(j.inputSource,j.frame,c||a),it.dispatchEvent({type:j.type,data:j.inputSource}))}function q(){n.removeEventListener("select",z),n.removeEventListener("selectstart",z),n.removeEventListener("selectend",z),n.removeEventListener("squeeze",z),n.removeEventListener("squeezestart",z),n.removeEventListener("squeezeend",z),n.removeEventListener("end",q),n.removeEventListener("inputsourceschange",G);for(let j=0;j<M.length;j++){const at=P[j];at!==null&&(P[j]=null,M[j].disconnect(at))}B=null,F=null,_.reset();for(const j in m)delete m[j];t.setRenderTarget(w),p=null,d=null,h=null,n=null,b=null,re.stop(),i.isPresenting=!1,t.setPixelRatio(A),t.setSize(E.width,E.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(j){if(n=j,n!==null){if(w=t.getRenderTarget(),n.addEventListener("select",z),n.addEventListener("selectstart",z),n.addEventListener("selectend",z),n.addEventListener("squeeze",z),n.addEventListener("squeezestart",z),n.addEventListener("squeezeend",z),n.addEventListener("end",q),n.addEventListener("inputsourceschange",G),f.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(E),typeof XRWebGLBinding<"u"&&(h=new XRWebGLBinding(n,e)),h!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Pt=null,Dt=null;f.depth&&(Dt=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=f.stencil?Bs:Os,Pt=f.stencil?Fs:An);const Nt={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:s};d=h.createProjectionLayer(Nt),n.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new xi(d.textureWidth,d.textureHeight,{format:di,type:Ci,depthTexture:new rh(d.textureWidth,d.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const it={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(n,e,it),n.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new xi(p.framebufferWidth,p.framebufferHeight,{format:di,type:Ci,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),re.setContext(n),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function G(j){for(let at=0;at<j.removed.length;at++){const it=j.removed[at],Pt=P.indexOf(it);Pt>=0&&(P[Pt]=null,M[Pt].disconnect(it))}for(let at=0;at<j.added.length;at++){const it=j.added[at];let Pt=P.indexOf(it);if(Pt===-1){for(let Nt=0;Nt<M.length;Nt++)if(Nt>=P.length){P.push(it),Pt=Nt;break}else if(P[Nt]===null){P[Nt]=it,Pt=Nt;break}if(Pt===-1)break}const Dt=M[Pt];Dt&&Dt.connect(it)}}const K=new T,V=new T;function rt(j,at,it){K.setFromMatrixPosition(at.matrixWorld),V.setFromMatrixPosition(it.matrixWorld);const Pt=K.distanceTo(V),Dt=at.projectionMatrix.elements,Nt=it.projectionMatrix.elements,Se=Dt[14]/(Dt[10]-1),jt=Dt[14]/(Dt[10]+1),L=(Dt[9]+1)/Dt[5],le=(Dt[9]-1)/Dt[5],Ct=(Dt[8]-1)/Dt[0],Zt=(Nt[8]+1)/Nt[0],Tt=Se*Ct,me=Se*Zt,pt=Pt/(-Ct+Zt),Ht=pt*-Ct;if(at.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ht),j.translateZ(pt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Dt[10]===-1)j.projectionMatrix.copy(at.projectionMatrix),j.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const Ue=Se+pt,we=jt+pt,C=Tt-Ht,v=me+(Pt-Ht),O=L*jt/we*Ue,X=le*jt/we*Ue;j.projectionMatrix.makePerspective(C,v,O,X,Ue,we),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ut(j,at){at===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(at.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(n===null)return;let at=j.near,it=j.far;_.texture!==null&&(_.depthNear>0&&(at=_.depthNear),_.depthFar>0&&(it=_.depthFar)),R.near=y.near=D.near=at,R.far=y.far=D.far=it,(B!==R.near||F!==R.far)&&(n.updateRenderState({depthNear:R.near,depthFar:R.far}),B=R.near,F=R.far),R.layers.mask=j.layers.mask|6,D.layers.mask=R.layers.mask&3,y.layers.mask=R.layers.mask&5;const Pt=j.parent,Dt=R.cameras;ut(R,Pt);for(let Nt=0;Nt<Dt.length;Nt++)ut(Dt[Nt],Pt);Dt.length===2?rt(R,D,y):R.projectionMatrix.copy(D.projectionMatrix),Et(j,R,Pt)};function Et(j,at,it){it===null?j.matrix.copy(at.matrixWorld):(j.matrix.copy(it.matrixWorld),j.matrix.invert(),j.matrix.multiply(at.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(at.projectionMatrix),j.projectionMatrixInverse.copy(at.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=zs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(R)},this.getCameraTexture=function(j){return m[j]};let kt=null;function pe(j,at){if(u=at.getViewerPose(c||a),g=at,u!==null){const it=u.views;p!==null&&(t.setRenderTargetFramebuffer(b,p.framebuffer),t.setRenderTarget(b));let Pt=!1;it.length!==R.cameras.length&&(R.cameras.length=0,Pt=!0);for(let jt=0;jt<it.length;jt++){const L=it[jt];let le=null;if(p!==null)le=p.getViewport(L);else{const Zt=h.getViewSubImage(d,L);le=Zt.viewport,jt===0&&(t.setRenderTargetTextures(b,Zt.colorTexture,Zt.depthStencilTexture),t.setRenderTarget(b))}let Ct=x[jt];Ct===void 0&&(Ct=new ni,Ct.layers.enable(jt),Ct.viewport=new ne,x[jt]=Ct),Ct.matrix.fromArray(L.transform.matrix),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.projectionMatrix.fromArray(L.projectionMatrix),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert(),Ct.viewport.set(le.x,le.y,le.width,le.height),jt===0&&(R.matrix.copy(Ct.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Pt===!0&&R.cameras.push(Ct)}const Dt=n.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&h){const jt=h.getDepthInformation(it[0]);jt&&jt.isValid&&jt.texture&&_.init(jt,n.renderState)}if(Dt&&Dt.includes("camera-access")&&(t.state.unbindTexture(),h))for(let jt=0;jt<it.length;jt++){const L=it[jt].camera;if(L){let le=m[L];le||(le=new fh,m[L]=le);const Ct=h.getCameraImage(L);le.sourceTexture=Ct}}}for(let it=0;it<M.length;it++){const Pt=P[it],Dt=M[it];Pt!==null&&Dt!==void 0&&Dt.update(Pt,at,c||a)}kt&&kt(j,at),at.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:at}),g=null}const re=new lh;re.setAnimationLoop(pe),this.setAnimationLoop=function(j){kt=j},this.dispose=function(){}}}const mn=new yi,H0=new Jt;function V0(r,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Qc(r)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function n(m,f,w,b,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),h(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),_(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,w,b):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===$e&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===$e&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const w=t.get(f),b=w.envMap,M=w.envMapRotation;b&&(m.envMap.value=b,mn.copy(M),mn.x*=-1,mn.y*=-1,mn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(mn.y*=-1,mn.z*=-1),m.envMapRotation.value.setFromMatrix4(H0.makeRotationFromEuler(mn)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,w,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=b*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,w){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===$e&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const w=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function G0(r,t,e,i){let n={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,b){const M=b.program;i.uniformBlockBinding(w,M)}function c(w,b){let M=n[w.id];M===void 0&&(g(w),M=u(w),n[w.id]=M,w.addEventListener("dispose",m));const P=b.program;i.updateUBOMapping(w,P);const E=t.render.frame;s[w.id]!==E&&(d(w),s[w.id]=E)}function u(w){const b=h();w.__bindingPointIndex=b;const M=r.createBuffer(),P=w.__size,E=w.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,P,E),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,b,M),M}function h(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const b=n[w.id],M=w.uniforms,P=w.__cache;r.bindBuffer(r.UNIFORM_BUFFER,b);for(let E=0,A=M.length;E<A;E++){const D=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,x=D.length;y<x;y++){const R=D[y];if(p(R,E,y,P)===!0){const B=R.__offset,F=Array.isArray(R.value)?R.value:[R.value];let z=0;for(let q=0;q<F.length;q++){const G=F[q],K=_(G);typeof G=="number"||typeof G=="boolean"?(R.__data[0]=G,r.bufferSubData(r.UNIFORM_BUFFER,B+z,R.__data)):G.isMatrix3?(R.__data[0]=G.elements[0],R.__data[1]=G.elements[1],R.__data[2]=G.elements[2],R.__data[3]=0,R.__data[4]=G.elements[3],R.__data[5]=G.elements[4],R.__data[6]=G.elements[5],R.__data[7]=0,R.__data[8]=G.elements[6],R.__data[9]=G.elements[7],R.__data[10]=G.elements[8],R.__data[11]=0):(G.toArray(R.__data,z),z+=K.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,B,R.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(w,b,M,P){const E=w.value,A=b+"_"+M;if(P[A]===void 0)return typeof E=="number"||typeof E=="boolean"?P[A]=E:P[A]=E.clone(),!0;{const D=P[A];if(typeof E=="number"||typeof E=="boolean"){if(D!==E)return P[A]=E,!0}else if(D.equals(E)===!1)return D.copy(E),!0}return!1}function g(w){const b=w.uniforms;let M=0;const P=16;for(let A=0,D=b.length;A<D;A++){const y=Array.isArray(b[A])?b[A]:[b[A]];for(let x=0,R=y.length;x<R;x++){const B=y[x],F=Array.isArray(B.value)?B.value:[B.value];for(let z=0,q=F.length;z<q;z++){const G=F[z],K=_(G),V=M%P,rt=V%K.boundary,ut=V+rt;M+=rt,ut!==0&&P-ut<K.storage&&(M+=P-ut),B.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=M,M+=K.storage}}}const E=M%P;return E>0&&(M+=P-E),w.__size=M,w.__cache={},this}function _(w){const b={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(b.boundary=4,b.storage=4):w.isVector2?(b.boundary=8,b.storage=8):w.isVector3||w.isColor?(b.boundary=16,b.storage=12):w.isVector4?(b.boundary=16,b.storage=16):w.isMatrix3?(b.boundary=48,b.storage=48):w.isMatrix4?(b.boundary=64,b.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),b}function m(w){const b=w.target;b.removeEventListener("dispose",m);const M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),r.deleteBuffer(n[b.id]),delete n[b.id],delete s[b.id]}function f(){for(const w in n)r.deleteBuffer(n[w]);a=[],n={},s={}}return{bind:l,update:c,dispose:f}}class W0{constructor(t={}){const{canvas:e=xu(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const w=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=sn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let P=!1;this._outputColorSpace=Be;let E=0,A=0,D=null,y=-1,x=null;const R=new ne,B=new ne;let F=null;const z=new _t(0);let q=0,G=e.width,K=e.height,V=1,rt=null,ut=null;const Et=new ne(0,0,G,K),kt=new ne(0,0,G,K);let pe=!1;const re=new qo;let j=!1,at=!1;const it=new Jt,Pt=new T,Dt=new ne,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Se=!1;function jt(){return D===null?V:1}let L=i;function le(S,U){return e.getContext(S,U)}try{const S={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Do}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",Z,!1),L===null){const U="webgl2";if(L=le(U,S),L===null)throw le(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ct,Zt,Tt,me,pt,Ht,Ue,we,C,v,O,X,$,W,wt,et,vt,xt,Q,ct,It,Mt,ot,Ot;function I(){Ct=new tm(L),Ct.init(),Mt=new F0(L,Ct),Zt=new jp(L,Ct,t,Mt),Tt=new U0(L,Ct),Zt.reversedDepthBuffer&&d&&Tt.buffers.depth.setReversed(!0),me=new nm(L),pt=new y0,Ht=new N0(L,Ct,Tt,pt,Zt,Mt,me),Ue=new Kp(M),we=new Qp(M),C=new ld(L),ot=new Xp(L,C),v=new em(L,C,me,ot),O=new rm(L,v,C,me),Q=new sm(L,Zt,Ht),et=new Yp(pt),X=new M0(M,Ue,we,Ct,Zt,ot,et),$=new V0(M,pt),W=new w0,wt=new R0(Ct),xt=new Wp(M,Ue,we,Tt,O,p,l),vt=new L0(M,O,Zt),Ot=new G0(L,me,Zt,Tt),ct=new qp(L,Ct,me),It=new im(L,Ct,me),me.programs=X.programs,M.capabilities=Zt,M.extensions=Ct,M.properties=pt,M.renderLists=W,M.shadowMap=vt,M.state=Tt,M.info=me}I();const tt=new k0(M,L);this.xr=tt,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const S=Ct.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ct.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(S){S!==void 0&&(V=S,this.setSize(G,K,!1))},this.getSize=function(S){return S.set(G,K)},this.setSize=function(S,U,k=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=S,K=U,e.width=Math.floor(S*V),e.height=Math.floor(U*V),k===!0&&(e.style.width=S+"px",e.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(G*V,K*V).floor()},this.setDrawingBufferSize=function(S,U,k){G=S,K=U,V=k,e.width=Math.floor(S*k),e.height=Math.floor(U*k),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(R)},this.getViewport=function(S){return S.copy(Et)},this.setViewport=function(S,U,k,H){S.isVector4?Et.set(S.x,S.y,S.z,S.w):Et.set(S,U,k,H),Tt.viewport(R.copy(Et).multiplyScalar(V).round())},this.getScissor=function(S){return S.copy(kt)},this.setScissor=function(S,U,k,H){S.isVector4?kt.set(S.x,S.y,S.z,S.w):kt.set(S,U,k,H),Tt.scissor(B.copy(kt).multiplyScalar(V).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(S){Tt.setScissorTest(pe=S)},this.setOpaqueSort=function(S){rt=S},this.setTransparentSort=function(S){ut=S},this.getClearColor=function(S){return S.copy(xt.getClearColor())},this.setClearColor=function(){xt.setClearColor(...arguments)},this.getClearAlpha=function(){return xt.getClearAlpha()},this.setClearAlpha=function(){xt.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,k=!0){let H=0;if(S){let N=!1;if(D!==null){const J=D.texture.format;N=J===ko||J===zo||J===Bo}if(N){const J=D.texture.type,lt=J===Ci||J===An||J===Ns||J===Fs||J===No||J===Fo,mt=xt.getClearColor(),dt=xt.getClearAlpha(),Lt=mt.r,Ut=mt.g,At=mt.b;lt?(g[0]=Lt,g[1]=Ut,g[2]=At,g[3]=dt,L.clearBufferuiv(L.COLOR,0,g)):(_[0]=Lt,_[1]=Ut,_[2]=At,_[3]=dt,L.clearBufferiv(L.COLOR,0,_))}else H|=L.COLOR_BUFFER_BIT}U&&(H|=L.DEPTH_BUFFER_BIT),k&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",Z,!1),xt.dispose(),W.dispose(),wt.dispose(),pt.dispose(),Ue.dispose(),we.dispose(),O.dispose(),ot.dispose(),Ot.dispose(),X.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",wi),tt.removeEventListener("sessionend",tl),ln.stop()};function nt(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const S=me.autoReset,U=vt.enabled,k=vt.autoUpdate,H=vt.needsUpdate,N=vt.type;I(),me.autoReset=S,vt.enabled=U,vt.autoUpdate=k,vt.needsUpdate=H,vt.type=N}function Z(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Y(S){const U=S.target;U.removeEventListener("dispose",Y),gt(U)}function gt(S){Ft(S),pt.remove(S)}function Ft(S){const U=pt.get(S).programs;U!==void 0&&(U.forEach(function(k){X.releaseProgram(k)}),S.isShaderMaterial&&X.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,k,H,N,J){U===null&&(U=Nt);const lt=N.isMesh&&N.matrixWorld.determinant()<0,mt=vh(S,U,k,H,N);Tt.setMaterial(H,lt);let dt=k.index,Lt=1;if(H.wireframe===!0){if(dt=v.getWireframeAttribute(k),dt===void 0)return;Lt=2}const Ut=k.drawRange,At=k.attributes.position;let Xt=Ut.start*Lt,ie=(Ut.start+Ut.count)*Lt;J!==null&&(Xt=Math.max(Xt,J.start*Lt),ie=Math.min(ie,(J.start+J.count)*Lt)),dt!==null?(Xt=Math.max(Xt,0),ie=Math.min(ie,dt.count)):At!=null&&(Xt=Math.max(Xt,0),ie=Math.min(ie,At.count));const ye=ie-Xt;if(ye<0||ye===1/0)return;ot.setup(N,H,mt,k,dt);let de,ae=ct;if(dt!==null&&(de=C.get(dt),ae=It,ae.setIndex(de)),N.isMesh)H.wireframe===!0?(Tt.setLineWidth(H.wireframeLinewidth*jt()),ae.setMode(L.LINES)):ae.setMode(L.TRIANGLES);else if(N.isLine){let Rt=H.linewidth;Rt===void 0&&(Rt=1),Tt.setLineWidth(Rt*jt()),N.isLineSegments?ae.setMode(L.LINES):N.isLineLoop?ae.setMode(L.LINE_LOOP):ae.setMode(L.LINE_STRIP)}else N.isPoints?ae.setMode(L.POINTS):N.isSprite&&ae.setMode(L.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Qn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ae.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ct.get("WEBGL_multi_draw"))ae.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Rt=N._multiDrawStarts,xe=N._multiDrawCounts,$t=N._multiDrawCount,Qe=dt?C.get(dt).bytesPerElement:1,Dn=pt.get(H).currentProgram.getUniforms();for(let ti=0;ti<$t;ti++)Dn.setValue(L,"_gl_DrawID",ti),ae.render(Rt[ti]/Qe,xe[ti])}else if(N.isInstancedMesh)ae.renderInstances(Xt,ye,N.count);else if(k.isInstancedBufferGeometry){const Rt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,xe=Math.min(k.instanceCount,Rt);ae.renderInstances(Xt,ye,xe)}else ae.render(Xt,ye)};function ce(S,U,k){S.transparent===!0&&S.side===Je&&S.forceSinglePass===!1?(S.side=$e,S.needsUpdate=!0,Ks(S,U,k),S.side=an,S.needsUpdate=!0,Ks(S,U,k),S.side=Je):Ks(S,U,k)}this.compile=function(S,U,k=null){k===null&&(k=S),f=wt.get(k),f.init(U),b.push(f),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),S!==k&&S.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const H=new Set;return S.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const J=N.material;if(J)if(Array.isArray(J))for(let lt=0;lt<J.length;lt++){const mt=J[lt];ce(mt,k,N),H.add(mt)}else ce(J,k,N),H.add(J)}),f=b.pop(),H},this.compileAsync=function(S,U,k=null){const H=this.compile(S,U,k);return new Promise(N=>{function J(){if(H.forEach(function(lt){pt.get(lt).currentProgram.isReady()&&H.delete(lt)}),H.size===0){N(S);return}setTimeout(J,10)}Ct.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let Qt=null;function Ri(S){Qt&&Qt(S)}function wi(){ln.stop()}function tl(){ln.start()}const ln=new lh;ln.setAnimationLoop(Ri),typeof self<"u"&&ln.setContext(self),this.setAnimationLoop=function(S){Qt=S,tt.setAnimationLoop(S),S===null?ln.stop():ln.start()},tt.addEventListener("sessionstart",wi),tt.addEventListener("sessionend",tl),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(U),U=tt.getCamera()),S.isScene===!0&&S.onBeforeRender(M,S,U,D),f=wt.get(S,b.length),f.init(U),b.push(f),it.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),re.setFromProjectionMatrix(it,Ai,U.reversedDepth),at=this.localClippingEnabled,j=et.init(this.clippingPlanes,at),m=W.get(S,w.length),m.init(),w.push(m),tt.enabled===!0&&tt.isPresenting===!0){const J=M.xr.getDepthSensingMesh();J!==null&&Zr(J,U,-1/0,M.sortObjects)}Zr(S,U,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(rt,ut),Se=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,Se&&xt.addToRenderList(m,S),this.info.render.frame++,j===!0&&et.beginShadows();const k=f.state.shadowsArray;vt.render(k,S,U),j===!0&&et.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const J=U.cameras;if(N.length>0)for(let lt=0,mt=J.length;lt<mt;lt++){const dt=J[lt];il(H,N,S,dt)}Se&&xt.render(S);for(let lt=0,mt=J.length;lt<mt;lt++){const dt=J[lt];el(m,S,dt,dt.viewport)}}else N.length>0&&il(H,N,S,U),Se&&xt.render(S),el(m,S,U);D!==null&&A===0&&(Ht.updateMultisampleRenderTarget(D),Ht.updateRenderTargetMipmap(D)),S.isScene===!0&&S.onAfterRender(M,S,U),ot.resetDefaultState(),y=-1,x=null,b.pop(),b.length>0?(f=b[b.length-1],j===!0&&et.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function Zr(S,U,k,H){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)k=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||re.intersectsSprite(S)){H&&Dt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(it);const lt=O.update(S),mt=S.material;mt.visible&&m.push(S,lt,mt,k,Dt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||re.intersectsObject(S))){const lt=O.update(S),mt=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Dt.copy(S.boundingSphere.center)):(lt.boundingSphere===null&&lt.computeBoundingSphere(),Dt.copy(lt.boundingSphere.center)),Dt.applyMatrix4(S.matrixWorld).applyMatrix4(it)),Array.isArray(mt)){const dt=lt.groups;for(let Lt=0,Ut=dt.length;Lt<Ut;Lt++){const At=dt[Lt],Xt=mt[At.materialIndex];Xt&&Xt.visible&&m.push(S,lt,Xt,k,Dt.z,At)}}else mt.visible&&m.push(S,lt,mt,k,Dt.z,null)}}const J=S.children;for(let lt=0,mt=J.length;lt<mt;lt++)Zr(J[lt],U,k,H)}function el(S,U,k,H){const N=S.opaque,J=S.transmissive,lt=S.transparent;f.setupLightsView(k),j===!0&&et.setGlobalState(M.clippingPlanes,k),H&&Tt.viewport(R.copy(H)),N.length>0&&Ys(N,U,k),J.length>0&&Ys(J,U,k),lt.length>0&&Ys(lt,U,k),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function il(S,U,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new xi(1,1,{generateMipmaps:!0,type:Ct.has("EXT_color_buffer_half_float")||Ct.has("EXT_color_buffer_float")?Hi:Ci,minFilter:Ji,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const J=f.state.transmissionRenderTarget[H.id],lt=H.viewport||R;J.setSize(lt.z*M.transmissionResolutionScale,lt.w*M.transmissionResolutionScale);const mt=M.getRenderTarget(),dt=M.getActiveCubeFace(),Lt=M.getActiveMipmapLevel();M.setRenderTarget(J),M.getClearColor(z),q=M.getClearAlpha(),q<1&&M.setClearColor(16777215,.5),M.clear(),Se&&xt.render(k);const Ut=M.toneMapping;M.toneMapping=sn;const At=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),j===!0&&et.setGlobalState(M.clippingPlanes,H),Ys(S,k,H),Ht.updateMultisampleRenderTarget(J),Ht.updateRenderTargetMipmap(J),Ct.has("WEBGL_multisampled_render_to_texture")===!1){let Xt=!1;for(let ie=0,ye=U.length;ie<ye;ie++){const de=U[ie],ae=de.object,Rt=de.geometry,xe=de.material,$t=de.group;if(xe.side===Je&&ae.layers.test(H.layers)){const Qe=xe.side;xe.side=$e,xe.needsUpdate=!0,nl(ae,k,H,Rt,xe,$t),xe.side=Qe,xe.needsUpdate=!0,Xt=!0}}Xt===!0&&(Ht.updateMultisampleRenderTarget(J),Ht.updateRenderTargetMipmap(J))}M.setRenderTarget(mt,dt,Lt),M.setClearColor(z,q),At!==void 0&&(H.viewport=At),M.toneMapping=Ut}function Ys(S,U,k){const H=U.isScene===!0?U.overrideMaterial:null;for(let N=0,J=S.length;N<J;N++){const lt=S[N],mt=lt.object,dt=lt.geometry,Lt=lt.group;let Ut=lt.material;Ut.allowOverride===!0&&H!==null&&(Ut=H),mt.layers.test(k.layers)&&nl(mt,U,k,dt,Ut,Lt)}}function nl(S,U,k,H,N,J){S.onBeforeRender(M,U,k,H,N,J),S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(M,U,k,H,S,J),N.transparent===!0&&N.side===Je&&N.forceSinglePass===!1?(N.side=$e,N.needsUpdate=!0,M.renderBufferDirect(k,U,H,N,S,J),N.side=an,N.needsUpdate=!0,M.renderBufferDirect(k,U,H,N,S,J),N.side=Je):M.renderBufferDirect(k,U,H,N,S,J),S.onAfterRender(M,U,k,H,N,J)}function Ks(S,U,k){U.isScene!==!0&&(U=Nt);const H=pt.get(S),N=f.state.lights,J=f.state.shadowsArray,lt=N.state.version,mt=X.getParameters(S,N.state,J,U,k),dt=X.getProgramCacheKey(mt);let Lt=H.programs;H.environment=S.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(S.isMeshStandardMaterial?we:Ue).get(S.envMap||H.environment),H.envMapRotation=H.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,Lt===void 0&&(S.addEventListener("dispose",Y),Lt=new Map,H.programs=Lt);let Ut=Lt.get(dt);if(Ut!==void 0){if(H.currentProgram===Ut&&H.lightsStateVersion===lt)return rl(S,mt),Ut}else mt.uniforms=X.getUniforms(S),S.onBeforeCompile(mt,M),Ut=X.acquireProgram(mt,dt),Lt.set(dt,Ut),H.uniforms=mt.uniforms;const At=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(At.clippingPlanes=et.uniform),rl(S,mt),H.needsLights=Mh(S),H.lightsStateVersion=lt,H.needsLights&&(At.ambientLightColor.value=N.state.ambient,At.lightProbe.value=N.state.probe,At.directionalLights.value=N.state.directional,At.directionalLightShadows.value=N.state.directionalShadow,At.spotLights.value=N.state.spot,At.spotLightShadows.value=N.state.spotShadow,At.rectAreaLights.value=N.state.rectArea,At.ltc_1.value=N.state.rectAreaLTC1,At.ltc_2.value=N.state.rectAreaLTC2,At.pointLights.value=N.state.point,At.pointLightShadows.value=N.state.pointShadow,At.hemisphereLights.value=N.state.hemi,At.directionalShadowMap.value=N.state.directionalShadowMap,At.directionalShadowMatrix.value=N.state.directionalShadowMatrix,At.spotShadowMap.value=N.state.spotShadowMap,At.spotLightMatrix.value=N.state.spotLightMatrix,At.spotLightMap.value=N.state.spotLightMap,At.pointShadowMap.value=N.state.pointShadowMap,At.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Ut,H.uniformsList=null,Ut}function sl(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=Ur.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function rl(S,U){const k=pt.get(S);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function vh(S,U,k,H,N){U.isScene!==!0&&(U=Nt),Ht.resetTextureUnits();const J=U.fog,lt=H.isMeshStandardMaterial?U.environment:null,mt=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:ss,dt=(H.isMeshStandardMaterial?we:Ue).get(H.envMap||lt),Lt=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ut=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),At=!!k.morphAttributes.position,Xt=!!k.morphAttributes.normal,ie=!!k.morphAttributes.color;let ye=sn;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ye=M.toneMapping);const de=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ae=de!==void 0?de.length:0,Rt=pt.get(H),xe=f.state.lights;if(j===!0&&(at===!0||S!==x)){const qe=S===x&&H.id===y;et.setState(H,S,qe)}let $t=!1;H.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==xe.state.version||Rt.outputColorSpace!==mt||N.isBatchedMesh&&Rt.batching===!1||!N.isBatchedMesh&&Rt.batching===!0||N.isBatchedMesh&&Rt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Rt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Rt.instancing===!1||!N.isInstancedMesh&&Rt.instancing===!0||N.isSkinnedMesh&&Rt.skinning===!1||!N.isSkinnedMesh&&Rt.skinning===!0||N.isInstancedMesh&&Rt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Rt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Rt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Rt.instancingMorph===!1&&N.morphTexture!==null||Rt.envMap!==dt||H.fog===!0&&Rt.fog!==J||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==et.numPlanes||Rt.numIntersection!==et.numIntersection)||Rt.vertexAlphas!==Lt||Rt.vertexTangents!==Ut||Rt.morphTargets!==At||Rt.morphNormals!==Xt||Rt.morphColors!==ie||Rt.toneMapping!==ye||Rt.morphTargetsCount!==ae)&&($t=!0):($t=!0,Rt.__version=H.version);let Qe=Rt.currentProgram;$t===!0&&(Qe=Ks(H,U,N));let Dn=!1,ti=!1,ds=!1;const Me=Qe.getUniforms(),oi=Rt.uniforms;if(Tt.useProgram(Qe.program)&&(Dn=!0,ti=!0,ds=!0),H.id!==y&&(y=H.id,ti=!0),Dn||x!==S){Tt.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Me.setValue(L,"projectionMatrix",S.projectionMatrix),Me.setValue(L,"viewMatrix",S.matrixWorldInverse);const Ze=Me.map.cameraPosition;Ze!==void 0&&Ze.setValue(L,Pt.setFromMatrixPosition(S.matrixWorld)),Zt.logarithmicDepthBuffer&&Me.setValue(L,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Me.setValue(L,"isOrthographic",S.isOrthographicCamera===!0),x!==S&&(x=S,ti=!0,ds=!0)}if(N.isSkinnedMesh){Me.setOptional(L,N,"bindMatrix"),Me.setOptional(L,N,"bindMatrixInverse");const qe=N.skeleton;qe&&(qe.boneTexture===null&&qe.computeBoneTexture(),Me.setValue(L,"boneTexture",qe.boneTexture,Ht))}N.isBatchedMesh&&(Me.setOptional(L,N,"batchingTexture"),Me.setValue(L,"batchingTexture",N._matricesTexture,Ht),Me.setOptional(L,N,"batchingIdTexture"),Me.setValue(L,"batchingIdTexture",N._indirectTexture,Ht),Me.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&Me.setValue(L,"batchingColorTexture",N._colorsTexture,Ht));const li=k.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&Q.update(N,k,Qe),(ti||Rt.receiveShadow!==N.receiveShadow)&&(Rt.receiveShadow=N.receiveShadow,Me.setValue(L,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(oi.envMap.value=dt,oi.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(oi.envMapIntensity.value=U.environmentIntensity),ti&&(Me.setValue(L,"toneMappingExposure",M.toneMappingExposure),Rt.needsLights&&xh(oi,ds),J&&H.fog===!0&&$.refreshFogUniforms(oi,J),$.refreshMaterialUniforms(oi,H,V,K,f.state.transmissionRenderTarget[S.id]),Ur.upload(L,sl(Rt),oi,Ht)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ur.upload(L,sl(Rt),oi,Ht),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Me.setValue(L,"center",N.center),Me.setValue(L,"modelViewMatrix",N.modelViewMatrix),Me.setValue(L,"normalMatrix",N.normalMatrix),Me.setValue(L,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const qe=H.uniformsGroups;for(let Ze=0,Jr=qe.length;Ze<Jr;Ze++){const cn=qe[Ze];Ot.update(cn,Qe),Ot.bind(cn,Qe)}}return Qe}function xh(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function Mh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(S,U,k){const H=pt.get(S);H.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),pt.get(S.texture).__webglTexture=U,pt.get(S.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const k=pt.get(S);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const yh=L.createFramebuffer();this.setRenderTarget=function(S,U=0,k=0){D=S,E=U,A=k;let H=!0,N=null,J=!1,lt=!1;if(S){const dt=pt.get(S);if(dt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(L.FRAMEBUFFER,null),H=!1;else if(dt.__webglFramebuffer===void 0)Ht.setupRenderTarget(S);else if(dt.__hasExternalTextures)Ht.rebindTextures(S,pt.get(S.texture).__webglTexture,pt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const At=S.depthTexture;if(dt.__boundDepthTexture!==At){if(At!==null&&pt.has(At)&&(S.width!==At.image.width||S.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ht.setupDepthRenderbuffer(S)}}const Lt=S.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(lt=!0);const Ut=pt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ut[U])?N=Ut[U][k]:N=Ut[U],J=!0):S.samples>0&&Ht.useMultisampledRTT(S)===!1?N=pt.get(S).__webglMultisampledFramebuffer:Array.isArray(Ut)?N=Ut[k]:N=Ut,R.copy(S.viewport),B.copy(S.scissor),F=S.scissorTest}else R.copy(Et).multiplyScalar(V).floor(),B.copy(kt).multiplyScalar(V).floor(),F=pe;if(k!==0&&(N=yh),Tt.bindFramebuffer(L.FRAMEBUFFER,N)&&H&&Tt.drawBuffers(S,N),Tt.viewport(R),Tt.scissor(B),Tt.setScissorTest(F),J){const dt=pt.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,dt.__webglTexture,k)}else if(lt){const dt=U;for(let Lt=0;Lt<S.textures.length;Lt++){const Ut=pt.get(S.textures[Lt]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Lt,Ut.__webglTexture,k,dt)}}else if(S!==null&&k!==0){const dt=pt.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,dt.__webglTexture,k)}y=-1},this.readRenderTargetPixels=function(S,U,k,H,N,J,lt,mt=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=pt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&lt!==void 0&&(dt=dt[lt]),dt){Tt.bindFramebuffer(L.FRAMEBUFFER,dt);try{const Lt=S.textures[mt],Ut=Lt.format,At=Lt.type;if(!Zt.textureFormatReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Zt.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-H&&k>=0&&k<=S.height-N&&(S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt),L.readPixels(U,k,H,N,Mt.convert(Ut),Mt.convert(At),J))}finally{const Lt=D!==null?pt.get(D).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(S,U,k,H,N,J,lt,mt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=pt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&lt!==void 0&&(dt=dt[lt]),dt)if(U>=0&&U<=S.width-H&&k>=0&&k<=S.height-N){Tt.bindFramebuffer(L.FRAMEBUFFER,dt);const Lt=S.textures[mt],Ut=Lt.format,At=Lt.type;if(!Zt.textureFormatReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Zt.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Xt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Xt),L.bufferData(L.PIXEL_PACK_BUFFER,J.byteLength,L.STREAM_READ),S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt),L.readPixels(U,k,H,N,Mt.convert(Ut),Mt.convert(At),0);const ie=D!==null?pt.get(D).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,ie);const ye=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Mu(L,ye,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Xt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,J),L.deleteBuffer(Xt),L.deleteSync(ye),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,k=0){const H=Math.pow(2,-k),N=Math.floor(S.image.width*H),J=Math.floor(S.image.height*H),lt=U!==null?U.x:0,mt=U!==null?U.y:0;Ht.setTexture2D(S,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,lt,mt,N,J),Tt.unbindTexture()};const Sh=L.createFramebuffer(),wh=L.createFramebuffer();this.copyTextureToTexture=function(S,U,k=null,H=null,N=0,J=null){J===null&&(N!==0?(Qn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=N,N=0):J=0);let lt,mt,dt,Lt,Ut,At,Xt,ie,ye;const de=S.isCompressedTexture?S.mipmaps[J]:S.image;if(k!==null)lt=k.max.x-k.min.x,mt=k.max.y-k.min.y,dt=k.isBox3?k.max.z-k.min.z:1,Lt=k.min.x,Ut=k.min.y,At=k.isBox3?k.min.z:0;else{const li=Math.pow(2,-N);lt=Math.floor(de.width*li),mt=Math.floor(de.height*li),S.isDataArrayTexture?dt=de.depth:S.isData3DTexture?dt=Math.floor(de.depth*li):dt=1,Lt=0,Ut=0,At=0}H!==null?(Xt=H.x,ie=H.y,ye=H.z):(Xt=0,ie=0,ye=0);const ae=Mt.convert(U.format),Rt=Mt.convert(U.type);let xe;U.isData3DTexture?(Ht.setTexture3D(U,0),xe=L.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Ht.setTexture2DArray(U,0),xe=L.TEXTURE_2D_ARRAY):(Ht.setTexture2D(U,0),xe=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const $t=L.getParameter(L.UNPACK_ROW_LENGTH),Qe=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Dn=L.getParameter(L.UNPACK_SKIP_PIXELS),ti=L.getParameter(L.UNPACK_SKIP_ROWS),ds=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,de.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,de.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Lt),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ut),L.pixelStorei(L.UNPACK_SKIP_IMAGES,At);const Me=S.isDataArrayTexture||S.isData3DTexture,oi=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const li=pt.get(S),qe=pt.get(U),Ze=pt.get(li.__renderTarget),Jr=pt.get(qe.__renderTarget);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,Ze.__webglFramebuffer),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,Jr.__webglFramebuffer);for(let cn=0;cn<dt;cn++)Me&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pt.get(S).__webglTexture,N,At+cn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pt.get(U).__webglTexture,J,ye+cn)),L.blitFramebuffer(Lt,Ut,lt,mt,Xt,ie,lt,mt,L.DEPTH_BUFFER_BIT,L.NEAREST);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(N!==0||S.isRenderTargetTexture||pt.has(S)){const li=pt.get(S),qe=pt.get(U);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,Sh),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,wh);for(let Ze=0;Ze<dt;Ze++)Me?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,li.__webglTexture,N,At+Ze):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,li.__webglTexture,N),oi?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,qe.__webglTexture,J,ye+Ze):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,qe.__webglTexture,J),N!==0?L.blitFramebuffer(Lt,Ut,lt,mt,Xt,ie,lt,mt,L.COLOR_BUFFER_BIT,L.NEAREST):oi?L.copyTexSubImage3D(xe,J,Xt,ie,ye+Ze,Lt,Ut,lt,mt):L.copyTexSubImage2D(xe,J,Xt,ie,Lt,Ut,lt,mt);Tt.bindFramebuffer(L.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else oi?S.isDataTexture||S.isData3DTexture?L.texSubImage3D(xe,J,Xt,ie,ye,lt,mt,dt,ae,Rt,de.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(xe,J,Xt,ie,ye,lt,mt,dt,ae,de.data):L.texSubImage3D(xe,J,Xt,ie,ye,lt,mt,dt,ae,Rt,de):S.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,J,Xt,ie,lt,mt,ae,Rt,de.data):S.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,J,Xt,ie,de.width,de.height,ae,de.data):L.texSubImage2D(L.TEXTURE_2D,J,Xt,ie,lt,mt,ae,Rt,de);L.pixelStorei(L.UNPACK_ROW_LENGTH,$t),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Qe),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Dn),L.pixelStorei(L.UNPACK_SKIP_ROWS,ti),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ds),J===0&&U.generateMipmaps&&L.generateMipmap(xe),Tt.unbindTexture()},this.copyTextureToTexture3D=function(S,U,k=null,H=null,N=0){return Qn('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,U,k,H,N)},this.initRenderTarget=function(S){pt.get(S).__webglFramebuffer===void 0&&Ht.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Ht.setTextureCube(S,0):S.isData3DTexture?Ht.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Ht.setTexture2DArray(S,0):Ht.setTexture2D(S,0),Tt.unbindTexture()},this.resetState=function(){E=0,A=0,D=null,Tt.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}const Re=Math.PI*2,xc=new T(0,1,0),yn=(r,t,e)=>Math.max(t,Math.min(e,r)),gn=(r,t,e)=>r+(t-r)*e,bs=(r,t,e)=>{const i=yn((e-r)/(t-r),0,1);return i*i*(3-2*i)};function Mc(r){return function(){let e=r+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}class X0{constructor(t,e){if(!t)throw new Error("World requires a THREE.Scene");this.scene=t,this.renderer=e,this.worldSize=300,this.playableRadius=143,this.seed=5361831,this.random=Mc(this.seed),this.group=new yt,this.group.name="FrontierWorld",this.environment=new yt,this.environment.name="Environment",this.town=new yt,this.town.name="CinderCreekTown",this.props=new yt,this.props.name="WorldProps",this.atmosphere=new yt,this.atmosphere.name="Atmosphere",this.group.add(this.environment,this.town,this.props,this.atmosphere),this.townCenter=new T(0,0,0),this.horseSpawn=new T(-7.5,0,31),this.playerSpawn=new T(1.5,0,24),this.enemySpawns=[new T(-46,0,-49),new T(42,0,-42),new T(-55,0,35),new T(56,0,48),new T(2,0,-76),new T(79,0,4),new T(-82,0,-8),new T(28,0,73)],this.enemySpawnPoints=this.enemySpawns,this.cover=[],this.coverPoints=[],this.interactables=[],this.colliders=[],this.cameraColliders=[],this.bulletColliders=this.cameraColliders,this.lineOfSightColliders=this.cameraColliders,this.bounds=new ad(new ht(-this.playableRadius,-this.playableRadius),new ht(this.playableRadius,this.playableRadius)),this.surfaceZones=[],this.landmarks={},this._initialized=!1,this._materials={},this._clouds=[],this._birds=[],this._smoke=[],this._tumbleweeds=[],this._lanterns=[],this._animatedMaterials=[],this._boxGeometry=null,this._dust=null,this._sky=null,this._sun=null,this._windmillRotor=null,this._waterUniforms=null,this._campfire=null,this._previousSceneState=null,this._previousRendererState=null,this.pond={x:57,z:28,radiusX:17,radiusZ:11,waterY:-.72}}async init(){if(this._initialized)return this;this._initialized=!0,this._previousSceneState={background:this.scene.background,fog:this.scene.fog,environment:this.scene.environment},this.scene.background=new _t(14257765),this.scene.fog=new Xo(13206110,.00425),this.scene.add(this.group),this._configureRenderer(),this._createMaterials(),this._createLighting(),this._createSky(),this._createTerrain(),this._createRoadNetwork(),this._createPond(),this._createDistantLandforms(),this._createTown(),this._createTownProps(),this._createFences(),this._createTelegraphLine(),this._createVegetation(),this._createAtmosphere(),this._buildCoverPoints(),this._batchStaticBoxes(),this.townCenter.y=this.getHeight(0,0),this.horseSpawn.y=this.getHeight(this.horseSpawn.x,this.horseSpawn.z)+.02,this.playerSpawn.y=this.getHeight(this.playerSpawn.x,this.playerSpawn.z)+.02;for(const t of this.enemySpawns)t.y=this.getHeight(t.x,t.z)+.02;return this.group.updateMatrixWorld(!0),await Promise.resolve(),this}_configureRenderer(){this.renderer&&(this._previousRendererState={shadowEnabled:this.renderer.shadowMap?.enabled,shadowType:this.renderer.shadowMap?.type,toneMapping:this.renderer.toneMapping,toneMappingExposure:this.renderer.toneMappingExposure,outputColorSpace:this.renderer.outputColorSpace},this.renderer.shadowMap&&(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Lo),"outputColorSpace"in this.renderer&&(this.renderer.outputColorSpace=Be),this.renderer.toneMapping=Xr,this.renderer.toneMappingExposure=1.08)}_createDirtTexture(){const e=new Uint8Array(262144),i=Mc(this.seed^9056754);for(let s=0;s<256;s+=1)for(let a=0;a<256;a+=1){const o=(s*256+a)*4;let c=231+(Math.sin(a*.13)*Math.cos(s*.17)*7+Math.sin((a+s)*.047)*5)+(i()-.5)*22;i()<.012&&(c-=38+i()*32),c=yn(Math.round(c),125,255),e[o]=c,e[o+1]=c,e[o+2]=c,e[o+3]=255}const n=new sh(e,256,256,di);return n.name="ProceduralDirtGrain",n.wrapS=Us,n.wrapT=Us,n.repeat.set(54,54),n.colorSpace=Be,n.anisotropy=Math.min(8,this.renderer?.capabilities?.getMaxAnisotropy?.()||1),n.generateMipmaps=!0,n.minFilter=Ji,n.magFilter=_i,n.needsUpdate=!0,n}_createMaterials(){const t=(i,n=.86,s=0)=>new We({color:i,roughness:n,metalness:s}),e=this._createDirtTexture();this._materials={terrain:new We({color:16777215,vertexColors:!0,roughness:.97,metalness:0,map:e,bumpMap:e,bumpScale:.055}),road:t(8409917,1),roadDark:t(6176817,1),sandstone:t(11031608,.94),sandstoneLight:t(13005644,.94),sandstoneDark:t(7354157,.96),rock:t(7623496,.98),rockLight:t(10120534,.98),wood:t(6962470,.91),woodDark:t(3745311,.94),woodLight:t(11169861,.9),paleWood:t(12162407,.92),roof:t(4928560,.92),roofTin:t(6713451,.72,.12),iron:t(2961456,.58,.5),brass:t(10906405,.42,.45),cactus:t(4155207,.95),cactusLight:t(6718298,.95),scrub:t(7827524,1),grass:t(10127696,1),cloth:new We({color:11749432,roughness:.92,side:Je}),glass:new We({color:16760168,emissive:10108439,emissiveIntensity:.75,roughness:.27,metalness:.02}),windowDark:t(2569528,.4),flame:new Ke({color:16756782,toneMapped:!1}),ember:new Ke({color:16732962,toneMapped:!1}),cloud:new ba({color:16768449,transparent:!0,opacity:.68,depthWrite:!1})}}_mesh(t,e,i=!0,n=!0){const s=new qt(t,e);return s.castShadow=i,s.receiveShadow=n,s}_box(t,e,i,n,s=!0,a=!0){this._boxGeometry||(this._boxGeometry=new Ae(1,1,1));const o=this._mesh(this._boxGeometry,n,s,a);return o.scale.set(t,e,i),o}_batchStaticBoxes(){if(!this._boxGeometry)return;this.group.updateMatrixWorld(!0);const t=new Map,e=this.group.matrixWorld.clone().invert();this.group.traverse(n=>{if(!n.isMesh||n.geometry!==this._boxGeometry||!n.material)return;let s=n.parent;for(;s&&s!==this.group;){if(s===this._windmillRotor||s.userData?.dynamicWorldObject)return;s=s.parent}const a=n.material.uuid;t.has(a)||t.set(a,{material:n.material,entries:[]}),t.get(a).entries.push({mesh:n,matrix:e.clone().multiply(n.matrixWorld),castShadow:n.castShadow,receiveShadow:n.receiveShadow})});let i=0;for(const{material:n,entries:s}of t.values()){if(s.length<2)continue;const a=new hi(this._boxGeometry,n,s.length);a.name=`StaticArchitectureBatch-${i}`,a.castShadow=s.some(o=>o.castShadow),a.receiveShadow=s.some(o=>o.receiveShadow),s.forEach((o,l)=>{a.setMatrixAt(l,o.matrix),o.mesh.removeFromParent()}),a.instanceMatrix.needsUpdate=!0,a.computeBoundingBox(),a.computeBoundingSphere(),this.group.add(a),i+=1}}_createLighting(){const t=new id(16766381,4861993,1.55);t.name="WarmSkyLight";const e=new Wl(16765088,3.35);e.name="SettingSun",e.position.set(-74,86,-92),e.target.position.set(4,0,0),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),e.shadow.camera.left=-92,e.shadow.camera.right=92,e.shadow.camera.top=92,e.shadow.camera.bottom=-92,e.shadow.camera.near=10,e.shadow.camera.far=255,e.shadow.bias=-35e-5,e.shadow.normalBias=.035;const i=new Wl(15691330,.72);i.name="HorizonBounce",i.position.set(92,24,40),this.group.add(t,e,e.target,i),this.landmarks.sunLight=e}_createSky(){const t={topColor:{value:new _t(2308967)},upperColor:{value:new _t(9139088)},horizonColor:{value:new _t(15768432)},groundGlow:{value:new _t(13918783)},time:{value:0}},e=new ze({uniforms:t,side:$e,depthWrite:!1,fog:!1,vertexShader:`
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 topColor;
        uniform vec3 upperColor;
        uniform vec3 horizonColor;
        uniform vec3 groundGlow;
        uniform float time;
        varying vec3 vDirection;

        void main() {
          float h = normalize(vDirection).y;
          float upperMix = smoothstep(0.02, 0.72, h);
          vec3 sky = mix(horizonColor, upperColor, smoothstep(-0.06, 0.34, h));
          sky = mix(sky, topColor, upperMix);
          sky = mix(groundGlow, sky, smoothstep(-0.22, 0.02, h));
          float band = exp(-pow((h - 0.025) * 8.5, 2.0));
          sky += vec3(0.16, 0.055, 0.018) * band;
          float dither = fract(sin(dot(gl_FragCoord.xy + time * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
          sky += (dither - 0.5) / 255.0;
          gl_FragColor = vec4(sky, 1.0);
        }
      `}),i=new qt(new fe(245,32,18),e);i.name="GradientSky",i.frustumCulled=!1,i.renderOrder=-1e3,this.atmosphere.add(i),this._sky=i,this._animatedMaterials.push(e);const n=new Ke({color:16765066,transparent:!0,opacity:.94,depthWrite:!1,fog:!1,toneMapped:!1}),s=new qt(new Hs(8.5,48),n);s.name="SunDisc",s.position.set(-104,46,-139),s.lookAt(0,16,0),s.renderOrder=-999,this.atmosphere.add(s),this._sun=s}_terrainNoise(t,e){const i=Math.sin(t*.036+.7)*Math.cos(e*.031-.9)*1.7,n=Math.sin((t+e)*.071)*.58,s=Math.sin(t*.173-e*.119)*.19,a=Math.abs(Math.sin(t*.019+e*.026))*.52;return i+n+s+a}getHeight(t,e){const i=Math.hypot(t,e);let n=this._terrainNoise(t,e);const s=Math.max(Math.abs(t)/38,Math.abs(e)/52),a=1-bs(.77,1.16,s);n=gn(n,.06+Math.sin(e*.08)*.025,a);const o=Math.sin(e*.024)*1.35,l=1-bs(5.2,9.4,Math.abs(t-o)),c=yn(e*-.002,-.24,.24);n=gn(n,c,l*(1-a)*.72);const u=Math.sqrt(((t-this.pond.x)/this.pond.radiusX)**2+((e-this.pond.z)/this.pond.radiusZ)**2),h=1-bs(.55,1.24,u);return n=gn(n,-1.34,h),n+=bs(106,151,i)*(2.8+Math.sin(i*.11)*.7),n}getHeightAt(t,e){return t&&typeof t=="object"?this.getHeight(t.x,t.z):this.getHeight(t,e)}getTerrainHeight(t,e){return this.getHeightAt(t,e)}_createTerrain(){const e=new En(this.worldSize,this.worldSize,128,128);e.rotateX(-Math.PI/2);const i=e.attributes.position,n=[],s=new _t(9986888),a=new _t(12157531),o=new _t(7226676),l=new _t(9597764),c=new _t;for(let h=0;h<i.count;h+=1){const d=i.getX(h),p=i.getZ(h),g=this.getHeight(d,p);i.setY(h,g);const _=(Math.sin(d*.47+p*.31)+Math.sin(p*.83))*.5;c.copy(s).lerp(a,yn(.42+_*.1+g*.025,0,1)),g>2.6&&c.lerp(o,bs(2.6,6.5,g)*.55),Math.sin(d*.12-p*.09)>.76&&c.lerp(l,.18),n.push(c.r,c.g,c.b)}e.setAttribute("color",new Gt(n,3)),e.computeVertexNormals(),e.computeBoundingSphere();const u=this._mesh(e,this._materials.terrain,!1,!0);u.name="FrontierTerrain",this.environment.add(u),this.landmarks.terrain=u}_createRibbon(t,e,i,n=.035){const s=[],a=[],o=[];for(let u=0;u<t.length;u+=1){const h=t[u],d=t[Math.max(0,u-1)],p=t[Math.min(t.length-1,u+1)],g=p.x-d.x,_=p.z-d.z,m=1/Math.max(.001,Math.hypot(g,_)),f=-_*m,w=g*m,b=h.x+f*e*.5,M=h.z+w*e*.5,P=h.x-f*e*.5,E=h.z-w*e*.5;if(s.push(b,this.getHeight(b,M)+n,M),s.push(P,this.getHeight(P,E)+n,E),a.push(0,u,1,u),u<t.length-1){const A=u*2;o.push(A,A+1,A+2,A+1,A+3,A+2)}}const l=new se;l.setAttribute("position",new Gt(s,3)),l.setAttribute("uv",new Gt(a,2)),l.setIndex(o),l.computeVertexNormals();const c=this._mesh(l,i,!1,!0);return this.environment.add(c),c}_createRoadNetwork(){const t=[];for(let o=-148;o<=148;o+=8)t.push(new T(Math.sin(o*.024)*1.35,0,o));const e=this._createRibbon(t,10.8,this._materials.road,.045);e.name="CinderCreekMainRoad";const i=[new T(-1,0,34),new T(-16,0,42),new T(-35,0,49),new T(-58,0,57),new T(-91,0,72),new T(-137,0,82)],n=[new T(1,0,7),new T(18,0,13),new T(35,0,19),new T(51,0,27),new T(77,0,37),new T(112,0,42),new T(143,0,47)],s=this._createRibbon(i,5.3,this._materials.road,.04);s.name="RanchTrail";const a=this._createRibbon(n,4.7,this._materials.road,.04);a.name="WateringHoleTrail";for(const o of[-2.2,2.2]){const l=t.map(u=>new T(u.x+o,0,u.z)),c=this._createRibbon(l,.22,this._materials.roadDark,.061);c.name="WagonRut"}}_createPond(){const t={time:{value:0},shallowColor:{value:new _t(5145986)},deepColor:{value:new _t(2378581)},sunsetColor:{value:new _t(14717544)}},e=new ze({uniforms:t,transparent:!0,opacity:.92,depthWrite:!1,side:Je,vertexShader:`
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 transformed = position;
          float wave = sin(position.x * 7.0 + time * 1.1) * 0.018;
          wave += cos(position.z * 9.0 - time * 0.8) * 0.012;
          transformed.y += wave;
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 shallowColor;
        uniform vec3 deepColor;
        uniform vec3 sunsetColor;
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          float edge = 1.0 - smoothstep(0.34, 0.5, distance(vUv, vec2(0.5)));
          float glint = pow(max(0.0, sin((vUv.x + vUv.y) * 35.0 + time) * 0.5 + 0.5), 14.0);
          vec3 color = mix(deepColor, shallowColor, edge * 0.72 + 0.16);
          color = mix(color, sunsetColor, glint * 0.18 + max(vWave, 0.0) * 2.0);
          gl_FragColor = vec4(color, 0.86);
        }
      `});this._waterUniforms=t;const i=new Hs(1,72);i.rotateX(-Math.PI/2);const n=this._mesh(i,e,!1,!1);n.name="CinderPond",n.scale.set(this.pond.radiusX*.88,1,this.pond.radiusZ*.88),n.position.set(this.pond.x,this.pond.waterY,this.pond.z),n.renderOrder=3,this.environment.add(n),this.landmarks.pond=n;const s=this._materials.grass,a=new bi(.055,1.4,3),o=new hi(a,s,52),l=new oe;for(let c=0;c<52;c+=1){const u=this.random()*Re,h=.86+this.random()*.23,d=this.pond.x+Math.cos(u)*this.pond.radiusX*h,p=this.pond.z+Math.sin(u)*this.pond.radiusZ*h,g=this.getHeight(d,p);l.position.set(d,g+.55,p),l.rotation.y=this.random()*Re,l.scale.setScalar(.7+this.random()*.65),l.updateMatrix(),o.setMatrixAt(c,l.matrix)}o.castShadow=!0,o.receiveShadow=!0,o.name="PondReeds",this.environment.add(o)}_createMesa(t,e,i,n,s=0){const a=new yt;a.name="LayeredMesa",a.position.set(t,this.getHeight(t,e),e),a.rotation.y=s;const o=[{y:n*.28,h:n*.56,top:i*.78,bottom:i},{y:n*.66,h:n*.28,top:i*.6,bottom:i*.76},{y:n*.89,h:n*.18,top:i*.47,bottom:i*.61}],l=[this._materials.sandstoneDark,this._materials.sandstone,this._materials.sandstoneLight];o.forEach((u,h)=>{const d=new Vt(u.top,u.bottom,u.h,11,2),p=this._mesh(d,l[h],!1,!0);p.position.y=u.y,p.rotation.y=h*.17,a.add(p)});const c=this._mesh(new Vt(i*.45,i*.47,.45,11),this._materials.sandstoneLight,!1,!0);return c.position.y=n*.985,a.add(c),this.environment.add(a),a}_createMountainGeometry(){const e=[[0,1],[.18,.95],[.38,.78],[.56,.62],[.72,.5],[.86,.24],[.97,.055]],i=[],n=[];e.forEach(([l,c],u)=>{for(let h=0;h<11;h+=1){const d=h/11*Re,p=1+Math.sin(d*3+u*1.71)*.12+Math.sin(d*7-u*.83)*.055,g=c*p,_=u>1?Math.sin(d*5+u)*.012:0;i.push(Math.cos(d)*g,l-.5+_,Math.sin(d)*g)}});for(let l=0;l<e.length-1;l+=1)for(let c=0;c<11;c+=1){const u=(c+1)%11,h=l*11+c,d=l*11+u,p=(l+1)*11+c,g=(l+1)*11+u;n.push(h,d,p,d,g,p)}const s=i.length/3;i.push(.018,.5,-.012);const a=(e.length-1)*11;for(let l=0;l<11;l+=1)n.push(a+l,a+(l+1)%11,s);const o=new se;return o.setAttribute("position",new Gt(i,3)),o.setIndex(n),o.computeVertexNormals(),o.computeBoundingSphere(),o}_createDistantLandforms(){[[-112,-88,19,27,.1],[111,-94,24,35,-.2],[-126,35,15,22,.5],[118,87,20,29,.2],[60,-126,12,19,.7],[-63,128,18,25,-.5]].forEach(c=>this._createMesa(...c));const e=new ba({color:7359051}),i=new ba({color:5784922}),n=this._createMountainGeometry(),s=32,a=new hi(n,e,s),o=new hi(n,i,s),l=new oe;for(let c=0;c<s;c+=1){const u=c/s*Re+this.random()*.08,h=163+this.random()*20,d=24+this.random()*34,p=14+this.random()*17;l.position.set(Math.cos(u)*h,d*.5-1.5,Math.sin(u)*h),l.rotation.y=this.random()*Re,l.scale.set(p,d,p*(.72+this.random()*.55)),l.updateMatrix(),(c%2?a:o).setMatrixAt(c,l.matrix);const g=new Jt().makeScale(0,0,0);(c%2?o:a).setMatrixAt(c,g)}a.count=s,o.count=s,a.name="DistantMountainsWarm",o.name="DistantMountainsCool",this.environment.add(a,o)}_buildingPalette(t){const e={saloon:[8208177,12683864],hotel:[8807751,12951918],sheriff:[6971986,12362869],bank:[10189137,13742202],store:[8149312,12818274],stable:[6307886,10184772],chapel:[11770745,14140577],undertaker:[4801602,8484458]},[i,n]=e[t]||e.store;return{body:new We({color:i,roughness:.93}),trim:new We({color:n,roughness:.9})}}_createBuilding(t){const{id:e,label:i,kind:n="store",x:s,z:a,width:o=10,depth:l=7,height:c=6,stories:u=1,sign:h=i,porch:d=!0,roof:p="gable"}=t,g=new yt;g.name=i;const _=this.getHeight(s,a),m=s<0?1:-1,f=m>0?l*.5:-l*.5,w=this._buildingPalette(n),b=this._box(l,c,o,w.body,!0,!0);b.position.y=c*.5+.18,g.add(b),this.cameraColliders.push(b);for(let F=.75;F<c;F+=.62){const z=this._box(l+.035,.045,o+.035,this._materials.woodDark,!1,!1);z.position.y=F,z.material=this._materials.woodDark,g.add(z)}if(p==="gable"){const F=Math.min(1.25,l*.18),z=l*.5+.5,q=Math.hypot(z,F),G=Math.atan2(F,z);for(const K of[-1,1]){const V=this._box(q,.22,o+1.1,this._materials.roof,!0,!0);V.position.set(K*z*.5,c+F*.5+.2,0),V.rotation.z=K<0?G:-G,g.add(V)}}else{const F=this._box(l+.8,.28,o+.9,this._materials.roofTin,!0,!0);F.position.y=c+.34,g.add(F)}const M=n==="saloon"||u>1?2.05:1.45,P=this._box(.23,M,o+.35,w.body,!0,!0);P.position.set(f+m*.08,c+M*.36,0),g.add(P);const E=this._box(.35,.22,o+.72,w.trim,!0,!0);E.position.set(f+m*.1,c+M*.86,0),g.add(E);for(const F of[-1,1]){const z=this._box(.22,c+.25,.25,w.trim,!0,!0);z.position.set(f+m*.11,c*.5,F*(o*.5-.16)),g.add(z)}const A=this._box(.26,2.75,1.35,this._materials.woodDark,!0,!0);A.position.set(f+m*.22,1.42,0),g.add(A);const D=this._box(.05,1.9,.9,w.trim,!1,!1);D.position.set(f+m*.38,1.5,0),g.add(D);const y=this._mesh(new fe(.07,8,6),this._materials.brass,!1,!1);y.position.set(f+m*.43,1.35,.38),g.add(y);const x=u>1?[2.2,5.55]:[2.35];for(const F of x)for(const z of[-o*.29,o*.29]){if(F<3&&Math.abs(z)<1.2)continue;const q=this._box(.28,1.7,1.5,w.trim,!0,!0);q.position.set(f+m*.25,F,z);const G=this._box(.08,1.34,1.15,this._materials.glass,!1,!1);G.position.set(f+m*.42,F,z);const K=this._box(.09,1.42,.08,this._materials.woodDark,!1,!1);K.position.set(f+m*.48,F,z);const V=this._box(.09,.08,1.22,this._materials.woodDark,!1,!1);V.position.set(f+m*.48,F,z),g.add(q,G,K,V)}if(d){const F=n==="saloon"?3:2.25,z=f+m*F*.52,q=this._box(F,.2,o+.55,this._materials.woodLight,!0,!0);q.position.set(z,.26,0),g.add(q);const G=this._box(F+.15,.18,o+.6,this._materials.paleWood,!0,!0);G.position.set(z,3.32,0),G.rotation.z=m*-.045,g.add(G);for(const K of[-o*.46,o*.46]){const V=this._box(.16,3.15,.16,this._materials.wood,!0,!0);V.position.set(f+m*(F-.18),1.73,K),g.add(V)}this.surfaceZones.push({type:"wood",minX:s+Math.min(f,f+m*F)-.2,maxX:s+Math.max(f,f+m*F)+.2,minZ:a-o*.5-.3,maxZ:a+o*.5+.3})}const R=this._createSign(h,o*.58,n==="saloon"?1.25:.9);R.position.set(f+m*.29,c+M*.34,0),R.rotation.y=m*Math.PI*.5,g.add(R),n==="saloon"&&this._decorateSaloon(g,{depth:l,width:o,height:c,frontX:f,streetSide:m,palette:w}),g.position.set(s,_,a),this.town.add(g),this._addBoxCollider(s,a,l*.5,o*.5,{id:e,type:"building"});const B=new T(s+f+m*(d?2.15:.8),_,a);return this.interactables.push({id:e,type:n,label:i,position:B,radius:2.2,object:g}),this.landmarks[e]=g,g}_createSign(t,e,i){const n=this._box(e,i,.12,this._materials.woodDark,!0,!0),s=new yt;if(s.add(n),typeof document<"u"){const a=document.createElement("canvas");a.width=768,a.height=192;const o=a.getContext("2d");if(o){const l=o.createLinearGradient(0,0,0,a.height);l.addColorStop(0,"#7d4329"),l.addColorStop(.5,"#9a5c34"),l.addColorStop(1,"#62321f"),o.fillStyle=l,o.fillRect(0,0,a.width,a.height),o.strokeStyle="#d8b171",o.lineWidth=12,o.strokeRect(12,12,a.width-24,a.height-24),o.fillStyle="#f1d49a",o.textAlign="center",o.textBaseline="middle",o.font=`700 ${t.length>14?67:82}px Georgia, serif`,o.shadowColor="#29140d",o.shadowBlur=4,o.fillText(t.toUpperCase(),a.width/2,a.height/2+3);const c=new kl(a);c.colorSpace=Be,c.anisotropy=Math.min(8,this.renderer?.capabilities?.getMaxAnisotropy?.()||1);const u=new Ke({map:c,side:Je,toneMapped:!0}),h=new qt(new En(e*.96,i*.88),u);h.position.z=.071,s.add(h)}}return s}_decorateSaloon(t,e){const{depth:i,width:n,frontX:s,streetSide:a,palette:o}=e,l=this._box(2.05,.18,n+.35,this._materials.woodLight,!0,!0);l.position.set(s+a*.98,4.45,0),t.add(l);for(let d=-n*.47;d<=n*.47;d+=1.18){const p=this._box(.09,.9,.09,this._materials.paleWood,!0,!0);p.position.set(s+a*1.82,4.92,d),t.add(p)}const c=this._box(.12,.12,n+.2,o.trim,!0,!0);c.position.set(s+a*1.82,5.36,0),t.add(c);for(const d of[-1,1]){const p=this._box(.08,1.05,.57,this._materials.woodLight,!0,!0);p.position.set(s+a*.52,1.25,d*.34),p.rotation.x=d*.08,t.add(p)}const u=this._box(.85,3.1,.85,this._materials.sandstoneDark,!0,!0);u.position.set(-a*i*.22,e.height+1.1,-n*.28),t.add(u),new T().set(t.position.x-a*i*.22,t.position.y+e.height+2.8,t.position.z-n*.28),t.userData.smokeLocal=u.position.clone().add(new T(0,1.75,0))}_createTown(){this._createBuilding({id:"saloon",label:"Sundown Saloon",sign:"SUNDOWN SALOON",kind:"saloon",x:-14,z:-13,width:13.2,depth:8.4,height:8.1,stories:2}),this._createBuilding({id:"generalStore",label:"Mercantile",sign:"J. BELL & CO.",kind:"store",x:-13.6,z:1,width:10.5,depth:7.1,height:5.8}),this._createBuilding({id:"sheriff",label:"Sheriff's Office",sign:"SHERIFF",kind:"sheriff",x:-13.2,z:12.2,width:8.3,depth:6.6,height:5.4,roof:"flat"}),this._createBuilding({id:"undertaker",label:"Undertaker",sign:"UNDERTAKER",kind:"undertaker",x:-13.2,z:22.2,width:8.2,depth:6.5,height:5.5}),this._createBuilding({id:"hotel",label:"Copper Star Hotel",sign:"COPPER STAR HOTEL",kind:"hotel",x:15.2,z:-15.4,width:14.2,depth:9.2,height:9.1,stories:2}),this._createBuilding({id:"outfitter",label:"Outfitter",sign:"OUTFITTER",kind:"store",x:14,z:.3,width:9.5,depth:7.1,height:5.9}),this._createBuilding({id:"bank",label:"Territory Bank",sign:"TERRITORY BANK",kind:"bank",x:14.3,z:11.4,width:9.7,depth:7.8,height:6.7,roof:"flat"}),this._createBuilding({id:"stable",label:"Livery & Stable",sign:"LIVERY",kind:"stable",x:-18.4,z:35.5,width:16,depth:11.2,height:7.1,porch:!1}),this._createBuilding({id:"chapel",label:"Cinder Creek Chapel",sign:"CHAPEL",kind:"chapel",x:20.4,z:35.8,width:10.2,depth:8.2,height:7.5,porch:!1}),this._decorateChapel(),this._createWaterTower(-31,31),this._createWindmill(35,36);const t=this.landmarks.saloon;if(t?.userData.smokeLocal){const e=t.userData.smokeLocal;this._createSmokeEmitter(new T(t.position.x+e.x,t.position.y+e.y,t.position.z+e.z))}}_decorateChapel(){const t=this.landmarks.chapel;if(!t)return;const e=this._mesh(new bi(1.45,4.2,4),this._materials.roof,!0,!0);e.position.set(0,10.1,0),e.rotation.y=Math.PI/4,t.add(e);const i=this._box(2.2,3.3,2.2,this._materials.paleWood,!0,!0);i.position.set(0,8.3,0),t.add(i);const n=this._box(.16,1.7,.16,this._materials.woodDark,!0,!0),s=this._box(.16,.16,.9,this._materials.woodDark,!0,!0);n.position.set(0,12.72,0),s.position.set(0,12.95,0),t.add(n,s)}_cylinderBetween(t,e,i,n,s=7){const a=t.clone().add(e).multiplyScalar(.5),o=t.distanceTo(e),l=new Vt(i,i,o,s),c=this._mesh(l,n,!0,!0);return c.position.copy(a),c.quaternion.setFromUnitVectors(xc,e.clone().sub(t).normalize()),c}_createWaterTower(t,e){const i=this.getHeight(t,e),n=new yt;n.name="WaterTower",n.position.set(t,i,e);const s=12.4,a=3.1;for(const h of[-1,1])for(const d of[-1,1]){const p=this._cylinderBetween(new T(h*a,0,d*a),new T(h*1.75,s-1.4,d*1.75),.18,this._materials.woodDark);n.add(p)}const o=this._mesh(new Vt(3.25,3.05,4.1,14),this._materials.wood,!0,!0);o.position.y=s,n.add(o);for(let h=-1;h<=1;h+=1){const d=this._mesh(new vi(3.14,.095,6,18),this._materials.iron,!0,!0);d.position.y=s+h*1.18,d.rotation.x=Math.PI/2,n.add(d)}const l=this._mesh(new bi(3.65,1.8,14),this._materials.roofTin,!0,!0);l.position.y=s+2.9,n.add(l);const c=this._box(.1,9.5,.1,this._materials.iron,!0,!0),u=c.clone();c.position.set(0,6.5,3.2),u.position.set(.72,6.5,3.2),n.add(c,u);for(let h=2;h<=11;h+=.65){const d=this._box(.82,.07,.09,this._materials.iron,!0,!0);d.position.set(.36,h,3.2),n.add(d)}this.town.add(n),this._addCircleCollider(t,e,3.1,{id:"waterTower",type:"structure"}),this.cover.push({id:"waterTower",type:"structure",position:new T(t,i,e),radius:3.3,height:4,object:n}),this.landmarks.waterTower=n}_createWindmill(t,e){const i=this.getHeight(t,e),n=new yt;n.name="RanchWindmill",n.position.set(t,i,e);const s=13.8,a=3.4;for(const h of[-1,1])for(const d of[-1,1])n.add(this._cylinderBetween(new T(h*a,0,d*a),new T(h*.58,s,d*.58),.1,this._materials.iron,6));for(let h=2.2;h<s;h+=2.1){const d=gn(a,.58,h/s);n.add(this._cylinderBetween(new T(-d,h,-d),new T(d,h,-d),.06,this._materials.iron,5),this._cylinderBetween(new T(-d,h,d),new T(d,h,d),.06,this._materials.iron,5))}const o=new yt;o.name="WindmillRotor",o.position.set(0,s,-.78);for(let h=0;h<10;h+=1){const d=this._box(.08,5.8,.48,this._materials.roofTin,!0,!0);d.position.y=3.15;const p=new yt;p.rotation.x=h/10*Re,p.add(d),o.add(p)}const l=this._mesh(new Vt(.48,.48,1.3,10),this._materials.iron,!0,!0);l.rotation.z=Math.PI/2,o.add(l);const c=new se;c.setAttribute("position",new Gt([0,0,0,0,2.4,5.7,0,-1.4,5.7],3)),c.computeVertexNormals();const u=this._mesh(c,this._materials.roofTin,!0,!0);o.add(u),n.add(o),this.town.add(n),this._windmillRotor=o,this._addCircleCollider(t,e,2.5,{id:"windmill",type:"structure"}),this.landmarks.windmill=n}_createTownProps(){this._createTrough(6.7,23.5,.1),this._createWagon(4.8,-2.5,-.13),[[-7.8,-16.8],[-8.5,-15.5],[8.8,8.5],[9.3,9.8],[-8.6,8.8],[9.1,-18.5],[-23.2,29.4]].forEach(([i,n],s)=>this._createBarrel(i,n,s)),[[-8.5,2.8,2],[8.8,1.7,3],[-8.4,20.2,2],[10.1,-10.8,2],[-25.2,34,3]].forEach(([i,n,s],a)=>this._createCrates(i,n,s,a)),this._createHitchingRail(-6.9,-10,12),this._createHitchingRail(7.4,15.3,8),this._createCampfire(-30,-22),this._createGallows(26.5,-1.5),this._createTownLantern(-7.4,-7.2),this._createTownLantern(7.5,-7.2),this._createTownLantern(-7.3,16.8),this._createTownLantern(7.4,16.8)}_createBarrel(t,e,i=0){const n=this.getHeight(t,e),s=new yt;s.name=`Barrel-${i}`;const a=this._mesh(new Vt(.55,.5,1.38,12,3),this._materials.wood,!0,!0);a.position.y=.7,s.add(a);for(const o of[.16,.48,.92,1.24]){const l=this._mesh(new vi(.52,.045,5,12),this._materials.iron,!0,!0);l.rotation.x=Math.PI/2,l.position.y=o,s.add(l)}s.position.set(t,n,e),this.props.add(s),this._addCircleCollider(t,e,.54,{id:s.name,type:"barrel"}),this.cover.push({id:s.name,type:"barrel",position:new T(t,n,e),radius:.7,height:1.38,object:s})}_createCrates(t,e,i,n=0){const s=this.getHeight(t,e),a=new yt;a.name=`CrateStack-${n}`;const o=[[0,.62,0,0],[.12,1.75,-.08,.12],[1.05,.52,.18,-.15]];for(let l=0;l<i;l+=1){const[c,u,h,d]=o[l],p=this._box(1.12,1.05,1.12,this._materials.woodLight,!0,!0);p.position.set(c,u,h),p.rotation.y=d,a.add(p);for(const g of[-.47,.47]){const _=this._box(1.15,.11,.09,this._materials.woodDark,!0,!0);_.position.set(c,u,h+g),_.rotation.y=d,a.add(_)}}a.position.set(t,s,e),this.props.add(a),this._addBoxCollider(t+.35,e,i>2?1.1:.65,.72,{id:a.name,type:"crate"}),this.cover.push({id:a.name,type:"crate",position:new T(t,s,e),radius:i>2?1.45:.85,height:i>1?2.28:1.05,object:a})}_createTrough(t,e,i=0){const n=this.getHeight(t,e),s=new yt;s.name="HorseWaterTrough",s.position.set(t,n,e),s.rotation.y=i;const a=4.8,o=this._box(a,.85,.18,this._materials.wood,!0,!0),l=o.clone();o.position.set(0,.65,-.65),l.position.set(0,.65,.65);const c=this._box(.2,.85,1.45,this._materials.wood,!0,!0),u=c.clone();c.position.set(-a*.5,.65,0),u.position.set(a*.5,.65,0);const h=this._mesh(new En(a-.3,1.05),new We({color:5080460,roughness:.2,metalness:.05,transparent:!0,opacity:.82}),!1,!1);h.rotation.x=-Math.PI/2,h.position.y=.92,s.add(o,l,c,u,h),this.props.add(s),this._addBoxCollider(t,e,2.5,.78,{id:"trough",type:"trough"}),this.cover.push({id:"trough",type:"trough",position:new T(t,n,e),radius:2.55,height:1.1,object:s}),this.interactables.push({id:"trough",type:"water",label:"Water trough",position:new T(t,n,e),radius:2.7,object:s}),this.landmarks.trough=s}_createWagon(t,e,i=0){const n=this.getHeight(t,e),s=new yt;s.name="SupplyWagon",s.position.set(t,n+.05,e),s.rotation.y=i;const a=this._box(3.8,.55,2.15,this._materials.woodLight,!0,!0);a.position.y=1.55,s.add(a);for(const c of[-1,1]){const u=this._box(3.8,.9,.18,this._materials.wood,!0,!0);u.position.set(0,2.05,c*1.02),s.add(u);for(const h of[-1.35,1.35]){const d=this._mesh(new vi(.92,.095,7,16),this._materials.woodDark,!0,!0);d.position.set(h,.95,c*1.18),s.add(d);for(let p=0;p<8;p+=1){const g=this._box(.07,1.65,.06,this._materials.wood,!0,!0);g.position.copy(d.position),g.rotation.z=p/8*Re,s.add(g)}}}const o=this._box(3.8,.12,.12,this._materials.woodDark,!0,!0),l=o.clone();o.position.set(3.55,1.18,-.65),l.position.set(3.55,1.18,.65),s.add(o,l),this.props.add(s),this._addBoxCollider(t,e,2.15,1.35,{id:"wagon",type:"wagon"}),this.cover.push({id:"wagon",type:"wagon",position:new T(t,n,e),radius:2.5,height:2.5,object:s}),this.landmarks.wagon=s}_createHitchingRail(t,e,i){const n=this.getHeight(t,e),s=new yt;s.position.set(t,n,e),s.name="HitchingRail";for(const o of[-i*.5,0,i*.5]){const l=this._box(.2,1.55,.2,this._materials.woodDark,!0,!0);l.position.set(o,.75,0),s.add(l)}const a=this._box(i+.3,.16,.16,this._materials.wood,!0,!0);a.position.y=1.28,s.add(a),this.props.add(s),this._addSegmentCollider(t-i*.5,e,t+i*.5,e,.12,{type:"rail"})}_createCampfire(t,e){const i=this.getHeight(t,e),n=new yt;n.name="Campfire",n.position.set(t,i,e);for(let l=0;l<12;l+=1){const c=l/12*Re,u=this._mesh(new Wr(.25,0),this._materials.rock,!0,!0);u.position.set(Math.cos(c)*.82,.2,Math.sin(c)*.82),u.scale.set(1.2,.75,1),n.add(u)}for(const l of[-.48,.48]){const c=this._mesh(new Vt(.13,.16,1.7,7),this._materials.woodDark,!0,!0);c.rotation.z=Math.PI/2,c.rotation.y=l,c.position.y=.2,n.add(c)}const s=this._mesh(new bi(.5,1.5,7),this._materials.flame,!1,!1);s.position.y=.86;const a=this._mesh(new bi(.27,.9,7),this._materials.ember,!1,!1);a.position.y=.59;const o=new Vs(16738858,8,14,2);o.position.y=1.1,o.castShadow=!1,n.add(s,a,o),n.userData.flameOuter=s,n.userData.flameInner=a,n.userData.light=o,this.props.add(n),this._campfire=n,this.interactables.push({id:"campfire",type:"camp",label:"Campfire",position:new T(t,i,e),radius:2.4,object:n})}_createGallows(t,e){const i=this.getHeight(t,e),n=new yt;n.name="OldGallows",n.position.set(t,i,e);const s=this._box(5.3,.65,4.1,this._materials.wood,!0,!0);s.position.y=.45,n.add(s);for(const c of[-2.15,2.15]){const u=this._box(.28,5.8,.28,this._materials.woodDark,!0,!0);u.position.set(c,3.5,-1.28),n.add(u)}const a=this._box(5,.32,.34,this._materials.woodDark,!0,!0);a.position.set(0,6.2,-1.28),n.add(a);const o=this._mesh(new Vt(.035,.035,2.1,6),new We({color:11836010,roughness:1}),!0,!0);o.position.set(1.25,5.05,-1.28),n.add(o);const l=this._mesh(new vi(.28,.035,6,15),o.material,!0,!0);l.position.set(1.25,4,-1.28),l.rotation.x=Math.PI/2,n.add(l),this.props.add(n),this._addBoxCollider(t,e,2.65,2.05,{id:"gallows",type:"structure"}),this.cover.push({id:"gallows",type:"structure",position:new T(t,i,e),radius:3,height:1,object:n}),this.landmarks.gallows=n}_createTownLantern(t,e){const i=this.getHeight(t,e),n=new yt;n.position.set(t,i,e),n.name="TownLantern";const s=this._box(.14,3.7,.14,this._materials.iron,!0,!0);s.position.y=1.85;const a=this._box(.82,.1,.1,this._materials.iron,!0,!0);a.position.set(.35,3.62,0);const o=this._box(.42,.72,.42,this._materials.iron,!0,!0);o.position.set(.72,3.18,0);const l=this._mesh(new fe(.2,10,7),this._materials.flame,!1,!1);l.position.copy(o.position);const c=new Vs(16747075,2.7,9,2);c.position.copy(o.position),n.add(s,a,o,l,c),this.props.add(n),this._lanterns.push({light:c,seed:this.random()*20})}_createFenceSegment(t,e,i,n=!0){const s=t.distanceTo(e),a=Math.max(1,Math.ceil(s/3.8)),o=e.clone().sub(t);for(let u=0;u<=a;u+=1){const h=u/a,d=t.clone().lerp(e,h);d.y=this.getHeight(d.x,d.z);const p=this._box(.19,1.72,.19,this._materials.woodDark,!0,!0);p.position.set(d.x,d.y+.83,d.z),p.rotation.y=this.random()*.1,i.add(p)}const l=Math.hypot(o.x,o.z),c=-Math.atan2(o.z,o.x);for(const u of[.62,1.25]){const h=t.clone().add(e).multiplyScalar(.5);h.y=(this.getHeight(t.x,t.z)+this.getHeight(e.x,e.z))*.5+u;const d=this._box(l,.13,.13,this._materials.wood,!0,!0);d.position.copy(h),d.rotation.y=c,i.add(d)}n&&this._addSegmentCollider(t.x,t.z,e.x,e.z,.11,{type:"fence"})}_createFences(){const t=new yt;t.name="RanchFences";const e=[[[-43,25],[-43,55]],[[-43,55],[-10,55]],[[-10,55],[-10,49]],[[29,25],[48,25]],[[48,25],[48,52]],[[48,52],[30,52]],[[-53,-34],[-28,-42]],[[28,-43],[57,-34]]];for(const[[i,n],[s,a]]of e)this._createFenceSegment(new T(i,0,n),new T(s,0,a),t);this.props.add(t)}_createTelegraphLine(){const t=new yt;t.name="TelegraphLine";const e=[];for(let n=-112;n<=116;n+=19){if(n>-28&&n<50)continue;const s=8.7+Math.sin(n*.024)*1.35,a=this.getHeight(s,n),o=this._mesh(new Vt(.12,.19,7.8,7),this._materials.woodDark,!0,!0);o.position.set(s,a+3.85,n);const l=this._box(2.15,.13,.15,this._materials.wood,!0,!0);l.position.set(s,a+7.12,n),t.add(o,l);for(const c of[-.82,.82]){const u=this._mesh(new fe(.1,7,5),this._materials.glass,!1,!1);u.position.set(s+c,a+7.28,n),t.add(u)}e.push({x:s,z:n,y:a+7.32})}const i=new Hr({color:2630695,transparent:!0,opacity:.8});for(const n of[-.82,.82]){const s=[];for(let o=0;o<e.length-1;o+=1){const l=e[o],c=e[o+1];if(!(c.z-l.z>28))for(let u=0;u<=8;u+=1){const h=u/8,d=Math.sin(h*Math.PI)*.55;s.push(new T(gn(l.x,c.x,h)+n,gn(l.y,c.y,h)-d,gn(l.z,c.z,h)))}}const a=new jo(new se().setFromPoints(s),i);t.add(a)}this.props.add(t)}_validScatterPosition(t,e,i=0){if(Math.abs(t)<39+i&&Math.abs(e)<54+i)return!1;const n=Math.sin(e*.024)*1.35;if(Math.abs(t-n)<8+i||Math.sqrt(((t-this.pond.x)/(this.pond.radiusX+i))**2+((e-this.pond.z)/(this.pond.radiusZ+i))**2)<=1.05)return!1;const a=Math.max(.75,3+i);for(const o of[this.playerSpawn,this.horseSpawn,...this.enemySpawns])if(Math.hypot(t-o.x,e-o.z)<a)return!1;return!0}_createVegetation(){this._createInstancedRocks(),this._createInstancedScrub(),this._createInstancedCacti(),this._createJoshuaTrees()}_createInstancedRocks(){const e=new Wr(.72,0),i=new hi(e,this._materials.rock,190);i.name="ScatteredRocks",i.castShadow=!0,i.receiveShadow=!0;const n=new oe;let s=0,a=0;for(;s<190&&a<1520;){a+=1;const o=this.random()*Re,l=28+Math.sqrt(this.random())*111,c=Math.cos(o)*l,u=Math.sin(o)*l;if(!this._validScatterPosition(c,u,-2))continue;const h=.35+this.random()**2*1.65;n.position.set(c,this.getHeight(c,u)+h*.28,u),n.rotation.set(this.random()*.7,this.random()*Re,this.random()*.55),n.scale.set(h*(.7+this.random()*.75),h*.62,h),n.updateMatrix(),i.setMatrixAt(s,n.matrix),h>1.2&&l<105&&this._addCircleCollider(c,u,h*.5,{type:"rock"}),s+=1}i.count=s,this.environment.add(i)}_createInstancedScrub(){const i=new bi(.16,.9,3),n=new Ls(.62,0),s=new hi(i,this._materials.grass,320),a=new hi(n,this._materials.scrub,105);s.name="DryGrassTufts",a.name="Sagebrush",s.castShadow=!0,a.castShadow=!0;const o=new oe;let l=0,c=0;for(;l<320&&c<320*8;){c+=1;const u=this.random()*Re,h=24+Math.sqrt(this.random())*114,d=Math.cos(u)*h,p=Math.sin(u)*h;if(!this._validScatterPosition(d,p,-3.5))continue;const g=.55+this.random()*1.05;o.position.set(d,this.getHeight(d,p)+g*.36,p),o.rotation.set(0,this.random()*Re,(this.random()-.5)*.15),o.scale.set(g,g,g),o.updateMatrix(),s.setMatrixAt(l,o.matrix),l+=1}s.count=l;for(let u=0;u<105;u+=1){const h=this.random()*Re,d=34+Math.sqrt(this.random())*104;let p=Math.cos(h)*d,g=Math.sin(h)*d;this._validScatterPosition(p,g,-1)||(p+=Math.sign(p||1)*16,g+=Math.sign(g||1)*8);const _=.45+this.random()*.9;o.position.set(p,this.getHeight(p,g)+_*.33,g),o.rotation.set(0,this.random()*Re,0),o.scale.set(_*1.35,_*.7,_),o.updateMatrix(),a.setMatrixAt(u,o.matrix)}this.environment.add(s,a)}_createInstancedCacti(){const e=new Vt(.36,.46,3.6,7),i=new Vt(.2,.25,1.45,7),n=new hi(e,this._materials.cactus,48),s=new hi(i,this._materials.cactusLight,48),a=new hi(i,this._materials.cactusLight,48),o=new hi(i,this._materials.cactus,48),l=new hi(i,this._materials.cactus,48);n.name="SaguaroCacti";const c=new oe;let u=0,h=0;for(;u<48&&h<576;){h+=1;const d=this.random()*Re,p=42+Math.sqrt(this.random())*93,g=Math.cos(d)*p,_=Math.sin(d)*p;if(!this._validScatterPosition(g,_,2))continue;const m=.72+this.random()*1.15,f=this.random()*Re,w=this.getHeight(g,_),b=new T(g,w,_),M=new Cn().setFromAxisAngle(xc,f);c.position.set(g,w+1.8*m,_),c.quaternion.copy(M),c.scale.set(m,m,m),c.updateMatrix(),n.setMatrixAt(u,c.matrix);const P=(1.75+this.random()*.75)*m,E=(1.25+this.random()*.85)*m,A=new T(Math.cos(f),0,-Math.sin(f)),D=this.random()<.14,y=this.random()<.36,x=M.clone(),R=new Cn().setFromAxisAngle(new T(0,0,1),Math.PI/2).premultiply(M),B=(F,z,q,G,K=!1)=>{c.position.copy(z),c.quaternion.copy(q),c.scale.setScalar(K?1e-4:G),c.updateMatrix(),F.setMatrixAt(u,c.matrix)};B(o,b.clone().addScaledVector(A,.62*m).add(new T(0,P,0)),R,m*.72,D),B(s,b.clone().addScaledVector(A,1.12*m).add(new T(0,P+.48*m,0)),x,m*.78,D),B(l,b.clone().addScaledVector(A,-.58*m).add(new T(0,E,0)),R,m*.66,y),B(a,b.clone().addScaledVector(A,-1.04*m).add(new T(0,E+.42*m,0)),x,m*.72,y),this._addCircleCollider(g,_,.42*m,{type:"cactus"}),u+=1}for(const d of[n,s,a,o,l])d.count=u,d.castShadow=!0,d.receiveShadow=!0,this.environment.add(d)}_createJoshuaTrees(){const t=[[-67,43,1.1],[-76,-34,.9],[73,-52,1.05],[91,62,1.15],[-102,82,.82],[54,77,.88],[-49,-78,1],[102,4,.76]];for(const[e,i,n]of t){const s=this.getHeight(e,i),a=new yt;a.position.set(e,s,i),a.rotation.y=this.random()*Re,a.scale.setScalar(n);const o=this._mesh(new Vt(.28,.52,5.7,7),this._materials.woodDark,!0,!0);o.position.y=2.8,a.add(o);const l=[[0,5.1,0,1.6,1.1],[0,4.1,0,-1.3,.85],[0,3.2,0,.9,-1.05]];for(const[c,u,h,d,p]of l){const g=new T(c,u,h),_=new T(d,u+1.25,p);a.add(this._cylinderBetween(g,_,.2,this._materials.woodDark));const m=this._mesh(new Ls(.9,0),this._materials.cactusLight,!0,!0);m.position.copy(_),m.scale.set(1.05,.8,1.05),a.add(m)}this.environment.add(a),this._addCircleCollider(e,i,.55*n,{type:"tree"})}}_makeRadialTexture(t="#fff1cf",e="rgba(255,190,125,0)"){if(typeof document>"u")return null;const i=document.createElement("canvas");i.width=64,i.height=64;const n=i.getContext("2d");if(!n)return null;const s=n.createRadialGradient(32,32,0,32,32,32);s.addColorStop(0,t),s.addColorStop(.28,t),s.addColorStop(1,e),n.fillStyle=s,n.fillRect(0,0,64,64);const a=new kl(i);return a.colorSpace=Be,a}_createAtmosphere(){this._createClouds(),this._createBirds(),this._createDust(),this._createTumbleweeds()}_createClouds(){const t=new fe(1,10,7);for(let e=0;e<8;e+=1){const i=new yt;i.name="SunsetCloud";const n=5+this.random()*7,s=4+Math.floor(this.random()*3);for(let a=0;a<s;a+=1){const o=this._mesh(t,this._materials.cloud,!1,!1);o.position.set((a-s*.5)*1.25+this.random()*.6,this.random()*.8,(this.random()-.5)*1.2),o.scale.set(1.8+this.random(),.65+this.random()*.5,1+this.random()),i.add(o)}i.scale.setScalar(n),i.position.set(-130+this.random()*260,52+this.random()*38,-125+this.random()*250),i.userData.speed=.32+this.random()*.38,i.userData.phase=this.random()*Re,this.atmosphere.add(i),this._clouds.push(i)}}_createBirds(){const t=new Hr({color:2694948,transparent:!0,opacity:.78});for(let e=0;e<9;e+=1){const i=new se;i.setAttribute("position",new Gt([-.8,0,0,0,.25,0,0,.25,0,.8,0,0],3));const n=new Zu(i,t);n.name="Bird",n.userData.radius=28+this.random()*62,n.userData.height=24+this.random()*19,n.userData.speed=.045+this.random()*.04,n.userData.phase=this.random()*Re,n.userData.centerX=(this.random()-.5)*50,n.userData.centerZ=(this.random()-.5)*50,n.scale.setScalar(.65+this.random()*.75),this.atmosphere.add(n),this._birds.push(n)}}_createDust(){const e=new Float32Array(1260),i=new Float32Array(420*3);for(let l=0;l<420;l+=1){const c=l*3;e[c]=(this.random()-.5)*150,e[c+1]=.15+this.random()*5.5,e[c+2]=(this.random()-.5)*150,i[c]=.28+this.random()*.62,i[c+1]=.025+this.random()*.11,i[c+2]=(this.random()-.5)*.16}const n=new se;n.setAttribute("position",new ke(e,3));const s=this._makeRadialTexture("#f8c795","rgba(205,123,76,0)"),a=new qs({color:15114350,map:s||null,size:.32,sizeAttenuation:!0,transparent:!0,opacity:.36,depthWrite:!1,blending:nn}),o=new jr(n,a);o.name="WindblownDust",o.frustumCulled=!1,this.atmosphere.add(o),this._dust={points:o,positions:e,velocities:i,count:420,center:new T}}_createSmokeEmitter(t){const e=this._makeRadialTexture("#b8a397","rgba(90,67,65,0)"),i=new ih({color:9205616,map:e||null,transparent:!0,opacity:.24,depthWrite:!1});for(let n=0;n<8;n+=1){const s=new qu(i.clone());s.name="ChimneySmoke",s.position.copy(t),s.userData.origin=t.clone(),s.userData.phase=n/8,s.userData.seed=this.random()*Re,s.scale.setScalar(.6),this.atmosphere.add(s),this._smoke.push(s)}}_createTumbleweeds(){const t=new We({color:9201470,roughness:1,wireframe:!0});for(let e=0;e<4;e+=1){const i=this._mesh(new Ls(.7,1),t,!0,!0);i.name="Tumbleweed",i.position.set(-52+e*25,1,-37+e*13),i.scale.set(1.2,1,1),i.userData.speed=1.1+this.random()*1.1,i.userData.offset=this.random()*70,this.atmosphere.add(i),this._tumbleweeds.push(i)}}_addBoxCollider(t,e,i,n,s={}){const a={shape:"box",minX:t-i,maxX:t+i,minZ:e-n,maxZ:e+n,...s};return this.colliders.push(a),a}_addCircleCollider(t,e,i,n={}){const s={shape:"circle",x:t,z:e,radius:i,...n};return this.colliders.push(s),s}_addSegmentCollider(t,e,i,n,s=.1,a={}){const o={shape:"segment",ax:t,az:e,bx:i,bz:n,padding:s,...a};return this.colliders.push(o),o}_buildCoverPoints(){this.coverPoints.length=0;const t=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1)];for(const e of this.cover){let i=0;for(const n of t){const s=e.position.clone().addScaledVector(n,Math.max(1.05,e.radius+.62)),a=s.clone();if(this.resolveCollisions(s,.4),!(s.distanceToSquared(a)>.015)&&(s.y=this.getHeight(s.x,s.z),s.userData={coverId:e.id,coverType:e.type},this.coverPoints.push(s),i+=1,i===2))break}}}resolveCollisions(t,e=.65){if(!t||!Number.isFinite(t.x)||!Number.isFinite(t.z))return t;t.x=yn(t.x,-this.playableRadius+e,this.playableRadius-e),t.z=yn(t.z,-this.playableRadius+e,this.playableRadius-e);for(let i=0;i<3;i+=1){let n=!1;for(const s of this.colliders)if(!s.disabled){if(s.shape==="box"){const a=s.minX-e,o=s.maxX+e,l=s.minZ-e,c=s.maxZ+e;if(t.x<=a||t.x>=o||t.z<=l||t.z>=c)continue;const u=[{axis:"x",value:a,distance:t.x-a},{axis:"x",value:o,distance:o-t.x},{axis:"z",value:l,distance:t.z-l},{axis:"z",value:c,distance:c-t.z}];u.sort((h,d)=>h.distance-d.distance),t[u[0].axis]=u[0].value,n=!0}else if(s.shape==="circle"){const a=t.x-s.x,o=t.z-s.z,l=e+s.radius,c=a*a+o*o;if(c<l*l){const u=Math.sqrt(c),h=u>1e-4?a/u:1,d=u>1e-4?o/u:0;t.x=s.x+h*l,t.z=s.z+d*l,n=!0}}else if(s.shape==="segment"){const a=s.bx-s.ax,o=s.bz-s.az,l=a*a+o*o,c=yn(((t.x-s.ax)*a+(t.z-s.az)*o)/Math.max(l,1e-4),0,1),u=s.ax+a*c,h=s.az+o*c,d=t.x-u,p=t.z-h,g=e+s.padding,_=d*d+p*p;if(_<g*g){const m=Math.sqrt(_);let f,w;if(m>1e-4)f=d/m,w=p/m;else{const b=1/Math.max(1e-4,Math.sqrt(l));f=-o*b,w=a*b}t.x=u+f*g,t.z=h+w*g,n=!0}}}if(!n)break}return t}resolveCollision(t,e=.65){return this.resolveCollisions(t,e)}resolvePlayerCollision(t,e=.65){return this.resolveCollisions(t,e)}getGroundMaterialAt(t,e){for(let a=this.surfaceZones.length-1;a>=0;a-=1){const o=this.surfaceZones[a];if(t>=o.minX&&t<=o.maxX&&e>=o.minZ&&e<=o.maxZ)return o.type}if(Math.sqrt(((t-this.pond.x)/(this.pond.radiusX*.9))**2+((e-this.pond.z)/(this.pond.radiusZ*.9))**2)<1)return"water";const n=Math.sin(e*.024)*1.35;return Math.abs(t-n)<5.5||Math.abs(t)<39&&Math.abs(e)<53?"dirt":this.getHeight(t,e)>3.2?"rock":Math.sin(t*.12-e*.09)>.58?"dry-grass":"sand"}update(t,e,i){if(!this._initialized)return;const n=Math.min(Math.max(t||0,0),.05),s=Number.isFinite(e)?e:0;this._sky&&(i&&this._sky.position.set(i.x,0,i.z),this._sky.material.uniforms.time.value=s),this._waterUniforms&&(this._waterUniforms.time.value=s),this._windmillRotor&&(this._windmillRotor.rotation.x+=n*.54);for(const a of this._clouds)a.position.x+=a.userData.speed*n,a.position.y+=Math.sin(s*.09+a.userData.phase)*n*.05,a.position.x>155&&(a.position.x=-155);for(const a of this._birds){const o=a.userData,l=o.phase+s*o.speed;a.position.set(o.centerX+Math.cos(l)*o.radius,o.height+Math.sin(s*.65+o.phase)*1.2,o.centerZ+Math.sin(l)*o.radius),a.rotation.y=-l;const c=a.geometry.attributes.position,u=Math.sin(s*6.3+o.phase)*.32;c.setY(0,u),c.setY(3,u),c.needsUpdate=!0}if(this._dust){const{positions:a,velocities:o,count:l,points:c,center:u}=this._dust;i&&u.lerp(i,Math.min(1,n*1.8));for(let h=0;h<l;h+=1){const d=h*3;a[d]+=o[d]*n,a[d+1]+=o[d+1]*n,a[d+2]+=o[d+2]*n,(a[d]>u.x+76||a[d+1]>6.4||Math.abs(a[d+2]-u.z)>76)&&(a[d]=u.x-75+this.random()*8,a[d+1]=.12+this.random()*1.2,a[d+2]=u.z-75+this.random()*150)}c.geometry.attributes.position.needsUpdate=!0}for(const a of this._smoke){const o=(s*.085+a.userData.phase)%1,l=a.userData.origin;a.position.set(l.x+Math.sin(s*.8+a.userData.seed)*o*1.25+o*1.35,l.y+o*7.5,l.z+Math.cos(s*.61+a.userData.seed)*o*.65);const c=.55+o*3.4;a.scale.setScalar(c),a.material.opacity=.22*(1-o)}for(const a of this._tumbleweeds){const l=(s*a.userData.speed+a.userData.offset)%155-77.5,c=-40+Math.sin(l*.055+a.userData.offset)*28;a.position.x=l,a.position.z=c,a.position.y=this.getHeight(l,c)+.72+Math.abs(Math.sin(s*2.3))*.26,a.rotation.z-=n*a.userData.speed*1.5,a.rotation.x+=n*.48}if(this._campfire){const a=this._campfire.userData.flameOuter,o=this._campfire.userData.flameInner,l=.88+Math.sin(s*17.3)*.08+Math.sin(s*9.7)*.05;a.scale.set(.88+Math.sin(s*12)*.08,l,.9),o.scale.set(.9,1/Math.max(.7,l),.9),this._campfire.userData.light.intensity=7+Math.sin(s*18.7)*1.1}for(const a of this._lanterns)a.light.intensity=2.55+Math.sin(s*13.2+a.seed)*.23}dispose(){if(!this._initialized)return;this._initialized=!1,this.scene.remove(this.group);const t=new Set,e=new Set,i=new Set;this.group.traverse(n=>{n.geometry&&t.add(n.geometry),n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(a=>e.add(a))});for(const n of e)for(const s of Object.keys(n)){const a=n[s];a?.isTexture&&i.add(a)}i.forEach(n=>n.dispose()),e.forEach(n=>n.dispose()),t.forEach(n=>n.dispose()),this._previousSceneState&&(this.scene.background=this._previousSceneState.background,this.scene.fog=this._previousSceneState.fog,this.scene.environment=this._previousSceneState.environment),this.renderer&&this._previousRendererState&&(this.renderer.shadowMap&&(this.renderer.shadowMap.enabled=this._previousRendererState.shadowEnabled,this.renderer.shadowMap.type=this._previousRendererState.shadowType),this.renderer.toneMapping=this._previousRendererState.toneMapping,this.renderer.toneMappingExposure=this._previousRendererState.toneMappingExposure,"outputColorSpace"in this.renderer&&(this.renderer.outputColorSpace=this._previousRendererState.outputColorSpace)),this.cover.length=0,this.coverPoints.length=0,this.interactables.length=0,this.colliders.length=0,this.cameraColliders.length=0,this.surfaceZones.length=0,this._clouds.length=0,this._birds.length=0,this._smoke.length=0,this._tumbleweeds.length=0,this._lanterns.length=0,this._dust=null,this._windmillRotor=null,this._waterUniforms=null,this._campfire=null}}class q0{constructor(t=document.body,e={}){this.element=t,this.enabled=!0,this.lockOnClick=e.lockOnClick??!0,this.keys=new Set,this.buttons=new Set,this.pointerLocked=!1,this.mouseDelta=new ht,this.wheelDelta=0,this._pressedKeys=new Set,this._releasedKeys=new Set,this._pressedButtons=new Set,this._releasedButtons=new Set,this._gamepadButtons=new Set,this._gamepadAxes={moveX:0,moveY:0,lookX:0,lookY:0},this._abort=new AbortController,this._signal=this._abort.signal,this._onKeyDown=i=>{if(!this.enabled||this._isTyping(i.target))return;const n=i.code||i.key;this.keys.has(n)||this._pressedKeys.add(n),this.keys.add(n),this._isGameKey(n)&&i.preventDefault()},this._onKeyUp=i=>{const n=i.code||i.key;this.keys.delete(n)&&this._releasedKeys.add(n),this._isGameKey(n)&&i.preventDefault()},this._onPointerDown=i=>{this.enabled&&(this.buttons.has(i.button)||this._pressedButtons.add(i.button),this.buttons.add(i.button),this.lockOnClick&&!this.pointerLocked&&this.element?.requestPointerLock&&this.requestPointerLock(),i.preventDefault())},this._onPointerUp=i=>{this.buttons.delete(i.button)&&this._releasedButtons.add(i.button)},this._onPointerMove=i=>{this.enabled&&(this.pointerLocked||this.buttons.size>0)&&(this.mouseDelta.x+=i.movementX||0,this.mouseDelta.y+=i.movementY||0)},this._onWheel=i=>{this.enabled&&(this.wheelDelta+=Math.sign(i.deltaY),i.preventDefault())},this._onPointerLockChange=()=>{this.pointerLocked=document.pointerLockElement===this.element,this.pointerLocked||(this.buttons.clear(),this.mouseDelta.set(0,0))},this._onBlur=()=>this.reset(),this._onContextMenu=i=>i.preventDefault(),window.addEventListener("keydown",this._onKeyDown,{signal:this._signal}),window.addEventListener("keyup",this._onKeyUp,{signal:this._signal}),window.addEventListener("blur",this._onBlur,{signal:this._signal}),document.addEventListener("pointerlockchange",this._onPointerLockChange,{signal:this._signal}),this.element.addEventListener("pointerdown",this._onPointerDown,{signal:this._signal}),window.addEventListener("pointerup",this._onPointerUp,{signal:this._signal}),window.addEventListener("pointermove",this._onPointerMove,{signal:this._signal}),this.element.addEventListener("wheel",this._onWheel,{passive:!1,signal:this._signal}),this.element.addEventListener("contextmenu",this._onContextMenu,{signal:this._signal})}_isTyping(t){const e=t?.tagName?.toLowerCase();return e==="input"||e==="textarea"||t?.isContentEditable}_isGameKey(t){return/^(Key[WASDERFCQ]|Arrow|Space|Shift|Control|Digit[1-4]|Escape|Tab)/.test(t)}isDown(...t){return t.some(e=>this.keys.has(e)||this._gamepadButtons.has(e))}wasPressed(...t){return t.some(e=>this._pressedKeys.has(e)||this._gamepadButtons.has(`${e}:pressed`))}wasReleased(...t){return t.some(e=>this._releasedKeys.has(e))}buttonDown(t=0){return this.buttons.has(t)}buttonPressed(t=0){return this._pressedButtons.has(t)}buttonReleased(t=0){return this._releasedButtons.has(t)}consumeMouseDelta(){const t=this.mouseDelta.clone();return this.mouseDelta.set(0,0),t}getMoveAxis(t=new ht){const e=(this.isDown("KeyD","ArrowRight")?1:0)-(this.isDown("KeyA","ArrowLeft")?1:0),i=(this.isDown("KeyW","ArrowUp")?1:0)-(this.isDown("KeyS","ArrowDown")?1:0);return t.set(e+this._gamepadAxes.moveX,i-this._gamepadAxes.moveY),t.lengthSq()>1&&t.normalize(),t}getLookAxis(t=new ht){return t.set(this._gamepadAxes.lookX,this._gamepadAxes.lookY)}requestPointerLock(){if(!(!this.enabled||!this.element?.requestPointerLock))try{const t=this.element.requestPointerLock({unadjustedMovement:!0});t?.catch&&t.catch(()=>{try{this.element.requestPointerLock?.()?.catch?.(()=>{})}catch{}})}catch{try{this.element.requestPointerLock()?.catch?.(()=>{})}catch{}}}exitPointerLock(){document.pointerLockElement===this.element&&document.exitPointerLock?.()}setEnabled(t){this.enabled=!!t,this.enabled||this.reset()}update(){if(!this.enabled||!navigator.getGamepads)return;const t=Array.from(navigator.getGamepads()).find(Boolean);if(!t){this._gamepadAxes={moveX:0,moveY:0,lookX:0,lookY:0},this._gamepadButtons.clear();return}const e=(n,s=.14)=>{const a=Math.abs(n);return a<s?0:Math.sign(n)*(a-s)/(1-s)};this._gamepadAxes.moveX=e(t.axes[0]||0),this._gamepadAxes.moveY=e(t.axes[1]||0),this._gamepadAxes.lookX=e(t.axes[2]||0),this._gamepadAxes.lookY=e(t.axes[3]||0);const i=[[0,"Space"],[1,"KeyE"],[2,"KeyR"],[4,"Aim"],[5,"Fire"],[8,"Tab"],[10,"ShiftLeft"]];for(const[n,s]of i){const a=!!t.buttons[n]?.pressed,o=this._gamepadButtons.has(s);a?this._gamepadButtons.add(s):this._gamepadButtons.delete(s),this._gamepadButtons.delete(`${s}:pressed`),a&&!o&&this._gamepadButtons.add(`${s}:pressed`)}}endFrame(){this._pressedKeys.clear(),this._releasedKeys.clear(),this._pressedButtons.clear(),this._releasedButtons.clear();for(const t of[...this._gamepadButtons])t.endsWith(":pressed")&&this._gamepadButtons.delete(t);this.mouseDelta.set(0,0),this.wheelDelta=0}reset(){this.keys.clear(),this.buttons.clear(),this._pressedKeys.clear(),this._releasedKeys.clear(),this._pressedButtons.clear(),this._releasedButtons.clear(),this._gamepadButtons.clear(),this.mouseDelta.set(0,0),this.wheelDelta=0}destroy(){this.exitPointerLock(),this._abort.abort(),this.reset()}}const j0=new T(0,1,0),_n=new T,Ia=new T,yc=new T,Sc=new ht,wc=new ht;function be(r,t,e,i){return Kt.lerp(r,t,1-Math.exp(-e*i))}function Y0(r){return r.castShadow=!0,r.receiveShadow=!0,r}class K0{constructor(t,e,i,n={},s={}){this.scene=t,this.camera=e,this.input=i,this.world=n||{},this.options=s,this.maxHealth=s.maxHealth??100,this.health=this.maxHealth,this.ammo=s.ammo??6,this.maxAmmo=s.maxAmmo??6,this.reserveAmmo=s.reserveAmmo??42,this.damage=s.damage??40,this.weaponCooldown=0,this.fireInterval=s.fireInterval??.3,this.reloadDuration=s.reloadDuration??1.35,this.reloadTimer=0,this.isReloading=!1,this.isAiming=!1,this.isMounted=!1,this.isCrouching=!1,this.isSprinting=!1,this.isDead=!1,this.inCover=!1,this.stamina=100,this.maxStamina=100,this.invulnerabilityTimer=0,this.walkSpeed=s.walkSpeed??4.35,this.sprintSpeed=s.sprintSpeed??7.25,this.aimSpeed=s.aimSpeed??3.15,this.crouchSpeed=s.crouchSpeed??2.3,this.acceleration=s.acceleration??14,this.radius=s.radius??.42,this.velocity=new T,this.verticalVelocity=0,this.grounded=!0,this.object=new yt,this.object.name="Player",this.position=this.object.position;const a=s.position||this.world.playerSpawn||new T(0,0,4);this.position.copy(a),this.scene.add(this.object),this._materials=[],this._geometries=[],this._listeners=new Map,this._cameraYaw=s.heading??Math.PI,this._cameraPitch=s.cameraPitch??-.12,this._modelHeading=this._cameraYaw,this._shoulderSide=1,this._cameraShake=0,this._cameraRaycaster=new zi,this._shotRaycaster=new zi,this._previousPosition=this.position.clone(),this._footstepDistance=0,this._elapsed=0,this._damageFlash=0,this._muzzleTimer=0,this._mountGrace=0,this._horse=null,this.nearbyHorse=null,this.lastShot=null,this._buildModel(),this._snapToGround(),this._updateCamera(1,!0)}_material(t){const e=new We(t);return this._materials.push(e),e}_mesh(t,e,i=this._visual){this._geometries.push(t);const n=Y0(new qt(t,e));return i.add(n),n}_buildModel(){this._visual=new yt,this._visual.name="GunslingerVisual",this.object.add(this._visual);const t=this._material({color:11368021,roughness:.88}),e=this._material({color:4871517,roughness:.92}),i=this._material({color:6765609,roughness:.92}),n=this._material({color:3679002,roughness:.75,metalness:.05}),s=this._material({color:3490381,roughness:.98}),a=this._material({color:6316134,roughness:.3,metalness:.85}),o=this._material({color:11172658,roughness:.33,metalness:.8}),l=this._material({color:3154716,roughness:1});this._hips=new yt,this._hips.position.y=1,this._visual.add(this._hips);const c=this._mesh(new Ae(.54,.3,.31),s,this._hips);c.position.y=.02,this._torso=new yt,this._torso.position.y=.2,this._hips.add(this._torso);const u=this._mesh(new Bi(.34,.65,5,10),e,this._torso);u.position.y=.5,u.scale.set(1.04,1,.75),this._coatTails=[];for(const y of[-1,1]){const x=this._mesh(new Ae(.28,.68,.055),i,this._torso);x.position.set(y*.17,.02,.22),x.rotation.x=-.08,this._coatTails.push(x)}this._mesh(new Ae(.7,.54,.08),i,this._torso).position.set(0,.57,.245);const d=this._mesh(new Vt(.31,.32,.11,12),n,this._hips);d.position.y=.16,this._mesh(new Ae(.13,.09,.045),o,this._hips).position.set(0,.17,.32),this._head=new yt,this._head.position.y=1.13,this._torso.add(this._head);const g=this._mesh(new Vt(.115,.14,.22,10),t,this._head);g.position.y=-.12,this._mesh(new fe(.23,16,12),t,this._head).scale.set(.88,1.12,.9);const m=this._mesh(new fe(.235,14,8,0,Math.PI*2,0,Math.PI*.58),l,this._head);m.position.y=.055,m.scale.set(.9,1.02,.94);const f=this._mesh(new fe(.205,12,8,0,Math.PI*2,Math.PI*.5,Math.PI*.48),l,this._head);f.position.set(0,-.055,-.018),f.scale.set(.82,.82,.86);const w=this._mesh(new Vt(.42,.42,.035,24),l,this._head);w.position.y=.24;const b=this._mesh(new Vt(.235,.28,.29,16),l,this._head);b.position.y=.385;const M=this._mesh(new Vt(.282,.282,.055,16),n,this._head);M.position.y=.285,this._legs=[];for(const y of[-1,1]){const x=new yt;x.position.set(y*.18,-.06,0),this._hips.add(x);const R=this._mesh(new Vt(.13,.115,.65,9),s,x);R.position.y=-.31,this._mesh(new Vt(.105,.12,.55,9),n,x).position.set(0,-.87,.015),this._mesh(new Ae(.22,.16,.39),n,x).position.set(0,-1.15,-.08),this._legs.push(x)}this._arms=[];for(const y of[-1,1]){const x=new yt;x.position.set(y*.42,.83,0),this._torso.add(x);const R=this._mesh(new Vt(.105,.09,.69,9),i,x);R.position.y=-.32;const B=this._mesh(new fe(.105,10,8),t,x);B.position.y=-.69,this._arms.push(x)}this._weapon=new yt,this._weapon.position.set(0,-.73,-.055),this._arms[1].add(this._weapon);const P=this._mesh(new Vt(.038,.038,.38,10),a,this._weapon);P.rotation.x=Math.PI/2,P.position.z=-.16;const E=this._mesh(new Vt(.072,.072,.14,10),a,this._weapon);E.rotation.z=Math.PI/2,E.position.z=.025;const A=this._mesh(new Ae(.09,.23,.1),n,this._weapon);A.position.set(0,-.11,.095),A.rotation.x=-.27,this._muzzle=new oe,this._muzzle.position.set(0,0,-.37),this._weapon.add(this._muzzle),this._muzzleFlash=this._mesh(new fe(.105,8,6),this._material({color:16763491,emissive:16740864,emissiveIntensity:5,transparent:!0}),this._muzzle),this._muzzleFlash.scale.set(.65,.65,1.8),this._muzzleFlash.visible=!1,this._muzzleLight=new Vs(16747058,0,5,2),this._muzzle.add(this._muzzleLight);const D=this._mesh(new Ae(.19,.38,.14),n,this._hips);D.position.set(.35,-.1,.05),D.rotation.z=-.18}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this._listeners.get(t)?.delete(e)}_emit(t,e={}){const i={type:t,player:this,...e};this._listeners.get(t)?.forEach(s=>s(i));const n=this[`on${t[0].toUpperCase()}${t.slice(1)}`];return typeof n=="function"&&n(i),i}setHorse(t){return this.nearbyHorse=t,this}get horse(){return this._horse}update(t){if(t=Math.min(Math.max(t||0,0),.05),this._elapsed+=t,this.weaponCooldown=Math.max(0,this.weaponCooldown-t),this.invulnerabilityTimer=Math.max(0,this.invulnerabilityTimer-t),this._damageFlash=Math.max(0,this._damageFlash-t),this._muzzleTimer=Math.max(0,this._muzzleTimer-t),this._mountGrace=Math.max(0,this._mountGrace-t),this._muzzleFlash.visible=this._muzzleTimer>0,this._muzzleLight.intensity=this._muzzleTimer>0?3.2*(this._muzzleTimer/.055):0,this.isDead)return this.velocity.multiplyScalar(Math.exp(-8*t)),this._visual.rotation.z=be(this._visual.rotation.z,-1.35,4,t),this._updateCamera(t),{shot:null};this._updateLook(t),this.isAiming=this.input.buttonDown(2)||this.input.isDown("Aim"),this.isCrouching=!this.isMounted&&this.input.isDown("ControlLeft","ControlRight","KeyC"),this.input.wasPressed("KeyQ")&&(this._shoulderSide*=-1),this.isMounted?this._updateMounted(t):this._updateOnFoot(t),this.reloadTimer>0&&(this.reloadTimer-=t,this.reloadTimer<=0&&this._finishReload()),this.input.wasPressed("KeyR")&&!this.isReloading&&this.reload();let e=null;if((this.input.buttonPressed(0)||this.input.wasPressed("Fire"))&&(e=this.shoot()),this.input.wasPressed("KeyE")&&this._mountGrace<=0)if(this.isMounted)this.dismount();else{const s=this._findMountableHorse();s?this.mount(s):this._emit("interact")}return this._animate(t),this._updateCamera(t),{shot:e}}_updateLook(t){const e=this.input.consumeMouseDelta(),i=this.input.getLookAxis?.(wc)||wc.set(0,0),n=this.options.lookSensitivity??.0021;this._cameraYaw-=e.x*n,this._cameraPitch-=e.y*n,this._cameraYaw-=i.x*2.35*t,this._cameraPitch-=i.y*1.65*t,this._cameraPitch=Kt.clamp(this._cameraPitch,-.66,.47)}_updateOnFoot(t){const e=this.input.getMoveAxis?.(Sc)||Sc.set((this.input.isDown("KeyD")?1:0)-(this.input.isDown("KeyA")?1:0),(this.input.isDown("KeyW")?1:0)-(this.input.isDown("KeyS")?1:0)),i=e.lengthSq()>.01,n=i&&e.y>-.2&&this.input.isDown("ShiftLeft","ShiftRight")&&!this.isAiming&&!this.isCrouching;this.isSprinting=n&&this.stamina>2,this.stamina=Kt.clamp(this.stamina+(this.isSprinting?-19:12)*t,0,this.maxStamina);let s=this.walkSpeed;this.isSprinting&&(s=this.sprintSpeed),this.isAiming&&(s=this.aimSpeed),this.isCrouching&&(s=this.crouchSpeed);const a=_n.set(-Math.sin(this._cameraYaw),0,-Math.cos(this._cameraYaw)),o=Ia.set(Math.cos(this._cameraYaw),0,-Math.sin(this._cameraYaw)),l=yc.set(0,0,0).addScaledVector(a,e.y).addScaledVector(o,e.x);l.lengthSq()>1&&l.normalize(),l.multiplyScalar(s);const c=i?this.acceleration:18;this.velocity.x=be(this.velocity.x,l.x,c,t),this.velocity.z=be(this.velocity.z,l.z,c,t),this.grounded&&this.input.wasPressed("Space")&&!this.isAiming&&(this.verticalVelocity=5.2,this.grounded=!1,this._emit("jump")),this.verticalVelocity-=16.5*t,this._previousPosition.copy(this.position),this.position.x+=this.velocity.x*t,this.position.z+=this.velocity.z*t,this.position.y+=this.verticalVelocity*t,this._resolveWorldCollision(this._previousPosition);const u=this._getGroundHeight(this.position.x,this.position.z);if(this.position.y<=u&&(this.position.y=u,this.verticalVelocity=0,this.grounded=!0),i){const p=Math.atan2(l.x,l.z),g=this.isAiming?this._cameraYaw+Math.PI:p;this._modelHeading=this._lerpAngle(this._modelHeading,g,1-Math.exp(-12*t)),this.object.rotation.y=this._modelHeading}else this.isAiming&&(this._modelHeading=this._lerpAngle(this._modelHeading,this._cameraYaw+Math.PI,1-Math.exp(-14*t)),this.object.rotation.y=this._modelHeading);const h=this.position.distanceTo(this._previousPosition);this._footstepDistance+=h;const d=this.isSprinting?1.55:1.05;this.grounded&&h>0&&this._footstepDistance>d&&(this._footstepDistance=0,this._emit("footstep",{position:this.position.clone(),sprinting:this.isSprinting})),this.inCover=!!this.world.isNearCover?.(this.position,this.radius+.4),!this.inCover&&Array.isArray(this.world.cover)&&(this.inCover=this.world.cover.some(p=>{const g=p?.position;if(!g)return!1;const _=(p.radius??.8)+this.radius+.3;return Math.hypot(g.x-this.position.x,g.z-this.position.z)<=_}))}_updateMounted(t){if(!this._horse||this._horse.disposed){this.isMounted=!1,this._horse=null;return}this._horse.updateRidden?.(t,this.input,this._cameraYaw);const e=this._horse.getRiderPosition?.(_n)||this._horse.position;this.position.copy(e),this.object.rotation.y=this._horse.heading??this._horse.object?.rotation.y??this.object.rotation.y,this.velocity.copy(this._horse.velocity||Ia.set(0,0,0)),this.isSprinting=(this._horse.speed||0)>(this._horse.trotSpeed||5),this.stamina=Kt.clamp(this.stamina+12*t,0,this.maxStamina)}_resolveWorldCollision(t){const e=this.world.resolvePlayerCollision||this.world.resolveCharacterCollision||this.world.resolveCollision;if(typeof e=="function"){const s=e.call(this.world,this.position,this.radius,t,this);if(s?.isVector3?this.position.copy(s):s?.position?.isVector3&&this.position.copy(s.position),s?.normal?.isVector3){const a=this.velocity.dot(s.normal);a<0&&this.velocity.addScaledVector(s.normal,-a)}}const i=this.world.obstacles||this.world.collisionObjects;if(Array.isArray(i))for(const s of i){if(!s||s===this.object||s.enabled===!1)continue;const a=s.position||s.object?.position,o=s.collisionRadius??s.radius;if(!a||!Number.isFinite(o))continue;const l=this.position.x-a.x,c=this.position.z-a.z,u=this.radius+o,h=l*l+c*c;if(h<u*u&&h>1e-5){const d=Math.sqrt(h);this.position.x=a.x+l/d*u,this.position.z=a.z+c/d*u}}const n=this.world.bounds;n?.isBox2?(this.position.x=Kt.clamp(this.position.x,n.min.x+this.radius,n.max.x-this.radius),this.position.z=Kt.clamp(this.position.z,n.min.y+this.radius,n.max.y-this.radius)):n?.isBox3&&(this.position.x=Kt.clamp(this.position.x,n.min.x+this.radius,n.max.x-this.radius),this.position.z=Kt.clamp(this.position.z,n.min.z+this.radius,n.max.z-this.radius))}_getGroundHeight(t,e){const i=["getHeightAt","getTerrainHeight","heightAt","sampleHeight"];for(const n of i)if(typeof this.world[n]=="function"){const s=this.world[n](t,e);if(Number.isFinite(s))return s}return Number.isFinite(this.world.groundHeight)?this.world.groundHeight:0}_snapToGround(){this.position.y=this._getGroundHeight(this.position.x,this.position.z)}_animate(t){const e=Math.hypot(this.velocity.x,this.velocity.z),i=Kt.clamp(e/this.sprintSpeed,0,1),n=this._elapsed*(5.5+i*6.5),s=this.isMounted?1:0,a=this.grounded?Math.sin(n)*Math.min(.72,e*.1):0;this._legs[0].rotation.x=be(this._legs[0].rotation.x,s?-.72:a,13,t),this._legs[1].rotation.x=be(this._legs[1].rotation.x,s?-.72:-a,13,t),this._legs[0].rotation.z=be(this._legs[0].rotation.z,s?.32:0,10,t),this._legs[1].rotation.z=be(this._legs[1].rotation.z,s?-.32:0,10,t);const o=-.5+this._cameraPitch*.55;this.isAiming?(this._arms[1].rotation.x=be(this._arms[1].rotation.x,o,18,t),this._arms[1].rotation.z=be(this._arms[1].rotation.z,-.14,18,t),this._arms[0].rotation.x=be(this._arms[0].rotation.x,o+.08,18,t),this._arms[0].rotation.z=be(this._arms[0].rotation.z,.55,18,t),this._weapon.rotation.x=be(this._weapon.rotation.x,-Math.PI/2,18,t)):(this._arms[0].rotation.x=be(this._arms[0].rotation.x,-a*.55,11,t),this._arms[1].rotation.x=be(this._arms[1].rotation.x,a*.55,11,t),this._arms[0].rotation.z=be(this._arms[0].rotation.z,0,11,t),this._arms[1].rotation.z=be(this._arms[1].rotation.z,0,11,t),this._weapon.rotation.x=be(this._weapon.rotation.x,0,15,t));const l=this.isCrouching?-.43:0,c=this.grounded&&e>.2?Math.sin(n*2)*.025*i:0;this._hips.position.y=be(this._hips.position.y,1+l+c,14,t),this._torso.rotation.z=be(this._torso.rotation.z,-Math.sin(n)*.025*i,10,t),this._head.rotation.y=be(this._head.rotation.y,this.isAiming?this._shoulderSide*.08:0,10,t);for(let h=0;h<this._coatTails.length;h++)this._coatTails[h].rotation.x=-.08-i*.32+Math.sin(n+h*Math.PI)*i*.12;const u=this._damageFlash>0;this._visual.traverse(h=>{h.isMesh&&h.material?.emissive&&h!==this._muzzleFlash&&(h.material.emissive.setHex(u?5900291:0),h.material.emissiveIntensity=u?.65:0)})}_updateCamera(t,e=!1){const i=this.isAiming,n=this.isMounted?2:this.isCrouching?1.25:1.65,s=_n.copy(this.position).addScaledVector(j0,n),a=Ia.set(-Math.sin(this._cameraYaw)*Math.cos(this._cameraPitch),Math.sin(this._cameraPitch),-Math.cos(this._cameraYaw)*Math.cos(this._cameraPitch)),o=yc.set(Math.cos(this._cameraYaw),0,-Math.sin(this._cameraYaw)),l=i?2.7:this.isMounted?6.1:4.65,c=i?.78*this._shoulderSide:.35*this._shoulderSide,u=s.clone().addScaledVector(a,-l).addScaledVector(o,c);u.y+=i?.15:.5;const h=[...new Set([...Array.isArray(this.world.cameraColliders)?this.world.cameraColliders:[],...Array.isArray(this.world.colliders)?this.world.colliders:[]])],d=h.filter?.(_=>_?.isObject3D)||[];if(d.length){const _=u.clone().sub(s),m=_.length();this._cameraRaycaster.set(s,_.normalize()),this._cameraRaycaster.near=.15,this._cameraRaycaster.far=m;const f=this._cameraRaycaster.intersectObjects(d,!0)[0];f&&u.copy(s).addScaledVector(_,Math.max(.25,f.distance-.22))}if(Array.isArray(h)){const _=this._cameraSafeFraction(s,u,h);_<1&&u.lerpVectors(s,u,Math.max(.08,_-.045))}this._cameraShake>.001&&(u.x+=(Math.random()-.5)*this._cameraShake,u.y+=(Math.random()-.5)*this._cameraShake,this._cameraShake=Math.max(0,this._cameraShake-t*.95)),e?this.camera.position.copy(u):this.camera.position.lerp(u,1-Math.exp(-(i?18:10)*t));const p=i?30:8,g=s.clone().addScaledVector(a,p);if(this.camera.lookAt(g),this.camera.isPerspectiveCamera){const _=i?47:this.isSprinting?64:58,m=be(this.camera.fov,_,9,t);Math.abs(m-this.camera.fov)>.001&&(this.camera.fov=m,this.camera.updateProjectionMatrix())}}_cameraSafeFraction(t,e,i){const n=e.x-t.x,s=e.y-t.y,a=e.z-t.z,o=Math.hypot(n,s,a),l=Math.max(2,Math.ceil(o/.28)),c=(u,h,d,p,g,_)=>{const m=g-d,f=_-p,w=m*m+f*f||1,b=Kt.clamp(((u-d)*m+(h-p)*f)/w,0,1),M=u-(d+m*b),P=h-(p+f*b);return M*M+P*P};for(let u=1;u<=l;u++){const h=u/l,d=t.x+n*h,p=t.y+s*h,g=t.z+a*h;for(const _ of i){if(!_||_.isObject3D||_.disabled)continue;const m=this._colliderHeight(_);if(Number.isFinite(m)&&p>this._getGroundHeight(d,g)+m+.2)continue;let f=!1;if(_.shape==="box")f=d>=_.minX-.16&&d<=_.maxX+.16&&g>=_.minZ-.16&&g<=_.maxZ+.16;else if(_.shape==="circle"){const w=d-_.x,b=g-_.z,M=(_.radius||0)+.16;f=w*w+b*b<=M*M}else if(_.shape==="segment"){const w=(_.padding||.08)+.13;f=c(d,g,_.ax,_.az,_.bx,_.bz)<=w*w}if(f)return Math.max(0,(u-1)/l)}}return 1}_colliderHeight(t){return Number.isFinite(t.height)?t.height:{fence:1.5,barrel:1.45,crate:1.3,trough:1.15,wagon:2.65,rock:.8+(t.radius||.4)*1.35,cactus:4.8,tree:7.5}[t.type]??1/0}shoot(){if(this.isDead||this.isReloading||this.weaponCooldown>0)return null;if(this.ammo<=0)return this.weaponCooldown=.18,this._emit("empty"),this.reserveAmmo>0&&this.reload(),null;this.object.updateMatrixWorld(!0),this.camera.updateMatrixWorld(!0);const t=this.camera.getWorldPosition(new T),e=this.camera.getWorldDirection(new T),i=this.isAiming?.0035:.026;e.addScaledVector(_n.set(Math.random()-.5,Math.random()-.5,Math.random()-.5),i).normalize();const n=this._muzzle.getWorldPosition(new T);this._shotRaycaster.set(t,e),this._shotRaycaster.near=0,this._shotRaycaster.far=this.options.weaponRange??180;const a={ray:new zi(t.clone(),e.clone(),0,this._shotRaycaster.far),origin:t,direction:e,muzzle:n,damage:this.damage,player:this};return this.ammo-=1,this.weaponCooldown=this.fireInterval,this._muzzleTimer=.055,this._cameraPitch=Kt.clamp(this._cameraPitch+(this.isAiming?.018:.035),-.66,.47),this._cameraShake=Math.max(this._cameraShake,this.isAiming?.035:.07),this.lastShot=a,this._emit("shoot",a),a}reload(){return this.isDead||this.isReloading||this.ammo>=this.maxAmmo||this.reserveAmmo<=0?!1:(this.isReloading=!0,this.reloadTimer=this.reloadDuration,this._emit("reloadStart",{duration:this.reloadDuration}),!0)}_finishReload(){if(!this.isReloading)return;const t=Math.min(this.maxAmmo-this.ammo,this.reserveAmmo);this.ammo+=t,this.reserveAmmo-=t,this.reloadTimer=0,this.isReloading=!1,this._emit("reload",{amount:t})}cancelReload(){const t=this.isReloading;return this.isReloading=!1,this.reloadTimer=0,t}takeDamage(t,e=null){if(this.isDead||this.invulnerabilityTimer>0||t<=0)return!1;const i=this.health;return this.health=Math.max(0,this.health-t),this.invulnerabilityTimer=.1,this._damageFlash=.13,this._cameraShake=Math.max(this._cameraShake,.12),this._emit("damage",{amount:i-this.health,source:e,health:this.health}),this.health<=0&&(this.isDead=!0,this.cancelReload(),this.isMounted&&this.dismount(!0),this._emit("death",{source:e})),!0}heal(t){if(this.isDead||t<=0)return 0;const e=this.health;this.health=Math.min(this.maxHealth,this.health+t);const i=this.health-e;return i&&this._emit("heal",{amount:i,health:this.health}),i}refillAmmo(t=this.maxAmmo){this.reserveAmmo+=Math.max(0,Math.floor(t)),this._emit("ammo",{amount:t})}mount(t){if(this.isDead||this.isMounted||!t||t.rider||typeof t.canMount=="function"&&!t.canMount(this.position))return!1;this._horse=t,this.isMounted=!0,this.cancelReload(),t.setRider?.(this);const e=t.getRiderPosition?.(_n)||t.position;return e&&this.position.copy(e),this._mountGrace=.4,this._emit("mount",{horse:t}),!0}dismount(t=!1){if(!this.isMounted||!this._horse)return!1;const e=this._horse,i=e.getDismountPosition?.(this._shoulderSide,_n);return e.setRider?.(null),this.isMounted=!1,this._horse=null,i?this.position.copy(i):e.position&&this.position.copy(e.position).add(_n.set(this._shoulderSide*1.25,0,0)),this._snapToGround(),this.velocity.set(0,0,0),this._mountGrace=.45,this._emit("dismount",{horse:e,forced:t}),!0}_findMountableHorse(){const t=[this.nearbyHorse,this.world.horse,...this.world.horses||[]].filter(Boolean);let e=null,i=1/0;for(const n of t){const s=n.position||n.object?.position;if(!s||n.rider)continue;const a=s.distanceTo(this.position);a<i&&(n.canMount?.(this.position)??a<2.6)&&(e=n,i=a)}return e}respawn(t=this.world.playerSpawn||new T(0,0,4)){this.isMounted&&this.dismount(!0),this.cancelReload(),this.position.copy(t),this._snapToGround(),this.velocity.set(0,0,0),this.verticalVelocity=0,this.weaponCooldown=0,this.lastShot=null,this.isAiming=!1,this.isCrouching=!1,this.isSprinting=!1,this.inCover=!1,this.grounded=!0,this.invulnerabilityTimer=0,this._damageFlash=0,this._cameraShake=0,this._muzzleTimer=0,this._mountGrace=0,this._cameraPitch=this.options.cameraPitch??-.12,this._muzzleFlash.visible=!1,this._muzzleLight.intensity=0,this._footstepDistance=0,this.health=this.maxHealth,this.stamina=this.maxStamina,this.isDead=!1,this._visual.rotation.set(0,0,0),this._emit("respawn")}_lerpAngle(t,e,i){const n=Math.atan2(Math.sin(e-t),Math.cos(e-t));return t+n*i}dispose(){this.isMounted&&this.dismount(!0),this.scene.remove(this.object),this._geometries.forEach(t=>t.dispose()),this._materials.forEach(t=>t.dispose()),this._listeners.clear()}}const bc=new ht,$0=new T,Z0=new T;function vn(r,t,e,i){return Kt.lerp(r,t,1-Math.exp(-e*i))}function Te(r,t,e,i){const n=new qt(r,t);return n.castShadow=!0,n.receiveShadow=!0,e.add(n),i.geometries.push(r),n}class J0{constructor(t,e={},i={}){this.scene=t,this.world=e||{},this.options=i,this.object=new yt,this.object.name=i.name||"Horse",this.position=this.object.position,this.position.copy(i.position||this.world.horseSpawn||new T(4,0,4)),this.heading=i.heading??0,this.object.rotation.y=this.heading,this.scene.add(this.object),this.velocity=new T,this.speed=0,this.walkSpeed=i.walkSpeed??3.3,this.trotSpeed=i.trotSpeed??6.2,this.gallopSpeed=i.gallopSpeed??10.6,this.reverseSpeed=i.reverseSpeed??2.2,this.acceleration=i.acceleration??5.2,this.turnSpeed=i.turnSpeed??1.75,this.radius=i.radius??.72,this.mountRadius=i.mountRadius??2.65,this.maxStamina=i.maxStamina??100,this.stamina=this.maxStamina,this.maxHealth=i.maxHealth??160,this.health=this.maxHealth,this.rider=null,this.disposed=!1,this._resources={geometries:[],materials:[]},this._listeners=new Map,this._elapsed=Math.random()*10,this._idleTimer=3+Math.random()*5,this._idleAction=0,this._jumpVelocity=0,this._grounded=!0,this._previous=this.position.clone(),this._hoofDistance=0,this._dustCursor=0,this._buildModel(),this._buildDust(),this._snapToGround()}_material(t){const e=new We(t);return this._resources.materials.push(e),e}_buildModel(){const t=this._material({color:this.options.color??6503207,roughness:.88}),e=this._material({color:3285016,roughness:.96}),i=this._material({color:1314315,roughness:1}),n=this._material({color:4335129,roughness:.78}),s=this._material({color:2168338,roughness:.82}),a=this._material({color:7154469,roughness:.95}),o=this._material({color:11701333,metalness:.72,roughness:.32}),l=this._material({color:328450,roughness:.2});this._visual=new yt,this.object.add(this._visual),this._body=new yt,this._body.position.y=1.22,this._visual.add(this._body);const c=Te(new fe(.72,20,14),t,this._body,this._resources);c.scale.set(.86,.78,1.5),c.rotation.x=.025;const u=Te(new fe(.58,18,12),t,this._body,this._resources);u.position.z=.63,u.scale.set(.92,1.05,.83);const h=Te(new fe(.63,18,12),t,this._body,this._resources);h.position.z=-.62,h.scale.set(.96,.95,.9),this._neck=new yt,this._neck.position.set(0,.27,.67),this._neck.rotation.x=-.47,this._body.add(this._neck);const d=Te(new Bi(.3,.86,6,12),t,this._neck,this._resources);d.position.y=.53,d.scale.set(.93,1,1.08);for(let E=0;E<7;E++){const A=Te(new bi(.17-E*.008,.34,6),i,this._neck,this._resources);A.position.set(0,.17+E*.13,-.28),A.rotation.x=Math.PI/2,A.rotation.z=E%2?.12:-.12}this._head=new yt,this._head.position.set(0,1.05,.03),this._neck.add(this._head);const p=Te(new fe(.3,16,12),t,this._head,this._resources);p.scale.set(.8,1.05,1.18),p.rotation.x=-.12;const g=Te(new fe(.245,14,10),e,this._head,this._resources);g.position.set(0,-.18,.34),g.scale.set(.88,.72,1.15);for(const E of[-1,1]){const A=Te(new bi(.075,.34,7),t,this._head,this._resources);A.position.set(E*.15,.31,-.03),A.rotation.z=E*-.12,Te(new fe(.035,8,6),l,this._head,this._resources).position.set(E*.225,.08,.16),Te(new fe(.025,8,6),l,this._head,this._resources).position.set(E*.1,-.2,.55)}const _=Te(new vi(.225,.025,7,18),s,this._head,this._resources);_.position.set(0,-.16,.35),_.rotation.x=Math.PI/2;const m=Te(new vi(.275,.022,7,18,Math.PI),s,this._head,this._resources);m.position.set(0,.14,.01),m.rotation.z=Math.PI,this._tail=new yt,this._tail.position.set(0,.28,-1.04),this._body.add(this._tail);for(let E=0;E<5;E++){const A=Te(new Bi(.09-E*.01,.3,4,7),i,this._tail,this._resources);A.position.set((E-2)*.035,-.13-E*.12,-E*.05),A.rotation.x=-.25-E*.08}this._legs=[];const f=[[-.39,.43],[.39,.43],[-.39,-.55],[.39,-.55]];for(let E=0;E<f.length;E++){const[A,D]=f[E],y=new yt;y.position.set(A,-.26,D),this._body.add(y);const x=Te(new Bi(.115,.52,5,8),t,y,this._resources);x.position.y=-.31;const R=new yt;R.position.y=-.63,y.add(R);const B=Te(new Bi(.072,.5,5,8),e,R,this._resources);B.position.y=-.29;const F=Te(new Ae(.18,.14,.25),i,R,this._resources);F.position.set(0,-.61,.035),F.rotation.x=.1,this._legs.push({upper:y,lower:R,hoof:F,phase:E<2?E*Math.PI:(E-2)*Math.PI+Math.PI*.58})}const w=Te(new Ae(1.03,.09,1.18),a,this._body,this._resources);w.position.set(0,.64,-.1),w.rotation.x=.04;const b=Te(new Bi(.43,.5,5,12),n,this._body,this._resources);b.rotation.x=Math.PI/2,b.position.set(0,.75,-.12),b.scale.set(1,.5,1);const M=Te(new Vt(.045,.07,.28,9),s,this._body,this._resources);M.position.set(0,.96,.2),M.rotation.x=-.25;const P=Te(new vi(.37,.07,8,16,Math.PI),n,this._body,this._resources);P.position.set(0,.87,-.48),P.rotation.z=Math.PI;for(const E of[-1,1]){const A=Te(new vi(.13,.025,6,12),o,this._body,this._resources);A.position.set(E*.59,.1,-.07),A.rotation.y=Math.PI/2}}_buildDust(){const e=new Float32Array(108),i=new Float32Array(108);for(let a=0;a<36;a++)e[a*3+1]=-999,i.set([.53,.34,.2],a*3);const n=new se;n.setAttribute("position",new ke(e,3)),n.setAttribute("color",new ke(i,3));const s=new qs({size:.28,transparent:!0,opacity:.42,vertexColors:!0,depthWrite:!1,sizeAttenuation:!0});this._resources.geometries.push(n),this._resources.materials.push(s),this._dust=new jr(n,s),this._dust.frustumCulled=!1,this.scene.add(this._dust),this._dustLife=new Float32Array(36),this._dustVelocity=Array.from({length:36},()=>new T)}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>this._listeners.get(t)?.delete(e)}_emit(t,e={}){const i={type:t,horse:this,...e};this._listeners.get(t)?.forEach(s=>s(i));const n=this[`on${t[0].toUpperCase()}${t.slice(1)}`];typeof n=="function"&&n(i)}update(t){if(!(this.disposed||this.rider)){if(t=Math.min(Math.max(t||0,0),.05),this._elapsed+=t,this.speed=vn(this.speed,0,4,t),this.velocity.set(0,0,0),!this._grounded){this._jumpVelocity-=18*t,this.position.y+=this._jumpVelocity*t;const e=this._getGroundHeight(this.position.x,this.position.z);if(this.position.y<=e){const i=-this._jumpVelocity;this.position.y=e,this._jumpVelocity=0,this._grounded=!0,i>5&&this._emit("land",{force:i})}}this._idleTimer-=t,this._idleTimer<=0&&(this._idleTimer=2.5+Math.random()*5,this._idleAction=Math.random()),this._animate(t,0,this._idleAction),this._updateDust(t)}}updateRidden(t,e,i){if(this.disposed||this.health<=0)return;t=Math.min(Math.max(t||0,0),.05),this._elapsed+=t;const n=e.getMoveAxis?.(bc)||bc.set((e.isDown("KeyD")?1:0)-(e.isDown("KeyA")?1:0),(e.isDown("KeyW")?1:0)-(e.isDown("KeyS")?1:0)),s=n.y,a=s>.1&&e.isDown("ShiftLeft","ShiftRight")&&this.stamina>1,o=a?this.gallopSpeed:Math.abs(s)>.72?this.trotSpeed:this.walkSpeed,l=s>=0?o*s:this.reverseSpeed*s;this.speed=vn(this.speed,l,s?this.acceleration:3.8,t),this.stamina=Kt.clamp(this.stamina+(a?-14:9)*t,0,this.maxStamina);const c=i+Math.PI;let u=n.x;if(s>.05&&Math.abs(n.x)>.04){const _=c+n.x*.62,m=Math.atan2(Math.sin(_-this.heading),Math.cos(_-this.heading));u=Kt.clamp(m*1.6,-1,1)}const h=Kt.clamp(Math.abs(this.speed)/this.gallopSpeed,0,1);this.heading+=u*this.turnSpeed*(.45+h*.75)*t*(this.speed<-.1?-1:1),this.object.rotation.y=this.heading,this._grounded&&e.wasPressed("Space")&&Math.abs(this.speed)>2&&(this._jumpVelocity=6.2,this._grounded=!1,this._emit("jump")),this._jumpVelocity-=18*t,this._previous.copy(this.position);const d=$0.set(Math.sin(this.heading),0,Math.cos(this.heading));this.velocity.copy(d).multiplyScalar(this.speed),this.position.addScaledVector(this.velocity,t),this.position.y+=this._jumpVelocity*t,this._resolveCollision(this._previous);const p=this._getGroundHeight(this.position.x,this.position.z);this.position.y<=p&&(!this._grounded&&this._jumpVelocity<-5&&this._emit("land",{force:-this._jumpVelocity}),this.position.y=p,this._jumpVelocity=0,this._grounded=!0),this._hoofDistance+=this.position.distanceTo(this._previous);const g=h>.62?1.9:1.25;this._grounded&&this._hoofDistance>g&&(this._hoofDistance=0,this._emit("hoofbeat",{position:this.position.clone(),speed:Math.abs(this.speed)}),h>.38&&this._spawnDust()),this._animate(t,h,0),this._updateDust(t)}_animate(t,e,i){const n=3.5+e*10,s=this._elapsed*n,a=e>.62?.82:.48;for(let c=0;c<this._legs.length;c++){const u=this._legs[c],h=Math.sin(s+u.phase),d=h*a*(e>.02?1:0),p=Math.max(0,-h)*.85*e;u.upper.rotation.x=vn(u.upper.rotation.x,d,14,t),u.lower.rotation.x=vn(u.lower.rotation.x,p,15,t)}const o=Math.abs(Math.sin(s))*.07*e;this._body.position.y=vn(this._body.position.y,1.22+o,14,t),this._body.rotation.z=vn(this._body.rotation.z,-Math.sin(s*.5)*e*.035,10,t),this._tail.rotation.y=Math.sin(this._elapsed*2.1)*(.14+e*.28),this._tail.rotation.x=-e*.22;const l=!this.rider&&i>.72?.72:0;this._neck.rotation.x=vn(this._neck.rotation.x,-.47+l,2.4,t),this._head.rotation.z=Math.sin(this._elapsed*1.4)*.025}_spawnDust(){const t=this._dust.geometry.attributes.position.array;for(let e=0;e<3;e++){const i=this._dustCursor++%this._dustLife.length,n=Z0.set((Math.random()-.5)*.8,.08,-.55-Math.random()*.4);this.object.localToWorld(n),t[i*3]=n.x,t[i*3+1]=n.y,t[i*3+2]=n.z,this._dustLife[i]=.6+Math.random()*.5,this._dustVelocity[i].set((Math.random()-.5)*.45,.28+Math.random()*.25,(Math.random()-.5)*.45)}this._dust.geometry.attributes.position.needsUpdate=!0}_updateDust(t){const e=this._dust.geometry.attributes.position.array;let i=!1;for(let n=0;n<this._dustLife.length;n++){if(this._dustLife[n]<=0)continue;this._dustLife[n]-=t;const s=this._dustVelocity[n];e[n*3]+=s.x*t,e[n*3+1]+=s.y*t,e[n*3+2]+=s.z*t,s.multiplyScalar(Math.exp(-1.8*t)),this._dustLife[n]<=0&&(e[n*3+1]=-999),i=!0}i&&(this._dust.geometry.attributes.position.needsUpdate=!0)}_getGroundHeight(t,e){for(const i of["getHeightAt","getTerrainHeight","heightAt","sampleHeight"])if(typeof this.world[i]=="function"){const n=this.world[i](t,e);if(Number.isFinite(n))return n}return Number.isFinite(this.world.groundHeight)?this.world.groundHeight:0}_snapToGround(){this.position.y=this._getGroundHeight(this.position.x,this.position.z)}_resolveCollision(t){const e=this.world.resolveHorseCollision||this.world.resolvePlayerCollision||this.world.resolveCollision;if(typeof e=="function"){const n=e.call(this.world,this.position,this.radius,t,this);n?.isVector3?this.position.copy(n):n?.position?.isVector3&&this.position.copy(n.position),n?.blocked&&(this.speed*=.25)}const i=this.world.bounds;i?.isBox2?(this.position.x=Kt.clamp(this.position.x,i.min.x+this.radius,i.max.x-this.radius),this.position.z=Kt.clamp(this.position.z,i.min.y+this.radius,i.max.y-this.radius)):i?.isBox3&&(this.position.x=Kt.clamp(this.position.x,i.min.x+this.radius,i.max.x-this.radius),this.position.z=Kt.clamp(this.position.z,i.min.z+this.radius,i.max.z-this.radius))}setRider(t){return t&&this.rider&&this.rider!==t?!1:(this.rider=t||null,this._emit(this.rider?"mounted":"dismounted",{rider:t}),!0)}canMount(t){if(this.disposed||this.rider||this.health<=0||!t)return!1;const e=t.x-this.position.x,i=t.z-this.position.z;return e*e+i*i<=this.mountRadius*this.mountRadius}getRiderPosition(t=new T){return t.set(0,.82,-.12),this.object.localToWorld(t)}getDismountPosition(t=1,e=new T){return e.set((t>=0?1:-1)*1.45,0,-.1),this.object.localToWorld(e),e.y=this._getGroundHeight(e.x,e.z),e}resetTransientState({snapToGround:t=!0}={}){return this.speed=0,this.velocity.set(0,0,0),this._jumpVelocity=0,this._grounded=!0,this._hoofDistance=0,t&&this._snapToGround(),this}takeDamage(t,e=null){return this.health<=0||t<=0?!1:(this.health=Math.max(0,this.health-t),this._emit("damage",{amount:t,source:e,health:this.health}),this.health===0&&(this.speed=0,this._emit("death",{source:e}),this.rider?.dismount&&this.rider.dismount(!0)),!0)}dispose(){this.disposed||(this.rider?.dismount&&this.rider.dismount(!0),this.disposed=!0,this.scene.remove(this.object),this.scene.remove(this._dust),this._resources.geometries.forEach(t=>t.dispose()),this._resources.materials.forEach(t=>t.dispose()),this._listeners.clear())}}const Ts=new T(0,1,0),Tc=new T,Ua=new T,Es=new T,Tr=new zi;function Oe(r,t,e,i){return Kt.lerp(r,t,1-Math.exp(-e*i))}function Ec(r,t,e){const i=Math.atan2(Math.sin(t-r),Math.cos(t-r));return r+i*e}function Ge(r,t,e,i,n=null){const s=new qt(r,t);return s.castShadow=!0,s.receiveShadow=!0,n&&(s.userData.enemy=i,s.userData.hitZone=n,i.hitMeshes.push(s)),e.add(s),i.resources.geometries.push(r),s}class Q0{constructor(t,e,i={}){this.manager=t,this.world=t.world,this.id=i.id||`outlaw-${t._nextId++}`,this.maxHealth=i.health??100,this.health=this.maxHealth,this.damage=i.damage??8+Math.random()*5,this.moveSpeed=i.moveSpeed??2.7+Math.random()*.65,this.preferredDistance=i.preferredDistance??11+Math.random()*5,this.aggroRange=i.aggroRange??32,this.accuracy=i.accuracy??.56+Math.random()*.16,this.state="patrol",this.alive=!0,this.alerted=!1,this.velocity=new T,this.heading=Math.random()*Math.PI*2,this.radius=.43,this.spawnPosition=e.clone(),this.patrolTarget=e.clone(),this.coverTarget=null,this.lastKnownPlayerPosition=null,this.shootCooldown=.8+Math.random()*1.4,this.aimWindup=0,this.hitFlash=0,this.stagger=0,this.deathTime=0,this.deathSide=Math.random()<.5?-1:1,this.removeAfter=i.removeAfter??8,this._elapsed=Math.random()*20,this._repathTimer=Math.random(),this._strafeDirection=Math.random()<.5?-1:1,this._footstepDistance=0,this._disposed=!1,this.object=new yt,this.object.name=this.id,this.position=this.object.position,this.position.copy(e),this.object.rotation.y=this.heading,this.resources={geometries:[],materials:[]},this.hitMeshes=[],this._buildModel(i),this.manager.scene.add(this.object),this._snapToGround()}_material(t){const e=new We(t);return this.resources.materials.push(e),e}_buildModel(t){const e=t.palette||[4541517,6897711,5464142,5261406],i=[8540730,10184775,7226162,11631445],n=this._material({color:e[Math.floor(Math.random()*e.length)],roughness:.96}),s=this._material({color:new _t(n.color).multiplyScalar(.72),roughness:.92}),a=this._material({color:i[Math.floor(Math.random()*i.length)],roughness:.9}),o=this._material({color:3488576,roughness:1}),l=this._material({color:3679514,roughness:.8}),c=this._material({color:5789787,metalness:.8,roughness:.28}),u=this._material({color:Math.random()<.5?2366230:4865324,roughness:1});this._flashMaterials=[n,s,a,o],this.visual=new yt,this.object.add(this.visual),this.hips=new yt,this.hips.position.y=1,this.visual.add(this.hips);const h=Ge(new Ae(.5,.3,.3),o,this.hips,this,"torso");h.position.y=-.02,this.torso=new yt,this.torso.position.y=.22,this.hips.add(this.torso);const d=Ge(new Bi(.32,.62,5,9),n,this.torso,this,"torso");d.position.y=.49,d.scale.set(1.02,1,.76),Ge(new Ae(.58,.62,.065),s,this.torso,this,"torso").position.set(0,.5,.255);const g=Ge(new Vt(.3,.3,.1,10),l,this.hips,this,"torso");g.position.y=.14,this.head=new yt,this.head.position.y=1.11,this.torso.add(this.head),Ge(new fe(.225,14,10),a,this.head,this,"head").scale.set(.87,1.1,.9);const m=Ge(new fe(.195,12,7,0,Math.PI*2,Math.PI*.48,Math.PI*.5),u,this.head,this,"head");m.position.y=-.07,m.scale.set(.84,.8,.88);const f=Ge(new Vt(.39,.39,.035,18),u,this.head,this,null);f.position.y=.23,f.rotation.z=(Math.random()-.5)*.12;const w=Ge(new Vt(.21,.26,.27,13),u,this.head,this,null);w.position.y=.36,this.legs=[];for(const E of[-1,1]){const A=new yt;A.position.set(E*.17,-.05,0),this.hips.add(A);const D=Ge(new Vt(.125,.105,.63,8),o,A,this,"limb");D.position.y=-.31;const y=Ge(new Vt(.1,.115,.57,8),l,A,this,"limb");y.position.y=-.87,Ge(new Ae(.2,.15,.36),l,A,this,"limb").position.set(0,-1.15,-.07),this.legs.push(A)}this.arms=[];for(const E of[-1,1]){const A=new yt;A.position.set(E*.4,.8,0),this.torso.add(A);const D=Ge(new Vt(.105,.085,.66,8),s,A,this,"limb");D.position.y=-.31;const y=Ge(new fe(.1,9,7),a,A,this,"limb");y.position.y=-.67,this.arms.push(A)}this.weapon=new yt,this.weapon.position.set(0,-.72,-.04),this.arms[1].add(this.weapon);const b=Ge(new Vt(.035,.035,.34,8),c,this.weapon,this,null);b.rotation.x=Math.PI/2,b.position.z=-.15;const M=Ge(new Vt(.065,.065,.13,9),c,this.weapon,this,null);M.rotation.z=Math.PI/2,Ge(new Ae(.08,.2,.09),l,this.weapon,this,null).position.set(0,-.1,.08),this.muzzle=new oe,this.muzzle.position.set(0,0,-.34),this.weapon.add(this.muzzle),this.shadow=new qt(new Hs(.52,16),this._material({color:0,transparent:!0,opacity:.2,depthWrite:!1})),this.resources.geometries.push(this.shadow.geometry),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.y=.012,this.object.add(this.shadow)}update(t,e){if(this._elapsed+=t,this.hitFlash=Math.max(0,this.hitFlash-t),this.stagger=Math.max(0,this.stagger-t),this.shootCooldown=Math.max(0,this.shootCooldown-t),!this.alive){this._updateDeath(t);return}const i=Tc.copy(e.position).sub(this.position);i.y=0;const n=i.length(),s=n<this.aggroRange&&this.manager._hasLineOfSight(this,e);if(s&&(this.lastKnownPlayerPosition=e.position.clone(),this.alerted||this.alert(e.position)),this.stagger>0){this.velocity.multiplyScalar(Math.exp(-10*t)),this._move(t,Ua.set(0,0,0)),this._animate(t,!1,!1),this._updateFlash();return}let a=Ua.set(0,0,0),o=!1;if(this.alerted?(this.state=this.coverTarget?"cover":"combat",o=this._updateCombat(t,e,n,s,a)):(this.state="patrol",this._updatePatrol(t,a)),this._applySeparation(a),this._move(t,a),o){const l=Es.copy(e.position).sub(this.position).setY(0);if(l.lengthSq()>.001){const c=Math.atan2(l.x,l.z);this.heading=Ec(this.heading,c,1-Math.exp(-13*t)),this.object.rotation.y=this.heading}}this._animate(t,o,a.lengthSq()>.02),this._updateFlash()}_updatePatrol(t,e){this._repathTimer-=t;const i=Es.copy(this.patrolTarget).sub(this.position).setY(0).length();if(this._repathTimer<=0||i<.7){this._repathTimer=3+Math.random()*4;const n=Math.random()*Math.PI*2,s=1.5+Math.random()*4.5;this.patrolTarget.copy(this.spawnPosition).add(Es.set(Math.cos(n)*s,0,Math.sin(n)*s)),this.patrolTarget.y=this.manager._groundHeight(this.patrolTarget.x,this.patrolTarget.z)}e.copy(this.patrolTarget).sub(this.position).setY(0),e.lengthSq()>.2&&e.normalize().multiplyScalar(this.moveSpeed*.42)}_updateCombat(t,e,i,n,s){if(this._repathTimer-=t,this.health<this.maxHealth*.42&&!this.coverTarget&&this._repathTimer<=0&&(this.coverTarget=this.manager._findCover(this,e.position),this._repathTimer=2+Math.random()),this.coverTarget){if(s.copy(this.coverTarget).sub(this.position).setY(0),s.lengthSq()>.5)return s.normalize().multiplyScalar(this.moveSpeed*1.15),!1;this.coverTarget=null,this.shootCooldown=Math.min(this.shootCooldown,.5)}const a=n?e.position:this.lastKnownPlayerPosition;if(!a)return!1;const o=Es.copy(a).sub(this.position).setY(0),l=o.length();if(l>.001&&o.divideScalar(l),!n||l>this.preferredDistance+4)s.copy(o).multiplyScalar(this.moveSpeed);else if(l<6.5)s.copy(o).multiplyScalar(-this.moveSpeed*.78);else{const c=Ua.set(o.z,0,-o.x).multiplyScalar(this._strafeDirection);s.copy(c).multiplyScalar(this.moveSpeed*.38),Math.random()<t*.32&&(this._strafeDirection*=-1)}return n&&this.shootCooldown<=0?(this.aimWindup<=0&&(this.aimWindup=.26+Math.random()*.34),this.aimWindup-=t,this.aimWindup<=0&&(this.manager._enemyShoot(this,e),this.shootCooldown=.95+Math.random()*1.25,this.health<this.maxHealth*.4&&(this.shootCooldown*=1.25)),!0):(n||(this.aimWindup=0),n&&this.shootCooldown<.65)}_applySeparation(t){for(const i of this.manager.enemies){if(i===this||!i.alive)continue;const n=Es.copy(this.position).sub(i.position).setY(0),s=n.lengthSq();s>1e-4&&s<2.2&&t.addScaledVector(n.normalize(),(2.2-s)*.75)}const e=t.length();e>this.moveSpeed*1.2&&t.multiplyScalar(this.moveSpeed*1.2/e)}_move(t,e){const i=e.lengthSq()>.01?7.5:11;this.velocity.x=Oe(this.velocity.x,e.x,i,t),this.velocity.z=Oe(this.velocity.z,e.z,i,t);const n=Tc.copy(this.position);if(this.position.addScaledVector(this.velocity,t),this.manager._resolveEnemyCollision(this,n),this.position.y=this.manager._groundHeight(this.position.x,this.position.z),Math.hypot(this.velocity.x,this.velocity.z)>.08){const a=Math.atan2(this.velocity.x,this.velocity.z);this.heading=Ec(this.heading,a,1-Math.exp(-10*t)),this.object.rotation.y=this.heading,this._footstepDistance+=this.position.distanceTo(n),this._footstepDistance>1.1&&(this._footstepDistance=0,this.manager._emit("enemyFootstep",{enemy:this,position:this.position.clone()}))}}_animate(t,e,i){const n=Math.hypot(this.velocity.x,this.velocity.z),s=this._elapsed*(5.5+n*1.4),a=i?Math.sin(s)*Math.min(.6,n*.15):0;this.legs[0].rotation.x=Oe(this.legs[0].rotation.x,a,12,t),this.legs[1].rotation.x=Oe(this.legs[1].rotation.x,-a,12,t),e?(this.arms[0].rotation.x=Oe(this.arms[0].rotation.x,-.43,14,t),this.arms[1].rotation.x=Oe(this.arms[1].rotation.x,-.5,14,t),this.arms[0].rotation.z=Oe(this.arms[0].rotation.z,.52,14,t),this.arms[1].rotation.z=Oe(this.arms[1].rotation.z,-.12,14,t),this.weapon.rotation.x=Oe(this.weapon.rotation.x,-Math.PI/2,16,t)):(this.arms[0].rotation.x=Oe(this.arms[0].rotation.x,-a*.45,10,t),this.arms[1].rotation.x=Oe(this.arms[1].rotation.x,a*.45,10,t),this.arms[0].rotation.z=Oe(this.arms[0].rotation.z,0,10,t),this.arms[1].rotation.z=Oe(this.arms[1].rotation.z,0,10,t),this.weapon.rotation.x=Oe(this.weapon.rotation.x,0,12,t)),this.hips.position.y=1+Math.abs(Math.sin(s))*(i?.018:0)}_updateFlash(){const t=this.hitFlash>0;for(const e of this._flashMaterials)e.emissive.setHex(t?9179912:0),e.emissiveIntensity=t?1.2:0}alert(t=null){if(!this.alive)return;const e=!this.alerted;this.alerted=!0,t&&(this.lastKnownPlayerPosition=t.clone()),this.shootCooldown=Math.max(this.shootCooldown,.35+Math.random()*.55),e&&this.manager._emit("enemyAlerted",{enemy:this})}takeDamage(t,e="torso",i=null,n=null){if(!this.alive||t<=0)return null;const s={head:2.35,torso:1,limb:.62},a=Math.min(this.health,t*(s[e]??1));this.health=Math.max(0,this.health-a),this.hitFlash=.1,this.stagger=e==="head"?.2:.09,this.alert(n?.position||i||null);const o=this.health<=0;return o&&this.die(n,e),{enemy:this,damage:a,hitZone:e,point:i,killed:o,health:this.health}}die(t=null,e="torso"){if(this.alive){this.alive=!1,this.state="dead",this.velocity.set(0,0,0),this.deathTime=0,this.deathSide=e==="head"?-this.deathSide:this.deathSide;for(const i of this.hitMeshes)i.userData.enemy=null;this.manager._onEnemyKilled(this,t,e)}}_updateDeath(t){this.deathTime+=t;const e=this.deathSide*1.48;if(this.visual.rotation.z=Oe(this.visual.rotation.z,e,5.3,t),this.visual.rotation.x=Oe(this.visual.rotation.x,.14,4,t),this.visual.position.y=Oe(this.visual.position.y,.1,3.5,t),this.deathTime>this.removeAfter-1.5){const i=Kt.clamp((this.removeAfter-this.deathTime)/1.5,0,1);for(const n of this.resources.materials)n.transparent=!0,n.opacity=i}}_snapToGround(){this.position.y=this.manager._groundHeight(this.position.x,this.position.z)}dispose(){this._disposed||(this._disposed=!0,this.manager.scene.remove(this.object),this.resources.geometries.forEach(t=>t.dispose()),this.resources.materials.forEach(t=>t.dispose()))}}class tg{constructor(t,e={},i={}){this.scene=t,this.world=e||{},this.options=i,this.enemies=[],this.spawnPoints=this._normalizeSpawnPoints(i.spawnPoints||this.world.enemySpawnPoints||this.world.enemySpawns||[[-12,0,-13],[11,0,-17],[-18,0,3],[17,0,5],[-8,0,18],[13,0,19],[1,0,-25],[-24,0,-10]]),this._listeners=new Map,this._eventQueue=[],this._effects=[],this._nextId=1,this._wave=0,this._waveActive=!1,this._clearedEmitted=!1,this.totalKilled=0,this._disposed=!1,(i.autoSpawn??!0)&&this.spawnWave(i.initialCount??Math.min(6,this.spawnPoints.length))}_normalizeSpawnPoints(t){return t.map(e=>e?.isVector3?e.clone():Array.isArray(e)?new T(e[0]||0,e[1]||0,e[2]||0):e?.position?.isVector3?e.position.clone():new T(e?.x||0,e?.y||0,e?.z||0))}get alive(){let t=0;for(const e of this.enemies)e.alive&&t++;return t}get remaining(){return this.alive}get wave(){return this._wave}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this._listeners.get(t)?.delete(e)}_emit(t,e={}){const i={type:t,manager:this,...e};this._eventQueue.push(i),this._listeners.get(t)?.forEach(s=>s(i));const n=this[`on${t[0].toUpperCase()}${t.slice(1)}`];return typeof n=="function"&&n(i),i}consumeEvents(){const t=this._eventQueue.slice();return this._eventQueue.length=0,t}spawn(t,e={}){const i=t?.isVector3?t.clone():this._normalizeSpawnPoints([t||this.spawnPoints[0]])[0];Number.isFinite(i.y)||(i.y=this._groundHeight(i.x,i.z));const n=new Q0(this,i,e);return this.enemies.push(n),this._waveActive=!0,this._clearedEmitted=!1,this._emit("enemySpawned",{enemy:n}),n}spawnWave(t=this.spawnPoints.length,e={}){this._wave+=1,this._waveActive=!0,this._clearedEmitted=!1;const i=[];for(let n=0;n<t;n++){const s=this.spawnPoints[n%this.spawnPoints.length]||new T,o=Math.floor(n/Math.max(1,this.spawnPoints.length))?new T((Math.random()-.5)*5,0,(Math.random()-.5)*5):new T;i.push(this.spawn(s.clone().add(o),{...e,id:e.id?`${e.id}-${n+1}`:void 0}))}return this._emit("waveStarted",{wave:this._wave,count:i.length,enemies:i}),i}update(t,e){if(!(this._disposed||!e)){t=Math.min(Math.max(t||0,0),.05);for(const i of[...this.enemies])i.update(t,e),!i.alive&&i.deathTime>=i.removeAfter&&(i.dispose(),this.enemies.splice(this.enemies.indexOf(i),1));this._updateEffects(t),this._waveActive&&!this._clearedEmitted&&this.alive===0&&(this._clearedEmitted=!0,this._waveActive=!1,this._emit("waveCleared",{wave:this._wave,totalKilled:this.totalKilled}))}}handleShot(t,e=null){if(!t)return null;const i=t;let n=null;if(t instanceof zi||typeof t.intersectObjects=="function"?n=t:t.ray instanceof zi||typeof t.ray?.intersectObjects=="function"?n=t.ray:t instanceof Tn?n=new zi(t.origin,t.direction,0,180):t.ray instanceof Tn?n=new zi(t.ray.origin,t.ray.direction,0,180):t.origin&&t.direction&&(n=new zi(t.origin,t.direction,0,180)),!n)return null;this.scene.updateMatrixWorld(!0);const s=[];for(const p of this.enemies)p.alive&&s.push(...p.hitMeshes);const a=n.intersectObjects(s,!1)[0],o=[...new Set([...Array.isArray(this.world.bulletColliders)?this.world.bulletColliders:[],...Array.isArray(this.world.colliders)?this.world.colliders:[]])],l=Array.isArray(o)&&o.length?this._intersectWorld(n,o):null;if(l&&(!a||l.distance<a.distance-.03)){this.options.playerTracers===!0&&this._spawnTracer(i.muzzle||n.ray.origin,l.point,16765562),this._spawnImpact(l.point,l.face?.normal,10253900);const p={blocked:!0,point:l.point.clone(),object:l.object};return this._emit("impact",p),p}if(!a){const p=n.ray.at(Math.min(n.far||180,180),new T);return this.options.playerTracers===!0&&this._spawnTracer(i.muzzle||n.ray.origin,p,16765562),this._emit("miss",{point:p}),null}const c=a.object.userData.enemy;if(!c?.alive)return null;const u=a.object.userData.hitZone||"torso",h=e??i.damage??40,d=c.takeDamage(h,u,a.point.clone(),i.player||i.source||null);return d?(this.options.playerTracers===!0&&this._spawnTracer(i.muzzle||n.ray.origin,a.point,16768387),this._spawnImpact(a.point,a.face?.normal,u==="head"?7805197:5511183),this._emit("enemyHit",d),this._alertNearby(c.position,16,i.player?.position||n.ray.origin),d):null}_enemyShoot(t,e){t.object.updateMatrixWorld(!0);const i=t.muzzle.getWorldPosition(new T),n=e.position.clone().addScaledVector(Ts,e.isMounted?2:1.25),s=i.distanceTo(n),a=n.clone().sub(i).normalize(),o=Kt.lerp(.62,.12,t.accuracy)*Kt.clamp(s/18,.55,1.7),l=new T().crossVectors(a,Ts).normalize(),c=new T().crossVectors(l,a).normalize(),u=e.isSprinting?1.35:e.isAiming?.82:1;a.addScaledVector(l,(Math.random()+Math.random()-1)*o*u).addScaledVector(c,(Math.random()+Math.random()-1)*o*u).normalize();const h=new Tn(i,a),p=h.closestPointToPoint(n,new T).distanceTo(n),g=e.isMounted?.72:.48,_=Math.min(100,s+3),f=!this._rayBlocked(i,a,_)&&p<=g,w=f?n:h.at(_,new T);this._spawnTracer(i,w,16757323),this._spawnMuzzleFlash(i);const b=this._emit("enemyShot",{enemy:t,player:e,origin:i,direction:a,hit:f,damage:t.damage});return f&&e.takeDamage(t.damage,t)&&this._emit("playerHit",{enemy:t,player:e,damage:t.damage,health:e.health}),b}_hasLineOfSight(t,e){const i=t.position.clone().addScaledVector(Ts,1.45),s=e.position.clone().addScaledVector(Ts,e.isMounted?1.9:1.25).sub(i),a=s.length();return a<.01?!0:!this._rayBlocked(i,s.divideScalar(a),a-.35)}_rayBlocked(t,e,i){const n=[...new Set([...Array.isArray(this.world.lineOfSightColliders)?this.world.lineOfSightColliders:[],...Array.isArray(this.world.bulletColliders)?this.world.bulletColliders:[],...Array.isArray(this.world.colliders)?this.world.colliders:[]])];return n.length?(Tr.set(t,e),Tr.near=.05,Tr.far=i,!!this._intersectWorld(Tr,n)):!1}_intersectWorld(t,e){const i=e.filter(h=>h?.isObject3D);let n=i.length?t.intersectObjects(i,!0)[0]:null,s=n?.distance??1/0;const a=t.ray,o=t.near||0,l=Number.isFinite(t.far)?t.far:1/0,c=(h,d)=>{if(!Number.isFinite(h)||h<o||h>l||h>=s)return;const p=a.at(h,new T),g={fence:1.5,barrel:1.45,crate:1.3,trough:1.15,wagon:2.65,rock:.8+(d.radius||.4)*1.35,cactus:4.8,tree:7.5},_=Number.isFinite(d.height)?d.height:g[d.type]??1/0;if(Number.isFinite(_)){const m=this._groundHeight(p.x,p.z);if(p.y>m+_+.15)return}s=h,n={distance:h,point:p,object:d,face:null}},u=(h,d,p,g)=>{const _=a.origin.x-h,m=a.origin.z-d,f=a.direction.x,w=a.direction.z,b=f*f+w*w;if(b<1e-8)return;const M=2*(_*f+m*w),P=_*_+m*m-p*p,E=M*M-4*b*P;if(E<0)return;const A=Math.sqrt(E),D=(-M-A)/(2*b),y=(-M+A)/(2*b);c(D>=o?D:y,g)};for(const h of e)if(!(!h||h.isObject3D||h.disabled)){if(h.shape==="circle")u(h.x,h.z,h.radius||0,h);else if(h.shape==="box"){let d=-1/0,p=1/0;for(const[g,_,m,f]of[[a.origin.x,a.direction.x,h.minX,h.maxX],[a.origin.z,a.direction.z,h.minZ,h.maxZ]])if(Math.abs(_)<1e-8){if(g<m||g>f){d=1/0;break}}else{let w=(m-g)/_,b=(f-g)/_;w>b&&([w,b]=[b,w]),d=Math.max(d,w),p=Math.min(p,b)}p>=d&&c(d>=o?d:p,h)}else if(h.shape==="segment"){const d=a.direction.x,p=a.direction.z,g=h.bx-h.ax,_=h.bz-h.az,m=d*_-p*g;if(Math.abs(m)>1e-8){const w=h.ax-a.origin.x,b=h.az-a.origin.z,M=(w*_-b*g)/m,P=(w*p-b*d)/m;P>=0&&P<=1&&c(M,h)}const f=h.padding||.08;u(h.ax,h.az,f,h),u(h.bx,h.bz,f,h)}}return n}_alertNearby(t,e,i=t){const n=e*e;for(const s of this.enemies)s.alive&&s.position.distanceToSquared(t)<=n&&s.alert(i)}alertAll(t=null){for(const e of this.enemies)e.alive&&e.alert(t)}_onEnemyKilled(t,e,i){this.totalKilled+=1,this._emit("enemyKilled",{enemy:t,source:e,hitZone:i,totalKilled:this.totalKilled,remaining:this.alive})}_findCover(t,e){const i=this.world.coverPoints||this.world.cover||[];let n=null,s=1/0;for(const a of i){const o=a?.isVector3?a:a?.position;if(!o)continue;const l=o.distanceTo(t.position);if(l>11||l<1)continue;const c=o.distanceTo(e);if(this.enemies.some(d=>d!==t&&d.coverTarget?.distanceToSquared(o)<2))continue;const h=l-c*.08;h<s&&(n=o.clone(),s=h)}return n}_groundHeight(t,e){for(const i of["getHeightAt","getTerrainHeight","heightAt","sampleHeight"])if(typeof this.world[i]=="function"){const n=this.world[i](t,e);if(Number.isFinite(n))return n}return Number.isFinite(this.world.groundHeight)?this.world.groundHeight:0}_resolveEnemyCollision(t,e){const i=this.world.resolveEnemyCollision||this.world.resolveCharacterCollision||this.world.resolveCollision;if(typeof i=="function"){const s=i.call(this.world,t.position,t.radius,e,t);s?.isVector3?t.position.copy(s):s?.position?.isVector3&&t.position.copy(s.position),s?.blocked&&t.velocity.multiplyScalar(.25)}const n=this.world.bounds;n?.isBox2?(t.position.x=Kt.clamp(t.position.x,n.min.x+t.radius,n.max.x-t.radius),t.position.z=Kt.clamp(t.position.z,n.min.y+t.radius,n.max.y-t.radius)):n?.isBox3&&(t.position.x=Kt.clamp(t.position.x,n.min.x+t.radius,n.max.x-t.radius),t.position.z=Kt.clamp(t.position.z,n.min.z+t.radius,n.max.z-t.radius))}_spawnTracer(t,e,i=16761698){const n=new se().setFromPoints([t,e]),s=new Hr({color:i,transparent:!0,opacity:.88,blending:Mi,depthWrite:!1}),a=new jo(n,s);this.scene.add(a),this._effects.push({object:a,life:.075,maxLife:.075,type:"tracer"})}_spawnMuzzleFlash(t){const e=new fe(.12,7,5),i=new Ke({color:16753723,transparent:!0,opacity:1,blending:Mi}),n=new qt(e,i);n.position.copy(t);const s=new Vs(16743204,2.7,4,2);n.add(s),this.scene.add(n),this._effects.push({object:n,life:.055,maxLife:.055,type:"flash"})}_spawnImpact(t,e=null,i=7150094){const n=e?.clone()?.transformDirection?.(new Jt)||Ts;for(let s=0;s<6;s++){const a=new fe(.025+Math.random()*.025,5,4),o=new Ke({color:i,transparent:!0}),l=new qt(a,o);l.position.copy(t),this.scene.add(l);const c=new T((Math.random()-.5)*2.1,Math.random()*1.5+.35,(Math.random()-.5)*2.1).addScaledVector(n,.3);this._effects.push({object:l,velocity:c,life:.35+Math.random()*.32,maxLife:.67,type:"particle"})}}_updateEffects(t){for(let e=this._effects.length-1;e>=0;e--){const i=this._effects[e];i.life-=t,i.velocity&&(i.velocity.y-=7*t,i.object.position.addScaledVector(i.velocity,t)),i.object.material&&(i.object.material.opacity=Kt.clamp(i.life/i.maxLife,0,1)),i.life<=0&&(this.scene.remove(i.object),i.object.geometry?.dispose(),i.object.material?.dispose(),this._effects.splice(e,1))}}clear(t=!0){for(const e of[...this.enemies])(t||e.alive)&&(e.dispose(),this.enemies.splice(this.enemies.indexOf(e),1));this._waveActive=!1,this._eventQueue.length=0}reset(){this.clear(!0);for(const t of this._effects)this.scene.remove(t.object),t.object.geometry?.dispose(),t.object.material?.dispose();return this._effects.length=0,this._eventQueue.length=0,this.totalKilled=0,this._wave=0,this._waveActive=!1,this._clearedEmitted=!1,this._nextId=1,this}dispose(){if(!this._disposed){this._disposed=!0,this.clear(!0);for(const t of this._effects)this.scene.remove(t.object),t.object.geometry?.dispose(),t.object.material?.dispose();this._effects.length=0,this._listeners.clear(),this._eventQueue.length=0}}}const Ac=[{id:"dust-and-debt",title:"DUST AND DEBT",description:"A quiet ride turns into unfinished business.",reward:{ammo:12},objectives:[{id:"mount",type:"mount",text:"Mount your horse"},{id:"ride-out",type:"reach",text:"Ride to the abandoned homestead",target:"homestead",fallback:[0,0,-14],radius:5},{id:"ambush",type:"eliminate",text:"Defeat the Red Ridge gang",count:6},{id:"safe-ground",type:"reach",text:"Reach the overlook",target:"overlook",fallback:[0,0,18],radius:5.5}]}];function Eo(r){if(r?.isVector3)return r.clone();if(Array.isArray(r))return r.map(Eo);if(r&&typeof r=="object"){if(Object.getPrototypeOf(r)!==Object.prototype)return r;const t={};for(const[e,i]of Object.entries(r))t[e]=Eo(i);return t}return r}class eg{constructor(t=Ac,e={}){const i=!Array.isArray(t)&&t&&!t.id,n=i?t:e,s=i?n.missions||Ac:t;this.options=n||{},this.missions=Eo(Array.isArray(s)?s:[s]).filter(Boolean),this.autoAdvance=this.options.autoAdvance??!0,this.autoAdvanceDelay=this.options.autoAdvanceDelay??2.2,this.status="idle",this.currentMissionIndex=-1,this.currentObjectiveIndex=-1,this.completedMissions=[],this.failedMissions=[],this.elapsed=0,this._objectiveProgress=0,this._objectiveTarget=1,this._objectiveElapsed=0,this._missionElapsed=0,this._advanceTimer=0,this._objectiveRuntime={},this._listeners=new Map,this._eventQueue=[],this._history=[],this._lastContext=null,(this.options.autoStart??!0)&&this.missions.length&&this.start(this.missions[0].id)}get currentMission(){return this.missions[this.currentMissionIndex]||null}get activeObjective(){return this.currentMission?.objectives?.[this.currentObjectiveIndex]||null}get currentObjective(){return this.activeObjective}get objectiveText(){return this.activeObjective?.text||""}get progress(){return this.activeObjective&&this._objectiveTarget>0?Kt.clamp(this._objectiveProgress/this._objectiveTarget,0,1):0}get progressText(){const t=this.activeObjective;if(!t||!this._showsCount(t))return"";const e=Math.min(this._objectiveTarget,Math.floor(this._objectiveProgress)),i=Math.floor(this._objectiveTarget);return t.type==="survive"?`${Math.ceil(Math.max(0,i-this._objectiveProgress))}s`:`${e} / ${i}`}get isComplete(){return this.status==="campaignComplete"}on(t,e){return this._listeners.has(t)||this._listeners.set(t,new Set),this._listeners.get(t).add(e),()=>this.off(t,e)}off(t,e){this._listeners.get(t)?.delete(e)}_emit(t,e={}){const i={type:t,missionManager:this,state:this.getState(),...e};this._eventQueue.push(i),this._history.push({type:t,time:this.elapsed,missionId:this.currentMission?.id,objectiveId:this.activeObjective?.id}),this._history.length>100&&this._history.shift(),this._listeners.get(t)?.forEach(s=>s(i)),this._listeners.get("*")?.forEach(s=>s(i));const n=this[`on${t[0].toUpperCase()}${t.slice(1)}`];return typeof n=="function"&&n(i),typeof this.onStateChange=="function"&&this.onStateChange(i),i}consumeEvents(){const t=this._eventQueue.slice();return this._eventQueue.length=0,t}start(t=0){const e=typeof t=="number"?t:this.missions.findIndex(n=>n.id===t);if(e<0||e>=this.missions.length)return!1;this.currentMissionIndex=e,this.currentObjectiveIndex=-1,this.status="active",this._missionElapsed=0,this._advanceTimer=0;const i=this.currentMission;return this._emit("missionStarted",{mission:i,index:e}),this._startObjective(0),!0}startNext(){const t=this.currentMissionIndex+1;return t<this.missions.length?this.start(t):(this.status="campaignComplete",this._advanceTimer=0,this._emit("campaignCompleted",{completedMissions:[...this.completedMissions]}),!1)}_startObjective(t){const e=this.currentMission?.objectives||[];if(t>=e.length){this._completeMission();return}this.currentObjectiveIndex=t,this._objectiveProgress=0,this._objectiveElapsed=0,this._objectiveRuntime={};const i=this.activeObjective;this._objectiveTarget=this._targetCount(i),i.type==="eliminate"&&this._lastContext?.enemies&&(this._objectiveRuntime.killBaseline=this._lastContext.enemies.totalKilled||0),i.type==="clearWave"&&this._lastContext?.enemies&&(this._objectiveRuntime.sawEnemies=this._lastContext.enemies.alive>0),this._emit("objectiveStarted",{mission:this.currentMission,objective:i,index:t}),typeof i.onStart=="function"&&i.onStart(this,this._lastContext)}update(t,e=this._lastContext||{}){if(t=Math.min(Math.max(t||0,0),.1),this.elapsed+=t,this._lastContext=e||{},this.status==="missionComplete")return this.autoAdvance&&(this._advanceTimer-=t,this._advanceTimer<=0&&this.startNext()),this.getState();if(this.status!=="active"||!this.activeObjective)return this.getState();this._missionElapsed+=t,this._objectiveElapsed+=t;const i=this.activeObjective;let n=!1;switch(i.type){case"reach":case"escape":{const s=e.player?.position||e.position,a=this.getTargetPosition(e);if(s&&a){const o=i.radius??3,l=this._horizontalDistance(s,a);this._objectiveRuntime.distance=l,n=l<=o}break}case"mount":n=!!(e.player?.isMounted||e.horse?.rider===e.player);break;case"dismount":n=e.player?!e.player.isMounted:!1;break;case"eliminate":if(e.enemies&&Number.isFinite(e.enemies.totalKilled)){Number.isFinite(this._objectiveRuntime.killBaseline)||(this._objectiveRuntime.killBaseline=e.enemies.totalKilled);const s=e.enemies.totalKilled-this._objectiveRuntime.killBaseline;s>this._objectiveProgress&&this._setProgress(s)}n=this._objectiveProgress>=this._objectiveTarget;break;case"clearWave":e.enemies&&(e.enemies.alive>0&&(this._objectiveRuntime.sawEnemies=!0),n=e.enemies.alive===0&&(this._objectiveRuntime.sawEnemies||i.allowInitiallyClear));break;case"survive":{(typeof i.condition!="function"||i.condition(e,this))&&this._setProgress(this._objectiveProgress+t,!1),n=this._objectiveProgress>=this._objectiveTarget;break}case"healthAbove":n=(e.player?.health??0)>=(i.amount??this._objectiveTarget);break;case"custom":{const s=i.update?.(t,e,this);typeof s=="number"?this._setProgress(s):n=!!s;break}default:n=this._objectiveProgress>=this._objectiveTarget}return n&&this.completeObjective(),this.getState()}handleEvent(t,e={}){if(typeof t=="object"&&(e=t,t=e.type),!t)return!1;const i=this.activeObjective;if(this._emit("gameplayEvent",{eventType:t,data:e}),this.status!=="active"||!i)return!1;let n=!1,s=e.amount??1;switch(i.type){case"mount":n=t==="mount"||t==="mounted";break;case"dismount":n=t==="dismount"||t==="dismounted";break;case"eliminate":if(n=t==="enemyKilled"||t==="kill",s=1,i.enemyTag){const a=e.enemy?.tags||e.enemy?.options?.tags||[];n=n&&a.includes(i.enemyTag)}break;case"collect":n=t==="itemCollected"&&(!i.item||i.item===e.item||i.item===e.id);break;case"interact":n=t==="interact"&&(!i.target||i.target===e.target||i.target===e.id);break;case"clearWave":n=t==="waveCleared"&&(!i.wave||i.wave===e.wave),s=this._objectiveTarget;break;case"event":case"count":n=t===i.event,i.filter&&(n=n&&i.filter(e,this));break;default:i.event&&(n=t===i.event)}return n?(this._setProgress(this._objectiveProgress+s),this._objectiveProgress>=this._objectiveTarget&&this.completeObjective(e),!0):!1}record(t,e={}){return this.handleEvent(t,e)}_setProgress(t,e=!0){const i=this._objectiveProgress;this._objectiveProgress=Kt.clamp(t,0,this._objectiveTarget),e&&this._objectiveProgress!==i&&this._emit("objectiveProgress",{mission:this.currentMission,objective:this.activeObjective,current:this._objectiveProgress,target:this._objectiveTarget,progress:this.progress})}completeObjective(t={}){if(this.status!=="active"||!this.activeObjective)return!1;const e=this.currentMission,i=this.activeObjective;return this._objectiveProgress=this._objectiveTarget,typeof i.onComplete=="function"&&i.onComplete(this,this._lastContext,t),this._emit("objectiveCompleted",{mission:e,objective:i,index:this.currentObjectiveIndex,elapsed:this._objectiveElapsed,data:t}),this._startObjective(this.currentObjectiveIndex+1),!0}_completeMission(){if(!this.currentMission)return;const t=this.currentMission;this.status="missionComplete",this.currentObjectiveIndex=t.objectives?.length??0,this._advanceTimer=this.autoAdvanceDelay,this.completedMissions.includes(t.id)||this.completedMissions.push(t.id),this._emit("missionCompleted",{mission:t,elapsed:this._missionElapsed,reward:t.reward||null}),!this.autoAdvance&&this.currentMissionIndex>=this.missions.length-1&&(this.status="campaignComplete",this._emit("campaignCompleted",{completedMissions:[...this.completedMissions]}))}fail(t="Mission failed",e={}){if(this.status!=="active")return!1;const i=this.currentMission;return this.status="failed",i&&!this.failedMissions.includes(i.id)&&this.failedMissions.push(i.id),this._emit("missionFailed",{mission:i,objective:this.activeObjective,reason:t,data:e}),!0}restart(){return this.currentMission?this.start(this.currentMissionIndex):!1}reset(t=this.options.autoStart??!0){this.status="idle",this.currentMissionIndex=-1,this.currentObjectiveIndex=-1,this.completedMissions.length=0,this.failedMissions.length=0,this.elapsed=0,this._eventQueue.length=0,t&&this.missions.length&&this.start(0)}getTargetPosition(t=this._lastContext||{}){const e=this.activeObjective;if(!e)return null;let i=e.target??e.position;return typeof i=="function"&&(i=i(t,this)),typeof i=="string"&&(i=t.locations?.[i]||t.world?.locations?.[i]||t.world?.landmarks?.[i]||this.options.locations?.[i]||e.fallback),i?.position&&(i=i.position),i?.isVector3?i:Array.isArray(i)?new T(i[0]||0,i[1]||0,i[2]||0):i&&Number.isFinite(i.x)?new T(i.x,i.y||0,i.z||0):null}getState(){return{status:this.status,mission:this.currentMission,missionIndex:this.currentMissionIndex,objective:this.activeObjective,objectiveIndex:this.currentObjectiveIndex,title:this.currentMission?.title||"",objectiveText:this.objectiveText,progress:this.progress,progressCurrent:this._objectiveProgress,progressTarget:this._objectiveTarget,progressText:this.progressText,targetPosition:this.getTargetPosition(),completedMissions:[...this.completedMissions]}}_targetCount(t){return t?t.type==="survive"?t.duration??t.seconds??10:t.type==="healthAbove"?t.amount??100:t.count??t.targetCount??1:1}_showsCount(t){return["eliminate","collect","count","survive"].includes(t.type)||(t.count??1)>1}_horizontalDistance(t,e){return Math.hypot(t.x-e.x,t.z-e.z)}}const Rs=(r,t=0,e=1)=>Math.min(e,Math.max(t,r)),ig=r=>{const t=Math.max(0,Math.floor(Number(r)||0));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`},Cc=(r,t=100)=>{const e=Number(r),i=Math.max(Number(t)||100,.001);return Number.isFinite(e)?Rs(i===1?e:e/i)*100:0};class ng{constructor(t=document.querySelector("#app"),e={}){if(t&&!t.nodeType&&(e=t,t=document.querySelector("#app")),!t)throw new Error("UI needs a root element (usually #app).");this.root=t,this.options={title:"DUSTBOUND",subtitle:"An Original Frontier Tale",...e},this.paused=!1,this._destroyed=!1,this._onStart=null,this._onResume=null,this._onRestart=null,this._subtitleTimer=0,this._subtitleExitTimer=0,this._damageTimer=0,this._toastTimers=new Set,this.root.classList.add("game-root"),this.el=document.createElement("div"),this.el.className="game-ui",this.el.innerHTML=this._template(),this.root.append(this.el),this.el.classList.add("has-title"),this.parts={},this.el.querySelectorAll("[data-ui]").forEach(i=>{this.parts[i.dataset.ui]=i}),this.parts.gameTitle.textContent=this.options.title,this.parts.gameSubtitle.textContent=this.options.subtitle,this._onKeyDown=this._onKeyDown.bind(this),this._handleStart=this._handleStart.bind(this),this._handleResume=this._handleResume.bind(this),this._handleRestart=this._handleRestart.bind(this),this._handleFullscreen=this._handleFullscreen.bind(this),this.parts.startButton.addEventListener("click",this._handleStart),this.parts.resumeButton.addEventListener("click",this._handleResume),this.parts.restartButton.addEventListener("click",this._handleRestart),this.parts.fullscreenButton.addEventListener("click",this._handleFullscreen),this.parts.pauseButton.addEventListener("click",()=>this.togglePause(!0)),window.addEventListener("keydown",this._onKeyDown),this.updateHUD({health:100,maxHealth:100,stamina:100,maxStamina:100,ammo:{current:6,reserve:24},wanted:0})}_template(){return`
      <div class="screen-grain" aria-hidden="true"></div>
      <div class="screen-vignette" aria-hidden="true"></div>
      <div class="damage-flash" data-ui="damageFlash" aria-hidden="true"></div>
      <div class="cinematic-bars" aria-hidden="true"><i></i><i></i></div>

      <section class="title-screen" data-ui="titleScreen" aria-labelledby="game-title">
        <div class="frontier-scene" aria-hidden="true">
          <span class="frontier-sun"></span>
          <span class="frontier-haze haze-one"></span>
          <span class="frontier-haze haze-two"></span>
          <span class="ridge ridge-far"></span>
          <span class="ridge ridge-near"></span>
          <span class="rider-silhouette"><i></i></span>
        </div>
        <div class="title-rule title-rule-top" aria-hidden="true"><span></span></div>
        <p class="title-eyebrow">A frontier forged in dust</p>
        <h1 id="game-title" class="game-title" data-ui="gameTitle">DUSTBOUND</h1>
        <p class="game-subtitle" data-ui="gameSubtitle">An Original Frontier Tale</p>
        <div class="title-rule" aria-hidden="true"><span></span></div>

        <div class="controls-card" aria-label="Game controls">
          <p class="controls-heading">How to survive</p>
          <div class="controls-grid">
            <span><kbd>W A S D</kbd><small>Move</small></span>
            <span><kbd>RMB</kbd><small>Aim</small></span>
            <span><kbd>LMB</kbd><small>Fire</small></span>
            <span><kbd>R</kbd><small>Reload</small></span>
            <span><kbd>E</kbd><small>Interact</small></span>
            <span><kbd>Shift</kbd><small>Sprint / Gallop</small></span>
          </div>
        </div>

        <button class="western-button western-button-primary" data-ui="startButton" type="button">
          <span data-ui="startLabel">Ride into the dust</span>
          <i aria-hidden="true"></i>
        </button>
        <div class="load-track" data-ui="loadTrack" hidden>
          <span data-ui="loadBar"></span>
        </div>
        <p class="load-label" data-ui="loadLabel" hidden>Preparing the frontier…</p>
        <p class="title-footnote">Mouse to look · F to focus · M to mute · Headphones recommended</p>
      </section>

      <section class="hud" data-ui="hud" aria-label="Game status" hidden>
        <div class="hud-top-left">
          <div class="wanted" data-ui="wanted" hidden>
            <span class="wanted-kicker">Law alerted</span>
            <strong data-ui="wantedLabel">WANTED</strong>
            <span class="wanted-pips" data-ui="wantedPips" aria-label="Wanted level">
              <i></i><i></i><i></i><i></i><i></i>
            </span>
          </div>
        </div>

        <div class="objective-card" data-ui="objective" hidden>
          <span class="objective-kicker">Current objective</span>
          <strong data-ui="objectiveText"></strong>
          <small data-ui="objectiveDetail"></small>
        </div>

        <button class="pause-button" data-ui="pauseButton" type="button" aria-label="Pause game">
          <i></i><i></i>
        </button>

        <div class="reticle" data-ui="reticle" aria-hidden="true">
          <i class="reticle-n"></i><i class="reticle-e"></i>
          <i class="reticle-s"></i><i class="reticle-w"></i>
          <b></b>
          <span class="hitmarker" data-ui="hitmarker"><i></i><i></i><i></i><i></i></span>
        </div>

        <div class="hud-bottom-left">
          <div class="stat-orb health-orb" data-ui="healthOrb" aria-label="Health 100 percent">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <circle class="orb-track" cx="26" cy="26" r="22"></circle>
              <circle class="orb-value" data-ui="healthRing" cx="26" cy="26" r="22"></circle>
            </svg>
            <span class="heart-mark" aria-hidden="true"></span>
          </div>
          <div class="stat-copy">
            <span>Health</span>
            <strong data-ui="healthText">100</strong>
          </div>
          <div class="stamina-wrap">
            <span class="stamina-label">Stamina</span>
            <div class="stamina-track"><i data-ui="staminaBar"></i></div>
          </div>
        </div>

        <div class="hud-bottom-right">
          <div class="weapon-copy">
            <span data-ui="weaponName">Ironwood Revolver</span>
            <small data-ui="ammoState">Ready</small>
          </div>
          <div class="ammo-counter" data-ui="ammoCounter" aria-label="6 rounds, 24 reserve">
            <strong data-ui="ammoCurrent">6</strong>
            <span class="ammo-divider"></span>
            <small data-ui="ammoReserve">24</small>
          </div>
        </div>
      </section>

      <div class="interaction-prompt" data-ui="prompt" role="status" hidden>
        <kbd data-ui="promptKey">E</kbd>
        <span data-ui="promptText">Interact</span>
      </div>

      <div class="subtitle" data-ui="subtitleBox" aria-live="polite" hidden>
        <span data-ui="speaker" hidden></span>
        <p data-ui="subtitleText"></p>
      </div>

      <div class="toast-stack" data-ui="toastStack" aria-live="polite" aria-atomic="false"></div>

      <section class="menu-screen pause-screen" data-ui="pauseScreen" aria-labelledby="pause-heading" hidden>
        <div class="menu-scrim"></div>
        <div class="menu-panel">
          <p class="menu-kicker">The trail waits</p>
          <h2 id="pause-heading">Paused</h2>
          <span class="menu-flourish" aria-hidden="true"></span>
          <button class="western-button western-button-primary" data-ui="resumeButton" type="button">Resume</button>
          <button class="western-button western-button-quiet" data-ui="fullscreenButton" type="button">Toggle fullscreen</button>
          <p class="menu-hint"><kbd>Esc</kbd> return to the trail</p>
        </div>
      </section>

      <section class="menu-screen end-screen" data-ui="endScreen" aria-labelledby="end-heading" hidden>
        <div class="menu-scrim"></div>
        <div class="end-panel">
          <p class="menu-kicker" data-ui="endKicker">The dust settles</p>
          <h2 id="end-heading" data-ui="endHeading">Trail Complete</h2>
          <p class="end-copy" data-ui="endCopy">Your name carries beyond the canyon.</p>
          <span class="menu-flourish" aria-hidden="true"></span>
          <dl class="end-stats" data-ui="endStats"></dl>
          <button class="western-button western-button-primary" data-ui="restartButton" type="button">Ride again</button>
        </div>
      </section>

      <aside class="mobile-notice" aria-live="polite">
        <span class="rotate-device" aria-hidden="true"></span>
        <strong>A wider horizon awaits</strong>
        <p>For the full experience, play in landscape with a keyboard and mouse.</p>
      </aside>

      <div class="sr-only" data-ui="announcer" aria-live="assertive" aria-atomic="true"></div>
    `}onStart(t){return this._onStart=typeof t=="function"?t:null,this}showTitle(t){return t!==void 0&&this.onStart(t),this.clearSubtitle(),this.setPrompt(""),this.clearToasts(),window.clearTimeout(this._damageTimer),this.parts.damageFlash.classList.remove("is-active"),this.setCinematic(!1),this.togglePause(!1),this.parts.endScreen.hidden=!0,this.parts.titleScreen.hidden=!1,this.parts.hud.hidden=!0,this.el.classList.add("has-title"),this.el.classList.remove("has-ended"),this.parts.startButton.disabled=!1,requestAnimationFrame(()=>this.parts.startButton.focus({preventScroll:!0})),this}hideTitle(){return this.parts.titleScreen.classList.add("is-leaving"),window.setTimeout(()=>{this._destroyed||(this.parts.titleScreen.hidden=!0,this.parts.titleScreen.classList.remove("is-leaving"),this.el.classList.remove("has-title"),this.parts.hud.hidden=!1)},620),this}setLoading(t,e="Preparing the frontier…"){const i=t!==!1&&t!==null,n=Number(t)||0,s=Rs(n>1?n/100:n);return this.parts.loadTrack.hidden=!i,this.parts.loadLabel.hidden=!i,i?(this.parts.loadBar.style.transform=`scaleX(${s})`,this.parts.loadLabel.textContent=e,this.parts.startButton.disabled=i&&s<1,this.parts.startLabel.textContent=s>=1?"Ride into the dust":"Loading",this):(this.parts.startButton.disabled=!1,this.parts.startLabel.textContent="Ride into the dust",this)}showHUD(t=!0){return this.parts.hud.hidden=!t,this}updateHUD(t={}){const e=t.player||{},i=t.health??e.health,n=t.maxHealth??e.maxHealth??(Number(i)<=1?1:100),s=t.stamina??e.stamina,a=t.maxStamina??e.maxStamina??(Number(s)<=1?1:100);i!==void 0&&this.setHealth(i,n),s!==void 0&&this.setStamina(s,a);const o=t.ammo??e.ammo;if(o!==void 0&&(typeof o=="number"?this.setAmmo(o,t.reserve??t.reserveAmmo??e.reserve??e.reserveAmmo,t.weapon??e.weaponName,t.reloading??e.isReloading):this.setAmmo(o.current??o.loaded??0,o.reserve??o.reserveAmmo??o.total??0,o.weapon??o.name,o.reloading)),t.weapon!==void 0&&(this.parts.weaponName.textContent=t.weapon),t.objective!==void 0){const l=t.objective;l&&typeof l=="object"?this.setObjective(l.text??l.title,l.detail):this.setObjective(l)}if(t.wanted!==void 0&&this.setWanted(t.wanted),t.prompt!==void 0){const l=t.prompt;l&&typeof l=="object"?this.setPrompt(l.text,l.key):this.setPrompt(l)}return t.reticle!==void 0&&this.setReticle(t.reticle),t.visible!==void 0&&this.showHUD(t.visible),this}setHealth(t,e=Number(t)<=1?1:100){const i=Cc(t,e),n=2*Math.PI*22;this.parts.healthRing.style.strokeDasharray=`${n}`,this.parts.healthRing.style.strokeDashoffset=`${n*(1-i/100)}`;const s=Number(e)===1?i:Number(t);return this.parts.healthText.textContent=`${Math.max(0,Math.ceil(s||0))}`,this.parts.healthOrb.setAttribute("aria-label",`Health ${Math.round(i)} percent`),this.parts.healthOrb.classList.toggle("is-critical",i<=25),this}setStamina(t,e=Number(t)<=1?1:100){const i=Cc(t,e);return this.parts.staminaBar.style.transform=`scaleX(${i/100})`,this.parts.staminaBar.parentElement.classList.toggle("is-low",i<=20),this}setAmmo(t=0,e=0,i,n=!1){const s=Math.max(0,Math.floor(Number(t)||0)),a=Math.max(0,Math.floor(Number(e)||0));return this.parts.ammoCurrent.textContent=String(s).padStart(2,"0"),this.parts.ammoReserve.textContent=String(a).padStart(2,"0"),this.parts.ammoCounter.setAttribute("aria-label",`${s} rounds, ${a} reserve`),this.parts.ammoCounter.classList.toggle("is-empty",s===0),this.parts.ammoState.textContent=n?"Reloading":s===0?"Empty":"Ready",i&&(this.parts.weaponName.textContent=i),this}setObjective(t,e=""){const i=!!t,n=t!==this._objectiveText||e!==this._objectiveDetail||i!==this._objectiveVisible;return this._objectiveText=t,this._objectiveDetail=e,this._objectiveVisible=i,this.parts.objective.hidden=!i,this.parts.objectiveText.textContent=t||"",this.parts.objectiveDetail.textContent=e||"",this.parts.objectiveDetail.hidden=!e,i&&n&&(this.parts.objective.classList.remove("is-updated"),this.parts.objective.offsetWidth,this.parts.objective.classList.add("is-updated"),this.announce(`Objective: ${t}`)),this}setWanted(t=0,e="WANTED"){t&&typeof t=="object"&&(e=t.label||e,t=t.level??t.value??0);const i=Rs(Math.ceil(Number(t)||0),0,5);return this.parts.wanted.hidden=i===0,this.parts.wantedLabel.textContent=e,[...this.parts.wantedPips.children].forEach((n,s)=>{n.classList.toggle("is-lit",s<i)}),this.parts.wantedPips.setAttribute("aria-label",`Wanted level ${i} of 5`),this}setPrompt(t,e="E"){t&&typeof t=="object"&&(e=t.key??e,t=t.text??t.label);const i=!!t;return this.parts.prompt.hidden=!i,this.parts.promptText.textContent=t||"",this.parts.promptKey.textContent=e||"E",this}setReticle(t=!0){if(typeof t=="object"){const e=Number(t.spread);Number.isFinite(e)&&this.parts.reticle.style.setProperty("--spread",`${Rs(e,4,32)}px`),t=t.visible??t.active??!0}return this.parts.reticle.classList.toggle("is-hidden",!t),this}setCrosshair(t=!0){return this.setReticle(t)}hitmarker(t=!1){const e=this.parts.hitmarker;return e.classList.remove("is-hit","is-kill"),e.offsetWidth,e.classList.add(t?"is-kill":"is-hit"),window.setTimeout(()=>e.classList.remove("is-hit","is-kill"),t?430:260),this}damageFlash(t=.72){return window.clearTimeout(this._damageTimer),this.parts.damageFlash.style.setProperty("--damage-opacity",String(Rs(Number(t)||.72,.15,1))),this.parts.damageFlash.classList.remove("is-active"),this.parts.damageFlash.offsetWidth,this.parts.damageFlash.classList.add("is-active"),this._damageTimer=window.setTimeout(()=>this.parts.damageFlash.classList.remove("is-active"),460),this}showToast(t,e="info",i=3200){if(!t)return null;e&&typeof e=="object"&&(i=e.duration??i,e=e.type??"info");const n=document.createElement("div");n.className=`toast toast-${e}`;const s=document.createElement("i"),a=document.createElement("span");a.textContent=t,n.append(s,a),this.parts.toastStack.append(n),requestAnimationFrame(()=>n.classList.add("is-visible"));const o=window.setTimeout(()=>{n.classList.remove("is-visible"),window.setTimeout(()=>n.remove(),420),this._toastTimers.delete(o)},Math.max(900,Number(i)||3200));return this._toastTimers.add(o),n}clearToasts(){return this._toastTimers.forEach(t=>window.clearTimeout(t)),this._toastTimers.clear(),this.parts.toastStack.replaceChildren(),this}setSubtitle(t,e=3600,i=""){return window.clearTimeout(this._subtitleTimer),window.clearTimeout(this._subtitleExitTimer),this.parts.subtitleBox.classList.remove("is-leaving"),e&&typeof e=="object"&&(i=e.speaker??i,e=e.duration??3600),t?(this.parts.subtitleText.textContent=t,this.parts.speaker.textContent=i,this.parts.speaker.hidden=!i,this.parts.subtitleBox.hidden=!1,e>0&&(this._subtitleTimer=window.setTimeout(()=>{this.parts.subtitleBox.classList.add("is-leaving"),this._subtitleExitTimer=window.setTimeout(()=>{this.parts.subtitleBox.hidden=!0,this.parts.subtitleBox.classList.remove("is-leaving")},260)},e)),this):(this.parts.subtitleBox.hidden=!0,this)}clearSubtitle(){return this.setSubtitle("")}setCinematic(t=!0){return this.el.classList.toggle("is-cinematic",t),this}togglePause(t,e){typeof t=="function"&&(e=t,t=void 0),typeof e=="function"&&(this._onResume=e);const i=typeof t=="boolean"?t:!this.paused;return i===this.paused?this.paused:i&&(!this.parts.titleScreen.hidden||!this.parts.endScreen.hidden)?!1:(this.paused=i,this.parts.pauseScreen.hidden=!i,this.el.classList.toggle("is-paused",i),this._emit(i?"ui:pause":"ui:resume"),i?requestAnimationFrame(()=>this.parts.resumeButton.focus({preventScroll:!0})):this._onResume&&this._onResume(),this.paused)}showEnd(t="victory",e={},i){t&&typeof t=="object"&&(i=e,e=t.stats||{},t=t.kind||t.result||(t.victory===!1?"death":"victory")),typeof e=="function"&&(i=e,e={}),this._onRestart=typeof i=="function"?i:null,this.clearSubtitle(),this.setPrompt(""),this.clearToasts(),this.setCinematic(!1);const n=typeof t=="string"?t.toLowerCase():t,s=!["death","defeat","lost",!1].includes(n);return this.parts.pauseScreen.hidden=!0,this.paused=!1,this.parts.endScreen.hidden=!1,this.parts.endScreen.classList.toggle("is-defeat",!s),this.parts.endKicker.textContent=s?"The dust settles":"The frontier remembers",this.parts.endHeading.textContent=s?"Trail Complete":"Last Light",this.parts.endCopy.textContent=s?"Your name carries beyond the canyon.":"Every legend leaves tracks. Make yours again.",this.parts.restartButton.textContent=s?"Ride again":"Return to the trail",this._renderStats(e),this.el.classList.add("has-ended"),this.parts.hud.hidden=!0,this.announce(s?"Trail complete":"You have fallen"),requestAnimationFrame(()=>this.parts.restartButton.focus({preventScroll:!0})),this}hideEnd(){return this.parts.endScreen.hidden=!0,this.el.classList.remove("has-ended"),this.parts.hud.hidden=!1,this}announce(t){this.parts.announcer.textContent="",window.setTimeout(()=>{this._destroyed||(this.parts.announcer.textContent=t||"")},20)}_renderStats(t){this.parts.endStats.replaceChildren();const e=[];if(t.time!==void 0&&e.push(["Time",typeof t.time=="number"?ig(t.time):t.time]),t.kills!==void 0&&e.push(["Outlaws",t.kills]),t.accuracy!==void 0){const i=Number(t.accuracy);e.push(["Accuracy",Number.isFinite(i)?`${Math.round(i<=1?i*100:i)}%`:t.accuracy])}t.score!==void 0&&e.push(["Renown",t.score]),Object.entries(t.extra||{}).forEach(([i,n])=>e.push([i,n])),e.forEach(([i,n])=>{const s=document.createElement("div"),a=document.createElement("dt"),o=document.createElement("dd");a.textContent=i,o.textContent=String(n),s.append(a,o),this.parts.endStats.append(s)}),this.parts.endStats.hidden=e.length===0}_handleStart(){this.parts.startButton.disabled=!0,this._emit("ui:start");try{const t=this._onStart?.();t?.catch&&t.catch(e=>{console.error(e),this.showToast("The trail could not be opened.","danger")}),this.hideTitle()}catch(t){console.error(t),this.parts.startButton.disabled=!1,this.showToast("The trail could not be opened.","danger")}}_handleResume(){this.togglePause(!1)}_handleRestart(){this._emit("ui:restart"),this.hideEnd(),this._onRestart?.()}async _handleFullscreen(){try{document.fullscreenElement?await document.exitFullscreen?.():await this.root.requestFullscreen?.()}catch{this.showToast("Fullscreen is unavailable in this browser.","warning")}}_onKeyDown(t){t.code!=="Escape"||t.repeat||!this.parts.titleScreen.hidden||!this.parts.endScreen.hidden||(t.preventDefault(),this.togglePause())}_emit(t,e={}){this.root.dispatchEvent(new CustomEvent(t,{bubbles:!0,detail:e}))}destroy(){this._destroyed=!0,window.clearTimeout(this._subtitleTimer),window.clearTimeout(this._subtitleExitTimer),window.clearTimeout(this._damageTimer),this._toastTimers.forEach(t=>window.clearTimeout(t)),window.removeEventListener("keydown",this._onKeyDown),this.parts.startButton.removeEventListener("click",this._handleStart),this.parts.resumeButton.removeEventListener("click",this._handleResume),this.parts.restartButton.removeEventListener("click",this._handleRestart),this.parts.fullscreenButton.removeEventListener("click",this._handleFullscreen),this.el.remove(),this.root.classList.remove("game-root")}}const Ee=(r,t=0,e=1)=>Math.min(e,Math.max(t,r)),Pe=(r,t)=>r+Math.random()*(t-r);class sg{constructor(t={}){typeof t=="number"&&(t={masterVolume:t}),this.options={masterVolume:.78,sfxVolume:.92,ambientVolume:.54,reverbVolume:.22,...t},this.ctx=null,this.master=null,this.sfxBus=null,this.ambientBus=null,this.reverb=null,this.reverbReturn=null,this.noiseBuffer=null,this.muted=!1,this.destroyed=!1,this.ambientPlaying=!1,this._ambientNodes=[],this._ambientTimer=0,this._unlockTarget=null,this._unlockHandler=null}get context(){return this.ctx}get ready(){return this.ctx?.state==="running"}get available(){return typeof window<"u"&&!!(window.AudioContext||window.webkitAudioContext)}async init(){if(!this._ensureContext())return!1;try{return this.ctx.state==="suspended"&&await this.ctx.resume(),this._removeUnlockListeners(),this.ctx.state==="running"}catch{return!1}}async resume(){return this.init()}async suspend(){if(!this.ctx||this.ctx.state!=="running")return!1;try{return await this.ctx.suspend(),!0}catch{return!1}}unlockOnGesture(t=window){return!t?.addEventListener||this._unlockHandler?this:(this._unlockTarget=t,this._unlockHandler=()=>{this.init(),this._removeUnlockListeners()},["pointerdown","touchstart","keydown"].forEach(e=>{t.addEventListener(e,this._unlockHandler,{capture:!0,passive:!0})}),this)}_removeUnlockListeners(){!this._unlockTarget||!this._unlockHandler||(["pointerdown","touchstart","keydown"].forEach(t=>{this._unlockTarget.removeEventListener(t,this._unlockHandler,{capture:!0})}),this._unlockTarget=null,this._unlockHandler=null)}_ensureContext(){if(this.destroyed||!this.available)return!1;if(this.ctx&&this.ctx.state!=="closed")return!0;const t=window.AudioContext||window.webkitAudioContext;try{this.ctx=new t({latencyHint:"interactive"})}catch{this.ctx=new t}const e=this.ctx.createDynamicsCompressor();return e.threshold.value=-10,e.knee.value=9,e.ratio.value=8,e.attack.value=.003,e.release.value=.18,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:Ee(this.options.masterVolume),this.sfxBus=this.ctx.createGain(),this.sfxBus.gain.value=Ee(this.options.sfxVolume),this.ambientBus=this.ctx.createGain(),this.ambientBus.gain.value=Ee(this.options.ambientVolume),this.reverbReturn=this.ctx.createGain(),this.reverbReturn.gain.value=Ee(this.options.reverbVolume,0,.65),this.reverb=this.ctx.createConvolver(),this.reverb.buffer=this._createImpulse(1.85,2.75),this.sfxBus.connect(this.master),this.ambientBus.connect(this.master),this.reverb.connect(this.reverbReturn),this.reverbReturn.connect(this.master),this.master.connect(e),e.connect(this.ctx.destination),this.noiseBuffer=this._createNoiseBuffer(3),!0}_createNoiseBuffer(t=2){const e=Math.ceil(this.ctx.sampleRate*t),i=this.ctx.createBuffer(1,e,this.ctx.sampleRate),n=i.getChannelData(0);let s=0;for(let a=0;a<e;a+=1){const o=Math.random()*2-1;s=s*.18+o*.82,n[a]=s}return i}_createImpulse(t,e){const i=Math.ceil(this.ctx.sampleRate*t),n=this.ctx.createBuffer(2,i,this.ctx.sampleRate);for(let s=0;s<2;s+=1){const a=n.getChannelData(s);for(let o=0;o<i;o+=1){const l=Math.pow(1-o/i,e);a[o]=(Math.random()*2-1)*l*(s?.92:1)}}return n}_makeOutput(t="sfx",e=0,i=0){const n=this.ctx.createGain();let s=n;if(this.ctx.createStereoPanner){const a=this.ctx.createStereoPanner();a.pan.value=Ee(Number(i)||0,-1,1),n.connect(a),s=a}if(s.connect(t==="ambient"?this.ambientBus:this.sfxBus),e>0){const a=this.ctx.createGain();a.gain.value=Ee(e,0,1),s.connect(a),a.connect(this.reverb)}return n}_tone({when:t=this.ctx.currentTime,frequency:e=440,endFrequency:i=e,duration:n=.15,gain:s=.1,attack:a=.003,type:o="sine",detune:l=0,bus:c="sfx",wet:u=0,pan:h=0}={}){const d=this.ctx.createOscillator(),p=this.ctx.createGain(),g=this._makeOutput(c,u,h),_=Math.max(this.ctx.currentTime,t),m=_+Math.max(.015,n);return d.type=o,d.frequency.setValueAtTime(Math.max(20,e),_),d.frequency.exponentialRampToValueAtTime(Math.max(20,i),m),d.detune.value=l,p.gain.setValueAtTime(1e-4,_),p.gain.linearRampToValueAtTime(Math.max(1e-4,s),_+Math.min(a,n*.35)),p.gain.exponentialRampToValueAtTime(1e-4,m),d.connect(p),p.connect(g),d.start(_),d.stop(m+.025),d}_noise({when:t=this.ctx.currentTime,duration:e=.16,gain:i=.15,attack:n=.002,filter:s="bandpass",frequency:a=900,endFrequency:o=a,q:l=.8,playbackRate:c=1,bus:u="sfx",wet:h=0,pan:d=0}={}){const p=this.ctx.createBufferSource(),g=this.ctx.createBiquadFilter(),_=this.ctx.createGain(),m=this._makeOutput(u,h,d),f=Math.max(this.ctx.currentTime,t),w=f+Math.max(.015,e);return p.buffer=this.noiseBuffer,p.loop=e>2.8,p.playbackRate.value=c,g.type=s,g.frequency.setValueAtTime(Math.max(25,a),f),g.frequency.exponentialRampToValueAtTime(Math.max(25,o),w),g.Q.value=l,_.gain.setValueAtTime(1e-4,f),_.gain.linearRampToValueAtTime(Math.max(1e-4,i),f+Math.min(n,e*.35)),_.gain.exponentialRampToValueAtTime(1e-4,w),p.connect(g),g.connect(_),_.connect(m),p.start(f,Pe(0,Math.max(.01,3-e))),p.stop(w+.03),p}playShot(t={}){if(!this._ensureContext())return!1;typeof t=="number"&&(t={intensity:t});const e=Ee(t.intensity??1,.2,1.35),i=Ee(t.pan??0,-1,1),n=!!t.distant,s=this.ctx.currentTime+.006;return this._noise({when:s,duration:n?.18:.095,gain:(n?.22:.68)*e,filter:"highpass",frequency:n?380:820,endFrequency:240,q:.4,wet:n?.48:.16,pan:i}),this._noise({when:s,duration:n?.72:.44,gain:(n?.16:.44)*e,attack:.001,filter:"lowpass",frequency:n?720:1250,endFrequency:105,wet:n?.75:.36,pan:i}),this._tone({when:s,frequency:n?92:148,endFrequency:42,duration:n?.34:.22,gain:(n?.13:.34)*e,type:"triangle",wet:.12,pan:i}),n||this._tone({when:s,frequency:Pe(1800,2300),endFrequency:530,duration:.055,gain:.075*e,type:"square",pan:i}),!0}playReload(t={}){if(!this._ensureContext())return!1;typeof t=="number"&&(t={speed:t});const e=Ee(t.speed??1,.45,2),i=Ee(t.pan??0,-1,1),n=this.ctx.currentTime+.015,s=.145/e;return[0,1,2,3].forEach(a=>{const o=n+s*a;this._tone({when:o,frequency:a===3?470:Pe(720,980),endFrequency:a===3?250:Pe(370,520),duration:.035,gain:a===3?.11:.065,type:a===3?"triangle":"square",wet:.05,pan:i}),this._noise({when:o,duration:.022,gain:.055,filter:"bandpass",frequency:Pe(2100,3100),q:2,pan:i})}),!0}playHit(t={}){if(!this._ensureContext())return!1;typeof t=="string"&&(t={material:t});const e=t.material||"flesh",i=Ee(t.pan??0,-1,1),n=this.ctx.currentTime+.004;return e==="metal"?(this._tone({when:n,frequency:Pe(1750,2450),endFrequency:710,duration:.19,gain:.1,type:"triangle",wet:.4,pan:i}),this._noise({when:n,duration:.075,gain:.12,filter:"highpass",frequency:1900,q:2.5,wet:.24,pan:i})):e==="wood"?(this._noise({when:n,duration:.13,gain:.2,filter:"bandpass",frequency:780,endFrequency:230,q:1.2,pan:i}),this._tone({when:n,frequency:180,endFrequency:72,duration:.1,gain:.12,type:"triangle",pan:i})):(this._noise({when:n,duration:.13,gain:.23,filter:"lowpass",frequency:820,endFrequency:130,q:.7,pan:i}),this._tone({when:n,frequency:105,endFrequency:44,duration:.14,gain:.17,type:"sine",pan:i})),t.kill&&this._tone({when:n+.035,frequency:980,endFrequency:1320,duration:.15,gain:.045,type:"sine",wet:.12}),!0}playWhistle(t={}){if(!this._ensureContext())return!1;const e=Ee(t.pan??0,-1,1),i=this.ctx.currentTime+.015,n=t.notes||[1180,1510,1370,1760],s=[.19,.17,.2,.34];let a=i;return n.forEach((o,l)=>{const c=s[l]||.2;this._tone({when:a,frequency:o*Pe(.985,1.015),endFrequency:o*(l===n.length-1?.91:1.055),duration:c,gain:l===n.length-1?.075:.06,attack:.025,type:"sine",wet:.48,pan:e}),this._noise({when:a,duration:c,gain:.012,attack:.03,filter:"bandpass",frequency:o,q:8,wet:.5,pan:e}),a+=c*.72}),!0}playHorse(t={}){if(!this._ensureContext())return!1;typeof t=="number"&&(t={speed:t});const e=Ee(t.speed??1,.5,2.2),i=Ee(t.pan??0,-1,1),n=Math.max(1,Math.floor(t.steps??4)),s=[0,.16,.37,.5],a=this.ctx.currentTime+.01;for(let o=0;o<n;o+=1){const l=Math.floor(o/4),c=s[o%4]+l*.68;this._hoof(a+c/e,o%2?i+.08:i-.08,.82+o%3*.08)}return!0}_hoof(t,e,i=1){this._noise({when:t,duration:.075,gain:.15*i,filter:"bandpass",frequency:Pe(430,620),endFrequency:130,q:.9,pan:Ee(e,-1,1)}),this._tone({when:t,frequency:Pe(115,145),endFrequency:58,duration:.085,gain:.105*i,type:"triangle",pan:Ee(e,-1,1)})}playFootstep(t={}){if(!this._ensureContext())return!1;typeof t=="string"&&(t={surface:t});const e=t.surface||"dirt",i={dirt:470,wood:680,stone:930,brush:1250},n=i[e]||i.dirt,s=Ee(t.gain??.11,.01,.3);return this._noise({duration:e==="brush"?.11:.075,gain:s,filter:"bandpass",frequency:n*Pe(.86,1.12),endFrequency:n*.43,q:e==="stone"?2.2:.7,pan:t.pan??0,wet:e==="stone"?.12:0}),!0}playUI(t="click"){if(!this._ensureContext())return!1;t&&typeof t=="object"&&(t=t.type||"click");const e=this.ctx.currentTime+.003,i={hover:[510,610,.045,.025],click:[330,440,.075,.055],start:[240,620,.33,.09],confirm:[440,710,.18,.065],deny:[165,112,.17,.09],objective:[520,830,.24,.06]},[n,s,a,o]=i[t]||i.click;return this._tone({when:e,frequency:n,endFrequency:s,duration:a,gain:o,type:"triangle",wet:t==="start"?.22:.06}),(t==="start"||t==="objective")&&this._tone({when:e+.07,frequency:s*.75,endFrequency:s,duration:a*.9,gain:o*.55,type:"sine",wet:.28}),!0}playEmpty(){if(!this._ensureContext())return!1;const t=this.ctx.currentTime+.003;return this._tone({when:t,frequency:680,endFrequency:290,duration:.035,gain:.08,type:"square"}),this._tone({when:t+.055,frequency:390,endFrequency:240,duration:.028,gain:.05,type:"square"}),!0}playRicochet(t={}){if(!this._ensureContext())return!1;const e=t.pan??Pe(-.65,.65);return this._noise({duration:.035,gain:.09,filter:"highpass",frequency:2800,pan:e}),this._tone({frequency:Pe(1350,1850),endFrequency:Pe(2600,3300),duration:.28,gain:.075,type:"sine",wet:.58,pan:e}),!0}playPickup(){if(!this._ensureContext())return!1;const t=this.ctx.currentTime;return[440,554,660].forEach((e,i)=>{this._tone({when:t+i*.065,frequency:e,endFrequency:e*1.08,duration:.15,gain:.045,type:"sine",wet:.18})}),!0}playVictory(){if(!this._ensureContext())return!1;const t=this.ctx.currentTime+.02;return[196,247,294,392].forEach((e,i)=>{this._tone({when:t+i*.14,frequency:e,endFrequency:e*1.01,duration:.62,gain:.055,attack:.035,type:"triangle",wet:.52,pan:i%2?.12:-.12})}),!0}playDeath(){if(!this._ensureContext())return!1;const t=this.ctx.currentTime+.01;return[196,165,123].forEach((e,i)=>{this._tone({when:t+i*.2,frequency:e,endFrequency:e*.78,duration:.75,gain:.06,attack:.04,type:"triangle",wet:.6})}),!0}startAmbient(t={}){if(!this._ensureContext()||this.ambientPlaying)return this.ambientPlaying;this.ambientPlaying=!0;const e=this.ctx.currentTime,i=this.ctx.createBufferSource(),n=this.ctx.createBiquadFilter(),s=this.ctx.createBiquadFilter(),a=this.ctx.createGain(),o=this.ctx.createOscillator(),l=this.ctx.createGain(),c=this._makeOutput("ambient",.16,t.pan??.08);i.buffer=this.noiseBuffer,i.loop=!0,i.playbackRate.value=.74,n.type="highpass",n.frequency.value=75,s.type="lowpass",s.frequency.value=720,s.Q.value=.4,a.gain.setValueAtTime(1e-4,e),a.gain.linearRampToValueAtTime(t.wind??.065,e+2.4),o.type="sine",o.frequency.value=.085,l.gain.value=.024,i.connect(n),n.connect(s),s.connect(a),a.connect(c),o.connect(l),l.connect(a.gain),i.start(e,Pe(0,2)),o.start(e);const u=this.ctx.createBufferSource(),h=this.ctx.createBiquadFilter(),d=this.ctx.createGain(),p=this.ctx.createOscillator(),g=this.ctx.createGain(),_=this._makeOutput("ambient",.32,-.22);u.buffer=this.noiseBuffer,u.loop=!0,u.playbackRate.value=1.13,h.type="bandpass",h.frequency.value=1350,h.Q.value=.28,d.gain.setValueAtTime(1e-4,e),d.gain.linearRampToValueAtTime(.018,e+3.5),p.frequency.value=.14,g.gain.value=.009,u.connect(h),h.connect(d),d.connect(_),p.connect(g),g.connect(d.gain),u.start(e,Pe(0,2)),p.start(e);const m=this.ctx.createOscillator(),f=this.ctx.createGain();return m.type="sine",m.frequency.value=38,f.gain.setValueAtTime(1e-4,e),f.gain.linearRampToValueAtTime(.012,e+4),m.connect(f),f.connect(this.ambientBus),m.start(e),this._ambientNodes=[i,o,u,p,m],this._scheduleAmbientDetail(),!0}stopAmbient(t=1.2){if(!this.ctx||!this.ambientPlaying)return!1;this.ambientPlaying=!1,window.clearTimeout(this._ambientTimer);const e=this.ctx.currentTime,i=Math.max(.04,Number(t)||.04);return this.ambientBus.gain.cancelScheduledValues(e),this.ambientBus.gain.setValueAtTime(Math.max(1e-4,this.ambientBus.gain.value),e),this.ambientBus.gain.exponentialRampToValueAtTime(1e-4,e+i),this._ambientNodes.forEach(n=>{try{n.stop(e+i+.05)}catch{}}),this._ambientNodes=[],window.setTimeout(()=>{!this.ctx||this.destroyed||this.ambientPlaying||(this.ambientBus.gain.value=Ee(this.options.ambientVolume))},(i+.08)*1e3),!0}_scheduleAmbientDetail(){window.clearTimeout(this._ambientTimer),this.ambientPlaying&&(this._ambientTimer=window.setTimeout(()=>{if(!this.ambientPlaying||!this.ctx||this.ctx.state==="closed")return;const t=this.ctx.currentTime,e=Pe(-.8,.8);Math.random()>.48?(this._tone({when:t,frequency:Pe(920,1140),endFrequency:650,duration:.42,gain:.018,attack:.07,type:"sine",bus:"ambient",wet:.7,pan:e}),this._tone({when:t+.37,frequency:820,endFrequency:570,duration:.34,gain:.014,attack:.06,type:"sine",bus:"ambient",wet:.72,pan:e})):this._noise({when:t,duration:.48,gain:.026,attack:.08,filter:"bandpass",frequency:Pe(820,1450),endFrequency:280,q:1.1,bus:"ambient",wet:.46,pan:e}),this._scheduleAmbientDetail()},Pe(6200,13500)))}play(t,e){return{shot:()=>this.playShot(e),gunshot:()=>this.playShot(e),reload:()=>this.playReload(e),hit:()=>this.playHit(e),impact:()=>this.playHit(e),whistle:()=>this.playWhistle(e),horse:()=>this.playHorse(e),hoof:()=>this.playHorse({...typeof e=="object"?e:{},steps:1}),footstep:()=>this.playFootstep(e),ui:()=>this.playUI(e),empty:()=>this.playEmpty(),ricochet:()=>this.playRicochet(e),pickup:()=>this.playPickup(),victory:()=>this.playVictory(),death:()=>this.playDeath(),ambient:()=>this.startAmbient(e)}[String(t||"").toLowerCase()]?.()??!1}shot(t){return this.playShot(t)}playGunshot(t){return this.playShot(t)}reload(t){return this.playReload(t)}hit(t){return this.playHit(t)}whistle(t){return this.playWhistle(t)}horse(t){return this.playHorse(t)}playHoof(t={}){return this.playHorse({...typeof t=="object"?t:{},steps:1})}ui(t){return this.playUI(t)}ambient(t){return this.startAmbient(t)}playAmbient(t){return this.startAmbient(t)}playSound(t,e){return this.play(t,e)}setMaster(t,e=.06){if(this.options.masterVolume=Ee(Number(t)||0),!this.master||!this.ctx)return this;const i=this.muted?0:this.options.masterVolume;return this.master.gain.cancelScheduledValues(this.ctx.currentTime),this.master.gain.setTargetAtTime(i,this.ctx.currentTime,Math.max(.001,e)),this}setMasterVolume(t,e){return this.setMaster(t,e)}setVolume(t,e){return this.setMaster(t,e)}setSFXVolume(t){return this.options.sfxVolume=Ee(Number(t)||0),this.sfxBus&&this.ctx&&this.sfxBus.gain.setTargetAtTime(this.options.sfxVolume,this.ctx.currentTime,.03),this}setAmbientVolume(t){return this.options.ambientVolume=Ee(Number(t)||0),this.ambientBus&&this.ctx&&this.ambientBus.gain.setTargetAtTime(this.options.ambientVolume,this.ctx.currentTime,.12),this}setMuted(t=!0){return this.muted=t,this.setMaster(this.options.masterVolume,.025)}toggleMute(){return this.setMuted(!this.muted),this.muted}async destroy(){if(!this.destroyed){if(this.destroyed=!0,this._removeUnlockListeners(),window.clearTimeout(this._ambientTimer),this.ctx&&this.ctx.state!=="closed")try{await this.ctx.close()}catch{}this.ctx=null,this.master=null,this.sfxBus=null,this.ambientBus=null,this._ambientNodes=[]}}}const Nr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class us{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const rg=new $o(-1,1,1,-1,0,1);class ag extends se{constructor(){super(),this.setAttribute("position",new Gt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Gt([0,2,0,0,2,0],2))}}const og=new ag;class Jo{constructor(t){this._mesh=new qt(og,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,rg)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class ph extends us{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof ze?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ks.clone(t.uniforms),this.material=new ze({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Jo(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Rc extends us{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const n=t.getContext(),s=t.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class lg extends us{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class cg{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new ht);this._width=i.width,this._height=i.height,e=new xi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Hi}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ph(Nr),this.copyPass.material.blending=ki,this.clock=new oh}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const a=this.passes[n];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Rc!==void 0&&(a instanceof Rc?i=!0:a instanceof lg&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ht);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class hg extends us{constructor(t,e,i=null,n=null,s=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new _t}render(t,e,i){const n=t.autoClear;t.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(s=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=n}}const ug={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new _t(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class as extends us{constructor(t,e=1,i,n){super(),this.strength=e,this.radius=i,this.threshold=n,this.resolution=t!==void 0?new ht(t.x,t.y):new ht(256,256),this.clearColor=new _t(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new xi(s,a,{type:Hi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const h=new xi(s,a,{type:Hi});h.texture.name="UnrealBloomPass.h"+u,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);const d=new xi(s,a,{type:Hi});d.texture.name="UnrealBloomPass.v"+u,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),a=Math.round(a/2)}const o=ug;this.highPassUniforms=ks.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ze({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ht(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ks.clone(Nr.uniforms),this.blendMaterial=new ze({uniforms:this.copyUniforms,vertexShader:Nr.vertexShader,fragmentShader:Nr.fragmentShader,blending:Mi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new _t,this._oldClearAlpha=1,this._basic=new Ke,this._fsQuad=new Jo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),n=Math.round(e/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new ht(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(t,e,i,n,s){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),s&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=as.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=as.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new ze({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ht(.5,.5)},direction:{value:new ht(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new ze({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}as.BlurDirectionX=new ht(1,0);as.BlurDirectionY=new ht(0,1);const Er={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class dg extends us{constructor(){super(),this.uniforms=ks.clone(Er.uniforms),this.material=new Ju({name:Er.name,uniforms:this.uniforms,vertexShader:Er.vertexShader,fragmentShader:Er.fragmentShader}),this._fsQuad=new Jo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Yt.getTransfer(this._outputColorSpace)===te&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ic?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Uc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Nc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Xr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Oc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Bc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Fc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const fg={uniforms:{tDiffuse:{value:null},time:{value:0},damage:{value:0},focus:{value:0},resolution:{value:new ht(1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float damage;
    uniform float focus;
    uniform vec2 resolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uv = vUv;
      vec2 centered = uv - 0.5;
      float aberration = (0.00045 + damage * 0.0025) * length(centered);
      float r = texture2D(tDiffuse, uv + centered * aberration).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - centered * aberration).b;
      vec3 color = vec3(r, g, b);

      // Filmic frontier grade: warm highlights, cooler shadows, restrained saturation.
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(luma), color, 0.92);
      color *= mix(vec3(0.90, 0.96, 1.06), vec3(1.08, 1.01, 0.88), smoothstep(0.12, 0.82, luma));
      color = (color - 0.5) * 1.055 + 0.5;

      vec3 focusTone = vec3(luma * 1.18, luma * 0.89, luma * 0.57);
      color = mix(color, focusTone, focus * 0.34);

      float vignette = 1.0 - smoothstep(0.34, 0.82, dot(centered, centered) * 1.4);
      color *= mix(0.68 - focus * 0.14, 1.0, vignette);
      float grain = hash(uv * resolution + fract(time) * 913.7) - 0.5;
      color += grain * 0.018;
      color = mix(color, color * vec3(1.12, 0.34, 0.26), damage * (0.30 + (1.0 - vignette) * 0.45));
      gl_FragColor = vec4(max(color, 0.0), 1.0);
    }
  `};class pg{constructor(t,e,i){this.renderer=t,this.composer=new cg(t),this.renderPass=new hg(e,i),this.bloomPass=new as(new ht(1,1),.24,.62,.84),this.gradePass=new ph(fg),this.outputPass=new dg,this.composer.addPass(this.renderPass),this.composer.addPass(this.bloomPass),this.composer.addPass(this.gradePass),this.composer.addPass(this.outputPass),this.damage=0,this.focus=0,this.focusTarget=0,this.enabled=!0}resize(t,e,i=1){this.composer.setPixelRatio(i),this.composer.setSize(t,e),this.gradePass.uniforms.resolution.value.set(t*i,e*i)}flashDamage(t=1){this.damage=Math.min(1,this.damage+t)}setFocus(t){this.focusTarget=t?1:0}update(t,e){this.damage=Math.max(0,this.damage-t*1.7),this.focus=Kt.lerp(this.focus,this.focusTarget,1-Math.exp(-t*7)),this.gradePass.uniforms.damage.value=this.damage,this.gradePass.uniforms.focus.value=this.focus,this.gradePass.uniforms.time.value=e}render(t=0){this.composer.render(t)}dispose(){this.composer.dispose()}}const Pc=new T(0,1,0);new T;function mg(r,t,e=1){const i=r*2.399963+Math.random()*.45,n=.2+Math.random()*.8,s=Math.sqrt(Math.max(0,1-n*n)),a=new T(Math.cos(i)*s,n,Math.sin(i)*s);return t&&a.addScaledVector(t,.8).normalize(),a.multiplyScalar(e*(.5+Math.random()*.85))}class gg{constructor(t){this.scene=t,this.active=[],this.clock=0}muzzle(t,e){const i=new yt;i.position.copy(t);const n=new qt(new Yo(.16,0),new Ke({color:16761692,transparent:!0,opacity:1,blending:Mi,depthWrite:!1}));n.scale.set(.55,.55,2.4),n.quaternion.setFromUnitVectors(new T(0,0,1),e.clone().normalize()),i.add(n);const s=new Vs(16751163,7,7,2);i.add(s),this.scene.add(i),this.active.push({kind:"flash",object:i,life:.075,maxLife:.075})}tracer(t,e,i=!1){const n=e.clone().sub(t),s=n.length();if(s<.01)return;const a=t.clone().add(e).multiplyScalar(.5),o=new qt(new Vt(.009,.018,s,5,1,!0),new Ke({color:i?16768136:16773309,transparent:!0,opacity:.88,blending:Mi,depthWrite:!1}));o.position.copy(a),o.quaternion.setFromUnitVectors(Pc,n.normalize()),this.scene.add(o),this.active.push({kind:"tracer",object:o,life:.065,maxLife:.065})}impact(t,e=Pc,i=13933410,n=14){const s=new Float32Array(n*3),a=[];for(let u=0;u<n;u+=1)a.push(mg(u,e,2.2));const o=new se;o.setAttribute("position",new ke(s,3));const l=new qs({color:i,size:.075,sizeAttenuation:!0,transparent:!0,opacity:.85,depthWrite:!1,blending:nn}),c=new jr(o,l);c.position.copy(t),this.scene.add(c),this.active.push({kind:"particles",object:c,velocities:a,life:.55,maxLife:.55})}ring(t,e=16762219){const i=new qt(new Yr(.08,.1,24),new Ke({color:e,transparent:!0,opacity:.7,side:Je,depthWrite:!1}));i.position.copy(t),i.rotation.x=-Math.PI/2,this.scene.add(i),this.active.push({kind:"ring",object:i,life:.45,maxLife:.45})}update(t){this.clock+=t;for(let e=this.active.length-1;e>=0;e-=1){const i=this.active[e];i.life-=t;const n=Math.max(0,i.life/i.maxLife);if(i.kind==="particles"){const s=i.object.geometry.attributes.position;for(let a=0;a<i.velocities.length;a+=1){const o=i.velocities[a];o.y-=5.8*t,s.setXYZ(a,s.getX(a)+o.x*t,s.getY(a)+o.y*t,s.getZ(a)+o.z*t)}s.needsUpdate=!0,i.object.material.opacity=n*.85}else i.kind==="ring"?(i.object.scale.setScalar(1+(1-n)*7),i.object.material.opacity=n*.55):(i.object.scale.multiplyScalar(1+t*10),i.object.traverse(s=>{s.material&&(s.material.opacity=n),s.isLight&&(s.intensity=n*7)}));i.life<=0&&(this.scene.remove(i.object),i.object.traverse(s=>{s.geometry?.dispose?.(),s.material?.dispose?.()}),this.active.splice(e,1))}}dispose(){for(const t of this.active)this.scene.remove(t.object),t.object.traverse(e=>{e.geometry?.dispose?.(),e.material?.dispose?.()});this.active.length=0}}const Na=new T;class _g{constructor(t,e={}){this.scene=t,this.world=e,this.items=[],this.group=new yt,this.group.name="FrontierSupplies",t.add(this.group),this.materials={wood:new We({color:6042141,roughness:.9}),brass:new We({color:12947523,metalness:.72,roughness:.3,emissive:2954755,emissiveIntensity:.5}),glass:new Qu({color:9249819,roughness:.18,transmission:.12,transparent:!0,opacity:.88,emissive:4130563,emissiveIntensity:.7}),cork:new We({color:10449218,roughness:1}),glowAmmo:new Ke({color:15314002,transparent:!0,opacity:.22,blending:Mi,depthWrite:!1}),glowHealth:new Ke({color:12201249,transparent:!0,opacity:.24,blending:Mi,depthWrite:!1})},this.geometries={box:new Ae(.58,.25,.38),lid:new Ae(.62,.07,.42),bullet:new Vt(.025,.035,.19,8),bottle:new Vt(.11,.15,.42,12),neck:new Vt(.062,.075,.14,10),cork:new Vt(.055,.055,.08,8),glow:new fe(.56,12,8)}}_ground(t,e){for(const i of["getHeightAt","getHeight","getTerrainHeight","heightAt","sampleHeight"]){const n=this.world[i]?.call(this.world,t,e);if(Number.isFinite(n))return n}return 0}spawnAmmo(t,e=6){const i=new yt,n=new qt(this.geometries.box,this.materials.wood);n.castShadow=!0,n.receiveShadow=!0,i.add(n);const s=new qt(this.geometries.lid,this.materials.wood);s.position.y=.16,s.rotation.z=-.035,s.castShadow=!0,i.add(s);for(let a=0;a<5;a+=1){const o=new qt(this.geometries.bullet,this.materials.brass);o.position.set((a-2)*.085,.25+a%2*.03,0),i.add(o)}return i.add(new qt(this.geometries.glow,this.materials.glowAmmo)),this._add("ammo",i,t,e)}spawnTonic(t,e=28){const i=new yt,n=new qt(this.geometries.bottle,this.materials.glass);n.position.y=.22,n.castShadow=!0,i.add(n);const s=new qt(this.geometries.neck,this.materials.glass);s.position.y=.49,i.add(s);const a=new qt(this.geometries.cork,this.materials.cork);a.position.y=.59,i.add(a);const o=new qt(this.geometries.glow,this.materials.glowHealth);return o.position.y=.22,i.add(o),this._add("health",i,t,e)}_add(t,e,i,n){e.position.copy(i),e.position.y=this._ground(e.position.x,e.position.z)+.28,e.scale.setScalar(.01),this.group.add(e);const s={type:t,object:e,amount:n,age:0,phase:Math.random()*Math.PI*2,collected:!1};return this.items.push(s),s}update(t,e){const i=[];for(let n=this.items.length-1;n>=0;n-=1){const s=this.items[n];s.age+=t;const a=Math.min(1,s.age*5),o=1+Math.sin(s.age*3.2+s.phase)*.035;s.object.scale.setScalar(a*o),s.object.rotation.y+=t*.55;const l=this._ground(s.object.position.x,s.object.position.z);if(s.object.position.y=l+.3+Math.sin(s.age*2.15+s.phase)*.06,s.object.getWorldPosition(Na),e&&Na.distanceToSquared(e.position)<1.45*1.45){let c=!1;s.type==="ammo"?(e.refillAmmo?.(s.amount),c=!0):s.type==="health"&&e.health<e.maxHealth&&(c=(e.heal?.(s.amount)||0)>0),c&&(s.collected=!0,i.push({type:s.type,amount:s.amount,position:Na.clone()}),this.group.remove(s.object),this.items.splice(n,1))}}return i}clear(){for(const t of this.items)this.group.remove(t.object);this.items.length=0}dispose(){this.clear(),this.scene.remove(this.group),Object.values(this.geometries).forEach(t=>t.dispose()),Object.values(this.materials).forEach(t=>t.dispose())}}class vg{constructor(t){this.scene=t,this.group=new yt,this.group.name="ObjectiveMarker",this.group.visible=!1,t.add(this.group),this.material=new Ke({color:15185514,transparent:!0,opacity:.58,blending:Mi,depthWrite:!1,side:Je}),this.ring=new qt(new vi(.9,.035,7,52),this.material),this.ring.rotation.x=Math.PI/2,this.group.add(this.ring),this.inner=new qt(new Yr(.12,.22,24),this.material.clone()),this.inner.rotation.x=-Math.PI/2,this.inner.position.y=.03,this.group.add(this.inner);const e=new Float32Array(54);for(let n=0;n<18;n+=1){const s=n/18*Math.PI*2;e[n*3]=Math.cos(s)*(.2+Math.random()*.65),e[n*3+1]=Math.random()*1.4,e[n*3+2]=Math.sin(s)*(.2+Math.random()*.65)}const i=new se;i.setAttribute("position",new ke(e,3)),this.dust=new jr(i,new qs({color:15779454,size:.07,transparent:!0,opacity:.48,blending:Mi,depthWrite:!1})),this.group.add(this.dust),this._baseY=0}set(t,e=1.4){return t?(this.group.position.copy(t),this._baseY=t.y+.06,this.group.position.y=this._baseY,this.group.scale.setScalar(Math.max(.55,e/1.4)),this.group.visible=!0,this):this.hide()}hide(){return this.group.visible=!1,this}update(t,e,i){if(!this.group.visible)return;this.ring.rotation.z+=t*.32,this.inner.rotation.z-=t*.85,this.dust.rotation.y+=t*.2,this.dust.position.y=Math.sin(e*1.5)*.08;const n=i?i.distanceTo(this.group.position):10,s=Kt.clamp(n/10,.2,.7);this.material.opacity=s,this.inner.material.opacity=s*.82}dispose(){this.scene.remove(this.group),this.group.traverse(t=>{t.geometry?.dispose?.(),t.material?.dispose?.()})}}const Si=document.querySelector("#app"),bt=new ng(Si,{title:"DUSTBOUND",subtitle:"An Original Frontier Tale"}),he=new sg({masterVolume:.76,ambientVolume:.46});he.unlockOnGesture();const on=document.createElement("canvas");on.className="game-canvas";on.tabIndex=0;on.setAttribute("aria-label","Dustbound 3D game world");Si.prepend(on);let ai;try{ai=new W0({canvas:on,antialias:!1,alpha:!1,depth:!0,stencil:!1,powerPreference:"high-performance"})}catch(r){throw console.error(r),bt.showTitle(),bt.setLoading(!1),bt.showToast("This trail needs a browser with WebGL 2 enabled.","danger",1e4),r}ai.shadowMap.enabled=!0;ai.shadowMap.type=Lo;ai.outputColorSpace=Be;ai.toneMapping=Xr;ai.toneMappingExposure=1.08;ai.setClearColor(10115138,1);const Fi=new Wu,os=new ni(58,1,.08,520);os.position.set(4,4,31);const De=new q0(on,{lockOnClick:!0});De.setEnabled(!1);let ge,St,_e,Fe,ue,Qi,Is,tn,rn,$r,ve="loading",Gs=0,Ws=0,Xs=0,Ao="",ls=!1,Fr=!1;const xg=18;let As=0,Ar=0,Fa=8,Oi=Math.min(window.devicePixelRatio||1,1.65),mh=0,Cr=0;const Jn=new Set,si={shots:0,hits:0,kills:0,score:0},Mg=[{id:"ashes-in-the-wind",title:"ASHES IN THE WIND",description:"A cold trail leads back toward Cinder Creek.",reward:{ammo:12,health:18},objectives:[{id:"saddle-up",type:"mount",text:"Mount your horse"},{id:"ride-to-camp",type:"reach",text:"Ride to the abandoned camp",target:"homestead",radius:6.5},{id:"inspect-camp",type:"interact",text:"Inspect the dying campfire",target:"campfire"},{id:"camp-ambush",type:"eliminate",text:"Survive the ridge ambush",count:4,encounter:"camp"}]},{id:"the-bell-tolls",title:"THE BELL TOLLS",description:"Cinder Creek has one street and nowhere left to run.",reward:{ammo:18,health:30},objectives:[{id:"return-to-town",type:"reach",text:"Return to the sheriff in Cinder Creek",target:"sheriff",radius:6},{id:"warn-sheriff",type:"interact",text:"Warn Sheriff Mercer",target:"sheriff"},{id:"hold-main-street",type:"eliminate",text:"Defend the main street",count:6,encounter:"town"}]},{id:"last-light",title:"LAST LIGHT",description:"The man behind the raid waits beyond the red ravine.",reward:{score:1500},objectives:[{id:"ride-to-ravine",type:"reach",text:"Ride to Kessler’s ravine",target:"ravine",radius:8},{id:"final-showdown",type:"eliminate",text:"Bring down Silas Kessler and his riders",count:4,encounter:"ravine"},{id:"ride-for-home",type:"escape",text:"Reach the windmill overlook",target:"overlook",radius:7}]}];function en(r,t){return new T(r,ge.getHeightAt(r,t)+.03,t)}function Dc(r){return ge.interactables.find(t=>t.id===r)||null}function yg(){const r=Dc("campfire")?.position?.clone()||en(-30,-22),t=Dc("sheriff")?.position?.clone()||en(-8,12);return{homestead:r.clone(),campfire:r,sheriff:t,town:ge.townCenter.clone(),ravine:en(72,-58),overlook:en(45,48)}}function Sg(r){return({camp:[[-43,-31],[-42,-12],[-21,-34],[-16,-18]],town:[[-31,18],[29,19],[-29,-9],[29,-13],[-2,-34],[3,39]],ravine:[[60,-68],[84,-61],[79,-43],[66,-45]]}[r]||[]).map(([e,i])=>en(e,i))}function wg(r){Fe.clear(!0);const t=Sg(r);t.forEach((e,i)=>{const n=r==="ravine"&&i===t.length-1;Fe.spawn(e,n?{id:"silas-kessler",health:210,damage:17,accuracy:.76,moveSpeed:3.3,preferredDistance:14}:{health:r==="town"?88:76,damage:r==="ravine"?13:10.5,accuracy:r==="ravine"?.68:.59})}),Fe.alertAll(St.position),bt.setWanted(r==="ravine"?5:3,r==="ravine"?"DEADLY":"OUTLAWS"),r==="camp"?bt.setSubtitle("That fire was bait. Riders—on the ridge!",{speaker:"ROWAN VALE",duration:4200}):r==="town"?bt.setSubtitle("Hold the street! Don’t let them reach the bank!",{speaker:"SHERIFF MERCER",duration:4300}):r==="ravine"&&bt.setSubtitle("You crossed a long stretch of nothing just to die tired.",{speaker:"SILAS KESSLER",duration:4600})}function gh(){const r=ue.activeObjective;if(!r||!["reach","escape","interact"].includes(r.type)){rn.hide();return}const t=ue.getTargetPosition({player:St,enemies:Fe,horse:_e,world:ge,locations:$r});t?rn.set(t,r.radius||2.3):rn.hide()}function Co(){const r=ue.activeObjective;if(!r)return"";if(ue.progressText)return ue.progressText;if(["reach","escape"].includes(r.type)){const t=ue.getTargetPosition({player:St,enemies:Fe,horse:_e,world:ge,locations:$r});if(t)return`${Math.max(0,Math.round(Math.hypot(St.position.x-t.x,St.position.z-t.z)))} m`}return r.type==="interact"?"Press E when you are close":""}function bg(){St.on("shoot",r=>{si.shots+=1,he.playShot({intensity:St.isAiming?1:1.08});const t=Fe.handleShot(r,r.damage),e=t?.point?.clone()||r.ray.ray.at(Math.min(r.ray.far||180,180),new T);Is.tracer(r.muzzle,e,!!t?.enemy),t?.blocked&&Math.random()>.55&&he.playRicochet()}),St.on("reloadStart",()=>he.playReload()),St.on("empty",()=>he.playEmpty()),St.on("footstep",r=>{const t=ge.getGroundMaterialAt(r.position.x,r.position.z);he.playFootstep({surface:t,gain:r.sprinting?.15:.1})}),St.on("damage",()=>{bt.damageFlash(),Qi?.flashDamage(.88),he.playHit({material:"flesh"})}),St.on("death",()=>Cg()),St.on("mount",r=>{ue.handleEvent(r),he.playHorse({steps:2}),bt.showToast("Saddle ready — hold Shift to gallop","info")}),St.on("dismount",r=>ue.handleEvent(r)),St.on("interact",()=>Tg()),_e.on("hoofbeat",r=>he.playHorse({speed:r.speed,steps:1})),_e.on("jump",()=>he.playHorse({speed:1,steps:2})),Fe.on("enemyShot",r=>{const t=r.enemy.position.x-St.position.x;he.playShot({distant:!0,intensity:.55,pan:Kt.clamp(t/25,-.85,.85)})}),Fe.on("enemyHit",r=>{si.hits+=1,si.score+=r.hitZone==="head"?180:85,bt.hitmarker(r.killed),he.playHit({kill:r.killed})}),Fe.on("enemyKilled",r=>{si.kills+=1,si.score+=r.hitZone==="head"?320:200,ue.handleEvent(r),Math.random()<.34?tn.spawnAmmo(r.enemy.position.clone(),4+Math.floor(Math.random()*4)):Math.random()<.2&&tn.spawnTonic(r.enemy.position.clone(),22)}),Fe.on("waveCleared",r=>{ue.handleEvent(r),bt.setWanted(0)}),ue.on("missionStarted",({mission:r})=>{bt.showToast(r.title,"chapter",3800),bt.setSubtitle(r.description,{speaker:"CHAPTER",duration:3700})}),ue.on("objectiveStarted",({objective:r})=>{bt.setObjective(r.text,Co()),gh(),r.encounter&&wg(r.encounter)}),ue.on("objectiveProgress",()=>{const r=Co();bt.parts.objectiveDetail.textContent=r,bt.parts.objectiveDetail.hidden=!r}),ue.on("objectiveCompleted",({objective:r})=>{rn.hide(),bt.showToast(`Complete — ${r.text}`,"success",1900),he.playUI("confirm"),r.id==="inspect-camp"?bt.setSubtitle("Boot prints. Six horses, headed east. Cinder Creek.",{speaker:"ROWAN VALE",duration:3900}):r.id==="warn-sheriff"?bt.setSubtitle("Kessler wants the bank. You want answers. Seems our roads meet.",{speaker:"SHERIFF MERCER",duration:4700}):r.id==="final-showdown"&&bt.setSubtitle("It’s over. Ride for the windmill before the storm breaks.",{speaker:"ROWAN VALE",duration:4100})}),ue.on("missionCompleted",({mission:r,reward:t})=>{t?.ammo&&St.refillAmmo(t.ammo),t?.health&&St.heal(t.health),t?.score&&(si.score+=t.score),bt.showToast(`${r.title} complete`,"chapter",3100)}),ue.on("campaignCompleted",()=>Rg())}function _h(){let r=null,t=1/0;for(const e of ge.interactables){const i=e.position.distanceTo(St.position);i<=(e.radius||2.4)&&i<t&&(r=e,t=i)}return r}function Tg(){if(Xs>0)return;Xs=.55;const r=_h();if(!r)return;const t=ue.activeObjective;if(t?.type==="interact"&&(!t.target||t.target===r.id)){ue.handleEvent("interact",{id:r.id,target:r.id,item:r});return}if(Jn.has(r.id)){const e=r.id==="trough"?"The trough is dry.":r.id==="saloon"?"The bartender has nothing else to spare.":"Those shelves have been picked clean.";bt.showToast(e,"info");return}if(r.id==="trough"){const e=St.heal(24);bt.showToast(e?`Recovered ${Math.round(e)} health`:"Already at full health",e?"success":"info"),e&&(Jn.add(r.id),he.playPickup())}else if(["generalStore","outfitter"].includes(r.id))Jn.add(r.id),St.refillAmmo(6),he.playPickup(),bt.showToast("Collected 6 revolver rounds","success");else if(r.id==="saloon"){const e=St.heal(12);e?(Jn.add(r.id),he.playPickup(),bt.showToast(`Recovered ${Math.round(e)} health`,"success")):bt.setSubtitle("Town’s closed until the shooting stops.",{speaker:"BARTENDER",duration:2600})}else r.id==="campfire"?bt.setSubtitle("Ash, horsehair… and fresh tracks heading east.",{speaker:"ROWAN VALE",duration:3100}):bt.setSubtitle(`${r.label||"This place"} has seen quieter days.`,{duration:2400})}function Eg(){let r="";if(St.isMounted)r="Dismount";else if(_e.canMount(St.position))r="Mount Ash";else{const t=_h();if(t){const e=ue.activeObjective;e?.type==="interact"&&e.target===t.id?r=t.id==="campfire"?"Inspect the fire":t.id==="sheriff"?"Speak to Sheriff Mercer":`Inspect ${t.label}`:Jn.has(t.id)?r="Inspect depleted supplies":t.id==="trough"?r="Drink from the trough":["generalStore","outfitter"].includes(t.id)?r="Collect ammunition":t.id==="saloon"?r="Check the saloon":r=`Inspect ${t.label||t.id}`}}r!==Ao&&(Ao=r,bt.setPrompt(r,"E"))}function Ro(){Ws=0,Gs=0,performance.now(),Xs=0,Ao="",ls=!1,Fr=!1,Si.classList.remove("is-focus"),Jn.clear(),Object.assign(si,{shots:0,hits:0,kills:0,score:0}),Fe.reset(),tn.clear(),St.respawn(ge.playerSpawn),St.health=St.maxHealth,St.ammo=St.maxAmmo,St.reserveAmmo=42,St.stamina=St.maxStamina,_e.setRider(null),_e.position.copy(ge.horseSpawn),_e.heading=Math.PI*.74,_e.object.rotation.y=_e.heading,_e.resetTransientState({snapToGround:!0}),_e.health=_e.maxHealth,_e.stamina=_e.maxStamina,tn.spawnAmmo(en(-4,14),8),tn.spawnTonic(en(-29,-20),25),tn.spawnAmmo(en(58,-53),10),ue.reset(!1),ue.start(0),rn.hide(),gh(),bt.hideEnd(),bt.showHUD(!0),bt.setWanted(0),bt.setReticle(!1),ve="playing",De.setEnabled(!0),De.requestPointerLock(),he.resume(),he.startAmbient()}function Ag(){return{time:Gs,kills:si.kills,accuracy:si.shots?si.hits/si.shots:0,score:si.score+Math.max(0,Math.round(2200-Gs*8))}}function Cg(){ve==="playing"&&(ve="dying",Ws=1.5,ls=!1,De.setEnabled(!1),Si.classList.remove("is-focus"),bt.setPrompt(""),bt.setWanted(0),he.playDeath())}function Rg(){["playing","dying"].includes(ve)&&(ve="winning",Ws=1.35,ls=!1,De.setEnabled(!1),Si.classList.remove("is-focus"),bt.setCinematic(!0),bt.setPrompt(""),bt.setWanted(0),he.playVictory())}function Pg(r){ve="ended",De.exitPointerLock(),rn.hide(),bt.setCinematic(!1),bt.showEnd(r,Ag(),Ro)}function Dg(){const r=St.isMounted?_e:St;bt.updateHUD({health:St.health,maxHealth:St.maxHealth,stamina:r.stamina,maxStamina:r.maxStamina,ammo:{current:St.ammo,reserve:St.reserveAmmo,reloading:St.isReloading,weapon:"Ironwood Revolver"},wanted:Fe.alive?Math.min(5,2+Math.ceil(Fe.alive/3)):0,reticle:{visible:St.isAiming,spread:St.isAiming?7:18}});const t=Co();bt.parts.objectiveDetail.textContent!==t&&(bt.parts.objectiveDetail.textContent=t,bt.parts.objectiveDetail.hidden=!t)}function Qo(){const r=Math.max(1,Si.clientWidth||window.innerWidth),t=Math.max(1,Si.clientHeight||window.innerHeight);os.aspect=r/t,os.updateProjectionMatrix(),ai.setPixelRatio(Oi),ai.setSize(r,t,!1),Qi?.resize(r,t,Oi)}function Lg(r){if(ve!=="playing"||document.hidden){As=0,Ar=0;return}if(As+=1,Ar+=r,Fa-=r,As<150||Fa>0)return;const t=As/Math.max(Ar,.001),e=Math.min(window.devicePixelRatio||1,1.65);let i=Oi;t<43&&Oi>.72?i=Math.max(.72,Oi-.14):t>57&&Oi<e&&(i=Math.min(e,Oi+.08)),As=0,Ar=0,Fa=6,Math.abs(i-Oi)>.01&&(Oi=i,Qo())}const Po=new oh;function Ig(){mh+=1;const r=Po.getDelta(),t=Math.min(r,.05),e=Po.elapsedTime,i=ve==="playing"||ve==="dying"||ve==="winning";if(i)Cr=0;else{if(Cr+=r,Cr<1/12)return;Cr=0}if(Xs=Math.max(0,Xs-t),ve==="playing"){De.update();const n=De.isDown("KeyF");(!n||St.stamina>=xg)&&(Fr=!1);const s=!St.isMounted&&!Fr&&n&&(De.buttonDown(2)||De.isDown("Aim"))&&St.stamina>2;ls=s,Si.classList.toggle("is-focus",s);const o=t*(s?.42:1);s&&(St.stamina=Math.max(0,St.stamina-t*27),St.stamina<=2&&(Fr=!0)),St.update(o),_e.update(o),Fe.update(o,St),ue.update(o,{player:St,enemies:Fe,horse:_e,world:ge,locations:$r});for(const l of tn.update(o,St))he.playPickup(),bt.showToast(l.type==="ammo"?`Picked up ${l.amount} rounds`:`Recovered ${l.amount} health`,"success"),ue.handleEvent("itemCollected",{item:l.type,amount:l.amount}),Is.ring(l.position,l.type==="ammo"?15185514:12203048);Is.update(o),rn.update(o,Gs,St.position),Eg(),Dg(),Fe.consumeEvents(),ue.consumeEvents(),Gs+=o,De.endFrame()}else(ve==="dying"||ve==="winning")&&(Ws-=Math.min(r,.25),St.update(t),_e.update(t),Is.update(t),Ws<=0&&Pg(ve==="winning"?"victory":"death"));ge&&i&&ge.update(t,e,St?.position),Qi?.setFocus(ls&&ve==="playing"),Qi?.update(t,e),Qi?Qi.render(t):ai.render(Fi,os),Lg(t)}async function Ug(){bt.showTitle(),bt.setLoading(.08,"Surveying the frontier…"),await new Promise(r=>requestAnimationFrame(r)),ge=new X0(Fi,ai),await ge.init(),bt.setLoading(.68,"Saddling the horses…"),await new Promise(r=>requestAnimationFrame(r)),$r=yg(),St=new K0(Fi,os,De,ge,{position:ge.playerSpawn,heading:Math.PI}),_e=new J0(Fi,ge,{position:ge.horseSpawn,name:"Ash",heading:Math.PI*.74}),ge.horse=_e,ge.horses=[_e],St.setHorse(_e),Fe=new tg(Fi,ge,{autoSpawn:!1,spawnPoints:ge.enemySpawns}),ue=new eg({missions:Mg,autoStart:!1,autoAdvance:!0,autoAdvanceDelay:2.1}),Is=new gg(Fi),tn=new _g(Fi,ge),rn=new vg(Fi);try{Qi=new pg(ai,Fi,os)}catch(r){console.warn("Post-processing unavailable; using direct rendering.",r),Qi=null}bg(),Qo(),bt.setLoading(1,"The trail is ready"),ve="title",bt.onStart(()=>{De.setEnabled(!0),De.requestPointerLock(),he.init().then(()=>he.startAmbient()),Ro()}),ai.setAnimationLoop(Ig),window.__DUSTBOUND__={get state(){return ve},get player(){return St},get horse(){return _e},get enemies(){return Fe},get missions(){return ue},get world(){return ge},get input(){return De},get stats(){return{...si}},get frame(){return mh},start:Ro}}Si.addEventListener("ui:pause",()=>{ve==="playing"&&(ve="paused",ls=!1,Si.classList.remove("is-focus"),De.setEnabled(!1),De.exitPointerLock(),he.suspend())});Si.addEventListener("ui:resume",()=>{ve==="paused"&&(ve="playing",De.setEnabled(!0),De.requestPointerLock(),he.resume(),Po.getDelta())});window.addEventListener("resize",Qo);window.addEventListener("keydown",r=>{if(r.code==="KeyM"&&!r.repeat){const t=he.toggleMute();bt.showToast(t?"Sound muted":"Sound restored","info",1400)}});document.addEventListener("visibilitychange",()=>{document.hidden&&ve==="playing"&&bt.togglePause(!0)});on.addEventListener("webglcontextlost",r=>{r.preventDefault(),ve==="playing"&&bt.togglePause(!0),bt.showToast("The renderer paused while graphics recover.","warning",6e3)});on.addEventListener("webglcontextrestored",()=>window.location.reload());Ug().catch(r=>{console.error("Dustbound failed to boot:",r),ve="error",bt.setLoading(!1),bt.showToast("The frontier failed to load. Refresh and try again.","danger",1e4)});
//# sourceMappingURL=index-CVemqoVj.js.map
