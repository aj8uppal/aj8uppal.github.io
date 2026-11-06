(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sl="170",jd=0,Hl=1,Xd=2,Ph=1,Dh=2,Di=3,Vi=0,Lt=1,Gt=2,zi=0,an=1,Mt=2,Gl=3,Vl=4,qd=5,bn=100,$d=101,Kd=102,Yd=103,Jd=104,Qd=200,Zd=201,eu=202,tu=203,ao=204,ro=205,iu=206,nu=207,su=208,au=209,ru=210,ou=211,lu=212,cu=213,hu=214,oo=0,lo=1,co=2,ts=3,ho=4,uo=5,fo=6,po=7,Lh=0,du=1,uu=2,Bi=0,fu=1,pu=2,mu=3,gu=4,vu=5,bu=6,xu=7,Wl="attached",_u="detached",kh=300,is=301,ns=302,mo=303,go=304,rr=306,yn=1e3,nn=1001,$a=1002,kt=1003,Ih=1004,Is=1005,Vt=1006,Ba=1007,pi=1008,Wi=1009,Fh=1010,Uh=1011,Xs=1012,al=1013,Mn=1014,ai=1015,Hi=1016,rl=1017,ol=1018,ss=1020,Nh=35902,Oh=1021,zh=1022,Yt=1023,Bh=1024,Hh=1025,Kn=1026,as=1027,ll=1028,cl=1029,Gh=1030,hl=1031,dl=1033,Ha=33776,Ga=33777,Va=33778,Wa=33779,vo=35840,bo=35841,xo=35842,_o=35843,yo=36196,Mo=37492,So=37496,wo=37808,To=37809,Ao=37810,Eo=37811,Ro=37812,Co=37813,Po=37814,Do=37815,Lo=37816,ko=37817,Io=37818,Fo=37819,Uo=37820,No=37821,ja=36492,Oo=36494,zo=36495,Vh=36283,Bo=36284,Ho=36285,Go=36286,Wh=2200,jh=2201,yu=2202,qs=2300,$s=2301,pr=2302,Xn=2400,qn=2401,Ka=2402,ul=2500,Mu=2501,Su=0,Xh=1,Vo=2,wu=3200,Tu=3201,qh=0,Au=1,Fi="",ct="srgb",It="srgb-linear",or="linear",tt="srgb",Tn=7680,jl=519,Eu=512,Ru=513,Cu=514,$h=515,Pu=516,Du=517,Lu=518,ku=519,Wo=35044,mr=35048,Xl="300 es",Ui=2e3,Ya=2001;class Sn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const n=this._listeners[e];if(n!==void 0){const s=n.indexOf(t);s!==-1&&n.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let s=0,r=n.length;s<r;s++)n[s].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ql=1234567;const Ns=Math.PI/180,rs=180/Math.PI;function ri(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[a&255]+Tt[a>>8&255]+Tt[a>>16&255]+Tt[a>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function gt(a,e,t){return Math.max(e,Math.min(t,a))}function fl(a,e){return(a%e+e)%e}function Iu(a,e,t,i,n){return i+(a-e)*(n-i)/(t-e)}function Fu(a,e,t){return a!==e?(t-a)/(e-a):0}function Os(a,e,t){return(1-t)*a+t*e}function Uu(a,e,t,i){return Os(a,e,1-Math.exp(-t*i))}function Nu(a,e=1){return e-Math.abs(fl(a,e*2)-e)}function Ou(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*(3-2*a))}function zu(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*a*(a*(a*6-15)+10))}function Bu(a,e){return a+Math.floor(Math.random()*(e-a+1))}function Hu(a,e){return a+Math.random()*(e-a)}function Gu(a){return a*(.5-Math.random())}function Vu(a){a!==void 0&&(ql=a);let e=ql+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wu(a){return a*Ns}function ju(a){return a*rs}function Xu(a){return(a&a-1)===0&&a!==0}function qu(a){return Math.pow(2,Math.ceil(Math.log(a)/Math.LN2))}function $u(a){return Math.pow(2,Math.floor(Math.log(a)/Math.LN2))}function Ku(a,e,t,i,n){const s=Math.cos,r=Math.sin,o=s(t/2),c=r(t/2),l=s((e+i)/2),h=r((e+i)/2),d=s((e-i)/2),u=r((e-i)/2),f=s((i-e)/2),g=r((i-e)/2);switch(n){case"XYX":a.set(o*h,c*d,c*u,o*l);break;case"YZY":a.set(c*u,o*h,c*d,o*l);break;case"ZXZ":a.set(c*d,c*u,o*h,o*l);break;case"XZX":a.set(o*h,c*g,c*f,o*l);break;case"YXY":a.set(c*f,o*h,c*g,o*l);break;case"ZYZ":a.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function si(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("Invalid component type.")}}function et(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("Invalid component type.")}}const Yu={DEG2RAD:Ns,RAD2DEG:rs,generateUUID:ri,clamp:gt,euclideanModulo:fl,mapLinear:Iu,inverseLerp:Fu,lerp:Os,damp:Uu,pingpong:Nu,smoothstep:Ou,smootherstep:zu,randInt:Bu,randFloat:Hu,randFloatSpread:Gu,seededRandom:Vu,degToRad:Wu,radToDeg:ju,isPowerOfTwo:Xu,ceilPowerOfTwo:qu,floorPowerOfTwo:$u,setQuaternionFromProperEuler:Ku,normalize:et,denormalize:si};class Z{constructor(e=0,t=0){Z.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(gt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*i-r*n+e.x,this.y=s*n+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,t,i,n,s,r,o,c,l){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,r,o,c,l)}set(e,t,i,n,s,r,o,c,l){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=s,h[5]=c,h[6]=i,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,s=this.elements,r=i[0],o=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],b=n[0],m=n[3],p=n[6],v=n[1],_=n[4],x=n[7],A=n[2],w=n[5],R=n[8];return s[0]=r*b+o*v+c*A,s[3]=r*m+o*_+c*w,s[6]=r*p+o*x+c*R,s[1]=l*b+h*v+d*A,s[4]=l*m+h*_+d*w,s[7]=l*p+h*x+d*R,s[2]=u*b+f*v+g*A,s[5]=u*m+f*_+g*w,s[8]=u*p+f*x+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*r*h-t*o*l-i*s*h+i*o*c+n*s*l-n*r*c}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=h*r-o*l,u=o*c-h*s,f=l*s-r*c,g=t*d+i*u+n*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/g;return e[0]=d*b,e[1]=(n*l-h*i)*b,e[2]=(o*i-n*r)*b,e[3]=u*b,e[4]=(h*t-n*c)*b,e[5]=(n*s-o*t)*b,e[6]=f*b,e[7]=(i*c-l*t)*b,e[8]=(r*t-i*s)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,s,r,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*r+l*o)+r+e,-n*l,n*c,-n*(-l*r+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(gr.makeScale(e,t)),this}rotate(e){return this.premultiply(gr.makeRotation(-e)),this}translate(e,t){return this.premultiply(gr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const gr=new ke;function Kh(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function Ks(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function Ju(){const a=Ks("canvas");return a.style.display="block",a}const $l={};function Fs(a){a in $l||($l[a]=!0,console.warn(a))}function Qu(a,e,t){return new Promise(function(i,n){function s(){switch(a.clientWaitSync(e,a.SYNC_FLUSH_COMMANDS_BIT,0)){case a.WAIT_FAILED:n();break;case a.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function Zu(a){const e=a.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ef(a){const e=a.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const He={enabled:!0,workingColorSpace:It,spaces:{},convert:function(a,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===tt&&(a.r=Gi(a.r),a.g=Gi(a.g),a.b=Gi(a.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(a.applyMatrix3(this.spaces[e].toXYZ),a.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===tt&&(a.r=Yn(a.r),a.g=Yn(a.g),a.b=Yn(a.b))),a},fromWorkingColorSpace:function(a,e){return this.convert(a,this.workingColorSpace,e)},toWorkingColorSpace:function(a,e){return this.convert(a,e,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===Fi?or:this.spaces[a].transfer},getLuminanceCoefficients:function(a,e=this.workingColorSpace){return a.fromArray(this.spaces[e].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,e,t){return a.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace}};function Gi(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function Yn(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}const Kl=[.64,.33,.3,.6,.15,.06],Yl=[.2126,.7152,.0722],Jl=[.3127,.329],Ql=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zl=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);He.define({[It]:{primaries:Kl,whitePoint:Jl,transfer:or,toXYZ:Ql,fromXYZ:Zl,luminanceCoefficients:Yl,workingColorSpaceConfig:{unpackColorSpace:ct},outputColorSpaceConfig:{drawingBufferColorSpace:ct}},[ct]:{primaries:Kl,whitePoint:Jl,transfer:tt,toXYZ:Ql,fromXYZ:Zl,luminanceCoefficients:Yl,outputColorSpaceConfig:{drawingBufferColorSpace:ct}}});let An;class tf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{An===void 0&&(An=Ks("canvas")),An.width=e.width,An.height=e.height;const i=An.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=An}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ks("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),s=n.data;for(let r=0;r<s.length;r++)s[r]=Gi(s[r]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Gi(t[i]/255)*255):t[i]=Gi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nf=0;class Yh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=ri(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let r=0,o=n.length;r<o;r++)n[r].isDataTexture?s.push(vr(n[r].image)):s.push(vr(n[r]))}else s=vr(n);i.url=s}return t||(e.images[this.uuid]=i),i}}function vr(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?tf.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let sf=0;class bt extends Sn{constructor(e=bt.DEFAULT_IMAGE,t=bt.DEFAULT_MAPPING,i=nn,n=nn,s=Vt,r=pi,o=Yt,c=Wi,l=bt.DEFAULT_ANISOTROPY,h=Fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=ri(),this.name="",this.source=new Yh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Z(0,0),this.repeat=new Z(1,1),this.center=new Z(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==kh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yn:e.x=e.x-Math.floor(e.x);break;case nn:e.x=e.x<0?0:1;break;case $a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yn:e.y=e.y-Math.floor(e.y);break;case nn:e.y=e.y<0?0:1;break;case $a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=kh;bt.DEFAULT_ANISOTROPY=1;class $e{constructor(e=0,t=0,i=0,n=1){$e.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n+r[12]*s,this.y=r[1]*t+r[5]*i+r[9]*n+r[13]*s,this.z=r[2]*t+r[6]*i+r[10]*n+r[14]*s,this.w=r[3]*t+r[7]*i+r[11]*n+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,s;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],b=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-b)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+b)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(l+1)/2,x=(f+1)/2,A=(p+1)/2,w=(h+u)/4,R=(d+b)/4,P=(g+m)/4;return _>x&&_>A?_<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(_),n=w/i,s=R/i):x>A?x<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(x),i=w/n,s=P/n):A<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(A),i=R/s,n=P/s),this.set(i,n,s,t),this}let v=Math.sqrt((m-g)*(m-g)+(d-b)*(d-b)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-b)/v,this.z=(u-h)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class af extends Sn{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new $e(0,0,e,t),this.scissorTest=!1,this.viewport=new $e(0,0,e,t);const n={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new bt(n,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,n=e.textures.length;i<n;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Yh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends af{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Jh extends bt{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=kt,this.minFilter=kt,this.wrapR=nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class rf extends bt{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=kt,this.minFilter=kt,this.wrapR=nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nt{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,s,r,o){let c=i[n+0],l=i[n+1],h=i[n+2],d=i[n+3];const u=s[r+0],f=s[r+1],g=s[r+2],b=s[r+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=f,e[t+2]=g,e[t+3]=b;return}if(d!==b||c!==u||l!==f||h!==g){let m=1-o;const p=c*u+l*f+h*g+d*b,v=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const A=Math.sqrt(_),w=Math.atan2(A,p*v);m=Math.sin(m*w)/A,o=Math.sin(o*w)/A}const x=o*v;if(c=c*m+u*x,l=l*m+f*x,h=h*m+g*x,d=d*m+b*x,m===1-o){const A=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=A,l*=A,h*=A,d*=A}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,n,s,r){const o=i[n],c=i[n+1],l=i[n+2],h=i[n+3],d=s[r],u=s[r+1],f=s[r+2],g=s[r+3];return e[t]=o*g+h*d+c*f-l*u,e[t+1]=c*g+h*u+l*d-o*f,e[t+2]=l*g+h*f+o*u-c*d,e[t+3]=h*g-o*d-c*u-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,s=e._z,r=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(n/2),d=o(s/2),u=c(i/2),f=c(n/2),g=c(s/2);switch(r){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],s=t[8],r=t[1],o=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(r-n)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-c)/f,this._x=.25*f,this._y=(n+r)/f,this._z=(s+l)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(s-l)/f,this._x=(n+r)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(r-n)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(gt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,s=e._z,r=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=i*h+r*o+n*l-s*c,this._y=n*h+r*c+s*o-i*l,this._z=s*h+r*l+i*c-n*o,this._w=r*h-i*o-n*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,n=this._y,s=this._z,r=this._w;let o=r*e._w+i*e._x+n*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=i,this._y=n,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-t;return this._w=f*r+t*this._w,this._x=f*i+t*this._x,this._y=f*n+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),d=Math.sin((1-t)*h)/l,u=Math.sin(t*h)/l;return this._w=r*d+this._w*u,this._x=i*d+this._x*u,this._y=n*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(e=0,t=0,i=0){T.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ec.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ec.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*n,this.y=s[1]*t+s[4]*i+s[7]*n,this.z=s[2]*t+s[5]*i+s[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,s=e.elements,r=1/(s[3]*t+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*n+s[12])*r,this.y=(s[1]*t+s[5]*i+s[9]*n+s[13])*r,this.z=(s[2]*t+s[6]*i+s[10]*n+s[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,s=e.x,r=e.y,o=e.z,c=e.w,l=2*(r*n-o*i),h=2*(o*t-s*n),d=2*(s*i-r*t);return this.x=t+c*l+r*d-o*h,this.y=i+c*h+o*l-s*d,this.z=n+c*d+s*h-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*n,this.y=s[1]*t+s[5]*i+s[9]*n,this.z=s[2]*t+s[6]*i+s[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,s=e.z,r=t.x,o=t.y,c=t.z;return this.x=n*c-s*o,this.y=s*r-i*c,this.z=i*o-n*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return br.copy(this).projectOnVector(e),this.sub(br)}reflect(e){return this.sub(br.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(gt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const br=new T,ec=new Nt;class xi{constructor(e=new T(1/0,1/0,1/0),t=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,Zt):Zt.fromBufferAttribute(s,r),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ra.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ra.copy(i.boundingBox)),ra.applyMatrix4(e.matrixWorld),this.union(ra)}const n=e.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),oa.subVectors(this.max,ys),En.subVectors(e.a,ys),Rn.subVectors(e.b,ys),Cn.subVectors(e.c,ys),$i.subVectors(Rn,En),Ki.subVectors(Cn,Rn),ln.subVectors(En,Cn);let t=[0,-$i.z,$i.y,0,-Ki.z,Ki.y,0,-ln.z,ln.y,$i.z,0,-$i.x,Ki.z,0,-Ki.x,ln.z,0,-ln.x,-$i.y,$i.x,0,-Ki.y,Ki.x,0,-ln.y,ln.x,0];return!xr(t,En,Rn,Cn,oa)||(t=[1,0,0,0,1,0,0,0,1],!xr(t,En,Rn,Cn,oa))?!1:(la.crossVectors($i,Ki),t=[la.x,la.y,la.z],xr(t,En,Rn,Cn,oa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ti),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ti=[new T,new T,new T,new T,new T,new T,new T,new T],Zt=new T,ra=new xi,En=new T,Rn=new T,Cn=new T,$i=new T,Ki=new T,ln=new T,ys=new T,oa=new T,la=new T,cn=new T;function xr(a,e,t,i,n){for(let s=0,r=a.length-3;s<=r;s+=3){cn.fromArray(a,s);const o=n.x*Math.abs(cn.x)+n.y*Math.abs(cn.y)+n.z*Math.abs(cn.z),c=e.dot(cn),l=t.dot(cn),h=i.dot(cn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const of=new xi,Ms=new T,_r=new T;class ci{constructor(e=new T,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):of.setFromPoints(e).getCenter(i);let n=0;for(let s=0,r=e.length;s<r;s++)n=Math.max(n,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ms.subVectors(e,this.center);const t=Ms.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(Ms,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(_r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ms.copy(e.center).add(_r)),this.expandByPoint(Ms.copy(e.center).sub(_r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ai=new T,yr=new T,ca=new T,Yi=new T,Mr=new T,ha=new T,Sr=new T;class Qs{constructor(e=new T,t=new T(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ai.copy(this.origin).addScaledVector(this.direction,t),Ai.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){yr.copy(e).add(t).multiplyScalar(.5),ca.copy(t).sub(e).normalize(),Yi.copy(this.origin).sub(yr);const s=e.distanceTo(t)*.5,r=-this.direction.dot(ca),o=Yi.dot(this.direction),c=-Yi.dot(ca),l=Yi.lengthSq(),h=Math.abs(1-r*r);let d,u,f,g;if(h>0)if(d=r*c-o,u=r*o-c,g=s*h,d>=0)if(u>=-g)if(u<=g){const b=1/h;d*=b,u*=b,f=d*(d+r*u+2*o)+u*(r*d+u+2*c)+l}else u=s,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-r*s+o)),u=d>0?-s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),f=u*(u+2*c)+l):(d=Math.max(0,-(r*s+o)),u=d>0?s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l);else u=r>0?-s:s,d=Math.max(0,-(r*u+o)),f=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(yr).addScaledVector(ca,u),f}intersectSphere(e,t){Ai.subVectors(e.center,this.origin);const i=Ai.dot(this.direction),n=Ai.dot(Ai)-i*i,s=e.radius*e.radius;if(n>s)return null;const r=Math.sqrt(s-n),o=i-r,c=i+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,s,r,o,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(e.min.x-u.x)*l,n=(e.max.x-u.x)*l):(i=(e.max.x-u.x)*l,n=(e.min.x-u.x)*l),h>=0?(s=(e.min.y-u.y)*h,r=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,r=(e.min.y-u.y)*h),i>r||s>n||((s>i||isNaN(i))&&(i=s),(r<n||isNaN(n))&&(n=r),d>=0?(o=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),i>c||o>n)||((o>i||i!==i)&&(i=o),(c<n||n!==n)&&(n=c),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Ai)!==null}intersectTriangle(e,t,i,n,s){Mr.subVectors(t,e),ha.subVectors(i,e),Sr.crossVectors(Mr,ha);let r=this.direction.dot(Sr),o;if(r>0){if(n)return null;o=1}else if(r<0)o=-1,r=-r;else return null;Yi.subVectors(this.origin,e);const c=o*this.direction.dot(ha.crossVectors(Yi,ha));if(c<0)return null;const l=o*this.direction.dot(Mr.cross(Yi));if(l<0||c+l>r)return null;const h=-o*Yi.dot(Sr);return h<0?null:this.at(h/r,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(e,t,i,n,s,r,o,c,l,h,d,u,f,g,b,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,s,r,o,c,l,h,d,u,f,g,b,m)}set(e,t,i,n,s,r,o,c,l,h,d,u,f,g,b,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=n,p[1]=s,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=b,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,n=1/Pn.setFromMatrixColumn(e,0).length(),s=1/Pn.setFromMatrixColumn(e,1).length(),r=1/Pn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,s=e.z,r=Math.cos(i),o=Math.sin(i),c=Math.cos(n),l=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=r*h,f=r*d,g=o*h,b=o*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=u-b*l,t[9]=-o*c,t[2]=b-u*l,t[6]=g+f*l,t[10]=r*c}else if(e.order==="YXZ"){const u=c*h,f=c*d,g=l*h,b=l*d;t[0]=u+b*o,t[4]=g*o-f,t[8]=r*l,t[1]=r*d,t[5]=r*h,t[9]=-o,t[2]=f*o-g,t[6]=b+u*o,t[10]=r*c}else if(e.order==="ZXY"){const u=c*h,f=c*d,g=l*h,b=l*d;t[0]=u-b*o,t[4]=-r*d,t[8]=g+f*o,t[1]=f+g*o,t[5]=r*h,t[9]=b-u*o,t[2]=-r*l,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){const u=r*h,f=r*d,g=o*h,b=o*d;t[0]=c*h,t[4]=g*l-f,t[8]=u*l+b,t[1]=c*d,t[5]=b*l+u,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){const u=r*c,f=r*l,g=o*c,b=o*l;t[0]=c*h,t[4]=b-u*d,t[8]=g*d+f,t[1]=d,t[5]=r*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*d+g,t[10]=u-b*d}else if(e.order==="XZY"){const u=r*c,f=r*l,g=o*c,b=o*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+b,t[5]=r*h,t[9]=f*d-g,t[2]=g*d-f,t[6]=o*h,t[10]=b*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(lf,e,cf)}lookAt(e,t,i){const n=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Ji.crossVectors(i,zt),Ji.lengthSq()===0&&(Math.abs(i.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Ji.crossVectors(i,zt)),Ji.normalize(),da.crossVectors(zt,Ji),n[0]=Ji.x,n[4]=da.x,n[8]=zt.x,n[1]=Ji.y,n[5]=da.y,n[9]=zt.y,n[2]=Ji.z,n[6]=da.z,n[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,s=this.elements,r=i[0],o=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],b=i[6],m=i[10],p=i[14],v=i[3],_=i[7],x=i[11],A=i[15],w=n[0],R=n[4],P=n[8],M=n[12],y=n[1],D=n[5],U=n[9],N=n[13],W=n[2],X=n[6],G=n[10],Y=n[14],H=n[3],ne=n[7],oe=n[11],ve=n[15];return s[0]=r*w+o*y+c*W+l*H,s[4]=r*R+o*D+c*X+l*ne,s[8]=r*P+o*U+c*G+l*oe,s[12]=r*M+o*N+c*Y+l*ve,s[1]=h*w+d*y+u*W+f*H,s[5]=h*R+d*D+u*X+f*ne,s[9]=h*P+d*U+u*G+f*oe,s[13]=h*M+d*N+u*Y+f*ve,s[2]=g*w+b*y+m*W+p*H,s[6]=g*R+b*D+m*X+p*ne,s[10]=g*P+b*U+m*G+p*oe,s[14]=g*M+b*N+m*Y+p*ve,s[3]=v*w+_*y+x*W+A*H,s[7]=v*R+_*D+x*X+A*ne,s[11]=v*P+_*U+x*G+A*oe,s[15]=v*M+_*N+x*Y+A*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],s=e[12],r=e[1],o=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],f=e[14],g=e[3],b=e[7],m=e[11],p=e[15];return g*(+s*c*d-n*l*d-s*o*u+i*l*u+n*o*f-i*c*f)+b*(+t*c*f-t*l*u+s*r*u-n*r*f+n*l*h-s*c*h)+m*(+t*l*d-t*o*f-s*r*d+i*r*f+s*o*h-i*l*h)+p*(-n*o*h-t*c*d+t*o*u+n*r*d-i*r*u+i*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],s=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],f=e[11],g=e[12],b=e[13],m=e[14],p=e[15],v=d*m*l-b*u*l+b*c*f-o*m*f-d*c*p+o*u*p,_=g*u*l-h*m*l-g*c*f+r*m*f+h*c*p-r*u*p,x=h*b*l-g*d*l+g*o*f-r*b*f-h*o*p+r*d*p,A=g*d*c-h*b*c-g*o*u+r*b*u+h*o*m-r*d*m,w=t*v+i*_+n*x+s*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=v*R,e[1]=(b*u*s-d*m*s-b*n*f+i*m*f+d*n*p-i*u*p)*R,e[2]=(o*m*s-b*c*s+b*n*l-i*m*l-o*n*p+i*c*p)*R,e[3]=(d*c*s-o*u*s-d*n*l+i*u*l+o*n*f-i*c*f)*R,e[4]=_*R,e[5]=(h*m*s-g*u*s+g*n*f-t*m*f-h*n*p+t*u*p)*R,e[6]=(g*c*s-r*m*s-g*n*l+t*m*l+r*n*p-t*c*p)*R,e[7]=(r*u*s-h*c*s+h*n*l-t*u*l-r*n*f+t*c*f)*R,e[8]=x*R,e[9]=(g*d*s-h*b*s-g*i*f+t*b*f+h*i*p-t*d*p)*R,e[10]=(r*b*s-g*o*s+g*i*l-t*b*l-r*i*p+t*o*p)*R,e[11]=(h*o*s-r*d*s-h*i*l+t*d*l+r*i*f-t*o*f)*R,e[12]=A*R,e[13]=(h*b*n-g*d*n+g*i*u-t*b*u-h*i*m+t*d*m)*R,e[14]=(g*o*n-r*b*n-g*i*c+t*b*c+r*i*m-t*o*m)*R,e[15]=(r*d*n-h*o*n+h*i*c-t*d*c-r*i*u+t*o*u)*R,this}scale(e){const t=this.elements,i=e.x,n=e.y,s=e.z;return t[0]*=i,t[4]*=n,t[8]*=s,t[1]*=i,t[5]*=n,t[9]*=s,t[2]*=i,t[6]*=n,t[10]*=s,t[3]*=i,t[7]*=n,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),s=1-i,r=e.x,o=e.y,c=e.z,l=s*r,h=s*o;return this.set(l*r+i,l*o-n*c,l*c+n*o,0,l*o+n*c,h*o+i,h*c-n*r,0,l*c-n*o,h*c+n*r,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,s,r){return this.set(1,i,s,0,e,1,r,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,s=t._x,r=t._y,o=t._z,c=t._w,l=s+s,h=r+r,d=o+o,u=s*l,f=s*h,g=s*d,b=r*h,m=r*d,p=o*d,v=c*l,_=c*h,x=c*d,A=i.x,w=i.y,R=i.z;return n[0]=(1-(b+p))*A,n[1]=(f+x)*A,n[2]=(g-_)*A,n[3]=0,n[4]=(f-x)*w,n[5]=(1-(u+p))*w,n[6]=(m+v)*w,n[7]=0,n[8]=(g+_)*R,n[9]=(m-v)*R,n[10]=(1-(u+b))*R,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;let s=Pn.set(n[0],n[1],n[2]).length();const r=Pn.set(n[4],n[5],n[6]).length(),o=Pn.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),e.x=n[12],e.y=n[13],e.z=n[14],ei.copy(this);const l=1/s,h=1/r,d=1/o;return ei.elements[0]*=l,ei.elements[1]*=l,ei.elements[2]*=l,ei.elements[4]*=h,ei.elements[5]*=h,ei.elements[6]*=h,ei.elements[8]*=d,ei.elements[9]*=d,ei.elements[10]*=d,t.setFromRotationMatrix(ei),i.x=s,i.y=r,i.z=o,this}makePerspective(e,t,i,n,s,r,o=Ui){const c=this.elements,l=2*s/(t-e),h=2*s/(i-n),d=(t+e)/(t-e),u=(i+n)/(i-n);let f,g;if(o===Ui)f=-(r+s)/(r-s),g=-2*r*s/(r-s);else if(o===Ya)f=-r/(r-s),g=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,s,r,o=Ui){const c=this.elements,l=1/(t-e),h=1/(i-n),d=1/(r-s),u=(t+e)*l,f=(i+n)*h;let g,b;if(o===Ui)g=(r+s)*d,b=-2*d;else if(o===Ya)g=s*d,b=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=b,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Pn=new T,ei=new Ee,lf=new T(0,0,0),cf=new T(1,1,1),Ji=new T,da=new T,zt=new T,tc=new Ee,ic=new Nt;class gi{constructor(e=0,t=0,i=0,n=gi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,s=n[0],r=n[4],o=n[8],c=n[1],l=n[5],h=n[9],d=n[2],u=n[6],f=n[10];switch(t){case"XYZ":this._y=Math.asin(gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(gt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-gt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(gt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-gt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return tc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ic.setFromEuler(this),this.setFromQuaternion(ic,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gi.DEFAULT_ORDER="XYZ";class pl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let hf=0;const nc=new T,Dn=new Nt,Ei=new Ee,ua=new T,Ss=new T,df=new T,uf=new Nt,sc=new T(1,0,0),ac=new T(0,1,0),rc=new T(0,0,1),oc={type:"added"},ff={type:"removed"},Ln={type:"childadded",child:null},wr={type:"childremoved",child:null};class ot extends Sn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ot.DEFAULT_UP.clone();const e=new T,t=new gi,i=new Nt,n=new T(1,1,1);function s(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Ee},normalMatrix:{value:new ke}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.multiply(Dn),this}rotateOnWorldAxis(e,t){return Dn.setFromAxisAngle(e,t),this.quaternion.premultiply(Dn),this}rotateX(e){return this.rotateOnAxis(sc,e)}rotateY(e){return this.rotateOnAxis(ac,e)}rotateZ(e){return this.rotateOnAxis(rc,e)}translateOnAxis(e,t){return nc.copy(e).applyQuaternion(this.quaternion),this.position.add(nc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sc,e)}translateY(e){return this.translateOnAxis(ac,e)}translateZ(e){return this.translateOnAxis(rc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ua.copy(e):ua.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(Ss,ua,this.up):Ei.lookAt(ua,Ss,this.up),this.quaternion.setFromRotationMatrix(Ei),n&&(Ei.extractRotation(n.matrixWorld),Dn.setFromRotationMatrix(Ei),this.quaternion.premultiply(Dn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(oc),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ff),wr.child=e,this.dispatchEvent(wr),wr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(oc),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let s=0,r=n.length;s<r;s++)n[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,e,df),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,uf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const n=this.children;for(let s=0,r=n.length;s<r;s++)n[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.castShadow===!0&&(n.castShadow=!0),this.receiveShadow===!0&&(n.receiveShadow=!0),this.visible===!1&&(n.visible=!1),this.frustumCulled===!1&&(n.frustumCulled=!1),this.renderOrder!==0&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.visibility=this._visibility,n.active=this._active,n.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.geometryCount=this._geometryCount,n.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere={center:n.boundingSphere.center.toArray(),radius:n.boundingSphere.radius}),this.boundingBox!==null&&(n.boundingBox={min:n.boundingBox.min.toArray(),max:n.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));n.material=o}else n.material=s(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];n.animations.push(s(e.animations,c))}}if(t){const o=r(e.geometries),c=r(e.materials),l=r(e.textures),h=r(e.images),d=r(e.shapes),u=r(e.skeletons),f=r(e.animations),g=r(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=n,i;function r(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}}ot.DEFAULT_UP=new T(0,1,0);ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ti=new T,Ri=new T,Tr=new T,Ci=new T,kn=new T,In=new T,lc=new T,Ar=new T,Er=new T,Rr=new T,Cr=new $e,Pr=new $e,Dr=new $e;class Kt{constructor(e=new T,t=new T,i=new T){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),ti.subVectors(e,t),n.cross(ti);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(e,t,i,n,s){ti.subVectors(n,t),Ri.subVectors(i,t),Tr.subVectors(e,t);const r=ti.dot(ti),o=ti.dot(Ri),c=ti.dot(Tr),l=Ri.dot(Ri),h=Ri.dot(Tr),d=r*l-o*o;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(l*c-o*h)*u,g=(r*h-o*c)*u;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Ci)===null?!1:Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(e,t,i,n,s,r,o,c){return this.getBarycoord(e,t,i,n,Ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ci.x),c.addScaledVector(r,Ci.y),c.addScaledVector(o,Ci.z),c)}static getInterpolatedAttribute(e,t,i,n,s,r){return Cr.setScalar(0),Pr.setScalar(0),Dr.setScalar(0),Cr.fromBufferAttribute(e,t),Pr.fromBufferAttribute(e,i),Dr.fromBufferAttribute(e,n),r.setScalar(0),r.addScaledVector(Cr,s.x),r.addScaledVector(Pr,s.y),r.addScaledVector(Dr,s.z),r}static isFrontFacing(e,t,i,n){return ti.subVectors(i,t),Ri.subVectors(e,t),ti.cross(Ri).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ti.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),ti.cross(Ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,s){return Kt.getInterpolation(e,this.a,this.b,this.c,t,i,n,s)}containsPoint(e){return Kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,s=this.c;let r,o;kn.subVectors(n,i),In.subVectors(s,i),Ar.subVectors(e,i);const c=kn.dot(Ar),l=In.dot(Ar);if(c<=0&&l<=0)return t.copy(i);Er.subVectors(e,n);const h=kn.dot(Er),d=In.dot(Er);if(h>=0&&d<=h)return t.copy(n);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return r=c/(c-h),t.copy(i).addScaledVector(kn,r);Rr.subVectors(e,s);const f=kn.dot(Rr),g=In.dot(Rr);if(g>=0&&f<=g)return t.copy(s);const b=f*l-c*g;if(b<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(i).addScaledVector(In,o);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return lc.subVectors(s,n),o=(d-h)/(d-h+(f-g)),t.copy(n).addScaledVector(lc,o);const p=1/(m+b+u);return r=b*p,o=u*p,t.copy(i).addScaledVector(kn,r).addScaledVector(In,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},fa={h:0,s:0,l:0};function Lr(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class ie{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.toWorkingColorSpace(this,t),this}setRGB(e,t,i,n=He.workingColorSpace){return this.r=e,this.g=t,this.b=i,He.toWorkingColorSpace(this,n),this}setHSL(e,t,i,n=He.workingColorSpace){if(e=fl(e,1),t=gt(t,0,1),i=gt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,r=2*i-s;this.r=Lr(r,s,e+1/3),this.g=Lr(r,s,e),this.b=Lr(r,s,e-1/3)}return He.toWorkingColorSpace(this,n),this}setStyle(e,t=ct){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const r=n[1],o=n[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=n[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ct){const i=Qh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}copyLinearToSRGB(e){return this.r=Yn(e.r),this.g=Yn(e.g),this.b=Yn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ct){return He.fromWorkingColorSpace(At.copy(this),e),Math.round(gt(At.r*255,0,255))*65536+Math.round(gt(At.g*255,0,255))*256+Math.round(gt(At.b*255,0,255))}getHexString(e=ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.fromWorkingColorSpace(At.copy(this),t);const i=At.r,n=At.g,s=At.b,r=Math.max(i,n,s),o=Math.min(i,n,s);let c,l;const h=(o+r)/2;if(o===r)c=0,l=0;else{const d=r-o;switch(l=h<=.5?d/(r+o):d/(2-r-o),r){case i:c=(n-s)/d+(n<s?6:0);break;case n:c=(s-i)/d+2;break;case s:c=(i-n)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=He.workingColorSpace){return He.fromWorkingColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=ct){He.fromWorkingColorSpace(At.copy(this),e);const t=At.r,i=At.g,n=At.b;return e!==ct?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(Qi),this.setHSL(Qi.h+e,Qi.s+t,Qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Qi),e.getHSL(fa);const i=Os(Qi.h,fa.h,t),n=Os(Qi.s,fa.s,t),s=Os(Qi.l,fa.l,t);return this.setHSL(i,n,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*n,this.g=s[1]*t+s[4]*i+s[7]*n,this.b=s[2]*t+s[5]*i+s[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new ie;ie.NAMES=Qh;let pf=0;class li extends Sn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pf++}),this.uuid=ri(),this.name="",this.blending=an,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ao,this.blendDst=ro,this.blendEquation=bn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ie(0,0,0),this.blendAlpha=0,this.depthFunc=ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Tn,this.stencilZFail=Tn,this.stencilZPass=Tn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==an&&(i.blending=this.blending),this.side!==Vi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ao&&(i.blendSrc=this.blendSrc),this.blendDst!==ro&&(i.blendDst=this.blendDst),this.blendEquation!==bn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ts&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Tn&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Tn&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Tn&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const r=[];for(const o in s){const c=s[o];delete c.metadata,r.push(c)}return r}if(t){const s=n(e.textures),r=n(e.images);s.length>0&&(i.textures=s),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Et extends li{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.combine=Lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new T,pa=new Z;class vt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Wo,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)pa.fromBufferAttribute(this,t),pa.applyMatrix3(e),this.setXY(t,pa.x,pa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=si(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=si(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=si(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=si(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),n=et(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),n=et(n,this.array),s=et(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Wo&&(e.usage=this.usage),e}}class Zh extends vt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ed extends vt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ze extends vt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let mf=0;const Xt=new Ee,kr=new ot,Fn=new T,Bt=new xi,ws=new xi,yt=new T;class ut extends Sn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mf++}),this.uuid=ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kh(e)?ed:Zh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Xt.makeRotationFromQuaternion(e),this.applyMatrix4(Xt),this}rotateX(e){return Xt.makeRotationX(e),this.applyMatrix4(Xt),this}rotateY(e){return Xt.makeRotationY(e),this.applyMatrix4(Xt),this}rotateZ(e){return Xt.makeRotationZ(e),this.applyMatrix4(Xt),this}translate(e,t,i){return Xt.makeTranslation(e,t,i),this.applyMatrix4(Xt),this}scale(e,t,i){return Xt.makeScale(e,t,i),this.applyMatrix4(Xt),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fn).negate(),this.translate(Fn.x,Fn.y,Fn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ze(i,3))}else{for(let i=0,n=t.count;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const s=t[i];Bt.setFromBufferAttribute(s),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Bt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Bt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Bt.min),this.boundingBox.expandByPoint(Bt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ci);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(e){const i=this.boundingSphere.center;if(Bt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){const o=t[s];ws.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Bt.min,ws.min),Bt.expandByPoint(yt),yt.addVectors(Bt.max,ws.max),Bt.expandByPoint(yt)):(Bt.expandByPoint(ws.min),Bt.expandByPoint(ws.max))}Bt.getCenter(i);let n=0;for(let s=0,r=e.count;s<r;s++)yt.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(yt));if(t)for(let s=0,r=t.length;s<r;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)yt.fromBufferAttribute(o,l),c&&(Fn.fromBufferAttribute(e,l),yt.add(Fn)),n=Math.max(n,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vt(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<i.count;P++)o[P]=new T,c[P]=new T;const l=new T,h=new T,d=new T,u=new Z,f=new Z,g=new Z,b=new T,m=new T;function p(P,M,y){l.fromBufferAttribute(i,P),h.fromBufferAttribute(i,M),d.fromBufferAttribute(i,y),u.fromBufferAttribute(s,P),f.fromBufferAttribute(s,M),g.fromBufferAttribute(s,y),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(b.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),o[P].add(b),o[M].add(b),o[y].add(b),c[P].add(m),c[M].add(m),c[y].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let P=0,M=v.length;P<M;++P){const y=v[P],D=y.start,U=y.count;for(let N=D,W=D+U;N<W;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const _=new T,x=new T,A=new T,w=new T;function R(P){A.fromBufferAttribute(n,P),w.copy(A);const M=o[P];_.copy(M),_.sub(A.multiplyScalar(A.dot(M))).normalize(),x.crossVectors(w,M);const D=x.dot(c[P])<0?-1:1;r.setXYZW(P,_.x,_.y,_.z,D)}for(let P=0,M=v.length;P<M;++P){const y=v[P],D=y.start,U=y.count;for(let N=D,W=D+U;N<W;N+=3)R(e.getX(N+0)),R(e.getX(N+1)),R(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new vt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const n=new T,s=new T,r=new T,o=new T,c=new T,l=new T,h=new T,d=new T;if(e)for(let u=0,f=e.count;u<f;u+=3){const g=e.getX(u+0),b=e.getX(u+1),m=e.getX(u+2);n.fromBufferAttribute(t,g),s.fromBufferAttribute(t,b),r.fromBufferAttribute(t,m),h.subVectors(r,s),d.subVectors(n,s),h.cross(d),o.fromBufferAttribute(i,g),c.fromBufferAttribute(i,b),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(b,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=t.count;u<f;u+=3)n.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),r.fromBufferAttribute(t,u+2),h.subVectors(r,s),d.subVectors(n,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,d=o.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let b=0,m=c.length;b<m;b++){o.isInterleavedBufferAttribute?f=c[b]*o.data.stride+o.offset:f=c[b]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new vt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ut,i=this.index.array,n=this.attributes;for(const o in n){const c=n[o],l=e(c,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=e(u,i);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,c=r.length;o<c;o++){const l=r[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const n={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(e.data))}h.length>0&&(n[c]=h,s=!0)}s&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const n=e.attributes;for(const l in n){const h=n[l];this.setAttribute(l,h.clone(t))}const s=e.morphAttributes;for(const l in s){const h=[],d=s[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let l=0,h=r.length;l<h;l++){const d=r[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cc=new Ee,hn=new Qs,ma=new ci,hc=new T,ga=new T,va=new T,ba=new T,Ir=new T,xa=new T,dc=new T,_a=new T;class Ue extends ot{constructor(e=new ut,t=new Et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(s&&o){xa.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=o[c],d=s[c];h!==0&&(Ir.fromBufferAttribute(d,e),r?xa.addScaledVector(Ir,h):xa.addScaledVector(Ir.sub(t),h))}t.add(xa)}return t}raycast(e,t){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ma.copy(i.boundingSphere),ma.applyMatrix4(s),hn.copy(e.ray).recast(e.near),!(ma.containsPoint(hn.origin)===!1&&(hn.intersectSphere(ma,hc)===null||hn.origin.distanceToSquared(hc)>(e.far-e.near)**2))&&(cc.copy(s).invert(),hn.copy(e.ray).applyMatrix4(cc),!(i.boundingBox!==null&&hn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,hn)))}_computeIntersections(e,t,i){let n;const s=this.geometry,r=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let g=0,b=u.length;g<b;g++){const m=u[g],p=r[m.materialIndex],v=Math.max(m.start,f.start),_=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=v,A=_;x<A;x+=3){const w=o.getX(x),R=o.getX(x+1),P=o.getX(x+2);n=ya(this,p,e,i,l,h,d,w,R,P),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),b=Math.min(o.count,f.start+f.count);for(let m=g,p=b;m<p;m+=3){const v=o.getX(m),_=o.getX(m+1),x=o.getX(m+2);n=ya(this,r,e,i,l,h,d,v,_,x),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,b=u.length;g<b;g++){const m=u[g],p=r[m.materialIndex],v=Math.max(m.start,f.start),_=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let x=v,A=_;x<A;x+=3){const w=x,R=x+1,P=x+2;n=ya(this,p,e,i,l,h,d,w,R,P),n&&(n.faceIndex=Math.floor(x/3),n.face.materialIndex=m.materialIndex,t.push(n))}}else{const g=Math.max(0,f.start),b=Math.min(c.count,f.start+f.count);for(let m=g,p=b;m<p;m+=3){const v=m,_=m+1,x=m+2;n=ya(this,r,e,i,l,h,d,v,_,x),n&&(n.faceIndex=Math.floor(m/3),t.push(n))}}}}function gf(a,e,t,i,n,s,r,o){let c;if(e.side===Lt?c=i.intersectTriangle(r,s,n,!0,o):c=i.intersectTriangle(n,s,r,e.side===Vi,o),c===null)return null;_a.copy(o),_a.applyMatrix4(a.matrixWorld);const l=t.ray.origin.distanceTo(_a);return l<t.near||l>t.far?null:{distance:l,point:_a.clone(),object:a}}function ya(a,e,t,i,n,s,r,o,c,l){a.getVertexPosition(o,ga),a.getVertexPosition(c,va),a.getVertexPosition(l,ba);const h=gf(a,e,t,i,ga,va,ba,dc);if(h){const d=new T;Kt.getBarycoord(dc,ga,va,ba,d),n&&(h.uv=Kt.getInterpolatedAttribute(n,o,c,l,d,new Z)),s&&(h.uv1=Kt.getInterpolatedAttribute(s,o,c,l,d,new Z)),r&&(h.normal=Kt.getInterpolatedAttribute(r,o,c,l,d,new T),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new T,materialIndex:0};Kt.getNormal(ga,va,ba,u.normal),h.face=u,h.barycoord=d}return h}class rn extends ut{constructor(e=1,t=1,i=1,n=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:s,depthSegments:r};const o=this;n=Math.floor(n),s=Math.floor(s),r=Math.floor(r);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,i,t,e,r,s,0),g("z","y","x",1,-1,i,t,-e,r,s,1),g("x","z","y",1,1,e,i,t,n,r,2),g("x","z","y",1,-1,e,i,-t,n,r,3),g("x","y","z",1,-1,e,t,i,n,s,4),g("x","y","z",-1,-1,e,t,-i,n,s,5),this.setIndex(c),this.setAttribute("position",new ze(l,3)),this.setAttribute("normal",new ze(h,3)),this.setAttribute("uv",new ze(d,2));function g(b,m,p,v,_,x,A,w,R,P,M){const y=x/R,D=A/P,U=x/2,N=A/2,W=w/2,X=R+1,G=P+1;let Y=0,H=0;const ne=new T;for(let oe=0;oe<G;oe++){const ve=oe*D-N;for(let Ne=0;Ne<X;Ne++){const Qe=Ne*y-U;ne[b]=Qe*v,ne[m]=ve*_,ne[p]=W,l.push(ne.x,ne.y,ne.z),ne[b]=0,ne[m]=0,ne[p]=w>0?1:-1,h.push(ne.x,ne.y,ne.z),d.push(Ne/R),d.push(1-oe/P),Y+=1}}for(let oe=0;oe<P;oe++)for(let ve=0;ve<R;ve++){const Ne=u+ve+X*oe,Qe=u+ve+X*(oe+1),j=u+(ve+1)+X*(oe+1),Q=u+(ve+1)+X*oe;c.push(Ne,Qe,Q),c.push(Qe,j,Q),H+=6}o.addGroup(f,H,M),f+=H,u+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function os(a){const e={};for(const t in a){e[t]={};for(const i in a[t]){const n=a[t][i];n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)?n.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone():Array.isArray(n)?e[t][i]=n.slice():e[t][i]=n}}return e}function Ct(a){const e={};for(let t=0;t<a.length;t++){const i=os(a[t]);for(const n in i)e[n]=i[n]}return e}function vf(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function td(a){const e=a.getRenderTarget();return e===null?a.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const Ja={clone:os,merge:Ct};var bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,xf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ht extends li{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bf,this.fragmentShader=xf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=os(e.uniforms),this.uniformsGroups=vf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:"m4",value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class id extends ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Ui}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new T,uc=new Z,fc=new Z;class Dt extends id{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ns*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return rs*2*Math.atan(Math.tan(Ns*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,uc,fc),t.subVectors(fc,uc)}setViewOffset(e,t,i,n,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ns*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,s=-.5*n;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;s+=r.offsetX*n/c,t-=r.offsetY*i/l,n*=r.width/c,i*=r.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Un=-90,Nn=1;class _f extends ot{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Dt(Un,Nn,e,t);n.layers=this.layers,this.add(n);const s=new Dt(Un,Nn,e,t);s.layers=this.layers,this.add(s);const r=new Dt(Un,Nn,e,t);r.layers=this.layers,this.add(r);const o=new Dt(Un,Nn,e,t);o.layers=this.layers,this.add(o);const c=new Dt(Un,Nn,e,t);c.layers=this.layers,this.add(c);const l=new Dt(Un,Nn,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,s,r,o,c]=t;for(const l of t)this.remove(l);if(e===Ui)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ya)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,r,o,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const b=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,n),e.render(t,s),e.setRenderTarget(i,1,n),e.render(t,r),e.setRenderTarget(i,2,n),e.render(t,o),e.setRenderTarget(i,3,n),e.render(t,c),e.setRenderTarget(i,4,n),e.render(t,l),i.texture.generateMipmaps=b,e.setRenderTarget(i,5,n),e.render(t,h),e.setRenderTarget(d,u,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class nd extends bt{constructor(e,t,i,n,s,r,o,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:is,super(e,t,i,n,s,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class yf extends oi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new nd(n,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Vt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},n=new rn(5,5,5),s=new ht({name:"CubemapFromEquirect",uniforms:os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Lt,blending:zi});s.uniforms.tEquirect.value=t;const r=new Ue(n,s),o=t.minFilter;return t.minFilter===pi&&(t.minFilter=Vt),new _f(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t,i,n){const s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,n);e.setRenderTarget(s)}}const Fr=new T,Mf=new T,Sf=new ke;class tn{constructor(e=new T(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=Fr.subVectors(i,t).cross(Mf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Fr),n=this.normal.dot(i);if(n===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/n;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Sf.getNormalMatrix(e),n=this.coplanarPoint(Fr).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const dn=new ci,Ma=new T;class ml{constructor(e=new tn,t=new tn,i=new tn,n=new tn,s=new tn,r=new tn){this.planes=[e,t,i,n,s,r]}set(e,t,i,n,s,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ui){const i=this.planes,n=e.elements,s=n[0],r=n[1],o=n[2],c=n[3],l=n[4],h=n[5],d=n[6],u=n[7],f=n[8],g=n[9],b=n[10],m=n[11],p=n[12],v=n[13],_=n[14],x=n[15];if(i[0].setComponents(c-s,u-l,m-f,x-p).normalize(),i[1].setComponents(c+s,u+l,m+f,x+p).normalize(),i[2].setComponents(c+r,u+h,m+g,x+v).normalize(),i[3].setComponents(c-r,u-h,m-g,x-v).normalize(),i[4].setComponents(c-o,u-d,m-b,x-_).normalize(),t===Ui)i[5].setComponents(c+o,u+d,m+b,x+_).normalize();else if(t===Ya)i[5].setComponents(o,d,b,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dn)}intersectsSprite(e){return dn.center.set(0,0,0),dn.radius=.7071067811865476,dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(dn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(Ma.x=n.normal.x>0?e.max.x:e.min.x,Ma.y=n.normal.y>0?e.max.y:e.min.y,Ma.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sd(){let a=null,e=!1,t=null,i=null;function n(s,r){t(s,r),i=a.requestAnimationFrame(n)}return{start:function(){e!==!0&&t!==null&&(i=a.requestAnimationFrame(n),e=!0)},stop:function(){a.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){a=s}}}function wf(a){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,d=l.byteLength,u=a.createBuffer();a.bindBuffer(c,u),a.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=a.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=a.HALF_FLOAT:f=a.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=a.SHORT;else if(l instanceof Uint32Array)f=a.UNSIGNED_INT;else if(l instanceof Int32Array)f=a.INT;else if(l instanceof Int8Array)f=a.BYTE;else if(l instanceof Uint8Array)f=a.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const h=c.array,d=c.updateRanges;if(a.bindBuffer(l,o),d.length===0)a.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],b=d[f];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++u,d[u]=b)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const b=d[f];a.bufferSubData(l,b.start*h.BYTES_PER_ELEMENT,h,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(a.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:n,remove:s,update:r}}class vi extends ut{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const s=e/2,r=t/2,o=Math.floor(i),c=Math.floor(n),l=o+1,h=c+1,d=e/o,u=t/c,f=[],g=[],b=[],m=[];for(let p=0;p<h;p++){const v=p*u-r;for(let _=0;_<l;_++){const x=_*d-s;g.push(x,-v,0),b.push(0,0,1),m.push(_/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const _=v+l*p,x=v+l*(p+1),A=v+1+l*(p+1),w=v+1+l*p;f.push(_,x,w),f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(b,3)),this.setAttribute("uv",new ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Tf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Af=`#ifdef USE_ALPHAHASH
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
#endif`,Ef=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Pf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Df=`#ifdef USE_AOMAP
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
#endif`,Lf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kf=`#ifdef USE_BATCHING
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
#endif`,If=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ff=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Nf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Of=`#ifdef USE_IRIDESCENCE
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
#endif`,zf=`#ifdef USE_BUMPMAP
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
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Hf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Wf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,qf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,$f=`#define PI 3.141592653589793
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
} // validated`,Kf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yf=`vec3 transformedNormal = objectNormal;
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
#endif`,Jf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ep=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tp="gl_FragColor = linearToOutputTexel( gl_FragColor );",ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,np=`#ifdef USE_ENVMAP
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
#endif`,sp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ap=`#ifdef USE_ENVMAP
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
#endif`,rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,op=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,up=`#ifdef USE_GRADIENTMAP
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
}`,fp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gp=`uniform bool receiveShadow;
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
#endif`,vp=`#ifdef USE_ENVMAP
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
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_p=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mp=`PhysicalMaterial material;
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
#endif`,Sp=`struct PhysicalMaterial {
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
}`,wp=`
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
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ap=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ep=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Rp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Dp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Lp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ip=`#if defined( USE_POINTS_UV )
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
#endif`,Fp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Up=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Np=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Op=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bp=`#ifdef USE_MORPHTARGETS
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
#endif`,Hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Vp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Wp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,qp=`#ifdef USE_NORMALMAP
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
#endif`,$p=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Kp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Yp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,em=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,im=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
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
#endif`,om=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cm=`float getShadowMask() {
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
}`,hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dm=`#ifdef USE_SKINNING
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
#endif`,um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fm=`#ifdef USE_SKINNING
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
#endif`,pm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bm=`#ifdef USE_TRANSMISSION
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
#endif`,xm=`#ifdef USE_TRANSMISSION
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
#endif`,_m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ym=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tm=`uniform sampler2D t2D;
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
}`,Am=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Em=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`#include <common>
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
}`,Dm=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Lm=`#define DISTANCE
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
}`,km=`#define DISTANCE
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
}`,Im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`uniform float scale;
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
}`,Nm=`uniform vec3 diffuse;
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
}`,Om=`#include <common>
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
}`,zm=`uniform vec3 diffuse;
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
}`,Bm=`#define LAMBERT
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
}`,Hm=`#define LAMBERT
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
}`,Gm=`#define MATCAP
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
}`,Vm=`#define MATCAP
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
}`,Wm=`#define NORMAL
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
}`,jm=`#define NORMAL
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
}`,Xm=`#define PHONG
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
}`,qm=`#define PHONG
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
}`,$m=`#define STANDARD
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
}`,Km=`#define STANDARD
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
}`,Ym=`#define TOON
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
}`,Jm=`#define TOON
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
}`,Qm=`uniform float size;
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
}`,Zm=`uniform vec3 diffuse;
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
}`,e0=`#include <common>
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
}`,t0=`uniform vec3 color;
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
}`,i0=`uniform float rotation;
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
}`,n0=`uniform vec3 diffuse;
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
}`,Fe={alphahash_fragment:Tf,alphahash_pars_fragment:Af,alphamap_fragment:Ef,alphamap_pars_fragment:Rf,alphatest_fragment:Cf,alphatest_pars_fragment:Pf,aomap_fragment:Df,aomap_pars_fragment:Lf,batching_pars_vertex:kf,batching_vertex:If,begin_vertex:Ff,beginnormal_vertex:Uf,bsdfs:Nf,iridescence_fragment:Of,bumpmap_pars_fragment:zf,clipping_planes_fragment:Bf,clipping_planes_pars_fragment:Hf,clipping_planes_pars_vertex:Gf,clipping_planes_vertex:Vf,color_fragment:Wf,color_pars_fragment:jf,color_pars_vertex:Xf,color_vertex:qf,common:$f,cube_uv_reflection_fragment:Kf,defaultnormal_vertex:Yf,displacementmap_pars_vertex:Jf,displacementmap_vertex:Qf,emissivemap_fragment:Zf,emissivemap_pars_fragment:ep,colorspace_fragment:tp,colorspace_pars_fragment:ip,envmap_fragment:np,envmap_common_pars_fragment:sp,envmap_pars_fragment:ap,envmap_pars_vertex:rp,envmap_physical_pars_fragment:vp,envmap_vertex:op,fog_vertex:lp,fog_pars_vertex:cp,fog_fragment:hp,fog_pars_fragment:dp,gradientmap_pars_fragment:up,lightmap_pars_fragment:fp,lights_lambert_fragment:pp,lights_lambert_pars_fragment:mp,lights_pars_begin:gp,lights_toon_fragment:bp,lights_toon_pars_fragment:xp,lights_phong_fragment:_p,lights_phong_pars_fragment:yp,lights_physical_fragment:Mp,lights_physical_pars_fragment:Sp,lights_fragment_begin:wp,lights_fragment_maps:Tp,lights_fragment_end:Ap,logdepthbuf_fragment:Ep,logdepthbuf_pars_fragment:Rp,logdepthbuf_pars_vertex:Cp,logdepthbuf_vertex:Pp,map_fragment:Dp,map_pars_fragment:Lp,map_particle_fragment:kp,map_particle_pars_fragment:Ip,metalnessmap_fragment:Fp,metalnessmap_pars_fragment:Up,morphinstance_vertex:Np,morphcolor_vertex:Op,morphnormal_vertex:zp,morphtarget_pars_vertex:Bp,morphtarget_vertex:Hp,normal_fragment_begin:Gp,normal_fragment_maps:Vp,normal_pars_fragment:Wp,normal_pars_vertex:jp,normal_vertex:Xp,normalmap_pars_fragment:qp,clearcoat_normal_fragment_begin:$p,clearcoat_normal_fragment_maps:Kp,clearcoat_pars_fragment:Yp,iridescence_pars_fragment:Jp,opaque_fragment:Qp,packing:Zp,premultiplied_alpha_fragment:em,project_vertex:tm,dithering_fragment:im,dithering_pars_fragment:nm,roughnessmap_fragment:sm,roughnessmap_pars_fragment:am,shadowmap_pars_fragment:rm,shadowmap_pars_vertex:om,shadowmap_vertex:lm,shadowmask_pars_fragment:cm,skinbase_vertex:hm,skinning_pars_vertex:dm,skinning_vertex:um,skinnormal_vertex:fm,specularmap_fragment:pm,specularmap_pars_fragment:mm,tonemapping_fragment:gm,tonemapping_pars_fragment:vm,transmission_fragment:bm,transmission_pars_fragment:xm,uv_pars_fragment:_m,uv_pars_vertex:ym,uv_vertex:Mm,worldpos_vertex:Sm,background_vert:wm,background_frag:Tm,backgroundCube_vert:Am,backgroundCube_frag:Em,cube_vert:Rm,cube_frag:Cm,depth_vert:Pm,depth_frag:Dm,distanceRGBA_vert:Lm,distanceRGBA_frag:km,equirect_vert:Im,equirect_frag:Fm,linedashed_vert:Um,linedashed_frag:Nm,meshbasic_vert:Om,meshbasic_frag:zm,meshlambert_vert:Bm,meshlambert_frag:Hm,meshmatcap_vert:Gm,meshmatcap_frag:Vm,meshnormal_vert:Wm,meshnormal_frag:jm,meshphong_vert:Xm,meshphong_frag:qm,meshphysical_vert:$m,meshphysical_frag:Km,meshtoon_vert:Ym,meshtoon_frag:Jm,points_vert:Qm,points_frag:Zm,shadow_vert:e0,shadow_frag:t0,sprite_vert:i0,sprite_frag:n0},ae={common:{diffuse:{value:new ie(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new Z(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ie(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ie(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new ie(16777215)},opacity:{value:1},center:{value:new Z(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},fi={basic:{uniforms:Ct([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Ct([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new ie(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Ct([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new ie(0)},specular:{value:new ie(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Ct([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new ie(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Ct([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new ie(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Ct([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Ct([ae.points,ae.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Ct([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Ct([ae.common,ae.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Ct([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Ct([ae.sprite,ae.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:Ct([ae.common,ae.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:Ct([ae.lights,ae.fog,{color:{value:new ie(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};fi.physical={uniforms:Ct([fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new Z(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new ie(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new Z},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new ie(0)},specularColor:{value:new ie(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new Z},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const Sa={r:0,b:0,g:0},un=new gi,s0=new Ee;function a0(a,e,t,i,n,s,r){const o=new ie(0);let c=s===!0?0:1,l,h,d=null,u=0,f=null;function g(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?t:e).get(_)),_}function b(v){let _=!1;const x=g(v);x===null?p(o,c):x&&x.isColor&&(p(x,1),_=!0);const A=a.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(a.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil))}function m(v,_){const x=g(_);x&&(x.isCubeTexture||x.mapping===rr)?(h===void 0&&(h=new Ue(new rn(1,1,1),new ht({name:"BackgroundCubeMaterial",uniforms:os(fi.backgroundCube.uniforms),vertexShader:fi.backgroundCube.vertexShader,fragmentShader:fi.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),un.copy(_.backgroundRotation),un.x*=-1,un.y*=-1,un.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(un.y*=-1,un.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(s0.makeRotationFromEuler(un)),h.material.toneMapped=He.getTransfer(x.colorSpace)!==tt,(d!==x||u!==x.version||f!==a.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,f=a.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ue(new vi(2,2),new ht({name:"BackgroundMaterial",uniforms:os(fi.background.uniforms),vertexShader:fi.background.vertexShader,fragmentShader:fi.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=He.getTransfer(x.colorSpace)!==tt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||f!==a.toneMapping)&&(l.material.needsUpdate=!0,d=x,u=x.version,f=a.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,_){v.getRGB(Sa,td(a)),i.buffers.color.setClear(Sa.r,Sa.g,Sa.b,_,r)}return{getClearColor:function(){return o},setClearColor:function(v,_=1){o.set(v),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(o,c)},render:b,addToRenderList:m}}function r0(a,e){const t=a.getParameter(a.MAX_VERTEX_ATTRIBS),i={},n=u(null);let s=n,r=!1;function o(y,D,U,N,W){let X=!1;const G=d(N,U,D);s!==G&&(s=G,l(s.object)),X=f(y,N,U,W),X&&g(y,N,U,W),W!==null&&e.update(W,a.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,x(y,D,U,N),W!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return a.createVertexArray()}function l(y){return a.bindVertexArray(y)}function h(y){return a.deleteVertexArray(y)}function d(y,D,U){const N=U.wireframe===!0;let W=i[y.id];W===void 0&&(W={},i[y.id]=W);let X=W[D.id];X===void 0&&(X={},W[D.id]=X);let G=X[N];return G===void 0&&(G=u(c()),X[N]=G),G}function u(y){const D=[],U=[],N=[];for(let W=0;W<t;W++)D[W]=0,U[W]=0,N[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:U,attributeDivisors:N,object:y,attributes:{},index:null}}function f(y,D,U,N){const W=s.attributes,X=D.attributes;let G=0;const Y=U.getAttributes();for(const H in Y)if(Y[H].location>=0){const oe=W[H];let ve=X[H];if(ve===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(ve=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(ve=y.instanceColor)),oe===void 0||oe.attribute!==ve||ve&&oe.data!==ve.data)return!0;G++}return s.attributesNum!==G||s.index!==N}function g(y,D,U,N){const W={},X=D.attributes;let G=0;const Y=U.getAttributes();for(const H in Y)if(Y[H].location>=0){let oe=X[H];oe===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(oe=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(oe=y.instanceColor));const ve={};ve.attribute=oe,oe&&oe.data&&(ve.data=oe.data),W[H]=ve,G++}s.attributes=W,s.attributesNum=G,s.index=N}function b(){const y=s.newAttributes;for(let D=0,U=y.length;D<U;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const U=s.newAttributes,N=s.enabledAttributes,W=s.attributeDivisors;U[y]=1,N[y]===0&&(a.enableVertexAttribArray(y),N[y]=1),W[y]!==D&&(a.vertexAttribDivisor(y,D),W[y]=D)}function v(){const y=s.newAttributes,D=s.enabledAttributes;for(let U=0,N=D.length;U<N;U++)D[U]!==y[U]&&(a.disableVertexAttribArray(U),D[U]=0)}function _(y,D,U,N,W,X,G){G===!0?a.vertexAttribIPointer(y,D,U,W,X):a.vertexAttribPointer(y,D,U,N,W,X)}function x(y,D,U,N){b();const W=N.attributes,X=U.getAttributes(),G=D.defaultAttributeValues;for(const Y in X){const H=X[Y];if(H.location>=0){let ne=W[Y];if(ne===void 0&&(Y==="instanceMatrix"&&y.instanceMatrix&&(ne=y.instanceMatrix),Y==="instanceColor"&&y.instanceColor&&(ne=y.instanceColor)),ne!==void 0){const oe=ne.normalized,ve=ne.itemSize,Ne=e.get(ne);if(Ne===void 0)continue;const Qe=Ne.buffer,j=Ne.type,Q=Ne.bytesPerElement,ue=j===a.INT||j===a.UNSIGNED_INT||ne.gpuType===al;if(ne.isInterleavedBufferAttribute){const se=ne.data,Ae=se.stride,Pe=ne.offset;if(se.isInstancedInterleavedBuffer){for(let Oe=0;Oe<H.locationSize;Oe++)p(H.location+Oe,se.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Oe=0;Oe<H.locationSize;Oe++)m(H.location+Oe);a.bindBuffer(a.ARRAY_BUFFER,Qe);for(let Oe=0;Oe<H.locationSize;Oe++)_(H.location+Oe,ve/H.locationSize,j,oe,Ae*Q,(Pe+ve/H.locationSize*Oe)*Q,ue)}else{if(ne.isInstancedBufferAttribute){for(let se=0;se<H.locationSize;se++)p(H.location+se,ne.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let se=0;se<H.locationSize;se++)m(H.location+se);a.bindBuffer(a.ARRAY_BUFFER,Qe);for(let se=0;se<H.locationSize;se++)_(H.location+se,ve/H.locationSize,j,oe,ve*Q,ve/H.locationSize*se*Q,ue)}}else if(G!==void 0){const oe=G[Y];if(oe!==void 0)switch(oe.length){case 2:a.vertexAttrib2fv(H.location,oe);break;case 3:a.vertexAttrib3fv(H.location,oe);break;case 4:a.vertexAttrib4fv(H.location,oe);break;default:a.vertexAttrib1fv(H.location,oe)}}}}v()}function A(){P();for(const y in i){const D=i[y];for(const U in D){const N=D[U];for(const W in N)h(N[W].object),delete N[W];delete D[U]}delete i[y]}}function w(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const U in D){const N=D[U];for(const W in N)h(N[W].object),delete N[W];delete D[U]}delete i[y.id]}function R(y){for(const D in i){const U=i[D];if(U[y.id]===void 0)continue;const N=U[y.id];for(const W in N)h(N[W].object),delete N[W];delete U[y.id]}}function P(){M(),r=!0,s!==n&&(s=n,l(s.object))}function M(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:P,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:b,enableAttribute:m,disableUnusedAttributes:v}}function o0(a,e,t){let i;function n(l){i=l}function s(l,h){a.drawArrays(i,l,h),t.update(h,i,1)}function r(l,h,d){d!==0&&(a.drawArraysInstanced(i,l,h,d),t.update(h,i,d))}function o(l,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];t.update(f,i,1)}function c(l,h,d,u){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)r(l[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,u,0,d);let g=0;for(let b=0;b<d;b++)g+=h[b]*u[b];t.update(g,i,1)}}this.setMode=n,this.render=s,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function l0(a,e,t,i){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");n=a.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){return!(R!==Yt&&i.convert(R)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const P=R===Hi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Wi&&i.convert(R)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==ai&&!P)}function c(R){if(R==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),g=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=a.getParameter(a.MAX_TEXTURE_SIZE),m=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),p=a.getParameter(a.MAX_VERTEX_ATTRIBS),v=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),_=a.getParameter(a.MAX_VARYING_VECTORS),x=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,w=a.getParameter(a.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:A,maxSamples:w}}function c0(a){const e=this;let t=null,i=0,n=!1,s=!1;const r=new tn,o=new ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||n;return n=u,i=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,b=d.clipIntersection,m=d.clipShadows,p=a.get(d);if(!n||g===null||g.length===0||s&&!m)s?h(null):l();else{const v=s?0:i,_=v*4;let x=p.clippingState||null;c.value=x,x=h(g,u,_,f);for(let A=0;A!==_;++A)x[A]=t[A];p.clippingState=x,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,f,g){const b=d!==null?d.length:0;let m=null;if(b!==0){if(m=c.value,g!==!0||m===null){const p=f+b*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,x=f;_!==b;++_,x+=4)r.copy(d[_]).applyMatrix4(v,o),r.normal.toArray(m,x),m[x+3]=r.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,m}}function h0(a){let e=new WeakMap;function t(r,o){return o===mo?r.mapping=is:o===go&&(r.mapping=ns),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===mo||o===go)if(e.has(r)){const c=e.get(r).texture;return t(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new yf(c.height);return l.fromEquirectangularTexture(a,r),e.set(r,l),r.addEventListener("dispose",n),t(l.texture,r.mapping)}else return null}}return r}function n(r){const o=r.target;o.removeEventListener("dispose",n);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class lr extends id{constructor(e=-1,t=1,i=1,n=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-e,r=i+e,o=n+t,c=n-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const $n=4,pc=[.125,.215,.35,.446,.526,.582],xn=20,Ur=new lr,mc=new ie;let Nr=null,Or=0,zr=0,Br=!1;const gn=(1+Math.sqrt(5))/2,On=1/gn,gc=[new T(-gn,On,0),new T(gn,On,0),new T(-On,0,gn),new T(On,0,gn),new T(0,gn,-On),new T(0,gn,On),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)];class jo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,n=100){Nr=this._renderer.getRenderTarget(),Or=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,n,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Nr,Or,zr),this._renderer.xr.enabled=Br,e.scissorTest=!1,wa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===is||e.mapping===ns?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nr=this._renderer.getRenderTarget(),Or=this._renderer.getActiveCubeFace(),zr=this._renderer.getActiveMipmapLevel(),Br=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Vt,minFilter:Vt,generateMipmaps:!1,type:Hi,format:Yt,colorSpace:It,depthBuffer:!1},n=vc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vc(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=d0(s)),this._blurMaterial=u0(s,e,t)}return n}_compileMaterial(e){const t=new Ue(this._lodPlanes[0],e);this._renderer.compile(t,Ur)}_sceneToCubeUV(e,t,i,n){const o=new Dt(90,1,t,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(mc),h.toneMapping=Bi,h.autoClear=!1;const f=new Et({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),g=new Ue(new rn,f);let b=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,b=!0):(f.color.copy(mc),b=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):v===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const _=this._cubeSize;wa(n,v*_,p>2?_:0,_,_),h.setRenderTarget(n),b&&h.render(g,o),h.render(e,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,n=e.mapping===is||e.mapping===ns;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=xc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bc());const s=n?this._cubemapMaterial:this._equirectMaterial,r=new Ue(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;wa(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(r,Ur)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const n=this._lodPlanes.length;for(let s=1;s<n;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=gc[(n-s-1)%gc.length];this._blur(e,s-1,s,r,o)}t.autoClear=i}_blur(e,t,i,n,s){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,n,"latitudinal",s),this._halfBlur(r,e,i,i,n,"longitudinal",s)}_halfBlur(e,t,i,n,s,r,o){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ue(this._lodPlanes[n],l),u=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*xn-1),b=s/g,m=isFinite(s)?1+Math.floor(h*b):xn;m>xn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xn}`);const p=[];let v=0;for(let R=0;R<xn;++R){const P=R/b,M=Math.exp(-P*P/2);p.push(M),R===0?v+=M:R<m&&(v+=2*M)}for(let R=0;R<p.length;R++)p[R]=p[R]/v;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=r==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:_}=this;u.dTheta.value=g,u.mipInt.value=_-i;const x=this._sizeLods[n],A=3*x*(n>_-$n?n-_+$n:0),w=4*(this._cubeSize-x);wa(t,A,w,3*x,2*x),c.setRenderTarget(t),c.render(d,Ur)}}function d0(a){const e=[],t=[],i=[];let n=a;const s=a-$n+1+pc.length;for(let r=0;r<s;r++){const o=Math.pow(2,n);t.push(o);let c=1/o;r>a-$n?c=pc[r-a+$n-1]:r===0&&(c=0),i.push(c);const l=1/(o-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,b=3,m=2,p=1,v=new Float32Array(b*g*f),_=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let w=0;w<f;w++){const R=w%3*2/3-1,P=w>2?0:-1,M=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];v.set(M,b*g*w),_.set(u,m*g*w);const y=[w,w,w,w,w,w];x.set(y,p*g*w)}const A=new ut;A.setAttribute("position",new vt(v,b)),A.setAttribute("uv",new vt(_,m)),A.setAttribute("faceIndex",new vt(x,p)),e.push(A),n>$n&&n--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function vc(a,e,t){const i=new oi(a,e,t);return i.texture.mapping=rr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wa(a,e,t,i,n){a.viewport.set(e,t,i,n),a.scissor.set(e,t,i,n)}function u0(a,e,t){const i=new Float32Array(xn),n=new T(0,1,0);return new ht({name:"SphericalGaussianBlur",defines:{n:xn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:n}},vertexShader:gl(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function bc(){return new ht({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gl(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function xc(){return new ht({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function gl(){return`

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
	`}function f0(a){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===mo||c===go,h=c===is||c===ns;if(l||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new jo(a)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&n(f)?(t===null&&(t=new jo(a)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function n(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function p0(a){const e={};function t(i){if(e[i]!==void 0)return e[i];let n;switch(i){case"WEBGL_depth_texture":n=a.getExtension("WEBGL_depth_texture")||a.getExtension("MOZ_WEBGL_depth_texture")||a.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("MOZ_EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=a.getExtension("WEBGL_compressed_texture_s3tc")||a.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=a.getExtension("WEBGL_compressed_texture_pvrtc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=a.getExtension(i)}return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&Fs("THREE.WebGLRenderer: "+i+" extension not supported."),n}}}function m0(a,e,t,i){const n={},s=new WeakMap;function r(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const b=u.morphAttributes[g];for(let m=0,p=b.length;m<p;m++)e.remove(b[m])}u.removeEventListener("dispose",r),delete n[u.id];const f=s.get(u);f&&(e.remove(f),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return n[u.id]===!0||(u.addEventListener("dispose",r),n[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const g in u)e.update(u[g],a.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const b=f[g];for(let m=0,p=b.length;m<p;m++)e.update(b[m],a.ARRAY_BUFFER)}}function l(d){const u=[],f=d.index,g=d.attributes.position;let b=0;if(f!==null){const v=f.array;b=f.version;for(let _=0,x=v.length;_<x;_+=3){const A=v[_+0],w=v[_+1],R=v[_+2];u.push(A,w,w,R,R,A)}}else if(g!==void 0){const v=g.array;b=g.version;for(let _=0,x=v.length/3-1;_<x;_+=3){const A=_+0,w=_+1,R=_+2;u.push(A,w,w,R,R,A)}}else return;const m=new(Kh(u)?ed:Zh)(u,1);m.version=b;const p=s.get(d);p&&e.remove(p),s.set(d,m)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:h}}function g0(a,e,t){let i;function n(u){i=u}let s,r;function o(u){s=u.type,r=u.bytesPerElement}function c(u,f){a.drawElements(i,f,s,u*r),t.update(f,i,1)}function l(u,f,g){g!==0&&(a.drawElementsInstanced(i,f,s,u*r,g),t.update(f,i,g))}function h(u,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function d(u,f,g,b){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/r,f[p],b[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,u,0,b,0,g);let p=0;for(let v=0;v<g;v++)p+=f[v]*b[v];t.update(p,i,1)}}this.setMode=n,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function v0(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,r,o){switch(t.calls++,r){case a.TRIANGLES:t.triangles+=o*(s/3);break;case a.LINES:t.lines+=o*(s/2);break;case a.LINE_STRIP:t.lines+=o*(s-1);break;case a.LINE_LOOP:t.lines+=o*s;break;case a.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function b0(a,e,t){const i=new WeakMap,n=new $e;function s(r,o,c){const l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let y=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",y)};var f=y;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,b=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),b===!0&&(x=2),m===!0&&(x=3);let A=o.attributes.position.count*x,w=1;A>e.maxTextureSize&&(w=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*w*4*d),P=new Jh(R,A,w,d);P.type=ai,P.needsUpdate=!0;const M=x*4;for(let D=0;D<d;D++){const U=p[D],N=v[D],W=_[D],X=A*w*4*D;for(let G=0;G<U.count;G++){const Y=G*M;g===!0&&(n.fromBufferAttribute(U,G),R[X+Y+0]=n.x,R[X+Y+1]=n.y,R[X+Y+2]=n.z,R[X+Y+3]=0),b===!0&&(n.fromBufferAttribute(N,G),R[X+Y+4]=n.x,R[X+Y+5]=n.y,R[X+Y+6]=n.z,R[X+Y+7]=0),m===!0&&(n.fromBufferAttribute(W,G),R[X+Y+8]=n.x,R[X+Y+9]=n.y,R[X+Y+10]=n.z,R[X+Y+11]=W.itemSize===4?n.w:1)}}u={count:d,texture:P,size:new Z(A,w)},i.set(o,u),o.addEventListener("dispose",y)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(a,"morphTexture",r.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const b=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(a,"morphTargetBaseInfluence",b),c.getUniforms().setValue(a,"morphTargetInfluences",l)}c.getUniforms().setValue(a,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(a,"morphTargetsTextureSize",u.size)}return{update:s}}function x0(a,e,t,i){let n=new WeakMap;function s(c){const l=i.render.frame,h=c.geometry,d=e.get(c,h);if(n.get(d)!==l&&(e.update(d),n.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),n.get(c)!==l&&(t.update(c.instanceMatrix,a.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,a.ARRAY_BUFFER),n.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;n.get(u)!==l&&(u.update(),n.set(u,l))}return d}function r(){n=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:r}}class ad extends bt{constructor(e,t,i,n,s,r,o,c,l,h=Kn){if(h!==Kn&&h!==as)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Kn&&(i=Mn),i===void 0&&h===as&&(i=ss),super(null,n,s,r,o,c,h,i,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:kt,this.minFilter=c!==void 0?c:kt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const rd=new bt,_c=new ad(1,1),od=new Jh,ld=new rf,cd=new nd,yc=[],Mc=[],Sc=new Float32Array(16),wc=new Float32Array(9),Tc=new Float32Array(4);function fs(a,e,t){const i=a[0];if(i<=0||i>0)return a;const n=e*t;let s=yc[n];if(s===void 0&&(s=new Float32Array(n),yc[n]=s),e!==0){i.toArray(s,0);for(let r=1,o=0;r!==e;++r)o+=t,a[r].toArray(s,o)}return s}function xt(a,e){if(a.length!==e.length)return!1;for(let t=0,i=a.length;t<i;t++)if(a[t]!==e[t])return!1;return!0}function _t(a,e){for(let t=0,i=e.length;t<i;t++)a[t]=e[t]}function cr(a,e){let t=Mc[e];t===void 0&&(t=new Int32Array(e),Mc[e]=t);for(let i=0;i!==e;++i)t[i]=a.allocateTextureUnit();return t}function _0(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function y0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;a.uniform2fv(this.addr,e),_t(t,e)}}function M0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;a.uniform3fv(this.addr,e),_t(t,e)}}function S0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;a.uniform4fv(this.addr,e),_t(t,e)}}function w0(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),_t(t,e)}else{if(xt(t,i))return;Tc.set(i),a.uniformMatrix2fv(this.addr,!1,Tc),_t(t,i)}}function T0(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),_t(t,e)}else{if(xt(t,i))return;wc.set(i),a.uniformMatrix3fv(this.addr,!1,wc),_t(t,i)}}function A0(a,e){const t=this.cache,i=e.elements;if(i===void 0){if(xt(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),_t(t,e)}else{if(xt(t,i))return;Sc.set(i),a.uniformMatrix4fv(this.addr,!1,Sc),_t(t,i)}}function E0(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function R0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;a.uniform2iv(this.addr,e),_t(t,e)}}function C0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;a.uniform3iv(this.addr,e),_t(t,e)}}function P0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;a.uniform4iv(this.addr,e),_t(t,e)}}function D0(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function L0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;a.uniform2uiv(this.addr,e),_t(t,e)}}function k0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;a.uniform3uiv(this.addr,e),_t(t,e)}}function I0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;a.uniform4uiv(this.addr,e),_t(t,e)}}function F0(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n);let s;this.type===a.SAMPLER_2D_SHADOW?(_c.compareFunction=$h,s=_c):s=rd,t.setTexture2D(e||s,n)}function U0(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||ld,n)}function N0(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),t.setTextureCube(e||cd,n)}function O0(a,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||od,n)}function z0(a){switch(a){case 5126:return _0;case 35664:return y0;case 35665:return M0;case 35666:return S0;case 35674:return w0;case 35675:return T0;case 35676:return A0;case 5124:case 35670:return E0;case 35667:case 35671:return R0;case 35668:case 35672:return C0;case 35669:case 35673:return P0;case 5125:return D0;case 36294:return L0;case 36295:return k0;case 36296:return I0;case 35678:case 36198:case 36298:case 36306:case 35682:return F0;case 35679:case 36299:case 36307:return U0;case 35680:case 36300:case 36308:case 36293:return N0;case 36289:case 36303:case 36311:case 36292:return O0}}function B0(a,e){a.uniform1fv(this.addr,e)}function H0(a,e){const t=fs(e,this.size,2);a.uniform2fv(this.addr,t)}function G0(a,e){const t=fs(e,this.size,3);a.uniform3fv(this.addr,t)}function V0(a,e){const t=fs(e,this.size,4);a.uniform4fv(this.addr,t)}function W0(a,e){const t=fs(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function j0(a,e){const t=fs(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function X0(a,e){const t=fs(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function q0(a,e){a.uniform1iv(this.addr,e)}function $0(a,e){a.uniform2iv(this.addr,e)}function K0(a,e){a.uniform3iv(this.addr,e)}function Y0(a,e){a.uniform4iv(this.addr,e)}function J0(a,e){a.uniform1uiv(this.addr,e)}function Q0(a,e){a.uniform2uiv(this.addr,e)}function Z0(a,e){a.uniform3uiv(this.addr,e)}function eg(a,e){a.uniform4uiv(this.addr,e)}function tg(a,e,t){const i=this.cache,n=e.length,s=cr(t,n);xt(i,s)||(a.uniform1iv(this.addr,s),_t(i,s));for(let r=0;r!==n;++r)t.setTexture2D(e[r]||rd,s[r])}function ig(a,e,t){const i=this.cache,n=e.length,s=cr(t,n);xt(i,s)||(a.uniform1iv(this.addr,s),_t(i,s));for(let r=0;r!==n;++r)t.setTexture3D(e[r]||ld,s[r])}function ng(a,e,t){const i=this.cache,n=e.length,s=cr(t,n);xt(i,s)||(a.uniform1iv(this.addr,s),_t(i,s));for(let r=0;r!==n;++r)t.setTextureCube(e[r]||cd,s[r])}function sg(a,e,t){const i=this.cache,n=e.length,s=cr(t,n);xt(i,s)||(a.uniform1iv(this.addr,s),_t(i,s));for(let r=0;r!==n;++r)t.setTexture2DArray(e[r]||od,s[r])}function ag(a){switch(a){case 5126:return B0;case 35664:return H0;case 35665:return G0;case 35666:return V0;case 35674:return W0;case 35675:return j0;case 35676:return X0;case 5124:case 35670:return q0;case 35667:case 35671:return $0;case 35668:case 35672:return K0;case 35669:case 35673:return Y0;case 5125:return J0;case 36294:return Q0;case 36295:return Z0;case 36296:return eg;case 35678:case 36198:case 36298:case 36306:case 35682:return tg;case 35679:case 36299:case 36307:return ig;case 35680:case 36300:case 36308:case 36293:return ng;case 36289:case 36303:case 36311:case 36292:return sg}}class rg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=z0(t.type)}}class og{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ag(t.type)}}class lg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let s=0,r=n.length;s!==r;++s){const o=n[s];o.setValue(e,t[o.id],i)}}}const Hr=/(\w+)(\])?(\[|\.)?/g;function Ac(a,e){a.seq.push(e),a.map[e.id]=e}function cg(a,e,t){const i=a.name,n=i.length;for(Hr.lastIndex=0;;){const s=Hr.exec(i),r=Hr.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===n){Ac(t,l===void 0?new rg(o,a,e):new og(o,a,e));break}else{let d=t.map[o];d===void 0&&(d=new lg(o),Ac(t,d)),t=d}}}class Xa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let n=0;n<i;++n){const s=e.getActiveUniform(t,n),r=e.getUniformLocation(t,s.name);cg(s,r,this)}}setValue(e,t,i,n){const s=this.map[t];s!==void 0&&s.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let s=0,r=t.length;s!==r;++s){const o=t[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.id in t&&i.push(r)}return i}}function Ec(a,e,t){const i=a.createShader(e);return a.shaderSource(i,t),a.compileShader(i),i}const hg=37297;let dg=0;function ug(a,e){const t=a.split(`
`),i=[],n=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let r=n;r<s;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Rc=new ke;function fg(a){He._getMatrix(Rc,He.workingColorSpace,a);const e=`mat3( ${Rc.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(a)){case or:return[e,"LinearTransferOETF"];case tt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",a),[e,"LinearTransferOETF"]}}function Cc(a,e,t){const i=a.getShaderParameter(e,a.COMPILE_STATUS),n=a.getShaderInfoLog(e).trim();if(i&&n==="")return"";const s=/ERROR: 0:(\d+)/.exec(n);if(s){const r=parseInt(s[1]);return t.toUpperCase()+`

`+n+`

`+ug(a.getShaderSource(e),r)}else return n}function pg(a,e){const t=fg(e);return[`vec4 ${a}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function mg(a,e){let t;switch(e){case fu:t="Linear";break;case pu:t="Reinhard";break;case mu:t="Cineon";break;case gu:t="ACESFilmic";break;case bu:t="AgX";break;case xu:t="Neutral";break;case vu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ta=new T;function gg(){He.getLuminanceCoefficients(Ta);const a=Ta.x.toFixed(4),e=Ta.y.toFixed(4),t=Ta.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${a}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vg(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",a.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function bg(a){const e=[];for(const t in a){const i=a[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function xg(a,e){const t={},i=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=a.getActiveAttrib(e,n),r=s.name;let o=1;s.type===a.FLOAT_MAT2&&(o=2),s.type===a.FLOAT_MAT3&&(o=3),s.type===a.FLOAT_MAT4&&(o=4),t[r]={type:s.type,location:a.getAttribLocation(e,r),locationSize:o}}return t}function Us(a){return a!==""}function Pc(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Dc(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _g=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xo(a){return a.replace(_g,Mg)}const yg=new Map;function Mg(a,e){let t=Fe[e];if(t===void 0){const i=yg.get(e);if(i!==void 0)t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Xo(t)}const Sg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lc(a){return a.replace(Sg,wg)}function wg(a,e,t,i){let n="";for(let s=parseInt(e);s<parseInt(t);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function kc(a){let e=`precision ${a.precision} float;
	precision ${a.precision} int;
	precision ${a.precision} sampler2D;
	precision ${a.precision} samplerCube;
	precision ${a.precision} sampler3D;
	precision ${a.precision} sampler2DArray;
	precision ${a.precision} sampler2DShadow;
	precision ${a.precision} samplerCubeShadow;
	precision ${a.precision} sampler2DArrayShadow;
	precision ${a.precision} isampler2D;
	precision ${a.precision} isampler3D;
	precision ${a.precision} isamplerCube;
	precision ${a.precision} isampler2DArray;
	precision ${a.precision} usampler2D;
	precision ${a.precision} usampler3D;
	precision ${a.precision} usamplerCube;
	precision ${a.precision} usampler2DArray;
	`;return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Tg(a){let e="SHADOWMAP_TYPE_BASIC";return a.shadowMapType===Ph?e="SHADOWMAP_TYPE_PCF":a.shadowMapType===Dh?e="SHADOWMAP_TYPE_PCF_SOFT":a.shadowMapType===Di&&(e="SHADOWMAP_TYPE_VSM"),e}function Ag(a){let e="ENVMAP_TYPE_CUBE";if(a.envMap)switch(a.envMapMode){case is:case ns:e="ENVMAP_TYPE_CUBE";break;case rr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Eg(a){let e="ENVMAP_MODE_REFLECTION";if(a.envMap)switch(a.envMapMode){case ns:e="ENVMAP_MODE_REFRACTION";break}return e}function Rg(a){let e="ENVMAP_BLENDING_NONE";if(a.envMap)switch(a.combine){case Lh:e="ENVMAP_BLENDING_MULTIPLY";break;case du:e="ENVMAP_BLENDING_MIX";break;case uu:e="ENVMAP_BLENDING_ADD";break}return e}function Cg(a){const e=a.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Pg(a,e,t,i){const n=a.getContext(),s=t.defines;let r=t.vertexShader,o=t.fragmentShader;const c=Tg(t),l=Ag(t),h=Eg(t),d=Rg(t),u=Cg(t),f=vg(t),g=bg(s),b=n.createProgram();let m,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[kc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[kc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bi?"#define TONE_MAPPING":"",t.toneMapping!==Bi?Fe.tonemapping_pars_fragment:"",t.toneMapping!==Bi?mg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,pg("linearToOutputTexel",t.outputColorSpace),gg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),r=Xo(r),r=Pc(r,t),r=Dc(r,t),o=Xo(o),o=Pc(o,t),o=Dc(o,t),r=Lc(r),o=Lc(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const _=v+m+r,x=v+p+o,A=Ec(n,n.VERTEX_SHADER,_),w=Ec(n,n.FRAGMENT_SHADER,x);n.attachShader(b,A),n.attachShader(b,w),t.index0AttributeName!==void 0?n.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&n.bindAttribLocation(b,0,"position"),n.linkProgram(b);function R(D){if(a.debug.checkShaderErrors){const U=n.getProgramInfoLog(b).trim(),N=n.getShaderInfoLog(A).trim(),W=n.getShaderInfoLog(w).trim();let X=!0,G=!0;if(n.getProgramParameter(b,n.LINK_STATUS)===!1)if(X=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(n,b,A,w);else{const Y=Cc(n,A,"vertex"),H=Cc(n,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(b,n.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+U+`
`+Y+`
`+H)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(N===""||W==="")&&(G=!1);G&&(D.diagnostics={runnable:X,programLog:U,vertexShader:{log:N,prefix:m},fragmentShader:{log:W,prefix:p}})}n.deleteShader(A),n.deleteShader(w),P=new Xa(n,b),M=xg(n,b)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=n.getProgramParameter(b,hg)),y},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dg++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=A,this.fragmentShader=w,this}let Dg=0;class Lg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,n=this._getShaderStage(t),s=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(s)===!1&&(r.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new kg(e),t.set(e,i)),i}}class kg{constructor(e){this.id=Dg++,this.code=e,this.usedTimes=0}}function Ig(a,e,t,i,n,s,r){const o=new pl,c=new Lg,l=new Set,h=[],d=n.logarithmicDepthBuffer,u=n.vertexTextures;let f=n.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,y,D,U,N){const W=U.fog,X=N.geometry,G=M.isMeshStandardMaterial?U.environment:null,Y=(M.isMeshStandardMaterial?t:e).get(M.envMap||G),H=Y&&Y.mapping===rr?Y.image.height:null,ne=g[M.type];M.precision!==null&&(f=n.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const oe=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ve=oe!==void 0?oe.length:0;let Ne=0;X.morphAttributes.position!==void 0&&(Ne=1),X.morphAttributes.normal!==void 0&&(Ne=2),X.morphAttributes.color!==void 0&&(Ne=3);let Qe,j,Q,ue;if(ne){const Ze=fi[ne];Qe=Ze.vertexShader,j=Ze.fragmentShader}else Qe=M.vertexShader,j=M.fragmentShader,c.update(M),Q=c.getVertexShaderID(M),ue=c.getFragmentShaderID(M);const se=a.getRenderTarget(),Ae=a.state.buffers.depth.getReversed(),Pe=N.isInstancedMesh===!0,Oe=N.isBatchedMesh===!0,lt=!!M.map,je=!!M.matcap,ft=!!Y,F=!!M.aoMap,Wt=!!M.lightMap,Ge=!!M.bumpMap,Ve=!!M.normalMap,we=!!M.displacementMap,st=!!M.emissiveMap,Se=!!M.metalnessMap,C=!!M.roughnessMap,S=M.anisotropy>0,O=M.clearcoat>0,$=M.dispersion>0,J=M.iridescence>0,q=M.sheen>0,ye=M.transmission>0,le=S&&!!M.anisotropyMap,fe=O&&!!M.clearcoatMap,Xe=O&&!!M.clearcoatNormalMap,ee=O&&!!M.clearcoatRoughnessMap,pe=J&&!!M.iridescenceMap,Te=J&&!!M.iridescenceThicknessMap,Re=q&&!!M.sheenColorMap,me=q&&!!M.sheenRoughnessMap,We=!!M.specularMap,Ie=!!M.specularColorMap,it=!!M.specularIntensityMap,L=ye&&!!M.transmissionMap,re=ye&&!!M.thicknessMap,V=!!M.gradientMap,K=!!M.alphaMap,de=M.alphaTest>0,ce=!!M.alphaHash,De=!!M.extensions;let dt=Bi;M.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(dt=a.toneMapping);const wt={shaderID:ne,shaderType:M.type,shaderName:M.name,vertexShader:Qe,fragmentShader:j,defines:M.defines,customVertexShaderID:Q,customFragmentShaderID:ue,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Oe,batchingColor:Oe&&N._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&N.instanceColor!==null,instancingMorph:Pe&&N.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:se===null?a.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:It,alphaToCoverage:!!M.alphaToCoverage,map:lt,matcap:je,envMap:ft,envMapMode:ft&&Y.mapping,envMapCubeUVHeight:H,aoMap:F,lightMap:Wt,bumpMap:Ge,normalMap:Ve,displacementMap:u&&we,emissiveMap:st,normalMapObjectSpace:Ve&&M.normalMapType===Au,normalMapTangentSpace:Ve&&M.normalMapType===qh,metalnessMap:Se,roughnessMap:C,anisotropy:S,anisotropyMap:le,clearcoat:O,clearcoatMap:fe,clearcoatNormalMap:Xe,clearcoatRoughnessMap:ee,dispersion:$,iridescence:J,iridescenceMap:pe,iridescenceThicknessMap:Te,sheen:q,sheenColorMap:Re,sheenRoughnessMap:me,specularMap:We,specularColorMap:Ie,specularIntensityMap:it,transmission:ye,transmissionMap:L,thicknessMap:re,gradientMap:V,opaque:M.transparent===!1&&M.blending===an&&M.alphaToCoverage===!1,alphaMap:K,alphaTest:de,alphaHash:ce,combine:M.combine,mapUv:lt&&b(M.map.channel),aoMapUv:F&&b(M.aoMap.channel),lightMapUv:Wt&&b(M.lightMap.channel),bumpMapUv:Ge&&b(M.bumpMap.channel),normalMapUv:Ve&&b(M.normalMap.channel),displacementMapUv:we&&b(M.displacementMap.channel),emissiveMapUv:st&&b(M.emissiveMap.channel),metalnessMapUv:Se&&b(M.metalnessMap.channel),roughnessMapUv:C&&b(M.roughnessMap.channel),anisotropyMapUv:le&&b(M.anisotropyMap.channel),clearcoatMapUv:fe&&b(M.clearcoatMap.channel),clearcoatNormalMapUv:Xe&&b(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&b(M.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&b(M.iridescenceMap.channel),iridescenceThicknessMapUv:Te&&b(M.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&b(M.sheenColorMap.channel),sheenRoughnessMapUv:me&&b(M.sheenRoughnessMap.channel),specularMapUv:We&&b(M.specularMap.channel),specularColorMapUv:Ie&&b(M.specularColorMap.channel),specularIntensityMapUv:it&&b(M.specularIntensityMap.channel),transmissionMapUv:L&&b(M.transmissionMap.channel),thicknessMapUv:re&&b(M.thicknessMap.channel),alphaMapUv:K&&b(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Ve||S),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!X.attributes.uv&&(lt||K),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Ae,skinning:N.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Ne,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:a.shadowMap.enabled&&D.length>0,shadowMapType:a.shadowMap.type,toneMapping:dt,decodeVideoTexture:lt&&M.map.isVideoTexture===!0&&He.getTransfer(M.map.colorSpace)===tt,decodeVideoTextureEmissive:st&&M.emissiveMap.isVideoTexture===!0&&He.getTransfer(M.emissiveMap.colorSpace)===tt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Gt,flipSided:M.side===Lt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:De&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&M.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return wt.vertexUv1s=l.has(1),wt.vertexUv2s=l.has(2),wt.vertexUv3s=l.has(3),l.clear(),wt}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)y.push(D),y.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(v(y,M),_(y,M),y.push(a.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function v(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function _(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const y=g[M.type];let D;if(y){const U=fi[y];D=Ja.clone(U.uniforms)}else D=M.uniforms;return D}function A(M,y){let D;for(let U=0,N=h.length;U<N;U++){const W=h[U];if(W.cacheKey===y){D=W,++D.usedTimes;break}}return D===void 0&&(D=new Pg(a,y,M,s),h.push(D)),D}function w(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function R(M){c.remove(M)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:A,releaseProgram:w,releaseShaderCache:R,programs:h,dispose:P}}function Fg(){let a=new WeakMap;function e(r){return a.has(r)}function t(r){let o=a.get(r);return o===void 0&&(o={},a.set(r,o)),o}function i(r){a.delete(r)}function n(r,o,c){a.get(r)[o]=c}function s(){a=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:s}}function Ug(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.z!==e.z?a.z-e.z:a.id-e.id}function Ic(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function Fc(){const a=[];let e=0;const t=[],i=[],n=[];function s(){e=0,t.length=0,i.length=0,n.length=0}function r(d,u,f,g,b,m){let p=a[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:b,group:m},a[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=b,p.group=m),e++,p}function o(d,u,f,g,b,m){const p=r(d,u,f,g,b,m);f.transmission>0?i.push(p):f.transparent===!0?n.push(p):t.push(p)}function c(d,u,f,g,b,m){const p=r(d,u,f,g,b,m);f.transmission>0?i.unshift(p):f.transparent===!0?n.unshift(p):t.unshift(p)}function l(d,u){t.length>1&&t.sort(d||Ug),i.length>1&&i.sort(u||Ic),n.length>1&&n.sort(u||Ic)}function h(){for(let d=e,u=a.length;d<u;d++){const f=a[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:n,init:s,push:o,unshift:c,finish:h,sort:l}}function Ng(){let a=new WeakMap;function e(i,n){const s=a.get(i);let r;return s===void 0?(r=new Fc,a.set(i,[r])):n>=s.length?(r=new Fc,s.push(r)):r=s[n],r}function t(){a=new WeakMap}return{get:e,dispose:t}}function Og(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new T,color:new ie};break;case"SpotLight":t={position:new T,direction:new T,color:new ie,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new T,color:new ie,distance:0,decay:0};break;case"HemisphereLight":t={direction:new T,skyColor:new ie,groundColor:new ie};break;case"RectAreaLight":t={color:new ie,position:new T,halfWidth:new T,halfHeight:new T};break}return a[e.id]=t,t}}}function zg(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Z,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let Bg=0;function Hg(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function Gg(a){const e=new Og,t=zg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new T);const n=new T,s=new Ee,r=new Ee;function o(l){let h=0,d=0,u=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let f=0,g=0,b=0,m=0,p=0,v=0,_=0,x=0,A=0,w=0,R=0;l.sort(Hg);for(let M=0,y=l.length;M<y;M++){const D=l[M],U=D.color,N=D.intensity,W=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=U.r*N,d+=U.g*N,u+=U.b*N;else if(D.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(D.sh.coefficients[G],N);R++}else if(D.isDirectionalLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Y=D.shadow,H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,i.directionalShadow[f]=H,i.directionalShadowMap[f]=X,i.directionalShadowMatrix[f]=D.shadow.matrix,v++}i.directional[f]=G,f++}else if(D.isSpotLight){const G=e.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(U).multiplyScalar(N),G.distance=W,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,i.spot[b]=G;const Y=D.shadow;if(D.map&&(i.spotLightMap[A]=D.map,A++,Y.updateMatrices(D),D.castShadow&&w++),i.spotLightMatrix[b]=Y.matrix,D.castShadow){const H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,i.spotShadow[b]=H,i.spotShadowMap[b]=X,x++}b++}else if(D.isRectAreaLight){const G=e.get(D);G.color.copy(U).multiplyScalar(N),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=G,m++}else if(D.isPointLight){const G=e.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){const Y=D.shadow,H=t.get(D);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,H.shadowCameraNear=Y.camera.near,H.shadowCameraFar=Y.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=D.shadow.matrix,_++}i.point[g]=G,g++}else if(D.isHemisphereLight){const G=e.get(D);G.skyColor.copy(D.color).multiplyScalar(N),G.groundColor.copy(D.groundColor).multiplyScalar(N),i.hemi[p]=G,p++}}m>0&&(a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const P=i.hash;(P.directionalLength!==f||P.pointLength!==g||P.spotLength!==b||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==v||P.numPointShadows!==_||P.numSpotShadows!==x||P.numSpotMaps!==A||P.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=b,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+A-w,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=R,P.directionalLength=f,P.pointLength=g,P.spotLength=b,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=v,P.numPointShadows=_,P.numSpotShadows=x,P.numSpotMaps=A,P.numLightProbes=R,i.version=Bg++)}function c(l,h){let d=0,u=0,f=0,g=0,b=0;const m=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){const _=l[p];if(_.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(m),d++}else if(_.isSpotLight){const x=i.spot[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(n),x.direction.transformDirection(m),f++}else if(_.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),r.identity(),s.copy(_.matrixWorld),s.premultiply(m),r.extractRotation(s),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const x=i.point[u];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),u++}else if(_.isHemisphereLight){const x=i.hemi[b];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),b++}}}return{setup:o,setupView:c,state:i}}function Uc(a){const e=new Gg(a),t=[],i=[];function n(h){l.camera=h,t.length=0,i.length=0}function s(h){t.push(h)}function r(h){i.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:n,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:r}}function Vg(a){let e=new WeakMap;function t(n,s=0){const r=e.get(n);let o;return r===void 0?(o=new Uc(a),e.set(n,[o])):s>=r.length?(o=new Uc(a),r.push(o)):o=r[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class Wg extends li{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=wu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class jg extends li{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Xg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qg=`uniform sampler2D shadow_pass;
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
}`;function $g(a,e,t){let i=new ml;const n=new Z,s=new Z,r=new $e,o=new Wg({depthPacking:Tu}),c=new jg,l={},h=t.maxTextureSize,d={[Vi]:Lt,[Lt]:Vi,[Gt]:Gt},u=new ht({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Z},radius:{value:4}},vertexShader:Xg,fragmentShader:qg}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new ut;g.setAttribute("position",new vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Ue(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ph;let p=this.type;this.render=function(w,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=a.getRenderTarget(),y=a.getActiveCubeFace(),D=a.getActiveMipmapLevel(),U=a.state;U.setBlending(zi),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const N=p!==Di&&this.type===Di,W=p===Di&&this.type!==Di;for(let X=0,G=w.length;X<G;X++){const Y=w[X],H=Y.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;n.copy(H.mapSize);const ne=H.getFrameExtents();if(n.multiply(ne),s.copy(H.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/ne.x),n.x=s.x*ne.x,H.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/ne.y),n.y=s.y*ne.y,H.mapSize.y=s.y)),H.map===null||N===!0||W===!0){const ve=this.type!==Di?{minFilter:kt,magFilter:kt}:{};H.map!==null&&H.map.dispose(),H.map=new oi(n.x,n.y,ve),H.map.texture.name=Y.name+".shadowMap",H.camera.updateProjectionMatrix()}a.setRenderTarget(H.map),a.clear();const oe=H.getViewportCount();for(let ve=0;ve<oe;ve++){const Ne=H.getViewport(ve);r.set(s.x*Ne.x,s.y*Ne.y,s.x*Ne.z,s.y*Ne.w),U.viewport(r),H.updateMatrices(Y,ve),i=H.getFrustum(),x(R,P,H.camera,Y,this.type)}H.isPointLightShadow!==!0&&this.type===Di&&v(H,P),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,a.setRenderTarget(M,y,D)};function v(w,R){const P=e.update(b);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new oi(n.x,n.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,a.setRenderTarget(w.mapPass),a.clear(),a.renderBufferDirect(R,null,P,u,b,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,a.setRenderTarget(w.map),a.clear(),a.renderBufferDirect(R,null,P,f,b,null)}function _(w,R,P,M){let y=null;const D=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)y=D;else if(y=P.isPointLight===!0?c:o,a.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const U=y.uuid,N=R.uuid;let W=l[U];W===void 0&&(W={},l[U]=W);let X=W[N];X===void 0&&(X=y.clone(),W[N]=X,R.addEventListener("dispose",A)),y=X}if(y.visible=R.visible,y.wireframe=R.wireframe,M===Di?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:d[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=a.properties.get(y);U.light=P}return y}function x(w,R,P,M,y){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===Di)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const N=e.update(w),W=w.material;if(Array.isArray(W)){const X=N.groups;for(let G=0,Y=X.length;G<Y;G++){const H=X[G],ne=W[H.materialIndex];if(ne&&ne.visible){const oe=_(w,ne,M,y);w.onBeforeShadow(a,w,R,P,N,oe,H),a.renderBufferDirect(P,null,N,oe,w,H),w.onAfterShadow(a,w,R,P,N,oe,H)}}}else if(W.visible){const X=_(w,W,M,y);w.onBeforeShadow(a,w,R,P,N,X,null),a.renderBufferDirect(P,null,N,X,w,null),w.onAfterShadow(a,w,R,P,N,X,null)}}const U=w.children;for(let N=0,W=U.length;N<W;N++)x(U[N],R,P,M,y)}function A(w){w.target.removeEventListener("dispose",A);for(const P in l){const M=l[P],y=w.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const Kg={[oo]:lo,[co]:fo,[ho]:po,[ts]:uo,[lo]:oo,[fo]:co,[po]:ho,[uo]:ts};function Yg(a,e){function t(){let L=!1;const re=new $e;let V=null;const K=new $e(0,0,0,0);return{setMask:function(de){V!==de&&!L&&(a.colorMask(de,de,de,de),V=de)},setLocked:function(de){L=de},setClear:function(de,ce,De,dt,wt){wt===!0&&(de*=dt,ce*=dt,De*=dt),re.set(de,ce,De,dt),K.equals(re)===!1&&(a.clearColor(de,ce,De,dt),K.copy(re))},reset:function(){L=!1,V=null,K.set(-1,0,0,0)}}}function i(){let L=!1,re=!1,V=null,K=null,de=null;return{setReversed:function(ce){if(re!==ce){const De=e.get("EXT_clip_control");re?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT);const dt=de;de=null,this.setClear(dt)}re=ce},getReversed:function(){return re},setTest:function(ce){ce?se(a.DEPTH_TEST):Ae(a.DEPTH_TEST)},setMask:function(ce){V!==ce&&!L&&(a.depthMask(ce),V=ce)},setFunc:function(ce){if(re&&(ce=Kg[ce]),K!==ce){switch(ce){case oo:a.depthFunc(a.NEVER);break;case lo:a.depthFunc(a.ALWAYS);break;case co:a.depthFunc(a.LESS);break;case ts:a.depthFunc(a.LEQUAL);break;case ho:a.depthFunc(a.EQUAL);break;case uo:a.depthFunc(a.GEQUAL);break;case fo:a.depthFunc(a.GREATER);break;case po:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}K=ce}},setLocked:function(ce){L=ce},setClear:function(ce){de!==ce&&(re&&(ce=1-ce),a.clearDepth(ce),de=ce)},reset:function(){L=!1,V=null,K=null,de=null,re=!1}}}function n(){let L=!1,re=null,V=null,K=null,de=null,ce=null,De=null,dt=null,wt=null;return{setTest:function(Ze){L||(Ze?se(a.STENCIL_TEST):Ae(a.STENCIL_TEST))},setMask:function(Ze){re!==Ze&&!L&&(a.stencilMask(Ze),re=Ze)},setFunc:function(Ze,Jt,Si){(V!==Ze||K!==Jt||de!==Si)&&(a.stencilFunc(Ze,Jt,Si),V=Ze,K=Jt,de=Si)},setOp:function(Ze,Jt,Si){(ce!==Ze||De!==Jt||dt!==Si)&&(a.stencilOp(Ze,Jt,Si),ce=Ze,De=Jt,dt=Si)},setLocked:function(Ze){L=Ze},setClear:function(Ze){wt!==Ze&&(a.clearStencil(Ze),wt=Ze)},reset:function(){L=!1,re=null,V=null,K=null,de=null,ce=null,De=null,dt=null,wt=null}}}const s=new t,r=new i,o=new n,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,b=!1,m=null,p=null,v=null,_=null,x=null,A=null,w=null,R=new ie(0,0,0),P=0,M=!1,y=null,D=null,U=null,N=null,W=null;const X=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Y=0;const H=a.getParameter(a.VERSION);H.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(H)[1]),G=Y>=1):H.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),G=Y>=2);let ne=null,oe={};const ve=a.getParameter(a.SCISSOR_BOX),Ne=a.getParameter(a.VIEWPORT),Qe=new $e().fromArray(ve),j=new $e().fromArray(Ne);function Q(L,re,V,K){const de=new Uint8Array(4),ce=a.createTexture();a.bindTexture(L,ce),a.texParameteri(L,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(L,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let De=0;De<V;De++)L===a.TEXTURE_3D||L===a.TEXTURE_2D_ARRAY?a.texImage3D(re,0,a.RGBA,1,1,K,0,a.RGBA,a.UNSIGNED_BYTE,de):a.texImage2D(re+De,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,de);return ce}const ue={};ue[a.TEXTURE_2D]=Q(a.TEXTURE_2D,a.TEXTURE_2D,1),ue[a.TEXTURE_CUBE_MAP]=Q(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[a.TEXTURE_2D_ARRAY]=Q(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),ue[a.TEXTURE_3D]=Q(a.TEXTURE_3D,a.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),se(a.DEPTH_TEST),r.setFunc(ts),Ge(!1),Ve(Hl),se(a.CULL_FACE),F(zi);function se(L){h[L]!==!0&&(a.enable(L),h[L]=!0)}function Ae(L){h[L]!==!1&&(a.disable(L),h[L]=!1)}function Pe(L,re){return d[L]!==re?(a.bindFramebuffer(L,re),d[L]=re,L===a.DRAW_FRAMEBUFFER&&(d[a.FRAMEBUFFER]=re),L===a.FRAMEBUFFER&&(d[a.DRAW_FRAMEBUFFER]=re),!0):!1}function Oe(L,re){let V=f,K=!1;if(L){V=u.get(re),V===void 0&&(V=[],u.set(re,V));const de=L.textures;if(V.length!==de.length||V[0]!==a.COLOR_ATTACHMENT0){for(let ce=0,De=de.length;ce<De;ce++)V[ce]=a.COLOR_ATTACHMENT0+ce;V.length=de.length,K=!0}}else V[0]!==a.BACK&&(V[0]=a.BACK,K=!0);K&&a.drawBuffers(V)}function lt(L){return g!==L?(a.useProgram(L),g=L,!0):!1}const je={[bn]:a.FUNC_ADD,[$d]:a.FUNC_SUBTRACT,[Kd]:a.FUNC_REVERSE_SUBTRACT};je[Yd]=a.MIN,je[Jd]=a.MAX;const ft={[Qd]:a.ZERO,[Zd]:a.ONE,[eu]:a.SRC_COLOR,[ao]:a.SRC_ALPHA,[ru]:a.SRC_ALPHA_SATURATE,[su]:a.DST_COLOR,[iu]:a.DST_ALPHA,[tu]:a.ONE_MINUS_SRC_COLOR,[ro]:a.ONE_MINUS_SRC_ALPHA,[au]:a.ONE_MINUS_DST_COLOR,[nu]:a.ONE_MINUS_DST_ALPHA,[ou]:a.CONSTANT_COLOR,[lu]:a.ONE_MINUS_CONSTANT_COLOR,[cu]:a.CONSTANT_ALPHA,[hu]:a.ONE_MINUS_CONSTANT_ALPHA};function F(L,re,V,K,de,ce,De,dt,wt,Ze){if(L===zi){b===!0&&(Ae(a.BLEND),b=!1);return}if(b===!1&&(se(a.BLEND),b=!0),L!==qd){if(L!==m||Ze!==M){if((p!==bn||x!==bn)&&(a.blendEquation(a.FUNC_ADD),p=bn,x=bn),Ze)switch(L){case an:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case Mt:a.blendFunc(a.ONE,a.ONE);break;case Gl:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Vl:a.blendFuncSeparate(a.ZERO,a.SRC_COLOR,a.ZERO,a.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case an:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case Mt:a.blendFunc(a.SRC_ALPHA,a.ONE);break;case Gl:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Vl:a.blendFunc(a.ZERO,a.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}v=null,_=null,A=null,w=null,R.set(0,0,0),P=0,m=L,M=Ze}return}de=de||re,ce=ce||V,De=De||K,(re!==p||de!==x)&&(a.blendEquationSeparate(je[re],je[de]),p=re,x=de),(V!==v||K!==_||ce!==A||De!==w)&&(a.blendFuncSeparate(ft[V],ft[K],ft[ce],ft[De]),v=V,_=K,A=ce,w=De),(dt.equals(R)===!1||wt!==P)&&(a.blendColor(dt.r,dt.g,dt.b,wt),R.copy(dt),P=wt),m=L,M=!1}function Wt(L,re){L.side===Gt?Ae(a.CULL_FACE):se(a.CULL_FACE);let V=L.side===Lt;re&&(V=!V),Ge(V),L.blending===an&&L.transparent===!1?F(zi):F(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),r.setFunc(L.depthFunc),r.setTest(L.depthTest),r.setMask(L.depthWrite),s.setMask(L.colorWrite);const K=L.stencilWrite;o.setTest(K),K&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),st(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?se(a.SAMPLE_ALPHA_TO_COVERAGE):Ae(a.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(L){y!==L&&(L?a.frontFace(a.CW):a.frontFace(a.CCW),y=L)}function Ve(L){L!==jd?(se(a.CULL_FACE),L!==D&&(L===Hl?a.cullFace(a.BACK):L===Xd?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):Ae(a.CULL_FACE),D=L}function we(L){L!==U&&(G&&a.lineWidth(L),U=L)}function st(L,re,V){L?(se(a.POLYGON_OFFSET_FILL),(N!==re||W!==V)&&(a.polygonOffset(re,V),N=re,W=V)):Ae(a.POLYGON_OFFSET_FILL)}function Se(L){L?se(a.SCISSOR_TEST):Ae(a.SCISSOR_TEST)}function C(L){L===void 0&&(L=a.TEXTURE0+X-1),ne!==L&&(a.activeTexture(L),ne=L)}function S(L,re,V){V===void 0&&(ne===null?V=a.TEXTURE0+X-1:V=ne);let K=oe[V];K===void 0&&(K={type:void 0,texture:void 0},oe[V]=K),(K.type!==L||K.texture!==re)&&(ne!==V&&(a.activeTexture(V),ne=V),a.bindTexture(L,re||ue[L]),K.type=L,K.texture=re)}function O(){const L=oe[ne];L!==void 0&&L.type!==void 0&&(a.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function $(){try{a.compressedTexImage2D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{a.compressedTexImage3D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{a.texSubImage2D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ye(){try{a.texSubImage3D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function le(){try{a.compressedTexSubImage2D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{a.compressedTexSubImage3D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Xe(){try{a.texStorage2D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ee(){try{a.texStorage3D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pe(){try{a.texImage2D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Te(){try{a.texImage3D.apply(a,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Re(L){Qe.equals(L)===!1&&(a.scissor(L.x,L.y,L.z,L.w),Qe.copy(L))}function me(L){j.equals(L)===!1&&(a.viewport(L.x,L.y,L.z,L.w),j.copy(L))}function We(L,re){let V=l.get(re);V===void 0&&(V=new WeakMap,l.set(re,V));let K=V.get(L);K===void 0&&(K=a.getUniformBlockIndex(re,L.name),V.set(L,K))}function Ie(L,re){const K=l.get(re).get(L);c.get(re)!==K&&(a.uniformBlockBinding(re,K,L.__bindingPointIndex),c.set(re,K))}function it(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),r.setReversed(!1),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),h={},ne=null,oe={},d={},u=new WeakMap,f=[],g=null,b=!1,m=null,p=null,v=null,_=null,x=null,A=null,w=null,R=new ie(0,0,0),P=0,M=!1,y=null,D=null,U=null,N=null,W=null,Qe.set(0,0,a.canvas.width,a.canvas.height),j.set(0,0,a.canvas.width,a.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:se,disable:Ae,bindFramebuffer:Pe,drawBuffers:Oe,useProgram:lt,setBlending:F,setMaterial:Wt,setFlipSided:Ge,setCullFace:Ve,setLineWidth:we,setPolygonOffset:st,setScissorTest:Se,activeTexture:C,bindTexture:S,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:J,texImage2D:pe,texImage3D:Te,updateUBOMapping:We,uniformBlockBinding:Ie,texStorage2D:Xe,texStorage3D:ee,texSubImage2D:q,texSubImage3D:ye,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Re,viewport:me,reset:it}}function Nc(a,e,t,i){const n=Jg(i);switch(t){case Oh:return a*e;case Bh:return a*e;case Hh:return a*e*2;case ll:return a*e/n.components*n.byteLength;case cl:return a*e/n.components*n.byteLength;case Gh:return a*e*2/n.components*n.byteLength;case hl:return a*e*2/n.components*n.byteLength;case zh:return a*e*3/n.components*n.byteLength;case Yt:return a*e*4/n.components*n.byteLength;case dl:return a*e*4/n.components*n.byteLength;case Ha:case Ga:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case Va:case Wa:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case bo:case _o:return Math.max(a,16)*Math.max(e,8)/4;case vo:case xo:return Math.max(a,8)*Math.max(e,8)/2;case yo:case Mo:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*8;case So:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case wo:return Math.floor((a+3)/4)*Math.floor((e+3)/4)*16;case To:return Math.floor((a+4)/5)*Math.floor((e+3)/4)*16;case Ao:return Math.floor((a+4)/5)*Math.floor((e+4)/5)*16;case Eo:return Math.floor((a+5)/6)*Math.floor((e+4)/5)*16;case Ro:return Math.floor((a+5)/6)*Math.floor((e+5)/6)*16;case Co:return Math.floor((a+7)/8)*Math.floor((e+4)/5)*16;case Po:return Math.floor((a+7)/8)*Math.floor((e+5)/6)*16;case Do:return Math.floor((a+7)/8)*Math.floor((e+7)/8)*16;case Lo:return Math.floor((a+9)/10)*Math.floor((e+4)/5)*16;case ko:return Math.floor((a+9)/10)*Math.floor((e+5)/6)*16;case Io:return Math.floor((a+9)/10)*Math.floor((e+7)/8)*16;case Fo:return Math.floor((a+9)/10)*Math.floor((e+9)/10)*16;case Uo:return Math.floor((a+11)/12)*Math.floor((e+9)/10)*16;case No:return Math.floor((a+11)/12)*Math.floor((e+11)/12)*16;case ja:case Oo:case zo:return Math.ceil(a/4)*Math.ceil(e/4)*16;case Vh:case Bo:return Math.ceil(a/4)*Math.ceil(e/4)*8;case Ho:case Go:return Math.ceil(a/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jg(a){switch(a){case Wi:case Fh:return{byteLength:1,components:1};case Xs:case Uh:case Hi:return{byteLength:2,components:1};case rl:case ol:return{byteLength:2,components:4};case Mn:case al:case ai:return{byteLength:4,components:1};case Nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${a}.`)}function Qg(a,e,t,i,n,s,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Z,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return f?new OffscreenCanvas(C,S):Ks("canvas")}function b(C,S,O){let $=1;const J=Se(C);if((J.width>O||J.height>O)&&($=O/Math.max(J.width,J.height)),$<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const q=Math.floor($*J.width),ye=Math.floor($*J.height);d===void 0&&(d=g(q,ye));const le=S?g(q,ye):d;return le.width=q,le.height=ye,le.getContext("2d").drawImage(C,0,0,q,ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+ye+")."),le}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){a.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?a.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?a.TEXTURE_2D_ARRAY:a.TEXTURE_2D}function _(C,S,O,$,J=!1){if(C!==null){if(a[C]!==void 0)return a[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let q=S;if(S===a.RED&&(O===a.FLOAT&&(q=a.R32F),O===a.HALF_FLOAT&&(q=a.R16F),O===a.UNSIGNED_BYTE&&(q=a.R8)),S===a.RED_INTEGER&&(O===a.UNSIGNED_BYTE&&(q=a.R8UI),O===a.UNSIGNED_SHORT&&(q=a.R16UI),O===a.UNSIGNED_INT&&(q=a.R32UI),O===a.BYTE&&(q=a.R8I),O===a.SHORT&&(q=a.R16I),O===a.INT&&(q=a.R32I)),S===a.RG&&(O===a.FLOAT&&(q=a.RG32F),O===a.HALF_FLOAT&&(q=a.RG16F),O===a.UNSIGNED_BYTE&&(q=a.RG8)),S===a.RG_INTEGER&&(O===a.UNSIGNED_BYTE&&(q=a.RG8UI),O===a.UNSIGNED_SHORT&&(q=a.RG16UI),O===a.UNSIGNED_INT&&(q=a.RG32UI),O===a.BYTE&&(q=a.RG8I),O===a.SHORT&&(q=a.RG16I),O===a.INT&&(q=a.RG32I)),S===a.RGB_INTEGER&&(O===a.UNSIGNED_BYTE&&(q=a.RGB8UI),O===a.UNSIGNED_SHORT&&(q=a.RGB16UI),O===a.UNSIGNED_INT&&(q=a.RGB32UI),O===a.BYTE&&(q=a.RGB8I),O===a.SHORT&&(q=a.RGB16I),O===a.INT&&(q=a.RGB32I)),S===a.RGBA_INTEGER&&(O===a.UNSIGNED_BYTE&&(q=a.RGBA8UI),O===a.UNSIGNED_SHORT&&(q=a.RGBA16UI),O===a.UNSIGNED_INT&&(q=a.RGBA32UI),O===a.BYTE&&(q=a.RGBA8I),O===a.SHORT&&(q=a.RGBA16I),O===a.INT&&(q=a.RGBA32I)),S===a.RGB&&O===a.UNSIGNED_INT_5_9_9_9_REV&&(q=a.RGB9_E5),S===a.RGBA){const ye=J?or:He.getTransfer($);O===a.FLOAT&&(q=a.RGBA32F),O===a.HALF_FLOAT&&(q=a.RGBA16F),O===a.UNSIGNED_BYTE&&(q=ye===tt?a.SRGB8_ALPHA8:a.RGBA8),O===a.UNSIGNED_SHORT_4_4_4_4&&(q=a.RGBA4),O===a.UNSIGNED_SHORT_5_5_5_1&&(q=a.RGB5_A1)}return(q===a.R16F||q===a.R32F||q===a.RG16F||q===a.RG32F||q===a.RGBA16F||q===a.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function x(C,S){let O;return C?S===null||S===Mn||S===ss?O=a.DEPTH24_STENCIL8:S===ai?O=a.DEPTH32F_STENCIL8:S===Xs&&(O=a.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Mn||S===ss?O=a.DEPTH_COMPONENT24:S===ai?O=a.DEPTH_COMPONENT32F:S===Xs&&(O=a.DEPTH_COMPONENT16),O}function A(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==kt&&C.minFilter!==Vt?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function w(C){const S=C.target;S.removeEventListener("dispose",w),P(S),S.isVideoTexture&&h.delete(S)}function R(C){const S=C.target;S.removeEventListener("dispose",R),y(S)}function P(C){const S=i.get(C);if(S.__webglInit===void 0)return;const O=C.source,$=u.get(O);if($){const J=$[S.__cacheKey];J.usedTimes--,J.usedTimes===0&&M(C),Object.keys($).length===0&&u.delete(O)}i.remove(C)}function M(C){const S=i.get(C);a.deleteTexture(S.__webglTexture);const O=C.source,$=u.get(O);delete $[S.__cacheKey],r.memory.textures--}function y(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let J=0;J<S.__webglFramebuffer[$].length;J++)a.deleteFramebuffer(S.__webglFramebuffer[$][J]);else a.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&a.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)a.deleteFramebuffer(S.__webglFramebuffer[$]);else a.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&a.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&a.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&a.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&a.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const O=C.textures;for(let $=0,J=O.length;$<J;$++){const q=i.get(O[$]);q.__webglTexture&&(a.deleteTexture(q.__webglTexture),r.memory.textures--),i.remove(O[$])}i.remove(C)}let D=0;function U(){D=0}function N(){const C=D;return C>=n.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+n.maxTextures),D+=1,C}function W(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function X(C,S){const O=i.get(C);if(C.isVideoTexture&&we(C),C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){const $=C.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(O,C,S);return}}t.bindTexture(a.TEXTURE_2D,O.__webglTexture,a.TEXTURE0+S)}function G(C,S){const O=i.get(C);if(C.version>0&&O.__version!==C.version){j(O,C,S);return}t.bindTexture(a.TEXTURE_2D_ARRAY,O.__webglTexture,a.TEXTURE0+S)}function Y(C,S){const O=i.get(C);if(C.version>0&&O.__version!==C.version){j(O,C,S);return}t.bindTexture(a.TEXTURE_3D,O.__webglTexture,a.TEXTURE0+S)}function H(C,S){const O=i.get(C);if(C.version>0&&O.__version!==C.version){Q(O,C,S);return}t.bindTexture(a.TEXTURE_CUBE_MAP,O.__webglTexture,a.TEXTURE0+S)}const ne={[yn]:a.REPEAT,[nn]:a.CLAMP_TO_EDGE,[$a]:a.MIRRORED_REPEAT},oe={[kt]:a.NEAREST,[Ih]:a.NEAREST_MIPMAP_NEAREST,[Is]:a.NEAREST_MIPMAP_LINEAR,[Vt]:a.LINEAR,[Ba]:a.LINEAR_MIPMAP_NEAREST,[pi]:a.LINEAR_MIPMAP_LINEAR},ve={[Eu]:a.NEVER,[ku]:a.ALWAYS,[Ru]:a.LESS,[$h]:a.LEQUAL,[Cu]:a.EQUAL,[Lu]:a.GEQUAL,[Pu]:a.GREATER,[Du]:a.NOTEQUAL};function Ne(C,S){if(S.type===ai&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Vt||S.magFilter===Ba||S.magFilter===Is||S.magFilter===pi||S.minFilter===Vt||S.minFilter===Ba||S.minFilter===Is||S.minFilter===pi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),a.texParameteri(C,a.TEXTURE_WRAP_S,ne[S.wrapS]),a.texParameteri(C,a.TEXTURE_WRAP_T,ne[S.wrapT]),(C===a.TEXTURE_3D||C===a.TEXTURE_2D_ARRAY)&&a.texParameteri(C,a.TEXTURE_WRAP_R,ne[S.wrapR]),a.texParameteri(C,a.TEXTURE_MAG_FILTER,oe[S.magFilter]),a.texParameteri(C,a.TEXTURE_MIN_FILTER,oe[S.minFilter]),S.compareFunction&&(a.texParameteri(C,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(C,a.TEXTURE_COMPARE_FUNC,ve[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===kt||S.minFilter!==Is&&S.minFilter!==pi||S.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");a.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,n.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Qe(C,S){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",w));const $=S.source;let J=u.get($);J===void 0&&(J={},u.set($,J));const q=W(S);if(q!==C.__cacheKey){J[q]===void 0&&(J[q]={texture:a.createTexture(),usedTimes:0},r.memory.textures++,O=!0),J[q].usedTimes++;const ye=J[C.__cacheKey];ye!==void 0&&(J[C.__cacheKey].usedTimes--,ye.usedTimes===0&&M(S)),C.__cacheKey=q,C.__webglTexture=J[q].texture}return O}function j(C,S,O){let $=a.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=a.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=a.TEXTURE_3D);const J=Qe(C,S),q=S.source;t.bindTexture($,C.__webglTexture,a.TEXTURE0+O);const ye=i.get(q);if(q.version!==ye.__version||J===!0){t.activeTexture(a.TEXTURE0+O);const le=He.getPrimaries(He.workingColorSpace),fe=S.colorSpace===Fi?null:He.getPrimaries(S.colorSpace),Xe=S.colorSpace===Fi||le===fe?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,S.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,S.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);let ee=b(S.image,!1,n.maxTextureSize);ee=st(S,ee);const pe=s.convert(S.format,S.colorSpace),Te=s.convert(S.type);let Re=_(S.internalFormat,pe,Te,S.colorSpace,S.isVideoTexture);Ne($,S);let me;const We=S.mipmaps,Ie=S.isVideoTexture!==!0,it=ye.__version===void 0||J===!0,L=q.dataReady,re=A(S,ee);if(S.isDepthTexture)Re=x(S.format===as,S.type),it&&(Ie?t.texStorage2D(a.TEXTURE_2D,1,Re,ee.width,ee.height):t.texImage2D(a.TEXTURE_2D,0,Re,ee.width,ee.height,0,pe,Te,null));else if(S.isDataTexture)if(We.length>0){Ie&&it&&t.texStorage2D(a.TEXTURE_2D,re,Re,We[0].width,We[0].height);for(let V=0,K=We.length;V<K;V++)me=We[V],Ie?L&&t.texSubImage2D(a.TEXTURE_2D,V,0,0,me.width,me.height,pe,Te,me.data):t.texImage2D(a.TEXTURE_2D,V,Re,me.width,me.height,0,pe,Te,me.data);S.generateMipmaps=!1}else Ie?(it&&t.texStorage2D(a.TEXTURE_2D,re,Re,ee.width,ee.height),L&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,ee.width,ee.height,pe,Te,ee.data)):t.texImage2D(a.TEXTURE_2D,0,Re,ee.width,ee.height,0,pe,Te,ee.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ie&&it&&t.texStorage3D(a.TEXTURE_2D_ARRAY,re,Re,We[0].width,We[0].height,ee.depth);for(let V=0,K=We.length;V<K;V++)if(me=We[V],S.format!==Yt)if(pe!==null)if(Ie){if(L)if(S.layerUpdates.size>0){const de=Nc(me.width,me.height,S.format,S.type);for(const ce of S.layerUpdates){const De=me.data.subarray(ce*de/me.data.BYTES_PER_ELEMENT,(ce+1)*de/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,V,0,0,ce,me.width,me.height,1,pe,De)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,V,0,0,0,me.width,me.height,ee.depth,pe,me.data)}else t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,V,Re,me.width,me.height,ee.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?L&&t.texSubImage3D(a.TEXTURE_2D_ARRAY,V,0,0,0,me.width,me.height,ee.depth,pe,Te,me.data):t.texImage3D(a.TEXTURE_2D_ARRAY,V,Re,me.width,me.height,ee.depth,0,pe,Te,me.data)}else{Ie&&it&&t.texStorage2D(a.TEXTURE_2D,re,Re,We[0].width,We[0].height);for(let V=0,K=We.length;V<K;V++)me=We[V],S.format!==Yt?pe!==null?Ie?L&&t.compressedTexSubImage2D(a.TEXTURE_2D,V,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(a.TEXTURE_2D,V,Re,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?L&&t.texSubImage2D(a.TEXTURE_2D,V,0,0,me.width,me.height,pe,Te,me.data):t.texImage2D(a.TEXTURE_2D,V,Re,me.width,me.height,0,pe,Te,me.data)}else if(S.isDataArrayTexture)if(Ie){if(it&&t.texStorage3D(a.TEXTURE_2D_ARRAY,re,Re,ee.width,ee.height,ee.depth),L)if(S.layerUpdates.size>0){const V=Nc(ee.width,ee.height,S.format,S.type);for(const K of S.layerUpdates){const de=ee.data.subarray(K*V/ee.data.BYTES_PER_ELEMENT,(K+1)*V/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,K,ee.width,ee.height,1,pe,Te,de)}S.clearLayerUpdates()}else t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,pe,Te,ee.data)}else t.texImage3D(a.TEXTURE_2D_ARRAY,0,Re,ee.width,ee.height,ee.depth,0,pe,Te,ee.data);else if(S.isData3DTexture)Ie?(it&&t.texStorage3D(a.TEXTURE_3D,re,Re,ee.width,ee.height,ee.depth),L&&t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,pe,Te,ee.data)):t.texImage3D(a.TEXTURE_3D,0,Re,ee.width,ee.height,ee.depth,0,pe,Te,ee.data);else if(S.isFramebufferTexture){if(it)if(Ie)t.texStorage2D(a.TEXTURE_2D,re,Re,ee.width,ee.height);else{let V=ee.width,K=ee.height;for(let de=0;de<re;de++)t.texImage2D(a.TEXTURE_2D,de,Re,V,K,0,pe,Te,null),V>>=1,K>>=1}}else if(We.length>0){if(Ie&&it){const V=Se(We[0]);t.texStorage2D(a.TEXTURE_2D,re,Re,V.width,V.height)}for(let V=0,K=We.length;V<K;V++)me=We[V],Ie?L&&t.texSubImage2D(a.TEXTURE_2D,V,0,0,pe,Te,me):t.texImage2D(a.TEXTURE_2D,V,Re,pe,Te,me);S.generateMipmaps=!1}else if(Ie){if(it){const V=Se(ee);t.texStorage2D(a.TEXTURE_2D,re,Re,V.width,V.height)}L&&t.texSubImage2D(a.TEXTURE_2D,0,0,0,pe,Te,ee)}else t.texImage2D(a.TEXTURE_2D,0,Re,pe,Te,ee);m(S)&&p($),ye.__version=q.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function Q(C,S,O){if(S.image.length!==6)return;const $=Qe(C,S),J=S.source;t.bindTexture(a.TEXTURE_CUBE_MAP,C.__webglTexture,a.TEXTURE0+O);const q=i.get(J);if(J.version!==q.__version||$===!0){t.activeTexture(a.TEXTURE0+O);const ye=He.getPrimaries(He.workingColorSpace),le=S.colorSpace===Fi?null:He.getPrimaries(S.colorSpace),fe=S.colorSpace===Fi||ye===le?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,S.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,S.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const Xe=S.isCompressedTexture||S.image[0].isCompressedTexture,ee=S.image[0]&&S.image[0].isDataTexture,pe=[];for(let K=0;K<6;K++)!Xe&&!ee?pe[K]=b(S.image[K],!0,n.maxCubemapSize):pe[K]=ee?S.image[K].image:S.image[K],pe[K]=st(S,pe[K]);const Te=pe[0],Re=s.convert(S.format,S.colorSpace),me=s.convert(S.type),We=_(S.internalFormat,Re,me,S.colorSpace),Ie=S.isVideoTexture!==!0,it=q.__version===void 0||$===!0,L=J.dataReady;let re=A(S,Te);Ne(a.TEXTURE_CUBE_MAP,S);let V;if(Xe){Ie&&it&&t.texStorage2D(a.TEXTURE_CUBE_MAP,re,We,Te.width,Te.height);for(let K=0;K<6;K++){V=pe[K].mipmaps;for(let de=0;de<V.length;de++){const ce=V[de];S.format!==Yt?Re!==null?Ie?L&&t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de,0,0,ce.width,ce.height,Re,ce.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de,We,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?L&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de,0,0,ce.width,ce.height,Re,me,ce.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de,We,ce.width,ce.height,0,Re,me,ce.data)}}}else{if(V=S.mipmaps,Ie&&it){V.length>0&&re++;const K=Se(pe[0]);t.texStorage2D(a.TEXTURE_CUBE_MAP,re,We,K.width,K.height)}for(let K=0;K<6;K++)if(ee){Ie?L&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,pe[K].width,pe[K].height,Re,me,pe[K].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,We,pe[K].width,pe[K].height,0,Re,me,pe[K].data);for(let de=0;de<V.length;de++){const De=V[de].image[K].image;Ie?L&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de+1,0,0,De.width,De.height,Re,me,De.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de+1,We,De.width,De.height,0,Re,me,De.data)}}else{Ie?L&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Re,me,pe[K]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,We,Re,me,pe[K]);for(let de=0;de<V.length;de++){const ce=V[de];Ie?L&&t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de+1,0,0,Re,me,ce.image[K]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+K,de+1,We,Re,me,ce.image[K])}}}m(S)&&p(a.TEXTURE_CUBE_MAP),q.__version=J.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ue(C,S,O,$,J,q){const ye=s.convert(O.format,O.colorSpace),le=s.convert(O.type),fe=_(O.internalFormat,ye,le,O.colorSpace),Xe=i.get(S),ee=i.get(O);if(ee.__renderTarget=S,!Xe.__hasExternalTextures){const pe=Math.max(1,S.width>>q),Te=Math.max(1,S.height>>q);J===a.TEXTURE_3D||J===a.TEXTURE_2D_ARRAY?t.texImage3D(J,q,fe,pe,Te,S.depth,0,ye,le,null):t.texImage2D(J,q,fe,pe,Te,0,ye,le,null)}t.bindFramebuffer(a.FRAMEBUFFER,C),Ve(S)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,$,J,ee.__webglTexture,0,Ge(S)):(J===a.TEXTURE_2D||J>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,$,J,ee.__webglTexture,q),t.bindFramebuffer(a.FRAMEBUFFER,null)}function se(C,S,O){if(a.bindRenderbuffer(a.RENDERBUFFER,C),S.depthBuffer){const $=S.depthTexture,J=$&&$.isDepthTexture?$.type:null,q=x(S.stencilBuffer,J),ye=S.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,le=Ge(S);Ve(S)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,le,q,S.width,S.height):O?a.renderbufferStorageMultisample(a.RENDERBUFFER,le,q,S.width,S.height):a.renderbufferStorage(a.RENDERBUFFER,q,S.width,S.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,ye,a.RENDERBUFFER,C)}else{const $=S.textures;for(let J=0;J<$.length;J++){const q=$[J],ye=s.convert(q.format,q.colorSpace),le=s.convert(q.type),fe=_(q.internalFormat,ye,le,q.colorSpace),Xe=Ge(S);O&&Ve(S)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,Xe,fe,S.width,S.height):Ve(S)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Xe,fe,S.width,S.height):a.renderbufferStorage(a.RENDERBUFFER,fe,S.width,S.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function Ae(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(a.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=i.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X(S.depthTexture,0);const J=$.__webglTexture,q=Ge(S);if(S.depthTexture.format===Kn)Ve(S)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,J,0,q):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,J,0);else if(S.depthTexture.format===as)Ve(S)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,J,0,q):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Pe(C){const S=i.get(C),O=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const $=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){const J=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",J)};$.addEventListener("dispose",J),S.__depthDisposeCallback=J}S.__boundDepthTexture=$}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Ae(S.__webglFramebuffer,C)}else if(O){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(a.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=a.createRenderbuffer(),se(S.__webglDepthbuffer[$],C,!1);else{const J=C.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,q=S.__webglDepthbuffer[$];a.bindRenderbuffer(a.RENDERBUFFER,q),a.framebufferRenderbuffer(a.FRAMEBUFFER,J,a.RENDERBUFFER,q)}}else if(t.bindFramebuffer(a.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=a.createRenderbuffer(),se(S.__webglDepthbuffer,C,!1);else{const $=C.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,J=S.__webglDepthbuffer;a.bindRenderbuffer(a.RENDERBUFFER,J),a.framebufferRenderbuffer(a.FRAMEBUFFER,$,a.RENDERBUFFER,J)}t.bindFramebuffer(a.FRAMEBUFFER,null)}function Oe(C,S,O){const $=i.get(C);S!==void 0&&ue($.__webglFramebuffer,C,C.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),O!==void 0&&Pe(C)}function lt(C){const S=C.texture,O=i.get(C),$=i.get(S);C.addEventListener("dispose",R);const J=C.textures,q=C.isWebGLCubeRenderTarget===!0,ye=J.length>1;if(ye||($.__webglTexture===void 0&&($.__webglTexture=a.createTexture()),$.__version=S.version,r.memory.textures++),q){O.__webglFramebuffer=[];for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[le]=[];for(let fe=0;fe<S.mipmaps.length;fe++)O.__webglFramebuffer[le][fe]=a.createFramebuffer()}else O.__webglFramebuffer[le]=a.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let le=0;le<S.mipmaps.length;le++)O.__webglFramebuffer[le]=a.createFramebuffer()}else O.__webglFramebuffer=a.createFramebuffer();if(ye)for(let le=0,fe=J.length;le<fe;le++){const Xe=i.get(J[le]);Xe.__webglTexture===void 0&&(Xe.__webglTexture=a.createTexture(),r.memory.textures++)}if(C.samples>0&&Ve(C)===!1){O.__webglMultisampledFramebuffer=a.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let le=0;le<J.length;le++){const fe=J[le];O.__webglColorRenderbuffer[le]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,O.__webglColorRenderbuffer[le]);const Xe=s.convert(fe.format,fe.colorSpace),ee=s.convert(fe.type),pe=_(fe.internalFormat,Xe,ee,fe.colorSpace,C.isXRRenderTarget===!0),Te=Ge(C);a.renderbufferStorageMultisample(a.RENDERBUFFER,Te,pe,C.width,C.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+le,a.RENDERBUFFER,O.__webglColorRenderbuffer[le])}a.bindRenderbuffer(a.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=a.createRenderbuffer(),se(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(q){t.bindTexture(a.TEXTURE_CUBE_MAP,$.__webglTexture),Ne(a.TEXTURE_CUBE_MAP,S);for(let le=0;le<6;le++)if(S.mipmaps&&S.mipmaps.length>0)for(let fe=0;fe<S.mipmaps.length;fe++)ue(O.__webglFramebuffer[le][fe],C,S,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+le,fe);else ue(O.__webglFramebuffer[le],C,S,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(S)&&p(a.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let le=0,fe=J.length;le<fe;le++){const Xe=J[le],ee=i.get(Xe);t.bindTexture(a.TEXTURE_2D,ee.__webglTexture),Ne(a.TEXTURE_2D,Xe),ue(O.__webglFramebuffer,C,Xe,a.COLOR_ATTACHMENT0+le,a.TEXTURE_2D,0),m(Xe)&&p(a.TEXTURE_2D)}t.unbindTexture()}else{let le=a.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(le=C.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),t.bindTexture(le,$.__webglTexture),Ne(le,S),S.mipmaps&&S.mipmaps.length>0)for(let fe=0;fe<S.mipmaps.length;fe++)ue(O.__webglFramebuffer[fe],C,S,a.COLOR_ATTACHMENT0,le,fe);else ue(O.__webglFramebuffer,C,S,a.COLOR_ATTACHMENT0,le,0);m(S)&&p(le),t.unbindTexture()}C.depthBuffer&&Pe(C)}function je(C){const S=C.textures;for(let O=0,$=S.length;O<$;O++){const J=S[O];if(m(J)){const q=v(C),ye=i.get(J).__webglTexture;t.bindTexture(q,ye),p(q),t.unbindTexture()}}}const ft=[],F=[];function Wt(C){if(C.samples>0){if(Ve(C)===!1){const S=C.textures,O=C.width,$=C.height;let J=a.COLOR_BUFFER_BIT;const q=C.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ye=i.get(C),le=S.length>1;if(le)for(let fe=0;fe<S.length;fe++)t.bindFramebuffer(a.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+fe,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,ye.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+fe,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let fe=0;fe<S.length;fe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=a.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=a.STENCIL_BUFFER_BIT)),le){a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,ye.__webglColorRenderbuffer[fe]);const Xe=i.get(S[fe]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,Xe,0)}a.blitFramebuffer(0,0,O,$,0,0,O,$,J,a.NEAREST),c===!0&&(ft.length=0,F.length=0,ft.push(a.COLOR_ATTACHMENT0+fe),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ft.push(q),F.push(q),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,F)),a.invalidateFramebuffer(a.READ_FRAMEBUFFER,ft))}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),le)for(let fe=0;fe<S.length;fe++){t.bindFramebuffer(a.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+fe,a.RENDERBUFFER,ye.__webglColorRenderbuffer[fe]);const Xe=i.get(S[fe]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,ye.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+fe,a.TEXTURE_2D,Xe,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[S])}}}function Ge(C){return Math.min(n.maxSamples,C.samples)}function Ve(C){const S=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function we(C){const S=r.render.frame;h.get(C)!==S&&(h.set(C,S),C.update())}function st(C,S){const O=C.colorSpace,$=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==It&&O!==Fi&&(He.getTransfer(O)===tt?($!==Yt||J!==Wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),S}function Se(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=U,this.setTexture2D=X,this.setTexture2DArray=G,this.setTexture3D=Y,this.setTextureCube=H,this.rebindTextures=Oe,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Wt,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=Ve}function Zg(a,e){function t(i,n=Fi){let s;const r=He.getTransfer(n);if(i===Wi)return a.UNSIGNED_BYTE;if(i===rl)return a.UNSIGNED_SHORT_4_4_4_4;if(i===ol)return a.UNSIGNED_SHORT_5_5_5_1;if(i===Nh)return a.UNSIGNED_INT_5_9_9_9_REV;if(i===Fh)return a.BYTE;if(i===Uh)return a.SHORT;if(i===Xs)return a.UNSIGNED_SHORT;if(i===al)return a.INT;if(i===Mn)return a.UNSIGNED_INT;if(i===ai)return a.FLOAT;if(i===Hi)return a.HALF_FLOAT;if(i===Oh)return a.ALPHA;if(i===zh)return a.RGB;if(i===Yt)return a.RGBA;if(i===Bh)return a.LUMINANCE;if(i===Hh)return a.LUMINANCE_ALPHA;if(i===Kn)return a.DEPTH_COMPONENT;if(i===as)return a.DEPTH_STENCIL;if(i===ll)return a.RED;if(i===cl)return a.RED_INTEGER;if(i===Gh)return a.RG;if(i===hl)return a.RG_INTEGER;if(i===dl)return a.RGBA_INTEGER;if(i===Ha||i===Ga||i===Va||i===Wa)if(r===tt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ha)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ga)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Va)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Wa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ha)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ga)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Va)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Wa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===vo||i===bo||i===xo||i===_o)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===vo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===bo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_o)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yo||i===Mo||i===So)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===yo||i===Mo)return r===tt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===So)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===wo||i===To||i===Ao||i===Eo||i===Ro||i===Co||i===Po||i===Do||i===Lo||i===ko||i===Io||i===Fo||i===Uo||i===No)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===wo)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===To)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ao)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Eo)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ro)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Co)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Po)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Do)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Lo)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ko)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Io)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fo)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Uo)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===No)return r===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ja||i===Oo||i===zo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ja)return r===tt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Oo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===zo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vh||i===Bo||i===Ho||i===Go)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ja)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Bo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ho)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Go)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ss?a.UNSIGNED_INT_24_8:a[i]!==void 0?a[i]:null}return{convert:t}}class ev extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class St extends ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const tv={type:"move"};class Gr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new St,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new St,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new St,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,s=null,r=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(const b of e.hand.values()){const m=t.getJointPose(b,i),p=this._getHandJoint(l,b);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(tv)))}return o!==null&&(o.visible=n!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new St;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,nv=`
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

}`;class sv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const n=new bt,s=e.properties.get(n);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ht({vertexShader:iv,fragmentShader:nv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ue(new vi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class av extends Sn{constructor(e,t){super();const i=this;let n=null,s=1,r=null,o="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const b=new sv,m=t.getContextAttributes();let p=null,v=null;const _=[],x=[],A=new Z;let w=null;const R=new Dt;R.viewport=new $e;const P=new Dt;P.viewport=new $e;const M=[R,P],y=new ev;let D=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let Q=_[j];return Q===void 0&&(Q=new Gr,_[j]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(j){let Q=_[j];return Q===void 0&&(Q=new Gr,_[j]=Q),Q.getGripSpace()},this.getHand=function(j){let Q=_[j];return Q===void 0&&(Q=new Gr,_[j]=Q),Q.getHandSpace()};function N(j){const Q=x.indexOf(j.inputSource);if(Q===-1)return;const ue=_[Q];ue!==void 0&&(ue.update(j.inputSource,j.frame,l||r),ue.dispatchEvent({type:j.type,data:j.inputSource}))}function W(){n.removeEventListener("select",N),n.removeEventListener("selectstart",N),n.removeEventListener("selectend",N),n.removeEventListener("squeeze",N),n.removeEventListener("squeezestart",N),n.removeEventListener("squeezeend",N),n.removeEventListener("end",W),n.removeEventListener("inputsourceschange",X);for(let j=0;j<_.length;j++){const Q=x[j];Q!==null&&(x[j]=null,_[j].disconnect(Q))}D=null,U=null,b.reset(),e.setRenderTarget(p),f=null,u=null,d=null,n=null,v=null,Qe.stop(),i.isPresenting=!1,e.setPixelRatio(w),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return n},this.setSession=async function(j){if(n=j,n!==null){if(p=e.getRenderTarget(),n.addEventListener("select",N),n.addEventListener("selectstart",N),n.addEventListener("selectend",N),n.addEventListener("squeeze",N),n.addEventListener("squeezestart",N),n.addEventListener("squeezeend",N),n.addEventListener("end",W),n.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(A),n.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(n,t,Q),n.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new oi(f.framebufferWidth,f.framebufferHeight,{format:Yt,type:Wi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,ue=null,se=null;m.depth&&(se=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=m.stencil?as:Kn,ue=m.stencil?ss:Mn);const Ae={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:s};d=new XRWebGLBinding(n,t),u=d.createProjectionLayer(Ae),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),v=new oi(u.textureWidth,u.textureHeight,{format:Yt,type:Wi,depthTexture:new ad(u.textureWidth,u.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await n.requestReferenceSpace(o),Qe.setContext(n),Qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function X(j){for(let Q=0;Q<j.removed.length;Q++){const ue=j.removed[Q],se=x.indexOf(ue);se>=0&&(x[se]=null,_[se].disconnect(ue))}for(let Q=0;Q<j.added.length;Q++){const ue=j.added[Q];let se=x.indexOf(ue);if(se===-1){for(let Pe=0;Pe<_.length;Pe++)if(Pe>=x.length){x.push(ue),se=Pe;break}else if(x[Pe]===null){x[Pe]=ue,se=Pe;break}if(se===-1)break}const Ae=_[se];Ae&&Ae.connect(ue)}}const G=new T,Y=new T;function H(j,Q,ue){G.setFromMatrixPosition(Q.matrixWorld),Y.setFromMatrixPosition(ue.matrixWorld);const se=G.distanceTo(Y),Ae=Q.projectionMatrix.elements,Pe=ue.projectionMatrix.elements,Oe=Ae[14]/(Ae[10]-1),lt=Ae[14]/(Ae[10]+1),je=(Ae[9]+1)/Ae[5],ft=(Ae[9]-1)/Ae[5],F=(Ae[8]-1)/Ae[0],Wt=(Pe[8]+1)/Pe[0],Ge=Oe*F,Ve=Oe*Wt,we=se/(-F+Wt),st=we*-F;if(Q.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(st),j.translateZ(we),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ae[10]===-1)j.projectionMatrix.copy(Q.projectionMatrix),j.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const Se=Oe+we,C=lt+we,S=Ge-st,O=Ve+(se-st),$=je*lt/C*Se,J=ft*lt/C*Se;j.projectionMatrix.makePerspective(S,O,$,J,Se,C),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ne(j,Q){Q===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(Q.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(n===null)return;let Q=j.near,ue=j.far;b.texture!==null&&(b.depthNear>0&&(Q=b.depthNear),b.depthFar>0&&(ue=b.depthFar)),y.near=P.near=R.near=Q,y.far=P.far=R.far=ue,(D!==y.near||U!==y.far)&&(n.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,U=y.far),R.layers.mask=j.layers.mask|2,P.layers.mask=j.layers.mask|4,y.layers.mask=R.layers.mask|P.layers.mask;const se=j.parent,Ae=y.cameras;ne(y,se);for(let Pe=0;Pe<Ae.length;Pe++)ne(Ae[Pe],se);Ae.length===2?H(y,R,P):y.projectionMatrix.copy(R.projectionMatrix),oe(j,y,se)};function oe(j,Q,ue){ue===null?j.matrix.copy(Q.matrixWorld):(j.matrix.copy(ue.matrixWorld),j.matrix.invert(),j.matrix.multiply(Q.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(Q.projectionMatrix),j.projectionMatrixInverse.copy(Q.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=rs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(j){c=j,u!==null&&(u.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(y)};let ve=null;function Ne(j,Q){if(h=Q.getViewerPose(l||r),g=Q,h!==null){const ue=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let se=!1;ue.length!==y.cameras.length&&(y.cameras.length=0,se=!0);for(let Pe=0;Pe<ue.length;Pe++){const Oe=ue[Pe];let lt=null;if(f!==null)lt=f.getViewport(Oe);else{const ft=d.getViewSubImage(u,Oe);lt=ft.viewport,Pe===0&&(e.setRenderTargetTextures(v,ft.colorTexture,u.ignoreDepthValues?void 0:ft.depthStencilTexture),e.setRenderTarget(v))}let je=M[Pe];je===void 0&&(je=new Dt,je.layers.enable(Pe),je.viewport=new $e,M[Pe]=je),je.matrix.fromArray(Oe.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(Oe.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(lt.x,lt.y,lt.width,lt.height),Pe===0&&(y.matrix.copy(je.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),se===!0&&y.cameras.push(je)}const Ae=n.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Pe=d.getDepthInformation(ue[0]);Pe&&Pe.isValid&&Pe.texture&&b.init(e,Pe,n.renderState)}}for(let ue=0;ue<_.length;ue++){const se=x[ue],Ae=_[ue];se!==null&&Ae!==void 0&&Ae.update(se,Q,l||r)}ve&&ve(j,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Qe=new sd;Qe.setAnimationLoop(Ne),this.setAnimationLoop=function(j){ve=j},this.dispose=function(){}}}const fn=new gi,rv=new Ee;function ov(a,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,td(a)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function n(m,p,v,_,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),b(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,_):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Lt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Lt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=e.get(p),_=v.envMap,x=v.envMapRotation;_&&(m.envMap.value=_,fn.copy(x),fn.x*=-1,fn.y*=-1,fn.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(fn.y*=-1,fn.z*=-1),m.envMapRotation.value.setFromMatrix4(rv.makeRotationFromEuler(fn)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=_*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Lt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function b(m,p){const v=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function lv(a,e,t,i){let n={},s={},r=[];const o=a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,_){const x=_.program;i.uniformBlockBinding(v,x)}function l(v,_){let x=n[v.id];x===void 0&&(g(v),x=h(v),n[v.id]=x,v.addEventListener("dispose",m));const A=_.program;i.updateUBOMapping(v,A);const w=e.render.frame;s[v.id]!==w&&(u(v),s[v.id]=w)}function h(v){const _=d();v.__bindingPointIndex=_;const x=a.createBuffer(),A=v.__size,w=v.usage;return a.bindBuffer(a.UNIFORM_BUFFER,x),a.bufferData(a.UNIFORM_BUFFER,A,w),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,_,x),x}function d(){for(let v=0;v<o;v++)if(r.indexOf(v)===-1)return r.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){const _=n[v.id],x=v.uniforms,A=v.__cache;a.bindBuffer(a.UNIFORM_BUFFER,_);for(let w=0,R=x.length;w<R;w++){const P=Array.isArray(x[w])?x[w]:[x[w]];for(let M=0,y=P.length;M<y;M++){const D=P[M];if(f(D,w,M,A)===!0){const U=D.__offset,N=Array.isArray(D.value)?D.value:[D.value];let W=0;for(let X=0;X<N.length;X++){const G=N[X],Y=b(G);typeof G=="number"||typeof G=="boolean"?(D.__data[0]=G,a.bufferSubData(a.UNIFORM_BUFFER,U+W,D.__data)):G.isMatrix3?(D.__data[0]=G.elements[0],D.__data[1]=G.elements[1],D.__data[2]=G.elements[2],D.__data[3]=0,D.__data[4]=G.elements[3],D.__data[5]=G.elements[4],D.__data[6]=G.elements[5],D.__data[7]=0,D.__data[8]=G.elements[6],D.__data[9]=G.elements[7],D.__data[10]=G.elements[8],D.__data[11]=0):(G.toArray(D.__data,W),W+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}a.bufferSubData(a.UNIFORM_BUFFER,U,D.__data)}}}a.bindBuffer(a.UNIFORM_BUFFER,null)}function f(v,_,x,A){const w=v.value,R=_+"_"+x;if(A[R]===void 0)return typeof w=="number"||typeof w=="boolean"?A[R]=w:A[R]=w.clone(),!0;{const P=A[R];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return A[R]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(v){const _=v.uniforms;let x=0;const A=16;for(let R=0,P=_.length;R<P;R++){const M=Array.isArray(_[R])?_[R]:[_[R]];for(let y=0,D=M.length;y<D;y++){const U=M[y],N=Array.isArray(U.value)?U.value:[U.value];for(let W=0,X=N.length;W<X;W++){const G=N[W],Y=b(G),H=x%A,ne=H%Y.boundary,oe=H+ne;x+=ne,oe!==0&&A-oe<Y.storage&&(x+=A-oe),U.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=x,x+=Y.storage}}}const w=x%A;return w>0&&(x+=A-w),v.__size=x,v.__cache={},this}function b(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function m(v){const _=v.target;_.removeEventListener("dispose",m);const x=r.indexOf(_.__bindingPointIndex);r.splice(x,1),a.deleteBuffer(n[_.id]),delete n[_.id],delete s[_.id]}function p(){for(const v in n)a.deleteBuffer(n[v]);r=[],n={},s={}}return{bind:c,update:l,dispose:p}}class cv{constructor(e={}){const{canvas:t=Ju(),context:i=null,depth:n=!0,stencil:s=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=r;const g=new Uint32Array(4),b=new Int32Array(4);let m=null,p=null;const v=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ct,this.toneMapping=Bi,this.toneMappingExposure=1;const x=this;let A=!1,w=0,R=0,P=null,M=-1,y=null;const D=new $e,U=new $e;let N=null;const W=new ie(0);let X=0,G=t.width,Y=t.height,H=1,ne=null,oe=null;const ve=new $e(0,0,G,Y),Ne=new $e(0,0,G,Y);let Qe=!1;const j=new ml;let Q=!1,ue=!1;const se=new Ee,Ae=new Ee,Pe=new T,Oe=new $e,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function ft(){return P===null?H:1}let F=i;function Wt(E,k){return t.getContext(E,k)}try{const E={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sl}`),t.addEventListener("webglcontextlost",K,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",ce,!1),F===null){const k="webgl2";if(F=Wt(k,E),F===null)throw Wt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ge,Ve,we,st,Se,C,S,O,$,J,q,ye,le,fe,Xe,ee,pe,Te,Re,me,We,Ie,it,L;function re(){Ge=new p0(F),Ge.init(),Ie=new Zg(F,Ge),Ve=new l0(F,Ge,e,Ie),we=new Yg(F,Ge),Ve.reverseDepthBuffer&&u&&we.buffers.depth.setReversed(!0),st=new v0(F),Se=new Fg,C=new Qg(F,Ge,we,Se,Ve,Ie,st),S=new h0(x),O=new f0(x),$=new wf(F),it=new r0(F,$),J=new m0(F,$,st,it),q=new x0(F,J,$,st),Re=new b0(F,Ve,C),ee=new c0(Se),ye=new Ig(x,S,O,Ge,Ve,it,ee),le=new ov(x,Se),fe=new Ng,Xe=new Vg(Ge),Te=new a0(x,S,O,we,q,f,c),pe=new $g(x,q,Ve),L=new lv(F,st,Ve,we),me=new o0(F,Ge,st),We=new g0(F,Ge,st),st.programs=ye.programs,x.capabilities=Ve,x.extensions=Ge,x.properties=Se,x.renderLists=fe,x.shadowMap=pe,x.state=we,x.info=st}re();const V=new av(x,F);this.xr=V,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=Ge.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ge.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(E){E!==void 0&&(H=E,this.setSize(G,Y,!1))},this.getSize=function(E){return E.set(G,Y)},this.setSize=function(E,k,z=!0){if(V.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,Y=k,t.width=Math.floor(E*H),t.height=Math.floor(k*H),z===!0&&(t.style.width=E+"px",t.style.height=k+"px"),this.setViewport(0,0,E,k)},this.getDrawingBufferSize=function(E){return E.set(G*H,Y*H).floor()},this.setDrawingBufferSize=function(E,k,z){G=E,Y=k,H=z,t.width=Math.floor(E*z),t.height=Math.floor(k*z),this.setViewport(0,0,E,k)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(ve)},this.setViewport=function(E,k,z,B){E.isVector4?ve.set(E.x,E.y,E.z,E.w):ve.set(E,k,z,B),we.viewport(D.copy(ve).multiplyScalar(H).round())},this.getScissor=function(E){return E.copy(Ne)},this.setScissor=function(E,k,z,B){E.isVector4?Ne.set(E.x,E.y,E.z,E.w):Ne.set(E,k,z,B),we.scissor(U.copy(Ne).multiplyScalar(H).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(E){we.setScissorTest(Qe=E)},this.setOpaqueSort=function(E){ne=E},this.setTransparentSort=function(E){oe=E},this.getClearColor=function(E){return E.copy(Te.getClearColor())},this.setClearColor=function(){Te.setClearColor.apply(Te,arguments)},this.getClearAlpha=function(){return Te.getClearAlpha()},this.setClearAlpha=function(){Te.setClearAlpha.apply(Te,arguments)},this.clear=function(E=!0,k=!0,z=!0){let B=0;if(E){let I=!1;if(P!==null){const te=P.texture.format;I=te===dl||te===hl||te===cl}if(I){const te=P.texture.type,he=te===Wi||te===Mn||te===Xs||te===ss||te===rl||te===ol,be=Te.getClearColor(),xe=Te.getClearAlpha(),Ce=be.r,Le=be.g,_e=be.b;he?(g[0]=Ce,g[1]=Le,g[2]=_e,g[3]=xe,F.clearBufferuiv(F.COLOR,0,g)):(b[0]=Ce,b[1]=Le,b[2]=_e,b[3]=xe,F.clearBufferiv(F.COLOR,0,b))}else B|=F.COLOR_BUFFER_BIT}k&&(B|=F.DEPTH_BUFFER_BIT),z&&(B|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",K,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),fe.dispose(),Xe.dispose(),Se.dispose(),S.dispose(),O.dispose(),q.dispose(),it.dispose(),L.dispose(),ye.dispose(),V.dispose(),V.removeEventListener("sessionstart",kl),V.removeEventListener("sessionend",Il),on.stop()};function K(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const E=st.autoReset,k=pe.enabled,z=pe.autoUpdate,B=pe.needsUpdate,I=pe.type;re(),st.autoReset=E,pe.enabled=k,pe.autoUpdate=z,pe.needsUpdate=B,pe.type=I}function ce(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function De(E){const k=E.target;k.removeEventListener("dispose",De),dt(k)}function dt(E){wt(E),Se.remove(E)}function wt(E){const k=Se.get(E).programs;k!==void 0&&(k.forEach(function(z){ye.releaseProgram(z)}),E.isShaderMaterial&&ye.releaseShaderCache(E))}this.renderBufferDirect=function(E,k,z,B,I,te){k===null&&(k=lt);const he=I.isMesh&&I.matrixWorld.determinant()<0,be=Gd(E,k,z,B,I);we.setMaterial(B,he);let xe=z.index,Ce=1;if(B.wireframe===!0){if(xe=J.getWireframeAttribute(z),xe===void 0)return;Ce=2}const Le=z.drawRange,_e=z.attributes.position;let qe=Le.start*Ce,nt=(Le.start+Le.count)*Ce;te!==null&&(qe=Math.max(qe,te.start*Ce),nt=Math.min(nt,(te.start+te.count)*Ce)),xe!==null?(qe=Math.max(qe,0),nt=Math.min(nt,xe.count)):_e!=null&&(qe=Math.max(qe,0),nt=Math.min(nt,_e.count));const at=nt-qe;if(at<0||at===1/0)return;it.setup(I,B,be,z,xe);let Ft,Ke=me;if(xe!==null&&(Ft=$.get(xe),Ke=We,Ke.setIndex(Ft)),I.isMesh)B.wireframe===!0?(we.setLineWidth(B.wireframeLinewidth*ft()),Ke.setMode(F.LINES)):Ke.setMode(F.TRIANGLES);else if(I.isLine){let Me=B.linewidth;Me===void 0&&(Me=1),we.setLineWidth(Me*ft()),I.isLineSegments?Ke.setMode(F.LINES):I.isLineLoop?Ke.setMode(F.LINE_LOOP):Ke.setMode(F.LINE_STRIP)}else I.isPoints?Ke.setMode(F.POINTS):I.isSprite&&Ke.setMode(F.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)Ke.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(Ge.get("WEBGL_multi_draw"))Ke.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{const Me=I._multiDrawStarts,wi=I._multiDrawCounts,Ye=I._multiDrawCount,Qt=xe?$.get(xe).bytesPerElement:1,wn=Se.get(B).currentProgram.getUniforms();for(let Ot=0;Ot<Ye;Ot++)wn.setValue(F,"_gl_DrawID",Ot),Ke.render(Me[Ot]/Qt,wi[Ot])}else if(I.isInstancedMesh)Ke.renderInstances(qe,at,I.count);else if(z.isInstancedBufferGeometry){const Me=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,wi=Math.min(z.instanceCount,Me);Ke.renderInstances(qe,at,wi)}else Ke.render(qe,at)};function Ze(E,k,z){E.transparent===!0&&E.side===Gt&&E.forceSinglePass===!1?(E.side=Lt,E.needsUpdate=!0,aa(E,k,z),E.side=Vi,E.needsUpdate=!0,aa(E,k,z),E.side=Gt):aa(E,k,z)}this.compile=function(E,k,z=null){z===null&&(z=E),p=Xe.get(z),p.init(k),_.push(p),z.traverseVisible(function(I){I.isLight&&I.layers.test(k.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),E!==z&&E.traverseVisible(function(I){I.isLight&&I.layers.test(k.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights();const B=new Set;return E.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;const te=I.material;if(te)if(Array.isArray(te))for(let he=0;he<te.length;he++){const be=te[he];Ze(be,z,I),B.add(be)}else Ze(te,z,I),B.add(te)}),_.pop(),p=null,B},this.compileAsync=function(E,k,z=null){const B=this.compile(E,k,z);return new Promise(I=>{function te(){if(B.forEach(function(he){Se.get(he).currentProgram.isReady()&&B.delete(he)}),B.size===0){I(E);return}setTimeout(te,10)}Ge.get("KHR_parallel_shader_compile")!==null?te():setTimeout(te,10)})};let Jt=null;function Si(E){Jt&&Jt(E)}function kl(){on.stop()}function Il(){on.start()}const on=new sd;on.setAnimationLoop(Si),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(E){Jt=E,V.setAnimationLoop(E),E===null?on.stop():on.start()},V.addEventListener("sessionstart",kl),V.addEventListener("sessionend",Il),this.render=function(E,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),V.enabled===!0&&V.isPresenting===!0&&(V.cameraAutoUpdate===!0&&V.updateCamera(k),k=V.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,k,P),p=Xe.get(E,_.length),p.init(k),_.push(p),Ae.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),j.setFromProjectionMatrix(Ae),ue=this.localClippingEnabled,Q=ee.init(this.clippingPlanes,ue),m=fe.get(E,v.length),m.init(),v.push(m),V.enabled===!0&&V.isPresenting===!0){const te=x.xr.getDepthSensingMesh();te!==null&&fr(te,k,-1/0,x.sortObjects)}fr(E,k,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(ne,oe),je=V.enabled===!1||V.isPresenting===!1||V.hasDepthSensing()===!1,je&&Te.addToRenderList(m,E),this.info.render.frame++,Q===!0&&ee.beginShadows();const z=p.state.shadowsArray;pe.render(z,E,k),Q===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=m.opaque,I=m.transmissive;if(p.setupLights(),k.isArrayCamera){const te=k.cameras;if(I.length>0)for(let he=0,be=te.length;he<be;he++){const xe=te[he];Ul(B,I,E,xe)}je&&Te.render(E);for(let he=0,be=te.length;he<be;he++){const xe=te[he];Fl(m,E,xe,xe.viewport)}}else I.length>0&&Ul(B,I,E,k),je&&Te.render(E),Fl(m,E,k);P!==null&&(C.updateMultisampleRenderTarget(P),C.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(x,E,k),it.resetDefaultState(),M=-1,y=null,_.pop(),_.length>0?(p=_[_.length-1],Q===!0&&ee.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function fr(E,k,z,B){if(E.visible===!1)return;if(E.layers.test(k.layers)){if(E.isGroup)z=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(k);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||j.intersectsSprite(E)){B&&Oe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ae);const he=q.update(E),be=E.material;be.visible&&m.push(E,he,be,z,Oe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||j.intersectsObject(E))){const he=q.update(E),be=E.material;if(B&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Oe.copy(E.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Oe.copy(he.boundingSphere.center)),Oe.applyMatrix4(E.matrixWorld).applyMatrix4(Ae)),Array.isArray(be)){const xe=he.groups;for(let Ce=0,Le=xe.length;Ce<Le;Ce++){const _e=xe[Ce],qe=be[_e.materialIndex];qe&&qe.visible&&m.push(E,he,qe,z,Oe.z,_e)}}else be.visible&&m.push(E,he,be,z,Oe.z,null)}}const te=E.children;for(let he=0,be=te.length;he<be;he++)fr(te[he],k,z,B)}function Fl(E,k,z,B){const I=E.opaque,te=E.transmissive,he=E.transparent;p.setupLightsView(z),Q===!0&&ee.setGlobalState(x.clippingPlanes,z),B&&we.viewport(D.copy(B)),I.length>0&&sa(I,k,z),te.length>0&&sa(te,k,z),he.length>0&&sa(he,k,z),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function Ul(E,k,z,B){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new oi(1,1,{generateMipmaps:!0,type:Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float")?Hi:Wi,minFilter:pi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace}));const te=p.state.transmissionRenderTarget[B.id],he=B.viewport||D;te.setSize(he.z,he.w);const be=x.getRenderTarget();x.setRenderTarget(te),x.getClearColor(W),X=x.getClearAlpha(),X<1&&x.setClearColor(16777215,.5),x.clear(),je&&Te.render(z);const xe=x.toneMapping;x.toneMapping=Bi;const Ce=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),Q===!0&&ee.setGlobalState(x.clippingPlanes,B),sa(E,z,B),C.updateMultisampleRenderTarget(te),C.updateRenderTargetMipmap(te),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let _e=0,qe=k.length;_e<qe;_e++){const nt=k[_e],at=nt.object,Ft=nt.geometry,Ke=nt.material,Me=nt.group;if(Ke.side===Gt&&at.layers.test(B.layers)){const wi=Ke.side;Ke.side=Lt,Ke.needsUpdate=!0,Nl(at,z,B,Ft,Ke,Me),Ke.side=wi,Ke.needsUpdate=!0,Le=!0}}Le===!0&&(C.updateMultisampleRenderTarget(te),C.updateRenderTargetMipmap(te))}x.setRenderTarget(be),x.setClearColor(W,X),Ce!==void 0&&(B.viewport=Ce),x.toneMapping=xe}function sa(E,k,z){const B=k.isScene===!0?k.overrideMaterial:null;for(let I=0,te=E.length;I<te;I++){const he=E[I],be=he.object,xe=he.geometry,Ce=B===null?he.material:B,Le=he.group;be.layers.test(z.layers)&&Nl(be,k,z,xe,Ce,Le)}}function Nl(E,k,z,B,I,te){E.onBeforeRender(x,k,z,B,I,te),E.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),I.onBeforeRender(x,k,z,B,E,te),I.transparent===!0&&I.side===Gt&&I.forceSinglePass===!1?(I.side=Lt,I.needsUpdate=!0,x.renderBufferDirect(z,k,B,I,E,te),I.side=Vi,I.needsUpdate=!0,x.renderBufferDirect(z,k,B,I,E,te),I.side=Gt):x.renderBufferDirect(z,k,B,I,E,te),E.onAfterRender(x,k,z,B,I,te)}function aa(E,k,z){k.isScene!==!0&&(k=lt);const B=Se.get(E),I=p.state.lights,te=p.state.shadowsArray,he=I.state.version,be=ye.getParameters(E,I.state,te,k,z),xe=ye.getProgramCacheKey(be);let Ce=B.programs;B.environment=E.isMeshStandardMaterial?k.environment:null,B.fog=k.fog,B.envMap=(E.isMeshStandardMaterial?O:S).get(E.envMap||B.environment),B.envMapRotation=B.environment!==null&&E.envMap===null?k.environmentRotation:E.envMapRotation,Ce===void 0&&(E.addEventListener("dispose",De),Ce=new Map,B.programs=Ce);let Le=Ce.get(xe);if(Le!==void 0){if(B.currentProgram===Le&&B.lightsStateVersion===he)return zl(E,be),Le}else be.uniforms=ye.getUniforms(E),E.onBeforeCompile(be,x),Le=ye.acquireProgram(be,xe),Ce.set(xe,Le),B.uniforms=be.uniforms;const _e=B.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(_e.clippingPlanes=ee.uniform),zl(E,be),B.needsLights=Wd(E),B.lightsStateVersion=he,B.needsLights&&(_e.ambientLightColor.value=I.state.ambient,_e.lightProbe.value=I.state.probe,_e.directionalLights.value=I.state.directional,_e.directionalLightShadows.value=I.state.directionalShadow,_e.spotLights.value=I.state.spot,_e.spotLightShadows.value=I.state.spotShadow,_e.rectAreaLights.value=I.state.rectArea,_e.ltc_1.value=I.state.rectAreaLTC1,_e.ltc_2.value=I.state.rectAreaLTC2,_e.pointLights.value=I.state.point,_e.pointLightShadows.value=I.state.pointShadow,_e.hemisphereLights.value=I.state.hemi,_e.directionalShadowMap.value=I.state.directionalShadowMap,_e.directionalShadowMatrix.value=I.state.directionalShadowMatrix,_e.spotShadowMap.value=I.state.spotShadowMap,_e.spotLightMatrix.value=I.state.spotLightMatrix,_e.spotLightMap.value=I.state.spotLightMap,_e.pointShadowMap.value=I.state.pointShadowMap,_e.pointShadowMatrix.value=I.state.pointShadowMatrix),B.currentProgram=Le,B.uniformsList=null,Le}function Ol(E){if(E.uniformsList===null){const k=E.currentProgram.getUniforms();E.uniformsList=Xa.seqWithValue(k.seq,E.uniforms)}return E.uniformsList}function zl(E,k){const z=Se.get(E);z.outputColorSpace=k.outputColorSpace,z.batching=k.batching,z.batchingColor=k.batchingColor,z.instancing=k.instancing,z.instancingColor=k.instancingColor,z.instancingMorph=k.instancingMorph,z.skinning=k.skinning,z.morphTargets=k.morphTargets,z.morphNormals=k.morphNormals,z.morphColors=k.morphColors,z.morphTargetsCount=k.morphTargetsCount,z.numClippingPlanes=k.numClippingPlanes,z.numIntersection=k.numClipIntersection,z.vertexAlphas=k.vertexAlphas,z.vertexTangents=k.vertexTangents,z.toneMapping=k.toneMapping}function Gd(E,k,z,B,I){k.isScene!==!0&&(k=lt),C.resetTextureUnits();const te=k.fog,he=B.isMeshStandardMaterial?k.environment:null,be=P===null?x.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:It,xe=(B.isMeshStandardMaterial?O:S).get(B.envMap||he),Ce=B.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Le=!!z.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),_e=!!z.morphAttributes.position,qe=!!z.morphAttributes.normal,nt=!!z.morphAttributes.color;let at=Bi;B.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(at=x.toneMapping);const Ft=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ke=Ft!==void 0?Ft.length:0,Me=Se.get(B),wi=p.state.lights;if(Q===!0&&(ue===!0||E!==y)){const jt=E===y&&B.id===M;ee.setState(B,E,jt)}let Ye=!1;B.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==wi.state.version||Me.outputColorSpace!==be||I.isBatchedMesh&&Me.batching===!1||!I.isBatchedMesh&&Me.batching===!0||I.isBatchedMesh&&Me.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&Me.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&Me.instancing===!1||!I.isInstancedMesh&&Me.instancing===!0||I.isSkinnedMesh&&Me.skinning===!1||!I.isSkinnedMesh&&Me.skinning===!0||I.isInstancedMesh&&Me.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Me.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&Me.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&Me.instancingMorph===!1&&I.morphTexture!==null||Me.envMap!==xe||B.fog===!0&&Me.fog!==te||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==ee.numPlanes||Me.numIntersection!==ee.numIntersection)||Me.vertexAlphas!==Ce||Me.vertexTangents!==Le||Me.morphTargets!==_e||Me.morphNormals!==qe||Me.morphColors!==nt||Me.toneMapping!==at||Me.morphTargetsCount!==Ke)&&(Ye=!0):(Ye=!0,Me.__version=B.version);let Qt=Me.currentProgram;Ye===!0&&(Qt=aa(B,k,I));let wn=!1,Ot=!1,xs=!1;const rt=Qt.getUniforms(),hi=Me.uniforms;if(we.useProgram(Qt.program)&&(wn=!0,Ot=!0,xs=!0),B.id!==M&&(M=B.id,Ot=!0),wn||y!==E){we.buffers.depth.getReversed()?(se.copy(E.projectionMatrix),Zu(se),ef(se),rt.setValue(F,"projectionMatrix",se)):rt.setValue(F,"projectionMatrix",E.projectionMatrix),rt.setValue(F,"viewMatrix",E.matrixWorldInverse);const Xi=rt.map.cameraPosition;Xi!==void 0&&Xi.setValue(F,Pe.setFromMatrixPosition(E.matrixWorld)),Ve.logarithmicDepthBuffer&&rt.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&rt.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Ot=!0,xs=!0)}if(I.isSkinnedMesh){rt.setOptional(F,I,"bindMatrix"),rt.setOptional(F,I,"bindMatrixInverse");const jt=I.skeleton;jt&&(jt.boneTexture===null&&jt.computeBoneTexture(),rt.setValue(F,"boneTexture",jt.boneTexture,C))}I.isBatchedMesh&&(rt.setOptional(F,I,"batchingTexture"),rt.setValue(F,"batchingTexture",I._matricesTexture,C),rt.setOptional(F,I,"batchingIdTexture"),rt.setValue(F,"batchingIdTexture",I._indirectTexture,C),rt.setOptional(F,I,"batchingColorTexture"),I._colorsTexture!==null&&rt.setValue(F,"batchingColorTexture",I._colorsTexture,C));const _s=z.morphAttributes;if((_s.position!==void 0||_s.normal!==void 0||_s.color!==void 0)&&Re.update(I,z,Qt),(Ot||Me.receiveShadow!==I.receiveShadow)&&(Me.receiveShadow=I.receiveShadow,rt.setValue(F,"receiveShadow",I.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(hi.envMap.value=xe,hi.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&k.environment!==null&&(hi.envMapIntensity.value=k.environmentIntensity),Ot&&(rt.setValue(F,"toneMappingExposure",x.toneMappingExposure),Me.needsLights&&Vd(hi,xs),te&&B.fog===!0&&le.refreshFogUniforms(hi,te),le.refreshMaterialUniforms(hi,B,H,Y,p.state.transmissionRenderTarget[E.id]),Xa.upload(F,Ol(Me),hi,C)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Xa.upload(F,Ol(Me),hi,C),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&rt.setValue(F,"center",I.center),rt.setValue(F,"modelViewMatrix",I.modelViewMatrix),rt.setValue(F,"normalMatrix",I.normalMatrix),rt.setValue(F,"modelMatrix",I.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const jt=B.uniformsGroups;for(let Xi=0,qi=jt.length;Xi<qi;Xi++){const Bl=jt[Xi];L.update(Bl,Qt),L.bind(Bl,Qt)}}return Qt}function Vd(E,k){E.ambientLightColor.needsUpdate=k,E.lightProbe.needsUpdate=k,E.directionalLights.needsUpdate=k,E.directionalLightShadows.needsUpdate=k,E.pointLights.needsUpdate=k,E.pointLightShadows.needsUpdate=k,E.spotLights.needsUpdate=k,E.spotLightShadows.needsUpdate=k,E.rectAreaLights.needsUpdate=k,E.hemisphereLights.needsUpdate=k}function Wd(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,k,z){Se.get(E.texture).__webglTexture=k,Se.get(E.depthTexture).__webglTexture=z;const B=Se.get(E);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=z===void 0,B.__autoAllocateDepthBuffer||Ge.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,k){const z=Se.get(E);z.__webglFramebuffer=k,z.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(E,k=0,z=0){P=E,w=k,R=z;let B=!0,I=null,te=!1,he=!1;if(E){const xe=Se.get(E);if(xe.__useDefaultFramebuffer!==void 0)we.bindFramebuffer(F.FRAMEBUFFER,null),B=!1;else if(xe.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(xe.__hasExternalTextures)C.rebindTextures(E,Se.get(E.texture).__webglTexture,Se.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const _e=E.depthTexture;if(xe.__boundDepthTexture!==_e){if(_e!==null&&Se.has(_e)&&(E.width!==_e.image.width||E.height!==_e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Ce=E.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(he=!0);const Le=Se.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Le[k])?I=Le[k][z]:I=Le[k],te=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?I=Se.get(E).__webglMultisampledFramebuffer:Array.isArray(Le)?I=Le[z]:I=Le,D.copy(E.viewport),U.copy(E.scissor),N=E.scissorTest}else D.copy(ve).multiplyScalar(H).floor(),U.copy(Ne).multiplyScalar(H).floor(),N=Qe;if(we.bindFramebuffer(F.FRAMEBUFFER,I)&&B&&we.drawBuffers(E,I),we.viewport(D),we.scissor(U),we.setScissorTest(N),te){const xe=Se.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,xe.__webglTexture,z)}else if(he){const xe=Se.get(E.texture),Ce=k||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,xe.__webglTexture,z||0,Ce)}M=-1},this.readRenderTargetPixels=function(E,k,z,B,I,te,he){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Se.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(be=be[he]),be){we.bindFramebuffer(F.FRAMEBUFFER,be);try{const xe=E.texture,Ce=xe.format,Le=xe.type;if(!Ve.textureFormatReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=E.width-B&&z>=0&&z<=E.height-I&&F.readPixels(k,z,B,I,Ie.convert(Ce),Ie.convert(Le),te)}finally{const xe=P!==null?Se.get(P).__webglFramebuffer:null;we.bindFramebuffer(F.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(E,k,z,B,I,te,he){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Se.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(be=be[he]),be){const xe=E.texture,Ce=xe.format,Le=xe.type;if(!Ve.textureFormatReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=E.width-B&&z>=0&&z<=E.height-I){we.bindFramebuffer(F.FRAMEBUFFER,be);const _e=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,_e),F.bufferData(F.PIXEL_PACK_BUFFER,te.byteLength,F.STREAM_READ),F.readPixels(k,z,B,I,Ie.convert(Ce),Ie.convert(Le),0);const qe=P!==null?Se.get(P).__webglFramebuffer:null;we.bindFramebuffer(F.FRAMEBUFFER,qe);const nt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Qu(F,nt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,_e),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,te),F.deleteBuffer(_e),F.deleteSync(nt),te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,k=null,z=0){E.isTexture!==!0&&(Fs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,E=arguments[1]);const B=Math.pow(2,-z),I=Math.floor(E.image.width*B),te=Math.floor(E.image.height*B),he=k!==null?k.x:0,be=k!==null?k.y:0;C.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,z,0,0,he,be,I,te),we.unbindTexture()},this.copyTextureToTexture=function(E,k,z=null,B=null,I=0){E.isTexture!==!0&&(Fs("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1],k=arguments[2],I=arguments[3]||0,z=null);let te,he,be,xe,Ce,Le,_e,qe,nt;const at=E.isCompressedTexture?E.mipmaps[I]:E.image;z!==null?(te=z.max.x-z.min.x,he=z.max.y-z.min.y,be=z.isBox3?z.max.z-z.min.z:1,xe=z.min.x,Ce=z.min.y,Le=z.isBox3?z.min.z:0):(te=at.width,he=at.height,be=at.depth||1,xe=0,Ce=0,Le=0),B!==null?(_e=B.x,qe=B.y,nt=B.z):(_e=0,qe=0,nt=0);const Ft=Ie.convert(k.format),Ke=Ie.convert(k.type);let Me;k.isData3DTexture?(C.setTexture3D(k,0),Me=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(C.setTexture2DArray(k,0),Me=F.TEXTURE_2D_ARRAY):(C.setTexture2D(k,0),Me=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const wi=F.getParameter(F.UNPACK_ROW_LENGTH),Ye=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Qt=F.getParameter(F.UNPACK_SKIP_PIXELS),wn=F.getParameter(F.UNPACK_SKIP_ROWS),Ot=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,at.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,at.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,xe),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ce),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Le);const xs=E.isDataArrayTexture||E.isData3DTexture,rt=k.isDataArrayTexture||k.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const hi=Se.get(E),_s=Se.get(k),jt=Se.get(hi.__renderTarget),Xi=Se.get(_s.__renderTarget);we.bindFramebuffer(F.READ_FRAMEBUFFER,jt.__webglFramebuffer),we.bindFramebuffer(F.DRAW_FRAMEBUFFER,Xi.__webglFramebuffer);for(let qi=0;qi<be;qi++)xs&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Se.get(E).__webglTexture,I,Le+qi),E.isDepthTexture?(rt&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Se.get(k).__webglTexture,I,nt+qi),F.blitFramebuffer(xe,Ce,te,he,_e,qe,te,he,F.DEPTH_BUFFER_BIT,F.NEAREST)):rt?F.copyTexSubImage3D(Me,I,_e,qe,nt+qi,xe,Ce,te,he):F.copyTexSubImage2D(Me,I,_e,qe,nt+qi,xe,Ce,te,he);we.bindFramebuffer(F.READ_FRAMEBUFFER,null),we.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else rt?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(Me,I,_e,qe,nt,te,he,be,Ft,Ke,at.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Me,I,_e,qe,nt,te,he,be,Ft,at.data):F.texSubImage3D(Me,I,_e,qe,nt,te,he,be,Ft,Ke,at):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,I,_e,qe,te,he,Ft,Ke,at.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,I,_e,qe,at.width,at.height,Ft,at.data):F.texSubImage2D(F.TEXTURE_2D,I,_e,qe,te,he,Ft,Ke,at);F.pixelStorei(F.UNPACK_ROW_LENGTH,wi),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Ye),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Qt),F.pixelStorei(F.UNPACK_SKIP_ROWS,wn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ot),I===0&&k.generateMipmaps&&F.generateMipmap(Me),we.unbindTexture()},this.copyTextureToTexture3D=function(E,k,z=null,B=null,I=0){return E.isTexture!==!0&&(Fs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,B=arguments[1]||null,E=arguments[2],k=arguments[3],I=arguments[4]||0),Fs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,k,z,B,I)},this.initRenderTarget=function(E){Se.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),we.unbindTexture()},this.resetState=function(){w=0,R=0,P=null,we.reset(),it.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}class vl{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new ie(e),this.near=t,this.far=i}clone(){return new vl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Oc extends ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gi,this.environmentIntensity=1,this.environmentRotation=new gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class hd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Wo,this.updateRanges=[],this.version=0,this.uuid=ri()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,s=this.stride;n<s;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ri()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Rt=new T;class Ys{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=si(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=si(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=si(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=si(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=si(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),n=et(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),n=et(n,this.array),s=et(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return new vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ys(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class bi extends li{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let zn;const Ts=new T,Bn=new T,Hn=new T,Gn=new Z,As=new Z,dd=new Ee,Aa=new T,Es=new T,Ea=new T,zc=new Z,Vr=new Z,Bc=new Z;class ji extends ot{constructor(e=new bi){if(super(),this.isSprite=!0,this.type="Sprite",zn===void 0){zn=new ut;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new hd(t,5);zn.setIndex([0,1,2,0,2,3]),zn.setAttribute("position",new Ys(i,3,0,!1)),zn.setAttribute("uv",new Ys(i,2,3,!1))}this.geometry=zn,this.material=e,this.center=new Z(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Bn.setFromMatrixScale(this.matrixWorld),dd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Hn.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Bn.multiplyScalar(-Hn.z);const i=this.material.rotation;let n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));const r=this.center;Ra(Aa.set(-.5,-.5,0),Hn,r,Bn,n,s),Ra(Es.set(.5,-.5,0),Hn,r,Bn,n,s),Ra(Ea.set(.5,.5,0),Hn,r,Bn,n,s),zc.set(0,0),Vr.set(1,0),Bc.set(1,1);let o=e.ray.intersectTriangle(Aa,Es,Ea,!1,Ts);if(o===null&&(Ra(Es.set(-.5,.5,0),Hn,r,Bn,n,s),Vr.set(0,1),o=e.ray.intersectTriangle(Aa,Ea,Es,!1,Ts),o===null))return;const c=e.ray.origin.distanceTo(Ts);c<e.near||c>e.far||t.push({distance:c,point:Ts.clone(),uv:Kt.getInterpolation(Ts,Aa,Es,Ea,zc,Vr,Bc,new Z),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ra(a,e,t,i,n,s){Gn.subVectors(a,t).addScalar(.5).multiply(i),n!==void 0?(As.x=s*Gn.x-n*Gn.y,As.y=n*Gn.x+s*Gn.y):As.copy(Gn),a.copy(e),a.x+=As.x,a.y+=As.y,a.applyMatrix4(dd)}const Hc=new T,Gc=new $e,Vc=new $e,hv=new T,Wc=new Ee,Ca=new T,Wr=new ci,jc=new Ee,jr=new Qs;class dv extends Ue{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Wl,this.bindMatrix=new Ee,this.bindMatrixInverse=new Ee,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new xi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ca),this.boundingBox.expandByPoint(Ca)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ci),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Ca),this.boundingSphere.expandByPoint(Ca)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wr.copy(this.boundingSphere),Wr.applyMatrix4(n),e.ray.intersectsSphere(Wr)!==!1&&(jc.copy(n).invert(),jr.copy(e.ray).applyMatrix4(jc),!(this.boundingBox!==null&&jr.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,jr)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new $e,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Wl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===_u?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,n=this.geometry;Gc.fromBufferAttribute(n.attributes.skinIndex,e),Vc.fromBufferAttribute(n.attributes.skinWeight,e),Hc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const r=Vc.getComponent(s);if(r!==0){const o=Gc.getComponent(s);Wc.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(hv.copy(Hc).applyMatrix4(Wc),r)}}return t.applyMatrix4(this.bindMatrixInverse)}}class ud extends ot{constructor(){super(),this.isBone=!0,this.type="Bone"}}class fd extends bt{constructor(e=null,t=1,i=1,n,s,r,o,c,l=kt,h=kt,d,u){super(null,r,o,c,l,h,n,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Xc=new Ee,uv=new Ee;class bl{constructor(e=[],t=[]){this.uuid=ri(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new Ee)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new Ee;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let s=0,r=e.length;s<r;s++){const o=e[s]?e[s].matrixWorld:uv;Xc.multiplyMatrices(o,t[s]),Xc.toArray(i,s*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new bl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new fd(t,e,e,Yt,ai);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){const s=e.bones[i];let r=t[s];r===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),r=new ud),this.bones.push(r),this.boneInverses.push(new Ee().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let n=0,s=t.length;n<s;n++){const r=t[n];e.bones.push(r.uuid);const o=i[n];e.boneInverses.push(o.toArray())}return e}}class qo extends vt{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Vn=new Ee,qc=new Ee,Pa=[],$c=new xi,fv=new Ee,Rs=new Ue,Cs=new ci;class $o extends Ue{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new qo(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,fv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new xi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Vn),$c.copy(e.boundingBox).applyMatrix4(Vn),this.boundingBox.union($c)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ci),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Vn),Cs.copy(e.boundingSphere).applyMatrix4(Vn),this.boundingSphere.union(Cs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,r=e*s+1;for(let o=0;o<i.length;o++)i[o]=n[r+o]}raycast(e,t){const i=this.matrixWorld,n=this.count;if(Rs.geometry=this.geometry,Rs.material=this.material,Rs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cs.copy(this.boundingSphere),Cs.applyMatrix4(i),e.ray.intersectsSphere(Cs)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,Vn),qc.multiplyMatrices(i,Vn),Rs.matrixWorld=qc,Rs.raycast(e,Pa);for(let r=0,o=Pa.length;r<o;r++){const c=Pa[r];c.instanceId=s,c.object=this,t.push(c)}Pa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new qo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new fd(new Float32Array(n*this.count),n,this.count,ll,ai));const s=this.morphTexture.source.data.data;let r=0;for(let l=0;l<i.length;l++)r+=i[l];const o=this.geometry.morphTargetsRelative?1:1-r,c=n*e;s[c]=o,s.set(i,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class pd extends li{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ie(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Qa=new T,Za=new T,Kc=new Ee,Ps=new Qs,Da=new ci,Xr=new T,Yc=new T;class xl extends ot{constructor(e=new ut,t=new pd){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let n=1,s=t.count;n<s;n++)Qa.fromBufferAttribute(t,n-1),Za.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=Qa.distanceTo(Za);e.setAttribute("lineDistance",new ze(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,s=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Da.copy(i.boundingSphere),Da.applyMatrix4(n),Da.radius+=s,e.ray.intersectsSphere(Da)===!1)return;Kc.copy(n).invert(),Ps.copy(e.ray).applyMatrix4(Kc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const f=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let b=f,m=g-1;b<m;b+=l){const p=h.getX(b),v=h.getX(b+1),_=La(this,e,Ps,c,p,v);_&&t.push(_)}if(this.isLineLoop){const b=h.getX(g-1),m=h.getX(f),p=La(this,e,Ps,c,b,m);p&&t.push(p)}}else{const f=Math.max(0,r.start),g=Math.min(u.count,r.start+r.count);for(let b=f,m=g-1;b<m;b+=l){const p=La(this,e,Ps,c,b,b+1);p&&t.push(p)}if(this.isLineLoop){const b=La(this,e,Ps,c,g-1,f);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function La(a,e,t,i,n,s){const r=a.geometry.attributes.position;if(Qa.fromBufferAttribute(r,n),Za.fromBufferAttribute(r,s),t.distanceSqToSegment(Qa,Za,Xr,Yc)>i)return;Xr.applyMatrix4(a.matrixWorld);const c=e.ray.origin.distanceTo(Xr);if(!(c<e.near||c>e.far))return{distance:c,point:Yc.clone().applyMatrix4(a.matrixWorld),index:n,face:null,faceIndex:null,barycoord:null,object:a}}const Jc=new T,Qc=new T;class pv extends xl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let n=0,s=t.count;n<s;n+=2)Jc.fromBufferAttribute(t,n),Qc.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Jc.distanceTo(Qc);e.setAttribute("lineDistance",new ze(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mv extends xl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class md extends li{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ie(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Zc=new Ee,Ko=new Qs,ka=new ci,Ia=new T;class gd extends ot{constructor(e=new ut,t=new md){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,n=this.matrixWorld,s=e.params.Points.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ka.copy(i.boundingSphere),ka.applyMatrix4(n),ka.radius+=s,e.ray.intersectsSphere(ka)===!1)return;Zc.copy(n).invert(),Ko.copy(e.ray).applyMatrix4(Zc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,d=i.attributes.position;if(l!==null){const u=Math.max(0,r.start),f=Math.min(l.count,r.start+r.count);for(let g=u,b=f;g<b;g++){const m=l.getX(g);Ia.fromBufferAttribute(d,m),eh(Ia,m,c,n,e,t,this)}}else{const u=Math.max(0,r.start),f=Math.min(d.count,r.start+r.count);for(let g=u,b=f;g<b;g++)Ia.fromBufferAttribute(d,g),eh(Ia,g,c,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function eh(a,e,t,i,n,s,r){const o=Ko.distanceSqToPoint(a);if(o<t){const c=new T;Ko.closestPointToPoint(a,c),c.applyMatrix4(i);const l=n.ray.origin.distanceTo(c);if(l<n.near||l>n.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}class Zs extends bt{constructor(e,t,i,n,s,r,o,c,l){super(e,t,i,n,s,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class _i{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,n=this.getPoint(0),s=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),s+=i.distanceTo(n),t.push(s),n=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let n=0;const s=i.length;let r;t?r=t:r=e*i[s-1];let o=0,c=s-1,l;for(;o<=c;)if(n=Math.floor(o+(c-o)/2),l=i[n]-r,l<0)o=n+1;else if(l>0)c=n-1;else{c=n;break}if(n=c,i[n]===r)return n/(s-1);const h=i[n],u=i[n+1]-h,f=(r-h)/u;return(n+f)/(s-1)}getTangent(e,t){let n=e-1e-4,s=e+1e-4;n<0&&(n=0),s>1&&(s=1);const r=this.getPoint(n),o=this.getPoint(s),c=t||(r.isVector2?new Z:new T);return c.copy(o).sub(r).normalize(),c}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new T,n=[],s=[],r=[],o=new T,c=new Ee;for(let f=0;f<=e;f++){const g=f/e;n[f]=this.getTangentAt(g,new T)}s[0]=new T,r[0]=new T;let l=Number.MAX_VALUE;const h=Math.abs(n[0].x),d=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=l&&(l=h,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),u<=l&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),r[0].crossVectors(n[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),r[f]=r[f-1].clone(),o.crossVectors(n[f-1],n[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(gt(n[f-1].dot(n[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(o,g))}r[f].crossVectors(n[f],s[f])}if(t===!0){let f=Math.acos(gt(s[0].dot(s[e]),-1,1));f/=e,n[0].dot(o.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(n[g],f*g)),r[g].crossVectors(n[g],s[g])}return{tangents:n,normals:s,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class _l extends _i{constructor(e=0,t=0,i=1,n=1,s=0,r=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=r,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Z){const i=t,n=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const r=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(r?s=0:s=n),this.aClockwise===!0&&!r&&(s===n?s=-n:s=s-n);const o=this.aStartAngle+e*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return i.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class gv extends _l{constructor(e,t,i,n,s,r){super(e,t,i,i,n,s,r),this.isArcCurve=!0,this.type="ArcCurve"}}function yl(){let a=0,e=0,t=0,i=0;function n(s,r,o,c){a=s,e=o,t=-3*s+3*r-2*o-c,i=2*s-2*r+o+c}return{initCatmullRom:function(s,r,o,c,l){n(r,o,l*(o-s),l*(c-r))},initNonuniformCatmullRom:function(s,r,o,c,l,h,d){let u=(r-s)/l-(o-s)/(l+h)+(o-r)/h,f=(o-r)/h-(c-r)/(h+d)+(c-o)/d;u*=h,f*=h,n(r,o,u,f)},calc:function(s){const r=s*s,o=r*s;return a+e*s+t*r+i*o}}}const Fa=new T,qr=new yl,$r=new yl,Kr=new yl;class vv extends _i{constructor(e=[],t=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=n}getPoint(e,t=new T){const i=t,n=this.points,s=n.length,r=(s-(this.closed?0:1))*e;let o=Math.floor(r),c=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,h;this.closed||o>0?l=n[(o-1)%s]:(Fa.subVectors(n[0],n[1]).add(n[0]),l=Fa);const d=n[o%s],u=n[(o+1)%s];if(this.closed||o+2<s?h=n[(o+2)%s]:(Fa.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=Fa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),b=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);b<1e-4&&(b=1),g<1e-4&&(g=b),m<1e-4&&(m=b),qr.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,b,m),$r.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,b,m),Kr.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,b,m)}else this.curveType==="catmullrom"&&(qr.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),$r.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Kr.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return i.set(qr.calc(c),$r.calc(c),Kr.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new T().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function th(a,e,t,i,n){const s=(i-e)*.5,r=(n-t)*.5,o=a*a,c=a*o;return(2*t-2*i+s+r)*c+(-3*t+3*i-2*s-r)*o+s*a+t}function bv(a,e){const t=1-a;return t*t*e}function xv(a,e){return 2*(1-a)*a*e}function _v(a,e){return a*a*e}function zs(a,e,t,i){return bv(a,e)+xv(a,t)+_v(a,i)}function yv(a,e){const t=1-a;return t*t*t*e}function Mv(a,e){const t=1-a;return 3*t*t*a*e}function Sv(a,e){return 3*(1-a)*a*a*e}function wv(a,e){return a*a*a*e}function Bs(a,e,t,i,n){return yv(a,e)+Mv(a,t)+Sv(a,i)+wv(a,n)}class vd extends _i{constructor(e=new Z,t=new Z,i=new Z,n=new Z){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new Z){const i=t,n=this.v0,s=this.v1,r=this.v2,o=this.v3;return i.set(Bs(e,n.x,s.x,r.x,o.x),Bs(e,n.y,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Tv extends _i{constructor(e=new T,t=new T,i=new T,n=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=n}getPoint(e,t=new T){const i=t,n=this.v0,s=this.v1,r=this.v2,o=this.v3;return i.set(Bs(e,n.x,s.x,r.x,o.x),Bs(e,n.y,s.y,r.y,o.y),Bs(e,n.z,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class bd extends _i{constructor(e=new Z,t=new Z){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Z){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Av extends _i{constructor(e=new T,t=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new T){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new T){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class xd extends _i{constructor(e=new Z,t=new Z,i=new Z){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Z){const i=t,n=this.v0,s=this.v1,r=this.v2;return i.set(zs(e,n.x,s.x,r.x),zs(e,n.y,s.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ev extends _i{constructor(e=new T,t=new T,i=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new T){const i=t,n=this.v0,s=this.v1,r=this.v2;return i.set(zs(e,n.x,s.x,r.x),zs(e,n.y,s.y,r.y),zs(e,n.z,s.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _d extends _i{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Z){const i=t,n=this.points,s=(n.length-1)*e,r=Math.floor(s),o=s-r,c=n[r===0?r:r-1],l=n[r],h=n[r>n.length-2?n.length-1:r+1],d=n[r>n.length-3?n.length-1:r+2];return i.set(th(o,c.x,l.x,h.x,d.x),th(o,c.y,l.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(n.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const n=e.points[t];this.points.push(new Z().fromArray(n))}return this}}var ih=Object.freeze({__proto__:null,ArcCurve:gv,CatmullRomCurve3:vv,CubicBezierCurve:vd,CubicBezierCurve3:Tv,EllipseCurve:_l,LineCurve:bd,LineCurve3:Av,QuadraticBezierCurve:xd,QuadraticBezierCurve3:Ev,SplineCurve:_d});class Rv extends _i{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ih[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),n=this.getCurveLengths();let s=0;for(;s<n.length;){if(n[s]>=i){const r=n[s]-i,o=this.curves[s],c=o.getLength(),l=c===0?0:1-r/c;return o.getPointAt(l,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,n=this.curves.length;i<n;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let n=0,s=this.curves;n<s.length;n++){const r=s[n],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,c=r.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const n=e.curves[t];this.curves.push(new ih[n.type]().fromJSON(n))}return this}}class Cv extends Rv{constructor(e){super(),this.type="Path",this.currentPoint=new Z,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new bd(this.currentPoint.clone(),new Z(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,n){const s=new xd(this.currentPoint.clone(),new Z(e,t),new Z(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(e,t,i,n,s,r){const o=new vd(this.currentPoint.clone(),new Z(e,t),new Z(i,n),new Z(s,r));return this.curves.push(o),this.currentPoint.set(s,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new _d(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,n,s,r){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,i,n,s,r),this}absarc(e,t,i,n,s,r){return this.absellipse(e,t,i,i,n,s,r),this}ellipse(e,t,i,n,s,r,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,i,n,s,r,o,c),this}absellipse(e,t,i,n,s,r,o,c){const l=new _l(e,t,i,n,s,r,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ml extends ut{constructor(e=[new Z(0,-.5),new Z(.5,0),new Z(0,.5)],t=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:n},t=Math.floor(t),n=gt(n,0,Math.PI*2);const s=[],r=[],o=[],c=[],l=[],h=1/t,d=new T,u=new Z,f=new T,g=new T,b=new T;let m=0,p=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:m=e[v+1].x-e[v].x,p=e[v+1].y-e[v].y,f.x=p*1,f.y=-m,f.z=p*0,b.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(b.x,b.y,b.z);break;default:m=e[v+1].x-e[v].x,p=e[v+1].y-e[v].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=b.x,f.y+=b.y,f.z+=b.z,f.normalize(),c.push(f.x,f.y,f.z),b.copy(g)}for(let v=0;v<=t;v++){const _=i+v*h*n,x=Math.sin(_),A=Math.cos(_);for(let w=0;w<=e.length-1;w++){d.x=e[w].x*x,d.y=e[w].y,d.z=e[w].x*A,r.push(d.x,d.y,d.z),u.x=v/t,u.y=w/(e.length-1),o.push(u.x,u.y);const R=c[3*w+0]*x,P=c[3*w+1],M=c[3*w+0]*A;l.push(R,P,M)}}for(let v=0;v<t;v++)for(let _=0;_<e.length-1;_++){const x=_+v*e.length,A=x,w=x+e.length,R=x+e.length+1,P=x+1;s.push(A,w,P),s.push(R,P,w)}this.setIndex(s),this.setAttribute("position",new ze(r,3)),this.setAttribute("uv",new ze(o,2)),this.setAttribute("normal",new ze(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ml(e.points,e.segments,e.phiStart,e.phiLength)}}class Sl extends Ml{constructor(e=1,t=1,i=4,n=8){const s=new Cv;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(i),n),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:n}}static fromJSON(e){return new Sl(e.radius,e.length,e.capSegments,e.radialSegments)}}class wl extends ut{constructor(e=1,t=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:n},t=Math.max(3,t);const s=[],r=[],o=[],c=[],l=new T,h=new Z;r.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const f=i+d/t*n;l.x=e*Math.cos(f),l.y=e*Math.sin(f),r.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(r[u]/e+1)/2,h.y=(r[u+1]/e+1)/2,c.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new ze(r,3)),this.setAttribute("normal",new ze(o,3)),this.setAttribute("uv",new ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ls extends ut{constructor(e=1,t=1,i=1,n=32,s=1,r=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:c};const l=this;n=Math.floor(n),s=Math.floor(s);const h=[],d=[],u=[],f=[];let g=0;const b=[],m=i/2;let p=0;v(),r===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new ze(d,3)),this.setAttribute("normal",new ze(u,3)),this.setAttribute("uv",new ze(f,2));function v(){const x=new T,A=new T;let w=0;const R=(t-e)/i;for(let P=0;P<=s;P++){const M=[],y=P/s,D=y*(t-e)+e;for(let U=0;U<=n;U++){const N=U/n,W=N*c+o,X=Math.sin(W),G=Math.cos(W);A.x=D*X,A.y=-y*i+m,A.z=D*G,d.push(A.x,A.y,A.z),x.set(X,R,G).normalize(),u.push(x.x,x.y,x.z),f.push(N,1-y),M.push(g++)}b.push(M)}for(let P=0;P<n;P++)for(let M=0;M<s;M++){const y=b[M][P],D=b[M+1][P],U=b[M+1][P+1],N=b[M][P+1];(e>0||M!==0)&&(h.push(y,D,N),w+=3),(t>0||M!==s-1)&&(h.push(D,U,N),w+=3)}l.addGroup(p,w,0),p+=w}function _(x){const A=g,w=new Z,R=new T;let P=0;const M=x===!0?e:t,y=x===!0?1:-1;for(let U=1;U<=n;U++)d.push(0,m*y,0),u.push(0,y,0),f.push(.5,.5),g++;const D=g;for(let U=0;U<=n;U++){const W=U/n*c+o,X=Math.cos(W),G=Math.sin(W);R.x=M*G,R.y=m*y,R.z=M*X,d.push(R.x,R.y,R.z),u.push(0,y,0),w.x=X*.5+.5,w.y=G*.5*y+.5,f.push(w.x,w.y),g++}for(let U=0;U<n;U++){const N=A+U,W=D+U;x===!0?h.push(W,W+1,N):h.push(W+1,W,N),P+=3}l.addGroup(p,P,x===!0?1:2),p+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ls(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class er extends ls{constructor(e=1,t=1,i=32,n=1,s=!1,r=0,o=Math.PI*2){super(0,e,t,i,n,s,r,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:r,thetaLength:o}}static fromJSON(e){return new er(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ea extends ut{constructor(e=[],t=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:n};const s=[],r=[];o(n),l(i),h(),this.setAttribute("position",new ze(s,3)),this.setAttribute("normal",new ze(s.slice(),3)),this.setAttribute("uv",new ze(r,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const _=new T,x=new T,A=new T;for(let w=0;w<t.length;w+=3)f(t[w+0],_),f(t[w+1],x),f(t[w+2],A),c(_,x,A,v)}function c(v,_,x,A){const w=A+1,R=[];for(let P=0;P<=w;P++){R[P]=[];const M=v.clone().lerp(x,P/w),y=_.clone().lerp(x,P/w),D=w-P;for(let U=0;U<=D;U++)U===0&&P===w?R[P][U]=M:R[P][U]=M.clone().lerp(y,U/D)}for(let P=0;P<w;P++)for(let M=0;M<2*(w-P)-1;M++){const y=Math.floor(M/2);M%2===0?(u(R[P][y+1]),u(R[P+1][y]),u(R[P][y])):(u(R[P][y+1]),u(R[P+1][y+1]),u(R[P+1][y]))}}function l(v){const _=new T;for(let x=0;x<s.length;x+=3)_.x=s[x+0],_.y=s[x+1],_.z=s[x+2],_.normalize().multiplyScalar(v),s[x+0]=_.x,s[x+1]=_.y,s[x+2]=_.z}function h(){const v=new T;for(let _=0;_<s.length;_+=3){v.x=s[_+0],v.y=s[_+1],v.z=s[_+2];const x=m(v)/2/Math.PI+.5,A=p(v)/Math.PI+.5;r.push(x,1-A)}g(),d()}function d(){for(let v=0;v<r.length;v+=6){const _=r[v+0],x=r[v+2],A=r[v+4],w=Math.max(_,x,A),R=Math.min(_,x,A);w>.9&&R<.1&&(_<.2&&(r[v+0]+=1),x<.2&&(r[v+2]+=1),A<.2&&(r[v+4]+=1))}}function u(v){s.push(v.x,v.y,v.z)}function f(v,_){const x=v*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function g(){const v=new T,_=new T,x=new T,A=new T,w=new Z,R=new Z,P=new Z;for(let M=0,y=0;M<s.length;M+=9,y+=6){v.set(s[M+0],s[M+1],s[M+2]),_.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),w.set(r[y+0],r[y+1]),R.set(r[y+2],r[y+3]),P.set(r[y+4],r[y+5]),A.copy(v).add(_).add(x).divideScalar(3);const D=m(A);b(w,y+0,v,D),b(R,y+2,_,D),b(P,y+4,x,D)}}function b(v,_,x,A){A<0&&v.x===1&&(r[_]=v.x-1),x.x===0&&x.z===0&&(r[_]=A/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ea(e.vertices,e.indices,e.radius,e.details)}}class Tl extends ea{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Tl(e.radius,e.detail)}}class Al extends ea{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Al(e.radius,e.detail)}}class ta extends ut{constructor(e=1,t=32,i=16,n=0,s=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:n,phiLength:s,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(r+o,Math.PI);let l=0;const h=[],d=new T,u=new T,f=[],g=[],b=[],m=[];for(let p=0;p<=i;p++){const v=[],_=p/i;let x=0;p===0&&r===0?x=.5/t:p===i&&c===Math.PI&&(x=-.5/t);for(let A=0;A<=t;A++){const w=A/t;d.x=-e*Math.cos(n+w*s)*Math.sin(r+_*o),d.y=e*Math.cos(r+_*o),d.z=e*Math.sin(n+w*s)*Math.sin(r+_*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),b.push(u.x,u.y,u.z),m.push(w+x,1-_),v.push(l++)}h.push(v)}for(let p=0;p<i;p++)for(let v=0;v<t;v++){const _=h[p][v+1],x=h[p][v],A=h[p+1][v],w=h[p+1][v+1];(p!==0||r>0)&&f.push(_,x,w),(p!==i-1||c<Math.PI)&&f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new ze(g,3)),this.setAttribute("normal",new ze(b,3)),this.setAttribute("uv",new ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ta(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class El extends ea{constructor(e=1,t=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],n=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,n,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new El(e.radius,e.detail)}}class Ut extends li{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ie(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ie(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qh,this.normalScale=new Z(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class yi extends Ut{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Z(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return gt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ie(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ie(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ie(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function Ua(a,e,t){return!a||!t&&a.constructor===e?a:typeof e.BYTES_PER_ELEMENT=="number"?new e(a):Array.prototype.slice.call(a)}function Pv(a){return ArrayBuffer.isView(a)&&!(a instanceof DataView)}function Dv(a){function e(n,s){return a[n]-a[s]}const t=a.length,i=new Array(t);for(let n=0;n!==t;++n)i[n]=n;return i.sort(e),i}function nh(a,e,t){const i=a.length,n=new a.constructor(i);for(let s=0,r=0;r!==i;++s){const o=t[s]*e;for(let c=0;c!==e;++c)n[r++]=a[o+c]}return n}function yd(a,e,t,i){let n=1,s=a[0];for(;s!==void 0&&s[i]===void 0;)s=a[n++];if(s===void 0)return;let r=s[i];if(r!==void 0)if(Array.isArray(r))do r=s[i],r!==void 0&&(e.push(s.time),t.push.apply(t,r)),s=a[n++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[i],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=a[n++];while(s!==void 0);else do r=s[i],r!==void 0&&(e.push(s.time),t.push(r)),s=a[n++];while(s!==void 0)}class ia{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,n=t[i],s=t[i-1];e:{t:{let r;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<s)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=t[++i],e<n)break t}r=t.length;break i}if(!(e>=s)){const o=t[1];e<o&&(i=2,s=o);for(let c=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(n=s,s=t[--i-1],e>=s)break t}r=i,i=0;break i}break e}for(;i<r;){const o=i+r>>>1;e<t[o]?r=o:i=o+1}if(n=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n;for(let r=0;r!==n;++r)t[r]=i[s+r];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Lv extends ia{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xn,endingEnd:Xn}}intervalChanged_(e,t,i){const n=this.parameterPositions;let s=e-2,r=e+1,o=n[s],c=n[r];if(o===void 0)switch(this.getSettings_().endingStart){case qn:s=e,o=2*t-i;break;case Ka:s=n.length-2,o=t+n[s]-n[s+1];break;default:s=e,o=i}if(c===void 0)switch(this.getSettings_().endingEnd){case qn:r=e,c=2*i-t;break;case Ka:r=1,c=i+n[1]-n[0];break;default:r=e-1,c=t}const l=(i-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-i),this._offsetPrev=s*h,this._offsetNext=r*h}interpolate_(e,t,i,n){const s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,g=(i-t)/(n-t),b=g*g,m=b*g,p=-u*m+2*u*b-u*g,v=(1+u)*m+(-1.5-2*u)*b+(-.5+u)*g+1,_=(-1-f)*m+(1.5+f)*b+.5*g,x=f*m-f*b;for(let A=0;A!==o;++A)s[A]=p*r[h+A]+v*r[l+A]+_*r[c+A]+x*r[d+A];return s}}class Md extends ia{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(i-t)/(n-t),d=1-h;for(let u=0;u!==o;++u)s[u]=r[l+u]*d+r[c+u]*h;return s}}class kv extends ia{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}}class Mi{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ua(t,this.TimeBufferType),this.values=Ua(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Ua(e.times,Array),values:Ua(e.values,Array)};const n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new kv(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Md(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Lv(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case qs:t=this.InterpolantFactoryMethodDiscrete;break;case $s:t=this.InterpolantFactoryMethodLinear;break;case pr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qs;case this.InterpolantFactoryMethodLinear:return $s;case this.InterpolantFactoryMethodSmooth:return pr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e}return this}trim(e,t){const i=this.times,n=i.length;let s=0,r=n-1;for(;s!==n&&i[s]<e;)++s;for(;r!==-1&&i[r]>t;)--r;if(++r,s!==0||r!==n){s>=r&&(r=Math.max(r,1),s=r-1);const o=this.getValueSize();this.times=i.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,n=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==s;o++){const c=i[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(r!==null&&r>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,r),e=!1;break}r=c}if(n!==void 0&&Pv(n))for(let o=0,c=n.length;o!==c;++o){const l=n[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===pr,s=e.length-1;let r=1;for(let o=1;o<s;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(n)c=!0;else{const d=o*i,u=d-i,f=d+i;for(let g=0;g!==i;++g){const b=t[d+g];if(b!==t[u+g]||b!==t[f+g]){c=!0;break}}}if(c){if(o!==r){e[r]=e[o];const d=o*i,u=r*i;for(let f=0;f!==i;++f)t[u+f]=t[d+f]}++r}}if(s>0){e[r]=e[s];for(let o=s*i,c=r*i,l=0;l!==i;++l)t[c+l]=t[o+l];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,n=new i(this.name,e,t);return n.createInterpolant=this.createInterpolant,n}}Mi.prototype.TimeBufferType=Float32Array;Mi.prototype.ValueBufferType=Float32Array;Mi.prototype.DefaultInterpolation=$s;class ps extends Mi{constructor(e,t,i){super(e,t,i)}}ps.prototype.ValueTypeName="bool";ps.prototype.ValueBufferType=Array;ps.prototype.DefaultInterpolation=qs;ps.prototype.InterpolantFactoryMethodLinear=void 0;ps.prototype.InterpolantFactoryMethodSmooth=void 0;class Sd extends Mi{}Sd.prototype.ValueTypeName="color";class cs extends Mi{}cs.prototype.ValueTypeName="number";class Iv extends ia{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=(i-t)/(n-t);let l=e*o;for(let h=l+o;l!==h;l+=4)Nt.slerpFlat(s,0,r,l-o,r,l,c);return s}}class hs extends Mi{InterpolantFactoryMethodLinear(e){return new Iv(this.times,this.values,this.getValueSize(),e)}}hs.prototype.ValueTypeName="quaternion";hs.prototype.InterpolantFactoryMethodSmooth=void 0;class ms extends Mi{constructor(e,t,i){super(e,t,i)}}ms.prototype.ValueTypeName="string";ms.prototype.ValueBufferType=Array;ms.prototype.DefaultInterpolation=qs;ms.prototype.InterpolantFactoryMethodLinear=void 0;ms.prototype.InterpolantFactoryMethodSmooth=void 0;class ds extends Mi{}ds.prototype.ValueTypeName="vector";class Yo{constructor(e="",t=-1,i=[],n=ul){this.name=e,this.tracks=i,this.duration=t,this.blendMode=n,this.uuid=ri(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,n=1/(e.fps||1);for(let r=0,o=i.length;r!==o;++r)t.push(Uv(i[r]).scale(n));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],i=e.tracks,n={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,r=i.length;s!==r;++s)t.push(Mi.toJSON(i[s]));return n}static CreateFromMorphTargetSequence(e,t,i,n){const s=t.length,r=[];for(let o=0;o<s;o++){let c=[],l=[];c.push((o+s-1)%s,o,(o+1)%s),l.push(0,1,0);const h=Dv(c);c=nh(c,1,h),l=nh(l,1,h),!n&&c[0]===0&&(c.push(s),l.push(l[0])),r.push(new cs(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/i))}return new this(e,-1,r)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const n=e;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===t)return i[n];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const n={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(s);if(h&&h.length>1){const d=h[1];let u=n[d];u||(n[d]=u=[]),u.push(l)}}const r=[];for(const o in n)r.push(this.CreateFromMorphTargetSequence(o,n[o],t,i));return r}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(d,u,f,g,b){if(f.length!==0){const m=[],p=[];yd(f,m,p,g),m.length!==0&&b.push(new d(u,m,p))}},n=[],s=e.name||"default",r=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let d=0;d<l.length;d++){const u=l[d].keys;if(!(!u||u.length===0))if(u[0].morphTargets){const f={};let g;for(g=0;g<u.length;g++)if(u[g].morphTargets)for(let b=0;b<u[g].morphTargets.length;b++)f[u[g].morphTargets[b]]=-1;for(const b in f){const m=[],p=[];for(let v=0;v!==u[g].morphTargets.length;++v){const _=u[g];m.push(_.time),p.push(_.morphTarget===b?1:0)}n.push(new cs(".morphTargetInfluence["+b+"]",m,p))}c=f.length*r}else{const f=".bones["+t[d].name+"]";i(ds,f+".position",u,"pos",n),i(hs,f+".quaternion",u,"rot",n),i(ds,f+".scale",u,"scl",n)}}return n.length===0?null:new this(s,c,n,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,n=e.length;i!==n;++i){const s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function Fv(a){switch(a.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return cs;case"vector":case"vector2":case"vector3":case"vector4":return ds;case"color":return Sd;case"quaternion":return hs;case"bool":case"boolean":return ps;case"string":return ms}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+a)}function Uv(a){if(a.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Fv(a.type);if(a.times===void 0){const t=[],i=[];yd(a.keys,t,i,"value"),a.times=t,a.values=i}return e.parse!==void 0?e.parse(a):new e(a.name,a.times,a.values,a.interpolation)}const sn={enabled:!1,files:{},add:function(a,e){this.enabled!==!1&&(this.files[a]=e)},get:function(a){if(this.enabled!==!1)return this.files[a]},remove:function(a){delete this.files[a]},clear:function(){this.files={}}};class Nv{constructor(e,t,i){const n=this;let s=!1,r=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){o++,s===!1&&n.onStart!==void 0&&n.onStart(h,r,o),s=!0},this.itemEnd=function(h){r++,n.onProgress!==void 0&&n.onProgress(h,r,o),r===o&&(s=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}}const Ov=new Nv;class gs{constructor(e){this.manager=e!==void 0?e:Ov,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(n,s){i.load(e,n,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}gs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Pi={};class zv extends Error{constructor(e,t){super(e),this.response=t}}class wd extends gs{constructor(e){super(e)}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=sn.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Pi[e]!==void 0){Pi[e].push({onLoad:t,onProgress:i,onError:n});return}Pi[e]=[],Pi[e].push({onLoad:t,onProgress:i,onError:n});const r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,c=this.responseType;fetch(r).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Pi[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=u?parseInt(u):0,g=f!==0;let b=0;const m=new ReadableStream({start(p){v();function v(){d.read().then(({done:_,value:x})=>{if(_)p.close();else{b+=x.byteLength;const A=new ProgressEvent("progress",{lengthComputable:g,loaded:b,total:f});for(let w=0,R=h.length;w<R;w++){const P=h[w];P.onProgress&&P.onProgress(A)}p.enqueue(x),v()}},_=>{p.error(_)})}}});return new Response(m)}else throw new zv(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o===void 0)return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{sn.add(e,l);const h=Pi[e];delete Pi[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Pi[e];if(h===void 0)throw this.manager.itemError(e),l;delete Pi[e];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Bv extends gs{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,r=sn.get(e);if(r!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0),r;const o=Ks("img");function c(){h(),sn.add(e,this),t&&t(this),s.manager.itemEnd(e)}function l(d){h(),n&&n(d),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Hv extends gs{constructor(e){super(e)}load(e,t,i,n){const s=new bt,r=new Bv(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,n),s}}class hr extends ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ie(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Gv extends hr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ie(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Yr=new Ee,sh=new T,ah=new T;class Rl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Z(512,512),this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ml,this._frameExtents=new Z(1,1),this._viewportCount=1,this._viewports=[new $e(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;sh.setFromMatrixPosition(e.matrixWorld),t.position.copy(sh),ah.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ah),t.updateMatrixWorld(),Yr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yr),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Yr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Vv extends Rl{constructor(){super(new Dt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=rs*2*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(i!==t.fov||n!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=n,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Td extends hr{constructor(e,t,i=0,n=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.distance=i,this.angle=n,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Vv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const rh=new Ee,Ds=new T,Jr=new T;class Wv extends Rl{constructor(){super(new Dt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Z(4,2),this._viewportCount=6,this._viewports=[new $e(2,1,1,1),new $e(0,1,1,1),new $e(3,1,1,1),new $e(1,1,1,1),new $e(3,0,1,1),new $e(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,n=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Ds.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ds),Jr.copy(i.position),Jr.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Jr),i.updateMatrixWorld(),n.makeTranslation(-Ds.x,-Ds.y,-Ds.z),rh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rh)}}class vs extends hr{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Wv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class jv extends Rl{constructor(){super(new lr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ad extends hr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.shadow=new jv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Hs{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,n=e.length;i<n;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Xv extends gs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,r=sn.get(e);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(l=>{t&&t(l),s.manager.itemEnd(e)}).catch(l=>{n&&n(l)});return}return setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0),r}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return sn.add(e,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){n&&n(l),sn.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});sn.add(e,c),s.manager.itemStart(e)}}class Ed{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=oh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=oh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function oh(){return performance.now()}class qv{constructor(e,t,i){this.binding=e,this.valueSize=i;let n,s,r;switch(t){case"quaternion":n=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,n=this.valueSize,s=e*n+n;let r=this.cumulativeWeight;if(r===0){for(let o=0;o!==n;++o)i[s+o]=i[o];r=t}else{r+=t;const o=t/r;this._mixBufferRegion(i,s,0,o,n)}this.cumulativeWeight=r}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,n,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,n=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const c=t*this._origIndex;this._mixBufferRegion(i,n,c,1-s,t)}r>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(i[c]!==i[c+t]){o.setValue(i,n);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,n=i*this._origIndex;e.getValue(t,n);for(let s=i,r=n;s!==r;++s)t[s]=t[n+s%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,n,s){if(n>=.5)for(let r=0;r!==s;++r)e[t+r]=e[i+r]}_slerp(e,t,i,n){Nt.slerpFlat(e,t,e,t,e,i,n)}_slerpAdditive(e,t,i,n,s){const r=this._workIndex*s;Nt.multiplyQuaternionsFlat(e,r,e,t,e,i),Nt.slerpFlat(e,t,e,t,e,r,n)}_lerp(e,t,i,n,s){const r=1-n;for(let o=0;o!==s;++o){const c=t+o;e[c]=e[c]*r+e[i+o]*n}}_lerpAdditive(e,t,i,n,s){for(let r=0;r!==s;++r){const o=t+r;e[o]=e[o]+e[i+r]*n}}}const Cl="\\[\\]\\.:\\/",$v=new RegExp("["+Cl+"]","g"),Pl="[^"+Cl+"]",Kv="[^"+Cl.replace("\\.","")+"]",Yv=/((?:WC+[\/:])*)/.source.replace("WC",Pl),Jv=/(WCOD+)?/.source.replace("WCOD",Kv),Qv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Pl),Zv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Pl),eb=new RegExp("^"+Yv+Jv+Qv+Zv+"$"),tb=["material","materials","bones","map"];class ib{constructor(e,t,i){const n=i||Je.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,n)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,s=i.length;n!==s;++n)i[n].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class Je{constructor(e,t,i){this.path=t,this.parsedPath=i||Je.parseTrackName(t),this.node=Je.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new Je.Composite(e,t,i):new Je(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($v,"")}static parseTrackName(e){const t=eb.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){const s=i.nodeName.substring(n+1);tb.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(s){for(let r=0;r<s.length;r++){const o=s[r];if(o.name===t||o.uuid===t)return o;const c=i(o.children);if(c)return c}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,n=t.propertyName;let s=t.propertyIndex;if(e||(e=Je.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const r=e[n];if(r===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+n+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(c=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=n;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Je.Composite=ib;Je.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Je.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Je.prototype.GetterByBindingType=[Je.prototype._getValue_direct,Je.prototype._getValue_array,Je.prototype._getValue_arrayElement,Je.prototype._getValue_toArray];Je.prototype.SetterByBindingTypeAndVersioning=[[Je.prototype._setValue_direct,Je.prototype._setValue_direct_setNeedsUpdate,Je.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_array,Je.prototype._setValue_array_setNeedsUpdate,Je.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_arrayElement,Je.prototype._setValue_arrayElement_setNeedsUpdate,Je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Je.prototype._setValue_fromArray,Je.prototype._setValue_fromArray_setNeedsUpdate,Je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class nb{constructor(e,t,i=null,n=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=n;const s=t.tracks,r=s.length,o=new Array(r),c={endingStart:Xn,endingEnd:Xn};for(let l=0;l!==r;++l){const h=s[l].createInterpolant(null);o[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=o,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=jh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i){if(e.fadeOut(t),this.fadeIn(t),i){const n=this._clip.duration,s=e._clip.duration,r=s/n,o=n/s;e.warp(1,r,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const n=this._mixer,s=n.time,r=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);const c=o.parameterPositions,l=o.sampleValues;return c[0]=s,c[1]=s+i,l[0]=e/r,l[1]=t/r,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,n){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const c=(e-s)*i;c<0||i===0?t=0:(this._startTime=null,t=i*c)}t*=this._updateTimeScale(e);const r=this._updateTime(t),o=this._updateWeight(e);if(o>0){const c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Mu:for(let h=0,d=c.length;h!==d;++h)c[h].evaluate(r),l[h].accumulateAdditive(o);break;case ul:default:for(let h=0,d=c.length;h!==d;++h)c[h].evaluate(r),l[h].accumulate(n,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let n=this.time+e,s=this._loopCount;const r=i===yu;if(e===0)return s===-1?n:r&&(s&1)===1?t-n:n;if(i===Wh){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(n>=t)n=t;else if(n<0)n=0;else{this.time=n;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),n>=t||n<0){const o=Math.floor(n/t);n-=t*o,s+=Math.abs(o);const c=this.repetitions-s;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=e>0?t:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){const l=e<0;this._setEndings(l,!l,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=n;if(r&&(s&1)===1)return t-n}return n}_setEndings(e,t,i){const n=this._interpolantSettings;i?(n.endingStart=qn,n.endingEnd=qn):(e?n.endingStart=this.zeroSlopeAtStart?qn:Xn:n.endingStart=Ka,t?n.endingEnd=this.zeroSlopeAtEnd?qn:Xn:n.endingEnd=Ka)}_scheduleFading(e,t,i){const n=this._mixer,s=n.time;let r=this._weightInterpolant;r===null&&(r=n._lendControlInterpolant(),this._weightInterpolant=r);const o=r.parameterPositions,c=r.sampleValues;return o[0]=s,c[0]=t,o[1]=s+e,c[1]=i,this}}const sb=new Float32Array(1);class ab extends Sn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const i=e._localRoot||this._root,n=e._clip.tracks,s=n.length,r=e._propertyBindings,o=e._interpolants,c=i.uuid,l=this._bindingsByRootAndName;let h=l[c];h===void 0&&(h={},l[c]=h);for(let d=0;d!==s;++d){const u=n[d],f=u.name;let g=h[f];if(g!==void 0)++g.referenceCount,r[d]=g;else{if(g=r[d],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,c,f));continue}const b=t&&t._propertyBindings[d].binding.parsedPath;g=new qv(Je.create(i,f,b),u.ValueTypeName,u.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,c,f),r[d]=g}o[d].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,n=e._clip.uuid,s=this._actionsByClip[n];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,n,i)}const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const s=t[i];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const s=t[i];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const n=this._actions,s=this._actionsByClip;let r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{const o=r.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=n.length,n.push(e),r.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],n=e._cacheIndex;i._cacheIndex=n,t[n]=i,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,r=this._actionsByClip,o=r[s],c=o.knownActions,l=c[c.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),e._byClipCacheIndex=null;const d=o.actionByRoot,u=(e._localRoot||this._root).uuid;delete d[u],c.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const s=t[i];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,n=this._nActiveActions++,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,n=--this._nActiveActions,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_addInactiveBinding(e,t,i){const n=this._bindingsByRootAndName,s=this._bindings;let r=n[t];r===void 0&&(r={},n[t]=r),r[i]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,n=i.rootNode.uuid,s=i.path,r=this._bindingsByRootAndName,o=r[n],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete o[s],Object.keys(o).length===0&&delete r[n]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,n=this._nActiveBindings++,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,n=--this._nActiveBindings,s=t[n];e._cacheIndex=n,t[n]=e,s._cacheIndex=i,t[i]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new Md(new Float32Array(2),new Float32Array(2),1,sb),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,n=--this._nActiveControlInterpolants,s=t[n];e.__cacheIndex=n,t[n]=e,s.__cacheIndex=i,t[i]=s}clipAction(e,t,i){const n=t||this._root,s=n.uuid;let r=typeof e=="string"?Yo.findByName(n,e):e;const o=r!==null?r.uuid:e,c=this._actionsByClip[o];let l=null;if(i===void 0&&(r!==null?i=r.blendMode:i=ul),c!==void 0){const d=c.actionByRoot[s];if(d!==void 0&&d.blendMode===i)return d;l=c.knownActions[0],r===null&&(r=l._clip)}if(r===null)return null;const h=new nb(this,r,t,i);return this._bindAction(h,l),this._addInactiveAction(h,o,s),h}existingAction(e,t){const i=t||this._root,n=i.uuid,s=typeof e=="string"?Yo.findByName(i,e):e,r=s?s.uuid:e,o=this._actionsByClip[r];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,n=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let l=0;l!==i;++l)t[l]._update(n,e,s,r);const o=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)o[l].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,n=this._actionsByClip,s=n[i];if(s!==void 0){const r=s.knownActions;for(let o=0,c=r.length;o!==c;++o){const l=r[o];this._deactivateAction(l);const h=l._cacheIndex,d=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,d._cacheIndex=h,t[h]=d,t.pop(),this._removeInactiveBindingsForAction(l)}delete n[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const r in i){const o=i[r].actionByRoot,c=o[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}const n=this._bindingsByRootAndName,s=n[t];if(s!==void 0)for(const r in s){const o=s[r];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}const lh=new Ee;class rb{constructor(e,t,i=0,n=1/0){this.ray=new Qs(e,t),this.near=i,this.far=n,this.camera=null,this.layers=new pl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return lh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(lh),this}intersectObject(e,t=!0,i=[]){return Jo(e,this,i,t),i.sort(ch),i}intersectObjects(e,t=!0,i=[]){for(let n=0,s=e.length;n<s;n++)Jo(e[n],this,i,t);return i.sort(ch),i}}function ch(a,e){return a.distance-e.distance}function Jo(a,e,t,i){let n=!0;if(a.layers.test(e.layers)&&a.raycast(e,t)===!1&&(n=!1),n===!0&&i===!0){const s=a.children;for(let r=0,o=s.length;r<o;r++)Jo(s[r],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sl);const Rd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class na{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ob=new lr(-1,1,1,-1,0,1);class lb extends ut{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}const cb=new lb;class Cd{constructor(e){this._mesh=new Ue(cb,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ob)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Qo extends na{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ht?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ja.clone(e.uniforms),this.material=new ht({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Cd(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class hh extends na{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const n=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let r,o;this.inverse?(r=0,o=1):(r=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),s.buffers.stencil.setFunc(n.ALWAYS,r,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(n.EQUAL,1,4294967295),s.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),s.buffers.stencil.setLocked(!0)}}class hb extends na{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class db{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new Z);this._width=i.width,this._height=i.height,t=new oi(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Hi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Qo(Rd),this.copyPass.material.blending=zi,this.clock=new Ed}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let n=0,s=this.passes.length;n<s;n++){const r=this.passes[n];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),r.needsSwap){if(i){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}hh!==void 0&&(r instanceof hh?i=!0:r instanceof hb&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Z);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ub extends na{constructor(e,t,i=null,n=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ie}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let s,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=n}}const fb={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ie(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class us extends na{constructor(e,t,i,n){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new Z(e.x,e.y):new Z(256,256),this.clearColor=new ie(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new oi(s,r,{type:Hi}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new oi(s,r,{type:Hi});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new oi(s,r,{type:Hi});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),r=Math.round(r/2)}const o=fb;this.highPassUniforms=Ja.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ht({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Z(1/s,1/r),s=Math.round(s/2),r=Math.round(r/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Rd;this.copyUniforms=Ja.clone(h.uniforms),this.blendMaterial=new ht({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Mt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ie,this.oldClearAlpha=1,this.basic=new Et,this.fsQuad=new Cd(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),n=Math.round(t/2);this.renderTargetBright.setSize(i,n);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,n),this.renderTargetsVertical[s].setSize(i,n),this.separableBlurMaterials[s].uniforms.invSize.value=new Z(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,t,i,n,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=us.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=us.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=r}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new ht({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Z(.5,.5)},direction:{value:new Z(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new ht({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}us.BlurDirectionX=new Z(1,0);us.BlurDirectionY=new Z(0,1);const pb={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Z(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		// FXAA algorithm from NVIDIA, C# implementation by Jasper Flick, GLSL port by Dave Hoskins
		// http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
		// https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;
			
			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {
				
				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );
			
		}`},mb={uniforms:{tDiffuse:{value:null},uTime:{value:0},uExposure:{value:1.18},uAberration:{value:1},uGrain:{value:.035},uVignette:{value:1},uDamage:{value:0},uLowHealth:{value:0},uSaturation:{value:1.08},uContrast:{value:1.06},uLift:{value:new T(.012,.008,.02)},uGain:{value:new T(1,.98,.96)},uFade:{value:0},uFlash:{value:0},uFlashColor:{value:new T(1,.6,.3)},uResolution:{value:new Z(1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float uTime, uExposure, uAberration, uGrain, uVignette, uDamage, uLowHealth, uSaturation, uContrast, uFade, uFlash;
    uniform vec3 uLift, uGain, uFlashColor;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // ACES fit (Stephen Hill) — same curve family three.js uses
    vec3 RRTAndODTFit(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }
    vec3 ACES(vec3 color) {
      const mat3 ACESInputMat = mat3(
        vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
      const mat3 ACESOutputMat = mat3(
        vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
      color *= 1.0 / 0.6;
      color = ACESInputMat * color;
      color = RRTAndODTFit(color);
      color = ACESOutputMat * color;
      return clamp(color, 0.0, 1.0);
    }
    vec3 toSRGB(vec3 c) {
      return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(vec3(0.0031308), c));
    }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      float ab = uAberration * (0.0015 + r2 * 0.018) + uDamage * 0.006;
      vec3 col;
      col.r = texture2D(tDiffuse, uv - c * ab).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + c * ab).b;
      col *= uExposure;
      col += uFlashColor * uFlash;
      col = ACES(col);
      col = toSRGB(col);
      // grading
      col = (col - 0.5) * uContrast + 0.5;
      float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(l), col, uSaturation * (1.0 - uLowHealth * 0.55));
      col = col * uGain + uLift * (1.0 - col);
      // vignette
      float v = smoothstep(0.95, 0.25, length(c * vec2(1.0, 0.9)) * uVignette * 1.15);
      col *= mix(0.25, 1.0, v);
      // damage / low health edge
      float edge = smoothstep(0.28, 0.78, length(c) * 1.25);
      float pulse = 0.55 + 0.45 * sin(uTime * 5.0);
      col = mix(col, vec3(0.55, 0.02, 0.03), clamp(edge * edge * (uDamage * 0.8 + uLowHealth * 0.35 * pulse), 0.0, 0.8));
      // film grain
      float n = hash(uv * uResolution + fract(uTime * 7.31) * 100.0);
      col += (n - 0.5) * uGrain;
      col *= 1.0 - uFade;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `};class gb{constructor(e){this.canvas=e,this.renderer=new cv({canvas:e,antialias:!1,powerPreference:"high-performance",stencil:!1}),this.quality=this.loadQuality(),this.pixelRatio=Math.min(window.devicePixelRatio,this.quality==="high"?1.6:this.quality==="medium"?1.25:1),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=this.quality!=="low",this.renderer.shadowMap.type=Dh,this.renderer.toneMapping=Bi,this.renderer.outputColorSpace=ct,this.scene=new Oc,this.scene.background=new ie(131331),this.camera=new Dt(36,window.innerWidth/window.innerHeight,.5,200),this.composer=new db(this.renderer),this.renderPass=new ub(this.scene,this.camera),this.composer.addPass(this.renderPass);const t=window.innerWidth,i=window.innerHeight;this.bloom=new us(new Z(t/2,i/2),.85,.55,.82),this.composer.addPass(this.bloom),this.final=new Qo(mb),this.composer.addPass(this.final),this.fxaa=new Qo(pb),this.composer.addPass(this.fxaa),this.onResize(),window.addEventListener("resize",()=>this.onResize()),this.buildEnvironment()}loadQuality(){try{return localStorage.getItem("emberdeep.quality")||"high"}catch{return"high"}}setQuality(e){this.quality=e;try{localStorage.setItem("emberdeep.quality",e)}catch{}this.pixelRatio=Math.min(window.devicePixelRatio,e==="high"?1.6:e==="medium"?1.25:1),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.shadowMap.enabled=e!=="low",this.scene.traverse(t=>{t.material&&(Array.isArray(t.material)?t.material:[t.material]).forEach(n=>n.needsUpdate=!0)}),this.onResize()}buildEnvironment(){const e=new jo(this.renderer),t=new Oc,i=new ta(10,32,16),n=new ht({side:Lt,vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ",fragmentShader:`varying vec3 vP; void main(){
        float y = vP.y;
        vec3 top = vec3(0.05,0.07,0.12);
        vec3 mid = vec3(0.10,0.06,0.05);
        vec3 bot = vec3(0.35,0.14,0.05);
        vec3 c = y > 0.0 ? mix(mid, top, y) : mix(mid, bot, -y);
        float band = smoothstep(0.92, 1.0, 1.0 - abs(y - 0.25)) * 0.6;
        c += vec3(1.0,0.55,0.25) * band;
        gl_FragColor = vec4(c, 1.0);
      }`});t.add(new Ue(i,n));const s=new Ue(new vi(4,2),new Et({color:new ie(2.5,1.4,.7)}));s.position.set(0,3,-7),s.lookAt(0,0,0),t.add(s);const r=new Ue(new vi(3,3),new Et({color:new ie(.4,.6,1.2)}));r.position.set(6,5,4),r.lookAt(0,0,0),t.add(r),this.envMap=e.fromScene(t,.035).texture,this.scene.environment=this.envMap,this.scene.environmentIntensity=.55,e.dispose()}onResize(){const e=window.innerWidth,t=window.innerHeight;this.renderer.setSize(e,t),this.composer.setPixelRatio(this.pixelRatio),this.composer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix();const i=this.pixelRatio;this.fxaa.material.uniforms.resolution.value.set(1/(e*i),1/(t*i)),this.final.uniforms.uResolution.value.set(e*i,t*i),this.bloom.resolution.set(e/2,t/2)}render(e){this.final.uniforms.uTime.value=e,this.composer.render()}}const vb=`
  attribute vec4 aColor;
  attribute float aSize;
  attribute float aSpin;
  uniform float uScale;
  varying vec4 vColor;
  varying float vSpin;
  void main() {
    vColor = aColor;
    vSpin = aSpin;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * uScale / -mv.z, 0.0, 256.0);
    gl_Position = projectionMatrix * mv;
  }
`,bb=`
  varying vec4 vColor;
  varying float vSpin;
  uniform float uSoft;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p) * 2.0;
    if (d > 1.0) discard;
    float core = exp(-d * d * 5.0);
    float a = mix(smoothstep(1.0, 0.0, d), core, uSoft);
    // streak shape for sparks (vSpin>0 stretches)
    gl_FragColor = vec4(vColor.rgb * vColor.a * a, vColor.a * a);
  }
`;class dh{constructor(e,t=6e3,{additive:i=!0,soft:n=.6}={}){this.max=t,this.count=0,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.col=new Float32Array(t*4),this.c0=new Float32Array(t*3),this.c1=new Float32Array(t*3),this.size=new Float32Array(t),this.s0=new Float32Array(t),this.s1=new Float32Array(t),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.drag=new Float32Array(t),this.grav=new Float32Array(t),this.alpha=new Float32Array(t),this.spin=new Float32Array(t),this.flicker=new Float32Array(t),this.geo=new ut,this.posAttr=new vt(this.pos,3).setUsage(mr),this.colAttr=new vt(this.col,4).setUsage(mr),this.sizeAttr=new vt(this.size,1).setUsage(mr),this.spinAttr=new vt(this.spin,1),this.geo.setAttribute("position",this.posAttr),this.geo.setAttribute("aColor",this.colAttr),this.geo.setAttribute("aSize",this.sizeAttr),this.geo.setAttribute("aSpin",this.spinAttr),this.geo.boundingSphere=new ci(new T,1e5),this.material=new ht({vertexShader:vb,fragmentShader:bb,uniforms:{uScale:{value:600},uSoft:{value:n}},transparent:!0,depthWrite:!1,blending:i?Mt:an}),this.points=new gd(this.geo,this.material),this.points.frustumCulled=!1,this.points.renderOrder=10,e.add(this.points)}setScale(e,t){this.material.uniforms.uScale.value=e/(2*Math.tan(t*Math.PI/360))}emit(e){if(this.count>=this.max)return;const t=this.count++,i=t*3;this.pos[i]=e.x,this.pos[i+1]=e.y,this.pos[i+2]=e.z,this.vel[i]=e.vx||0,this.vel[i+1]=e.vy||0,this.vel[i+2]=e.vz||0;const n=e.color||[1,1,1],s=e.color2||n;this.c0[i]=n[0],this.c0[i+1]=n[1],this.c0[i+2]=n[2],this.c1[i]=s[0],this.c1[i+1]=s[1],this.c1[i+2]=s[2],this.s0[t]=e.size??.3,this.s1[t]=e.size2??0,this.life[t]=0,this.maxLife[t]=e.life??1,this.drag[t]=e.drag??1,this.grav[t]=e.gravity??0,this.alpha[t]=e.alpha??1,this.flicker[t]=e.flicker??0,this.spin[t]=0}update(e){let t=this.count;for(let i=0;i<t;i++){if(this.life[i]+=e,this.life[i]>=this.maxLife[i]){t--,i!==t&&this.copy(t,i),i--;continue}const n=i*3,s=this.life[i]/this.maxLife[i],r=Math.exp(-this.drag[i]*e);this.vel[n]*=r,this.vel[n+1]=this.vel[n+1]*r-this.grav[i]*e,this.vel[n+2]*=r,this.pos[n]+=this.vel[n]*e,this.pos[n+1]+=this.vel[n+1]*e,this.pos[n+2]+=this.vel[n+2]*e,this.pos[n+1]<.02&&this.grav[i]>0&&(this.pos[n+1]=.02,this.vel[n+1]*=-.3,this.vel[n]*=.6,this.vel[n+2]*=.6),this.size[i]=this.s0[i]+(this.s1[i]-this.s0[i])*s;const o=i*4;let c=this.alpha[i]*(s<.1?s/.1:1-(s-.1)/.9);this.flicker[i]>0&&(c*=1-this.flicker[i]*Math.random()),this.col[o]=this.c0[n]+(this.c1[n]-this.c0[n])*s,this.col[o+1]=this.c0[n+1]+(this.c1[n+1]-this.c0[n+1])*s,this.col[o+2]=this.c0[n+2]+(this.c1[n+2]-this.c0[n+2])*s,this.col[o+3]=Math.max(0,c)}this.count=t,this.geo.setDrawRange(0,t),this.posAttr.needsUpdate=!0,this.colAttr.needsUpdate=!0,this.sizeAttr.needsUpdate=!0,this.posAttr.clearUpdateRanges(),this.posAttr.addUpdateRange(0,t*3),this.colAttr.clearUpdateRanges(),this.colAttr.addUpdateRange(0,t*4),this.sizeAttr.clearUpdateRanges(),this.sizeAttr.addUpdateRange(0,t)}copy(e,t){const i=e*3,n=t*3;for(let s=0;s<3;s++)this.pos[n+s]=this.pos[i+s],this.vel[n+s]=this.vel[i+s],this.c0[n+s]=this.c0[i+s],this.c1[n+s]=this.c1[i+s];for(let s=0;s<4;s++)this.col[t*4+s]=this.col[e*4+s];this.size[t]=this.size[e],this.s0[t]=this.s0[e],this.s1[t]=this.s1[e],this.life[t]=this.life[e],this.maxLife[t]=this.maxLife[e],this.drag[t]=this.drag[e],this.grav[t]=this.grav[e],this.alpha[t]=this.alpha[e],this.flicker[t]=this.flicker[e]}clear(){this.count=0,this.geo.setDrawRange(0,0)}}function bs(a){let e=a>>>0;return function(){e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}class xb{constructor(e=Math.random()*2**31|0){this.seed=e,this.next=bs(e)}float(e=0,t=1){return e+(t-e)*this.next()}int(e,t){return Math.floor(this.float(e,t+1))}chance(e){return this.next()<e}pick(e){return e[Math.floor(this.next()*e.length)]}sign(){return this.next()<.5?-1:1}shuffle(e){for(let t=e.length-1;t>0;t--){const i=Math.floor(this.next()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}weighted(e,t){let i=0;for(const s of e)i+=t(s);let n=this.next()*i;for(const s of e)if(n-=t(s),n<=0)return s;return e[e.length-1]}}function _b(a,e){const t=bs(a),i=e,n=new Float32Array(i*i);for(let r=0;r<n.length;r++)n[r]=t();const s=(r,o)=>n[(o%i+i)%i*i+(r%i+i)%i];return(r,o)=>{const c=Math.floor(r),l=Math.floor(o),h=r-c,d=o-l,u=h*h*(3-2*h),f=d*d*(3-2*d),g=s(c,l),b=s(c+1,l),m=s(c,l+1),p=s(c+1,l+1);return g+(b-g)*u+(m-g)*f+(g-b-m+p)*u*f}}function Jn(a,e,t=5){const i=[];for(let n=0;n<t;n++)i.push(_b(a+n*101,e<<n));return(n,s)=>{let r=0,o=.5,c=0;for(let l=0;l<t;l++){const h=e<<l;r+=i[l](n*h,s*h)*o,c+=o,o*=.5}return r/c}}function Dl(a,e,t){const i=new Uint8ClampedArray(e*e*4),n=(s,r)=>a[(r+e)%e*e+(s+e)%e];for(let s=0;s<e;s++)for(let r=0;r<e;r++){const o=(n(r+1,s)-n(r-1,s))*t,c=(n(r,s+1)-n(r,s-1))*t;let l=-o,h=-c,d=1;const u=Math.hypot(l,h,d);l/=u,h/=u,d/=u;const f=(s*e+r)*4;i[f]=(l*.5+.5)*255,i[f+1]=(-h*.5+.5)*255,i[f+2]=(d*.5+.5)*255,i[f+3]=255}return i}function Ni(a,e,t,i=!0){const n=document.createElement("canvas");n.width=n.height=e,n.getContext("2d").putImageData(new ImageData(a,e,e),0,0);const r=new Zs(n);return i&&(r.wrapS=r.wrapT=yn),r.colorSpace=t?ct:Fi,r.anisotropy=8,r.generateMipmaps=!0,r.minFilter=pi,r.needsUpdate=!0,r}function Pd(a,e,t,i,n,s,r){const o=(t+n)/2,c=(i+s)/2,l=(n-t)/2-r,h=(s-i)/2-r,d=Math.abs(a-o)-l,u=Math.abs(e-c)-h,f=Math.max(d,0),g=Math.max(u,0);return Math.hypot(f,g)+Math.min(Math.max(d,u),0)-r}function yb(a=7,e=1024){const t=bs(a),i=Jn(a,4,6),n=Jn(a+50,8,4),s=Jn(a+90,2,4),r=e/512,o=[];let c=0;const l=[96,128,160].map(b=>b*r);for(;c<e;){let b=l[Math.floor(t()*l.length)];e-c-b<80*r&&(b=e-c);const m={y0:c,y1:c+b,off:Math.floor(t()*e),stones:[]};let p=0;for(;p<e;){let v=(110+t()*150)*r;e-p-v<90*r&&(v=e-p),m.stones.push({x0:p,x1:p+v,tone:.8+t()*.3,hue:t(),tiltX:(t()-.5)*.3,tiltY:(t()-.5)*.3,crack:t()<.3,crackSeed:t()*1e3,grout:(2.2+t()*2.2)*r,r:(5+t()*9)*r,worn:t()}),p+=v}o.push(m),c+=b}const h=new Float32Array(e*e),d=new Uint8ClampedArray(e*e*4),u=new Uint8ClampedArray(e*e*4),f=new Uint8ClampedArray(e*e*4);let g=0;for(let b=0;b<e;b++){for(;b>=o[g].y1;)g++;const m=o[g];for(let p=0;p<e;p++){const v=(p+m.off)%e;let _=m.stones[0];for(const j of m.stones)if(v>=j.x0&&v<j.x1){_=j;break}const x=_.grout,A=Pd(v+.5,b+.5,_.x0+x,m.y0+x,_.x1-x,m.y1-x,_.r),w=p/e,R=b/e,P=i(w,R),M=n(w,R),y=s(w,R),D=A<0,U=Math.min(1,Math.max(0,-A/(7*r)));let N;const W=(_.x1-_.x0)/2,X=(m.y1-m.y0)/2,G=(v-(_.x0+W))/W,Y=(b-(m.y0+X))/X;if(D){if(N=.55+.45*Math.pow(U,.55)+(P-.5)*.4+G*_.tiltX*.5+Y*_.tiltY*.5,_.crack){const j=Math.sin((G*1.7+_.crackSeed)*1.9)*.35+Math.sin(G*6+_.crackSeed)*.08,Q=Math.abs(Y-j),ue=.035;Q<ue&&Math.abs(G)<.75&&(N-=.4*(1-Q/ue))}M>.74&&U<.6&&(N-=.25)}else N=.1+M*.12;h[b*e+p]=N;const H=(b*e+p)*4;let ne,oe,ve;if(D){const j=_.tone*(.7+.5*P)*(.78+.22*U)*(.85+.3*y),Q=(_.hue-.5)*.08;ne=120*j*(1+Q),oe=115*j,ve=108*j*(1-Q);const ue=1-(1-U)*.4;ne*=ue,oe*=ue,ve*=ue;const se=Math.max(0,y-.55)*_.worn*1.5;ne*=1+se*.25,oe*=1+se*.25,ve*=1+se*.25,M>.7&&(ne*=.82,oe*=.82,ve*=.84)}else{const j=.32+M*.22;ne=44*j,oe=40*j,ve=38*j}d[H]=ne,d[H+1]=oe,d[H+2]=ve,d[H+3]=255;const Ne=D?.6+P*.32-U*.05-Math.max(0,y-.6)*_.worn*.6:.95;u[H]=u[H+1]=u[H+2]=Math.max(.15,Ne)*255,u[H+3]=255;const Qe=D?Math.max(0,1- -A/(4*r))*.4:.5+.5*Math.min(1,M*1.3);f[H]=f[H+1]=f[H+2]=Math.min(1,Qe)*255,f[H+3]=255}}return{map:Ni(d,e,!0),normalMap:Ni(Dl(h,e,3.2*r),e,!1),roughnessMap:Ni(u,e,!1),emissiveMap:Ni(f,e,!0)}}function Mb(a=11,e=512){const t=bs(a),i=Jn(a,4,6),n=Jn(a+9,16,3),s=6,r=3,o=e/s,c=e/r,l=[];for(let f=0;f<s;f++){const g=f%2?c/2:0;for(let b=-1;b<r;b++)l.push({row:f,x0:b*c+g+3+t()*2,x1:(b+1)*c+g-3-t()*2,y0:f*o+3+t()*1.5,y1:(f+1)*o-3-t()*1.5,tone:.75+t()*.35,r:4+t()*6,chip:t()})}const h=new Float32Array(e*e),d=new Uint8ClampedArray(e*e*4),u=new Uint8ClampedArray(e*e*4);for(let f=0;f<e;f++){const g=Math.floor(f/o);for(let b=0;b<e;b++){let m=1e9,p=null;for(const U of l)if(U.row===g)for(const N of[b,b-e,b+e]){const W=Pd(N+.5,f+.5,U.x0,U.y0,U.x1,U.y1,U.r);W<m&&(m=W,p=U)}const v=b/e,_=f/e,x=i(v,_),A=n(v,_),w=m<0,R=Math.min(1,Math.max(0,-m/7));let P=w?.5+.5*Math.pow(R,.7)+(x-.5)*.45:.1+A*.1;w&&A>.78&&p.chip>.5&&(P-=.25),h[f*e+b]=P;const M=(f*e+b)*4;let y;if(w){const U=p.tone*(.65+.55*x)*(.7+.3*R);y=[104*U,100*U,98*U]}else{const U=.3+.2*A;y=[40*U,38*U,37*U]}d[M]=y[0],d[M+1]=y[1],d[M+2]=y[2],d[M+3]=255;const D=w?.7+x*.25:.95;u[M]=u[M+1]=u[M+2]=D*255,u[M+3]=255}}return{map:Ni(d,e,!0),normalMap:Ni(Dl(h,e,3),e,!1),roughnessMap:Ni(u,e,!1)}}function Sb(a=5,e=256){const t=Jn(a,4,6),i=new Float32Array(e*e),n=new Uint8ClampedArray(e*e*4);for(let s=0;s<e;s++)for(let r=0;r<e;r++){const o=t(r/e,s/e),c=1-Math.abs(o*2-1);i[s*e+r]=c;const l=.25+c*.45,h=(s*e+r)*4;n[h]=60*l,n[h+1]=56*l,n[h+2]=58*l,n[h+3]=255}return{map:Ni(n,e,!0),normalMap:Ni(Dl(i,e,4),e,!1)}}function wb(a=512,e=3){const t=bs(e),i=document.createElement("canvas");i.width=i.height=a;const n=i.getContext("2d"),s=a/2;n.translate(s,s),n.strokeStyle="white",n.fillStyle="white",n.lineCap="round",n.shadowColor="white",n.shadowBlur=6;const r=(h,d)=>{n.lineWidth=d,n.beginPath(),n.arc(0,0,h,0,Math.PI*2),n.stroke()};r(s*.95,5),r(s*.86,2),r(s*.62,3),r(s*.56,1.5);const o=28;for(let h=0;h<o;h++){const d=h/o*Math.PI*2;n.save(),n.rotate(d),n.translate(0,-s*.905),n.lineWidth=2.5,n.beginPath();const u=2+Math.floor(t()*3);for(let f=0;f<u;f++){const g=(t()-.5)*14,b=(t()-.5)*18,m=(t()-.5)*14,p=(t()-.5)*18;n.moveTo(g,b),n.lineTo(m,p)}n.stroke(),n.restore()}n.lineWidth=2.5,n.beginPath();const c=7;for(let h=0;h<=c;h++){const d=h*3/c*Math.PI*2-Math.PI/2,u=Math.cos(d)*s*.6,f=Math.sin(d)*s*.6;h===0?n.moveTo(u,f):n.lineTo(u,f)}n.stroke(),r(s*.2,3);for(let h=0;h<7;h++){const d=h/7*Math.PI*2-Math.PI/2;n.beginPath(),n.arc(Math.cos(d)*s*.6,Math.sin(d)*s*.6,7,0,Math.PI*2),n.fill()}const l=new Zs(i);return l.colorSpace=ct,l.anisotropy=8,l}function Tb(a=128){const e=document.createElement("canvas");e.width=e.height=a;const t=e.getContext("2d"),i=t.createRadialGradient(a/2,a/2,0,a/2,a/2,a/2);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.2,"rgba(255,255,255,0.6)"),i.addColorStop(.5,"rgba(255,255,255,0.15)"),i.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=i,t.fillRect(0,0,a,a);const n=new Zs(e);return n.colorSpace=ct,n}function uh(a,e=256,t=1){const i=bs(t),n=document.createElement("canvas");n.width=n.height=e;const s=n.getContext("2d"),r=e/2;if(a==="scorch")for(let c=0;c<40;c++){const l=i()*Math.PI*2,h=i()*r*.5,d=r*(.2+i()*.35),u=s.createRadialGradient(r+Math.cos(l)*h,r+Math.sin(l)*h,0,r+Math.cos(l)*h,r+Math.sin(l)*h,d);u.addColorStop(0,"rgba(0,0,0,0.35)"),u.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=u,s.fillRect(0,0,e,e)}else if(a==="splat"){s.fillStyle="white";for(let c=0;c<18;c++){const l=i()*Math.PI*2,h=i()*r*.75;s.beginPath(),s.arc(r+Math.cos(l)*h,r+Math.sin(l)*h,4+i()*r*.16*(1-h/r),0,Math.PI*2),s.fill()}s.beginPath(),s.arc(r,r,r*.28,0,Math.PI*2),s.fill()}const o=new Zs(n);return o.colorSpace=ct,o}const Na=Math.PI*2,Ab=`
  attribute vec2 aTR;
  varying vec2 vTR;
  void main(){ vTR = aTR; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,Eb=`
  uniform float uP; uniform vec3 uColor; uniform vec3 uCore;
  varying vec2 vTR;
  void main(){
    float t = vTR.x, r = vTR.y;
    float head = uP * 1.35;
    float tail = head - 0.75;
    float along = smoothstep(tail, head, t) * step(t, head);
    float radial = smoothstep(0.0, 0.55, r) * smoothstep(1.0, 0.82, r);
    float edge = smoothstep(0.7, 0.97, r) * smoothstep(1.0, 0.95, r);
    float fade = 1.0 - smoothstep(0.55, 1.0, uP);
    float a = along * radial * fade;
    vec3 c = mix(uColor, uCore, edge * along);
    gl_FragColor = vec4(c * a, a);
  }
`,Rb=`
  uniform float uP; uniform vec3 uColor; uniform float uWidth;
  varying vec2 vUv;
  void main(){
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    float r = uP;
    float w = uWidth * (1.0 - uP * 0.5);
    float a = smoothstep(r - w, r, d) * smoothstep(r + w * 0.25, r, d);
    a *= 1.0 - uP;
    gl_FragColor = vec4(uColor * a, a);
  }
`,fh=`
  varying vec2 vUv; varying vec3 vLocal;
  void main(){ vUv = uv; vLocal = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`,Cb=`
  uniform int uKind; uniform float uP; uniform float uR; uniform float uArc; uniform float uLen; uniform float uW;
  uniform vec3 uColor; uniform float uAlpha; uniform float uTime;
  varying vec3 vLocal;
  void main(){
    // local plane is XY (rotated to ground); +Y is forward
    vec2 p = vLocal.xy;
    float f; float edge;
    if (uKind == 0) {
      f = length(p) / uR;
      if (f > 1.0) discard;
      edge = smoothstep(0.9, 0.99, f);
    } else if (uKind == 1) {
      f = length(p) / uR;
      float ang = atan(p.x, p.y);
      if (f > 1.0 || abs(ang) > uArc * 0.5) discard;
      float side = 1.0 - smoothstep(0.0, 0.25 / max(0.4, f * uR), uArc * 0.5 - abs(ang));
      edge = max(smoothstep(0.9, 0.99, f), side);
    } else {
      f = p.y / uLen;
      float lat = abs(p.x) / (uW * 0.5);
      if (f < 0.0 || f > 1.0 || lat > 1.0) discard;
      edge = max(max(smoothstep(0.96, 1.0, f), smoothstep(0.88, 1.0, lat)), smoothstep(0.03, 0.0, f));
    }
    float fill = step(f, uP) * 0.55;
    float base = 0.12 + 0.05 * sin(uTime * 18.0);
    float front = smoothstep(uP - 0.06, uP, f) * step(f, uP) * 0.8;
    float a = (base + fill + front + edge * 0.9) * uAlpha;
    gl_FragColor = vec4(uColor * a, a);
  }
`;class Pb{constructor(e){this.scene=e,this.add=new dh(e,9e3,{additive:!0,soft:.65}),this.dark=new dh(e,2500,{additive:!1,soft:.1}),this.glowTex=Tb(),this.runeTex=wb(),this.scorchTex=uh("scorch",256,4),this.splatTex=uh("splat",256,9),this.effects=[],this.time=0,this.lights=[];for(let t=0;t<4;t++){const i=new vs(16755302,0,10,2);i.userData.t=0,i.userData.dur=1,i.userData.peak=0,e.add(i),this.lights.push(i)}this.ringGeo=new vi(2,2),this.ringGeo.rotateX(-Math.PI/2),this.decals=[]}setScale(e,t){this.add.setScale(e,t),this.dark.setScale(e,t)}burst(e,{n:t=20,color:i=[3,1.4,.4],color2:n,speed:s=6,up:r=2,size:o=.25,size2:c=0,life:l=.6,gravity:h=6,drag:d=2.5,spread:u=1,y:f=0}={}){for(let g=0;g<t;g++){const b=Math.random()*Na,m=s*(.3+Math.random()*.7);this.add.emit({x:e.x+(Math.random()-.5)*.2*u,y:(e.y??0)+f+Math.random()*.2,z:e.z+(Math.random()-.5)*.2*u,vx:Math.cos(b)*m,vy:r*(.5+Math.random()),vz:Math.sin(b)*m,color:i,color2:n||[i[0]*.3,i[1]*.15,i[2]*.1],size:o*(.6+Math.random()*.8),size2:c,life:l*(.6+Math.random()*.6),gravity:h,drag:d})}}sparks(e,t,{n:i=14,color:n=[4,2.2,.8],speed:s=10,cone:r=.9,life:o=.35,y:c=1}={}){const l=Math.atan2(t.x,t.z);for(let h=0;h<i;h++){const d=l+(Math.random()-.5)*r*2,u=s*(.4+Math.random()*.8);this.add.emit({x:e.x,y:c+(Math.random()-.3)*.5,z:e.z,vx:Math.sin(d)*u,vy:(Math.random()-.2)*5,vz:Math.cos(d)*u,color:n,color2:[n[0]*.4,n[1]*.2,.05],size:.12+Math.random()*.1,size2:.02,life:o*(.5+Math.random()),gravity:14,drag:3})}}ichor(e,t,i,n=12){const s=Math.atan2(t.x,t.z);for(let r=0;r<n;r++){const o=s+(Math.random()-.5)*1.6,c=2+Math.random()*5;this.dark.emit({x:e.x,y:1+Math.random()*.4,z:e.z,vx:Math.sin(o)*c,vy:1+Math.random()*3,vz:Math.cos(o)*c,color:i,color2:i.map(l=>l*.5),size:.18+Math.random()*.15,size2:.05,life:.5+Math.random()*.4,gravity:16,drag:1.5,alpha:.9})}}smoke(e,{n:t=8,color:i=[.05,.045,.05],size:n=1.2,life:s=1.4,spread:r=.8,up:o=1.2,alpha:c=.55}={}){for(let l=0;l<t;l++)this.dark.emit({x:e.x+(Math.random()-.5)*r,y:(e.y??.3)+Math.random()*.4,z:e.z+(Math.random()-.5)*r,vx:(Math.random()-.5)*1.5,vy:o*(.5+Math.random()),vz:(Math.random()-.5)*1.5,color:i,size:n*.5,size2:n*(1+Math.random()),life:s*(.6+Math.random()*.6),drag:1.5,alpha:c})}debris(e,t,i=14){for(let n=0;n<i;n++){const s=Math.random()*Na,r=2+Math.random()*6;this.dark.emit({x:e.x,y:.6+Math.random()*.6,z:e.z,vx:Math.cos(s)*r,vy:3+Math.random()*5,vz:Math.sin(s)*r,color:t,size:.15+Math.random()*.2,size2:.12,life:.9+Math.random()*.6,gravity:20,drag:.8,alpha:1})}}flame(e,t=1,i=[3.2,1.3,.35]){this.add.emit({x:e.x+(Math.random()-.5)*.25*t,y:e.y+Math.random()*.1,z:e.z+(Math.random()-.5)*.25*t,vx:(Math.random()-.5)*.4,vy:(1.4+Math.random()*1.2)*t,vz:(Math.random()-.5)*.4,color:i,color2:[i[0]*.5,i[1]*.12,.02],size:.55*t*(.7+Math.random()*.5),size2:.08,life:.45+Math.random()*.35,drag:1.2}),Math.random()<.15&&this.add.emit({x:e.x,y:e.y+.3,z:e.z,vx:(Math.random()-.5)*1.2,vy:2+Math.random()*2,vz:(Math.random()-.5)*1.2,color:[4,1.8,.4],color2:[1,.2,0],size:.08,size2:.02,life:1.2+Math.random(),drag:.5,flicker:.6})}ember(e,t=[3,1.2,.3],i=10){this.add.emit({x:e.x+(Math.random()-.5)*i,y:Math.random()*.5,z:e.z+(Math.random()-.5)*i,vx:(Math.random()-.5)*.6,vy:.5+Math.random()*1.2,vz:(Math.random()-.5)*.6,color:t,color2:[t[0]*.3,t[1]*.2,t[2]*.2],size:.07+Math.random()*.08,size2:.01,life:2.5+Math.random()*2.5,drag:.3,flicker:.5})}mote(e,t=[.6,.7,1],i=14){this.add.emit({x:e.x+(Math.random()-.5)*i,y:.3+Math.random()*3,z:e.z+(Math.random()-.5)*i,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.2,vz:(Math.random()-.5)*.3,color:t,size:.05+Math.random()*.05,size2:.02,life:3+Math.random()*3,drag:.1,alpha:.6})}converge(e,t,i=6,n=1.5,s=1.2){for(let r=0;r<i;r++){const o=Math.random()*Na,c=n*(.6+Math.random()*.4),l=e.x+Math.cos(o)*c,h=e.z+Math.sin(o)*c,d=s+(Math.random()-.5)*1.2,u=.35;this.add.emit({x:l,y:d,z:h,vx:(e.x-l)/u,vy:(s-d)/u,vz:(e.z-h)/u,color:t,color2:t.map(f=>f*1.5),size:.12,size2:.25,life:u,drag:0})}}lightning(e,t,i=[1.5,2.5,6]){let s=e.x,r=e.y??1.2,o=e.z;const c=[[s,r,o]];for(let l=1;l<=10;l++){const h=l/10,d=l===10?0:.5;c.push([e.x+(t.x-e.x)*h+(Math.random()-.5)*d,(e.y??1.2)+((t.y??1.2)-(e.y??1.2))*h+(Math.random()-.5)*d,e.z+(t.z-e.z)*h+(Math.random()-.5)*d])}for(let l=0;l<c.length-1;l++){const[h,d,u]=c[l],[f,g,b]=c[l+1];for(let m=0;m<5;m++){const p=m/5;this.add.emit({x:h+(f-h)*p,y:d+(g-d)*p,z:u+(b-u)*p,color:i,color2:[.2,.4,1],size:.22,size2:.05,life:.18+Math.random()*.08,drag:0})}}this.flash(t,8956671,25,8,.15)}slash(e,t,{radius:i=2.6,arc:n=2.4,color:s=[3.5,1.4,.35],core:r=[6,4.5,2.5],dir:o=1,y:c=1,dur:l=.22,inner:h=.35}={}){const u=[],f=[],g=[];for(let v=0;v<=32;v++){const _=v/32,x=(o>0?-1:1)*(n/2)+(o>0?1:-1)*n*_,A=t+x;for(const w of[h,1])u.push(Math.sin(A)*i*w,0,Math.cos(A)*i*w),f.push(_,w);if(v<32){const w=v*2;g.push(w,w+1,w+2,w+1,w+3,w+2)}}const b=new ut;b.setAttribute("position",new ze(u,3)),b.setAttribute("aTR",new ze(f,2)),b.setIndex(g);const m=new ht({vertexShader:Ab,fragmentShader:Eb,uniforms:{uP:{value:0},uColor:{value:new T(...s)},uCore:{value:new T(...r)}},transparent:!0,depthWrite:!1,blending:Mt,side:Gt}),p=new Ue(b,m);return p.position.set(e.x,c,e.z),p.renderOrder=12,this.scene.add(p),this.effects.push({obj:p,t:0,dur:l,update:v=>{m.uniforms.uP.value=v},dispose:()=>{b.dispose(),m.dispose()}}),p}ring(e,t,{color:i=[3,1.3,.4],dur:n=.45,width:s=.25,y:r=.08}={}){const o=new ht({vertexShader:fh,fragmentShader:Rb,uniforms:{uP:{value:0},uColor:{value:new T(...i)},uWidth:{value:s}},transparent:!0,depthWrite:!1,blending:Mt}),c=new Ue(this.ringGeo,o);c.position.set(e.x,r,e.z),c.scale.setScalar(t),c.renderOrder=11,this.scene.add(c),this.effects.push({obj:c,t:0,dur:n,update:l=>o.uniforms.uP.value=1-Math.pow(1-l,2.2),dispose:()=>o.dispose()})}telegraph(e,t,{radius:i=2,arc:n=1.6,length:s=6,width:r=2,yaw:o=0,color:c=[2.2,.25,.12],alpha:l=1}={}){const h=e==="rect"?Math.max(s,r)*2+1:i*2+.5,d=new vi(h,h),u=new ht({vertexShader:fh,fragmentShader:Cb,uniforms:{uKind:{value:e==="circle"?0:e==="cone"?1:2},uP:{value:0},uR:{value:i},uArc:{value:n},uLen:{value:s},uW:{value:r},uColor:{value:new T(...c)},uAlpha:{value:l},uTime:{value:0}},transparent:!0,depthWrite:!1,blending:Mt}),f=new Ue(d,u);f.rotation.order="YXZ",f.rotation.x=-Math.PI/2,f.rotation.y=o+Math.PI,f.position.set(t.x,.06,t.z),f.renderOrder=9,this.scene.add(f);const g=this;return{mesh:f,set(m){u.uniforms.uP.value=m,u.uniforms.uTime.value=g.time},move(m,p){f.position.x=m.x,f.position.z=m.z,p!==void 0&&(f.rotation.y=p+Math.PI)},remove(){g.scene.remove(f),d.dispose(),u.dispose()}}}runeCircle(e,t,{color:i=[2.5,.9,3],dur:n=1.2,spin:s=1.5,y:r=.07,fadeIn:o=.2}={}){const c=new Et({map:this.runeTex,color:new ie(...i),transparent:!0,depthWrite:!1,blending:Mt,opacity:0}),l=new Ue(this.ringGeo,c);return l.position.set(e.x,r,e.z),l.scale.setScalar(t),l.renderOrder=9,this.scene.add(l),this.effects.push({obj:l,t:0,dur:n,update:(h,d)=>{l.rotation.y+=s*d;const u=Math.min(1,h*n/o);c.opacity=u*(1-Math.pow(h,3))},dispose:()=>c.dispose()}),l}glowSprite(e,{color:t=[3,1.2,.3],size:i=2,dur:n=.3,y:s=1}={}){const r=new bi({map:this.glowTex,color:new ie(...t),blending:Mt,depthWrite:!1,transparent:!0}),o=new ji(r);o.position.set(e.x,s,e.z),o.scale.setScalar(i),this.scene.add(o),this.effects.push({obj:o,t:0,dur:n,update:c=>{r.opacity=1-c,o.scale.setScalar(i*(1+c*.6))},dispose:()=>r.dispose()})}decal(e,t,i,{color:n=16777215,life:s=12,opacity:r=.85}={}){const o=new Et({map:e==="scorch"?this.scorchTex:this.splatTex,color:n,transparent:!0,depthWrite:!1,opacity:r,blending:an,polygonOffset:!0,polygonOffsetFactor:-2}),c=new Ue(this.ringGeo,o);if(c.position.set(t.x,.03+Math.random()*.01,t.z),c.rotation.y=Math.random()*Na,c.scale.setScalar(i/2),c.renderOrder=2,this.scene.add(c),this.decals.push(c),this.decals.length>40){const l=this.decals.shift();this.scene.remove(l),l.material.dispose()}this.effects.push({obj:null,t:0,dur:s,update:l=>{o.opacity=r*(l<.8?1:1-(l-.8)/.2)},dispose:()=>{const l=this.decals.indexOf(c);l>=0&&(this.decals.splice(l,1),this.scene.remove(c),o.dispose())}})}flash(e,t=16755285,i=40,n=10,s=.25){let r=this.lights[0];for(const o of this.lights)if(o.userData.t>=o.userData.dur){r=o;break}else o.intensity<r.intensity&&(r=o);r.color.set(t),r.position.set(e.x,(e.y??0)+1.5,e.z),r.distance=n,r.userData.t=0,r.userData.dur=s,r.userData.peak=i,r.intensity=i}update(e){this.time+=e,this.add.update(e),this.dark.update(e);for(let t=this.effects.length-1;t>=0;t--){const i=this.effects[t];i.t+=e;const n=Math.min(1,i.t/i.dur);i.update(n,e),n>=1&&(i.obj&&this.scene.remove(i.obj),i.dispose&&i.dispose(),this.effects.splice(t,1))}for(const t of this.lights){const i=t.userData;if(i.t<i.dur){i.t+=e;const n=Math.min(1,i.t/i.dur);t.intensity=i.peak*(1-n)*(1-n)}else t.intensity=0}}clearAll(){for(const e of this.effects)e.obj&&this.scene.remove(e.obj),e.dispose&&e.dispose();this.effects.length=0;for(const e of this.decals)this.scene.remove(e),e.material.dispose();this.decals.length=0,this.add.clear(),this.dark.clear();for(const e of this.lights)e.intensity=0,e.userData.t=e.userData.dur}}const Oi={uPlayerPos:{value:new T},uTime:{value:0}},Dd=`
  float eh3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float enoise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(eh3(i+vec3(0,0,0)), eh3(i+vec3(1,0,0)), f.x), mix(eh3(i+vec3(0,1,0)), eh3(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(eh3(i+vec3(0,0,1)), eh3(i+vec3(1,0,1)), f.x), mix(eh3(i+vec3(0,1,1)), eh3(i+vec3(1,1,1)), f.x), f.y), f.z);
  }
`;function Zo(a,e={}){const t={uFlash:{value:new T},uRim:{value:new T(...e.rim||[0,0,0])},uRimPow:{value:e.rimPow??2.5},uDissolve:{value:0},uDissolveColor:{value:new T(...e.dissolveColor||[3,1.2,.3])},uEmisLo:{value:e.emisLo??.6},uEmisHi:{value:e.emisHi??.95},uEmisStrength:{value:e.emisStrength??0},uHue:{value:e.hue??0},uOpacityMul:{value:1}};a.userData.u=t;const i=!!e.cutaway;return a.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.uniforms.uPlayerPos=Oi.uPlayerPos,n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vWPos;
        uniform vec3 uFlash, uRim, uDissolveColor, uPlayerPos;
        uniform float uRimPow, uDissolve, uEmisLo, uEmisHi, uEmisStrength, uOpacityMul;
        uniform int uHue;
        ${Dd}`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
        float dn = enoise(vWPos * 3.1) * 0.65 + enoise(vWPos * 9.0) * 0.35;
        if (uDissolve > 0.0 && dn < uDissolve) discard;
        ${i?`{
          vec2 dxz = vWPos.xz - uPlayerPos.xz;
          float inFront = smoothstep(0.2, 1.2, dxz.y) * (1.0 - smoothstep(4.5, 6.0, dxz.y));
          float lateral = 1.0 - smoothstep(1.8, 3.2, abs(dxz.x));
          float h = smoothstep(0.7, 1.3, vWPos.y);
          float fade = inFront * lateral * h;
          float dither = fract(dot(gl_FragCoord.xy, vec2(0.5, 0.25)) + fract(gl_FragCoord.y * 0.5) * 0.5);
          if (fade * 0.85 > dither) discard;
        }`:""}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        if (uEmisStrength > 0.0) {
          vec3 bc = diffuseColor.rgb;
          float mx = max(bc.r, max(bc.g, bc.b));
          float mn = min(bc.r, min(bc.g, bc.b));
          float sat = (mx - mn) / max(mx, 1e-3);
          float hot = smoothstep(uEmisLo, uEmisHi, mx) * smoothstep(0.3, 0.65, sat);
          float hueMask = 1.0;
          if (uHue == 1) hueMask = smoothstep(0.0, 0.15, bc.r - bc.b) * step(bc.g, bc.r * 1.05);
          if (uHue == 2) hueMask = smoothstep(0.0, 0.1, bc.b - bc.r * 0.8);
          totalEmissiveRadiance += bc * hot * hueMask * uEmisStrength;
        }`).replace("#include <opaque_fragment>",`{
          vec3 vdir = normalize(vViewPosition);
          float rim = pow(1.0 - clamp(dot(normal, vdir), 0.0, 1.0), uRimPow);
          outgoingLight += uRim * rim + uFlash;
          if (uDissolve > 0.0) {
            float e = 1.0 - smoothstep(uDissolve, uDissolve + 0.08, dn);
            outgoingLight += uDissolveColor * e * 4.0;
          }
        }
        #include <opaque_fragment>`)},a.customProgramCacheKey=()=>"ember-"+(i?"c":"n"),a.needsUpdate=!0,t}function ph(a){a.onBeforeCompile=e=>{e.uniforms.uPlayerPos=Oi.uPlayerPos,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;
uniform vec3 uPlayerPos;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
        {
          vec2 dxz = vWPos.xz - uPlayerPos.xz;
          float inFront = smoothstep(0.0, 1.0, dxz.y) * (1.0 - smoothstep(5.0, 6.5, dxz.y));
          float lateral = 1.0 - smoothstep(2.0, 3.6, abs(dxz.x));
          float h = smoothstep(0.9, 1.6, vWPos.y);
          float fade = inFront * lateral * h;
          float dither = fract(dot(gl_FragCoord.xy, vec2(0.5, 0.25)) + fract(gl_FragCoord.y * 0.5) * 0.5);
          if (fade * 0.92 > dither) discard;
        }`)},a.customProgramCacheKey=()=>"wall-cut"}function Db(a,{lo:e=.52,hi:t=.7}={}){a.onBeforeCompile=i=>{i.uniforms.uTime=Oi.uTime,i.uniforms.uVeinLo={value:e},i.uniforms.uVeinHi={value:t},i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
        varying vec3 vWPos; uniform float uTime, uVeinLo, uVeinHi;
        ${Dd}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          float wn = enoise(vec3(vWPos.xz * 0.11, uTime * 0.04)) * 0.7 + enoise(vec3(vWPos.xz * 0.37, 7.0 + uTime * 0.07)) * 0.3;
          float vein = smoothstep(uVeinLo, uVeinHi, wn);
          float breathe = 0.75 + 0.25 * sin(uTime * 1.3 + vWPos.x * 0.21 + vWPos.z * 0.17);
          totalEmissiveRadiance *= vein * breathe;
        }`)},a.customProgramCacheKey=()=>"floor-veins"}const mh={attack:{keys:["KeyJ"],mouse:0,pad:[2,7]},dash:{keys:["Space","ShiftLeft","ShiftRight","KeyK"],mouse:2,pad:[0,6]},nova:{keys:["KeyQ","KeyL"],pad:[3,5]},interact:{keys:["KeyE"],pad:[1]},potion:{keys:["KeyF","KeyR"],pad:[4]},pause:{keys:["Escape","KeyP"],pad:[9]}};class Lb{constructor(e){this.canvas=e,this.down=new Set,this.pressed=new Set,this.mouse={x:0,y:0,ndcX:0,ndcY:0,buttons:[!1,!1,!1],pressedButtons:[!1,!1,!1],moved:!1},this.padState={buttons:[],prevButtons:[],axes:[0,0,0,0],connected:!1},this.usingPad=!1,this.enabled=!0,window.addEventListener("keydown",t=>{["Space","Tab","ArrowUp","ArrowDown"].includes(t.code)&&t.preventDefault(),this.down.has(t.code)||this.pressed.add(t.code),this.down.add(t.code),this.usingPad=!1}),window.addEventListener("keyup",t=>this.down.delete(t.code)),window.addEventListener("blur",()=>{this.down.clear(),this.mouse.buttons=[!1,!1,!1]}),window.addEventListener("mousemove",t=>{this.mouse.x=t.clientX,this.mouse.y=t.clientY,this.mouse.ndcX=t.clientX/window.innerWidth*2-1,this.mouse.ndcY=-(t.clientY/window.innerHeight)*2+1,this.mouse.moved=!0,this.usingPad=!1}),e.addEventListener("mousedown",t=>{this.mouse.buttons[t.button]=!0,this.mouse.pressedButtons[t.button]=!0,this.usingPad=!1}),window.addEventListener("mouseup",t=>this.mouse.buttons[t.button]=!1),e.addEventListener("contextmenu",t=>t.preventDefault())}pollGamepad(){const e=navigator.getGamepads?navigator.getGamepads():[],t=e&&Array.from(e).find(n=>n&&n.connected),i=this.padState;if(i.prevButtons=i.buttons,!t){i.connected=!1,i.buttons=[];return}i.connected=!0,i.buttons=t.buttons.map(n=>n.pressed||n.value>.5),i.axes=t.axes.slice(0,4),(i.buttons.some(Boolean)||i.axes.some(n=>Math.abs(n)>.35))&&(this.usingPad=!0)}padPressed(e){return!!this.padState.buttons[e]&&!this.padState.prevButtons[e]}isDown(e){if(!this.enabled)return!1;const t=mh[e];return t?!!(t.keys&&t.keys.some(i=>this.down.has(i))||t.mouse!==void 0&&this.mouse.buttons[t.mouse]||t.pad&&t.pad.some(i=>this.padState.buttons[i])):this.down.has(e)}wasPressed(e){if(!this.enabled)return!1;const t=mh[e];return t?!!(t.keys&&t.keys.some(i=>this.pressed.has(i))||t.mouse!==void 0&&this.mouse.pressedButtons[t.mouse]||t.pad&&t.pad.some(i=>this.padPressed(i))):this.pressed.has(e)}moveVector(){let e=0,t=0;if((this.down.has("KeyW")||this.down.has("ArrowUp"))&&(t-=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(t+=1),(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(e-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(e+=1),this.padState.connected){const n=this.padState.axes[0]||0,s=this.padState.axes[1]||0;Math.hypot(n,s)>.2&&(e+=n,t+=s)}const i=Math.hypot(e,t);return i>1&&(e/=i,t/=i),{x:e,y:t}}aimStick(){if(!this.padState.connected)return null;const e=this.padState.axes[2]||0,t=this.padState.axes[3]||0;return Math.hypot(e,t)<.35?null:{x:e,y:t}}endFrame(){this.pressed.clear(),this.mouse.pressedButtons=[!1,!1,!1],this.mouse.moved=!1}}const kb=["swing1","swing2","swing_heavy","hit_flesh","hit_bone","crit","player_hurt","dash","nova","death_bones","death_monster","death_brute","wraith","cast","orb_hit","slam","brute_roar","boss_roar","fireball","explosion","coin","soul","potion","chest","gate_close","gate_open","boon","portal","ui_click","ui_hover","barrel","spawn","player_death","room_clear","spikes","lightning","charge","telegraph","levelup","amb_fire","amb_dungeon","hammer_swing","hammer_impact","dagger1","dagger2","deed","vow","champion","reroll","abyss","renown","page"],Ib=["music_title","music_explore","music_combat","music_boss"];class Fb{constructor(){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e,this.master=this.ctx.createGain(),this.master.connect(this.ctx.destination),this.comp=this.ctx.createDynamicsCompressor(),this.comp.threshold.value=-14,this.comp.knee.value=12,this.comp.ratio.value=4,this.comp.attack.value=.004,this.comp.release.value=.2,this.comp.connect(this.master),this.sfxBus=this.ctx.createGain(),this.sfxBus.connect(this.comp),this.musicBus=this.ctx.createGain(),this.musicBus.connect(this.master),this.ambBus=this.ctx.createGain(),this.ambBus.connect(this.master),this.buffers=new Map,this.lastPlayed=new Map,this.music={name:null,src:null,gain:null},this.ambients=new Map,this.volumes={master:.8,music:.55,sfx:.9};try{const t=JSON.parse(localStorage.getItem("emberdeep.volumes")||"null");t&&Object.assign(this.volumes,t)}catch{}this.applyVolumes(),this.musicDuck=1}applyVolumes(){const e=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.volumes.master,e,.05),this.musicBus.gain.setTargetAtTime(this.volumes.music*(this.musicDuck??1),e,.2),this.sfxBus.gain.setTargetAtTime(this.volumes.sfx,e,.05),this.ambBus.gain.setTargetAtTime(this.volumes.sfx*.8,e,.05)}setVolume(e,t){this.volumes[e]=t,this.applyVolumes();try{localStorage.setItem("emberdeep.volumes",JSON.stringify(this.volumes))}catch{}}duckMusic(e,t=.4){this.musicDuck=e,this.musicBus.gain.setTargetAtTime(this.volumes.music*e,this.ctx.currentTime,t)}unlock(){this.ctx.state!=="running"&&this.ctx.resume()}async load(e,t){try{const i=await fetch(t);if(!i.ok)throw new Error(i.status);const n=await i.arrayBuffer(),s=await this.ctx.decodeAudioData(n);this.buffers.set(e,s)}catch(i){console.warn("[audio] failed to load",e,i)}}async loadAll(e){const t=[...kb,...Ib];let i=0;await Promise.all(t.map(n=>this.load(n,`/emberdeep/assets/audio/${n}.mp3`).then(()=>{i++,e&&e(i/t.length)})))}play(e,t={}){const i=this.buffers.get(e);if(!i||this.ctx.state!=="running")return null;const n=performance.now(),s=t.throttle??35,r=this.lastPlayed.get(e)||0;if(n-r<s)return null;this.lastPlayed.set(e,n);const o=this.ctx.createBufferSource();o.buffer=i;const c=t.rateVar??.06;o.playbackRate.value=(t.rate??1)*(1+(Math.random()*2-1)*c);const l=this.ctx.createGain();l.gain.value=t.volume??1;let h=o;if(h.connect(l),h=l,t.pan){const d=this.ctx.createStereoPanner();d.pan.value=Math.max(-1,Math.min(1,t.pan)),h.connect(d),h=d}return h.connect(this.sfxBus),o.start(this.ctx.currentTime+(t.delay||0)),o}playAt(e,t,i,n={}){const s=t.x-i.x,r=t.z-i.z,o=Math.hypot(s,r),c=n.maxDist??28;if(o>c)return null;const l=Math.pow(1-o/c,1.6);return this.play(e,{...n,volume:(n.volume??1)*l,pan:s/14*.8})}playMusic(e,t=2){if(this.music.name===e)return;const i=this.ctx.currentTime;if(this.music.src){const o=this.music;o.gain.gain.cancelScheduledValues(i),o.gain.gain.setValueAtTime(o.gain.gain.value,i),o.gain.gain.linearRampToValueAtTime(0,i+t),o.src.stop(i+t+.1)}this.music={name:e,src:null,gain:null};const n=this.buffers.get(e);if(!n)return;const s=this.ctx.createBufferSource();s.buffer=n,s.loop=!0;const r=this.ctx.createGain();r.gain.value=0,r.gain.linearRampToValueAtTime(1,i+t),s.connect(r).connect(this.musicBus),s.start(i,e==="music_title"?0:Math.random()*Math.max(0,n.duration-30)*.5),this.music={name:e,src:s,gain:r}}stopMusic(e=1.5){if(!this.music.src)return;const t=this.ctx.currentTime;this.music.gain.gain.cancelScheduledValues(t),this.music.gain.gain.setValueAtTime(this.music.gain.gain.value,t),this.music.gain.gain.linearRampToValueAtTime(0,t+e),this.music.src.stop(t+e+.1),this.music={name:null,src:null,gain:null}}setAmbient(e,t,i=.6){let n=this.ambients.get(e);if(!n){const s=this.buffers.get(e);if(!s)return;const r=this.ctx.createBufferSource();r.buffer=s,r.loop=!0;const o=this.ctx.createGain();o.gain.value=0,r.connect(o).connect(this.ambBus),r.start(),n={src:r,gain:o,vol:0},this.ambients.set(e,n)}Math.abs(n.vol-t)>.01&&(n.vol=t,n.gain.gain.setTargetAtTime(t,this.ctx.currentTime,i))}}function gh(a,e){if(e===Su)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),a;if(e===Vo||e===Xh){let t=a.getIndex();if(t===null){const r=[],o=a.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)r.push(c);a.setIndex(r),t=a.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),a}const i=t.count-2,n=[];if(e===Vo)for(let r=1;r<=i;r++)n.push(t.getX(0)),n.push(t.getX(r)),n.push(t.getX(r+1));else for(let r=0;r<i;r++)r%2===0?(n.push(t.getX(r)),n.push(t.getX(r+1)),n.push(t.getX(r+2))):(n.push(t.getX(r+2)),n.push(t.getX(r+1)),n.push(t.getX(r)));n.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=a.clone();return s.setIndex(n),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),a}class Ub extends gs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Hb(t)}),this.register(function(t){return new Gb(t)}),this.register(function(t){return new Jb(t)}),this.register(function(t){return new Qb(t)}),this.register(function(t){return new Zb(t)}),this.register(function(t){return new Wb(t)}),this.register(function(t){return new jb(t)}),this.register(function(t){return new Xb(t)}),this.register(function(t){return new qb(t)}),this.register(function(t){return new Bb(t)}),this.register(function(t){return new $b(t)}),this.register(function(t){return new Vb(t)}),this.register(function(t){return new Yb(t)}),this.register(function(t){return new Kb(t)}),this.register(function(t){return new Ob(t)}),this.register(function(t){return new ex(t)}),this.register(function(t){return new tx(t)})}load(e,t,i,n){const s=this;let r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){const l=Hs.extractUrlBase(e);r=Hs.resolveURL(l,this.path)}else r=Hs.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){n?n(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new wd(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,r,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},i,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,n){let s;const r={},o={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Ld){try{r[Be.KHR_BINARY_GLTF]=new ix(e)}catch(d){n&&n(d);return}s=JSON.parse(r[Be.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){n&&n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new mx(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,r[d.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const d=s.extensionsUsed[h],u=s.extensionsRequired||[];switch(d){case Be.KHR_MATERIALS_UNLIT:r[d]=new zb;break;case Be.KHR_DRACO_MESH_COMPRESSION:r[d]=new nx(s,this.dracoLoader);break;case Be.KHR_TEXTURE_TRANSFORM:r[d]=new sx;break;case Be.KHR_MESH_QUANTIZATION:r[d]=new ax;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(r),l.setPlugins(o),l.parse(i,n)}parseAsync(e,t){const i=this;return new Promise(function(n,s){i.parse(e,t,n,s)})}}function Nb(){let a={};return{get:function(e){return a[e]},add:function(e,t){a[e]=t},remove:function(e){delete a[e]},removeAll:function(){a={}}}}const Be={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Ob{constructor(e){this.parser=e,this.name=Be.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,n=t.length;i<n;i++){const s=t[i];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let n=t.cache.get(i);if(n)return n;const s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let l;const h=new ie(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],It);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Ad(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new vs(h),l.distance=d;break;case"spot":l=new Td(h),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,Li(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),n=Promise.resolve(l),t.cache.add(i,n),n}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,s=i.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return i._getNodeRef(t.cache,o,c)})}}class zb{constructor(){this.name=Be.KHR_MATERIALS_UNLIT}getMaterialType(){return Et}extendParams(e,t,i){const n=[];e.color=new ie(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],It),e.opacity=r[3]}s.baseColorTexture!==void 0&&n.push(i.assignTexture(e,"map",s.baseColorTexture,ct))}return Promise.all(n)}}class Bb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Hb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];if(r.clearcoatFactor!==void 0&&(t.clearcoat=r.clearcoatFactor),r.clearcoatTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatMap",r.clearcoatTexture)),r.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=r.clearcoatRoughnessFactor),r.clearcoatRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatRoughnessMap",r.clearcoatRoughnessTexture)),r.clearcoatNormalTexture!==void 0&&(s.push(i.assignTexture(t,"clearcoatNormalMap",r.clearcoatNormalTexture)),r.clearcoatNormalTexture.scale!==void 0)){const o=r.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Z(o,o)}return Promise.all(s)}}class Gb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_DISPERSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Vb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];return r.iridescenceFactor!==void 0&&(t.iridescence=r.iridescenceFactor),r.iridescenceTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceMap",r.iridescenceTexture)),r.iridescenceIor!==void 0&&(t.iridescenceIOR=r.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),r.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=r.iridescenceThicknessMinimum),r.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=r.iridescenceThicknessMaximum),r.iridescenceThicknessTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceThicknessMap",r.iridescenceThicknessTexture)),Promise.all(s)}}class Wb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_SHEEN}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new ie(0,0,0),t.sheenRoughness=0,t.sheen=1;const r=n.extensions[this.name];if(r.sheenColorFactor!==void 0){const o=r.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],It)}return r.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=r.sheenRoughnessFactor),r.sheenColorTexture!==void 0&&s.push(i.assignTexture(t,"sheenColorMap",r.sheenColorTexture,ct)),r.sheenRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"sheenRoughnessMap",r.sheenRoughnessTexture)),Promise.all(s)}}class jb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];return r.transmissionFactor!==void 0&&(t.transmission=r.transmissionFactor),r.transmissionTexture!==void 0&&s.push(i.assignTexture(t,"transmissionMap",r.transmissionTexture)),Promise.all(s)}}class Xb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_VOLUME}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];t.thickness=r.thicknessFactor!==void 0?r.thicknessFactor:0,r.thicknessTexture!==void 0&&s.push(i.assignTexture(t,"thicknessMap",r.thicknessTexture)),t.attenuationDistance=r.attenuationDistance||1/0;const o=r.attenuationColor||[1,1,1];return t.attenuationColor=new ie().setRGB(o[0],o[1],o[2],It),Promise.all(s)}}class qb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_IOR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class $b{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_SPECULAR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];t.specularIntensity=r.specularFactor!==void 0?r.specularFactor:1,r.specularTexture!==void 0&&s.push(i.assignTexture(t,"specularIntensityMap",r.specularTexture));const o=r.specularColorFactor||[1,1,1];return t.specularColor=new ie().setRGB(o[0],o[1],o[2],It),r.specularColorTexture!==void 0&&s.push(i.assignTexture(t,"specularColorMap",r.specularColorTexture,ct)),Promise.all(s)}}class Kb{constructor(e){this.parser=e,this.name=Be.EXT_MATERIALS_BUMP}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];return t.bumpScale=r.bumpFactor!==void 0?r.bumpFactor:1,r.bumpTexture!==void 0&&s.push(i.assignTexture(t,"bumpMap",r.bumpTexture)),Promise.all(s)}}class Yb{constructor(e){this.parser=e,this.name=Be.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:yi}extendMaterialParams(e,t){const i=this.parser,n=i.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],r=n.extensions[this.name];return r.anisotropyStrength!==void 0&&(t.anisotropy=r.anisotropyStrength),r.anisotropyRotation!==void 0&&(t.anisotropyRotation=r.anisotropyRotation),r.anisotropyTexture!==void 0&&s.push(i.assignTexture(t,"anisotropyMap",r.anisotropyTexture)),Promise.all(s)}}class Jb{constructor(e){this.parser=e,this.name=Be.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,n=i.textures[e];if(!n.extensions||!n.extensions[this.name])return null;const s=n.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}}class Qb{constructor(e){this.parser=e,this.name=Be.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,n=i.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;const r=s.extensions[t],o=n.images[r.source];let c=i.textureLoader;if(o.uri){const l=i.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return i.loadTextureImage(e,r.source,c);if(n.extensionsRequired&&n.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Zb{constructor(e){this.parser=e,this.name=Be.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,n=i.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;const r=s.extensions[t],o=n.images[r.source];let c=i.textureLoader;if(o.uri){const l=i.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return i.loadTextureImage(e,r.source,c);if(n.extensionsRequired&&n.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class ex{constructor(e){this.name=Be.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const n=i.extensions[this.name],s=this.parser.getDependency("buffer",n.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const c=n.byteOffset||0,l=n.byteLength||0,h=n.count,d=n.byteStride,u=new Uint8Array(o,c,l);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(h,d,u,n.mode,n.filter).then(function(f){return f.buffer}):r.ready.then(function(){const f=new ArrayBuffer(h*d);return r.decodeGltfBuffer(new Uint8Array(f),h,d,u,n.mode,n.filter),f})})}else return null}}class tx{constructor(e){this.name=Be.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const n=t.meshes[i.mesh];for(const l of n.primitives)if(l.mode!==$t.TRIANGLES&&l.mode!==$t.TRIANGLE_STRIP&&l.mode!==$t.TRIANGLE_FAN&&l.mode!==void 0)return null;const r=i.extensions[this.name].attributes,o=[],c={};for(const l in r)o.push(this.parser.getDependency("accessor",r[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),d=h.isGroup?h.children:[h],u=l[0].count,f=[];for(const g of d){const b=new Ee,m=new T,p=new Nt,v=new T(1,1,1),_=new $o(g.geometry,g.material,u);for(let x=0;x<u;x++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,x),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,x),c.SCALE&&v.fromBufferAttribute(c.SCALE,x),_.setMatrixAt(x,b.compose(m,p,v));for(const x in c)if(x==="_COLOR_0"){const A=c[x];_.instanceColor=new qo(A.array,A.itemSize,A.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&g.geometry.setAttribute(x,c[x]);ot.prototype.copy.call(_,g),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Ld="glTF",Ls=12,vh={JSON:1313821514,BIN:5130562};class ix{constructor(e){this.name=Be.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ls),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ld)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const n=this.header.length-Ls,s=new DataView(e,Ls);let r=0;for(;r<n;){const o=s.getUint32(r,!0);r+=4;const c=s.getUint32(r,!0);if(r+=4,c===vh.JSON){const l=new Uint8Array(e,Ls+r,o);this.content=i.decode(l)}else if(c===vh.BIN){const l=Ls+r;this.body=e.slice(l,l+o)}r+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class nx{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Be.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,n=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,o={},c={},l={};for(const h in r){const d=el[h]||h.toLowerCase();o[d]=r[h]}for(const h in e.attributes){const d=el[h]||h.toLowerCase();if(r[h]!==void 0){const u=i.accessors[e.attributes[h]],f=Qn[u.componentType];l[d]=f.name,c[d]=u.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(d,u){n.decodeDracoFile(h,function(f){for(const g in f.attributes){const b=f.attributes[g],m=c[g];m!==void 0&&(b.normalized=m)}d(f)},o,l,It,u)})})}}class sx{constructor(){this.name=Be.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ax{constructor(){this.name=Be.KHR_MESH_QUANTIZATION}}class kd extends ia{constructor(e,t,i,n){super(e,t,i,n)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=e*n*3+n;for(let r=0;r!==n;r++)t[r]=i[s+r];return t}interpolate_(e,t,i,n){const s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=n-t,d=(i-t)/h,u=d*d,f=u*d,g=e*l,b=g-l,m=-2*f+3*u,p=f-u,v=1-m,_=p-u+d;for(let x=0;x!==o;x++){const A=r[b+x+o],w=r[b+x+c]*h,R=r[g+x+o],P=r[g+x]*h;s[x]=v*A+_*w+m*R+p*P}return s}}const rx=new Nt;class ox extends kd{interpolate_(e,t,i,n){const s=super.interpolate_(e,t,i,n);return rx.fromArray(s).normalize().toArray(s),s}}const $t={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Qn={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},bh={9728:kt,9729:Vt,9984:Ih,9985:Ba,9986:Is,9987:pi},xh={33071:nn,33648:$a,10497:yn},Qr={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},el={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},en={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},lx={CUBICSPLINE:void 0,LINEAR:$s,STEP:qs},Zr={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function cx(a){return a.DefaultMaterial===void 0&&(a.DefaultMaterial=new Ut({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Vi})),a.DefaultMaterial}function pn(a,e,t){for(const i in t.extensions)a[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Li(a,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(a.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function hx(a,e,t){let i=!1,n=!1,s=!1;for(let l=0,h=e.length;l<h;l++){const d=e[l];if(d.POSITION!==void 0&&(i=!0),d.NORMAL!==void 0&&(n=!0),d.COLOR_0!==void 0&&(s=!0),i&&n&&s)break}if(!i&&!n&&!s)return Promise.resolve(a);const r=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const d=e[l];if(i){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):a.attributes.position;r.push(u)}if(n){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):a.attributes.normal;o.push(u)}if(s){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):a.attributes.color;c.push(u)}}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],d=l[1],u=l[2];return i&&(a.morphAttributes.position=h),n&&(a.morphAttributes.normal=d),s&&(a.morphAttributes.color=u),a.morphTargetsRelative=!0,a})}function dx(a,e){if(a.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)a.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(a.morphTargetInfluences.length===t.length){a.morphTargetDictionary={};for(let i=0,n=t.length;i<n;i++)a.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function ux(a){let e;const t=a.extensions&&a.extensions[Be.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+eo(t.attributes):e=a.indices+":"+eo(a.attributes)+":"+a.mode,a.targets!==void 0)for(let i=0,n=a.targets.length;i<n;i++)e+=":"+eo(a.targets[i]);return e}function eo(a){let e="";const t=Object.keys(a).sort();for(let i=0,n=t.length;i<n;i++)e+=t[i]+":"+a[t[i]]+";";return e}function tl(a){switch(a){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function fx(a){return a.search(/\.jpe?g($|\?)/i)>0||a.search(/^data\:image\/jpeg/)===0?"image/jpeg":a.search(/\.webp($|\?)/i)>0||a.search(/^data\:image\/webp/)===0?"image/webp":a.search(/\.ktx2($|\?)/i)>0||a.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const px=new Ee;class mx{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Nb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,n=-1,s=!1,r=-1;if(typeof navigator<"u"){const o=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);n=i&&c?parseInt(c[1],10):-1,s=o.indexOf("Firefox")>-1,r=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&n<17||s&&r<98?this.textureLoader=new Hv(this.options.manager):this.textureLoader=new Xv(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new wd(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,n=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(r){const o={scene:r[0][n.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:n.asset,parser:i,userData:{}};return pn(s,o,n),Li(o,n),Promise.all(i._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n].joints;for(let o=0,c=r.length;o<c;o++)e[r[o]].isBone=!0}for(let n=0,s=e.length;n<s;n++){const r=e[n];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(i[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const n=i.clone(),s=(r,o)=>{const c=this.associations.get(r);c!=null&&this.associations.set(o,c);for(const[l,h]of r.children.entries())s(h,o.children[l])};return s(i,n),n.name+="_instance_"+e.uses[t]++,n}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const n=e(t[i]);if(n)return n}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let n=0;n<t.length;n++){const s=e(t[n]);s&&i.push(s)}return i}getDependency(e,t){const i=e+":"+t;let n=this.cache.get(i);if(!n){switch(e){case"scene":n=this.loadScene(t);break;case"node":n=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":n=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":n=this.loadAccessor(t);break;case"bufferView":n=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":n=this.loadBuffer(t);break;case"material":n=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":n=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":n=this.loadSkin(t);break;case"animation":n=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":n=this.loadCamera(t);break;default:if(n=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!n)throw new Error("Unknown type: "+e);break}this.cache.add(i,n)}return n}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,n=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(n.map(function(s,r){return i.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Be.KHR_BINARY_GLTF].body);const n=this.options;return new Promise(function(s,r){i.load(Hs.resolveURL(t.uri,n.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const n=t.byteLength||0,s=t.byteOffset||0;return i.slice(s,s+n)})}loadAccessor(e){const t=this,i=this.json,n=this.json.accessors[e];if(n.bufferView===void 0&&n.sparse===void 0){const r=Qr[n.type],o=Qn[n.componentType],c=n.normalized===!0,l=new o(n.count*r);return Promise.resolve(new vt(l,r,c))}const s=[];return n.bufferView!==void 0?s.push(this.getDependency("bufferView",n.bufferView)):s.push(null),n.sparse!==void 0&&(s.push(this.getDependency("bufferView",n.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",n.sparse.values.bufferView))),Promise.all(s).then(function(r){const o=r[0],c=Qr[n.type],l=Qn[n.componentType],h=l.BYTES_PER_ELEMENT,d=h*c,u=n.byteOffset||0,f=n.bufferView!==void 0?i.bufferViews[n.bufferView].byteStride:void 0,g=n.normalized===!0;let b,m;if(f&&f!==d){const p=Math.floor(u/f),v="InterleavedBuffer:"+n.bufferView+":"+n.componentType+":"+p+":"+n.count;let _=t.cache.get(v);_||(b=new l(o,p*f,n.count*f/h),_=new hd(b,f/h),t.cache.add(v,_)),m=new Ys(_,c,u%f/h,g)}else o===null?b=new l(n.count*c):b=new l(o,u,n.count*c),m=new vt(b,c,g);if(n.sparse!==void 0){const p=Qr.SCALAR,v=Qn[n.sparse.indices.componentType],_=n.sparse.indices.byteOffset||0,x=n.sparse.values.byteOffset||0,A=new v(r[1],_,n.sparse.count*p),w=new l(r[2],x,n.sparse.count*c);o!==null&&(m=new vt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,P=A.length;R<P;R++){const M=A[R];if(m.setX(M,w[R*c]),c>=2&&m.setY(M,w[R*c+1]),c>=3&&m.setZ(M,w[R*c+2]),c>=4&&m.setW(M,w[R*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,i=this.options,s=t.textures[e].source,r=t.images[s];let o=this.textureLoader;if(r.uri){const c=i.manager.getHandler(r.uri);c!==null&&(o=c)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,i){const n=this,s=this.json,r=s.textures[e],o=s.images[t],c=(o.uri||o.bufferView)+":"+r.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,i).then(function(h){h.flipY=!1,h.name=r.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(s.samplers||{})[r.sampler]||{};return h.magFilter=bh[u.magFilter]||Vt,h.minFilter=bh[u.minFilter]||pi,h.wrapS=xh[u.wrapS]||yn,h.wrapT=xh[u.wrapT]||yn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==kt&&h.minFilter!==Vt,n.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const i=this,n=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const r=n.images[e],o=self.URL||self.webkitURL;let c=r.uri||"",l=!1;if(r.bufferView!==void 0)c=i.getDependency("bufferView",r.bufferView).then(function(d){l=!0;const u=new Blob([d],{type:r.mimeType});return c=o.createObjectURL(u),c});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(d){return new Promise(function(u,f){let g=u;t.isImageBitmapLoader===!0&&(g=function(b){const m=new bt(b);m.needsUpdate=!0,u(m)}),t.load(Hs.resolveURL(d,s.path),g,void 0,f)})}).then(function(d){return l===!0&&o.revokeObjectURL(c),Li(d,r),d.userData.mimeType=r.mimeType||fx(r.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=h,h}assignTexture(e,t,i,n){const s=this;return this.getDependency("texture",i.index).then(function(r){if(!r)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(r=r.clone(),r.channel=i.texCoord),s.extensions[Be.KHR_TEXTURE_TRANSFORM]){const o=i.extensions!==void 0?i.extensions[Be.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=s.associations.get(r);r=s.extensions[Be.KHR_TEXTURE_TRANSFORM].extendTexture(r,o),s.associations.set(r,c)}}return n!==void 0&&(r.colorSpace=n),e[t]=r,r})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const n=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+i.uuid;let c=this.cache.get(o);c||(c=new md,li.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,c.sizeAttenuation=!1,this.cache.add(o,c)),i=c}else if(e.isLine){const o="LineBasicMaterial:"+i.uuid;let c=this.cache.get(o);c||(c=new pd,li.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,this.cache.add(o,c)),i=c}if(n||s||r){let o="ClonedMaterial:"+i.uuid+":";n&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),r&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=i.clone(),s&&(c.vertexColors=!0),r&&(c.flatShading=!0),n&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(i))),i=c}e.material=i}getMaterialType(){return Ut}loadMaterial(e){const t=this,i=this.json,n=this.extensions,s=i.materials[e];let r;const o={},c=s.extensions||{},l=[];if(c[Be.KHR_MATERIALS_UNLIT]){const d=n[Be.KHR_MATERIALS_UNLIT];r=d.getMaterialType(),l.push(d.extendParams(o,s,t))}else{const d=s.pbrMetallicRoughness||{};if(o.color=new ie(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],It),o.opacity=u[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",d.baseColorTexture,ct)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),r=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=Gt);const h=s.alphaMode||Zr.OPAQUE;if(h===Zr.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Zr.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==Et&&(l.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Z(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;o.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&r!==Et&&(l.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==Et){const d=s.emissiveFactor;o.emissive=new ie().setRGB(d[0],d[1],d[2],It)}return s.emissiveTexture!==void 0&&r!==Et&&l.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,ct)),Promise.all(l).then(function(){const d=new r(o);return s.name&&(d.name=s.name),Li(d,s),t.associations.set(d,{materials:e}),s.extensions&&pn(n,d,s),d})}createUniqueName(e){const t=Je.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,n=this.primitiveCache;function s(o){return i[Be.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return _h(c,o,t)})}const r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=ux(l),d=n[h];if(d)r.push(d.promise);else{let u;l.extensions&&l.extensions[Be.KHR_DRACO_MESH_COMPRESSION]?u=s(l):u=_h(new ut,l,t),n[h]={primitive:l,promise:u},r.push(u)}}return Promise.all(r)}loadMesh(e){const t=this,i=this.json,n=this.extensions,s=i.meshes[e],r=s.primitives,o=[];for(let c=0,l=r.length;c<l;c++){const h=r[c].material===void 0?cx(this.cache):this.getDependency("material",r[c].material);o.push(h)}return o.push(t.loadGeometries(r)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],d=[];for(let f=0,g=h.length;f<g;f++){const b=h[f],m=r[f];let p;const v=l[f];if(m.mode===$t.TRIANGLES||m.mode===$t.TRIANGLE_STRIP||m.mode===$t.TRIANGLE_FAN||m.mode===void 0)p=s.isSkinnedMesh===!0?new dv(b,v):new Ue(b,v),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===$t.TRIANGLE_STRIP?p.geometry=gh(p.geometry,Xh):m.mode===$t.TRIANGLE_FAN&&(p.geometry=gh(p.geometry,Vo));else if(m.mode===$t.LINES)p=new pv(b,v);else if(m.mode===$t.LINE_STRIP)p=new xl(b,v);else if(m.mode===$t.LINE_LOOP)p=new mv(b,v);else if(m.mode===$t.POINTS)p=new gd(b,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&dx(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),Li(p,s),m.extensions&&pn(n,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return s.extensions&&pn(n,d[0],s),d[0];const u=new St;s.extensions&&pn(n,u,s),t.associations.set(u,{meshes:e});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);return u})}loadCamera(e){let t;const i=this.json.cameras[e],n=i[i.type];if(!n){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Dt(Yu.radToDeg(n.yfov),n.aspectRatio||1,n.znear||1,n.zfar||2e6):i.type==="orthographic"&&(t=new lr(-n.xmag,n.xmag,n.ymag,-n.ymag,n.znear,n.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Li(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let n=0,s=t.joints.length;n<s;n++)i.push(this._loadNodeShallow(t.joints[n]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(n){const s=n.pop(),r=n,o=[],c=[];for(let l=0,h=r.length;l<h;l++){const d=r[l];if(d){o.push(d);const u=new Ee;s!==null&&u.fromArray(s.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new bl(o,c)})}loadAnimation(e){const t=this.json,i=this,n=t.animations[e],s=n.name?n.name:"animation_"+e,r=[],o=[],c=[],l=[],h=[];for(let d=0,u=n.channels.length;d<u;d++){const f=n.channels[d],g=n.samplers[f.sampler],b=f.target,m=b.node,p=n.parameters!==void 0?n.parameters[g.input]:g.input,v=n.parameters!==void 0?n.parameters[g.output]:g.output;b.node!==void 0&&(r.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",v)),l.push(g),h.push(b))}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(d){const u=d[0],f=d[1],g=d[2],b=d[3],m=d[4],p=[];for(let v=0,_=u.length;v<_;v++){const x=u[v],A=f[v],w=g[v],R=b[v],P=m[v];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const M=i._createAnimationTracks(x,A,w,R,P);if(M)for(let y=0;y<M.length;y++)p.push(M[y])}return new Yo(s,void 0,p)})}createNodeMesh(e){const t=this.json,i=this,n=t.nodes[e];return n.mesh===void 0?null:i.getDependency("mesh",n.mesh).then(function(s){const r=i._getNodeRef(i.meshCache,n.mesh,s);return n.weights!==void 0&&r.traverse(function(o){if(o.isMesh)for(let c=0,l=n.weights.length;c<l;c++)o.morphTargetInfluences[c]=n.weights[c]}),r})}loadNode(e){const t=this.json,i=this,n=t.nodes[e],s=i._loadNodeShallow(e),r=[],o=n.children||[];for(let l=0,h=o.length;l<h;l++)r.push(i.getDependency("node",o[l]));const c=n.skin===void 0?Promise.resolve(null):i.getDependency("skin",n.skin);return Promise.all([s,Promise.all(r),c]).then(function(l){const h=l[0],d=l[1],u=l[2];u!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(u,px)});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);return h})}_loadNodeShallow(e){const t=this.json,i=this.extensions,n=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],r=s.name?n.createUniqueName(s.name):"",o=[],c=n._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),s.camera!==void 0&&o.push(n.getDependency("camera",s.camera).then(function(l){return n._getNodeRef(n.cameraCache,s.camera,l)})),n._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(s.isBone===!0?h=new ud:l.length>1?h=new St:l.length===1?h=l[0]:h=new ot,h!==l[0])for(let d=0,u=l.length;d<u;d++)h.add(l[d]);if(s.name&&(h.userData.name=s.name,h.name=r),Li(h,s),s.extensions&&pn(i,h,s),s.matrix!==void 0){const d=new Ee;d.fromArray(s.matrix),h.applyMatrix4(d)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return n.associations.has(h)||n.associations.set(h,{}),n.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],n=this,s=new St;i.name&&(s.name=n.createUniqueName(i.name)),Li(s,i),i.extensions&&pn(t,s,i);const r=i.nodes||[],o=[];for(let c=0,l=r.length;c<l;c++)o.push(n.getDependency("node",r[c]));return Promise.all(o).then(function(c){for(let h=0,d=c.length;h<d;h++)s.add(c[h]);const l=h=>{const d=new Map;for(const[u,f]of n.associations)(u instanceof li||u instanceof bt)&&d.set(u,f);return h.traverse(u=>{const f=n.associations.get(u);f!=null&&d.set(u,f)}),d};return n.associations=l(s),s})}_createAnimationTracks(e,t,i,n,s){const r=[],o=e.name?e.name:e.uuid,c=[];en[s.path]===en.weights?e.traverse(function(u){u.morphTargetInfluences&&c.push(u.name?u.name:u.uuid)}):c.push(o);let l;switch(en[s.path]){case en.weights:l=cs;break;case en.rotation:l=hs;break;case en.position:case en.scale:l=ds;break;default:switch(i.itemSize){case 1:l=cs;break;case 2:case 3:default:l=ds;break}break}const h=n.interpolation!==void 0?lx[n.interpolation]:$s,d=this._getArrayFromAccessor(i);for(let u=0,f=c.length;u<f;u++){const g=new l(c[u]+"."+en[s.path],t.array,d,h);n.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),r.push(g)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=tl(t.constructor),n=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)n[s]=t[s]*i;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const n=this instanceof hs?ox:kd;return new n(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function gx(a,e,t){const i=e.attributes,n=new xi;if(i.POSITION!==void 0){const o=t.json.accessors[i.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(n.set(new T(c[0],c[1],c[2]),new T(l[0],l[1],l[2])),o.normalized){const h=tl(Qn[o.componentType]);n.min.multiplyScalar(h),n.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new T,c=new T;for(let l=0,h=s.length;l<h;l++){const d=s[l];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],f=u.min,g=u.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),u.normalized){const b=tl(Qn[u.componentType]);c.multiplyScalar(b)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}n.expandByVector(o)}a.boundingBox=n;const r=new ci;n.getCenter(r.center),r.radius=n.min.distanceTo(n.max)/2,a.boundingSphere=r}function _h(a,e,t){const i=e.attributes,n=[];function s(r,o){return t.getDependency("accessor",r).then(function(c){a.setAttribute(o,c)})}for(const r in i){const o=el[r]||r.toLowerCase();o in a.attributes||n.push(s(i[r],o))}if(e.indices!==void 0&&!a.index){const r=t.getDependency("accessor",e.indices).then(function(o){a.setIndex(o)});n.push(r)}return He.workingColorSpace!==It&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${He.workingColorSpace}" not supported.`),Li(a,e),gx(a,e,t),Promise.all(n).then(function(){return e.targets!==void 0?hx(a,e.targets,t):a})}var vx=(function(){var a="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),i=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var n=WebAssembly.validate(t)?e:a,s,r=WebAssembly.instantiate(o(n),{}).then(function(p){s=p.instance,s.exports.__wasm_call_ctors()});function o(p){for(var v=new Uint8Array(p.length),_=0;_<p.length;++_){var x=p.charCodeAt(_);v[_]=x>96?x-97:x>64?x-39:x+4}for(var A=0,_=0;_<p.length;++_)v[A++]=v[_]<60?i[v[_]]:(v[_]-60)*64+v[++_];return v.buffer.slice(0,A)}function c(p,v,_,x,A,w){var R=s.exports.sbrk,P=_+3&-4,M=R(P*x),y=R(A.length),D=new Uint8Array(s.exports.memory.buffer);D.set(A,y);var U=p(M,_,x,y,A.length);if(U==0&&w&&w(M,P,x),v.set(D.subarray(M,M+_*x)),R(M-R(0)),U!=0)throw new Error("Malformed buffer data: "+U)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},d=[],u=0;function f(p){var v={object:new Worker(p),pending:0,requests:{}};return v.object.onmessage=function(_){var x=_.data;v.pending-=x.count,v.requests[x.id][x.action](x.value),delete v.requests[x.id]},v}function g(p){for(var v="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(o(n))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+m.toString(),_=new Blob([v],{type:"text/javascript"}),x=URL.createObjectURL(_),A=0;A<p;++A)d[A]=f(x);URL.revokeObjectURL(x)}function b(p,v,_,x,A){for(var w=d[0],R=1;R<d.length;++R)d[R].pending<w.pending&&(w=d[R]);return new Promise(function(P,M){var y=new Uint8Array(_),D=u++;w.pending+=p,w.requests[D]={resolve:P,reject:M},w.object.postMessage({id:D,count:p,size:v,source:y,mode:x,filter:A},[y.buffer])})}function m(p){r.then(function(){var v=p.data;try{var _=new Uint8Array(v.count*v.size);c(s.exports[v.mode],_,v.count,v.size,v.source,s.exports[v.filter]),self.postMessage({id:v.id,count:v.count,action:"resolve",value:_},[_.buffer])}catch(x){self.postMessage({id:v.id,count:v.count,action:"reject",value:x})}})}return{ready:r,supported:!0,useWorkers:function(p){g(p)},decodeVertexBuffer:function(p,v,_,x,A){c(s.exports.meshopt_decodeVertexBuffer,p,v,_,x,s.exports[l[A]])},decodeIndexBuffer:function(p,v,_,x){c(s.exports.meshopt_decodeIndexBuffer,p,v,_,x)},decodeIndexSequence:function(p,v,_,x){c(s.exports.meshopt_decodeIndexSequence,p,v,_,x)},decodeGltfBuffer:function(p,v,_,x,A,w){c(s.exports[h[A]],p,v,_,x,s.exports[l[w]])},decodeGltfBufferAsync:function(p,v,_,x,A){return d.length>0?b(p,v,_,h[x],l[A]):r.then(function(){var w=new Uint8Array(p*v);return c(s.exports[h[x]],w,p,v,_,s.exports[l[A]]),w})}}})();function bx(a){const e=new Map,t=new Map,i=a.clone();return Id(a,i,function(n,s){e.set(s,n),t.set(n,s)}),i.traverse(function(n){if(!n.isSkinnedMesh)return;const s=n,r=e.get(n),o=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=o.map(function(c){return t.get(c)}),s.bind(s.skeleton,s.bindMatrix)}),i}function Id(a,e,t){t(a,e);for(let i=0;i<a.children.length;i++)Id(a.children[i],e.children[i],t)}const yh={hero:{height:1.9,skinned:!0,emis:{lo:.55,hi:.9,strength:2.6,hue:1}},skeleton:{height:1.85,skinned:!0,emis:{lo:.5,hi:.85,strength:3,hue:2}},cultist:{height:2,skinned:!0,emis:{lo:.45,hi:.85,strength:3,hue:2}},brute:{height:2.7,skinned:!0,emis:{lo:.9,hi:1,strength:0,hue:0}},boss:{height:5.4,skinned:!0,emis:{lo:.45,hi:.8,strength:4.5,hue:1}},wraith:{height:2.1,emis:{lo:.45,hi:.85,strength:2.2,hue:2}},chest:{height:1.05},brazier:{height:1.55,emis:{lo:.45,hi:.8,strength:4,hue:1}},crystal:{height:2,emis:{lo:.35,hi:.8,strength:2.4,hue:2}},pillar:{height:4},shrine:{height:1.5,emis:{lo:.5,hi:.85,strength:3,hue:1}},portal:{height:4.8,emis:{lo:.5,hi:.85,strength:3.5,hue:1}},potion:{height:.6,emis:{lo:.35,hi:.8,strength:2.5,hue:1}},skulls:{height:.75},rubble:{height:.6},barrel:{height:1.15,rotZ:Math.PI/2},merchant:{height:3.2,emis:{lo:.5,hi:.85,strength:3,hue:0}},sword:{height:1.25,rotX:Math.PI,emis:{lo:.5,hi:.85,strength:3.5,hue:1}},dagger:{height:.82,rotX:Math.PI,emis:{lo:.5,hi:.85,strength:3.5,hue:1}},maul:{height:1.75,emis:{lo:.45,hi:.8,strength:4,hue:1}}},xx=new Set(["merchant"]);class _x{constructor(){this.loader=new Ub,this.loader.setMeshoptDecoder(vx),this.templates=new Map,this.manifest=null}async load(e){const t=Object.keys(yh);let i=0;await Promise.all(t.map(async n=>{try{const s=await this.loader.loadAsync(`/emberdeep/assets/models/${n}.glb`);this.templates.set(n,this.normalize(n,s))}catch(s){xx.has(n)||console.warn("[assets] missing model",n,s?.message||s)}i++,e&&e(i/t.length)}))}normalize(e,t){const i=yh[e],n=new St;n.name=e;const s=t.scene;n.add(s),i.rotZ&&(s.rotation.z=i.rotZ),i.rotX&&(s.rotation.x=i.rotX),n.updateMatrixWorld(!0);const r=new xi().setFromObject(s),o=r.getSize(new T),c=r.getCenter(new T),l=i.height/Math.max(1e-4,o.y);s.scale.multiplyScalar(l),s.position.set(-c.x*l,-r.min.y*l,-c.z*l);let h=0;n.traverse(f=>{if(f.isMesh){h++,f.geometry.userData.shared=!0,f.castShadow=!0,f.receiveShadow=!0,f.frustumCulled=!f.isSkinnedMesh;const g=Array.isArray(f.material)?f.material:[f.material];for(const b of g)b.map&&(b.map.anisotropy=4),b.envMapIntensity=.8,b.metalnessMap&&(b.metalness=Math.min(b.metalness,.85))}});const d=Math.max(o.x,o.z)*l,u=(t.animations||[]).map(f=>{const g=f.clone();return g.tracks=g.tracks.filter(b=>{if(b.name.endsWith(".position")){const m=b.name.split(".")[0].toLowerCase();if(m.includes("hips")||m.includes("root")||m.includes("pelvis")){const p=b.values,v=[0,0,0];for(let A=0;A<p.length;A+=3)for(let w=0;w<3;w++)v[w]+=Math.abs(p[A+w]);const _=v.indexOf(Math.max(...v)),x=[p[0],p[1],p[2]];for(let A=0;A<p.length;A+=3)for(let w=0;w<3;w++)w!==_&&(p[A+w]=x[w])}}return!0}),g});return{name:e,root:n,clips:u,skinned:!!i.skinned,footprint:d,height:i.height,def:i,meshCount:h}}has(e){return this.templates.has(e)}instance(e,{uniqueMaterials:t=!1}={}){const i=this.templates.get(e);if(!i)return null;const n=i.skinned?bx(i.root):i.root.clone(!0);return(t||i.skinned)&&n.traverse(s=>{s.isMesh&&(s.material=Array.isArray(s.material)?s.material.map(r=>r.clone()):s.material.clone())}),{root:n,clips:i.clips,template:i}}clipNames(e){return(this.templates.get(e)?.clips||[]).map(t=>t.name)}}const qt=0,Ht=1,ni=2;function yx(a,e,t){return a.x-t<e.x+e.w&&a.x+a.w+t>e.x&&a.y-t<e.y+e.h&&a.y+a.h+t>e.y}function Mx(a,{roomCount:e=8,boss:t=!1,lava:i=!1}={}){const r=new Uint8Array(5184),o=[],c=(v,_,x)=>{v>1&&_>1&&v<70&&_<70&&(r[_*72+v]=x)},l=(v,_)=>v<0||_<0||v>=72||_>=72?qt:r[_*72+v];if(t){const v={x:30,y:54,w:10,h:8},_={x:22,y:14,w:26,h:24};o.push(v,_)}else{let v=0;for(;o.length<e&&v<2e3;){v++;const _=a.chance(.25),x=_?a.int(11,15):a.int(7,11),A=_?a.int(10,13):a.int(7,10),w={x:a.int(4,72-x-5),y:a.int(4,72-A-5),w:x,h:A};o.some(R=>yx(R,w,4))||o.push(w)}}for(const v of o){v.cx=v.x+Math.floor(v.w/2),v.cy=v.y+Math.floor(v.h/2);for(let _=v.y;_<v.y+v.h;_++)for(let x=v.x;x<v.x+v.w;x++)c(x,_,Ht)}const h=[],d=o.length,u=new Array(d).fill(!1);u[0]=!0;const f=(v,_)=>Math.abs(v.cx-_.cx)+Math.abs(v.cy-_.cy);for(let v=1;v<d;v++){let _=null;for(let x=0;x<d;x++)if(u[x]){for(let A=0;A<d;A++)if(!u[A]){const w=f(o[x],o[A]);(!_||w<_.d)&&(_={i:x,j:A,d:w})}}u[_.j]=!0,h.push([_.i,_.j])}if(!t){const v=[];for(let x=0;x<d;x++)for(let A=x+1;A<d;A++)h.some(([w,R])=>w===x&&R===A||w===A&&R===x)||v.push([x,A,f(o[x],o[A])]);v.sort((x,A)=>x[2]-A[2]);const _=Math.max(1,Math.floor(d/4));for(let x=0;x<Math.min(_,v.length);x++)a.chance(.7)&&h.push([v[x][0],v[x][1]])}const g=new Set,b=(v,_)=>{for(let x=0;x<2;x++)for(let A=0;A<2;A++)l(v+A,_+x)!==Ht&&(c(v+A,_+x,Ht),g.add((_+x)*72+v+A))};for(const[v,_]of h){const x=o[v],A=o[_];let w=x.cx,R=x.cy;const P=a.chance(.5),M=()=>{for(;w!==A.cx;)b(w,R),w+=Math.sign(A.cx-w)},y=()=>{for(;R!==A.cy;)b(w,R),R+=Math.sign(A.cy-R)};P?(M(),y()):(y(),M()),b(w,R)}const m=o.map(()=>[]);for(const[v,_]of h)m[v].push(_),m[_].push(v);const p=new Int16Array(5184).fill(-1);o.forEach((v,_)=>{v.id=_;for(let x=v.y;x<v.y+v.h;x++)for(let A=v.x;A<v.x+v.w;A++)p[x*72+A]=_});for(const v of o){v.doors=[];for(let _=v.x-1;_<=v.x+v.w;_++)for(const x of[v.y-1,v.y+v.h])l(_,x)===Ht&&p[x*72+_]<0&&v.doors.push({x:_,y:x,side:x<v.y?"n":"s"});for(let _=v.y;_<v.y+v.h;_++)for(const x of[v.x-1,v.x+v.w])l(x,_)===Ht&&p[_*72+x]<0&&v.doors.push({x,y:_,side:x<v.x?"w":"e"})}if(t)o[0].type="start",o[1].type="boss";else{const v=a.int(0,d-1),_=new Array(d).fill(-1);_[v]=0;const x=[v];for(;x.length;){const y=x.shift();for(const D of m[y])_[D]<0&&(_[D]=_[y]+1,x.push(D))}let A=v;for(let y=0;y<d;y++)(_[y]>_[A]||_[y]===_[A]&&o[y].w*o[y].h>o[A].w*o[A].h)&&(A=y);o.forEach(y=>y.type="combat"),o[v].type="start",o[A].type="exit";const w=o.filter(y=>y.type==="combat"),R=w.filter(y=>m[y.id].length===1),P=R.length?a.pick(R):a.pick(w);P&&(P.type="treasure");const M=o.filter(y=>y.type==="combat");M.length>2&&(M.sort((y,D)=>Math.abs(_[y.id]-_[A]/2)-Math.abs(_[D.id]-_[A]/2)),M[0].type="shrine"),o.forEach(y=>y.depth=_[y.id])}if(i)for(const v of o){if(v.type!=="combat"&&v.type!=="exit"&&v.type!=="boss")continue;const _=v.type==="boss"?0:a.int(1,2);for(let x=0;x<_;x++){const A=a.int(2,3),w=a.int(2,3),R=a.int(v.x+2,v.x+v.w-A-2),P=a.int(v.y+2,v.y+v.h-w-2);if(!(Math.abs(R+A/2-v.cx)<2&&Math.abs(P+w/2-v.cy)<2))for(let M=P;M<P+w;M++)for(let y=R;y<R+A;y++)a.chance(.92)&&(r[M*72+y]=ni)}}if(t){const v=o[1];for(let _=v.y;_<v.y+v.h;_++)for(let x=v.x;x<v.x+v.w;x++){const A=(x-(v.x+v.w/2-.5))/(v.w/2),w=(_-(v.y+v.h/2-.5))/(v.h/2);Math.hypot(A,w)>1.08&&(r[_*72+x]=ni)}}return{W:72,H:72,tiles:r,rooms:o,roomMap:p,edges:h,adj:m,corridorCells:g}}const qa={crypt:{id:"crypt",name:"The Ossuary",subtitle:"Where the first flames died",fog:460813,fogDensity:.034,ambient:2766160,ambientIntensity:.3,hemiSky:3820152,hemiGround:1313802,keyLight:9086719,keyIntensity:.65,floorTint:10132134,wallTint:9211033,emissive:0,emissiveIntensity:0,torchColor:16747066,accent:[.5,.7,1.6],moteColor:[.45,.55,.9],grade:{lift:[.01,.012,.03],gain:[.98,.98,1.02],sat:1},enemies:["skeleton","skeleton","wraith","cultist"],deco:["bones","bones","barrel","pillar"],lava:!1,crystals:!1},crystal:{id:"crystal",name:"The Glimmering Hollows",subtitle:"Light that remembers the stars",fog:656916,fogDensity:.03,ambient:3811936,ambientIntensity:.32,hemiSky:5913232,hemiGround:924196,keyLight:10521343,keyIntensity:.5,floorTint:9077926,wallTint:8157334,emissive:3844351,emissiveIntensity:1.2,torchColor:7002367,accent:[.6,1.2,2.4],moteColor:[.6,.8,1.6],grade:{lift:[.015,.008,.035],gain:[.98,.97,1.04],sat:1.12},enemies:["cultist","wraith","skeleton","brute"],deco:["crystal","crystal","bones","pillar"],lava:!1,crystals:!0},molten:{id:"molten",name:"The Molten Depths",subtitle:"The world-forge still burns",fog:1181188,fogDensity:.03,ambient:5252376,ambientIntensity:.32,hemiSky:8403488,hemiGround:2099205,keyLight:16751210,keyIntensity:.45,floorTint:8022630,wallTint:6970456,emissive:16730640,emissiveIntensity:2.2,torchColor:16738848,accent:[3,1,.25],moteColor:[2.5,.9,.25],grade:{lift:[.03,.01,0],gain:[1.03,.97,.92],sat:1.1},enemies:["brute","cultist","skeleton","wraith"],deco:["barrel","bones","pillar"],lava:!0,crystals:!1},throne:{id:"throne",name:"The Cinder Throne",subtitle:"Vorthak waits",fog:1443075,fogDensity:.022,ambient:6301722,ambientIntensity:.36,hemiSky:9452064,hemiGround:2426885,keyLight:16747098,keyIntensity:.5,floorTint:6969944,wallTint:5917770,emissive:16726536,emissiveIntensity:2.4,torchColor:16734744,accent:[3.5,1,.2],moteColor:[3,1,.25],grade:{lift:[.035,.01,0],gain:[1.05,.96,.9],sat:1.12},enemies:["skeleton","cultist"],deco:["pillar"],lava:!0,crystals:!1}},Zn=[{biome:"crypt",size:7},{biome:"crypt",size:8},{biome:"crystal",size:8},{biome:"crystal",size:9},{biome:"molten",size:9},{biome:"molten",size:10},{biome:"throne",size:0,boss:!0}];function ki(a){const e=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let t="";for(const[i,n]of e)for(;a>=i;)t+=n,a-=i;return t||"0"}const Sx=Zn.length,Mh=[2,5];function Fd(a){if(a<Zn.length)return{...Zn[a],champion:Mh.includes(a),abyss:0};const e=a-Zn.length,t=e%7;return t===6?{biome:"throne",size:0,boss:!0,abyss:e+1,champion:!1}:{biome:["crypt","crystal","molten"][Math.floor(t/2)%3],size:9+e%2,abyss:e+1,champion:Mh.includes(t)}}function tr(a){return a<Zn.length?ki(a+1):`Abyss ${a-Zn.length+1}`}const ge=2,to=3,Sh=.85,Wn=-.42;let mn=null;function il(){if(!mn){mn={floor:yb(17,1024),wall:Mb(23,512),rock:Sb(5,256)};for(const a of[mn.floor.map,mn.floor.normalMap,mn.floor.roughnessMap,mn.floor.emissiveMap])a.repeat.set(1,1)}return mn}const wx=`
  uniform float uTime; varying vec3 vW;
  float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
  float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<5;i++){ s+=a*n2(p); p*=2.03; a*=0.5; } return s; }
  void main(){
    vec2 p = vW.xz * 0.45;
    float t = uTime;
    float n = fbm(p + vec2(t*0.04, -t*0.03));
    float m = fbm(p * 1.7 + n * 2.0 - vec2(t*0.07, t*0.05));
    float heat = pow(m, 1.6);
    vec3 col = mix(vec3(0.6, 0.05, 0.0), vec3(3.6, 1.1, 0.12), smoothstep(0.25, 0.75, heat));
    col += vec3(6.0, 3.2, 0.9) * pow(smoothstep(0.55, 0.95, heat), 3.0);
    float crust = smoothstep(0.52, 0.62, n) * (1.0 - smoothstep(0.62, 0.75, m));
    col = mix(col, vec3(0.06, 0.02, 0.015), crust * 0.85);
    gl_FragColor = vec4(col, 1.0);
  }
`,wh="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",Tx=`
  uniform float uTime; uniform vec3 uColor; uniform float uOpacity; varying vec3 vW;
  float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
  float fbm(vec2 p){ float s=0.0, a=0.5; for(int i=0;i<4;i++){ s+=a*n2(p); p*=2.1; a*=0.5; } return s; }
  void main(){
    vec2 p = vW.xz * 0.12;
    float n = fbm(p + vec2(uTime * 0.03, uTime * 0.02));
    float m = fbm(p * 2.3 - vec2(uTime * 0.05, -uTime * 0.02) + n);
    float a = smoothstep(0.35, 0.85, n * 0.6 + m * 0.6) * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`,Ax=`
  uniform vec3 uColor; uniform float uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main(){
    float f = abs(dot(normalize(vN), normalize(vV)));
    float edge = pow(f, 1.8);
    float fadeY = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
    float flick = 0.85 + 0.15 * sin(uTime * 1.3 + vUv.x * 12.0);
    float a = edge * fadeY * flick * 0.22;
    gl_FragColor = vec4(uColor * a, a);
  }
`,Ex=`
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main(){ vUv = uv; vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }
`;class Rx{constructor(e,t,i){this.game=e,this.floorIndex=t,this.def=Fd(t),this.biome=qa[this.def.biome],this.rng=i,this.group=new St,this.group.name="level",e.scene.add(this.group);const n=Mx(i,{roomCount:this.def.size,boss:!!this.def.boss,lava:this.biome.lava});Object.assign(this,{W:n.W,H:n.H,tiles:n.tiles,rooms:n.rooms,roomMap:n.roomMap}),this.solid=new Uint8Array(this.W*this.H),this.sightBlock=new Uint8Array(this.W*this.H);for(let s=0;s<this.tiles.length;s++)this.solid[s]=this.tiles[s]===Ht?0:1,this.sightBlock[s]=this.tiles[s]===qt?1:0;this.colliders=[],this.lightSources=[],this.fires=[],this.interactables=[],this.breakables=[],this.traps=[],this.animated=[],this.explored=new Uint8Array(this.W*this.H),this.flow=new Int16Array(this.W*this.H).fill(-1),this.flowFrom=-1,this.time=0;for(const s of this.rooms)s.state=s.type==="combat"||s.type==="exit"||s.type==="boss"?"idle":"cleared",s.gates=null,s.center=new T((s.x+s.w/2)*ge,0,(s.y+s.h/2)*ge);this.buildFloor(),this.buildWalls(),this.buildLava(),this.buildAtmosphere(),this.decorate(),this.buildGates(),this.buildLightPool(),this.buildFireHalos()}buildFireHalos(){const e=this.game.fx.glowTex;for(const t of this.fires){if(t.scale<.1)continue;const i=t.color,n=new bi({map:e,color:new ie(i[0]*.35,i[1]*.35,i[2]*.35),blending:Mt,depthWrite:!1,transparent:!0}),s=new ji(n);s.position.copy(t.pos).add(new T(0,.25*t.scale,0));const r=2.6*t.scale;s.scale.setScalar(r),s.renderOrder=7,this.group.add(s);const o=Math.random()*10;this.animated.push(c=>{s.scale.setScalar(r*(.9+.1*Math.sin(c*11+o)*Math.sin(c*6.3+o)))})}}idx(e,t){return t*this.W+e}tileAt(e,t){return e<0||t<0||e>=this.W||t>=this.H?qt:this.tiles[t*this.W+e]}toTile(e){return Math.floor(e/ge)}center(e,t){return new T((e+.5)*ge,0,(t+.5)*ge)}isSolid(e,t){return e<0||t<0||e>=this.W||t>=this.H?!0:this.solid[t*this.W+e]===1}isWall(e,t){return this.tileAt(e,t)===qt&&this.nearOpen(e,t)}nearOpen(e,t){for(let i=-1;i<=1;i++)for(let n=-1;n<=1;n++)if(this.tileAt(e+n,t+i)!==qt)return!0;return!1}roomAtWorld(e,t){const i=this.toTile(e),n=this.toTile(t);if(i<0||n<0||i>=this.W||n>=this.H)return null;const s=this.roomMap[n*this.W+i];return s>=0?this.rooms[s]:null}randomFloorInRoom(e,t=Math.random,i=1,n=null,s=0){for(let r=0;r<60;r++){const o=e.x+i+Math.floor(t()*Math.max(1,e.w-i*2)),c=e.y+i+Math.floor(t()*Math.max(1,e.h-i*2));if(this.isSolid(o,c))continue;const l=this.center(o,c);if(l.x+=(t()-.5)*.8,l.z+=(t()-.5)*.8,!(n&&Math.hypot(l.x-n.x,l.z-n.z)<s)&&!this.colliders.some(h=>Math.hypot(h.x-l.x,h.z-l.z)<h.r+.8))return l}return e.center.clone()}wallHeight(e,t){if(this.tileAt(e,t)!==qt)return 0;const i=(s,r)=>this.tileAt(s,r)!==qt;return i(e,t-1)||!(i(e-1,t)||i(e+1,t))&&(i(e-1,t-1)||i(e+1,t-1))&&!i(e,t+1)?Sh:to}aoAt(e,t){const i=Math.floor(e/ge),n=Math.floor(t/ge);let s=0;for(let r=-2;r<=2;r++)for(let o=-2;o<=2;o++){if(this.tileAt(i+o,n+r)!==qt)continue;const l=(i+o)*ge,h=(n+r)*ge,d=Math.max(l,Math.min(e,l+ge)),u=Math.max(h,Math.min(t,h+ge)),f=Math.hypot(e-d,t-u),g=this.wallHeight(i+o,n+r)/to;s+=Math.max(0,1-f/1.7)*.42*(.4+.6*g)}return Math.max(.28,1-s)}buildFloor(){const e=il(),t=(f,g)=>{const b=(m,p)=>Math.sin(m*.31+Math.sin(p*.17)*2.1)*Math.sin(p*.27+Math.sin(m*.13)*1.7);return .5+.5*(b(f,g)*.6+b(f*2.3+5,g*2.1-3)*.4)},i=[],n=[],s=[],r=[],o=[],c=2;let l=0;for(let f=0;f<this.H;f++)for(let g=0;g<this.W;g++)if(this.tileAt(g,f)===Ht)for(let b=0;b<c;b++)for(let m=0;m<c;m++){for(const[p,v]of[[0,0],[1,0],[0,1],[1,1]]){const _=(g+(m+p)/c)*ge,x=(f+(b+v)/c)*ge;i.push(_,0,x),r.push(0,1,0),n.push(_/9,-x/9);const A=this.aoAt(_,x)*(.82+.3*t(_,x));s.push(A,A*.98,A*.96)}o.push(l,l+2,l+1,l+1,l+2,l+3),l+=4}const h=new ut;h.setAttribute("position",new ze(i,3)),h.setAttribute("normal",new ze(r,3)),h.setAttribute("uv",new ze(n,2)),h.setAttribute("color",new ze(s,3)),h.setIndex(o);const d=this.biome;this.floorMat=new Ut({map:e.floor.map,normalMap:e.floor.normalMap,normalScale:new Z(1.1,1.1),roughnessMap:e.floor.roughnessMap,color:d.floorTint,vertexColors:!0,emissive:d.emissive,emissiveMap:e.floor.emissiveMap,emissiveIntensity:d.emissiveIntensity,metalness:0,envMapIntensity:.25}),d.emissiveIntensity>0&&Db(this.floorMat,d.id==="crystal"?{lo:.55,hi:.72}:{lo:.5,hi:.68});const u=new Ue(h,this.floorMat);u.receiveShadow=!0,this.group.add(u),this.floorMesh=u}buildWalls(){const e=il(),t={pos:[],uv:[],col:[],nor:[],idx:[],v:0},i={pos:[],uv:[],col:[],nor:[],idx:[],v:0},n=(h,d,u,f,g,b,m,p)=>{for(const v of[d,u,f,g])h.pos.push(...v);for(let v=0;v<4;v++)h.nor.push(...b);h.uv.push(...m),h.col.push(...p),h.idx.push(h.v,h.v+1,h.v+2,h.v,h.v+2,h.v+3),h.v+=4},s=(h,d)=>{const u=this.tileAt(h,d);return u===Ht?0:u===ni?Wn-.05:this.isWall(h,d)?this.wallHeight(h,d):null};this.wallHeights=new Float32Array(this.W*this.H);for(let h=0;h<this.H;h++)for(let d=0;d<this.W;d++){const u=this.tileAt(d,h);if(u===qt&&!this.isWall(d,h))continue;const f=u===qt?this.wallHeight(d,h):u===ni?0:null;if(f===null)continue;u===qt&&(this.wallHeights[this.idx(d,h)]=f);const g=d*ge,b=g+ge,m=h*ge,p=m+ge;u===qt&&n(i,[g,f,m],[g,f,p],[b,f,p],[b,f,m],[0,1,0],[g/4,m/4,g/4,p/4,b/4,p/4,b/4,m/4],[.92,.92,.92,.92,.92,.92,.92,.92,.92,.92,.92,.92]);const v=[[0,-1,[0,0,-1]],[0,1,[0,0,1]],[-1,0,[-1,0,0]],[1,0,[1,0,0]]];for(const[_,x,A]of v){let w=s(d+_,h+x);if(u===ni||w===null||w>=f)continue;const R=w,P=f;let M,y,D,U,N,W;x===-1?(M=[b,R,m],y=[g,R,m],D=[g,P,m],U=[b,P,m],N=b,W=g):x===1?(M=[g,R,p],y=[b,R,p],D=[b,P,p],U=[g,P,p],N=g,W=b):_===-1?(M=[g,R,m],y=[g,R,p],D=[g,P,p],U=[g,P,m],N=m,W=p):(M=[b,R,p],y=[b,R,m],D=[b,P,m],U=[b,P,p],N=p,W=m);const X=R<-.1?.25:.42,G=1;n(t,M,y,D,U,A,[N/4,R/4,W/4,R/4,W/4,P/4,N/4,P/4],[X,X,X,X,X,X,G,G,G,G,G,G])}}for(let h=0;h<this.H;h++)for(let d=0;d<this.W;d++){if(this.tileAt(d,h)!==Ht)continue;const u=d*ge,f=u+ge,g=h*ge,b=g+ge,m=Wn-.05,p=0,v=.5,_=.7,x=[v*1.6,v*.7,v*.4,v*1.6,v*.7,v*.4,_,_,_,_,_,_];this.tileAt(d,h-1)===ni&&n(t,[f,m,g],[u,m,g],[u,p,g],[f,p,g],[0,0,-1],[f/4,0,u/4,0,u/4,.1,f/4,.1],x),this.tileAt(d,h+1)===ni&&n(t,[u,m,b],[f,m,b],[f,p,b],[u,p,b],[0,0,1],[u/4,0,f/4,0,f/4,.1,u/4,.1],x),this.tileAt(d-1,h)===ni&&n(t,[u,m,g],[u,m,b],[u,p,b],[u,p,g],[-1,0,0],[g/4,0,b/4,0,b/4,.1,g/4,.1],x),this.tileAt(d+1,h)===ni&&n(t,[f,m,b],[f,m,g],[f,p,g],[f,p,b],[1,0,0],[b/4,0,g/4,0,g/4,.1,b/4,.1],x)}const r=h=>{const d=new ut;return d.setAttribute("position",new ze(h.pos,3)),d.setAttribute("normal",new ze(h.nor,3)),d.setAttribute("uv",new ze(h.uv,2)),d.setAttribute("color",new ze(h.col,3)),d.setIndex(h.idx),d.computeTangents?.call,d},o=this.biome;this.wallMat=new Ut({map:e.wall.map,normalMap:e.wall.normalMap,roughnessMap:e.wall.roughnessMap,color:o.wallTint,vertexColors:!0,envMapIntensity:.2}),ph(this.wallMat),this.topMat=new Ut({map:e.rock.map,normalMap:e.rock.normalMap,color:new ie(o.wallTint).multiplyScalar(.55),vertexColors:!0,roughness:.95,envMapIntensity:.1}),ph(this.topMat);const c=new Ue(r(t),this.wallMat);c.castShadow=!0,c.receiveShadow=!0;const l=new Ue(r(i),this.topMat);l.castShadow=!0,l.receiveShadow=!0,this.group.add(c,l)}buildLava(){const e=[],t=[];let i=0;for(let r=0;r<this.H;r++)for(let o=0;o<this.W;o++){if(this.tileAt(o,r)!==ni)continue;const c=o*ge,l=r*ge;e.push(c,Wn,l,c,Wn,l+ge,c+ge,Wn,l+ge,c+ge,Wn,l),t.push(i,i+1,i+2,i,i+2,i+3),i+=4}if(!i)return;const n=new ut;n.setAttribute("position",new ze(e,3)),n.setIndex(t),this.lavaMat=new ht({vertexShader:wh,fragmentShader:wx,uniforms:{uTime:Oi.uTime}}),this.group.add(new Ue(n,this.lavaMat));const s=new Set;for(let r=0;r<this.H;r++)for(let o=0;o<this.W;o++){if(this.tileAt(o,r)!==ni)continue;const c=Math.floor(o/4)+","+Math.floor(r/4);if(s.has(c))continue;s.add(c);const l=this.center(o,r);this.lightSources.push({pos:new T(l.x,.6,l.z),color:new ie(16730640),intensity:22,distance:9,flicker:.25,seed:Math.random()*100,lava:!0})}}buildAtmosphere(){const e=this.biome,t=this.W*ge,i=new vi(t,t);i.rotateX(-Math.PI/2);const n=e.id==="crypt"?[.35,.42,.6]:e.id==="crystal"?[.45,.35,.8]:[.8,.3,.12];this.mistMat=new ht({vertexShader:wh,fragmentShader:Tx,uniforms:{uTime:Oi.uTime,uColor:{value:new T(...n)},uOpacity:{value:e.id==="crypt"?.2:e.id==="crystal"?.14:.07}},transparent:!0,depthWrite:!1,blending:Mt});const s=new Ue(i,this.mistMat);s.position.set(t/2,.35,t/2),s.renderOrder=5,this.group.add(s)}addLightShaft(e,t,i){const n=new ls(.7,2.4,11,24,1,!0);n.translate(0,5.5,0);const s=new ht({vertexShader:Ex,fragmentShader:Ax,uniforms:{uColor:{value:new T(...i)},uTime:Oi.uTime},transparent:!0,depthWrite:!1,blending:Mt,side:Gt}),r=new Ue(n,s);r.position.set(e,0,t),r.rotation.z=.28,r.rotation.x=-.18,r.renderOrder=6,this.group.add(r)}placeModel(e,t,i,{rotY:n=0,scale:s=1,collider:r=0,castShadow:o=!0,patch:c=null}={}){const h=this.game.assets.instance(e,{uniqueMaterials:!1});if(!h)return null;const d=h.root;return d.position.set(t,0,i),d.rotation.y=n,d.scale.setScalar(s),d.traverse(u=>{u.isMesh&&(u.castShadow=o,u.receiveShadow=!0)}),this.group.add(d),r>0&&this.colliders.push({x:t,z:i,r:r*s}),d}doorBlocked(e){const t=new Set;for(const i of e.doors)for(let n=-2;n<=2;n++)for(let s=-2;s<=2;s++)t.add(this.idx(i.x+s,i.y+n));return t}decorate(){const e=this.rng,t=this.biome,i=t.id==="crystal"?[.6,1.8,3.6]:[3.2,1.3,.35],n=new ie(t.torchColor),s=(l,h)=>{if(!this.placeModel("brazier",l,h,{rotY:e.float(0,6.28),collider:.55}))return;const u=new T(l,1.5,h);this.fires.push({pos:u,scale:1.1,color:i}),this.lightSources.push({pos:new T(l,2.3,h),color:n.clone(),intensity:48,distance:14,flicker:.22,seed:e.float(0,100),fire:!0})},r=new rn(.18,.5,.3),o=new Ut({color:1709330,roughness:.6,metalness:.7}),c=[];for(let l=0;l<this.H;l++)for(let h=0;h<this.W;h++){if(!this.isWall(h,l)||this.wallHeight(h,l)<to||this.tileAt(h,l+1)!==Ht)continue;if(this.roomMap[this.idx(h,l+1)]<0){if((h*7+l*3)%9!==0)continue}else if((h+l*5)%4!==0)continue;c.push([h,l])}if(c.length){const l=new $o(r,o,c.length),h=new Ee;c.forEach(([d,u],f)=>{const g=(d+.5)*ge,b=(u+1)*ge+.12;h.makeTranslation(g,1.9,b),l.setMatrixAt(f,h);const m=new T(g,2.2,b+.12);this.fires.push({pos:m,scale:.6,color:i}),this.lightSources.push({pos:new T(g,2.4,b+.8),color:n.clone(),intensity:24,distance:10,flicker:.3,seed:Math.random()*100,fire:!0})}),l.castShadow=!1,this.group.add(l)}for(const l of this.rooms){const h=this.doorBlocked(l),d=(p,v)=>!h.has(this.idx(p,v))&&this.tileAt(p,v)===Ht,u=[[l.x+1,l.y+1],[l.x+l.w-2,l.y+1],[l.x+1,l.y+l.h-2],[l.x+l.w-2,l.y+l.h-2]],f=l.w>=10&&l.h>=9;if(l.type==="boss"){const p=l.center.x,v=l.center.z;for(let _=0;_<12;_++){const x=_/12*Math.PI*2+.26,A=p+Math.cos(x)*l.w*.36*ge,w=v+Math.sin(x)*l.h*.34*ge,R=this.placeModel("pillar",A,w,{rotY:-x,scale:1.15,collider:.7});R&&this.patchCut(R)}for(let _=0;_<6;_++){const x=_/6*Math.PI*2;s(p+Math.cos(x)*10.5,v+Math.sin(x)*9.5)}this.lightSources.push({pos:new T(p,9,v+3),color:new ie(16738874),intensity:60,distance:40,flicker:0,seed:0,fill:!0}),this.fires.push({pos:new T(p,.1,v-4),scale:.01,color:[3,1,.2]});continue}const g=l.type==="start"||l.type==="treasure"||l.type==="shrine"?u.slice(0,2):u;this.lightSources.push({pos:new T(l.center.x,7,l.center.z+2),color:new ie(t.hemiSky).lerp(new ie(16777215),.35),intensity:16+l.w*l.h*.12,distance:Math.max(l.w,l.h)*ge*1.1,flicker:0,seed:0,fill:!0});for(const[p,v]of g)if(d(p,v)){const _=this.center(p,v);s(_.x,_.z)}if(f&&l.type!=="exit"){const p=[l.x+3,l.x+l.w-4],v=[l.y+3,l.y+l.h-4];for(const _ of p)for(const x of v){if(!d(_,x))continue;const A=this.center(_,x),w=this.placeModel("pillar",A.x,A.z,{rotY:e.int(0,3)*Math.PI*.5,collider:.6});w&&this.patchCut(w)}}const b=[];for(let p=l.x;p<l.x+l.w;p++)b.push([p,l.y,0,-1]),b.push([p,l.y+l.h-1,0,1]);for(let p=l.y+1;p<l.y+l.h-1;p++)b.push([l.x,p,-1,0]),b.push([l.x+l.w-1,p,1,0]);for(const[p,v,_,x]of b){if(!d(p,v)||!e.chance(.2)||u.some(([M,y])=>Math.abs(M-p)<=0&&Math.abs(y-v)<=0))continue;const A=this.center(p,v),w=A.x+_*.45+e.float(-.3,.3),R=A.z+x*.45+e.float(-.3,.3),P=e.pick(t.deco);if(P==="barrel")this.addBarrel(w,R,e);else if(P==="crystal"){const M=e.float(.7,1.25);this.placeModel("crystal",w,R,{rotY:e.float(0,6.28),scale:M,collider:.5}),this.lightSources.push({pos:new T(w,1.2,R),color:new ie(e.chance(.5)?4245759:10510591),intensity:14,distance:8,flicker:.05,seed:e.float(0,100)})}else if(P==="pillar"){if(e.chance(.4)){const M=this.placeModel("pillar",A.x,A.z,{rotY:e.int(0,3)*1.57,scale:.85,collider:.5});M&&this.patchCut(M)}}else P==="bones"&&(this.game.assets.has("skulls")?this.placeModel("skulls",w,R,{rotY:e.float(0,6.28),scale:e.float(.8,1.2)}):this.placeModel("rubble",w,R,{rotY:e.float(0,6.28),scale:e.float(.7,1.1)}))}for(let p=0;p<2;p++){if(!e.chance(.5))continue;const v=this.randomFloorInRoom(l,()=>e.next(),1);this.placeModel("rubble",v.x,v.z,{rotY:e.float(0,6.28),scale:e.float(.35,.6),castShadow:!1})}if(l.type==="start"){if(this.startPos=l.center.clone(),(this.floorIndex>=1||this.game.mods?.shopEverywhere)&&!this.def.boss){const p=(l.y+1.3)*ge,v=l.center.x+ge*1.5,_=this.placeModel(this.game.assets.has("merchant")?"merchant":"chest",v,p,{rotY:0,collider:1.1});this.interactables.push({kind:"shop",pos:new T(v,0,p+1.6),radius:2.3,prompt:"Trade with the Pyre Merchant",obj:_,used:!1}),this.lightSources.push({pos:new T(v,2.6,p+1.4),color:new ie(16756848),intensity:26,distance:10,flicker:.15,seed:21}),this.startPos=new T(l.center.x-ge*.5,0,l.center.z+ge*.5)}this.addLightShaft(l.center.x-1.2,l.center.z-.6,t.id==="molten"?[1.2,.6,.3]:[.55,.65,1])}if(l.type==="treasure"){const p=this.placeModel("chest",l.center.x,l.center.z,{rotY:0,scale:1.3,collider:1.1}),v={kind:"chest",pos:l.center.clone(),radius:2.3,prompt:"Open Chest",obj:p,used:!1};this.interactables.push(v);const _=l.center.clone();this.animated.push(x=>{if(v.used||Math.random()>.35)return;const A=Math.random()*Math.PI*2;this.game.fx.add.emit({x:_.x+Math.cos(A)*1.1,y:.3+Math.random()*.8,z:_.z+Math.sin(A)*.9,vy:.6+Math.random()*.6,color:[4,2.8,.9],color2:[1.2,.6,.1],size:.14,size2:0,life:1.2,flicker:.6})}),this.addBarrel(l.center.x-2.4,l.center.z-1.2,e),this.addBarrel(l.center.x+2.6,l.center.z-1,e),this.addLightShaft(l.center.x,l.center.z,[1.2,.95,.5]),this.lightSources.push({pos:new T(l.center.x,2.5,l.center.z+1.2),color:new ie(16760928),intensity:38,distance:11,flicker:.06,seed:3})}if(l.type==="shrine"){const p=(l.y+1.2)*ge,v=this.placeModel("shrine",l.center.x,p,{rotY:0,collider:1}),_=new T(l.center.x,1.9,p+.1);this.interactables.push({kind:"shrine",pos:new T(l.center.x,0,p+1.4),radius:2.2,prompt:"Pray at Shrine",obj:v,used:!1,orbPos:_}),this.lightSources.push({pos:new T(l.center.x,2.4,p+1.2),color:new ie(16756816),intensity:26,distance:11,flicker:.08,seed:7}),this.addLightShaft(l.center.x,p+2,[1.3,.9,.4]),this.shrineOrb=this.makeOrb(_,[3,1.8,.6])}if(l.type==="exit"){const p=l.center.z-ge*.5,v=this.placeModel("portal",l.center.x,p,{rotY:0,collider:0});this.colliders.push({x:l.center.x-1.6,z:p,r:.6},{x:l.center.x+1.6,z:p,r:.6}),this.portal=this.makePortal(new T(l.center.x,0,p)),this.interactables.push({kind:"portal",pos:new T(l.center.x,0,p+.6),radius:2,prompt:"Descend",obj:v,used:!1,enabled:!1})}const m=this.game.mods?.ruin;if(l.type==="combat"&&(m||this.floorIndex>=1&&e.chance(.45))){const p=m?e.int(3,5):e.int(2,4);for(let v=0;v<p;v++){const _=e.int(l.x+1,l.x+l.w-2),x=e.int(l.y+1,l.y+l.h-2);if(!d(_,x)||this.traps.some(w=>w.tx===_&&w.ty===x))continue;const A=this.center(_,x);this.colliders.some(w=>Math.hypot(w.x-A.x,w.z-A.z)<1.6)||this.addTrap(_,x,l,v*.7)}}}}patchCut(e){e.traverse(t=>{t.isMesh&&!t.material.userData.cutPatched&&(t.material=t.material.clone(),Zo(t.material,{cutaway:!0}),t.material.userData.cutPatched=!0)})}addBarrel(e,t,i){const n=this.placeModel("barrel",e,t,{rotY:i.float(0,6.28),collider:.5});if(!n)return;const s=this.colliders[this.colliders.length-1];this.breakables.push({kind:"barrel",pos:new T(e,0,t),radius:.55,obj:n,collider:s,hp:1})}makeOrb(e,t){const i=new bi({map:this.game.fx.glowTex,color:new ie(...t),blending:Mt,depthWrite:!1,transparent:!0}),n=new ji(i);n.position.copy(e),n.scale.setScalar(1.6),this.group.add(n);const s=new Ue(new ta(.16,16,12),new Et({color:new ie(t[0]*1.6,t[1]*1.6,t[2]*1.6)}));s.position.copy(e),this.group.add(s);const r={sprite:n,core:s,base:e.clone(),color:t,active:!0};return this.animated.push(o=>{const c=r.base.y+Math.sin(o*2)*.12;n.position.y=s.position.y=c,n.scale.setScalar(r.active?1.5+Math.sin(o*3)*.15:.4),s.visible=r.active,r.active&&Math.random()<.3&&this.game.fx.converge(r.base,t,1,1.2,c)}),r}makePortal(e){const t=`
      uniform float uTime; uniform float uActive; uniform vec3 uC1, uC2; varying vec2 vUv;
      float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(h2(i), h2(i+vec2(1,0)), f.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), f.x), f.y); }
      void main(){
        vec2 p = (vUv - vec2(0.5, 0.45)) * vec2(1.0, 0.8);
        float r = length(p) * 2.0;
        float a = atan(p.y, p.x);
        float sw = a + r * 4.0 - uTime * 2.2;
        float n = n2(vec2(sw * 1.5, r * 3.0 - uTime)) * 0.6 + n2(vec2(sw * 3.0, r * 6.0)) * 0.4;
        float mask = smoothstep(1.0, 0.75, r);
        vec3 c1 = uC1;
        vec3 c2 = uC2;
        vec3 col = mix(c2, c1, n) * (0.4 + n) + vec3(5.0, 3.5, 2.0) * pow(smoothstep(0.5, 0.0, r), 2.0) * 0.6;
        float alpha = mask * mix(0.12, 0.95, uActive) * (0.55 + 0.45 * n);
        gl_FragColor = vec4(col * alpha, alpha);
      }
    `,i=new ht({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:t,uniforms:{uTime:Oi.uTime,uActive:{value:0},uC1:{value:new T(3.5,1,.25)},uC2:{value:new T(1.4,.3,2.6)}},transparent:!0,depthWrite:!1,blending:Mt,side:Gt}),n=new Ue(new vi(2.6,3.4),i);n.position.set(e.x,1.9,e.z+.05),n.renderOrder=8,this.group.add(n);const s={pos:new T(e.x,2,e.z+1.2),color:new ie(16742960),intensity:6,distance:12,flicker:.1,seed:11};this.lightSources.push(s);const r={plane:n,mat:i,pos:e.clone(),active:!1,light:s};return this.animated.push(()=>{const o=r.active?1:0;i.uniforms.uActive.value+=(o-i.uniforms.uActive.value)*.03,s.intensity=6+i.uniforms.uActive.value*34,r.active&&Math.random()<.5&&this.game.fx.converge(new T(e.x,0,e.z+.1),r.abyss||Math.random()<.5?[1.5,.4,3]:[3,1,.3],1,1.6,1.9)}),r}addTrap(e,t,i,n){const s=this.center(e,t),r=new Ue(new rn(1.7,.06,1.7),new Ut({color:2762276,roughness:.5,metalness:.8}));r.position.set(s.x,.03,s.z),r.receiveShadow=!0,this.group.add(r);const o=new er(.1,.9,6);o.translate(0,.45,0);const c=new Ut({color:9078144,roughness:.3,metalness:.9,emissive:0}),l=new $o(o,c,9),h=new Ee;let d=0;for(let u=-1;u<=1;u++)for(let f=-1;f<=1;f++)l.setMatrixAt(d++,h.makeTranslation(u*.5,0,f*.5));l.position.set(s.x,-.9,s.z),l.castShadow=!0,this.group.add(l),this.traps.push({tx:e,ty:t,pos:s,room:i,spikes:l,spikeMat:c,plate:r,t:n,state:"idle",hitSet:new Set})}buildGates(){const e=new ls(.07,.07,2.6,6);e.translate(0,1.3,0);const t=new er(.11,.35,6);t.translate(0,2.75,0),this.gateMat=new Ut({color:2761760,roughness:.4,metalness:.9,emissive:3803136,emissiveIntensity:1}),this.gateTipMat=new Ut({color:2761760,roughness:.4,metalness:.8,emissive:16726544,emissiveIntensity:2});for(const i of this.rooms){if(i.state!=="idle")continue;const n=new St;for(const s of i.doors){const r=this.center(s.x,s.y),o=s.side==="n"||s.side==="s";for(let l=0;l<4;l++){const h=-.75+l*.5,d=new Ue(e,this.gateMat);d.position.set(r.x+(o?h:0),0,r.z+(o?0:h)),d.castShadow=!0,n.add(d);const u=new Ue(t,this.gateTipMat);u.position.copy(d.position),n.add(u)}const c=new Ue(new rn(o?2:.1,.1,o?.1:2),this.gateMat);c.position.set(r.x,1.9,r.z),n.add(c)}n.position.y=-3.2,n.visible=!1,this.group.add(n),i.gates={group:n,target:-3.2}}}lockRoom(e){if(e.gates){e.gates.target=0,e.gates.group.visible=!0;for(const t of e.doors)this.solid[this.idx(t.x,t.y)]=1;this.flowFrom=-1}}unlockRoom(e){if(e.gates){e.gates.target=-3.2;for(const t of e.doors)this.tiles[this.idx(t.x,t.y)]===Ht&&(this.solid[this.idx(t.x,t.y)]=0);this.flowFrom=-1}}buildLightPool(){this.pool=[];const e=this.game.renderer.quality==="low"?6:10;for(let t=0;t<e;t++){const i=new vs(16777215,0,10,2);this.group.add(i),this.pool.push(i)}}updateLights(e,t){const i=this.lightSources;for(const s of i)s._d=(s.pos.x-e.x)**2+(s.pos.z-e.z)**2;const n=i.slice().sort((s,r)=>s._d-r._d);for(let s=0;s<this.pool.length;s++){const r=this.pool[s],o=n[s];if(!o||o._d>1156){r.intensity=0;continue}r.position.copy(o.pos),r.color.copy(o.color),r.distance=o.distance;const c=o.flicker?1-o.flicker*(.5+.5*Math.sin(t*13+o.seed)*Math.sin(t*7.3+o.seed*2.1)):1,l=1-Math.min(1,Math.max(0,(Math.sqrt(o._d)-24)/10));r.intensity=o.intensity*c*l}}update(e,t){this.time+=e;const i=this.time;this.updateLights(t,i);for(const n of this.fires)if(!((n.pos.x-t.x)**2+(n.pos.z-t.z)**2>900))for(n.acc=(n.acc||0)+e*38*n.scale;n.acc>1;)n.acc-=1,this.game.fx.flame(n.pos,n.scale,n.color);for(const n of this.rooms){const s=n.gates;if(!s)continue;const r=s.group.position.y;Math.abs(r-s.target)>.01&&(s.group.position.y+=(s.target-r)*Math.min(1,e*(s.target>r?14:4)),s.target<0&&s.group.position.y<-3.1&&(s.group.visible=!1))}this.gateTipMat.emissiveIntensity=2+Math.sin(i*4)*1.2;for(const n of this.animated)n(i,e)}collide(e,t){let i=!1;const n=this.toTile(e.x-t),s=this.toTile(e.x+t),r=this.toTile(e.z-t),o=this.toTile(e.z+t);for(let c=r;c<=o;c++)for(let l=n;l<=s;l++){if(!this.isSolid(l,c))continue;const h=l*ge,d=c*ge,u=Math.max(h,Math.min(e.x,h+ge)),f=Math.max(d,Math.min(e.z,d+ge));let g=e.x-u,b=e.z-f;const m=g*g+b*b;if(m<t*t)if(i=!0,m<1e-8){const p=Math.min(e.x-h,h+ge-e.x),v=Math.min(e.z-d,d+ge-e.z);p<v?e.x=e.x-h<ge/2?h-t:h+ge+t:e.z=e.z-d<ge/2?d-t:d+ge+t}else{const p=Math.sqrt(m);e.x=u+g/p*t,e.z=f+b/p*t}}for(const c of this.colliders){const l=e.x-c.x,h=e.z-c.z,d=t+c.r,u=l*l+h*h;if(u<d*d){const f=Math.sqrt(u),g=f>1e-4?l/f:0,b=f>1e-4?h/f:1;e.x=c.x+g*d,e.z=c.z+b*d,i=!0}}return i}blocksProjectile(e,t){const i=this.toTile(e),n=this.toTile(t);if(i<0||n<0||i>=this.W||n>=this.H)return!0;const s=n*this.W+i;return!!(this.sightBlock[s]||this.tiles[s]===Ht&&this.solid[s])}los(e,t,i=.5){const n=t.x-e.x,s=t.z-e.z,r=Math.hypot(n,s),o=Math.ceil(r/i);for(let c=1;c<o;c++){const l=c/o;if(this.blocksProjectile(e.x+n*l,e.z+s*l))return!1}return!0}clearPath(e,t,i=.4){const n=t.x-e.x,s=t.z-e.z,r=Math.hypot(n,s),o=Math.ceil(r/.6);for(let c=1;c<o;c++){const l=c/o,h=e.x+n*l,d=e.z+s*l;if(this.isSolid(this.toTile(h+i),this.toTile(d))||this.isSolid(this.toTile(h-i),this.toTile(d))||this.isSolid(this.toTile(h),this.toTile(d+i))||this.isSolid(this.toTile(h),this.toTile(d-i)))return!1}return!0}updateFlow(e){const t=this.toTile(e.x),i=this.toTile(e.z),n=i*this.W+t;if(n===this.flowFrom)return;this.flowFrom=n;const s=this.W,r=this.H,o=this.flow;if(o.fill(-1),t<0||i<0||t>=s||i>=r)return;const c=new Int32Array(s*r);let l=0,h=0;for(o[n]=0,c[h++]=n;l<h;){const d=c[l++],u=d%s,f=d/s|0,g=o[d];for(let b=-1;b<=1;b++)for(let m=-1;m<=1;m++){if(!m&&!b)continue;const p=u+m,v=f+b;if(p<0||v<0||p>=s||v>=r)continue;const _=v*s+p;o[_]>=0||this.solid[_]||m&&b&&(this.solid[f*s+p]||this.solid[v*s+u])||(o[_]=g+1,c[h++]=_)}}}flowDir(e){const t=this.toTile(e.x),i=this.toTile(e.z),n=this.W,s=this.flow[i*n+t];let r=s>=0?s:1e9,o=0,c=0;for(let f=-1;f<=1;f++)for(let g=-1;g<=1;g++){if(!g&&!f)continue;const b=t+g,m=i+f;if(b<0||m<0||b>=n||m>=this.H)continue;const p=this.flow[m*n+b];if(p>=0&&p<r){if(g&&f&&(this.solid[i*n+b]||this.solid[m*n+t]))continue;r=p,o=g,c=f}}if(!o&&!c)return null;const l=this.center(t+o,i+c),h=l.x-e.x,d=l.z-e.z,u=Math.hypot(h,d)||1;return{x:h/u,z:d/u}}markExplored(e,t=7){const i=this.toTile(e.x),n=this.toTile(e.z),s=Math.ceil(t/ge)+1;for(let o=-s;o<=s;o++)for(let c=-s;c<=s;c++){const l=i+c,h=n+o;l<0||h<0||l>=this.W||h>=this.H||c*c+o*o<=s*s&&(this.explored[h*this.W+l]=1)}const r=this.roomAtWorld(e.x,e.z);if(r&&!r.revealed){r.revealed=!0;for(let o=r.y-1;o<=r.y+r.h;o++)for(let c=r.x-1;c<=r.x+r.w;c++)this.explored[o*this.W+c]=1}}dispose(){this.game.scene.remove(this.group),this.group.traverse(e=>{(e.isMesh||e.isInstancedMesh)&&e.geometry&&!e.geometry.userData.shared&&e.geometry.dispose()});for(const e of[this.floorMat,this.wallMat,this.topMat,this.lavaMat,this.mistMat])e?.dispose()}}class Ll{constructor(e,t,{clips:i={},rim:n=[0,0,0],rimPow:s=2.5,scale:r=1,dissolveColor:o}={}){this.game=e,this.name=t,this.root=new St,this.actions={},this.current=null,this.uniforms=[],this.bones={};const c=e.assets.instance(t),l=c?.template.def;if(c){if(this.model=c.root,this.model.scale.multiplyScalar(r),this.root.add(this.model),c.clips.length){this.mixer=new ab(this.model);for(const[h,d]of Object.entries(i)){const u=c.clips.find(f=>f.name===d);u&&(this.actions[h]=this.mixer.clipAction(u))}}this.model.traverse(h=>{if(h.isBone&&(this.bones[h.name]=h),h.isMesh){const d=Array.isArray(h.material)?h.material:[h.material];for(const u of d){const f=l?.emis||{},g=Zo(u,{rim:n,rimPow:s,emisLo:f.lo,emisHi:f.hi,emisStrength:f.strength||0,hue:f.hue||0,dissolveColor:o});this.uniforms.push(g)}}})}else{const h=new Ut({color:7829367,roughness:.6}),d=Zo(h,{rim:n,rimPow:s});this.uniforms.push(d);const u=new Ue(new Sl(.35*r,1*r,4,8),h);u.position.y=.9*r,u.castShadow=!0,this.root.add(u),this.model=u}this.flashT=0,this.flashColor=new T(1,1,1),this.dissolve=0,this.baseRim=new T(...n)}has(e){return!!this.actions[e]}duration(e){return this.actions[e]?.getClip().duration||1}play(e,{fade:t=.12,loop:i=!0,timeScale:n=1,start:s=0,force:r=!1}={}){const o=this.actions[e];return o?this.current===o&&!r?(o.timeScale=n,o):(o.reset(),o.enabled=!0,o.setLoop(i?jh:Wh,i?1/0:1),o.clampWhenFinished=!i,o.timeScale=n,o.time=s,o.setEffectiveWeight(1),this.current&&this.current!==o&&o.crossFadeFrom(this.current,t,!1),o.play(),this.current=o,this.currentName=e,o):null}flash(e=[1,1,1],t=.12){this.flashColor.set(e[0],e[1],e[2]),this.flashT=t,this.flashDur=t}setRim(e,t,i){for(const n of this.uniforms)n.uRim.value.set(e,t,i)}update(e){if(this.mixer&&this.mixer.update(e),this.flashT>0){this.flashT-=e;const t=Math.max(0,this.flashT/this.flashDur);for(const i of this.uniforms)i.uFlash.value.copy(this.flashColor).multiplyScalar(t*t*1.6)}else if(this.flashDur){for(const t of this.uniforms)t.uFlash.value.set(0,0,0);this.flashDur=0}}setDissolve(e){this.dissolve=e;for(const t of this.uniforms)t.uDissolve.value=e}attachToBone(e,t,{worldDir:i=new T(0,0,1),gripOffset:n=.06,worldScale:s=1,twist:r=0}={}){const o=this.bones[e];if(!o)return null;this.root.updateMatrixWorld(!0);const c=o.getWorldQuaternion(new Nt),l=o.getWorldPosition(new T),h=o.getWorldScale(new T),d=o.parent.getWorldPosition(new T),u=l.clone().sub(d).normalize();this.root.matrixWorld.clone().invert();const f=new Nt().setFromUnitVectors(new T(0,1,0),i.clone().normalize());r&&f.multiply(new Nt().setFromAxisAngle(new T(0,1,0),r));const g=new St;g.quaternion.copy(c.clone().invert().multiply(f));const b=l.clone().addScaledVector(u,n);return g.position.copy(o.worldToLocal(b.clone())),g.scale.setScalar(s/h.x),g.add(t),o.add(g),g}}const jn={common:{weight:62,color:"#cfc6b4",glow:"rgba(207,198,180,0.35)",label:"Common"},rare:{weight:27,color:"#4fb0ff",glow:"rgba(79,176,255,0.45)",label:"Rare"},epic:{weight:9,color:"#c27bff",glow:"rgba(194,123,255,0.5)",label:"Epic"},legendary:{weight:2.5,color:"#ffb43c",glow:"rgba(255,180,60,0.6)",label:"Legendary"},fusion:{weight:0,color:"#3ff0c8",glow:"rgba(63,240,200,0.55)",label:"Fusion"}},ir={blade:"M14.5 2.5H21.5V9.5L10.2 20.8L7.7 18.3L6 20L4 18L5.7 16.3L3.2 13.8Z",flame:"M12 1.5c1.2 4.3 6 6.6 6 12a6 6 0 0 1-12 0c0-3.4 2.2-5.2 2.9-7.4.9 2.3 2 3.4 2.6 4.4.7-3.3-.4-6.2.5-9z",bolt:"M13.5 1.5L4 13.5h7l-1.5 9 10-12.5h-7.2z",heart:"M12 21.2s-8.7-5.4-8.7-11.6A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.7 3c0 6.2-8.7 11.6-8.7 11.6z",wing:"M2.5 13.5c4.8-.6 8.4-3.6 10.6-10 1.4 5.4.3 9.3-2.6 12.4 3.5-1.3 7.2-1.1 11 .6-4.4 2.6-9.2 3.6-13.6 2.8-2.6-.5-4.2-2.6-5.4-5.8z",shield:"M12 1.8l8.5 3.2v6.4c0 5.3-3.7 9.5-8.5 11.4-4.8-1.9-8.5-6.1-8.5-11.4V5z",eye:"M1.5 12S5.7 4.8 12 4.8 22.5 12 22.5 12 18.3 19.2 12 19.2 1.5 12 1.5 12zm10.5 3.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z",skull:"M12 2a8.3 8.3 0 0 0-8.3 8.3c0 3 1.5 5.1 3.1 6.3V20h2.3v-2h1.9v2h2v-2h1.9v2h2.3v-3.4c1.6-1.2 3.1-3.3 3.1-6.3A8.3 8.3 0 0 0 12 2zM8.8 13.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm6.4 0a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2z",orb:"M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm0 3.2a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6zM19.5 2.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2z",star:"M12 1.5l2.9 7h7.6l-6 4.6 2.3 7.4L12 16l-6.8 4.5 2.3-7.4-6-4.6h7.6z",coin:"M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm1 4v1.4c1.6.3 2.7 1.3 2.7 2.7h-2.1c0-.6-.6-1-1.6-1s-1.6.4-1.6 1c0 1.9 5.3 1 5.3 4.2 0 1.4-1.1 2.4-2.7 2.7v1.5h-2v-1.5c-1.7-.3-2.8-1.4-2.8-2.8h2.1c0 .7.7 1.1 1.7 1.1s1.7-.4 1.7-1.1c0-1.9-5.3-1-5.3-4.2 0-1.3 1.1-2.3 2.6-2.6V6.5z",hourglass:"M5.5 2h13v4.3L14.2 12l4.3 5.7V22h-13v-4.3L9.8 12 5.5 6.3z",drop:"M12 1.8s7.4 8.3 7.4 13.6a7.4 7.4 0 0 1-14.8 0C4.6 10.1 12 1.8 12 1.8z",sun:"M12 1l2 5.3 5.2-2.3-2.3 5.2L22.2 11l-5.3 2 2.3 5.2-5.2-2.3-2 5.3-2-5.3-5.2 2.3 2.3-5.2L1.8 11l5.3-2-2.3-5.2 5.2 2.3z",crown:"M2.5 7l5 4.5L12 3.5l4.5 8L21.5 7l-2 12h-15z",reach:"M3 12h13.5l-4-4 1.5-1.5L20.5 13 14 19.5 12.5 18l4-4H3z"},mi=[{id:"tempered",name:"Tempered Edge",rarity:"common",icon:"blade",max:5,desc:"+15% damage",apply:a=>a.dmgMul+=.15},{id:"fleet",name:"Fleet Step",rarity:"common",icon:"wing",max:3,desc:"+10% movement speed",apply:a=>a.moveMul+=.1},{id:"ironwill",name:"Iron Will",rarity:"common",icon:"heart",max:5,desc:"+20 max health and heal 20",apply:(a,e)=>{a.maxHp+=20,e&&e.heal(20)}},{id:"quick",name:"Quickened Strikes",rarity:"common",icon:"hourglass",max:4,desc:"+12% attack speed",apply:a=>a.atkSpeed+=.12},{id:"reach",name:"Long Reach",rarity:"common",icon:"reach",max:3,desc:"+18% attack range",apply:a=>a.rangeMul+=.18},{id:"gilded",name:"Gilded Touch",rarity:"common",icon:"coin",max:3,desc:"+40% gold found",apply:a=>a.goldMul+=.4},{id:"keen",name:"Keen Eye",rarity:"common",icon:"eye",max:4,desc:"+8% critical chance",apply:a=>a.crit+=.08},{id:"kindling",name:"Kindling",rarity:"rare",icon:"flame",max:3,desc:"Strikes ignite foes, burning for 5 damage/sec",apply:a=>a.burn+=5},{id:"static",renown:3,name:"Static Edge",rarity:"rare",icon:"bolt",max:3,desc:"22% chance on hit to arc lightning to 3 foes",apply:a=>a.chain+=.22},{id:"bloodthirst",name:"Bloodthirst",rarity:"rare",icon:"drop",max:3,desc:"Heal 3 health whenever you slay a foe",apply:a=>a.lifeOnKill+=3},{id:"secondwind",name:"Second Wind",rarity:"rare",icon:"wing",max:2,desc:"+1 dash charge",apply:a=>a.dashCharges+=1},{id:"shards",renown:4,name:"Ember Shards",rarity:"rare",icon:"star",max:3,desc:"Your finishing strike hurls 3 seeking ember shards",apply:a=>a.shards+=3},{id:"ashen",name:"Ashen Hide",rarity:"rare",icon:"shield",max:3,desc:"Take 12% less damage",apply:a=>a.armor=1-(1-a.armor)*.88},{id:"executioner",name:"Executioner",rarity:"rare",icon:"skull",max:2,desc:"+60% damage to foes below 30% health",apply:a=>a.execute+=.6},{id:"cinders",renown:6,name:"Orbiting Cinders",rarity:"epic",icon:"orb",max:3,desc:"A blazing cinder orbits you, scorching foes",apply:a=>a.orbs+=1},{id:"trail",name:"Blazing Trail",rarity:"epic",icon:"flame",max:2,desc:"Dashing leaves a trail of searing fire",apply:a=>a.fireTrail+=1},{id:"thunderclap",renown:7,name:"Thunderclap",rarity:"epic",icon:"bolt",max:2,desc:"Ending a dash unleashes a lightning burst",apply:a=>a.thunderclap+=1},{id:"siphon",name:"Soul Siphon",rarity:"epic",icon:"drop",max:2,desc:"Cinder Nova charges 50% faster and heals 15",apply:a=>{a.novaGain+=.5,a.novaHeal+=15}},{id:"brutal",name:"Brutal Criticals",rarity:"epic",icon:"eye",max:2,desc:"Critical hits deal +100% damage, +5% crit chance",apply:a=>{a.critMul+=1,a.crit+=.05}},{id:"phoenix",renown:8,name:"Phoenix Heart",rarity:"legendary",icon:"sun",max:1,desc:"Once, rise from death with half your health",apply:a=>a.phoenix+=1},{id:"inferno",renown:9,name:"Inferno",rarity:"legendary",icon:"flame",max:1,desc:"Cinder Nova is 50% larger and sets the ground ablaze",apply:a=>{a.novaRadius+=.5,a.novaBurnGround=1}},{id:"wrath",renown:11,name:"Wrath of Ages",rarity:"legendary",icon:"crown",max:1,desc:"+40% damage and +15% attack speed",apply:a=>{a.dmgMul+=.4,a.atkSpeed+=.15}},{id:"scavenger",name:"Soul Scavenger",rarity:"common",icon:"skull",max:3,desc:"Foes release 35% more souls",apply:a=>a.soulMul+=.35},{id:"ashcloak",name:"Ashen Cloak",rarity:"rare",icon:"shield",max:1,desc:"Dashing grants a ward that blocks the next hit (8s cooldown)",apply:a=>a.ward=1},{id:"pyreheart",name:"Pyre Heart",rarity:"epic",icon:"sun",max:1,renown:5,desc:"After Cinder Nova, deal +35% damage for 6 seconds",apply:a=>a.empower+=.35},{id:"crescent",name:"Crescent Wave",rarity:"epic",icon:"reach",max:2,weapon:"blade",desc:"Your finisher launches a piercing wave of flame",apply:a=>a.crescent+=1},{id:"rhythm",name:"Duelist’s Rhythm",rarity:"rare",icon:"blade",max:3,weapon:"blade",desc:"Each strike in a combo deals +12% more than the last",apply:a=>a.rhythm+=.12},{id:"venom",name:"Venom Fangs",rarity:"rare",icon:"drop",max:3,weapon:"fangs",desc:"Strikes stack poison: 2 damage/sec per stack, up to 10 stacks",apply:a=>a.venom+=2},{id:"shadow",name:"Shadow Dance",rarity:"epic",icon:"wing",max:2,weapon:"fangs",desc:"Dashing through foes slashes them; dashes recharge 20% faster",apply:a=>{a.shadow+=1,a.dashRecharge*=.8}},{id:"tremor",name:"Tremor",rarity:"rare",icon:"bolt",max:2,weapon:"maul",desc:"Maul strikes send out a shockwave that hits foes around the impact",apply:a=>a.tremor+=1},{id:"juggernaut",name:"Juggernaut",rarity:"epic",icon:"shield",max:1,weapon:"maul",desc:"+30 max health; take 30% less damage while attacking",apply:a=>{a.maxHp+=30,a.juggernaut=1}},{id:"plasma",name:"Plasma Arc",rarity:"fusion",icon:"bolt",max:1,fusion:["kindling","static"],desc:"Lightning ignites foes and leaps to 2 more targets",apply:a=>{a.chainExtra+=2,a.chainIgnite=1}},{id:"firestorm",name:"Firestorm",rarity:"fusion",icon:"orb",max:1,fusion:["cinders","trail"],desc:"+1 orbiting cinder; cinders scorch the ground they pass",apply:a=>{a.orbs+=1,a.orbFire=1}},{id:"stormstep",name:"Storm Step",rarity:"fusion",icon:"wing",max:1,fusion:["thunderclap","secondwind"],desc:"Thunderclap also erupts when a dash begins and deals 50% more",apply:a=>{a.stormStep=1,a.thunderclap+=.5}},{id:"bloodpact",name:"Blood Pact",rarity:"fusion",icon:"skull",max:1,fusion:["bloodthirst","executioner"],desc:"Foes below 15% health are slain outright; kills heal 3 more",apply:a=>{a.cull=.15,a.lifeOnKill+=3}},{id:"searing",name:"Searing Criticals",rarity:"fusion",icon:"eye",max:1,fusion:["keen","brutal"],desc:"Critical hits ignite foes and heal you for 2",apply:a=>{a.critIgnite=1,a.critHeal+=2}},{id:"supernova",name:"Supernova",rarity:"fusion",icon:"sun",max:1,fusion:["siphon","inferno"],desc:"Cinder Nova erupts a second time a moment later",apply:a=>a.supernova=1},{id:"shardstorm",name:"Shard Storm",rarity:"fusion",icon:"star",max:1,fusion:["shards","quick"],desc:"Every strike hurls a seeking ember shard",apply:a=>a.shardAll=1}],Ii=Object.fromEntries(mi.map(a=>[a.id,a])),vn=mi.filter(a=>a.fusion);function Cx(a,{weapon:e,renown:t}){return!(a.weapon&&a.weapon!==e||a.renown&&t<a.renown)}function Px(a,e){const{owned:t,floor:i=0,n=3,minRarity:s=null}=e,r=["common","rare","epic","legendary"],o=[],c=vn.filter(u=>!t[u.id]&&u.fusion.every(f=>t[f]));c.length&&a.chance(s?.6:.4)&&o.push(a.pick(c));const l=mi.filter(u=>!u.fusion&&(t[u.id]||0)<u.max&&Cx(u,e)&&(!s||r.indexOf(u.rarity)>=r.indexOf(s))),h=Math.min(i,8),d={common:1-h*.08,rare:1+h*.1,epic:1+h*.3,legendary:1+h*.5};for(;o.length<n&&l.length;){const u=a.weighted(l,f=>jn[f.rarity].weight*Math.max(.2,d[f.rarity])*(f.weapon?1.6:1));o.push(u),l.splice(l.indexOf(u),1)}return o}function di(a,e="currentColor"){return`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${e}" d="${ir[a]||ir.star}"/></svg>`}const Dx=new ta(1,12,8);class Js{constructor(e,t){this.game=e,this.pos=t.pos.clone(),this.pos.y=t.y??1.2,this.vel=t.vel.clone(),this.radius=t.radius??.35,this.dmg=t.dmg??10,this.team=t.team??"enemy",this.color=t.color??[3,.6,3],this.life=t.life??4,this.homing=t.homing??0,this.pierce=t.pierce??0,this.kind=t.kind??"orb",this.hitSet=new Set,this.alive=!0,this.t=0;const i=t.size??.35;this.group=new St;const n=new bi({map:e.fx.glowTex,color:new ie(...this.color),blending:Mt,depthWrite:!1,transparent:!0});this.sprite=new ji(n),this.sprite.scale.setScalar(i*3.6);const s=new Ue(Dx,new Et({color:new ie(this.color[0]*1.6+1,this.color[1]*1.6+1,this.color[2]*1.6+1)}));s.scale.setScalar(i*.6),this.group.add(this.sprite,s),this.group.position.copy(this.pos),e.scene.add(this.group),this.size=i}update(e){if(this.t+=e,this.life-=e,this.homing&&this.team==="player"){const n=this.game.nearestEnemy(this.pos,9,this.hitSet);if(n){const s=n.pos.x-this.pos.x,r=n.pos.z-this.pos.z,o=Math.hypot(s,r)||1,c=this.vel.length();this.vel.x+=s/o*c*this.homing*e,this.vel.z+=r/o*c*this.homing*e,this.vel.setLength(c)}}this.pos.addScaledVector(this.vel,e),this.group.position.copy(this.pos),this.sprite.scale.setScalar(this.size*(3.4+Math.sin(this.t*30)*.5));const t=this.game.fx,i=this.color;if(t.add.emit({x:this.pos.x+(Math.random()-.5)*.1,y:this.pos.y+(Math.random()-.5)*.1,z:this.pos.z+(Math.random()-.5)*.1,vx:-this.vel.x*.05,vy:.3,vz:-this.vel.z*.05,color:i,color2:[i[0]*.2,i[1]*.2,i[2]*.2],size:this.size*1.6,size2:.02,life:.35,drag:2}),this.life<=0)return this.destroy(!1);if(this.game.level.blocksProjectile(this.pos.x,this.pos.z))return this.destroy(!0)}destroy(e=!0){if(this.alive&&(this.alive=!1,this.game.scene.remove(this.group),this.sprite.material.dispose(),e)){const t=this.game.fx;t.burst(this.pos,{n:14,color:this.color,speed:4,up:2,size:.22,life:.4,y:0}),t.flash(this.pos,new ie(this.color[0]/3,this.color[1]/3,this.color[2]/3),8,6,.15),this.game.audio.playAt(this.kind==="fireball"?"explosion":"orb_hit",this.pos,this.game.player.pos,{volume:this.kind==="fireball"?.5:.45})}}}const Pt={blade:{id:"blade",name:"Emberblade",title:"The Oathkeeper’s Sword",model:"sword",icon:"blade",desc:"Balanced and reliable. A three-strike combo that ends in a sweeping, spinning finisher.",passive:"Ember Edge — your finisher sets foes ablaze.",stats:{dmg:14},grip:.1,attacks:[{clip:"slash1",start:.42,impact:.72,ts:1.8,dur:.4,arc:2.5,range:2.8,dmg:1,lunge:5.5,kb:4,dir:1,sfx:"swing1"},{clip:"slash2",start:.4,impact:.7,ts:1.8,dur:.4,arc:2.5,range:2.8,dmg:1.1,lunge:5.5,kb:4,dir:-1,sfx:"swing2"},{clip:"slash3",start:.9,impact:1.3,ts:1.55,dur:.6,arc:Math.PI*2,range:3.4,dmg:2,lunge:3,kb:10,dir:1,sfx:"swing_heavy",finisher:!0,ignite:6}]},fangs:{id:"fangs",name:"Twin Fangs",title:"Daggers of the Ashen Choir",model:"dagger",offhand:!0,icon:"reach",desc:"Blindingly fast four-strike flurries with short reach. Crits come easily.",passive:"Ambush — strikes within half a second of a dash always crit.",stats:{dmg:9,crit:.12,moveMul:.08},grip:.18,attacks:[{clip:"slash1",start:.45,impact:.72,ts:2.7,dur:.24,arc:2.1,range:2.35,dmg:.85,lunge:7,kb:1.6,dir:1,sfx:"dagger1"},{clip:"slash2",start:.43,impact:.7,ts:2.7,dur:.24,arc:2.1,range:2.35,dmg:.85,lunge:7,kb:1.6,dir:-1,sfx:"dagger2"},{clip:"slash1",start:.45,impact:.72,ts:2.9,dur:.23,arc:2.1,range:2.35,dmg:.95,lunge:7,kb:1.6,dir:1,sfx:"dagger1"},{clip:"slash3",start:.95,impact:1.3,ts:2.3,dur:.4,arc:Math.PI*2,range:2.9,dmg:1.7,lunge:4,kb:6,dir:1,sfx:"swing2",finisher:!0}]},maul:{id:"maul",name:"Ruin Maul",title:"Hammer of the Chained Forge",model:"maul",icon:"crown",desc:"Slow, crushing blows that stagger anything. The finisher shatters the ground itself.",passive:"Unstoppable — you can’t be knocked back mid-swing and take 25% less damage while attacking.",stats:{dmg:22,maxHp:20,moveMul:-.08},grip:.3,attacks:[{clip:"slash2",start:.36,impact:.7,ts:1.15,dur:.6,arc:2.7,range:3.25,dmg:1.25,lunge:4,kb:8,dir:-1,sfx:"hammer_swing",poise:2.2},{clip:"slash1",start:.38,impact:.72,ts:1.15,dur:.6,arc:2.7,range:3.25,dmg:1.35,lunge:4,kb:8,dir:1,sfx:"hammer_swing",poise:2.2},{clip:"slam",start:1.05,impact:1.75,ts:1.35,dur:.95,arc:Math.PI*2,range:4.4,dmg:2.6,lunge:2.5,kb:14,dir:1,sfx:"hammer_swing",finisher:!0,slam:!0,poise:4}]}},Gs=["blade","fangs","maul"],_n={ember:{name:"Ember",main:[3.2,1.2,.3],hot:[4.5,1.6,.35],core:[6,4.2,2.2],deep:[.8,.12,.02],emissive:16734736,light:16752736,css:"#ff8a3a"},azure:{name:"Azure",main:[.5,1.4,3.6],hot:[.6,1.8,4.8],core:[3.2,4.6,6.5],deep:[.02,.15,.8],emissive:2788095,light:8433919,css:"#4fb0ff"},verdant:{name:"Verdant",main:[.8,3.2,.9],hot:[1,4.4,1.1],core:[3.5,6.5,3.5],deep:[.05,.6,.08],emissive:3211104,light:9502624,css:"#5be37a"},void:{name:"Void",main:[2.4,.6,3.6],hot:[3.2,.8,4.8],core:[5.5,3.6,6.5],deep:[.4,.04,.8],emissive:10502399,light:12620031,css:"#c27bff"},crimson:{name:"Crimson",main:[3.6,.35,.3],hot:[4.8,.45,.35],core:[6.5,2.6,2.4],deep:[.8,.02,.02],emissive:16718368,light:16740464,css:"#ff4a4a"},solar:{name:"Solar",main:[3.6,2.8,1],hot:[4.8,3.8,1.3],core:[6.5,6.2,4.6],deep:[.9,.5,.05],emissive:16764992,light:16769184,css:"#ffd25a"},pale:{name:"Pale",main:[2.6,2.9,3.2],hot:[3.6,3.9,4.3],core:[6.5,6.5,6.5],deep:[.3,.35,.45],emissive:13691135,light:15266047,css:"#dfe8f5"}},Th=["ember","azure","verdant","void","crimson","solar","pale"],Ud={idle_combat:"Combat_Stance",run:"Run_02",slash1:"Left_Slash",slash2:"Right_Hand_Sword_Slash",slash3:"Charged_Slash",roll:"Roll_Dodge",hit:"Hit_Reaction",death:"Dead",slam:"Charged_Ground_Slam",idle:"Idle"},Lx=Object.fromEntries(mi.map(a=>[a.id,a])),kx=new T;class Ix{constructor(e,{weapon:t="blade",hue:i="ember"}={}){this.game=e,this.weapon=Pt[t]||Pt.blade,this.attacks=this.weapon.attacks,this.hue=_n[i]||_n.ember,this.model=new Ll(e,"hero",{clips:Ud,rim:[.3,.14,.05],rimPow:3}),this.root=this.model.root,e.scene.add(this.root),this.pos=new T,this.vel=new T,this.yaw=0,this.radius=.5,this.alive=!0,this.boons={},this.gold=0,this.souls=0,this.nova=0,this.potions=1,this.maxPotions=3,this.iframes=0,this.state="move",this.stateT=0,this.combo=0,this.comboWindow=0,this.aimDir=new T(0,0,1),this.orbSprites=[],this.orbHits=new WeakMap,this.orbAngle=0,this.recomputeStats(),this.hp=this.stats.maxHp,this.dashes=this.stats.dashCharges,this.dashTimer=0,this.wardCD=0,this.warded=!1,this.empowerT=0,this.lastDashEnd=-9,this.attachWeapon(),this.light=new vs(this.hue.light,22,12,2),e.scene.add(this.light),this.model.play("idle",{fade:0})}attachWeapon(){const e=this.weapon,t=n=>{const s=this.game.assets.instance(e.model)||this.game.assets.instance("sword");if(!s)return null;const r=s.root,o=s.template.height;return r.position.y=-o*e.grip,r.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.material=l.material.clone(),l.material.emissive=new ie(this.hue.emissive),l.material.emissiveIntensity=0,this.weaponMats.push(l.material))}),{pivot:this.model.attachToBone(n,r,{worldDir:new T(0,0,1),gripOffset:.07,worldScale:1}),len:o}};this.weaponMats=[];const i=t("RightHand");i&&(this.swordPivot=i.pivot,this.swordLen=i.len,this.swordGrip=e.grip),e.offhand&&t("LeftHand")}swordPoint(e,t=new T){return this.swordPivot?this.swordPivot.localToWorld(t.set(0,this.swordLen*(e-this.swordGrip),0)):t.copy(this.pos).setY(1.2)}recomputeStats(){const e=this.game.meta,t=this.weapon.stats,i=this.game.mods||{},n={maxHp:100+10*e.level("vitality")+(this.bonusHp||0)+(t.maxHp||0),dmg:t.dmg,dmgMul:(1+.06*e.level("might")+.08*(this.forge||0))*(i.dmgDealt||1),moveMul:1+.04*e.level("swift")+(t.moveMul||0)+(i.playerTempo||0),atkSpeed:1+(i.playerTempo||0),rangeMul:1,goldMul:(1+.15*e.level("fortune"))*(i.goldMul||1),soulMul:1,crit:.08+(t.crit||0)+.03*e.level("instinct"),critMul:2,dashCharges:2,dashRecharge:.95*(1-.15*e.level("shadow")),burn:0,chain:0,lifeOnKill:0,shards:0,armor:0,execute:0,orbs:0,fireTrail:0,thunderclap:0,novaGain:1,novaHeal:0,novaRadius:1,novaBurnGround:0,phoenix:0,ward:0,empower:0,crescent:0,rhythm:0,venom:0,shadow:0,tremor:0,juggernaut:0,chainExtra:0,chainIgnite:0,orbFire:0,stormStep:0,cull:0,critIgnite:0,critHeal:0,supernova:0,shardAll:0};for(const[s,r]of Object.entries(this.boons))for(let o=0;o<r;o++)Lx[s]?.apply(n,null);this.phoenixUsed&&(n.phoenix=0),this.stats=n,this.hp!==void 0&&(this.hp=Math.min(this.hp,n.maxHp)),this.syncOrbs()}addBoon(e){this.boons[e.id]=(this.boons[e.id]||0)+1;const t=this.stats.maxHp;this.recomputeStats(),e.id==="ironwill"&&this.heal(20+(this.stats.maxHp-t-20)),e.id==="secondwind"&&(this.dashes=Math.min(this.stats.dashCharges,this.dashes+1))}syncOrbs(){const e=this.stats?.orbs||0;for(;this.orbSprites.length<e;){const t=new bi({map:this.game.fx.glowTex,color:new ie(...this.hue.hot),blending:Mt,depthWrite:!1,transparent:!0}),i=new ji(t);i.scale.setScalar(1.1),this.game.scene.add(i),this.orbSprites.push(i)}}heal(e,{raw:t=!1}={}){if(!this.alive)return;t||(e*=this.game.mods?.healMul??1);const i=this.hp;this.hp=Math.min(this.stats.maxHp,this.hp+e);const n=Math.round(this.hp-i);n>0&&this.game.ui.floatText(this.pos,`+${n}`,"heal")}placeAt(e){this.pos.copy(e),this.vel.set(0,0,0),this.root.position.copy(e)}update(e,t){const i=this.game;this.stateT+=e,this.iframes=Math.max(0,this.iframes-e),this.comboWindow=Math.max(0,this.comboWindow-e),this.wardCD=Math.max(0,this.wardCD-e),this.empowerT=Math.max(0,this.empowerT-e);const n=this.stats;this.dashes<n.dashCharges&&(this.dashTimer+=e,this.dashTimer>=n.dashRecharge&&(this.dashes++,this.dashTimer=0,this.dashes===n.dashCharges&&i.ui.pulse("dash"))),this.updateAim(t);const s=t.moveVector(),r=kx.set(s.x,0,s.y),o=r.lengthSq()>.01,c=6.6*n.moveMul;if(this.state==="dead")this.vel.multiplyScalar(Math.exp(-6*e));else if(this.state==="move")if(t.wasPressed("dash")&&this.dashes>0)this.startDash(o?r.clone().normalize():null);else if(t.wasPressed("nova"))this.nova>=100?this.startNova():i.ui.pulse("novaDenied");else if(t.wasPressed("attack")||t.isDown("attack"))this.startAttack(this.comboWindow>0?(this.combo+1)%this.attacks.length:0);else{const d=r.x*c,u=r.z*c,f=1-Math.exp(-(o?16:12)*e);this.vel.x+=(d-this.vel.x)*f,this.vel.z+=(u-this.vel.z)*f;const g=Math.hypot(this.vel.x,this.vel.z);o&&this.turnTo(Math.atan2(r.x,r.z),e,14),g>1?this.model.play("run",{timeScale:Math.max(.75,g/6.6)*1.05,fade:.15}):this.model.play(i.inCombat()?"idle_combat":"idle",{fade:.25}),g>2&&Math.random()<e*6&&i.fx.smoke(this.pos,{n:1,size:.5,life:.6,up:.4,alpha:.25,color:[.12,.1,.09]})}else if(this.state==="attack"){const d=this.attacks[this.combo],u=n.atkSpeed,f=(d.impact-d.start)/d.ts/u,g=d.dur/u,b=this.stateT<f+.05?d.lunge*(1-this.stateT/(f+.05)):0,m=Math.sin(this.yaw),p=Math.cos(this.yaw),v=m*b+r.x*c*.25,_=p*b+r.z*c*.25,x=1-Math.exp(-20*e);this.vel.x+=(v-this.vel.x)*x,this.vel.z+=(_-this.vel.z)*x,!this.hitDone&&this.stateT>=f&&(this.hitDone=!0,this.doAttackHit(d)),this.stateT>f-.1&&this.stateT<f+.14&&this.emitBladeTrail(d.finisher?3:2),d.slam&&!this.hitDone&&i.fx.converge(this.pos,this.hue.main,1,2.5,.8),t.wasPressed("attack")&&this.stateT>f*.4&&(this.queued=!0),this.hitDone&&t.wasPressed("dash")&&this.dashes>0?this.startDash(o?r.clone().normalize():null):this.stateT>=g&&(this.queued||t.isDown("attack")?this.startAttack((this.combo+1)%this.attacks.length):(this.state="move",this.comboWindow=.35))}else if(this.state==="dash"){const d=this.dashDir,u=22;this.vel.set(d.x*u,0,d.z*u);for(let f=0;f<3;f++)i.fx.add.emit({x:this.pos.x+(Math.random()-.5)*.4,y:.4+Math.random()*1.4,z:this.pos.z+(Math.random()-.5)*.4,vx:-d.x*3,vy:.5,vz:-d.z*3,color:this.hue.main,color2:this.hue.deep,size:.35,size2:.02,life:.35,drag:3});n.fireTrail&&(this.trailAcc=(this.trailAcc||0)+u*e,this.trailAcc>.9&&(this.trailAcc=0,i.addGroundFire(this.pos.clone(),1.1,2.6,10*n.fireTrail*n.dmgMul))),n.shadow&&this.shadowStrike(),this.stateT>=.2&&this.endDash()}else this.state==="nova"&&(this.vel.multiplyScalar(Math.exp(-10*e)),i.fx.converge(this.pos,this.hue.main,2,3.5,1.2),!this.hitDone&&this.stateT>=.5&&(this.hitDone=!0,i.novaBlast(this)),this.stateT>=.85&&(this.state="move"));const l=Math.max(1,Math.ceil(Math.hypot(this.vel.x,this.vel.z)*e/.25));for(let d=0;d<l;d++)this.pos.x+=this.vel.x*e/l,this.pos.z+=this.vel.z*e/l,i.level.collide(this.pos,this.radius);this.pos.y=0,this.root.position.copy(this.pos),this.root.rotation.y=this.yaw,this.model.update(e),this.root.visible=!(this.hurtBlink>0&&Math.floor(this.hurtBlink*30)%2===0),this.hurtBlink>0&&(this.hurtBlink-=e),this.light.position.set(this.pos.x,2.9,this.pos.z+.6),this.light.intensity=22+Math.sin(i.time*9)*1.2+(this.state==="nova"?30:0)+(this.empowerT>0?10:0);const h=this.state==="attack"||this.state==="nova"?1.1:this.empowerT>0?.8:this.nova>=100?.35:0;for(const d of this.weaponMats)d.emissiveIntensity+=(h-d.emissiveIntensity)*Math.min(1,e*12);this.warded&&Math.random()<.5&&i.fx.mote(this.pos,[.8,1.6,3],1.4),this.empowerT>0&&Math.random()<.6&&i.fx.ember(this.pos,this.hue.hot,1.2),this.updateOrbs(e)}turnTo(e,t,i){let n=e-this.yaw;n=Math.atan2(Math.sin(n),Math.cos(n)),this.yaw+=n*Math.min(1,t*i)}updateAim(e){const t=this.game,i=e.aimStick();if(i)this.aimDir.set(i.x,0,i.y).normalize(),this.aimSource="stick";else if(e.usingPad){const n=e.moveVector();Math.hypot(n.x,n.y)>.2?this.aimDir.set(n.x,0,n.y).normalize():this.aimDir.set(Math.sin(this.yaw),0,Math.cos(this.yaw)),this.aimSource="pad"}else{const n=t.mouseWorld,s=n.x-this.pos.x,r=n.z-this.pos.z,o=Math.hypot(s,r);o>.2&&this.aimDir.set(s/o,0,r/o),this.aimSource="mouse"}}startAttack(e){const t=this.game,i=this.attacks[e];this.combo=e,this.state="attack",this.stateT=0,this.hitDone=!1,this.queued=!1;let n=this.aimDir.clone(),s=null,r=1/0;for(const c of t.enemies){if(!c.alive||c.state==="spawning")continue;const l=c.pos.x-this.pos.x,h=c.pos.z-this.pos.z,d=Math.hypot(l,h);if(d>i.range*this.stats.rangeMul+c.radius+1.6)continue;const u=Math.acos(Math.max(-1,Math.min(1,(l*n.x+h*n.z)/(d||1))));if(u>.75)continue;const f=d+u*3;f<r&&(r=f,s={dx:l,dz:h,d})}s&&n.set(s.dx/s.d,0,s.dz/s.d),this.yaw=Math.atan2(n.x,n.z);const o=this.stats.atkSpeed;this.model.play(i.clip,{loop:!1,start:i.start,timeScale:i.ts*o,fade:.06,force:!0}),t.audio.play(i.sfx,{volume:i.finisher?.7:.55,rateVar:.1}),this.ambush=t.time-this.lastDashEnd<.5&&this.weapon.id==="fangs"}emitBladeTrail(e){const t=this.game.fx;for(let i=0;i<e;i++){const n=.35+Math.random()*.65,s=this.swordPoint(n);t.add.emit({x:s.x,y:s.y,z:s.z,vx:(Math.random()-.5)*.5,vy:.6,vz:(Math.random()-.5)*.5,color:this.hue.hot,color2:this.hue.deep,size:.28,size2:.02,life:.28,drag:2})}}doAttackHit(e){const t=this.game,i=this.stats,n=this.hue,s=e.range*i.rangeMul;e.slam||t.fx.slash(this.pos,this.yaw,{radius:s,arc:e.arc,dir:e.dir,y:e.finisher?.9:1.05,dur:e.finisher?.3:.2,color:e.finisher?n.hot:n.main,core:n.core,inner:e.finisher?.25:.4}),e.finisher&&(t.fx.ring(this.pos,s*1.05,{color:n.main,dur:.35,width:.18}),t.shake(.25)),e.slam&&this.slamFx(s);let r=0;const o=Math.sin(this.yaw),c=Math.cos(this.yaw),l=1+i.rhythm*this.combo;for(const d of t.enemies){if(!d.alive||d.state==="spawning")continue;const u=d.pos.x-this.pos.x,f=d.pos.z-this.pos.z,g=Math.hypot(u,f);if(g>s+d.radius||e.arc<6&&Math.acos(Math.max(-1,Math.min(1,(u*o+f*c)/(g||1))))>e.arc/2+Math.atan2(d.radius,Math.max(.5,g)))continue;const b=new T(u,0,f).normalize();t.hitEnemy(d,i.dmg*e.dmg*l,{dir:b,kb:e.kb,source:"melee",finisher:e.finisher,forceCrit:this.ambush,poise:e.poise||1,ignite:e.ignite||0}),r++}for(const d of t.level.breakables){if(d.broken)continue;const u=d.pos.x-this.pos.x,f=d.pos.z-this.pos.z,g=Math.hypot(u,f);g>s+d.radius||e.arc<6&&(u*o+f*c)/(g||1)<Math.cos(e.arc/2)||t.breakProp(d)}if(r){const d=e.finisher||this.weapon.id==="maul";t.hitStop(d?.085:this.weapon.id==="fangs"?.03:.045),t.shake(d?.3:.12),this.weapon.id==="maul"&&t.audio.play("hammer_impact",{volume:e.slam?.9:.55,rateVar:.1,throttle:60})}if(i.tremor&&this.weapon.id==="maul"){const d=new T(this.pos.x+o*s*.7,0,this.pos.z+c*s*.7),u=2.4+i.tremor*.5;t.fx.ring(d,u,{color:[3,1.6,.6],dur:.35,width:.25}),t.fx.debris(d,[.25,.2,.18],8);for(const f of t.enemies)f.alive&&f.state!=="spawning"&&f.pos.distanceTo(d)<u+f.radius&&t.hitEnemy(f,i.dmg*.45*i.tremor,{dir:f.pos.clone().sub(d).normalize(),kb:5,source:"tremor",noCrit:!0})}const h=(e.finisher?i.shards:0)+(i.shardAll?1:0);for(let d=0;d<h;d++){const u=this.yaw+(d-(h-1)/2)*.35,f=new T(Math.sin(u),0,Math.cos(u)).multiplyScalar(15);t.projectiles.push(new Js(t,{pos:this.pos,vel:f,team:"player",dmg:8+i.dmg*.4,color:n.hot,size:.22,life:1.4,homing:2.5,kind:"shard"}))}if(e.finisher&&i.crescent){const d=i.crescent;for(let u=0;u<d;u++){const f=this.yaw+(u-(d-1)/2)*.4,g=new T(Math.sin(f),0,Math.cos(f)).multiplyScalar(17);t.projectiles.push(new Js(t,{pos:this.pos,vel:g,team:"player",dmg:i.dmg*1.4,color:n.hot,size:.6,life:.75,pierce:99,kind:"wave",radius:1.1}))}t.audio.play("fireball",{volume:.45,rate:1.3})}}slamFx(e){const t=this.game,i=this.hue,n=new T(Math.sin(this.yaw),0,Math.cos(this.yaw)),s=this.pos.clone().addScaledVector(n,1.2);t.fx.ring(s,e*1.05,{color:i.main,dur:.45,width:.22}),t.fx.ring(s,e*.55,{color:i.hot,dur:.3,width:.18}),t.fx.burst(s,{n:34,color:i.main,color2:i.deep,speed:e*1.8,up:4,size:.22,life:.55,gravity:6,y:.2}),t.fx.debris(s,[.25,.2,.18],26),t.fx.smoke(s,{n:7,size:1.5,life:1,spread:e*.7,color:[.1,.08,.07],alpha:.5}),t.fx.decal("scorch",s,e*1.5,{life:10,opacity:.8}),t.fx.flash(s,new ie(i.light),14,e*2.4,.22),t.shake(.5),t.hitStop(.06)}shadowStrike(){const e=this.game;for(const t of e.enemies)!t.alive||t.state==="spawning"||this.dashHit.has(t)||Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z)<t.radius+1&&(this.dashHit.add(t),e.fx.slash(t.pos,this.yaw,{radius:1.4,arc:2.5,dir:1,y:1.1,dur:.16,color:[1.6,.5,2.6],core:[4,3,6],inner:.4}),e.hitEnemy(t,this.stats.dmg*1.2*this.stats.shadow,{dir:this.dashDir.clone(),kb:3,source:"melee",forceCrit:!0}))}startDash(e){const t=this.game;this.dashDir=e?e.clone():new T(Math.sin(this.yaw),0,Math.cos(this.yaw)),this.yaw=Math.atan2(this.dashDir.x,this.dashDir.z),this.state="dash",this.stateT=0,this.dashes--,this.iframes=Math.max(this.iframes,.3),this.trailAcc=0,this.dashHit=new Set,this.model.play("roll",{loop:!1,start:.25,timeScale:3.4,fade:.05,force:!0}),t.audio.play("dash",{volume:.5}),t.fx.burst(this.pos,{n:10,color:this.hue.main,speed:3,up:1,size:.25,life:.4,y:.2}),t.ui.pulse("dashUsed"),this.stats.ward&&this.wardCD<=0&&!this.warded&&(this.warded=!0,this.wardCD=8,t.fx.ring(this.pos,1.4,{color:[.8,1.6,3],dur:.4,width:.2})),this.stats.stormStep&&this.thunderclap(.7)}endDash(){this.state="move",this.comboWindow=0,this.vel.multiplyScalar(.35),this.lastDashEnd=this.game.time,this.stats.thunderclap&&this.thunderclap(1)}thunderclap(e){const t=this.game,i=this.stats.thunderclap;if(!i)return;const n=(3.6+i*.6)*(e<1?.8:1);t.fx.ring(this.pos,n,{color:[1.2,2.2,6],dur:.35,width:.3}),t.fx.burst(this.pos,{n:26,color:[1.5,2.5,6],speed:9,up:1,size:.2,life:.3,gravity:0,y:.6}),t.fx.flash(this.pos,8038655,30,9,.2),t.audio.play("lightning",{volume:.5,throttle:60});for(const s of t.enemies){if(!s.alive)continue;s.pos.distanceTo(this.pos)<n+s.radius&&t.hitEnemy(s,16*i*e*this.stats.dmgMul,{dir:s.pos.clone().sub(this.pos).normalize(),kb:6,source:"lightning",noCrit:!0,color:"shock"})}}startNova(){const e=this.game;this.state="nova",this.stateT=0,this.hitDone=!1,this.nova=0,this.iframes=Math.max(this.iframes,.95),this.vel.set(0,0,0),this.model.play("slam",{loop:!1,start:1,timeScale:1.5,fade:.08,force:!0}),e.audio.play("cast",{volume:.6,rate:.7}),e.fx.runeCircle(this.pos,4*this.stats.novaRadius,{color:this.hue.main,dur:.9,spin:3}),e.ui.pulse("nova"),e.runStats.novas++}gainNova(e){if(this.state==="nova")return;const t=this.nova;this.nova=Math.min(100,this.nova+e*this.stats.novaGain),t<100&&this.nova>=100&&(this.game.audio.play("levelup",{volume:.4,rate:1.2}),this.game.ui.pulse("novaReady"))}usePotion(){const e=this.game;if(!(this.potions<=0||!this.alive)){if(this.hp>=this.stats.maxHp){e.ui.toast("Already at full health","",1.2);return}this.potions--,e.runStats.potionsUsed++,this.heal(Math.round(this.stats.maxHp*.45)),e.audio.play("potion",{volume:.7}),e.fx.burst(this.pos,{n:30,color:[3.5,.4,.5],speed:2.5,up:4,size:.25,life:.8,gravity:-1,y:.4}),e.fx.ring(this.pos,2.2,{color:[3,.4,.5],dur:.5})}}takeDamage(e,t,{kb:i=4,unblockable:n=!1}={}){const s=this.game;if(!this.alive||s.state!=="playing"||this.iframes>0&&!n)return!1;if(this.warded&&!n)return this.warded=!1,this.iframes=.5,s.fx.ring(this.pos,2,{color:[.8,1.6,3],dur:.35,width:.3}),s.fx.burst(this.pos,{n:24,color:[.8,1.6,3.5],speed:5,up:3,size:.2,life:.4,y:1}),s.audio.play("orb_hit",{volume:.6,rate:.7}),s.ui.floatText(new T(this.pos.x,2.4,this.pos.z),"Warded","heal"),!0;let r=s.mods?.dmgTaken??1;this.state==="attack"&&this.weapon.id==="maul"&&(r*=.75,i=0),this.state==="attack"&&this.stats.juggernaut&&(r*=.7);const c=Math.max(1,Math.round(e*r*(1-this.stats.armor)));if(this.hp-=c,this.iframes=.65,this.hurtBlink=.65,this.model.flash([3,.3,.2],.25),t){const l=this.pos.x-t.x,h=this.pos.z-t.z,d=Math.hypot(l,h)||1;this.vel.x+=l/d*i,this.vel.z+=h/d*i}return s.onPlayerHurt(c),this.checkDeath(),!0}loseHealth(e){this.alive&&(this.hp-=e,this.game.encounter&&(this.game.encounter.hurt=!0),this.checkDeath())}checkDeath(){this.hp>0||(this.stats.phoenix>0&&!this.phoenixUsed?(this.phoenixUsed=!0,this.recomputeStats(),this.hp=Math.round(this.stats.maxHp*.5),this.iframes=2.5,this.game.phoenixRise(this)):(this.hp=0,this.die()))}die(){this.alive=!1,this.state="dead",this.stateT=0,this.model.play("death",{loop:!1,fade:.1,timeScale:1.1,force:!0}),this.game.onPlayerDeath()}updateOrbs(e){const t=this.game,i=this.stats.orbs;this.orbAngle+=e*3.2;for(let n=0;n<this.orbSprites.length;n++){const s=this.orbSprites[n];if(s.visible=n<i&&this.alive&&t.state!=="title",!s.visible)continue;const r=this.orbAngle+n/i*Math.PI*2;s.position.set(this.pos.x+Math.cos(r)*2.3,1.2+Math.sin(this.orbAngle*2+n)*.15,this.pos.z+Math.sin(r)*2.3),s.scale.setScalar(1+Math.sin(t.time*20+n)*.1),t.fx.add.emit({x:s.position.x,y:s.position.y,z:s.position.z,vy:.5,color:this.hue.hot,color2:this.hue.deep,size:.35,size2:.02,life:.3}),this.stats.orbFire&&t.inCombat()&&(s.userData.fireAcc=(s.userData.fireAcc||0)+e,s.userData.fireAcc>.45&&(s.userData.fireAcc=0,t.addGroundFire(new T(s.position.x,0,s.position.z),.9,2,8*this.stats.dmgMul)));for(const o of t.enemies){if(!o.alive||o.state==="spawning")continue;if(Math.hypot(o.pos.x-s.position.x,o.pos.z-s.position.z)<o.radius+.5){const l=this.orbHits.get(o)||0;t.time-l>.45&&(this.orbHits.set(o,t.time),t.hitEnemy(o,7*this.stats.dmgMul,{dir:o.pos.clone().sub(this.pos).normalize(),kb:2,source:"orb",noCrit:!0,color:"burn"}))}}}}dispose(){this.game.scene.remove(this.root),this.game.scene.remove(this.light);for(const e of this.orbSprites)this.game.scene.remove(e)}}const dr={skeleton:{name:"Bone Warden",model:"skeleton",clips:{idle:"Combat_Stance",walk:"Walk_Fight_Forward",attack:"Attack",hit:"Hit_Reaction",death:"Dead"},hp:46,speed:3.4,radius:.5,dmg:12,poise:0,mass:1,rim:[.1,.25,.7],ichor:[.7,.66,.52],hitSfx:"hit_bone",deathSfx:"death_bones",gold:[1,3],souls:[1,1],cost:1},cultist:{name:"Ashen Cultist",model:"cultist",clips:{idle:"Idle",walk:"Sneaky_Walk",cast:"mage_soell_cast",cast2:"Charged_Spell_Cast",hit:"Hit_Reaction",death:"dying_backwards"},hp:34,speed:3,radius:.5,dmg:11,poise:0,mass:1,rim:[.45,.1,.8],ichor:[.32,.04,.42],hitSfx:"hit_flesh",deathSfx:"death_monster",gold:[2,4],souls:[1,2],cost:1.5},wraith:{name:"Hollow Wraith",model:"wraith",clips:{},hp:26,speed:4.6,radius:.55,dmg:11,poise:0,mass:.8,flying:!0,rim:[.1,.55,.8],ichor:[.1,.45,.55],hitSfx:"hit_flesh",deathSfx:"wraith",gold:[1,2],souls:[1,2],cost:1},brute:{name:"Chained Brute",model:"brute",clips:{idle:"Combat_Stance",walk:"Slow_Orc_Walk",slam:"Charged_Ground_Slam",swing:"Heavy_Hammer_Swing",charge:"Standard_Forward_Charge",hit:"Hit_Reaction",death:"Knock_Down"},hp:165,speed:2.6,radius:.95,dmg:24,poise:50,mass:3,rim:[.35,.2,.08],ichor:[.3,.04,.03],hitSfx:"hit_flesh",deathSfx:"death_brute",gold:[5,9],souls:[3,4],cost:3},boss:{name:"Vorthak, the Cinder King",model:"boss",clips:{idle:"Combat_Stance",walk:"Slow_Orc_Walk",slam:"Charged_Ground_Slam",swing:"Heavy_Hammer_Swing",cast:"Charged_Spell_Cast",charge:"Standard_Forward_Charge",roar:"Chest_Pound_Taunt",death:"Dead",hit:"Hit_Reaction"},hp:2600,speed:2.7,radius:1.7,dmg:28,poise:9999,mass:20,rim:[.6,.18,.04],ichor:[.5,.1,.02],hitSfx:"hit_flesh",deathSfx:"boss_roar",gold:[80,100],souls:[60,60],cost:99}},Fx=new T;class Nd{constructor(e,t,i,{elite:n=!1,floor:s=0,fast:r=!1,champion:o=null,risen:c=!1}={}){this.game=e,this.type=t;const l=this.def=dr[t],h=e.mods||{};this.champion=o,this.risen=c,o&&(n=!0),this.elite=n;const d=o?1.42:n?1.18:1;this.scale=d,this.maxHp=Math.round(l.hp*(1+.24*s)*(o?7.5*(h.bossHp||1):n?2.3:1)*(h.enemyHp||1)*(c?.6:1)),this.hp=this.maxHp,this.dmg=l.dmg*(1+.12*s)*(o?1.4:n?1.3:1)*(h.enemyDmg||1),this.speed=l.speed*(n?1.08:1)*(1+Math.min(s,12)*.02),this.radius=l.radius*d,this.mass=l.mass*d*(o?2:1),this.poiseMax=o?Math.max(l.poise*3,this.maxHp*.12):l.poise*(n?1.5:1),this.poison=0,this.poisonT=0,this.poise=this.poiseMax,this.floor=s,this.model=new Ll(e,l.model,{clips:l.clips,rim:o?[.85,.28,.05]:n?[1.1,.35,.06]:l.rim.map(u=>u*.45),rimPow:o?2.6:n?2.2:3,scale:d,dissolveColor:t==="wraith"?[.6,2.2,3]:t==="cultist"?[2.2,.6,3.2]:[3,1.2,.3]}),this.root=this.model.root,e.scene.add(this.root),this.pos=i.clone(),this.pos.y=0,this.vel=new T,this.yaw=Math.random()*Math.PI*2,this.alive=!0,this.state="spawning",this.stateT=0,this.attackCD=.8+Math.random()*1.2,this.blinkCD=2,this.slamCD=1,this.chargeCD=2+Math.random()*2,this.burnDps=0,this.burnT=0,this.strafe=Math.random()<.5?1:-1,this.flyY=0,this.tele=null,this.hitCount=0,this.makeHpBar(),t==="wraith"&&this.model.setDissolve(.99),this.root.position.copy(this.pos),this.root.position.y=l.flying?.4:-2.2,e.fx.runeCircle(this.pos,1.6*d,{color:n?[3.5,1.2,.2]:[2.4,.4,.3],dur:1.3,spin:2}),e.fx.smoke(this.pos,{n:6,size:1.2,life:1,color:[.03,.02,.03],alpha:.6}),this.model.play("idle",{fade:0})}makeHpBar(){const e=new St,t=this.champion?2.2:this.type==="brute"?1.6:1.1,i=(s,r)=>{const o=new ji(new bi({color:s,transparent:!0,opacity:r,depthTest:!1,depthWrite:!1}));return o.center.set(0,.5),o.scale.set(t,.11,1),o.position.x=-t/2,o.renderOrder=50,o},n=i(0,.65);n.scale.set(t+.06,.17,1),n.position.x=-t/2-.03,this.hpTrail=i(16769216,.9),this.hpFill=i(this.elite?16751146:14164010,1),e.add(n,this.hpTrail,this.hpFill),e.visible=!1,this.hpBar=e,this.hpW=t,this.trailFrac=1,this.game.scene.add(e)}get headY(){return(this.model.model&&this.game.assets.templates.get(this.def.model)?.height||2)*this.scale+.35+(this.def.flying?this.flyY:0)}setState(e){!this.alive&&e!=="dead"||(this.state=e,this.stateT=0)}clearTele(){this.tele&&(this.tele.remove(),this.tele=null)}faceToward(e,t,i=10){let s=Math.atan2(e.x-this.pos.x,e.z-this.pos.z)-this.yaw;s=Math.atan2(Math.sin(s),Math.cos(s)),this.yaw+=s*Math.min(1,t*i)}moveToward(e,t,i,n=!0){const s=this.game;let r=e.x-this.pos.x,o=e.z-this.pos.z;const c=Math.hypot(r,o)||1;if(r/=c,o/=c,n&&!s.level.clearPath(this.pos,e,this.radius*.8)){const l=s.level.flowDir(this.pos);l&&(r=l.x,o=l.z)}this.steer(r*t,o*t,i),t>.1&&this.faceToward({x:this.pos.x+r,z:this.pos.z+o},i,8)}steer(e,t,i,n=10){const s=1-Math.exp(-n*i);this.vel.x+=(e-this.vel.x)*s,this.vel.z+=(t-this.vel.z)*s}update(e){const t=this.game,i=t.player;if(this.stateT+=e,this.attackCD-=e,this.blinkCD-=e,this.slamCD-=e,this.chargeCD-=e,this.state==="dead")return this.updateDead(e);if(this.state==="spawning"){const r=Math.min(1,this.stateT/.9);this.def.flying?this.model.setDissolve(1-r):this.root.position.y=-2.2*(1-r)*(1-r),r>=1&&(this.setState("chase"),this.model.setDissolve(0)),this.root.position.x=this.pos.x,this.root.position.z=this.pos.z,this.faceToward(i.pos,e,4),this.root.rotation.y=this.yaw,this.model.update(e);return}if(this.poisonT>0&&this.poison>0){if(this.poisonT-=e,this.poisonAcc=(this.poisonAcc||0)+this.poison*(t.player.stats.venom||2)*e,this.poisonAcc>=3&&(t.hitEnemy(this,this.poisonAcc,{source:"burn",noCrit:!0,kb:0,silent:!0,color:"poison"}),this.poisonAcc=0,!this.alive))return;Math.random()<.25&&t.fx.add.emit({x:this.pos.x+(Math.random()-.5)*.6,y:.5+Math.random()*1.2,z:this.pos.z+(Math.random()-.5)*.6,vy:.8,color:[.6,2.4,.4],color2:[.05,.3,.02],size:.25,size2:.02,life:.6}),this.poisonT<=0&&(this.poison=0)}if(this.burnT>0){if(this.burnT-=e,this.burnAcc=(this.burnAcc||0)+this.burnDps*e,this.burnAcc>=4&&(t.hitEnemy(this,this.burnAcc,{source:"burn",noCrit:!0,kb:0,silent:!0,color:"burn"}),this.burnAcc=0,!this.alive))return;Math.random()<.6&&t.fx.flame(new T(this.pos.x+(Math.random()-.5)*.6,.6+Math.random()*1.2,this.pos.z+(Math.random()-.5)*.6),.5),this.burnT<=0&&(this.burnDps=0)}this.state==="stagger"?(this.vel.multiplyScalar(Math.exp(-7*e)),this.stateT>(this.staggerDur||.3)&&this.setState("chase")):this.think(e,i);const n=Math.max(1,Math.ceil(Math.hypot(this.vel.x,this.vel.z)*e/.3));let s=!1;for(let r=0;r<n;r++)this.pos.x+=this.vel.x*e/n,this.pos.z+=this.vel.z*e/n,t.level.collide(this.pos,this.radius)&&(s=!0);if(this.bonked=s,this.root.position.set(this.pos.x,this.def.flying?this.flyY:0,this.pos.z),this.root.rotation.y=this.yaw,this.def.flying){this.flyY=.35+Math.sin(t.time*2.4+this.pos.x)*.18;const r=Math.hypot(this.vel.x,this.vel.z);this.root.rotation.x=Math.min(.5,r*.04),Math.random()<.5&&t.fx.add.emit({x:this.pos.x+(Math.random()-.5)*.6,y:this.flyY+.3+Math.random()*.6,z:this.pos.z+(Math.random()-.5)*.6,vx:-this.vel.x*.2,vy:-.2,vz:-this.vel.z*.2,color:[.25,1.1,1.5],color2:[.02,.1,.2],size:.5,size2:.05,life:.7,drag:1})}this.elite&&Math.random()<(this.champion?.9:.35)&&t.fx.ember(this.pos,[3.5,1.1,.2],this.champion?2.2:1.4),this.model.update(e),this.updateHpBar(e)}updateHpBar(e){const t=Math.max(0,this.hp/this.maxHp);this.hpBar.visible=this.alive&&(t<1||this.elite)&&this.state!=="spawning"&&!this.champion,this.hpBar.position.set(this.pos.x,this.headY,this.pos.z),this.hpFill.scale.x=this.hpW*t,this.trailFrac+=(t-this.trailFrac)*Math.min(1,e*4),this.hpTrail.scale.x=this.hpW*this.trailFrac}think(e,t){const i=this["think_"+this.type];i&&i.call(this,e,t)}think_skeleton(e,t){const i=this.game,n=Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z),s=.62;switch(this.state){case"chase":n<2.4+this.radius&&this.attackCD<=0&&t.alive?(this.setState("windup"),this.vel.multiplyScalar(.2),this.model.play("attack",{loop:!1,start:.3,timeScale:(1.03-.3)/s,fade:.1,force:!0}),this.tele=i.fx.telegraph("cone",this.pos,{radius:2.7,arc:1.7,yaw:this.yaw}),i.audio.playAt("telegraph",this.pos,t.pos,{volume:.3})):t.alive?(this.moveToward(t.pos,n<1.6?0:this.speed,e),this.model.play("walk",{timeScale:1.3,fade:.2})):(this.steer(0,0,e),this.model.play("idle"));break;case"windup":this.steer(0,0,e),this.stateT<s*.65&&this.faceToward(t.pos,e,5),this.tele?.move(this.pos,this.yaw),this.tele?.set(this.stateT/s),this.stateT>=s&&(this.clearTele(),this.strikeCone(2.7,1.7,this.dmg),i.fx.slash(this.pos,this.yaw,{radius:2.5,arc:1.8,color:[1.1,.18,.12],core:[1.8,.6,.4],dir:1,dur:.18}),i.audio.playAt("swing2",this.pos,t.pos,{volume:.45,rate:.85}),this.vel.set(Math.sin(this.yaw)*4,0,Math.cos(this.yaw)*4),this.setState("recover"));break;case"recover":this.steer(0,0,e,6),this.stateT>.55&&(this.setState("chase"),this.attackCD=.9+Math.random()*.8);break}}strikeCone(e,t,i){const n=this.game.player,s=n.pos.x-this.pos.x,r=n.pos.z-this.pos.z,o=Math.hypot(s,r);return o>e+n.radius||Math.acos(Math.max(-1,Math.min(1,(s*Math.sin(this.yaw)+r*Math.cos(this.yaw))/(o||1))))>t/2+.15?!1:n.takeDamage(i,this.pos,{kb:6})}think_cultist(e,t){const i=this.game,n=t.pos.x-this.pos.x,s=t.pos.z-this.pos.z,r=Math.hypot(n,s),o=i.level.los(this.pos,t.pos),c=.8;switch(this.state){case"chase":{if(r<3.4&&this.blinkCD<=0)return this.blink();if(o&&this.attackCD<=0&&r<14&&t.alive){this.setState("windup"),this.model.play("cast",{loop:!1,start:0,timeScale:.5/c,fade:.1,force:!0}),i.audio.playAt("cast",this.pos,t.pos,{volume:.5}),this.tele=i.fx.telegraph("rect",this.pos,{length:10,width:.35,yaw:this.yaw,color:[1.2,.15,1.6],alpha:.3});break}if(!o||r>10)this.moveToward(t.pos,this.speed,e);else if(r<5.5){const l=-n/r,h=-s/r;this.steer(l*this.speed+-h*this.strafe*1.2,h*this.speed+l*this.strafe*1.2,e),this.faceToward(t.pos,e,6)}else Math.random()<e*.4&&(this.strafe*=-1),this.steer(-s/r*this.strafe*this.speed*.6,n/r*this.strafe*this.speed*.6,e),this.faceToward(t.pos,e,6);this.bonked&&(this.strafe*=-1),this.model.play(Math.hypot(this.vel.x,this.vel.z)>.6?"walk":"idle",{timeScale:1.4,fade:.2});break}case"windup":{this.steer(0,0,e),this.faceToward(t.pos,e,8),this.tele?.move(this.pos,this.yaw),this.tele?.set(this.stateT/c);const l=Fx.set(this.pos.x+Math.sin(this.yaw)*.6,1.5,this.pos.z+Math.cos(this.yaw)*.6);if(i.fx.converge(l,[2.2,.5,3.2],2,1,1.5),this.stateT>=c){this.clearTele();const h=this.floor>=3||this.elite?5:3,d=8.5+this.floor*.35;for(let u=0;u<h;u++){const f=this.yaw+(u-(h-1)/2)*.2,g=new T(Math.sin(f)*d,0,Math.cos(f)*d);i.projectiles.push(new Js(i,{pos:new T(l.x,0,l.z),y:1.3,vel:g,dmg:this.dmg,color:[1.7,.3,2.4],size:.26,life:3}))}i.fx.flash(l,11555071,18,7,.2),this.setState("recover")}break}case"recover":this.steer(0,0,e),this.stateT>.5&&(this.setState("chase"),this.attackCD=2.2+Math.random()*1.2);break}}blink(){const e=this.game,t=e.level.roomAtWorld(this.pos.x,this.pos.z)||e.currentRoom;let i=null;for(let n=0;n<20&&t;n++){const s=e.level.randomFloorInRoom(t,Math.random,1),r=s.distanceTo(e.player.pos);if(r>6.5&&r<11&&e.level.los(s,e.player.pos)){i=s;break}}this.blinkCD=5+Math.random()*2,i&&(e.fx.smoke(this.pos,{n:12,color:[.08,.02,.1],size:1.4,life:.9}),e.fx.burst(this.pos,{n:20,color:[2.2,.4,3.2],speed:4,up:2,size:.25,life:.5,y:.8}),e.audio.playAt("portal",this.pos,e.player.pos,{volume:.25,rate:1.6}),this.pos.copy(i),this.vel.set(0,0,0),e.fx.burst(this.pos,{n:20,color:[2.2,.4,3.2],speed:4,up:2,size:.25,life:.5,y:.8}),this.attackCD=Math.min(this.attackCD,.6))}think_wraith(e,t){const i=this.game,n=t.pos.x-this.pos.x,s=t.pos.z-this.pos.z,r=Math.hypot(n,s),o=.6;switch(this.state){case"chase":{if(this.attackCD<=0&&r<8.5&&i.level.los(this.pos,t.pos)&&t.alive){this.setState("windup"),this.swoopDir=new T(n/r,0,s/r),this.tele=i.fx.telegraph("rect",this.pos,{length:10,width:1.6,yaw:Math.atan2(n,s),color:[.4,1.6,2.4]}),i.audio.playAt("wraith",this.pos,t.pos,{volume:.55});break}const l=(r-5)*.8,h=n/r*l+-s/r*this.strafe*this.speed*.7,d=s/r*l+n/r*this.strafe*this.speed*.7,u=Math.hypot(h,d)||1,f=Math.min(this.speed,u);i.level.clearPath(this.pos,t.pos,.4)?this.steer(h/u*f,d/u*f,e,4):this.moveToward(t.pos,this.speed,e),this.bonked&&(this.strafe*=-1),this.faceToward(t.pos,e,6);break}case"windup":{if(this.steer(-this.swoopDir.x*1.5,-this.swoopDir.z*1.5,e),this.stateT<o*.5){const c=Math.hypot(n,s)||1;this.swoopDir.set(n/c,0,s/c)}this.yaw=Math.atan2(this.swoopDir.x,this.swoopDir.z),this.tele?.move(this.pos,this.yaw),this.tele?.set(this.stateT/o),this.stateT>=o&&(this.clearTele(),this.setState("attack"),this.hitPlayer=!1);break}case"attack":{this.vel.set(this.swoopDir.x*17,0,this.swoopDir.z*17),!this.hitPlayer&&Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z)<this.radius+t.radius+.2&&(this.hitPlayer=t.takeDamage(this.dmg,this.pos,{kb:7})||!0),(this.stateT>.55||this.bonked)&&(this.setState("recover"),this.vel.multiplyScalar(.3));break}case"recover":this.steer(0,0,e,3),this.stateT>.8&&(this.setState("chase"),this.attackCD=1.8+Math.random()*1.4,this.strafe=Math.random()<.5?1:-1);break}}think_brute(e,t){const i=this.game,n=t.pos.x-this.pos.x,s=t.pos.z-this.pos.z,r=Math.hypot(n,s),o=1.15,c=.9;switch(this.state){case"chase":r<3.8&&this.slamCD<=0&&t.alive?(this.setState("slam"),this.vel.multiplyScalar(.1),this.model.play("slam",{loop:!1,start:.55,timeScale:(1.75-.55)/o,fade:.12,force:!0}),this.tele=i.fx.telegraph("circle",this.slamPoint(),{radius:3.2}),i.audio.playAt("brute_roar",this.pos,t.pos,{volume:.4,rate:1.1})):r>5&&r<13&&this.chargeCD<=0&&i.level.clearPath(this.pos,t.pos,this.radius)&&t.alive?(this.setState("chargeWindup"),this.vel.set(0,0,0),this.model.play("idle",{fade:.1}),this.tele=i.fx.telegraph("rect",this.pos,{length:13,width:2.4,yaw:this.yaw}),i.audio.playAt("brute_roar",this.pos,t.pos,{volume:.6}),this.model.flash([2,.3,.1],c)):t.alive?(this.moveToward(t.pos,r<2.5?0:this.speed,e),this.model.play("walk",{timeScale:1.6,fade:.25})):this.steer(0,0,e);break;case"slam":{this.steer(0,0,e),this.stateT<o*.6&&this.faceToward(t.pos,e,2.5);const l=this.slamPoint();this.tele?.move(l),this.tele?.set(this.stateT/o),this.stateT>=o&&(this.clearTele(),this.slamImpact(l,3.2,this.dmg),this.setState("recover"),this.slamCD=2.4+Math.random());break}case"chargeWindup":this.steer(0,0,e),this.stateT<c*.75&&this.faceToward(t.pos,e,4),this.tele?.move(this.pos,this.yaw),this.tele?.set(this.stateT/c),this.stateT>=c&&(this.clearTele(),this.setState("charging"),this.chargeDir=new T(Math.sin(this.yaw),0,Math.cos(this.yaw)),this.hitPlayer=!1,this.model.play("charge",{timeScale:1.3,fade:.08}),i.audio.playAt("charge",this.pos,t.pos,{volume:.6}));break;case"charging":{this.vel.set(this.chargeDir.x*14,0,this.chargeDir.z*14),Math.random()<.6&&i.fx.smoke(this.pos,{n:1,size:.8,life:.6,up:.6,alpha:.4,color:[.12,.1,.09]}),!this.hitPlayer&&Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z)<this.radius+t.radius+.3&&(this.hitPlayer=!0,t.takeDamage(this.dmg,this.pos,{kb:14}),i.shake(.4)),this.bonked&&this.stateT>.1?(i.shake(.5),i.audio.playAt("slam",this.pos,t.pos,{volume:.7}),i.fx.debris(this.pos,[.25,.22,.2],18),i.fx.smoke(this.pos,{n:10,size:1.5,life:1.2}),this.vel.set(-this.chargeDir.x*3,0,-this.chargeDir.z*3),this.setState("stagger"),this.staggerDur=1.6,this.model.play("hit",{loop:!1,fade:.08,timeScale:.7,force:!0}),this.chargeCD=4+Math.random()*2):this.stateT>1&&(this.setState("recover"),this.chargeCD=4+Math.random()*2);break}case"recover":this.steer(0,0,e,5),this.stateT>.85&&this.setState("chase");break}}slamPoint(){return new T(this.pos.x+Math.sin(this.yaw)*1.7,0,this.pos.z+Math.cos(this.yaw)*1.7)}slamImpact(e,t,i){const n=this.game,s=n.player;n.shake(.55),n.audio.playAt("slam",e,s.pos,{volume:.9}),n.fx.ring(e,t*1.15,{color:[3,1.3,.4],dur:.45,width:.35}),n.fx.debris(e,[.3,.26,.22],22),n.fx.smoke(e,{n:14,size:1.8,life:1.3,spread:t}),n.fx.burst(e,{n:30,color:[3.5,1.3,.3],speed:8,up:3,size:.2,life:.5,y:.1}),n.fx.decal("scorch",e,t*2.2,{life:10}),n.fx.flash(e,16744512,30,10,.25),Math.hypot(s.pos.x-e.x,s.pos.z-e.z)<t+s.radius&&s.takeDamage(i,e,{kb:10})}onHit(e,{dir:t,kb:i=3,source:n,poise:s=1}={}){this.alive&&(i&&t&&(this.vel.x+=t.x*i/this.mass,this.vel.z+=t.z*i/this.mass),!(n==="burn"||n==="orb")&&(this.poiseMax>0?(this.poise-=e*s,this.poise<=0&&this.state!=="charging"&&(this.poise=this.poiseMax,this.interrupt(.55))):this.state!=="attack"&&this.state!=="charging"&&this.interrupt(n==="melee"?.28:.18)))}interrupt(e){this.clearTele(),this.setState("stagger"),this.staggerDur=e,this.model.has("hit")&&this.model.play("hit",{loop:!1,start:.05,timeScale:1.6,fade:.05,force:!0}),this.attackCD=Math.max(this.attackCD,.4)}die(e){const t=this.game;this.alive=!1,this.clearTele(),this.setState("dead"),this.hpBar.visible=!1,this.deathDir=e||new T,this.model.has("death")&&this.model.play("death",{loop:!1,fade:.08,timeScale:1.3,force:!0}),t.audio.playAt(this.def.deathSfx,this.pos,t.player.pos,{volume:this.type==="brute"?.9:.6})}updateDead(e){const t=this.stateT;this.vel.multiplyScalar(Math.exp(-5*e)),this.pos.addScaledVector(this.vel,e),this.game.level.collide(this.pos,this.radius),this.root.position.x=this.pos.x,this.root.position.z=this.pos.z,this.def.flying&&(this.root.position.y=Math.max(0,this.root.position.y-e*1.5)),this.model.update(e);const i=this.def.flying?.05:this.model.has("death")?.9:.1;if(t>i){const n=Math.min(1,(t-i)/1.1);this.model.setDissolve(.02+n*.98),Math.random()<.5&&this.game.fx.ember(this.pos,this.model.uniforms[0]?.uDissolveColor.value.toArray()||[3,1,.3],1.4),n>=1&&this.remove()}}remove(){this.removed=!0,this.alive=!1,this.clearTele(),this.game.scene.remove(this.root),this.game.scene.remove(this.hpBar)}}class Ux extends Nd{constructor(e,t,i){super(e,"boss",t,i);const n=e.mods||{},s=Math.max(0,Math.floor((e.floorIndex-6)/7));this.maxHp=this.hp=Math.round(dr.boss.hp*(n.bossHp||1)*(1+s*.9)),this.dmg*=1+s*.35,this.rageAt=n.bossRage||.5,this.phase=1,this.patternQ=[],this.gap=1.5,this.hpBar.visible=!1,this.root.position.y=-6,this.introDone=!1,this.speed=2.8,this.light=new vs(16738848,40,16,2),e.scene.add(this.light)}remove(){if(super.remove(),this.game.scene.remove(this.light),this.meteors)for(const e of this.meteors)e.done||(e.done=!0,e.tele.remove())}updateHpBar(){this.hpBar.visible=!1}update(e){if(this.light.position.set(this.pos.x,this.root.position.y+3.2,this.pos.z+1.5),this.light.intensity=(this.alive?this.phase===2?70:45:Math.max(0,45-this.stateT*12))*(.85+.15*Math.sin(this.game.time*11)),this.state==="spawning"){this.stateT+=e;const t=Math.min(1,this.stateT/2.4);this.root.position.set(this.pos.x,-6*(1-t)*(1-t),this.pos.z),this.root.rotation.y=this.yaw,Math.random()<.8&&this.game.fx.flame(new T(this.pos.x+(Math.random()-.5)*3,.1,this.pos.z+(Math.random()-.5)*3),1.6),this.model.update(e),t>=1&&!this.roared&&(this.roared=!0,this.model.play("roar",{loop:!1,fade:.2,timeScale:1.2,force:!0}),this.game.audio.play("boss_roar",{volume:1}),this.game.shake(.9),this.game.fx.ring(this.pos,9,{color:[4,1.3,.3],dur:.8,width:.25})),this.stateT>5.2&&(this.setState("chase"),this.introDone=!0,this.game.onBossIntroDone());return}super.update(e)}onHit(e,t){if(this.state!=="roar"&&this.phase===1&&this.hp<=this.maxHp*this.rageAt&&this.alive){this.phase=2,this.clearTele(),this.setState("roar"),this.speed=3.4,this.model.play("roar",{loop:!1,fade:.15,timeScale:1.5,force:!0}),this.model.setRim(1.4,.35,.05);const i=this.game;i.audio.play("boss_roar",{volume:1,rate:.9}),i.shake(1),i.ui.banner("The Cinder King Rages","His flames burn hotter",2.4,"boss"),i.fx.ring(this.pos,10,{color:[4,1.2,.2],dur:.9,width:.3}),i.fx.burst(this.pos,{n:80,color:[4,1.5,.3],speed:14,up:6,size:.35,life:1,y:1});const n=i.player;n.pos.distanceTo(this.pos)<7&&n.takeDamage(10,this.pos,{kb:18})}}think(e,t){this.game;const i=t.pos.x-this.pos.x,n=t.pos.z-this.pos.z,s=Math.hypot(i,n),r=this.phase===2;switch(this.state){case"roar":this.steer(0,0,e),this.stateT>2&&(this.setState("chase"),this.gap=.5,this.patternQ=["summon","meteors"]);break;case"chase":{this.gap-=e,s>4.5?(this.moveToward(t.pos,this.speed,e),this.model.play("walk",{timeScale:r?2.2:1.8,fade:.25})):(this.steer(0,0,e),this.faceToward(t.pos,e,4),this.model.play("idle",{fade:.25})),this.gap<=0&&t.alive&&this.chooseAttack(s);break}default:this.runAttack(e,t,s)}}chooseAttack(e){let t=this.patternQ.shift();if(!t){const s=[];e<6.5?s.push("cleave","cleave","slam"):s.push("volley","charge"),s.push("slam"),this.phase===2&&s.push("meteors","volley"),this.phase===2&&this.game.enemies.filter(r=>r.alive&&r!==this).length<2&&Math.random()<.35&&s.push("summon"),t=s[Math.floor(Math.random()*s.length)],t===this.lastAtk&&Math.random()<.6&&(t=s[Math.floor(Math.random()*s.length)])}this.lastAtk=t,this.atk=t,this.setState("atk_"+t),this.vel.multiplyScalar(.2),this.fired=0;const i=this.game,n=this.phase===2;if(t==="cleave")this.W=n?.75:.95,this.model.play("swing",{loop:!1,start:.15,timeScale:(.68-.15)/this.W,fade:.12,force:!0}),this.tele=i.fx.telegraph("cone",this.pos,{radius:6.5,arc:2.6,yaw:this.yaw});else if(t==="slam")this.W=n?1:1.25,this.model.play("slam",{loop:!1,start:.55,timeScale:(1.75-.55)/this.W,fade:.12,force:!0}),this.tele=i.fx.telegraph("circle",this.pos,{radius:5.2}),i.audio.play("telegraph",{volume:.6,rate:.7});else if(t==="volley")this.model.play("cast",{loop:!1,start:.2,timeScale:1,fade:.12,force:!0}),i.audio.play("cast",{volume:.7,rate:.6});else if(t==="meteors"){this.model.play("cast",{loop:!1,start:0,timeScale:.9,fade:.12,force:!0}),i.audio.play("boss_roar",{volume:.5,rate:1.3}),this.meteors=[];const s=i.player.pos,r=8;for(let o=0;o<r;o++){const c=Math.random()*Math.PI*2,l=o===0?0:2+Math.random()*6,h=new T(s.x+Math.cos(c)*l,0,s.z+Math.sin(c)*l);i.level.isSolid(i.level.toTile(h.x),i.level.toTile(h.z))&&o||this.meteors.push({pos:h,t:-o*.12,tele:i.fx.telegraph("circle",h,{radius:1.9}),done:!1})}}else t==="summon"?(this.model.play("cast",{loop:!1,start:0,timeScale:1,fade:.12,force:!0}),i.audio.play("spawn",{volume:.8})):t==="charge"&&(this.W=.9,this.model.play("idle",{fade:.1}),this.tele=i.fx.telegraph("rect",this.pos,{length:16,width:3.4,yaw:this.yaw}),i.audio.play("brute_roar",{volume:.7,rate:.7}))}endAttack(e){this.clearTele(),this.setState("chase"),this.gap=e*(this.phase===2?.55:1)}runAttack(e,t,i){const n=this.game,s=this.stateT;switch(this.state){case"atk_cleave":this.steer(0,0,e),s<this.W*.6&&this.faceToward(t.pos,e,3),this.tele?.move(this.pos,this.yaw),this.tele?.set(s/this.W),s>=this.W&&!this.fired&&(this.fired=1,this.clearTele(),this.strikeCone(6.5,2.6,this.dmg*1.1),n.fx.slash(this.pos,this.yaw,{radius:6.2,arc:2.7,color:[2.2,.5,.1],core:[3,1.4,.5],y:1.4,dur:.3,inner:.3}),n.audio.play("swing_heavy",{volume:.9,rate:.7}),n.shake(.4)),s>this.W+.6&&this.endAttack(1);break;case"atk_slam":if(this.steer(0,0,e),this.tele?.move(this.pos),this.tele?.set(s/this.W),s>=this.W&&!this.fired){this.fired=1,this.clearTele(),this.slamImpact(this.pos,5.2,this.dmg*1.2);const r=this.phase===2?3:2;for(let o=0;o<r;o++)n.addShockwave(this.pos.clone(),{delay:o*.45,speed:8.5,max:18,dmg:this.dmg*.7})}s>this.W+.9&&this.endAttack(1.1);break;case"atk_volley":{this.steer(0,0,e),this.faceToward(t.pos,e,5);const r=this.phase===2?4:3,o=.55+this.fired*.42;if(this.fired<r&&s>=o){this.fired++;const c=5,l=Math.atan2(t.pos.x-this.pos.x,t.pos.z-this.pos.z);for(let h=0;h<c;h++){const d=l+(h-(c-1)/2)*.17+(this.fired%2?.08:-.08),u=new T(Math.sin(d),0,Math.cos(d)).multiplyScalar(11);n.projectiles.push(new Js(n,{pos:this.pos.clone().add(new T(Math.sin(d)*1.6,0,Math.cos(d)*1.6)),y:2.2,vel:u,dmg:this.dmg*.6,color:[4,1.2,.2],size:.45,life:3.5,kind:"fireball",radius:.5}))}if(n.audio.play("fireball",{volume:.6}),this.phase===2&&this.fired===r)for(let h=0;h<16;h++){const d=h/16*Math.PI*2;n.projectiles.push(new Js(n,{pos:this.pos.clone(),y:1.4,vel:new T(Math.sin(d),0,Math.cos(d)).multiplyScalar(7.5),dmg:this.dmg*.5,color:[4,.9,.15],size:.38,life:4,kind:"fireball"}))}}s>.55+r*.42+.5&&this.endAttack(1);break}case"atk_meteors":{this.steer(0,0,e);let r=!0;for(const o of this.meteors){o.t+=e;const c=1.35;if(!o.done){if(r=!1,o.tele.set(Math.max(0,o.t/c)),o.t>c-.4&&o.t-e<=c-.4)for(let l=0;l<12;l++)n.fx.add.emit({x:o.pos.x+3-l*.25,y:10-l*.8,z:o.pos.z-2+l*.17,vx:-7,vy:-24,vz:4,color:[4,1.3,.25],color2:[1,.2,0],size:.9-l*.04,life:.4});o.t>=c&&(o.done=!0,o.tele.remove(),n.explosion(o.pos,1.9,this.dmg*.8,{color:[4,1.3,.25],hurtsPlayer:!0,hurtsEnemies:!1}))}}r&&s>.5&&this.endAttack(.9);break}case"atk_summon":if(this.steer(0,0,e),s>.9&&!this.fired){this.fired=1;const r=3;for(let o=0;o<r;o++){const c=this.yaw+(o-1)*1.2+Math.PI,l=new T(this.pos.x+Math.sin(c)*4,0,this.pos.z+Math.cos(c)*4);n.level.collide(l,.6),n.spawnEnemy(Math.random()<.7?"skeleton":"cultist",l,{floor:Math.max(5,n.floorIndex-1)})}}s>1.8&&this.endAttack(.8);break;case"atk_charge":s<this.W?(this.steer(0,0,e),s<this.W*.7&&this.faceToward(t.pos,e,4),this.tele?.move(this.pos,this.yaw),this.tele?.set(s/this.W),this.chargeDir=new T(Math.sin(this.yaw),0,Math.cos(this.yaw)),this.hitPlayer=!1):(this.fired||(this.fired=1,this.clearTele(),this.model.play("charge",{timeScale:1.2,fade:.08})),this.vel.set(this.chargeDir.x*18,0,this.chargeDir.z*18),Math.random()<.8&&n.fx.flame(new T(this.pos.x,.2,this.pos.z),1.4),!this.hitPlayer&&Math.hypot(t.pos.x-this.pos.x,t.pos.z-this.pos.z)<this.radius+t.radius+.4&&(this.hitPlayer=!0,t.takeDamage(this.dmg,this.pos,{kb:16})),(this.bonked&&s>this.W+.1||s>this.W+1)&&(this.bonked&&(n.shake(.7),n.audio.play("slam",{volume:.8}),n.fx.debris(this.pos,[.25,.2,.18],24)),this.vel.multiplyScalar(.1),this.endAttack(1.3)));break;default:this.setState("chase")}}die(e){if(super.die(e),this.meteors)for(const t of this.meteors)t.done||(t.done=!0,t.tele.remove())}updateDead(e){const t=this.stateT;if(this.model.update(e),Math.random()<.5&&this.game.fx.flame(new T(this.pos.x+(Math.random()-.5)*3,Math.random()*4,this.pos.z+(Math.random()-.5)*3),1.2),t>2.2){const i=Math.min(1,(t-2.2)/2.5);this.model.setDissolve(.02+i*.98),i>=1&&this.remove()}}}const Od=new ls(.16,.16,.05,14);Od.rotateX(Math.PI/2);const Nx=new Ut({color:16760896,metalness:1,roughness:.25,emissive:6961664,emissiveIntensity:.9});class ui{constructor(e,t,i,{value:n=1,vel:s=null,delay:r=0}={}){this.game=e,this.kind=t,this.value=n,this.pos=i.clone(),this.pos.y=Math.max(.4,i.y||.6),this.vel=s?s.clone():new T((Math.random()-.5)*6,5+Math.random()*3,(Math.random()-.5)*6),this.t=0,this.delay=r,this.alive=!0,this.magnet=!1,this.group=new St;const o=e.fx;if(t==="gold"){const c=new Ue(Od,Nx);c.castShadow=!0,this.group.add(c),this.spin=c}else{const c=t==="soul"?[.8,1.8,3.2]:t==="heart"?[3.5,.3,.35]:t==="vital"?[4,.5,.7]:t==="forge"?[4,1.7,.45]:[3,.4,.4];this.color=c;const l=new bi({map:o.glowTex,color:new ie(...c),blending:Mt,depthWrite:!1,transparent:!0}),h=new ji(l),d=t==="vital"||t==="forge";if(h.scale.setScalar(t==="soul"?.9:d?2:1.1),d){const u=new Ue(t==="vital"?new Al(.28,0):new El(.32,0),new Et({color:new ie(c[0]*1.5,c[1]*1.5,c[2]*1.5)}));this.group.add(u),this.spin=u,this.vel.set(0,6,0)}if(this.group.add(h),this.sprite=h,t==="potion"){const u=e.assets.instance("potion");u&&(u.root.scale.setScalar(1.1),this.group.add(u.root),this.spin=u.root,h.scale.setScalar(1.6))}}this.group.position.copy(this.pos),e.scene.add(this.group)}update(e){this.t+=e;const t=this.game.player,i=t.pos.x-this.pos.x,n=t.pos.z-this.pos.z,s=Math.hypot(i,n),r=this.kind==="soul"?999:this.kind==="gold"?4.2:this.kind==="heart"?3:this.kind==="vital"||this.kind==="forge"?1.8:0;if(this.t>this.delay+(this.kind==="soul"?.7:.35)&&(s<r||this.magnet)&&t.alive){if(!(this.kind==="potion"&&t.potions>=t.maxPotions)){const c=Math.min(26,6+this.t*10);this.vel.x+=(i/(s||1)*c-this.vel.x)*Math.min(1,e*8),this.vel.z+=(n/(s||1)*c-this.vel.z)*Math.min(1,e*8),this.vel.y+=(1.1-this.pos.y)*e*20-this.vel.y*e*6}}else this.vel.y-=22*e;this.pos.addScaledVector(this.vel,e);const o=this.kind==="gold"?.18:this.kind==="vital"||this.kind==="forge"?1.1:.6;this.pos.y<o&&(this.pos.y=o,this.vel.y=Math.abs(this.vel.y)*.35,this.vel.x*=.6,this.vel.z*=.6,Math.abs(this.vel.y)<.6&&(this.vel.y=0)),this.game.level.collide(this.pos,.2),this.group.position.copy(this.pos),this.kind!=="gold"&&this.kind!=="potion"&&(this.group.position.y+=Math.sin(this.t*4)*.1),this.spin&&(this.spin.rotation.y+=e*(this.kind==="gold"?8:2)),this.sprite&&(this.sprite.material.opacity=.75+Math.sin(this.t*8)*.25),(this.kind==="vital"||this.kind==="forge")&&Math.random()<.5&&this.game.fx.converge(this.pos.clone().setY(0),this.color,1,1,this.group.position.y),this.kind==="soul"&&Math.random()<.5&&this.game.fx.add.emit({x:this.pos.x,y:this.group.position.y,z:this.pos.z,vy:.4,color:this.color,size:.18,size2:0,life:.4}),s<.9&&this.t>.25&&t.alive&&this.collect()}collect(){const e=this.game.player,t=this.game;if(this.kind==="gold")e.gold+=this.value,t.runStats.gold+=this.value,t.audio.play("coin",{volume:.35,rateVar:.15,throttle:40});else if(this.kind==="soul")e.souls+=this.value,t.audio.play("soul",{volume:.3,rateVar:.15,throttle:60});else if(this.kind==="heart")e.heal(this.value),t.audio.play("potion",{volume:.3,rate:1.4});else if(this.kind==="vital")e.bonusHp=(e.bonusHp||0)+15,e.recomputeStats(),e.heal(15,{raw:!0}),t.audio.play("levelup",{volume:.55,rate:.9}),t.ui.toast("Heart of Ash","+15 max health"),t.fx.ring(e.pos,2.4,{color:this.color,dur:.5});else if(this.kind==="forge")e.forge=(e.forge||0)+1,e.recomputeStats(),t.audio.play("hammer_impact",{volume:.5,rate:1.4}),t.audio.play("levelup",{volume:.4,rate:1.1}),t.ui.toast("Ember Forge",`+8% damage · ${e.forge} tempered`),t.fx.ring(e.pos,2.4,{color:this.color,dur:.5});else if(this.kind==="potion"){if(e.potions>=e.maxPotions)return;e.potions++,t.audio.play("levelup",{volume:.5}),t.ui.toast("Healing Draught","Press F to drink")}t.fx.burst(this.pos,{n:8,color:this.kind==="gold"?[4,2.6,.6]:this.color,speed:2,up:2,size:.15,life:.35,y:0}),this.destroy()}destroy(){this.alive=!1,this.game.scene.remove(this.group)}}const ur=[{id:"iron",name:"Vow of Iron",icon:"shield",ranks:3,renown:0,desc:a=>`Foes have +${20*a}% health`},{id:"fury",name:"Vow of Fury",icon:"blade",ranks:3,renown:0,desc:a=>`Foes deal +${15*a}% damage`},{id:"horde",name:"Vow of the Horde",icon:"skull",ranks:2,renown:0,desc:a=>`${25*a}% more foes in every chamber`},{id:"famine",name:"Vow of Famine",icon:"drop",ranks:2,renown:0,desc:a=>`All healing is ${25*a}% weaker`},{id:"embers",name:"Vow of Embers",icon:"flame",ranks:2,renown:0,desc:a=>`Elite foes are ${a>1?"everywhere":"far more common"}`},{id:"haste",name:"Vow of Haste",icon:"wing",ranks:2,renown:6,desc:a=>`Foes move and attack ${12*a}% faster`},{id:"tyrant",name:"Vow of the Tyrant",icon:"crown",ranks:2,renown:8,desc:a=>`Vorthak and Champions have +${30*a}% health${a>1?"; Vorthak rages sooner":""}`},{id:"scarcity",name:"Vow of Scarcity",icon:"star",ranks:1,renown:10,desc:()=>"Boon offerings show only two choices"},{id:"haunt",name:"Vow of Haunting",icon:"eye",ranks:1,renown:12,desc:()=>"Slain foes may rise again as wraiths"},{id:"ruin",name:"Vow of Ruin",icon:"bolt",ranks:1,renown:14,desc:()=>"Spike traps fill every chamber and strike harder"},{id:"hourglass",name:"Vow of the Hourglass",icon:"hourglass",ranks:1,renown:16,desc:()=>"Clear each depth within 4:00 or the deep starts burning you"}],Oa=Object.fromEntries(ur.map(a=>[a.id,a])),Ox=ur.reduce((a,e)=>a+e.ranks,0);function nr(a){return Object.values(a||{}).reduce((e,t)=>e+(t||0),0)}const Ah=[{id:"glass",name:"Glass Cannon",desc:"You deal 50% more damage — and take 50% more."},{id:"bloodmoon",name:"Blood Moon",desc:"Elites stalk every chamber. Their souls are worth double."},{id:"midas",name:"Midas Deep",desc:"Gold rains twice as thick, and the Merchant waits on every depth."},{id:"swarm",name:"The Swarm",desc:"Twice as many foes, each with half the health."},{id:"ascetic",name:"Ascetic’s Path",desc:"No healing draughts. Each chamber cleared restores 15% health."},{id:"tempest",name:"Tempest",desc:"Everything is 20% faster — you included."},{id:"pyromancer",name:"Pyromancer",desc:"Begin with Kindling and Blazing Trail. Burning foes take 50% more damage."},{id:"favor",name:"Fortune’s Favor",desc:"Every boon offered is Rare or better."}];function io(a={},e=null){const t=n=>a[n]||0,i={heat:nr(a),enemyHp:1+.2*t("iron"),enemyDmg:1+.15*t("fury"),enemyTempo:1+.12*t("haste"),horde:1+.25*t("horde"),healMul:1-.25*t("famine"),eliteAdd:[0,.2,.45][t("embers")],bossHp:1+.3*t("tyrant"),bossRage:t("tyrant")>1?.66:.5,boonChoices:t("scarcity")?2:3,haunt:t("haunt")?.3:0,ruin:!!t("ruin"),floorTimer:t("hourglass")?240:0,dmgDealt:1,dmgTaken:1,goldMul:1,eliteSouls:1,shopEverywhere:!1,noPotions:!1,clearHeal:0,playerTempo:0,startBoons:[],burnTaken:1,minRarity:null,mutator:e?.id||null};switch(e?.id){case"glass":i.dmgDealt=1.5,i.dmgTaken*=1.5;break;case"bloodmoon":i.eliteAdd+=.5,i.eliteSouls=2;break;case"midas":i.goldMul=2,i.shopEverywhere=!0;break;case"swarm":i.horde*=2,i.enemyHp*=.5;break;case"ascetic":i.noPotions=!0,i.clearHeal=.15;break;case"tempest":i.enemyTempo*=1.2,i.playerTempo=.2;break;case"pyromancer":i.startBoons=["kindling","trail"],i.burnTaken=1.5;break;case"favor":i.minRarity="rare";break}return i}const zd={boon:{icon:"star",color:"#ffd27a",name:"Boon"},gold:{icon:"coin",color:"#ffc040",name:"Gold Hoard"},souls:{icon:"orb",color:"#7ac8ff",name:"Soul Cache"},vital:{icon:"heart",color:"#ff5a6a",name:"Heart of Ash"},forge:{icon:"blade",color:"#ff9a4a",name:"Ember Forge"},potion:{icon:"drop",color:"#ff7a9a",name:"Healing Draught"},trial:{icon:"skull",color:"#ff4a3a",name:"Ember Trial"},champion:{icon:"crown",color:"#ff5a2a",name:"Champion"}},Vs=25,es=a=>120+60*(a-1),sr={2:[{kind:"weapon",id:"fangs",label:"Armament: Twin Fangs"}],3:[{kind:"boon",id:"static",label:"Boon: Static Edge"},{kind:"upgrade",id:"whim",label:"Sanctum: Fate’s Whim"}],4:[{kind:"boon",id:"shards",label:"Boon: Ember Shards"},{kind:"hue",id:"azure",label:"Flame: Azure"}],5:[{kind:"weapon",id:"maul",label:"Armament: Ruin Maul"},{kind:"boon",id:"pyreheart",label:"Boon: Pyre Heart"}],6:[{kind:"boon",id:"cinders",label:"Boon: Orbiting Cinders"},{kind:"vow",id:"haste",label:"Vow of Haste"}],7:[{kind:"boon",id:"thunderclap",label:"Boon: Thunderclap"},{kind:"upgrade",id:"favor",label:"Sanctum: Merchant’s Favor"}],8:[{kind:"boon",id:"phoenix",label:"Boon: Phoenix Heart"},{kind:"hue",id:"verdant",label:"Flame: Verdant"},{kind:"vow",id:"tyrant",label:"Vow of the Tyrant"}],9:[{kind:"boon",id:"inferno",label:"Boon: Inferno"},{kind:"upgrade",id:"purse",label:"Sanctum: Gilded Purse"}],10:[{kind:"hue",id:"void",label:"Flame: Void"},{kind:"vow",id:"scarcity",label:"Vow of Scarcity"},{kind:"upgrade",id:"instinct",label:"Sanctum: Killer Instinct"}],11:[{kind:"boon",id:"wrath",label:"Boon: Wrath of Ages"}],12:[{kind:"vow",id:"haunt",label:"Vow of Haunting"},{kind:"upgrade",id:"vigil",label:"Sanctum: Vigil"}],13:[{kind:"hue",id:"crimson",label:"Flame: Crimson"}],14:[{kind:"vow",id:"ruin",label:"Vow of Ruin"}],16:[{kind:"vow",id:"hourglass",label:"Vow of the Hourglass"}],18:[{kind:"hue",id:"solar",label:"Flame: Solar"}],20:[{kind:"title",id:"saint",label:"Title: Ember Saint"},{kind:"hue",id:"pale",label:"Flame: Pale"}],25:[{kind:"title",id:"eternal",label:"Title: The Eternal Flame"}]};function Ws(a,e){for(const[t,i]of Object.entries(sr))if(i.some(n=>n.kind===a&&n.id===e))return Number(t);return 1}const zx=a=>a>=25?"The Eternal Flame":a>=20?"Ember Saint":a>=15?"Pyre Warden":a>=10?"Flamebearer":a>=5?"Ashbound Knight":"Ashbound";function Bx(a,{victory:e,heat:t}){const i=[],n=(o,c)=>c&&i.push([o,Math.round(c)]);n("Foes slain",a.kills*10),n("Elites slain",a.elites*40),n("Chambers cleared",a.rooms*120),n("Flawless chambers",a.flawless*100),n("Ember Trials",a.trials*400),n("Champions felled",a.champions*1500),n("Depths descended",Math.max(0,a.depthReached-1)*600),n("Vorthak slain",a.bossKills*6e3),n("Abyss depths",a.abyss*900),e&&n("Swiftness",Math.max(0,1500-(a.bossTime||a.time))*3);const s=i.reduce((o,c)=>o+c[1],0),r=1+.15*t;return{base:s,mult:r,total:Math.round(s*r),lines:i}}const Hx=a=>Math.round(a/20),ii=(a,e)=>({cond:t=>(t.stats[a]||0)>=e,progress:t=>[t.stats[a]||0,e]}),js=[{id:"d_floor2",name:"Into the Dark",desc:"Reach the second depth",souls:15,cond:a=>a.stats.bestFloor>=2},{id:"d_floor3",name:"Glimmer of Hope",desc:"Reach the Glimmering Hollows",souls:25,cond:a=>a.stats.bestFloor>=3},{id:"d_floor5",name:"Forgewalker",desc:"Reach the Molten Depths",souls:40,cond:a=>a.stats.bestFloor>=5},{id:"d_throne",name:"Audience with the King",desc:"Reach the Cinder Throne",souls:60,cond:a=>a.stats.bestFloor>=7},{id:"d_win",name:"Kingslayer",desc:"Defeat Vorthak, the Cinder King",souls:100,cond:a=>a.stats.wins>=1},{id:"d_flawless",name:"Untouchable",desc:"Clear a chamber without taking damage",souls:15,cond:(a,e)=>e&&e.flawless>=1},{id:"d_flawless5",name:"Phantom",desc:"Clear 5 chambers flawlessly in a single descent",souls:40,cond:(a,e)=>e&&e.flawless>=5},{id:"d_nopot",name:"Teetotal Regicide",desc:"Defeat Vorthak without drinking a draught",souls:80,cond:(a,e)=>e&&e.bossKills>=1&&e.potionsUsed===0},{id:"d_fast",name:"Wildfire",desc:"Defeat Vorthak within 15 minutes",souls:80,cond:(a,e)=>e&&e.bossKills>=1&&e.bossTime>0&&e.bossTime<900},{id:"d_kills500",name:"Reaper",desc:"Slay 500 foes",souls:40,...ii("kills",500)},{id:"d_kills2500",name:"Legion’s Bane",desc:"Slay 2,500 foes",souls:120,...ii("kills",2500)},{id:"d_elites",name:"Elite Hunter",desc:"Slay 50 elite foes",souls:50,...ii("elites",50)},{id:"d_champ",name:"Champion’s Fall",desc:"Defeat a Champion",souls:30,...ii("champions",1)},{id:"d_champ10",name:"Tyrant’s Bane",desc:"Defeat 10 Champions",souls:80,...ii("champions",10)},{id:"d_trial",name:"Trial by Fire",desc:"Complete an Ember Trial",souls:20,...ii("trials",1)},{id:"d_trial15",name:"Forged in Flame",desc:"Complete 15 Ember Trials",souls:80,...ii("trials",15)},{id:"d_chests",name:"Treasure Seeker",desc:"Open 25 chests",souls:40,...ii("chests",25)},{id:"d_shrines",name:"Devout",desc:"Pray at 15 shrines",souls:40,...ii("shrines",15)},{id:"d_patron",name:"Patron of the Pyre",desc:"Spend 1,500 gold with the Pyre Merchant",souls:60,...ii("goldSpent",1500)},{id:"d_boons10",name:"Fully Kindled",desc:"Hold 12 boons in a single descent",souls:40,cond:(a,e)=>e&&e.boonCount>=12},{id:"d_legend",name:"Touched by Legend",desc:"Accept a Legendary boon",souls:25,cond:(a,e)=>e&&e.legendary>=1},{id:"d_fusion",name:"Alchemist",desc:"Discover a Fusion boon",souls:40,cond:a=>a.found.fusions.length>=1},{id:"d_fusionall",name:"Grand Alchemist",desc:`Discover all ${vn.length} Fusion boons`,souls:200,cond:a=>a.found.fusions.length>=vn.length,progress:a=>[a.found.fusions.length,vn.length]},{id:"d_codex",name:"Scholar of Boons",desc:`Discover ${mi.length-vn.length-6} boons`,souls:100,cond:a=>a.found.boons.length>=mi.length-vn.length-6,progress:a=>[a.found.boons.length,mi.length-vn.length-6]},{id:"d_nova8",name:"Cataclysm",desc:"Hit 8 foes with a single Cinder Nova",souls:30,cond:(a,e)=>e&&e.bestNova>=8},{id:"d_bighit",name:"Overkill",desc:"Deal 400 damage in a single blow",souls:40,cond:(a,e)=>e&&e.bestHit>=400},{id:"d_fangs",name:"Fangsworn",desc:"Defeat Vorthak wielding the Twin Fangs",souls:80,cond:a=>(a.bestHeat.fangs??-1)>=0},{id:"d_maul",name:"Maulsworn",desc:"Defeat Vorthak wielding the Ruin Maul",souls:80,cond:a=>(a.bestHeat.maul??-1)>=0},{id:"d_blade",name:"Bladesworn",desc:"Defeat Vorthak wielding the Emberblade",souls:80,cond:a=>(a.bestHeat.blade??-1)>=0},{id:"d_heat3",name:"Kindled Oath",desc:"Defeat Vorthak at Heat 3 or higher",souls:100,cond:a=>a.maxHeatWin>=3},{id:"d_heat6",name:"Burning Oath",desc:"Defeat Vorthak at Heat 6 or higher",souls:150,cond:a=>a.maxHeatWin>=6},{id:"d_heat10",name:"Pyre Eternal",desc:"Defeat Vorthak at Heat 10 or higher",souls:250,cond:a=>a.maxHeatWin>=10},{id:"d_heat15",name:"Ashen Saint",desc:"Defeat Vorthak at Heat 15 or higher",souls:400,cond:a=>a.maxHeatWin>=15},{id:"d_abyss3",name:"Abyss Gazer",desc:"Reach Abyss depth 3",souls:60,cond:a=>a.stats.deepestAbyss>=3},{id:"d_abyss7",name:"Into the Void",desc:"Defeat Vorthak in the Abyss",souls:150,cond:a=>a.stats.deepestAbyss>=8},{id:"d_daily",name:"Rite Keeper",desc:"Complete a Daily Rite",souls:25,...ii("dailies",1)},{id:"d_streak3",name:"Devotee",desc:"Keep a 3-day Daily Rite streak",souls:60,cond:a=>a.streak.best>=3},{id:"d_streak7",name:"Zealot",desc:"Keep a 7-day Daily Rite streak",souls:150,cond:a=>a.streak.best>=7},{id:"d_sanctum",name:"Sanctified",desc:"Master every Sanctum rite",souls:0,cond:a=>a.allUpgradesMaxed()},{id:"d_renown10",name:"Flamebearer",desc:"Reach Renown 10",souls:100,cond:a=>a.renown.level>=10}];Object.fromEntries(js.map(a=>[a.id,a]));const Bd=[{id:"c_flame",title:"The Last Flame",hint:"Begin your first descent",cond:a=>a.stats.runs>=1,text:"Before the deep swallowed it, the Ember hung above the world like a second sun. Crops grew in its warmth; the dead were burned in its light and did not return. When it fell, the cold came first. Then the dead began to walk."},{id:"c_ashbound",title:"Ashbound",hint:"Fall in the deep",cond:a=>a.stats.deaths>=1,text:"You died. You remember dying. And yet the Sanctum’s bonfire breathed, and you rose from its coals with ash in your lungs. The Oath you swore binds you to the flame: you cannot rest until the Ember is returned, and the flame will not let you."},{id:"c_ossuary",title:"The Ossuary",hint:"Slay 60 Bone Wardens",cond:a=>(a.stats.killsBy.skeleton||0)>=60,text:"The Ossuary was a tomb once, where the Ember’s keepers were laid in ordered rows. Without its light their bones forgot their peace. The Bone Wardens still walk their rounds, guarding a fire that is no longer theirs to guard."},{id:"c_hollows",title:"The Glimmering Hollows",hint:"Reach the third depth",cond:a=>a.stats.bestFloor>=3,text:"Crystal grows wherever the Ember’s light once fell, and it remembers. Lay a hand on the veins and you can hear it: a heartbeat, slow and enormous, coming from somewhere far below."},{id:"c_choir",title:"The Ashen Choir",hint:"Slay 50 Ashen Cultists",cond:a=>(a.stats.killsBy.cultist||0)>=50,text:"The cultists sing as they die. Their hymn is a single word: Vorthak. They believe the Cinder King will burn the world clean and remake it, and that those who feed him will be spared the fire."},{id:"c_wraiths",title:"Hollow Wraiths",hint:"Slay 50 Hollow Wraiths",cond:a=>(a.stats.killsBy.wraith||0)>=50,text:"Wraiths are what is left of the Ashbound who gave up. Their oath outlasted their will. They hunger for your flame because they remember having one."},{id:"c_merchant",title:"The Pyre Merchant",hint:"Spend 300 gold with the Merchant",cond:a=>(a.stats.goldSpent||0)>=300,text:"He claims he was a king’s treasurer once. He claims a great many things. He trades in warmth: every coin you hand him he melts into his little fire, and he is never cold. Ask him who he is waiting for and he only smiles."},{id:"c_forge",title:"The Molten Depths",hint:"Reach the fifth depth",cond:a=>a.stats.bestFloor>=5,text:"Here the world was forged. The Ember fell into this forge and set it roaring again, and the Chained Brutes, giants who once worked the bellows, were bound in iron to keep it fed forever."},{id:"c_king",title:"The Cinder King",hint:"Reach the Cinder Throne",cond:a=>a.stats.bestFloor>=7,text:"Vorthak sits on a throne of slag, the Ember burning in the cage of his ribs. He is enormous, and he is old, and when he sees you he laughs like a man greeting someone he used to know."},{id:"c_fall",title:"The Fall of Vorthak",hint:"Defeat the Cinder King",cond:a=>a.stats.wins>=1,text:"He fell. You tore the Ember from his chest and carried it up into the light. But that night the Sanctum’s bonfire whispered: the deep has rekindled him. Nothing that holds the Ember truly dies. Not him. Not you."},{id:"c_vows",title:"Vows of the Pyre",hint:"Defeat Vorthak at Heat 3",cond:a=>a.maxHeatWin>=3,text:"The Sanctum flame offers a bargain: swear harsher vows and it will burn brighter for you. Each oath makes the deep crueler. Each oath brings you closer to something. The flame will not say what."},{id:"c_abyss",title:"The Abyss",hint:"Reach Abyss depth 3",cond:a=>a.stats.deepestAbyss>=3,text:"Below the throne the world simply stops. The Abyss is not a place but an absence, somewhere the Ember’s light has never reached. Things live there anyway. They are very patient."},{id:"c_first",title:"The First Knight",hint:"Defeat Vorthak at Heat 6",cond:a=>a.maxHeatWin>=6,text:"Carved into the underside of the throne, in a hand you know as your own: “I swore to return the Ember. I held it too long.” Vorthak was the first of the Ashbound. You are not the first to come this far. Only the latest."},{id:"c_rekindled",title:"Rekindled",hint:"Defeat Vorthak at Heat 10",cond:a=>a.maxHeatWin>=10,text:"This time you do not carry the Ember up. You set it down in the cold heart of the Abyss and let it burn there, feeding nothing and owned by no one. The cycle breaks. For the first time in an age, the Ashbound sleep. (The true ending. Thank you for playing.)"}],Gx={skeleton:{blurb:"Keepers of the Ossuary, still on watch. Their swings are slow and honest: read the red arc, step aside."},cultist:{blurb:"Choir-mages of the Cinder King. They keep their distance and blink away when cornered. Close the gap."},wraith:{blurb:"Fallen Ashbound. They hover, mark a line and dive along it. Dash sideways, not back."},brute:{blurb:"Bellows-giants in chains. Their charges stun them against walls; punish the stagger."},boss:{blurb:"The Cinder King. Cleave, slam, volley, charge. In his rage, meteors and the dead answer his call."}};function nl(a=new Date){return`${a.getUTCFullYear()}-${String(a.getUTCMonth()+1).padStart(2,"0")}-${String(a.getUTCDate()).padStart(2,"0")}`}function Vx(a){let e=2166136261;for(let t=0;t<a.length;t++)e^=a.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function Hd(a=nl()){const e=Vx("emberdeep:"+a);let t=e;const i=()=>{t=t+1831565813|0;let d=Math.imul(t^t>>>15,1|t);return d=d+Math.imul(d^d>>>7,61|d)^d,((d^d>>>14)>>>0)/4294967296},n=Gs[Math.floor(i()*Gs.length)],s=Ah[Math.floor(i()*Ah.length)],r=ur.filter(d=>!["scarcity","hourglass"].includes(d.id)),o={},c=3+Math.floor(i()*3);let l=0,h=0;for(;l<c&&h++<50;){const d=r[Math.floor(i()*r.length)];(o[d.id]||0)<Math.min(d.ranks,2)&&(o[d.id]=(o[d.id]||0)+1,l++)}return{key:a,seed:e%1e9,weapon:n,mutator:s,vows:o,heat:l}}function Eh(a,e){return Math.round((Date.parse(e+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/864e5)}const ar=[{id:"vitality",name:"Vitality",icon:"heart",desc:"+10 max health",max:5,cost:a=>20+a*20},{id:"might",name:"Might",icon:"blade",desc:"+6% damage",max:5,cost:a=>25+a*25},{id:"swift",name:"Swiftness",icon:"wing",desc:"+4% movement speed",max:3,cost:a=>30+a*30},{id:"flask",name:"Deep Flask",icon:"drop",desc:"+1 starting potion",max:2,cost:a=>60+a*60},{id:"fortune",name:"Fortune",icon:"coin",desc:"+15% gold found",max:3,cost:a=>25+a*25},{id:"shadow",name:"Shadowstep",icon:"hourglass",desc:"Dash recharges 15% faster",max:2,cost:a=>50+a*50},{id:"ember",name:"Ember Heart",icon:"flame",desc:"Begin each depth with half a Cinder Nova",max:1,cost:()=>120},{id:"whim",name:"Fate’s Whim",icon:"star",desc:"+1 boon reroll each descent",max:3,cost:a=>80+a*70},{id:"favor",name:"Merchant’s Favor",icon:"coin",desc:"The Pyre Merchant charges 10% less",max:3,cost:a=>70+a*50},{id:"purse",name:"Gilded Purse",icon:"coin",desc:"Begin each descent with 40 gold",max:3,cost:a=>60+a*60},{id:"instinct",name:"Killer Instinct",icon:"eye",desc:"+3% critical chance",max:3,cost:a=>90+a*60},{id:"vigil",name:"Vigil",icon:"heart",desc:"Restore 10% health at the start of each depth",max:2,cost:a=>120+a*90}];ar.forEach(a=>a.renown=Ws("upgrade",a.id));const no="emberdeep.meta.v1";class Rh{constructor(){this.souls=0,this.levels={},this.stats={runs:0,wins:0,bestFloor:0,kills:0,deaths:0,elites:0,champions:0,trials:0,chests:0,shrines:0,goldSpent:0,dailies:0,deepestAbyss:0,bestScore:0,killsBy:{},fastestWin:0},this.seenIntro=!1,this.renown={level:1,xp:0},this.deeds={},this.chronicle={},this.unread={},this.found={boons:[],fusions:[]},this.bestHeat={},this.maxHeatWin=-1,this.heatClears={},this.loadout={weapon:"blade",hue:"ember",vows:{}},this.daily={key:"",best:0,attempts:0,done:!1,bestDepth:0},this.streak={last:"",count:0,best:0},this.load()}load(){try{const e=JSON.parse(localStorage.getItem(no)||"null");if(!e)return;this.souls=e.souls||0,this.levels=e.levels||{},Object.assign(this.stats,e.stats||{}),this.stats.killsBy=this.stats.killsBy||{},this.seenIntro=!!e.seenIntro;for(const t of["renown","deeds","chronicle","unread","found","bestHeat","heatClears","loadout","daily","streak"])e[t]&&(this[t]=Object.assign(this[t],e[t]));typeof e.maxHeatWin=="number"&&(this.maxHeatWin=e.maxHeatWin),this.stats.wins>0&&this.maxHeatWin<0&&(this.maxHeatWin=0,this.bestHeat.blade===void 0&&(this.bestHeat.blade=0))}catch{}}save(){try{const{souls:e,levels:t,stats:i,seenIntro:n,renown:s,deeds:r,chronicle:o,unread:c,found:l,bestHeat:h,maxHeatWin:d,heatClears:u,loadout:f,daily:g,streak:b}=this;localStorage.setItem(no,JSON.stringify({souls:e,levels:t,stats:i,seenIntro:n,renown:s,deeds:r,chronicle:o,unread:c,found:l,bestHeat:h,maxHeatWin:d,heatClears:u,loadout:f,daily:g,streak:b}))}catch{}}reset(){try{localStorage.removeItem(no)}catch{}}level(e){return this.levels[e]||0}upgradeUnlocked(e){return this.renown.level>=(e.renown||1)}canBuy(e){const t=this.level(e.id);return this.upgradeUnlocked(e)&&t<e.max&&this.souls>=e.cost(t)}buy(e){return this.canBuy(e)?(this.souls-=e.cost(this.level(e.id)),this.levels[e.id]=this.level(e.id)+1,this.save(),!0):!1}allUpgradesMaxed(){return ar.every(e=>this.level(e.id)>=e.max)}has(e,t){return e==="vow"&&this.maxHeatWin<0?!1:this.renown.level>=Ws(e,t)}get vowsUnlocked(){return this.maxHeatWin>=0}addXp(e){const t=[],i=this.renown;for(i.xp+=e;i.level<Vs&&i.xp>=es(i.level);)i.xp-=es(i.level),i.level++,t.push({level:i.level,rewards:sr[i.level]||[]});return i.level>=Vs&&(i.xp=Math.min(i.xp,es(i.level))),this.save(),t}discoverBoon(e){const t=e.fusion?this.found.fusions:this.found.boons;return t.includes(e.id)?!1:(t.push(e.id),!0)}evaluate(e=null){const t={deeds:[],pages:[]};for(const i of js){if(this.deeds[i.id])continue;let n=!1;try{n=i.cond(this,e)}catch{}n&&(this.deeds[i.id]=Date.now(),this.souls+=i.souls,t.deeds.push(i))}for(const i of Bd){if(this.chronicle[i.id])continue;let n=!1;try{n=i.cond(this,e)}catch{}n&&(this.chronicle[i.id]=Date.now(),this.unread[i.id]=1,t.pages.push(i))}return(t.deeds.length||t.pages.length)&&this.save(),t}dailyState(e=nl()){return this.daily.key!==e&&(this.daily={key:e,best:0,attempts:0,done:!1,bestDepth:0}),this.daily}markDailyStreak(e){const t=this.streak;t.last!==e&&(t.count=t.last&&Eh(t.last,e)===1?t.count+1:1,t.last=e,t.best=Math.max(t.best,t.count)),this.save()}streakAlive(e=nl()){return this.streak.last&&Eh(this.streak.last,e)<=1?this.streak.count:0}}const mt=a=>Math.round(a).toLocaleString("en-US"),ks=a=>{const e=document.createElement("template");return e.innerHTML=a.trim(),e.content.firstElementChild},za=a=>`${Math.floor(a/60)}:${String(Math.floor(a%60)).padStart(2,"0")}`;class Wx{constructor(e,t){this.root=e,this.game=t,this.floaters=[],this.v=new T,e.innerHTML=`
      <div id="fade" class="fade on"></div>
      <div id="reticle"></div>
      <div id="floaters"></div>
      <div id="hud" class="hidden">
        <div class="hud-tl">
          <div class="floor-label"><span class="floor-num"></span><span class="floor-name"></span></div>
          <div class="run-tags" id="run-tags"></div>
          <div class="currency">
            <span class="cur gold"><i class="coin"></i><b id="hud-gold">0</b></span>
            <span class="cur souls"><i class="soul"></i><b id="hud-souls">0</b></span>
          </div>
        </div>
        <div class="hud-tr">
          <div class="minimap-frame"><canvas id="minimap" width="200" height="200"></canvas></div>
        </div>
        <div class="hud-bl">
          <div class="nova-orb" id="nova-orb">
            <svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="44"/><circle class="fill" id="nova-ring" cx="50" cy="50" r="44"/></svg>
            <div class="nova-core"><span>Q</span></div>
          </div>
          <div class="vitals">
            <div class="hp-bar"><div class="hp-ghost" id="hp-ghost"></div><div class="hp-fill" id="hp-fill"></div><div class="hp-text" id="hp-text"></div></div>
            <div class="sub-row">
              <div class="dash-pips" id="dash-pips"></div>
              <div class="potions" id="potions" title="Healing Draught (F)"><i class="flask"></i><b id="potion-count">0</b><span class="key">F</span></div>
            </div>
          </div>
        </div>
        <div class="hud-br"><div class="boon-tray" id="boon-tray"></div></div>
        <div class="boss-bar hidden" id="boss-bar"><div class="boss-name" id="boss-name"></div><div class="boss-track"><div class="boss-ghost" id="boss-ghost"></div><div class="boss-fill" id="boss-fill"></div></div></div>
        <div class="prompt hidden" id="prompt"><span class="key">E</span><span id="prompt-text"></span></div>
      </div>
      <div id="banner" class="banner"><div class="b-title"></div><div class="b-rule"></div><div class="b-sub"></div></div>
      <div id="toast" class="toast"><div class="t-title"></div><div class="t-sub"></div></div>
      <div id="notes" class="notes"></div>
      <div id="screen"></div>
    `,this.$=i=>e.querySelector(i),this.hud=this.$("#hud"),this.screen=this.$("#screen"),this.reticle=this.$("#reticle"),this.minimap=this.$("#minimap"),this.mctx=this.minimap.getContext("2d"),this.hpGhost=1,this.bossGhost=1,this.mapT=0,this.boonKey="",window.addEventListener("mousemove",i=>{this.reticle.style.transform=`translate(${i.clientX}px, ${i.clientY}px)`}),e.addEventListener("mouseover",i=>{i.target.closest&&i.target.closest("button")&&this.game.audio.play("ui_hover",{volume:.25,throttle:60})}),e.addEventListener("click",i=>{i.target.closest&&i.target.closest("button")&&this.game.audio.play("ui_click",{volume:.5})}),window.addEventListener("keydown",i=>this.onKey(i))}onKey(e){if(this.boonHandler&&["Digit1","Digit2","Digit3"].includes(e.code)){const t=Number(e.code.slice(-1))-1;this.boonHandler(t)}this.rerollHandler&&e.code==="KeyR"&&this.rerollHandler()}showLoading(e){let t=this.$("#loading");t||(t=ks(`<div id="loading" class="loading">
        <div class="logo small">EMBERDEEP</div>
        <div class="load-track"><div class="load-fill"></div></div>
        <div class="load-hint">Kindling the depths…</div>
      </div>`),this.root.appendChild(t)),t.querySelector(".load-fill").style.width=`${Math.round(e*100)}%`}hideLoading(){const e=this.$("#loading");e&&(e.classList.add("out"),setTimeout(()=>e.remove(),900))}fade(e,t=1){const i=this.$("#fade");i.style.transitionDuration=`${t}s`,i.classList.toggle("on",e>.5)}renownHtml(e){const t=e.renown,i=es(t.level),n=t.level>=Vs;let s="";for(let r=t.level+1;r<=Vs;r++)if(sr[r]){s=`Renown ${r}: ${sr[r].map(o=>o.label).join(" · ")}`;break}return`<div class="renown">
      <div class="rn-top"><span class="rn-lvl">Renown <b>${t.level}</b></span><span class="rn-title">${zx(t.level)}</span></div>
      <div class="rn-bar"><i style="width:${n?100:t.xp/i*100}%"></i></div>
      <div class="rn-next">${n?"The flame burns as bright as it can":`${mt(t.xp)} / ${mt(i)}${s?` · next: ${s}`:""}`}</div>
    </div>`}showTitle(){const e=this.game,t=e.meta;this.reticle.classList.remove("active"),this.fade(0,2),this.screen.innerHTML="";const i=t.dailyState(),n=t.streakAlive(),s=Object.keys(t.unread).length,r=t.loadout,o=t.vowsUnlocked?nr(r.vows):0,c=Pt[t.has("weapon",r.weapon)?r.weapon:"blade"],l=ks(`<div class="title-screen">
      <div class="title-left">
        <div class="logo">EMBERDEEP</div>
        <div class="tagline">Descend. Burn. Rise again.</div>
        ${this.renownHtml(t)}
        <nav class="menu">
          <button class="mbtn primary" data-a="start"><span>Descend</span><em class="warm">${c.name}${o?` · Heat ${o}`:""}</em></button>
          <button class="mbtn ${i.attempts?"":"fresh"}" data-a="daily"><span>Daily Rite</span><em class="warm">${i.attempts?`best ${mt(i.best)}`:"new rite today"}${n?` · ${n}-day streak`:""}</em></button>
          <button class="mbtn" data-a="sanctum"><span>The Sanctum</span><em>${mt(t.souls)} souls</em></button>
          <button class="mbtn" data-a="codex"><span>Codex</span><em class="warm">${s?`${s} new page${s>1?"s":""}`:`${Object.keys(t.deeds).length} / ${js.length} deeds`}</em></button>
          <button class="mbtn" data-a="howto"><span>How to Play</span></button>
          <button class="mbtn" data-a="settings"><span>Settings</span></button>
        </nav>
        <div class="title-stats">
          <div><b>${t.stats.runs}</b><span>Descents</span></div>
          <div><b>${t.stats.wins}</b><span>Victories</span></div>
          <div><b>${t.maxHeatWin>=0?t.maxHeatWin:"—"}</b><span>Best Heat</span></div>
          <div><b>${t.stats.deepestAbyss||"—"}</b><span>Abyss</span></div>
          <div><b>${t.stats.bestScore?mt(t.stats.bestScore):"—"}</b><span>Best Score</span></div>
        </div>
      </div>
      <div class="click-start ${e.audio.ctx.state==="running"?"hidden":""}">Click anywhere to awaken</div>
      ${matchMedia("(pointer: coarse)").matches&&!matchMedia("(pointer: fine)").matches?'<div class="touch-note">Emberdeep plays with a keyboard and mouse, or a gamepad.</div>':""}
      <div class="credits">Models: Meshy · Voice of the deep: ElevenLabs · Built with three.js</div>
    </div>`);this.screen.appendChild(l);const h=()=>{e.audio.unlock(),e.audio.playMusic("music_title",2.5),l.querySelector(".click-start")?.classList.add("hidden")};l.addEventListener("pointerdown",h,{once:!0}),e.audio.ctx.state==="running"&&e.audio.playMusic("music_title",2.5),l.querySelectorAll("button").forEach(d=>d.addEventListener("click",u=>{u.stopPropagation(),h();const f=d.dataset.a;f==="start"?Gs.filter(b=>t.has("weapon",b)).length>1||t.vowsUnlocked||Th.filter(b=>t.has("hue",b)).length>1?this.showLoadout():this.launch(!1):f==="daily"?this.showDaily():f==="sanctum"?this.showSanctum(()=>this.showTitle()):f==="codex"?this.showCodex("chronicle",()=>this.showTitle()):f==="howto"?this.showHowTo(()=>this.showTitle()):f==="settings"&&this.showSettings(()=>this.showTitle())}))}launch(e){this.screen.innerHTML="",this.fade(1,.6),setTimeout(()=>this.game.startRun({daily:e}),650)}showLoadout(){const e=this.game,t=e.meta,i=t.loadout;t.has("weapon",i.weapon)||(i.weapon="blade"),t.has("hue",i.hue)||(i.hue="ember");const n=()=>{const s=t.vowsUnlocked?nr(i.vows):0,r=this.modal(`<h2>Prepare Your Descent</h2>
        <div class="lo-sec"><h3>Armament</h3>
          <div class="weapons">${Gs.map(o=>{const c=Pt[o],l=t.has("weapon",o),h=t.bestHeat[o];return`<button class="wcard ${i.weapon===o?"on":""} ${l?"":"locked"}" data-w="${o}" ${l?"":"disabled"}>
              <div class="wc-icon">${di(c.icon)}</div>
              <div class="wc-name">${c.name}</div>
              <div class="wc-title">${c.title}</div>
              <div class="wc-desc">${l?c.desc:`Reach Renown ${Ws("weapon",o)} to unlock`}</div>
              ${l?`<div class="wc-passive">${c.passive}</div>`:""}
              <div class="wc-best">${h!==void 0?`Vorthak slain · best Heat ${h}`:l?"Vorthak not yet slain":""}</div>
            </button>`}).join("")}</div>
        </div>
        <div class="lo-sec"><h3>Pyre Vows <span class="heat-chip ${s?"hot":""}">Heat ${s}</span>${s?`<span class="mult">souls ×${(1+.1*s).toFixed(1)} · score ×${(1+.15*s).toFixed(2)}</span>`:""}</h3>
          ${t.vowsUnlocked?`<div class="vow-grid">${ur.map(o=>{const c=t.renown.level>=o.renown,l=i.vows[o.id]||0;return`<button class="vow ${l?"on":""} ${c?"":"locked"}" data-v="${o.id}" ${c?"":"disabled"}>
                    <span class="v-icon">${di(o.icon)}</span>
                    <span class="v-body"><b>${o.name}</b><span>${c?o.desc(Math.max(1,l)):`Renown ${o.renown}`}</span></span>
                    <span class="v-pips">${Array.from({length:o.ranks},(h,d)=>`<i class="${d<l?"on":""}"></i>`).join("")}</span>
                  </button>`}).join("")}</div>
                <div class="lo-note">Click a vow to raise its rank. Clearing a new Heat earns bonus souls; best Heat is tracked per armament. Max Heat ${Ox}.</div>`:'<div class="lo-locked">Defeat Vorthak to swear Pyre Vows: optional oaths that make the deep crueler and the rewards richer.</div>'}
        </div>
        <div class="lo-sec"><h3>Flame</h3>
          <div class="hues">${Th.map(o=>{const c=t.has("hue",o),l=_n[o];return`<button class="hue ${i.hue===o?"on":""}" data-h="${o}" ${c?"":"disabled"} title="${c?l.name:`${l.name}: Renown ${Ws("hue",o)}`}" style="--hc:${l.css}"><i></i><span>${c?l.name:`R${Ws("hue",o)}`}</span></button>`}).join("")}</div>
        </div>
        <div class="row"><button class="mbtn primary" data-a="go"><span>Begin Descent</span></button><button class="mbtn" data-a="back"><span>Back</span></button></div>`,"wide loadout");r.querySelectorAll("[data-w]").forEach(o=>o.onclick=()=>{i.weapon=o.dataset.w,t.save(),e.refreshTitle(),n()}),r.querySelectorAll("[data-v]").forEach(o=>o.onclick=()=>{const c=Oa[o.dataset.v];i.vows[c.id]=((i.vows[c.id]||0)+1)%(c.ranks+1),e.audio.play(i.vows[c.id]?"vow":"ui_click",{volume:i.vows[c.id]?.35:.5,rate:1+(i.vows[c.id]||0)*.08}),t.save(),n()}),r.querySelectorAll("[data-h]").forEach(o=>o.onclick=()=>{i.hue=o.dataset.h,t.save(),e.refreshTitle(),n()}),r.querySelector("[data-a=go]").onclick=()=>this.launch(!1),r.querySelector("[data-a=back]").onclick=()=>this.showTitle()};n()}showDaily(){const t=this.game.meta,i=Hd(),n=t.dailyState(i.key),s=t.streakAlive(i.key),r=Pt[i.weapon],o=new Date(i.key+"T12:00:00Z").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}),c=this.modal(`<h2>Daily Rite</h2>
      <div class="daily-date">${o}</div>
      <div class="daily-card">
        <div class="dc-mut"><b>${i.mutator.name}</b><span>${i.mutator.desc}</span></div>
        <div class="dc-row"><span class="dc-k">Armament</span><span class="dc-v">${di(r.icon)} ${r.name}</span></div>
        <div class="dc-row"><span class="dc-k">Vows · Heat ${i.heat}</span><span class="dc-v vows">${Object.entries(i.vows).map(([l,h])=>`<em>${Oa[l].name}${Oa[l].ranks>1?` ${ki(h)}`:""}</em>`).join("")}</span></div>
      </div>
      <div class="daily-stats">
        <div><b>${n.best?mt(n.best):"—"}</b><span>Today's best</span></div>
        <div><b>${n.attempts}</b><span>Attempts</span></div>
        <div><b>${s}</b><span>Day streak</span></div>
        <div><b>${t.streak.best}</b><span>Best streak</span></div>
      </div>
      <p class="daily-note">Everyone draws the same depths, foes and boon offers today. ${n.done?"Today’s offering is claimed; play again to beat your score.":`Your first rite today pays an offering of <b class="cyan">${20+10*Math.min(7,s+1)}+ souls</b>, more for a longer streak.`}</p>
      <div class="row"><button class="mbtn primary" data-a="go"><span>Begin the Rite</span></button><button class="mbtn" data-a="back"><span>Back</span></button></div>`,"daily");c.querySelector("[data-a=go]").onclick=()=>this.launch(!0),c.querySelector("[data-a=back]").onclick=()=>this.showTitle()}showCodex(e="chronicle",t){const i=this.game,n=i.meta,s=[["chronicle","Chronicle"],["deeds","Deeds"],["boons","Boons"],["bestiary","Bestiary"],["records","Records"]];let r="";if(e==="chronicle")r=`<div class="chron">${Bd.map((l,h)=>{const d=!!n.chronicle[l.id],u=n.unread[l.id];return`<div class="page ${d?"":"locked"} ${u?"fresh":""}"><div class="pg-num">${ki(h+1)}</div><div class="pg-body"><b>${d?l.title:"— Sealed —"}</b><p>${d?l.text:l.hint}</p></div></div>`}).join("")}</div>`,n.unread={},n.save();else if(e==="deeds")r=`<div class="deeds">${js.map(l=>{const h=!!n.deeds[l.id],d=!h&&l.progress?l.progress(n):null;return`<div class="deed ${h?"done":""}"><div class="dd-mark">${h?"✦":""}</div><div class="dd-body"><b>${l.name}</b><span>${l.desc}</span>${d?`<div class="dd-bar"><i style="width:${Math.min(100,d[0]/d[1]*100)}%"></i><em>${mt(Math.min(d[0],d[1]))} / ${mt(d[1])}</em></div>`:""}</div><div class="dd-r">${l.souls?`<i class="soul"></i>${l.souls}`:""}</div></div>`}).join("")}</div>`;else if(e==="boons"){const l=new Set([...n.found.boons,...n.found.fusions]);r=[["Boons",mi.filter(d=>!d.weapon&&!d.fusion)],["Armament Aspects",mi.filter(d=>d.weapon)],["Fusions",mi.filter(d=>d.fusion)]].map(([d,u])=>`<h4>${d} <span>${u.filter(f=>l.has(f.id)).length} / ${u.length}</span></h4><div class="bcodex">${u.map(f=>{const g=l.has(f.id),b=jn[f.rarity],m=f.fusion?`${Ii[f.fusion[0]].name} + ${Ii[f.fusion[1]].name}`:f.weapon?Pt[f.weapon].name:f.renown&&n.renown.level<f.renown?`Renown ${f.renown}`:"Not yet found";return`<div class="bx ${g?"":"locked"}" style="--c:${b.color};--g:${b.glow}"><div class="bx-icon">${di(f.icon)}</div><div><b>${g?f.name:"???"}</b><span>${g?f.desc:m}</span>${g&&f.fusion?`<em>${m}</em>`:""}</div></div>`}).join("")}</div>`).join("")}else e==="bestiary"?r=`<div class="beasts">${Object.entries(Gx).map(([l,h])=>{const d=l==="boss"?n.stats.wins:n.stats.killsBy[l]||0,u=d>0;return`<div class="beast ${u?"":"locked"}"><b>${u?dr[l].name:"???"}</b><span class="bk">${mt(d)} ${l==="boss"?"defeats":"slain"}</span><p>${u?h.blurb:"Not yet encountered."}</p></div>`}).join("")}</div>`:e==="records"&&(r=`<div class="records">${[["Best score",n.stats.bestScore?mt(n.stats.bestScore):"—"],["Highest Heat cleared",n.maxHeatWin>=0?n.maxHeatWin:"—"],...Gs.map(h=>[`${Pt[h].name}: best Heat`,n.bestHeat[h]!==void 0?n.bestHeat[h]:"—"]),["Deepest Abyss",n.stats.deepestAbyss||"—"],["Fastest victory",n.stats.fastestWin?za(n.stats.fastestWin):"—"],["Descents",n.stats.runs],["Victories",n.stats.wins],["Foes slain",mt(n.stats.kills)],["Champions felled",n.stats.champions],["Ember Trials won",n.stats.trials],["Daily Rites",`${n.stats.dailies} · best streak ${n.streak.best}`],["Deeds",`${Object.keys(n.deeds).length} / ${js.length}`]].map(([h,d])=>`<div><span>${h}</span><b>${d}</b></div>`).join("")}</div>
        <div class="row"><button class="mbtn danger" data-a="wipe"><span>Erase All Progress</span></button></div>`);const o=this.modal(`<h2>Codex</h2>
      <div class="tabs">${s.map(([l,h])=>`<button class="tab ${l===e?"on":""}" data-t="${l}">${h}${l==="chronicle"&&Object.keys(n.unread).length?" •":""}</button>`).join("")}</div>
      <div class="codex-body">${r}</div>
      <div class="row"><button class="mbtn" data-a="back"><span>Back</span></button></div>`,"wide codex");o.querySelectorAll("[data-t]").forEach(l=>l.onclick=()=>{i.audio.play("page",{volume:.4}),this.showCodex(l.dataset.t,t)}),o.querySelector("[data-a=back]").onclick=t;const c=o.querySelector("[data-a=wipe]");c&&(c.onclick=()=>{c.dataset.armed?(n.reset(),location.reload()):(c.dataset.armed="1",c.querySelector("span").textContent="Click again to erase everything")})}modal(e,t=""){this.screen.innerHTML="";const i=ks(`<div class="modal-wrap ${t}"><div class="modal">${e}</div></div>`);return this.screen.appendChild(i),i}showHowTo(e){const t=this.modal(`
      <h2>How to Play</h2>
      <div class="howto">
        <div class="keys">
          <div><span class="key">W A S D</span> Move</div>
          <div><span class="key">Mouse</span> Aim</div>
          <div><span class="key">LMB</span> Strike — chain your combo into a finisher</div>
          <div><span class="key">Space</span> / <span class="key">RMB</span> Dash — invulnerable, 2 charges</div>
          <div><span class="key">Q</span> Cinder Nova — unleash when the ember orb is full</div>
          <div><span class="key">E</span> Interact — chests, shrines, portals</div>
          <div><span class="key">F</span> Drink a Healing Draught</div>
          <div><span class="key">R</span> Reroll a boon offering (Fate’s Whim)</div>
          <div><span class="key">Esc</span> Pause</div>
        </div>
        <div class="lore">
          <p>The Ember that warmed the world has fallen into the deep. Seven depths lie between you and the Cinder King who hoards it, and below his throne, the endless <b class="cyan">Abyss</b>.</p>
          <p>Each sealed chamber shows its <b class="gold">reward sigil</b> over the doorway: a boon, gold, souls, a Heart of Ash, an Ember Forge. Choose your route. Red skull sigils mark optional <b class="red">Ember Trials</b>, which are harder and pay better. Some depths end with a named <b class="red">Champion</b>.</p>
          <p>Hold two boons that resonate and a <b style="color:#3ff0c8">Fusion</b> may appear. Each armament has its own aspects.</p>
          <p><b class="cyan">Souls</b> persist in death and buy Sanctum rites. Every descent earns <b class="gold">Renown</b>, which unlocks armaments, boons, flames and vows. Slay Vorthak to swear <b class="red">Pyre Vows</b>, which raise the Heat for richer rewards. A new <b class="gold">Daily Rite</b> waits every day.</p>
          <p class="dim">Gamepad supported.</p>
        </div>
      </div>
      <div class="row"><button class="mbtn" data-a="back"><span>Back</span></button></div>`);t.querySelector("[data-a=back]").onclick=e}showSettings(e){const t=this.game,i=t.audio.volumes,n=t.R.quality,s=this.modal(`
      <h2>Settings</h2>
      <div class="settings">
        <label>Master<input type="range" min="0" max="1" step="0.05" value="${i.master}" data-k="master"></label>
        <label>Music<input type="range" min="0" max="1" step="0.05" value="${i.music}" data-k="music"></label>
        <label>Effects<input type="range" min="0" max="1" step="0.05" value="${i.sfx}" data-k="sfx"></label>
        <label>Graphics
          <div class="seg">${["high","medium","low"].map(r=>`<button class="${r===n?"on":""}" data-q="${r}">${r}</button>`).join("")}</div>
        </label>
      </div>
      <div class="row"><button class="mbtn" data-a="back"><span>Back</span></button></div>`);s.querySelectorAll("input[type=range]").forEach(r=>r.oninput=()=>t.audio.setVolume(r.dataset.k,Number(r.value))),s.querySelectorAll("[data-q]").forEach(r=>r.onclick=()=>{t.R.setQuality(r.dataset.q),s.querySelectorAll("[data-q]").forEach(o=>o.classList.toggle("on",o===r))}),s.querySelector("[data-a=back]").onclick=e}showSanctum(e){const t=this.game,i=t.meta,n=()=>{const s=this.modal(`
        <h2>The Sanctum</h2>
        <div class="sanctum-souls"><i class="soul"></i><b>${i.souls}</b> souls</div>
        <div class="upgrades">
          ${ar.map(r=>{const o=i.level(r.id),c=o>=r.max,l=i.upgradeUnlocked(r),h=c?"—":r.cost(o);return`<div class="upg ${c?"maxed":""} ${i.canBuy(r)?"afford":""} ${l?"":"sealed"}">
              <div class="upg-icon">${di(r.icon)}</div>
              <div class="upg-body"><div class="upg-name">${r.name}</div><div class="upg-desc">${l?r.desc:`Sealed until Renown ${r.renown}`}</div>
                <div class="pips">${Array.from({length:r.max},(d,u)=>`<i class="${u<o?"on":""}"></i>`).join("")}</div></div>
              <button class="buy" data-id="${r.id}" ${i.canBuy(r)?"":"disabled"}>${c?"Mastered":l?`<i class="soul"></i>${h}`:`R${r.renown}`}</button>
            </div>`}).join("")}
        </div>
        <div class="row"><button class="mbtn" data-a="back"><span>Back</span></button></div>`,"wide");s.querySelectorAll(".buy").forEach(r=>r.onclick=()=>{const o=ar.find(c=>c.id===r.dataset.id);i.buy(o)&&(t.audio.play("levelup",{volume:.6}),n())}),s.querySelector("[data-a=back]").onclick=e};n()}showHUD(e){this.hud.classList.toggle("hidden",!e),this.reticle.classList.toggle("active",e),e&&(this.screen.innerHTML="")}onFloorStart(e){const t=this.game,i=e.floorIndex;this.$(".floor-num").textContent=tr(i),this.$(".floor-name").textContent=e.biome.name,this.boonKey="",this.bossBar(null);const n=t.run,s=[];n?.daily&&s.push(`<span class="tag daily">Daily Rite · ${n.daily.mutator.name}</span>`),n?.heat&&s.push(`<span class="tag heat" title="${Object.entries(n.vows).map(([r,o])=>`${Oa[r].name} ${ki(o)}`).join(", ")}">Heat ${n.heat}</span>`),t.mods.floorTimer&&s.push('<span class="tag glass" id="hourglass">4:00</span>'),this.$("#run-tags").innerHTML=s.join("")}onRoomEnter(){}updateHUD(e){const t=this.game,i=t.player;if(!i)return;const n=i.stats,s=Math.max(0,i.hp/n.maxHp);this.hpGhost=this.hpGhost>s?Math.max(s,this.hpGhost-e*.6):s,this.$("#hp-fill").style.width=`${s*100}%`,this.$("#hp-ghost").style.width=`${this.hpGhost*100}%`,this.$("#hp-text").textContent=`${Math.ceil(i.hp)} / ${n.maxHp}`,this.hud.classList.toggle("low",s<.3);const r=this.$("#nova-ring"),o=2*Math.PI*44;r.style.strokeDasharray=`${o}`,r.style.strokeDashoffset=`${o*(1-i.nova/100)}`,this.$("#nova-orb").classList.toggle("ready",i.nova>=100);const c=this.$("#dash-pips");c.childElementCount!==n.dashCharges&&(c.innerHTML=Array.from({length:n.dashCharges},()=>"<i><b></b></i>").join("")),[...c.children].forEach((d,u)=>{const f=u<i.dashes;d.classList.toggle("full",f),d.firstChild.style.height=f?"100%":u===i.dashes?`${i.dashTimer/n.dashRecharge*100}%`:"0%"}),this.$("#potion-count").textContent=i.potions,this.$("#potions").classList.toggle("empty",i.potions===0),this.$("#hud-gold").textContent=i.gold,this.$("#hud-souls").textContent=i.souls;const l=this.$("#hourglass");if(l){const d=t.floorTimer;l.textContent=d>0?za(d):d<0?"Burning":"Safe",l.classList.toggle("warn",d>0&&d<45),l.classList.toggle("burn",d<0)}const h=JSON.stringify(i.boons);if(h!==this.boonKey&&(this.boonKey=h,this.$("#boon-tray").innerHTML=Object.entries(i.boons).map(([d,u])=>{const f=Ii[d],g=jn[f.rarity];return`<div class="boon-chip" style="--c:${g.color};--g:${g.glow}" title="${f.name} ${ki(u)} — ${f.desc}">${di(f.icon)}${u>1?`<span>${u}</span>`:""}</div>`}).join("")),this.boss){const d=Math.max(0,this.boss.hp/this.boss.maxHp);this.bossGhost=this.bossGhost>d?Math.max(d,this.bossGhost-e*.25):d,this.$("#boss-fill").style.width=`${d*100}%`,this.$("#boss-ghost").style.width=`${this.bossGhost*100}%`,this.$("#boss-bar").classList.toggle("enraged",this.boss.phase===2),!this.boss.alive&&this.boss.champion&&this.bossBar(null)}this.mapT-=e,this.mapT<=0&&(this.mapT=.1,this.drawMinimap())}drawMinimap(){const e=this.game,t=e.level,i=e.player;if(!t||!i)return;const n=this.mctx,s=200,r=4.2;n.clearRect(0,0,s,s);const o=i.pos.x/ge,c=i.pos.z/ge,l=s/2-o*r,h=s/2-c*r,d=Math.ceil(s/r/2)+2,u=Math.max(0,Math.floor(o-d)),f=Math.min(t.W-1,Math.ceil(o+d)),g=Math.max(0,Math.floor(c-d)),b=Math.min(t.H-1,Math.ceil(c+d));for(let p=g;p<=b;p++)for(let v=u;v<=f;v++){const _=p*t.W+v;if(!t.explored[_])continue;const x=t.tiles[_];if(x===0){t.nearOpen(v,p)&&(n.fillStyle="rgba(120,105,90,0.55)",n.fillRect(l+v*r,h+p*r,r,r));continue}const A=t.roomMap[_];let w="rgba(160,150,140,0.35)";if(x===2)w="rgba(255,90,20,0.7)";else if(A>=0){const R=t.rooms[A];w=R.state==="active"?"rgba(220,60,40,0.55)":R.state==="cleared"?"rgba(200,190,170,0.4)":"rgba(200,170,130,0.5)"}t.solid[_]&&x===1&&(w="rgba(255,60,30,0.9)"),n.fillStyle=w,n.fillRect(l+v*r,h+p*r,r+.3,r+.3)}const m=(p,v,_,x=4)=>{const A=l+p/ge*r,w=h+v/ge*r;n.beginPath(),n.arc(A,w,x,0,Math.PI*2),n.fillStyle=_,n.shadowColor=_,n.shadowBlur=8,n.fill(),n.shadowBlur=0};for(const p of t.interactables){const v=Math.floor(p.pos.x/ge),_=Math.floor(p.pos.z/ge);!t.explored[_*t.W+v]||p.used||m(p.pos.x,p.pos.z,p.kind==="portal"?p.enabled?"#ff8a3a":"#7a5a40":p.kind==="shrine"?"#ffd27a":"#ffcc40",4.5)}for(const p of t.rooms){if(!p.reward||p.state!=="idle")continue;const v=Math.floor(p.x+p.w/2),_=Math.floor(p.y+p.h/2);if(![[v,_],[p.x,p.y],[p.x+p.w-1,p.y+p.h-1],[p.x,p.y+p.h-1],[p.x+p.w-1,p.y]].some(([P,M])=>t.explored[M*t.W+P]))continue;const A=zd[p.reward],w=l+p.center.x/ge*r,R=h+p.center.z/ge*r;n.save(),n.translate(w-8,R-8),n.beginPath(),n.arc(8,8,10,0,Math.PI*2),n.fillStyle="rgba(10,6,4,0.75)",n.fill(),n.strokeStyle=A.color,n.lineWidth=1.5,n.stroke(),n.translate(1.5,1.5),n.scale(13/24,13/24),n.fillStyle=A.color,n.shadowColor=A.color,n.shadowBlur=6,n.fill(this.iconPath(A.icon)),n.restore()}for(const p of e.enemies)p.alive&&p.state!=="spawning"&&m(p.pos.x,p.pos.z,p===e.boss||p.champion?"#ff3a1a":"#e04040",p===e.boss?6:p.champion?4.5:2.4);for(const p of e.boonOrbs)m(p.pos.x,p.pos.z,"#ffe08a",4);n.save(),n.translate(s/2,s/2),n.rotate(-i.yaw+Math.PI),n.beginPath(),n.moveTo(0,-7),n.lineTo(5,5),n.lineTo(0,2.5),n.lineTo(-5,5),n.closePath(),n.fillStyle="#fff3d6",n.shadowColor="#ff9a40",n.shadowBlur=10,n.fill(),n.restore()}iconPath(e){return this.paths=this.paths||{},this.paths[e]=this.paths[e]||new Path2D(ir[e])}bossBar(e){this.boss=e;const t=this.$("#boss-bar");t.classList.toggle("hidden",!e),e&&(this.$("#boss-name").textContent=e.displayName||e.def.name,t.classList.toggle("champion",!!e.champion),this.bossGhost=1)}notify(e,t,i=""){const n=ks(`<div class="note ${e}"><div class="n-k">${{deed:"Deed",page:"Chronicle",codex:"Codex",fusion:"Fusion",heat:"Heat"}[e]||""}</div><div class="n-t"></div><div class="n-s"></div></div>`);n.querySelector(".n-t").textContent=t,n.querySelector(".n-s").textContent=i;const s=this.$("#notes");for(s.appendChild(n);s.children.length>4;)s.firstChild.remove();setTimeout(()=>n.classList.add("out"),4200),setTimeout(()=>n.remove(),4900)}pulse(e){const t={dash:"#dash-pips",dashUsed:"#dash-pips",nova:"#nova-orb",novaReady:"#nova-orb",novaDenied:"#nova-orb"},i=this.$(t[e]||"#hud");if(!i)return;const n=e==="novaDenied"?"deny":"pulse";i.classList.remove(n),i.offsetWidth,i.classList.add(n)}prompt(e,t){const i=this.$("#prompt");if(!e){i.classList.add("hidden"),this.promptPos=null;return}i.classList.remove("hidden"),this.$("#prompt-text").textContent=e,this.promptPos=t}floatText(e,t,i="normal"){const n=document.createElement("div");n.className=`ft ft-${i}`,n.textContent=i==="crit"?`${t}!`:t,this.$("#floaters").appendChild(n),this.floaters.push({el:n,pos:e.clone(),t:0,life:i==="crit"?1:.8,vx:(Math.random()-.5)*50,kind:i}),this.floaters.length>60&&this.floaters.shift().el.remove()}banner(e,t="",i=2.5,n="floor"){const s=this.$("#banner");s.className=`banner ${n}`,s.querySelector(".b-title").textContent=e,s.querySelector(".b-sub").textContent=t,s.offsetWidth,s.classList.add("show"),clearTimeout(this.bannerTO),this.bannerTO=setTimeout(()=>s.classList.remove("show"),i*1e3)}toast(e,t="",i=2){const n=this.$("#toast");n.querySelector(".t-title").textContent=e,n.querySelector(".t-sub").textContent=t,n.classList.add("show"),clearTimeout(this.toastTO),this.toastTO=setTimeout(()=>n.classList.remove("show"),i*1e3)}update(e){const t=this.game.camera,i=window.innerWidth,n=window.innerHeight;for(let r=this.floaters.length-1;r>=0;r--){const o=this.floaters[r];o.t+=e;const c=o.t/o.life;if(c>=1){o.el.remove(),this.floaters.splice(r,1);continue}this.v.copy(o.pos).project(t);const l=(this.v.x*.5+.5)*i+o.vx*c,h=(-this.v.y*.5+.5)*n-60*Math.sqrt(c)-(o.kind==="crit"?20*c:0),d=o.kind==="crit"?1+Math.max(0,.6-o.t*4):1+Math.max(0,.35-o.t*3);o.el.style.transform=`translate(${l}px, ${h}px) translate(-50%,-50%) scale(${d})`,o.el.style.opacity=c>.7?1-(c-.7)/.3:1}if(this.promptPos){this.v.copy(this.promptPos).setY(2.4).project(t);const r=this.$("#prompt");r.style.transform=`translate(${(this.v.x*.5+.5)*i}px, ${(-this.v.y*.5+.5)*n}px) translate(-50%, -100%)`}const s=this.game.input;if(this.boonHandler&&s.padState.connected)s.padPressed(14)&&this.moveBoonSel(-1),s.padPressed(15)&&this.moveBoonSel(1),s.padPressed(0)&&this.boonHandler(this.boonSel||0);else if(s.padState.connected){const r=this.screen.querySelector(".modal-wrap, .title-screen"),o=r?[...r.querySelectorAll("button:not([disabled])")]:[];if(o.length){o.includes(this.padFocusEl)||(this.padFocusEl=o.find(l=>l.classList.contains("primary"))||o[0]);let c=o.indexOf(this.padFocusEl);(s.padPressed(13)||s.padPressed(15))&&(c=(c+1)%o.length),(s.padPressed(12)||s.padPressed(14))&&(c=(c-1+o.length)%o.length),this.padFocusEl=o[c],o.forEach(l=>l.classList.toggle("padfocus",l===this.padFocusEl)),s.padPressed(0)?(this.game.audio.unlock(),this.padFocusEl.click()):s.padPressed(1)&&r.querySelector("[data-a=back],[data-a=close],[data-a=resume]")?.click()}}}moveBoonSel(e){const t=[...this.screen.querySelectorAll(".boon-card")];this.boonSel=((this.boonSel||0)+e+t.length)%t.length,t.forEach((i,n)=>i.classList.toggle("sel",n===this.boonSel))}showBoonChoice(e,t,i=null){const n=this.game.player;this.reticle.classList.remove("active");const s=this.modal(`<h2 class="boon-h">Choose a Boon</h2>
      <div class="boon-cards">${e.map((c,l)=>{const h=jn[c.rarity],d=(n.boons[c.id]||0)+1,u=c.fusion?`<div class="bc-tag">${Ii[c.fusion[0]].name} + ${Ii[c.fusion[1]].name}</div>`:c.weapon?`<div class="bc-tag">${Pt[c.weapon].name} aspect</div>`:"";return`<button class="boon-card ${c.rarity}" style="--c:${h.color};--g:${h.glow}; animation-delay:${l*.09}s" data-i="${l}">
            <div class="bc-rarity">${h.label}</div>
            <div class="bc-icon">${di(c.icon)}</div>
            <div class="bc-name">${c.name}${c.max>1?` <span class="lvl">${ki(d)}</span>`:""}</div>
            <div class="bc-desc">${c.desc}</div>
            ${u}
            <div class="bc-key">${l+1}</div>
          </button>`}).join("")}</div>
      ${i&&n.rerolls>0?`<div class="row"><button class="mbtn reroll" data-a="reroll"><span>Reroll</span><em>${n.rerolls} left · R</em></button></div>`:""}`,"boons");let r=!1;const o=c=>{if(r||!e[c])return;r=!0,this.boonHandler=null,this.rerollHandler=null,s.querySelectorAll(".boon-card")[c].classList.add("picked"),s.classList.add("closing"),setTimeout(()=>{this.screen.innerHTML="",this.reticle.classList.add("active"),t(e[c])},380)};this.boonSel=0,this.boonHandler=o,this.rerollHandler=null,i&&n.rerolls>0&&(this.rerollHandler=()=>{if(r)return;const c=i();c&&c.length&&(r=!0,this.boonHandler=null,this.rerollHandler=null,this.showBoonChoice(c,t,i))},s.querySelector("[data-a=reroll]").onclick=this.rerollHandler),s.querySelectorAll(".boon-card").forEach(c=>c.onclick=()=>o(Number(c.dataset.i)))}showShop(e,t,i,n){this.reticle.classList.remove("active");const s=()=>{const r=this.modal(`<h2>The Pyre Merchant</h2>
        <div class="shop-quote">"Gold means nothing down here, wanderer. But it buys me warmth."</div>
        <div class="shop-gold"><i class="coin"></i><b>${t.gold}</b> gold</div>
        <div class="shop-items">${e.map((o,c)=>`<div class="shop-item ${o.qty<=0?"sold":""}">
              <div class="upg-icon">${di(o.icon)}</div>
              <div class="upg-body"><div class="upg-name">${o.name}</div><div class="upg-desc">${o.desc}</div><div class="stock">${o.qty>0?`${o.qty} left`:"Sold out"}</div></div>
              <button class="buy gold" data-i="${c}" ${o.qty>0&&t.gold>=o.price?"":"disabled"}><i class="coin"></i>${o.price}</button>
            </div>`).join("")}</div>
        <div class="row"><button class="mbtn" data-a="close"><span>Leave</span></button></div>`,"wide shop");r.querySelectorAll(".buy").forEach(o=>o.onclick=()=>{const c=e[Number(o.dataset.i)];i(c)&&this.game.state==="shop"&&s()}),r.querySelector("[data-a=close]").onclick=n};s()}hideShop(){this.screen.innerHTML="",this.reticle.classList.add("active")}controlsHint(){const e=ks(`<div class="controls-hint">
      <div><span class="key">WASD</span>Move</div>
      <div><span class="key">LMB</span>Strike</div>
      <div><span class="key">SPACE</span>Dash</div>
      <div><span class="key">Q</span>Cinder Nova</div>
      <div><span class="key">E</span>Interact</div>
      <div><span class="key">F</span>Potion</div>
    </div>`);this.hud.appendChild(e),setTimeout(()=>e.classList.add("out"),12e3),setTimeout(()=>e.remove(),13500)}showPause(){const e=this.game;this.reticle.classList.remove("active");const t=e.player,i=this.modal(`
      <h2>Paused</h2>
      <div class="pause-info">${tr(e.floorIndex)} — ${e.level.biome.name} · ${za(e.runStats.time)} · ${e.runStats.kills} slain · ${Pt[e.run.weapon].name}${e.run.heat?` · Heat ${e.run.heat}`:""}</div>
      ${e.run.daily?`<div class="pause-mut"><b>${e.run.daily.mutator.name}</b> ${e.run.daily.mutator.desc}</div>`:""}
      <div class="pause-boons">${Object.entries(t.boons).map(([n,s])=>{const r=Ii[n];return`<div class="pb" style="--c:${jn[r.rarity].color}">${di(r.icon)}<div><b>${r.name} ${ki(s)}</b><span>${r.desc}</span></div></div>`}).join("")||'<div class="dim">No boons yet.</div>'}</div>
      <div class="row col">
        <button class="mbtn primary" data-a="resume"><span>Resume</span></button>
        <button class="mbtn" data-a="settings"><span>Settings</span></button>
        <button class="mbtn" data-a="howto"><span>How to Play</span></button>
        <button class="mbtn danger" data-a="quit"><span>Abandon Descent</span></button>
      </div>`);i.querySelector("[data-a=resume]").onclick=()=>e.resume(),i.querySelector("[data-a=settings]").onclick=()=>this.showSettings(()=>this.showPause()),i.querySelector("[data-a=howto]").onclick=()=>this.showHowTo(()=>this.showPause()),i.querySelector("[data-a=quit]").onclick=()=>e.abandonRun()}hidePause(){this.screen.innerHTML="",this.reticle.classList.add("active")}showEnd(e){const t=this.game;this.reticle.classList.remove("active");const i=e.victory,n=e.abandoned?"Descent Abandoned":i?"The Ember Is Yours":e.slewKing?"Swallowed by the Abyss":"You Have Fallen",s=e.abandoned?`You turned back at ${e.depth}`:i?e.abyss?`You climbed out of the Abyss at depth ${e.abyss}, the Ember in hand.`:"The Cinder King is ash. For now, the light returns.":e.slewKing?`Vorthak fell by your hand, but the dark took you at ${e.depth}.`:`Claimed by ${e.floorName}, at depth ${e.depth}`,r=e.renownBefore,o=e.renownAfter,c=e.levelUps.flatMap(x=>x.rewards.map(A=>A.label)),l=this.modal(`
      <div class="end-title ${i||e.slewKing?"win":"lose"}">${n}</div>
      <div class="end-sub">${s}</div>
      <div class="end-grid">
        <div class="score-box">
          <div class="sb-k">Score${e.daily?" · Daily Rite":""}</div>
          <div class="sb-total" data-to="${e.score.total}">0</div>
          <div class="sb-lines">${e.score.lines.map(([x,A])=>`<div><span>${x}</span><b>${mt(A)}</b></div>`).join("")}
            ${e.heat?`<div class="mult"><span>Heat ${e.heat}</span><b>×${e.score.mult.toFixed(2)}</b></div>`:""}</div>
        </div>
        <div class="end-side">
          <div class="rn-gain">
            <div class="rn-top"><span class="rn-lvl">Renown <b id="rn-lvl">${r.level}</b></span><span class="rn-xp">+${mt(e.xp)} renown</span></div>
            <div class="rn-bar"><i id="rn-fill" style="width:${r.xp/es(r.level)*100}%"></i></div>
          </div>
          ${c.length?`<div class="end-block unlock"><h5>Unlocked</h5>${c.map(x=>`<div>${x}</div>`).join("")}</div>`:""}
          ${e.records.length||e.dailyBest?`<div class="end-block rec"><h5>New Records</h5>${[...e.records,...e.dailyBest?["Best Daily Rite score today"]:[]].map(x=>`<div>${x}</div>`).join("")}</div>`:""}
          ${e.deeds.length?`<div class="end-block deedz"><h5>Deeds · ${e.deeds.length} complete${e.deeds.some(x=>x.souls)?` · +${e.deeds.reduce((x,A)=>x+A.souls,0)} souls`:""}</h5><div class="chips">${e.deeds.map(x=>`<span>${x.name}</span>`).join("")}</div></div>`:""}
          ${e.pages.length?`<div class="end-block pagez"><h5>Chronicle · new pages</h5><div class="chips">${e.pages.map(x=>`<span>${x.title}</span>`).join("")}</div></div>`:""}
        </div>
      </div>
      <div class="end-stats">
        <div><b>${e.depth}</b><span>Depth</span></div>
        <div><b>${mt(e.kills)}</b><span>Slain</span></div>
        <div><b>${mt(e.damage)}</b><span>Damage</span></div>
        <div><b>${e.rooms}</b><span>Chambers</span></div>
        <div><b>${za(e.time)}</b><span>Time</span></div>
        <div><b>${Pt[e.weapon].name.split(" ").pop()}</b><span>Armament</span></div>
      </div>
      <div class="end-souls"><i class="soul"></i> +${mt(e.souls)} souls banked${e.dailyBonus?` (incl. ${e.dailyBonus} rite offering)`:""} · ${mt(e.totalSouls)} total</div>
      <div class="pause-boons small">${e.boons.map(([x,A])=>{const w=Ii[x];return`<div class="pb" style="--c:${jn[w.rarity].color}">${di(w.icon)}<div><b>${w.name} ${ki(A)}</b></div></div>`}).join("")}</div>
      <div class="row">
        <button class="mbtn primary" data-a="again"><span>${e.daily?"Retry the Rite":i?"Descend Again":"Rise Again"}</span></button>
        ${e.daily?'<button class="mbtn" data-a="share"><span>Copy Result</span></button>':""}
        <button class="mbtn" data-a="sanctum"><span>The Sanctum</span></button>
        <button class="mbtn" data-a="title"><span>Title</span></button>
      </div>`,`end ${i||e.slewKing?"victory":"death"}`),h=l.querySelector(".sb-total"),d=performance.now(),u=e.score.total,f=()=>{const x=Math.min(1,(performance.now()-d)/1400);h.textContent=mt(u*(1-Math.pow(1-x,3))),x<1&&h.isConnected&&requestAnimationFrame(f)};f();const g=l.querySelector("#rn-fill"),b=l.querySelector("#rn-lvl");let m=r.level;const p=[];for(const x of e.levelUps)p.push({to:100,then:x.level});p.push({to:o.level>=Vs?100:o.xp/es(o.level)*100});const v=x=>{if(x>=p.length||!g.isConnected)return;const A=p[x];g.style.transition="width 0.9s cubic-bezier(.3,.8,.3,1)",g.style.width=`${A.to}%`,setTimeout(()=>{g.isConnected&&(A.then&&(m=A.then,b.textContent=m,b.parentElement.classList.add("pop"),t.audio.play("renown",{volume:.6}),g.style.transition="none",g.style.width="0%",g.offsetWidth),v(x+1))},950)};setTimeout(()=>v(0),700),l.querySelector("[data-a=again]").onclick=()=>{this.screen.innerHTML="",this.fade(1,.5),setTimeout(()=>t.startRun({daily:!!e.daily}),550)};const _=l.querySelector("[data-a=share]");_&&(_.onclick=()=>{const x=`Emberdeep Daily Rite ${e.daily.key}
${e.daily.mutator.name} · ${Pt[e.weapon].name} · Heat ${e.heat}
${e.slewKing?"Vorthak slain":`Fell at depth ${e.depth}`} · ${mt(e.score.total)} pts
${"🔥".repeat(Math.max(1,Math.min(7,e.floorIndex+1)))}`;navigator.clipboard?.writeText(x).then(()=>_.querySelector("span").textContent="Copied!",()=>_.querySelector("span").textContent="Copy failed")}),l.querySelector("[data-a=sanctum]").onclick=()=>this.showSanctum(()=>this.showEnd(e)),l.querySelector("[data-a=title]").onclick=()=>t.returnToTitle()}}const so=new T(0,15.5,10.8),Ch={crypt:[{type:"skeleton",name:"Ser Hollowmere",sub:"First Warden of the Ossuary"},{type:"cultist",name:"Mother Ashveil",sub:"Voice of the Choir"}],crystal:[{type:"brute",name:"Grask the Unchained",sub:"Breaker of the Hollows"},{type:"cultist",name:"The Glass Prophet",sub:"Who Sees Through Stone"}],molten:[{type:"brute",name:"Ogrim Forgeheart",sub:"Last of the Bellows-Giants"},{type:"skeleton",name:"The Slag Knight",sub:"Sworn to the Cinder King"}]};class jx{constructor(e,t){this.canvas=e,this.R=new gb(e),this.renderer=this.R,this.scene=this.R.scene,this.camera=this.R.camera,this.input=new Lb(e),this.audio=new Fb,this.assets=new _x,this.fx=new Pb(this.scene),this.meta=new Rh,this.ui=new Wx(t,this),this.clock=new Ed,this.time=0,this.state="loading",this.session=0,this.enemies=[],this.projectiles=[],this.pickups=[],this.groundFires=[],this.shockwaves=[],this.boonOrbs=[],this.sigils=[],this.notifyQ=[],this.mods=io(),this.trauma=0,this.hitStopT=0,this.timeScale=1,this.slowMoT=0,this.mouseWorld=new T,this.camTarget=new T,this.camPos=new T,this.raycaster=new rb,this.aimPlane=new tn(new T(0,1,0),-1),this.damageFlash=0,this.setupLights(),this.fx.setScale(window.innerHeight*this.R.pixelRatio,this.camera.fov),window.addEventListener("resize",()=>this.fx.setScale(window.innerHeight*this.R.pixelRatio,this.camera.fov)),window.addEventListener("storage",i=>{i.key!=="emberdeep.meta.v1"||this.state!=="title"||(this.meta=new Rh,this.ui.showTitle())}),window.__game=this}later(e,t){const i=this.session;setTimeout(()=>{i===this.session&&e()},t)}dbgKillAll(){for(const e of this.enemies)e.alive&&e.state!=="spawning"&&this.hitEnemy(e,99999,{source:"debug",noCrit:!0,silent:!0})}dbgFloor(e){this.player||this.startRun(),this.buildFloor(e)}dbgClearRooms(){for(const e of this.level.rooms)e.state==="idle"&&e.type!=="boss"&&(e.state="cleared")}dbgGoto(e){const t=this.level.rooms.find(i=>i.type===e);return t?(this.player.placeAt(t.center.clone()),this.camTarget.copy(t.center),this.camPos.copy(t.center).add(so),t.type):null}setupLights(){this.hemi=new Gv(4872832,1708560,.6),this.scene.add(this.hemi),this.key=new Ad(9086719,.6),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048);const e=this.key.shadow.camera;e.left=-20,e.right=20,e.top=20,e.bottom=-20,e.near=1,e.far=60,this.key.shadow.bias=-4e-4,this.key.shadow.normalBias=.03,this.key.shadow.radius=3,this.scene.add(this.key,this.key.target),this.scene.fog=new vl(328711,26,55)}applyBiome(e){this.hemi.color.set(e.hemiSky),this.hemi.groundColor.set(e.hemiGround),this.hemi.intensity=e.ambientIntensity,this.key.color.set(e.keyLight),this.key.intensity=e.keyIntensity,this.scene.fog.color.set(e.fog),this.scene.background.set(e.fog).multiplyScalar(.6);const t=this.R.final.uniforms;t.uLift.value.set(...e.grade.lift),t.uGain.value.set(...e.grade.gain),t.uSaturation.value=e.grade.sat}async boot(){this.ui.showLoading(0);let e=0,t=0;const i=()=>this.ui.showLoading(e*.7+t*.3);await Promise.all([this.assets.load(n=>(e=n,i())),this.audio.loadAll(n=>(t=n,i()))]),this.ui.hideLoading(),this.buildTitleScene(),this.state="title",this.ui.showTitle(),this.loop()}loop(){requestAnimationFrame(()=>this.loop());let e=Math.min(this.clock.getDelta(),1/30);this.realDt=e,this.time+=e,Oi.uTime.value=this.time,this.input.pollGamepad(),this.state==="title"?this.updateTitle(e):this.state==="playing"||this.state==="dying"||this.state==="transition"?this.updateGame(e):(this.state==="paused"||this.state==="boon"||this.state==="shop")&&this.fx.update(0),this.input.wasPressed("pause")&&this.togglePause(),this.ui.update(e),this.updatePost(e),this.R.render(this.time),this.input.endFrame()}updatePost(e){const t=this.R.final.uniforms;this.damageFlash=Math.max(0,this.damageFlash-e*3),t.uDamage.value=this.damageFlash;const i=this.player,n=i&&i.alive&&this.state!=="title"?Math.max(0,1-i.hp/(i.stats.maxHp*.3)):0;t.uLowHealth.value+=(n-t.uLowHealth.value)*Math.min(1,e*3),t.uFlash.value=Math.max(0,t.uFlash.value-e*3)}buildTitleScene(){const e=new St;this.titleGroup=e;const t=il().floor,i={map:t.map.clone(),normalMap:t.normalMap.clone(),roughnessMap:t.roughnessMap.clone()};for(const f of Object.values(i))f.repeat.set(3.4,3.4),f.needsUpdate=!0;const n=new Ut({map:i.map,normalMap:i.normalMap,roughnessMap:i.roughnessMap,color:9078928}),s=new Ue(new wl(16,64),n);s.rotation.x=-Math.PI/2,s.receiveShadow=!0,e.add(s);const r=(f,g,b,m=0,p=1)=>{const v=this.assets.instance(f);return v?(v.root.position.set(g,0,b),v.root.rotation.y=m,v.root.scale.setScalar(p),e.add(v.root),v.root):null};this.titleFires=[],this.titleLights=[];const o=4.2;for(let f=0;f<6;f++){const g=f/6*Math.PI*2+.3,b=Math.cos(g)*o,m=Math.sin(g)*o;if(f%2===0){r("brazier",b,m,g),this.titleFires.push(new T(b,1.5,m));const p=new vs(16747066,30,12,2);p.position.set(b,2.3,m),e.add(p),p.userData.flick=Math.random()*10,this.titleLights.push(p)}else r("pillar",b*1.6,m*1.6,g,1.1)}r("rubble",-2.5,2.4,1,.5),r("skulls",2.8,-1.8,2,.9)||r("rubble",2.8,-1.8,2,.5),r("portal",0,-7.5,0,1.15);const c=new Ll(this,"hero",{clips:Ud,rim:[.35,.15,.05],rimPow:3});c.root.position.set(0,0,0),c.root.rotation.y=.25,c.play("idle",{fade:0}),this.titleWeapon=[];const l=Pt[this.meta.loadout.weapon]||Pt.blade,h=_n[this.meta.loadout.hue]||_n.ember,d=l.offhand?["RightHand","LeftHand"]:["RightHand"];for(const f of d){const g=this.assets.instance(l.model)||this.assets.instance("sword");g&&(g.root.position.y=-g.template.height*l.grip,g.root.traverse(b=>{b.isMesh&&(b.material=b.material.clone(),b.material.emissive=new ie(h.emissive),b.material.emissiveIntensity=.35)}),c.attachToBone(f,g.root,{worldDir:new T(0,0,1),gripOffset:.07}))}e.add(c.root),this.titleHero=c;const u=new Td(6982399,60,30,.5,.6,1.5);u.position.set(-3,8,-6),u.target=c.root,e.add(u),this.scene.add(e),this.applyBiome(qa.crypt),this.scene.fog.near=12,this.scene.fog.far=40,this.key.position.set(-6,14,8),this.key.target.position.set(0,0,0),this.hemi.intensity=.35}updateTitle(e){const t=this.time,i=Math.sin(t*.05)*.35,s=this.camera.aspect>1.2?2.3:0;this.camera.position.set(Math.sin(i)*6.2-s*.6,2.3+Math.sin(t*.2)*.15,Math.cos(i)*6.2),this.camera.lookAt(-s,1.25,0),this.titleHero.update(e);for(const r of this.titleFires)for(let o=0;o<2;o++)this.fx.flame(r,1.1);for(const r of this.titleLights)r.intensity=30*(.85+.15*Math.sin(t*13+r.userData.flick)*Math.sin(t*7+r.userData.flick));Math.random()<.7&&this.fx.ember(new T(0,0,0),(_n[this.meta.loadout.hue]||_n.ember).main,14),Math.random()<.15&&this.fx.converge(new T(0,0,-7.4),Math.random()<.5?[3,1,.3]:[1.5,.4,3],1,1.8,2.2),this.fx.update(e),this.audio.setAmbient("amb_fire",.25)}refreshTitle(){this.state!=="title"||!this.titleGroup||(this.scene.remove(this.titleGroup),this.titleGroup=null,this.buildTitleScene())}startRun({daily:e=!1}={}){this.session++,this.audio.unlock(),this.audio.duckMusic(1),this.titleGroup&&(this.scene.remove(this.titleGroup),this.titleGroup=null),this.fx.clearAll();const t=this.meta;t.stats.runs++;let i;if(e)i=Hd(),t.dailyState(i.key).attempts++;else{const r=t.loadout.weapon;i={weapon:Pt[r]&&t.has("weapon",r)?r:"blade",vows:t.vowsUnlocked?Object.fromEntries(Object.entries(t.loadout.vows||{}).filter(([o,c])=>c>0)):{},mutator:null,seed:Math.random()*1e9|0}}const n=t.has("hue",t.loadout.hue)?t.loadout.hue:"ember";this.run={daily:e?i:null,weapon:i.weapon,hue:n,vows:i.vows,heat:nr(i.vows),mutator:i.mutator},this.mods=io(i.vows,i.mutator),t.save(),this.runStats={kills:0,elites:0,damage:0,gold:0,floors:0,time:0,rooms:0,boons:0,flawless:0,trials:0,champions:0,bossKills:0,bossTime:0,abyss:0,depthReached:0,potionsUsed:0,novas:0,bestNova:0,bestHit:0,legendary:0,boonCount:0,goldSpent:0,deeds:[],pages:[]},this.seed=i.seed,this.ended=!1,this.player&&this.player.dispose(),this.player=new Ix(this,{weapon:i.weapon,hue:n});const s=this.player;s.maxPotions=this.mods.noPotions?0:3,s.potions=this.mods.noPotions?0:1+t.level("flask"),s.gold=40*t.level("purse"),s.rerolls=t.level("whim");for(const r of this.mods.startBoons)Ii[r]&&s.addBoon(Ii[r]);this.floorIndex=0,this.ui.showHUD(!0),this.buildFloor(0),e?this.later(()=>this.ui.banner("Daily Rite",`${i.mutator.name} · Heat ${this.run.heat}`,3.2,"boss"),3400):this.run.heat>0&&this.later(()=>this.ui.toast(`Heat ${this.run.heat}`,"Your vows burn. Souls and score rise to match.",2.6),3400),t.stats.runs<=3&&this.later(()=>this.ui.controlsHint(),2500),this.audio.play(this.run.heat>0?"vow":"portal",{volume:.6})}clearEntities(){for(const e of this.enemies)e.remove();this.enemies.length=0;for(const e of this.projectiles)e.destroy(!1);this.projectiles.length=0;for(const e of this.pickups)e.destroy();this.pickups.length=0;for(const e of this.boonOrbs)this.scene.remove(e.group);this.boonOrbs.length=0,this.sigils.length=0,this.groundFires.length=0,this.shockwaves.length=0,this.fx.clearAll()}buildFloor(e){this.session++,this.clearEntities(),this.level&&this.level.dispose(),this.floorIndex=e,this.rng=new xb(this.seed+e*7919);const t=Fd(e);this.floorDef=t;const i=qa[t.biome];if(this.level=new Rx(this,e,this.rng),this.applyBiome(i),t.abyss){const r=this.R.final.uniforms;r.uLift.value.set(.03,0,.05),r.uSaturation.value=i.grade.sat*.82,this.hemi.intensity*=.8}this.assignRewards(),this.scene.fog.near=19,this.scene.fog.far=46;const n=this.level.startPos||this.level.rooms[0].center;this.player.placeAt(n),this.player.alive=!0,this.player.state!=="move"&&(this.player.state="move"),this.meta.level("ember")&&(this.player.nova=Math.max(this.player.nova,50)),this.meta.level("vigil")&&e>0&&this.player.heal(this.player.stats.maxHp*.1*this.meta.level("vigil"),{raw:!0}),this.floorTimer=this.mods.floorTimer?this.mods.floorTimer+(t.boss?60:0):0,this.burnTick=0,this.runStats.depthReached=Math.max(this.runStats.depthReached,e+1),t.abyss&&(this.runStats.abyss=Math.max(this.runStats.abyss,t.abyss)),this.encounter=null,this.currentRoom=null,this.boss=null,this.camTarget.copy(n),this.camPos.copy(n).add(so),this.state="playing",this.ui.fade(0,1.2),this.ui.banner(`${tr(e)} — ${i.name}`,t.abyss?t.boss?"Vorthak stirs again in the dark":"Where the light has never reached":i.subtitle,3.2,t.boss||t.abyss?"boss":"floor"),this.audio.playMusic((t.boss,"music_explore"),2.5),this.audio.setAmbient("amb_dungeon",.5),this.audio.setAmbient("amb_fire",0),this.ui.onFloorStart(this.level),this.player.recomputeStats();const s=this.meta;e<Sx&&(s.stats.bestFloor=Math.max(s.stats.bestFloor,e+1)),t.abyss&&(s.stats.deepestAbyss=Math.max(s.stats.deepestAbyss||0,t.abyss)),s.save(),this.checkProgress()}assignRewards(){const e=this.level,t=this.rng,i=this.floorDef,n=e.rooms.filter(o=>o.type==="combat"),s=[["boon",40],["gold",16],["souls",14],["vital",11],["forge",11],["potion",this.mods.noPotions?0:8]];if(t.shuffle(n),n.forEach((o,c)=>o.reward=c<2?"boon":t.weighted(s,l=>l[1])[0]),this.floorIndex>=1&&n.length>=3&&t.chance(.7)){const o=n.find(c=>c.depth>=2)||n[n.length-1];o.trial=!0,o.reward="trial"}const r=e.rooms.find(o=>o.type==="exit");r&&(r.reward=i.champion?"champion":"boon");for(const o of e.rooms)o.reward&&this.makeSigil(o)}sigilTexture(e){if(this.sigilTex=this.sigilTex||{},this.sigilTex[e])return this.sigilTex[e];const t=zd[e],i=document.createElement("canvas");i.width=i.height=128;const n=i.getContext("2d"),s=n.createRadialGradient(64,64,30,64,64,64);s.addColorStop(0,t.color+"66"),s.addColorStop(1,t.color+"00"),n.fillStyle=s,n.fillRect(0,0,128,128),n.beginPath(),n.arc(64,64,40,0,Math.PI*2),n.fillStyle="rgba(14,8,6,0.88)",n.fill(),n.lineWidth=4,n.strokeStyle=t.color,n.shadowColor=t.color,n.shadowBlur=10,n.stroke(),n.save(),n.translate(40,40),n.scale(48/24,48/24),n.fillStyle=t.color,n.shadowBlur=4,n.fill(new Path2D(ir[t.icon])),n.restore();const r=new Zs(i);return r.colorSpace=ct,this.sigilTex[e]=r,r}makeSigil(e){const t=[];for(const n of e.doors){const s=t.find(r=>r.side===n.side&&r.cells.some(o=>Math.abs(o.x-n.x)+Math.abs(o.y-n.y)===1));s?s.cells.push(n):t.push({side:n.side,cells:[n]})}const i=e.reward==="trial"||e.reward==="champion";for(const n of t.slice(0,6)){const s=n.cells.reduce((l,h)=>l+h.x+.5,0)/n.cells.length,r=n.cells.reduce((l,h)=>l+h.y+.5,0)/n.cells.length,o=new bi({map:this.sigilTexture(e.reward),color:new ie(1.5,1.5,1.5),transparent:!0,depthWrite:!1,depthTest:!1,opacity:.95}),c=new ji(o);c.scale.setScalar(i?1.9:1.55),c.position.set(s*ge,2.5,r*ge),c.renderOrder=40,this.level.group.add(c),this.sigils.push({room:e,sprite:c,t:Math.random()*6,base:2.5})}}updateSigils(e){for(const t of this.sigils){t.t+=e;const n=t.room.state==="idle"?1:0;t.sprite.material.opacity+=(n*.95-t.sprite.material.opacity)*Math.min(1,e*4),t.sprite.position.y=t.base+Math.sin(t.t*1.6)*.15,t.sprite.visible=t.sprite.material.opacity>.02,n&&Math.random()<.05&&this.fx.mote(t.sprite.position.clone().setY(1.2),[3,2,.8],.8)}}nextFloor(){this.state==="playing"&&(this.state="transition",this.audio.play("portal",{volume:.9}),this.R.final.uniforms.uFlash.value=1.2,this.ui.fade(1,1),this.runStats.floors++,this.later(()=>{const e=this.floorIndex+1;this.buildFloor(e)},1100))}inCombat(){return!!this.encounter||this.boss&&this.boss.alive}updateGame(e){let t=e;this.slowMoT>0&&(this.slowMoT-=e,t*=.3),this.hitStopT>0&&(this.hitStopT-=e,t=0),this.runStats.time+=e;const i=this.player,n=this.level;this.raycaster.setFromCamera({x:this.input.mouse.ndcX,y:this.input.mouse.ndcY},this.camera),this.raycaster.ray.intersectPlane(this.aimPlane,this.mouseWorld),this.state==="playing"&&i.alive&&this.input.wasPressed("potion")&&i.usePotion();const s=this.state==="playing";this.input.enabled=s,t>0&&i.update(t,this.input),this.input.enabled=!0,Oi.uPlayerPos.value.copy(i.pos),n.updateFlow(i.pos);const r=t*this.mods.enemyTempo;for(const l of this.enemies)t>0&&l.update(l===this.boss?t*Math.min(this.mods.enemyTempo,1.12):r);t>0&&this.separate();for(let l=this.enemies.length-1;l>=0;l--)this.enemies[l].removed&&this.enemies.splice(l,1);for(const l of this.projectiles)if(!(!l.alive||t===0)&&(l.update(t),!!l.alive)){if(l.team==="enemy")i.alive&&Math.hypot(l.pos.x-i.pos.x,l.pos.z-i.pos.z)<l.radius+i.radius&&i.takeDamage(l.dmg,l.pos,{kb:4})&&l.destroy(!0);else for(const h of this.enemies)if(!(!h.alive||h.state==="spawning"||l.hitSet.has(h))&&Math.hypot(l.pos.x-h.pos.x,l.pos.z-h.pos.z)<l.radius+h.radius&&(l.hitSet.add(h),this.hitEnemy(h,l.dmg,{dir:l.vel.clone().normalize(),kb:l.kind==="wave"?6:2.5,source:l.kind==="wave"?"wave":"shard",noCrit:!1}),l.pierce--<=0)){l.destroy(!0);break}}this.projectiles=this.projectiles.filter(l=>l.alive);for(const l of this.pickups)l.alive&&t>0&&l.update(t);if(this.pickups=this.pickups.filter(l=>l.alive),this.updateGroundFires(t),this.updateShockwaves(t),this.updateBoonOrbs(t),this.updateSigils(e),t>0&&this.updateTraps(t),this.floorTimer>0&&this.state==="playing"&&i.alive&&!(this.boss&&!this.boss.alive))this.floorTimer-=t,this.floorTimer<=0&&(this.floorTimer=-.001,this.ui.banner("The Hourglass Empties","The deep begins to burn you",2.4,"boss"),this.audio.play("vow",{volume:.8}));else if(this.floorTimer<0&&i.alive&&this.state==="playing"&&!(this.boss&&!this.boss.alive)&&(this.burnTick+=t,Math.random()<.5&&this.fx.flame(i.pos.clone().add(new T((Math.random()-.5)*.8,.3,(Math.random()-.5)*.8)),.7),this.burnTick>1)){this.burnTick=0;const l=Math.max(1,Math.round(i.stats.maxHp*.03));this.ui.floatText(new T(i.pos.x,2.4,i.pos.z),l,"hurt"),i.loseHealth(l)}n.update(t,i.pos),n.markExplored(i.pos,8),this.state==="playing"&&(this.updateRooms(t),this.updateInteract());const o=n.biome;Math.random()<.5&&this.fx.mote(i.pos,o.moteColor,22),o.lava&&Math.random()<.9&&this.fx.ember(i.pos,[3.5,1.2,.25],26),o.id==="crystal"&&Math.random()<.3&&this.fx.mote(i.pos,[.6,1.4,3],18),this.fx.update(t===0?e*.15:t),this.updateCamera(e);let c=99;for(const l of n.fires){const h=Math.hypot(l.pos.x-i.pos.x,l.pos.z-i.pos.z);h<c&&(c=h)}this.audio.setAmbient("amb_fire",Math.max(0,1-c/9)*.55),this.ui.updateHUD(t)}separate(){const e=this.enemies,t=this.player;for(let i=0;i<e.length;i++){const n=e[i];if(!(!n.alive||n.state==="spawning")){for(let s=i+1;s<e.length;s++){const r=e[s];if(!r.alive||r.state==="spawning")continue;const o=r.pos.x-n.pos.x,c=r.pos.z-n.pos.z,l=n.radius+r.radius,h=o*o+c*c;if(h<l*l&&h>1e-6){const d=Math.sqrt(h),u=(l-d)/2,f=r.mass/(n.mass+r.mass),g=n.mass/(n.mass+r.mass);n.pos.x-=o/d*u*f*2,n.pos.z-=c/d*u*f*2,r.pos.x+=o/d*u*g*2,r.pos.z+=c/d*u*g*2}}if(t.alive&&t.state!=="dash"){const s=t.pos.x-n.pos.x,r=t.pos.z-n.pos.z,o=n.radius+t.radius,c=s*s+r*r;if(c<o*o&&c>1e-6){const l=Math.sqrt(c),h=o-l,d=n.mass/(n.mass+1.2);t.pos.x+=s/l*h*d,t.pos.z+=r/l*h*d,n.pos.x-=s/l*h*(1-d),n.pos.z-=r/l*h*(1-d)}}}}}updateCamera(e){const t=this.player,i=new T(t.pos.x,0,t.pos.z);if(t.aimSource==="mouse"&&this.state==="playing"){const l=Math.max(-1,Math.min(1,(this.mouseWorld.x-t.pos.x)/12)),h=Math.max(-1,Math.min(1,(this.mouseWorld.z-t.pos.z)/10));i.x+=l*2.2,i.z+=h*1.6}const n=1-Math.exp(-6*e);this.camTarget.lerp(i,n);const s=this.boss&&this.boss.alive?1.18:1,r=this.camTarget.clone().addScaledVector(so,s);this.camPos.lerp(r,1-Math.exp(-8*e)),this.trauma=Math.max(0,this.trauma-e*1.5);const o=this.trauma*this.trauma,c=this.time*40;if(this.camera.position.set(this.camPos.x+Math.sin(c*1.3)*o*.7,this.camPos.y+Math.sin(c*1.7+2)*o*.5,this.camPos.z+Math.sin(c*1.1+4)*o*.6),this.camera.lookAt(this.camTarget.x,.8,this.camTarget.z),this.camera.rotation.z+=Math.sin(c*.9)*o*.03,this.debugCam){const l=this.debugCam;this.camera.position.set(t.pos.x+l[0],l[1],t.pos.z+l[2]),this.camera.lookAt(t.pos.x,1.1,t.pos.z)}this.key.position.set(this.camTarget.x-7,16,this.camTarget.z+6),this.key.target.position.set(this.camTarget.x,0,this.camTarget.z)}shake(e){this.trauma=Math.min(1,this.trauma+e)}hitStop(e){this.hitStopT=Math.max(this.hitStopT,e)}updateRooms(e){const t=this.player,n=this.level.roomAtWorld(t.pos.x,t.pos.z);if(n!==this.currentRoom&&(this.currentRoom=n,n&&this.ui.onRoomEnter(n)),n&&n.state==="idle"&&!this.encounter){const r=t.pos.x/ge,o=t.pos.z/ge;r>n.x+.6&&r<n.x+n.w-.6&&o>n.y+.6&&o<n.y+n.h-.6&&(n.type==="boss"?this.startBossFight(n):this.startEncounter(n))}const s=this.encounter;s&&(s.t+=e,this.enemies.filter(o=>o.alive&&o.encounter===s).length===0&&s.t>.5?(s.waveDelay-=e,s.waveIdx<s.waves.length?s.waveDelay<=0&&this.spawnWave(s):this.clearEncounter(s)):s.waveDelay=.9)}composeWaves(e){const t=this.floorIndex,i=this.level.biome,n=this.rng,s=e.w*e.h;let o=(3+(Math.min(t,9)+Math.max(0,t-9)*.5)*1.7+s/32)*this.mods.horde;e.type==="exit"&&(o*=1.35),e.trial&&(o*=1.5);let c=o>9?3:o>5?2:1;e.trial&&(c=Math.min(4,c+1));const l=i.enemies.filter(d=>!(d==="brute"&&t<2)&&!(d==="cultist"&&t<1&&n.chance(.6))),h=[];for(let d=0;d<c;d++){let u=o/c+(d===c-1?1:0);const f=[];let g=0;for(;u>.5&&g++<30;){const m=n.pick(l),p=dr[m].cost;p>u+.5||(u-=p,f.push({type:m,elite:!1}))}const b=(t>=1?Math.min(.6,.15+t*.06):0)+this.mods.eliteAdd+(e.trial?.5:0);f.length&&(n.chance(b)||e.type==="exit"&&t>=1&&d===c-1)&&(n.pick(f).elite=!0),f.length>2&&n.chance(b-.5)&&(n.pick(f).elite=!0),h.push(f)}if(e.type==="exit"&&this.floorDef.champion){const d=Ch[i.id]||Ch.crypt,u=d[(this.floorIndex+(this.seed&1))%d.length];h.push([{type:u.type,champion:u}])}return h}startEncounter(e){e.state="active",this.level.lockRoom(e),this.audio.play("gate_close",{volume:.8}),this.audio.playMusic("music_combat",1.2),this.shake(.2);const t={room:e,waves:this.composeWaves(e),waveIdx:0,t:0,waveDelay:0,hurt:!1};this.encounter=t,e.trial&&this.ui.banner("Ember Trial","Survive the onslaught for a greater boon",2.4,"boss"),this.spawnWave(t)}spawnWave(e){const t=e.waves[e.waveIdx++];e.t=0;const i=this.player;this.audio.play("spawn",{volume:.6});for(const n of t){const s=n.champion?this.level.randomFloorInRoom(e.room,()=>this.rng.next(),2,i.pos,7):this.level.randomFloorInRoom(e.room,()=>this.rng.next(),1,i.pos,5),r=this.spawnEnemy(n.type,s,{elite:n.elite,floor:this.floorIndex,champion:n.champion||null});r.encounter=e,n.champion&&(r.displayName=n.champion.name,this.champion=r,this.audio.play("champion",{volume:.9}),this.ui.banner(n.champion.name,n.champion.sub,2.8,"boss"),this.later(()=>r.alive&&this.ui.bossBar(r),900),this.shake(.4))}e.waves.length>1&&this.ui.toast(`Wave ${e.waveIdx} / ${e.waves.length}`,"",1.4)}spawnEnemy(e,t,i={}){const n=new Nd(this,e,t,i);return n.encounter=this.encounter,this.enemies.push(n),n}clearEncounter(e){const t=e.room;this.encounter=null,t.state="cleared",this.level.unlockRoom(t),this.runStats.rooms++,this.audio.play("room_clear",{volume:.55}),this.audio.play("gate_open",{volume:.6,delay:.3}),this.audio.playMusic("music_explore",3);const i=t.center.clone(),n=this.player,s=Math.round((6+Math.min(this.floorIndex,12)*2+this.rng.int(0,6))*n.stats.goldMul);if(this.dropGold(i,s),e.hurt||(this.runStats.flawless++,this.ui.floatText(new T(n.pos.x,2.8,n.pos.z),"Flawless","heal")),this.mods.clearHeal&&n.heal(n.stats.maxHp*this.mods.clearHeal,{raw:!0}),t.type==="exit"){this.level.portal.active=!0;const r=this.level.interactables.find(o=>o.kind==="portal");r&&(r.enabled=!0),this.floorTimer&&(this.floorTimer=0),this.ui.banner("The Way Down Opens","Step into the portal to descend",2.8,"clear"),this.spawnBoonOrb(i.clone().add(new T(0,0,2.5)),t.reward==="champion"?"epic":null)}else this.ui.banner(t.trial?"Trial Conquered":"Chamber Cleared",t.trial?"The flame rewards the bold":"",1.8,"clear"),this.giveReward(t.reward||"boon",i);this.checkProgress(),this.later(()=>this.pickups.forEach(r=>r.kind==="gold"&&(r.magnet=!0)),900)}giveReward(e,t){const i=this.player,n=Math.min(this.floorIndex,12);e==="boon"?this.spawnBoonOrb(t):e==="trial"?(this.runStats.trials++,this.meta.stats.trials++,this.spawnBoonOrb(t,"epic"),this.dropSouls(t,12+n*2)):e==="gold"?this.dropGold(t,Math.round((28+n*9)*i.stats.goldMul)):e==="souls"?this.dropSouls(t,8+n*2):e==="vital"?this.pickups.push(new ui(this,"vital",t)):e==="forge"?this.pickups.push(new ui(this,"forge",t)):e==="potion"&&(this.pickups.push(new ui(this,"potion",t)),this.pickups.push(new ui(this,"heart",t,{value:20})))}dropSouls(e,t){const i=Math.round(t*this.player.stats.soulMul*(1+.1*this.run.heat)),n=Math.min(i,14);for(let s=0;s<n;s++)this.pickups.push(new ui(this,"soul",e,{value:Math.floor(i/n)+(s<i%n?1:0)}))}dropGold(e,t){let i=t;for(;i>0;){const n=Math.min(i,i>20?5:i>8?2:1);i-=n,this.pickups.push(new ui(this,"gold",e,{value:n}))}}spawnBoonOrb(e,t=null){const i=this.player?.pos;if(i&&Math.hypot(e.x-i.x,e.z-i.z)<3){const d=Math.atan2(e.x-i.x,e.z-i.z)||Math.random()*6.28;e=new T(i.x+Math.sin(d)*3.5,0,i.z+Math.cos(d)*3.5),this.level.collide(e,1)}const n=new St,s=!!t,r=s?[2.2,.9,3.2]:[2.4,1.5,.45],o=new bi({map:this.fx.glowTex,color:new ie(...r),blending:Mt,depthWrite:!1,transparent:!0}),c=new ji(o);c.scale.setScalar(s?2.4:1.9);const l=new Ue(new Tl(s?.38:.3,1),new Et({color:s?new ie(5,2.6,6.5):new ie(6,4.2,1.6)}));n.add(c,l),n.position.set(e.x,1.3,e.z),this.scene.add(n);const h=this.fx.runeCircle(e,1.5,{color:s?[1.3,.5,1.9]:[1.5,.95,.28],dur:9999,spin:.8});this.boonOrbs.push({group:n,core:l,sprite:c,pos:e.clone(),t:0,rune:h,minRarity:t,col:r}),this.audio.play("levelup",{volume:.5})}updateBoonOrbs(e){const t=this.player;for(const i of this.boonOrbs)if(i.t+=e,i.group.position.y=1.3+Math.sin(i.t*2.5)*.15,i.core.rotation.y+=e*2,i.core.rotation.x+=e*1.3,Math.random()<.4&&this.fx.converge(i.pos,i.minRarity?[2.6,1.2,3.6]:[3.5,2.2,.6],1,1.4,1.3),this.state==="playing"&&t.alive&&Math.hypot(t.pos.x-i.pos.x,t.pos.z-i.pos.z)<1.3&&i.t>.6){i.taken=!0,this.scene.remove(i.group);const n=this.fx.effects.find(s=>s.obj===i.rune);n&&(n.t=n.dur),this.fx.burst(i.pos,{n:40,color:i.minRarity?[3,1.4,4]:[4,2.5,.7],speed:6,up:4,size:.3,life:.8,y:1}),this.offerBoons(i.minRarity)}this.boonOrbs=this.boonOrbs.filter(i=>!i.taken)}rollOffer(e){const t=["common","rare","epic","legendary"];let i=e;return this.mods.minRarity&&(!i||t.indexOf(this.mods.minRarity)>t.indexOf(i))&&(i=this.mods.minRarity),Px(this.rng,{owned:this.player.boons,floor:this.floorIndex,n:this.mods.boonChoices,minRarity:i,weapon:this.run.weapon,renown:this.meta.renown.level})}offerBoons(e){const t=this.rollOffer(e);if(!t.length){this.dropGold(this.player.pos,30);return}this.state="boon",this.audio.play("boon",{volume:.7}),this.audio.duckMusic(.5);const i=()=>this.player.rerolls<=0?null:(this.player.rerolls--,this.audio.play("reroll",{volume:.7}),this.rollOffer(e));this.ui.showBoonChoice(t,n=>this.takeBoon(n),i)}takeBoon(e){const t=this.player;t.addBoon(e),this.runStats.boons++,this.runStats.boonCount=Object.keys(t.boons).length,e.rarity==="legendary"&&this.runStats.legendary++,this.meta.discoverBoon(e)&&this.ui.notify(e.fusion?"fusion":"codex",e.fusion?"Fusion Discovered":"New Boon Discovered",e.name),this.audio.play("levelup",{volume:.6}),this.audio.duckMusic(1);const n=e.fusion?[.6,3.6,2.8]:t.hue.hot;this.fx.ring(t.pos,3,{color:n,dur:.6}),this.fx.burst(t.pos,{n:e.fusion?90:50,color:n,speed:5,up:5,size:.25,life:1,gravity:-1,y:.5}),this.state="playing",this.clock.getDelta(),this.checkProgress()}updateInteract(){const e=this.player;let t=null,i=1e9;for(const n of this.level.interactables){if(n.used||n.enabled===!1)continue;const s=Math.hypot(n.pos.x-e.pos.x,n.pos.z-e.pos.z);s<n.radius&&s<i&&(t=n,i=s)}this.ui.prompt(t?t.prompt:null,t?t.pos:null),t&&this.input.wasPressed("interact")&&e.alive&&this.interact(t)}interact(e){const t=this.player;if(e.kind==="chest"){e.used=!0,this.meta.stats.chests++,this.audio.play("chest",{volume:.8});const i=e.pos.clone();if(this.fx.flash(i,16760928,40,10,.6),this.fx.burst(i,{n:60,color:[4,2.8,.8],speed:5,up:6,size:.25,life:1.1,gravity:4,y:1}),this.dropGold(i,Math.round((25+this.floorIndex*6)*t.stats.goldMul)),this.rng.chance(.5)&&this.pickups.push(new ui(this,"potion",i)),this.rng.chance(.55)&&this.later(()=>this.spawnBoonOrb(i.clone().add(new T(0,0,2))),500),e.obj){const n=e.obj,s=this.time,r=()=>{const o=this.time-s;n.rotation.z=Math.sin(o*40)*.05*Math.max(0,1-o*2),o<.6&&requestAnimationFrame(r)};r()}}else if(e.kind==="shrine")e.used=!0,this.meta.stats.shrines++,this.level.shrineOrb&&(this.level.shrineOrb.active=!1),this.fx.ring(e.pos,3,{color:[4,2.2,.5],dur:.7}),this.fx.burst(e.orbPos||e.pos,{n:50,color:[4,2.3,.6],speed:4,up:3,size:.25,life:.9,y:0}),this.offerBoons("rare");else if(e.kind==="shop")this.openShop(e);else if(e.kind==="portal")if(e.used=!0,e.claim)this.victory();else if(e.abyss){for(const i of this.level.interactables)i.kind==="portal"&&(i.used=!0);this.audio.play("abyss",{volume:.9}),this.nextFloor()}else this.nextFloor()}openShop(e){const t=Math.min(this.floorIndex,10);if(!e.stock){e.stock=[{id:"potion",name:"Healing Draught",icon:"drop",desc:"A flask that restores 45% health",price:30+t*8,qty:2},{id:"mend",name:"Ember Mending",icon:"heart",desc:"Restore half your health now",price:40+t*10,qty:1},{id:"fortify",name:"Ashen Vigor",icon:"shield",desc:"+15 max health for this descent",price:60+t*12,qty:2},{id:"boon",name:"Sealed Boon",icon:"star",desc:"Choose one of three rare-or-better boons",price:95+t*22,qty:1},{id:"forge",name:"Ember Whetstone",icon:"blade",desc:"+8% damage for this descent",price:70+t*15,qty:1}],this.mods.noPotions&&(e.stock=e.stock.filter(n=>n.id!=="potion"));const i=(1-.1*this.meta.level("favor"))*(this.mods.goldMul>1?2:1);for(const n of e.stock)n.price=Math.round(n.price*i)}this.state="shop",this.shopIt=e,this.audio.play("chest",{volume:.4,rate:1.3}),this.audio.duckMusic(.5),this.ui.showShop(e.stock,this.player,i=>this.buyItem(i),()=>this.closeShop())}buyItem(e){const t=this.player;if(e.qty<=0||t.gold<e.price)return!1;if(e.id==="potion"&&t.potions>=t.maxPotions)return this.ui.toast("Your flask belt is full","",1.4),!1;if(t.gold-=e.price,e.qty--,this.runStats.goldSpent+=e.price,this.meta.stats.goldSpent+=e.price,this.audio.play("coin",{volume:.6}),e.id==="potion")t.potions++;else if(e.id==="mend")t.heal(Math.round(t.stats.maxHp*.5));else if(e.id==="fortify")t.bonusHp=(t.bonusHp||0)+15,t.recomputeStats(),t.heal(15);else if(e.id==="forge")t.forge=(t.forge||0)+1,t.recomputeStats();else if(e.id==="boon")return this.closeShop(),this.offerBoons("rare"),!0;return this.audio.play("levelup",{volume:.35,rate:1.3}),!0}closeShop(){this.state==="shop"&&(this.state="playing",this.audio.duckMusic(1),this.ui.hideShop(),this.clock.getDelta())}nearestEnemy(e,t,i){let n=null,s=t;for(const r of this.enemies){if(!r.alive||r.state==="spawning"||i&&i.has(r))continue;const o=Math.hypot(r.pos.x-e.x,r.pos.z-e.z);o<s&&(s=o,n=r)}return n}hitEnemy(e,t,i={}){if(!e.alive||e.state==="spawning")return;const n=this.player,s=n.stats;let r=t;(i.source==="melee"||i.source==="shard"||i.source==="wave"||i.source==="tremor")&&(r*=s.dmgMul);const o=!i.noCrit&&(i.forceCrit||Math.random()<s.crit);o&&(r*=s.critMul),s.execute&&e.hp/e.maxHp<.3&&(r*=1+s.execute),n.empowerT>0&&(r*=1+s.empower),this.mods.burnTaken>1&&e.burnT>0&&(r*=this.mods.burnTaken),r*=.9+Math.random()*.2,r=Math.max(1,Math.round(r)),s.cull&&e!==this.boss&&!e.champion&&(e.hp-r)/e.maxHp<s.cull&&e.hp-r>0&&(r=Math.ceil(e.hp)),r>this.runStats.bestHit&&(this.runStats.bestHit=r),e.hp-=r,this.runStats.damage+=r,e.model.flash(o?[4,2,.6]:i.color==="burn"?[2,.6,.1]:i.color==="shock"?[.8,1.4,3]:[2.2,2.2,2.2],o?.18:.12);const c=new T(e.pos.x,e.headY-.2,e.pos.z);this.ui.floatText(c,r,o?"crit":i.color||"normal");const l=i.dir||new T(0,0,1);i.silent||(this.audio.playAt(o?"crit":e.def.hitSfx,e.pos,n.pos,{volume:o?.7:.5,rateVar:.12,throttle:25}),this.fx.sparks(e.pos,l,{n:o?22:12,y:1.1,color:o?[5,3,1]:[4,2,.7]}),this.fx.ichor(e.pos,l,e.def.ichor,o?14:8),o&&this.fx.glowSprite(c,{color:[4,2.2,.6],size:2.4,dur:.18,y:1.2}));const h=d=>{e.burnDps=Math.max(e.burnDps,d*s.dmgMul),e.burnT=3};i.source==="melee"?(n.gainNova(r*(n.weapon.id==="fangs"?.55:.4)),s.burn&&h(s.burn),i.ignite&&h(i.ignite),s.venom&&(e.poison=Math.min(10,e.poison+1),e.poisonT=4),s.chain&&Math.random()<s.chain&&this.chainLightning(e,r*.45)):(i.source==="shard"||i.source==="wave"||i.source==="tremor")&&n.gainNova(r*.25),o&&(s.critIgnite&&h(6),s.critHeal&&n.heal(s.critHeal)),e.onHit(r,i),e.hp<=0&&this.killEnemy(e,l)}chainLightning(e,t){let i=e;const n=new Set([e]);this.audio.play("lightning",{volume:.45,throttle:80});const s=this.player.stats;for(let r=0;r<3+s.chainExtra;r++){const o=this.nearestEnemy(i.pos,7,n);if(!o)break;n.add(o),this.fx.lightning({x:i.pos.x,y:1.3,z:i.pos.z},{x:o.pos.x,y:1.3,z:o.pos.z});const c=o.pos.clone().sub(i.pos).normalize();this.later(()=>{this.hitEnemy(o,t,{dir:c,kb:2,source:"lightning",noCrit:!0,color:"shock"}),s.chainIgnite&&o.alive&&(o.burnDps=Math.max(o.burnDps,8*s.dmgMul),o.burnT=3)},40*(r+1)),i=o}}killEnemy(e,t){const i=this.player;e.die(t);const n=this.meta,s=this.runStats;s.kills++,n.stats.kills++,n.stats.killsBy[e.type]=(n.stats.killsBy[e.type]||0)+1,e.elite&&(s.elites++,n.stats.elites++);const r=e.def;if(!e.risen){const o=i.stats.goldMul*(e.champion?6:e.elite?2.5:1),c=Math.round((r.gold[0]+Math.random()*(r.gold[1]-r.gold[0]))*o);this.dropGold(e.pos,c);const l=(r.souls[0]+Math.random()*(r.souls[1]-r.souls[0]))*(e.champion?12:e.elite?3*this.mods.eliteSouls:1);this.dropSouls(e.pos,l),Math.random()<(e.elite?.4:.07)&&this.pickups.push(new ui(this,"heart",e.pos,{value:12}))}if(e.champion&&(s.champions++,n.stats.champions++,this.ui.boss===e&&this.ui.bossBar(null),this.champion=null,this.slowMoT=.8,this.ui.banner(`${e.displayName} Falls`,"A champion’s ember is yours",2.2,"clear"),this.pickups.push(new ui(this,"vital",e.pos.clone()))),this.mods.haunt&&!e.risen&&e.type!=="wraith"&&e!==this.boss&&!e.champion&&e.encounter&&Math.random()<this.mods.haunt){const o=this.spawnEnemy("wraith",e.pos.clone(),{floor:this.floorIndex,risen:!0});o.encounter=e.encounter}s.kills%10===0&&this.checkProgress(),i.stats.lifeOnKill&&i.heal(i.stats.lifeOnKill),this.fx.burst(e.pos,{n:e.type==="brute"?40:22,color:[3.5,1.4,.35],speed:5,up:4,size:.22,life:.7,y:.8}),this.fx.smoke(e.pos,{n:5,size:1.1,life:1.1}),this.fx.decal("splat",e.pos,e.radius*3.2,{color:new ie(...r.ichor).multiplyScalar(.35),life:14,opacity:.45}),this.hitStop(e.type==="brute"||e.elite?.08:.035),this.shake(e.type==="brute"?.35:.12),e===this.boss&&this.onBossDefeated()}breakProp(e){e.broken=!0,this.level.group.remove(e.obj);const t=this.level.colliders.indexOf(e.collider);t>=0&&this.level.colliders.splice(t,1),this.audio.playAt("barrel",e.pos,this.player.pos,{volume:.6}),this.fx.debris(e.pos,[.22,.13,.07],22),this.fx.smoke(e.pos,{n:5,size:1,life:.9,color:[.12,.1,.08],alpha:.4}),Math.random()<.6&&this.dropGold(e.pos,Math.round((2+Math.random()*5)*this.player.stats.goldMul)),Math.random()<.08&&this.pickups.push(new ui(this,"heart",e.pos,{value:12}))}novaBlast(e,t=null,i=!1){const n=e.stats,s=(t||e.pos).clone(),r=6.5*n.novaRadius,o=(55+Math.min(this.floorIndex,14)*7)*n.dmgMul,c=e.hue;this.audio.play("nova",{volume:1}),this.audio.play("explosion",{volume:.7,rate:.8}),this.shake(.85),this.hitStop(.1),this.R.final.uniforms.uFlash.value=.6,this.fx.flash(s,new ie(c.light),120,r*2.5,.7);for(let h=0;h<3;h++)this.later(()=>this.fx.ring(s,r*(.6+h*.25),{color:c.hot,dur:.5+h*.12,width:.4}),h*70);this.fx.burst(s,{n:160,color:c.hot,color2:c.deep,speed:r*2.6,up:5,size:.4,life:.9,gravity:3,drag:2.2,y:.4}),this.fx.smoke(s,{n:18,size:2.4,life:1.6,spread:r}),this.fx.decal("scorch",s,r*2.2,{life:16,opacity:.95});let l=0;for(const h of this.enemies){if(!h.alive||h.state==="spawning")continue;if(Math.hypot(h.pos.x-s.x,h.pos.z-s.z)<r+h.radius){const u=h.pos.clone().sub(s).setY(0).normalize();this.hitEnemy(h,o,{dir:u,kb:16,source:"nova",noCrit:!1}),l++,h.alive&&h.poiseMax<1e3&&!h.champion&&h.interrupt(.8)}}this.runStats.bestNova=Math.max(this.runStats.bestNova,l),i||(n.empower&&(e.empowerT=6),n.novaHeal&&e.heal(n.novaHeal),n.supernova&&this.later(()=>this.player===e&&e.alive&&this.state==="playing"&&this.novaBlast(e,s,!0),600));for(const h of this.level.breakables)!h.broken&&h.pos.distanceTo(s)<r&&this.breakProp(h);for(const h of this.projectiles)h.team==="enemy"&&h.pos.distanceTo(s)<r&&h.destroy(!0);if(n.novaBurnGround)for(let h=0;h<10;h++){const d=h/10*Math.PI*2;this.addGroundFire(new T(s.x+Math.cos(d)*r*.6,0,s.z+Math.sin(d)*r*.6),1.6,4,14*n.dmgMul)}}explosion(e,t,i,{color:n=[4,1.3,.25],hurtsPlayer:s=!0,hurtsEnemies:r=!1}={}){this.audio.playAt("explosion",e,this.player.pos,{volume:.6}),this.fx.burst(e,{n:45,color:n,speed:7,up:5,size:.35,life:.7,y:.2}),this.fx.ring(e,t*1.2,{color:n,dur:.4,width:.35}),this.fx.smoke(e,{n:6,size:1.5,life:1.2}),this.fx.flash(e,16740400,40,9,.3),this.fx.decal("scorch",e,t*2.4,{life:8}),this.shake(.25);const o=this.player;if(s&&Math.hypot(o.pos.x-e.x,o.pos.z-e.z)<t+o.radius&&o.takeDamage(i,e,{kb:8}),r)for(const c of this.enemies)c.alive&&c.pos.distanceTo(e)<t+c.radius&&this.hitEnemy(c,i,{dir:c.pos.clone().sub(e).normalize(),kb:6,source:"explosion",noCrit:!0})}addGroundFire(e,t,i,n){this.groundFires.push({pos:e,radius:t,life:i,t:0,dps:n,tick:0}),this.fx.decal("scorch",e,t*2,{life:i+3,opacity:.6})}updateGroundFires(e){if(e){for(const t of this.groundFires)if(t.t+=e,t.tick+=e,Math.random()<.9&&this.fx.flame(new T(t.pos.x+(Math.random()-.5)*t.radius*1.4,.05,t.pos.z+(Math.random()-.5)*t.radius*1.4),.8),t.tick>.3){t.tick=0;for(const i of this.enemies)i.alive&&i.state!=="spawning"&&Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z)<t.radius+i.radius&&this.hitEnemy(i,t.dps*.3,{source:"burn",noCrit:!0,kb:0,silent:!0,color:"burn"})}this.groundFires=this.groundFires.filter(t=>t.t<t.life)}}addShockwave(e,{delay:t=0,speed:i=8,max:n=16,dmg:s=15}={}){this.shockwaves.push({pos:e,r:.5,t:-t,speed:i,max:n,dmg:s,hit:!1})}updateShockwaves(e){if(!e)return;const t=this.player;for(const i of this.shockwaves){if(i.t+=e,i.t<0)continue;i.r+=i.speed*e;const n=Math.floor(i.r*3.2);for(let r=0;r<n;r++){const o=r/n*Math.PI*2+Math.random()*.1,c=i.pos.x+Math.cos(o)*i.r,l=i.pos.z+Math.sin(o)*i.r;this.level.isSolid(this.level.toTile(c),this.level.toTile(l))||this.fx.add.emit({x:c,y:.15,z:l,vx:Math.cos(o)*1.5,vy:1.5+Math.random()*2,vz:Math.sin(o)*1.5,color:[4,1.3,.25],color2:[.8,.1,0],size:.55,size2:.05,life:.32})}const s=Math.hypot(t.pos.x-i.pos.x,t.pos.z-i.pos.z);!i.hit&&Math.abs(s-i.r)<.6&&t.alive&&t.takeDamage(i.dmg,i.pos,{kb:7})&&(i.hit=!0)}this.shockwaves=this.shockwaves.filter(i=>i.r<i.max)}updateTraps(e){const t=this.player;for(const i of this.level.traps){const n=i.room.state==="active"||this.boss&&this.boss.alive;if(!n&&i.state==="idle"){i.spikes.position.y+=(-.9-i.spikes.position.y)*Math.min(1,e*6);continue}i.t+=e;const r=i.t%3.4,o=r>1.8&&r<2.4,c=r>=2.4&&r<3.1;if(o)i.spikeMat.emissive.setRGB(.6,.05,.02),i.spikes.position.y=-.75+Math.sin(this.time*60)*.03,Math.random()<.4&&this.fx.smoke(i.pos,{n:1,size:.5,life:.4,up:1.4,alpha:.3,color:[.15,.12,.1]}),i.hitSet.clear(),i.state="warn";else if(c){i.state!=="up"&&(i.state="up",this.audio.playAt("spikes",i.pos,t.pos,{volume:.55}),this.fx.sparks(i.pos,new T(0,0,1),{n:8,y:.2,cone:3,speed:4})),i.spikes.position.y+=(0-i.spikes.position.y)*Math.min(1,e*30),i.spikeMat.emissive.setRGB(.15,.02,.01);const l=ge/2;t.alive&&Math.abs(t.pos.x-i.pos.x)<l&&Math.abs(t.pos.z-i.pos.z)<l&&!i.hitSet.has(t)&&t.takeDamage((14+Math.min(this.floorIndex,14)*2)*(this.mods.ruin?1.6:1),i.pos,{kb:3})&&i.hitSet.add(t);for(const h of this.enemies)!h.alive||h.def.flying||i.hitSet.has(h)||Math.abs(h.pos.x-i.pos.x)<l&&Math.abs(h.pos.z-i.pos.z)<l&&(i.hitSet.add(h),this.hitEnemy(h,25,{source:"trap",noCrit:!0,kb:2}))}else i.state=n?"idle_a":"idle",i.spikes.position.y+=(-.9-i.spikes.position.y)*Math.min(1,e*5),i.spikeMat.emissive.setRGB(0,0,0)}}startBossFight(e){e.state="active",this.level.lockRoom(e),this.audio.play("gate_close",{volume:.9}),this.audio.stopMusic(1);const t=new T(e.center.x,0,e.center.z-4),i=new Ux(this,t,{floor:this.floorIndex});i.yaw=0,this.enemies.push(i),this.boss=i,this.encounterBoss=e;const n=this.floorDef.abyss?Math.floor(this.floorDef.abyss/7):0;n&&(i.displayName=`Vorthak, Reborn ${n>1?ki(n):""}`.trim()),this.ui.banner(i.displayName||i.def.name,n?"The Abyss returns what it takes":"Lord of the Molten Deep",3.5,"boss"),this.shake(.5),this.audio.play("boss_roar",{volume:.6,rate:.8}),this.later(()=>this.audio.playMusic("music_boss",1.5),1200);for(let s=0;s<30;s++)this.later(()=>this.fx.burst(t,{n:10,color:[4,1.2,.2],speed:6,up:8,size:.4,life:1,y:0}),s*70)}onBossIntroDone(){this.ui.bossBar(this.boss)}onBossDefeated(){const e=this.boss,t=this.meta,i=this.runStats;this.slowMoT=1.6,this.shake(1),this.R.final.uniforms.uFlash.value=1,this.audio.stopMusic(3),this.ui.bossBar(null);for(const s of this.enemies)s!==e&&s.alive&&this.killEnemy(s,new T);for(let s=0;s<12;s++)this.later(()=>this.explosion(e.pos.clone().add(new T((Math.random()-.5)*5,0,(Math.random()-.5)*5)),1.5,0,{hurtsPlayer:!1}),300+s*220);this.floorTimer=0;const n=i.bossKills===0;if(i.bossKills++,n){i.bossTime=i.time,t.stats.wins++;const s=this.run.weapon,r=this.run.heat;if(this.newRecords=this.newRecords||[],this.run.daily?t.maxHeatWin<0&&(t.maxHeatWin=0):(t.bestHeat[s]??-1)<r&&(t.bestHeat[s]=r,this.newRecords.push(`Best Heat with the ${Pt[s].name}: ${r}`)),!this.run.daily&&r>t.maxHeatWin&&(t.maxHeatWin=r),(!t.stats.fastestWin||i.time<t.stats.fastestWin)&&(t.stats.fastestWin=Math.round(i.time)),!this.run.daily&&r>0&&!t.heatClears[r]){t.heatClears[r]=1;const o=50+r*30;t.souls+=o,this.later(()=>this.ui.notify("heat",`Heat ${r} conquered`,`+${o} souls`),4200)}t.save()}this.checkProgress(),this.later(()=>{this.level.unlockRoom(this.encounterBoss),this.ui.banner(e.displayName?`${e.displayName} Falls`:"Vorthak Has Fallen","Claim the Ember, or descend into the Abyss",4,"victory"),this.audio.play("room_clear",{volume:.8}),this.audio.playMusic("music_title",3);const s=e.pos.clone();this.level.placeModel("portal",s.x-3.2,s.z-1.5,{}),this.level.portal=this.level.makePortal(new T(s.x-3.2,0,s.z-1.5)),this.level.portal.active=!0,this.level.interactables.push({kind:"portal",claim:!0,pos:new T(s.x-3.2,0,s.z-.9),radius:2,prompt:"Claim the Ember (end descent)",used:!1,enabled:!0}),this.level.placeModel("portal",s.x+3.2,s.z-1.5,{});const r=this.level.makePortal(new T(s.x+3.2,0,s.z-1.5));r.active=!0,this.recolorPortal(r),this.level.interactables.push({kind:"portal",abyss:!0,pos:new T(s.x+3.2,0,s.z-.9),radius:2,prompt:"Descend into the Abyss",used:!1,enabled:!0}),this.fx.runeCircle(new T(s.x+3.2,0,s.z-.6),2.2,{color:[1.2,.4,2.4],dur:9999,spin:-.6})},3200)}recolorPortal(e){e.abyss=!0,e.mat.uniforms.uC1.value.set(1.8,.45,3.4),e.mat.uniforms.uC2.value.set(.25,.08,1.1),e.light.color.set(10113279)}onPlayerHurt(e){this.encounter&&(this.encounter.hurt=!0),this.damageFlash=Math.min(.75,.3+e/50),this.shake(.3+e/60),this.audio.play("player_hurt",{volume:.7,throttle:120}),this.ui.floatText(new T(this.player.pos.x,2.4,this.player.pos.z),e,"hurt"),this.hitStop(.05),this.fx.ichor(this.player.pos,new T(0,0,1),[.5,.03,.03],10)}phoenixRise(e){this.audio.play("nova",{volume:1,rate:1.2}),this.audio.play("levelup",{volume:.8}),this.R.final.uniforms.uFlash.value=1.2,this.fx.burst(e.pos,{n:150,color:[4.5,2,.5],speed:8,up:9,size:.4,life:1.4,gravity:2,y:0}),this.fx.ring(e.pos,7,{color:[4.5,2,.5],dur:.8}),this.ui.banner("Phoenix Heart","You rise from the ashes",2.5,"clear");for(const t of this.enemies)t.alive&&t.pos.distanceTo(e.pos)<7&&this.hitEnemy(t,60,{dir:t.pos.clone().sub(e.pos).normalize(),kb:14,source:"nova",noCrit:!0})}onPlayerDeath(){this.state="dying",this.audio.play("player_death",{volume:.9}),this.audio.stopMusic(2),this.slowMoT=1.2,this.shake(.6),this.meta.stats.deaths++,this.ui.bossBar(null),this.later(()=>{this.state="dead",this.ui.showHUD(!1),this.ui.showEnd(this.finishRun({victory:!1}))},2600)}victory(){this.state="victory",this.audio.play("portal",{volume:1}),this.ui.fade(1,1.5),this.later(()=>{this.ui.showHUD(!1),this.ui.showEnd(this.finishRun({victory:!0})),this.ui.fade(0,1)},1600)}abandonRun(){this.state="dead",this.ui.bossBar(null),this.ui.showHUD(!1),this.audio.duckMusic(1),this.ui.showEnd(this.finishRun({victory:!1,abandoned:!0}))}finishRun({victory:e,abandoned:t=!1}){if(this.ended)return this.lastSummary;this.ended=!0;const i=this.meta,n=this.runStats,s=this.player,r=this.run.heat,o=n.rooms>0||n.kills>=5||n.bossKills>0,c=Bx(n,{victory:e||n.bossKills>0,heat:r});o||(c.total=0,c.base=0,c.lines=[]);const l=[...this.newRecords||[]];this.newRecords=[],c.total>(i.stats.bestScore||0)&&(i.stats.bestScore&&l.unshift("Best score ever"),i.stats.bestScore=c.total);let h=0,d=!1;if(this.run.daily&&o){const v=i.dailyState(this.run.daily.key);i.markDailyStreak(this.run.daily.key),v.done||(v.done=!0,i.stats.dailies++,h=20+10*Math.min(7,i.streak.count)+(n.bossKills?100:0)),c.total>v.best&&(d=v.best>0,v.best=c.total,v.bestDepth=Math.max(v.bestDepth,n.depthReached))}const u=s.souls+h;i.souls+=u;const f=Hx(c.total),g={...i.renown},b=i.addXp(f),m=i.evaluate(n);i.save();const p=this.floorDef;return this.lastSummary={victory:e,abandoned:t,slewKing:n.bossKills>0,floorIndex:this.floorIndex,depth:tr(this.floorIndex),floorName:qa[p.biome].name,abyss:p.abyss,kills:n.kills,damage:Math.round(n.damage),gold:n.gold,souls:u,dailyBonus:h,time:n.time,rooms:n.rooms,boons:Object.entries(s.boons),totalSouls:i.souls,score:c,heat:r,weapon:this.run.weapon,vows:this.run.vows,daily:this.run.daily,dailyBest:d,xp:f,renownBefore:g,renownAfter:{...i.renown},levelUps:b,records:l,deeds:[...n.deeds,...m.deeds],pages:[...n.pages,...m.pages]},this.lastSummary}checkProgress(){if(!this.runStats)return;const e=this.meta.evaluate(this.runStats);for(const t of e.deeds)this.runStats.deeds.push(t),this.ui.notify("deed",t.name,t.souls?`Deed complete · +${t.souls} souls`:"Deed complete"),this.audio.play("deed",{volume:.55});for(const t of e.pages)this.runStats.pages.push(t),this.ui.notify("page",t.title,"A new page in the Chronicle"),this.audio.play("page",{volume:.6})}returnToTitle(){this.session++,this.audio.duckMusic(1),this.ui.bossBar(null),this.clearEntities(),this.level&&(this.level.dispose(),this.level=null),this.player&&(this.player.dispose(),this.player=null),this.ui.showHUD(!1),this.buildTitleScene(),this.state="title",this.mods=io(),this.audio.playMusic("music_title",2),this.audio.setAmbient("amb_dungeon",0),this.ui.showTitle()}togglePause(){if(this.state==="shop")return this.closeShop();this.state==="playing"?(this.state="paused",this.audio.duckMusic(.35),this.ui.showPause()):this.state==="paused"&&this.resume()}resume(){this.state="playing",this.audio.duckMusic(1),this.ui.hidePause(),this.clock.getDelta()}}const Xx=new jx(document.getElementById("game"),document.getElementById("ui"));Xx.boot().catch(a=>{console.error(a),document.getElementById("ui").innerHTML=`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#f88;font-family:monospace;white-space:pre-wrap;padding:40px">Failed to start: ${a?.stack||a}</div>`});
