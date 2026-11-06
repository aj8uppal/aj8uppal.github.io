import{O as e,_n as t,_s as n,a as r,c as i,cs as a,d as o,ds as s,fs as c,gn as l,gs as u,hn as d,hs as f,i as p,l as m,mn as h,ms as g,n as _,o as v,pn as y,ps as b,r as x,s as S,ss as C,t as w,u as T,us as E,vn as D,vs as O}from"./babylon-BwITB9hk.js";import{a as k,i as A,o as j}from"./vendor-1aPZ6ZLi.js";import{a as ee,n as te,o as M,s as ne}from"./num-CQXeGGsE.js";import{C as N,D as P,E as F,O as re,S as I,T as ie,_ as ae,b as oe,c as L,d as se,f as ce,h as R,i as le,k as ue,m as de,n as fe,p as pe,r as z,s as B,t as me,u as he,w as ge,x as _e,y as ve}from"./sort-CS9RKZU2.js";var V=`
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.7); a *= 0.5; }
  return s;
}
`,ye=[`uSunDir`,`uSunColor`,`uSkyColor`,`uGroundColor`,`uFogColor`,`uSunGlow`,`uFogParams`,`uCamPos`,`uTime`,`uShadowMat0`,`uShadowMat1`,`uShadowMat2`,`uShadowSplits`,`uShadowTexel`,`uShadowUv`,`uCloudParams`,`uSeason`,`uNight`],be=[`uShadowMap0`,`uShadowMap1`,`uShadowMap2`],H=`
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uFogColor;
uniform vec3 uSunGlow;
uniform vec4 uFogParams;     // density, height falloff, base height, max opacity
uniform vec3 uCamPos;
uniform float uTime;
uniform mat4 uShadowMat0;
uniform mat4 uShadowMat1;
uniform mat4 uShadowMat2;
uniform vec3 uShadowSplits;  // far distance of each cascade
uniform vec3 uShadowTexel;   // world size of one shadow texel per cascade
uniform float uShadowUv;     // 1 / shadow map size
uniform vec4 uCloudParams;   // offset.xy, scale, strength
uniform vec4 uSeason;        // spring, summer, harvest, winter weights
uniform float uNight;        // 0 day .. 1 deep night
uniform highp sampler2DShadow uShadowMap0;
uniform highp sampler2DShadow uShadowMap1;
uniform highp sampler2DShadow uShadowMap2;

float pcf(highp sampler2DShadow map, vec3 uvz, float texel) {
  // 3x3 hardware-filtered taps: soft but cheap.
  float s = 0.0;
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
      s += texture(map, vec3(uvz.xy + vec2(float(x), float(y)) * texel, uvz.z));
  return s / 9.0;
}

vec3 shadowCoord(mat4 m, vec3 wp) {
  vec4 c = m * vec4(wp, 1.0);
  vec3 p = c.xyz / c.w;
  p.xy = p.xy * 0.5 + 0.5;
#ifndef NDC_HALF_Z
  p.z = p.z * 0.5 + 0.5;
#endif
  return p;
}

float insideCascade(vec3 p, float margin) {
  return step(margin, p.x) * step(p.x, 1.0 - margin) * step(margin, p.y) * step(p.y, 1.0 - margin) * step(p.z, 1.0);
}

// Picks the finest cascade that contains the point, with normal-offset bias scaled to that cascade's texel size.
float sunShadow(vec3 wp, vec3 n, float viewDist) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float slope = sqrt(1.0 - ndl * ndl) / max(ndl, 0.2);
  vec3 off = n * (1.2 + 0.6 * slope);
  vec3 p0 = shadowCoord(uShadowMat0, wp + off * uShadowTexel.x);
  if (insideCascade(p0, 0.02) > 0.5) return pcf(uShadowMap0, vec3(p0.xy, p0.z - 0.0004), uShadowUv);
  vec3 p1 = shadowCoord(uShadowMat1, wp + off * uShadowTexel.y);
  if (insideCascade(p1, 0.02) > 0.5) return pcf(uShadowMap1, vec3(p1.xy, p1.z - 0.0005), uShadowUv);
  vec3 p2 = shadowCoord(uShadowMat2, wp + off * uShadowTexel.z);
  float in2 = insideCascade(p2, 0.0);
  if (in2 < 0.5) return 1.0;
  float s = pcf(uShadowMap2, vec3(p2.xy, p2.z - 0.0007), uShadowUv);
  vec2 edge = min(p2.xy, 1.0 - p2.xy);
  return mix(1.0, s, smoothstep(0.0, 0.08, min(edge.x, edge.y)));
}

// Soft drifting cloud shadows, the diorama's moving light.
float cloudShadow(vec3 wp) {
  if (uCloudParams.w <= 0.0) return 1.0;
  vec2 p = wp.xz * uCloudParams.z + uCloudParams.xy;
  float c = fbm(p) * 0.65 + fbm(p * 2.7 + 3.1) * 0.35;
  return 1.0 - uCloudParams.w * smoothstep(0.52, 0.72, c);
}

vec3 ambientLight(vec3 n) {
  float up = n.y * 0.5 + 0.5;
  return mix(uGroundColor, uSkyColor, up);
}

// Warm key, cool fill: shadowed surfaces keep only the sky's blue ambient.
vec3 shade(vec3 albedo, vec3 n, vec3 wp, float ao, float wrap, out float shadowTerm) {
  float viewDist = length(wp - uCamPos);
  float ndl = dot(n, uSunDir);
  float diff = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
  shadowTerm = sunShadow(wp, n, viewDist) * cloudShadow(wp);
  vec3 light = uSunColor * diff * shadowTerm + ambientLight(n) * ao;
  return albedo * light;
}

// Aerial perspective: distance and height fog tinted towards the sun's glow, so far land turns blue and hazy.
vec3 atmosphere(vec3 color, vec3 wp) {
  vec3 d = wp - uCamPos;
  float dist = length(d);
  vec3 v = d / max(dist, 1e-3);
  float h = max(wp.y - uFogParams.z, 0.0);
  float density = uFogParams.x * exp(-h * uFogParams.y);
  float fog = 1.0 - exp(-dist * density);
  fog = min(fog, uFogParams.w);
  float sunAmt = pow(max(dot(v, uSunDir), 0.0), 6.0);
  vec3 fc = mix(uFogColor, uSunGlow, sunAmt);
  return mix(color, fc, fog);
}

float viewDepth01(vec3 wp) {
  return length(wp - uCamPos) / 8000.0;
}
`,xe=class{scene;shadows;sunDir=new n(.4,.6,.3).normalize();sunColor=new b(3,2.6,2.1);skyColor=new b(.45,.55,.75);groundColor=new b(.25,.24,.18);fogColor=new b(.7,.78,.86);sunGlow=new b(1,.85,.6);fogParams=new O(18e-5,.004,0,.9);cloudParams=new O(0,0,.0016,.3);season=new O(0,1,0,0);camPos=new n;night=0;time=0;materials=new Set;constructor(e,t){this.scene=e,this.shadows=t}bind(e){e.setVector3(`uSunDir`,this.sunDir),e.setColor3(`uSunColor`,this.sunColor),e.setColor3(`uSkyColor`,this.skyColor),e.setColor3(`uGroundColor`,this.groundColor),e.setColor3(`uFogColor`,this.fogColor),e.setColor3(`uSunGlow`,this.sunGlow),e.setVector4(`uFogParams`,this.fogParams),e.setVector3(`uCamPos`,this.camPos),e.setFloat(`uTime`,this.time),e.setVector4(`uCloudParams`,this.cloudParams),e.setVector4(`uSeason`,this.season),e.setFloat(`uNight`,this.night);let t=this.shadows;e.setMatrix(`uShadowMat0`,t.cascades[0].matrix),e.setMatrix(`uShadowMat1`,t.cascades[1].matrix),e.setMatrix(`uShadowMat2`,t.cascades[2].matrix),e.setVector3(`uShadowSplits`,t.splits),e.setVector3(`uShadowTexel`,t.texel),e.setFloat(`uShadowUv`,1/t.size),e.setTexture(`uShadowMap0`,t.depthTexture(0)),e.setTexture(`uShadowMap1`,t.depthTexture(1)),e.setTexture(`uShadowMap2`,t.depthTexture(2))}material(e,t,n={}){let r=n.lit??!0,i=[...n.defines??[]];this.scene.getEngine().isNDCHalfZRange&&i.push(`NDC_HALF_Z`);let a=new m(e,this.scene,t,{attributes:n.attributes??[`position`,`normal`],uniforms:[...n.uniforms??[],`world`,`viewProjection`,...r?ye:[]],samplers:[...n.samplers??[],...r?be:[]],defines:i,needAlphaBlending:n.needAlphaBlending??!1,needAlphaTesting:n.needAlphaTesting??!1});return r&&(a.onBindObservable.add(()=>{let e=a.getEffect();e&&this.bind(e)}),this.materials.add(a)),a}};function U(e,t,n){E.ShadersStore[`${e}VertexShader`]=t,E.ShadersStore[`${e}FragmentShader`]=n}var Se=3,Ce=[1,1,2],we=class{cascades=[];splits=new n(80,300,1200);texel=new n(1,1,1);enabled=!0;size;sun=new n(0,1,0);constructor(t,r=2048){this.size=r;for(let a=0;a<Se;a++){let o=new i(`sunCam${a}`,new n(0,100,0),t,!1);o.mode=T.ORTHOGRAPHIC_CAMERA,o.minZ=1,o.maxZ=6e3;let s=new h(`sunShadow${a}`,r,t,{generateMipMaps:!1,generateDepthBuffer:!0,noColorAttachment:!0});s.createDepthStencilTexture(e.LEQUAL,!0,!1,1,e.TEXTUREFORMAT_DEPTH32_FLOAT),s.activeCamera=o,s.renderList=[],s.renderParticles=!1,s.renderSprites=!1;let c={rtt:s,cam:o,depth:null,matrix:f.Identity(),far:0,texelWorld:1,center:new n,radius:1,maxIndex:a};s.getCustomRenderList=()=>this.cull(c),t.customRenderTargets.push(s),this.cascades.push(c)}}resize(t){if(t!==this.size){this.size=t;for(let n of this.cascades)n.rtt.resize(t),n.rtt.createDepthStencilTexture(e.LEQUAL,!0,!1,1,e.TEXTUREFORMAT_DEPTH32_FLOAT),n.depth=null}}addCaster(e,t,n=2){for(let r=0;r<=n;r++){let n=this.cascades[r];n.rtt.renderList.push(e),n.rtt.setMaterialForRendering(e,t)}}removeCaster(e){for(let t of this.cascades){let n=t.rtt.renderList,r=n.indexOf(e);r>=0&&n.splice(r,1)}}cull(e){let t=[],n=e.rtt.renderList,r=this.sun;for(let i of n){if(!i.isEnabled()||i.isDisposed())continue;let n=i.getBoundingInfo().boundingSphere,a=n.centerWorld.x-e.center.x,o=n.centerWorld.y-e.center.y,s=n.centerWorld.z-e.center.z,c=a*r.x+o*r.y+s*r.z,l=a-r.x*c,u=o-r.y*c,d=s-r.z*c,f=e.radius*1.42+n.radiusWorld;l*l+u*u+d*d<=f*f&&t.push(i)}return t}depthTexture(e){let t=this.cascades[e];return!t.depth&&t.rtt.depthStencilTexture&&(t.depth=new D(t.rtt.depthStencilTexture)),t.depth}update(e,t,r,i){this.sun.copyFrom(r).normalize();let a=[Math.max(40,t*.9),Math.max(140,t*2.6),Math.min(4e3,Math.max(500,t*6))];for(let t=0;t<Se;t++){let o=this.cascades[t],s=a[t],c=i?s*.45:0,l=new n(e.x+(i?.x??0)*c,e.y,e.z+(i?.z??0)*c);o.center.copyFrom(l),o.radius=s;let u=2*s/this.size;o.texelWorld=u;let d=l.add(r.scale(2500));o.cam.position.copyFrom(d),o.cam.setTarget(l),o.cam.orthoLeft=-s,o.cam.orthoRight=s,o.cam.orthoTop=s,o.cam.orthoBottom=-s,o.cam.minZ=10,o.cam.maxZ=5e3;let f=o.cam.getViewMatrix(!0),p=n.TransformCoordinates(n.Zero(),f),m=p.x-Math.round(p.x/u)*u,h=p.y-Math.round(p.y/u)*u;o.cam.orthoLeft-=m,o.cam.orthoRight-=m,o.cam.orthoBottom-=h,o.cam.orthoTop-=h,o.cam.getProjectionMatrix(!0),o.matrix.copyFrom(o.cam.getViewMatrix().multiply(o.cam.getProjectionMatrix())),o.far=s*(t===0?.9:.85),o.rtt.refreshRate=this.enabled?Ce[t]:0}this.splits.set(this.cascades[0].far,this.cascades[1].far,this.cascades[2].far),this.texel.set(this.cascades[0].texelWorld,this.cascades[1].texelWorld,this.cascades[2].texelWorld)}};U(`sky`,`
precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = viewProjection * world * vec4(position, 1.0);
  gl_Position = vec4(p.xy, p.w * 0.99999, p.w);
}
`,`
precision highp float;
varying vec3 vDir;
uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uAntiHorizon;
uniform vec3 uSunGlowSky;
uniform vec3 uSunDisk;
uniform vec3 uCloudLit;
uniform vec3 uCloudShade;
uniform vec3 uBelow;
uniform float uCloudCover;
uniform float uTime;
uniform float uNight;
uniform float uSunSize;
uniform float uSunHalo;
uniform vec3 uGlowDir;
uniform float uAfterglow;
${V}

float cloudField(vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, uTime * 0.004)), fbm(p + vec2(5.2, 1.3)));
  float c = fbm(p * 1.4 + q * 1.6 + vec2(uTime * 0.006, 0.0));
  return c;
}

void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  float sunAmt = max(dot(d, uSunDir), 0.0);
  // The azimuth is undefined at the zenith: fade the sun side to neutral there so no seam converges on it.
  float sideTowardSun = mix(0.5, dot(normalize(d.xz + 1e-4), normalize(uSunDir.xz + 1e-4)) * 0.5 + 0.5, smoothstep(0.02, 0.25, length(d.xz)));

  // Gradient: horizon band to zenith, warmer on the sun's side. The cool zenith arrives by about 25 degrees, the band
  // the strategy cameras actually see.
  vec3 horizon = mix(uAntiHorizon, uHorizon, sideTowardSun);
  float t = pow(smoothstep(0.0, 0.45, h), 0.7);
  vec3 col = mix(horizon, uZenith, t);
  col += uSunGlowSky * pow(sunAmt, 8.0) * 0.55 + uSunGlowSky * pow(sunAmt, 64.0) * 0.6;
  // Twilight's afterglow: a warm band hugging the horizon where the sun went down, wide in azimuth (A7). It keys on the
  // sun's own direction, since the light swings to the moon once the sun is gone.
  float glowSide = dot(normalize(d.xz + 1e-4), normalize(uGlowDir.xz + 1e-4)) * 0.5 + 0.5;
  col += uSunGlowSky * uAfterglow * exp(-max(h, 0.0) * 9.0) * pow(glowSide, 2.5);
  // Sun disk with a tight bloom and a broad halo.
  float disk = smoothstep(1.0 - uSunSize, 1.0 - uSunSize * 0.6, sunAmt);
  col += uSunDisk * disk + uSunGlowSky * (pow(sunAmt, 300.0) * 4.0 + pow(sunAmt, 40.0) * 0.8) * uSunHalo;

  // A painterly cloud layer projected onto a plane, lit on the sun side.
  if (h > 0.0) {
    vec2 cp = d.xz / (h + 0.08) * 0.9;
    float c = cloudField(cp);
    float cover = smoothstep(1.0 - uCloudCover, 1.0 - uCloudCover + 0.14, c);
    float lit = smoothstep(0.0, 0.25, cloudField(cp + uSunDir.xz * 0.12) - c + 0.12);
    vec3 cc = mix(uCloudShade, uCloudLit, clamp(lit + pow(sunAmt, 4.0) * 0.5, 0.0, 1.0));
    cc += uSunGlowSky * pow(sunAmt, 12.0) * 0.6 * (1.0 - cover * 0.5);
    float fade = smoothstep(0.0, 0.12, h);
    col = mix(col, cc, cover * fade * 0.92);
  }

  // Stars at night.
  if (uNight > 0.01 && h > 0.0) {
    vec2 sp = d.xz / (h + 0.3) * 220.0;
    float s = step(0.9975, hash12(floor(sp)));
    col += vec3(s) * uNight * smoothstep(0.05, 0.4, h) * 0.9;
  }

  col = mix(uBelow, col, smoothstep(-0.04, 0.02, h));
  gl_FragColor = vec4(col, 1.0);
}
`);var Te=class{lighting;mesh;mat;zenith=new b(.36,.55,.78);horizon=new b(.78,.84,.88);antiHorizon=new b(.7,.78,.86);sunGlow=new b(1,.8,.55);sunDisk=new b(6,5.2,4.2);cloudLit=new b(1.2,1.15,1.1);cloudShade=new b(.62,.68,.8);below=new b(.5,.6,.66);cloudCover=.45;sunSize=45e-5;sunHalo=1;glowDir=new n(0,0,-1);afterglow=0;constructor(e,t){this.lighting=t,this.mesh=r(`sky`,{diameter:2,segments:32,sideOrientation:1},e),this.mesh.infiniteDistance=!0,this.mesh.isPickable=!1,this.mesh.alwaysSelectAsActiveMesh=!0,this.mesh.scaling.setAll(5e3),this.mat=t.material(`skyMat`,`sky`,{attributes:[`position`],lit:!1,uniforms:[`uSunDir`,`uZenith`,`uHorizon`,`uAntiHorizon`,`uSunGlowSky`,`uSunDisk`,`uCloudLit`,`uCloudShade`,`uBelow`,`uCloudCover`,`uTime`,`uNight`,`uSunSize`,`uSunHalo`,`uGlowDir`,`uAfterglow`]}),this.mat.backFaceCulling=!1,this.mat.disableDepthWrite=!0,this.mesh.material=this.mat,this.mesh.renderingGroupId=0,this.mat.onBindObservable.add(()=>{let e=this.mat.getEffect();e&&(e.setVector3(`uSunDir`,this.lighting.sunDir),e.setColor3(`uZenith`,this.zenith),e.setColor3(`uHorizon`,this.horizon),e.setColor3(`uAntiHorizon`,this.antiHorizon),e.setColor3(`uSunGlowSky`,this.sunGlow),e.setColor3(`uSunDisk`,this.sunDisk),e.setColor3(`uCloudLit`,this.cloudLit),e.setColor3(`uCloudShade`,this.cloudShade),e.setColor3(`uBelow`,this.below),e.setFloat(`uCloudCover`,this.cloudCover),e.setFloat(`uTime`,this.lighting.time),e.setFloat(`uNight`,this.lighting.night),e.setFloat(`uSunSize`,this.sunSize),e.setFloat(`uSunHalo`,this.sunHalo),e.setVector3(`uGlowDir`,this.glowDir),e.setFloat(`uAfterglow`,this.afterglow))})}follow(e){this.mesh.position.copyFrom(e)}};E.ShadersStore.tiltShiftFragmentShader=`
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec2 uTexel;
uniform vec4 uRanges;      // near end, near transition, far start, far transition (depth01 = metres / 8000)
uniform float uMaxRadius;  // pixels

float coc(float d) {
  float nearB = uRanges.y > 0.0 ? 1.0 - smoothstep(uRanges.x - uRanges.y, uRanges.x, d) : 0.0;
  float farB = uRanges.w > 0.0 ? smoothstep(uRanges.z, uRanges.z + uRanges.w, d) : 0.0;
  return clamp(max(nearB * 0.8, farB), 0.0, 1.0);
}

void main() {
  vec4 c0 = texture2D(textureSampler, vUV);
  float r0 = coc(c0.a) * uMaxRadius;
  if (r0 < 0.5) { gl_FragColor = vec4(c0.rgb, 1.0); return; }
  vec3 acc = c0.rgb;
  float wsum = 1.0;
  const float GOLDEN = 2.39996323;
  for (int i = 1; i < 28; i++) {
    float fi = float(i);
    float r = sqrt(fi / 28.0) * r0;
    float a = fi * GOLDEN;
    vec2 uv = vUV + vec2(cos(a), sin(a)) * r * uTexel;
    vec4 s = texture2D(textureSampler, uv);
    // A sharp sample in front of a blurred one shouldn't bleed into it.
    float rs = coc(s.a) * uMaxRadius;
    float w = smoothstep(r - 1.0, r + 1.0, rs + 0.5 * step(c0.a, s.a) * r0);
    acc += s.rgb * w;
    wsum += w;
  }
  gl_FragColor = vec4(acc / wsum, 1.0);
}
`;var Ee=class{pipeline;tilt;dof={nearEnd:0,nearT:0,farStart:1e5,farT:0,maxRadius:0};dofEnabled=!0;constructor(t,n){let r=t.getEngine();this.tilt=new d(`tiltShift`,`tiltShift`,[`uTexel`,`uRanges`,`uMaxRadius`],null,1,n,l.BILINEAR_SAMPLINGMODE,r,!1,null,e.TEXTURETYPE_HALF_FLOAT),this.tilt.samples=4,this.tilt.onApply=e=>{e.setFloat2(`uTexel`,1/this.tilt.width,1/this.tilt.height);let t=this.dof;e.setFloat4(`uRanges`,t.nearEnd/8e3,t.nearT/8e3,t.farStart/8e3,t.farT/8e3),e.setFloat(`uMaxRadius`,this.dofEnabled?t.maxRadius*(this.tilt.height/900):0)};let i=new p(`post`,!0,t,[n]);i.samples=1,i.fxaaEnabled=!1,i.bloomEnabled=!0,i.bloomThreshold=1,i.bloomWeight=.15,i.bloomKernel=64,i.bloomScale=.5,i.imageProcessingEnabled=!0;let a=i.imageProcessing;a.toneMappingEnabled=!0,a.toneMappingType=s.TONEMAPPING_KHR_PBR_NEUTRAL,a.exposure=1,a.contrast=1,a.vignetteEnabled=!0,a.vignetteWeight=.45,a.vignetteStretch=0,a.vignetteCameraFov=.72,a.colorCurvesEnabled=!0;let o=new c;o.globalSaturation=-10,o.highlightsHue=40,o.highlightsDensity=8,o.highlightsSaturation=-10,o.shadowsHue=225,o.shadowsDensity=10,o.shadowsSaturation=12,a.colorCurves=o,i.sharpenEnabled=!0,i.sharpen.edgeAmount=.15,this.pipeline=i}},De=900,Oe=1.7,ke=2,Ae=.62,je=.045,Me={map:1,board:.6,low:.45,eye:0,start:.57,pin:.66},Ne=Math.PI*2,Pe=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function Fe(e,t,n){let r=(t-e)%Ne;return r>Math.PI&&(r-=Ne),r<-Math.PI&&(r+=Ne),e+r*n}function Ie(e){return Oe*(De/Oe)**+e}function Le(e){return(2+56*e**+ke)*Math.PI/180}function Re(e){let t=Math.min(1,Math.max(0,e/Ae));return Ie(e)/Math.tan(Le(e))*t*t}function ze(e){return(50-10*Pe(0,.6,e))*Math.PI/180}function Be(e){return Math.hypot(Ie(e),Re(e))}function Ve(e){let t=0,n=1;if(e>=Be(1))return 1;for(let r=0;r<40;r++){let r=(t+n)/2;Be(r)<e?t=r:n=r}return(t+n)/2}var He=1.42,Ue=1.8,We=[.5,3.4];function Ge(e,t,n,r){if(n<.001){let n=Math.log(t/e);return{S:Math.abs(n)/He,at:t=>({u:1,w:e*Math.exp(Math.sign(n)*He*t)})}}let i=(r,i)=>{let a=r*r,o=(t*t-e*e+(i?-1:1)*a*a*n*n)/(2*(i?t:e)*a*n);return Math.log(Math.sqrt(o*o+1)-o)},a=He;if(e*Math.cosh(i(a,!1))>r){let t=.02,n=He;for(let o=0;o<30;o++)a=(t+n)/2,e*Math.cosh(i(a,!1))>r?n=a:t=a;a=t}let o=a*a,s=i(a,!1);return{S:(i(a,!0)-s)/a,at:t=>({u:e*(Math.cosh(s)*Math.tanh(s+a*t)-Math.sinh(s))/(o*n),w:e*Math.cosh(s)/Math.cosh(s+a*t)})}}function Ke(e){return Math.min(We[1],Math.max(We[0],e/Ue))}var qe=.7,Je=1.15,Ye=.85,Xe=.12;function Ze(e,t){let n=n=>{let r=Be(n),i=ze(n)/2,a=Ie(n);return r*Math.tan(i)*t>=e*Je&&Re(n)-a/Math.tan(Le(n)+i)>=e*Ye};if(n(qe))return qe;if(!n(1))return 1;let r=qe,i=1;for(let e=0;e<30;e++){let e=(r+i)/2;n(e)?i=e:r=e}return i}var Qe=.15,$e=.12,et=.15,tt=5,nt=2.5,rt=1.5;function it(e,t){return Math.min(tt,1.5+(t-e)*.45)}function at(e,t,n,r,i,a){let o=Math.sin(i),s=Math.cos(i),c=-.05;for(let i of[12,20,32,50,80,130,200,320,500,800])c=Math.max(c,Math.atan2(e(t+o*i,r+s*i)+1-n,i));let l=Math.atan(.1*Math.tan(a/2))-c;return Math.min(.21,Math.max(-.17,l))}function ot(e,t,n,r,i,a,o,s){let c=Re(a),l=Math.max(e(r,i),e(r+o*Math.min(c,12),i+s*Math.min(c,12)));return l+(e(t,n)-l)*Pe(.45,.82,a)}function st(e,t,n,r,i){let a=Re(r),o=Math.sin(i),s=Math.cos(i),c=t-o*a,l=n-s*a;return{x:c,y:Math.max(ot(e,t,n,c,l,r,o,s)+Ie(r),e(c,l)+1.2,e(c+o*2,l+s*2)+.72),z:l,yaw:i,pitch:Le(r),fov:ze(r)}}function ct(e){let t=Math.cos(e.pitch),n=Math.sin(e.pitch),r=[Math.sin(e.yaw)*t,-n,Math.cos(e.yaw)*t],i=[-Math.cos(e.yaw),0,Math.sin(e.yaw)];return{F:r,R:i,U:[-r[1]*i[2],i[2]*r[0]-i[0]*r[2],i[0]*r[1]]}}function lt(e,t,n,r,i=[],a=10,o=6,s=8){let{F:c,R:l,U:u}=ct(t),d=Math.tan(t.fov/2),f=d*n,p=0,m=0,h=0,g=0;for(let n=0;n<o;n++){let i=1-(n+.5)/o*2,_=.6+.4*n/Math.max(1,o-1);m+=_*a,i<0&&(g+=a);for(let n=0;n<a;n++){let o=(n+.5)/a*2-1,m=c[0]+l[0]*o*f+u[0]*i*d,g=c[1]+u[1]*i*d,v=c[2]+l[2]*o*f+u[2]*i*d;if(g>=0)continue;let y=Math.min(t.y/-g,6e3/Math.hypot(m,g,v));for(let n=1;n<=s;n++){let a=y*n/s,o=t.y+g*a,c=e(t.x+m*a,t.z+v*a);if(!(c<o)){c>=.3&&(p+=_),i<0&&c>r+12&&h++;break}}}}let _=0;for(let n of i){let r=n.x-t.x,i=e(n.x,n.z)+4-t.y,a=n.z-t.z,o=r*c[0]+i*c[1]+a*c[2];if(o<=0)continue;let s=(r*l[0]+a*l[2])/(o*f),p=(r*u[0]+i*u[1]+a*u[2])/(o*d);if(Math.abs(s)>.85||p<-.85||p>.6)continue;let m=!0;for(let n=1;n<12&&m;n++)m=e(t.x+r*n/12,t.z+a*n/12)<t.y+i*n/12-1;m&&(_+=n.weight*(1-.5*Math.max(Math.abs(s)/.85,Math.abs(p+.15)/.7)))}return{land:p/m,relief:g?h/g:0,seen:_}}function ut(e,t,n,r,i,a={}){let o=a.subjects??[],s=a.sun,c=s&&Math.hypot(s.x,s.z)>.001?Math.atan2(s.x,s.z):null,l=o.reduce((e,t)=>e+t.weight,0)||1,u=[{x:t,z:n},...o.map(e=>({x:(t+e.x)/2,z:(n+e.z)/2}))],d={x:t,z:n,yaw:Math.PI,score:-1/0};for(let t=0;t<16;t++){let n=t/16*Ne,a=0;if(c!==null){let e=(c-n)%Ne;e>Math.PI&&(e-=Ne),e<-Math.PI&&(e+=Ne);let t=Math.abs(e)*180/Math.PI;a=Math.max(0,1-Math.max(60-t,t-100,0)/30)*(e>0?1:.8)}for(let t of u){let s=lt(e,st(e,t.x,t.z,r,n),i,e(t.x,t.z),o),c=s.land+.25*(s.seen/l)-.5*s.relief+.03*a;c>d.score&&(d={x:t.x,z:t.z,yaw:n,score:c})}}return{x:d.x,z:d.z,yaw:d.yaw}}function dt(e,t,n,r,i,a,o){if(a>0&&n>1200)return null;let s=Math.min(8,Math.max(.25,n*.01)),c=0,l=0;for(let u=0;u<2e3&&c<7e3;u++){if(n+a*c<=e(t+i*c,r+o*c)){let s=l,u=c;for(let c=0;c<12;c++){let c=(s+u)/2;n+a*c<=e(t+i*c,r+o*c)?u=c:s=c}let d=t+i*u,f=r+o*u;return{x:d,y:e(d,f),z:f}}l=c,c+=s,s=Math.min(12,s*1.04)}return null}function ft(e,t,n,r,i){let{F:a,R:o,U:s}=ct(e),c=n-e.x,l=r-e.y,u=i-e.z,d=c*a[0]+l*a[1]+u*a[2];if(d<=0)return null;let f=Math.tan(e.fov/2),p=f*t;return{u:(c*o[0]+u*o[2])/(d*p),v:(c*s[0]+l*s[1]+u*s[2])/(d*f)}}function pt(e,t,n,r){let{F:i,R:a,U:o}=ct(e),s=Math.tan(e.fov/2),c=s*t,l=i[0]+a[0]*n*c+o[0]*r*s,u=i[1]+o[1]*r*s,d=i[2]+a[2]*n*c+o[2]*r*s,f=Math.hypot(l,u,d);return{x:l/f,y:u/f,z:d/f}}var mt=class{ground;camera;target=new n(0,0,0);zoom=Me.start;yaw=Math.PI;bounds=4e3;probe=null;goal={x:0,z:0,zoom:Me.start,yaw:Math.PI};zoomVel=0;zoomSpeed=12;glide=!1;baseY=0;fly=null;lastPos=null;clock=0;crownList=[];crownAt={x:1e9,z:1e9,time:-1e9};landed=!1;landing=null;eyePitch=null;grabbed=null;mapFrame=null;mapKey=``;mapZoom=1;constructor(e,t){this.ground=t,this.camera=new i(`rts`,new n(0,100,100),e),this.camera.inputs.clear(),this.camera.maxZ=12e3}g(e,t){return Math.max(this.ground.heightAt(e,t),0)}get height(){return Ie(this.zoom)}get zoomGoal(){return this.goal.zoom}get yawGoal(){return this.goal.yaw}get flying(){return this.fly!==null}distance(e=this.zoom){let t=Ie(e),n=Re(e);return Math.hypot(t,n)}fovFor(e=this.zoom){return ze(e)}aspect(){let e=this.camera.getScene().getEngine();return e.getRenderWidth()/Math.max(1,e.getRenderHeight())}openingView(e,t,n,r={}){return ut((e,t)=>this.g(e,t),e,t,n,this.aspect(),r)}panSpeed(){return Math.min(1100,Math.max(7,Ie(this.goal.zoom)*1.1))}metresPerPixel(e){return 2*this.distance()*Math.tan(this.fovFor()/2)/e}forwardXZ(e=this.yaw){return{x:Math.sin(e),z:Math.cos(e)}}rightXZ(e=this.yaw){return{x:-Math.cos(e),z:Math.sin(e)}}clamp(){let e=this.bounds;this.goal.x=Math.min(e,Math.max(-e,this.goal.x)),this.goal.z=Math.min(e,Math.max(-e,this.goal.z))}snap(e,t,n=this.goal.zoom,r=this.goal.yaw){this.goal={x:e,z:t,zoom:n,yaw:r},this.target.x=e,this.target.z=t,this.zoom=n,this.yaw=r,this.zoomVel=0,this.fly=null,this.landing=null,this.lastPos=null,this.baseY=this.g(e,t),this.place(0)}pan(e,t,n){let r=Math.hypot(e,t);r>1&&(e/=r,t/=r),this.interrupt(),this.landing=null;let i=this.panSpeed()*n,a=this.rightXZ(),o=this.forwardXZ();this.goal.x+=(a.x*e-o.x*t)*i,this.goal.z+=(a.z*e-o.z*t)*i,this.glide=!1,this.clamp()}drag(e,t,n){this.interrupt(),this.landing=null;let r=this.metresPerPixel(n),i=this.rightXZ(),a=this.forwardXZ(),o=1/Math.min(1,Math.max(.33,Math.sin(Le(this.zoom))));this.goal.x+=-i.x*e*r+a.x*t*r*o,this.goal.z+=-i.z*e*r+a.z*t*r*o,this.glide=!1,this.clamp()}grabStart(e,t){let n=this.groundUnder(e,t);this.grabbed=n&&{x:n.x,z:n.z}}grabMove(e,t,n,r,i,a){let o=this.grabbed;if(!o){this.drag(n,r,a);return}this.interrupt(),this.landing=null;let s=(e,t)=>this.g(e,t),c=i/Math.max(1,a),l=e/i*2-1,u=1-t/a*2;for(let e=0;e<2;e++){let e=this.settledPose(this.goal.x,this.goal.z,this.goal.zoom,this.goal.yaw),t=pt(e,c,l,u),i=dt(s,e.x,e.y,e.z,t.x,t.y,t.z);if(!i||Math.hypot(o.x-i.x,o.z-i.z)>this.distance(this.goal.zoom)*2){this.grabbed=null,this.drag(n,r,a);return}this.goal.x+=o.x-i.x,this.goal.z+=o.z-i.z}this.glide=!1,this.clamp()}rotate(e){this.interrupt(),this.landing=null,this.goal.yaw+=e}zoomBy(e,t){this.interrupt();let n=this.goal.zoom;this.zoomSpeed=12;let r=this.zoomMax();if(this.goal.zoom=Math.min(Math.max(r,n),Math.max(0,n+e*je)),t&&e<0&&n>=.12&&this.g(t.x,t.z)>=.4){let e=t.x-this.goal.x,r=t.z-this.goal.z,i=(1-Ie(this.goal.zoom)/Ie(n))*.85*Math.min(1,this.distance(n)/Math.max(1e-6,Math.hypot(e,r)));this.goal.x+=e*i,this.goal.z+=r*i,this.glide=!1}let i=this.mapFrame;if(i&&e>0&&r<1&&this.goal.zoom>Ae&&r-n>1e-4){let e=Math.min(1,Math.max(0,(this.goal.zoom-Math.max(n,Ae))/(r-Math.max(n,Ae)))),t=Math.max(i.maxX-i.minX,i.maxZ-i.minZ)/2*Xe,a=this.forwardXZ(this.goal.yaw);this.goal.x+=((i.minX+i.maxX)/2-a.x*t-this.goal.x)*e,this.goal.z+=((i.minZ+i.maxZ)/2-a.z*t-this.goal.z)*e,this.glide=!0}this.clamp(),this.eyeGoal()}setZoom(e){let t=Math.min(this.zoomMax(),Math.max(0,e));this.zoomSpeed=Math.abs(t-this.zoom)>.2?6:12,this.goal.zoom=t,this.eyeGoal()}eyeGoal(){this.goal.zoom>=.2?(this.landed=!1,this.landing=null):this.goal.zoom<$e&&!this.landed&&(this.landed=!0,this.landing=this.probe?this.land():null)}crownsAround(e,t){let n=this.crownAt;if(!this.probe)return[];if(Math.hypot(e-n.x,t-n.z)>50||this.clock-n.time>2){let n=[];this.probe.crowns(e,t,80,(e,t,r,i,a)=>n.push({x:e,z:t,r,foot:i,top:a})),this.crownList=n,this.crownAt={x:e,z:t,time:this.clock}}return this.crownList}blockedAt(e,t,n,r){if(this.probe&&this.probe.solidTop(e,t,nt)>n-1)return!0;for(let i of r){if(i.top<n-1)continue;let r=i.r+it(i.foot,i.top);if((e-i.x)**2+(t-i.z)**2<r*r)return!0}return!1}clearSpot(e,t,n,r){let i=this.crownsAround(e,t);if(!this.blockedAt(e,t,this.g(e,t)+n,i))return{x:e,z:t};for(let a of[1,2,3,4.5,6,8,11,15]){let o=null,s=1/0;for(let c=0;c<16;c++){let l=e+Math.cos(c/16*Ne)*a,u=t+Math.sin(c/16*Ne)*a;if(this.blockedAt(l,u,this.g(l,u)+n,i))continue;let d=r?(l-r.x)**2+(u-r.z)**2:c;d<s&&(s=d,o={x:l,z:u})}if(o)return o}return{x:e,z:t}}viewScore(e,t,n,r,i){let a=this.probe,o=Math.sin(n),s=Math.cos(n),c=-s,l=o,u=this.g(e,t)+Oe,d=0;for(let n of[-.85,-.45,0,.45,.85]){let r=0,i=1/Math.hypot(1,n);for(let d of[5,9,14,20,28,40,55]){let f=e+(o+c*n)*d*i,p=t+(s+l*n)*d*i;r=Math.max(r,Math.atan2(Math.max(this.g(f,p),a.rockTop(f,p,1))-u,d))}d-=Math.max(0,r-.06)*(n?3:5)}for(let n of[3,6,10,15])for(let i of[-.85,-.45,0,.45,.85]){let u=e+(o+c*i)*n,f=t+(s+l*i)*n,p=(1-n/18)*(Math.abs(i)>.5?.6:1);a.solidTop(u,f,1)>this.g(u,f)+1&&(d-=p*.5),r.some(e=>(u-e.x)**2+(f-e.z)**2<(e.r+.5)**2)&&(d-=p*.4)}let f=0;for(let n of[22,32,45,62])for(let r of[-.25,.25]){let i=e+(o+c*r)*n,u=t+(s+l*r)*n,d=a.solidTop(i,u,3);d>this.g(i,u)+2&&d>a.rockTop(i,u,3)&&f++}d+=Math.min(4,f)*.15;let p=Math.hypot(i.x,i.z);return p>.001&&i.y<.45&&(d-=Math.max(0,(o*i.x+s*i.z)/p-.3)*.6),this.g(e+o*10,t+s*10)<.3&&this.g(e+o*20,t+s*20)<.3&&(d-=.3),d}gentle(e,t,n){if(Math.hypot(this.g(e+1.5,t)-this.g(e-1.5,t),this.g(e,t+1.5)-this.g(e,t-1.5))/3>.4)return!1;for(let r=0;r<8;r++)if(this.g(e+Math.cos(r/8*Ne)*7,t+Math.sin(r/8*Ne)*7)-n>2.2)return!1;return!0}*land(){if(!this.probe)return;let e=this.goal.x,t=this.goal.z,n=this.goal.yaw,r=this.probe.sun(),i=this.crownsAround(e,t),a=null,o=-1/0;for(let s of[0,5,10,16,24,34]){let c=s?s>30?14:10:1;for(let l=0;l<c;l++){let u=e+Math.cos(l/c*Ne)*s,d=t+Math.sin(l/c*Ne)*s,f=this.g(u,d);if(!(f<.4||!this.gentle(u,d,f)||this.blockedAt(u,d,f+Oe,i))){for(let e of[0,-.5,.5,-1,1]){let t=this.viewScore(u,d,n+e,i,r)-.03*s-.35*Math.abs(e);t>o&&(o=t,a={x:u,z:d,yaw:n+e})}yield}}}a&&(this.goal.x=a.x,this.goal.z=a.z,this.goal.yaw=a.yaw,this.glide=!1)}zoomMax(){let e=this.probe?.frame()??null;if(this.mapFrame=e,!e)return 1;let t=Math.max(e.maxX-e.minX,e.maxZ-e.minZ)/2,n=`${t.toFixed(0)}|${this.aspect().toFixed(2)}`;return n!==this.mapKey&&(this.mapKey=n,this.mapZoom=Ze(t,this.aspect())),this.mapZoom}setYaw(e){this.goal.yaw=e}frameFocus(e,t,n,r=Math.max(t,.85)){let i=(e,t)=>this.g(e,t),a=this.aspect(),o=this.goal.yaw,s=e.reduce((e,t)=>e+t.x,0)/e.length,c=e.reduce((e,t)=>e+t.z,0)/e.length,l=(n.u0+n.u1)/2,u=(n.v0+n.v1)/2;for(let d=t;;d=Math.min(r,d+.03)){let t=s,f=c;for(let e=0;e<2;e++){let e=this.settledPose(t,f,d,o),n=pt(e,a,l,u),r=dt(i,e.x,e.y,e.z,n.x,n.y,n.z);if(!r)break;t+=s-r.x,f+=c-r.z}let p=this.settledPose(t,f,d,o);if(e.every(e=>{let t=ft(p,a,e.x,i(e.x,e.z),e.z);return!!t&&t.u>=n.u0&&t.u<=n.u1&&t.v>=n.v0&&t.v<=n.v1})||d>=r)return{x:t,z:f,zoom:d}}}flyTo(e,t,n=this.goal.zoom,r){this.landing=null,this.goal.x=e,this.goal.z=t,this.goal.zoom=Math.min(1,Math.max(0,n)),this.clamp();let i=Math.hypot(this.goal.x-this.target.x,this.goal.z-this.target.z),a=2*Math.tan(ze(1)/2)*this.aspect(),o=Ge(Be(this.zoom)*a,Be(this.goal.zoom)*a,i,Be(1)*a);this.fly={fromX:this.target.x,fromZ:this.target.z,fromYaw:r===void 0?null:this.yaw,path:o,span:a,time:0,dur:Ke(o.S)},r!==void 0&&(this.goal.yaw=r),this.glide=!0}interrupt(){this.fly&&(this.fly.fromYaw!==null&&(this.goal.yaw=this.yaw),this.fly=null,this.goal.x=this.target.x,this.goal.z=this.target.z,this.goal.zoom=this.zoom,this.zoomVel=0)}update(e){if(this.clock+=e,this.landing){let e=performance.now()+1.5;for(;this.landing&&performance.now()<e;)this.landing.next().done&&(this.landing=null)}if(this.fly){let t=this.fly;t.time+=Math.min(e,1/30);let n=Math.min(1,t.time/t.dur),r=n*n*n*(n*(6*n-15)+10),i=t.path.at(r*t.path.S),a=n>=1?1:i.u;this.target.x=t.fromX+(this.goal.x-t.fromX)*a,this.target.z=t.fromZ+(this.goal.z-t.fromZ)*a,this.zoom=n>=1?this.goal.zoom:Ve(i.w/t.span),t.fromYaw!==null&&(this.yaw=Fe(t.fromYaw,this.goal.yaw,r)),n>=1&&(this.fly=null,this.glide=!1,this.zoomVel=0)}else{let t=this.zoomSpeed,n=this.zoom-this.goal.zoom,r=this.zoomVel+t*n,i=Math.exp(-t*e);this.zoom=this.goal.zoom+(n+r*e)*i,this.zoomVel=(this.zoomVel-t*r*e)*i,Math.abs(this.zoom-this.goal.zoom)<2e-5&&Math.abs(this.zoomVel)<2e-4&&(this.zoom=this.goal.zoom,this.zoomVel=0);let a=this.glide?3.2:9,o=1-Math.exp(-a*e);this.target.x+=(this.goal.x-this.target.x)*o,this.target.z+=(this.goal.z-this.target.z)*o}this.fly&&this.fly.fromYaw!==null||(this.yaw=Fe(this.yaw,this.goal.yaw,1-Math.exp(-10*e))),this.place(e)}lifted(e,t,n,r,i,a,o){let s=this.probe,c=Math.max(o+Ie(i),this.g(n,r)+1.2,this.g(n+a.x*2,r+a.z*2)+.72);if(s&&c-this.g(n,r)<60&&(c=Math.max(c,s.solidTop(n,r,2)+rt),i>=.09999999999999999&&c-this.g(n,r)<30))for(let e of this.crownsAround(n,r)){let t=it(e.foot,e.top),i=e.top+t;i<=c||(c+=(i-c)*(1-Pe(e.r+.3*t,e.r+t,Math.hypot(n-e.x,r-e.z))))}if(i>$e&&i<Ae){let i=this.g(e,t)+2,a=0;for(let o=1;o<10;o++){let s=o/10,l=this.g(n+(e-n)*s,r+(t-r)*s)+.5-(c+(i-c)*s);l>0&&(a=Math.max(a,l/(1-s)))}c+=a}return c}settledPose(e,t,n,r){let i=this.forwardXZ(r),a=Re(n),o=e-i.x*a,s=t-i.z*a,c=this.lifted(e,t,o,s,n,i,ot((e,t)=>this.g(e,t),e,t,o,s,n,i.x,i.z)),l=Le(n);return n<Qe&&(l+=(at((e,t)=>this.g(e,t),o,c,s,r,ze(n))-l)*(1-Pe(0,Qe,n))),{x:o,y:c,z:s,yaw:r,pitch:l,fov:ze(n)}}place(e){let t=this.zoom,r=Ie(t),i=Re(t),a=Le(t),o=this.forwardXZ(),s=this.target.x-o.x*i,c=this.target.z-o.z*i,l=this.probe;if(l&&t<et){let e=this.clearSpot(s,c,r,this.lastPos&&{x:this.lastPos.x,z:this.lastPos.z}),t=e.x-s,n=e.z-c;if(t||n){s=e.x,c=e.z;let r=this.goal.x,i=this.goal.z;!this.fly&&this.blockedAt(r,i,this.g(r,i)+Ie(this.goal.zoom),this.crownsAround(r,i))&&(this.target.x+=t,this.target.z+=n,this.goal.x+=t,this.goal.z+=n)}}let u=ot((e,t)=>this.g(e,t),this.target.x,this.target.z,s,c,t,o.x,o.z),d=t<.2?30:6;this.baseY=e>0?this.baseY+(u-this.baseY)*(1-Math.exp(-d*e)):u;let f=this.lifted(this.target.x,this.target.z,s,c,t,o,this.baseY);if(this.target.y=this.g(this.target.x,this.target.z),t<Qe){let n=at((e,t)=>this.g(e,t),s,f,c,this.yaw,this.fovFor(t));this.eyePitch=this.eyePitch===null||e===0?n:this.eyePitch+(n-this.eyePitch)*(1-Math.exp(-4*e)),a+=(this.eyePitch-a)*(1-Pe(0,Qe,t))}else this.eyePitch=null;let p=new n(s,f,c);if(this.lastPos&&e>0&&!this.fly){let n=1-Math.exp(-Math.min(e,1/30)/.12);p=this.lastPos.add(p.subtract(this.lastPos).scale(n)),t<.3&&p.y<this.lastPos.y&&(p.y=this.lastPos.y+(p.y-this.lastPos.y)*(1-Math.exp(-6*e))),p.y=Math.max(p.y,this.g(p.x,p.z)+.3,l&&p.y-this.g(p.x,p.z)<60?l.solidTop(p.x,p.z,.6)+.5:-1/0)}this.lastPos=p.clone();let m=this.camera;m.position.copyFrom(p);let h=Math.cos(a);m.setTarget(new n(p.x+o.x*h*10,p.y-Math.sin(a)*10,p.z+o.z*h*10)),m.fov=this.fovFor(t),m.minZ=Math.min(2,Math.max(.06,r*.02))}groundUnder(e,t){let n=this.camera.getScene().createPickingRay(e,t,null,this.camera),r=n.origin,i=n.direction;return dt((e,t)=>this.g(e,t),r.x,r.y,r.z,i.x,i.y,i.z)}},ht={dawn:{sunColor:`#ffb48c`,sunEnergy:1.6,ambient:.75,fogColor:`#c5c3d6`,fogDensity:5e-4,exposure:1.2,saturation:1.12,skyEnergy:1.15,zenith:`#93abcd`,horizon:`#f0c9b8`,antiHorizon:`#a3abc4`,sunHorizon:`#ffd8b0`,ground:`#c9c0c7`,clouds:.12,cloudLit:`#ffd6c4`,cloudShade:`#a49fb5`,stars:0,water:{shallow:`#5d7a7a`,deep:`#2f424a`,foam:`#f1e4dc`,sky:`#d9d4d6`,sun:`#ffcfb0`}},midday:{sunColor:`#fff4e2`,sunEnergy:2.4,ambient:.5,fogColor:`#a9c9e4`,fogDensity:25e-5,exposure:.7,saturation:1.12,skyEnergy:1.7,zenith:`#2f80dc`,horizon:`#d9e9f7`,antiHorizon:`#cde2f4`,sunHorizon:`#f4efe2`,ground:`#7894aa`,clouds:.38,cloudLit:`#fffaf2`,cloudShade:`#a3adba`,stars:0,water:{shallow:`#2fa39a`,deep:`#1b4f5e`,foam:`#eef3f0`,sky:`#cbe2f5`,sun:`#fff4e2`}},golden:{sunColor:`#ffd09d`,sunEnergy:3.2,ambient:.65,fogColor:`#a9b8c2`,fogDensity:5e-4,exposure:1.08,saturation:1.06,skyEnergy:1.75,zenith:`#7fa6cc`,horizon:`#f2dcb5`,antiHorizon:`#b4c6d6`,sunHorizon:`#ffe2b0`,ground:`#929a93`,clouds:.45,cloudLit:`#ffe3be`,cloudShade:`#8198b1`,stars:0,water:{shallow:`#73929a`,deep:`#5d7f86`,foam:`#f4ead6`,sky:`#b4bdb8`,sun:`#ffd9a0`}},blue_hour:{sunColor:`#ffc394`,sunEnergy:1.25,ambient:.62,fogColor:`#74869e`,fogDensity:6e-4,exposure:1.25,saturation:1.12,skyEnergy:1.5,zenith:`#4f6d98`,horizon:`#cf9a78`,antiHorizon:`#7488a6`,sunHorizon:`#ffa45e`,ground:`#5b6f89`,clouds:0,cloudLit:`#f5a07c`,cloudShade:`#4a566a`,stars:2,water:{shallow:`#3e5461`,deep:`#27394a`,foam:`#c9cdd6`,sky:`#6d8094`,sun:`#ffb070`}},night:{sunColor:`#b7cce9`,sunEnergy:.35,ambient:.45,fogColor:`#4d5a70`,fogDensity:6e-4,exposure:.7,saturation:.88,skyEnergy:1,zenith:`#1c2d4c`,horizon:`#56657f`,antiHorizon:`#424f66`,sunHorizon:`#56657f`,ground:`#363f50`,clouds:.12,cloudLit:`#8fa0c4`,cloudShade:`#1c2844`,stars:2.8,water:{shallow:`#2b4f5c`,deep:`#163448`,foam:`#8494ac`,sky:`#4b6b96`,sun:`#b8c8ea`}},rain:{sunColor:`#ffe8c4`,sunEnergy:2.3,ambient:.55,fogColor:`#a9b5be`,fogDensity:7e-4,exposure:.9,saturation:1.12,skyEnergy:1.6,zenith:`#6f9cbf`,horizon:`#e6e2d2`,antiHorizon:`#b4c6cf`,sunHorizon:`#fde7bf`,ground:`#93a2ab`,clouds:.35,cloudLit:`#fff0dc`,cloudShade:`#87919c`,stars:0,water:{shallow:`#5f8a86`,deep:`#38535f`,foam:`#e6ebea`,sky:`#bcced8`,sun:`#fff0cf`}}},gt=[[0,`night`],[4.5,`night`],[6,`dawn`],[10,`midday`],[14.5,`midday`],[17.5,`golden`],[19,`golden`],[20.75,`blue_hour`],[23,`night`],[24,`night`]],_t=[[1,-24,180],[5.1,0,152],[6,7,141],[8,24,112],[10,42,60],[12,57,-15],[14,50,-50],[16,30,-95],[17,21,-118],[18,14,-135],[19,7,-150],[20,2.5,-162],[20.6,0,-165],[22,-7,-178]],vt=[];for(let e of[-1,0,1])for(let[t,n,r]of _t)vt.push([t+24*e,n,r-360*e]);function yt(e){let t=(e%24+24)%24;t<_t[0][0]&&(t+=24);let n=1;for(;vt[n+1][0]<=t;)n++;let r=vt[n-1],i=vt[n],a=vt[n+1],o=vt[n+2],s=a[0]-i[0],c=(t-i[0])/s,l=c*c,u=l*c,d=(e,t,n)=>(t[n]-e[n])/(t[0]-e[0]),f=e=>{let t=(d(r,i,e)+d(i,a,e))/2,n=(d(i,a,e)+d(a,o,e))/2;return(2*u-3*l+1)*i[e]+(u-2*l+c)*s*t+(-2*u+3*l)*a[e]+(u-l)*s*n};return[f(1),f(2)]}function bt(e){let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)}function xt(e){return b.FromHexString(e)}function St(e,t,n){return new b(e.r+(t.r-e.r)*n,e.g+(t.g-e.g)*n,e.b+(t.b-e.b)*n)}function Ct(e,t,n){let r=(e,t)=>e+(t-e)*n,i=(e,t)=>St(xt(e),xt(t),n);return{sunColor:i(e.sunColor,t.sunColor),sunEnergy:r(e.sunEnergy,t.sunEnergy),ambient:r(e.ambient,t.ambient),fogColor:i(e.fogColor,t.fogColor),fogDensity:r(e.fogDensity,t.fogDensity),exposure:r(e.exposure,t.exposure),saturation:r(e.saturation,t.saturation),skyEnergy:r(e.skyEnergy,t.skyEnergy),zenith:i(e.zenith,t.zenith),horizon:i(e.horizon,t.horizon),antiHorizon:i(e.antiHorizon,t.antiHorizon),sunHorizon:i(e.sunHorizon,t.sunHorizon),ground:i(e.ground,t.ground),clouds:r(e.clouds,t.clouds),cloudLit:i(e.cloudLit,t.cloudLit),cloudShade:i(e.cloudShade,t.cloudShade),stars:r(e.stars,t.stars),water:{shallow:i(e.water.shallow,t.water.shallow),deep:i(e.water.deep,t.water.deep),foam:i(e.water.foam,t.water.foam),sky:i(e.water.sky,t.water.sky),sun:i(e.water.sun,t.water.sun)}}}var wt=class{lighting;sky;hour=17.2;season=1;seasonBlend={from:1,to:1,t:1};weather=0;exposure=1;sunElevation=0;lamps=0;water={shallow:new b,deep:new b,foam:new b,sky:new b,sun:new b};current;constructor(e,t){this.lighting=e,this.sky=t}update(){let e=(this.hour%24+24)%24,t=0;for(;t<gt.length-2&&gt[t+1][0]<=e;)t++;let[n,r]=gt[t],[i,a]=gt[t+1],o=Ct(ht[r],ht[a],bt((e-n)/(i-n))),[s,c]=yt(e),l=s*Math.PI/180,u=c*Math.PI/180,d={x:Math.sin(u)*Math.cos(l),y:Math.sin(l),z:Math.cos(u)*Math.cos(l)};this.sky.glowDir.set(d.x,d.y,d.z);let f=bt((s+1.5)/4.5),[p,m]=yt(12+(((e+12)%24+24)%24-12)*.55),h=p*.85,g=(1-bt((s+3)/4.5))*bt((h+1)/5),_=1-bt((s+8)/10);this.lamps=1-bt(s/9),this.sunElevation=s;let v=this.weather;if(v>0){let e=bt((s+6)/16);o=Ct(this.toPreset(o),ht.rain,v*e)}let y=bt((v-.35)/.65),b=this.lighting,x,S;if(f>.01||g<.01)b.sunDir.set(d.x,Math.max(d.y,.03),d.z).normalize(),x=o.sunEnergy*f*(1-.4*y),S=o.sunColor;else{let e=h*Math.PI/180,t=m*Math.PI/180;d={x:Math.sin(t)*Math.cos(e),y:Math.sin(e),z:Math.cos(t)*Math.cos(e)},b.sunDir.set(d.x,Math.max(d.y,.05),d.z).normalize(),x=.35*g*(1-.7*v),S=xt(`#c3cddb`)}this.season===3&&(S=St(S,xt(`#ffcfb0`),.3*bt((12-s)/12)));let C=S.toLinearSpace();b.sunColor.set(C.r*x*1.25,C.g*x*1.25,C.b*x*1.25);let w=o.zenith.toLinearSpace(),T=St(o.horizon,o.antiHorizon,.5).toLinearSpace(),E=o.ambient*(1+.25*y)*o.skyEnergy*.42;b.skyColor.set((w.r*.45+T.r*.55)*E,(w.g*.45+T.g*.55)*E,(w.b*.45+T.b*.55)*E);let D=o.ground.toLinearSpace();b.groundColor.set(D.r*E*.55+.02,D.g*E*.6+.02,D.b*E*.5+.01);let O=St(o.fogColor,xt(`#8d98a3`),.35*y).toLinearSpace(),k=o.skyEnergy*.75;b.fogColor.set(O.r*k,O.g*k,O.b*k);let A=o.sunHorizon.toLinearSpace();b.sunGlow.set(A.r*k*1.15,A.g*k*1.1,A.b*k),b.fogParams.x=o.fogDensity*.55*(1+.8*y),b.night=_;let j=this.sky,ee=o.skyEnergy*.95,te=xt(`#8d98a3`),M=(e,t=0)=>St(e,te,t).toLinearSpace().scale(ee);j.zenith.copyFrom(M(o.zenith,.45*y)),j.horizon.copyFrom(M(o.horizon,.45*y)),j.antiHorizon.copyFrom(M(o.antiHorizon,.45*y)),j.sunGlow.copyFrom(M(o.sunHorizon,.45*y)),j.below.copyFrom(M(o.ground)),j.cloudLit.copyFrom(o.cloudLit.toLinearSpace().scale(ee*1.1*Math.max(.15,f))),j.cloudShade.copyFrom(o.cloudShade.toLinearSpace().scale(ee*.9)),j.cloudCover=Math.max(o.clouds,.62*y)*.9+.08,j.sunDisk.copyFrom(C.scale(12*f*(1-y))),j.sunHalo=f*(1-y),j.afterglow=bt((s+9)/7)*(1-bt((s-1)/6))*1.6*(1-y);let ne=1-.3*y,N=o.water,P=N.shallow.scale(ne),F=N.deep.scale(ne);if(this.season===3){let e=Math.min(1,Math.max(0,(1-1.5*v)*(1-.4*_)))*.5;F=St(F,xt(`#5f7684`),e),P=St(P,xt(`#7d929b`),e)}this.water.shallow.copyFrom(P.toLinearSpace()),this.water.deep.copyFrom(F.toLinearSpace()),this.water.foam.copyFrom(N.foam.toLinearSpace()),this.water.sky.copyFrom(N.sky.scale(ne).toLinearSpace().scale(o.skyEnergy*.72)),this.water.sun.copyFrom(N.sun.toLinearSpace().scale(Math.max(f,g*.5)*(1-.7*v)));let re=this.seasonBlend,I=[0,0,0,0];I[re.from]+=1-re.t,I[re.to]+=re.t,b.season.set(I[0],I[1],I[2],I[3]),this.exposure=o.exposure*(1+.45*(1-Math.min(1,f+g)))*(1-.06*y)*(1-.15*I[3]*f),this.current=o,b.cloudParams.w=(.28+.4*y)*f}toPreset(e){let t=e=>e.toHexString();return{sunColor:t(e.sunColor),sunEnergy:e.sunEnergy,ambient:e.ambient,fogColor:t(e.fogColor),fogDensity:e.fogDensity,exposure:e.exposure,saturation:e.saturation,skyEnergy:e.skyEnergy,zenith:t(e.zenith),horizon:t(e.horizon),antiHorizon:t(e.antiHorizon),sunHorizon:t(e.sunHorizon),ground:t(e.ground),clouds:e.clouds,cloudLit:t(e.cloudLit),cloudShade:t(e.cloudShade),stars:e.stars,water:{shallow:t(e.water.shallow),deep:t(e.water.deep),foam:t(e.water.foam),sky:t(e.water.sky),sun:t(e.water.sun)}}}},Tt=`
// Two long swells shared with ships and wakes so hulls ride the drawn waves.
vec3 swell(vec2 p, float t) {
  vec2 d1 = normalize(vec2(1.0, 0.35));
  vec2 d2 = normalize(vec2(0.553, 0.833));
  float k1 = 6.2831853 / 55.0;
  float k2 = 6.2831853 / (55.0 * 0.47);
  float a1 = dot(d1, p) * k1 - t * 1.4 * k1;
  float a2 = dot(d2, p) * k2 - t * 1.4 * 0.8 * k2;
  float h = 0.24 * (sin(a1) + 0.6 * sin(a2));
  vec2 grad = 0.24 * (cos(a1) * k1 * d1 + 0.6 * cos(a2) * k2 * d2);
  return vec3(h, grad);
}
`;U(`water`,`
precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec4 vClip;
${Tt}
void main() {
  vec4 wp = world * vec4(position, 1.0);
  float fade = 1.0 - smoothstep(600.0, 1400.0, length(wp.xz - uCamPos.xz));
  wp.y += swell(wp.xz, uTime).x * fade;
  vWorld = wp.xyz;
  vClip = viewProjection * wp;
  gl_Position = vClip;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec4 vClip;
${V}
${H}
${Tt}
uniform sampler2D uBedDepth;   // linear distance from the camera to the terrain, / 8000
uniform vec3 uShallow;
uniform vec3 uDeep;
uniform vec3 uFoam;
uniform vec3 uSkyRefl;
uniform vec3 uGlint;
uniform vec3 uSeabed;

vec2 rippleGrad(vec2 p, float t) {
  // Analytic-free ripples: central differences of two drifting noise layers.
  float e = 0.35;
  vec2 pa = p * 0.0125 + t * vec2(0.6, 0.35) * 0.0125;
  vec2 pb = p * 0.037 - t * vec2(-0.35, 0.6) * 1.3 * 0.037;
  float ha = vnoise(pa * 8.0);
  float hb = vnoise(pb * 8.0);
  vec2 ga = vec2(vnoise((pa + vec2(e / 80.0, 0.0)) * 8.0) - ha, vnoise((pa + vec2(0.0, e / 80.0)) * 8.0) - ha);
  vec2 gb = vec2(vnoise((pb + vec2(e / 27.0, 0.0)) * 8.0) - hb, vnoise((pb + vec2(0.0, e / 27.0)) * 8.0) - hb);
  return ga * 2.2 + gb * 1.1;
}

void main() {
  vec3 toCam = uCamPos - vWorld;
  float dist = length(toCam);
  vec3 v = toCam / dist;

  vec3 sw = swell(vWorld.xz, uTime);
  float nearFade = 1.0 / (1.0 + dist / 450.0);
  vec2 g = sw.yz + rippleGrad(vWorld.xz, uTime) * (0.25 + 0.75 * nearFade);
  vec3 n = normalize(vec3(-g.x, 1.0, -g.y));

  // Depth of water along the view ray, from the terrain pre-pass.
  vec2 suv = vClip.xy / vClip.w * 0.5 + 0.5;
  float bed = texture2D(uBedDepth, suv).r * 8000.0;
  float path = max(bed - dist, 0.0);
  float vdepth = path * max(abs(v.y), 0.08);

  // Body colour: turquoise over sand in the shallows, deep teal beyond.
  float t = 1.0 - exp(-pow(vdepth / 3.5, 1.4) * 0.693);
  vec3 body = mix(uShallow, uDeep, t);
  float slick = vnoise(vWorld.xz / 600.0);
  body *= 1.0 + (slick - 0.5) * 0.07 * vec3(0.7, 1.0, 1.15);
  float seeBed = exp(-path / 1.6) * (1.0 - 0.28 * smoothstep(0.15, 1.4, vdepth));
  vec3 bedCol = uSeabed * mix(vec3(1.0), uShallow / max(max(uShallow.r, uShallow.g), uShallow.b) * 0.8, smoothstep(0.0, 0.35, vdepth));
  vec3 col = mix(body, bedCol * (uSunColor * max(dot(vec3(0.0, 1.0, 0.0), uSunDir), 0.0) + ambientLight(vec3(0.0, 1.0, 0.0))), seeBed);

  // Lit fraction: the water reads the sun's shadow so clouds and cliffs darken it.
  float sh = sunShadow(vWorld, vec3(0.0, 1.0, 0.0), dist) * cloudShadow(vWorld);
  col *= mix(0.72, 1.0, sh);

  // Fresnel reflection of the sky.
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 5.0) * 0.8 * smoothstep(0.1, 2.6, vdepth) + 0.04;
  vec3 r = reflect(-v, n);
  vec3 sky = mix(uSkyRefl, uSkyRefl * 0.75 + uSunGlow * 0.25, pow(max(dot(r, uSunDir), 0.0), 4.0));
  col = mix(col, sky, clamp(fres, 0.0, 1.0));

  // Shore foam: a froth line at the waterline and soft bands drifting outward.
  vec2 fp = vWorld.xz;
  float n1 = vnoise(fp * 0.09 + uTime * 0.05);
  float n2 = vnoise(fp * 0.24 - uTime * 0.04);
  float froth = 1.0 - smoothstep(0.0, 0.18 + 0.12 * n1, vdepth);
  float band = fract(vdepth / 0.65 - uTime * 0.07);
  band = smoothstep(0.0, 0.2, band) * (1.0 - smoothstep(0.2, 0.45, band)) * (1.0 - smoothstep(0.4, 1.3, vdepth));
  float breakup = smoothstep(0.42, 0.66, n1 * 0.6 + n2 * 0.4);
  float foam = clamp(max(froth * 0.85, band * 0.5) * breakup + froth * 0.25, 0.0, 1.0);
  col = mix(col, uFoam * (uSunColor * 0.35 + ambientLight(vec3(0.0, 1.0, 0.0)) * 1.1), foam);

  // Sun glint and sheen.
  vec3 h = normalize(uSunDir + v);
  float lowSun = 1.0 - smoothstep(0.12, 0.65, uSunDir.y);
  // Where the ripple normal turns faster than a pixel can show, the highlight widens (keeping its energy) instead of
  // breaking into hard aliased blobs.
  float pw0 = mix(900.0, 280.0, lowSun);
  float pw = mix(pw0, 64.0, clamp(length(fwidth(n)) * 6.0, 0.0, 1.0));
  float glint = min(pow(max(dot(n, h), 0.0), pw) * (6.0 + 10.0 * lowSun) * (pw + 8.0) / (pw0 + 8.0), 3.0);
  float sheen = pow(max(dot(reflect(-uSunDir, normalize(n + vec3(0.0, 2.0, 0.0))), v), 0.0), 24.0) * 0.22;
  col += uGlint * (glint + sheen) * sh * (1.0 - foam);

  // Waterline: fade into the seabed where the water is a film.
  col = mix(bedCol * (uSunColor * 0.5 + ambientLight(vec3(0.0, 1.0, 0.0))), col, max(smoothstep(0.0, 0.12, path), foam));

  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`);var Et=class e{palette;camera;mesh;mat;bedDepth=null;constructor(t,n,r,i){this.palette=r,this.camera=i,this.mesh=e.grid(t),this.mesh.isPickable=!1,this.mesh.alwaysSelectAsActiveMesh=!0,this.mat=n.material(`waterMat`,`water`,{attributes:[`position`],uniforms:[`uShallow`,`uDeep`,`uFoam`,`uSkyRefl`,`uGlint`,`uSeabed`],samplers:[`uBedDepth`]}),this.mat.backFaceCulling=!1,this.mat.onBindObservable.add(()=>{let e=this.mat.getEffect();e&&(e.setColor3(`uShallow`,this.palette.shallow),e.setColor3(`uDeep`,this.palette.deep),e.setColor3(`uFoam`,this.palette.foam),e.setColor3(`uSkyRefl`,this.palette.sky),e.setColor3(`uGlint`,this.palette.sun),e.setFloat3(`uSeabed`,.42,.38,.27),this.bedDepth&&e.setTexture(`uBedDepth`,this.bedDepth))}),this.mesh.material=this.mat}static grid(e){let t=[],n=[];t.push(0,0,0);let r=e=>4*1.085**e-3.2;for(let e=1;e<=96;e++){let n=e===96?3e4:r(e);for(let e=0;e<128;e++){let r=e/128*Math.PI*2;t.push(Math.cos(r)*n,0,Math.sin(r)*n)}}for(let e=0;e<128;e++)n.push(0,1+(e+1)%128,1+e);for(let e=1;e<96;e++){let t=1+(e-1)*128,r=1+e*128;for(let e=0;e<128;e++){let i=(e+1)%128;n.push(t+e,t+i,r+e,t+i,r+i,r+e)}}let i=new v(`water`,e),a=new S;return a.positions=t,a.indices=n,a.applyToMesh(i),i}update(){let e=this.camera.globalPosition,t=Math.max(2,e.y*.02);this.mesh.position.set(Math.round(e.x/t)*t,0,Math.round(e.z/t)*t);let n=Math.max(1,e.y/60);this.mesh.scaling.set(n,1,n)}};function Dt(e){let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)}var Ot=class{canvas;engine;scene;lighting;shadows;sky;post;cam;atmosphere;water;updaters=[];time=0;constructor(e,t,n){this.canvas=e,this.engine=new o(e,!1,{antialias:!1,stencil:!1,preserveDrawingBuffer:!1,powerPreference:`high-performance`,alpha:!1,adaptToDeviceRatio:!1},!1),this.engine.setHardwareScalingLevel(1/(window.devicePixelRatio*n.renderScale)),this.scene=new C(this.engine),this.scene.useRightHandedSystem=!0,this.scene.clearColor=new g(.6,.72,.82,1),this.scene.skipPointerMovePicking=!0,this.scene.autoClear=!0,this.shadows=new we(this.scene,n.shadowSize),this.shadows.enabled=n.shadows,this.lighting=new xe(this.scene,this.shadows),this.sky=new Te(this.scene,this.lighting),this.cam=new mt(this.scene,t),this.scene.activeCamera=this.cam.camera,this.atmosphere=new wt(this.lighting,this.sky),this.water=new Et(this.scene,this.lighting,this.atmosphere.water,this.cam.camera),this.post=new Ee(this.scene,this.cam.camera),window.addEventListener(`resize`,()=>this.engine.resize())}onUpdate(e){this.updaters.push(e)}start(){let e=performance.now();this.engine.runRenderLoop(()=>{let t=performance.now(),n=Math.min(.1,(t-e)/1e3);e=t,this.time+=n,this.frame(n),this.scene.render()})}frame(e){for(let t of this.updaters)t(e);this.cam.update(e);let t=this.lighting;t.time=this.time,this.atmosphere.update(),t.camPos.copyFrom(this.cam.camera.position),t.cloudParams.x=this.time*.004,t.cloudParams.y=this.time*.0016,this.sky.follow(this.cam.camera.position),this.water.update();let r=this.cam.distance(),i=this.cam.camera.getDirection(n.Forward(!0)),a=Math.hypot(i.x,i.z)||1;this.shadows.update(this.cam.target,r,new n(t.sunDir.x,t.sunDir.y,t.sunDir.z),{x:i.x/a,z:i.z/a}),this.post.pipeline.imageProcessing.exposure=this.atmosphere.exposure,this.updateDof(r)}updateDof(e){let t=Dt((this.cam.zoom-.5)/.07),n=this.post.dof;n.farStart=e*1.3,n.farT=e*.6*Math.max(t,1e-4),n.nearEnd=e*.6*t,n.nearT=e*.25*t,n.maxRadius=5*t}},kt=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vec4 wp = world * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normal;
  gl_Position = viewProjection * wp;
}
`,At=`
precision highp float;
varying vec3 vWorld;
uniform vec3 uCamPos;
void main() { gl_FragColor = vec4(length(vWorld - uCamPos) / 8000.0, 0.0, 0.0, 1.0); }
`,jt=`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`,Mt=`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
${V}
${H}

uniform highp sampler2D uHexData;   // R biome, G road bits, B field frame byte, A field marks
uniform highp sampler2D uLandState; // R crop*64, G flags, B owner+1, A fertility
uniform highp sampler2D uFog;       // R 1 = explored
uniform sampler2D uNoise;           // tileable value noise
uniform sampler2D uHabA;            // woodland, southern share, village clearing, moor share (8 m per texel over 8192 m)
uniform sampler2D uHabB;            // fen, crag, hills and pine shares
uniform sampler2D uHabC;            // wilderness paint fields: broad, drift, flower drift, clover
uniform sampler2D uTracks;          // cosmetic track coverage, 2 m per texel
uniform float uLandUseOn;
uniform float uSeed;
uniform float uFogOn;
uniform float uOverlay;             // 0..1 planning grid
uniform vec4 uSelected;             // up to two selected hexes (q, r, q, r), 999 = none
uniform vec2 uSelected3;
uniform float uSelectedOk;
uniform float uWild;                // 1 = paint the wilderness palette beyond the home island
uniform float uSeasonProgress;
uniform float uSnow;                // 0..1 lying snow
uniform float uDrought;
uniform float uWetness;
uniform float uCropProgress;
uniform vec3 uHouseColors[8];

const float HEX_R = 20.0;
const float SQ3 = 1.7320508;
const int GRID = 512;

// sRGB palette from the original, converted to linear at compile time.
#define C(r,g,b) pow(vec3(r,g,b), vec3(2.2))

vec2 hexCenter(ivec2 h) { return vec2(HEX_R * SQ3 * (float(h.x) + float(h.y) * 0.5), HEX_R * 1.5 * float(h.y)); }

ivec2 hexRound(vec2 p) {
  float q = (SQ3 / 3.0 * p.x - p.y / 3.0) / HEX_R;
  float r = (2.0 / 3.0 * p.y) / HEX_R;
  float s = -q - r;
  float rq = floor(q + 0.5), rr = floor(r + 0.5), rs = floor(s + 0.5);
  float dq = abs(rq - q), dr = abs(rr - r), ds = abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs; else if (dr > ds) rr = -rq - rs;
  return ivec2(int(rq), int(rr));
}

vec4 hexInfo(ivec2 h) {
  ivec2 t = h + ivec2(GRID / 2);
  if (t.x < 0 || t.y < 0 || t.x >= GRID || t.y >= GRID) return vec4(0.0);
  return texelFetch(uHexData, t, 0);
}
vec4 landInfo(ivec2 h) {
  ivec2 t = clamp(h + ivec2(GRID / 2), ivec2(0), ivec2(GRID - 1));
  return texelFetch(uLandState, t, 0);
}
float explored(ivec2 h) {
  ivec2 t = h + ivec2(GRID / 2);
  if (t.x < 0 || t.y < 0 || t.x >= GRID || t.y >= GRID) return 0.0;
  return texelFetch(uFog, t, 0).r;
}
int typeOf(vec4 info) { return int(info.r * 255.0 + 0.5); }

float hexSdf(vec2 p, ivec2 h) {
  vec2 a = abs(p - hexCenter(h));
  return HEX_R * 0.8660254 - max(a.x, dot(a, vec2(0.5, 0.8660254)));
}

float nz(vec2 p, float s) { return texture2D(uNoise, p / s).r; }

uint hash3u(int x, int y, int s) {
  uint h = (uint(x) * 73856093u) ^ (uint(y) * 19349663u) ^ (uint(s) * 83492791u);
  h ^= h >> 13u; h *= 1274126177u; h ^= h >> 16u;
  return h;
}

// Biome indices.
const int OCEAN = 0; const int SHALLOWS = 1; const int BEACH = 2; const int MEADOW = 3; const int FARMLAND = 4;
const int FOREST = 5; const int PINE = 6; const int HILLS = 7; const int MOUNTAIN = 8; const int PEAK = 9;
const int FEN = 10; const int MOOR = 11; const int SOUTH = 12;

const vec3 grassDark = C(0.27, 0.32, 0.11); const vec3 grassMid = C(0.44, 0.48, 0.17); const vec3 grassLight = C(0.53, 0.57, 0.22);
const vec3 grassDry = C(0.54, 0.52, 0.27); const vec3 forestFloor = C(0.20, 0.27, 0.11); const vec3 wheatA = C(0.66, 0.55, 0.22);
const vec3 wheatB = C(0.74, 0.63, 0.28); const vec3 cropGreen = C(0.36, 0.46, 0.12); const vec3 ploughed = C(0.52, 0.38, 0.24);
const vec3 fallow = C(0.52, 0.56, 0.23); const vec3 hedge = C(0.24, 0.36, 0.13); const vec3 springGrass = C(0.36, 0.50, 0.15);
const vec3 stubble = C(0.80, 0.66, 0.34); const vec3 peakSnow = C(0.90, 0.92, 0.96); const vec3 snowCol = C(0.71, 0.74, 0.79);
const vec3 roadCol = C(0.80, 0.66, 0.47); const vec3 roadEdge = C(0.62, 0.47, 0.28); const vec3 rockCol = C(0.58, 0.58, 0.53);
const vec3 rockDark = C(0.38, 0.39, 0.36); const vec3 sand = C(0.88, 0.80, 0.62); const vec3 seabed = C(0.55, 0.58, 0.45);
const vec3 needleFloor = C(0.21, 0.24, 0.13); const vec3 fenGreen = C(0.36, 0.42, 0.22); const vec3 fenWater = C(0.20, 0.27, 0.26);
const vec3 heather = C(0.40, 0.34, 0.30); const vec3 moorGrass = C(0.48, 0.47, 0.25); const vec3 gorse = C(0.86, 0.72, 0.18);
const vec3 scrub = C(0.64, 0.56, 0.33); const vec3 oliveGreen = C(0.40, 0.44, 0.24); const vec3 limestone = C(0.86, 0.82, 0.70);
const vec3 mapInk = C(0.33, 0.24, 0.15); const vec3 ink = C(0.16, 0.12, 0.08);
const vec3 glowGold = C(1.0, 0.80, 0.35); const vec3 glowBad = C(0.85, 0.25, 0.18); const vec3 autumnVine = C(0.62, 0.36, 0.14);

vec3 grassBase;

vec3 biomePaint(int t, vec4 n, float y, float up) {
  if (t == PINE) return mix(grassBase, mix(needleFloor, rockDark, 0.25 * n.z), 0.45);
  if (t == PEAK) {
    float snowline = 60.0 + (n.x - 0.5) * 60.0;
    float summit = smoothstep(snowline, snowline + 45.0, y) * smoothstep(0.64, 0.91, up) * (0.55 + 0.35 * n.y);
    return mix(rockDark * vec3(0.85, 0.92, 1.13), snowCol, summit);
  }
  if (t == FEN) { float pool = smoothstep(0.55, 0.62, n.z); return mix(mix(fenGreen, grassDark, n.y * 0.6), fenWater, pool); }
  if (t == MOOR) { vec3 c = mix(heather, moorGrass, smoothstep(0.35, 0.65, n.y)); return mix(c, gorse, smoothstep(0.72, 0.8, n.w) * 0.3 * step(0.5, n.z)); }
  if (t == SOUTH) { vec3 c = mix(scrub, oliveGreen, smoothstep(0.35, 0.8, n.y) * 0.6); return mix(c, limestone, smoothstep(0.55, 0.85, n.z) * 0.3); }
  if (t == HILLS) return mix(grassBase, mix(grassDry, grassMid, smoothstep(0.35, 0.65, n.y)), 0.6);
  if (t == MOUNTAIN) return mix(grassDry, rockCol, 0.45 + 0.3 * n.y);
  if (t == BEACH) return mix(grassBase, mix(grassLight, grassDry, 0.4), 0.55);
  if (t == FOREST) return mix(grassBase * vec3(0.78, 0.86, 0.76), forestFloor, 0.32);
  return grassBase;
}

float roadDist(vec2 p, ivec2 h, int bits) {
  vec2 c = hexCenter(h);
  float d = 1e9;
  for (int e = 0; e < 6; e++) {
    if (((bits >> e) & 1) == 0) continue;
    float a0 = radians(30.0 - 60.0 * float(e));
    float a1 = radians(30.0 - 60.0 * float(e + 1));
    vec2 A = c + vec2(cos(a0), sin(a0)) * HEX_R;
    vec2 B = c + vec2(cos(a1), sin(a1)) * HEX_R;
    vec2 pa = p - A, ba = B - A;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    d = min(d, length(pa - ba * t));
  }
  return d;
}

// Parcel lattice (docs/spec/world.md 4.5).
vec4 parcelAt(vec2 p, float frame, out float edge, out vec2 lp) {
  vec2 dir = vec2(cos(frame), sin(frame));
  vec2 perp = vec2(-dir.y, dir.x);
  lp = vec2(dot(p, dir), dot(p, perp));
  float col = floor(lp.x / 24.0);
  float shift = float(hash3u(int(col), 17, int(uSeed)) % 1000u) / 1000.0;
  float ly = lp.y / 42.0 + shift;
  float row = floor(ly);
  vec2 f = vec2(lp.x / 24.0 - col, ly - row);
  bool split = hash3u(int(col), int(row), int(uSeed) + 5) % 4u == 0u;
  float half_ = (split && f.x >= 0.5) ? 1.0 : 0.0;
  float fx = split ? fract(f.x * 2.0) : f.x;
  float width = split ? 12.0 : 24.0;
  edge = min(min(fx, 1.0 - fx) * width, min(f.y, 1.0 - f.y) * 42.0);
  vec2 centreL = vec2((col + 0.5) * 24.0, (row + 0.5 - shift) * 42.0);
  vec2 centre = centreL.x * dir + centreL.y * perp;
  return vec4(col, row, half_, fx);
}

// Local arrays indexed in loops become stack memory on Metal, which slows the whole shader even when unused,
// so hex directions are a select chain and loops are unrolled by hand.
ivec2 dirOf(int i) {
  return i == 0 ? ivec2(1, 0) : i == 1 ? ivec2(1, -1) : i == 2 ? ivec2(0, -1) : i == 3 ? ivec2(-1, 0) : i == 4 ? ivec2(-1, 1) : ivec2(0, 1);
}

// Explored as a smooth field: blended over the three hex centres round the point (barycentric on the centre lattice),
// so the edge runs straight through the midpoints of shared hex edges instead of zig-zagging round every hex. Warped so
// it reads as hand-inked. Returns roughly the signed distance to the edge in metres (positive inside).
float exploredField(vec2 p) {
  vec2 q = p + (vec2(nz(p, 90.0), nz(p + 300.0, 90.0)) - 0.5) * 18.0;
  float r = q.y / (1.5 * HEX_R);
  float a = q.x / (SQ3 * HEX_R) - r * 0.5;
  vec2 c = floor(vec2(a, r));
  vec2 f = vec2(a, r) - c;
  ivec2 h = ivec2(c);
  float e;
  if (f.x + f.y < 1.0) e = explored(h) * (1.0 - f.x - f.y) + explored(h + ivec2(1, 0)) * f.x + explored(h + ivec2(0, 1)) * f.y;
  else e = explored(h + ivec2(1, 1)) * (f.x + f.y - 1.0) + explored(h + ivec2(0, 1)) * (1.0 - f.x) + explored(h + ivec2(1, 0)) * (1.0 - f.y);
  // The centre lattice's triangles are 1.5 hex radii high.
  return (e - 0.5) * 1.5 * HEX_R;
}

void main() {
  vec3 wp = vWorld;
  vec2 p = wp.xz;
  vec3 nrm = normalize(vNormal);
  float up = clamp(nrm.y, 0.0, 1.0);
  float camd = distance(uCamPos, wp);
  float nearDetail = 1.0 - smoothstep(90.0, 150.0, camd);

  float nBig = nz(p, 260.0), nMid = nz(p + 37.0, 70.0), nSmall = nz(p + 91.0, 14.0), nFine = nz(p + 13.0, 3.0);
  vec4 n = vec4(nBig, nMid, nSmall, nFine);
  float grain = nearDetail > 0.0 ? (nz(p + 23.0, 3.5) - 0.5) * 0.65 + (nz(p + 71.0, 0.45) - 0.5) * 0.35 : 0.0;

  // Explored (1) or under the fog of war (0); fields, lanes and tracks never show on unknown land.
  float ed = 30.0, ex = 1.0;
#ifdef FOG
  if (uFogOn > 0.5) {
    ed = exploredField(p);
    ex = smoothstep(-1.5, 1.5, ed);
  }
#endif

  // Seasons: weights blend spring, summer, harvest, winter.
  float sSpring = uSeason.x, sHarvest = uSeason.z, sWinter = uSeason.w;

  // Base grass.
  grassBase = mix(grassDark, grassMid, smoothstep(0.32, 0.6, nBig));
  grassBase = mix(grassBase, grassLight, smoothstep(0.43, 0.72, nMid) * 0.62);
  grassBase *= 0.88 + 0.24 * smoothstep(0.30, 0.68, nSmall);
  grassBase = mix(grassBase, springGrass * (0.9 + 0.25 * nMid), 0.55 * sSpring);
  grassBase = mix(grassBase, grassDry, (0.35 + 0.2 * nMid) * sHarvest);
  grassBase = mix(grassBase, grassDry, uDrought * 0.6);

  // Soft biome borders: blend the containing hex and its two nearest neighbours across a warped edge.
  vec2 warp = (vec2(nz(p, 120.0), nz(p + 200.0, 120.0)) - 0.5) * 9.0;
  vec2 pw = p + warp + vec2(grain, -grain * 0.73) * nearDetail * 0.9;
  ivec2 hb = hexRound(pw);
  vec2 qb = pw - hexCenter(hb);
  // The nearest edge faces the direction of qb, the runner-up is its neighbour on the same side.
  float sector = -atan(qb.y, qb.x) / 1.04719755;
  float sr = floor(sector + 0.5);
  int i0 = int(mod(sr, 6.0));
  int i1 = int(mod(sr + (sector > sr ? 1.0 : -1.0), 6.0));
  ivec2 hn0 = hb + dirOf(i0), hn1 = hb + dirOf(i1);
  float w0 = smoothstep(-3.0, 3.0, hexSdf(pw, hb));
  float w1 = smoothstep(-3.0, 3.0, hexSdf(pw, hn0));
  float w2 = smoothstep(-3.0, 3.0, hexSdf(pw, hn1));
  float ws = max(w0 + w1 + w2, 1e-4);
  w0 /= ws; w1 /= ws; w2 /= ws;
  int t0 = typeOf(hexInfo(hb)), t1 = typeOf(hexInfo(hn0)), t2 = typeOf(hexInfo(hn1));
  // The wilderness turf replaces this paint except on peaks and water, so skip it where it would be overwritten.
  bool wildOnly = uWild * smoothstep(370.0, 490.0, length(p)) > 0.999 && uLandUseOn > 0.5 && t0 != PEAK && t1 != PEAK && t2 != PEAK && t0 > SHALLOWS && t1 > SHALLOWS && t2 > SHALLOWS;
  vec3 col = wildOnly ? grassBase : biomePaint(t0, n, wp.y, up) * w0 + biomePaint(t1, n, wp.y, up) * w1 + biomePaint(t2, n, wp.y, up) * w2;
  float wForest = (t0 == FOREST || t0 == PINE ? w0 : 0.0) + (t1 == FOREST || t1 == PINE ? w1 : 0.0) + (t2 == FOREST || t2 == PINE ? w2 : 0.0);
  float wOpen = (t0 == MEADOW || t0 == FARMLAND || t0 == SOUTH ? w0 : 0.0) + (t1 == MEADOW || t1 == FARMLAND || t1 == SOUTH ? w1 : 0.0) + (t2 == MEADOW || t2 == FARMLAND || t2 == SOUTH ? w2 : 0.0);
  float wCrag = (t0 == PEAK || t0 == MOUNTAIN ? w0 : 0.0) + (t1 == PEAK || t1 == MOUNTAIN ? w1 : 0.0) + (t2 == PEAK || t2 == MOUNTAIN ? w2 : 0.0);
  float wBeach = (t0 == BEACH ? w0 : 0.0) + (t1 == BEACH ? w1 : 0.0) + (t2 == BEACH ? w2 : 0.0);

  // Unwarped hex for state, fields and edges.
  ivec2 hs = hexRound(p);
  vec4 pinfo = hexInfo(hs);
  vec4 land = landInfo(hs);
  int landFlags = int(land.g * 255.0 + 0.5);
  int landCrop = int(land.r * 255.0 / 64.0 + 0.5);
  bool worked = land.b > 0.0;
  bool trampled = (landFlags & 8) != 0;
  bool burned = (landFlags & 4) != 0;
  vec2 local = p - hexCenter(hs);
  vec2 ap = abs(local);
  float hexEdge = HEX_R * 0.8660254 - max(ap.x, dot(ap, vec2(0.5, 0.8660254)));

  // Habitat fields (spec 10.6): the same smooth fields drive tree density, cover and this paint.
  float wild = uWild * smoothstep(370.0, 490.0, length(p));
  vec2 huv = p / 8192.0 + 0.5;
  vec4 habA = texture2D(uHabA, huv) * uLandUseOn;
  vec4 habB = texture2D(uHabB, huv) * uLandUseOn;
  vec4 habC = mix(vec4(0.5), texture2D(uHabC, huv), uLandUseOn);
  float woods = habA.r, southF = habA.g, clearing = habA.b, moorF = habA.a;
  float fenF = habB.r, cragF = habB.g, hillsF = habB.b, pineF = habB.a;
  float broad = habC.r, drift = habC.g;
  float wPeak = (t0 == PEAK ? w0 : 0.0) + (t1 == PEAK ? w1 : 0.0) + (t2 == PEAK ? w2 : 0.0);
  float wWater = (t0 <= SHALLOWS ? w0 : 0.0) + (t1 <= SHALLOWS ? w1 : 0.0) + (t2 <= SHALLOWS ? w2 : 0.0);
  float wetMark = 0.0;

  // Wilderness turf (spec 10.4 step 4), keeping each biome's identity from the smooth fields instead of hex polygons.
  if (wild > 0.001 && uLandUseOn > 0.5) {
    float tuft = nSmall;
    float slopeDry = smoothstep(0.04, 0.32, 1.0 - up);
    float hollow = 1.0 - smoothstep(5.0, 28.0, wp.y);
    float moisture = clamp(hollow * 0.45 + (1.0 - drift) * 0.62 - slopeDry * 0.32, 0.0, 1.0);
    float bleached = smoothstep(0.32, 0.78, drift) * (0.45 + slopeDry * 0.45);
    vec3 turf = mix(grassDark * 0.92, grassMid * 1.04, smoothstep(0.22, 0.72, drift));
    turf = mix(turf, mix(grassDark, fenGreen, 0.35), moisture * 0.45);
    turf = mix(turf, grassDry * vec3(1.02, 0.96, 0.82), bleached * 0.3);
    float heath = smoothstep(24.0, 85.0, wp.y) * smoothstep(0.28, 0.76, broad + slopeDry * 0.28);
    turf = mix(turf, mix(moorGrass * 0.90, heather * 0.82, drift * 0.55), heath * 0.5);
    float earth = smoothstep(0.28, 0.55, 1.0 - up) * smoothstep(0.2, 0.9, nMid);
    turf = mix(turf, mix(ploughed, rockDark, 0.35) * (0.85 + nFine * 0.25), earth * 0.4);
    // Moor: heather and moor grass with gorse flecks.
    float moorW = smoothstep(0.15, 0.55, moorF);
    vec3 heathC = mix(heather * 0.88, moorGrass * 0.85, smoothstep(0.35, 0.75, drift + (nSmall - 0.5) * 0.45));
    heathC = mix(heathC, heather * vec3(1.15, 0.95, 1.1), smoothstep(0.55, 0.75, nSmall) * 0.35 * (1.0 - sWinter));
    heathC = mix(heathC, gorse * 0.8, smoothstep(0.72, 0.82, nFine) * step(0.6, nSmall) * 0.25 * (1.0 - sWinter));
    turf = mix(turf, heathC, moorW * 0.92);
    // Fen: wet greens round dark pools.
    float fenW = smoothstep(0.25, 0.65, fenF);
    // Pools from mixed scales: a threshold on the 14 m tile alone repeats as a speckle from the map camera.
    float pool = smoothstep(0.60, 0.66, nMid * 0.55 + nSmall * 0.3 + drift * 0.15 + (fenW - 0.5) * 0.1) * fenW * (1.0 - slopeDry);
    turf = mix(turf, mix(fenGreen, grassDark, nMid * 0.6), fenW * 0.7);
    turf = mix(turf, fenWater, pool);
    wetMark = pool;
    // The south: scrub and olive green over pale limestone.
    float southW = smoothstep(0.18, 0.60, southF);
    // Soft transitions: hard thresholds on the 14 m noise read as camouflage from the board camera.
    vec3 scrubC = mix(scrub * 0.92, oliveGreen, smoothstep(0.30, 0.80, nMid) * 0.6 + (nSmall - 0.5) * 0.2);
    scrubC = mix(scrubC, limestone * 0.95, smoothstep(0.55, 0.85, nSmall) * smoothstep(0.4, 0.7, drift) * 0.3);
    turf = mix(turf, scrubC, southW * 0.8);
    // Hills dry out, crags thin to stony turf.
    turf = mix(turf, mix(grassDry, grassMid, smoothstep(0.35, 0.65, nMid)), smoothstep(0.25, 0.70, hillsF) * 0.45);
    turf = mix(turf, mix(grassDry, rockCol, 0.35 + 0.3 * nMid), smoothstep(0.30, 0.70, cragF) * 0.5);
    // Village greens are trodden and dry.
    turf = mix(turf, mix(grassDry, roadEdge, 0.16), clearing * (0.26 + 0.16 * drift));
    turf = mix(turf, fenGreen * 0.90, moisture * (1.0 - smoothstep(1.0, 7.0, wp.y)) * 0.40);
    turf = mix(turf, grassBase * 0.95, sSpring * moisture * 0.30);
    turf = mix(turf, grassDry * (0.73 + 0.30 * drift), sHarvest * 0.30);
    turf *= (0.96 + 0.06 * tuft + 0.04 * nFine) * mix(0.88, 1.12, smoothstep(0.24, 0.72, broad * 0.40 + drift * 0.60));
    // Drifts of flowers and clover on open turf.
    float flowerDrift = habC.b, clover = habC.a;
    float margin = smoothstep(0.12, 0.82, woods);
    float bloom = smoothstep(0.54, 0.78, flowerDrift) * (1.0 - margin) * (1.0 - earth) * (1.0 - sWinter);
    turf = mix(turf, mix(grassLight * 1.22, heather * vec3(1.28, 1.16, 1.10), smoothstep(0.40, 0.68, clover)), bloom * (0.10 + heath * 0.18 + sSpring * 0.12));
    turf *= 0.92 + clover * 0.16 + (nFine - 0.5) * 0.08;
    // The wild runs darker and less yellow than the home island's pasture, nearer the canon's grass values.
    turf = mix(vec3(dot(turf, vec3(0.2126, 0.7152, 0.0722))), turf, 0.85) * 0.78;
    col = mix(col, turf, wild * clamp(1.0 - wPeak - wWater, 0.0, 1.0));
  }

  // Woodland floor: darker and cooler where the trees stand, so tree masses sit in their own shade.
  float floorW = uLandUseOn > 0.5 ? smoothstep(0.10, 0.70, woods) : wForest;
  vec3 floorCol = mix(col * vec3(0.66, 0.76, 0.64), mix(forestFloor, needleFloor, smoothstep(0.2, 0.7, pineF)), 0.35);
  col = mix(col, floorCol, floorW * mix(0.85, 0.6, wild));

  // Field patchwork on the parcel lattice: strips of wheat, green crops, plough and fallow.
  float winterRows = 0.0;
  float laneFill = 0.0;
  float fieldMask = 0.0;
  {
    float frame = pinfo.b * 3.14159265;
    float pedge; vec2 lp;
    vec4 cell = parcelAt(p, frame, pedge, lp);
    vec2 dir = vec2(cos(frame), sin(frame));
    vec2 perp = vec2(-dir.y, dir.x);
    float shift = float(hash3u(int(cell.x), 17, int(uSeed)) % 1000u) / 1000.0;
    vec2 centre = ((cell.x + 0.5) * 24.0) * dir + ((cell.y + 0.5 - shift) * 42.0) * perp;
    ivec2 hc = hexRound(centre);
    vec4 cinfo = hexInfo(hc);
    int ctype = typeOf(cinfo);
    int cmarks = int(cinfo.a * 255.0 + 0.5);
    bool cworked = landInfo(hc).b > 0.0;
    bool ring = (cmarks & 128) != 0;
    int pcol = int(cell.x), prow = int(cell.y), phalf = int(cell.z);
    bool ringCrop = ring && ctype == MEADOW && hash3u(pcol * 2 + phalf, prow, int(uSeed) + 41) % 10u < 6u;
    bool arable = ctype == FARMLAND || ringCrop;
    bool paddock = !arable && (ctype == MEADOW || ctype == SOUTH) && (ring || cworked);
    if (arable || paddock) {
      // PARCEL_CROPS = 0, 0, 1, 1, 1, 2, 3, 3, 3, 4 without a local array.
      int ck = int(hash3u(pcol * 2 + phalf, prow, int(uSeed) + 9) % 10u);
      int crop = ck < 2 ? 0 : ck < 5 ? 1 : ck == 5 ? 2 : ck < 9 ? 3 : 4;
      uint prnd = hash3u(pcol * 2 + phalf, prow, int(uSeed) + 23);
      bool vines = ctype == SOUTH;
      float nstrip = 2.0 + float(prnd % 3u);
      float strip = floor(cell.w * nstrip);
      float stripTone = 0.87 + 0.26 * float(hash3u(int(strip), pcol * 7 + prow, int(uSeed) + 31) % 100u) / 100.0;
      float rowPhase = lp.x * (paddock ? 1.05 : (vines ? 3.1 : 4.2));
      float rowAA = 1.0 - smoothstep(0.8, 3.0, fwidth(rowPhase));
      float rows = trampled ? 0.5 : 0.5 + 0.5 * sin(rowPhase) * rowAA;
      winterRows = (1.0 - rows) * 0.10;
      vec3 pc;
      if (vines) {
        vec3 vine = oliveGreen * (0.70 + 0.12 * float(prnd % 4u));
        vine = mix(vine, autumnVine, 0.35 * sHarvest);
        pc = mix(mix(scrub, ploughed, 0.25), vine, smoothstep(0.40, 0.75, rows) * 0.85 + 0.15 * (1.0 - rowAA));
      } else if (paddock) {
        int tone = int(min(prnd % 4u, 3u));
        pc = tone == 0 ? grassDark * 1.12 : (tone == 1 ? grassMid : fallow * 1.04);
        pc *= (0.95 + 0.05 * rows + 0.10 * nSmall) * mix(1.0, stripTone, 0.5);
        if (tone >= 2) {
          float swath = 0.5 + 0.5 * sin(lp.x * 1.4) * rowAA;
          pc = mix(grassLight * 1.05, mix(grassDry, stubble, 0.45), 0.50 + 0.15 * swath) * stripTone;
        }
        pc = mix(pc, springGrass * 0.85, 0.32 * sSpring);
        pc = mix(pc, grassDry, 0.3 * sHarvest);
      } else {
        vec3 ripe = mix(wheatA, wheatB, crop == 0 ? 0.18 : 0.85);
        vec3 summerC;
        if (crop <= 1) summerC = ripe * (0.90 + 0.18 * rows) * stripTone;
        else if (crop == 2) summerC = cropGreen * (0.74 + 0.24 * rows) * stripTone;
        else if (crop == 3) summerC = ploughed * (0.73 + 0.32 * rows) * stripTone;
        else summerC = fallow * (0.86 + 0.15 * nSmall) * stripTone;
        if (worked && crop <= 1) summerC = mix(cropGreen * (0.72 + 0.20 * float(crop)), summerC, smoothstep(0.0, 0.8, uCropProgress));
        float shoots = crop == 3 ? 0.0 : (crop == 2 ? 0.75 : 0.45);
        vec3 springC = crop == 4 ? summerC : mix(ploughed * (0.70 + 0.30 * rows) * stripTone, cropGreen * 1.12, smoothstep(0.45, 0.85, rows) * shoots + 0.10 * shoots * (1.0 - rowAA));
        vec3 harvestC = crop <= 1 && uSeasonProgress > 0.6 ? stubble * (0.82 + 0.20 * rows) * stripTone : summerC;
        vec3 winterC = mix(ploughed * 0.9, summerC, 0.25);
        pc = springC * sSpring + summerC * uSeason.y + harvestC * sHarvest + winterC * sWinter;
        if (worked) {
          if (landCrop == 1) pc = mix(cropGreen * 0.72, fallow, float(crop) * 0.16) * (0.88 + 0.20 * rows);
          if (landCrop == 2) pc = mix(fallow, grassDry, float(crop) * 0.20) * (0.90 + 0.17 * nSmall);
        }
      }
      pc = mix(pc, grassDry, uDrought * (paddock ? 0.70 : 0.40));
      if (trampled) pc = mix(pc, ploughed, 0.60);
      fieldMask = smoothstep(0.08, 0.92, wOpen) * smoothstep(1.0, 1.6, wp.y) * (1.0 - smoothstep(0.70, 0.90, clearing)) * ex;
      // Each parcel fades into the turf at its border, at least two pixels wide, so neighbouring parcels never meet in a
      // hard aliased step.
      float vw = max(1.05, 2.0 * fwidth(pedge));
      col = mix(col, pc, fieldMask * smoothstep(0.0, vw, pedge));
      // Verges darken parcel borders, and worked fields get hedge lines with gates.
      float verge = (1.0 - smoothstep(0.35 * vw, vw, pedge)) * fieldMask;
      col = mix(col, col * vec3(0.78, 0.84, 0.80), verge * 0.55);
      if (worked) {
        float gate = smoothstep(1.35, 1.9, abs((fract(lp.y / 15.0) - 0.5) * 15.0));
        float m = (1.0 - smoothstep(0.45, 1.25, pedge)) * gate * fieldMask;
        col = mix(col, hedge * (0.75 + 0.35 * nSmall), m);
      }
    }
  }

  // Roads from the hex road bits, with a wobble so lanes look trodden rather than drawn.
  {
    ivec2 hr = hexRound(p);
    int bits = int(hexInfo(hr).g * 255.0 + 0.5);
    if (bits > 0 && ex > 0.0) {
      vec2 wob = (vec2(nz(p, 40.0), nz(p + 70.0, 40.0)) - 0.5) * 6.0 * mix(1.0, 0.33, nearDetail);
      float rd = roadDist(p + wob, hr, bits) + grain * nearDetail * 0.48;
      float w = 1.5 + 0.4 * nSmall;
      col = mix(col, roadEdge, mix(1.0 - smoothstep(w, w + 0.6, rd), 1.0 - smoothstep(w, w + 0.1, rd), nearDetail) * ex);
      laneFill = mix(1.0 - smoothstep(w - 0.6, w - 0.1, rd), 1.0 - smoothstep(w - 0.3, w - 0.2, rd), nearDetail) * ex;
      float ruts = exp(-pow((rd - 0.72) / 0.15, 2.0)) * nearDetail * 0.25;
      col = mix(col, roadCol * (0.92 + 0.12 * nFine) * (1.0 - ruts), laneFill);
    }
  }

  // Cosmetic tracks between villages, shores, grazing and shrines (spec 10.6), worn into the turf: only the lane's core
  // (its faint shoulders read as smoky scribbles), stopping at field verges, with a darker rut down the middle.
  if (uLandUseOn > 0.5 && wild > 0.0) {
    float tv = texture2D(uTracks, huv).r;
    float track = smoothstep(0.35, 0.8, tv) * wild * smoothstep(0.2, 1.0, wp.y) * (1.0 - fieldMask) * ex;
    vec3 trackC = mix(roadEdge, roadCol, 0.35) * (0.94 + 0.08 * nSmall);
    trackC = mix(trackC, mix(roadEdge, ploughed, 0.5) * 0.9, smoothstep(0.88, 1.0, tv) * 0.6);
    col = mix(col, trackC, track * 0.8);
    laneFill = max(laneFill, track);
  }

  // Owned hexes: the ground darkens under the hedges and walls, and far away (past the hedge meshes) a painted band
  // keeps the boundary readable (spec 10.4 step 6).
  if (worked && wp.y > 1.2 && ex > 0.5) {
    vec2 axis = ap.x > dot(ap, vec2(0.5, 0.866)) ? vec2(sign(local.x), 0.0) : vec2(sign(local.x) * 0.5, sign(local.y) * 0.866);
    float along = dot(local, vec2(-axis.y, axis.x));
    float gateGap = smoothstep(2.4, 3.0, abs(along));
    int edgeIndex = (int(floor(-atan(axis.y, axis.x) / 1.04719755 + 0.5)) + 6) % 6;
    bool laneEdge = ((int(pinfo.g * 255.0 + 0.5) >> edgeIndex) & 1) != 0;
    float boundary = abs(hexEdge - (laneEdge ? 3.3 : 0.0));
    float shadeB = (1.0 - smoothstep(0.8, 2.6, boundary)) * gateGap;
    float bandB = (1.0 - smoothstep(0.45, 1.25, boundary)) * gateGap * smoothstep(230.0, 300.0, camd);
    uint hh = hash3u(hs.x, hs.y, int(uSeed) + 51);
    vec3 stitch = hh % 4u == 0u ? mix(rockDark, rockCol, nSmall) : hedge * (0.74 + 0.32 * nSmall);
    col *= 1.0 - shadeB * 0.16;
    col = mix(col, stitch, bandB);
  }

  // Rock on steep faces, with bedding and joints so cliffs read as stone, not stretched grass.
  float slope = 1.0 - up;
  float rockmask = smoothstep(0.26, 0.47, slope + (nMid - 0.5) * 0.20 + (nSmall - 0.5) * 0.16);
  rockmask = max(rockmask, wCrag * smoothstep(0.12, 0.3, slope));
  if (rockmask > 0.001) {
    vec2 faceUv = vec2(p.x + p.y * 0.61, wp.y);
    float weather = nz(faceUv + vec2(19.0, 71.0), 105.0);
    float bed = (wp.y + (nz(p + 113.0, 120.0) - 0.5) * 22.0 + (weather - 0.5) * 8.0 + p.x * 0.10 + p.y * 0.06) / 13.5;
    float bedding = (1.0 - smoothstep(0.025, 0.085, abs(fract(bed) - 0.5))) * smoothstep(0.36, 0.63, weather);
    float joints = abs(fract((faceUv.x + (weather - 0.5) * 18.0) / 11.5) - 0.5);
    float joint = (1.0 - smoothstep(0.015, 0.060, joints)) * smoothstep(0.30, 0.52, nSmall);
    vec3 stone = mix(rockDark * vec3(1.10, 0.97, 0.84), rockCol * vec3(1.18, 1.01, 0.80), 0.35 + 0.45 * weather);
    stone = mix(stone, mix(rockDark * vec3(0.79, 0.87, 1.16), rockCol * vec3(0.73, 0.79, 0.95), 0.35 + 0.30 * weather), uWild * smoothstep(35.0, 90.0, wp.y));
    stone *= 1.0 - max(joint * 0.36, bedding * 0.32);
    stone *= 1.0 - (1.0 - smoothstep(0.4, 1.8, wp.y)) * 0.40;
    float shoulder = smoothstep(0.67, 0.91, nrm.y + (weather - 0.5) * 0.30);
    col = mix(col, stone, rockmask);
    col = mix(col, grassBase * (0.70 + 0.20 * nSmall), shoulder * smoothstep(0.25, 0.55, nMid) * rockmask * 0.62);
  }

  // Land-state marks.
  if (burned) {
    float blot = smoothstep(0.35, 0.6, nz(p * 0.08 * 14.0, 14.0));
    col = mix(col, C(0.11, 0.09, 0.08), 0.52 * blot);
  }

  // Beach and seabed.
  float beach = (1.0 - smoothstep(0.25, 0.85, wp.y + (nSmall - 0.5) * 0.18 + grain * nearDetail * 0.12)) * (1.0 - smoothstep(0.9, 1.05, wp.y));
  float shorePatch = smoothstep(0.38, 0.62, nz(p, 43.0));
  beach *= mix(mix(0.08, 0.65, shorePatch) * (1.0 - rockmask * 0.95), 1.0, wBeach);
  vec3 shoreSand = mix(sand * vec3(0.65, 0.70, 0.72), sand, smoothstep(0.0, 1.1, wp.y));
  col = mix(col, shoreSand * (0.92 + 0.13 * nFine), beach * (1.0 - rockmask * 0.7));
  col = mix(col, seabed, smoothstep(-0.5, -6.0, wp.y));

  // Near-camera mottling so the ground has grain up close.
  col *= 1.0 + ((nz(p + 23.0, 3.5) - 0.5) * 0.20 + (nFine - 0.5) * 0.09) * nearDetail * (1.0 - rockmask);

  // Snow: lies on flat ground, thins on lanes, blue in hollows.
  float snowCover = 0.0;
  if (uSnow > 0.0) {
    float front = nBig * 0.55 + nMid * 0.30 + nSmall * 0.15;
    float cover = smoothstep(front, front + 0.18, uSnow * 1.02) * smoothstep(0.0, 0.12, uSnow);
    cover = mix(cover, 1.0, smoothstep(0.9, 1.0, uSnow));
    // Lies on everything but steep faces: thinning on gentle slopes left green holes the shape of the hex terraces.
    float retention = smoothstep(0.55, 0.85, up) * smoothstep(0.08, 0.36, wp.y);
    snowCover = cover * retention;
    float hollow = (1.0 - smoothstep(3.0, 24.0, wp.y)) * (0.25 + nBig * 0.35);
    vec3 snowTone = mix(snowCol * vec3(1.0, 0.99, 0.97), snowCol * vec3(0.70, 0.79, 0.95), hollow) * (0.91 + 0.09 * nMid);
    snowTone = mix(snowTone, snowTone * vec3(0.88, 0.86, 0.82), laneFill);
    snowTone *= 1.0 - winterRows * 0.25;
    col = mix(col * mix(vec3(1.0), vec3(0.88, 0.89, 0.94), uSnow), snowTone, snowCover);
  }

  col *= 0.93 + 0.14 * nFine;
  col *= mix(1.0, 0.74, uWetness * smoothstep(0.4, 1.2, wp.y));
  col *= 1.0 - wetMark * 0.08;

  // Planning overlay: inked hex lines, owner rings and the three hexes a corner would draw from.
  // It is a tool, so it stays readable at any hour: toward night the ink turns pale and the lines and owner rings take
  // a little light of their own, where lit only by the scene they sank into the dark ground.
  vec3 emit = vec3(0.0);
#ifdef OVERLAY
  if (uOverlay > 0.0 && wp.y > 0.2) {
    float lineW = 0.35 + 0.15 * nSmall;
    float line = (1.0 - smoothstep(lineW, lineW + 0.35, hexEdge)) * uOverlay;
    vec3 nightInk = C(0.78, 0.74, 0.62);
    col = mix(col, mix(ink, nightInk, uNight), line * 0.75);
    emit += nightInk * line * uNight * 0.18;
    int owner = int(land.b * 255.0 + 0.5);
    if (owner > 0) {
      // A select chain: ANGLE on Metal makes dynamically indexed uniform arrays very slow.
      vec3 hc = owner == 1 ? uHouseColors[0] : owner == 2 ? uHouseColors[1] : owner == 3 ? uHouseColors[2] : owner == 4 ? uHouseColors[3]
        : owner == 5 ? uHouseColors[4] : owner == 6 ? uHouseColors[5] : owner == 7 ? uHouseColors[6] : uHouseColors[7];
      float ring = (1.0 - smoothstep(0.95, 1.2 + 1.2, hexEdge)) * uOverlay;
      col = mix(col, hc, ring * 0.6);
      // A wash over the whole field, stronger on snow, where the rim alone vanished into white
      col = mix(col, hc, mix(0.12, 0.3, snowCover) * uOverlay);
      emit += hc * (ring * 0.45 + 0.05 * uOverlay) * uNight;
    }
    bool sel = (hs.x == int(uSelected.x) && hs.y == int(uSelected.y)) || (hs.x == int(uSelected.z) && hs.y == int(uSelected.w)) || (hs.x == int(uSelected3.x) && hs.y == int(uSelected3.y));
    if (sel) {
      vec3 gc = uSelectedOk > 0.5 ? glowGold : glowBad;
      float rim = 1.0 - smoothstep(0.0, 3.5, hexEdge);
      emit += gc * (rim * 2.2 + 0.18) * uOverlay;
      col = mix(col, gc, (rim * 0.6 + 0.18) * uOverlay);
    }
  }
#endif

  vec3 n2 = normalize(mix(nrm, vec3(0.0, 1.0, 0.0), snowCover * 0.5));
  float sh;
  // A low sun grazes flat ground at a fifth of its strength: wrap the key further round so golden hour stays luminous.
  float wrap = mix(0.45, 0.25, smoothstep(0.2, 0.45, uSunDir.y));
  vec3 lit = shade(col, n2, wp, 1.0, wrap, sh) + emit;
  // Snow in shade takes half again as much lilac sky (A6) instead of going charcoal.
  lit += col * ambientLight(n2) * vec3(0.45, 0.4, 0.8) * snowCover;

  // Fog of war (F2): unknown land is the real relief, dimmed, greyed and cooled toward the haze under a thin inked edge,
  // lit by the scene like everything else so it falls dark at night. Fog compiles only into the variants that need it
  // (terrain.ts): the full shader crosses a register limit on Apple GPUs and runs a third slower even when it is off.
#ifdef FOG
  if (uFogOn > 0.5) {
    // Relief under the sky fill and a softened sun, without cast or cloud shadows, so it reads calm and map-like.
    vec3 relief = col * (ambientLight(nrm) * 1.2 + uSunColor * max(dot(nrm, uSunDir), 0.0) * 0.6);
    float l = dot(relief, vec3(0.2126, 0.7152, 0.0722));
    vec3 veil = mix(vec3(l), relief, 0.5) * 0.62;
    veil = mix(veil, uFogColor * (l * 0.62 + 0.02) / max(dot(uFogColor, vec3(0.2126, 0.7152, 0.0722)), 1e-3), 0.25);
    // The edge: a hair of ink at least a pixel and a half wide, and a soft shade just outside it.
    float ink = 1.0 - smoothstep(0.0, max(1.2, 1.5 * fwidth(ed)), abs(ed));
    veil *= 1.0 - 0.25 * (1.0 - smoothstep(-14.0, 0.0, ed));
    lit = mix(veil, lit, ex);
    lit = mix(lit, lit * mapInk * 1.4, ink * 0.5);
  }
#endif

  lit = atmosphere(lit, wp);
  gl_FragColor = vec4(lit, viewDepth01(wp));
}
`;function Nt(t,n=512){let r=new Uint8Array(n*n),i=(e,t)=>{let n=new Float32Array(e*e),r=t>>>0;for(let e=0;e<n.length;e++)r=Math.imul(r^r>>>15,2246822519)+2654435769>>>0,n[e]=(r>>>8)/16777216;return n},a=new Float32Array(n*n),o=.5;for(let e=0;e<5;e++){let t=8<<e,r=i(t,1013+e*7919),s=n/t;for(let e=0;e<n;e++){let i=e/s,c=Math.floor(i),l=i-c,u=l*l*(3-2*l),d=c%t,f=(c+1)%t;for(let i=0;i<n;i++){let c=i/s,l=Math.floor(c),p=c-l,m=p*p*(3-2*p),h=l%t,g=(l+1)%t,_=r[d*t+h],v=r[d*t+g],y=r[f*t+h],b=r[f*t+g];a[e*n+i]+=o*(_+(v-_)*m+(y-_+(_-v+b-y)*m)*u)}}o*=.5}let s=1/0,c=-1/0;for(let e of a)e<s&&(s=e),e>c&&(c=e);for(let e=0;e<a.length;e++)r[e]=Math.round((a[e]-s)/(c-s)*255);let u=new x(r,n,n,e.TEXTUREFORMAT_R,t,!0,!1,l.TRILINEAR_SAMPLINGMODE);return u.wrapU=l.WRAP_ADDRESSMODE,u.wrapV=l.WRAP_ADDRESSMODE,u}var Pt=Math.PI*2,Ft=[`#b3262e`,`#2f4fa8`,`#6d3fa0`,`#26262b`,`#1d7f8f`,`#b5531c`,`#c7497e`,`#d9cfb8`],It=[`#b3262e`,`#2f4fa8`,`#6d3fa0`,`#efe9dc`,`#1d7f8f`,`#b5531c`,`#c7497e`,`#d9cfb8`],Lt=[`wheat_sheaf`,`ram`,`oak`,`sun_and_ship`,`heron`,`boar`,`lantern`,`neutral`];function Rt(e){let t=parseInt(e.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function zt(e){return[e[0]**2.2,e[1]**2.2,e[2]**2.2]}function Bt(e){return e>=0&&e<7?Math.floor(e):7}function Vt(e){let t=new Float32Array(24);return e.forEach((e,n)=>t.set(zt(Rt(e)),n*3)),t}var Ht=Vt(Ft),Ut=Vt(It);function Wt(e){e.setArray3(`uHouse`,Ht),e.setArray3(`uHouse2`,Ut)}var Gt=`
uniform vec3 uHouse[8];
uniform vec3 uHouse2[8];
vec3 houseColour(float h) { return uHouse[int(h + 0.5)]; }
vec3 houseColour2(float h) { return uHouse2[int(h + 0.5)]; }
`;function Kt(e,t,n){return e<t?t:e>n?n:e}function qt(e,t,n){let r=Kt((n-e)/(t-e),0,1);return r*r*(3-2*r)}function Jt(e,t){let n=(t-e)%Pt;return n>Math.PI&&(n-=Pt),n<-Math.PI&&(n+=Pt),n}function Yt(e,t,n){return e+Jt(e,t)*n}function Xt(e,t){return 1-Math.exp(-e*t)}function Zt(...e){let t=2166136261;for(let n of e)t=Math.imul(t^(Math.round(n*1e3)|0),16777619),t^=t>>>13;return(t>>>0)/4294967296}function Qt(t,n){n.disableDepthWrite=!0,n.alphaMode=e.ALPHA_COMBINE;let r=t.getScene().getEngine();n.onBindObservable.add(()=>{r.alphaState.setAlphaBlendFunctionParameters(1,e.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA,0,1)}),t.onAfterRenderObservable.add(()=>r.alphaState.setAlphaMode(e.ALPHA_COMBINE,0))}var $t=class{attrs;mesh;data={};indices=new Uint32Array;nv=0;ni=0;vcap=0;icap=0;uploaded={v:-1,i:-1};min=new n;max=new n;constructor(e,t,n,r){this.attrs=n,this.mesh=new v(t,e),this.mesh.material=r,this.mesh.isPickable=!1,this.mesh.doNotSyncBoundingInfo=!0,this.mesh.setEnabled(!1);for(let e of n)this.data[e.name]=new Float32Array}begin(){this.nv=0,this.ni=0,this.min.setAll(1/0),this.max.setAll(-1/0)}reserve(e,t){if(this.nv+e>this.vcap){let t=Math.max(this.nv+e,this.vcap*2,256);for(let e of this.attrs){let n=new Float32Array(t*e.stride);n.set(this.data[e.name].subarray(0,this.nv*e.stride)),this.data[e.name]=n}this.vcap=t,this.uploaded.v=-1}if(this.ni+t>this.icap){let e=Math.max(this.ni+t,this.icap*2,384),n=new Uint32Array(e);n.set(this.indices.subarray(0,this.ni)),this.indices=n,this.icap=e,this.uploaded.i=-1}return this.nv}bound(e,t,n){e<this.min.x&&(this.min.x=e),t<this.min.y&&(this.min.y=t),n<this.min.z&&(this.min.z=n),e>this.max.x&&(this.max.x=e),t>this.max.y&&(this.max.y=t),n>this.max.z&&(this.max.z=n)}tri(e,t,n){let r=this.indices;r[this.ni++]=e,r[this.ni++]=t,r[this.ni++]=n}commit(e=2){let t=this.mesh;if(this.ni===0){t.setEnabled(!1);return}if(this.uploaded.v!==this.vcap){for(let e of this.attrs)t.setVerticesData(e.name,this.data[e.name],!0,e.stride);this.uploaded.v=this.vcap}else for(let e of this.attrs)t.updateVerticesData(e.name,this.data[e.name]);this.uploaded.i===this.icap?t.updateIndices(this.indices):(t.setIndices(this.indices,this.vcap,!0),this.uploaded.i=this.icap);let r=t.subMeshes[0];r.indexStart=0,r.indexCount=this.ni,r.verticesStart=0,r.verticesCount=this.vcap;let i=new y(new n(this.min.x-e,this.min.y-e,this.min.z-e),new n(this.max.x+e,this.max.y+e,this.max.z+e));t.setBoundingInfo(i),r.setBoundingInfo(i),t.setEnabled(!0)}},en=class{names;pad;mesh;count=0;m=new Float32Array;a;cap=0;lo=new n;hi=new n;constructor(e,t,n,r,i,a=2){this.names=i,this.pad=a,this.mesh=new v(t,e),n.applyToMesh(this.mesh),this.mesh.material=r,this.mesh.isPickable=!1,this.mesh.doNotSyncBoundingInfo=!0,this.a=i.map(()=>new Float32Array),this.grow(16),this.mesh.thinInstanceCount=0,this.mesh.setEnabled(!1)}grow(e){let t=Math.max(e,this.cap*2,16),n=new Float32Array(t*16);n.set(this.m.subarray(0,this.count*16)),this.m=n;for(let e=0;e<this.a.length;e++){let n=new Float32Array(t*4);n.set(this.a[e].subarray(0,this.count*4)),this.a[e]=n}this.cap=t,this.mesh.thinInstanceSetBuffer(`matrix`,this.m,16,!1),this.names.forEach((e,t)=>this.mesh.thinInstanceSetBuffer(e,this.a[t],4,!1))}begin(){this.count=0,this.lo.setAll(1/0),this.hi.setAll(-1/0)}add(e,t,n){this.count>=this.cap&&this.grow(this.count+1);let r=this.count++,i=this.m,a=r*16;return i[a+3]=0,i[a+7]=0,i[a+11]=0,i[a+12]=e,i[a+13]=t,i[a+14]=n,i[a+15]=1,e<this.lo.x&&(this.lo.x=e),t<this.lo.y&&(this.lo.y=t),n<this.lo.z&&(this.lo.z=n),e>this.hi.x&&(this.hi.x=e),t>this.hi.y&&(this.hi.y=t),n>this.hi.z&&(this.hi.z=n),r}yaw(e,t,n,r=n,i=n){let a=Math.cos(t),o=Math.sin(t),s=this.m,c=e*16;s[c]=a*n,s[c+1]=0,s[c+2]=-o*n,s[c+4]=0,s[c+5]=r,s[c+6]=0,s[c+8]=o*i,s[c+9]=0,s[c+10]=a*i}basis(e,t,n,r,i,a,o,s,c,l){let u=this.m,d=e*16;u[d]=t,u[d+1]=n,u[d+2]=r,u[d+4]=i,u[d+5]=a,u[d+6]=o,u[d+8]=s,u[d+9]=c,u[d+10]=l}set(e,t,n,r=0,i=0,a=0){let o=this.a[e],s=t*4;o[s]=n,o[s+1]=r,o[s+2]=i,o[s+3]=a}commit(){let e=this.mesh;e.thinInstanceCount=this.count,e.thinInstanceBufferUpdated(`matrix`);for(let t of this.names)e.thinInstanceBufferUpdated(t);if(this.count===0){e.setEnabled(!1);return}let t=this.pad;e.setBoundingInfo(new y(new n(this.lo.x-t,this.lo.y-t,this.lo.z-t),new n(this.hi.x+t,this.hi.y+t,this.hi.z+t))),e.setEnabled(!0)}};U(`terrain`,kt,Mt),U(`terrainDepth`,kt,At),U(`terrainShadow`,kt,jt);var tn=[480,1150,2500],nn=8,rn=class{scene;shadows;source;camera;variants=new Map;active=``;lighting;depthMaterial;shadowMaterial;hexData=new Uint8Array(1048576);landState=new Uint8Array(1048576);fog=new Uint8Array(1048576);hexTex;landTex;fogTex;bedDepth;noise;habA=null;habB=null;habC=null;tracks=null;uniforms={seed:7,fogOn:0,overlay:0,wild:1,seasonProgress:.5,snow:0,drought:0,wetness:0,cropProgress:1,selected:[999,999,999,999],selected3:[999,999],selectedOk:1,houseColors:new Float32Array(Ht)};chunks=new Map;inFlight=0;dirty={hex:!1,land:!1,fog:!1};lastFocus={x:1e9,z:1e9};constructor(t,n,r,i,a){this.scene=t,this.shadows=r,this.source=i,this.camera=a;let o=e=>{let n=x.CreateRGBATexture(e,512,512,t,!1,!1,l.NEAREST_SAMPLINGMODE);return n.wrapU=l.CLAMP_ADDRESSMODE,n.wrapV=l.CLAMP_ADDRESSMODE,n};for(let e=0;e<262144;e++)this.landState[e*4+3]=179;this.hexTex=o(this.hexData),this.landTex=o(this.landState),this.fogTex=o(this.fog);let s=Nt(t);this.noise=s,this.lighting=n,this.variant(``),this.depthMaterial=n.material(`terrainDepthMat`,`terrainDepth`,{attributes:[`position`,`normal`],uniforms:[`uCamPos`],lit:!1}),this.depthMaterial.onBindObservable.add(()=>{let e=this.depthMaterial.getEffect();e&&e.setVector3(`uCamPos`,this.camera.globalPosition)}),this.shadowMaterial=n.material(`terrainShadowMat`,`terrainShadow`,{attributes:[`position`,`normal`],lit:!1}),this.bedDepth=new h(`bedDepth`,{ratio:.5},t,{type:e.TEXTURETYPE_HALF_FLOAT,generateMipMaps:!1,generateDepthBuffer:!0}),this.bedDepth.activeCamera=a,this.bedDepth.clearColor=new g(1,1,1,1),this.bedDepth.renderList=[],this.bedDepth.renderParticles=!1,t.customRenderTargets.push(this.bedDepth)}get material(){return this.variant(this.active)}variant(e){let t=this.variants.get(e);if(t)return t;let n=[...e.includes(`F`)?[`FOG`]:[],...e.includes(`O`)?[`OVERLAY`]:[]];t=this.lighting.material(`terrainMat${e}`,`terrain`,{attributes:[`position`,`normal`],defines:n,uniforms:[`uSeed`,`uFogOn`,`uOverlay`,`uSelected`,`uSelected3`,`uSelectedOk`,`uWild`,`uSeasonProgress`,`uSnow`,`uDrought`,`uWetness`,`uCropProgress`,`uHouseColors`,`uLandUseOn`],samplers:[`uHexData`,`uLandState`,`uFog`,`uNoise`,`uHabA`,`uHabB`,`uHabC`,`uTracks`]});let r=t;return r.onBindObservable.add(()=>{let e=r.getEffect();if(!e)return;let t=this.uniforms,n=this.noise;e.setTexture(`uHexData`,this.hexTex),e.setTexture(`uLandState`,this.landTex),e.setTexture(`uFog`,this.fogTex),e.setTexture(`uNoise`,n),e.setTexture(`uHabA`,this.habA??n),e.setTexture(`uHabB`,this.habB??n),e.setTexture(`uHabC`,this.habC??n),e.setTexture(`uTracks`,this.tracks??n),e.setFloat(`uLandUseOn`,+!!this.habA),e.setFloat(`uSeed`,t.seed),e.setFloat(`uFogOn`,t.fogOn),e.setFloat(`uOverlay`,t.overlay),e.setFloat4(`uSelected`,t.selected[0],t.selected[1],t.selected[2],t.selected[3]),e.setFloat2(`uSelected3`,t.selected3[0],t.selected3[1]),e.setFloat(`uSelectedOk`,t.selectedOk),e.setFloat(`uWild`,t.wild),e.setFloat(`uSeasonProgress`,t.seasonProgress),e.setFloat(`uSnow`,t.snow),e.setFloat(`uDrought`,t.drought),e.setFloat(`uWetness`,t.wetness),e.setFloat(`uCropProgress`,t.cropProgress),e.setArray3(`uHouseColors`,t.houseColors)}),this.variants.set(e,r),r}pickVariant(){let e=(this.uniforms.fogOn>.5?`F`:``)+(this.uniforms.overlay>.001?`O`:``);if(e===this.active)return;let t=this.variant(e),n=[...this.chunks.values()].find(e=>e.mesh)?.mesh;if(!n||t.isReady(n)){this.active=e;for(let e of this.chunks.values())e.mesh&&(e.mesh.material=t)}}warm(e){if(!(this.variants.size>=4))for(let t of[`F`,`O`,`FO`])this.variant(t).forceCompilation(e)}setLandUse(t,n,r,i){let a=(e,t,n)=>{let r=new x(e,t,t,n,this.scene,!1,!1,l.BILINEAR_SAMPLINGMODE);return r.wrapU=l.CLAMP_ADDRESSMODE,r.wrapV=l.CLAMP_ADDRESSMODE,r};this.habA?.dispose(),this.habB?.dispose(),this.habC?.dispose(),this.tracks?.dispose(),this.habA=a(t,1024,e.TEXTUREFORMAT_RGBA),this.habB=a(n,1024,e.TEXTUREFORMAT_RGBA),this.habC=a(r,1024,e.TEXTUREFORMAT_RGBA),this.tracks=a(i,4096,e.TEXTUREFORMAT_R)}markHexDirty(){this.dirty.hex=!0}markLandDirty(){this.dirty.land=!0}markFogDirty(){this.dirty.fog=!0}lodFor(e,t){let n=3;for(let r=0;r<tn.length;r++){let i=t===r?48:t===r+1?-48:0;if(e<tn[r]+i){n=r;break}}return n}update(e,t,n){this.pickVariant(),this.dirty.hex&&(this.hexTex.update(this.hexData),this.dirty.hex=!1),this.dirty.land&&(this.landTex.update(this.landState),this.dirty.land=!1),this.dirty.fog&&(this.fogTex.update(this.fog),this.dirty.fog=!1),Math.hypot(e-this.lastFocus.x,t-this.lastFocus.z)>24&&(this.lastFocus={x:e,z:t},this.refreshWanted(e,t,n)),this.schedule(e,t,n)}refreshWanted(e,t,n){let r=Math.max(2600,n*4),i=Math.ceil(r/256),a=Math.floor(e/256),o=Math.floor(t/256),s=new Set;for(let n=-i;n<=i;n++)for(let c=-i;c<=i;c++){let i=a+c,l=o+n;if(i<-17||i>16||l<-17||l>16||this.chunkDist(i,l,e,t)>r||!this.source.hasGround(i,l))continue;let u=`${i},${l}`;s.add(u),this.chunks.has(u)||this.chunks.set(u,{key:u,cx:i,cz:l,lod:-1,mesh:null,pending:-1})}for(let[e,t]of this.chunks)!s.has(e)&&t.pending<0&&(this.dispose(t),this.chunks.delete(e))}chunkDist(e,t,n,r){return Math.hypot(e*256+128-n,t*256+128-r)}schedule(e,t,n){if(this.inFlight>=nn)return;let r=+(n>650),i=[];for(let n of this.chunks.values()){if(n.pending>=0)continue;let a=this.chunkDist(n.cx,n.cz,e,t),o=Math.min(3,this.lodFor(a,n.lod)+r);o!==n.lod&&i.push({c:n,lod:o,urgency:a+(n.mesh?400:0)})}i.sort((e,t)=>e.urgency-t.urgency);for(let e of i){if(this.inFlight>=nn)break;this.request(e.c,e.lod)}}request(e,t){e.pending=t,this.inFlight++,this.source.build(e.cx,e.cz,t).then(t=>{this.inFlight--,e.pending=-1,this.chunks.has(e.key)&&this.apply(e,t)})}apply(e,t){let n=e.mesh??new v(`terrain_${e.key}`,this.scene),r=new S;r.positions=t.positions,r.normals=t.normals,r.indices=t.indices,r.applyToMesh(n,!1),n.material=this.material,n.isPickable=!1,this.warm(n),e.mesh||(n.freezeWorldMatrix(),this.bedDepth.renderList.push(n),this.bedDepth.setMaterialForRendering(n,this.depthMaterial)),this.shadows.removeCaster(n),t.lod<=1&&this.shadows.addCaster(n,this.shadowMaterial,(t.lod,2)),e.mesh=n,e.lod=t.lod}dispose(e){if(!e.mesh)return;this.shadows.removeCaster(e.mesh);let t=this.bedDepth.renderList,n=t.indexOf(e.mesh);n>=0&&t.splice(n,1),e.mesh.dispose(),e.mesh=null}get stats(){let e=0;for(let t of this.chunks.values())t.mesh&&e++;return{chunks:this.chunks.size,meshes:e,inFlight:this.inFlight}}},an=class{workers=[];next=0;pending=new Map;ids=1;ground=new Set;constructor(e,t=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-2))){let n=e.heightData();for(let e=0;e<t;e++){let e=new Worker(new URL(`/harvest-crown/bundle/terrainWorker-LmuE2vPw.js`,``+import.meta.url),{type:`module`});e.onmessage=e=>{let{id:t,chunk:n}=e.data,r=this.pending.get(t);this.pending.delete(t),r?.(n)},e.postMessage({type:`init`,data:n}),this.workers.push(e)}for(let t=-256;t<256;t++)for(let n=-256;n<256;n++){let r=(t+256)*512+(n+256);if(e.types[r]===0&&e.baseH[r]<=-14)continue;let i=I({q:n,r:t});for(let e of[-24,24])for(let t of[-24,24])this.ground.add(`${Math.floor((i.x+e)/256)},${Math.floor((i.y+t)/256)}`)}}hasGround(e,t){return this.ground.has(`${e},${t}`)}build(e,t,n){return new Promise(r=>{let i=this.ids++;this.pending.set(i,r),this.workers[this.next++%this.workers.length].postMessage({type:`build`,id:i,cx:e,cz:t,lod:n})})}dispose(){for(let e of this.workers)e.terminate()}},W={BROADLEAF:0,OVAL:1,BUSH:2,ORCHARD:3,PINE:4,BIRCH:5,WILLOW:6,CYPRESS:7,OLIVE:8,DEAD:9},G={X:0,Y:1,Z:2,YAW:3,SX:4,SY:5,SZ:6,KIND:7,LEANX:8,LEANZ:9,HUE:10,BRIGHT:11,SUS:12,RND:13,HEX:14,SIZE:15},on=class{positions=[];normals=[];colors=[];uvs=[];indices=[];get count(){return this.positions.length/3}v(e,t,n,r,i,a,o,s,c,l,u=0,d=0){return this.positions.push(e,t,n),this.normals.push(r,i,a),this.colors.push(o,s,c,l),this.uvs.push(u,d),this.count-1}tri(e,t,n){this.indices.push(e,t,n)}append(e){let t=this.count;this.positions.push(...e.positions),this.normals.push(...e.normals),this.colors.push(...e.colors),this.uvs.push(...e.uvs);for(let n of e.indices)this.indices.push(n+t)}arrays(){return{positions:new Float32Array(this.positions),normals:new Float32Array(this.normals),colors:new Float32Array(this.colors),uvs:new Float32Array(this.uvs),indices:this.count>65535?new Uint32Array(this.indices):new Uint16Array(this.indices)}}};function K(e,t,n){let r=Math.hypot(e,t,n)||1;return[e/r,t/r,n/r]}var sn=null;function cn(e=4){if(sn&&sn.levels.length>e)return sn;let t=(1+Math.sqrt(5))/2,n=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(e=>K(e[0],e[1],e[2])),r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],i=[r];for(let t=0;t<e;t++){let e=new Map,t=[],a=(t,r)=>{let i=Math.min(t,r)*65536+Math.max(t,r),a=e.get(i);if(a===void 0){let o=n[t],s=n[r];n.push(K(o[0]+s[0],o[1]+s[1],o[2]+s[2])),a=n.length-1,e.set(i,a)}return a};for(let e=0;e<r.length;e+=3){let n=r[e],i=r[e+1],o=r[e+2],s=a(n,i),c=a(i,o),l=a(o,n);t.push(n,s,l,i,c,s,o,l,c,s,c,l)}r=t,i.push(r)}return sn={verts:n,levels:i},sn}function ln(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{next:n,range:(e,t)=>e+(t-e)*n(),normal:()=>Math.sqrt(-2*Math.log(Math.max(1e-7,n())))*Math.cos(6.2831853*n())}}function un(e,t,n){let r=Math.imul(e|0,374761393)^Math.imul(t|0,668265263)^Math.imul(n|0,1274126177);return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967295}function dn(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n),o=e-r,s=t-i,c=n-a,l=o*o*(3-2*o),u=s*s*(3-2*s),d=c*c*(3-2*c),f=(e,t,n)=>e+(t-e)*n;return f(f(f(un(r,i,a),un(r+1,i,a),l),f(un(r,i+1,a),un(r+1,i+1,a),l),u),f(f(un(r,i,a+1),un(r+1,i,a+1),l),f(un(r,i+1,a+1),un(r+1,i+1,a+1),l),u),d)}function fn(e){let t=ln(7919*(e+1)),n=[],r=0,i=0,a=[.38,.52],o=.17,s=[0,0,0],c=!1,l=!1,u=1,d=1;switch(e){case W.BROADLEAF:r=3.8,i=.28,n.push([0,4.7,0,2.4]);for(let e=0;e<5;e++){let r=Math.PI*2*(e+t.range(-.2,.2))/5,i=t.range(1.9,2.3);n.push([Math.cos(r)*i,t.range(3.6,4.8),Math.sin(r)*i,t.range(1.6,2)])}n.push([t.range(-.4,.4),6.4,t.range(-.4,.4),1.8]);break;case W.OVAL:{r=3.6,i=.22;let e=[2.9,4.4,5.9,7.3,8.5],a=[1.5,1.9,1.85,1.55,1.1];e.forEach((e,r)=>n.push([t.range(-.35,.35),e,t.range(-.35,.35),a[r]])),n.push([1,5.1,-.6,1.3]);break}case W.BUSH:n.push([0,.75,0,.95]);for(let e=0;e<3;e++){let r=Math.PI*2*(e+t.range(-.2,.2))/3;n.push([Math.cos(r)*.8,t.range(.5,.7),Math.sin(r)*.8,t.range(.65,.8)])}a=[.45,.6],o=.12;break;case W.ORCHARD:r=2.4,i=.21,s=[.25,0,.1],n.push([.1,2.75,0,1.45]);for(let e=0;e<4;e++){let r=Math.PI*2*(e+t.range(-.15,.15))/4+.4,i=t.range(1.45,1.7);n.push([Math.cos(r)*i,t.range(2.35,2.8),Math.sin(r)*i,t.range(1.1,1.35)])}n.push([.25,3.45,-.1,1.15]),a=[.4,.54],o=.15;break;case W.BIRCH:{r=5.4,i=.15,s=[.2,0,-.1];let e=[4.4,5.6,6.8,7.9,8.8],c=[1.15,1.3,1.2,.95,.66];e.forEach((e,r)=>n.push([t.range(-.7,.7)+.06*r,e,t.range(-.7,.7),c[r]])),n.push([1.35,5,.45,.85],[-1.2,6.2,-.6,.8],[.3,6,1.3,.75]),a=[.42,.58],o=.13;break}case W.OLIVE:r=1.9,i=.3,s=[.45,0,.2],n.push([.35,3.3,.1,1.25]);for(let e=0;e<7;e++){let r=Math.PI*2*(e+t.range(-.2,.2))/7+.3,i=t.range(1.25,1.75);n.push([Math.cos(r)*i+.3,t.range(2.85,3.35),Math.sin(r)*i,t.range(.85,1.1)])}n.push([.6,3.85,-.3,.95],[-.2,3.7,.5,.85]),a=[.44,.62],o=.1,c=!0,u=.8;break;case W.DEAD:r=3.3,i=.32,s=[.25,0,.15],n.push([.2,4.7,.1,1.4]);for(let e=0;e<4;e++){let r=Math.PI*2*(e+t.range(-.25,.25))/4+.5,i=t.range(1.5,2.1);n.push([Math.cos(r)*i,t.range(3.6,4.9),Math.sin(r)*i,t.range(1.1,1.4)])}n.push([-.3,5.9,.25,1]),c=!0,l=!0,d=1.6}let f=0,p=0,m=0;for(let e of n)f+=e[0],p+=e[1],m+=e[2];f/=n.length,p/=n.length,m/=n.length;let h=[],g=[];for(let e of n){h.push([e[0],e[1],e[2]]),g.push(e[3]*.9);let n=e[0]-f,r=(e[1]-p)*.6,i=e[2]-m,o=Math.hypot(n,r,i);o>.2?(n/=o,r/=o,i/=o):n=r=i=0;let s=Math.min(9,Math.max(4,Math.floor(e[3]*4.5)));for(let o=0;o<s;o++){let o=K(t.normal(),t.normal(),t.normal());o=K(o[0]+n*.7,o[1]+r*.7+.35,o[2]+i*.7);let s=e[3]*t.range(.58,.76);h.push([e[0]+o[0]*s,e[1]+o[1]*s,e[2]+o[2]*s]),g.push(e[3]*t.range(a[0],a[1]))}}let _=[1/0,1/0,1/0],v=[-1/0,-1/0,-1/0];h.forEach((e,t)=>{for(let n=0;n<3;n++)_[n]=Math.min(_[n],e[n]-g[t]),v[n]=Math.max(v[n],e[n]+g[t])});let y=[(v[0]-_[0])/2,(v[1]-_[1])/2,(v[2]-_[2])/2],b=Math.max(...y);return{centres:h,radii:g,mains:n.map(e=>[e[0],e[1],e[2]]),mainR:n.map(e=>e[3]),origin:[(_[0]+v[0])/2,(_[1]+v[1])/2,(_[2]+v[2])/2],stretch:[y[0]/b,y[1]/b,y[2]/b],bottom:_[1],top:v[1],size:b,smooth:o,trunkH:r,trunkR:i,lean:s,gnarled:c,noCanopy:l,squash:u,twigScale:d}}function pn(e,t,n){let r=Array.from({length:n},()=>[0,0,0]);for(let n=0;n<t.length;n+=3){let i=e[t[n]],a=e[t[n+1]],o=e[t[n+2]],s=a[0]-i[0],c=a[1]-i[1],l=a[2]-i[2],u=o[0]-i[0],d=o[1]-i[1],f=o[2]-i[2],p=c*f-l*d,m=l*u-s*f,h=s*d-c*u;for(let e of[t[n],t[n+1],t[n+2]])r[e][0]+=p,r[e][1]+=m,r[e][2]+=h}return r.map(e=>K(e[0],e[1],e[2]))}function mn(e,t,n,r,i,a=0){let o=e.count,s=t.length;for(let o=0;o<s;o++){let c=t[Math.min(o+1,s-1)],l=t[Math.max(o-1,0)],u=K(c[0]-l[0],c[1]-l[1],c[2]-l[2]),d=[0,u[2],-u[1]];Math.hypot(d[0],d[1],d[2])<.1&&(d=[-u[1],u[0],0]),d=K(d[0],d[1],d[2]);let f=[u[1]*d[2]-u[2]*d[1],u[2]*d[0]-u[0]*d[2],u[0]*d[1]-u[1]*d[0]];for(let c=0;c<r;c++){let l=Math.PI*2*c/r,u=d[0]*Math.cos(l)+f[0]*Math.sin(l),p=d[1]*Math.cos(l)+f[1]*Math.sin(l),m=d[2]*Math.cos(l)+f[2]*Math.sin(l),h=t[o][0]+u*n[o],g=t[o][1]+p*n[o],_=t[o][2]+m*n[o],v=1;g>i?v=.55+(.25-.55)*Math.min(1,Math.max(0,(g-i)/1.5)):g<.3&&(v=.7),e.v(h,g,_,u,p,m,v,0,0,0,0,a*o/Math.max(1,s-1))}}for(let t=0;t<s-1;t++)for(let n=0;n<r;n++){let i=o+t*r+n,a=o+t*r+(n+1)%r,s=i+r,c=a+r;e.tri(i,s,a),e.tri(a,s,c)}}function hn(e,t,n){let r=t.trunkH;if(r<=0)return;if(t.gnarled){gn(e,t,n);return}let i=[7,5,4][n],a=[6,3,2][n],o=[],s=[];for(let e=0;e<=a;e++){let n=e/a,i=-.4+(r+.4)*n;o.push([t.lean[0]*n*n*r*.25,i,t.lean[2]*n*n*r*.25]);let c=1+.8*Math.max(0,1-(i+.4))**2;s.push(t.trunkR*(1-.45*n)*c)}if(mn(e,o,s,i,t.bottom),n>0)return;let c=o[o.length-1],l=[c[0],r*.62,c[2]];for(let n=0;n<Math.min(t.mains.length,4);n++){let r=t.mains[(n*2+1)%t.mains.length];mn(e,[l,[(l[0]+r[0])/2,(l[1]+r[1])/2+.2,(l[2]+r[2])/2],r],[t.trunkR*.5,t.trunkR*.35,t.trunkR*.2],4,t.bottom)}}function gn(e,t,n){let r=t.trunkH,i=t.trunkR,a=t.noCanopy,o=a?1e6:t.bottom,s=ln(3571*(Math.floor(r*10)+7)),c=[8,6,4][n],l=[9,5,3][n],u=a?1:2,d=[];for(let n=0;n<u;n++){let a=n*Math.PI+.5,s=[],f=[];for(let e=0;e<=l;e++){let o=e/l,c=-.4+(r+.4)*o,d=a+o*2.4,p=u>1?i*.5*(1-.4*o)+o*o*.35:0,m=Math.cos(d)*p+t.lean[0]*o*o*r*.3,h=Math.sin(d)*p+t.lean[2]*o*o*r*.3;m+=Math.sin(o*7+n*3)*.05*r*o,h+=Math.cos(o*5+n)*.05*r*o,s.push([m,c,h]);let g=1+.22*Math.sin(o*19+n*2)*(1-o*.5),_=1+.9*Math.max(0,1-(c+.4)/.9)**2;f.push(i*(u>1?.68:1)*(1-.38*o)*g*_)}mn(e,s,f,c,o),d.push(s[l])}if(!(n>0&&!a)&&(t.mains.forEach((t,r)=>{let a=d[r%d.length],c=[a[0]+(t[0]-a[0])*.4+s.range(-.35,.35),a[1]+(t[1]-a[1])*.4+.15,a[2]+(t[2]-a[2])*.4+s.range(-.35,.35)],l=[a[0]+(t[0]-a[0])*.75+s.range(-.25,.25),a[1]+(t[1]-a[1])*.75+.1,a[2]+(t[2]-a[2])*.75+s.range(-.25,.25)],f=i*(u>1?.5:.55);mn(e,[a,c,l,t],[f,f*.8,f*.6,f*.42],n===0?5:4,o)}),a&&n<2))for(let a=0;a<2;a++){let a=s.next()*Math.PI*2,c=r*s.range(.45,.8),l=[t.lean[0]*c*.1,c,t.lean[2]*c*.1],u=K(Math.cos(a),s.range(.2,.6),Math.sin(a));mn(e,[l,[l[0]+u[0]*.45,l[1]+u[1]*.45,l[2]+u[2]*.45],[l[0]+u[0]*.8,l[1]+u[1]*.8,l[2]+u[2]*.8]],[i*.38,i*.32,i*.3],n===0?5:4,o)}}function _n(e,t,n){if(n.noCanopy)return t;let r=t;for(let t=0;t<6;t++){let t=[r[0],n.squash===1?r[1]:n.origin[1]+(r[1]-n.origin[1])/n.squash,r[2]];for(let e=0;e<n.centres.length;e++){let i=n.centres[e];if(Math.hypot(t[0]-i[0],t[1]-i[1],t[2]-i[2])<n.radii[e]-.25)return r}r=[e[0]+(r[0]-e[0])*.75,e[1]+(r[1]-e[1])*.75,e[2]+(r[2]-e[2])*.75]}return r}function vn(e,t,n,r){if(n>0&&!t.noCanopy||n===2)return;let i=ln(104729*(r+1)),a=t.trunkH,o=t.trunkR||.2,s=t.noCanopy?1e6:t.bottom,c=[t.lean[0]*a*.25,a*.62,t.lean[2]*a*.25],l=t.mains.length,u=0,d=0,f=0;for(let e of t.mains)u+=e[0],d+=e[1],f+=e[2];u/=l,d/=l,f/=l;let p=new Set;for(let e=0;e<(t.gnarled?l:Math.min(l,4));e++)p.add(t.gnarled?e:(e*2+1)%l);for(let r=0;r<l;r++){let a=t.mains[r],l=t.mainR[r];p.has(r)||mn(e,[c,[(c[0]+a[0])/2+i.range(-.3,.3),(c[1]+a[1])/2+.25,(c[2]+a[2])/2+i.range(-.3,.3)],a],[o*.45,o*.32,o*.2],4,s);let m=K(a[0]-u,(a[1]-d)*.5,a[2]-f);Math.hypot(a[0]-u,(a[1]-d)*.5,a[2]-f)<=.2&&(m=[0,1,0]);let h=n===0?3:2,g=Math.max(o*.2*t.twigScale,.05);for(let r=0;r<h;r++){let o=Math.PI*2*(r+i.next()*.6)/h,c=K(m[0]*.8+Math.cos(o)*.8,m[1]*.8+(.6+i.next()*.5)*.8,m[2]*.8+Math.sin(o)*.8),u=l*i.range(.7,.9),d=_n(a,[a[0]+c[0]*u,a[1]+c[1]*u,a[2]+c[2]*u],t);if(mn(e,[a,[(a[0]+d[0])/2+i.normal()*.12,(a[1]+d[1])/2+l*.08,(a[2]+d[2])/2+i.normal()*.12],d],[g,g*.7,Math.max(g*.42,.03)],n===0?4:3,s),n===0)for(let n=0;n<2;n++){let n=K(c[0]+i.normal()*.7,c[1]+.4,c[2]+i.normal()*.7),r=l*i.range(.35,.5),a=_n(d,[d[0]+n[0]*r,d[1]+n[1]*r,d[2]+n[2]*r],t);mn(e,[d,[(d[0]+a[0])/2,(d[1]+a[1])/2+.05,(d[2]+a[2])/2],a],[Math.max(g*.42,.03),Math.max(g*.3,.025),.02],3,s)}}}}var yn=new Set([W.BROADLEAF,W.OVAL,W.ORCHARD,W.BIRCH,W.WILLOW,W.OLIVE]);function bn(e){let t=fn(e),n=[];if(t.noCanopy){for(let r=0;r<3;r++){let i=new on;hn(i,t,r),vn(i,t,Math.min(r,1),e),n.push(i)}return n}let{verts:r,levels:i}=cn(4),a=[e===W.BUSH?3:4,2,1],o=10*4**a[0]+2,s=t.centres.length,c=Array(o),l=Array(o),u=new Float32Array(o),d=new Float32Array(s),[f,p,m]=t.origin;for(let n=0;n<o;n++){let i=K(r[n][0]*t.stretch[0],r[n][1]*t.stretch[1],r[n][2]*t.stretch[2]),a=-1e9,o=0;for(let e=0;e<s;e++){let n=t.centres[e],r=n[0]-f,s=n[1]-p,c=n[2]-m,l=r*i[0]+s*i[1]+c*i[2],u=t.radii[e]*t.radii[e]-(r*r+s*s+c*c-l*l),h=u>=0?l+Math.sqrt(u):l-2*Math.sqrt(-u);d[e]=h,h>a&&(a=h,o=e)}let h=0,g=0,_=0,v=0,y=f+i[0]*a,b=p+i[1]*a,x=m+i[2]*a;for(let e=0;e<s;e++){let n=Math.exp((d[e]-a)/t.smooth);if(n>.001){h+=n;let r=t.centres[e],i=K(y-r[0],b-r[1],x-r[2]);g+=i[0]*n,_+=i[1]*n,v+=i[2]*n}}let S=Math.max(t.size*.18,a+t.smooth*Math.log(h)),C=f+i[0]*S,w=p+i[1]*S,T=m+i[2]*S,E=(dn(C*.9+e*7.1,w*.9,T*.9)-.5)*2*.07*t.size;C+=i[0]*E,w+=i[1]*E,T+=i[2]*E,t.squash!==1&&(w=p+(w-p)*t.squash),c[n]=[C,w,T],l[n]=K(g,_,v);let D=Math.sin(o*12.9898)*43758.5453;u[n]=D-Math.floor(D)}let h=pn(c,i[a[0]],o),g=new Float32Array(o),_=[.18*t.size,.45*t.size,.9*t.size];for(let e=0;e<o;e++){let n=c[e],r=K(h[e][0]+l[e][0],h[e][1]+l[e][1],h[e][2]+l[e][2]),i=0,a=1;for(let e of _){let o=n[0]+r[0]*e,c=n[1]+r[1]*e,l=n[2]+r[2]*e,u=1e9;for(let e=0;e<s;e++){let n=t.centres[e];u=Math.min(u,Math.hypot(o-n[0],c-n[1],l-n[2])-t.radii[e])}i+=Math.max(e-u,0)/e*a,a*=.6}let o=Math.min(1,Math.max(0,1-i*.55)),u=.3+.7*Cn(0,.8,Math.min(1,Math.max(0,(n[1]-t.bottom)/(t.top-t.bottom)))),d=.55+.45*Math.min(1,Math.max(0,r[1]*.5+.5));g[e]=o*u*d}for(let r=0;r<3;r++){let o=a[r],s=i[o],d=10*4**o+2,_=o===a[0]?h:pn(c,s,d),v=new on;for(let e=0;e<d;e++){let n=c[e],r=K((n[0]-f)/(t.stretch[0]*t.stretch[0]),(n[1]-p)/(t.stretch[1]*t.stretch[1]),(n[2]-m)/(t.stretch[2]*t.stretch[2])),i=K(_[e][0]*.2+l[e][0]*.4+r[0]*.5,_[e][1]*.2+l[e][1]*.4+r[1]*.5,_[e][2]*.2+l[e][2]*.4+r[2]*.5),a=Math.min(1,Math.max(0,(n[1]-t.bottom)/(t.top-t.bottom)));v.v(n[0],n[1],n[2],i[0],i[1],i[2],g[e],a,u[e],1,p,0)}for(let e=0;e<s.length;e+=3)v.tri(s[e],s[e+2],s[e+1]);hn(v,t,r),yn.has(e)&&vn(v,t,r,e),n.push(v)}return n}function xn(e,t){let n=e;for(let e=0;e<t;e++){let e=[n[0]];for(let t=0;t<n.length-1;t++)for(let r of[.25,.75]){let i=n[t],a=n[t+1];e.push([i[0]+(a[0]-i[0])*r,i[1]+(a[1]-i[1])*r,i[2]+(a[2]-i[2])*r,i[3]+(a[3]-i[3])*r,r<.5?i[4]:a[4],i[5]+(a[5]-i[5])*r])}e.push(n[n.length-1]),n=e}return n}var Sn=e=>e-Math.floor(e),Cn=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function wn(e){let t=Math.floor(e),n=e-t,r=Sn(Math.sin(t*12.9898)*43758.5453);return r+(Sn(Math.sin((t+1)*12.9898)*43758.5453)-r)*Cn(.35,.65,n)}function Tn(e){let t=[];if(e===W.PINE){let e=1.72;t.push([.3,2.15,0,0,0,1]);for(let n=0;n<6;n++){let r=3.1*(1-n/6.4),i=1.7+n*e;t.push([r*.55,i+.3,.5,0,n,0],[r,i,1,0,n,0],[r*1.02,i+.22,1,0,n,0]),n<5?t.push([r*.62,i+e*.7,.45,0,n,0],[r*.42,i+e+.4,0,0,n,0]):t.push([r*.55,i+.9,.5,0,n,0],[.28,i+1.7,.2,0,n,0],[0,i+1.95,0,0,n,0])}return{rows:t,lobes:7,amp:.17,droop:.3,twist:0,rag:0,trunkH:3.2,trunkR:.24,segs:[28,14,7],mains:[],far:[[.3,2.1,0,0,0,1],[3.1,1.7,1,0,0,0],[3.15,1.95,1,0,0,0],[1.45,4.1,.3,0,1,0],[2.2,4.95,1,0,2,0],[2.25,5.3,1,0,2,0],[1,7.5,.3,0,3,0],[1.3,8.4,1,0,4,0],[1.25,8.75,1,0,4,0],[.45,10.9,.2,0,5,0],[0,12.25,0,0,5,0]]}}if(e===W.CYPRESS){let e=[[.2,.55],[.72,.75],[1.1,1.6],[1.32,3.2],[1.32,5],[1.15,6.8],[.85,8.4],[.5,9.7],[.2,10.6],[0,10.9]],n=[.3,.6,1,1,1,1,1,.9,.6,0];return e.forEach((e,r)=>t.push([e[0],e[1],n[r],0,r>>1,+(r===0)])),{rows:t,lobes:6,amp:.12,droop:0,twist:.42,rag:0,trunkH:1.6,trunkR:.16,segs:[24,12,6],mains:[],far:[[.2,.55,0,0,0,1],[1.1,1.6,1,0,0,0],[1.32,3.2,1,0,1,0],[1.32,5,1,0,2,0],[1,7.6,1,0,3,0],[.5,9.7,.6,0,4,0],[0,10.9,0,0,4,0]]}}let n=[[.45,4.25],[1.8,3.8],[2.95,3],[3.5,1.9],[3.7,1.5],[4,1.35],[4.3,1.7],[4.55,2.9],[4.65,4.2],[4.4,5.6],[3.7,6.8],[2.5,7.8],[1.1,8.35],[0,8.55]],r=[.1,.25,.6,.9,1,1,1,.7,.35,.1,0,0,0,0];return n.forEach((e,n)=>t.push([e[0],e[1],Math.max(r[n],.25),r[n],0,+(n<5)])),{rows:t,lobes:13,amp:.6,droop:0,twist:0,rag:1.8,trunkH:4.4,trunkR:.36,segs:[78,39,9],mains:[[2.4,6.1,.8],[-2,6.3,1.3],[.5,6.7,-2.3],[-1,5.9,-1.4]],far:[[.45,4.25,.25,.1,0,1],[2.95,3,.6,.6,0,1],[3.7,1.5,1,1,0,1],[4.3,1.7,1,1,0,0],[4.65,4.2,.35,.35,0,0],[3.7,6.8,.25,0,0,0],[1.1,8.35,.25,0,0,0],[0,8.55,.25,0,0,0]]}}function En(e){let t=Tn(e),n=ln(7919*(e+1)),r=Array.from({length:16},()=>n.next()*Math.PI*2),i=-1/0,a=1/0;for(let e of t.rows)i=Math.max(i,e[1]),a=Math.min(a,e[1]);let o=(i+a)/2,s=[];for(let n=0;n<3;n++){let c=n===2?t.far:xn(t.rows,e===W.PINE&&n===0?0:[2,1,0][n]),l=t.segs[n],u=c.length,d=Array(u*l),f=new Float32Array(u*l),p=new Float32Array(u*l).fill(1),m=n===2?.35:1;for(let i=0;i<u;i++){let a=c[i],o=a[2],s=a[4];for(let c=0;c<l;c++){let u=Math.PI*2*c/l,h=a[0],g=a[1],_=0;if(e===W.PINE){let e=t.lobes-(s>>1),n=e*u+r[s%16],i=Math.cos(n);h*=1+(t.amp*o*i+(dn(Math.cos(u)*3,g*1.3,Math.sin(u)*3)-.5)*.28*o)*m,g-=t.droop*o*Math.max(i,0)*m,_=s*16+Math.round((n%(Math.PI*2)+Math.PI*2)%(Math.PI*2)/(Math.PI*2)*e)%e}else if(e===W.CYPRESS){let e=t.lobes*u+g*t.twist+r[0];h*=1+(t.amp*o*Math.cos(e)+(dn(Math.cos(u)*2,g*.9,Math.sin(u)*2)-.5)*.2*o)*m,_=Math.round((e%(Math.PI*2)+Math.PI*2)%(Math.PI*2)/(Math.PI*2)*t.lobes)%t.lobes+Math.floor(g/1.6)*16}else{let e=t.lobes*u/(Math.PI*2)+r[0],s=e-Math.floor(e),d=Math.sin(Math.PI*s)**.5,f=a[3];n<2&&(h+=t.amp*o*(d-.7)-.9*f*(1-d)*(1-a[5]),h+=(dn(Math.cos(u)*2.5,g*.7,Math.sin(u)*2.5)-.5)*2*(.4+-.28*f),g<3.2&&(g+=t.rag*wn(e-.5)*Math.min(1,Math.max(0,(3.2-g)/2)))),_=Math.floor(e)%t.lobes,p[i*l+c]=1+(d-1)*o}let v=[Math.cos(u)*h,g,Math.sin(u)*h];e===W.CYPRESS&&(v[0]+=.006*g*g),d[i*l+c]=v,f[i*l+c]=Sn(Math.sin(_*12.9898+e*3.1)*43758.5453)}}let h=[];for(let e=0;e<u-1;e++)for(let t=0;t<l;t++){let n=e*l+t,r=e*l+(t+1)%l;h.push(n,r,n+l,r,r+l,n+l)}let g=Array.from({length:u*l},()=>[0,0,0]);for(let e=0;e<h.length;e+=3){let t=d[h[e]],n=d[h[e+1]],r=d[h[e+2]],i=r[0]-t[0],a=r[1]-t[1],o=r[2]-t[2],s=n[0]-t[0],c=n[1]-t[1],l=n[2]-t[2],u=a*l-o*c,f=o*s-i*l,p=i*c-a*s;for(let t of[h[e],h[e+1],h[e+2]])g[t][0]+=u,g[t][1]+=f,g[t][2]+=p}let _=new on;for(let t=0;t<u;t++){let n=c[t];for(let r=0;r<l;r++){let s=t*l+r,c=d[s],u=Math.hypot(g[s][0],g[s][1],g[s][2]),m=u>1e-6?[g[s][0]/u,g[s][1]/u,g[s][2]/u]:[0,1,0],h=K(c[0],(c[1]-o)*.35,c[2]),v=n[5]<.5?K(m[0]*.6+h[0]*.4,m[1]*.6+h[1]*.4,m[2]*.6+h[2]*.4):m,y=Math.min(1,Math.max(0,(c[1]-a)/(i-a))),b=(.35+.65*Cn(0,.8,y))*(.55+.45*Math.min(1,Math.max(0,m[1]*.5+.5)));e===W.PINE&&(b*=.62+.38*n[2]),b*=(1-.45*n[5])*(.5+.5*p[s]),_.v(c[0],c[1],c[2],v[0],v[1],v[2],b,y,f[s],1,o,n[3])}}for(let e of h)_.indices.push(e);if(hn(_,{...fn(W.BUSH),trunkH:t.trunkH,trunkR:t.trunkR,lean:[0,0,0],bottom:a,mains:t.mains,gnarled:!1},n),e===W.WILLOW&&n<2)for(let e of t.mains){let t=K(e[0],0,e[2]),r=n===0?4:2;for(let n=0;n<r;n++){let i=(n-(r-1)*.5)*.4,o=Math.cos(i),s=Math.sin(i),c=t[0]*o-t[2]*s,l=t[0]*s+t[2]*o,u=2.6+.35*n;mn(_,[e,[e[0]+c,e[1]+.45,e[2]+l],[e[0]+c*1.5,e[1]-.5,e[2]+l*1.5],[e[0]+c*1.6,e[1]-u,e[2]+l*1.6]],[.07,.05,.035,.025],3,a,1)}}s.push(_)}return s}var Dn=new Map;function On(e){let t=Dn.get(e);if(t)return t;let n=e===W.PINE||e===W.CYPRESS||e===W.WILLOW?En(e):bn(e),r=0,i=0,a=n[0].positions;for(let e=0;e<a.length;e+=3)r=Math.max(r,Math.hypot(a[e],a[e+2])),i=Math.max(i,a[e+1]);return t={lods:n,radius:r,height:i},Dn.set(e,t),t}var kn=class{wind={x:.8,z:.6,strength:1};season={blossom:0,fresh:0,autumn:0,bare:0,snow:0,progress:.5,weights:[0,1,0,0]};clock=0;noise=null;bind(e){let t=this.wind,n=this.season;e.setFloat3(`uWind`,t.x,t.z,t.strength),e.setFloat4(`uSeasonFx`,n.blossom,n.fresh,n.autumn,n.bare),e.setFloat2(`uSnowFx`,n.snow,n.progress),e.setFloat(`uClock`,this.clock),this.noise&&e.setTexture(`uSnowNoise`,this.noise)}},An=[`uWind`,`uSeasonFx`,`uSnowFx`,`uClock`],jn=[`uSnowNoise`],Mn=`
uniform vec3 uWind;
uniform vec4 uSeasonFx;
uniform vec2 uSnowFx;
uniform float uClock;
uniform sampler2D uSnowNoise;

// One broad snow front shared with the terrain (same noise texture and scales), so snow arrives everywhere together.
float snowCoverage(float amount, vec2 p) {
  float front = texture2D(uSnowNoise, p / 260.0).r * 0.55 + texture2D(uSnowNoise, (p + 37.0) / 70.0).r * 0.3 + texture2D(uSnowNoise, (p + 91.0) / 14.0).r * 0.15;
  float width = max(0.18, fwidth(front));
  float cov = smoothstep(front, front + width, amount * 1.02);
  return mix(cov * smoothstep(0.0, 0.12, amount), 1.0, smoothstep(0.9, 1.0, amount));
}

// 4x4 Bayer threshold from bit arithmetic (a local array here would cost every vegetation shader a stack frame).
float bayer4(vec2 fc) {
  ivec2 c = ivec2(mod(fc, 4.0));
  int y = c.y, x = c.x;
  int m0 = (((y ^ x) & 1) << 1) | (y & 1);
  int m1 = ((((y >> 1) ^ (x >> 1)) & 1) << 1) | ((y >> 1) & 1);
  return (float(m0 * 4 + m1) + 0.5) / 16.0;
}

float hash13v(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

// Value noise with analytic gradient: x value, yzw gradient.
vec4 vnoised(vec3 x) {
  vec3 i = floor(x);
  vec3 w = fract(x);
  vec3 u = w * w * (3.0 - 2.0 * w);
  vec3 du = 6.0 * w * (1.0 - w);
  float a = hash13v(i);
  float b = hash13v(i + vec3(1.0, 0.0, 0.0));
  float c = hash13v(i + vec3(0.0, 1.0, 0.0));
  float d = hash13v(i + vec3(1.0, 1.0, 0.0));
  float e = hash13v(i + vec3(0.0, 0.0, 1.0));
  float f = hash13v(i + vec3(1.0, 0.0, 1.0));
  float g = hash13v(i + vec3(0.0, 1.0, 1.0));
  float h = hash13v(i + vec3(1.0, 1.0, 1.0));
  float k1 = b - a, k2 = c - a, k3 = e - a, k4 = a - b - c + d, k5 = a - c - e + g, k6 = a - b - e + f, k7 = -a + b + c - d + e - f - g + h;
  float v = a + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
  vec3 gr = du * vec3(k1 + k4 * u.y + k6 * u.z + k7 * u.y * u.z, k2 + k5 * u.z + k4 * u.x + k7 * u.z * u.x, k3 + k6 * u.x + k5 * u.y + k7 * u.x * u.y);
  return vec4(v, gr);
}

// Procedural paint has no mip chain: unresolved octaves fade to their mean by pixel footprint.
vec4 filteredPaint(vec3 p) {
  float resolved = 1.0 - smoothstep(0.18, 0.75, length(fwidth(p)));
  vec4 n = vnoised(p);
  return vec4(mix(0.5, n.x, resolved), n.yzw * resolved);
}
`,Nn=`
uniform vec3 uWind;
uniform float uClock;
float gustAt(vec2 p, float t) {
  vec2 wd = normalize(uWind.xy);
  return 0.5 + 0.5 * sin(dot(p, wd) * 0.03 - t * 0.8);
}
// Collapsed vertices land outside the clip volume, so the triangle is culled before rasterising.
const vec4 CULLED = vec4(0.0, 0.0, -2.0, 1.0);
`,Pn=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 uv;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uLodCam;      // main camera position, also in the shadow pass
uniform vec4 uLod;         // near end, far start, far end, this mesh's band
uniform vec2 uBareK;       // bare amount for this kind, bare shrink
uniform float uHangSway;
${Nn}
uniform vec4 uSeasonFx;
float vh(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise3(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(vh(i), vh(i + vec3(1, 0, 0)), u.x), mix(vh(i + vec3(0, 1, 0)), vh(i + vec3(1, 1, 0)), u.x), u.y),
             mix(mix(vh(i + vec3(0, 0, 1)), vh(i + vec3(1, 0, 1)), u.x), mix(vh(i + vec3(0, 1, 1)), vh(i + vec3(1, 1, 1)), u.x), u.y), u.z);
}
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vInst;
varying vec3 vObj;
varying float vGrow;
varying float vYaw;
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  float jit = 0.85 + 0.3 * fract(world3.y * 7.31);
  float band = d < uLod.x * jit ? 0.0 : (d < uLod.y * jit ? 1.0 : 2.0);
  if (abs(band - uLod.w) > 0.5 || d > uLod.z) {
    gl_Position = CULLED;
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vInst = vec4(0.0); vObj = vec3(0.0); vGrow = 0.0; vYaw = 0.0;
    return;
  }
  vec3 p = position;
  float bare = uSeasonFx.w * uBareK.x;
  // Every tree gets its own lumps: a low-frequency push along the normal, seeded per instance.
#ifndef DEPTH_PASS
  if (color.a > 0.5) {
    vec3 q = p * 0.42 + world3.y * 23.0;
    float lump = (vnoise3(q) - 0.5) * 0.9 + (vnoise3(q * 2.3 + 7.1) - 0.5) * 0.35;
    p += normal * lump * min(1.0, uv.x * 0.25 + 0.25);
  }
#endif
  if (color.a > 0.5) {
    float s = mix(1.0, uBareK.y, bare);
    p = vec3(p.x * s, mix(uv.x, p.y, s), p.z * s);
  }
  vObj = p;
  vGrow = clamp((uClock - world3.z) / 0.6, 0.0, 1.0);
  vec3 sc = world1.xyz;
#ifndef DISSOLVE
  // Without discard (mid band) arrivals grow in instead of dissolving.
  float g = smoothstep(0.0, 1.0, vGrow);
  sc *= vec3(mix(0.3, 1.0, g), g, mix(0.3, 1.0, g));
#endif
  float c = cos(world0.w), sn = sin(world0.w);
  vec3 ps = p * sc;
  vec3 wp = origin + vec3(c * ps.x + world2.x * ps.y + sn * ps.z, ps.y, -sn * ps.x + world2.y * ps.y + c * ps.z);
  // Wind: slow gusts travel with the wind, crowns sway by height, leaves flutter, willow curtains swing.
  float h = max(p.y, 0.0) * sc.y;
  float rnd = world3.y;
  float phase = rnd * 6.2831 + dot(origin.xz, vec2(0.05, 0.07));
  vec2 wd = normalize(uWind.xy);
  vec3 w3 = vec3(wd.x, 0.0, wd.y);
  float gust = gustAt(origin.xz, uTime);
  float sway = (sin(uTime * 1.1 + phase) * 0.6 + sin(uTime * 2.3 + phase * 1.7) * 0.25) * (0.4 + 0.6 * gust);
  vec3 off = w3 * (sway + 0.3 * gust) * 0.028 * h * h / 8.0;
  off += sin(uTime * 3.3 + p * 1.9 + phase) * 0.018 * color.a * (h / 6.0) * (1.0 - bare * 0.7);
  float hang = uv.y * uHangSway;
  off += (w3 * (0.6 + 0.8 * gust) * sin(uTime * 1.6 + phase + p.x * 0.9 + p.z * 0.7)
    + vec3(-wd.y, 0.0, wd.x) * 0.4 * sin(uTime * 2.1 + phase * 1.3 + p.z * 1.3)) * hang;
  wp += off * uWind.z;
  vWorld = wp;
  vec3 nn = normal / sc;
  vNormal = normalize(vec3(c * nn.x + sn * nn.z, nn.y, -sn * nn.x + c * nn.z));
  vColor = color;
  vInst = vec4(world2.z, world2.w, world3.x, rnd);
  vYaw = world0.w;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`foliage`,Pn,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vInst;
varying vec3 vObj;
varying float vGrow;
varying float vYaw;
${V}
${H}
${Mn}
uniform vec3 uLeafCool;
uniform vec3 uLeafMid;
uniform vec3 uLeafWarm;
uniform vec3 uBark;
uniform vec4 uSpecies;     // evergreen, can blossom, autumn cover, snow cover
uniform vec4 uSpecies2;    // hue var, birch bark, lace width, lace scale
uniform vec3 uDabStretch;
uniform vec3 uLaceStretch;
uniform vec3 uAutumn;
uniform vec3 uTwig;
uniform vec3 uTwigHaze;
uniform vec2 uBareK;

void main() {
  float bay = bayer4(gl_FragCoord.xy);
#ifdef DISSOLVE
  // Arrivals fade in. Only the near band may discard: on tile GPUs discard defeats hidden-surface removal for the
  // whole draw. A crown close to the eye opens into leaf clusters further down (no screen-space stipple).
  float near = distance(uCamPos, vWorld);
  if (bay > vGrow) discard;
#endif
  float leaf = vColor.a;
  float ao = vColor.r;
  float h01 = vColor.g;
  float clump = vColor.b;
  float rnd = vInst.w;
  vec3 p = vObj;
  vec3 ps = p * uDabStretch;
  vec4 n1 = filteredPaint(ps * 0.75 + rnd * 31.0);
#ifdef DISSOLVE
  vec4 n2 = filteredPaint(ps * 0.75 * 2.7 + 11.0);
#else
  // Mid band: the fine octave is sub-pixel past 100 m.
  vec4 n2 = vec4(0.5, 0.0, 0.0, 0.0);
#endif
  float nb = vnoised(p * 0.55 + rnd * 17.0).x;
  float dabLod = (1.0 - smoothstep(0.18, 0.65, length(fwidth(ps * 0.75)))) * leaf;

  float warm = clamp(0.2 + vInst.x * uSpecies2.x * 0.55 + (clump - 0.5) * 0.35 + (nb - 0.5) * 0.15, 0.0, 1.0);
  vec3 leafc = warm < 0.5 ? mix(uLeafCool, uLeafMid, warm * 2.0) : mix(uLeafMid, uLeafWarm, warm * 2.0 - 1.0);
  float bright = mix(0.8, 1.18, vInst.y);
  leafc *= bright;
  float dab = (n1.x - 0.5) * 0.7 + (n2.x - 0.5) * 0.3;
  leafc *= 1.0 + dab * 0.68;
  leafc = mix(leafc, uLeafWarm * bright, smoothstep(0.1, 0.4, dab) * 0.25);
  leafc *= 1.0 + (n1.x - 0.5) * 0.22 * dabLod;

  vec3 n = normalize(vNormal);
  leafc *= mix(0.92, 1.08, smoothstep(-0.2, 0.65, n.y));
  // The underside of the canopy is deep shade inside the leaves, never the pale sky-lit sheet it was.
  leafc *= mix(1.0, 0.62, smoothstep(-0.25, -0.75, n.y) * leaf);

  // Seasons: spring flush and blossom, autumn from the top down on susceptible crowns, winter greys and bare lace.
  float sus = vInst.z;
  float ever = uSpecies.x;
  float blossom = uSeasonFx.x, fresh = uSeasonFx.y, autumn = uSeasonFx.z;
  float bare = uSeasonFx.w * uBareK.x;
  leafc = mix(leafc, vec3(0.105, 0.21, 0.017) * mix(0.85, 1.15, vInst.y), fresh * 0.45 * (1.0 - sus) * (1.0 - ever * 0.6));
  float pt = n1.x * 0.45 + n2.x * 0.25 + nb * 0.5;
  // Blossom (A4): white and pink (60/40, #f4efe9 and a rose #eeb4c4) on the outer, upper leaf clumps, covering 35 to
  // 60% of the crown with green showing between, speckled into dabs where they resolve. Clumps keep the pattern
  // coherent at the board camera, where a uniform tint read as a grey potato.
  float bloomK = blossom * smoothstep(0.45, 0.70, sus) * uSpecies.y;
  vec3 bp = ps * 3.6 + rnd * 41.0;
  float bres = (1.0 - smoothstep(0.3, 0.9, length(fwidth(bp)))) * leaf;
  float bcov = mix(0.35, 0.6, fract(rnd * 7.31));
  float clumpB = smoothstep(0.44, 0.64, n1.x * 0.7 + n2.x * 0.3 + (bcov - 0.5) * 0.5 + (h01 + n.y * 0.4 - 0.55) * 0.25);
  float bn = vnoised(bp).x * 0.65 + vnoised(bp * 2.3 + 9.0).x * 0.35;
  float dabs = smoothstep(0.4, 0.46, bn);
  float bmask = clumpB * mix(0.8, dabs, bres * 0.85) * bloomK;
  float pink = smoothstep(0.48, 0.6, vnoised(ps * 1.9 + rnd * 13.0).x);
  vec3 bcol = mix(vec3(0.905, 0.863, 0.815), vec3(0.855, 0.456, 0.552), pink) * 0.9;
  float au = autumn * smoothstep(0.80 - uSnowFx.y * 0.25, 0.95 - uSnowFx.y * 0.25, sus) * (1.0 - ever);
  // Autumn turns the tops first and spreads down through the season, never a flat orange ball.
  float cover = uSpecies.z + uSnowFx.y * 0.25 - 0.1;
  float amask = smoothstep(0.62 - cover, 0.86 - cover, h01 * 0.55 + nb * 0.3 + (n1.x - 0.5) * 0.3 * dabLod + 0.1) * au;
  leafc = mix(leafc, uAutumn * mix(0.75, 1.05, n2.x) * mix(0.85, 1.0, h01), amask * 0.85);
  leafc = mix(leafc, leafc * vec3(1.15, 1.0, 0.75), autumn * 0.25 * (1.0 - ever));
  float snow = uSnowFx.x;
  float smask = snow > 0.0 ? smoothstep(0.35 - uSpecies.w, 0.65 - uSpecies.w, n.y + (n1.x - 0.5) * 0.6) * snowCoverage(snow, vWorld.xz) : 0.0;
  leafc = mix(leafc, vec3(dot(leafc, vec3(0.33))) * vec3(0.8, 0.85, 0.8), snow * 0.5 * (1.0 - ever * 0.6));
  if (bare > 0.001) {
    // Twig lace: ridges of two noise octaves read as crossing twigs, widening to a purple-brown haze far away.
    vec3 pl = p * uSpecies2.w * uLaceStretch + rnd * 13.0;
    float farL = smoothstep(0.35, 1.1, length(fwidth(pl * 2.3)));
    vec3 twig = uTwig * (0.8 + 0.45 * n2.x) * mix(0.85, 1.15, vInst.y);
    twig = mix(twig, uTwigHaze, farL * 0.55);
    float r1 = abs(vnoised(pl).x - 0.5);
    float r2 = abs(vnoised(pl * 2.3 + 5.0).x - 0.5) * 1.2;
    float wl = mix(uSpecies2.z, 0.24, farL);
    float lace = 1.0 - smoothstep(wl * 0.6, wl, min(r1, r2));
    // Near crowns open into lace (the sky shows through), far ones settle into haze.
#ifdef DISSOLVE
    if (leaf > 0.5 && bare > 0.5 && farL < 0.6 && lace < 0.5 && bay > farL * 1.4 + (1.0 - bare) * 2.0) discard;
#endif
    // Without discard the mid band suggests the lace with dark gaps between twig clusters.
    twig *= mix(1.0, 0.55 + 0.45 * smoothstep(0.25, 0.6, vnoised(p * 1.3 + rnd * 9.0).x), farL);
    leafc = mix(leafc, twig, bare);
    smask *= mix(0.55, 0.85, farL);
    ao = leaf < 0.5 ? max(ao, 0.8) : mix(ao, max(ao, 0.7), bare);
  }
  leafc = mix(leafc, vec3(0.79, 0.85, 1.0), smask);

  vec3 barkc = uBark;
  if (leaf < 0.5) barkc *= 0.75 + 0.5 * vnoised(vec3(p.x * 9.0, p.y * 1.6, p.z * 9.0)).x;
  if (uSpecies2.y > 0.0 && leaf < 0.5) {
    float len = smoothstep(0.66, 0.72, vnoised(vec3(p.x * 8.0, p.y * 30.0, p.z * 8.0)).x);
    float blot = smoothstep(0.62, 0.7, vnoised(vec3(p.x * 3.0, p.y * 2.2, p.z * 3.0) + 4.0).x);
    float foot = 1.0 - smoothstep(0.15, 1.1, p.y + (vnoised(p * 4.0).x - 0.5) * 0.6);
    vec3 wb = uBark * (0.9 + 0.12 * vnoised(p * 5.0).x);
    wb = mix(wb, vec3(0.010, 0.008, 0.008), clamp(max(len, blot * 0.85) + foot * 0.8, 0.0, 1.0));
    barkc = mix(barkc, wb, uSpecies2.y);
  }
  vec3 albedo = mix(barkc, leafc, leaf);
  // The interior keeps a cool translucent fill: clumps never become black holes.
  ao = mix(ao, max(ao, 0.78), leaf);
  albedo = mix(albedo * vec3(0.62, 0.78, 1.05), albedo, ao);
  // Blossom sits on the outside of the crown, so it skips the interior's cool darkening.
  albedo = mix(albedo, bcol, bmask * leaf * (1.0 - smask));

  // Leaf clusters bump the smooth canopy normal with the paint gradient (object space, turned by the instance yaw).
  vec3 g = (n1.yzw + n2.yzw * 1.35) * uDabStretch * 0.75 * leaf * (1.0 - smask * 0.7);
  float cy = cos(vYaw), sy = sin(vYaw);
  g = vec3(cy * g.x + sy * g.z, g.y, -sy * g.x + cy * g.z);
  g -= n * dot(g, n);
  // Clump-scale relief: crowns read as clusters of lumps from the board camera, not smooth balloons.
  n = normalize(n - g * (0.22 + 0.06 * dabLod));
#ifdef DISSOLVE
  // Leaves up close: two fine octaves of bump catch the light as many small highlights, with irregular dark gaps
  // between leaf clusters (a crease network would read as scales).
  if (leaf > 0.5) {
    vec3 lp = p * uDabStretch * 5.5 + rnd * 7.0;
    vec4 l1 = vnoised(lp), l2 = vnoised(lp * 2.3 + 3.7);
    float resolved = (1.0 - smoothstep(0.25, 0.8, length(fwidth(lp)))) * (1.0 - smask);
    vec3 lg = (l1.yzw + l2.yzw * 1.2) * uDabStretch;
    lg = vec3(cy * lg.x + sy * lg.z, lg.y, -sy * lg.x + cy * lg.z);
    lg -= n * dot(lg, n);
    n = normalize(n - lg * 0.09 * resolved);
    float lv = l1.x * 0.6 + l2.x * 0.4;
    // Within a few metres the gaps between leaf clusters open first, so a crown at the lens is leaves and sky.
    float open = 1.0 - smoothstep(1.5, 4.5, near);
    if (lv < open * 0.62) discard;
    float gap = 1.0 - smoothstep(0.22, 0.42, lv);
    albedo *= 1.0 + ((lv - 0.5) * 0.35 - gap * 0.35) * resolved;
    albedo = mix(albedo, bcol, bloomK * smoothstep(0.55, 0.7, lv) * 0.4 * resolved);
    ao *= 1.0 - gap * 0.2 * resolved;
  }
#endif

  float sh;
  vec3 col = shade(albedo, n, vWorld, mix(0.75, ao, leaf), 0.5, sh);
  // Backlit glow through crown edges when the sun is low behind the tree: the golden-hour rim of A2 and R1.
  vec3 v = normalize(uCamPos - vWorld);
  float lowSun = 1.0 - smoothstep(0.1, 0.55, uSunDir.y);
  float back = clamp(dot(-uSunDir, v), 0.0, 1.0);
  float edge = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  // Plus a rim along the sunward silhouette when the sun is low to the side, so masses separate as in A2.
  float sunSide = clamp(dot(n, uSunDir), 0.0, 1.0);
  float tr = lowSun * (pow(back, 3.0) * (0.15 + 1.9 * pow(edge, 2.4)) + pow(edge, 3.0) * (0.8 * back + 0.5 * sunSide)) * mix(sh, 1.0, 0.45);
  // Light through the leaves is the warm leaf colour, not the shaded albedo.
  col += mix(albedo, uLeafWarm, 0.6) * uSunColor * 1.1 * tr * leaf * (1.0 - smask);
  col += vec3(0.0006, 0.0011, 0.0007) * leaf;
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`foliageDepth`,Pn,`
precision highp float;
varying vec3 vWorld;
varying vec4 vColor;
varying vec4 vInst;
varying vec3 vObj;
varying float vGrow;
uniform vec4 uSeasonFx;
uniform vec2 uBareK;
float h13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
void main() {
#ifdef DISSOLVE
  float r = h13(floor(gl_FragCoord.xyz * vec3(1.0, 1.0, 0.0)) + vInst.w * 17.0);
  if (r > vGrow) discard;
  if (vColor.a > 0.5 && h13(floor(vObj * 2.5) + vInst.w * 5.0) < uSeasonFx.w * uBareK.x * 0.72) discard;
#endif
  gl_FragColor = vec4(1.0);
}
`);var q=(e,t,n)=>new b(e,t,n),Fn={cool:q(.09,.21,.13),mid:q(.2,.33,.11),warm:q(.38,.48,.15),bark:q(.26,.19,.13),evergreen:0,canBlossom:1,autumnCover:0,snowCover:0,hueVar:1,birch:0,dabStretch:[1,1,1],autumn:q(.8,.44,.14),hangSway:0,twig:q(.27,.21,.19),twigHaze:q(.4,.35,.33),laceScale:2.2,laceStretch:[1,1,1],laceWidth:.07,bareAmount:1,bareShrink:.76},In={[W.BROADLEAF]:Fn,[W.OVAL]:Fn,[W.BUSH]:{...Fn,bareAmount:0},[W.ORCHARD]:{...Fn,twig:q(.3,.22,.2)},[W.PINE]:{...Fn,cool:q(.05,.14,.11),mid:q(.1,.21,.11),warm:q(.22,.31,.12),bark:q(.32,.19,.12),evergreen:1,canBlossom:0,dabStretch:[1,.7,1],snowCover:.18,hueVar:.8,bareAmount:0},[W.BIRCH]:{...Fn,cool:q(.17,.28,.1),mid:q(.3,.4,.12),warm:q(.48,.54,.16),bark:q(.86,.84,.78),birch:1,canBlossom:0,autumn:q(.95,.7,.12),autumnCover:.22,twig:q(.36,.25,.22),twigHaze:q(.5,.4,.42),laceWidth:.06},[W.WILLOW]:{...Fn,cool:q(.18,.28,.12),mid:q(.3,.4,.15),warm:q(.48,.55,.21),bark:q(.3,.25,.18),canBlossom:0,dabStretch:[1.8,.22,1.8],hangSway:.16,autumn:q(.8,.66,.16),autumnCover:.1,twig:q(.38,.31,.24),twigHaze:q(.5,.45,.44),laceStretch:[2.4,.25,2.4],laceWidth:.05,bareShrink:.82},[W.CYPRESS]:{...Fn,cool:q(.04,.12,.08),mid:q(.09,.19,.09),warm:q(.2,.28,.1),bark:q(.3,.22,.15),evergreen:1,canBlossom:0,dabStretch:[1,.55,1],hueVar:.7,bareAmount:0},[W.OLIVE]:{...Fn,cool:q(.26,.32,.2),mid:q(.41,.46,.29),warm:q(.62,.65,.42),bark:q(.36,.32,.27),evergreen:1,canBlossom:0,hueVar:.8,bareAmount:.3,bareShrink:.97},[W.DEAD]:{...Fn,bark:q(.4,.37,.34),bareAmount:1}},Ln=.62;function Rn(e,t,n,r,i){let a=In[n],o=e=>e.toLinearSpace(),s={cool:o(a.cool).scale(Ln),mid:o(a.mid).scale(Ln),warm:o(a.warm).scale(Ln),bark:o(a.bark),autumn:o(a.autumn),twig:o(a.twig),haze:o(a.twigHaze)},c=[`uLodCam`,`uLod`,`uBareK`,`uHangSway`,...An],l=r===0?[`DISSOLVE`]:[],u=e.material(`foliage_${n}_${r}`,`foliage`,{attributes:[`position`,`normal`,`color`,`uv`],defines:l,uniforms:[...c,`uLeafCool`,`uLeafMid`,`uLeafWarm`,`uBark`,`uSpecies`,`uSpecies2`,`uDabStretch`,`uLaceStretch`,`uAutumn`,`uTwig`,`uTwigHaze`],samplers:jn}),d=n=>{n.setVector3(`uLodCam`,e.camPos),n.setFloat4(`uLod`,i.near,i.far,i.end,r),n.setFloat2(`uBareK`,a.bareAmount,a.bareShrink),n.setFloat(`uHangSway`,a.hangSway),t.bind(n)};u.onBindObservable.add(()=>{let e=u.getEffect();e&&(d(e),e.setColor3(`uLeafCool`,s.cool),e.setColor3(`uLeafMid`,s.mid),e.setColor3(`uLeafWarm`,s.warm),e.setColor3(`uBark`,s.bark),e.setFloat4(`uSpecies`,a.evergreen,a.canBlossom,a.autumnCover,a.snowCover),e.setFloat4(`uSpecies2`,a.hueVar,a.birch,a.laceWidth,a.laceScale),e.setFloat3(`uDabStretch`,...a.dabStretch),e.setFloat3(`uLaceStretch`,...a.laceStretch),e.setColor3(`uAutumn`,s.autumn),e.setColor3(`uTwig`,s.twig),e.setColor3(`uTwigHaze`,s.haze))});let f=e.material(`foliageDepth_${n}_${r}`,`foliageDepth`,{attributes:[`position`,`normal`,`color`,`uv`],uniforms:[...c,`uTime`],samplers:jn,lit:!1,defines:[...l,`DEPTH_PASS`]});return f.onBindObservable.add(()=>{let t=f.getEffect();t&&(d(t),t.setFloat(`uTime`,e.time))}),{lit:u,depth:f}}var zn=42,Bn=6;function Vn(){let e=new Float32Array(500*Bn*4),t=cn(1).verts.slice(0,zn);for(let n=0;n<10;n++){let r=On(n).lods[1],i=r.positions,a=r.colors,o=[1/0,1/0,1/0],s=[-1/0,-1/0,-1/0],c=[];for(let e=0;e<i.length/3;e++)if(!(a[e*4+3]<.5)){c.push(e);for(let t=0;t<3;t++)o[t]=Math.min(o[t],i[e*3+t]),s[t]=Math.max(s[t],i[e*3+t])}let l=0;for(let e=0;e<i.length/3;e++)a[e*4+3]>.5||Math.hypot(i[e*3],i[e*3+2])<.8&&(l=Math.max(l,i[e*3+1]));let u=n*Bn,d=n*Bn+1,f=(t,n,r,i,a,o)=>{let s=(t*50+n)*4;e[s]=r,e[s+1]=i,e[s+2]=a,e[s+3]=o};if(c.length){let e=[(o[0]+s[0])/2,(o[1]+s[1])/2,(o[2]+s[2])/2],n=[(s[0]-o[0])/2,(s[1]-o[1])/2,(s[2]-o[2])/2],r=[],p=[];for(let o=0;o<zn;o++){let s=t[o],l=0,u=0,d=0;for(let t of c){let r=(i[t*3]-e[0])/n[0],o=(i[t*3+1]-e[1])/n[1],c=(i[t*3+2]-e[2])/n[2],f=Math.hypot(r,o,c)||1,p=(r*s[0]+o*s[1]+c*s[2])/f;p>.9&&(l=Math.max(l,f*p),u+=a[t*4],d++)}l===0&&(l=.8),r.push([e[0]+s[0]*n[0]*l,e[1]+s[1]*n[1]*l,e[2]+s[2]*n[2]*l]),p.push(d?u/d:.6)}let m=cn(1).levels[1],h=Array.from({length:zn},()=>[0,0,0]);for(let e=0;e<m.length;e+=3){let t=r[m[e]],n=r[m[e+1]],i=r[m[e+2]],a=n[0]-t[0],o=n[1]-t[1],s=n[2]-t[2],c=i[0]-t[0],l=i[1]-t[1],u=i[2]-t[2],d=o*u-s*l,f=s*c-a*u,p=a*l-o*c;for(let t of[m[e],m[e+1],m[e+2]])h[t][0]+=d,h[t][1]+=f,h[t][2]+=p}for(let t=0;t<zn;t++){let i=K(h[t][0],h[t][1],h[t][2]),a=K((r[t][0]-e[0])/n[0],(r[t][1]-e[1])/n[1],(r[t][2]-e[2])/n[2]),c=K(i[0]*.4+a[0]*.6,i[1]*.4+a[1]*.6,i[2]*.4+a[2]*.6);f(u,t,r[t][0],r[t][1],r[t][2],p[t]),f(d,t,c[0],c[1],c[2],Math.min(1,Math.max(0,(r[t][1]-o[1])/(s[1]-o[1]))))}l=Math.min(l,o[1]+(s[1]-o[1])*.3)}else for(let e=0;e<zn;e++)f(u,e,0,l,0,.5),f(d,e,0,1,0,1);for(let e=0;e<2;e++)for(let t=0;t<4;t++){let r=t/4*Math.PI*2+.785,i=.2*(e?.6:1)*(n===2?0:1);f(u,zn+e*4+t,Math.cos(r)*i,e?Math.max(l,.5):-.4,Math.sin(r)*i,-1),f(d,zn+e*4+t,Math.cos(r),0,Math.sin(r),0)}}for(let t=0;t<10;t++){let n=In[t],r=(e,t)=>{let n=e.toLinearSpace();return[n.r*t,n.g*t,n.b*t]};[[r(n.cool,Ln),n.hueVar],[r(n.mid,Ln),n.evergreen],[r(n.warm,Ln),n.canBlossom],[r(n.bark,1),n.bareAmount]].forEach(([n,r],i)=>{let a=(t*Bn+2+i)*50*4;e[a]=n[0],e[a+1]=n[1],e[a+2]=n[2],e[a+3]=r})}return e}function Hn(){let{levels:e}=cn(1),t=e[1],n=[];for(let e=0;e<t.length;e+=3)n.push(t[e],t[e+2],t[e+1]);for(let e=0;e<4;e++){let t=zn+e,r=zn+(e+1)%4,i=t+4,a=r+4;n.push(t,i,r,r,i,a)}let r=new S;return r.positions=new Float32Array(150),r.indices=new Uint16Array(n),r}var Un=`${Bn}`;function Wn(e,t){let n=``;for(let e=9;e>=0;e--){let r=t(e).map(e=>e.toFixed(5)).join(`, `);n=e===9?`vec4(${r})`:`k == ${e} ? vec4(${r}) : ${n}`}return`vec4 ${e}(int k) { return ${n}; }\n`}function Gn(){let e=(e,t)=>{let n=e.toLinearSpace();return[n.r*t,n.g*t,n.b*t]};return Wn(`speciesCool`,t=>[...e(In[t].cool,Ln),In[t].hueVar])+Wn(`speciesMid`,t=>[...e(In[t].mid,Ln),In[t].evergreen])+Wn(`speciesWarm`,t=>[...e(In[t].warm,Ln),In[t].canBlossom])+Wn(`speciesBark`,t=>[...e(In[t].bark,1),In[t].bareAmount])}var Kn=`
precision highp float;
precision highp sampler2D;
attribute vec3 position;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uLodCam;
uniform vec4 uLod;
uniform sampler2D uShapes;
${Nn}
${Gn()}
uniform vec4 uSeasonFx;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vAlbedo;
varying vec4 vInfo;    // ao, height01, leaf, susceptibility
varying vec4 vInfo2;   // evergreen, can blossom, bare, random
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  float jit = 0.85 + 0.3 * fract(world3.y * 7.31);
  // Trees under about a pixel and a half tall are left to the woodland floor tint, and past 1.1 km the forest
  // thins with the survivors grown to keep its mass: the far band is triangle-bound, not fill-bound.
  float px = world1.y * 8.0 / max(d, 1.0) * uLod.x;
  float thin = smoothstep(1100.0, 2400.0, d);
  if (d < uLod.y * jit || d > uLod.z * jit || px < 1.5 || fract(world3.y * 13.7) < thin * 0.6) {
    gl_Position = CULLED;
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vAlbedo = vec3(0.0); vInfo = vec4(0.0); vInfo2 = vec4(0.0);
    return;
  }
  int kind = int(world1.w + 0.5);
  int vid = gl_VertexID;
  int row = kind * ${Un};
  vec4 a = texelFetch(uShapes, ivec2(vid, row), 0);
  vec4 b = texelFetch(uShapes, ivec2(vid, row + 1), 0);
  vec4 kc = speciesCool(kind), km = speciesMid(kind), kw = speciesWarm(kind), kb = speciesBark(kind);
  float leaf = a.w < 0.0 ? 0.0 : 1.0;
  float bare = uSeasonFx.w * kb.w;
  vec3 p = a.xyz;
  if (leaf > 0.5) p = vec3(p.x * mix(1.0, 0.76, bare), mix(p.y, p.y * 0.93, bare), p.z * mix(1.0, 0.76, bare));
  // Streamed trees grow in over half a second.
  float grow = smoothstep(0.0, 1.0, clamp((uClock - world3.z) / 0.5, 0.0, 1.0));
  vec3 sc = world1.xyz * vec3(mix(0.3, 1.0, grow), grow, mix(0.3, 1.0, grow)) * vec3(1.0 + thin * 0.35, 1.0 + thin * 0.15, 1.0 + thin * 0.35);
  float c = cos(world0.w), sn = sin(world0.w);
  vec3 ps = p * sc;
  vec3 wp = origin + vec3(c * ps.x + world2.x * ps.y + sn * ps.z, ps.y, -sn * ps.x + world2.y * ps.y + c * ps.z);
  float gust = gustAt(origin.xz, uTime);
  wp.xz += normalize(uWind.xy) * (sin(uTime * 1.1 + world3.y * 6.28) * 0.6 + 0.3 * gust) * 0.028 * ps.y * ps.y / 8.0 * uWind.z;
  vec3 n = b.xyz / max(sc, vec3(0.01));
  vNormal = normalize(vec3(c * n.x + sn * n.z, n.y, -sn * n.x + c * n.z));
  float warm = clamp(0.2 + world2.z * kc.w * 0.55 + (b.w - 0.5) * 0.2, 0.0, 1.0);
  vec3 leafc = warm < 0.5 ? mix(kc.rgb, km.rgb, warm * 2.0) : mix(km.rgb, kw.rgb, warm * 2.0 - 1.0);
  leafc *= mix(0.8, 1.18, world2.w);
  vAlbedo = mix(kb.rgb * 0.8, leafc, leaf);
  vInfo = vec4(leaf > 0.5 ? a.w : 0.7, b.w, leaf, world3.x);
  vInfo2 = vec4(km.w, kw.w, bare, world3.y);
  vWorld = wp;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`foliageFar`,Kn,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec3 vAlbedo;
varying vec4 vInfo;
varying vec4 vInfo2;
${V}
${H}
${Mn}
void main() {
  vec3 n = normalize(vNormal);
  float leaf = vInfo.z, ao = vInfo.x, h01 = vInfo.y, sus = vInfo.w;
  float ever = vInfo2.x, bare = vInfo2.z, rnd = vInfo2.w;
  vec3 leafc = vAlbedo;
  leafc *= mix(0.92, 1.08, smoothstep(-0.2, 0.65, n.y));
  // Seasons, as the near crowns but per tree: blossom and autumn tint whole susceptible crowns, tops first.
  leafc = mix(leafc, vec3(0.105, 0.21, 0.017), uSeasonFx.y * 0.45 * (1.0 - sus) * (1.0 - ever * 0.6));
  // Blossom: the near crowns' white and rose clumps at their mean.
  vec3 bcol = mix(vec3(0.905, 0.863, 0.815), vec3(0.855, 0.456, 0.552), 0.2 + 0.45 * fract(rnd * 3.7)) * 0.9;
  leafc = mix(leafc, bcol, uSeasonFx.x * smoothstep(0.45, 0.70, sus) * vInfo2.y * smoothstep(0.2, 0.8, h01 + 0.3) * mix(0.28, 0.48, fract(rnd * 7.31)));
  float au = uSeasonFx.z * smoothstep(0.80 - uSnowFx.y * 0.25, 0.95 - uSnowFx.y * 0.25, sus) * (1.0 - ever);
  leafc = mix(leafc, vec3(0.60, 0.16, 0.017), au * smoothstep(0.35, 0.8, h01 + uSnowFx.y * 0.3) * 0.7);
  leafc = mix(leafc, leafc * vec3(1.15, 1.0, 0.75), uSeasonFx.z * 0.25 * (1.0 - ever));
  leafc = mix(leafc, vec3(dot(leafc, vec3(0.33))) * vec3(0.8, 0.85, 0.8), uSnowFx.x * 0.5 * (1.0 - ever * 0.6));
  leafc = mix(leafc, vec3(0.133, 0.101, 0.089) * (0.8 + 0.4 * rnd), bare);
  float smask = uSnowFx.x > 0.0 ? smoothstep(0.35, 0.65, n.y) * snowCoverage(uSnowFx.x, vWorld.xz) * mix(1.0, 0.7, bare) : 0.0;
  leafc = mix(leafc, vec3(0.79, 0.85, 1.0), smask);
  vec3 albedo = mix(vAlbedo, leafc, leaf);
  ao = mix(ao, max(ao, 0.78), leaf);
  albedo = mix(albedo * vec3(0.62, 0.78, 1.05), albedo, ao);
  float sh;
  vec3 col = shade(albedo, n, vWorld, mix(0.75, ao, leaf), 0.5, sh);
  vec3 v = normalize(uCamPos - vWorld);
  float lowSun = 1.0 - smoothstep(0.1, 0.55, uSunDir.y);
  float back = clamp(dot(-uSunDir, v), 0.0, 1.0);
  float edge = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  float sunSide = clamp(dot(n, uSunDir), 0.0, 1.0);
  float tr = lowSun * (pow(back, 3.0) * (0.15 + 1.9 * pow(edge, 2.4)) + pow(edge, 3.0) * (0.8 * back + 0.5 * sunSide));
  col += albedo * 1.4 * uSunColor * 1.1 * tr * mix(sh, 1.0, 0.45) * leaf * (1.0 - smask);
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`foliageFarDepth`,Kn,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var qn=null;function Jn(t,n,r,i,a){qn||=new x(Vn(),50,10*Bn,e.TEXTUREFORMAT_RGBA,t,!1,!1,l.NEAREST_SAMPLINGMODE,e.TEXTURETYPE_FLOAT);let o=qn,s=e=>{let s=t.activeCamera,c=s?t.getEngine().getRenderHeight()/(2*Math.tan(s.fov/2)):1e3;e.setVector3(`uLodCam`,n.camPos),e.setFloat4(`uLod`,c,i,a(),2),e.setTexture(`uShapes`,o),r.bind(e)},c=n.material(`foliageFar_${i}`,`foliageFar`,{attributes:[`position`],uniforms:[`uLodCam`,`uLod`,...An],samplers:[`uShapes`,...jn]});c.onBindObservable.add(()=>{let e=c.getEffect();e&&s(e)});let u=n.material(`foliageFarDepth_${i}`,`foliageFarDepth`,{attributes:[`position`],uniforms:[`uLodCam`,`uLod`,`uTime`,...An],samplers:[`uShapes`,...jn],lit:!1});return u.onBindObservable.add(()=>{let e=u.getEffect();e&&(s(e),e.setFloat(`uTime`,n.time))}),{lit:c,depth:u}}var Yn=512,Xn={near:95,far:300,end:2800},Zn=268435456,Qn=480,$n=6,er=24,tr=Xn.near*1.15+$n+4,nr=[Xn.near*.85-er-4,Xn.far*1.15+er+6],rr=582,ir=.21,ar=.55,or=(e,t)=>(e+64)*128+(t+64),sr=class{scene;lighting;shadows;veg;kinds=Array(10).fill(null);chunks=new Map;far=new Map;near=Array(10).fill(null);mid=Array(10).fill(null);nearAt={x:1e9,y:0,z:1e9,dirty:!0};midAt={x:1e9,y:0,z:1e9,yaw:0,dirty:!0};cam=new n;farEnd=Xn.end;farVd=null;farMat=null;proxyMat=null;proxy=null;enabled=!0;constructor(e,t,n,r){this.scene=e,this.lighting=t,this.shadows=n,this.veg=r??new kn}assets(e){let t=this.kinds[e];if(t)return t;let n=On(e),r=[],i=[],a=[];for(let t=0;t<3;t++){let o=n.lods[t].arrays(),s=new S;s.positions=o.positions,s.normals=o.normals,s.colors=o.colors,s.uvs=o.uvs,s.indices=o.indices,r.push(s);let c=Rn(this.lighting,this.veg,e,t,Xn);i.push(c.lit),a.push(c.depth)}return t={vd:r,lit:i,depth:a,radius:n.radius,height:n.height},this.kinds[e]=t,t}setFarEnd(e){this.farEnd=Math.min(Xn.end,e)}setChunk(e,t,n){let r=or(e,t),i=this.chunks.get(r);i||(i={cx:e,cz:t,byKind:Array(10).fill(null)},this.chunks.set(r,i));let a=Array(10).fill(0);for(let e=0;e<n.length;e+=16)a[n[e+G.KIND]]++;let o=Array(10).fill(0);i.byKind=a.map(e=>e?new Float32Array(e*16):null);for(let e=0;e<n.length;e+=16){let t=n[e+G.KIND];i.byKind[t].set(n.subarray(e,e+16),o[t]++*16)}this.touch(e,t)}clearChunk(e,t){let n=or(e,t);this.chunks.get(n)&&(this.chunks.delete(n),this.touch(e,t))}touch(e,t){let n=Math.floor(e*256/Yn),r=Math.floor(t*256/Yn),i=or(n,r),a=this.far.get(i);a||this.far.set(i,a={key:i,fx:n,fz:r,mesh:null,dirty:!0}),a.dirty=!0,this.nearAt.dirty=!0,this.midAt.dirty=!0}makeMesh(e,t,r,i,a){let o=this.assets(t),s=new v(e,this.scene);o.vd[r].applyToMesh(s,!1),s.isPickable=!1,s.doNotSyncBoundingInfo=!0,s.thinInstanceSetBuffer(`matrix`,i,16,!0);let c=1/0,l=1/0,u=1/0,d=-1/0,f=-1/0,p=-1/0,m=0;for(let e=0;e<i.length;e+=16){let t=i[e],n=i[e+1],r=i[e+2];t<c&&(c=t),t>d&&(d=t),n<l&&(l=n),n>f&&(f=n),r<u&&(u=r),r>p&&(p=r),m=Math.max(m,i[e+G.SY],i[e+G.SX])}let h=o.radius*m+1,g=o.height*m+1;return s.setBoundingInfo(new y(new n(c-h,l-1,u-h),new n(d+h,f+g,p+h))),s.material=o.lit[r],s.alwaysSelectAsActiveMesh=!1,a>=0&&this.shadows.addCaster(s,o.depth[r],a),s}update(e,t,r){this.cam.set(e,r,t);let i=8;for(let e of this.far.values()){if(i<=0)break;e.dirty&&(this.buildFar(e),i-=2)}for(let n of this.far.values()){let r=Math.hypot(n.fx*Yn+Yn/2-e,n.fz*Yn+Yn/2-t);n.mesh?.setEnabled(this.enabled&&r<this.farEnd*1.15+Yn)}let a=n=>Math.hypot(e-n.x,r-n.y,t-n.z);(this.nearAt.dirty||a(this.nearAt)>$n)&&(this.nearAt={x:e,y:r,z:t,dirty:!1},this.pick(this.near,0,0,tr,1,`treeNear`));let o=this.scene.activeCamera,s=o?o.getDirection(new n(0,0,-1)):new n(0,0,-1),c=Math.atan2(s.x,s.z),l=Math.abs((c-this.midAt.yaw+Math.PI*3)%(Math.PI*2)-Math.PI);if(this.midAt.dirty||a(this.midAt)>er||l>ir){this.midAt={x:e,y:r,z:t,yaw:c,dirty:!1};let n=this.scene.getEngine().getRenderWidth()/Math.max(1,this.scene.getEngine().getRenderHeight()),i=o?Math.atan(Math.tan(o.fov/2)*n):1,a={fx:Math.sin(c),fz:Math.cos(c),cos:Math.cos(Math.min(Math.PI,i+ar))};this.pick(this.mid,1,nr[0],nr[1],-1,`treeMid`,a),this.proxy&&=(this.shadows.removeCaster(this.proxy),this.proxy.dispose(),null);let s=this.gather(nr[0],rr,{...a,cos:Math.cos(Math.min(Math.PI,i+ar+.5))});s.length&&(this.proxy=this.farMesh(`treeShadow`,new Float32Array(s),!0))}}gatherByKind(e,t,n){let{x:r,y:i,z:a}=this.cam,o=Array.from({length:10},()=>[]);if(this.enabled){let s=Math.sqrt(Math.max(0,t*t-Math.max(0,i-120)**2)),c=e>0?e*e:-1,l=t*t;for(let e=Math.floor((r-s)/256);e<=Math.floor((r+s)/256);e++)for(let t=Math.floor((a-s)/256);t<=Math.floor((a+s)/256);t++){let s=this.chunks.get(or(e,t));if(s)for(let e=0;e<10;e++){let t=s.byKind[e];if(!t)continue;let u=o[e];for(let e=0;e<t.length;e+=16){let o=t[e]-r,s=t[e+1]-i,d=t[e+2]-a,f=o*o+s*s+d*d;if(!(f>l||f<c)){if(n&&f>4900){let e=Math.hypot(o,d);if((o*n.fx+d*n.fz)/e<n.cos)continue}for(let n=0;n<16;n++)u.push(t[e+n])}}}}}return o}gather(e,t,n){return[].concat(...this.gatherByKind(e,t,n))}pick(e,t,n,r,i,a,o){let s=this.gatherByKind(n,r,o);for(let n=0;n<10;n++){let r=e[n];r&&(this.shadows.removeCaster(r),r.dispose(),e[n]=null),s[n].length&&(e[n]=this.makeMesh(`${a}_${n}`,n,t,new Float32Array(s[n]),i))}}buildFar(e){e.dirty=!1,e.mesh?.dispose(),e.mesh=null;let t=Yn/256,n=[],r=0;for(let i=0;i<t;i++)for(let a=0;a<t;a++){let o=this.chunks.get(or(e.fx*t+i,e.fz*t+a));if(o)for(let e of o.byKind)e&&(n.push(e),r+=e.length)}if(!r)return;let i=new Float32Array(r),a=0;for(let e of n)i.set(e,a),a+=e.length;e.mesh=this.farMesh(`treeFar_${e.fx}_${e.fz}`,i,!1)}farMesh(e,t,r){this.farVd||(this.farVd=Hn(),this.farMat=Jn(this.scene,this.lighting,this.veg,Xn.far,()=>this.farEnd),this.proxyMat=Jn(this.scene,this.lighting,this.veg,Xn.near,()=>Qn).depth);let i=new v(e,this.scene);this.farVd.applyToMesh(i,!1),i.isPickable=!1,i.doNotSyncBoundingInfo=!0,i.thinInstanceSetBuffer(`matrix`,t,16,!0);let a=1/0,o=1/0,s=1/0,c=-1/0,l=-1/0,u=-1/0;for(let e=0;e<t.length;e+=16)a=Math.min(a,t[e]),c=Math.max(c,t[e]),o=Math.min(o,t[e+1]),l=Math.max(l,t[e+1]),s=Math.min(s,t[e+2]),u=Math.max(u,t[e+2]);return i.setBoundingInfo(new y(new n(a-12,o-1,s-12),new n(c+12,l+20,u+12))),i.material=this.farMat.lit,r&&(i.layerMask=Zn,this.shadows.addCaster(i,this.proxyMat,1)),i}treesNear(e,t,n,r){if(this.enabled){for(let i=Math.floor((e-n)/256);i<=Math.floor((e+n)/256);i++)for(let e=Math.floor((t-n)/256);e<=Math.floor((t+n)/256);e++)for(let t of this.chunks.get(or(i,e))?.byKind??[])if(t)for(let e=0;e<t.length;e+=16)r(t,e)}}setSnow(e){this.veg.season.snow=e}get stats(){let e=0,t=0,n=0,r=0;for(let t of this.chunks.values())for(let n of t.byKind)n&&(e+=n.length/16);for(let e of this.mid)e&&t++;for(let e of this.far.values())e.mesh&&n++;for(let e of this.near)e&&r++;return{trees:e,chunks:this.chunks.size,mid:t,far:n,near:r}}static cellOf(e,t){return[Math.floor(e/256),Math.floor(t/256)]}static CELL=256},cr=0,lr=0,ur=new Set;function dr(){for(let e of ur)e(lr,cr)}function fr(e){return cr++,dr(),e.finally(()=>{lr++,dr()})}function pr(e){return ur.add(e),e(lr,cr),()=>ur.delete(e)}globalThis.MeshoptDecoder={...j,useWorkers:()=>{}},w.Configuration.decoder.url=`data:text/javascript,`;var mr={ATLAS:0,THATCH:1,FLAT:2},hr=new Map;function gr(e,t,n={}){let r=n.keepOrigin?`${t}#origin`:t,i=hr.get(r);return i||hr.set(r,i=vr(e,t,n)),i}function _r(e){if(!e)return!1;let t=e.albedoTexture;return/thatch/i.test(e.name)||!!t&&/thatch/i.test(t.name)}async function vr(e,t,n){let r=await fr(_(`/harvest-crown/assets/models/${t}.glb`,e)),i=r.meshes.filter(e=>e instanceof v&&e.getTotalVertices()>0),o=[],s=[],c=[],l=[],u=[],d=null,f=null,p=1/0;for(let e of i){e.computeWorldMatrix(!0);let t=e.getWorldMatrix(),n=e.getVerticesData(a.PositionKind),r=e.getVerticesData(a.NormalKind)??new Float32Array(n.length),i=e.getVerticesData(a.UVKind)??new Float32Array(n.length/3*2),m=e.getIndices(),h=e.material,g=_r(h),_=h&&`albedoTexture`in h?h.albedoTexture:null,v=mr.FLAT;g&&_?(v=mr.THATCH,f??=_):_&&(v=mr.ATLAS,d??=_);let y=h?.albedoColor??{r:.7,g:.7,b:.7},b=o.length/3,x=t.m;for(let e=0;e<n.length;e+=3){let t=n[e],i=n[e+1],a=n[e+2],c=x[1]*t+x[5]*i+x[9]*a+x[13];o.push(x[0]*t+x[4]*i+x[8]*a+x[12],c,x[2]*t+x[6]*i+x[10]*a+x[14]),v===mr.THATCH&&(p=Math.min(p,c));let u=r[e],d=r[e+1],f=r[e+2],m=x[0]*u+x[4]*d+x[8]*f,h=x[1]*u+x[5]*d+x[9]*f,g=x[2]*u+x[6]*d+x[10]*f,_=Math.hypot(m,h,g)||1;s.push(m/_,h/_,g/_),l.push(y.r,y.g,y.b,v)}for(let e=0;e<i.length;e++)c.push(i[e]);let S=t.determinant()<0;for(let e=0;e<m.length;e+=3)S?u.push(b+m[e],b+m[e+2],b+m[e+1]):u.push(b+m[e],b+m[e+1],b+m[e+2])}let m=1/0,h=1/0,g=1/0,y=-1/0,b=-1/0,x=-1/0;for(let e=0;e<o.length;e+=3)m=Math.min(m,o[e]),y=Math.max(y,o[e]),h=Math.min(h,o[e+1]),b=Math.max(b,o[e+1]),g=Math.min(g,o[e+2]),x=Math.max(x,o[e+2]);if(!n.keepOrigin){let e=(m+y)/2,t=(g+x)/2;for(let n=0;n<o.length;n+=3)o[n]-=e,o[n+1]-=h,o[n+2]-=t;p<1/0&&(p-=h),y-=e,m-=e,x-=t,g-=t,b-=h,h=0}let C=new S;C.positions=o,C.normals=s,C.uvs=c,C.colors=l,C.indices=u;for(let e of[d,f]){if(!e)continue;let t=r.textures.indexOf(e);t>=0&&r.textures.splice(t,1)}return r.dispose(),{name:t,vertexData:C,albedo:d,thatch:f,height:b-h,radius:Math.max(y-m,x-g)/2,min:[m,h,g],max:[y,b,x],eave:p<1/0?p:-1e3}}var yr=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
attribute vec4 instData;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform float uTime;
uniform vec4 uSpin;      // axis xyz, turns per second (0 = static)
uniform vec3 uHub;       // spin pivot in model space
uniform float uTop;      // model height
uniform float uFort;
uniform float uSnow;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vInst;
varying vec4 vData;
varying vec4 vMat;
varying vec3 vObj;

vec3 rotateAxis(vec3 v, vec3 k, float a) {
  float c = cos(a), s = sin(a);
  return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
}

void main() {
#include<instancesVertex>
  vec4 inst = vec4(1.0);
#ifdef INSTANCESCOLOR
  inst = instanceColor;
#endif
  vec4 mat = vec4(1.0, 1.0, 1.0, 0.0);
#ifdef VERTEXCOLOR
  mat = color;
#endif
  vec3 p = position;
  vec3 nrm = normal;
  if (uSpin.w != 0.0) {
    float a = uTime * uSpin.w * 6.2831853 + instData.z * 6.2831853;
    p = uHub + rotateAxis(p - uHub, uSpin.xyz, a);
    nrm = rotateAxis(nrm, uSpin.xyz, a);
  }
  // Fortification tops gather a small lip of snow.
  if (uFort > 0.5) p.y += uSnow * smoothstep(0.4, 0.85, nrm.y) * 0.08;
  vObj = p;
  // Growth (alpha 0..1): the building rises out of the ground.
  float grow = clamp(inst.a, 0.0, 1.0);
  p.y -= (1.0 - grow) * (uTop + 1.5);
  vec4 wp = finalWorld * vec4(p, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(finalWorld) * nrm);
  vUv = uv;
  vInst = inst;
  vData = instData;
  vMat = mat;
  gl_Position = viewProjection * wp;
}
`,br=`
uniform float uTop;
uniform float uBottom;
float buildCut(vec3 wp, float left) {
  return mix(uBottom - 0.05, uTop + 0.05, 1.0 - left) + (vnoise(wp.xz * 1.7) - 0.5) * min(0.06 * (uTop - uBottom), 0.5);
}
`,xr=`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vInst;
varying vec4 vData;      // roof kind, ruin (1 burned, 2 abandoned), spin phase, build left (or minus fade left)
varying vec4 vMat;       // base colour factor, material kind (0 atlas, 1 thatch, 2 flat)
varying vec3 vObj;
${V}
${H}
${br}
uniform sampler2D uAtlas;
uniform sampler2D uThatch;
uniform vec2 uAtlasSize;
uniform float uHasAtlas;
uniform float uHasThatch;
uniform float uSnow;
uniform float uLamps;
uniform float uFort;
uniform float uRoofStart;  // model-space height where roofs begin (-1 = no roof logic)
uniform float uEave;       // thatch eave height, -1000 without thatch
uniform vec4 uGrade;       // value gain, saturation, warmth, ambient occlusion strength
uniform float uGain;       // measured gain that brings this atlas to its family's mean value

const vec3 STRAW_DARK = vec3(0.25, 0.18, 0.11);
const vec3 STRAW_MID = vec3(0.57, 0.43, 0.26);
const vec3 STRAW_LIGHT = vec3(0.78, 0.63, 0.40);
const vec3 STRAW_OLD = vec3(0.44, 0.39, 0.32);

float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Golden-brown straw laid in soft courses (B1, A2). Broad bundles only: at the board camera a course is a few pixels,
// so fine strands would alias into the crumpled look the original was criticised for.
vec3 straw(vec2 uv, vec3 wp, float texValue) {
  float u = uv.x * 6.0;
  float sx = u * 7.0;
  float course = uv.y * 6.0 + vnoise(vec2(sx * 0.15, 0.0)) * 0.5;
  float layer = floor(course);
  float aa = 1.0 - smoothstep(0.25, 0.9, fwidth(sx));
  float caa = 1.0 - smoothstep(0.2, 0.7, fwidth(course));
  float tone = vnoise(vec2(sx, layer * 7.3));
  float butt = smoothstep(0.6, 1.0, fract(course));
  float broad = vnoise(wp.xz * 0.42 + vec2(wp.y * 0.35, 0.0));
  float weather = smoothstep(0.55, 0.9, vnoise(wp.xz * 0.19 + 7.1));
  float v = 0.55 + (tone - 0.5) * 0.36 * aa + (broad - 0.5) * 0.34 + (texValue - 0.42) * 0.25;
  vec3 c = mix(STRAW_DARK, STRAW_MID, smoothstep(0.0, 0.52, v));
  c = mix(c, STRAW_LIGHT, smoothstep(0.52, 1.05, v));
  c = mix(c, STRAW_OLD * (0.8 + 0.4 * broad), weather * 0.35);
  c *= 1.0 - butt * 0.18 * aa * caa;
  // The ridge is capped and the eave rolls under: both sit a little darker.
  c *= mix(1.0, 0.88, 1.0 - smoothstep(0.0, 0.07, uv.y));
  c *= mix(1.0, 0.72, smoothstep(0.86, 1.0, uv.y));
  return c;
}

vec3 saturate3(vec3 c, float s) {
  float l = lum(c);
  return max(mix(vec3(l), c, s), 0.0);
}

void main() {
  bool inside = false;
#ifdef BUILD
  if (vData.w > 0.0) {
    if (vObj.y > buildCut(vWorld, vData.w)) discard;
    // Under construction the open top shows the walls' inner faces: in their own shade.
    inside = dot(vNormal, uCamPos - vWorld) < 0.0;
  } else if (vData.w < 0.0 && 1.0 + vData.w < fract(dot(floor(gl_FragCoord.xy), vec2(0.75487766, 0.56984029)))) discard;
#endif
  vec3 n = normalize(vNormal);
  // Double-sided atlases and mirrored instances: face the shading normal to the camera using the true face.
  vec3 ng = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 toCam = uCamPos - vWorld;
  if (dot(ng, toCam) < 0.0) ng = -ng;
  if (dot(n, ng) < 0.0) n = -n;

  float kind = vMat.a;
  vec3 base;
  float structure = 0.0;
  bool isThatch = kind > 0.5 && kind < 1.5;
  if (isThatch && vData.x > 2.5) {
    // The southern kit tiles the same hump in terracotta: courses down the slope, barrel tiles across it.
    float rows = vUv.y * 9.0;
    float across = vUv.x * 19.0;
    float aaR = 1.0 - smoothstep(0.2, 0.7, fwidth(rows));
    float aaU = 1.0 - smoothstep(0.2, 0.7, fwidth(across));
    float barrel = mix(1.0, 0.78 + 0.22 * sin(fract(across) * 6.2831853), aaU);
    float lap = smoothstep(0.72, 1.0, fract(rows)) * aaR;
    vec3 tile = vec3(0.68, 0.33, 0.19) * mix(0.82, 1.14, hash12(vec2(floor(across), floor(rows))) * aaU + (1.0 - aaU) * 0.5);
    base = pow(tile * barrel * (1.0 - lap * 0.22), vec3(2.2));
    base *= mix(1.0, 0.55, smoothstep(-0.05, -0.6, n.y));
  } else if (isThatch) {
    float tv = uHasThatch > 0.5 ? lum(texture(uThatch, vUv, 1.5).rgb) : 0.45;
    base = pow(straw(vUv, vWorld, tv), vec3(2.2));
    // The underside of the rolled lip is in the eave's own shade.
    base *= mix(1.0, 0.55, smoothstep(-0.05, -0.6, n.y));
  } else if (kind > 1.5) {
    base = vMat.rgb;
  } else if (uHasAtlas > 0.5) {
    // Brush-scale filtering: broad planes from a blurred mip, dark structure (beams, doors, openings) keeps detail.
    vec2 px = vUv * uAtlasSize;
    float lod = max(0.0, log2(max(length(dFdx(px)), length(dFdy(px)))));
    vec3 detail = texture(uAtlas, vUv).rgb;
    vec3 planes = textureLod(uAtlas, vUv, max(lod, 3.2)).rgb;
    // Meshy atlases pack small islands on black: the blurred mip pulls that black in (the keep went near-black).
    // Keep the blur's hue but the sharper mip's brightness.
    vec3 near = textureLod(uAtlas, vUv, max(lod, 1.2)).rgb;
    planes *= clamp(lum(near) / max(lum(planes), 0.02), 0.85, 2.2);
    structure = 1.0 - smoothstep(0.12, 0.30, lum(detail));
    base = mix(planes, detail, mix(0.22, 0.85, structure));
    base = pow(base, vec3(2.2)) * vMat.rgb;
  } else {
    base = vec3(0.5);
  }
  if (!isThatch && kind < 0.5) {
    // Per-model grade so every Meshy atlas lands on one value and saturation family.
    base = saturate3(base * uGain * uGrade.x, uGrade.y);
    base *= mix(vec3(1.0), vec3(1.05, 1.0, 0.92), uGrade.z);
  }

  float roofKind = vData.x;
  float ruin = vData.y;
  // Every up-facing surface above the eaves is roof, walls, beams and chimney sides keep the atlas.
  float roof = 0.0;
  if (uRoofStart > -0.5 && uFort < 0.5) roof = step(uRoofStart, vObj.y) * smoothstep(0.08, 0.36, n.y);
  if (isThatch) roof = 0.0;
  float value = lum(base);
  if (roof > 0.0) {
    // Slate and grey shingles turn a warm grey-brown near A2's earth role, straw-like roofs keep their colour.
    float strawLike = smoothstep(0.12, 0.40, (base.r - base.b) / max(value, 0.02)) * smoothstep(0.05, 0.12, value);
    vec3 warmSlate = (0.10 + value * 0.95) * vec3(1.0, 0.62, 0.36);
    vec3 roofCol = mix(warmSlate, base, strawLike) * vInst.rgb;
    // Kind 2 is terracotta tiles, kind 3 the southern kit.
    if (roofKind > 1.5) roofCol = (0.16 + value * 1.25) * vec3(1.0, 0.40, 0.21) * mix(0.9, 1.1, vnoise(vWorld.xz * 0.9));
    base = mix(base, roofCol, roof);
  } else if (!isThatch) {
    base *= mix(vec3(1.0), vInst.rgb, 0.85);
  }
  // Southern kit: pale lime-washed walls under terracotta (south-town, south-terraces).
  if (roofKind > 2.5 && !isThatch) {
    float wash = (1.0 - roof) * (1.0 - structure) * 0.62;
    vec3 lime = vec3(0.86, 0.80, 0.68) * (0.74 + 0.40 * value) * mix(0.94, 1.04, vnoise(vWorld.xz * 0.7 + vWorld.y));
    base = mix(base, lime, wash);
  }
  // Thatch eaves shade the wall just under the overhang.
  if (uEave > -999.0 && !isThatch) {
    float under = smoothstep(uEave - 1.2, uEave - 0.05, vObj.y) * (1.0 - smoothstep(uEave + 0.15, uEave + 0.35, vObj.y));
    base *= 1.0 - under * 0.4;
  }
  // Darker footings ground the buildings, fortifications get a subtle course banding.
  base *= mix(0.78, 1.0, smoothstep(0.0, 1.1, vObj.y));
  if (uFort > 0.5) base *= 0.97 + 0.035 * sin(vWorld.y * 1.7 + sin(vWorld.x * 0.8 + vWorld.z));
  // Burned: soot climbing the walls, charred roofs. Abandoned: faded and mossy.
  if (ruin > 0.5 && ruin < 1.5) {
    // Charred: roofs and upper walls blackened, the rest smoke-stained and ashen.
    float h = vObj.y / max(uTop, 1.0);
    float soot = smoothstep(0.15, 0.75, h + (vnoise(vWorld.xz * 1.9 + vWorld.y) - 0.5) * 0.3);
    vec3 ash = vec3(0.09, 0.085, 0.08) * mix(0.7, 1.3, vnoise(vWorld.xz * 3.1));
    base = mix(base * 0.45, ash, clamp(soot * 0.85 + roof * 0.6 + float(isThatch) * 0.7, 0.0, 0.95));
  } else if (ruin > 1.5) {
    base = mix(saturate3(base, 0.45) * 0.82, vec3(0.16, 0.19, 0.09), 0.18 * smoothstep(0.5, 1.0, n.y + vnoise(vWorld.xz * 1.3) * 0.4));
  }
  // Snow caps on up faces, sweeping in on one broad noise front.
  float dab = sin(vWorld.x * 3.7 + vWorld.z * 2.1) * sin(vWorld.z * 4.3);
  float cap = smoothstep(0.22, 0.62, n.y + dab * 0.035);
  if (uFort > 0.5) cap = max(cap, smoothstep(uTop - 0.22, uTop - 0.06, vObj.y) * 0.85);
  float front = vnoise(vWorld.xz / 260.0) * 0.55 + vnoise((vWorld.xz + 37.0) / 70.0) * 0.30 + vnoise((vWorld.xz + 91.0) / 14.0) * 0.15;
  float cover = smoothstep(front, front + 0.18, uSnow * 1.02);
  cover = mix(cover * smoothstep(0.0, 0.12, uSnow), 1.0, smoothstep(0.9, 1.0, uSnow));
  base = mix(base, vec3(0.90, 0.92, 0.96) * (0.985 + 0.015 * dab), cap * cover);
  if (inside) base *= 0.5;

  float ao = mix(1.0 - uGrade.w * 0.35, 1.0, smoothstep(0.0, 2.5, vObj.y));
  float sh;
  vec3 col = shade(base, n, vWorld, ao, 0.18, sh);
  // Shaded walls stay readable (A2): a little more sky on the vertical faces and warm light bounced off the sunlit
  // ground, so buildings separate from the grass by value even with the sun behind them.
  float side = 1.0 - abs(n.y);
  col += base * ambientLight(n) * 0.3 * side * ao;
  col += base * uSunColor * vec3(1.0, 0.86, 0.7) * 0.07 * clamp(uSunDir.y * 2.0, 0.15, 1.0) * max(side - 0.2, 0.0) * (1.0 - sh * 0.5);
  // Loose straw catches a warm rim when the sun is low behind it.
  if (isThatch) {
    vec3 v = normalize(toCam);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0) * max(dot(-v, uSunDir), 0.0);
    col += uSunColor * base * rim * 0.45 * sh;
  }
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`,Sr=`
precision highp float;
varying vec3 vWorld;
varying vec4 vData;
varying vec3 vObj;
${V}
${br}
void main() {
#ifdef BUILD
  if (vData.w > 0.0 && vObj.y > buildCut(vWorld, vData.w)) discard;
  if (vData.w < 0.0 && 1.0 + vData.w < fract(dot(floor(gl_FragCoord.xy), vec2(0.75487766, 0.56984029)))) discard;
#endif
  gl_FragColor = vec4(1.0);
}
`;U(`prop`,yr,xr),U(`propDepth`,yr,Sr);var Cr={roofStart:.48,value:.17,grade:[1,.78,.25,1]},wr={fort:!0,value:.36,grade:[1,.42,.2,1]},Tr={value:.14,grade:[1,.72,.2,1]},Er={cottage:{...Cr,value:.23},timber:{...Cr,value:.09},barn:{...Cr,value:.15},poi_croft:Cr,poi_cabin:{far:1300,...Cr,value:.15},poi_fishhut:{far:1300,...Cr,value:.15},poi_hermit:{far:1300,...Cr,value:.16},poi_stall:{...Cr,value:.16,shadowCascade:1},chapel:{roofStart:.36,value:.24,grade:[1,.55,.3,1]},poi_south_cottage:{...Cr,value:.24,grade:[1,.8,.15,1]},poi_villa:{far:1300,...Cr,value:.24,grade:[1,.8,.15,1]},keep:{...wr,value:.5},tower:{...wr,value:.6,grade:[1,.22,.05,1]},gatehouse:wr,wall:wr,poi_abbey:{far:1300,...wr,value:.3,grade:[1,.45,.35,.6]},poi_lighthouse:{far:1300,roofStart:.8,value:.25,grade:[1,.6,.25,1]},life_windmill_tower:{roofStart:.62,value:.24,grade:[1,.7,.25,1],keepOrigin:!0},life_windmill_sails:{value:.22,grade:[1,.7,.2,.3],spin:5.5/60,keepOrigin:!0},well:{...Tr,value:.17,shadowCascade:1},haystack:{grade:[1,1,0,1],shadowCascade:1},cart:{...Tr,shadowCascade:1},rowboat:{...Tr,grade:[1,.72,.2,.3],shadowCascade:1},pier:{...Tr,grade:[1,.72,.2,.3]},crane:{...Tr,grade:[1,.72,.2,.3]},watchtower:{...Tr,value:.15,grade:[1,.6,.2,.6]},poi_wreck:{far:1300,...Tr,value:.11,grade:[1,.6,.1,.5]},poi_bridge:{far:1300,...wr,fort:!1,value:.2},poi_shrine:{far:1300,value:.2,grade:[1,.6,.2,1],shadowCascade:1},poi_menhir:{far:1300,value:.3,grade:[1,.4,.15,.4],shadowCascade:1},poi_cairn:{far:1300,value:.26,grade:[1,.45,.15,.5],shadowCascade:1}},Dr=new Set([`keep`,`tower`,`gatehouse`,`poi_abbey`,`poi_lighthouse`,`life_windmill_tower`,`poi_villa`,`chapel`,`watchtower`]);async function Or(e){await new Promise(n=>t.WhenAllReady([e],()=>n()));let n=e.getSize(),r=Math.max(0,Math.round(Math.log2(Math.max(n.width,1)/32))),i=await e.readPixels(0,r);if(!i)return 0;let a=0,o=0;for(let e=0;e<i.length;e+=4){let t=.299*(i[e]/255)**2.2+.587*(i[e+1]/255)**2.2+.114*(i[e+2]/255)**2.2;t<.02||(a+=t,o++)}return o?a/o:0}var kr=class{mesh=null;items=new Map;dirty=!1;lit;depth;building=null;built=null;rising=!1;cascade=1;asset=null;look={};spin=null;gain=1;visible=0};function Ar(e,t){let r=e.vertexData.positions,i=r.length/3,a=0,o=0,s=0;for(let e=0;e<r.length;e+=3)a+=r[e],o+=r[e+1],s+=r[e+2];a/=i,o/=i,s/=i;let c=[0,0,0,0,0,0];for(let e=0;e<r.length;e+=3){let t=r[e]-a,n=r[e+1]-o,i=r[e+2]-s;c[0]+=t*t,c[1]+=t*n,c[2]+=t*i,c[3]+=n*n,c[4]+=n*i,c[5]+=i*i}let l=f.FromValues(c[0],c[1],c[2],0,c[1],c[3],c[4],0,c[2],c[4],c[5],0,0,0,0,1).clone().invert(),u=new n(0,0,1);for(let e=0;e<24;e++)u=n.TransformNormal(u,l).normalize();let d=new n((e.min[0]+e.max[0])/2,(e.min[1]+e.max[1])/2,(e.min[2]+e.max[2])/2);return{axis:u,hub:d,rate:t}}var jr=class{scene;lighting;shadows;batches=new Map;nextId=1;owner=new Map;cull={x:1e9,z:1e9,r:0};snow=0;lamps=0;drawDistance=1800;blankTex=null;constructor(e,t,n){this.scene=e,this.lighting=t,this.shadows=n}blank(){return this.blankTex??=x.CreateRGBATexture(new Uint8Array([255,255,255,255]),1,1,this.scene,!1),this.blankTex}batch(e){let t=this.batches.get(e);if(t)return t;t=new kr,t.look=Er[e]??{},this.batches.set(e,t);let n=t;return gr(this.scene,e,{keepOrigin:t.look.keepOrigin}).then(t=>{n.asset=t,n.look.spin&&(n.spin=Ar(t,n.look.spin));let r=n.look.value;r&&t.albedo&&Or(t.albedo).then(e=>{e>0&&(n.gain=Math.min(3.2,Math.max(.7,r/e)))});let i=[`position`,`normal`,`uv`,`instData`],a=[`uTime`,`uSpin`,`uHub`,`uTop`,`uBottom`,`uFort`,`uSnow`],o=n.look,s=o.grade??[1,1,0,1],c=o.roofStart===void 0?-1:t.height*o.roofStart,l=e=>{let r=n.spin;e.setFloat4(`uSpin`,r?r.axis.x:0,r?r.axis.y:1,r?r.axis.z:0,r?r.rate:0),e.setFloat3(`uHub`,r?r.hub.x:0,r?r.hub.y:0,r?r.hub.z:0),e.setFloat(`uTop`,t.max[1]),e.setFloat(`uBottom`,t.min[1]),e.setFloat(`uFort`,+!!o.fort),e.setFloat(`uSnow`,this.snow),e.setFloat(`uTime`,this.lighting.time)},u=(r,o)=>{let u=this.lighting.material(`prop${r}_${e}`,`prop`,{attributes:i,uniforms:[...a,`uHasAtlas`,`uHasThatch`,`uAtlasSize`,`uLamps`,`uRoofStart`,`uEave`,`uGrade`,`uGain`],samplers:[`uAtlas`,`uThatch`],defines:o});u.backFaceCulling=!1,u.onBindObservable.add(()=>{let e=u.getEffect();if(!e)return;l(e);let r=t.albedo??this.blank();e.setTexture(`uAtlas`,r),e.setTexture(`uThatch`,t.thatch??r);let i=r.getSize();e.setFloat2(`uAtlasSize`,i.width||1,i.height||1),e.setFloat(`uHasAtlas`,+!!t.albedo),e.setFloat(`uHasThatch`,+!!t.thatch),e.setFloat(`uLamps`,this.lamps),e.setFloat(`uRoofStart`,c),e.setFloat(`uEave`,t.eave),e.setFloat4(`uGrade`,s[0],s[1],s[2],s[3]),e.setFloat(`uGain`,n.gain)});let d=this.lighting.material(`propDepth${r}_${e}`,`propDepth`,{attributes:i,uniforms:a,lit:!1,defines:o});return d.backFaceCulling=!1,d.onBindObservable.add(()=>{let e=d.getEffect();e&&l(e)}),{lit:u,depth:d}},d=u(``,[]);n.lit=d.lit,n.depth=d.depth,n.building=()=>u(`Build`,[`BUILD`]),n.dirty=!0}),t}preload(e){return this.batch(e),gr(this.scene,e,{keepOrigin:(Er[e]??{}).keepOrigin})}add(e,t){let n=this.nextId++,r=this.batch(e);return r.items.set(n,t),r.dirty=!0,this.owner.set(n,e),n}update(e,t){let n=this.owner.get(e);if(!n)return;let r=this.batches.get(n),i=r.items.get(e);i&&(Object.assign(i,t),r.dirty=!0)}remove(e){let t=this.owner.get(e);if(!t)return;let n=this.batches.get(t);n.items.delete(e),n.dirty=!0,this.owner.delete(e)}heightOf(e){return this.batches.get(e)?.asset?.height??0}stats(){let e=0,t=0;for(let n of this.batches.values())n.mesh?.isEnabled()&&(e++,t+=n.visible);return{meshes:e,instances:t}}flush(){let e=this.scene.activeCamera,t=0,r=0,i=this.drawDistance;if(e){let a=e.globalPosition,o=e.getDirection(n.Forward(this.scene.useRightHandedSystem)),s=o.y<-.05?Math.min(-a.y/o.y,4e3):600;t=a.x+o.x*s,r=a.z+o.z*s,i=Math.max(this.drawDistance,a.y*4.5)}let a=this.cull,o=Math.hypot(t-a.x,r-a.z)>80||Math.abs(i-a.r)>a.r*.15;o&&(a.x=t,a.z=r,a.r=i);let s=new f,c=new u,l=new n,d=new n,p=a.r*a.r;for(let[e,t]of this.batches){if(!t.dirty&&!o||!t.asset||!t.lit)continue;t.dirty=!1,t.mesh||(t.mesh=new v(`props_${e}`,this.scene),t.asset.vertexData.applyToMesh(t.mesh),t.mesh.material=t.lit,t.mesh.isPickable=!1,t.mesh.alwaysSelectAsActiveMesh=!1,t.cascade=t.look.shadowCascade??(t.look.fort||Dr.has(e)?2:1),t.cascade>=0&&this.shadows.addCaster(t.mesh,t.depth,t.cascade),t.built??=t.building?.()??null,t.built?.lit.forceCompilation(t.mesh),t.built?.depth.forceCompilation(t.mesh));let n=[],r=t.look.far?Math.min(a.r,Math.max(t.look.far,a.r*.6)):a.r,i=Math.min(p,r*r);for(let e of t.items.values()){let t=e.x-a.x,r=e.z-a.z;t*t+r*r<=i&&n.push(e)}let m=n.length,h=new Float32Array(Math.max(1,m)*16),g=new Float32Array(Math.max(1,m)*4),_=new Float32Array(Math.max(1,m)*4);for(let e=0;e<m;e++){let t=n[e],r=t.tilt??[0,0];u.RotationYawPitchRollToRef(t.yaw,r[0],r[1],c);let i=t.scaleXYZ??[1,1,1];l.set(t.scale*i[0]*(t.mirror?-1:1),t.scale*i[1],t.scale*i[2]),d.set(t.x,t.y,t.z),f.ComposeToRef(l,c,d,s),s.copyToArray(h,e*16);let a=t.tint??[1,1,1];g[e*4]=a[0],g[e*4+1]=a[1],g[e*4+2]=a[2],g[e*4+3]=t.grow??1,_[e*4]=t.roof??0,_[e*4+1]=t.ruin??0,_[e*4+2]=t.phase??0,_[e*4+3]=t.reveal!==void 0&&t.reveal<1?Math.max(.001,1-t.reveal):t.fade!==void 0&&t.fade<1?-Math.max(.001,1-t.fade):0}let y=n.some(e=>(e.reveal??1)<1||(e.fade??1)<1);if(y!==t.rising&&t.building){t.rising=y,t.built??=t.building();let e=y?t.built:{lit:t.lit,depth:t.depth};t.mesh.material=e.lit,t.cascade>=0&&(this.shadows.removeCaster(t.mesh),this.shadows.addCaster(t.mesh,e.depth,t.cascade))}t.mesh.thinInstanceSetBuffer(`matrix`,h,16,!1),t.mesh.thinInstanceSetBuffer(`instanceColor`,g,4,!1),t.mesh.thinInstanceSetBuffer(`instData`,_,4,!1),t.mesh.thinInstanceCount=m,t.mesh.thinInstanceRefreshBoundingInfo(!1),t.mesh.setEnabled(m>0),t.visible=m}}},Mr=class{workers=[];ready=[];next=0;ids=1;pending=new Map;queue=[];inFlight=new Map;started;constructor(e,t=Math.max(2,Math.min(4,(navigator.hardwareConcurrency||4)>>2))){let n=()=>{let e=new Worker(new URL(`/harvest-crown/bundle/worker-D1rkWUP1.js`,``+import.meta.url),{type:`module`});return this.inFlight.set(e,0),e.onmessage=t=>this.onMessage(e,t.data),this.workers.push(e),this.ready.push(!1),e},r=n();this.started=new Promise(r=>{this.onReady=(i,a)=>{if(i!==0)return;let o=a;for(let r=1;r<t;r++){let t=n(),r=o.landUse;t.postMessage({type:`init`,seed:e,build:!1,landUse:{...r,habA:r.habA.slice(),habB:r.habB.slice(),habC:r.habC.slice(),tracks:r.tracks.slice(),routes:r.routes.map(e=>e.slice())}}),this.types&&t.postMessage({type:`types`,types:this.types.slice()})}r(o)}}),r.postMessage({type:`init`,seed:e,build:!0})}onReady=()=>{};onMessage(e,t){let n=this.workers.indexOf(e);if(t.type===`ready`){this.ready[n]=!0,this.onReady(n,t),this.pump();return}this.inFlight.set(e,(this.inFlight.get(e)??1)-1);let r=this.pending.get(t.id);this.pending.delete(t.id),r?.(t),this.pump()}pump(){for(;this.queue.length;){let e=null,t=3;for(let n=0;n<this.workers.length;n++){let r=this.workers[(this.next+n)%this.workers.length];if(!this.ready[this.workers.indexOf(r)])continue;let i=this.inFlight.get(r)??0;i<t&&(t=i,e=r)}if(!e)return;this.next++;let n=this.queue.shift();this.pending.set(n.msg.id,n.resolve),this.inFlight.set(e,t+1),e.postMessage(n.msg)}}request(e,t=!1){return new Promise(n=>{let r={msg:{...e,id:this.ids++},resolve:n};t?this.queue.unshift(r):this.queue.push(r),this.pump()})}get backlog(){return this.queue.length+this.pending.size}types=null;setTypes(e){this.types=e.slice();for(let t of this.workers)t.postMessage({type:`types`,types:e.slice()})}dress(e,t,n){return this.request({type:`dress`,cx:e,cz:t,full:n}).then(e=>e.dress)}meadow(e,t){return this.request({type:`meadow`,cx:e,cz:t},!0).then(e=>e.data)}wheat(e){return this.request({type:`wheat`,q:e},!0).then(e=>e.data)}},J=Math.fround;function Nr(e,t){return J(Math.sqrt(J(J(e*e)+J(t*t))))}function Pr(e,t,n,r){let i=J(e-n),a=J(t-r);return J(J(i*i)+J(a*a))}function Fr(e,t,n,r){return J(Math.sqrt(Pr(e,t,n,r)))}function Ir(e,t){return J(Math.atan2(t,e))}var Lr=[0,0,1,1,1,2,3,3,3,4];function Rr(e,t,n){let r=J(e.x),i=J(e.y),a=J(Math.cos(t)),o=J(Math.sin(t)),s=J(J(r*a)+J(i*o)),c=J(J(r*-o)+J(i*a)),l=Math.floor(s/24),u=z(l,17,n)%1e3/1e3,d=c/42+u,f=Math.floor(d),p=J(s/24-l),m=J(d-f),h=z(l,f,n+5)%4==0,g=h&&p>=.5?1:0,_=h?te(p*2,1):p,v=24*(h?.5:1),y=Math.min(Math.min(_,1-_)*v,Math.min(m,1-m)*42),b=J((l+.5)*24),x=J((f+.5-u)*42);return{cell:[l,f,g],centre:{x:J(J(b*a)+J(x*-o)),y:J(J(b*o)+J(x*a))},edge:y}}function zr(e,t){return Lr[z(e[0]*2+e[2],e[1],t+9)%10]}function Br(e,t){return z(e[0]*2+e[2],e[1],t+41)%10<6}function Vr(e,t,n,r){return t===B.FARMLAND||t===B.MEADOW&&!!(n&128)&&Br(e.cell,r)}function Hr(e){return M(te(e,Math.PI)/Math.PI*255)%256}function Ur(e){return e/255*Math.PI}Array.from({length:33},(e,t)=>2**(-32-t));var Wr=[`grass`,`reeds`,`heather`,`gorse`,`wildflowers`,`ferns`,`lavender`,`vines`],Gr={GRASS:0,REEDS:1,HEATHER:2,GORSE:3,FLOWERS:4,FERNS:5,LAVENDER:6,VINES:7};B.FOREST,W.BROADLEAF,W.BROADLEAF,W.OVAL,W.BIRCH,B.PINE,W.PINE,W.PINE,W.PINE,W.BIRCH,B.MEADOW,W.BROADLEAF,W.BUSH,B.HILLS,W.BROADLEAF,W.BUSH,W.PINE,B.MOOR,W.BROADLEAF,W.BUSH,B.FEN,W.WILLOW,W.WILLOW,W.BUSH,B.SOUTH,W.CYPRESS,W.OLIVE,W.OLIVE,B.MOUNTAIN,W.PINE,B.FARMLAND,W.BROADLEAF,W.BUSH,B.MEADOW,B.HILLS,B.MOOR,B.FEN,B.SOUTH,B.MOOR,B.HILLS,B.MOUNTAIN,B.PINE,B.SOUTH,B.PEAK;function Kr(e,t,n,r,i,a,o,s,c=0,l=.15){let u=[-n[1],0,n[0]],d=e.count;for(let d=0;d<=o;d++){let f=d/o,p=a*f*f,m=t[0]+n[0]*p,h=t[1]+r*f*(1-.25*a*f),g=t[2]+n[1]*p,_=i*(1-f*(1-l)),v=K(n[0]*.5,1,n[1]*.5),y=.35+.65*f;e.v(m+u[0]*_,h,g+u[2]*_,v[0],v[1],v[2],y,c,s,f,s,f),e.v(m-u[0]*_,h,g-u[2]*_,v[0],v[1],v[2],y,c,s,f,s,f)}for(let t=0;t<o;t++){let n=d+t*2;e.tri(n,n+2,n+1),e.tri(n+1,n+2,n+3)}}function qr(e,t,n,r,i=0){let{verts:a,levels:o}=cn(n),s=o[n],c=10*4**n+2,l=0;for(let e of t)l=Math.max(l,e[1]+e[3]);t.forEach((t,n)=>{let o=e.count;for(let o=0;o<c;o++){let s=a[o],c=1+(dn(s[0]*2.3+n*3.1+r,s[1]*2.3,s[2]*2.3)-.5)*.35,u=t[0]+s[0]*t[3]*c,d=t[2]+s[2]*t[3]*c,f=Math.max(-.05,t[1]+s[1]*t[3]*.8*c),p=Math.min(1,Math.max(0,f/l)),m=K(s[0],s[1]*.8+.25,s[2]);e.v(u,f,d,m[0],m[1],m[2],.35+.65*p,i,n*.618%1,p,n*.37%1,p*.5)}for(let t=0;t<s.length;t+=3)e.tri(o+s[t],o+s[t+2],o+s[t+1])})}function Jr(e){let t=new on,n=ln(9001),r=e===0?14:8;for(let i=0;i<r;i++){let r=n.next()*Math.PI*2,i=Math.sqrt(n.next())*.22,a=n.next()*Math.PI*2;Kr(t,[Math.cos(r)*i,0,Math.sin(r)*i],[Math.cos(a),Math.sin(a)],n.range(.22,.42),n.range(.035,.05),n.range(.08,.2),e===0?3:2,n.next())}return t}function Yr(e){let t=new on,n=ln(4111),r=e===0?18:9;for(let i=0;i<r;i++){let r=n.next()*Math.PI*2,i=Math.sqrt(n.next())*.32,a=r+n.range(-.6,.6);Kr(t,[Math.cos(r)*i,0,Math.sin(r)*i],[Math.cos(a),Math.sin(a)],n.range(.9,1.7),n.range(.045,.065),n.range(.2,.5),e===0?4:2,n.next(),0,.15)}for(let r=0;r<(e===0?4:2);r++){let e=n.next()*Math.PI*2,r=n.next()*.2,i=Math.cos(e)*r,a=Math.sin(e)*r,o=n.range(1.4,1.9);Kr(t,[i,0,a],[1,0],o,.012,.05,2,n.next(),0,.8),Kr(t,[i,o-.05,a],[1,0],.22,.045,0,1,n.next(),.5,.9),Kr(t,[i,o-.05,a],[0,1],.22,.045,0,1,n.next(),.5,.9)}return t}function Xr(e){let t=new on,n=ln(777),r=[];if(e>0)return r.push([0,.02,0,.42],[.32,0,.1,.3],[-.25,0,-.2,.3]),qr(t,r,1,3),t;for(let e=0;e<8;e++){let t=e/8*Math.PI*2+n.range(-.3,.3),i=n.range(.15,.5);r.push([Math.cos(t)*i,n.range(0,.08),Math.sin(t)*i,n.range(.22,.34)])}return qr(t,r,e===0?2:1,3),t}function Zr(e){let t=new on,n=ln(1777),r=[[0,.45,0,.55]];if(e>0)return r.push([.4,.3,.1,.42],[-.3,.3,-.3,.42]),qr(t,r,1,7),t;for(let e=0;e<6;e++){let t=e/6*Math.PI*2+n.range(-.3,.3),i=n.range(.35,.55);r.push([Math.cos(t)*i,n.range(.15,.45),Math.sin(t)*i,n.range(.32,.45)])}return qr(t,r,e===0?2:1,7),t}function Qr(e){let t=new on,n=ln(31337);for(let r=0;r<(e===0?6:3);r++){let e=n.next()*Math.PI*2;Kr(t,[0,0,0],[Math.cos(e),Math.sin(e)],n.range(.12,.2),.04,.12,2,n.next(),0,.3)}let r=e===0?9:5;for(let e=0;e<r;e++){let e=n.next()*Math.PI*2,r=Math.sqrt(n.next())*.18,i=Math.cos(e)*r,a=Math.sin(e)*r,o=n.range(.22,.42),s=n.next();Kr(t,[0,0,0],[i/(r||1),a/(r||1)],o,.008,r,2,s,0,1);let c=n.range(.035,.055),l=t.count;t.v(i,o+.01,a,0,1,0,1,.5,s,1,s,1);for(let e=0;e<=10;e++){let n=e/10*Math.PI*2,r=e%2==0?c:c*.55;t.v(i+Math.cos(n)*r,o+.012+r*.25,a+Math.sin(n)*r,Math.cos(n)*.3,1,Math.sin(n)*.3,1,1,s,1,s,1)}for(let e=0;e<10;e++)t.tri(l,l+2+e,l+1+e)}return t}function $r(e){let t=new on,n=ln(2468),r=e===0?7:5;for(let i=0;i<r;i++){let a=i/r*Math.PI*2+n.range(-.3,.3),o=[Math.cos(a),Math.sin(a)],s=n.range(.55,.85);Kr(t,[0,0,0],o,s*.75,n.range(.09,.13),s*.9,e===0?5:3,n.next(),0,.1)}return t}function ei(e){let t=new on,n=ln(5150),r=[];for(let e=0;e<5;e++){let t=e/5*Math.PI*2,i=n.range(.1,.3);r.push([Math.cos(t)*i,n.range(.05,.15),Math.sin(t)*i,n.range(.2,.28)])}qr(t,e===0?r:r.slice(0,3),1,11);let i=e===0?22:8;for(let e=0;e<i;e++){let e=n.next()*Math.PI*2,r=Math.sqrt(n.next())*.35,i=Math.cos(e)*r,a=Math.sin(e)*r,o=n.range(.45,.65),s=n.next();Kr(t,[i,.2,a],[Math.cos(e),Math.sin(e)],o-.2,.012,r*.4,2,s,0,1),Kr(t,[i+Math.cos(e)*r*.4,o-.02,a+Math.sin(e)*r*.4],[Math.cos(e+1.2),Math.sin(e+1.2)],.14,.03,.02,2,s,1,.5)}return t}function ti(e){let t=new on,n=ln(8123),r=[],i=e===0?5:3;for(let t=0;t<i;t++){let a=-.82+1.64*t/(i-1);r.push([a+n.range(-.08,.08),n.range(.78,.9),n.range(-.05,.05),n.range(.3,.36)*(e===0?1:1.15)])}qr(t,r,e===0?2:1,23);for(let e=1;e<t.positions.length;e+=3)t.positions[e]=Math.max(t.positions[e],.46);return Kr(t,[0,0,0],[1,0],.62,.035,.02,1,.5,0,.8),Kr(t,[0,0,0],[0,1],.62,.035,.02,1,.5,0,.8),t}function ni(e,t){switch(e){case Gr.GRASS:return Jr(t);case Gr.REEDS:return Yr(t);case Gr.HEATHER:return Xr(t);case Gr.GORSE:return Zr(t);case Gr.FLOWERS:return Qr(t);case Gr.FERNS:return $r(t);case Gr.VINES:return ti(t);default:return ei(t)}}var ri=32,ii=3.5,ai=45,oi=[95,260,380,380,120,220,300,330],si=Wr.length,Y=(e,t,n)=>new b(e,t,n).toLinearSpace(),ci={base:Y(.24,.29,.1),tip:Y(.48,.51,.21),dry:Y(.59,.49,.26),fresh:Y(.36,.52,.14),fa:Y(1,1,1),fb:Y(1,1,1),fc:Y(1,1,1),fd:Y(1,1,1),sway:.6,trans:.55,hueVar:.24,dab:0,dabScale:10,dabDensity:.7,dabTop:0,dabFar:.5},li=[{...ci},{...ci,base:Y(.17,.26,.08),tip:Y(.46,.53,.19),dry:Y(.64,.52,.3),fresh:Y(.32,.48,.13),fa:Y(.3,.17,.08),fb:Y(.3,.17,.08),sway:1,trans:.8,hueVar:.15},{...ci,base:Y(.2,.17,.11),tip:Y(.34,.29,.17),dry:Y(.38,.27,.18),fresh:Y(.24,.29,.13),fa:Y(.54,.38,.5),fb:Y(.64,.5,.6),sway:.12,trans:.3,hueVar:.2,dab:1,dabScale:18,dabDensity:.64},{...ci,base:Y(.07,.13,.05),tip:Y(.16,.24,.08),dry:Y(.26,.22,.11),fresh:Y(.16,.26,.08),fa:Y(.92,.74,.14),fb:Y(.96,.84,.34),sway:.08,trans:.25,hueVar:.18,dab:1,dabScale:16,dabDensity:.68,dabFar:.3},{...ci,base:Y(.15,.25,.07),tip:Y(.33,.45,.13),dry:Y(.56,.48,.26),fa:Y(.72,.2,.12),fb:Y(.2,.38,.92),fc:Y(.96,.95,.9),fd:Y(1,.82,.15),sway:.8,trans:.7},{...ci,base:Y(.09,.2,.05),tip:Y(.33,.49,.13),dry:Y(.62,.33,.12),fresh:Y(.44,.62,.17),sway:.45,trans:.9,hueVar:.2},{...ci,base:Y(.2,.26,.17),tip:Y(.36,.43,.29),dry:Y(.4,.4,.3),fresh:Y(.3,.4,.22),fa:Y(.46,.34,.76),fb:Y(.6,.48,.88),sway:.35,trans:.4,hueVar:.15,dab:1,dabScale:10,dabDensity:.8,dabTop:1},{...ci,base:Y(.15,.23,.07),tip:Y(.36,.47,.14),dry:Y(.58,.44,.17),fresh:Y(.34,.52,.14),fa:Y(.26,.11,.21),fb:Y(.38,.16,.3),sway:.15,trans:.55,hueVar:.12,dab:1,dabScale:13,dabDensity:.74,dabFar:.25}],ui=[1,.45,.35,.25,1,1,.35,.3],di=[[[1,0,.65,0,.75],[1,0,0,0,1],[1,.65,0,0,1],[1,1,0,1,.22]],[[.35,0,1,0,1],[1,.08,0,0,1],[1,.6,0,0,1],[1,1,0,1,.85]],[[.06,.25,.4,0,1],[.85,0,0,0,1],[1,.1,0,0,1],[0,.75,0,1,1]],[[1,0,0,0,1],[.55,0,0,0,1],[.3,0,0,0,1],[.15,0,0,1,1]],[[.8,0,1,0,.75],[1,0,0,0,1],[.25,.55,0,0,.9],[0,1,0,0,0]],[[1,0,1,0,.8],[1,0,0,0,1],[1,.85,0,0,1],[1,1,0,1,.5]],[[.12,0,.5,0,1],[1,0,0,0,1],[.4,.2,0,0,1],[0,.3,0,1,1]],[[0,0,1,0,.6],[0,0,0,0,1],[1,.5,0,0,1],[0,1,0,1,.4]]],fi=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 uv;
attribute vec4 world0;
attribute vec4 world1;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uLodCam;
uniform vec4 uBand;     // band start, band end, view distance, height-fade on
uniform vec4 uKindSeason; // bloom, dry, fresh, height scale
uniform float uSway;
${Nn}
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vUv;
varying vec2 vInst;
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  float jit = 0.9 + 0.2 * world1.y;
  float fade = 1.0 - smoothstep(uBand.z * 0.75, uBand.z, d);
  // Grass and flowers sink away as the camera climbs (gone by the board view).
  fade *= mix(1.0, 1.0 - smoothstep(22.0, 44.0, uLodCam.y - origin.y), uBand.w);
  // Flower parts only show on clumps whose random falls under the bloom.
  bool flower = color.g > 0.25;
  float h = uKindSeason.w * fade * smoothstep(0.0, 1.0, clamp((uClock - world1.z) / 0.5, 0.0, 1.0));
  if (d < uBand.x * jit || d > uBand.y * jit || fade <= 0.001 || h <= 0.001 || (flower && world1.y > uKindSeason.x)) {
    gl_Position = CULLED;
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vUv = vec2(0.0); vInst = vec2(0.0);
    return;
  }
  vec3 p = position * world1.x;
  p.y *= h;
  float c = cos(world0.w), s = sin(world0.w);
  vec3 wp = origin + vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  // Gusts sweep across the meadow, bending tips more than roots.
  vec2 wd = normalize(uWind.xy);
  float n = sin(dot(origin.xz, wd) * 0.3 - uTime * 2.0) * 0.5 + 0.5;
  float gust = smoothstep(0.3, 0.9, n) * (0.5 + 0.5 * sin(dot(origin.xz, vec2(-wd.y, wd.x)) * 0.11 + uTime * 0.7));
  float bend = uSway * (0.05 + 0.22 * gust + 0.05 * sin(uTime * 3.1 + world1.y * 30.0 + color.b * 6.0));
  wp.xz += wd * bend * uv.y * uv.y * uWind.z * world1.x;
  wp.y -= bend * bend * uv.y * 0.3;
  vWorld = wp;
  vNormal = normalize(vec3(c * normal.x + s * normal.z, normal.y, -s * normal.x + c * normal.z));
  vColor = color;
  vUv = uv;
  vInst = world1.yw;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`cover`,fi,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vUv;
varying vec2 vInst;
${V}
${H}
${Mn}
uniform vec3 uBase;
uniform vec3 uTip;
uniform vec3 uDry;
uniform vec3 uFresh;
uniform vec3 uFlowerA;
uniform vec3 uFlowerB;
uniform vec3 uFlowerC;
uniform vec3 uFlowerD;
uniform vec4 uKindSeason;
uniform vec4 uLookK;   // translucency, hue var, dab flowers, dab scale
uniform vec3 uLookK2;  // dab density, dab top only, far tint
uniform float uKindSnow;
uniform float uSpecies; // 1 = wildflowers pick a species by drift
void main() {
  vec3 n = normalize(vNormal);
  float hgt = vColor.a, part = vColor.g, rnd = vColor.b;
  float inst = vInst.x;
  float noise = vnoise(vWorld.xz * 1.7 + rnd * 9.0);
  vec3 col = mix(uBase, uTip, hgt) * (1.0 + (inst - 0.5) * 2.0 * uLookK.y) * (0.9 + 0.2 * noise);
  col = mix(col, uFresh * (0.8 + 0.4 * hgt), uKindSeason.z * 0.6);
  col = mix(col, uDry * (0.85 + 0.25 * hgt), uKindSeason.y);
  if (part > 0.75) {
    vec3 fc = uFlowerA;
    if (uSpecies > 0.5) {
      // Single-species drifts on a 5 m grid: poppy, cornflower, daisy, buttercup.
      float drift = hash12(floor(vWorld.xz / 5.0) + 3.7);
      fc = drift < 0.10 ? uFlowerA : drift < 0.22 ? uFlowerB : drift < 0.78 ? uFlowerC : uFlowerD;
    } else fc = mix(uFlowerA, uFlowerB, rnd);
    col = fc * (0.9 + 0.2 * noise);
  } else if (part > 0.25) col = uSpecies > 0.5 ? vec3(0.8, 0.55, 0.02) : uFlowerA * 0.8;
  if (uLookK.z > 0.5) {
    // Mound kinds: flower dabs on the up-facing top, settling into a tint where they are sub-pixel.
    float dn = vnoise(vWorld.xz * uLookK.w + vWorld.y * 3.0);
    float lod = 1.0 - smoothstep(0.3, 1.2, fwidth(vWorld.x * uLookK.w));
    float dab = smoothstep(uLookK2.x, uLookK2.x + 0.08, dn) * smoothstep(0.1, 0.5, n.y) * mix(1.0, smoothstep(0.55, 0.85, hgt), uLookK2.y);
    vec3 fc = mix(uFlowerA, uFlowerB, step(0.5, hash12(floor(vWorld.xz * uLookK.w))));
    float amt = mix(dab * 0.85, (1.0 - uLookK2.x) * uLookK2.z, 1.0 - lod) * uKindSeason.x;
    col = mix(col, fc, clamp(amt, 0.0, 1.0));
  }
  float snow = uSnowFx.x * uKindSnow;
  if (snow > 0.0) col = mix(col, vec3(0.79, 0.85, 1.0), smoothstep(0.2, 0.7, n.y) * snowCoverage(snow, vWorld.xz) * 0.85);
  float ao = mix(0.55, 1.0, vColor.r);
  float sh;
  vec3 lit = shade(col, n, vWorld, ao, 0.55, sh);
  vec3 v = normalize(uCamPos - vWorld);
  float back = pow(clamp(dot(-uSunDir, v), 0.0, 1.0), 2.5);
  float lowSun = 1.0 - smoothstep(0.1, 0.6, uSunDir.y);
  lit += mix(uTip * 1.6, col, 0.4) * uSunColor * 0.7 * uLookK.x * back * (0.3 + 0.7 * lowSun) * (0.35 + 0.65 * hgt) * mix(sh, 1.0, 0.4);
  lit = atmosphere(lit, vWorld);
  gl_FragColor = vec4(lit, viewDepth01(vWorld));
}
`),U(`coverDepth`,fi,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var pi=class{scene;lighting;shadows;veg;client;kinds=[];chunks=new Map;meadow=new Map;at={x:1e9,z:1e9};dirty=!0;enabled=!0;counts=Array(si).fill(0);constructor(e,t,n,r,i){this.scene=e,this.lighting=t,this.shadows=n,this.veg=r,this.client=i}kind(e){let t=this.kinds[e];if(t)return t;let n=e===Gr.GRASS||e===Gr.FLOWERS?1:2,r=[],i=[],a=li[e],o=[1,0,0,1,0];for(let t=0;t<n;t++){let s=ni(e,t).arrays(),c=new S;c.positions=s.positions,c.normals=s.normals,c.colors=s.colors,c.uvs=s.uvs,c.indices=s.indices,r.push(c);let l=n===1?[0,1e6]:t===0?[0,ai]:[ai,1e6],u=this.lighting.material(`cover_${e}_${t}`,`cover`,{attributes:[`position`,`normal`,`color`,`uv`],uniforms:[`uLodCam`,`uBand`,`uKindSeason`,`uSway`,`uBase`,`uTip`,`uDry`,`uFresh`,`uFlowerA`,`uFlowerB`,`uFlowerC`,`uFlowerD`,`uLookK`,`uLookK2`,`uKindSnow`,`uSpecies`,...An],samplers:jn});u.backFaceCulling=!1,u.onBindObservable.add(()=>{let t=u.getEffect();t&&(t.setVector3(`uLodCam`,this.lighting.camPos),t.setFloat4(`uBand`,l[0],l[1],oi[e],+(e===Gr.GRASS||e===Gr.FLOWERS)),t.setFloat4(`uKindSeason`,o[0],o[1],o[2],o[3]),t.setFloat(`uSway`,a.sway),t.setColor3(`uBase`,a.base),t.setColor3(`uTip`,a.tip),t.setColor3(`uDry`,a.dry),t.setColor3(`uFresh`,a.fresh),t.setColor3(`uFlowerA`,a.fa),t.setColor3(`uFlowerB`,a.fb),t.setColor3(`uFlowerC`,a.fc),t.setColor3(`uFlowerD`,a.fd),t.setFloat4(`uLookK`,a.trans,a.hueVar,a.dab,a.dabScale),t.setFloat3(`uLookK2`,a.dabDensity,a.dabTop,a.dabFar),t.setFloat(`uKindSnow`,o[4]),t.setFloat(`uSpecies`,+(e===Gr.FLOWERS)),this.veg.bind(t))}),i.push(u)}let s=null;if(e===Gr.HEATHER||e===Gr.GORSE||e===Gr.FERNS||e===Gr.LAVENDER||e===Gr.VINES){s=this.lighting.material(`coverDepth_${e}`,`coverDepth`,{attributes:[`position`,`normal`,`color`,`uv`],uniforms:[`uLodCam`,`uBand`,`uKindSeason`,`uSway`,`uTime`,...An],samplers:jn,lit:!1});let t=s;t.onBindObservable.add(()=>{let n=t.getEffect();n&&(n.setVector3(`uLodCam`,this.lighting.camPos),n.setFloat4(`uBand`,0,ai,oi[e],0),n.setFloat4(`uKindSeason`,o[0],o[1],o[2],o[3]),n.setFloat(`uSway`,a.sway),n.setFloat(`uTime`,this.lighting.time),this.veg.bind(n))})}return t={vd:r,lit:i,depth:s,meshes:Array(n).fill(null),season:o},this.kinds[e]=t,this.applySeason(e),t}applySeason(e){let t=this.kinds[e];if(!t)return;let n=this.veg.season.weights,r=[0,0,0,0,0];for(let t=0;t<4;t++)for(let i=0;i<5;i++)r[i]+=di[e][t][i]*n[t];t.season[0]=r[0],t.season[1]=r[1],t.season[2]=r[2],t.season[3]=r[4]*(1-this.veg.season.snow*ui[e]),t.season[4]=r[3]}setChunk(e,t,n){this.chunks.set((e+64)*128+(t+64),n),this.dirty=!0}clearChunk(e,t){this.chunks.delete((e+64)*128+(t+64))&&(this.dirty=!0)}invalidate(){this.meadow.clear(),this.dirty=!0}update(e,t,n,r){for(let e=0;e<si;e++)this.kinds[e]&&this.applySeason(e);let i=r<64;if(i){let t=Math.floor(e/ri),r=Math.floor(n/ri),i=Math.ceil(ii);for(let e=-4;e<=i;e++)for(let n=-4;n<=i;n++){if(Math.hypot(n,e)>ii)continue;let i=(t+n+512)*1024+(r+e+512);this.meadow.has(i)||(this.meadow.set(i,null),this.client.meadow(t+n,r+e).then(e=>{this.meadow.has(i)&&(this.meadow.set(i,e),this.dirty=!0)}))}for(let e of this.meadow.keys()){let n=Math.floor(e/1024)-512,i=e%1024-512;Math.hypot(n-t,i-r)>5.5&&this.meadow.delete(e)}}!this.dirty&&Math.hypot(e-this.at.x,n-this.at.z)<12||(this.dirty=!1,this.at={x:e,z:n},this.rebuild(e,n,i))}rebuild(e,t,r){let i=Array.from({length:si},()=>[]),a=this.veg.clock,o=(n,o)=>{let s=n[o+5],c=n[o]-e,l=n[o+2]-t,u=oi[s]+10;c*c+l*l>u*u||(s!==Gr.GRASS&&s!==Gr.FLOWERS||r)&&i[s].push(n[o],n[o+1],n[o+2],n[o+3],n[o+4],n[o+6],a-5,s,0,0,0,0,0,0,0,0)};if(this.enabled){for(let[n,r]of this.chunks){let i=Math.floor(n/128)-64,a=n%128-64;if(!(Math.hypot(i*256+128-e,a*256+128-t)>570))for(let e=0;e<r.length;e+=8)o(r,e)}if(r){for(let e of this.meadow.values())if(e)for(let t=0;t<e.length;t+=8)o(e,t)}}for(let r=0;r<si;r++){this.counts[r]=i[r].length/16;let a=i[r].length?this.kind(r):this.kinds[r];if(a)for(let o=0;o<a.meshes.length;o++){let s=a.meshes[o];if(s&&(this.shadows.removeCaster(s),s.dispose(),a.meshes[o]=null),!i[r].length)continue;let c=i[r],l=c;if(a.meshes.length>1){l=[];let n=o===0?0:ai*.85-20,r=o===0?71.75:1e9;for(let i=0;i<c.length;i+=16){let a=Math.hypot(c[i]-e,c[i+2]-t);if(a>=n&&a<=r)for(let e=0;e<16;e++)l.push(c[i+e])}if(!l.length)continue}let u=new Float32Array(l),d=new v(`cover_${Wr[r]}_${o}`,this.scene);a.vd[o].applyToMesh(d,!1),d.isPickable=!1,d.doNotSyncBoundingInfo=!0,d.thinInstanceSetBuffer(`matrix`,u,16,!0);let f=1/0,p=1/0,m=1/0,h=-1/0,g=-1/0,_=-1/0;for(let e=0;e<u.length;e+=16)f=Math.min(f,u[e]),h=Math.max(h,u[e]),p=Math.min(p,u[e+1]),g=Math.max(g,u[e+1]),m=Math.min(m,u[e+2]),_=Math.max(_,u[e+2]);d.setBoundingInfo(new y(new n(f-2,p-1,m-2),new n(h+2,g+3,_+2))),d.material=a.lit[o],o===0&&a.depth&&this.shadows.addCaster(d,a.depth,0),a.meshes[o]=d}}}get stats(){let e=0;for(let t of this.kinds)if(t)for(let n of t.meshes)n&&e++;let t={coverMeshes:e};return Wr.forEach((e,n)=>{this.counts[n]&&(t[`cover_${e}`]=this.counts[n])}),t}},mi=150,hi=1100;function gi(e,t){let{verts:n,levels:r}=cn(t),i=r[t],a=10*4**t+2,o=ln(e?6271:3517),s=e?3.2:4,c=[],l=5+Math.floor(o.next()*3);for(let e=0;e<l;e++){let e=K(o.normal(),o.normal()*.6+.2,o.normal());c.push([e,o.range(.74,.9)])}let u=[];for(let t=0;t<a;t++){let r=n[t],i=(Math.abs(r[0])**+s+Math.abs(r[1])**+s+Math.abs(r[2])**+s)**(1/s),a=[r[0]/i,r[1]/i,r[2]/i];for(let[e,t]of c){let n=a[0]*e[0]+a[1]*e[1]+a[2]*e[2]-t;n>0&&(a=[a[0]-e[0]*n,a[1]-e[1]*n,a[2]-e[2]*n])}let o=1+(dn(a[0]*2.2+e*5,a[1]*2.2,a[2]*2.2)-.5)*.18;if(a=[a[0]*o,a[1]*o,a[2]*o],e){let e=1-.07*(1-Math.abs(Math.sin(a[1]*7.5)))**3;a=[a[0]*e,a[1],a[2]*e]}a[1]=Math.max(a[1],-.85),u.push(a)}let d=Array.from({length:a},()=>[0,0,0]);for(let e=0;e<i.length;e+=3){let t=u[i[e]],n=u[i[e+1]],r=u[i[e+2]],a=n[0]-t[0],o=n[1]-t[1],s=n[2]-t[2],c=r[0]-t[0],l=r[1]-t[1],f=r[2]-t[2],p=[o*f-s*l,s*c-a*f,a*l-o*c];for(let t of[i[e],i[e+1],i[e+2]])d[t][0]+=p[0],d[t][1]+=p[1],d[t][2]+=p[2]}let f=new on;for(let e=0;e<a;e++){let t=u[e],n=K(d[e][0],d[e][1],d[e][2]),r=(t[1]+.85)/1.85,i=.5+.5*Math.min(1,Math.max(0,r*1.4))*(.75+.25*Math.max(0,n[1]));f.v(t[0],t[1],t[2],n[0],n[1],n[2],i,r,0,1)}for(let e=0;e<i.length;e+=3)f.tri(i[e],i[e+2],i[e+1]);return f}var _i=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;
uniform mat4 viewProjection;
uniform vec3 uLodCam;
uniform vec3 uBand; // start, end, view distance
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vObj;
varying vec2 vInst;
float rh(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float rn(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(rh(i), rh(i + vec3(1, 0, 0)), u.x), mix(rh(i + vec3(0, 1, 0)), rh(i + vec3(1, 1, 0)), u.x), u.y),
             mix(mix(rh(i + vec3(0, 0, 1)), rh(i + vec3(1, 0, 1)), u.x), mix(rh(i + vec3(0, 1, 1)), rh(i + vec3(1, 1, 1)), u.x), u.y), u.z);
}
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  float jit = 0.9 + 0.2 * world3.x;
  if (d < uBand.x * jit || d > uBand.y * jit || d > uBand.z) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vObj = vec3(0.0); vInst = vec2(0.0);
    return;
  }
  vec3 p = position;
  p += normal * (rn(p * 1.3 + world3.x * 31.0) - 0.5) * 0.22;
  vObj = p;
  vec3 s = world1.xyz;
  vec3 ps = p * s;
  // Tilt about x and z, then yaw.
  float tx = world2.x, tz = world2.y;
  ps = vec3(ps.x, ps.y * cos(tx) - ps.z * sin(tx), ps.y * sin(tx) + ps.z * cos(tx));
  ps = vec3(ps.x * cos(tz) - ps.y * sin(tz), ps.x * sin(tz) + ps.y * cos(tz), ps.z);
  float c = cos(world0.w), sn = sin(world0.w);
  vec3 wp = origin + vec3(c * ps.x + sn * ps.z, ps.y, -sn * ps.x + c * ps.z);
  vec3 n = normal / s;
  n = vec3(n.x, n.y * cos(tx) - n.z * sin(tx), n.y * sin(tx) + n.z * cos(tx));
  n = vec3(n.x * cos(tz) - n.y * sin(tz), n.x * sin(tz) + n.y * cos(tz), n.z);
  vNormal = normalize(vec3(c * n.x + sn * n.z, n.y, -sn * n.x + c * n.z));
  vWorld = wp;
  vColor = color;
  vInst = vec2(world2.z, world2.w);
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`rock`,_i,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec3 vObj;
varying vec2 vInst;
${V}
${H}
${Mn}
void main() {
  vec3 n = normalize(vNormal);
  float tone = vInst.x, style = vInst.y;
  bool lime = style > 0.5;
  // Granite dark to light, limestone pale, colours from the original (sRGB) in linear.
  vec3 dark = lime ? vec3(0.319, 0.262, 0.171) : vec3(0.120, 0.107, 0.089);
  vec3 light = lime ? vec3(0.753, 0.672, 0.479) : vec3(0.367, 0.330, 0.274);
  vec3 q = vWorld * 0.9;
  float big = vnoised(q * 0.6).x, fine = vnoised(q * 3.1 + 7.0).x;
  vec3 col = mix(dark, light, clamp(0.35 + tone * 0.3 + (big - 0.5) * 0.6 + (fine - 0.5) * 0.2, 0.0, 1.0));
  if (lime) {
    float strata = abs(fract(vWorld.y * 1.6 + big * 0.8) - 0.5);
    col *= 0.86 + 0.18 * smoothstep(0.05, 0.25, strata);
  }
  // Cracks: thin ridges of value noise, darker in granite.
  float cr = abs(vnoised(q * 1.7 + 3.0).x - 0.5);
  float crack = (1.0 - smoothstep(0.02, 0.06, cr)) * (lime ? 0.35 : 0.7) * (1.0 - smoothstep(0.3, 1.2, fwidth(q.x * 1.7) * 6.0));
  col = mix(col, vec3(0.133, 0.100, 0.069), crack * 0.6);
  // Lichen on the upper faces, moss where the stone meets the turf.
  float up = smoothstep(0.1, 0.8, n.y);
  float lich = smoothstep(0.55, 0.7, vnoised(q * 1.2 + 11.0).x) * up * (lime ? 0.3 : 0.75);
  col = mix(col, mix(vec3(0.509, 0.479, 0.198), vec3(0.342, 0.342, 0.296), fine), lich);
  float moss = (1.0 - smoothstep(0.0, 0.35, vColor.g)) * smoothstep(0.45, 0.6, big + up * 0.2) * (lime ? 0.3 : 0.6);
  col = mix(col, vec3(0.147, 0.162, 0.033), moss);
  float snow = uSnowFx.x;
  float sm = snow > 0.0 ? smoothstep(0.45, 0.8, n.y + (fine - 0.5) * 0.3) * snowCoverage(snow, vWorld.xz) : 0.0;
  col = mix(col, vec3(0.79, 0.84, 0.93), sm);
  float ao = vColor.r * (0.8 + 0.2 * fine);
  float sh;
  vec3 lit = shade(col, n, vWorld, ao, 0.2, sh);
  lit = atmosphere(lit, vWorld);
  gl_FragColor = vec4(lit, viewDepth01(vWorld));
}
`),U(`rockDepth`,_i,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var vi=class{scene;shadows;chunks=new Map;vd=[];lit=[];depth=[];meshes=[null,null,null,null];at={x:1e9,z:1e9};dirty=!0;count=0;enabled=!0;constructor(e,t,n,r){this.scene=e,this.shadows=n;for(let e=0;e<2;e++)this.vd.push([3,2].map(t=>{let n=gi(e,t).arrays(),r=new S;return r.positions=n.positions,r.normals=n.normals,r.colors=n.colors,r.indices=n.indices,r}));for(let e=0;e<2;e++){let n=e===0?[0,mi]:[mi,1e6],i=t.material(`rock_${e}`,`rock`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,`uBand`,...An],samplers:jn});i.onBindObservable.add(()=>{let e=i.getEffect();e&&(e.setVector3(`uLodCam`,t.camPos),e.setFloat3(`uBand`,n[0],n[1],hi),r.bind(e))}),this.lit.push(i);let a=t.material(`rockDepth_${e}`,`rockDepth`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,`uBand`],lit:!1});a.onBindObservable.add(()=>{let e=a.getEffect();e&&(e.setVector3(`uLodCam`,t.camPos),e.setFloat3(`uBand`,n[0],n[1],hi))}),this.depth.push(a)}}setChunk(e,t,n){this.chunks.set((e+64)*128+(t+64),n),this.dirty=!0}clearChunk(e,t){this.chunks.delete((e+64)*128+(t+64))&&(this.dirty=!0)}update(e,t,r){if(!this.dirty&&Math.hypot(e-this.at.x,r-this.at.z)<30)return;this.dirty=!1,this.at={x:e,z:r};let i=[[],[]];if(this.enabled)for(let[t,n]of this.chunks){let a=Math.floor(t/128)-64,o=t%128-64;if(!(Math.hypot(a*256+128-e,o*256+128-r)>1300))for(let t=0;t<n.length;t+=16){if(Math.hypot(n[t]-e,n[t+2]-r)>1120)continue;let a=i[n[t+11]];for(let e=0;e<16;e++)a.push(n[t+e])}}this.count=(i[0].length+i[1].length)/16;for(let t=0;t<2;t++)for(let a=0;a<2;a++){let o=t*2+a,s=this.meshes[o];s&&(this.shadows.removeCaster(s),s.dispose(),this.meshes[o]=null);let c=a===0?0:mi*.85-20,l=a===0?222.5:1e9,u=[],d=i[t];for(let t=0;t<d.length;t+=16){let n=Math.hypot(d[t]-e,d[t+2]-r);if(n>=c&&n<=l)for(let e=0;e<16;e++)u.push(d[t+e])}if(!u.length)continue;let f=new Float32Array(u),p=new v(`rock_${t}_${a}`,this.scene);this.vd[t][a].applyToMesh(p,!1),p.isPickable=!1,p.doNotSyncBoundingInfo=!0,p.thinInstanceSetBuffer(`matrix`,f,16,!0);let m=1/0,h=1/0,g=1/0,_=-1/0,b=-1/0,x=-1/0;for(let e=0;e<f.length;e+=16)m=Math.min(m,f[e]),_=Math.max(_,f[e]),h=Math.min(h,f[e+1]),b=Math.max(b,f[e+1]),g=Math.min(g,f[e+2]),x=Math.max(x,f[e+2]);p.setBoundingInfo(new y(new n(m-6,h-3,g-6),new n(_+6,b+8,x+6))),p.material=this.lit[a],this.shadows.addCaster(p,this.depth[a],1),this.meshes[o]=p}}get stats(){return{rocks:this.count,rockMeshes:this.meshes.filter(Boolean).length}}},yi=[0,20,55,112],bi=yi[3],xi=0;function Si(e){let t=new on,n=ln(4242),r=[8,6,4][e],i=[2,2,1][e],a=[.014,.02,.032][e],o=[1,1.2,1.6][e];for(let s=0;s<9;s++){let c=n.next()*Math.PI*2,l=Math.sqrt(n.next())*.1,u=Math.cos(c)*l,d=Math.sin(c)*l,f=c+n.range(-.7,.7),p=[Math.cos(f),0,Math.sin(f)],m=[-p[2],0,p[0]],h=n.range(.74,.96),g=n.range(2,10)*Math.PI/180,_=n.range(18,42)*Math.PI/180,v=n.range(.1,.13),y=n.range(.018,.022)*o,b=n.next();if(s>=r)continue;let x=[[u,0,d]],S=[u,0,d],C=[0,1,0];for(let e=0;e<12;e++){let t=(e+.5)/12,n=g+(_-g)*t**2.5;C=[p[0]*Math.sin(n),Math.cos(n),p[2]*Math.sin(n)],S=[S[0]+C[0]*h/12,S[1]+C[1]*h/12,S[2]+C[2]*h/12],x.push(S)}let w=K(p[0]*.45+u*3,.85,p[2]*.45+d*3),T=t.count;for(let e=0;e<=i;e++){let n=x[Math.round(e/i*12)],r=a*(1-e/i*.35),o=.3+.7*Math.min(1,n[1]/.85);for(let e of[1,-1])t.v(n[0]+m[0]*r*e,n[1],n[2]+m[2]*r*e,w[0],w[1],w[2],o,0,b,n[1],0,n[1])}for(let e=0;e<i;e++){let n=T+e*2;t.tri(n,n+2,n+1),t.tri(n+1,n+2,n+3)}let E=x[12],D=_+n.range(8,20)*Math.PI/180,O=[p[0]*Math.sin(D),Math.cos(D),p[2]*Math.sin(D)],k=K(O[1]*m[2]-O[2]*m[1],O[2]*m[0]-O[0]*m[2],O[0]*m[1]-O[1]*m[0]);if(e===0){let e=[0,.3,.75,1],n=[.55,1,.8,.12],r=t.count;e.forEach((e,r)=>{let i=E[0]+O[0]*e*v+p[0]*e*e*v*.25,a=E[1]+O[1]*e*v,o=E[2]+O[2]*e*v+p[2]*e*e*v*.25;for(let s=0;s<4;s++){let c=s/4*Math.PI*2,l=[m[0]*Math.cos(c)+k[0]*Math.sin(c),m[1]*Math.cos(c)+k[1]*Math.sin(c),m[2]*Math.cos(c)+k[2]*Math.sin(c)],u=K(l[0]*.9+p[0]*.1,l[1]*.9+.25,l[2]*.9+p[2]*.1);t.v(i+l[0]*y*n[r],a+l[1]*y*n[r],o+l[2]*y*n[r],u[0],u[1],u[2],1,1,b,a,e,a)}});for(let n=0;n<e.length-1;n++)for(let e=0;e<4;e++){let i=r+n*4+e,a=r+n*4+(e+1)%4;t.tri(i,i+4,a),t.tri(a,i+4,a+4)}}else{let n=e===1?[0,.4,.8,1]:[0,.5,1],r=e===1?[.5,1,.8,.15]:[.6,1,.2];for(let e of[m,k]){let i=t.count;n.forEach((n,i)=>{let a=E[0]+O[0]*n*v,o=E[1]+O[1]*n*v,s=E[2]+O[2]*n*v,c=K(p[0]*.4,.75,p[2]*.4);for(let l of[1,-1])t.v(a+e[0]*y*1.1*r[i]*l,o+e[1]*y*1.1*r[i]*l,s+e[2]*y*1.1*r[i]*l,c[0],c[1],c[2],1,1,b,o,n,o)});for(let e=0;e<n.length-1;e++){let n=i+e*2;t.tri(n,n+2,n+1),t.tri(n+1,n+2,n+3)}}}}return t}var Ci=`
precision highp float;
precision highp sampler2D;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 uv;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uLodCam;
uniform vec3 uBand;
uniform vec3 uWheat;      // ripeness, height, harvest cut
uniform sampler2D uLand;
${Nn}
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vState;      // crop, burned, trampled, idle
varying float vGust;
varying float vRnd;
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  float jit = 0.9 + 0.2 * world1.z;
  // Tufts shrink away past 90 m: the field paint takes over.
  float fade = 1.0 - smoothstep(${bi.toFixed(1)} - 22.0, ${bi.toFixed(1)}, d);
  int hi = int(world1.w + 0.5);
  vec4 st = texelFetch(uLand, ivec2(hi % 512, hi / 512), 0);
  float crop = floor(st.r * 255.0 / 64.0 + 0.5);
  int flags = int(st.g * 255.0 + 0.5);
  float burned = float((flags & 4) != 0), trampled = float((flags & 8) != 0), idle = float((flags & 32) != 0);
  float h = uWheat.y * fade;
  if (crop > 0.5 && crop < 1.5) h *= 0.55;
  if (crop > 1.5 && crop < 2.5) h *= 0.45;
  h *= mix(1.0, 0.4, burned) * mix(1.0, 0.5, trampled);
  // Fallow and idle parcels keep a few tufts.
  bool hidden = (crop > 1.5 && crop < 2.5 || idle > 0.5) && world1.z < 0.7;
  if (d < uBand.x * jit || d > uBand.y * jit || h < 0.02 || hidden) {
    gl_Position = CULLED;
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vState = vec4(0.0); vGust = 0.0; vRnd = 0.0;
    return;
  }
  vec3 p = position * world1.x;
  p.y *= world1.y * h;
  float c = cos(world0.w), s = sin(world0.w);
  vec3 wp = origin + vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  wp.xz += world2.xy * p.y;
  // Gusts: noise blobs swept along the wind times rolling bands, so waves run across the field.
  vec2 wd = normalize(uWind.xy);
  float t = uTime * 6.5;
  vec2 q = origin.xz - wd * t;
  float blob = smoothstep(0.4, 0.78, vnoiseW(q / 16.0));
  float wave = 0.5 + 0.5 * sin(dot(origin.xz, wd) * 0.35 + 2.5 * blob - t * 0.35);
  float gust = blob * (0.3 + 0.7 * wave * wave);
  float bend = uWind.z * (0.08 + 0.5 * gust) + 0.05 * sin(uTime * 2.0 + world1.z * 20.0);
  if (trampled > 0.5) bend = 1.2;
  float y = p.y;
  wp.xz += wd * bend * y * y;
  wp.y -= 0.5 * bend * bend * y * y * y;
  vWorld = wp;
  vNormal = normalize(vec3(c * normal.x + s * normal.z, normal.y, -s * normal.x + c * normal.z));
  vColor = color;
  vState = vec4(crop, burned, trampled, idle);
  vGust = gust;
  vRnd = world1.z;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,wi=`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vState;
varying float vGust;
varying float vRnd;
${V}
${H}
${Mn}
uniform vec3 uWheat;
uniform float uDrought;
void main() {
  vec3 n = normalize(vNormal);
  float h = clamp(vColor.a / 0.95, 0.0, 1.0), ear = vColor.g;
  // Colours from the original (sRGB) in linear: root, stalk, tip, ear, amber, green root and tip.
  vec3 gold = mix(mix(vec3(0.073, 0.063, 0.011), vec3(0.296, 0.223, 0.037), smoothstep(0.0, 0.55, h)), vec3(0.476, 0.367, 0.059), smoothstep(0.55, 1.0, h));
  vec3 earC = vec3(0.571, 0.423, 0.074) * (0.85 + 0.3 * (0.5 + 0.5 * sin(vColor.b * 50.0 + vWorld.y * 60.0)));
  gold = mix(gold, earC, ear);
  float ripe = uWheat.x;
  gold = mix(gold, vec3(0.603, 0.262, 0.040), smoothstep(0.85, 1.0, ripe) * smoothstep(0.5, 1.0, h) * 0.45);
  vec3 green = mix(vec3(0.019, 0.051, 0.006), vec3(0.133, 0.275, 0.021), h);
  vec3 col = mix(green, gold, smoothstep(0.0, 0.75, ripe));
  // Pulse and other green crops stay green, drought bleaches.
  if (vState.x > 0.5 && vState.x < 1.5) col = mix(green, col, 0.25);
  if (vState.x > 2.5) col = green * 0.75;
  col = mix(col, vec3(0.45, 0.40, 0.25), uDrought * 0.5);
  if (vState.y > 0.5) col = vec3(0.003, 0.003, 0.002);
  if (vState.z > 0.5) col = mix(col, vec3(0.06, 0.047, 0.013), 0.65);
  col *= 0.86 + 0.28 * vRnd;
  col *= mix(0.88, 1.5, vGust * smoothstep(0.4, 1.0, h));
  float snow = uSnowFx.x;
  if (snow > 0.0) col = mix(col, vec3(0.79, 0.85, 1.0), snowCoverage(snow, vWorld.xz) * smoothstep(0.2, 0.9, h) * 0.8);
  float ao = vColor.r;
  float sh;
  vec3 lit = shade(col, n, vWorld, ao, 0.6, sh);
  // Backlit translucent rim and satin ears: R1's golden wheat.
  vec3 v = normalize(uCamPos - vWorld);
  float back = pow(clamp(dot(-uSunDir, v), 0.0, 1.0), 2.5);
  float lowSun = 1.0 - smoothstep(0.08, 0.55, uSunDir.y);
  float rim = pow(1.0 - clamp(abs(dot(n, v)), 0.0, 1.0), 2.0);
  // Light through the straw is bright gold, not the shaded albedo: the backlit glow of R1.
  vec3 straw = mix(vec3(0.62, 0.42, 0.12), col * 2.2, 0.35);
  lit += straw * uSunColor * 0.55 * back * (0.3 + rim) * (0.35 + 0.65 * h) * (0.3 + 0.7 * lowSun) * mix(sh, 1.0, 0.35) * (1.0 - vState.y);
  vec3 hv = normalize(uSunDir + v);
  lit += uSunColor * pow(max(dot(n, hv), 0.0), 20.0) * 0.12 * ear * sh;
  lit = atmosphere(lit, vWorld);
  gl_FragColor = vec4(lit, viewDepth01(vWorld));
}
`,Ti=`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`,Ei=`
float wh(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoiseW(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(wh(i), wh(i + vec2(1.0, 0.0)), u.x), mix(wh(i + vec2(0.0, 1.0)), wh(i + vec2(1.0, 1.0)), u.x), u.y);
}
`;U(`wheat`,Ci.replace(`varying vec3 vWorld;`,`${Ei}\nvarying vec3 vWorld;`),wi),U(`wheatDepth`,Ci.replace(`varying vec3 vWorld;`,`${Ei}\nvarying vec3 vWorld;`),Ti);var Di=class{scene;shadows;veg;client;vd;lit=[];depth;meshes=[null,null,null];cells=new Map;owned=new Set;at=[{x:1e9,z:1e9},{x:1e9,z:1e9},{x:1e9,z:1e9}];dirty=!0;counts=[0,0,0];state={ripe:.8,height:1,drought:0};enabled=!0;constructor(e,t,n,r,i,a){this.scene=e,this.shadows=n,this.veg=r,this.client=i,this.vd=[0,1,2].map(e=>{let t=Si(e).arrays(),n=new S;return n.positions=t.positions,n.normals=t.normals,n.colors=t.colors,n.uvs=t.uvs,n.indices=t.indices,n});let o=(e,n)=>{e.setVector3(`uLodCam`,t.camPos),e.setFloat3(`uBand`,yi[n],yi[n+1],bi),e.setFloat3(`uWheat`,this.state.ripe,this.state.height,0),e.setTexture(`uLand`,a.landTex),r.bind(e)};for(let e=0;e<3;e++){let n=t.material(`wheat_${e}`,`wheat`,{attributes:[`position`,`normal`,`color`,`uv`],uniforms:[`uLodCam`,`uBand`,`uWheat`,`uDrought`,...An],samplers:[`uLand`,...jn]});n.backFaceCulling=!1,n.onBindObservable.add(()=>{let t=n.getEffect();t&&(o(t,e),t.setFloat(`uDrought`,this.state.drought))}),this.lit.push(n)}let s=t.material(`wheatDepth`,`wheatDepth`,{attributes:[`position`,`normal`,`color`,`uv`],uniforms:[`uLodCam`,`uBand`,`uWheat`,`uTime`,...An],samplers:[`uLand`,...jn],lit:!1});s.backFaceCulling=!1,s.onBindObservable.add(()=>{let e=s.getEffect();e&&(o(e,xi),e.setFloat(`uTime`,t.time))}),this.depth=s}setOwned(e){this.owned=new Set(e.map(e=>(e.r+256)*512+(e.q+256))),this.invalidate()}invalidate(){this.cells.clear(),this.dirty=!0}seasonState(){let e=this.veg.season.weights,t=this.veg.season.progress,n=.55+.45*Math.min(1,t/.8),r=.12+.68*Math.min(1,t/.8),i=t>.6?.14:1;this.state.height=e[0]*.35+e[1]*n+e[2]*i+e[3]*.14,this.state.ripe=e[0]*0+e[1]*r+e[2]*1+e[3]*1}update(e,t,n,r){if(this.seasonState(),!(this.enabled&&r<64)){this.meshes.some(Boolean)&&this.clear();return}let i=Math.ceil(bi/16),a=Math.floor(e/16),o=Math.floor(n/16);for(let t=-i;t<=i;t++)for(let r=-i;r<=i;r++){let i=a+r,s=o+t;if(Math.hypot((i+.5)*16-e,(s+.5)*16-n)>bi+12)continue;let c=(i+1024)*2048+(s+1024);if(this.cells.has(c))continue;this.cells.set(c,null);let l=this.ownedNear(i,s);this.client.wheat({cx:i,cz:s,owned:l}).then(e=>{this.cells.has(c)&&(this.cells.set(c,e.length?e:new Float32Array),e.length&&(this.dirty=!0))})}for(let t of this.cells.keys()){let r=Math.floor(t/2048)-1024,i=t%2048-1024;Math.hypot((r+.5)*16-e,(i+.5)*16-n)>bi+60&&this.cells.delete(t)}let s=[4,8,16];for(let t=0;t<3;t++)!this.dirty&&Math.hypot(e-this.at[t].x,n-this.at[t].z)<s[t]||(this.at[t]={x:e,z:n},this.build(t,e,n));this.dirty=!1}ownedNear(e,t){if(!this.owned.size)return[];let n=[];for(let r of this.owned){let i=r%512-256,a=Math.floor(r/512)-256,o=34.641016*(i+a*.5),s=30*a;Math.abs(o-(e+.5)*16)<30&&Math.abs(s-(t+.5)*16)<30&&n.push(r)}return n}clear(){for(let e=0;e<3;e++){let t=this.meshes[e];t&&(this.shadows.removeCaster(t),t.dispose(),this.meshes[e]=null)}this.at=[{x:1e9,z:1e9},{x:1e9,z:1e9},{x:1e9,z:1e9}]}build(e,t,r){let i=[4,8,16],a=Math.max(0,yi[e]*.88-i[e]-1),o=yi[e+1]*1.12+i[e]+1,s=a*a,c=o*o,l=[];for(let[n,i]of this.cells){if(!i||!i.length)continue;let u=Math.floor(n/2048)-1024,d=n%2048-1024,f=Math.hypot((u+.5)*16-t,(d+.5)*16-r);if(!(f>o+12||f<a-12))for(let n=0;n<i.length;n+=16){if(e===2&&i[n+6]>.5)continue;let a=i[n]-t,o=i[n+2]-r,u=a*a+o*o;if(u<s||u>c)continue;let d=l.length;for(let e=0;e<16;e++)l.push(i[n+e]);e===2&&(l[d+4]*=1.25)}}let u=l.length,d=this.meshes[e];if(d&&(this.shadows.removeCaster(d),d.dispose(),this.meshes[e]=null),this.counts[e]=u/16,!u)return;let f=new Float32Array(l),p=new v(`wheat_${e}`,this.scene);this.vd[e].applyToMesh(p,!1),p.isPickable=!1,p.doNotSyncBoundingInfo=!0,p.thinInstanceSetBuffer(`matrix`,f,16,!0);let m=1/0,h=1/0,g=1/0,_=-1/0,b=-1/0,x=-1/0;for(let e=0;e<f.length;e+=16)m=Math.min(m,f[e]),_=Math.max(_,f[e]),h=Math.min(h,f[e+1]),b=Math.max(b,f[e+1]),g=Math.min(g,f[e+2]),x=Math.max(x,f[e+2]);p.setBoundingInfo(new y(new n(m-1,h-1,g-1),new n(_+1,b+1.5,x+1))),p.material=this.lit[e],e===xi&&this.shadows.addCaster(p,this.depth,0),this.meshes[e]=p}get stats(){return{wheatNear:this.counts[0],wheatMid:this.counts[1],wheatFar:this.counts[2],wheatCells:this.cells.size}}},Oi=1.8,ki=5.2,Ai=320,ji=[`hedge`,`wall`,`gate`];function Mi(){let e=new on,{verts:t,levels:n}=cn(2),r=n[2];for(let n=0;n<162;n++){let r=t[n],i=Math.sign(r[0])*Math.abs(r[0])**.55*1.05,a=Math.sign(r[2])*Math.abs(r[2])**.6*.62,o=Math.min(.98,Math.max(-.12,r[1]*.72+.42))+(dn(r[0]*3,r[1]*3,r[2]*3)-.5)*.12,s=K(r[0]*.6,r[1]+.2,r[2]*1.4),c=(o+.12)/1.1;e.v(i,o,a,s[0],s[1],s[2],.45+.55*c,c,0,0)}for(let t=0;t<r.length;t+=3)e.tri(r[t],r[t+2],r[t+1]);return e}function Ni(){let e=new on,t=ln(1913),{verts:n,levels:r}=cn(1),i=r[1],a=(t,r,a,o,s,c,l,u=3)=>{let d=e.count;for(let i=0;i<42;i++){let d=n[i],f=(Math.abs(d[0])**+u+Math.abs(d[1])**+u+Math.abs(d[2])**+u)**(1/u),p=t+d[0]/f*a*.5,m=r+d[1]/f*o*.5,h=d[2]/f*s,g=K(d[0],d[1],d[2]);e.v(p,m,h,g[0],g[1],g[2],.55+l/3*.45*(.5+.5*g[1]),c,l/3,.5)}for(let t=0;t<i.length;t+=3)e.tri(d+i[t],d+i[t+2],d+i[t+1])};for(let e=0;e<3;e++){let n=-1+e%2*.17;for(;n<1;){let r=t.range(.3,.58),i=.24+t.range(-.03,.05);a(n+r/2,.12+e*.22,r+.08,i,.36-e*.04,t.range(.4,.55),e),n+=r-.02}}let o=-1;for(;o<1;){let e=t.range(.4,.62);a(o+e/2,.8,e+.06,.16,.3,t.range(.42,.58),3,4),o+=e-.03}return e}function Pi(e,t,n,r,i,a,o,s){for(let[c,l]of[[[1,0,0],[0,1,0]],[[-1,0,0],[0,1,0]],[[0,1,0],[0,0,1]],[[0,-1,0],[0,0,1]],[[0,0,1],[1,0,0]],[[0,0,-1],[1,0,0]]]){let u=[c[1]*l[2]-c[2]*l[1],c[2]*l[0]-c[0]*l[2],c[0]*l[1]-c[1]*l[0]],d=e.count;for(let[d,f]of[[-1,-1],[1,-1],[1,1],[-1,1]]){let p=t+(c[0]+l[0]*d+u[0]*f)*i,m=n+(c[1]+l[1]*d+u[1]*f)*a,h=r+(c[2]+l[2]*d+u[2]*f)*o;e.v(p,m,h,c[0],c[1],c[2],.8,s,0,1)}e.tri(d,d+2,d+1),e.tri(d,d+3,d+2)}}function Fi(){let e=new on;Pi(e,-1.65,.62,0,.095,.62,.095,.5),Pi(e,1.65,.62,0,.095,.62,.095,.5);for(let t of[.35,.7,1.05])Pi(e,0,t,0,1.6,.06,.035,.6);let t=new on;Pi(t,0,.7,0,1.5,.05,.03,.55);for(let e=0;e<t.positions.length;e+=3)t.positions[e+1]+=t.positions[e]*.22;return e.append(t),e}var Ii=`
precision highp float;
precision highp sampler2D;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uLodCam;
uniform sampler2D uLand;
${Nn}
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vInst;
float eh(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float en(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(eh(i), eh(i + vec3(1, 0, 0)), u.x), mix(eh(i + vec3(0, 1, 0)), eh(i + vec3(1, 1, 0)), u.x), u.y),
             mix(mix(eh(i + vec3(0, 0, 1)), eh(i + vec3(1, 0, 1)), u.x), mix(eh(i + vec3(0, 1, 1)), eh(i + vec3(1, 1, 1)), u.x), u.y), u.z);
}
void main() {
  vec3 origin = world0.xyz;
  float d = distance(origin, uLodCam);
  // Pieces sink into the ground past 200 m, where the terrain's painted boundary takes over.
  float sink = 1.0 - smoothstep(${200 .toFixed(1)}, ${Ai.toFixed(1)}, d);
  if (sink <= 0.001) {
    gl_Position = CULLED;
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vInst = vec2(0.0);
    return;
  }
  vec3 p = position * vec3(world1.x, world1.y * sink, 1.0);
  float c = cos(world0.w), s = sin(world0.w);
  vec3 wp = origin + vec3(c * p.x + s * p.z, p.y + p.x * world2.x, -s * p.x + c * p.z);
  vec3 n = vec3(c * normal.x + s * normal.z, normal.y, -s * normal.x + c * normal.z);
  if (color.a < 0.25) {
    // Hedges: world-space lumps so a run of pieces reads as one living hedge, bulging most near the top, and a
    // top line that rises and dips along the run (a smooth tube read as a green capsule).
    float h01 = clamp(position.y, 0.0, 1.0);
    float l = (en(wp * 0.55) * 0.45 + en(wp * 1.5) * 0.35 + en(wp * 3.8) * 0.2 - 0.47) * (0.6 + 0.8 * h01);
    wp += n * l;
    wp.y += (en(vec3(wp.xz * 0.3, 3.0)) - 0.45) * 0.8 * h01 * world1.y;
    wp.xz += normalize(uWind.xy) * sin(uTime * 1.3 + dot(origin.xz, vec2(0.11, 0.07))) * 0.03 * p.y * uWind.z;
  }
  vWorld = wp;
  vNormal = normalize(n);
  vColor = color;
  int hi = int(world1.w + 0.5);
  vec4 st = texelFetch(uLand, ivec2(hi % 512, hi / 512), 0);
  vInst = vec2(world2.y, float((int(st.g * 255.0 + 0.5) & 4) != 0));
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`fieldEdge`,Ii,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vInst;
${V}
${H}
${Mn}
void main() {
  vec3 n = normalize(vNormal);
  float mat = vColor.a, rnd = vInst.x, burned = vInst.y;
  vec3 col;
  float wrap = 0.3;
  if (mat < 0.25) {
    // Hedge leaves (0.23, 0.32, 0.085): leaf clumps bump the normal and open dark gaps between them, lit top to cool
    // underside, warmed at harvest. Clumps settle into a tint where they are sub-pixel.
    vec4 c1 = vnoised(vWorld * 2.0), c2 = vnoised(vWorld * 4.6 + 3.0);
    float resolved = 1.0 - smoothstep(0.2, 0.8, length(fwidth(vWorld * 4.6)));
    float cl = mix(0.5, c1.x * 0.6 + c2.x * 0.4, resolved);
    vec3 g = (c1.yzw * 1.2 + c2.yzw * 1.84) * resolved;
    g -= n * dot(g, n);
    n = normalize(n - g * 0.16);
    col = vec3(0.036, 0.068, 0.0065) * (0.62 + 0.7 * cl) * mix(0.9, 1.12, rnd);
    col *= mix(0.62, 1.0, smoothstep(0.22, 0.5, cl));
    col = mix(col, vec3(0.060, 0.092, 0.012), smoothstep(0.62, 0.8, cl) * smoothstep(0.2, 0.8, n.y) * 0.5);
    col *= mix(0.82, 1.22, smoothstep(-0.3, 0.8, n.y));
    col = mix(col, vec3(0.126, 0.084, 0.018), uSeasonFx.z * 0.3);
    col = mix(col, vec3(0.05, 0.075, 0.012), uSeasonFx.y * 0.3);
    col = mix(col, col * vec3(0.85, 0.8, 0.85), uSeasonFx.w * 0.5);
    wrap = 0.5;
  } else if (mat < 0.75) {
    float tone = vColor.g;
    col = vec3(tone * tone) * vec3(1.0, 0.97, 0.9) * (0.85 + 0.3 * vnoised(vWorld * 3.0).x);
    col = mix(col, vec3(0.13, 0.15, 0.04), smoothstep(0.62, 0.75, vnoised(vWorld * 2.0 + 5.0).x) * 0.5);
  } else {
    col = vec3(0.196, 0.095, 0.030) * (0.75 + 0.5 * vnoised(vec3(vWorld.x * 6.0, vWorld.y * 0.8, vWorld.z * 6.0)).x);
  }
  if (burned > 0.5) col = vec3(0.027, 0.020, 0.018);
  float snow = uSnowFx.x;
  if (snow > 0.0) col = mix(col, vec3(0.79, 0.85, 1.0), smoothstep(0.35, 0.75, n.y) * snowCoverage(snow, vWorld.xz));
  col *= 0.92 + 0.08 * sin(vWorld.x * 3.1 + vWorld.z * 2.3);
  float sh;
  vec3 lit = shade(col, n, vWorld, vColor.r, wrap, sh);
  if (mat < 0.25) {
    // Backlit hedges glow at their crowns like the trees.
    vec3 v = normalize(uCamPos - vWorld);
    float back = pow(clamp(dot(-uSunDir, v), 0.0, 1.0), 3.0) * (1.0 - smoothstep(0.1, 0.55, uSunDir.y));
    float edge = 1.0 - clamp(dot(n, v), 0.0, 1.0);
    lit += vec3(0.07, 0.11, 0.012) * uSunColor * back * (0.05 + 1.4 * pow(edge, 3.0)) * mix(sh, 1.0, 0.45);
  }
  lit = atmosphere(lit, vWorld);
  gl_FragColor = vec4(lit, viewDepth01(vWorld));
}
`),U(`fieldEdgeDepth`,Ii,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var Li=class{scene;shadows;world;terrain;vd;lit;depth;pieces=[[],[],[]];meshes=[null,null,null];owned=[];fog=()=>!0;at={x:1e9,z:1e9};dirty=!1;shown=[0,0,0];trees=new Map;onTrees=()=>{};constructor(e,t,n,r,i,a){this.scene=e,this.shadows=n,this.world=i,this.terrain=a,this.vd=[Mi(),Ni(),Fi()].map(e=>{let t=e.arrays(),n=new S;return n.positions=t.positions,n.normals=t.normals,n.colors=t.colors,n.indices=t.indices,n});let o=e=>{e.setVector3(`uLodCam`,t.camPos),e.setTexture(`uLand`,a.landTex),r.bind(e)};this.lit=t.material(`fieldEdge`,`fieldEdge`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,...An],samplers:[`uLand`,...jn]}),this.lit.onBindObservable.add(()=>{let e=this.lit.getEffect();e&&o(e)}),this.depth=t.material(`fieldEdgeDepth`,`fieldEdgeDepth`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,`uTime`,...An],samplers:[`uLand`,...jn],lit:!1}),this.depth.onBindObservable.add(()=>{let e=this.depth.getEffect();e&&(o(e),e.setFloat(`uTime`,t.time))})}setOwned(e,t){this.owned=e,this.fog=t,this.plan()}invalidate(){this.owned.length&&this.plan()}typeAt(e,t){return e<-256||t<-256||e>=256||t>=256?B.OCEAN:this.terrain.hexData[((t+256)*512+(e+256))*4]}plan(){let e=this.world,t=e.seed,n=this.terrain.hexData,r=new Map;for(let e of this.owned)this.fog(e)&&r.set((e.r+256)*512+(e.q+256),e.owner);let i=[[],[],[]],a=new Map,o=new Set(this.trees.keys()),s=(n,r,a,o,s,c,l,u,d)=>{let f=e.height(r,a);if(f<.4)return;let p=u===void 0?f:e.height(u,d),m=u===void 0?0:(p-f)/Math.max(.1,Math.hypot(u-r,d-a)),h=z(Math.round(r*10),Math.round(a*10),t+77)/4294967296;i[n].push(r,f-.06,a,o,s,c*(n===0?.8+h*.4:.97+h*.05),0,l,m,h,0,0,0,0,0,0)},c=0;for(let[i,o]of r){let o=i%512-256,l=Math.floor(i/512)-256,u={q:o,r:l},d=N(o,l),f=ge(l),p=+(z(o,l,t+51)%4==0),m=n[i*4+1];for(let t=0;t<6;t++){let n=o+se[t].q,h=l+se[t].r;if(this.typeAt(n,h)<=B.SHALLOWS)continue;let g=(h+256)*512+(n+256),_=!!(m&1<<t),v=r.get(g);if(!_&&v!==void 0&&g<i)continue;let y=pe(u,t),b=pe(u,t+1),x=_?3.3:0,S=(y.x+b.x)/2,C=(y.y+b.y)/2,w=d-S,T=f-C,E=Math.hypot(w,T),D=w/E*x,O=T/E*x,k=y.x+D,A=y.y+O,j=b.x+D,ee=b.y+O,te=Math.hypot(j-k,ee-A),M=(j-k)/te,ne=(ee-A)/te,N=Math.atan2(-ne,M),P=_?3.3*.577:0,F=Math.floor((te-2*P)/Oi),re=P+(te-2*P-F*Oi)/2;for(let e=0;e<F;e++){let t=re+(e+.5)*Oi;if(Math.abs(t-te/2)<ki/2)continue;let n=k+M*t,r=A+ne*t;s(p,n,r,N,p?1:1.5,p?1:1.2,i,n+M*Oi*.5,r+ne*Oi*.5)}if(s(2,k+M*te/2,A+ne*te/2,N,1,1,i),c++%9==4){let t=k+M*(te/2+5)+w/E*1.2,n=A+ne*(te/2+5)+T/E*1.2,r=e.height(t,n);if(r>.8){let e=(Math.floor(t/256)+64)*128+(Math.floor(n/256)+64),o=a.get(e);o||a.set(e,o=[]);let s=Array(16).fill(0),l=.75+c%5*.06;s[G.X]=t,s[G.Y]=r-.1,s[G.Z]=n,s[G.YAW]=c*2.3,s[G.SX]=l,s[G.SY]=l,s[G.SZ]=l,s[G.KIND]=c%2?W.ORCHARD:W.BROADLEAF,s[G.HUE]=.4,s[G.BRIGHT]=.5,s[G.SUS]=.85,s[G.RND]=c*.618%1,s[G.HEX]=i,s[G.SIZE]=l,o.push(...s)}}}let h=this.typeAt(o,l);if(h===B.FARMLAND||h===B.MEADOW){let e=Ur(n[i*4+2]),r={x:Math.cos(e),z:Math.sin(e)},a={x:-r.z,z:r.x},o=d*r.x+f*r.z,c=d*a.x+f*a.z;for(let n=Math.floor((o-20)/24)+1;n*24<o+20;n++){let o=n*24;for(let l=c-20;l<c+20;l+=Oi){let c=o*r.x+l*a.x,u=o*r.z+l*a.z,m=Math.abs(c-d),h=Math.abs(u-f);17.320508-Math.max(m,m*.5+h*.8660254)<1.6||Rr({x:c+r.x*1.5,y:u+r.z*1.5},e,t).edge<3.2&&Math.abs((l/42%1+1)%1-.5)>.4||z(n,Math.floor(l/42),t+61)%3!=0&&s(p,c,u,Math.atan2(-a.z,a.x),p?1:1.5,p?.9:1.05,i,c+a.x*Oi*.5,u+a.z*Oi*.5)}}}}this.pieces=i,this.trees=new Map([...a].map(([e,t])=>[e,new Float32Array(t)]));for(let e of this.trees.keys())o.add(e);this.onTrees(o),this.dirty=!0}update(e,t,r){if(!(!this.dirty&&Math.hypot(e-this.at.x,r-this.at.z)<40)){this.dirty=!1,this.at={x:e,z:r};for(let t=0;t<3;t++){let i=this.meshes[t];i&&(this.shadows.removeCaster(i),i.dispose(),this.meshes[t]=null);let a=this.pieces[t],o=[];for(let t=0;t<a.length;t+=16)if(Math.hypot(a[t]-e,a[t+2]-r)<360)for(let e=0;e<16;e++)o.push(a[t+e]);if(this.shown[t]=o.length/16,!o.length)continue;let s=new Float32Array(o),c=new v(`edge_${ji[t]}`,this.scene);this.vd[t].applyToMesh(c,!1),c.isPickable=!1,c.doNotSyncBoundingInfo=!0,c.thinInstanceSetBuffer(`matrix`,s,16,!0);let l=1/0,u=1/0,d=1/0,f=-1/0,p=-1/0,m=-1/0;for(let e=0;e<s.length;e+=16)l=Math.min(l,s[e]),f=Math.max(f,s[e]),u=Math.min(u,s[e+1]),p=Math.max(p,s[e+1]),d=Math.min(d,s[e+2]),m=Math.max(m,s[e+2]);c.setBoundingInfo(new y(new n(l-3,u-1,d-3),new n(f+3,p+3,m+3))),c.material=this.lit,this.shadows.addCaster(c,this.depth,1),this.meshes[t]=c}}}get stats(){return{hedges:this.shown[0],walls:this.shown[1],gates:this.shown[2]}}},Ri=700,zi=480,Bi=4.6,Vi=3.4,Hi=.6,Ui=1.6,Wi=16,Gi=4;function Ki(){let e=new on,t=[[0,.62,0],[.45,.4,0],[.82,.22,0],[.9,.2,1],[.98,.23,0],[1.22,.4,0],[1.42,.3,0],[1.52,.1,0]],n=ln(77),r=Array.from({length:16},(e,t)=>(t%2?.74:1)*n.range(.92,1.08));for(let[n,i,a]of t)for(let t=0;t<16;t++){let o=t/16*Math.PI*2,s=i*(a?1:r[t]),c=K(Math.cos(o),n<.85?.5:n<1.25?-.1:.7,Math.sin(o)),l=t%2&&!a?.8:1;e.v(Math.cos(o)*s,n,Math.sin(o)*s,c[0],c[1],c[2],(.5+.5*Math.min(1,n/1.1))*l,n/1.52,a,1)}for(let n=0;n<t.length-1;n++)for(let t=0;t<16;t++){let r=n*16+t,i=n*16+(t+1)%16,a=r+16,o=i+16;e.tri(r,a,i),e.tri(i,a,o)}let i=e.v(0,1.58,0,0,1,0,1,1,0,1),a=(t.length-1)*16;for(let t=0;t<16;t++)e.tri(a+t,i,a+(t+1)%16);return e}var qi=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec4 world0;
attribute vec4 world1;
attribute vec4 world2;
attribute vec4 world3;
uniform mat4 viewProjection;
uniform vec3 uLodCam;
uniform float uShow;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying float vRnd;
void main() {
  vec3 origin = world0.xyz;
  // Each stook rises in its turn across the field, and leaves the same way.
  float grow = smoothstep(world1.z * 0.6, world1.z * 0.6 + 0.4, uShow);
  if (grow <= 0.001 || distance(origin, uLodCam) > ${Ri.toFixed(1)}) {
    gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
    vWorld = vec3(0.0); vNormal = vec3(0.0, 1.0, 0.0); vColor = vec4(0.0); vRnd = 0.0;
    return;
  }
  vec3 p = position * vec3(world1.x, world1.x * world1.y * grow, world1.x) * mix(0.6, 1.0, grow);
  float tx = world2.x, tz = world2.y;
  p = vec3(p.x, p.y * cos(tx) - p.z * sin(tx), p.y * sin(tx) + p.z * cos(tx));
  p = vec3(p.x * cos(tz) - p.y * sin(tz), p.x * sin(tz) + p.y * cos(tz), p.z);
  float c = cos(world0.w), s = sin(world0.w);
  vec3 wp = origin + vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  vNormal = normalize(vec3(c * normal.x + s * normal.z, normal.y, -s * normal.x + c * normal.z));
  vWorld = wp;
  vColor = color;
  vRnd = world1.z;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`;U(`sheaf`,qi,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
varying float vRnd;
${V}
${H}
void main() {
  vec3 n = normalize(vNormal);
  // Straw: deep amber at the foot to gold ears (A5), stalk streaks running up each sheaf, a darker twisted band.
  float h = vColor.g;
  vec3 straw = mix(vec3(0.50, 0.33, 0.11), vec3(0.84, 0.64, 0.27), smoothstep(0.05, 0.9, h));
  float streak = vnoise(vec2((vWorld.x + vWorld.z) * 9.0, vWorld.y * 1.4));
  straw *= mix(0.84, 1.1, streak) * mix(0.9, 1.06, vRnd);
  straw = mix(straw, vec3(0.36, 0.22, 0.08), vColor.b * 0.8);
  straw = pow(straw, vec3(2.2));
  float sh;
  vec3 col = shade(straw, n, vWorld, vColor.r, 0.45, sh);
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`sheafDepth`,qi,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);function Ji(e,t,n){let r=[],i=I(t),a=e.region(t)===P.HOME,o=Ur(e.frameByte(t)),s=Math.cos(o),c=Math.sin(o),l=e.roadBits(t),u=[];for(let e=0;e<6;e++)if(l&1<<e){let n=pe(t,e),r=pe(t,e+1);u.push([n.x,n.y,r.x,r.y])}let d=(e,t)=>u.some(([n,r,i,a])=>{let o=i-n,s=a-r,c=Math.min(1,Math.max(0,((e-n)*o+(t-r)*s)/(o*o+s*s)));return Math.hypot(e-n-o*c,t-r-s*c)<3.2}),f=e.seed;for(let l=-4;l<=4;l++)for(let u=-6;u<=6;u++){let p=z(t.q*31+u,t.r*17+l,f+913),m=(u+(l&1?.5:0))*Vi+(p%100/100-.5)*.8,h=l*Bi+((p>>8)%100/100-.5)*.6,g=i.x+s*m-c*h,_=i.y+c*m+s*h,v=R({x:g,y:_});if(v.q!==t.q||v.r!==t.r)continue;let y;if(a){let t=e.cropAt({x:g,y:_});y=t>=0&&t<=1&&e.parcelEdgeDist({x:g,y:_})>1.6}else{let e=Rr({x:g,y:_},o,f);y=e.edge>1.6&&zr(e.cell,f)<=1}if(!y||d(g,_)||n(g,_,1.5))continue;let b=e.height(g,_);if(b<1)continue;let x=(p>>16)%1e3/1e3;r.push(g,b-.06,_,o+(x-.5)*.9,.86+.28*((p>>4)%100)/100,.9+.2*x,(p>>12)%1e3/1e3,0,(x-.5)*.12,((p>>20)%100/100-.5)*.12,0,0,0,0,0,0)}return r}var Yi=class{scene;shadows;veg;world;terrain;types;fog;blocked;vd;lit;depth;mesh=null;cache=new Map;at={x:1e9,z:1e9};wanted=[];dirty=!0;show=0;count=0;constructor(e,t,n,r,i,a,o,s,c){this.scene=e,this.shadows=n,this.veg=r,this.world=i,this.terrain=a,this.types=o,this.fog=s,this.blocked=c;let l=Ki().arrays();this.vd=new S,Object.assign(this.vd,{positions:l.positions,normals:l.normals,colors:l.colors,indices:l.indices});let u=e=>e.onBindObservable.add(()=>{let n=e.getEffect();n&&(n.setVector3(`uLodCam`,t.camPos),n.setFloat(`uShow`,this.show))});this.lit=t.material(`sheaf`,`sheaf`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,`uShow`]}),this.depth=t.material(`sheafDepth`,`sheafDepth`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLodCam`,`uShow`],lit:!1}),u(this.lit),u(this.depth)}invalidate(){this.cache.clear(),this.dirty=!0}update(e,t,n,r){let i=+(this.veg.season.weights[2]>.5&&this.veg.season.progress>=Hi&&t<zi);if(this.show+=Math.sign(i-this.show)*Math.min(Math.abs(i-this.show),e/Ui),this.show<=0)this.mesh?.setEnabled(!1);else{if((this.dirty||Math.hypot(n-this.at.x,r-this.at.z)>160)&&this.plan(n,r),this.wanted.length){let e=Gi;for(let t of this.wanted)if(!this.cache.has(t)){if(e--<=0)break;this.cache.set(t,new Float32Array(this.grow(t)))}this.wanted.every(e=>this.cache.has(e))&&(this.build(this.wanted),this.wanted=[])}this.mesh?.setEnabled(this.count>0)}}plan(e,t){this.dirty=!1,this.at={x:e,z:t};let n=this.fog(),r=[];for(let i of oe(R({x:e,y:t}),22)){if(i.q<-256||i.r<-256||i.q>=256||i.r>=256)continue;let a=(i.r+256)*512+(i.q+256),o=this.types[a],s=this.world.regions[a]===P.HOME;if(o!==B.FARMLAND&&!(s&&o===B.MEADOW))continue;let c=I(i);Math.hypot(c.x-e,c.y-t)>730||!n(i)||r.push(a)}this.wanted=r.length?r:[-1]}grow(e){if(e<0)return[];let t=this.terrain.landState;return t[e*4]!==0||t[e*4+1]&44?[]:Ji(this.world,{q:e%512-256,r:Math.floor(e/512)-256},this.blocked())}build(e){let t=0;for(let n of e)t+=this.cache.get(n)?.length??0;if(this.mesh&&=(this.shadows.removeCaster(this.mesh),this.mesh.dispose(),null),this.count=t/Wi,!this.count)return;let r=new Float32Array(t),i=0;for(let t of e){let e=this.cache.get(t);e&&(r.set(e,i),i+=e.length)}let a=new v(`sheaves`,this.scene);this.vd.applyToMesh(a,!1),a.isPickable=!1,a.doNotSyncBoundingInfo=!0,a.thinInstanceSetBuffer(`matrix`,r,16,!0);let o=1/0,s=1/0,c=1/0,l=-1/0,u=-1/0,d=-1/0;for(let e=0;e<r.length;e+=Wi)o=Math.min(o,r[e]),l=Math.max(l,r[e]),s=Math.min(s,r[e+1]),u=Math.max(u,r[e+1]),c=Math.min(c,r[e+2]),d=Math.max(d,r[e+2]);a.setBoundingInfo(new y(new n(o-2,s-1,c-2),new n(l+2,u+3,d+2))),a.material=this.lit,this.shadows.addCaster(a,this.depth,0),this.mesh=a}get stats(){return{sheaves:this.count}}},Xi=3300,Zi=1250,Qi=6,$i=(e,t)=>(e+64)*128+(t+64);function ea(e){let{world:t,terrain:n,forest:r,renderer:i}=e,a=r.veg;a.noise=n.noise;let o=new Mr(t.seed),s=new pi(e.scene,i.lighting,i.shadows,a,o),c=new vi(e.scene,i.lighting,i.shadows,a),l=new Di(e.scene,i.lighting,i.shadows,a,o,n),u=new Li(e.scene,i.lighting,i.shadows,a,t,n),d=()=>!0,f=()=>!1,p=new Map,m=!1,h=null,g=0,_={x:1e9,z:1e9},v=0,y=1,b=!1,x=new Uint8Array(262144);for(let e=0;e<x.length;e++)x[e]=n.hexData[e*4];let S=new Yi(e.scene,i.lighting,i.shadows,a,t,n,x,()=>d,()=>f),C=new Set;for(let e=-256;e<256;e++)for(let n=-256;n<256;n++){let r=t.types[(e+256)*512+(n+256)];r!==B.OCEAN&&r!==B.SHALLOWS&&C.add($i(Math.floor(N(n,e)/256),Math.floor(ge(e)/256)))}u.onTrees=e=>{for(let t of e){let e=w(t);e.dirty=!0}},o.started.then(({landUse:e,home:t})=>{n.setLandUse(e.habA,e.habB,e.habC,e.tracks),g=e.routes.length,h=t;let r=new Map;for(let e=0;e<t.length;e+=16){let n=$i(Math.floor(t[e]/256),Math.floor(t[e+2]/256)),i=r.get(n);i||r.set(n,i=[]);for(let n=0;n<16;n++)i.push(t[e+n])}for(let[e,t]of r){let n=w(e);n.home=new Float32Array(t),n.dirty=!0}m=!0});function w(e){let t=p.get(e);return t||(t={cx:Math.floor(e/128)-64,cz:e%128-64,dist:0,pending:!1,full:!1,raw:null,home:null,births:null,dirty:!1},p.set(e,t)),t}let T=e=>({q:e%512-256,r:Math.floor(e/512)-256});function E(e){e.dirty=!1;let n=[];e.raw&&n.push(e.raw.trees),e.home&&n.push(e.home);let i=u.trees.get($i(e.cx,e.cz));i&&n.push(i);let o=n.reduce((e,t)=>e+t.length/16,0);e.births&&e.births.length===o||(e.births=new Float32Array(o).fill(-1));let l=[],p=new Map,m=0;for(let r of n){let n=r===e.home||r===i;for(let i=0;i<r.length;i+=16,m++){let o=r[i+G.HEX],s=p.get(o);if(s===void 0){let e=x[o];s=!(!n&&e!==t.types[o]&&(e===B.FARMLAND||e<=B.SHALLOWS))&&d(T(o)),p.set(o,s)}if(!s||f(r[i],r[i+2],4)){e.births[m]=-1;continue}e.births[m]<0&&(e.births[m]=a.clock);let c=l.length;for(let e=0;e<16;e++)l.push(r[i+e]);l[c+G.HEX]=e.births[m]}}r.setChunk(e.cx,e.cz,new Float32Array(l)),e.raw?.cover&&s.setChunk(e.cx,e.cz,D(e.raw.cover,8,7,1.5)),e.raw?.rocks&&c.setChunk(e.cx,e.cz,D(e.raw.rocks,16,13,4))}function D(e,n,r,i){let a=[],o=new Map;for(let s=0;s<e.length;s+=n){let c=e[s+r],l=o.get(c);if(l===void 0&&(l=x[c]===t.types[c]&&d(T(c)),o.set(c,l)),l&&!f(e[s],e[s+2],i))for(let t=0;t<n;t++)a.push(e[s+t])}return new Float32Array(a)}function O(e,t){e.pending=!0,v++,o.dress(e.cx,e.cz,t).then(n=>{v--,e.pending=!1,e.raw=n,e.full=t,e.dirty=!0})}function k(e,t){let n=Xi*y,i=Zi*y,a=Math.ceil(n/256),o=Math.floor(e/256),l=Math.floor(t/256),d=[];for(let r=-a;r<=a;r++)for(let s=-a;s<=a;s++){let a=$i(o+s,l+r);if(!C.has(a))continue;let c=o+s,u=l+r,f=Math.hypot(c*256+128-e,u*256+128-t);if(f>n)continue;let p=w(a);p.dist=f,!p.pending&&(!p.raw||!p.full&&f<i)&&d.push(p)}d.sort((e,t)=>e.dist-t.dist);for(let e of d){if(v>=Qi)break;O(e,e.dist<i)}let f=+!b;b=!1;for(let[a,o]of p){if(o.pending)continue;let l=Math.hypot(o.cx*256+128-e,o.cz*256+128-t);o.dist=l,o.raw&&l>n+900*f?(o.raw=null,o.full=!1,o.births=null,s.clearChunk(o.cx,o.cz),c.clearChunk(o.cx,o.cz),o.home||u.trees.has(a)?o.dirty=!0:(r.clearChunk(o.cx,o.cz),p.delete(a))):o.raw&&o.full&&l>i+700*f&&(o.raw={...o.raw,cover:null,rocks:null},o.full=!1,s.clearChunk(o.cx,o.cz),c.clearChunk(o.cx,o.cz))}}let A=0;e.onUpdate(e=>{if(a.clock+=e,!m)return;let t=i.cam,n=t.target.x,r=t.target.z;A-=e;let o=Math.hypot(n-_.x,r-_.z)>32;(o||v<Qi&&A<=0)&&(o&&(_={x:n,z:r}),A=.25,k(n,r));let d=4,f=null;for(;d-->0;){f=null;for(let e of p.values())e.dirty&&(!f||e.dist<f.dist)&&(f=e);if(!f)break;E(f)}let h=t.camera.position;s.update(h.x,h.y,h.z,t.height),c.update(h.x,h.y,h.z),l.update(h.x,h.y,h.z,t.height),u.update(h.x,h.y,h.z),S.update(e,t.height,n,r)});let j={setFog(e){d=e,j.invalidate()},setBlocked(e){f=e,j.invalidate()},invalidate(e,t,r){let i=!1;for(let e=0;e<x.length;e++){let t=n.hexData[e*4];x[e]!==t&&(x[e]=t,i=!0)}i&&o.setTypes(x);for(let n of p.values())e!==void 0&&t!==void 0&&r!==void 0&&Math.hypot(n.cx*256+128-e,n.cz*256+128-t)>r+256||(n.raw||n.home||u.trees.has($i(n.cx,n.cz)))&&(n.dirty=!0);u.invalidate(),l.invalidate(),s.invalidate(),S.invalidate()},setOwned(e){u.setOwned(e,d),l.setOwned(e.filter(e=>e.farmland!==!1&&x[(e.r+256)*512+(e.q+256)]===B.FARMLAND&&t.regions[(e.r+256)*512+(e.q+256)]!==P.HOME)),S.invalidate()},setSeason(e,t,r){let i=a.season;i.weights=[...e],i.blossom=e[0],i.fresh=e[0],i.autumn=e[2],i.bare=e[3],i.snow=t,i.progress=r,n.uniforms.snow=t,n.uniforms.seasonProgress=r},setDetail(e){e<y&&(b=!0),y=e,r.setFarEnd(Xi*e*.85)},setWind(e,t,n){let r=Math.hypot(e,t)||1;a.wind.x=e/r,a.wind.z=t/r,a.wind.strength=n},stats(){let e=r.stats;return{trees:e.trees,treeChunks:e.chunks,treeMid:e.mid,treeFar:e.far,treeNear:e.near,...s.stats,...c.stats,...l.stats,...u.stats,...S.stats,homeTrees:h?h.length/16:0,tracks:g,backlog:o.backlog,inFlight:v,chunksFull:[...p.values()].filter(e=>e.raw&&e.full).length,chunksSparse:[...p.values()].filter(e=>e.raw&&!e.full).length,chunksPending:[...p.values()].filter(e=>e.pending).length,chunksDirty:[...p.values()].filter(e=>e.dirty).length}}};return window.hcDress=j,j}var ta=2;U(`decal`,`
precision highp float;
attribute vec3 position;
attribute vec4 color;    // earth, grass, wear, lift
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec4 vW;
void main() {
  vec4 wp = world * vec4(position, 1.0);
  vWorld = wp.xyz;
  vW = color;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec4 vW;
${V}
${H}
uniform float uSnow;

void main() {
  float n1 = vnoise(vWorld.xz * 0.35);
  float n2 = vnoise(vWorld.xz * 1.7 + 11.0);
  float n3 = vnoise(vWorld.xz * 0.9 + 37.0);
  // Yards are worn patches, not discs: the rim breaks up in two octaves of noise and grass creeps back in.
  float earth = smoothstep(0.18, 0.85, vW.r + (n1 - 0.5) * 0.55 + (n3 - 0.5) * 0.35);
  float grass = smoothstep(0.05, 0.5, vW.g + (n1 - 0.5) * 0.25);
  float wear = vW.b * smoothstep(0.3, 0.7, n2 + 0.2);
  float a = max(earth * 0.55, grass);
  if (a < 0.01) discard;
  vec3 soil = mix(vec3(0.44, 0.35, 0.23), vec3(0.58, 0.47, 0.32), n2);
  vec3 lawn = mix(vec3(0.30, 0.38, 0.12), vec3(0.44, 0.50, 0.18), n1);
  vec3 trod = mix(vec3(0.42, 0.42, 0.22), vec3(0.52, 0.47, 0.30), n2);
  vec3 col = mix(lawn, trod, wear);
  col = mix(col, mix(trod, soil, smoothstep(0.3, 0.9, earth)), earth * step(grass, earth + 0.2));
  col = pow(col, vec3(2.2));
  vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (n.y < 0.0) n = -n;
  float front = vnoise(vWorld.xz / 260.0) * 0.55 + vnoise((vWorld.xz + 37.0) / 70.0) * 0.30 + vnoise((vWorld.xz + 91.0) / 14.0) * 0.15;
  float cover = smoothstep(front, front + 0.18, uSnow * 1.02);
  cover = mix(cover * smoothstep(0.0, 0.12, uSnow), 1.0, smoothstep(0.9, 1.0, uSnow));
  col = mix(col, vec3(0.86, 0.89, 0.95), cover * (0.75 + 0.25 * n2));
  float sh;
  vec3 lit = shade(col, n, vWorld, 1.0, 0.1, sh);
  lit = atmosphere(lit, vWorld);
  // Blended over the terrain with its alpha factors overridden, so the depth in alpha stays the ground's.
  gl_FragColor = vec4(lit, a * 0.92);
}
`);var na=class{scene;ground;material;groups=new Map;snow=0;constructor(t,n,r){this.scene=t,this.ground=r,this.material=n.material(`decal`,`decal`,{attributes:[`position`,`color`],uniforms:[`uSnow`],needAlphaBlending:!0}),this.material.zOffset=-2,this.material.alphaMode=e.ALPHA_COMBINE,this.material.disableDepthWrite=!0;let i=t.getEngine();this.material.onBindObservable.add(()=>{this.material.getEffect()?.setFloat(`uSnow`,this.snow),i.alphaState.setAlphaBlendFunctionParameters(e.GL_ALPHA_FUNCTION_SRC_ALPHA,e.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA,0,1)})}add(e,t){let n=this.groups.get(e);n||this.groups.set(e,n={decals:[],mesh:null,dirty:!1,cx:0,cz:0,r:0}),n.decals.push(t),n.dirty=!0}removeGroup(e){let t=this.groups.get(e);t&&(t.mesh?.dispose(),this.groups.delete(e))}update(e,t,n,r=2){for(let[i,a]of this.groups)a.dirty&&r>0&&(r--,a.dirty=!1,this.build(i,a)),a.mesh&&a.mesh.setEnabled(Math.hypot(a.cx-e,a.cz-t)<n+a.r)}build(t,n){let r=new Map,i=(e,t)=>(e+32768)*65536+(t+32768),a=1/0,o=-1/0,s=1/0,c=-1/0;for(let e of n.decals){let t=e.r*1.25+ta,n=Math.floor((e.x-t)/ta),l=Math.ceil((e.x+t)/ta),u=Math.floor((e.z-t)/ta),d=Math.ceil((e.z+t)/ta),f=e.phase??0;for(let t=n;t<=l;t++)for(let n=u;n<=d;n++){let l=t*ta,u=n*ta,d=l-e.x,p=u-e.z,m=Math.atan2(p,d),h=1+.12*Math.sin(3*m+f)+.07*Math.sin(7*m+2*f),g=Math.hypot(d,p)/(e.r*h);if(g>1.15)continue;let _=i(t,n),v=r.get(_);if(v||r.set(_,v=[0,0,0,0]),e.kind===`yard`)v[0]=Math.max(v[0],1-ra(.2,1,g));else{let t=e.wearR?1-ra(.6,1.6,Math.abs(Math.hypot(d,p)-e.wearR)):0,n=e.strength??1;v[1]=Math.max(v[1],(1-ra(.55,1,g))*Math.max(n,t*.5)),v[2]=Math.max(v[2],t*Math.min(1,.4+n)),e.lift&&(v[3]=Math.max(v[3],e.lift*(1-g*g)))}a=Math.min(a,l),o=Math.max(o,l),s=Math.min(s,u),c=Math.max(c,u)}}let l=[],u=[],d=[],f=new Map,p=(e,t)=>{let n=i(e,t),a=f.get(n);if(a!==void 0)return a;let o=r.get(n)??[0,0,0,0],s=e*ta,c=t*ta;return l.push(s,this.ground.h(s,c)+.05+o[3],c),u.push(o[0],o[1],o[2],o[3]),a=l.length/3-1,f.set(n,a),a},m=new Set;for(let e of r.keys()){let t=Math.floor(e/65536)-32768,n=e%65536-32768;for(let[e,r]of[[0,0],[-1,0],[0,-1],[-1,-1]])m.add(i(t+e,n+r))}for(let e of m){let t=Math.floor(e/65536)-32768,n=e%65536-32768;if(![r.get(i(t,n)),r.get(i(t+1,n)),r.get(i(t,n+1)),r.get(i(t+1,n+1))].some(e=>e&&(e[0]>.01||e[1]>.01)))continue;let a=p(t,n),o=p(t+1,n),s=p(t,n+1),c=p(t+1,n+1);d.push(a,o,s,o,c,s)}n.mesh||(n.mesh=new v(`decal_${t}`,this.scene),n.mesh.material=this.material,n.mesh.isPickable=!1,n.mesh.onAfterRenderObservable.add(()=>this.scene.getEngine().alphaState.setAlphaBlendFunctionParameters(e.GL_ALPHA_FUNCTION_SRC_ALPHA,e.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA,1,1)));let h=new S;h.positions=l,h.colors=u,h.indices=d,h.normals=Array(l.length).fill(0).map((e,t)=>+(t%3==1)),h.applyToMesh(n.mesh,!1),n.mesh.refreshBoundingInfo(),n.cx=(a+o)/2,n.cz=(s+c)/2,n.r=Math.hypot(o-a,c-s)/2}};function ra(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function X(e,t,n){let r=Math.cos(n),i=Math.sin(n);return{x:e*r+t*i,z:-e*i+t*r}}var ia=class{world;constructor(e){this.world=e}h(e,t){return this.world.height(e,t)}normalY(e,t){let n=1.5,r=this.h(e-n,t)-this.h(e+n,t),i=this.h(e,t-n)-this.h(e,t+n);return 2*n/Math.hypot(r,2*n,i)}footprint(e,t,n,r,i,a,o=1.2){let s=1/0,c=-1/0;for(let a of[-1,0,1])for(let l of[-1,0,1]){let u=X(a*n,l*r,i),d=this.h(e+u.x,t+u.z);if(d<o)return null;s=Math.min(s,d),c=Math.max(c,d)}return c-s<=a?[s,c]:null}curtainSpan(e,t){let n=Math.hypot(t.x-e.x,t.z-e.z),r=Math.max(1,Math.ceil(n/3.5)),i=(t.x-e.x)/(n||1),a=(t.z-e.z)/(n||1);for(let n=0;n<r;n++){let o=1/0,s=-1/0;for(let c=0;c<=3;c++){let l=(n+c/3)/r;for(let n of[-1.25,0,1.25]){let r=this.h(e.x+(t.x-e.x)*l-a*n,e.z+(t.z-e.z)*l+i*n);if(r<1.2)return!1;o=Math.min(o,r),s=Math.max(s,r)}}if(s-o>3.2)return!1}return!0}};function aa(e,t,n){return{x:e.x+(t.x-e.x)*n,z:e.z+(t.z-e.z)*n}}function Z(e,t){return Math.hypot(e.x-t.x,e.z-t.z)}var oa=64,sa=class{cells=new Map;boxes=[];largest=0;version=0;key(e,t){return(e+4096)*8192+(t+4096)}add(e,t,n,r){let i={x:e,z:t,r:n,owner:r},a=this.key(Math.floor(e/oa),Math.floor(t/oa)),o=this.cells.get(a);o||this.cells.set(a,o=[]),o.push(i),this.largest=Math.max(this.largest,n),this.version++}addBox(e,t,n,r,i,a){this.boxes.push({cx:e,cz:t,hx:n,hz:r,yaw:i,owner:a})}removeOwner(e){for(let[t,n]of this.cells){let r=n.filter(t=>t.owner!==e);r.length!==n.length&&(r.length?this.cells.set(t,r):this.cells.delete(t))}this.boxes=this.boxes.filter(t=>t.owner!==e),this.version++}blocked(e,t,n,r){let i=this.largest+n,a=Math.floor((e-i)/oa),o=Math.floor((e+i)/oa),s=Math.floor((t-i)/oa),c=Math.floor((t+i)/oa);for(let i=a;i<=o;i++)for(let a=s;a<=c;a++){let o=this.cells.get(this.key(i,a));if(o)for(let i of o){if(i.owner===r)continue;let a=i.r+n;if((i.x-e)**2+(i.z-t)**2<a*a)return!0}}return!1}overlapsBox(e,t,n,r,i,a){let o=e=>[X(1,0,e),X(0,1,e)],s=o(i);for(let i of this.boxes){if(i.owner!==a||(i.cx-e)**2+(i.cz-t)**2>(Math.hypot(n,r)+Math.hypot(i.hx,i.hz))**2)continue;let c=o(i.yaw),l=!1;for(let a of[...s,...c]){let o=Math.abs(s[0].x*a.x+s[0].z*a.z)*n+Math.abs(s[1].x*a.x+s[1].z*a.z)*r,u=Math.abs(c[0].x*a.x+c[0].z*a.z)*i.hx+Math.abs(c[1].x*a.x+c[1].z*a.z)*i.hz;if(Math.abs((i.cx-e)*a.x+(i.cz-t)*a.z)>o+u){l=!0;break}}if(!l)return!0}return!1}circles(){let e=[];for(let t of this.cells.values())for(let n of t)e.push({x:n.x,z:n.z,r:n.r});return e}},ca=class{cells=new Map;segs=[];seen=new Set;version=0;constructor(e){for(let[t,n]of e){let e=ve(t);for(let t=0;t<6;t++)n&1<<t&&this.add(pe(e,t),pe(e,t+1))}}add(e,t){let n=la(e,t);if(this.seen.has(n))return;this.seen.add(n);let r=this.segs.length/4;this.segs.push(e.x,e.y,t.x,t.y);let i=Math.floor((Math.min(e.x,t.x)-12)/oa),a=Math.floor((Math.max(e.x,t.x)+12)/oa),o=Math.floor((Math.min(e.y,t.y)-12)/oa),s=Math.floor((Math.max(e.y,t.y)+12)/oa);for(let e=i;e<=a;e++)for(let t=o;t<=s;t++){let n=(e+4096)*8192+(t+4096),i=this.cells.get(n);i||this.cells.set(n,i=[]),i.push(r)}this.version++}distance(e,t){let n=this.cells.get((Math.floor(e/oa)+4096)*8192+(Math.floor(t/oa)+4096));if(!n)return 1/0;let r=1/0;for(let i of n){let n=this.segs[i*4],a=this.segs[i*4+1],o=this.segs[i*4+2],s=this.segs[i*4+3],c=o-n,l=s-a,u=Math.min(1,Math.max(0,((e-n)*c+(t-a)*l)/(c*c+l*l||1)));r=Math.min(r,Math.hypot(e-n-c*u,t-a-l*u))}return r}edges(){let e=[];for(let t=0;t<this.segs.length;t+=4)e.push({a:{x:this.segs[t],y:this.segs[t+1]},b:{x:this.segs[t+2],y:this.segs[t+3]}});return e}};function la(e,t){let n=e=>Math.round(e*4),r=`${n(e.x)},${n(e.y)}`,i=`${n(t.x)},${n(t.y)}`;return r<i?`${r},${i}`:`${i},${r}`}var ua=class{a;b;c;d;constructor(...e){let t=2654435769;for(let n of e)t=z(Math.trunc(n),t|0,5369127);this.a=t,this.b=z(t,1,7),this.c=z(t,2,11),this.d=1;for(let e=0;e<12;e++)this.next()}next(){let e=(this.a+this.b|0)+this.d|0;return this.d=this.d+1|0,this.a=this.b^this.b>>>9,this.b=this.c+(this.c<<3)|0,this.c=this.c<<21|this.c>>>11,this.c=this.c+e|0,e>>>0}f(){return this.next()/4294967296}range(e,t){return e+(t-e)*this.f()}int(e,t){return e+Math.floor(this.f()*(t-e+1))}pick(e){return e[Math.floor(this.f()*e.length)]}angle(){return this.f()*Math.PI*2}};function da(e,t){let n=e=>e<0?-Math.round(-e*4):Math.round(e*4);return`${n(e)},${n(t)}`}function fa(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return t>>>0}var Q={ASHLAR:0,RUBBLE:1,WOOD:2,CLOTH:3},pa=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;     // albedo (sRGB), material
attribute vec2 uv;        // flutter weight, phase
uniform mat4 world;
uniform mat4 viewProjection;
uniform float uTime;
uniform float uRise;      // 0 hidden under the ground .. 1 standing
uniform float uSnow;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
  vec3 p = position;
  vec3 n = normal;
  if (uv.x > 0.0) {
    // Cloth ripples away from the pole, more at the free edge.
    float w = uv.x;
    float t = uTime * 2.6 + uv.y * 6.2831853;
    float along = dot(p.xz, vec2(0.7071, 0.7071));
    p.x += sin(t + along * 2.2) * 0.22 * w;
    p.z += cos(t * 0.8 + along * 1.7) * 0.18 * w;
    p.y += sin(t * 1.3 + along * 3.0) * 0.06 * w;
  }
  if (color.a < 0.5 || color.a > 1.5 && color.a < 2.5) p.y += uSnow * smoothstep(0.55, 0.9, n.y) * 0.06;
  vec4 wp = world * vec4(p, 1.0);
  wp.y -= (1.0 - uRise) * 14.0;
  vWorld = wp.xyz;
  vNormal = normalize(mat3(world) * n);
  vColor = color;
  gl_Position = viewProjection * wp;
}
`,ma=`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
${V}
${H}
uniform float uSnow;
uniform float uReveal;    // world height a group is built up to (scaffolds going up and coming down)

float jit(float k, float row, float s) { return hash12(vec2(k * 1.37 + s, row * 2.11 + 0.7)) - 0.5; }

// Rough coursed stone in world space: course heights and block lengths jittered block by block (a regular grid reads
// as brick), soft pillowed faces with a lit bevel along each top edge, joints faded out where a course is smaller
// than a couple of pixels (no aliasing at the board camera).
vec3 courses(vec3 wp, vec3 n, vec3 base, float courseH, float blockL, float mortar) {
  vec2 q = abs(n.x) > abs(n.z) ? vec2(wp.z, wp.y) : vec2(wp.x, wp.y);
  if (abs(n.y) > 0.7) q = wp.xz;
  float v = q.y / courseH;
  float r = floor(v);
  float b0 = r + jit(r, 0.0, 3.0) * 0.3;
  float row = v < b0 ? r - 1.0 : r;
  float lo = v < b0 ? r - 1.0 + jit(r - 1.0, 0.0, 3.0) * 0.3 : b0;
  float hi = v < b0 ? b0 : r + 1.0 + jit(r + 1.0, 0.0, 3.0) * 0.3;
  float fy = (v - lo) / (hi - lo);
  float rh = (hi - lo) * courseH;
  float len = blockL * mix(0.8, 1.25, hash12(vec2(row, 1.3)));
  float u = q.x / len + hash12(vec2(row, 3.1)) * 3.0;
  float k = floor(u);
  float c0 = k + jit(k, row, 7.0) * 0.4;
  float col = u < c0 ? k - 1.0 : k;
  float ulo = u < c0 ? k - 1.0 + jit(k - 1.0, row, 7.0) * 0.4 : c0;
  float uhi = u < c0 ? c0 : k + 1.0 + jit(k + 1.0, row, 7.0) * 0.4;
  float fx = (u - ulo) / (uhi - ulo);
  float bl = (uhi - ulo) * len;
  float edge = min(min(fx, 1.0 - fx) * bl, min(fy, 1.0 - fy) * rh);
  float px = max(fwidth(q.y), fwidth(q.x));
  float aa = 1.0 - smoothstep(courseH * 0.12, courseH * 0.5, px);
  float joint = (1.0 - smoothstep(0.015, 0.06, edge)) * aa;
  float tone = (hash12(vec2(col, row)) - 0.5) * 0.36 * aa;
  float warm = (hash12(vec2(col + 17.0, row)) - 0.5) * 0.1 * aa;
  float pillow = smoothstep(0.0, 0.3, edge) * 0.08 * aa;
  float bevel = (1.0 - smoothstep(0.02, 0.1, (1.0 - fy) * rh)) * smoothstep(0.0, 0.04, edge) * 0.14 * aa;
  vec3 c = base * (1.0 + tone + pillow + bevel - 0.06) * vec3(1.0 + warm, 1.0, 1.0 - warm);
  return mix(c, base * mortar, joint);
}

void main() {
#ifdef REVEAL
  if (vWorld.y > uReveal) discard;
#endif
  vec3 n = normalize(vNormal);
  vec3 ng = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 toCam = uCamPos - vWorld;
  if (dot(ng, toCam) < 0.0) ng = -ng;
  if (dot(n, ng) < 0.0) n = -n;
  vec3 base = pow(vColor.rgb, vec3(2.2));
  float kind = vColor.a;
  float broad = vnoise(vWorld.xz * 0.23 + vWorld.y * 0.31);
  if (kind < 0.5) {
    base = courses(vWorld, n, base, 0.46, 0.85, 0.62);
    // Weathering: broad stains and patches of green-brown damp.
    base *= mix(0.84, 1.1, broad) * mix(0.92, 1.05, vnoise(vWorld.xz * 0.05 + vWorld.y * 0.02));
    base = mix(base, base * vec3(0.82, 0.86, 0.72), smoothstep(0.55, 0.85, vnoise(vWorld.xz * 0.21 + vWorld.y * 0.4)) * 0.35);
  } else if (kind < 1.5) {
    base = courses(vWorld, n, base, 0.38, 0.72, 0.78) * mix(0.85, 1.05, broad);
  } else if (kind < 2.5) {
    vec2 q = abs(n.y) > 0.7 ? vWorld.xz : vec2(vWorld.x + vWorld.z, vWorld.y);
    float grain = vnoise(vec2(q.x * 9.0, q.y * 0.6)) * 0.5 + vnoise(vec2(q.x * 23.0, q.y * 1.3)) * 0.25;
    base *= mix(0.8, 1.1, grain) * mix(0.9, 1.05, broad);
  }
  float dab = sin(vWorld.x * 3.7 + vWorld.z * 2.1) * sin(vWorld.z * 4.3);
  float cap = smoothstep(0.35, 0.7, n.y + dab * 0.04) * step(kind, 2.5);
  float front = vnoise(vWorld.xz / 260.0) * 0.55 + vnoise((vWorld.xz + 37.0) / 70.0) * 0.30 + vnoise((vWorld.xz + 91.0) / 14.0) * 0.15;
  float cover = smoothstep(front, front + 0.18, uSnow * 1.02);
  cover = mix(cover * smoothstep(0.0, 0.12, uSnow), 1.0, smoothstep(0.9, 1.0, uSnow));
  base = mix(base, vec3(0.90, 0.92, 0.96), cap * cover);
  float sh;
  float wrap = kind > 2.5 && kind < 3.5 ? 0.5 : 0.2;
  vec3 col = shade(base, n, vWorld, 1.0, wrap, sh);
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`,ha=`
precision highp float;
varying vec3 vWorld;
uniform float uReveal;
void main() {
#ifdef REVEAL
  if (vWorld.y > uReveal) discard;
#endif
  gl_FragColor = vec4(1.0);
}
`;U(`masonry`,pa,ma);var ga=1e6;U(`masonryDepth`,pa,ha);var _a=class{p=[];n=[];c=[];f=[];i=[];get count(){return this.p.length/3}vertex(e,t,n,r,i,a,o,s,c=0,l=0){return this.p.push(e,t,n),this.n.push(r,i,a),this.c.push(o[0],o[1],o[2],s),this.f.push(c,l),this.count-1}tri(e,t,n){this.i.push(e,t,n)}quad(e,t,n,r,i,a,o=[0,0,0,0],s=0){let c=t[0]-e[0],l=t[1]-e[1],u=t[2]-e[2],d=r[0]-e[0],f=r[1]-e[1],p=r[2]-e[2],m=l*p-u*f,h=u*d-c*p,g=c*f-l*d,_=Math.hypot(m,h,g)||1;m/=_,h/=_,g/=_;let v=this.vertex(e[0],e[1],e[2],m,h,g,i,a,o[0],s),y=this.vertex(t[0],t[1],t[2],m,h,g,i,a,o[1],s),b=this.vertex(n[0],n[1],n[2],m,h,g,i,a,o[2],s),x=this.vertex(r[0],r[1],r[2],m,h,g,i,a,o[3],s);this.tri(v,y,b),this.tri(v,b,x)}box(e,t,n,r,i,a,o,s,c,l={}){let u=Math.cos(o),d=Math.sin(o),f=l.taper??1,p=(o,s,c)=>{let l=s>0?f:1,p=o*r*l,m=c*a*l;return[e+p*u+m*d,t+s*i,n-p*d+m*u]};this.quad(p(-1,1,-1),p(-1,1,1),p(1,1,1),p(1,1,-1),s,c),this.quad(p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1),s,c),this.quad(p(1,-1,-1),p(-1,-1,-1),p(-1,1,-1),p(1,1,-1),s,c),this.quad(p(1,-1,1),p(1,-1,-1),p(1,1,-1),p(1,1,1),s,c),this.quad(p(-1,-1,-1),p(-1,-1,1),p(-1,1,1),p(-1,1,-1),s,c),l.bottom&&this.quad(p(-1,-1,-1),p(1,-1,-1),p(1,-1,1),p(-1,-1,1),s,c)}append(e){let t=this.count;this.p.push(...e.p),this.n.push(...e.n),this.c.push(...e.c),this.f.push(...e.f);for(let n of e.i)this.i.push(n+t)}},va=class{scene;lighting;shadows;material;depth;clipMaterial;clipDepth;groups=new Map;snow=0;constructor(e,t,n){this.scene=e,this.lighting=t,this.shadows=n;let r=[`position`,`normal`,`color`,`uv`],i=(e,n)=>t.material(e,`masonry`,{attributes:r,uniforms:[`uRise`,`uSnow`,`uReveal`],defines:n}),a=(e,n)=>t.material(e,`masonryDepth`,{attributes:r,uniforms:[`uRise`,`uSnow`,`uTime`,`uReveal`],lit:!1,defines:n});this.material=i(`masonry`,[]),this.depth=a(`masonryDepth`,[]),this.clipMaterial=i(`masonryClip`,[`REVEAL`]),this.clipDepth=a(`masonryClipDepth`,[`REVEAL`]);let o=(e,t)=>{let n=e.getEffect();if(!n)return;let r=t?this.groups.get(t.name.slice(4)):void 0;n.setFloat(`uRise`,r?r.rise:1),n.setFloat(`uReveal`,r?r.reveal:ga),n.setFloat(`uSnow`,this.snow),n.setFloat(`uTime`,this.lighting.time)};for(let e of[this.material,this.depth,this.clipMaterial,this.clipDepth])e.backFaceCulling=!1,e.onBindObservable.add(t=>o(e,t))}set(e,t,n){let r=this.group(e);r.parts.set(t,n),r.dirty=!0}removeGroup(e){let t=this.groups.get(e);t&&(t.mesh&&(this.shadows.removeCaster(t.mesh),t.mesh.dispose()),this.groups.delete(e))}setRise(e,t){this.group(e).rise=t}setReveal(e,t){let n=this.group(e);n.reveal=t??ga,n.clip!==(t!==void 0)&&(n.clip=t!==void 0,this.dress(e,n))}dress(e,t){t.mesh&&(t.mesh.material=t.clip?this.clipMaterial:this.material,this.shadows.removeCaster(t.mesh),this.shadows.addCaster(t.mesh,t.clip?this.clipDepth:this.depth,+!e.startsWith(`lm:`)))}place(e,t,n,r){let i=this.group(e);i.cx=t,i.cz=n,i.r=r}group(e){let t=this.groups.get(e);return t||this.groups.set(e,t={mesh:null,parts:new Map,dirty:!1,rise:1,reveal:ga,clip:!1,cx:0,cz:0,r:0}),t}update(e,t,n){for(let[r,i]of this.groups){if(i.dirty){i.dirty=!1;let e=new _a;for(let t of i.parts.values())e.append(t);if(!e.count){i.mesh&&i.mesh.setEnabled(!1);continue}i.mesh||(i.mesh=new v(`mas_${r}`,this.scene),i.mesh.isPickable=!1,this.dress(r,i));let t=new S;t.positions=e.p,t.normals=e.n,t.colors=e.c,t.uvs=e.f,t.indices=e.i,t.applyToMesh(i.mesh,!0),i.mesh.refreshBoundingInfo()}i.mesh&&i.mesh.setEnabled(Math.hypot(i.cx-e,i.cz-t)<n+i.r&&i.parts.size>0)}}stats(){let e=0;for(let t of this.groups.values())t.mesh?.isEnabled()&&e++;return e}},ya=[.47,.45,.41],ba=[.4,.38,.34],xa=[.72,.67,.57],Sa=[.6,.55,.46],Ca=[.47,.36,.23],wa=[.36,.27,.17],Ta=1.12;function Ea(e,t){let n=!1;for(let r=0,i=t.length-1;r<t.length;i=r++){let a=t[r],o=t[i];a.z>e.z!=o.z>e.z&&e.x<(o.x-a.x)*(e.z-a.z)/(o.z-a.z)+a.x&&(n=!n)}return n}function Da(e,t,n,r,i=[],a=!1){let o=n*Ta,s=(e,t,n)=>({x:e.x+Math.cos(t)*n,z:e.z+Math.sin(t)*n}),c=t=>e.footprint(t.x,t.z,a?1.2:2.8,a?1.2:2.8,0,a?2.5:2.6)!==null,l=t=>{let n=aa(t[0],t[1],.5);return e.footprint(n.x,n.z,3.4,2.1,-Math.atan2(t[1].z-t[0].z,t[1].x-t[0].x),a?2.5:2)!==null},u=(t,n)=>{if(!a)return e.curtainSpan(t,n);let r=Math.ceil(Z(t,n)/2);for(let i=0;i<=r;i++){let a=aa(t,n,i/r);if(e.h(a.x,a.z)<1.2)return!1}return!0},d=[t,...i],f=[t];for(let e of[8,16,24,32])for(let n=0;n<8;n++)f.push(s(t,Math.PI*2*n/8,e));for(let t of[1,.9,.82,.74,.65,.5,.36,.24])for(let n of[0,Math.PI/8,-Math.PI/8])for(let i of f){if(e.h(i.x,i.z)<1.2)continue;let a=[];for(let e=0;e<4;e++){let l=r+n+Math.PI*2*(e-.5)/4;for(let e of[1,.92,.84,.76,.68,.6]){let n=s(i,l,o*t*e);if(c(n)){a.push(n);break}}if(a.length!==e+1)break}if(a.length<4||!d.every(e=>Ea(e,a)))continue;let f=!0;for(let e=0;e<4&&f;e++)f=u(a[e],a[(e+1)%4]);if(f)for(let e of[0,1,3,2]){let t=[0,1,2,3].map(t=>a[(t+e)%4]);if(l(t))return t}}return[]}function Oa(e,t,n,r,i={}){let a=e.ground,o=e.southern(t[0].x,t[0].z),s=o?xa:ya,c=o?Sa:ba,l=i.keepOff??[],u=t=>e.lanes.distance(t.x,t.z)<3.2||l.some(e=>Math.hypot(e.x-t.x,e.z-t.z)<e.r+2.2),d=new _a,f=[],p=new ua(r,41),m=null;for(let r=0;r<t.length;r++){let o=t[r],l=t[(r+1)%t.length],h=Z(o,l),g=(l.x-o.x)/h,_=(l.z-o.z)/h;if(r===0){let t=aa(o,l,.5);m=t;let r=e.asset(`gatehouse`),p=(r.max[0]-r.min[0])*.58,h=-Math.atan2(_,g),v=e.seat(`gatehouse`,t.x,t.z,h,.58,1.5,n);v&&f.push(e.commit(v,n,{grow:i.grow,ruin:i.ruin,footing:i.grow!==0}));let y=p*.45;ka(a,d,o,{x:t.x-g*y,z:t.z-_*y},u,s,c),ka(a,d,{x:t.x+g*y,z:t.z+_*y},l,u,s,c)}else ka(a,d,o,l,u,s,c);let v=e.asset(`tower`),y=9*p.range(.92,1.12)/v.height,b=e.seat(`tower`,o.x,o.z,-Math.atan2(_,g)+Math.floor(p.f()*4)*(Math.PI/2),1,1.5,n);if(b){let t=e.commit(b,n,{grow:i.grow,ruin:i.ruin,footing:i.grow!==0});e.props.update(t.ids[0],{scaleXYZ:[1,y,1]}),f.push(t)}else ja(a,d,o,Math.atan2(_,g),s)}return{ring:t,placed:f,geo:d,gate:m}}function ka(e,t,n,r,i,a,o){let s=Z(n,r),c=Math.max(1,Math.ceil(s/3.5)),l=-Math.atan2(r.z-n.z,r.x-n.x),u=1.25;for(let s=0;s<c;s++){let d=aa(n,r,s/c),f=aa(n,r,(s+1)/c);if(i(aa(d,f,.5)))continue;let p=Aa(e,d,f,u),m=p[1]-.18+4.5,h=p[0]-.6,g=Z(d,f)/2+.06,_=aa(d,f,.5),v=(m-.9-h)/2;t.box(_.x,h+v,_.z,g,v,u,l,a,Q.ASHLAR,{taper:.94}),p[1]-p[0]>.25&&t.box(_.x,h+(p[1]-p[0])/2+.2,_.z,g+.02,(p[1]-p[0])/2+.5,1.5,l,o,Q.RUBBLE);let y=X(0,-.95,l),b=X(0,1.05,l),x=m-.9;for(let e of[-.5,.5]){let n=X(e*g,0,l);t.box(_.x+y.x+n.x,x+.95,_.z+y.z+n.z,g*.34,.95,.36,l,a,Q.ASHLAR)}t.box(_.x+y.x,x+.3,_.z+y.z,g,.3,.32,l,a,Q.ASHLAR),t.box(_.x+b.x,x+.2,_.z+b.z,g,.2,.2,l,a,Q.ASHLAR)}}function Aa(e,t,n,r){let i=Z(t,n)||1,a=(n.x-t.x)/i,o=(n.z-t.z)/i,s=1/0,c=-1/0;for(let i=0;i<=3;i++){let l=i/3;for(let i of[-r,0,r]){let r=e.h(t.x+(n.x-t.x)*l-o*i,t.z+(n.z-t.z)*l+a*i);s=Math.min(s,r),c=Math.max(c,r)}}return[s,c]}function ja(e,t,n,r,i){let a=e.h(n.x,n.z)-.8,o=e.h(n.x,n.z)+8;t.box(n.x,(a+o)/2,n.z,2.6,(o-a)/2,2.6,r,i,Q.ASHLAR,{taper:.95});for(let e=0;e<4;e++)for(let a of[-.6,.6]){let s=X(a*2,2.3,r+e*Math.PI/2);t.box(n.x+s.x,o+.45,n.z+s.z,.5,.45,.3,r+e*Math.PI/2,i,Q.ASHLAR)}}function Ma(e,t,n,r=[],i=()=>!1){let a=new _a,o=new ua(n,77),s=e=>!i(e)&&!r.some(t=>Math.hypot(t.x-e.x,t.z-e.z)<t.r+1);for(let n=0;n<t.length;n++){let r=t[n],i=t[(n+1)%t.length],c=Z(r,i),l=Math.ceil(c/.5),u=aa(r,i,.5),d=-Math.atan2(i.z-r.z,i.x-r.x);for(let t=0;t<=l;t++){let c=aa(r,i,t/l);if(n===0&&Z(c,u)<2.1||Z(c,r)<1.1||Z(c,i)<1.1||!s(c))continue;let f=e.h(c.x,c.z),p=2.8*o.range(.9,1.08),m=.21*o.range(.85,1.1),h=o.f()<.3?wa:Ca;a.box(c.x,f-.2+p/2,c.z,m,p/2,m,d+o.range(-.3,.3),h,Q.WOOD);let g=f-.2+p,_=[[-m,-m],[m,-m],[m,m],[-m,m]].map(([e,t])=>{let n=X(e,t,d);return[c.x+n.x,g,c.z+n.z]}),v=[c.x,g+.45,c.z];for(let e=0;e<4;e++){let t=_[e],n=_[(e+1)%4],r=a.count,i=(t[0]+n[0])/2-c.x,o=(t[2]+n[2])/2-c.z,s=Math.hypot(i,.5,o);a.vertex(t[0],t[1],t[2],i/s,.5/s,o/s,h,Q.WOOD),a.vertex(n[0],n[1],n[2],i/s,.5/s,o/s,h,Q.WOOD),a.vertex(v[0],v[1],v[2],i/s,.5/s,o/s,h,Q.WOOD),a.tri(r,r+1,r+2)}}let f=X(0,.35,d);for(let t=0;t<Math.ceil(c/4);t++){let o=aa(r,i,(t+.5)/Math.ceil(c/4));n===0&&Z(o,u)<3||a.box(o.x+f.x,e.h(o.x,o.z)+1.7,o.z+f.z,c/Math.ceil(c/4)/2,.08,.08,d,wa,Q.WOOD)}let p=e.h(r.x,r.z);for(let[t,n]of[[-.9,-.9],[.9,-.9],[.9,.9],[-.9,.9]]){let i=e.h(r.x+t,r.z+n)-.2,o=p+5.4;a.box(r.x+t,(i+o)/2,r.z+n,.14,(o-i)/2,.14,0,wa,Q.WOOD)}a.box(r.x,p+3.8,r.z,1.15,.14,1.15,0,Ca,Q.WOOD);for(let e=0;e<4;e++){let t=X(0,1.1,e*Math.PI/2);a.box(r.x+t.x,p+4.35,r.z+t.z,1.15,.45,.06,e*Math.PI/2,Ca,Q.WOOD)}}let c=t[0],l=t[1],u=aa(c,l,.5),d=-Math.atan2(l.z-c.z,l.x-c.x),f=e.h(u.x,u.z);for(let e of[-2.1,2.1]){let t=X(e,0,d);a.box(u.x+t.x,f+1.5,u.z+t.z,.28,1.9,.28,d,wa,Q.WOOD)}return a.box(u.x,f+3.2,u.z,2.5,.2,.32,d,Ca,Q.WOOD),a}function Na(e,t,n){let r=new _a,i={x:t.x+10,z:t.z+10};for(let t=0;t<3;t++)for(let a=0;a<5;a++){let o=t===0?{x:i.x+a*1.5-3,z:i.z-3}:{x:i.x+(t===1?-3:3),z:i.z+a*1.5-3};if(e.h(o.x,o.z)<1.5||n(o))continue;let s=e.h(o.x,o.z);if(r.box(o.x,s+.45,o.z,.065,.55,.065,0,wa,Q.WOOD),a<4)for(let n of[.35,.75]){let i=t===0?{x:o.x+.75,z:o.z}:{x:o.x,z:o.z+.75};r.box(i.x,e.h(i.x,i.z)+n,i.z,t===0?.8:.06,.06,t===0?.06:.8,0,Ca,Q.WOOD)}}return r}function Pa(e,t,n,r){let i=new _a,a=Math.max(12,Math.round(Math.PI*2*n/2.2)),o=e=>({x:t.x+Math.cos(e/a*Math.PI*2)*n,z:t.z+Math.sin(e/a*Math.PI*2)*n});for(let s=0;s<a;s++){let a=o(s),c=o(s+1),l=Math.atan2((a.z+c.z)/2-t.z,(a.x+c.x)/2-t.x),u=Math.abs((l-r+Math.PI*3)%(Math.PI*2)-Math.PI),d=e.h(a.x,a.z);if(i.box(a.x,d+.5,a.z,.07,.62,.07,0,wa,Q.WOOD),u<2/n)continue;let f=aa(a,c,.5),p=Z(a,c),m=Math.atan2(-(c.z-a.z),c.x-a.x);for(let t of[.42,.85])i.box(f.x,e.h(f.x,f.z)+t,f.z,p/2+.05,.055,.05,m,Ca,Q.WOOD)}return i}function Fa(e,t,n,r){let i=[];for(let a of e.edges()){let e={x:a.a.x,z:a.a.y},o={x:a.b.x,z:a.b.y};if(Math.min(Z(e,t),Z(o,t))>n+25)continue;let s=Z(e,o),c=(o.x-e.x)/s,l=(o.z-e.z)/s,u=-l,d=c;for(let a=4;a<s-2;a+=r.range(10,13)){let o={x:e.x+c*a,z:e.z+l*a};if(!(Z(o,t)>=n))for(let e of[-1,1]){let t=r.range(8,10.5),n={x:o.x+u*e*t,z:o.z+d*e*t},a=-u*e,s=-d*e;i.push({p:n,yaw:Math.atan2(a,s)})}}}return i.sort((e,n)=>Z(e.p,t)-Z(n.p,t)),i}function Ia(e,t){return Math.atan2(t.x-e.x,t.z-e.z)}var La=`home`,Ra=8,za=[{cottage:4,timber:0,radius:26},{cottage:6,timber:3,radius:34},{cottage:11,timber:10,radius:44}],Ba=class{placer;seed;windmills;settlements=[];curtain=[];owner=e=>`${La}:${e}`;constructor(e,t,n=!0){this.placer=e,this.seed=t,this.windmills=n}build(){let e=this.placer.world.home,t=new ua(this.seed,31),n=e.settlements.map(e=>({x:e.x,z:e.y}));n.forEach((e,t)=>this.settlements.push({index:t,centre:e,placed:[],mills:[]})),n.length>=3&&this.walls(n[2]),this.keep(),this.centres(t),this.houses();for(let e=0;e<Math.min(2,n.length);e++)this.garden(e);this.harbour(t),this.farmyards(t)}free(e,t){let n=this.placer.ground;return n.h(e.x,e.z)>=1.5&&n.normalY(e.x,e.z)>=.86&&!this.placer.occ.blocked(e.x,e.z,t)}onRoad(e,t){return this.placer.lanes.distance(e.x,e.z)<t}add(e,t,n,r,i,a=1.25,o=!0){let s=this.placer,c=this.owner(e),l=s.seat(t,n.x,n.z,r,i,t===`keep`?2.8:a,c);for(let e=0;!l&&o&&e<16;e++){let o={x:n.x+Math.cos(e*2.4)*(1+e*.35),z:n.z+Math.sin(e*2.4)*(1+e*.35)};this.free(o,5)&&!this.onRoad(o,5.5)&&(l=s.seat(t,o.x,o.z,r,i,a,c))}if(!l)return null;let u=s.commit(l,c);return this.settlements[e].placed.push(u),u}walls(e){let t=this.placer,n=0,r=1/0;for(let i of t.lanes.edges()){let t={x:(i.a.x+i.b.x)/2,z:(i.a.y+i.b.y)/2},a=Z(t,e);a<r&&a>8&&(r=a,n=Math.atan2(t.z-e.z,t.x-e.x))}let i=Da(t.ground,e,52,n);if(i.length<4)return;this.curtain=i;let a=this.owner(2);for(let e=0;e<4;e++){let n=i[e],r=i[(e+1)%4],o=Math.ceil(Z(n,r)/2.2);for(let e=0;e<o;e++)t.occ.add(n.x+(r.x-n.x)*(e/o),n.z+(r.z-n.z)*(e/o),2.6,a)}}keep(){let e=this.placer,t=e.world.home,n=t.settlements.length;if(!n)return;let r=n-1,i=e.asset(`keep`),a=Math.max(i.max[0]-i.min[0],i.max[2]-i.min[2])*.5;if(this.curtain.length>=3){let t=this.curtain,n={x:t.reduce((e,t)=>e+t.x,0)/t.length,z:t.reduce((e,t)=>e+t.z,0)/t.length},i=1/0;for(let e=0;e<t.length;e++)i=Math.min(i,Ha(n,t[e],t[(e+1)%t.length]));let o=Math.min(.82,(i-6)/Math.max(a,.1));if(o>=.5){let s=-Math.atan2(t[1].z-t[0].z,t[1].x-t[0].x),c=Math.max(0,i-6-a*o),l=[n];for(let e=0;e<12;e++){let t=Math.PI*2*e/12,r=c*(e%2==0?.5:1);l.push({x:n.x+Math.cos(t)*r,z:n.z+Math.sin(t)*r})}for(let t of l)if(e.ground.h(t.x,t.z)>=1.5&&!this.onRoad(t,a*o+1)&&this.add(r,`keep`,t,s,o,2.8,!1))return}}let o=new ua(this.seed,918),s={x:t.settlements[r].x,z:t.settlements[r].y},c=[s];for(let t=0;t<320;t++){let t={x:s.x+o.range(-24,24),z:s.z+o.range(-24,24)};e.ground.normalY(t.x,t.z)>.7&&c.push(t)}c.sort((t,n)=>e.ground.h(n.x,n.z)-e.ground.h(t.x,t.z));for(let e of c)if(this.free(e,11)&&!this.onRoad(e,11)&&this.add(r,`keep`,e,.25,.8,2.8,!1))return}centres(e){for(let t of this.settlements){let n=t.centre;for(let r=0;r<80;r++){let i=7+r*.1,a={x:n.x+e.range(-i,i),z:n.z+e.range(-i,i)},o=this.placer.ground;if(o.h(a.x,a.z)>=1.5&&o.normalY(a.x,a.z)>=.8&&!this.placer.occ.blocked(a.x,a.z,2.5)&&!this.onRoad(a,3.5)&&this.add(t.index,`well`,a,e.angle(),1,1.25,!1))break}if(t.index>=1)for(let r=0;r<40;r++){let r=e.angle(),i=e.range(14,22),a={x:n.x+Math.cos(r)*i,z:n.z+Math.sin(r)*i};if(this.free(a,6)&&!this.onRoad(a,6.5)){this.add(t.index,`chapel`,a,Ia(a,n),1);break}}if(t.index===2)for(let r=0;r<3;r++)for(let r=0;r<50;r++){let r=e.angle(),i=e.range(9,16),a={x:n.x+Math.cos(r)*i,z:n.z+Math.sin(r)*i};if(this.free(a,3)&&!this.onRoad(a,4)&&this.add(t.index,`stall`,a,Ia(a,n),.85,1.25,!1))break}}}houses(){let e=this.placer,t=new ua(this.seed,31,11);for(let n of this.settlements){let r=za[Math.min(n.index,za.length-1)],i=n.centre,a=[];for(let e=0;e<r.timber;e++)a.push(`timber`);for(let e=0;e<r.cottage;e++)a.push(`cottage`);let o=Fa(e.lanes,i,r.radius+10,t);o.sort((t,n)=>e.ground.normalY(n.p.x,n.p.z)-e.ground.normalY(t.p.x,t.p.z));for(let e of o){if(!a.length)break;let o=e.p;Z(o,i)<=r.radius&&this.free(o,5)&&!this.onRoad(o,5.5)&&this.add(n.index,a[a.length-1],o,e.yaw+t.range(-.12,.12),t.range(.78,.9))&&a.pop()}for(let e of a)for(let a=0;a<120;a++){let a=t.angle(),o=t.range(9,r.radius),s={x:i.x+Math.cos(a)*o,z:i.z+Math.sin(a)*o};if(this.free(s,5.5)&&!this.onRoad(s,6.5)&&this.add(n.index,e,s,Ia(s,i)+t.range(-.35,.35),t.range(.78,.9)))break}if(n.index>=1&&this.windmills){let r=null,a=-1/0;for(let n=0;n<60;n++){let n=t.angle(),o=t.range(45,90),s={x:i.x+Math.cos(n)*o,z:i.z+Math.sin(n)*o},c=e.ground.h(s.x,s.z);this.curtain.length&&Va(s,this.curtain,6)||this.free(s,7)&&!this.onRoad(s,8)&&c>a&&(a=c,r=s)}if(r){let e=this.mill(n.index,r,t.angle());e&&n.mills.push(e)}}}}mill(e,t,n){let r=this.placer,i=this.owner(e),a=t,o=r.seat(`mill`,a.x,a.z,n,1,1.6,i);for(let e=0;!o&&e<20;e++)a={x:t.x+Math.cos(e*2.4)*(2+e*.4),z:t.z+Math.sin(e*2.4)*(2+e*.4)},this.free(a,7)&&!this.onRoad(a,8)&&(o=r.seat(`mill`,a.x,a.z,n,1,1.6,i));if(!o)return null;let s=r.commit(o,i);return s.ids.push(r.props.add(`life_windmill_sails`,{x:o.x,y:o.y,z:o.z,yaw:n,scale:1,phase:(.37*o.x+.11*o.z)/(Math.PI*2)%1})),this.settlements[e].placed.push(s),s}garden(e){let t=this.placer,n=this.settlements[e].centre,r=this.owner(e);t.masonry.set(r,`garden`,Na(t.ground,n,e=>t.occ.blocked(e.x,e.z,.3))),t.decals.add(r,{x:n.x+10,z:n.z+10,r:3.6,kind:`yard`,phase:2})}harbour(e){let t=this.placer,n=this.settlements.length;if(!n)return;let r=this.settlements[n-1].centre,i=t.asset(`pier`),a=(i.max[0]-i.min[0])/2,o=(i.max[2]-i.min[2])/2,s=this.berth(r),c=null,l=1e9,u=null,d=1e9;for(let e=0;e<720;e++){let n=Math.PI*2*e/720,i=Math.cos(n),f=Math.sin(n);for(let e=20;e<220;e+=2){let n={x:r.x+i*e,z:r.z+f*e};if(t.ground.h(n.x,n.z)<.2){e<d&&(d=e,u=n);let t={x:n.x+i*a*2,z:n.z+f*a*2};e<l&&(!s||Ha(s,n,t)>o+Ra)&&(l=e,c=n);break}}}if(c||(c=u,l=d),!c||l>200)return;let f=c,p=Math.hypot(f.x-r.x,f.z-r.z),m={x:(f.x-r.x)/p,z:(f.z-r.z)/p},h={x:-m.z,z:m.x},g=(e,t)=>({x:f.x+m.x*e+h.x*t,z:f.z+m.z*e+h.z*t}),_=(e,t)=>!s||Math.hypot(e.x-s.x,e.z-s.z)>t+Ra,v=-Math.atan2(m.z,m.x),y=0;for(;y>-6&&t.ground.h(g(y,0).x,g(y,0).z)<1;)y-=.5;let b=g(y+a,0),x=this.owner(n-1);t.props.add(`pier`,{x:b.x,y:-1.5,z:b.z,yaw:v,scale:1});for(let e=y;e<=y+a*2;e+=5){let n=g(e,0);t.occ.add(n.x,n.z,o+.5,x)}for(let n=0;n<3;n++){let r=g(y+e.range(6,a*2-4),(o+1.3)*(n%2==0?1:-1));t.ground.h(r.x,r.z)<-.8&&_(r,2.2)&&t.props.add(`rowboat`,{x:r.x,y:-.32,z:r.z,yaw:v+e.range(-.12,.12),scale:1})}this.crane(x,g,v,o,_)}berth(e){let t=null,n=1e9;for(let r of oe(R({x:e.x,y:e.z}),3)){if(!L(this.placer.world.baseType(r)))continue;let i=I(r),a=Math.hypot(i.x-e.x,i.y-e.z);a<n&&(n=a,t={x:i.x,z:i.y})}return t}crane(e,t,n,r,i){let a=this.placer,o=a.asset(`crane`),s=o.min[0],c=s+5,l=o.max[2],u=X((s+c)/2,0,n),d=(e,t,r)=>{let i=X(t,r,n);return a.ground.h(e.x+i.x,e.z+i.z)};for(let f of[1,-1])for(let p=2;p>=-10;p--){let m=t(p-c,f*(r+l+1)),h=[];for(let e of[s,(s+c)/2,c])for(let t of[-l,0,l])h.push(d(m,e,t));let g=Math.max(...h),_=Math.min(0,...h)-.8,v={x:m.x+u.x,z:m.z+u.z};if(g<.8||g>3.5||d(m,o.max[0],0)>.2||a.occ.blocked(v.x,v.z,5/2)||!i(m,o.max[0]))continue;let y=g-.15;a.props.add(`crane`,{x:m.x,y,z:m.z,yaw:n,scale:1});let b=new _a;b.box(v.x,(_+y+.1)/2,v.z,2.7,(y+.1-_)/2,l+.2,n,ya,Q.ASHLAR,{taper:.97}),a.masonry.set(e,`quay`,b),a.occ.add(v.x,v.z,3,e);return}}farmyards(e){let t=this.placer;for(let n of this.settlements){let r=n.centre;for(let t=0;t<50;t++){let t=e.angle(),i=e.range(38,60),a={x:r.x+Math.cos(t)*i,z:r.z+Math.sin(t)*i};if(this.free(a,8)&&!this.onRoad(a,8)){this.add(n.index,`barn`,a,e.angle(),1);break}}let i=0;for(let a=0;a<400&&i<7;a++){let a={x:r.x+e.range(-90,90),z:r.z+e.range(-90,90)},o=t.world.cropAt({x:a.x,y:a.z});(o===0||o===1)&&t.world.parcelEdgeDist({x:a.x,y:a.z})>2.5&&this.free(a,2.2)&&this.add(n.index,`haystack`,a,e.angle(),e.range(.6,.78),.7,!1)&&i++}let a=Fa(t.lanes,r,70,e);for(let e of a){let t=X(0,7.5,e.yaw),i={x:e.p.x+t.x,z:e.p.z+t.z};if(Z(i,r)>30&&this.free(i,2)&&this.add(n.index,`cart`,i,e.yaw+Math.PI/2,1,1.25,!1))break}}}};function Va(e,t,n){let r=0;for(let i=0;i<t.length;i++){let a=t[i],o=t[(i+1)%t.length],s=(o.x-a.x)*(e.z-a.z)-(o.z-a.z)*(e.x-a.x);if(Math.abs(s)/Math.hypot(o.x-a.x,o.z-a.z)<n)return!0;r+=Math.sign(s)}return Math.abs(r)===t.length}function Ha(e,t,n){let r=n.x-t.x,i=n.z-t.z,a=Math.min(1,Math.max(0,((e.x-t.x)*r+(e.z-t.z)*i)/(r*r+i*i)));return Math.hypot(e.x-t.x-r*a,e.z-t.z-i*a)}var Ua={cottage:{model:`cottage`,solid:!0,yard:8.5,footing:!0,house:!0},timber:{model:`timber`,solid:!0,yard:8.5,footing:!0,house:!0},south:{model:`poi_south_cottage`,solid:!0,yard:8.5,footing:!0,house:!0},villa:{model:`poi_villa`,solid:!0,yard:11,footing:!0},croft:{model:`poi_croft`,solid:!0,yard:8.5,footing:!0,house:!0},barn:{model:`barn`,solid:!0,yard:8.5,footing:!0},chapel:{model:`chapel`,solid:!0,yard:8.5,footing:!0},keep:{model:`keep`,solid:!0,yard:12,footing:!0,fort:!0},tower:{model:`tower`,footing:!0,fort:!0},watchtower:{model:`watchtower`,solid:!0},gatehouse:{model:`gatehouse`,footing:!0,fort:!0},well:{model:`well`,yard:2.8},stall:{model:`poi_stall`,solid:!0,yard:4},haystack:{model:`haystack`,yard:5.5},cart:{model:`cart`},mill:{model:`life_windmill_tower`,solid:!0,yard:10,footing:!0},pier:{model:`pier`},crane:{model:`crane`},rowboat:{model:`rowboat`}},Wa=[[1,1,1],[.89,.92,.94],[.97,.96,.9],[.91,.94,.96]],Ga=[.46,.44,.4],Ka=class{world;ground;occ;lanes;props;decals;masonry;assets=new Map;constructor(e,t,n,r,i,a,o){this.world=e,this.ground=t,this.occ=n,this.lanes=r,this.props=i,this.decals=a,this.masonry=o}async load(e){await Promise.all(e.map(async e=>this.assets.set(e,await this.props.preload(e))))}asset(e){let t=this.assets.get(Ua[e]?.model??e);if(!t)throw Error(`model not loaded: ${e}`);return t}southern(e,t){return this.world.region(R({x:e,y:t}))===P.SOUTH}seat(e,t,n,r,i,a,o){let s=Ua[e],c=this.asset(e),l=(c.max[0]-c.min[0])*i,u=(c.max[2]-c.min[2])*i,d=X((c.max[0]+c.min[0])/2*i,(c.max[2]+c.min[2])/2*i,r),f=t+d.x,p=n+d.z;if(s?.solid&&this.occ.overlapsBox(f,p,l*.47,u*.47,r,o))return null;let m=c.height*i,h=a;e===`haystack`&&(h=Math.min(h,.7)),h=Math.min(h,m*.5/(e===`keep`?2:3)+.18);let g=this.ground.footprint(f,p,l*.39,u*.39,r,h);return g?{kind:e,x:t,z:n,y:(e===`watchtower`?g[0]-.1:g[1]-.18)-c.min[1]*i,yaw:r,scale:i,levels:g,half:[l*.39,u*.39],height:m}:null}commit(e,t,n={}){let r=Ua[e.kind]??{model:e.kind},i=this.asset(e.kind),a=n.seed??z(Math.round(e.x*4),Math.round(e.z*4),977),o=r.house?a%4:0,s=n.south??this.southern(e.x,e.z);r.fort&&s&&!n.tint&&(n={...n,tint:[1.28,1.22,1.1]});let c=s&&r.solid&&!r.fort?3:r.model===`timber`&&o===3?2:0,l={x:e.x,y:e.y,z:e.z,yaw:e.yaw,scale:e.scale,tint:n.tint??Wa[o],roof:c,ruin:n.ruin??0,grow:n.grow??1,reveal:n.reveal,fade:n.fade,mirror:r.house&&(a>>3)%2==1};if(e.kind===`haystack`){let t=1.5,n=this.ground.h(e.x+t,e.z)-this.ground.h(e.x-t,e.z),r=this.ground.h(e.x,e.z+t)-this.ground.h(e.x,e.z-t);l.tilt=[Math.atan2(r,2*t)*.75,-Math.atan2(n,2*t)*.75],l.y=this.ground.h(e.x,e.z)-.12}let u=[this.props.add(r.model,l)],d=(i.max[0]-i.min[0])*e.scale,f=(i.max[2]-i.min[2])*e.scale,p=Math.max(d,f)*.5;if(this.occ.add(e.x,e.z,p*.9,t),r.solid){let n=X((i.max[0]+i.min[0])/2*e.scale,(i.max[2]+i.min[2])/2*e.scale,e.yaw);this.occ.addBox(e.x+n.x,e.z+n.z,d*.47,f*.47,e.yaw,t)}return r.yard&&this.decals.add(t,{x:e.x,z:e.z,r:r.yard*e.scale,kind:`yard`,phase:a%7}),n.footing!==!1&&r.footing&&e.levels[1]-e.levels[0]>.03&&this.footing(t,e,`${e.kind}@${Math.round(e.x)},${Math.round(e.z)}`),{...e,ids:u,owner:t,mirror:!!l.mirror}}footing(e,t,n=`${t.kind}@${Math.round(t.x)},${Math.round(t.z)}`){if(!Ua[t.kind]?.footing||t.levels[1]-t.levels[0]<=.03)return;let r=new _a,i=t.levels[1]-.12,a=t.half[0]/.39*.42,o=t.half[1]/.39*.42,s=this.asset(t.kind),c=X((s.max[0]+s.min[0])/2*t.scale,(s.max[2]+s.min[2])/2*t.scale,t.yaw),l=t.x+c.x,u=t.z+c.z,d=[],f=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let e=0;e<4;e++){let[n,r]=f[e],[i,s]=f[(e+1)%4];for(let e=0;e<6;e++){let c=e/6,f=(n+(i-n)*c)*a,p=(r+(s-r)*c)*o,m=X(f,p,t.yaw);d.push([l+m.x,u+m.z,f,p])}}for(let e=0;e<d.length;e++){let t=d[e],n=d[(e+1)%d.length],a=this.ground.h(t[0],t[1])-.3,o=this.ground.h(n[0],n[1])-.3;a>i-.05&&o>i-.05||r.quad([t[0],a,t[1]],[n[0],o,n[1]],[n[0],i,n[1]],[t[0],i,t[1]],Ga,Q.RUBBLE)}this.masonry.set(e,n,r)}};function qa(e){let t=Bt(e);return Ft[t]===It[t]?[Rt(Ft[t])]:[Rt(Ft[t]),Rt(It[t])]}var Ja=[.78,.62,.3];function Ya(e,t,n,r,i,a,o=5.2,s=0){let c=qa(i);e.box(t,n+o/2-.3,r,.07,o/2+.3,.07,a,wa,Q.WOOD),e.box(t,n+o+.08,r,.11,.1,.11,a,Ja,Q.WOOD);let l=Math.cos(a),u=Math.sin(a),d=1.1,f=n+o-.25;e.box(t+d/2*l,f+.04,r-d/2*u,.65,.035,.035,a,wa,Q.WOOD);let p=(e,n)=>{let i=1.9*n;n===1&&(i-=Math.abs(e-.5)<.2?.35:0);let a=d*e;return[t+a*l,f-i,r-a*u]};for(let t=0;t<6;t++)for(let n=0;n<4;n++){let r=n/4,i=(n+1)/4,a=t/6,o=(t+1)/6,l=c[c.length>1?r<.5==a<.5?0:1:0],u=(e,t)=>Math.min(1,e*.6+t*.8);e.quad(p(r,a),p(i,a),p(i,o),p(r,o),l,Q.CLOTH,[u(r,a),u(i,a),u(i,o),u(r,o)],s)}}var Xa={stakes:[0,.6],scaffold:[.4,1.6],rise:[1.3,3.9],strike:[3.9,4.8]},Za=Xa.strike[1],Qa=1.2,$a=.6,eo=1.25,to=-.4,no=e=>{let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)},ro=(e,[t,n])=>(e-t)/(n-t);function io(e,t){let n=to;e>=0&&(n=to+1.65*no(ro(e,Xa.stakes)),t>eo&&(n=Math.max(n,eo+(t-eo)*no(ro(e,Xa.scaffold)))),e>Xa.strike[0]&&(n=Math.min(n,t+(to-t)*no(ro(e,Xa.strike)))));let r=Math.min(1,Math.max(0,ro(e,Xa.rise)));return{works:n,built:1-(1-r)**1.6,done:e>=Za}}function ao(e){return Math.min(Qa,Math.max(0,e)*.4)}function oo(e,t,n,r,i,a,o=Q.WOOD){let s=[n[0]-t[0],n[1]-t[1],n[2]-t[2]],c=Math.hypot(s[0],s[1],s[2])||1,l=[s[0]/c,s[1]/c,s[2]/c],u=Math.abs(l[1])<.9?[0,1,0]:[1,0,0],d=[l[1]*u[2]-l[2]*u[1],l[2]*u[0]-l[0]*u[2],l[0]*u[1]-l[1]*u[0]],f=Math.hypot(d[0],d[1],d[2]);d=[d[0]/f,d[1]/f,d[2]/f];let p=[l[1]*d[2]-l[2]*d[1],l[2]*d[0]-l[0]*d[2],l[0]*d[1]-l[1]*d[0]],m=(e,t,n)=>[e[0]+d[0]*t*r+p[0]*n*i,e[1]+d[1]*t*r+p[1]*n*i,e[2]+d[2]*t*r+p[2]*n*i],h=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let r=0;r<4;r++){let[i,s]=h[r],[c,l]=h[(r+1)%4];e.quad(m(t,i,s),m(t,c,l),m(n,c,l),m(n,i,s),a,o)}e.quad(m(n,-1,-1),m(n,1,-1),m(n,1,1),m(n,-1,1),a,o),e.quad(m(t,-1,1),m(t,1,1),m(t,1,-1),m(t,-1,-1),a,o)}var so=[.55,.41,.25],co=[.74,.6,.4],lo=[.8,.7,.52],uo=[.6,.44,.27],fo=[.68,.66,.61],po={cottage:.55,timber:.58,south:.55,croft:.62,villa:.55,barn:.5,chapel:.55,keep:.82,mill:.7},mo=new Set([`keep`,`chapel`,`croft`,`villa`,`mill`]);function ho(e,t,n){let r=new _a,i=e.scale,a=(t.max[0]-t.min[0])*i/2,o=(t.max[2]-t.min[2])*i/2,s=X((t.max[0]+t.min[0])/2*i,(t.max[2]+t.min[2])/2*i,e.yaw),c=e.x+s.x,l=e.z+s.z,u=e.levels[1],d=e.levels[0]-.3,f=(t,n,r)=>{let i=X(t,r,e.yaw);return[c+i.x,n,l+i.z]};for(let[e,t]of[[-1,-1],[1,-1],[1,1],[-1,1]])oo(r,f(e*(a+.35),d,t*(o+.35)),f(e*(a+.35),u+eo,t*(o+.35)),.07,.07,lo);let p=(n&1?1:-1)*(a+2.2);for(let[e,t]of[[.14,-.3],[.14,.3],[.4,0]])oo(r,f(p,u+e,-1.3+t),f(p,u+e,1.3+t),.15,.14,uo);if(mo.has(e.kind))for(let e=0;e<5;e++){let t=-o*.4+e%3*.7,n=u+.2+Math.floor(e/3)*.4;oo(r,f(-p-.35,n,t),f(-p+.35,n,t),.3,.2,fo,Q.RUBBLE)}let m=po[e.kind];if(!m)return{geo:r,base:u,top:eo};let h=Math.max(3,Math.min(15,e.height*m)),g=a+.75,_=o+.75,v=[];for(let[e,t,n,r]of[[-g,-_,g,-_],[g,-_,g,_],[g,_,-g,_],[-g,_,-g,-_]]){let i=Math.max(1,Math.ceil(Math.hypot(n-e,r-t)/3.2));for(let a=0;a<i;a++)v.push([e+(n-e)*a/i,t+(r-t)*a/i])}for(let[e,t]of v)oo(r,f(e,d,t),f(e,u+h+.5,t),.11,.11,so);let y=[];for(let e=1.9;e<h-.5;e+=1.9)y.push(e);y.push(h);let b=[[-g,-_,g,-_,0,1],[g,-_,g,_,-1,0],[g,_,-g,_,0,-1],[-g,_,-g,-_,1,0]];for(let e of y)for(let[t,n,i,a,o,s]of b)oo(r,f(t,u+e,n),f(i,u+e,a),.07,.07,so),oo(r,f(t+o*.45,u+e-.08,n+s*.45),f(i+o*.45,u+e-.08,a+s*.45),.42,.045,co);for(let[e,t,n,i]of b){let a=.35;oo(r,f(e,u+.2,t),f(e+(n-e)*a,u+y[0],t+(i-t)*a),.06,.06,so)}return{geo:r,base:u,top:h+.6}}var go=class{placer;dust;sites=[];next=0;constructor(e,t){this.placer=e,this.dust=t}start(e,t,n,r){let i=`${t}:works:${this.next++}`,a=null;if(!r){a=ho(e,this.placer.asset(e.kind),fa(i));let t=this.placer.masonry;t.place(i,e.x,e.z,30),t.set(i,`site`,a.geo),t.setReveal(i,a.base+to)}this.sites.push({placed:e,owner:t,group:i,t:-n,plan:a,reduced:r,dust:0})}cancel(e){for(let t of this.sites)t.owner===e&&this.placer.masonry.removeGroup(t.group);this.sites=this.sites.filter(t=>t.owner!==e)}get busy(){return this.sites.length>0}building(e){return this.sites.some(t=>t.placed===e)}update(e){if(!this.sites.length)return!1;let t=this.placer;for(let n of this.sites){n.t+=e;let r=n.placed.ids;if(n.reduced){let e=Math.min(1,Math.max(0,n.t/$a));for(let n of r)t.props.update(n,{fade:e});e>=1&&t.footing(n.owner,n.placed);continue}let i=n.plan,a=io(n.t,i.top);if(t.masonry.setReveal(n.group,i.base+a.works),n.t>=Xa.rise[0])for(let e of r)t.props.update(e,{reveal:a.built});let o=n.placed,s=Math.max(2.5,Math.max(o.half[0],o.half[1])*1.6);n.dust===0&&n.t>=Xa.rise[0]?(n.dust=1,this.dust.puff(o.x,o.levels[0],o.z,fa(n.group),{radius:s,count:14,alpha:.12})):n.dust===1&&n.t>=Xa.rise[1]&&(n.dust=2,t.footing(n.owner,o),this.dust.puff(o.x,o.levels[0],o.z,fa(n.group)+1,{radius:s*1.1,count:18,alpha:.14})),a.done&&t.masonry.removeGroup(n.group)}return this.sites=this.sites.filter(e=>e.reduced?e.t<$a:e.t<Za),!this.sites.length}},_o=1.4;function vo(e){return`z`in e?{x:e.x,z:e.z}:{x:e.x,z:e.y}}var yo=class{placer;dust;works;seed;recs=new Map;homes=new Map;onClaim=()=>{};onBuild=()=>{};reduced=!1;keepScale=.8;sites=[];lastStart=0;constructor(e,t,n,r){this.placer=e,this.dust=t,this.works=n,this.seed=r}registerHome(e,t,n,r,i){this.homes.set(da(e.x,e.z),{tier:t,owner:n,ids:r,ring:i&&i.length>=4?i:void 0})}claimed(e){for(let t of this.recs.values())if(t.ck===e)return!0;return!1}set(e,t=!0){let n=vo(e.pos),r=da(n.x,n.z),i=this.recs.get(e.key);if(!i){let a=this.homes.get(r);i={spec:e,ck:r,c:n,owner:a?`${a.owner}:realm`:`s:${e.key}`,tier:a?a.tier:0,homeTier:a?a.tier:0,fort:-1,wallTier:-1,ids:[],fortIds:[],placed:[],fortPlaced:[],growing:[],rise:null,houses:[],homeRing:a?.ring},this.recs.set(e.key,i),this.onClaim(r),this.placer.masonry.place(i.owner,n.x,n.z,70),this.bannerFor(i,e),i.tier===0&&(this.found(i,t),i.tier=1)}i.spec=e;for(let n=i.tier+1;n<=Math.min(3,e.tier);n++)this.upgrade(i,n,t);i.tier=Math.max(i.tier,Math.min(3,e.tier)),(i.fort!==e.fort||i.wallTier!==i.tier)&&this.fortify(i,t),this.bannerFor(i,e),this.applyRuin(i)}remove(e){let t=this.recs.get(e);if(!t)return;this.recs.delete(e);let n=this.placer;this.works.cancel(t.owner),this.works.cancel(`${t.owner}:fort`);for(let e of[...t.ids,...t.fortIds])n.props.remove(e);n.masonry.removeGroup(`${t.owner}:fort`),n.occ.removeOwner(`${t.owner}:fort`),n.occ.removeOwner(`${t.owner}:banner`),n.occ.removeOwner(t.owner),n.decals.removeGroup(t.owner),n.masonry.removeGroup(t.owner)}rng(e,t){return new ua(this.seed,fa(e.ck),t)}southern(e){return(e.spec.region??this.placer.world.region(R({x:e.c.x,y:e.c.z})))===P.SOUTH}houseKind(e,t,n,r){if(this.southern(e))return t===`timber`&&!e.villa?`villa`:`south`;if(t===`cottage`){let e=this.placer.world.baseType(R({x:n.x,y:n.z}));if((e===B.MOOR||e===B.HILLS||e===B.PINE)&&r.f()<.5)return`croft`}return t}found(e,t){let n=this.rng(e,1),r=e.c;this.sites=[],this.grow(e,`well`,{x:r.x+3,z:r.z+2},n.angle(),0,t);for(let r=0;r<4;r++)this.around(e,n,`cottage`,10,25,.25+r*.35,t);this.placer.masonry.set(e.owner,`garden`,Na(this.placer.ground,r,e=>this.placer.occ.blocked(e.x,e.z,.3))),this.placer.decals.add(e.owner,{x:r.x+10,z:r.z+10,r:3.6,kind:`yard`,phase:2}),this.started(e,t)}started(e,t){t&&!this.reduced&&this.sites.length&&this.onBuild({house:e.spec.house,centre:e.c,sites:this.sites,seconds:this.lastStart+Za}),this.sites=[],this.lastStart=0}upgrade(e,t,n){let r=this.rng(e,t);if(this.sites=[],t===2){for(let t=0;t<5;t++)this.around(e,r,`timber`,16,36,t*.35,n);this.around(e,r,`chapel`,18,26,1.1,n),this.around(e,r,`barn`,30,40,1.4,n)}else if(t===3){!this.around(e,r,`keep`,10,20,1.2,n)&&!this.around(e,r,`keep`,8,32,1.2,n)&&(this.keepScale=.62,this.around(e,r,`keep`,6,40,1.2,n),this.keepScale=.8);for(let t=0;t<11;t++)this.around(e,r,`timber`,18,47,t*.3,n)}this.started(e,n)}around(e,t,n,r,i,a,o){let s=this.placer.ground;for(let c=0;c<160;c++){let l=t.angle(),u=t.range(r,i),d={x:e.c.x+Math.cos(l)*u,z:e.c.z+Math.sin(l)*u};if(s.h(d.x,d.z)>1.2&&s.normalY(d.x,d.z)>.85){let r=n===`cottage`||n===`timber`?this.houseKind(e,n,d,t):n;if(r===`villa`&&c>=60&&(r=`south`),this.grow(e,r,d,Ia(d,e.c),a,o))return r===`villa`&&(e.villa=!0),!0}}return!1}grow(e,t,n,r,i,a){let o=this.placer,s=t===`keep`?this.keepScale:t===`villa`?.7:[`cottage`,`timber`,`barn`,`south`,`croft`].includes(t)?.85:1,c=o.asset(t),l=Math.max(c.max[0]-c.min[0],c.max[2]-c.min[2])*s*.45;if(o.occ.blocked(n.x,n.z,l*.75)||o.lanes.distance(n.x,n.z)<l+2)return!1;let u=o.seat(t,n.x,n.z,r,s,t===`keep`?2.8:1.25,e.owner);if(!u)return!1;let d=a&&this.reduced,f=o.commit(u,e.owner,{reveal:a&&!d?0:void 0,fade:d?0:void 0,south:this.southern(e),ruin:this.ruin(e),footing:!a});return e.ids.push(...f.ids),e.placed.push(f),t!==`well`&&e.houses.push({x:u.x,z:u.z,r:l}),a&&(this.works.start(f,e.owner,d?0:ao(i),d),this.lastStart=Math.max(this.lastStart,ao(i)),this.sites.push({x:u.x,z:u.z,r:l})),!0}ruin(e){return e.spec.burned?1:e.spec.abandoned?2:0}applyRuin(e){let t=this.ruin(e),n=[...e.ids,...e.fortIds,...e.homeTier?this.homes.get(e.ck)?.ids()??[]:[]];for(let e of n)this.placer.props.update(e,{ruin:t})}fortify(e,t){let n=this.placer,r=`${e.owner}:fort`;n.masonry.removeGroup(r),n.occ.removeOwner(r),n.decals.removeGroup(r);for(let t of e.fortIds)n.props.remove(t);if(e.fortIds=[],e.fortPlaced=[],e.fort=e.spec.fort,e.wallTier=e.tier,e.fort<=0)return;let i=e.fort===1,a;if(e.homeRing)a=e.homeRing;else{let t=0,r=1/0;for(let i of n.lanes.edges()){let n={x:(i.a.x+i.b.x)/2,z:(i.a.y+i.b.y)/2},a=Z(n,e.c);a<r&&(r=a,t=Math.atan2(n.z-e.c.z,n.x-e.c.x))}r===1/0&&(t=z(Math.round(e.c.x),Math.round(e.c.z),3)%628/100);let o=e.houses.filter(t=>Z(t,e.c)<50).map(e=>({x:e.x,z:e.z})),s=i?e.tier>=3?50:43:58;if(a=Da(n.ground,e.c,s,t,o,i),a.length<4&&(a=Da(n.ground,e.c,s,t,[],i)),a.length<4)return}n.masonry.place(r,e.c.x,e.c.z,80);let o=fa(e.ck)+99,s=t&&!this.reduced;if(i)n.masonry.set(r,`wall`,Ma(n.ground,a,o,e.houses,e=>n.lanes.distance(e.x,e.z)<3.2));else{let i=Oa(n,a,r,o,{grow:+!s,ruin:this.ruin(e),keepOff:e.houses});n.masonry.set(r,`wall`,i.geo),e.fortPlaced=i.placed;for(let n of i.placed)e.fortIds.push(...n.ids),this.arrive(e,n,r,t)}for(let e=0;e<4;e++){let t=a[e],o=a[(e+1)%4],s=Math.ceil(Z(t,o)/2.2);for(let e=0;e<s;e++)n.occ.add(t.x+(o.x-t.x)*(e/s),t.z+(o.z-t.z)*(e/s),i?1.2:2.6,r)}if(i&&e.tier<3&&this.watchtower(e,r,t),s){e.rise=0;for(let t of[aa(a[0],a[1],.5),...a])this.dust.puff(t.x,n.ground.h(t.x,t.z),t.z,fa(e.ck)+Math.round(t.x*7))}n.masonry.setRise(r,+!s)}arrive(e,t,n,r){if(r){if(!this.reduced)e.growing.push({ids:t.ids,t:-.6,delay:.6,seated:t,owner:n});else{for(let e of t.ids)this.placer.props.update(e,{grow:1,fade:0});this.works.start(t,n,0,!0)}}}watchtower(e,t,n){let r=this.placer,i=this.rng(e,7),a=r.asset(`watchtower`),o=.75,s=Math.max(a.max[0]-a.min[0],a.max[2]-a.min[2])*o*.45;for(let a=0;a<120;a++){let a=i.angle(),c=i.range(8,30),l={x:e.c.x+Math.cos(a)*c,z:e.c.z+Math.sin(a)*c};if(r.ground.h(l.x,l.z)<1.2||r.occ.blocked(l.x,l.z,s*.75)||r.lanes.distance(l.x,l.z)<s+2)continue;let u=r.seat(`watchtower`,l.x,l.z,Ia(l,e.c),o,1.8,t);if(!u)continue;let d=r.commit(u,t,{grow:+!n,ruin:this.ruin(e)});e.fortIds.push(...d.ids),e.fortPlaced.push(d),this.arrive(e,d,t,n);return}}bannerFor(e,t){let n=this.placer,r=new _a,i={x:e.c.x-5,z:e.c.z-4};for(let t=0;t<40&&(n.ground.h(i.x,i.z)<1.2||n.occ.blocked(i.x,i.z,1));t++){let n=t*2.4,r=4+t*.8;i={x:e.c.x-5+Math.cos(n)*r,z:e.c.z-4+Math.sin(n)*r}}let a=fa(e.ck)%100/100;Ya(r,i.x,n.ground.h(i.x,i.z),i.z,t.house,.6,4.42,a),n.masonry.set(e.owner,`banner`,r),n.occ.removeOwner(`${e.owner}:banner`),n.occ.add(i.x,i.z,1,`${e.owner}:banner`)}update(e){let t=this.placer;for(let n of this.recs.values()){if(n.rise!==null){n.rise=Math.min(1,n.rise+e/_o);let r=n.rise;t.masonry.setRise(`${n.owner}:fort`,1-(1-r)**3),r>=1&&(n.rise=null)}if(n.growing.length){for(let r of n.growing){r.t+=e;let n=1-(1-Math.min(1,Math.max(0,r.t/_o)))**3;for(let e of r.ids)t.props.update(e,{grow:n})}for(let e of n.growing)e.t>=_o&&e.seated&&e.owner&&t.footing(e.owner,e.seated);n.growing=n.growing.filter(e=>e.t<_o)}}}list(){return[...this.recs.values()].map(e=>e.spec)}buildings(e=!1){return[...this.recs.values()].filter(t=>!e||!this.ruin(t)).flatMap(e=>[...e.placed,...e.fortPlaced])}ruined(e){for(let t of this.recs.values())if(t.ck===e&&this.ruin(t))return!0;return!1}},bo=[26,36,48];function xo(e,t,n,r=.9){return e.height(t,n)<1.3?!1:e.normalAt(t,n).y>r}function So(e,t,n,r){let i=Math.cos(n),a=Math.sin(n),o=0;for(let n=4;n<=r&&xo(e,t.x+i*n,t.z+a*n,.82);n+=4)o=n;return o}function Co(e,t,n,r,i){let a=Math.cos(t),o=Math.sin(t),s=-o,c=a,l=Math.max(2,Math.ceil((r-n)/6)),u=[];for(let t=0;t<=l;t++){let d=t/l,f=n+(r-n)*d,p=Math.sin(d*Math.PI)*i;u.push({x:e.x+a*f+s*p,z:e.z+o*f+c*p})}return u}function wo(e,t){let n={x:t.pos.x,z:t.pos.y},r=Math.min(3,Math.max(1,t.size)),i=bo[r-1],a=z(Math.round(n.x*4),Math.round(n.z*4),e.seed+3301),o=t=>z(a&65535,t,e.seed+77)%1e4/1e4,s=o(1)*Math.PI,c=-1,l=0,u=0;for(let t=0;t<12;t++){let r=t/12*Math.PI+o(1)*.2,a=So(e,n,r,i),d=So(e,n,r+Math.PI,i);a+d>c&&(c=a+d,s=r,l=a,u=d)}let d=[],f=(o(2)-.5)*i*.18;l+u>=16&&d.push(Co(n,s,-u,l,f));let p=r===1?0:r===2?1:2;for(let t=0;t<p;t++){let r=s+(t===0?1:-1)*(Math.PI/2+(o(3+t)-.5)*.7),a=So(e,n,r,i*(t===0?.75:.6));a>=14&&d.push(Co(n,r,4,a,(o(5+t)-.5)*a*.2))}let m=null,h=8+r*1.5;for(let t=0;t<16&&!m;t++){let r=s+Math.PI/4+t*Math.PI*2/16+o(9)*.3,a=i*.85+h+t%3*4,c={x:n.x+Math.cos(r)*a,z:n.z+Math.sin(r)*a},l=xo(e,c.x,c.z,.9)&&d.every(e=>e.every(e=>Math.hypot(e.x-c.x,e.z-c.z)>h+6));for(let t=0;t<8&&l;t++)l=xo(e,c.x+Math.cos(t*.785)*h,c.z+Math.sin(t*.785)*h,.86);l&&(m={x:c.x,z:c.z,r:h,gate:Math.atan2(n.z-c.z,n.x-c.x)})}return{streets:d,paddock:m}}var To=class{placer;seed;built=new Map;ids=new Map;placed=new Map;buildings(){return[...this.placed.values()].flat()}constructor(e,t){this.placer=e,this.seed=t}has(e){return this.built.has(e)}sync(e,t,n){for(let r of e){let e=da(r.pos.x,r.pos.y);this.built.has(e)||n(e)||!t(r)||this.build(r,e)}}retire(e){let t=this.built.get(e);if(!t)return;let n=this.placer;for(let t of this.ids.get(e)??[])n.props.remove(t);n.occ.removeOwner(t),n.decals.removeGroup(t),n.masonry.removeGroup(t),this.built.delete(e),this.ids.delete(e),this.placed.delete(e)}build(e,t){let n=this.placer,r=n.ground,i=`n:${t}`,a=[],o=[];this.built.set(t,i),this.ids.set(t,a),this.placed.set(t,o);let s={x:e.pos.x,z:e.pos.y};n.masonry.place(i,s.x,s.z,90);let c=new ua(this.seed,fa(t),17),l=e.region===P.SOUTH,u=Math.min(3,Math.max(1,e.size)),d=(e,t,r,s=1,c=2.3)=>{let u=n.seat(e,t.x,t.z,r,s,c,i);if(!u)return!1;let d=n.commit(u,i,{south:l});return a.push(...d.ids),o.push(d),!0},f=wo(n.world,e);for(let e of f.streets)for(let t=1;t<e.length;t++)n.lanes.add({x:e[t-1].x,y:e[t-1].z},{x:e[t].x,y:e[t].z});if(f.paddock){let e=f.paddock;n.masonry.set(i,`paddock`,Pa(r,e,e.r,e.gate)),n.decals.add(i,{x:e.x,z:e.z,r:e.r+1.2,kind:`grass`,wearR:e.r*.62,phase:3,strength:.15}),n.occ.add(e.x,e.z,e.r+.5,i)}d(`well`,{x:s.x+3,z:s.z-2},c.angle());let p=[],m=(e,t)=>r.h(e.x,e.z)>1.2&&r.normalY(e.x,e.z)>.85&&!p.some(n=>Z(e,n)<t)&&n.lanes.distance(e.x,e.z)>=5&&!n.occ.blocked(e.x,e.z,3),h=[];for(let e of f.streets)for(let t=1;t<e.length;t++){let n=e[t-1],r=e[t],i=Z(n,r),a=(r.x-n.x)/i,o=(r.z-n.z)/i;for(let e=c.range(1,5);e<i;e+=c.range(9.5,12.5))for(let t of[-1,1]){let r=c.range(7.5,9.5),i={x:n.x+a*e-o*t*r,z:n.z+o*e+a*t*r};h.push({p:i,yaw:Math.atan2(o*t,-a*t)})}}h.sort((e,t)=>Z(e.p,s)-Z(t.p,s));let g=[5,7,12][u-1],_=[];u>=2&&_.push(`chapel`,`barn`);for(let e=0;e<g;e++){let t=u===1||c.f()<.6?`cottage`:`timber`;l&&(t=u>=2&&e===2?`villa`:`south`),_.push(t)}let v=e=>e===`villa`?.7:e===`chapel`||e===`barn`?.9:.85,y=e=>{let t=n.world.baseType(R({x:e.x,y:e.z}));return t===B.MOOR||t===B.HILLS||t===B.PINE},b=(e,t)=>e===`cottage`&&!l&&y(t)&&c.f()<.5?`croft`:e;for(let e of h){if(!_.length)break;if(!m(e.p,10.5))continue;let t=b(_[0],e.p);d(t,e.p,e.yaw+c.range(-.1,.1),v(t))&&(p.push(e.p),_.shift())}let x=[30,40,54][u-1],S=[];for(let e of _){let t=!1;for(let n=0;n<180&&!t;n++){let n=c.angle(),r=c.range(11,x),i={x:s.x+Math.cos(n)*r,z:s.z+Math.sin(n)*r};if(!m(i,11))continue;let a=b(e,i);d(a,i,Ia(i,s),v(a))&&(p.push(i),t=!0)}t||S.push(e)}for(let e of S)for(let t=0;t<220;t++){let t=c.angle(),i=c.range(9,x*1.6),a={x:s.x+Math.cos(t)*i,z:s.z+Math.sin(t)*i};if(r.h(a.x,a.z)<=1.2||r.normalY(a.x,a.z)<=.8||p.some(e=>Z(a,e)<9)||n.lanes.distance(a.x,a.z)<4||n.occ.blocked(a.x,a.z,2.5))continue;let o=b(e,a);if(d(o,a,Ia(a,s),v(o),2.6)){p.push(a);break}}if(u===3&&!l){let e=null,t=-1/0;for(let i=0;i<50;i++){let i=c.angle(),a=c.range(50,90),o={x:s.x+Math.cos(i)*a,z:s.z+Math.sin(i)*a},l=r.h(o.x,o.z);l>t&&r.normalY(o.x,o.z)>.88&&!n.occ.blocked(o.x,o.z,7)&&n.lanes.distance(o.x,o.z)>8&&(t=l,e=o)}if(e){let t=c.angle(),r=n.seat(`mill`,e.x,e.z,t,1,1.6,i);if(r){let e=n.commit(r,i);e.ids.push(n.props.add(`life_windmill_sails`,{x:r.x,y:r.y,z:r.z,yaw:t,scale:1,phase:(.37*r.x+.11*r.z)/(Math.PI*2)%1})),a.push(...e.ids),o.push(e)}}}u===1&&(n.masonry.set(i,`garden`,Na(r,s,e=>n.occ.blocked(e.x,e.z,.3))),n.decals.add(i,{x:s.x+10,z:s.z+10,r:3.6,kind:`yard`,phase:2}));for(let e=0;e<3+u*2;e++){let e={x:s.x+c.range(-70,70),z:s.z+c.range(-70,70)};n.world.baseType(R({x:e.x,y:e.z}))===B.FARMLAND&&!n.occ.blocked(e.x,e.z,2.5)&&n.lanes.distance(e.x,e.z)>3&&d(`haystack`,e,c.angle(),c.range(.6,.78),.7)}}},Eo={SIMPLEX:0,SIMPLEX_SMOOTH:1},Do={NONE:0,FBM:1,RIDGED:2},Oo=.3660254037844386,ko=class{lib;seed;freq;octaves;lacunarity;gain;bounding;smooth;fractal;constructor(e){this.seed=e.seed|0,this.freq=J(e.frequency??.01),this.octaves=e.octaves??5,this.lacunarity=J(e.lacunarity??2),this.gain=J(e.gain??.5),this.smooth=(e.kind??Eo.SIMPLEX_SMOOTH)===Eo.SIMPLEX_SMOOTH,this.fractal=e.fractal??Do.FBM;let t=Math.abs(this.gain),n=t,r=1;for(let e=1;e<this.octaves;e++)r=J(r+n),n=J(n*t);this.bounding=J(1/r);let i=new A(this.seed);i.SetNoiseType(this.smooth?A.NoiseType.OpenSimplex2S:A.NoiseType.OpenSimplex2),i.SetFrequency(this.freq),i.SetFractalType([A.FractalType.None,A.FractalType.FBm,A.FractalType.Ridged][this.fractal]),i.SetFractalOctaves(this.octaves),i.SetFractalLacunarity(this.lacunarity),i.SetFractalGain(this.gain),i.SetFractalWeightedStrength(0),this.lib=i}get2(e,t){e*=this.freq,t*=this.freq;let n=(e+t)*Oo;e+=n,t+=n;let r=this.lib,i=this.seed;if(this.fractal===Do.NONE)return J(this.smooth?r._SingleOpenSimplex2SR2(i,e,t):r._SingleOpenSimplex2R2(i,e,t));let a=0,o=this.bounding;for(let n=0;n<this.octaves;n++){let n=this.smooth?r._SingleOpenSimplex2SR2(i++,e,t):r._SingleOpenSimplex2R2(i++,e,t);this.fractal===Do.RIDGED?(n=Math.abs(n),a+=(n*-2+1)*o):a+=n*o,e*=this.lacunarity,t*=this.lacunarity,o*=this.gain}return J(a)}get1(e){return this.get2(e,0)}},Ao=560,jo=-23,Mo=2,No=-30,Po=2,Fo=[1,1,0,-1,-1,0],Io=[0,-1,-1,0,1,1],Lo=J(1.6);function Ro(e,t){return(t+32)*64+(e+32)}var zo=class{kBase=0;kRough=0;kernel(e,t,n,r,i,a,o,s){let c=(ce/3*e-t/3)/20,l=2/3*t/20,u=-c-l,d=_e(c),f=_e(l),p=_e(u),m=Math.abs(d-c),h=Math.abs(f-l),g=Math.abs(p-u);m>h&&m>g?d=-f-p:h>g&&(f=-d-p);let _=0,v=0,y=0;for(let c=0;c<7;c++){let l=c===6?d:d+Fo[c],u=c===6?f:f+Io[c],p=J(e-J(20*ce*(l+u*.5))),m=J(t-J(30*u)),h=J(Math.sqrt(J(J(p*p)+J(m*m))))/20,g=Math.max(0,1-h/1.75);g=g*g*g;let b=o,x=s;if(l>=-a&&u>=-a&&l<a&&u<a){let e=(u+a)*i+(l+a);b=n[e],x=r[e]}_+=b*g,v+=x*g,y+=g}let b=Math.max(y,1e-4);this.kBase=_/b,this.kRough=v/b}},Bo=class extends zo{base;rough;noise;ridge;detail;constructor(e,t,n){super(),this.base=t,this.rough=n,this.noise=new ko({seed:e,frequency:.012,octaves:4}),this.ridge=new ko({seed:e+1,kind:Eo.SIMPLEX,fractal:Do.RIDGED,frequency:.02,octaves:4}),this.detail=new ko({seed:e+2,frequency:.08,octaves:2})}height(e,t){this.kernel(e,t,this.base,this.rough,64,32,jo,Mo);let n=this.kRough,r=this.kBase+this.noise.get2(e,t)*n;return r+=Math.max(0,this.ridge.get2(e,t)+.2)*Math.max(0,n-5)*.9,r+=this.detail.get2(e,t)*.35,r}},Vo=class extends zo{home;baseH;rough;hnoise;ridge;hdetail;constructor(e){super(),this.home=new Bo(e.seed,e.homeBase,e.homeRough),this.baseH=e.baseH,this.rough=e.rough,this.hnoise=new ko({seed:e.seed+105,frequency:.012,octaves:4}),this.ridge=new ko({seed:e.seed+102,fractal:Do.RIDGED,frequency:.0019,octaves:5}),this.hdetail=new ko({seed:e.seed+106,frequency:.08,octaves:2})}height(e,t){e=J(e),t=J(t);let n=Nr(e,t);if(n<470)return this.home.height(e,t);let r=this.world(e,t);if(n<Ao){let i=this.home.height(e,t);return i+(r-i)*ne(470,Ao,n)}return r}world(e,t){this.kernel(e,t,this.baseH,this.rough,512,256,No,Po);let n=this.kRough,r=this.kBase+this.hnoise.get2(e,t)*n;return r+=Math.max(0,this.ridge.get2(J(e*Lo),J(t*Lo))+.1)*Math.max(0,n-6)*.85,r+=this.hdetail.get2(e,t)*.35,r}},Ho=[B.OCEAN,B.BEACH,B.MEADOW,B.FARMLAND,B.FOREST,B.HILLS,B.MOUNTAIN],Uo=[-7,1.2,5,3.5,7,14,27],Wo=[2,.8,3.5,1.2,4.5,7,11],Go=7,Ko=[0,1.5,2,3,1,.5,0];function qo(e,t){return(e+512)*1024+(t+512)}function Jo(e){return Math.floor(e/1024)-512}function Yo(e){return e%1024-512}var Xo=se.map(e=>e.q*1024+e.r);function Zo(e,t){return(M(e*4)+8192)*16384+(M(t*4)+8192)}function Qo(e){let t=[];for(let n=0;n<6;n++){let r=J(Math.PI*2*(n+.5)/6),i=R({x:J(e.x+J(J(Math.cos(r))*4)),y:J(e.y+J(J(Math.sin(r))*4))});for(let e of oe(i,2))t.push(e)}return t}var $o=class{seed;types=new Map;inland=new Map;seaDepth=new Map;peak={q:0,r:0};settlements=[];keepHex={q:0,r:0};roads=new Map;fieldFrame=0;fieldMarks=new Map;homeBase=new Float32Array(4096);homeRough=new Float32Array(4096);heights;noise;constructor(e){this.seed=e,this.noise=new ko({seed:e,frequency:.012,octaves:4}),this.heights=new Bo(e,this.homeBase,this.homeRough),this.generate(),this.planFields()}typeAt(e,t){return this.types.get(qo(e,t))??F.SEA}isLand(e,t){return this.typeAt(e,t)!==F.SEA}landKey(e){return(this.types.get(e)??F.SEA)!==F.SEA}height(e,t){return this.heights.height(J(e),J(t))}generate(){let e=new fe(this.seed),t=new ko({seed:this.seed+10,frequency:.006}),n=this.types;for(let e=-10;e<11;e++)for(let r=-10;r<11;r++){let i=N(e,r),a=ge(r),o=Nr(J(i/1.25),J(a/.95))/(Go*20*1.6),s=t.get2(i,a)*.55+.62-o*o*1.25;n.set(qo(e,r),s>.18?F.PASTURE:F.SEA)}this.keepLargestLandmass();let r=this.distanceFrom(e=>!this.landKey(e));this.inland=r;let i=-1e9;for(let t of n.keys()){if(!this.landKey(t))continue;let n=r.get(t)*2-ge(Yo(t))/20*.6+e.randf()*.5;n>i&&(i=n,this.peak={q:Jo(t),r:Yo(t)})}let a=J(3.1);for(let e of[...n.keys()]){if(!this.landKey(e))continue;let t={q:Jo(e),r:Yo(e)},r=de(t,this.peak),i=this.noise.get2(J(N(t.q,t.r)*a),J(ge(t.r)*a));r===0||r===1&&i>-.15?n.set(e,F.MOUNTAIN):r<=2&&i>-.35&&n.set(e,F.HILLS)}let o=new ko({seed:this.seed+20,frequency:.011}),s=new ko({seed:this.seed+30,frequency:.013}),c=[];for(let e of[...n.keys()]){if(n.get(e)!==F.PASTURE)continue;let t=N(Jo(e),Yo(e)),i=ge(Yo(e));r.get(e)===1&&o.get2(J(t*2),J(i*2))<-.15?n.set(e,F.COAST):c.push(e)}let l=new Map;for(let e of c)l.set(e,o.get2(N(Jo(e),Yo(e)),ge(Yo(e))));me(c,(e,t)=>l.get(e)>l.get(t));let u=Math.trunc(c.length*.25);for(let e=0;e<u;e++)n.set(c[e],F.FOREST);let d=c.slice(u),f=new Map;for(let e of d)f.set(e,s.get2(N(Jo(e),Yo(e)),ge(Yo(e)))-r.get(e)*.08);me(d,(e,t)=>f.get(e)>f.get(t));let p=Math.trunc(d.length*.6);for(let e=0;e<p;e++)n.set(d[e],F.FIELD);for(let t of n.values())t===F.FIELD&&(e.randfRange(-.5,.5),e.randf());this.seaDepth=this.distanceFrom(e=>this.landKey(e)),this.buildPlateaus(),this.placeSettlements(e)}keepLargestLandmass(){let e=new Set,t=[];for(let n of this.types.keys()){if(!this.landKey(n)||e.has(n))continue;let r=[],i=[n];for(e.add(n);i.length;){let t=i.pop();r.push(t);for(let n of Xo){let r=t+n;this.landKey(r)&&!e.has(r)&&(e.add(r),i.push(r))}}r.length>t.length&&(t=r)}let n=new Set(t);for(let e of[...this.types.keys()])this.landKey(e)&&!n.has(e)&&this.types.set(e,F.SEA)}distanceFrom(e){let t=new Map,n=[];for(let r of this.types.keys())e(r)&&(t.set(r,0),n.push(r));for(let e=0;e<n.length;e++){let r=n[e];for(let e of Xo){let i=r+e;this.types.has(i)&&!t.has(i)&&(t.set(i,t.get(r)+1),n.push(i))}}return t}buildPlateaus(){for(let e=-32;e<32;e++)for(let t=-32;t<32;t++){let n=qo(t,e),r=this.types.get(n)??F.SEA,i=Uo[r];r===F.SEA?i=-3-5*(this.seaDepth.get(n)??4):r===F.MOUNTAIN&&t===this.peak.q&&e===this.peak.r&&(i+=10),r!==F.SEA&&r!==F.COAST&&(i+=Math.min(Math.max((this.inland.get(n)??1)-1,0),4)*5.5),this.homeBase[Ro(t,e)]=i,this.homeRough[Ro(t,e)]=Wo[r]}}cornerTable(){let e=new Map;for(let[t,n]of this.types){if(n===F.SEA)continue;let r={q:Jo(t),r:Yo(t)};for(let n=0;n<6;n++){let i=pe(r,n),a=pe(r,n+1);for(let n of[i,a]){let r=Zo(n.x,n.y),i=e.get(r);i||e.set(r,i={x:n.x,z:n.y,hexes:[],links:new Map}),i.hexes.includes(t)||i.hexes.push(t)}let o=Zo(i.x,i.y),s=Zo(a.x,a.y);e.get(o).links.set(s,[t,n]),e.get(s).links.set(o,[t,n])}}return e}placeSettlements(e){let t=this.cornerTable(),n=[];for(let r of t.values()){if(r.hexes.length<3)continue;let t=0,i=!0,a=!1,o=!1;for(let e of r.hexes){let n=this.types.get(e)??F.SEA;(n===F.SEA||n===F.MOUNTAIN)&&(i=!1),t+=Ko[n],n===F.FIELD&&(a=!0),(n===F.FOREST||n===F.HILLS)&&(o=!0)}a&&o&&(t+=8),i&&n.push({s:t+e.randf()*.5,x:r.x,z:r.z})}me(n,(e,t)=>e.s>t.s),this.settlements=[];for(let e of n){let t=!0;for(let n of this.settlements)Fr(n.x,n.y,e.x,e.z)<90&&(t=!1);if(t&&this.settlements.push({x:e.x,y:e.z}),this.settlements.length===3)break}this.keepHex=this.peak;let r=1e9,i=this.settlements.length;for(let[e,t]of this.types)if(t===F.HILLS&&i>0){let t=this.settlements[i-1],n=Fr(N(Jo(e),Yo(e)),ge(Yo(e)),t.x,t.y);n<r&&(r=n,this.keepHex={q:Jo(e),r:Yo(e)})}for(let e=0;e<i-1;e++)this.road(t,this.settlements[e],this.settlements[e+1]);i>0&&this.road(t,this.settlements[i-1],es(t,N(this.keepHex.q,this.keepHex.r),ge(this.keepHex.r)))}road(e,t,n){let r=Zo(t.x,t.y),i=Zo(n.x,n.y);if(!e.has(r)||!e.has(i))return;let a=new Map([[r,0]]),o=new Map,s=new Map([[r,0]]);for(;a.size;){let t=0,r=1/0,c=!0;for(let[e,n]of a)(c||n<r)&&(t=e,r=n,c=!1);if(t===i)break;a.delete(t);let l=e.get(t),u=this.height(l.x,l.z);for(let r of l.links.keys()){let i=e.get(r),c=Math.abs(this.height(i.x,i.z)-u),d=this.height(J(J(i.x+l.x)*.5),J(J(i.z+l.z)*.5))<.8?50:0,f=s.get(t)+20+c*6+d;f<(s.get(r)??0xde0b6b3a7640000)&&(s.set(r,f),o.set(r,t),a.set(r,f+Fr(i.x,i.z,n.x,n.y)))}}if(!o.has(i))return;let c=i;for(;c!==r;){let t=o.get(c),[n,r]=e.get(t).links.get(c);this.roads.set(n,(this.roads.get(n)??0)|1<<r);let i=n+Xo[r];this.roads.set(i,(this.roads.get(i)??0)|1<<(r+3)%6),c=t}}planFields(){this.fieldFrame=0;let e=this.settlements;if(e.length>=2){let t=e[e.length-1],n=e[0];this.fieldFrame=te(Ir(J(t.x-n.x),J(t.y-n.y)),Math.PI)}for(let t of e)for(let e of Qo(t)){let t=qo(e.q,e.r);this.fieldMarks.set(t,(this.fieldMarks.get(t)??0)|128)}}landBounds(){let e=0,t=0,n=0,r=0,i=!0;for(let[a,o]of this.types){if(o===F.SEA)continue;let s=J(N(Jo(a),Yo(a))-20),c=J(ge(Yo(a))-20);if(i){e=s,t=c,n=40,r=40,i=!1;continue}let l=Math.min(s,e),u=Math.min(c,t),d=Math.max(J(s+40),J(e+n)),f=Math.max(J(c+40),J(t+r));n=J(d-l),r=J(f-u),e=l,t=u}return{minX:e,maxX:J(e+n),minZ:t,maxZ:J(t+r),centre:{x:J(e+J(n*.5)),y:J(t+J(r*.5))}}}};function es(e,t,n){let r={x:0,y:0},i=1e9;for(let a of e.values()){let e=Fr(a.x,a.z,t,n);e<i&&(i=e,r={x:a.x,y:a.z})}return r}var ts={abbey:{radius:16,rarity:.004,discovery:!0,place:`open`,sink:.35,biomes:[B.MEADOW,B.FARMLAND,B.FOREST,B.HILLS,B.MOOR]},stone_circle:{radius:12,rarity:.008,discovery:!0,place:`open`,sink:.3,biomes:[B.MOOR,B.HILLS,B.MEADOW]},menhir:{radius:2,rarity:.03,discovery:!1,place:`open`,sink:.3,biomes:[B.MOOR,B.HILLS,B.MEADOW,B.PINE]},lighthouse:{radius:7,rarity:.05,discovery:!0,place:`coast`,sink:.3,biomes:[B.BEACH,B.HILLS,B.MOOR,B.MEADOW,B.SOUTH]},shipwreck:{radius:9,rarity:.02,discovery:!0,place:`shore`,sink:1.6,biomes:[B.BEACH,B.SHALLOWS]},hermit_hut:{radius:5,rarity:.01,discovery:!0,place:`open`,sink:.2,biomes:[B.FOREST,B.PINE,B.MOOR,B.FEN,B.HILLS]},fishing_hut:{radius:7,rarity:.04,discovery:!1,place:`shore`,sink:.2,biomes:[B.BEACH,B.FEN]},villa:{radius:12,rarity:.02,discovery:!0,place:`open`,sink:.25,biomes:[B.SOUTH]},log_cabin:{radius:7,rarity:.02,discovery:!1,place:`open`,sink:.2,biomes:[B.PINE,B.HILLS,B.MOUNTAIN]},bridge:{radius:11,rarity:0,discovery:!0,place:`river`,sink:.4,biomes:[B.MEADOW,B.FARMLAND,B.FOREST,B.FEN,B.HILLS,B.MOOR]},shrine:{radius:2,rarity:.012,discovery:!0,place:`road`,sink:.12,biomes:[B.MEADOW,B.FARMLAND,B.FOREST,B.HILLS,B.MOOR,B.SOUTH,B.PINE]},cairn:{radius:3.5,rarity:.015,discovery:!0,place:`open`,sink:.2,biomes:[B.MOOR,B.HILLS,B.MOUNTAIN,B.PINE]},market_stall:{radius:3,rarity:0,discovery:!1,place:`village`,sink:.1,biomes:[B.MEADOW,B.FARMLAND,B.SOUTH,B.BEACH]},south_cottage:{radius:7,rarity:0,discovery:!1,place:`village`,sink:.25,biomes:[B.SOUTH]},croft:{radius:7,rarity:0,discovery:!1,place:`village`,sink:.25,biomes:[B.MOOR,B.HILLS,B.PINE]}},ns={abbey:[`St. Brannoc's Abbey`,`Greyfriars Abbey`,`St. Wenna's Priory`,`Holyford Abbey`,`The Abbey of St. Petroc`,`Whitethorn Priory`,`St. Elowen's Ruin`,`Lanteglos Abbey`,`The Drowned Choir`,`St. Morwen's Abbey`],stone_circle:[`The Nine Maidens`,`The Merry Maidens`,`The Hurlers`,`The Grey Wethers`,`The Whistling Stones`,`The Sleepers`,`Long Meg's Ring`,`The Dancing Stones`,`Kingsmoor Ring`,`The Twelve Apostles`],lighthouse:[`Gull Point Light`,`The Saltwick Lamp`,`Old Blackrock Light`,`St. Ia's Beacon`,`Lantern Head`,`The Widow's Light`,`Kestle Point Light`],shipwreck:[`Wreck of the Merrow`,`The Drowned Cog`,`Wreck of the Kittiwake`,`The Bones of the Salt Rose`,`Wreck of the Good Hope`,`The Hollow Hull`],hermit_hut:[`The Hermit's Cell`,`Old Tamsin's Hut`,`Brother Aldo's Hermitage`,`The Anchorhold`,`Mossback Cell`,`The Recluse's Rest`],villa:[`Villa Serena`,`Villa dei Cipressi`,`Casa degli Ulivi`,`Villa Aurelia`,`The White Villa`,`Villa Lucerna`],bridge:[`The Packhorse Bridge`,`Monk's Bridge`,`Fiddler's Arch`,`The Hollow Bridge`,`Kingsford Bridge`,`The Devil's Bridge`],shrine:[`Shrine of St. Morwenna`,`The Weeping Shrine`,`Wayfarer's Shrine`,`Shrine of the Lantern`,`Our Lady of the Fields`,`St. Keyne's Shrine`],cairn:[`The Beehive`,`Old Man's Cairn`,`The Grey Lady's Cairn`,`Hob's Hollow`,`The Sleeping Cairn`,`Cairn of the Ravens`],menhir:[`The Long Stone`,`The Old Man`,`The Piper`,`Hob's Stone`,`The Watcher`],log_cabin:[`Trapper's Cabin`,`Woodcutter's Lodge`,`Elkhorn Lodge`,`Pine Hollow Cabin`],fishing_hut:[`Netmaker's Hut`,`Eelweir Hut`,`Cockle Shed`,`The Mending Shed`]},rs={abbey:{forms:[`St. %s's Abbey`,`St. %s's Priory`],words:`Piran.Mawgan.Endelient.Germoe.Breaca.Senara.Nectan.Clether.Mabyn.Neot.Buryan.Levan.Erth.Gerran.Columb.Enodoc.Allen.Clement.Docco.Goran.Keverne.Mewan.Rumon.Teath.Veep.Hydroc.Constantine.Finbar.Manacca.Elwyn.Mellion.Pinnock`.split(`.`)},shrine:{forms:[`Shrine of St. %s`,`St. %s's Well`,`St. %s's Cross`],words:`Minver.Cleer.Tudy.Winnow.Issey.Merryn.Gwinear.Kea.Feock.Mylor.Ludgvan.Sithney.Wendron.Probus.Crantock.Gulval.Austell.Blazey.Breward.Budoc.Carantoc.Cuby.Day.Dennis.Ewe.Gennys.Gluvias.Grade.Hilary.Illogan.Ive.Juliot.Kew.Kenwyn.Ladock.Lanivet.Madron.Menefreda.Neet.Perran.Sancreed.Tallan.Uny.Wenn.Zennor.Agnes.Erney.Gerrans`.split(`.`)},hermit_hut:{forms:[`%s's Cell`,`%s's Hermitage`,`%s's Hut`],words:`Brother Anselm.Sister Agnes.Old Jory.Brother Pascoe.Old Wenna.Brother Kenan.Sister Ysella.Old Davey.Brother Elwin.Mother Gwen.Old Kitto.Sister Loveday.Brother Jacca.Old Bersaba.Brother Tobias.Old Morwen.Sister Demelza.Brother Hedric.Old Jenifer.Brother Cadoc.Sister Tamar.Old Peder.Brother Ruan.Old Zacky.Sister Wynn.Brother Lowen.Old Ennor.Brother Austol.Sister Elestren.Old Gawen.Brother Jowan`.split(`.`)},shipwreck:{forms:[`Wreck of the %s`,`The Bones of the %s`],words:[`Heartsease`,`Sea Maid`,`Fair Wind`,`Morning Star`,`Prosper`,`Swallow`,`Endeavour`,`Constance`,`Pelican`,`Dove`,`Lark`,`Seaflower`,`Pilgrim`,`Unity`,`Silver Eel`,`Kingfisher`,`Gallant`,`Speedwell`,`Two Brothers`,`Diligence`]},lighthouse:{forms:[`%s Point Light`,`%s Head Light`,`%s Beacon`,`%s Lamp`],words:`Gannet.Seal.Puffin.Cormorant.Skerry.Wrack.Mizzen.Tern.Fulmar.Kelp.Curlew.Dunlin.Petrel.Whelk.Limpet.Selkie.Mussel.Shingle.Razorbill.Guillemot.Plover.Eider.Shearwater.Spindrift.Scoter.Sanderling.Pilchard.Conger.Oyster.Mackerel.Herring.Brine.Gale.Storm.Cliff.Ebb`.split(`.`)},stone_circle:{forms:[`The %s Stones`,`The %s Sisters`],words:`Seven.Singing.Frozen.Crooked.Sunken.Watching.Silent.Fallen.Moonlit.Broken.Gathering.Kneeling.Mourning.Hollow.Dreaming.Lost.Twisted.Weeping.Wandering.Hooded.Ringing.Brooding.Patient.Waiting.Shrouded.Burning.Blind.Barefoot.Bowing.Thirteen`.split(`.`)},cairn:{forms:[`%s Cairn`,`%s Barrow`,`%s Howe`],words:`Shepherd's.Piper's.Fiddler's.Drover's.Giant's.Smith's.King's.Weaver's.Miller's.Hunter's.Pedlar's.Tinner's.Reeve's.Wren's.Chieftain's.Bard's.Thane's.Warden's.Herdsman's.Mason's.Carter's.Fowler's.Netter's.Thatcher's.Cooper's.Tanner's.Chandler's.Ploughman's.Swineherd's.Beekeeper's.Woodward's.Hayward's.Ferrier's.Salter's.Ostler's`.split(`.`)},villa:{forms:[`Villa %s`,`Casa %s`],words:[`Rosaria`,`Fiorita`,`Celeste`,`dei Pini`,`del Mare`,`delle Rose`,`Bianca`,`Solana`,`Marina`,`Paradiso`,`degli Aranci`,`dei Limoni`,`Allegra`,`Speranza`,`Fontana`,`del Sole`,`dei Fichi`,`Rossa`]},bridge:{forms:[`%s Bridge`],words:[`Ferryman's`,`Weir`,`Mill`,`Old Stone`,`Drover's`,`Pack Lane`,`Abbot's`,`Long Ford`]}};function is(e,t,n,r){let i=rs[e];if(!i)return null;for(let a of[!0,!1])for(let o=0;o<i.words.length;o++){let s=i.words[ee(t+o,i.words.length)];if(!(a&&r.has(`${e}:${s}`)))for(let a=0;a<i.forms.length;a++){let o=i.forms[ee(t+a,i.forms.length)].replace(`%s`,s);if(!n.has(o))return r.add(`${e}:${s}`),o}}return null}var as={abbey:`A ruined abbey`,stone_circle:`A ring of standing stones`,lighthouse:`A lighthouse`,shipwreck:`A wreck on the shore`,hermit_hut:`A hermit's cell`,villa:`A southern villa`,shrine:`A wayside shrine`,cairn:`An old cairn`,bridge:`An old bridge`};function os(e){return as[e]??e.split(`_`).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `)}function ss(e,t){let n=ns[e];return n?n[ee(t,n.length)]:``}function cs(e,t=!1){return Object.keys(ts).filter(n=>ts[n].biomes.includes(e)&&(t||ts[n].rarity>0))}var ls=Array.from({length:13},(e,t)=>cs(t)),us=133,ds=3650;function fs(e){let{seed:t,types:n,regions:r,villages:i}=e,a=[],o=new Set,s=new Set,c=new Set,l=new Map;for(let u=-us;u<=us;u++)for(let d=-256;d<256;d++){let f=(u+256)*512+(d+256),p=r[f];if(p===P.HOME||p===P.SEA)continue;let m=N(d,u),h=ge(u);if(Math.abs(m)>ds||Math.abs(h)>ds)continue;let g=!1;for(let e of i)Fr(e.pos.x,e.pos.y,m,h)<110&&(g=!0);if(g)continue;let _=ls[n[f]];for(let r=0;r<_.length;r++){let f=_[r],g=ts[f];if(z(d,u,t+900+r*13)%1e5/1e5>=g.rarity)continue;let v=J(m+J(J(z(d,u,1)%100/100-.5)*20)),y=J(h+J(J(z(d,u,2)%100/100-.5)*20));if(g.place===`coast`||g.place===`shore`){let t=!1;for(let e of oe({q:d,r:u},1))e.q>=-256&&e.r>=-256&&e.q<256&&e.r<256&&L(n[(e.r+256)*512+(e.q+256)])&&(t=!0);if(!t)continue;if(g.place===`shore`){let t=ps(e,m,h);if(!t)continue;v=t.x,y=t.y}}else if(e.normalY(v,y)<.85||e.height(v,y)<1.5)continue;let b=g.discovery?300:450,x=!0;for(let e of l.get(f)??[])Fr(e.x,e.y,v,y)<b&&(x=!1);if(!x)continue;let S=z(d,u,t+77),C=g.discovery?ss(f,S):``,w=!1;if(C!==``&&o.has(C)){let e=``,t=1e9;for(let n of i){let r=Fr(n.pos.x,n.pos.y,v,y);r<t&&(t=r,e=n.name)}C=e===``?``:`${C} by ${e}`,w=!0}C!==``&&o.has(C)&&(C=``),C!==``&&o.add(C);let T=w&&C!==``?is(f,S,s,c)??C:C;T!==``&&s.add(T),a.push({kind:f,name:T,pos:{x:v,y:J(e.height(v,y)),z:y},yaw:S%628/100,seed:S,radius:g.radius,region:p,description:os(f)});let E=l.get(f);E?E.push({x:v,y}):l.set(f,[{x:v,y}]);break}}return a}function ps(e,t,n){for(let r=0;r<24;r++){let i=Math.PI*2*r/24,a=J(Math.cos(i)),o=J(Math.sin(i));for(let r=2;r<22;r+=2){let i=J(t+J(a*r)),s=J(n+J(o*r)),c=e.height(i,s);if(c>-.2&&c<.6)return{x:i,y:s}}}return null}var ms=-1650,hs=Math.trunc(ie/30),gs=620,_s=400,vs=J(.6),ys=J(.7),bs=J(1.6),xs=J(1.7),Ss=[`Ash`,`Bram`,`Cold`,`Dun`,`Elder`,`Fern`,`Glen`,`Hart`,`Kel`,`Lark`,`Mere`,`Oak`,`Pen`,`Rook`,`Sel`,`Thorn`,`Wick`,`Yarrow`],Cs=[`ford`,`by`,`combe`,`haven`,`ley`,`mouth`,`stead`,`wold`,`holt`,`bridge`,`wick`,`moor`,`port`,`dale`],ws=[`Cala`,`Santa `,`Porto `,`Villa`,`Mar`,`Aldea `,`Ser`],Ts=[`vera`,`Oliva`,`Bianco`,`nova`,`ella`,`Sole`,`rano`];function Es(e,t){return(e+4096)*8192+(t+4096)}var Ds=class{seed;types=new Uint8Array(262144).fill(B.OCEAN);regions=new Uint8Array(262144);baseH=new Float32Array(262144).fill(-30);rough=new Float32Array(262144).fill(2);landHexes=0;villages=[];landmarks;places;home;island;field;shape;detail;ridge;forest;moist;cells=new Map;openSea=new Map;hexTex;lvStrength=0;lvRegion=P.SEA;lvInland=0;islSouth=!1;constructor(e){this.seed=e,this.island=new $o(e),this.shape=new ko({seed:e+100,frequency:.0011,octaves:4}),this.detail=new ko({seed:e+101,frequency:.006,octaves:3}),this.ridge=new ko({seed:e+102,fractal:Do.RIDGED,frequency:.0019,octaves:5}),this.forest=new ko({seed:e+103,frequency:.0026,octaves:3}),this.moist=new ko({seed:e+104,frequency:.0017}),this.buildHexes(),this.field=new Vo({seed:e,homeBase:this.island.homeBase,homeRough:this.island.homeRough,baseH:this.baseH,rough:this.rough});let t=new Map,n=e=>{let n=R({x:e.pos.x,y:e.pos.z});t.set(ae(n),{...e,hex:n})};for(let e of this.villages)n({kind:`village`,name:e.name,pos:{x:e.pos.x,y:J(this.height(e.pos.x,e.pos.y)),z:e.pos.y},size:e.size,region:e.region});this.landmarks=fs({seed:e,types:this.types,regions:this.regions,villages:this.villages,height:(e,t)=>this.height(e,t),normalY:(e,t)=>this.normalAt(e,t).y});for(let e of this.landmarks)e.name!==``&&n({kind:`landmark`,name:e.name,pos:e.pos,description:e.description,region:e.region,landmark:e.kind});this.places=[...t.values()],this.hexTex=this.buildHexTexture(),this.home=this.buildHome()}height(e,t){return this.field.height(e,t)}baseType(e){return ue(e)?this.types[re(e)]:B.OCEAN}region(e){return ue(e)?this.regions[re(e)]:P.SEA}inGrid(e){return ue(e)}baseHeight(e){return ue(e)?this.baseH[re(e)]:-30}roadBits(e){return ue(e)?this.hexTex[re(e)*4+1]:0}frameByte(e){return ue(e)?this.hexTex[re(e)*4+2]:0}fieldMarks(e){return ue(e)?this.hexTex[re(e)*4+3]:0}hexData(){return this.hexTex.slice()}heightData(){return{seed:this.seed,homeBase:this.island.homeBase.slice(),homeRough:this.island.homeRough.slice(),baseH:this.baseH.slice(),rough:this.rough.slice()}}coastZ(e){return ms+this.shape.get1(J(e*.6))*520+Math.sin(e*.0013+1.1)*220}normalAt(e,t){let n=1.5,r=J(this.height(e-n,t)-this.height(e+n,t)),i=J(this.height(e,t-n)-this.height(e,t+n)),a=J(J(J(r*r)+J(9))+J(i*i));if(a===0)return{x:0,y:0,z:0};let o=J(Math.sqrt(a));return{x:J(r/o),y:J(3/o),z:J(i/o)}}landValue(e){return this.computeLandValue(J(e.x),J(e.y)),{strength:this.lvStrength,region:this.lvRegion,inland:this.lvInland}}parcelAt(e,t){return Rr(e,t,this.seed)}cropAt(e){let t=this.island,n=R({x:J(e.x),y:J(e.y)}),r=t.typeAt(n.q,n.r);if(r!==F.FIELD&&r!==F.PASTURE)return-1;let i=Rr(e,Ur(Hr(t.fieldFrame)),this.seed),a=R(i.centre);return Vr(i,Ho[t.typeAt(a.q,a.r)],t.fieldMarks.get(qo(a.q,a.r))??0,this.seed)?zr(i.cell,this.seed):-1}parcelEdgeDist(e){return Rr(e,Ur(Hr(this.island.fieldFrame)),this.seed).edge}isOpenSea(e){if(!L(this.baseType(e)))return!1;let t=this.openSea.get(Es(e.q,e.r));if(t!==void 0)return t;let n=[e],r=new Set([Es(e.q,e.r)]),i=!1;for(let e=0;e<n.length;e++){let t=n[e];if(this.openSea.get(Es(t.q,t.r))||n.length>=_s){i=!0;break}for(let e of se){let i={q:t.q+e.q,r:t.r+e.r},a=Es(i.q,i.r);!r.has(a)&&L(this.baseType(i))&&(r.add(a),n.push(i))}}for(let e of n)this.openSea.set(Es(e.q,e.r),i);return i}seaBerthNear(e,t=14,n=2.5){let r=J(e.x),i=J(e.y),a=null,o=1/0;for(let e of oe(R({x:r,y:i}),t)){let t=I(e),s=Fr(t.x,t.y,r,i);s<o&&this.height(t.x,t.y)<-n&&this.isOpenSea(e)&&(o=s,a=e)}return a}cell(e,t){let n=Es(e,t),r=this.cells.get(n);if(r!==void 0)return r;let i=z(e,t,this.seed+7),a=J(J(e+J(i%1e3/1e3))*gs),o=J(J(t+J((i>>>10)%1e3/1e3))*gs),s=null;if(!(o<this.coastZ(a)+380||Nr(a,o)<820||Math.abs(a)>3500||o>3500)){let e=a>900&&o>700;if((i>>>20)%1e3/1e3<=(e?.62:.42)){let t=J(i%628/100);s={x:a,z:o,south:e,radius:(90+(i>>>4)%170)*(e?1.45:1),aspect:.65+(i>>>14)%70/100,sin:J(Math.sin(t)),cos:J(Math.cos(t))}}}return this.cells.set(n,s),s}islandField(e,t){let n=Math.floor(e/gs),r=Math.floor(t/gs),i=-1,a=!1,o=!1,s=0,c=0,l=0;for(let u=-1;u<=1;u++)for(let d=-1;d<=1;d++){let f=this.cell(n+d,r+u);if(!f)continue;if(!o){let n=J(e*.5),r=J(t*.5);s=this.detail.get2(n,r),c=this.detail.get2(J(n+913),J(r+377)),l=this.detail.get2(J(e*bs),J(t*bs)),o=!0}let p=J(f.radius),m=J(J(e+J(J(s*p)*ys))-f.x),h=J(J(t+J(J(c*p)*ys))-f.z),g=J(J(m*f.cos)-J(h*f.sin)),_=J(J(m*f.sin)+J(h*f.cos)),v=Nr(J(g/f.aspect),J(_*f.aspect))/f.radius,y=1-v*v+l*.35;y>i&&(i=y,a=f.south)}return this.islSouth=a,J(i)}computeLandValue(e,t){if(Nr(e,t)<530){let n=R({x:e,y:t}),r=this.island.isLand(n.q,n.r);this.lvStrength=r?1:-1,this.lvRegion=r?P.HOME:P.SEA,this.lvInland=J(.3);return}let n=Math.max(0,(Math.max(Math.abs(e),Math.abs(t))-(ie-400))/200),r=this.coastZ(e),i=(r-t)/260+this.detail.get2(e,t)*1.2+this.shape.get2(J(e*xs),J(t*xs))*1.1,a=Math.min(Math.max((r-t)/2300+this.moist.get2(J(e*vs),J(t*vs))*.16,0),1),o=this.islandField(e,t);i>=o?(this.lvStrength=J(i-n),this.lvRegion=i-n>0?P.MAINLAND:P.SEA,this.lvInland=J(a)):(this.lvStrength=J(o-n),this.lvRegion=o-n>0?this.islSouth?P.SOUTH:P.SCATTER:P.SEA,this.lvInland=J(Math.min(Math.max(o,0),1)*.4))}buildHexes(){let e=hs+2;for(let t=-e;t<=e;t++)for(let e=-256;e<256;e++){let n=N(e,t),r=ge(t);Math.abs(n)>4e3||Math.abs(r)>4e3||this.classify(e,t,n,r)}let t=[1,1,0,-1,-1,0],n=[0,-1,-1,0,1,1];for(let r=-e;r<=e;r++)for(let e=-256;e<256;e++){if(r<-256||r>=256)continue;let i=(r+256)*512+(e+256);if(this.types[i]===B.OCEAN)for(let a=0;a<6;a++){let o=e+t[a],s=r+n[a];if(o>=-256&&s>=-256&&o<256&&s<256&&!L(this.types[(s+256)*512+(o+256)])){this.types[i]=B.SHALLOWS,this.baseH[i]=Math.max(this.baseH[i],-6);break}}}this.placeVillages()}classify(e,t,n,r){let i=(t+256)*512+(e+256);if(Nr(n,r)<470){let e=R({x:n,y:r}),t=this.island.typeAt(e.q,e.r);this.types[i]=Ho[t],this.regions[i]=t===F.SEA?P.SEA:P.HOME,this.baseH[i]=0,this.rough[i]=0,t!==F.SEA&&this.landHexes++;return}this.computeLandValue(n,r);let a=this.lvStrength;if(a<=0){this.types[i]=B.OCEAN,this.regions[i]=P.SEA,this.baseH[i]=Math.min(Math.max(-4+a*16,-45),-4),this.rough[i]=2;return}this.landHexes++;let o=this.lvRegion,s=this.lvInland;this.regions[i]=o;let c=this.forest.get2(n,r),l=this.moist.get2(n,r),u=B.MEADOW,d=4,f=3,p=a<.35;if(o===P.MAINLAND){let e=this.ridge.get2(n,r)*.5+.5,t=e*ne(.45,.95,s)*1.25+s*.25;d=5+s*46,f=3.5+s*6,t>1.1?(u=B.PEAK,d+=78+(t-1.1)*180,f=15):t>.86?(u=B.MOUNTAIN,d+=34+(t-.86)*160,f=11):s>.62?(u=c>-.15?B.PINE:e>.55?B.HILLS:B.MOOR,d+=12,f=9):s>.3?(u=l<.1&&c<.2?B.MOOR:c>.2?B.FOREST:B.HILLS,d+=6,f=6):l>.28&&s<.22?(u=B.FEN,d=1.4,f=.6):u=c>.12?B.FOREST:B.MEADOW,p&&u===B.MEADOW&&this.detail.get2(J(n*2),J(r*2))<-.05&&(u=B.BEACH,d=1.2,f=.8)}else o===P.SOUTH?(u=c<.35?B.SOUTH:B.HILLS,d=4+a*18,f=5+a*6,p&&c<-.1&&(u=B.BEACH,d=1.2,f=.8)):(u=c>.25?B.FOREST:a>.75?B.HILLS:B.MEADOW,d=3+a*14,f=3+a*5,p&&c<0&&(u=B.BEACH,d=1.2,f=.8));this.types[i]=u,this.baseH[i]=d,this.rough[i]=f}placeVillages(){let e=[];for(let t=-hs;t<=hs;t+=3)for(let n=-256;n<256;n+=3){let r=(t+256)*512+(n+256),i=this.types[r],a=this.regions[r];if(a===P.HOME||a===P.SEA||i!==B.MEADOW&&i!==B.FOREST&&i!==B.HILLS&&i!==B.SOUTH&&i!==B.MOOR||ge(t)<this.coastZ(N(n,t))-1700)continue;let o=!1;for(let e=-4;e<=4&&!o;e++)for(let r=Math.max(-4,-e-4);r<=Math.min(4,-e+4);r++){let i=n+e,a=t+r;if(i>=-256&&a>=-256&&i<256&&a<256&&L(this.types[(a+256)*512+(i+256)])){o=!0;break}}e.push({score:z(n,t,this.seed+21)%1e3/1e3+(o?.6:0),q:n,r:t})}me(e,(e,t)=>e.score>t.score);for(let t of e){if(this.villages.length>=14)break;let e=N(t.q,t.r),n=ge(t.r),r=Nr(e,n)>900;for(let t of this.villages)Fr(t.pos.x,t.pos.y,e,n)<750&&(r=!1);if(!r)continue;let i={q:t.q,r:t.r},a=this.regions[re(i)],o=z(i.q,i.r,this.seed+33),s=a===P.SOUTH?ws[o%ws.length]+Ts[(o>>>6)%Ts.length]:Ss[o%Ss.length]+Cs[(o>>>6)%Cs.length],c=1+(o>>>12)%3;this.villages.push({pos:pe(i,(o>>>3)%6),hex:i,region:a,name:s,size:c});let l=this.baseH[re(i)];for(let e of oe(i,c>=2?2:1)){if(!ue(e))continue;let t=re(e),n=this.types[t];L(n)||n===B.MOUNTAIN||n===B.PEAK||n===B.BEACH||(e.q!==i.q||e.r!==i.r)&&z(e.q,e.r,this.seed+5)%10<7&&(this.types[t]=B.FARMLAND,this.baseH[t]=this.baseH[t]+(l-this.baseH[t])*.7,this.rough[t]=Math.min(this.rough[t],2))}}}buildHexTexture(){let e=new Uint8Array(262144),t=t=>{ue(t)&&(e[re(t)]|=128)};for(let e of this.island.fieldMarks.keys())t({q:Jo(e),r:Yo(e)});let n=[0],r=[0],i=[Hr(this.island.fieldFrame)];for(let e of this.villages){for(let n of Qo(e.pos))t(n);n.push(e.pos.x),r.push(e.pos.y),i.push(z(M(e.pos.x),M(e.pos.y),this.seed+61)%256)}let a=new Uint8Array(1048576);for(let t=-256;t<256;t++)for(let o=-256;o<256;o++){let s=(t+256)*512+(o+256),c=s*4,l=this.types[s];if(a[c]=l,this.regions[s]===P.HOME&&(a[c+1]=this.island.roads.get(qo(o,t))??0),L(l))continue;let u=0;if(this.regions[s]!==P.HOME){let e=N(o,t),i=ge(t),a=1/0;for(let t=0;t<n.length;t++){let o=Pr(e,i,n[t],r[t]);o<a&&(a=o,u=t)}}a[c+2]=i[u],a[c+3]=e[s]}return a}buildHome(){let e=this.island,t=e=>ae({q:Jo(e),r:Yo(e)}),n=e=>new Map([...e].map(([e,n])=>[t(e),n])),r=e.landBounds(),i=e.settlements,a=i[1]??i[0]??{x:0,y:0},o=R(a);for(let e of oe(o,2)){let t=this.baseType(e),n=I(e);if(!L(t)&&t!==B.MOUNTAIN&&this.normalAt(n.x,n.y).y>.9){o=e;break}}let s=i[i.length-1]??r.centre,c=this.seaBerthNear(s,16,3)??this.seaBerthNear(r.centre,40,2);return{settlements:i.map(e=>({x:e.x,y:e.y})),roads:n(e.roads),peak:{...e.peak},keepHex:{...e.keepHex},fieldFrame:e.fieldFrame,landBounds:{minX:r.minX,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ},landCentre:r.centre,scoutHex:o,shipHex:c,types:n(e.types),inland:n(e.inland),seaDepth:n(e.seaDepth),fieldMarks:n(e.fieldMarks)}}};function Os(e){return new Ds(e)}var ks=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;     // crevice AO, rock weight, block tone, ledge
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
  vec4 wp = world * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(world) * normal);
  vColor = color;
  gl_Position = viewProjection * wp;
}
`;U(`rock`,ks,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
${V}
${H}
uniform vec3 uStoneDark;
uniform vec3 uStoneLight;
uniform float uSnow;
uniform float uTurf;

float tri(vec3 p, vec3 n, float f) {
  vec3 w = pow(abs(n), vec3(4.0));
  w /= w.x + w.y + w.z;
  return vnoise(p.yz * f) * w.x + vnoise(p.xz * f) * w.y + vnoise(p.xy * f) * w.z;
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 ng = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  if (dot(ng, uCamPos - vWorld) < 0.0) ng = -ng;
  if (dot(n, ng) < 0.0) n = -n;
  float ao = vColor.r, tone = vColor.b, ledge = vColor.a;
  float broad = tri(vWorld, n, 0.11);
  float mid = tri(vWorld + 17.0, n, 0.45);
  float fine = tri(vWorld + 3.0, n, 1.6);
  float steep = 1.0 - smoothstep(0.3, 0.75, abs(n.y));
  // Per-vertex tone and crevice shade come from a plan-view grid: on a cliff they smear into vertical streaks, so
  // steep faces take their variation from the beds instead.
  tone = mix(tone, 0.5, steep);
  ao = mix(ao, max(ao, 0.85), steep);
  vec3 dark = pow(uStoneDark, vec3(2.2)), light = pow(uStoneLight, vec3(2.2));
  vec3 stone = mix(dark, light, clamp(tone * 0.45 + broad * 0.45 + mid * 0.3 - 0.12, 0.0, 1.0));
  // Bedded strata across the steep faces (A1, G1): beds of uneven thickness, each its own tone, a lit lip along its
  // top and a soft joint under it, broken in places. Beds fade to their mean where they are under a few pixels.
  float sy = vWorld.y / 2.6 + (broad - 0.5) * 1.2;
  float bedId = floor(sy);
  float bed = fract(sy);
  bed = clamp((bed - 0.18 * (hash12(vec2(bedId, 9.1)) - 0.5)) / 0.92, 0.0, 1.0);
  float bedAA = 1.0 - smoothstep(0.15, 0.45, fwidth(sy));
  float jointAA = 1.0 - smoothstep(0.05, 0.16, fwidth(sy));
  float joint = smoothstep(0.93, 0.99, bed) * smoothstep(0.35, 0.6, mid) * jointAA;
  float strata = (hash12(vec2(bedId, 3.7)) - 0.5) * 0.26 + 0.12 * smoothstep(0.74, 0.9, bed) * jointAA - 0.18 * joint - 0.06 * (1.0 - smoothstep(0.0, 0.2, bed));
  stone *= 1.0 + strata * steep * bedAA;
  stone *= 0.84 + 0.32 * fine;
  // Tops catch the sky and the sun: lighter rock where it levels off.
  stone *= mix(1.0, 1.16, smoothstep(0.45, 0.9, n.y));
  float lichen = smoothstep(0.6, 0.78, tri(vWorld + 41.0, n, 0.3)) * smoothstep(-0.3, 0.4, n.y);
  stone = mix(stone, pow(vec3(0.66, 0.62, 0.42), vec3(2.2)), lichen * 0.3);
  // Crevices go cool, not black.
  stone *= mix(vec3(0.36, 0.4, 0.52), vec3(1.0), smoothstep(0.4, 1.0, ao));
  // Turf where the rock levels off.
  float levelled = n.y + (mid - 0.5) * 0.35 + ledge * 0.3;
  float grass = smoothstep(0.62, 0.8, levelled) * uTurf * smoothstep(2.0, 3.5, vWorld.y);
  vec3 turf = mix(vec3(0.27, 0.32, 0.11), vec3(0.44, 0.48, 0.17), mid);
  turf = mix(turf, vec3(0.54, 0.52, 0.27), uSeason.z * 0.6);
  vec3 base = mix(stone, pow(turf, vec3(2.2)), grass);
  // A dark wet band where the sea washes the foot.
  float wet = 1.0 - smoothstep(0.2, 1.9 + mid * 0.6, vWorld.y);
  base *= mix(1.0, 0.5, wet);
  float front = vnoise(vWorld.xz / 260.0) * 0.55 + vnoise((vWorld.xz + 37.0) / 70.0) * 0.30 + vnoise((vWorld.xz + 91.0) / 14.0) * 0.15;
  float cover = smoothstep(front, front + 0.18, uSnow * 1.02);
  cover = mix(cover * smoothstep(0.0, 0.12, uSnow), 1.0, smoothstep(0.9, 1.0, uSnow));
  // Snow settles on anything short of a sheer face, and dusts the lips of the beds on the cliffs.
  float cap = max(smoothstep(0.3, 0.62, n.y + (fine - 0.5) * 0.3), steep * smoothstep(0.8, 0.9, bed) * smoothstep(0.4, 0.7, fine) * 0.7) * (1.0 - wet);
  base = mix(base, vec3(0.86, 0.89, 0.95), cap * cover);
  float sh;
  vec3 col = shade(base, n, vWorld, mix(0.6, 1.0, ao), 0.4, sh);
  // Warm bounce from the sunlit ground under a high sun.
  col += base * uSunColor * 0.05 * max(uSunDir.y, 0.0) * (1.0 - max(n.y, 0.0));
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`rockDepth`,ks,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`),U(`rockBed`,ks,`
precision highp float;
varying vec3 vWorld;
uniform vec3 uCamPos;
void main() { gl_FragColor = vec4(length(vWorld - uCamPos) / 8000.0, 0.0, 0.0, 1.0); }
`);function As(e,t,n,r,i,a,o){let s=[`position`,`normal`,`color`],c=t.material(`rock_${r}`,`rock`,{attributes:s,uniforms:[`uStoneDark`,`uStoneLight`,`uSnow`,`uTurf`]});c.onBindObservable.add(()=>{let e=c.getEffect();e&&(e.setFloat3(`uStoneDark`,...a.dark),e.setFloat3(`uStoneLight`,...a.light),e.setFloat(`uTurf`,a.turf),e.setFloat(`uSnow`,a.snow()))}),c.backFaceCulling=!1;let l=new v(`rocks_${r}`,e),u=new S;u.positions=i.p,u.normals=i.n,u.colors=i.c,u.indices=i.i,u.applyToMesh(l,!1),l.material=c,l.isPickable=!1,l.freezeWorldMatrix();let d=t.material(`rockDepth_${r}`,`rockDepth`,{attributes:s,lit:!1});if(d.backFaceCulling=!1,n.addCaster(l,d,2),o){let n=t.material(`rockBed_${r}`,`rockBed`,{attributes:s,uniforms:[`uCamPos`],lit:!1});n.onBindObservable.add(()=>n.getEffect()?.setVector3(`uCamPos`,e.activeCamera.globalPosition)),o.renderList.push(l),o.setMaterialForRendering(l,n)}return{mesh:l,material:c}}function js(e,t,n,r,i,a,o,s,c,l,u){let d=e.count,f=Math.cos(s),p=Math.sin(s),m=(e,t,n)=>(le(e*37+n*11,t*37+c,9,c+n)-.5)*2,h=[];for(let e=0;e<=8;e++){let t=e/8*Math.PI;for(let e=0;e<=14;e++){let n=e%14/14*Math.PI*2,r=Math.sin(t)*Math.cos(n),i=Math.cos(t),a=Math.sin(t)*Math.sin(n),o=m(r+2,a+i*3,1)*.6+m(r*3+5,a*3+i*7,2)*.25,s=i<0?.65:1,l=1+.3*o;r*=l,i*=l*s,a*=l;for(let e=0;e<3;e++){let t=(c*7+e*2.3)%6.283,n=.3+(c*3+e)%5*.12,o=Math.cos(t)*Math.cos(n),s=Math.sin(n),l=Math.sin(t)*Math.cos(n),u=r*o+i*s+a*l-.72;u>0&&(r-=o*u,i-=s*u,a-=l*u)}h.push([r,i,a,o])}}let g=[];for(let[e,s,c]of h){let l=e*i,u=s*a,d=c*o;g.push([t+l*f+d*p,n+u,r-l*p+d*f])}let _=(e,t)=>t*15+e;for(let i=0;i<=8;i++)for(let a=0;a<=14;a++){let o=g[_(a,i)],s=g[_((a+1)%14,i)],d=g[_((a+14-1)%14,i)],f=g[_(a,Math.max(0,i-1))],p=g[_(a,Math.min(8,i+1))],m=s[0]-d[0],v=s[1]-d[1],y=s[2]-d[2],b=p[0]-f[0],x=p[1]-f[1],S=p[2]-f[2],C=v*S-y*x,w=y*b-m*S,T=m*x-v*b,E=o[0]-t,D=o[1]-n,O=o[2]-r;C*E+w*D+T*O<0&&(C=-C,w=-w,T=-T);let k=Math.hypot(C,w,T)||1;i===0?(C=0,w=1,T=0):(C/=k,w/=k,T/=k);let A=h[_(a,i)],j=Math.min(1,Math.max(.35,.65+A[1]*.35+A[3]*.3));l&&u!==void 0?e.vertex(o[0],o[1],o[2],C,w,T,[l[0]*(.85+j*.2),l[1]*(.85+j*.2),l[2]*(.85+j*.2)],u):e.vertex(o[0],o[1],o[2],C,w,T,[j,1,c*13%100/100,0],0)}for(let t=0;t<8;t++)for(let n=0;n<14;n++){let r=d+_(n,t),i=d+_(n+1,t),a=d+_(n,t+1),o=d+_(n+1,t+1);e.tri(r,a,i),e.tri(i,a,o)}}function Ms(e,t,n,r,i,a,o,s,c){let l=new ua(c,211),u=9+c%4,d=[[0,.42,1,.9],[.42,.72,.82,.72],[.72,.93,.64,.56]],f=c%1e3/51.3,p=[Math.sin(f)*.2,Math.cos(f)*.14],m=Math.cos(s),h=Math.sin(s),g=(e,s,c)=>{let l=(e+p[0]*s*s)*i,u=(c+p[1]*s*s)*i*o;return[t+l*m+u*h,n+s*a,r-l*h+u*m]},_=[];for(let e=0;e<u;e++){let t=(e+l.range(-.28,.28))/u*Math.PI*2;_.push([t,l.range(.8,1.06)])}let v=(e,t,n,r)=>_.map(([i,a],o)=>[Math.cos(i+n)*t*a*r[o],e,Math.sin(i+n)*t*a*r[o]]),y=(n,i)=>{let a=n.map(e=>g(e[0],e[1],e[2])),o=a[1][0]-a[0][0],s=a[1][1]-a[0][1],c=a[1][2]-a[0][2],l=a[3][0]-a[0][0],u=a[3][1]-a[0][1],d=a[3][2]-a[0][2],f=s*d-c*u,p=c*l-o*d,m=o*u-s*l,h=(a[0][0]+a[2][0])/2-t,_=(a[0][2]+a[2][2])/2-r;f*h+m*_<0&&Math.abs(p)<.9*Math.hypot(f,p,m)&&(f=-f,p=-p,m=-m);let v=Math.hypot(f,p,m)||1,y=e.count;for(let t=0;t<4;t++)e.vertex(a[t][0],a[t][1],a[t][2],f/v,p/v,m/v,i[t],0);e.tri(y,y+1,y+2),e.tri(y,y+2,y+3)},b=(e,t,n,r,i)=>{for(let a=0;a<u;a++){let o=(a+1)%u;y([e[a],t[a],t[o],e[o]],[[r,1,n,0],[i,1,n,0],[i,1,n,0],[r,1,n,0]])}},x=(e,t,n,r)=>{for(let i=0;i<u;i++){let a=(i+1)%u;y([e[i],e[a],t[a],t[i]],[[1,1,n,r],[1,1,n,r],[.6,1,n,r],[.6,1,n,r]])}},S=null;d.forEach((e,t)=>{let n=Math.max(2,Math.round((e[1]-e[0])*a/2.6)),r=null;for(let i=0;i<n;i++){let a=i/n,o=(i+1)/n,s=e[0]+(e[1]-e[0])*a,u=e[0]+(e[1]-e[0])*o,d=e[2]+(e[3]-e[2])*a,f=e[2]+(e[3]-e[2])*o,p=l.range(.95,1.05),m=l.range(-.06,.06),h=_.map(()=>l.range(.96,1.04)),g=v(s,d*p,m,h),y=v(u,f*p*.985,m,h),C=z(t,i,c)%100/100;r?x(r,g,C,0):S&&x(S,g,C,1),b(g,y,C,.55,1),r=y}S=r});let C=S,w=C.map(e=>[e[0]*.6,.938,e[2]*.6]);x(C,w,.5,1);let T=g(0,.945,0),E=e.vertex(T[0],T[1],T[2],0,1,0,[1,1,.5,1],0),D=w.map(t=>{let n=g(t[0],t[1],t[2]);return e.vertex(n[0],n[1],n[2],0,1,0,[1,1,.5,1],0)});for(let t=0;t<u;t++)e.tri(D[t],D[(t+1)%u],E)}function Ns(e,t,n){let r=new _a,i=e.seed,a=e.home,o=(t,n)=>e.height(t,n),s=[];for(let[e,t]of a.types)t===F.SEA&&a.seaDepth.get(e)===1&&s.push(ve(e));s.sort((e,t)=>z(e.q,e.r,i+81)-z(t.q,t.r,i+81));let c=new ua(i,97),l=new ua(i,101),u=[];for(let e of s){if(u.length>=4)break;let t=I(e),n={x:t.x+c.range(-8,8),z:t.y+c.range(-8,8)};if(n.z>a.landCentre.y+40||o(n.x,n.z)>-1.5||u.some(e=>Math.hypot(e.x-n.x,e.z-n.z)<90))continue;u.push(n);let s=0;for(let e=0;e<(u.length%2==0?2:1);e++){let t={x:13/15.81*s*1.05*e,z:-9/15.81*s*1.05*e},a={x:n.x+t.x,z:n.z+t.z},u=c.range(24,34)/(1+e*.6),d=u/4.4*c.range(.9,1.1);e===0&&(s=d),Ms(r,a.x,o(a.x,a.z)-1,a.z,d,u,c.range(.75,1),c.angle(),z(Math.round(a.x),Math.round(a.z),i));for(let e=0;e<7;e++){let e=l.angle(),t=d*l.range(.95,1.5),n={x:a.x+Math.cos(e)*t,z:a.z+Math.sin(e)*t},i=l.range(1.2,2.8);js(r,n.x,Math.max(o(n.x,n.z),-1.4)-i*.25,n.z,i,i*l.range(.55,.85),i*l.range(.75,1.2),l.angle(),l.int(0,9999))}}}let d=a.landBounds,f=new ua(i,13),p=0;for(let e=0;e<24e3&&p<340;e++){let e={x:f.range(d.minX-40,d.maxX+40),z:f.range(d.minZ-40,d.maxZ+40)},n=o(e.x,e.z);if(n<-.9||n>1.9||le(e.x,e.z,44,i+204)<.56||t.blocked(e.x,e.z,1.5))continue;let a=p%17==0?f.range(3.4,5.3):f.range(.65,2.35);js(r,e.x,n-a*.28,e.z,a,a*f.range(.5,.85),a*f.range(.75,1.25),f.angle(),f.int(0,9999)),p++}let m=null,h=-1/0;for(let t of oe({q:0,r:0},14)){let n=I(t);if(Math.hypot(n.x,n.y)>430)continue;let r=e.baseType(t);if(r!==B.MOUNTAIN&&r!==B.PEAK)continue;let i=o(n.x,n.y);i>h&&(h=i,m={x:n.x,z:n.y})}if(m){let e=new ua(i,13,991),a=0;for(let i=0;i<1600&&a<190;i++){let i=e.angle(),s=e.range(18,105),c={x:m.x+Math.cos(i)*s,z:m.z+Math.sin(i)*s},l=o(c.x,c.z);if(l<3||l>35||Ps(o,c.x,c.z)<.6||t.blocked(c.x,c.z,2)||n.distance(c.x,c.z)<3.5)continue;let u=a%17==0?e.range(1.8,3.4):e.range(.3,1.25);js(r,c.x,l-u*.34,c.z,u,u*e.range(.5,.9),u*e.range(.7,1.25),e.angle(),e.int(0,9999)),a++}}return r}function Ps(e,t,n){let r=1.5,i=e(t-r,n)-e(t+r,n),a=e(t,n-r)-e(t,n+r);return 2*r/Math.hypot(i,2*r,a)}var Fs={abbey:`poi_abbey`,stone_circle:`poi_menhir`,menhir:`poi_menhir`,lighthouse:`poi_lighthouse`,shipwreck:`poi_wreck`,hermit_hut:`poi_hermit`,fishing_hut:`poi_fishhut`,villa:`poi_villa`,log_cabin:`poi_cabin`,bridge:`poi_bridge`,shrine:`poi_shrine`,cairn:`poi_cairn`,market_stall:`poi_stall`,south_cottage:`poi_south_cottage`,croft:`poi_croft`},Is=[...new Set(Object.values(Fs))],Ls=1024,Rs=class{placer;glows;spawned=new Set;ids=new Map;constructor(e,t){this.placer=e,this.glows=t}sync(e,t,n=1/0){let r=0;for(let i=0;i<e.length&&r<n;i++)!this.spawned.has(i)&&t(e[i])&&(this.spawn(i,e[i]),r++);return r}group(e){return`lm:${Math.floor((e.pos.x+Ls/2)/Ls)},${Math.floor((e.pos.z+Ls/2)/Ls)}`}spawn(e,t){let n=this.placer,r=n.ground,i=ts[t.kind],a=Fs[t.kind];if(!i||!a)return;this.spawned.add(e);let o=[];this.ids.set(e,o);let s=this.group(t);n.masonry.place(s,Math.floor((t.pos.x+Ls/2)/Ls)*Ls,Math.floor((t.pos.z+Ls/2)/Ls)*Ls,Ls*.75);let c=new ua(t.seed,7),l={x:t.pos.x,z:t.pos.z},u=(e,n)=>{let r=X(e,n,t.yaw);return{x:l.x+r.x,z:l.z+r.z}},d=(e,t)=>{let n=u(e,t);return r.h(n.x,n.z)},f=(e=0)=>{let t=i.radius*.55,n=d(0,0);for(let e=0;e<8;e++)n=Math.min(n,d(Math.cos(e*Math.PI/4)*t,Math.sin(e*Math.PI/4)*t));return n-i.sink-e},p=t.region===P.SOUTH,m=(e,t,r,i,s,c={})=>{let l=u(e,t);o.push(n.props.add(a,{x:l.x,y:r,z:l.z,yaw:i,scale:s,roof:p?3:0,...c}))};switch(n.occ.add(l.x,l.z,i.radius,s),t.kind){case`stone_circle`:{let e=c.int(7,12),r=c.range(6,8.5),a=c.f()<.6?c.int(0,e-1):-1,o=c.f()<.35?c.int(0,e-1):-1;for(let n=0;n<e;n++){if(n===o)continue;let s=Math.PI*2*(n+c.range(-.12,.12))/e,l=r*c.range(.94,1.06),u=Math.cos(s)*l,f=Math.sin(s)*l,p=c.range(.62,1),h=t.yaw-s+Math.PI/2+c.range(-.35,.35),g=p*c.range(1.3,1.7),_=p*c.range(.75,1)*.95,v=p*c.range(1.2,1.5);n===a?m(u,f,d(u,f)+.15*p,h,1,{scaleXYZ:[g,_,v],tilt:[84*Math.PI/180,0]}):m(u,f,d(u,f)-i.sink*p,h,1,{scaleXYZ:[g,_,v],tilt:[c.range(-.08,.08),c.range(-.08,.08)]})}c.f()<.4&&m(0,0,d(0,0)+.2,c.angle(),1,{scaleXYZ:[1.6,.75,1.3],tilt:[88*Math.PI/180,0]}),n.decals.add(s,{x:l.x,z:l.z,r:r+3,kind:`grass`,wearR:r,phase:c.angle()});break}case`abbey`:{m(0,0,f(),t.yaw,c.range(.95,1.05)),n.decals.add(s,{x:l.x,z:l.z,r:i.radius*.95,kind:`grass`,phase:c.angle()});let a=new _a;for(let e=0;e<9;e++){let e=c.angle(),t=c.range(5,i.radius*.85),n=u(Math.cos(e)*t,Math.sin(e)*t),o=c.range(.35,.8);js(a,n.x,r.h(n.x,n.z)-o*.25,n.z,o*1.3,o*.7,o,c.angle(),c.int(0,999),[.55,.52,.47],Q.RUBBLE)}n.masonry.set(s,`abbey${e}`,a);break}case`shipwreck`:m(0,0,f(),t.yaw,c.range(.95,1.05),{tilt:[c.range(-5,5)*Math.PI/180,c.range(14,22)*Math.PI/180]});break;case`menhir`:m(0,0,f(),c.angle(),c.range(.95,1.05),{tilt:[c.range(-.07,.07),c.range(-.07,.07)]});break;case`shrine`:m(0,0,f()+.2,t.yaw,c.range(.95,1.05)),n.decals.add(s,{x:l.x,z:l.z,r:2.6,kind:`grass`,lift:.25,phase:c.angle()});break;case`lighthouse`:{let e=c.range(.95,1.05),r=f();m(0,0,r,t.yaw,e);let a=n.assets.get(`poi_lighthouse`);this.glows.add(l.x,r+(a?a.height*.86:16.4)*e,l.z,3.2),n.decals.add(s,{x:l.x,z:l.z,r:i.radius*1.3,kind:`grass`,phase:c.angle()});break}default:m(0,0,f(),t.yaw,c.range(.95,1.05)),i.place===`open`&&n.decals.add(s,{x:l.x,z:l.z,r:i.radius*1.15,kind:`yard`,phase:c.angle()})}}};U(`dust`,`
precision highp float;
attribute vec3 position;
attribute vec4 color;    // corner xy, alpha, size
uniform mat4 viewProjection;
uniform mat4 view;
varying vec2 vCorner;
varying float vAlpha;
void main() {
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  vec3 p = position + (right * color.x + up * color.y) * color.w;
  vCorner = color.xy;
  vAlpha = color.z;
  gl_Position = viewProjection * vec4(p, 1.0);
}
`,`
precision highp float;
varying vec2 vCorner;
varying float vAlpha;
uniform vec3 uTint;
void main() {
  float r = length(vCorner) * 2.0;
  float a = (1.0 - smoothstep(0.2, 1.0, r)) * vAlpha;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uTint * a, 1.0);
}
`);var zs=2.2,Bs=class{lighting;mesh;mat;puffs=[];constructor(t,n){this.lighting=n,this.mat=n.material(`dust`,`dust`,{attributes:[`position`,`color`],uniforms:[`view`,`uTint`],lit:!1,needAlphaBlending:!0}),this.mat.alphaMode=e.ALPHA_ONEONE,this.mat.disableDepthWrite=!0,this.mat.backFaceCulling=!1,this.mat.onBindObservable.add(()=>{let e=this.mat.getEffect();if(!e)return;e.setMatrix(`view`,t.getViewMatrix());let n=this.lighting.sunColor,r=.05;e.setFloat3(`uTint`,.85*(n.r*r+.04),.78*(n.g*r+.04),.62*(n.b*r+.04))}),this.mesh=new v(`dust`,t),this.mesh.material=this.mat,this.mesh.isPickable=!1,this.mesh.alwaysSelectAsActiveMesh=!0,this.mesh.setEnabled(!1)}puff(e,t,n,r,i={}){let a=new ua(r,3),o=[],s=i.radius??10;for(let e=0;e<(i.count??40);e++){let e=a.angle(),t=Math.sqrt(a.f())*s,n=a.range(1.5,4),r=a.range(.4,1.4);o.push({x:Math.cos(e)*t,y:a.range(0,1.5),z:Math.sin(e)*t,vx:Math.cos(e)*n*Math.cos(r)*.6,vy:Math.sin(r)*n,vz:Math.sin(e)*n*Math.cos(r)*.6,s:a.range(1.4,3.2)})}this.puffs.push({x:e,y:t+.5,z:n,t:0,alpha:i.alpha??.16,parts:o})}update(e){if(!this.puffs.length)return;let t=[],n=[],r=[];for(let t of this.puffs)t.t+=e;this.puffs=this.puffs.filter(e=>e.t<zs);for(let e of this.puffs){let i=e.t,a=i/zs,o=e.alpha*(1-a)*Math.min(1,i*6);for(let s of e.parts){let c=(1-Math.exp(-i*1.5))/1.5,l=e.x+s.x+s.vx*c,u=e.y+s.y+s.vy*c-.3*i*i,d=e.z+s.z+s.vz*c,f=s.s*(.6+a*1.2),p=t.length/3;for(let[e,r]of[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]])t.push(l,u,d),n.push(e,r,o,f);r.push(p,p+1,p+2,p,p+2,p+3)}}if(this.mesh.setEnabled(this.puffs.length>0),!this.puffs.length)return;let i=new S;i.positions=t,i.colors=n,i.indices=r,i.applyToMesh(this.mesh,!0)}};U(`glow`,`
precision highp float;
attribute vec3 position;
attribute vec4 color;    // corner xy, radius, unused
uniform mat4 viewProjection;
uniform mat4 view;
uniform vec3 uCamPos;
varying vec2 vCorner;
void main() {
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  float d = length(position - uCamPos);
  float s = color.z * clamp(d * 0.012, 1.0, 5.0);
  vec3 p = position + (right * color.x + up * color.y) * s;
  vCorner = color.xy;
  gl_Position = viewProjection * vec4(p, 1.0);
}
`,`
precision highp float;
varying vec2 vCorner;
uniform float uLamps;
void main() {
  float r2 = dot(vCorner, vCorner) * 4.0;
  float core = exp(-14.0 * r2);
  float halo = 0.35 * exp(-3.0 * r2);
  float a = (core * 2.5 + halo) * uLamps;
  if (a < 0.002) discard;
  gl_FragColor = vec4(mix(vec3(1.0, 0.5, 0.14), vec3(1.0, 0.85, 0.6), core) * a * 2.4, 1.0);
}
`);var Vs=class{scene;mesh;mat;pts=[];dirty=!1;lamps=0;constructor(t,n){this.scene=t,this.mat=n.material(`glow`,`glow`,{attributes:[`position`,`color`],uniforms:[`view`,`uCamPos`,`uLamps`],lit:!1,needAlphaBlending:!0}),this.mat.alphaMode=e.ALPHA_ONEONE,this.mat.disableDepthWrite=!0,this.mat.backFaceCulling=!1,this.mat.onBindObservable.add(()=>{let e=this.mat.getEffect();e&&(e.setMatrix(`view`,t.getViewMatrix()),e.setVector3(`uCamPos`,t.activeCamera.globalPosition),e.setFloat(`uLamps`,this.lamps))}),this.mesh=new v(`glows`,t),this.mesh.material=this.mat,this.mesh.isPickable=!1,this.mesh.setEnabled(!1)}add(e,t,n,r){this.pts.push(e,t,n,r),this.dirty=!0}update(){if(this.mesh.setEnabled(this.lamps>.01&&this.pts.length>0),!this.dirty)return;this.dirty=!1;let e=[],t=[],n=[];for(let r=0;r<this.pts.length;r+=4){let i=e.length/3;for(let[n,i]of[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]])e.push(this.pts[r],this.pts[r+1],this.pts[r+2]),t.push(n,i,this.pts[r+3]*2,0);n.push(i,i+1,i+2,i,i+2,i+3)}let r=new S;r.positions=e,r.colors=t,r.indices=n,r.applyToMesh(this.mesh,!0),this.mesh.refreshBoundingInfo(),this.mesh.alwaysSelectAsActiveMesh=!0,this.scene}},Hs=1.25,Us=13,Ws=.42,Gs=40,Ks=78;function qs(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Js(e,t,n){let r=Math.floor(e/Us),i=Math.floor(t/Us),a=1/0,o=1/0,s=0,c=0;for(let l=-1;l<=1;l++)for(let u=-1;u<=1;u++){let d=r+u,f=i+l,p=z(d,f,n+613),m=(d+(p&1023)/1023*.8+.1)*Us,h=(f+(p>>>10&1023)/1023*.8+.1)*Us,g=Math.hypot(e-m,t-h);g<a?(o=a,a=g,s=d,c=f):g<o&&(o=g)}let l=z(s,c,n+977);return[(o-a)*.5,(l&255)/255,(l>>>8&255)/255,(l>>>16&255)/255]}function Ys(e,t,n,r){let i=new Float32Array(e.length),a=new Float32Array(e.length);for(let a=0;a<n;a++)for(let n=0;n<t;n++){let o=0;for(let i=-r;i<=r;i++)o+=e[a*t+Math.min(t-1,Math.max(0,n+i))];i[a*t+n]=o/(2*r+1)}for(let e=0;e<n;e++)for(let o=0;o<t;o++){let s=0;for(let a=-r;a<=r;a++)s+=i[Math.min(n-1,Math.max(0,e+a))*t+o];a[e*t+o]=s/(2*r+1)}return a}function Xs(e,t,n){let r=e.seed,i=[];for(let t of oe({q:0,r:0},13)){let n=I(t),r=e.baseType(t);Math.hypot(n.x,n.y)<=430&&(r===B.MOUNTAIN||r===B.PEAK)&&i.push({x:n.x,z:n.y})}if(!i.length)return null;let a=1/0,o=1/0,s=-1/0,c=-1/0;for(let e of i)a=Math.min(a,e.x-Ks),o=Math.min(o,e.z-Ks),s=Math.max(s,e.x+Ks),c=Math.max(c,e.z+Ks);let l=Math.ceil((s-a)/Hs)+1,u=Math.ceil((c-o)/Hs)+1,d=new Float32Array(l*u);for(let t=0;t<u;t++)for(let n=0;n<l;n++)d[t*l+n]=e.height(a+n*Hs,o+t*Hs);let f=Ys(d,l,u,3),p=0;for(let e=0;e<d.length;e++)p=Math.max(p,d[e]);let m=Math.max(7,p/3.1),h=new Float32Array(l*u),g=new Float32Array(l*u),_=new Float32Array(l*u),v=new Float32Array(l*u);for(let e=0;e<u;e++)for(let s=0;s<l;s++){let c=e*l+s,p=a+s*Hs,y=o+e*Hs,b=d[c],x=(f[e*l+Math.min(s+1,l-1)]-f[e*l+Math.max(s-1,0)])/(2*Hs),S=(f[Math.min(e+1,u-1)*l+s]-f[Math.max(e-1,0)*l+s])/(2*Hs),C=1/Math.sqrt(1+x*x+S*S),w=1/0;for(let e of i)w=Math.min(w,Math.hypot(p-e.x,y-e.z));let T=(1-qs(Gs,Ks,w))*qs(.13,.32,1-C)*qs(-6,-2.5,b);T>0&&(t.blocked(p,y,5)||n.distance(p,y)<5)&&(T=0);let E=Js(p,y,r),D=m*(.92+.16*E[2]),O=(b+(le(p,y,28,r+61)*2-1)*1.6)/D+.35,k=O-Math.floor(O),A=((k<Ws?1-(1-k/Ws)**2:1)-k)*D,j=(.6+E[2])*(qs(0,3.5,E[0])-.35)*qs(.55,.85,C);h[c]=b+T*(A+j+.3)-(1-T)*1.6,g[c]=T,_[c]=E[1],v[c]=qs(Ws*.7,Ws*1.3,k)}let y=new Float32Array(l*u);for(let e=0;e<y.length;e++)y[e]=h[e]-d[e];let b=Ys(y,l,u,1);for(let e=0;e<y.length;e++)h[e]=d[e]+(y[e]+b[e])*.5;let x=new _a,S=new Int32Array(l*u).fill(-1),C=(e,t)=>h[Math.min(u-1,Math.max(0,t))*l+Math.min(l-1,Math.max(0,e))],w=Ys(h,l,u,1),T=(e,t)=>w[Math.min(u-1,Math.max(0,t))*l+Math.min(l-1,Math.max(0,e))],E=e=>{if(S[e]>=0)return S[e];let t=e%l,n=Math.floor(e/l),r=(T(t+1,n)-T(t-1,n))/(2*Hs),i=(T(t,n+1)-T(t,n-1))/(2*Hs),s=Math.hypot(r,1,i),c=(C(t+1,n)+C(t-1,n)+C(t,n+1)+C(t,n-1)-4*h[e])/(Hs*Hs);return S[e]=x.vertex(a+t*Hs,h[e],o+n*Hs,-r/s,1/s,-i/s,[Math.min(1,Math.max(.4,1-.45*Math.max(c,0))),g[e],_[e],v[e]],0),S[e]};for(let e=0;e<u-1;e++)for(let t=0;t<l-1;t++){let n=e*l+t,r=[n,n+1,n+l,n+l+1];if(!r.some(e=>h[e]>d[e]-.4))continue;let i=E(r[0]),a=E(r[1]),o=E(r[2]),s=E(r[3]);(t+e)%2==0?(x.tri(i,o,a),x.tri(a,o,s)):(x.tri(i,s,a),x.tri(i,o,s))}return x.count?x:null}U(`ridge`,`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;     // layer, height above the foot, unused, unused
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vData;
void main() {
  vec4 wp = world * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normal;
  vData = color.xy;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vData;
${V}
${H}
uniform float uSnow;

void main() {
  vec3 n = normalize(vNormal);
  float layer = vData.x;
  float h = vWorld.y;
  // Long vertical brush strokes in a fixed frame: a frame turning with the normal wound them into contour rings on
  // the domes. They settle to flat paint where a stroke would be thinner than a few pixels.
  vec2 q = vec2(vWorld.x * 0.006 + vWorld.z * 0.002, vWorld.z * 0.004 + h * 0.004);
  float stroke = vnoise(q) * 0.6 + vnoise(q * 2.7 + 5.0) * 0.4;
  stroke = mix(stroke, 0.5, smoothstep(0.2, 0.8, fwidth(q.x) * 6.0));
  vec3 rock = mix(vec3(0.36, 0.39, 0.5), vec3(0.55, 0.57, 0.66), stroke);
  float green = 1.0 - smoothstep(100.0 + stroke * 120.0, 380.0, h);
  vec3 col = mix(rock, vec3(0.32, 0.4, 0.34), green * 0.6 * smoothstep(0.55, 0.85, n.y + stroke * 0.2));
  float line = mix(170.0, 710.0, layer / 2.0) + (stroke - 0.5) * 160.0;
  line = mix(line, 40.0, uSnow);
  float snow = smoothstep(line, line + 60.0, h) * smoothstep(0.35, 0.65, n.y + stroke * 0.3);
  col = mix(col, vec3(0.88, 0.9, 0.95), snow);
  col = pow(col, vec3(2.2));
  // Two or three broad light planes rather than smooth shading.
  float ndl = dot(n, uSunDir);
  float planes = smoothstep(-0.25, 0.25, ndl) * 0.55 + smoothstep(0.35, 0.45, ndl) * 0.45;
  vec3 lit = col * (uSunColor * planes * 0.85 + ambientLight(n) * 1.1);
  vec3 d = vWorld - uCamPos;
  float dist = length(d);
  vec3 v = d / dist;
  float k = mix(0.00006, 0.0001, stroke) + 0.00005 * layer;
  float valley = (1.0 - smoothstep(0.0, 260.0, h)) * 0.25;
  float haze = min(0.62, 1.0 - exp(-dist * k) + valley);
  float sunAmt = pow(max(dot(v, uSunDir), 0.0), 6.0);
  // Distance turns blue: the haze leans to the cool sky so the ranges read as blue-violet silhouettes.
  vec3 cool = uSkyColor * 1.25 + uFogColor * 0.35;
  vec3 hazeCol = mix(mix(uFogColor, cool, 0.55), uSunGlow, sunAmt * 0.6);
  lit = mix(lit * vec3(0.85, 0.9, 1.08), hazeCol, haze);
  gl_FragColor = vec4(lit, min(dist / 8000.0, 1.0));
}
`);function Zs(e,t,n){let r=0,i=.5,a=.0018,o=0;for(let s=0;s<3;s++){let c=e*a,l=t*a,u=Math.floor(c),d=Math.floor(l),f=c-u,p=l-d,m=f*f*f*(f*(f*6-15)+10),h=p*p*p*(p*(p*6-15)+10),g=(e,t)=>(z(u+e,d+t,n+s*31)&65535)/32767.5-1,_=(g(0,0)*(1-m)+g(1,0)*m)*(1-h)+(g(0,1)*(1-m)+g(1,1)*m)*h;r+=_*i,o+=i,i*=.42,a*=2}return r/o}var Qs=[[[-2850,-5170,1120,210],[-650,-5480,1380,290],[1950,-5170,1460,230]],[[-2300,-5880,920,590],[580,-6270,1200,780],[2630,-6020,1360,410]],[[-1680,-6760,1300,930],[1640,-6910,1580,1120]]];function $s(e,t,n,r){let i=(-4700-n*750-t)/1870,a=e+Zs(e+431,t+113,r)*145,o=t+Zs(e-37,t-619,r)*145,s=0;for(let[e,t,r,i]of Qs[n]){let n=(a-e)/r,c=(o-t)/(r*.58);s+=i*Math.exp(-(n*n+c*c)*1.65)}let c=Zs(a*.62,o*.62,r)*.22,l=Math.abs(Zs(a*1.65+319,o*1.65-83,r))*.08,u=Zs(a*3.1,o*3.1,r)*.015;s*=.91+c+l+u;let d=Math.min(1,Math.max(0,i/.16));return(s+48+Zs(a,o,r)*24)*d*d*(3-2*d)}var ec=class{mesh;material;snow=0;constructor(e,t,n){let r=[],i=[],a=[],o=[];for(let e=0;e<3;e++){let t=r.length/3,s=-4700-e*750,c=new Float32Array(37825);for(let t=0;t<=88;t++)for(let r=0;r<=424;r++)c[t*425+r]=$s(-5300+r*25,s-t*21.25,e,n+731)*.7;let l=(e,t)=>c[Math.min(88,Math.max(0,e))*425+Math.min(424,Math.max(0,t))];for(let t=0;t<=88;t++)for(let n=0;n<=424;n++){let o=-5300+n*25,c=s-t*21.25,u=l(t,n),d=(l(t,n+2)-l(t,n-2))/100,f=(l(t-2,n)-l(t+2,n))/85,p=Math.hypot(d,1,f);r.push(o,u,c),i.push(-d/p,1/p,-f/p),a.push(e,u,0,0)}for(let e=0;e<88;e++)for(let n=0;n<424;n++){let r=t+e*425+n,i=r+424+1;o.push(r,r+1,i,r+1,i+1,i)}}this.material=t.material(`ridge`,`ridge`,{attributes:[`position`,`normal`,`color`],uniforms:[`uSnow`]}),this.material.backFaceCulling=!1,this.material.onBindObservable.add(()=>this.material.getEffect()?.setFloat(`uSnow`,this.snow)),this.mesh=new v(`ridges`,e);let s=new S;s.positions=r,s.normals=i,s.colors=a,s.indices=o,s.applyToMesh(this.mesh,!1),this.mesh.material=this.material,this.mesh.isPickable=!1,this.mesh.freezeWorldMatrix()}},tc=[...new Set([...Object.values(Ua).map(e=>e.model),`life_windmill_sails`,...Is])],nc=class{ctx;options;ground;occ=new sa;lanes;decals;masonry;placer;dust;glows;works;realm;natives;landmarks;ridges=null;rocks=[];home=null;ready;explored=()=>!0;pending=[];loaded=!1;exploreDirty=!0;landmarkScan=!0;changed=[];built=[];lastVersion=-1;get world(){return this.ctx.world}constructor(e,t={windmills:!0}){this.ctx=e,this.options=t;let{scene:n,renderer:r,world:i,props:a}=e,o=r.lighting;this.ground=new ia(i),this.lanes=new ca(i.home.roads),this.decals=new na(n,o,this.ground),this.masonry=new va(n,o,r.shadows),this.placer=new Ka(i,this.ground,this.occ,this.lanes,a,this.decals,this.masonry),this.dust=new Bs(n,o),this.glows=new Vs(n,o),this.works=new go(this.placer,this.dust),this.realm=new yo(this.placer,this.dust,this.works,i.seed),this.natives=new To(this.placer,i.seed),this.landmarks=new Rs(this.placer,this.glows),this.realm.onClaim=e=>this.natives.retire(e),this.ready=this.placer.load(tc).then(()=>this.build()),e.onUpdate(e=>this.update(e))}buildMs=0;build(){let e=performance.now(),{scene:t,renderer:n,world:r}=this.ctx,i=n.lighting;this.home=new Ba(this.placer,r.seed,this.options.windmills),this.home.build(),this.home.settlements.forEach(e=>{this.realm.registerHome(e.centre,e.index+1,this.home.owner(e.index),()=>e.placed.flatMap(e=>e.ids),e.index===2?this.home.curtain:void 0)});let a=()=>this.masonry.snow;this.rocks.push(As(t,i,n.shadows,`home`,Ns(r,this.occ,this.lanes),{dark:[.36,.36,.34],light:[.64,.63,.59],turf:1,snow:a}).mesh);let o=Xs(r,this.occ,this.lanes);o&&this.rocks.push(As(t,i,n.shadows,`crag`,o,{dark:[.38,.38,.35],light:[.62,.61,.57],turf:1,snow:a}).mesh),this.loaded=!0,this.buildMs=performance.now()-e;for(let e of this.pending)this.realm.set(e.spec,e.animate);this.pending=[],setTimeout(()=>{this.ridges=new ec(t,i,r.seed)},600)}setSettlement(e,t={}){let n=t.animate??!0;this.loaded?this.realm.set(e,n):(this.pending=this.pending.filter(t=>t.spec.key!==e.key),this.pending.push({spec:e,animate:n}))}setReducedMotion(e){this.realm.reduced=e}onBuild(e){let t=this.realm.onBuild;this.realm.onBuild=n=>{t(n),e(n)}}whenBuilt(e){this.built.push(e)}removeSettlement(e){this.pending=this.pending.filter(t=>t.spec.key!==e),this.loaded&&this.realm.remove(e)}addRoads(e){for(let t of e)this.lanes.add(t.a,t.b)}blocked(e,t){return this.occ.blocked(e.x,e.z??e.y??0,t)}blockedAt=(e,t,n)=>this.occ.blocked(e,t,n);footprints(){return this.occ.circles()}onChanged(e){this.changed.push(e)}setExplored(e){this.explored=e,this.exploreDirty=!0}revealed(){this.exploreDirty=!0}buildings(){return[...(this.home?.settlements??[]).flatMap(e=>e.placed),...this.realm.buildings(),...this.natives.buildings()]}litBuildings(){return[...(this.home?.settlements??[]).filter(e=>!this.realm.ruined(da(e.centre.x,e.centre.z))).flatMap(e=>e.placed),...this.realm.buildings(!0).filter(e=>!this.works.building(e)),...this.natives.buildings()]}windmillSites(){return(this.home?.settlements??[]).flatMap(e=>e.mills.map(e=>({x:e.x,y:e.y,z:e.z,yaw:e.yaw})))}stats(){return{props:this.ctx.props.stats(),masonry:this.masonry.stats(),settlements:this.realm.list().length,buildMs:Math.round(this.buildMs)}}update(e){let t=this.ctx.scene.activeCamera;if(!t)return;let r=t.globalPosition,i=t.getDirection(new n(0,0,-1)),a=i.y<-.05?Math.min(-r.y/i.y,4e3):600,o=r.x+i.x*a,s=r.z+i.z*a,c=Math.max(1800,r.y*4.5),l=this.ctx.terrain.uniforms.snow;if(this.ctx.props.snow=l,this.masonry.snow=l,this.decals.snow=l,this.ridges&&(this.ridges.snow=l),this.glows.lamps=this.ctx.renderer.atmosphere.lamps,this.loaded){let t=this.ctx.world;if(this.exploreDirty&&(this.exploreDirty=!1,this.landmarkScan=!0,this.natives.sync(t.villages,e=>this.explored(e.hex),e=>this.realm.claimed(e))),this.landmarkScan&&this.landmarks.sync(t.landmarks,e=>this.explored(R({x:e.pos.x,y:e.pos.z})),24)<24&&(this.landmarkScan=!1),this.realm.update(e),this.works.update(e))for(let e of this.built)e()}if(this.masonry.update(o,s,c),this.decals.update(o,s,c),this.dust.update(e),this.glows.update(),this.occ.version!==this.lastVersion){this.lastVersion=this.occ.version;for(let e of this.changed)e()}}},rc=`cottage.timber.barn.chapel.keep.tower.gatehouse.wall.well.haystack.cart.pier.rowboat.poi_stall.life_windmill_tower.poi_south_cottage.poi_croft.poi_villa.poi_abbey.poi_lighthouse.poi_menhir.poi_cairn.poi_shrine.poi_hermit.poi_cabin.poi_fishhut.poi_wreck.poi_bridge.watchtower.crane`.split(`.`);function ic(e,t){rc.forEach((n,r)=>{let i=Math.floor(r/14),a=-90+r%14*18,o=10+i*50,s=e.world.height(a,o);e.props.add(n,{x:a,y:s,z:o,yaw:0,scale:1,roof:t?3:0}),n===`life_windmill_tower`&&e.props.add(`life_windmill_sails`,{x:a,y:s,z:o,yaw:0,scale:1})})}function ac(e){let t=[{key:`coldport`,house:1,pos:{x:658.2,y:-1300},tier:3,fort:1},{key:`oakmoor`,house:2,pos:{x:121.2,y:1490},tier:2,fort:1},{key:`marella`,house:3,pos:{x:1923,y:2650},tier:3,fort:0},{key:`selford`,house:0,pos:{x:-450,y:2300},tier:2,fort:0,burned:!0}],n=e.world;for(let r of t){let t=n.villages.reduce((e,t)=>Math.hypot(t.pos.x-r.pos.x,t.pos.y-r.pos.y)<Math.hypot(e.pos.x-r.pos.x,e.pos.y-r.pos.y)?t:e);e.setSettlement({...r,pos:t.pos,region:t.region},{animate:!1})}let r=n.home.settlements[0];e.setSettlement({key:`hamlet`,house:0,pos:r,tier:2,fort:1})}function oc(e){let t=new URLSearchParams(location.search);if(t.get(`built`)===`kit`)return ic(e,t.get(`south`)===`1`),null;if(t.get(`built`)===`none`)return null;let n=new nc(e);return t.get(`built`)===`realm`&&n.ready.then(()=>ac(n)),queueMicrotask(()=>{let e=window.hc;e&&(e.built=n)}),n}var $=Math.PI*2,sc=class{s;constructor(e){this.s=e>>>0||2654435769}next(){let e=this.s=this.s+1831565813>>>0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.next()}int(e,t){return e+Math.floor(this.next()*(t-e+1))}normal(){let e=Math.max(1e-9,this.next()),t=this.next();return Math.sqrt(-2*Math.log(e))*Math.cos($*t)}};function cc(...e){let t=2166136261;for(let n of e)t=Math.imul(t^(Math.round(n)|0),16777619),t^=t>>>13;return t>>>0}function lc(e,t){let n=(t-e)%$;return n>Math.PI&&(n-=$),n<-Math.PI&&(n+=$),n}function uc(e,t,n){return Math.abs(t-e)<=n?t:e+Math.sign(t-e)*n}function dc(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}var fc=class{world;cells=new Map;blocked=()=>!1;constructor(e){this.world=e}height(e,t){return this.world.height(e,t)}isWater(e,t){return L(this.world.baseType(R({x:e,y:t})))}cell(e,t){let n=Math.round(e),r=Math.round(t),i=(n+32768)*65536+(r+32768),a=this.cells.get(i);return a||(a=new Float32Array([this.world.height(n,r),this.world.normalAt(n,r).y,+!!this.isWater(n,r)]),this.cells.set(i,a)),a}walkable(e,t,n=.8,r=.6){let i=this.cell(e,t);return i[2]===0&&i[0]>=r&&i[1]>=n}invalidate(){this.cells.clear()}},pc=(()=>{let e=Math.hypot(1,.35);return[1/e,.35/e]})(),mc=(()=>{let e=Math.hypot(.553,.833);return[.553/e,.833/e]})(),hc=$/55,gc=$/(55*.47);function _c(e,t,n,r,i){let a=(pc[0]*e+pc[1]*t)*hc-n*1.4*hc,o=(mc[0]*e+mc[1]*t)*gc-n*1.4*.8*gc,s=1-dc(600,1400,Math.hypot(e-r,t-i));return .24*(Math.sin(a)+.6*Math.sin(o))*s}var vc=`
float lifeSwell(vec2 p, float t, vec3 cam) {
  vec2 d1 = normalize(vec2(1.0, 0.35));
  vec2 d2 = normalize(vec2(0.553, 0.833));
  float k1 = 6.2831853 / 55.0;
  float k2 = 6.2831853 / (55.0 * 0.47);
  float a1 = dot(d1, p) * k1 - t * 1.4 * k1;
  float a2 = dot(d2, p) * k2 - t * 1.4 * 0.8 * k2;
  float fade = 1.0 - smoothstep(600.0, 1400.0, length(p - cam.xz));
  return 0.24 * (sin(a1) + 0.6 * sin(a2)) * fade;
}
`;function yc(t,n,r){if(n.disableDepthWrite=!0,r===`add`){n.alphaMode=e.ALPHA_ADD;return}n.alphaMode=e.ALPHA_COMBINE;let i=t.getScene().getEngine();n.onBindObservable.add(()=>{i.alphaState.setAlphaBlendFunctionParameters(e.GL_ALPHA_FUNCTION_SRC_ALPHA,e.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA,0,1)}),t.onAfterRenderObservable.add(()=>{i.alphaState.setAlphaMode(e.ALPHA_COMBINE,0)})}var bc=class{mesh;capacity=0;matrices=new Float32Array;attrs;count=0;min=new n;max=new n;pad;constructor(e,t,n,r,i=[],a=2){this.mesh=new v(t,e),n.applyToMesh(this.mesh),this.mesh.material=r,this.mesh.isPickable=!1,this.mesh.doNotSyncBoundingInfo=!0,this.attrs=i.map(e=>({def:e,data:new Float32Array})),this.pad=a,this.grow(16),this.mesh.thinInstanceCount=0,this.mesh.setEnabled(!1)}grow(e){let t=Math.max(e,this.capacity*2,16),n=new Float32Array(t*16);n.set(this.matrices.subarray(0,this.count*16)),this.matrices=n;for(let e of this.attrs){let n=new Float32Array(t*e.def.stride);n.set(e.data.subarray(0,this.count*e.def.stride)),e.data=n}this.capacity=t,this.mesh.thinInstanceSetBuffer(`matrix`,this.matrices,16,!1);for(let e of this.attrs)this.mesh.thinInstanceSetBuffer(e.def.name,e.data,e.def.stride,!1)}begin(){this.count=0,this.min.setAll(1/0),this.max.setAll(-1/0)}push(e,t,n,r,i,a,o,s,c,l,u,d,...f){this.count>=this.capacity&&this.grow(this.count+1);let p=this.matrices,m=this.count*16;p[m]=e,p[m+1]=t,p[m+2]=n,p[m+3]=0,p[m+4]=r,p[m+5]=i,p[m+6]=a,p[m+7]=0,p[m+8]=o,p[m+9]=s,p[m+10]=c,p[m+11]=0,p[m+12]=l,p[m+13]=u,p[m+14]=d,p[m+15]=1;let h=0;for(let e of this.attrs){let t=e.def.stride,n=this.count*t;for(let r=0;r<t;r++)e.data[n+r]=f[h++]??0}l<this.min.x&&(this.min.x=l),u<this.min.y&&(this.min.y=u),d<this.min.z&&(this.min.z=d),l>this.max.x&&(this.max.x=l),u>this.max.y&&(this.max.y=u),d>this.max.z&&(this.max.z=d),this.count++}pushYaw(e,t,n,r,i,...a){let o=Math.cos(r)*i,s=Math.sin(r)*i;this.push(o,0,-s,0,i,0,s,0,o,e,t,n,...a)}commit(){let e=this.mesh;e.thinInstanceCount=this.count,e.thinInstanceBufferUpdated(`matrix`);for(let t of this.attrs)e.thinInstanceBufferUpdated(t.def.name);if(this.count===0){e.setEnabled(!1);return}let t=this.pad;e.setBoundingInfo(new y(new n(this.min.x-t,this.min.y-t,this.min.z-t),new n(this.max.x+t,this.max.y+t,this.max.z+t))),e.setEnabled(!0)}};function xc(e,t,n,r={}){let i=new S;return i.positions=Array.from(e),t&&(i.normals=Array.from(t)),i.indices=Array.from(n),r.uvs&&(i.uvs=Array.from(r.uvs)),r.colors&&(i.colors=Array.from(r.colors)),r.uvs2&&(i.uvs2=Array.from(r.uvs2)),i}var Sc=`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 aPose;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uCamPos;
uniform float uLegTop;
uniform vec2 uLegSplit;
uniform float uStride;
uniform vec2 uNeck;
uniform vec2 uNeckDir;
uniform vec2 uNeckRamp;
uniform float uHeadDrop;
uniform float uHeadReach;
uniform float uBoost;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying float vHeight;
varying vec2 vRegion;
void main() {
#include<instancesVertex>
  float ph0 = aPose.x;
  float gait = aPose.y;
  float graze = aPose.z;
  float nibble = aPose.w;
  vec3 v = position;
  vec3 n = normal;
  // Legs below leg_top swing in diagonal pairs, more at the hoof.
  float lw = clamp((uLegTop - v.y) / uLegTop, 0.0, 1.0);
  float side = v.x > uLegSplit.x ? 1.0 : -1.0;
  float front = v.z > uLegSplit.y ? 1.0 : -1.0;
  float ph = ph0 + (side * front > 0.0 ? 0.0 : 3.1415927);
  v.z += sin(ph) * lw * uStride * gait;
  v.y += max(0.0, cos(ph)) * lw * uStride * 0.3 * gait;
  // Head and neck bend forward and down about the neck base, the weight ramping along the neck.
  vec2 d = vec2(v.y - uNeck.x, v.z - uNeck.y);
  float hw = smoothstep(uNeckRamp.x, uNeckRamp.y, dot(d, normalize(uNeckDir)));
  float a = (graze * uHeadDrop + nibble * 0.09 * sin(uTime * 6.5 + ph0 * 3.0)) * hw;
  float c = cos(a);
  float s = sin(a);
  v.y = uNeck.x + d.x * c - d.y * s - graze * uHeadReach * hw;
  v.z = uNeck.y + d.x * s + d.y * c;
  n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
  // Readable from the board: animals grow a little with distance, as the canon draws them.
  float dist = length(finalWorld[3].xyz - uCamPos);
  v *= 1.0 + uBoost * smoothstep(70.0, 420.0, dist);
  vec4 wp = finalWorld * vec4(v, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(finalWorld) * n);
  vUv = uv;
  vHeight = v.y;
  // Legs and the head beyond the neck, for wool that stops at the hocks and the face.
  vRegion = vec2(lw, smoothstep(uNeckRamp.y, uNeckRamp.y + 0.12, dot(vec2(position.y - uNeck.x, position.z - uNeck.y), normalize(uNeckDir))));
  gl_Position = viewProjection * wp;
}
`;U(`lifeAnimal`,Sc,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying float vHeight;
varying vec2 vRegion;
${V}
${H}
uniform sampler2D uAlbedo;
uniform vec3 uTint;
uniform float uFuzz;
uniform float uWool;

void main() {
  vec3 n = normalize(vNormal);
  vec3 detail = texture2D(uAlbedo, vUv).rgb;
  vec3 planes = textureLod(uAlbedo, vUv, 2.5).rgb;
  vec3 base = pow(mix(planes, detail, 0.55), vec3(2.2)) * uTint;
  if (uWool > 0.5) {
    // The Meshy fleece is tan; the canon's sheep are cream-white with darker faces and legs.
    float lum = dot(detail, vec3(0.3, 0.59, 0.11));
    vec3 wool = vec3(0.80, 0.77, 0.70) * (0.82 + 0.45 * (lum - 0.55));
    vec3 skin = vec3(0.16, 0.13, 0.11);
    float bare = max(smoothstep(0.35, 0.75, vRegion.x), vRegion.y);
    base = mix(wool, skin, bare * 0.85);
    base = mix(base, skin * 0.6, smoothstep(0.22, 0.1, lum) * 0.8);
  }
  float sh;
  // Wool scatters light round the terminator; hides read as solid.
  vec3 col = shade(base, n, vWorld, mix(0.7, 1.0, smoothstep(0.0, 0.5, vHeight)), 0.25 + 0.45 * uFuzz, sh);
  vec3 v = normalize(uCamPos - vWorld);
  float rim = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0);
  col += base * uSunColor * sh * rim * (0.2 + 0.8 * toward) * (0.25 + 0.75 * uFuzz);
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`lifeAnimalDepth`,Sc,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var Cc={sheep:{models:[{name:`sheep`,legTop:.27,legSplit:[0,-.06],stride:.1,neck:[.62,.3],neckDir:[.5,.85],neckRamp:[.05,.25],headDrop:1.1,headReach:.12,weight:1,tint:[1,1,1]}],walk:.5,flee:3.2,step:.55,space:1.15,home:22,graze:[4,14],hop:[1.2,4.5],scale:[.9,1.1],young:.18,slope:.8,fuzz:1,boost:.9,wool:1},deer:{models:[{name:`life_deer_stag`,legTop:.66,legSplit:[-.15,-.3],stride:.2,neck:[1.15,.42],neckDir:[.86,.51],neckRamp:[.05,.35],headDrop:1.5,headReach:.35,weight:.12,tint:[1,1,1]},{name:`life_deer_doe`,legTop:.66,legSplit:[.09,-.2],stride:.18,neck:[1.12,.36],neckDir:[.89,.45],neckRamp:[.05,.3],headDrop:1.55,headReach:.35,weight:.75,tint:[1,1,1]}],walk:.9,flee:8,step:1,space:1.8,home:36,graze:[3,10],hop:[2,7],scale:[.94,1.06],young:0,slope:.72,fuzz:.2,boost:.6,wool:0}},wc=0,Tc=1,Ec=2,Dc=4,Oc=class{kind;ground;animals=[];homeX;homeZ;anchorX;anchorZ;anchorTimer;rng;frame=0;cfg;active=!1;avoid=[];constructor(e,t,n,r,i,a,o=[]){this.kind=e,this.ground=a,this.cfg=Cc[e],this.avoid=o,this.rng=new sc(cc(t,n,i,+(e===`deer`))),[this.homeX,this.homeZ]=this.nearestGrazeable(t,n),this.anchorX=this.homeX,this.anchorZ=this.homeZ,this.anchorTimer=this.rng.range(15,30);let s=this.cfg;for(let e=0;e<r;e++){let t=this.rng.range(s.scale[0],s.scale[1]);this.rng.next()<s.young&&(t*=.62);let[n,r]=this.spawnPoint();this.animals.push({x:n,z:r,yaw:this.rng.next()*$,speed:0,tx:n,tz:r,state:wc,timer:this.rng.range(0,s.graze[1]),phase:this.rng.next()*$,graze:+(this.rng.next()<.7),ux:0,uy:1,uz:0,size:t,fdx:0,fdz:0,model:this.pickModel(e),gx:1/0,gz:1/0,gy:0,nx:0,ny:1,nz:0})}}get centreX(){let e=0;for(let t of this.animals)e+=t.x;return e/Math.max(1,this.animals.length)}get centreZ(){let e=0;for(let t of this.animals)e+=t.z;return e/Math.max(1,this.animals.length)}pickModel(e){let t=this.cfg.models;if(t.length===1||e===0)return 0;let n=t.reduce((e,t)=>e+t.weight,0),r=this.rng.next()*n;for(let e=0;e<t.length;e++)if(r-=t[e].weight,r<=0)return e;return t.length-1}grazeable(e,t){if(!this.ground.walkable(e,t,this.cfg.slope))return!1;for(let n of this.avoid)if((e-n.x)**2+(t-n.z)**2<n.r*n.r)return!1;return!this.ground.blocked(e,t,this.kind===`deer`?16:1.2)}rehome(){if(!this.grazeable(this.homeX,this.homeZ)){[this.homeX,this.homeZ]=this.nearestGrazeable(this.homeX,this.homeZ),this.anchorX=this.homeX,this.anchorZ=this.homeZ;for(let e of this.animals)this.grazeable(e.x,e.z)||([e.x,e.z]=this.spawnPoint(),e.state=wc)}}nearestGrazeable(e,t){if(this.grazeable(e,t))return[e,t];for(let n=4;n<84;n+=4)for(let r=0;r<16;r++){let i=$*r/16,a=e+Math.cos(i)*n,o=t+Math.sin(i)*n;if(this.grazeable(a,o))return[a,o]}return[e,t]}spawnPoint(){for(let e=0;e<40;e++){let e=this.homeX+this.rng.normal()*this.cfg.space*2.2,t=this.homeZ+this.rng.normal()*this.cfg.space*2.2;if(this.grazeable(e,t))return[e,t]}return[this.homeX,this.homeZ]}startle(e,t,n=70){let r=!1;for(let i of this.animals){let a=i.x-e,o=i.z-t,s=Math.hypot(a,o);if(s>n)continue;i.state=Ec;let c=(s>.01?Math.atan2(o,a):this.rng.next()*$)+this.rng.range(-.35,.35);i.fdx=Math.cos(c),i.fdz=Math.sin(c),i.timer=this.rng.range(2.5,4)*(this.kind===`deer`?1:.7),r=!0}if(r){let n=this.centreX,r=this.centreZ,i=n-e,a=r-t,o=Math.hypot(i,a)||1,s=n+i/o*this.cfg.flee*4,c=r+a/o*this.cfg.flee*4;this.ground.walkable(s,c,this.cfg.slope)&&(this.anchorX=this.homeX=s,this.anchorZ=this.homeZ=c)}}tick(e){let t=this.cfg;if(this.anchorTimer-=e,this.anchorTimer<=0){this.anchorTimer=this.rng.range(20,45);for(let e=0;e<8;e++){let e=this.rng.next()*$,n=this.rng.range(0,t.home),r=this.homeX+Math.cos(e)*n,i=this.homeZ+Math.sin(e)*n;if(this.grazeable(r,i)){this.anchorX=r,this.anchorZ=i;break}}}let n=this.centreX,r=this.centreZ;this.frame++;for(let t=0;t<this.animals.length;t++){let i=this.animals[t];i.state===wc?(t+this.frame)%Dc===0&&this.think(i,n,r,e*Dc):this.think(i,n,r,e)}this.separate(e)}think(e,t,n,r){let i=this.cfg,a=0,o=Math.sin(e.yaw),s=Math.cos(e.yaw);if(e.state===wc)e.timer-=r,e.graze=uc(e.graze,1,r*1.2),e.timer<=0&&([e.tx,e.tz]=this.nextTarget(e,t,n),e.state=Tc,e.timer=12);else if(e.state===Tc){e.graze=uc(e.graze,0,r*1.6);let t=e.tx-e.x,n=e.tz-e.z,c=Math.hypot(t,n);e.timer-=r,c<.35||e.timer<=0?(e.state=wc,e.timer=this.rng.range(i.graze[0],i.graze[1])):(o=t/c,s=n/c,a=i.walk*Math.min(1,Math.max(.35,c/.8)))}else{if(e.graze=uc(e.graze,0,r*4),e.timer-=r,o=e.fdx,s=e.fdz,a=i.flee*Math.min(1,Math.max(.3,e.timer)),!this.ground.walkable(e.x+e.fdx*3,e.z+e.fdz*3,i.slope-.1))for(let t of[.6,-.6,1.2,-1.2,2,-2]){let n=Math.cos(t),r=Math.sin(t),a=e.fdx*n-e.fdz*r,o=e.fdx*r+e.fdz*n;if(this.ground.walkable(e.x+a*3,e.z+o*3,i.slope-.1)){e.fdx=a,e.fdz=o;break}}if(e.timer<=0){e.state=Tc;let t=this.rng.range(2,5);e.tx=e.x+e.fdx*t,e.tz=e.z+e.fdz*t,e.timer=6}}let c=Math.atan2(o,s),l=e.state===Ec?4:2.2;a>.01&&(e.yaw+=Math.max(-l*r,Math.min(l*r,lc(e.yaw,c))));let u=Math.max(0,Math.cos(lc(e.yaw,c)));if(e.speed=uc(e.speed,a*u,r*(e.state===Ec?6:1.2)),e.speed>.001){let t=Math.sin(e.yaw)*e.speed*r,n=Math.cos(e.yaw)*e.speed*r,a=e.x+t,o=e.z+n;if(this.ground.walkable(a,o,i.slope-(e.state===Ec?.1:0))){e.x=a,e.z=o;let r=i.step*e.size*(e.state===Ec?2.4:1);e.phase+=Math.hypot(t,n)/r*Math.PI}else e.speed=0,e.state===Tc&&(e.state=wc,e.timer=this.rng.range(1,3))}}nextTarget(e,t,n){let r=this.cfg,i=r.space*Math.sqrt(this.animals.length)*1.1;for(let a=0;a<10;a++){let a=this.rng.next()*$,o=Math.cos(a),s=Math.sin(a),c=t-e.x,l=n-e.z,u=Math.hypot(c,l);if(u>i){o=o*.6+c/u,s=s*.6+l/u;let e=Math.hypot(o,s);o/=e,s/=e}let d=this.anchorX-e.x,f=this.anchorZ-e.z,p=Math.hypot(d,f);if(p>4){o+=d/p*.55,s+=f/p*.55;let e=Math.hypot(o,s);o/=e,s/=e}let m=this.rng.range(r.hop[0],r.hop[1]),h=e.x+o*m,g=e.z+s*m;if(this.grazeable(h,g)&&this.free(h,g,e))return[h,g]}return[e.x,e.z]}free(e,t,n){let r=this.cfg.space*this.cfg.space;for(let i of this.animals)if(i!==n&&(i.x-e)**2+(i.z-t)**2<r)return!1;return!0}separate(e){let t=this.cfg.space,n=this.cfg.slope-.1,r=this.animals;for(let i=0;i<r.length;i++){let a=r[i],o=a.state===wc;for(let s=i+1;s<r.length;s++){let c=r[s];if(o&&c.state===wc)continue;let l=a.x-c.x,u=a.z-c.z,d=t*.5*(a.size+c.size),f=Math.hypot(l,u);if(f>=d)continue;let p=(d-f)*Math.min(.5,Math.max(0,e*3)),m=f>.001?l/f*p:Math.cos(i)*p,h=f>.001?u/f*p:Math.sin(i)*p;this.ground.walkable(a.x+m,a.z+h,n)&&(a.x+=m,a.z+=h),this.ground.walkable(c.x-m,c.z-h,n)&&(c.x-=m,c.z-=h)}}}draw(e,t,n,r,i){let a=this.cfg,o=t>0?1-Math.exp(-t*4):1;for(let t of this.animals){if((t.x-t.gx)**2+(t.z-t.gz)**2>.0016){t.gx=t.x,t.gz=t.z,t.gy=this.ground.height(t.x,t.z);let e=this.ground.world.normalAt(t.x,t.z);t.nx=e.x,t.ny=e.y,t.nz=e.z}let s=t.nx*.75,c=.25+t.ny*.75,l=t.nz*.75,u=t.ux+(s-t.ux)*o,d=t.uy+(c-t.uy)*o,f=t.uz+(l-t.uz)*o,p=Math.hypot(u,d,f);u/=p,d/=p,f/=p,t.ux=u,t.uy=d,t.uz=f;let m=Math.sin(t.yaw),h=0,g=Math.cos(t.yaw),_=m*u+g*f;m-=u*_,h-=d*_,g-=f*_;let v=Math.hypot(m,h,g);m/=v,h/=v,g/=v;let y=d*g-f*h,b=f*m-u*g,x=u*h-d*m,S=Math.min(1,Math.max(0,t.speed/(a.walk*.6)));t.state===Ec&&(S=Math.min(2,Math.max(1,t.speed/a.walk)));let C=Math.abs(Math.sin(t.phase))*.025*S*t.size,w=t.graze,T=w*w*(3-2*w),E=+(t.state===wc&&t.graze>.8),D=t.size,O=t.x,k=t.gy-.03+C,A=t.z;((O-n)**2+(k-r)**2+(A-i)**2<1024?e[t.model].near:e[t.model].far).push(y*D,b*D,x*D,u*D,d*D,f*D,m*D,h*D,g*D,O,k,A,t.phase,S,T,E)}}},kc=class{scene;lighting;shadows;ground;herds=[];species=new Map;ready=new Map;constructor(e,t,n,r){this.scene=e,this.lighting=t,this.shadows=n,this.ground=r,k.ready;for(let e of Object.keys(Cc))this.load(e)}async load(e){await k.ready;let t=Cc[e];for(let e of t.models){let n=await gr(this.scene,e.name),r=this.material(e,t,n,!1),i=this.material(e,t,n,!0),a=new bc(this.scene,`life_${e.name}_near`,n.vertexData,r,[{name:`aPose`,stride:4}]),o=new bc(this.scene,`life_${e.name}_far`,Ac(n.vertexData,.12),r,[{name:`aPose`,stride:4}]);a.mesh.alwaysSelectAsActiveMesh=!0,o.mesh.alwaysSelectAsActiveMesh=!0,this.shadows.addCaster(a.mesh,i,0),this.shadows.addCaster(o.mesh,i,0),this.species.set(e.name,{near:a,far:o})}this.ready.set(e,!0)}material(e,t,n,r){let i=this.lighting.material(`life_${e.name}${r?`Depth`:``}`,r?`lifeAnimalDepth`:`lifeAnimal`,{attributes:[`position`,`normal`,`uv`,`aPose`],uniforms:[`uLegTop`,`uLegSplit`,`uStride`,`uNeck`,`uNeckDir`,`uNeckRamp`,`uHeadDrop`,`uHeadReach`,`uBoost`,`uTint`,`uFuzz`,`uWool`,...r?[`uTime`,`uCamPos`]:[]],samplers:r?[]:[`uAlbedo`],lit:!r}),a=this.lighting;return i.onBindObservable.add(()=>{let o=i.getEffect();o&&(o.setFloat(`uLegTop`,e.legTop),o.setFloat2(`uLegSplit`,e.legSplit[0],e.legSplit[1]),o.setFloat(`uStride`,e.stride),o.setFloat2(`uNeck`,e.neck[0],e.neck[1]),o.setFloat2(`uNeckDir`,e.neckDir[0],e.neckDir[1]),o.setFloat2(`uNeckRamp`,e.neckRamp[0],e.neckRamp[1]),o.setFloat(`uHeadDrop`,e.headDrop),o.setFloat(`uHeadReach`,e.headReach),o.setFloat(`uBoost`,t.boost),r?(o.setFloat(`uTime`,a.time),o.setVector3(`uCamPos`,a.camPos)):(n.albedo&&o.setTexture(`uAlbedo`,n.albedo),o.setFloat3(`uTint`,e.tint[0],e.tint[1],e.tint[2]),o.setFloat(`uFuzz`,t.fuzz),o.setFloat(`uWool`,t.wool)))}),i}add(e,t,n,r,i,a=[]){let o=new Oc(e,t,n,r,i,this.ground,a);return this.herds.push(o),o}remove(e){let t=this.herds.indexOf(e);t>=0&&this.herds.splice(t,1)}clear(){this.herds.length=0}update(e,t,n,r,i,a,o){let s=[...this.species.values()];for(let e of s)e.near.begin(),e.far.begin();let c=0;for(let s of this.herds){if(!this.ready.get(s.kind)||(s.active=Math.hypot(s.homeX-t,s.homeZ-n)<r+(s.active?40:0),!s.active))continue;s.tick(e);let l=s.cfg.models.map(e=>this.species.get(e.name));s.draw(l,e,i,a,o),c+=s.animals.length}for(let e of s)e.near.commit(),e.far.commit();return c}};function Ac(e,t){let n=new Float32Array(e.positions),r=new Uint32Array(e.indices),i=Math.max(3,Math.floor(r.length*t/3)*3),[a]=k.simplify(r,n,3,i,.04);a.length>i*1.5&&([a]=k.simplifySloppy(r,n,3,null,i,.06));let o=new S;o.positions=e.positions,o.normals=e.normals,o.uvs=e.uvs;for(let t of[`matricesIndices`,`matricesWeights`,`colors`,`uvs2`])e[t]&&(o[t]=e[t]);return o.indices=Array.from(a),o}U(`lifeBird`,`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec4 aFlap;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
uniform float uBodyHalf;
uniform float uWrist;
uniform float uDihedral;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
#include<instancesVertex>
  vec3 v = position;
  float ax = abs(v.x);
  float w1 = max(ax - uBodyHalf, 0.0);
  float w2 = max(ax - uWrist, 0.0);
  float lift = sin(aFlap.x) * w1 * 1.15 + sin(aFlap.x - 0.8) * w2 * 0.9;
  v.y += lift * aFlap.y + uDihedral * w1 * (1.0 - aFlap.y * 0.5);
  v.z -= aFlap.z * w1 * 0.7;
  v.x *= 1.0 - aFlap.z * 0.3 * step(uBodyHalf, ax);
  // Specks at the board would vanish; birds grow with distance so flocks still read, but not so far that a dark bird at
  // the horizon reads as a black blot in the sky.
  float dist = length(finalWorld[3].xyz - uCamPos);
  v *= 1.0 + 1.4 * smoothstep(40.0, 400.0, dist);
  vec4 wp = finalWorld * vec4(v, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(finalWorld) * normal);
  vColor = color;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
${V}
${H}
uniform vec3 uUnder;
uniform float uBrighten;
void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 c = gl_FrontFacing ? vColor.rgb : mix(vColor.rgb, uUnder, vColor.a);
  vec3 base = pow(c, vec3(2.2)) * uBrighten;
  float viewDist = length(vWorld - uCamPos);
  float ndl = dot(n, uSunDir);
  float diff = clamp((ndl + 0.5) / 1.5, 0.0, 1.0);
  vec3 col = base * (uSunColor * diff * cloudShadow(vWorld) + ambientLight(n));
  col = atmosphere(col, vWorld);
  // Far birds take the haze as the land does, so a backlit flock near the horizon reads grey, not black.
  col = mix(col, uFogColor, smoothstep(150.0, 900.0, viewDist) * 0.6);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`);var jc={gull:{scale:1.1,under:[.96,.96,.94],bodyHalf:.05,wrist:.36,dihedral:.07,freq:2.4,brighten:1.15},swallow:{scale:1.25,under:[.92,.86,.74],bodyHalf:.02,wrist:.1,dihedral:0,freq:8,brighten:1}},Mc=class{kind;cx;cy;cz;ground;birds=[];rng;t=0;active=!1;follow=null;constructor(e,t,n,r,i,a,o){this.kind=e,this.cx=t,this.cy=n,this.cz=r,this.ground=o,this.rng=new sc(cc(t,r,a,e.length));let s=this.rng;for(let a=0;a<i;a++){let i={x:t,y:n,z:r,vx:0,vy:0,vz:0,yaw:0,roll:0,pitch:0,heading:0,phase:s.next()*$,flap:0,sweep:0,flapping:!1,flapTimer:0,speed:9,cx:0,cz:0,cxTo:0,czTo:0,radius:20,radiusTo:20,alt:30,altTo:30,theta:0,spin:1,retarget:0,wobble:s.next()*$,tx:0,tz:0,height:3};if(e===`gull`){let e=s.next()*$,n=s.range(0,35);i.cx=i.cxTo=t+Math.cos(e)*n,i.cz=i.czTo=r+Math.sin(e)*n,i.radius=i.radiusTo=s.range(14,34),i.alt=i.altTo=s.range(20,60),i.theta=s.next()*$,i.spin=s.next()<.7?1:-1,i.speed=s.range(7,10),i.retarget=s.range(8,25),i.flapTimer=s.range(.5,6),[i.x,i.y,i.z]=this.gullPos(i)}else{let e=s.next()*$,n=s.range(0,20),a=t+Math.cos(e)*n,c=r+Math.sin(e)*n;i.height=s.range(1.5,4.5),i.x=a,i.z=c,i.y=Math.max(o.height(a,c),0)+i.height,i.yaw=s.next()*$,i.speed=s.range(10,13),[i.tx,i.tz]=this.swallowTarget(),i.flapTimer=s.range(.1,.6)}this.birds.push(i)}}gullPos(e){let t=Math.max(this.cy,0);return[e.cx+Math.cos(e.theta)*e.radius,t+e.alt+Math.sin(this.t*.25+e.wobble)*2.5,e.cz+Math.sin(e.theta)*e.radius]}swallowTarget(){let e=this.rng.next()*$,t=this.rng.range(4,32);return[this.cx+Math.cos(e)*t,this.cz+Math.sin(e)*t]}tick(e){this.t+=e,this.follow&&(this.cx+=(this.follow.x-this.cx)*(1-Math.exp(-e*.6)),this.cz+=(this.follow.z-this.cz)*(1-Math.exp(-e*.6)));for(let t of this.birds)this.kind===`gull`?this.gull(t,e):this.swallow(t,e)}gull(e,t){let n=this.rng;if(e.retarget-=t,e.retarget<=0){e.retarget=n.range(12,30);let t=n.next()*$,r=n.range(0,this.follow?20:45);e.cxTo=this.cx+Math.cos(t)*r,e.czTo=this.cz+Math.sin(t)*r,e.radiusTo=n.range(14,38),e.altTo=this.follow?n.range(12,30):n.range(20,60)}this.follow&&(e.cxTo+=(this.cx-e.cxTo)*(1-Math.exp(-t*.5)),e.czTo+=(this.cz-e.czTo)*(1-Math.exp(-t*.5)));let r=1-Math.exp(-t*(this.follow?.6:.12));e.cx+=(e.cxTo-e.cx)*r,e.cz+=(e.czTo-e.cz)*r,e.radius+=(e.radiusTo-e.radius)*r,e.alt+=(e.altTo-e.alt)*(1-Math.exp(-t*.08)),e.theta+=e.spin*e.speed/e.radius*t;let[i,a,o]=this.gullPos(e);if(t>0){let n=1-Math.exp(-t*8);e.vx+=((i-e.x)/t-e.vx)*n,e.vy+=((a-e.y)/t-e.vy)*n,e.vz+=((o-e.z)/t-e.vz)*n}e.x=i,e.y=a,e.z=o,this.orient(e,t,.6),e.flapTimer-=t,e.flapTimer<=0&&(e.flapping=!e.flapping,e.flapTimer=e.flapping?n.range(.8,2.2):n.range(3,9));let s=e.flapping||e.vy>.9?1:.07;e.flap=uc(e.flap,s,t*3),e.phase+=t*$*(e.flap>.3?jc.gull.freq:.35),e.sweep=0}swallow(e,t){let n=this.rng;(Math.hypot(e.x-e.tx,e.z-e.tz)<4||n.next()<t*.3)&&([e.tx,e.tz]=this.swallowTarget());let r=Math.atan2(e.tx-e.x,e.tz-e.z);e.yaw+=Math.max(-3.2*t,Math.min(3.2*t,lc(e.yaw,r)));let i=e.x+Math.sin(e.yaw)*e.speed*t,a=e.z+Math.cos(e.yaw)*e.speed*t,o=Math.max(this.ground.height(i,a),0),s=Math.max(o+e.height+Math.sin(this.t*1.9+e.wobble)*1.1,o+.8),c=t>0?e.y+(s-e.y)*(1-Math.exp(-t*3)):s;t>0&&(e.vx=(i-e.x)/t,e.vy=(c-e.y)/t,e.vz=(a-e.z)/t),e.x=i,e.y=c,e.z=a,this.orient(e,t,1),e.flapTimer-=t,e.flapTimer<=0&&(e.flapping=!e.flapping,e.flapTimer=e.flapping?n.range(.35,.7):n.range(.25,.6)),e.flap=uc(e.flap,e.flapping?.85:.04,t*8),e.sweep=uc(e.sweep,e.flapping?.15:.7,t*4),e.phase+=t*$*(e.flapping?jc.swallow.freq:1)}orient(e,t,n){let r=Math.hypot(e.vx,e.vz);if(r<.1)return;let i=Math.atan2(e.vx,e.vz),a=t>0?lc(e.heading,i)/Math.max(t,.001):0;e.heading=i,this.kind===`gull`&&(e.yaw=i);let o=Math.max(-.7,Math.min(.7,-Math.atan(a*r/9.8)*n)),s=t>0?1-Math.exp(-t*3):1;e.roll+=(o-e.roll)*s,e.pitch+=(Math.max(-.4,Math.min(.4,-Math.atan2(e.vy,r)))-e.pitch)*s}draw(e){let t=jc[this.kind].scale;for(let n of this.birds){let r=Math.cos(n.yaw),i=Math.sin(n.yaw),a=Math.cos(n.pitch),o=Math.sin(n.pitch),s=Math.cos(n.roll),c=Math.sin(n.roll),l=r*s+i*o*c,u=a*c,d=-i*s+r*o*c,f=-r*c+i*o*s,p=a*s,m=i*c+r*o*s,h=i*a,g=-o,_=r*a;e.push(l*t,u*t,d*t,f*t,p*t,m*t,h*t,g*t,_*t,n.x,n.y,n.z,n.phase,n.flap,n.sweep,0)}}},Nc=class{ground;flocks=[];batches=new Map;swallowsOut=1;constructor(e,t,n){this.ground=n;for(let n of[`gull`,`swallow`]){let r=jc[n],i=t.material(`life_${n}`,`lifeBird`,{attributes:[`position`,`normal`,`color`,`aFlap`],uniforms:[`uBodyHalf`,`uWrist`,`uDihedral`,`uUnder`,`uBrighten`]});i.backFaceCulling=!1,i.onBindObservable.add(()=>{let e=i.getEffect();e&&(e.setFloat(`uBodyHalf`,r.bodyHalf),e.setFloat(`uWrist`,r.wrist),e.setFloat(`uDihedral`,r.dihedral),e.setFloat3(`uUnder`,r.under[0],r.under[1],r.under[2]),e.setFloat(`uBrighten`,r.brighten))});let a=new bc(e,`life_${n}s`,n===`gull`?Fc():Ic(),i,[{name:`aFlap`,stride:4}],4);a.mesh.alwaysSelectAsActiveMesh=!0,this.batches.set(n,a)}}add(e,t,n,r,i,a){let o=new Mc(e,t,n,r,i,a,this.ground);return this.flocks.push(o),o}remove(e){let t=this.flocks.indexOf(e);t>=0&&this.flocks.splice(t,1)}update(e,t,n,r){for(let e of this.batches.values())e.begin();let i=0;for(let a of this.flocks)a.active=Math.hypot(a.cx-t,a.cz-n)<r+(a.active?40:0)&&(a.kind!==`swallow`||this.swallowsOut>.5),a.active&&(a.tick(e),a.draw(this.batches.get(a.kind)),i+=a.birds.length);for(let e of this.batches.values())e.commit();return i}},Pc=class{pos=[];col=[];tri(e,t,n,r){this.pos.push(...e,...n,...t);for(let e=0;e<3;e++)this.col.push(...r)}wing(e,t,n){let r=e.map(e=>n?[-e[0],e[1],e[2]]:e);[[0,1,6],[1,5,6],[1,2,5],[2,4,5],[2,3,4]].forEach((e,i)=>{n?this.tri(r[e[0]],r[e[2]],r[e[1]],t[i]):this.tri(r[e[0]],r[e[1]],r[e[2]],t[i])})}body(e,t){for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=[[r[1],r[3],r[0]],[0,r[3]+r[2],r[0]],[-r[1],r[3],r[0]],[0,r[3]-r[2],r[0]]],o=[[i[1],i[3],i[0]],[0,i[3]+i[2],i[0]],[-i[1],i[3],i[0]],[0,i[3]-i[2],i[0]]];for(let e=0;e<4;e++){let n=(e+1)%4;this.pos.push(...a[e],...o[e],...o[n],...a[e],...o[n],...a[n]);for(let e=0;e<6;e++)this.col.push(...t)}}}build(){let e=this.pos.length/3,t=[],n=this.pos.slice();for(let t=0;t<e;t+=3)for(let e=0;e<3;e++){let r=n[(t+1)*3+e];n[(t+1)*3+e]=n[(t+2)*3+e],n[(t+2)*3+e]=r}for(let r=0;r<e;r+=3){let e=n.slice(r*3,r*3+3),i=n.slice(r*3+3,r*3+6),a=n.slice(r*3+6,r*3+9),o=[i[0]-e[0],i[1]-e[1],i[2]-e[2]],s=[a[0]-e[0],a[1]-e[1],a[2]-e[2]],c=o[1]*s[2]-o[2]*s[1],l=o[2]*s[0]-o[0]*s[2],u=o[0]*s[1]-o[1]*s[0],d=Math.hypot(c,l,u)||1;for(let e=0;e<3;e++)t.push(c/d,l/d,u/d)}return xc(n,t,Array.from({length:e},(e,t)=>t),{colors:this.col})}};function Fc(){let e=new Pc,t=[.97,.97,.95,0],n=[.5,.55,.61,1],r=[.13,.13,.14,0];e.body([[-.3,0,0,0],[-.12,.06,.05,0],[.05,.07,.065,0],[.2,.045,.05,.03],[.31,0,0,.02]],t);let i=[[.04,0,.09],[.36,.03,.07],[.58,.01,-.02],[.78,0,-.16],[.55,0,-.13],[.34,0,-.11],[.04,0,-.13]],a=[n,n,n,r,r];return e.wing(i,a,!1),e.wing(i,a,!0),e.tri([-.07,0,-.22],[.07,0,-.22],[0,0,-.4],t),e.build()}function Ic(){let e=new Pc,t=[.08,.1,.2,1];e.body([[-.08,0,0,0],[-.03,.02,.018,0],[.04,.022,.02,0],[.09,0,0,.005]],[.1,.12,.22,1]);let n=[[.015,0,.035],[.1,.01,.03],[.17,0,-.01],[.25,0,-.09],[.16,0,-.05],[.1,0,-.035],[.015,0,-.03]],r=[t,t,t,t,t];e.wing(n,r,!1),e.wing(n,r,!0);for(let n of[-1,1]){let r=[0,0,-.06],i=[.022*n,0,-.07],a=[.05*n,0,-.2];n>0?e.tri(r,i,a,t):e.tri(r,a,i,t)}return e.build()}var Lc=20*ce,Rc=13,zc=64,Bc=8;U(`lifeWake`,`
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 viewProjection;
uniform float uTime;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec2 vUv;
${vc}
void main() {
  vec3 wp = position;
  wp.y = lifeSwell(wp.xz, uTime, uCamPos) + 0.05;
  vWorld = wp;
  vUv = uv;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec2 vUv;
${V}
${H}
void main() {
  float across = abs(vUv.x * 2.0 - 1.0);
  float age = clamp(vUv.y, 0.0, 1.0);
  float arms = smoothstep(0.5, 0.88, across) * (1.0 - smoothstep(0.93, 1.0, across));
  float core = (1.0 - smoothstep(0.0, 0.45, across)) * (1.0 - smoothstep(0.05, 0.55, age));
  float n = vnoise(vWorld.xz * 0.08 * 8.0 + vec2(uTime * 0.12, 0.0));
  float n2 = vnoise(vWorld.xz * 0.31 * 8.0 - vec2(0.0, uTime * 0.24));
  float breakup = smoothstep(0.32, 0.72, n * 0.55 + n2 * 0.65 - age * 0.25);
  float foam = max(arms, core) * breakup;
  float a = clamp(foam * 0.8 * pow(1.0 - age, 1.3), 0.0, 1.0);
  vec3 lightCol = uSunColor * max(uSunDir.y, 0.0) * 0.35 + ambientLight(vec3(0.0, 1.0, 0.0)) * 1.1;
  vec3 col = atmosphere(vec3(0.93, 0.95, 0.94) * lightCol, vWorld);
  gl_FragColor = vec4(col, a);
}
`);var Vc=class{props;world;ships=[];nav=new Map;landDist=new Map;wake;wakePos;wakeUv;t=0;constructor(e,t,n,r){this.props=n,this.world=r,this.wakePos=new Float32Array(3168),this.wakeUv=new Float32Array(2112);let i=[];for(let e=0;e<Bc;e++)for(let t=0;t<65;t++){let n=(e*66+t)*2;i.push(n,n+2,n+1,n+1,n+2,n+3)}this.wake=new v(`life_wakes`,e),this.wake.setVerticesData(a.PositionKind,this.wakePos,!0,3),this.wake.setVerticesData(a.UVKind,this.wakeUv,!0,2),this.wake.setIndices(i),this.wake.isPickable=!1,this.wake.alwaysSelectAsActiveMesh=!0;let o=t.material(`life_wake`,`lifeWake`,{attributes:[`position`,`uv`],needAlphaBlending:!0});o.backFaceCulling=!1,this.wake.material=o,yc(this.wake,o,`mix`)}plan(e,t,n,r,i,a=0){let o=new sc(cc(t,n,i,101));this.planNav(t,n,r);let s=[];for(let e of this.nav.keys()){let t=this.landDist.get(e)??99;t>=2&&t<=3&&s.push(Uc(e))}if(s.length<3&&(s=[...this.nav.keys()].map(Uc)),s.length)for(let i=0;i<e+a;i++){let a=i>=e,c=this.planLoop(s,t,n,a?r*.6:r,o,a);if(c.length<4)continue;let l=o.next()<.5?c.slice().reverse():c,u=[0];for(let e=1;e<l.length;e++)u.push(u[e-1]+Math.hypot(l[e].x-l[e-1].x,l[e].z-l[e-1].z));let d={path:l,acc:u,s:o.next()*u[u.length-1],speed:a?o.range(1.2,1.8):o.range(3,4.2),heading:0,turn:0,size:a?o.range(.9,1.05):o.range(.6,.8),phase:o.next()*$,trail:[],x:0,y:0,z:0,model:a?`rowboat`:`cog`,prop:0};d.prop=this.props.add(d.model,{x:0,y:-50,z:0,yaw:0,scale:d.size});let f=this.tangent(d,d.s);d.heading=Math.atan2(f.z,f.x);for(let e=6.5*d.size;e<46;e+=1.5){let t=this.sample(d,d.s-e);d.trail.unshift({x:t.x,z:t.z,t:-e/d.speed})}this.ships.push(d)}}planNav(e,t,n){let r=R({x:e,y:t}),i=Math.ceil(n/Lc)+1,a=e=>L(this.world.baseType(e)),o=oe(r,i+3).filter(e=>!a(e)),s=o;for(let e of o)this.landDist.set(Hc(e),0);for(;s.length;){let e=[];for(let t of s)for(let n of se){let a={q:t.q+n.q,r:t.r+n.r},o=Hc(a);this.landDist.has(o)||de(a,r)>i+3||(this.landDist.set(o,this.landDist.get(Hc(t))+1),e.push(a))}s=e}for(let o of oe(r,i)){let r=I(o);if(Math.hypot(r.x-e,r.y-t)>n||!a(o)||this.world.height(r.x,r.y)>-1.8)continue;let i=he(this.world.baseType(o));isFinite(i)||(i=1);let s=this.landDist.get(Hc(o))??99;s<=1?i*=4:s===2&&(i*=1.4),this.nav.set(Hc(o),i)}}planLoop(e,t,n,r,i,a){let o=i.next()<.5?3:4,s=[],c=a?e.filter(e=>(this.landDist.get(Hc(e))??99)<=2):e,l=c.length>=3?c:e;for(let e=0;e<200&&s.length<o;e++){let e=l[Math.floor(i.next()*l.length)],t=I(e);s.every(e=>{let n=I(e);return Math.hypot(n.x-t.x,n.y-t.y)>=r*(a?.25:.55)})&&s.push(e)}if(s.length<2)return[];s.sort((e,r)=>{let i=I(e),a=I(r);return Math.atan2(i.y-n,i.x-t)-Math.atan2(a.y-n,a.x-t)});let u=[];for(let e=0;e<s.length;e++){let t=s[e],n=s[(e+1)%s.length],r=this.astar(t,n,!0);if(r.length||(r=this.astar(t,n,!1)),!r.length)return[];u.length&&r.shift(),u=u.concat(r)}u.length>1&&Hc(u[u.length-1])===Hc(u[0])&&u.pop();let d=u.map(e=>{let t=I(e);return{x:t.x+i.range(-4,4),z:t.y+i.range(-4,4)}});for(let e=0;e<4;e++)d=Wc(d);return d.push(d[0]),d}astar(e,t,n){let r=[e],i=new Map([[Hc(e),0]]),a=new Map([[Hc(e),de(e,t)*Lc]]),o=new Map,s=new Set;for(;r.length;){let e=0;for(let t=1;t<r.length;t++)a.get(Hc(r[t]))<a.get(Hc(r[e]))&&(e=t);let c=r.splice(e,1)[0];if(c.q===t.q&&c.r===t.r){let e=[c];for(;o.has(Hc(c));)c=o.get(Hc(c)),e.unshift(c);return e}s.add(Hc(c));for(let e of se){let l={q:c.q+e.q,r:c.r+e.r},u=Hc(l);if(!this.nav.has(u)||s.has(u)||n&&(this.landDist.get(u)??99)<=1&&(l.q!==t.q||l.r!==t.r))continue;let d=i.get(Hc(c))+Lc*this.nav.get(u);d<(i.get(u)??1/0)&&(i.set(u,d),a.set(u,d+de(l,t)*Lc),o.set(u,c),r.some(e=>e.q===l.q&&e.r===l.r)||r.push(l))}}return[]}sample(e,t){let n=e.acc[e.acc.length-1];t=(t%n+n)%n;let r=0,i=e.acc.length-1;for(;i-r>1;){let n=r+i>>1;e.acc[n]<=t?r=n:i=n}let a=Math.max(e.acc[r+1]-e.acc[r],.001),o=Math.min(1,Math.max(0,(t-e.acc[r])/a)),s=e.path[r],c=e.path[r+1];return{x:s.x+(c.x-s.x)*o,z:s.z+(c.z-s.z)*o}}tangent(e,t){let n=this.sample(e,t-6),r=this.sample(e,t+6),i=r.x-n.x,a=r.z-n.z,o=Math.hypot(i,a);return o>.001?{x:i/o,z:a/o}:{x:1,z:0}}poses(){return this.ships.map(e=>({x:e.x,y:e.y,z:e.z,heading:e.heading,size:e.size,model:e.model}))}update(e,t,n,r){this.t+=e;let i=0;for(let a of this.ships){let o=a.acc[a.acc.length-1];a.s=(a.s+a.speed*e)%o;let s=this.sample(a,a.s),c=this.tangent(a,a.s),l=Math.atan2(c.z,c.x),u=lc(a.heading,l),d=e>0?Math.max(-.35*e,Math.min(.35*e,u)):u;a.heading+=d,a.turn=e>0?a.turn+(d/Math.max(e,.001)-a.turn)*(1-Math.exp(-e*2)):0;let f=_c(s.x,s.z,t,n,r),p=Math.cos(a.heading),m=Math.sin(a.heading),h=-m,g=p,_=5*a.size,v=Math.atan2(_c(s.x+p*_,s.z+m*_,t,n,r)-_c(s.x-p*_,s.z-m*_,t,n,r),2*_)+Math.sin(this.t*1.05+a.phase*1.7)*.02,y=-Math.atan2(_c(s.x+h*_*.5,s.z+g*_*.5,t,n,r)-_c(s.x-h*_*.5,s.z-g*_*.5,t,n,r),_)+Math.sin(this.t*.8+a.phase)*.035-Math.max(-.08,Math.min(.08,a.turn*a.speed*.06));a.x=s.x,a.z=s.z,a.y=f-(a.model===`cog`?.62:.3)*a.size+Math.sin(this.t*1.3+a.phase)*.04,this.updateTrail(a),this.props.update(a.prop,{x:a.x,y:a.y,z:a.z,yaw:-a.heading+Math.PI,tilt:[-y,-v]}),a.model===`cog`&&i<Bc&&this.fillWake(a,i++)}for(;i<Bc;i++)this.clearWake(i);this.wake.updateVerticesData(a.PositionKind,this.wakePos),this.wake.updateVerticesData(a.UVKind,this.wakeUv)}updateTrail(e){let t=Math.cos(e.heading),n=Math.sin(e.heading),r=e.x-t*6.5*e.size,i=e.z-n*6.5*e.size,a=e.trail[e.trail.length-1];for((!a||Math.hypot(a.x-r,a.z-i)>1.5)&&e.trail.push({x:r,z:i,t:this.t});e.trail.length>2&&(this.t-e.trail[0].t>Rc||e.trail.length>zc);)e.trail.shift()}fillWake(e,t){let n=t*66*2,r=Math.cos(e.heading),i=Math.sin(e.heading),a=-i,o=r,s=e.size,c=0,l=(e,t,r,i,a)=>{let o=n+c*2;this.wakePos.set([e-r,0,t-i,e+r,0,t+i],o*3),this.wakeUv.set([0,a,1,a],o*2),c++};l(e.x+r*7*s,e.z+i*7*s,a*.3,o*.3,0);let u={x:e.x-r*6.5*s,z:e.z-i*6.5*s};l(u.x+r*7*s,u.z+i*7*s,a*2.6*s,o*2.6*s,0);let d=e.trail;for(let e=d.length-1;e>=0&&c<66;e--){let t=d[e],n=Math.min(1,Math.max(0,(this.t-t.t)/Rc)),a=d[Math.max(e-1,0)],o=d[Math.min(e+1,d.length-1)],c=o.x-a.x,u=o.z-a.z;Math.hypot(c,u)<.01&&(c=r,u=i);let f=Math.hypot(c,u),p=(2.6+6.4*Math.sqrt(n))*s;l(t.x,t.z,-u/f*p,c/f*p,n)}let f=n+(c-1)*2;for(;c<66;c++){let e=n+c*2;this.wakePos.copyWithin(e*3,f*3,f*3+6),this.wakeUv.set([0,1,1,1],e*2)}}clearWake(e){this.wakePos.fill(0,e*66*6,(e+1)*66*6),this.wakeUv.fill(1,e*66*4,(e+1)*66*4)}};function Hc(e){return`${e.q},${e.r}`}function Uc(e){let t=e.indexOf(`,`);return{q:Number(e.slice(0,t)),r:Number(e.slice(t+1))}}function Wc(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];t.push({x:r.x+(i.x-r.x)*.25,z:r.z+(i.z-r.z)*.25},{x:r.x+(i.x-r.x)*.75,z:r.z+(i.z-r.z)*.75})}return t}function Gc(e,t){let n=[0];for(let t=1;t<e.length;t++)n.push(n[t-1]+Math.hypot(e[t].x-e[t-1].x,e[t].z-e[t-1].z));return{pts:e,acc:n,road:t}}function Kc(e){return e.acc[e.acc.length-1]}function qc(e,t){let n=Kc(e);t=Math.min(n,Math.max(0,t));let r=0,i=e.acc.length-1;for(;i-r>1;){let n=r+i>>1;e.acc[n]<=t?r=n:i=n}let a=Math.max(e.acc[r+1]-e.acc[r],1e-4),o=(t-e.acc[r])/a,s=e.pts[r],c=e.pts[r+1]??s;return{x:s.x+(c.x-s.x)*o,z:s.z+(c.z-s.z)*o}}function Jc(e,t){let n=qc(e,t-2),r=qc(e,t+2),i=r.x-n.x,a=r.z-n.z,o=Math.hypot(i,a);return o>1e-4?{x:i/o,z:a/o}:{x:0,z:1}}function Yc(e){let t=(e,t)=>`${Math.round(e*4)},${Math.round(t*4)}`,n=new Map,r=(e,t)=>e<t?`${e}|${t}`:`${t}|${e}`;for(let i of e){let e=t(i.ax,i.az),a=t(i.bx,i.bz),o=r(e,a);n.has(e)||n.set(e,[]),n.has(a)||n.set(a,[]),n.get(e).push({x:i.bx,z:i.bz,e:o}),n.get(a).push({x:i.ax,z:i.az,e:o})}let i=new Set,a=[];for(let o of e){let e=r(t(o.ax,o.az),t(o.bx,o.bz));if(i.has(e))continue;i.add(e);let s=[{x:o.ax,z:o.az},{x:o.bx,z:o.bz}];for(;;){let e=s[s.length-1],r=(n.get(t(e.x,e.z))??[]).find(e=>!i.has(e.e));if(!r)break;i.add(r.e),s.push({x:r.x,z:r.z})}for(;;){let e=s[0],r=(n.get(t(e.x,e.z))??[]).find(e=>!i.has(e.e));if(!r)break;i.add(r.e),s.unshift({x:r.x,z:r.z})}if(s.length<3)continue;let c=[];for(let e=0;e<s.length-1;e++)for(let t=0;t<4;t++)c.push({x:s[e].x+(s[e+1].x-s[e].x)*(t/4),z:s[e].z+(s[e+1].z-s[e].z)*(t/4)});c.push(s[s.length-1]),a.push(Gc(c,!0))}return a}var Xc=null,Zc=512;function Qc(){if(Xc)return Xc;let e=new Float32Array(Zc*Zc),t=.5;for(let n=0;n<5;n++){let r=8<<n,i=new Float32Array(r*r),a=1013+n*7919>>>0;for(let e=0;e<i.length;e++)a=Math.imul(a^a>>>15,2246822519)+2654435769>>>0,i[e]=(a>>>8)/16777216;let o=Zc/r;for(let n=0;n<Zc;n++){let a=n/o,s=Math.floor(a),c=a-s,l=c*c*(3-2*c),u=s%r,d=(s+1)%r;for(let a=0;a<Zc;a++){let s=a/o,c=Math.floor(s),f=s-c,p=f*f*(3-2*f),m=c%r,h=(c+1)%r,g=i[u*r+m],_=i[u*r+h],v=i[d*r+m],y=i[d*r+h];e[n*Zc+a]+=t*(g+(_-g)*p+(v-g+(g-_+y-v)*p)*l)}}t*=.5}let n=1/0,r=-1/0;for(let t of e)t<n&&(n=t),t>r&&(r=t);for(let t=0;t<e.length;t++)e[t]=Math.round((e[t]-n)/(r-n)*255)/255;return Xc=e}function $c(e,t,n){let r=Qc(),i=e/n*Zc-.5,a=t/n*Zc-.5,o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=(e,t)=>r[(t%Zc+Zc)%Zc*Zc+(e%Zc+Zc)%Zc],d=u(o,s),f=u(o+1,s),p=u(o,s+1),m=u(o+1,s+1);return d+(f-d)*c+(p-d+(d-f+m-p)*c)*l}function el(e,t,n){let r=1-Math.min(1,Math.max(0,(n-90)/60)),i=6*(1+(.33-1)*(r*r*(3-2*r))),a=e,o=t;for(let n=0;n<3;n++)a=e-($c(a,o,40)-.5)*i,o=t-($c(a+70,o+70,40)-.5)*i;return{x:a,z:o}}var tl=30,nl=26,rl=`
attribute vec4 matricesIndices;
attribute vec4 matricesWeights;
attribute vec4 aTool;     // x 0 body, 1 rides the right hand, 2 rides the back, yzw tool colour
attribute vec4 aClipA;    // row of frame 0, frame count, frame (fractional), tool shown
attribute vec4 aClipB;    // the clip being faded out: row, count, frame, weight
uniform highp sampler2D uVat;
uniform vec3 uGrip;       // mesh-space anchors the tools follow
uniform vec3 uBack;
uniform float uHandBone;
uniform float uBackBone;

mat4 vatBone(float bone, float row) {
  int o = int(bone) * 4;
  int r = int(row);
  return mat4(texelFetch(uVat, ivec2(o, r), 0), texelFetch(uVat, ivec2(o + 1, r), 0), texelFetch(uVat, ivec2(o + 2, r), 0), texelFetch(uVat, ivec2(o + 3, r), 0));
}

mat4 vatSkin(float row) {
  mat4 m = vatBone(matricesIndices.x, row) * matricesWeights.x;
  m += vatBone(matricesIndices.y, row) * matricesWeights.y;
  m += vatBone(matricesIndices.z, row) * matricesWeights.z;
  m += vatBone(matricesIndices.w, row) * matricesWeights.w;
  return m;
}

// Skin matrix for one clip, linearly between baked frames (the far LOD takes the nearest frame).
mat4 clipSkin(vec4 clip, float boneOverride) {
  float f0 = floor(clip.z);
#ifdef FAST
  if (boneOverride >= 0.0) return vatBone(boneOverride, clip.x + f0);
  return vatSkin(clip.x + f0);
#else
  float t = clip.z - f0;
  float f1 = mod(f0 + 1.0, clip.y);
  if (boneOverride >= 0.0) return vatBone(boneOverride, clip.x + f0) * (1.0 - t) + vatBone(boneOverride, clip.x + f1) * t;
  return vatSkin(clip.x + f0) * (1.0 - t) + vatSkin(clip.x + f1) * t;
#endif
}

mat4 personSkin(float boneOverride) {
  mat4 m = clipSkin(aClipA, boneOverride);
#ifndef FAST
  if (aClipB.w > 0.001) m = m * (1.0 - aClipB.w) + clipSkin(aClipB, boneOverride) * aClipB.w;
#endif
  return m;
}

// Model-space position and normal of this vertex this frame; tools stay upright at their anchor.
void personPose(out vec3 p, out vec3 n) {
  if (aTool.x < 0.5) {
    mat4 m = personSkin(-1.0);
    p = (m * vec4(position, 1.0)).xyz;
    n = normalize(mat3(m) * normal);
    return;
  }
  bool hand = aTool.x < 1.5;
  mat4 m = personSkin(hand ? uHandBone : uBackBone);
  vec3 anchor = (m * vec4(hand ? uGrip : uBack, 1.0)).xyz;
  p = anchor + position * aClipA.w;
  n = normal;
}
`;U(`lifePerson`,`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vTool;
varying float vHeight;
${rl}
void main() {
#include<instancesVertex>
  vec3 p, n;
  personPose(p, n);
  float dist = length(finalWorld[3].xyz - uCamPos);
  // People grow a little with distance so lanes still read as busy from the board.
  p *= 1.0 + 0.9 * smoothstep(50.0, 420.0, dist);
  vec4 wp = finalWorld * vec4(p, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(finalWorld) * n);
  vUv = uv;
  vTool = aTool;
  vHeight = p.y;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vTool;
varying float vHeight;
${V}
${H}
uniform sampler2D uAlbedo;
void main() {
  vec3 n = normalize(vNormal);
  vec3 base;
  if (vTool.x > 0.5) {
    base = vTool.yzw;
  } else {
    vec3 detail = texture2D(uAlbedo, vUv).rgb;
    vec3 planes = textureLod(uAlbedo, vUv, 2.0).rgb;
    base = mix(planes, detail, 0.6);
  }
  base = pow(base, vec3(2.2));
  float sh;
  vec3 col = shade(base, n, vWorld, mix(0.75, 1.0, smoothstep(0.0, 1.0, vHeight)), 0.3, sh);
  vec3 v = normalize(uCamPos - vWorld);
  float rim = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
  col += base * uSunColor * sh * rim * 0.35;
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`lifePersonDepth`,`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
${rl}
void main() {
#include<instancesVertex>
  vec3 p, n;
  personPose(p, n);
  float dist = length(finalWorld[3].xyz - uCamPos);
  p *= 1.0 + 0.9 * smoothstep(50.0, 420.0, dist);
  gl_Position = viewProjection * (finalWorld * vec4(p, 1.0));
}
`,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`);var il={farmer:{model:`life_farmer`,walk:`Casual_Walk_inplace`,walkSpeed:.68,idle:[`Idle`],work:[`Reaping_Swing`,`Pull_Radish`],tool:`scythe`,speed:1,hideTool:[`Pull_Radish`]},shepherd:{model:`life_shepherd`,walk:`walking_2_inplace`,walkSpeed:1.13,idle:[`Idle`],work:[`Female_Stand_Pick_Fruit_Basket`,`Female_Crouch_Pick_Up_Place_Side`],tool:`crook`,speed:1.05,hideTool:[`Female_Stand_Pick_Fruit_Basket`,`Female_Crouch_Pick_Up_Place_Side`]},merchant:{model:`life_merchant`,walk:`Casual_Walk_inplace`,walkSpeed:.68,idle:[`Stand_and_Chat`],work:[`Talk_with_Hands_Open`,`Male_Bend_Over_Pick_Up`],tool:`pack`,speed:.82,hideTool:[]},spearman:{model:`life_spearman`,walk:`Spear_Walk_inplace`,walkSpeed:1.33,idle:[`Idle`],work:[`Lower_Weapon_Look_Raise`],tool:`spear`,speed:1.15,hideTool:[]}},al=[`farmer`,`shepherd`,`merchant`,`spearman`],ol={farmer:[`Pull_Radish`],shepherd:[`Female_Crouch_Pick_Up_Place_Side`],merchant:[`Male_Bend_Over_Pick_Up`,`Talk_with_Hands_Open`],spearman:[`Idle`]},sl=1.15,cl=.35;async function ll(t,r){let i=await fr(_(`/harvest-crown/assets/models/${r.model}.glb`,t));for(let e of i.animationGroups)e.stop();let o=i.meshes.find(e=>e instanceof v&&!!e.skeleton&&e.getTotalVertices()>0),s=o.skeleton,c=s.bones.filter(e=>e._index!==null&&e._index>=0),l=Math.max(...c.map(e=>e._index))+1,u=e=>c.find(t=>t.name===e)?._index??c.find(t=>t.name.toLowerCase().includes(e.toLowerCase()))?._index??0,d=u(`RightHand`),p=u(`Spine2`)||u(`Spine1`)||u(`Spine`),m=new Map,h=0;for(let e of i.animationGroups){let t=e.targetedAnimations[0]?.animation.framePerSecond??60,n=Math.max(.1,(e.to-e.from)/t),r=Math.max(2,Math.round(n*tl));m.set(e.name,{row:h,frames:r,duration:n}),h+=r}let g=new Float32Array(h*l*16),y=new f,b=new f;for(let e of i.animationGroups){let t=m.get(e.name);for(let n=0;n<t.frames;n++){let r=e.from+(e.to-e.from)*n/t.frames;for(let t of e.targetedAnimations){let e=t.animation.evaluate(r);t.target[t.animation.targetProperty]=e?.clone?e.clone():e}s.prepare(!0),o.computeWorldMatrix(!0),b.copyFrom(o.getWorldMatrix());let i=s.getTransformMatrices(o);for(let e=0;e<l;e++)f.FromArrayToRef(i,e*16,y),y.multiplyToArray(b,g,((t.row+n)*l+e)*16)}}let C=o.getVerticesData(a.PositionKind),w=o.getVerticesData(a.NormalKind),T=o.getVerticesData(a.UVKind),E=o.getVerticesData(a.MatricesIndicesKind),D=o.getVerticesData(a.MatricesWeightsKind),O=o.getIndices(),k=C.length/3,A=m.get(r.idle[0])??m.values().next().value,j=(e,t,n)=>{let r=0,i=0,a=0;for(let n=0;n<4;n++){let o=D[t*4+n];if(o<=0)continue;let s=(e*l+E[t*4+n])*16,c=C[t*3],u=C[t*3+1],d=C[t*3+2];r+=o*(c*g[s]+u*g[s+4]+d*g[s+8]+g[s+12]),i+=o*(c*g[s+1]+u*g[s+5]+d*g[s+9]+g[s+13]),a+=o*(c*g[s+2]+u*g[s+6]+d*g[s+10]+g[s+14])}n.set(r,i,a)},ee=new n,te=1/0,M=-1/0,ne=1/0,N=-1/0,P=1/0,F=-1/0;for(let e=0;e<k;e++)j(A.row,e,ee),te=Math.min(te,ee.y),M=Math.max(M,ee.y),ne=Math.min(ne,ee.x),N=Math.max(N,ee.x),P=Math.min(P,ee.z),F=Math.max(F,ee.z);let re=1.7/Math.max(1e-6,M-te),I=f.Translation(-(ne+N)/2,-te,-(P+F)/2).multiply(f.Scaling(re,re,re));for(let e=0;e<h*l;e++)f.FromArrayToRef(g,e*16,y),y.multiplyToArray(I,g,e*16);let ie=e=>{let t=new n,r=0;for(let i=0;i<k;i++)for(let a=0;a<4;a++)E[i*4+a]===e&&D[i*4+a]>.5&&(t.addInPlace(new n(C[i*3],C[i*3+1],C[i*3+2])),r++);return r?t.scaleInPlace(1/r):t},ae=ie(d),oe=ie(p),L=ul(r.tool),se=new S;se.positions=[...C,...L.pos],se.normals=[...w,...L.nor],se.uvs=[...T,...Array(L.pos.length/3*2).fill(0)],se.matricesIndices=[...E,...Array(L.pos.length/3*4).fill(0)],se.matricesWeights=[...D,...Array.from({length:L.pos.length/3},()=>[1,0,0,0]).flat()],se.indices=[...O,...L.idx.map(e=>e+k)];let ce=new Float32Array((k+L.pos.length/3)*4);for(let e=0;e<L.pos.length/3;e++)ce.set([L.mode,L.col[e*3],L.col[e*3+1],L.col[e*3+2]],(k+e)*4);let R=x.CreateRGBATexture(g,l*4,h,t,!1,!1,e.TEXTURE_NEAREST_SAMPLINGMODE,e.TEXTURETYPE_FLOAT);R.name=`vat_${r.model}`;let le=o.material,ue=le&&`albedoTexture`in le?le.albedoTexture:null;ue&&i.textures.splice(i.textures.indexOf(ue),1);for(let e of i.animationGroups)e.dispose();return i.dispose(),{vd:se,tool:ce,vat:R,clips:m,albedo:ue,hand:d,back:p,grip:ae,backAnchor:oe}}function ul(e){let t=[],n=[],r=[],i=[],a=[.42,.29,.17],o=[.5,.51,.53],s=[.66,.56,.4],c=[.55,.28,.2],l=(e,a,o,s,c)=>{let l=[a[0]-e[0],a[1]-e[1],a[2]-e[2]],u=Math.hypot(l[0],l[1],l[2])||1,d=[l[0]/u,l[1]/u,l[2]/u],f=Math.abs(d[1])<.9?[0,1,0]:[1,0,0],p=[d[1]*f[2]-d[2]*f[1],d[2]*f[0]-d[0]*f[2],d[0]*f[1]-d[1]*f[0]],m=Math.hypot(p[0],p[1],p[2]);p=p.map(e=>e/m);let h=[d[1]*p[2]-d[2]*p[1],d[2]*p[0]-d[0]*p[2],d[0]*p[1]-d[1]*p[0]],g=t.length/3;for(let i=0;i<6;i++){let l=i/6*$,u=Math.cos(l),d=Math.sin(l),f=p[0]*u+h[0]*d,m=p[1]*u+h[1]*d,g=p[2]*u+h[2]*d;t.push(e[0]+f*o,e[1]+m*o,e[2]+g*o,a[0]+f*s,a[1]+m*s,a[2]+g*s),n.push(f,m,g,f,m,g),r.push(...c,...c)}for(let e=0;e<6;e++){let t=(e+1)%6,n=g+e*2,r=g+e*2+1,a=g+t*2,o=g+t*2+1;i.push(n,a,r,r,a,o)}},u=(e,a,o)=>{let s=t.length/3;for(let i=0;i<=5;i++){let s=i/5*Math.PI;for(let i=0;i<=8;i++){let c=i/8*$,l=Math.sin(s)*Math.cos(c),u=Math.cos(s),d=Math.sin(s)*Math.sin(c);t.push(e[0]+l*a[0],e[1]+u*a[1],e[2]+d*a[2]),n.push(l,u,d),r.push(...o)}}for(let e=0;e<5;e++)for(let t=0;t<8;t++){let n=s+e*9+t,r=n+8+1;i.push(n,n+1,r,r,n+1,r+1)}},d=e=>[e[0]+e[1]*.1,e[1],e[2]+e[1]*.08];if(e===`scythe`){l(d([0,-.55,0]),d([0,1.05,0]),.03,.026,a);let e=d([0,1,0]);for(let t=1;t<=6;t++){let n=t/6,r=d([-Math.sin(n*1.3)*.62,1-n*n*.18,Math.cos(n*1.3)*.05]);l(e,r,.035*(1-n*.5),.035*(1-n*.6),o),e=r}}else if(e===`crook`){l(d([0,-.75,0]),d([0,.85,0]),.028,.026,a);let e=d([0,.85,0]);for(let t=1;t<=7;t++){let n=t/7*Math.PI*1.15,r=d([0,.85+Math.sin(n)*.12,.12-Math.cos(n)*.12]);l(e,r,.026,.026,a),e=r}}else e===`spear`?(l(d([0,-1,0]),d([0,1.25,0]),.028,.026,a),l(d([0,1.22,0]),d([0,1.52,0]),.055,.004,o)):(u([0,-.08,-.26],[.18,.22,.12],s),l([-.17,.12,-.24],[.17,.12,-.24],.07,.07,c));return{pos:t,nor:n,col:r,idx:i,mode:e===`pack`?2:1}}var dl=0,fl=1,pl=2,ml=class{scene;lighting;shadows;ground;walkers=[];casts=new Map;rng=new sc(9137);constructor(e,t,n,r){this.scene=e,this.lighting=t,this.shadows=n,this.ground=r;for(let e of al)this.load(e)}async load(e){await k.ready;let t=il[e],n=await ll(this.scene,t),r=[{name:`aClipA`,stride:4},{name:`aClipB`,stride:4}],i=new bc(this.scene,`life_${e}_near`,n.vd,this.material(e,n,!1,!1),r,3),a=new S;Object.assign(a,n.vd);let o=new Float32Array(n.vd.positions),s=new Uint32Array(n.vd.indices);a.indices=Array.from(k.simplifySloppy(s,o,3,null,Math.floor(s.length*.12/3)*3,.08)[0]);let c=new bc(this.scene,`life_${e}_far`,a,this.material(e,n,!1,!0),r,3);for(let e of[i,c])e.mesh.setVerticesData(`aTool`,n.tool,!1,4),e.mesh.alwaysSelectAsActiveMesh=!0;this.shadows.addCaster(i.mesh,this.material(e,n,!0,!1),0),this.shadows.addCaster(c.mesh,this.material(e,n,!0,!0),0),this.casts.set(e,{def:t,clips:n.clips,near:i,far:c})}material(e,t,n,r){let i=this.lighting.material(`life_${e}${n?`Depth`:``}${r?`Far`:``}`,n?`lifePersonDepth`:`lifePerson`,{attributes:[`position`,`normal`,`uv`,`matricesIndices`,`matricesWeights`,`aTool`,`aClipA`,`aClipB`],uniforms:[`uGrip`,`uBack`,`uHandBone`,`uBackBone`,...n?[`uCamPos`]:[]],samplers:[`uVat`,...n?[]:[`uAlbedo`]],defines:r?[`FAST`]:[],lit:!n}),a=this.lighting;return i.onBindObservable.add(()=>{let e=i.getEffect();e&&(e.setTexture(`uVat`,t.vat),e.setVector3(`uGrip`,t.grip),e.setVector3(`uBack`,t.backAnchor),e.setFloat(`uHandBone`,t.hand),e.setFloat(`uBackBone`,t.back),n?e.setVector3(`uCamPos`,a.camPos):t.albedo&&e.setTexture(`uAlbedo`,t.albedo))}),i}newWalker(e,t){let n=this.rng;return{cast:e,role:t,route:null,s:0,dir:1,speed:sl*il[e].speed*n.range(.85,1.15),state:dl,timer:0,nextPause:n.range(15,45),yaw:n.next()*$,offset:0,keep:n.range(.6,1.3),inset:n.range(.3,3.5),scale:n.range(.95,1.05),x:0,z:0,clip:il[e].walk,frame:n.range(0,10),rate:1,prevClip:``,prevFrame:0,prevRate:1,blend:0,toolShown:1,tx:0,tz:0,ax:0,az:0,anchorR:0,follow:null,acts:null,active:!1}}addRoadWalkers(e,t,n=0){let r=[];if(!e.length)return r;let i=Math.ceil(t/e.length);for(let a=0;a<t;a++){let t=this.newWalker(al[(a+n)%al.length],`road`);t.route=e[a%e.length];let o=Kc(t.route),s=Math.floor(a/e.length);t.s=Math.min(o,Math.max(0,(s+.5+this.rng.range(-.3,.3))/i*o)),t.dir=a%2==0?1:-1,t.offset=t.keep*t.dir;let c=Jc(t.route,t.s);t.yaw=Math.atan2(c.x*t.dir,c.z*t.dir),this.walkers.push(t),r.push(t)}return r}addFieldWorker(e,t,n,r=`farmer`){let i=this.newWalker(r,`field`);return i.ax=i.x=i.tx=e,i.az=i.z=i.tz=t,i.anchorR=n,i.state=pl,i.timer=this.rng.range(0,8),i.clip=il[r].work[0],i.speed*=.6,this.walkers.push(i),i}addHerder(e,t=`shepherd`){let n=this.newWalker(t,`herd`);return n.follow=e,n.ax=n.x=n.tx=e.x+6,n.az=n.z=n.tz=e.z,n.anchorR=12,n.state=fl,n.timer=this.rng.range(1,6),n.clip=il[t].idle[0],n.speed*=.55,this.walkers.push(n),n}addBuilder(e,t,n,r,i){let a=this.newWalker(i,`field`);return a.x=e,a.z=t,a.ax=a.tx=n,a.az=a.tz=r,a.anchorR=3,a.acts=ol[i],a.yaw=Math.atan2(n-e,r-t),a.speed*=1.25,this.walkers.push(a),a}sendTo(e,t,n){e.ax=e.tx=t,e.az=e.tz=n,e.anchorR=1,e.state=dl,e.acts=il[e.cast].idle}remove(e){let t=new Set(e);for(let e=this.walkers.length-1;e>=0;e--)t.has(this.walkers[e])&&this.walkers.splice(e,1)}get loaded(){return this.casts.size}play(e,t,n){if(e.rate=n,e.clip===t)return;let r=this.casts.get(e.cast)?.clips.get(t);r&&(e.prevClip=e.clip,e.prevFrame=e.frame,e.prevRate=e.rate,e.blend=1,e.clip=t,e.frame=this.rng.next()*r.frames*.5,e.toolShown=+!il[e.cast].hideTool.includes(t))}update(e,t,n,r,i,a){for(let e of this.casts.values())e.near.begin(),e.far.begin();let o=0;for(let s of this.walkers){let c=this.casts.get(s.cast);if(!c||(s.active=Math.hypot(s.x-t,s.z-n)<r+(s.active?40:0),!s.active))continue;s.role===`road`?this.stepRoad(s,e,i):this.stepWander(s,e,a),this.advanceClips(s,c,e);let l=Math.hypot(s.x-i.x,this.ground.height(s.x,s.z)-i.y,s.z-i.z);if(l>r*1.5)continue;let u=this.ground.height(s.x,s.z),d=c.clips.get(s.clip),f=c.clips.get(s.prevClip);(l<nl?c.near:c.far).pushYaw(s.x,u,s.z,s.yaw,s.scale,d.row,d.frames,s.frame,s.toolShown,f?f.row:d.row,f?f.frames:d.frames,f?s.prevFrame:0,f?s.blend:0),o++}for(let e of this.casts.values())e.near.commit(),e.far.commit();return o}advanceClips(e,t,n){let r=t.clips.get(e.clip);if(r&&(e.frame=(e.frame+n*tl*e.rate)%r.frames,e.blend>0)){e.blend=Math.max(0,e.blend-n/cl);let r=t.clips.get(e.prevClip);r&&(e.prevFrame=(e.prevFrame+n*tl*e.prevRate)%r.frames)}}stepRoad(e,t,n){let r=e.route,i=Kc(r),a=il[e.cast],o=this.rng;if(e.state===dl){let n=Jc(r,e.s),s=Math.atan2(n.x*e.dir,n.z*e.dir),c=Math.abs(lc(e.yaw,s)),l=e.speed*Math.min(1,Math.max(0,1-c/1.2));l=Math.min(l,this.gapSpeed(e)),e.s+=e.dir*l*t,e.nextPause-=l*t,this.play(e,a.walk,Math.max(l,e.speed*.45)/a.walkSpeed);let u=Math.min(e.inset,i*.25);if(e.s<=u||e.s>=i-u){e.s=Math.min(i-u,Math.max(u,e.s)),e.state=pl,e.timer=o.range(5,12);let t=o.next()<.6?a.work:a.idle;this.play(e,t[Math.floor(o.next()*t.length)],o.range(.9,1.1))}else e.nextPause<=0&&(e.state=fl,e.timer=o.range(2,5),e.nextPause=o.range(25,60),this.play(e,a.idle[Math.floor(o.next()*a.idle.length)],o.range(.9,1.1)))}else e.timer-=t,e.timer<=0&&(e.state===pl&&(e.dir=e.s>=i*.5?-1:1),e.state=dl);e.offset+=(e.keep*e.dir-e.offset)*(1-Math.exp(-t/1.6));let s=Jc(r,e.s),c=e.state===dl?Math.atan2(s.x*e.dir,s.z*e.dir):e.yaw;e.yaw+=lc(e.yaw,c)*(1-Math.exp(-t*3));let l=qc(r,e.s);r.road&&(l=el(l.x,l.z,Math.hypot(l.x-n.x,l.z-n.z,n.y-this.ground.height(l.x,l.z)))),e.x=l.x+s.z*e.offset,e.z=l.z-s.x*e.offset}gapSpeed(e){let t=1/0;for(let n of this.walkers){if(n===e||n.route!==e.route)continue;let r=(n.s-e.s)*e.dir;r>0&&r<2.2&&n.dir===e.dir&&Math.abs(n.offset-e.offset)<.9&&(t=Math.min(t,n.state===dl?n.speed*.9:0))}return t}stepWander(e,t,n){let r=il[e.cast],i=this.rng;if(e.follow&&(e.ax=e.follow.x,e.az=e.follow.z),e.state===dl){let a=e.tx-e.x,o=e.tz-e.z,s=Math.hypot(a,o);if(s<.3){e.state=e.role===`field`?pl:fl,e.timer=e.role===`field`?i.range(6,16):i.range(3,9);let t=e.acts??(e.role===`field`?this.fieldWork(e.cast,n):i.next()<.3?r.work:r.idle);this.play(e,t[Math.floor(i.next()*t.length)],i.range(.9,1.1))}else{let n=Math.atan2(a,o),i=Math.abs(lc(e.yaw,n));e.yaw+=lc(e.yaw,n)*(1-Math.exp(-t*4));let c=e.speed*Math.min(1,Math.max(0,1-i/1.2))*Math.min(1,s/.8+.3),l=e.x+Math.sin(e.yaw)*c*t,u=e.z+Math.cos(e.yaw)*c*t;this.ground.walkable(l,u,.7)&&!this.ground.blocked(l,u,.4)?(e.x=l,e.z=u):(e.tx=e.x,e.tz=e.z),this.play(e,r.walk,Math.max(c,e.speed*.45)/r.walkSpeed)}}else if(e.timer-=t,e.timer<=0){for(let t=0;t<8;t++){let t=i.next()*$,n=e.role===`field`?i.range(1.5,5):i.range(3,10),r=e.x+Math.cos(t)*n,a=e.z+Math.sin(t)*n;if(Math.hypot(r-e.ax,a-e.az)>e.anchorR&&(r=e.ax+(r-e.ax)*.3,a=e.az+(a-e.az)*.3),this.ground.walkable(r,a,.75)&&!this.ground.blocked(r,a,.8)&&!this.walkers.some(t=>t!==e&&Math.min(Math.hypot(t.tx-r,t.tz-a),Math.hypot(t.x-r,t.z-a))<1.3)){e.tx=r,e.tz=a;break}}e.state=dl}}fieldWork(e,t){let n=il[e];return e===`farmer`?t===0?[`Pull_Radish`]:t===3?n.idle:[`Reaping_Swing`,`Reaping_Swing`,`Pull_Radish`]:n.work}};U(`lifeWindow`,`
precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec4 aWin;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vWin;
void main() {
#include<instancesVertex>
  // Windows swell with distance so a lit village still twinkles from the board.
  float dist = length(finalWorld[3].xyz - uCamPos);
  vec3 p = position * (1.0 + 1.3 * smoothstep(50.0, 380.0, dist));
  vec4 wp = finalWorld * vec4(p, 1.0);
  vWorld = wp.xyz;
  vUv = uv;
  vWin = aWin;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vWin;
${V}
${H}
uniform float uLamps;
uniform float uLitFrac;
void main() {
  float lit = step(vWin.x, uLitFrac);
  float lamps = uLamps * lit;
  if (lamps < 0.02) discard;
  vec2 edge = min(vUv, 1.0 - vUv);
  float panes = smoothstep(0.06, 0.11, min(edge.x, edge.y));
  panes *= smoothstep(0.026, 0.05, abs(vUv.x - 0.5));
  panes *= smoothstep(0.025, 0.045, abs(vUv.y - 0.52));
  if (panes < 0.04) discard;
  // Candle flicker, a little different in every window.
  float flick = 0.93 + 0.07 * sin(uTime * 7.3 + vWin.y * 40.0) * sin(uTime * 2.9 + vWin.y * 17.0);
  float glow = lamps * (0.78 + vWin.y * 0.22) * panes * flick;
  // Warmer and dimmer low in the frame, brighter near the top of the pane, like a lit room seen from outside.
  vec3 room = mix(vec3(1.0, 0.36, 0.07), vec3(1.0, 0.55, 0.18), vUv.y * 0.6);
  vec3 col = mix(vec3(0.004, 0.003, 0.002), room * 5.5, glow);
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`lifeSpill`,`
precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec4 aWin;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vWin;
void main() {
#include<instancesVertex>
  float dist = length(finalWorld[3].xyz - uCamPos);
  vec4 wp = finalWorld * vec4(position * (1.0 + 0.8 * smoothstep(50.0, 380.0, dist)), 1.0);
  vWorld = wp.xyz;
  vUv = uv;
  vWin = aWin;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec2 vUv;
varying vec4 vWin;
${V}
${H}
uniform float uLamps;
uniform float uLitFrac;
void main() {
  float lit = step(vWin.x, uLitFrac);
  vec2 d = (vUv - vec2(0.5, 0.42)) * vec2(1.0, 1.25);
  float r2 = dot(d, d) * 4.0;
  float a = exp(-r2 * 2.2) * uLamps * lit;
  if (a < 0.003) discard;
  vec3 col = vec3(1.0, 0.42, 0.12) * a * 0.55;
  float fog = 1.0 - exp(-length(vWorld - uCamPos) * uFogParams.x);
  gl_FragColor = vec4(col * (1.0 - fog), 1.0);
}
`),U(`lifeGlow`,`
precision highp float;
attribute vec3 position;
attribute vec4 aGlow;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform mat4 view;
uniform vec3 uCamPos;
varying vec2 vQuad;
varying vec4 vGlow;
varying vec3 vWorld;
varying float vFade;
void main() {
#include<instancesVertex>
  vec3 origin = finalWorld[3].xyz;
  float size = length(finalWorld[0].xyz);
  vec3 toCam = uCamPos - origin;
  float dist = length(toCam);
  float grow = clamp(dist * 0.012, 1.0, abs(aGlow.w));
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  // Pulled toward the camera so the lantern's own glass never clips the sprite.
  vec3 wp = origin + toCam / max(dist, 1e-3) * min(size * grow * 0.8, dist * 0.5) + (right * position.x + up * position.y) * size * grow;
  vQuad = position.xy;
  vGlow = aGlow;
  vWorld = origin;
  // House glows only matter from far away, where the windows themselves are sub-pixel.
  vFade = aGlow.w < 0.0 ? smoothstep(120.0, 380.0, dist) * 0.7 : 1.0;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec2 vQuad;
varying vec4 vGlow;
varying vec3 vWorld;
varying float vFade;
${V}
${H}
uniform float uLamps;
void main() {
  float r2 = dot(vQuad, vQuad);
  float a = min(exp(-8.0 * r2) + 0.3 * exp(-3.0 * r2), 1.0) * smoothstep(1.0, 0.7, r2);
  a *= vFade;
  if (a < 0.004) discard;
  float flick = 0.94 + 0.06 * sin(uTime * 9.0 + vWorld.x * 3.1) * sin(uTime * 4.3 + vWorld.z * 2.3);
  vec3 col = vGlow.rgb * a * uLamps * flick;
  float fog = 1.0 - exp(-length(vWorld - uCamPos) * uFogParams.x * 0.6);
  gl_FragColor = vec4(col * (1.0 - fog * 0.8), 1.0);
}
`),U(`lifePool`,`
precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec2 uv2;
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec2 vUv;
varying vec2 vData;
void main() {
  vWorld = position;
  vUv = uv;
  vData = uv2;
  gl_Position = viewProjection * vec4(position, 1.0);
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec2 vUv;
varying vec2 vData;
${V}
${H}
uniform float uLamps;
void main() {
  float r = length(vUv);
  float pool = 1.0 - smoothstep(0.0, 1.0, r);
  pool *= pool;
  // A little unevenness so pools read as lamplight on rough ground, not stamped discs.
  pool *= 0.85 + 0.3 * vnoise(vWorld.xz * 0.7);
  vec3 col = vec3(1.0, 0.45, 0.12) * pool * uLamps * vData.x * 0.4;
  float fog = 1.0 - exp(-length(vWorld - uCamPos) * uFogParams.x * 0.6);
  gl_FragColor = vec4(col * (1.0 - fog), 1.0);
}
`),U(`lifeStreak`,`
precision highp float;
attribute vec3 position;
attribute vec4 aStreak;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform vec3 uCamPos;
uniform float uTime;
varying vec2 vQuad;
varying vec3 vWorld;
varying vec4 vStreak;
${vc}
void main() {
#include<instancesVertex>
  vec3 origin = finalWorld[3].xyz;
  vec2 toCam = uCamPos.xz - origin.xz;
  float d = max(length(toCam), 1.0);
  vec2 along = toCam / d;
  vec2 side = vec2(-along.y, along.x);
  // Steeper views squeeze the reflection, grazing ones stretch it toward the viewer.
  float elev = atan(uCamPos.y - origin.y, d);
  float len = aStreak.x * clamp(1.4 / max(sin(elev), 0.05), 2.0, 22.0);
  float wid = aStreak.y;
  vec2 p = origin.xz + along * (position.y * 0.5 + 0.5) * len + side * position.x * wid;
  vec3 wp = vec3(p.x, 0.0, p.y);
  wp.y = lifeSwell(wp.xz, uTime, uCamPos) + 0.12;
  vQuad = vec2(position.x, position.y * 0.5 + 0.5);
  vWorld = wp;
  vStreak = aStreak;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec2 vQuad;
varying vec3 vWorld;
varying vec4 vStreak;
${V}
${H}
uniform float uLamps;
void main() {
  float across = exp(-vQuad.x * vQuad.x * 4.0);
  float along = smoothstep(0.0, 0.08, vQuad.y) * (1.0 - smoothstep(0.35, 1.0, vQuad.y));
  float bands = smoothstep(0.35, 0.8, vnoise(vec2(vWorld.x * 0.9 + uTime * 0.4, vWorld.z * 0.9 - uTime * 0.6) * 1.7) * 0.6 + vnoise(vWorld.xz * 3.1 + uTime * 0.8) * 0.5);
  float a = across * along * bands * uLamps * vStreak.z;
  vec3 col = vec3(1.0, 0.5, 0.16) * a * 1.6;
  float fog = 1.0 - exp(-length(vWorld - uCamPos) * uFogParams.x * 0.6);
  gl_FragColor = vec4(col * (1.0 - fog), 1.0);
}
`),U(`lifeBeam`,`
precision highp float;
attribute vec3 position;
attribute vec2 uv;
#include<instancesDeclaration>
uniform mat4 viewProjection;
varying vec2 vUv;
varying vec3 vWorld;
void main() {
#include<instancesVertex>
  vec4 wp = finalWorld * vec4(position, 1.0);
  vUv = uv;
  vWorld = wp.xyz;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec2 vUv;
varying vec3 vWorld;
${V}
${H}
uniform float uLamps;
uniform float uHaze;
void main() {
  float across = 1.0 - smoothstep(0.15, 1.0, abs(vUv.x * 2.0 - 1.0));
  float along = (1.0 - smoothstep(0.0, 1.0, vUv.y)) * smoothstep(0.0, 0.02, vUv.y);
  float n = 0.8 + 0.4 * vnoise(vWorld.xz * 0.05 + uTime * 0.2);
  float a = across * along * n * uLamps * (0.14 + 0.25 * uHaze);
  gl_FragColor = vec4(vec3(1.0, 0.8, 0.5) * a, 1.0);
}
`),U(`lifeLantern`,`
precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
#include<instancesDeclaration>
uniform mat4 viewProjection;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
void main() {
#include<instancesVertex>
  vec4 wp = finalWorld * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(finalWorld) * normal);
  vColor = color;
  gl_Position = viewProjection * wp;
}
`,`
precision highp float;
varying vec3 vWorld;
varying vec3 vNormal;
varying vec4 vColor;
${V}
${H}
uniform float uLamps;
void main() {
  vec3 n = normalize(vNormal);
  vec3 base = pow(vColor.rgb, vec3(2.2));
  float sh;
  vec3 col = shade(base, n, vWorld, 1.0, 0.3, sh);
  col += vec3(1.0, 0.45, 0.1) * vColor.a * uLamps * 6.0;
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, viewDepth01(vWorld));
}
`),U(`lifeLanternDepth`,`
precision highp float;
attribute vec3 position;
#include<instancesDeclaration>
uniform mat4 viewProjection;
void main() {
#include<instancesVertex>
  gl_Position = viewProjection * (finalWorld * vec4(position, 1.0));
}
`,`
precision highp float;
void main() { gl_FragColor = vec4(1.0); }
`),U(`lifeFirefly`,`
precision highp float;
attribute vec3 position;
attribute vec4 aFly;
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform mat4 view;
uniform vec3 uCamPos;
uniform float uTime;
varying vec2 vQuad;
varying float vBlink;
varying vec3 vWorld;
void main() {
#include<instancesVertex>
  vec3 o = finalWorld[3].xyz;
  float s = aFly.x;
  float t = uTime * (0.25 + 0.2 * fract(s * 7.1));
  vec3 drift = vec3(sin(t + s * 6.0) * 1.6 + sin(t * 2.3 + s) * 0.5, 0.5 + 0.35 * sin(t * 1.7 + s * 3.0), cos(t * 0.9 + s * 4.0) * 1.6);
  vec3 p = o + drift;
  float dist = length(uCamPos - p);
  float size = 0.05 * clamp(dist * 0.03, 1.0, 4.0);
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  vec3 wp = p + (right * position.x + up * position.y) * size;
  vQuad = position.xy;
  // Each fly glows for a second or two, then rests.
  float ph = fract(uTime * (0.18 + 0.1 * fract(s * 3.7)) + s);
  vBlink = smoothstep(0.0, 0.15, ph) * (1.0 - smoothstep(0.3, 0.5, ph));
  vWorld = p;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec2 vQuad;
varying float vBlink;
varying vec3 vWorld;
${V}
${H}
uniform float uAmount;
void main() {
  float r2 = dot(vQuad, vQuad);
  float a = exp(-r2 * 5.0) * vBlink * uAmount;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vec3(0.95, 0.85, 0.35) * a * 4.0, 1.0);
}
`);var hl={cottage:{model:`cottage`,floors:1,perFace:2,door:!0},timber:{model:`timber`,floors:2,perFace:3,door:!0},south:{model:`poi_south_cottage`,floors:1,perFace:2,door:!0},poi_south_cottage:{model:`poi_south_cottage`,floors:1,perFace:2,door:!0},croft:{model:`poi_croft`,floors:1,perFace:2,door:!0},poi_croft:{model:`poi_croft`,floors:1,perFace:2,door:!0},chapel:{model:`chapel`,floors:1,perFace:3,door:!0},barn:{model:`barn`,floors:1,perFace:1,door:!0},keep:{model:`keep`,floors:3,perFace:3,door:!1},tower:{model:`tower`,floors:2,perFace:2,door:!1},gatehouse:{model:`gatehouse`,floors:1,perFace:2,door:!0},poi_fishhut:{model:`poi_fishhut`,floors:1,perFace:2,door:!0},poi_cabin:{model:`poi_cabin`,floors:1,perFace:2,door:!0},poi_hermit:{model:`poi_hermit`,floors:1,perFace:1,door:!0},poi_villa:{model:`poi_villa`,floors:1,perFace:3,door:!0},poi_abbey:{model:`poi_abbey`,floors:2,perFace:3,door:!0}},gl=new Set([`cottage`,`timber`,`south`,`poi_south_cottage`,`croft`,`poi_croft`,`poi_cabin`,`poi_fishhut`,`poi_hermit`]),_l=class{scene;ground;templates=new Map;windowGroups=new Map;lamps=new Map;beacons=[];nextId=1;windows;spill;glows;streaks;beams;posts;flies;pools;dirty={windows:!0,lamps:!0,pools:!0};shipLamps=[];flyFocus={x:1e9,z:1e9};flyPts=[];lamps01=0;windowLamps=0;litFrac=1;haze=0;fireflies=0;onChimneys=null;constructor(e,t,n,r){this.scene=e,this.ground=r;let i=t,a=(e,t)=>{e.onBindObservable.add(()=>{let n=e.getEffect();n&&(n.setFloat(`uLamps`,this.lamps01),t?.(n))})},o=xc([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],[0,0,1,0,0,1,0,0,1,0,0,1],[0,2,1,0,3,2],{uvs:[0,0,1,0,1,1,0,1]}),s=xc([-1,-1,0,1,-1,0,1,1,0,-1,1,0],null,[0,1,2,0,2,3]),c=i.material(`life_windows`,`lifeWindow`,{attributes:[`position`,`uv`,`aWin`],uniforms:[`uLamps`,`uLitFrac`]});c.backFaceCulling=!0,a(c,e=>{e.setFloat(`uLitFrac`,this.litFrac),e.setFloat(`uLamps`,this.windowLamps)}),this.windows=new bc(e,`life_windows`,o,c,[{name:`aWin`,stride:4}],1);let l=i.material(`life_spill`,`lifeSpill`,{attributes:[`position`,`uv`,`aWin`],uniforms:[`uLamps`,`uLitFrac`],needAlphaBlending:!0});a(l,e=>{e.setFloat(`uLitFrac`,this.litFrac),e.setFloat(`uLamps`,this.windowLamps)}),this.spill=new bc(e,`life_spill`,o,l,[{name:`aWin`,stride:4}],2),yc(this.spill.mesh,l,`add`),l.zOffset=-2;let u=i.material(`life_glows`,`lifeGlow`,{attributes:[`position`,`aGlow`],uniforms:[`uLamps`,`view`],needAlphaBlending:!0});a(u),this.glows=new bc(e,`life_glows`,s,u,[{name:`aGlow`,stride:4}],30),yc(this.glows.mesh,u,`add`),u.backFaceCulling=!1;let d=i.material(`life_streaks`,`lifeStreak`,{attributes:[`position`,`aStreak`],uniforms:[`uLamps`],needAlphaBlending:!0});a(d),this.streaks=new bc(e,`life_streaks`,s,d,[{name:`aStreak`,stride:4}],200),yc(this.streaks.mesh,d,`add`),d.backFaceCulling=!1;let f=i.material(`life_beams`,`lifeBeam`,{attributes:[`position`,`uv`],uniforms:[`uLamps`,`uHaze`],needAlphaBlending:!0});a(f,e=>e.setFloat(`uHaze`,this.haze)),this.beams=new bc(e,`life_beams`,vl(),f,[],200),yc(this.beams.mesh,f,`add`),f.backFaceCulling=!1;let p=i.material(`life_lanterns`,`lifeLantern`,{attributes:[`position`,`normal`,`color`],uniforms:[`uLamps`]});a(p);let m=i.material(`life_lanternsDepth`,`lifeLanternDepth`,{attributes:[`position`],lit:!1});this.posts=new bc(e,`life_lanterns`,yl(),p,[],3),n.addCaster(this.posts.mesh,m,0);let h=i.material(`life_fireflies`,`lifeFirefly`,{attributes:[`position`,`aFly`],uniforms:[`view`,`uAmount`],needAlphaBlending:!0});h.onBindObservable.add(()=>h.getEffect()?.setFloat(`uAmount`,this.fireflies)),this.flies=new bc(e,`life_fireflies`,s,h,[{name:`aFly`,stride:4}],4),yc(this.flies.mesh,h,`add`),h.backFaceCulling=!1,this.pools=new v(`life_pools`,e),this.pools.isPickable=!1,this.pools.alwaysSelectAsActiveMesh=!0;let g=i.material(`life_pools`,`lifePool`,{attributes:[`position`,`uv`,`uv2`],uniforms:[`uLamps`],needAlphaBlending:!0});a(g),g.zOffset=-4,g.backFaceCulling=!1,this.pools.material=g,yc(this.pools,g,`add`),this.pools.setEnabled(!1);for(let e of[this.windows,this.spill,this.glows,this.streaks,this.beams,this.posts,this.flies])e.mesh.alwaysSelectAsActiveMesh=!0}template(e,t){let n=this.templates.get(e);return n||this.templates.set(e,n=gr(this.scene,e).then(e=>bl(e,t))),n}addWindows(e){let t=this.nextId++,n={win:[],glows:[],doors:[],chimneys:[],lanterns:[]};this.windowGroups.set(t,n);let r=e.map(async e=>{let r=hl[e.kind];if(!r)return;let i=await this.template(r.model,r);if(!this.windowGroups.has(t))return;let a=Math.cos(e.yaw),o=Math.sin(e.yaw),s=e.scale,c=e.mirror?-1:1,l=(t,n)=>({x:e.x+(t*c*a+n*o)*s,z:e.z+(-t*c*o+n*a)*s}),u=new sc(cc(e.x*4,e.z*4,31)),d=0,f=0,p=0;for(let t of i.windows){let r=l(t.x,t.z),i=t.nx*c*a+t.nz*o,m=-t.nx*c*o+t.nz*a;n.win.push([r.x+i*.05,e.y+t.y*s,r.z+m*.05,i,m,u.next(),u.next()]),d+=r.x,f+=e.y+t.y*s,p+=r.z}if(i.windows.length&&n.glows.push([d/i.windows.length,f/i.windows.length+.6,p/i.windows.length]),i.door&&r.door){let t=l(i.door.x,i.door.z),r=i.door.nx*c*a+i.door.nz*o,d=-i.door.nx*c*o+i.door.nz*a;if(n.doors.push({x:t.x+r*2.2,y:e.y,z:t.z+d*2.2}),u.next()<.5){let i=d*.9*(u.next()<.5?1:-1),a=-r*.9;n.lanterns.push({x:t.x+r*.35+i,y:e.y+2.3*s,z:t.z+d*.35+a})}}if(gl.has(e.kind)){let t=l(i.chimney.x,i.chimney.z);n.chimneys.push({x:t.x,y:e.y+i.chimney.y*s,z:t.z})}});return Promise.all(r).then(()=>{this.dirty.windows=!0,this.dirty.pools=!0,this.onChimneys?.(n.chimneys,t)}),t}removeWindows(e){this.windowGroups.delete(e)&&(this.dirty.windows=!0,this.dirty.pools=!0)}addLamp(e,t,n,r=`lantern`){let i=this.nextId++,a=r===`lantern`;return this.lamps.set(i,{id:i,x:e,y:t,z:n,kind:r,post:a,pool:r===`beacon`||r===`string`?0:r===`wall`?6:8.5}),this.dirty.lamps=!0,this.dirty.pools=!0,i}removeLamp(e){this.lamps.delete(e)&&(this.dirty.lamps=!0,this.dirty.pools=!0)}addBeacon(e,t,n){let r=this.addLamp(e,t,n,`beacon`);return this.beacons.push({x:e,y:t,z:n,phase:(e*.013+n*.007)%1*$,lamp:r}),r}removeBeacon(e){this.beacons=this.beacons.filter(t=>t.lamp!==e),this.removeLamp(e)}setShipLamps(e){this.shipLamps=e}rebuildWindows(){this.windows.begin(),this.spill.begin();for(let e of this.windowGroups.values())for(let[t,n,r,i,a,o,s]of e.win){let e=a,c=-i;this.windows.push(e*.64,0,c*.64,0,.82,0,i,0,a,t,n,r,o,s,0,0),this.spill.push(e*2.6,0,c*2.6,0,2.4,0,i,0,a,t+i*.03,n+.1,r+a*.03,o,s,0,0)}this.windows.commit(),this.spill.commit()}rebuildPosts(){this.posts.begin();for(let e of this.lamps.values())e.post&&this.posts.pushYaw(e.x,e.y,e.z,(e.x*.37+e.z*.11)%$,1);this.posts.commit()}rebuildPools(){let e=[];for(let t of this.lamps.values())t.pool>0&&e.push({x:t.x,z:t.z,r:t.pool,k:t.kind===`wall`?.8:1});for(let t of this.windowGroups.values()){for(let n of t.doors)e.push({x:n.x,z:n.z,r:7,k:.75});for(let n of t.lanterns)e.push({x:n.x,z:n.z,r:5,k:.6})}let t=[],n=[],r=[],i=[];for(let a of e){let e=t.length/3;t.push(a.x,this.ground.height(a.x,a.z)+.06,a.z),n.push(0,0),r.push(a.k,0);for(let e=1;e<=3;e++){let i=e/3*a.r;for(let o=0;o<20;o++){let s=o/20*$,c=a.x+Math.cos(s)*i,l=a.z+Math.sin(s)*i;t.push(c,Math.max(this.ground.height(c,l),.05)+.06,l),n.push(Math.cos(s)*e/3,Math.sin(s)*e/3),r.push(a.k,0)}}for(let t=0;t<20;t++)i.push(e,e+1+(t+1)%20,e+1+t);for(let t=1;t<3;t++){let n=e+1+(t-1)*20,r=e+1+t*20;for(let e=0;e<20;e++){let t=(e+1)%20;i.push(n+e,n+t,r+e,n+t,r+t,r+e)}}}e.length?(this.pools.setVerticesData(a.PositionKind,t,!1,3),this.pools.setVerticesData(a.UVKind,n,!1,2),this.pools.setVerticesData(a.UV2Kind,r,!1,2),this.pools.setIndices(i),this.pools.setEnabled(!0)):this.pools.setEnabled(!1)}placeFlies(e,t){if(Math.hypot(e-this.flyFocus.x,t-this.flyFocus.z)<30)return;this.flyFocus={x:e,z:t};let n=new sc(cc(e/30,t/30,5));this.flyPts=[];for(let r=0;r<700&&this.flyPts.length<360;r++){let r=n.next()*$,i=Math.sqrt(n.next())*90,a=e+Math.cos(r)*i,o=t+Math.sin(r)*i;this.ground.walkable(a,o,.8,1)&&this.flyPts.push({x:a,y:this.ground.height(a,o),z:o})}}update(e,t,n,r,i){this.dirty.windows&&(this.dirty.windows=!1,this.rebuildWindows()),this.dirty.lamps&&(this.dirty.lamps=!1,this.rebuildPosts()),this.dirty.pools&&(this.dirty.pools=!1,this.rebuildPools());let a=this.lamps01>.01;for(let e of[this.glows,this.streaks,this.beams])e.mesh.setEnabled(a);if(this.pools.setEnabled(a&&this.pools.getTotalVertices()>0),!a)return;this.glows.begin(),this.streaks.begin();let o=(e,t,i)=>(e-n)**2+(t-r)**2<i*i,s=(e,t,n,r,i,a)=>{this.ground.height(e,n)>1.5&&!this.waterNear(e,n)||this.streaks.push(1,0,0,0,1,0,0,0,1,e,0,n,r,i,a,0)};for(let e of this.lamps.values()){if(e.kind===`beacon`){o(e.x,e.z,4e3)&&s(e.x,e.y,e.z,6,3,1.2);continue}if(!o(e.x,e.z,2500))continue;if(e.kind===`string`){this.glows.push(.3,0,0,0,.3,0,0,0,.3,e.x,e.y,e.z,1,.56,.16,3);continue}let t=e.post?2.55:0;this.glows.push(.55,0,0,0,.55,0,0,0,.55,e.x,e.y+t,e.z,1,.46,.1,5),s(e.x,e.y+t,e.z,1.5,.7,.8)}for(let e of this.shipLamps)this.glows.push(.5,0,0,0,.5,0,0,0,.5,e.x,e.y,e.z,1,.5,.12,5),s(e.x,e.y,e.z,2,.9,1);for(let e of this.windowGroups.values()){for(let t of e.lanterns)o(t.x,t.z,2500)&&(this.glows.push(.42,0,0,0,.42,0,0,0,.42,t.x,t.y,t.z,1,.46,.1,4),s(t.x,t.y,t.z,1.2,.6,.6));for(let n of e.glows)!o(n[0],n[2],3e3)||(n[0]-t.x)**2+(n[1]-t.y)**2+(n[2]-t.z)**2<14400||this.glows.push(1.2,0,0,0,1.2,0,0,0,1.2,n[0],n[1],n[2],.9,.38,.08,-6)}this.glows.commit(),this.streaks.commit(),this.beams.begin();for(let e of this.beacons){if(!o(e.x,e.z,3e3))continue;let t=e.phase+i*.5;for(let n of[0,Math.PI]){let r=t+n,i=Math.cos(r),a=Math.sin(r);this.beams.push(i,0,-a,0,1,0,a,0,i,e.x,e.y,e.z)}}this.beams.commit(),this.flies.mesh.setEnabled(this.fireflies>.01&&t.y-this.ground.height(n,r)<160),this.flies.mesh.isEnabled()&&(this.placeFlies(n,r),this.flies.begin(),this.flyPts.forEach((e,t)=>this.flies.push(1,0,0,0,1,0,0,0,1,e.x,e.y,e.z,t*.618%1*10,0,0,0)),this.flies.commit())}waterCache=new Map;waterNear(e,t){let n=Math.round(e/8)*100003+Math.round(t/8),r=this.waterCache.get(n);if(r===void 0){r=!1;for(let n=0;n<8&&!r;n++){let i=n/8*$;this.ground.height(e+Math.cos(i)*30,t+Math.sin(i)*30)<-.5&&(r=!0)}this.waterCache.set(n,r)}return r}lightPoints(){let e=[];for(let t of this.lamps.values())t.kind!==`string`&&(t.kind===`beacon`?e.push([t.x,t.y,t.z,24,1,.7,.35]):t.post?e.push([t.x,t.y+2.6,t.z,11,1,.5,.18]):e.push([t.x,t.y,t.z,7,.8,.4,.14]));for(let t of this.windowGroups.values()){for(let n of t.lanterns)e.push([n.x,n.y,n.z,8,.9,.45,.15]);for(let n of t.glows)e.push([n[0],n[1]-.6,n[2],9,.55*this.litFrac,.25*this.litFrac,.07*this.litFrac])}for(let t of this.shipLamps)e.push([t.x,t.y,t.z,11,1,.5,.18]);return e}stats(){return{windows:this.windows.count,lamps:this.lamps.size,glows:this.glows.count,streaks:this.streaks.count,beacons:this.beacons.length}}};function vl(){let e=[],t=[],n=[];for(let r of[0,1]){let i=e.length/3,a=e=>r===0?[0,e,0]:[0,0,e],o=a(-.5),s=a(.5),c=a(8),l=a(-8);e.push(0,o[1],o[2],0,s[1],s[2],170,c[1],c[2],170,l[1],l[2]),t.push(0,0,1,0,1,1,0,1),n.push(i,i+1,i+2,i,i+2,i+3)}return xc(e,null,n,{uvs:t})}function yl(){let e=[],t=[],n=[],r=[],i=(i,a,o,s,c,l,u)=>{let d=[[[1,0,0],[[s,a,o],[s,c,o],[s,c,l],[s,a,l]]],[[-1,0,0],[[i,a,l],[i,c,l],[i,c,o],[i,a,o]]],[[0,1,0],[[i,c,o],[i,c,l],[s,c,l],[s,c,o]]],[[0,-1,0],[[i,a,l],[i,a,o],[s,a,o],[s,a,l]]],[[0,0,1],[[s,a,l],[s,c,l],[i,c,l],[i,a,l]]],[[0,0,-1],[[i,a,o],[i,c,o],[s,c,o],[s,a,o]]]];for(let[i,a]of d){let o=e.length/3;for(let r of a)e.push(...r),t.push(...i),n.push(...u);r.push(o,o+2,o+1,o,o+3,o+2)}},a=[.33,.24,.16,0],o=[.16,.15,.14,0];return i(-.07,0,-.07,.07,2.4,.07,a),i(-.17,2.4,-.17,.17,2.44,.17,o),i(-.12,2.44,-.12,.12,2.72,.12,[1,.75,.4,1]),i(-.18,2.72,-.18,.18,2.77,.18,o),i(-.06,2.77,-.06,.06,2.86,.06,o),xc(e,t,r,{colors:n})}function bl(e,t){let n=e.vertexData.positions,r=e.vertexData.indices,i=r.length/3,a=(e,t,a,o,s,c)=>{let l=1/0,u=[0,0,0];for(let d=0;d<i;d++){let i=r[d*3]*3,f=r[d*3+1]*3,p=r[d*3+2]*3,m=n[i],h=n[i+1],g=n[i+2],_=n[f]-m,v=n[f+1]-h,y=n[f+2]-g,b=n[p]-m,x=n[p+1]-h,S=n[p+2]-g,C=s*S-c*x,w=c*b-o*S,T=o*x-s*b,E=_*C+v*w+y*T;if(Math.abs(E)<1e-9)continue;let D=1/E,O=e-m,k=t-h,A=a-g,j=(O*C+k*w+A*T)*D;if(j<0||j>1)continue;let ee=k*y-A*v,te=A*_-O*y,M=O*v-k*_,ne=(o*ee+s*te+c*M)*D;if(ne<0||j+ne>1)continue;let N=(b*ee+x*te+S*M)*D;if(N>1e-4&&N<l){l=N;let e=v*S-y*x,t=y*b-_*S,n=_*x-v*b,r=Math.hypot(e,t,n)||1;e/=r,t/=r,n/=r,e*o+t*s+n*c>0&&(e=-e,t=-t,n=-n),u=[e,t,n]}}return l<1/0?{t:l,nx:u[0],ny:u[1],nz:u[2]}:null},o=(e.max[0]-e.min[0])/2,s=(e.max[2]-e.min[2])/2,c=(e.max[0]+e.min[0])/2,l=(e.max[2]+e.min[2])/2,u=[],d=[[1,0],[-1,0],[0,1],[0,-1]];for(let n=0;n<t.floors;n++){let r=(1.7+2.6*n)/.85;if(r>e.height*.8)break;for(let[e,n]of d){let i=e===0?o:s,d=Math.min(t.perFace,Math.max(1,Math.floor(i*2/2.1)));for(let t=0;t<d;t++){let i=(t-(d-1)/2)*2.1,f=c+e*30+(n===0?0:i),p=l+n*30+(e===0?0:i),m=a(f,r,p,-e,0,-n);if(!m||Math.abs(m.ny)>.45||30-m.t<(e===0?s:o)*.25)continue;let h=Math.hypot(m.nx,m.nz)||1;u.push({x:f-e*m.t,y:r,z:p-n*m.t,nx:m.nx/h,nz:m.nz/h})}}}let f=null,p=a(c,1,l+30,0,0,-1);p&&(f={x:c,z:l+30-p.t,nx:0,nz:1});let m=[];for(let t=0;t<14;t++)for(let n=0;n<14;n++){let r=e.min[0]+(n+.5)/14*(o*2),i=e.min[2]+(t+.5)/14*(s*2),c=a(r,e.height+5,i,0,-1,0);m.push(c?e.height+5-c.t:0)}let h=-1,g=-1;for(let e=2;e<12;e++)for(let t=2;t<12;t++){let n=m[e*14+t],r=0;for(let[n,i]of[[-2,0],[2,0],[0,-2],[0,2],[-2,-2],[2,2],[-2,2],[2,-2]])r+=m[(e+i)*14+t+n];let i=n-r/8;i>h&&(h=i,g=e*14+t)}let _={x:c+o*.44,y:e.height*.92,z:l};if(g>=0&&h>.5){let t=g%14,n=Math.floor(g/14);_={x:e.min[0]+(t+.5)/14*(o*2),y:m[g]+.15,z:e.min[2]+(n+.5)/14*(s*2)}}return{windows:u,door:f,chimney:_}}var xl=14;U(`lifeSmoke`,`
precision highp float;
attribute vec3 position;
attribute vec4 aPuff;    // seed, life seconds, size, rise metres per second
#include<instancesDeclaration>
uniform mat4 viewProjection;
uniform mat4 view;
uniform vec3 uCamPos;
uniform float uTime;
uniform vec2 uWind;
varying vec2 vQuad;
varying float vAge;
varying vec3 vWorld;
varying float vSeed;
void main() {
#include<instancesVertex>
  vec3 o = finalWorld[3].xyz;
  float seed = aPuff.x;
  float life = aPuff.y;
  float age = fract(uTime / life + seed);
  float t = age * life;
  // Rises fast out of the pot and slows as it cools, leaning downwind and curling.
  float rise = aPuff.w * (t - 0.04 * t * t);
  vec3 p = o + vec3(uWind.x, 0.0, uWind.y) * t * t * 0.09 + vec3(0.0, rise, 0.0);
  p.x += sin(t * 1.3 + seed * 17.0) * 0.25 * t;
  p.z += cos(t * 1.1 + seed * 11.0) * 0.25 * t;
  // Swells to full size by a third of its life, then thins out.
  float size = aPuff.z * mix(0.35, 1.0, smoothstep(0.0, 0.3, age)) * (1.0 + age * 1.3);
  vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
  vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
  // Taller than wide: wisps, not puffs.
  vec3 wp = p + (right * position.x * 0.65 + up * position.y * 1.25) * size;
  vQuad = position.xy;
  vAge = age;
  vWorld = p;
  vSeed = seed;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec2 vQuad;
varying float vAge;
varying vec3 vWorld;
varying float vSeed;
${V}
${H}
uniform float uLamps;
uniform float uDensity;
void main() {
  float r2 = dot(vQuad, vQuad);
  float n = vnoise(vQuad * 2.3 + vec2(vSeed * 13.0, vAge * 3.0));
  float blob = exp(-r2 * 2.6) * smoothstep(0.25, 0.75, n * 0.7 + 0.45 - r2 * 0.25);
  // Alpha ramp: fades in out of the pot, holds, and thins away (chimney_wisp colour ramp).
  float ramp = smoothstep(0.0, 0.12, vAge) * (1.0 - smoothstep(0.45, 1.0, vAge));
  // Older puffs spread thin, so plumes read as wisps rather than cotton from the board.
  float a = blob * ramp * mix(0.26, 0.09, vAge) * uDensity;
  if (a < 0.004) discard;
  vec3 toCam = uCamPos - vWorld;
  float camDist = length(toCam);
  // Thin out right by the lens so a plume beside the eye camera never fogs the view.
  a *= smoothstep(2.0, 9.0, camDist);
  if (a < 0.004) discard;
  vec3 v = toCam / camDist;
  float toward = pow(max(dot(-v, uSunDir), 0.0), 3.0);
  vec3 smoke = vec3(0.74, 0.74, 0.75);
  vec3 lightCol = uSunColor * (0.35 + 0.55 * toward) * cloudShadow(vWorld) + ambientLight(vec3(0.0, 1.0, 0.0)) * 1.2;
  vec3 col = smoke * lightCol;
  // Lamplight from the windows below catches the base of the plume.
  col += vec3(1.0, 0.45, 0.15) * uLamps * 0.22 * (1.0 - smoothstep(0.0, 0.5, vAge));
  col = atmosphere(col, vWorld);
  gl_FragColor = vec4(col, a);
}
`);var Sl=class{chimneys=new Map;nextId=1;batch;dirty=!0;focus={x:1e9,z:1e9};lamps=0;density=1;life=6;rise=1.5;size=.9;wind={x:.9,y:.35};constructor(e,t){let n=t.material(`life_smoke`,`lifeSmoke`,{attributes:[`position`,`aPuff`],uniforms:[`view`,`uWind`,`uLamps`,`uDensity`],needAlphaBlending:!0});n.backFaceCulling=!1,n.onBindObservable.add(()=>{let e=n.getEffect();e&&(e.setFloat2(`uWind`,this.wind.x,this.wind.y),e.setFloat(`uLamps`,this.lamps),e.setFloat(`uDensity`,this.density))});let r=xc([-1,-1,0,1,-1,0,1,1,0,-1,1,0],null,[0,1,2,0,2,3]);this.batch=new bc(e,`life_smoke`,r,n,[{name:`aPuff`,stride:4}],20),this.batch.mesh.alwaysSelectAsActiveMesh=!0,yc(this.batch.mesh,n,`mix`)}add(e,t,n){let r=this.nextId++;return this.chimneys.set(r,{id:r,x:e,y:t,z:n,seed:cc(e*4,n*4,61)%1e3/1e3}),this.dirty=!0,r}remove(e){this.chimneys.delete(e)&&(this.dirty=!0)}get count(){return this.chimneys.size}update(e,t,n){if(!this.dirty&&Math.hypot(e-this.focus.x,t-this.focus.z)<150)return;this.dirty=!1,this.focus={x:e,z:t};let r=this.batch;r.begin();for(let i of this.chimneys.values())if(!(Math.hypot(i.x-e,i.z-t)>n+150))for(let e=0;e<xl;e++)r.push(1,0,0,0,1,0,0,0,1,i.x,i.y,i.z,(e/xl+i.seed)%1,this.life*(.9+.2*(e*.618%1)),this.size,this.rise);r.commit()}retune(e,t,n){(e!==this.life||t!==this.rise||n!==this.size)&&(this.life=e,this.rise=t,this.size=n,this.dirty=!0)}},Cl=14e3;U(`lifePrecip`,`
precision highp float;
attribute vec3 position;   // corner xy, z the drop's place in the buffer 0..1
attribute vec4 seed;       // per drop, repeated on its four corners
uniform mat4 viewProjection;
uniform vec3 uCamPos;
uniform float uClock;
uniform vec3 uBoxC;
uniform vec3 uBoxE;
uniform float uSpeed;
uniform float uSnow;
uniform vec2 uSlant;
uniform float uFrac;
uniform float uHigh;       // 0 at eye level .. 1 high over the board
varying vec2 vQuad;
varying float vAlpha;
varying vec3 vWorld;
void main() {
  // Light rain draws only the first part of the buffer.
  if (position.z > uFrac) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vQuad = vec2(0.0); vAlpha = 0.0; vWorld = vec3(0.0); return; }
  vec3 span = uBoxE * 2.0;
  vec3 vel = vec3(uSlant.x, -1.0, uSlant.y) * uSpeed * (0.85 + 0.3 * seed.w);
  vec3 p = seed.xyz * span + vel * uClock;
  // Snow drifts sideways as it falls.
  float ph = seed.w * 6.2831853;
  p.x += uSnow * sin(uClock * 1.3 + ph) * uSpeed * 0.5;
  p.z += uSnow * cos(uClock * 1.1 + ph * 1.7) * uSpeed * 0.5;
  vec3 lo = uBoxC - uBoxE;
  p = lo + mod(p - lo, span);
  vec3 toCam = uCamPos - p;
  float d = length(toCam);
  vec3 vdir = toCam / max(d, 1e-3);
  vec3 axis = normalize(mix(normalize(vel), vec3(0.0, 1.0, 0.0), uSnow));
  vec3 side = normalize(cross(axis, vdir));
  vec3 up = uSnow > 0.5 ? normalize(cross(vdir, side)) : axis;
  float w = (uSnow > 0.5 ? max(d * 0.00416, 0.045) : max(d * 0.0013, 0.012)) * (1.0 - 0.4 * uHigh);
  float l = uSnow > 0.5 ? w : max(d * 0.011, 0.15);
  vec3 wp = p + side * position.x * w + up * position.y * l;
  vQuad = position.xy;
  // Fade at the box edges so the wrap never pops, and very close to the lens.
  vec3 q = abs(p - uBoxC) / uBoxE;
  float edge = 1.0 - smoothstep(0.75, 1.0, max(q.x, max(q.y, q.z)));
  vAlpha = edge * (0.55 + 0.45 * fract(seed.w * 7.13)) * smoothstep(0.4, 1.5, d);
  vWorld = p;
  gl_Position = viewProjection * vec4(wp, 1.0);
}
`,`
precision highp float;
varying vec2 vQuad;
varying float vAlpha;
varying vec3 vWorld;
${V}
${H}
uniform float uSnow;
uniform float uStrength;
void main() {
  float shape = uSnow > 0.5 ? exp(-dot(vQuad, vQuad) * 2.5) : (1.0 - vQuad.x * vQuad.x) * smoothstep(1.0, 0.3, abs(vQuad.y));
  float a = shape * vAlpha * uStrength;
  if (a < 0.003) discard;
  // Rain is a soft grey sheen in the light; full ambient made every streak a white dash.
  vec3 lightCol = uSunColor * (uSnow > 0.5 ? 0.25 : 0.15) + ambientLight(vec3(0.0, 1.0, 0.0)) * (uSnow > 0.5 ? 1.4 : 1.1);
  vec3 tint = uSnow > 0.5 ? mix(vec3(0.95, 0.96, 1.0), uFogColor, 0.3) : mix(uFogColor, vec3(0.85, 0.9, 0.95), 0.25);
  vec3 col = tint * lightCol * (uSnow > 0.5 ? 1.2 : 1.0);
  gl_FragColor = vec4(col, a);
}
`);var wl=class{mesh;box={c:new n,e:new n(10,10,10)};amount=0;snow=!1;speed=9;high=0;constructor(e,t){let n=new sc(4242),r=new Float32Array(Cl*4*3),i=new Float32Array(Cl*4*4),o=new Uint32Array(Cl*6),s=[-1,-1,1,-1,1,1,-1,1];for(let e=0;e<Cl;e++){let t=[n.next(),n.next(),n.next(),n.next()];for(let n=0;n<4;n++)r.set([s[n*2],s[n*2+1],e/Cl],(e*4+n)*3),i.set(t,(e*4+n)*4);o.set([e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3],e*6)}this.mesh=new v(`life_precip`,e),this.mesh.setVerticesData(a.PositionKind,r,!1,3),this.mesh.setVerticesData(`seed`,i,!1,4),this.mesh.setIndices(o),this.mesh.isPickable=!1,this.mesh.alwaysSelectAsActiveMesh=!0;let c=t.material(`life_precip`,`lifePrecip`,{attributes:[`position`,`seed`],uniforms:[`uBoxC`,`uBoxE`,`uSpeed`,`uSnow`,`uSlant`,`uStrength`,`uClock`,`uFrac`,`uHigh`],needAlphaBlending:!0});c.backFaceCulling=!1,c.onBindObservable.add(()=>{let e=c.getEffect();e&&(e.setFloat(`uClock`,t.time%600),e.setVector3(`uBoxC`,this.box.c),e.setVector3(`uBoxE`,this.box.e),e.setFloat(`uSpeed`,this.speed),e.setFloat(`uSnow`,+!!this.snow),e.setFloat2(`uSlant`,this.snow?0:.1,this.snow?0:.05),e.setFloat(`uStrength`,(this.snow?.9:.28)*(.5+.5*this.amount)*(1-.35*this.high)),e.setFloat(`uFrac`,Math.min(1,Math.max(.05,this.amount))*(1-.45*this.high)),e.setFloat(`uHigh`,this.high))}),this.mesh.material=c,yc(this.mesh,c,`mix`),this.mesh.setEnabled(!1)}update(e,t,n){let r=this.amount>.02;if(this.mesh.setEnabled(r),!r)return;let i=Math.max(1,e.y-n),a=Math.min(1,Math.max(0,(i-30)/170));this.high=a*a*(3-2*a);let o=Math.min(520,Math.max(12,i*2.6)),s=Math.hypot(t.x,t.z)||1,c=i+o*.15;this.box.c.set(e.x+t.x/s*o*.6,n+c*.5,e.z+t.z/s*o*.6),this.box.e.set(o*.75,Math.max(c*.5,4),o*.75);let l=this.snow?8:.8;this.speed=Math.max(this.box.e.y*2/l,this.snow?1:9)}};E.ShadersStore.lifeAirFragmentShader=`
precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform mat4 uInvVP;
uniform vec3 uCam;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uFogColor;
uniform vec3 uSunGlow;
uniform float uTime;
uniform float uMist;
uniform float uLamps;
uniform int uLightCount;
uniform vec4 uLights[24];
uniform vec4 uLightC[24];
${V}

float mistDensity(vec3 p) {
  float T = uTime;
  float drift = sin(p.x * 0.006 + p.z * 0.007 + T * 0.025) * sin(p.z * 0.019 - T * 0.013);
  // Banks with clear water and land between them (G3), not one veil over the whole board.
  vec2 b = p.xz * 0.004 + vec2(T * 0.0016, -T * 0.001);
  float banks = smoothstep(0.3, 0.68, vnoise(b) * 0.65 + vnoise(b * 2.7 + 3.0) * 0.35);
  // One layer in world space over the sea and the low ground, its soft six-metre top riding higher inside the banks:
  // shores and hollows fill and rising ground stands out of it. A layer measured from each pixel's own ground broke
  // into hard lines wherever neighbouring pixels landed on different heights.
  float top = 5.0 + 7.0 * banks + 2.0 * drift;
  float body = smoothstep(top, top - 6.0, p.y) * (0.55 + 0.45 * smoothstep(top - 3.0, 0.0, p.y));
  vec2 q = p.xz * 0.018 + vec2(T * 0.006, T * 0.004) + p.y * 0.05;
  float billow = vnoise(q) * 0.6 + vnoise(q * 2.3 + 7.0) * 0.4;
  return uMist * body * banks * smoothstep(0.15, 0.7, billow) * 0.08;
}

void main() {
  vec4 scene = texture2D(textureSampler, vUV);
  vec4 far = uInvVP * vec4(vUV * 2.0 - 1.0, 1.0, 1.0);
  vec3 v = normalize(far.xyz / far.w - uCam);
  float hit = scene.a * 8000.0;
  vec3 col = scene.rgb;

  // Lamplight on whatever this pixel shows (not the sky).
  if (uLamps > 0.01 && scene.a < 0.99) {
    vec3 p = uCam + v * hit;
    vec3 add = vec3(0.0);
    for (int i = 0; i < 24; i++) {
      if (i >= uLightCount) break;
      vec3 d = p - uLights[i].xyz;
      float r = length(d) / uLights[i].w;
      if (r >= 1.0) continue;
      float f = 1.0 - r;
      add += uLightC[i].rgb * f * f;
    }
    // Light lands on the surface: brighter where the scene is already lit, plus a warm wash where it is dark.
    col += add * uLamps * (0.04 + 1.2 * col);
  }

  // Valley mist along the stretch of the ray inside the layer (0 to 16 m), up to what it hits.
  if (uMist > 0.005) {
    float vy = abs(v.y) < 1e-4 ? 1e-4 : v.y;
    float ta = (0.0 - uCam.y) / vy;
    float tb = (16.0 - uCam.y) / vy;
    float t0 = max(min(ta, tb), 0.0);
    float t1 = min(min(max(ta, tb), hit), 3000.0);
    if (t1 > t0) {
      const int STEPS = 8;
      float dt = (t1 - t0) / float(STEPS);
      // The layer varies over metres, so midpoint samples integrate it without the grain a per-pixel jitter left.
      float t = t0 + dt * 0.5;
      float tau = 0.0;
      for (int i = 0; i < STEPS; i++) {
        // It gathers from a few tens of metres out, so a low camera inside a bank still sees the ground at its feet.
        tau += mistDensity(uCam + v * t) * smoothstep(4.0, 50.0, t) * dt;
        t += dt;
      }
      float a = 1.0 - exp(-tau);
      float sunAmt = pow(max(dot(v, uSunDir), 0.0), 3.0);
      vec3 mc = mix(uFogColor * 1.3, uSunGlow * 1.35, sunAmt * 0.7) + uSunColor * 0.1;
      col = mix(col, mc, a);
    }
  }
  gl_FragColor = vec4(col, scene.a);
}
`;var Tl=class{scene;camera;lighting;next;pp;attached=!1;invVP=new f;lights=new Float32Array(96);colors=new Float32Array(96);count=0;mist=0;lamps=0;shownMist=0;constructor(t,n,r,i){this.scene=t,this.camera=n,this.lighting=r,this.next=i,this.pp=new d(`lifeAir`,`lifeAir`,[`uInvVP`,`uCam`,`uSunDir`,`uSunColor`,`uFogColor`,`uSunGlow`,`uTime`,`uMist`,`uLamps`,`uLightCount`,`uLights`,`uLightC`],null,1,null,l.BILINEAR_SAMPLINGMODE,t.getEngine(),!1,null,e.TEXTURETYPE_HALF_FLOAT),this.pp.onApply=e=>{let t=this.lighting;this.scene.getTransformMatrix().invertToRef(this.invVP),e.setMatrix(`uInvVP`,this.invVP),e.setVector3(`uCam`,this.camera.globalPosition),e.setVector3(`uSunDir`,t.sunDir),e.setColor3(`uSunColor`,t.sunColor),e.setColor3(`uFogColor`,t.fogColor),e.setColor3(`uSunGlow`,t.sunGlow),e.setFloat(`uTime`,t.time),e.setFloat(`uMist`,this.shownMist),e.setFloat(`uLamps`,this.lamps),e.setInt(`uLightCount`,this.count),e.setFloatArray4(`uLights`,this.lights),e.setFloatArray4(`uLightC`,this.colors)}}setLights(e,t,n,r){let i=e.map(e=>({l:e,d:(e[0]-t)**2+(e[1]-n)**2+(e[2]-r)**2})).filter(e=>e.d<22500).sort((e,t)=>e.d-t.d).slice(0,24);this.count=i.length,i.forEach(({l:e},t)=>{this.lights.set([e[0],e[1],e[2],e[3]],t*4),this.colors.set([e[4],e[5],e[6],0],t*4)})}update(){let e=this.lighting,t=Math.min(1,Math.max(0,(e.sunDir.y-.25)/.25));this.shownMist=this.mist*(1-t*t*(3-2*t)*(1-e.night));let n=this.shownMist>.005||this.lamps>.01&&this.count>0;n!==this.attached&&(this.attached=n,n?(this.pp.samples=this.next.samples,this.next.samples=1,this.camera.attachPostProcess(this.pp,0)):(this.camera.detachPostProcess(this.pp),this.next.samples=this.pp.samples))}},El=class{props;ground;carts=[];rng=new sc(7331);constructor(e,t){this.props=e,this.ground=t}set(e,t){for(let e of this.carts)this.props.remove(e.prop);this.carts=[];let n=e.slice().sort((e,t)=>Kc(t)-Kc(e)).slice(0,t);for(let e of n){if(Kc(e)<60)continue;let t=this.rng.range(.2,.8)*Kc(e);this.carts.push({route:e,s:t,dir:this.rng.next()<.5?1:-1,speed:this.rng.range(1.1,1.4),wait:0,yaw:0,phase:this.rng.next()*6,prop:this.props.add(`cart`,{x:0,y:-50,z:0,yaw:0,scale:.9})})}}update(e,t){for(let n of this.carts){let r=Kc(n.route);n.wait>0?n.wait-=e:(n.s+=n.dir*n.speed*e,(n.s<=0||n.s>=r)&&(n.s=Math.min(r,Math.max(0,n.s)),n.dir=-n.dir,n.wait=this.rng.range(8,20)));let i=Jc(n.route,n.s),a=Math.atan2(i.z*n.dir,-i.x*n.dir);n.yaw+=lc(n.yaw,a)*(1-Math.exp(-e*(n.wait>0?.5:2)));let o=qc(n.route,n.s);n.route.road&&(o=el(o.x,o.z,Math.hypot(o.x-t.x,o.z-t.z,t.y-this.ground.height(o.x,o.z))));let s=i.z*n.dir*.8,c=-i.x*n.dir*.8,l=o.x+s,u=o.z+c;n.phase+=e*(n.wait>0?0:n.speed*2.2);let d=n.wait>0?0:Math.abs(Math.sin(n.phase))*.04;this.props.update(n.prop,{x:l,y:this.ground.height(l,u)+d,z:u,yaw:n.yaw,tilt:[0,n.wait>0?0:Math.sin(n.phase*.5)*.012]})}}},Dl=900,Ol=1400,kl=class{ctx;ground;herds;birds;ships;people;lights;smoke;weather;air;carts;enabled=!0;settlements=[];roads=[];settlementLife=new Map;roadWalkers=[];builders=[];lifeClock=0;shipGulls=[];settlementLamps=new Map;blocked=()=>!1;bridged=!1;unsmoke=()=>{};stats={animals:0,birds:0,people:0,ms:0};wasEnabled=!0;timing={herds:0,ships:0,birds:0,people:0,lights:0};constructor(e){this.ctx=e;let{scene:t,renderer:n,world:r}=e,i=n.lighting;this.ground=new fc(r),this.herds=new kc(t,i,n.shadows,this.ground),this.birds=new Nc(t,i,this.ground),this.ships=new Vc(t,i,e.props,r),this.people=new ml(t,i,n.shadows,this.ground),this.lights=new _l(t,i,n.shadows,this.ground),this.smoke=new Sl(t,i),this.weather=new wl(t,i),this.air=new Tl(t,n.cam.camera,i,n.post.tilt),this.carts=new El(e.props,this.ground);let a=new Map;this.lights.onChimneys=(e,t)=>{let n=e.filter(e=>cc(e.x*4,e.z*4,13)%100<70).map(e=>this.smoke.add(e.x,e.y,e.z));a.set(t,n)},this.unsmoke=e=>{for(let t of a.get(e)??[])this.smoke.remove(t);a.delete(e)};for(let e of r.landmarks)e.kind===`lighthouse`&&this.lighthouses.push({x:e.pos.x,y:e.pos.y+16.4,z:e.pos.z,lamp:null});this.refreshBeacons(),this.roads=Al(r.home.roads),this.populateHome(),this.setRoads(this.roads),this.setSettlements([...r.home.settlements.map((e,t)=>({x:e.x,z:e.y,size:t+1,home:!0})),...r.villages.map(e=>({x:e.pos.x,z:e.pos.y,size:e.size}))]),e.onUpdate(e=>this.update(e))}populateHome(){let{world:e}=this.ctx,t=e.home,n=new sc(cc(e.seed,401)),r=0,i=0,a=0;for(let[e,o]of t.types){let s=ve(e),c=I(s),l=c.x+n.range(-6,6),u=c.y+n.range(-6,6),d=this.ground.height(l,u);if(o===F.PASTURE&&n.next()<.6){let e=this.herds.add(`sheep`,l,u,Math.min(30,Math.max(20,n.int(6,13)*2+4)),cc(s.q,s.r,1));n.next()<.5&&this.people.addHerder({get x(){return e.centreX},get z(){return e.centreZ}})}else if(o===F.FOREST&&r<2)for(let e of se){let i=t.types.get(`${s.q+e.q},${s.r+e.r}`);if(i===F.PASTURE||i===F.FIELD){let t=I({q:s.q+e.q,r:s.r+e.r});this.herds.add(`deer`,(c.x+t.x)/2,(c.y+t.y)/2,n.int(3,6),cc(s.q,s.r,2),this.deerAvoid()),r++;break}}else o===F.COAST&&i<3&&n.next()<.35?(this.birds.add(`gull`,l,Math.max(d,0),u,n.int(4,8),cc(s.q,s.r,3)),i++):o===F.FIELD&&a<3&&n.next()<.15&&(this.birds.add(`swallow`,l,d,u,n.int(6,10),cc(s.q,s.r,4)),a++)}let o=this.herds.herds.filter(e=>e.kind===`sheep`).map(e=>({x:e.homeX,z:e.homeZ,r:40}));for(let e of this.herds.herds)e.kind===`deer`&&(e.avoid.push(...o),e.rehome());let s=t.landBounds,c=(s.minX+s.maxX)/2,l=(s.minZ+s.maxZ)/2;this.ships.plan(3,c,l,Math.max(s.maxX-s.minX,s.maxZ-s.minZ)/2+90,e.seed,2);for(let e of this.ships.poses()){if(e.model!==`cog`)continue;let t=this.birds.add(`gull`,e.x,0,e.z,n.int(2,4),cc(e.x,e.z,5));t.follow={x:e.x,z:e.z},this.shipGulls.push(t)}}addWindmill(e,t,n){let r=this.ground.height(e,t);for(let n=0;n<8;n++)r=Math.min(r,this.ground.height(e+Math.cos(n*Math.PI/4)*3.5,t+Math.sin(n*Math.PI/4)*3.5));let i={x:e,y:r-.3,z:t,yaw:n,scale:1},a=((.37*e+.11*t)/(Math.PI*2)%1+1)%1;return[this.ctx.props.add(`life_windmill_tower`,i),this.ctx.props.add(`life_windmill_sails`,{...i,phase:a})]}startle(e,t,n=70){for(let r of this.herds.herds)Math.hypot(r.homeX-e,r.homeZ-t)<n+60&&r.startle(e,t,n)}removeWindmill(e){for(let t of e)this.ctx.props.remove(t)}nearRoad(e,t,n){for(let r of this.roads){let i=r.bx-r.ax,a=r.bz-r.az,o=Math.max(0,Math.min(1,((e-r.ax)*i+(t-r.az)*a)/(i*i+a*a||1)));if(Math.hypot(e-r.ax-i*o,t-r.az-a*o)<n)return!0}return!1}deerAvoid(){return this.ctx.world.home.settlements.map(e=>({x:e.x,z:e.y,r:60}))}lighthouses=[];explored=()=>!0;built=null;windowGroup=-1;setExplored(e){this.explored=e,this.refreshBeacons()}refreshBeacons(){for(let e of this.lighthouses){let t=this.explored(e.x,e.z);t&&e.lamp===null?e.lamp=this.lights.addBeacon(e.x,e.y,e.z):!t&&e.lamp!==null&&(this.lights.removeBeacon(e.lamp),e.lamp=null)}}setSettlements(e){this.settlements=e;let t=new Set;for(let n of e){let e=`${Math.round(n.x)},${Math.round(n.z)},${n.size}`;if(t.add(e),this.settlementLife.has(e))continue;let r=new sc(cc(n.x,n.z,77)),i=14+4*n.size,a={herds:[],walkers:[],ring:null,x:n.x,z:n.z,r:i};if(!n.home){let e=[25,37,52][n.size-1]+22,t=r.next()*Math.PI*2,i=this.herds.add(`sheep`,n.x+Math.cos(t)*e,n.z+Math.sin(t)*e,20,cc(n.x,n.z,3));a.herds.push(i),a.walkers.push(this.people.addHerder({get x(){return i.centreX},get z(){return i.centreZ}}))}let o=[];for(let e=0;e<=12;e++){let t=e/12*Math.PI*2+r.range(-.1,.1);o.push({x:n.x+Math.cos(t)*i*r.range(.9,1.1),z:n.z+Math.sin(t)*i*r.range(.9,1.1)})}o[12]=o[0];let s=Gc(o.filter(e=>!this.ground.isWater(e.x,e.z)),!1);s.pts.length>3&&(a.ring=s,this.snapRing(a),a.walkers.push(...this.people.addRoadWalkers([s],Math.min(8,Math.max(6,2+2*n.size)),n.size))),this.fieldSpots(n.x,n.z,r,n.home?3:2).forEach((e,t)=>a.walkers.push(this.people.addFieldWorker(e.x,e.z,10,t%3==2?`shepherd`:`farmer`))),this.settlementLife.set(e,a)}for(let[e,n]of this.settlementLife)if(!t.has(e)){for(let e of n.herds)this.herds.remove(e);this.people.remove(n.walkers),this.settlementLife.delete(e)}this.placeLanterns()}placeLanterns(){for(let e of this.settlementLamps.values())for(let t of e)this.lights.removeLamp(t);this.settlementLamps.clear();for(let e of this.settlements){let t=[],n=(e,n)=>this.ground.isWater(e,n)||this.blocked(e,n,1.2)||!this.ground.walkable(e,n,.7,.8)?!1:(t.push(this.lights.addLamp(e,this.ground.height(e,n),n,`lantern`)),!0),r=e.home?3:2;for(let t=0;t<r;t++){let i=Math.PI*2*t/r+.7;for(let t=14;t<26&&!n(e.x+Math.cos(i)*t,e.z+Math.sin(i)*t);t+=3);}let i=[25,37,52][e.size-1]+12;for(let t of this.roads){let r=t.bx-t.ax,a=t.bz-t.az,o=Math.hypot(r,a);for(let s=6;s<o;s+=22){let c=t.ax+r*s/o,l=t.az+a*s/o;if(Math.hypot(c-e.x,l-e.z)>i)continue;let u=(Math.round(s/22)%2?1:-1)*4.2;n(c-a/o*u,l+r/o*u)}}this.settlementLamps.set(`${e.x},${e.z}`,t)}}gathering=[];gatheringKey=``;setGathering(e){let t=e?e.map(e=>`${Math.round(e.x)},${Math.round(e.z)}`).join(`|`):``;if(t!==this.gatheringKey){this.gatheringKey=t;for(let e of this.gathering)this.lights.removeLamp(e);this.gathering=[];for(let t of e??[]){let e=[];for(let n=0;n<6;n++){let r=Math.PI*2*n/6+.35;for(let n=8;n<=13;n+=1.5){let i=t.x+Math.cos(r)*n,a=t.z+Math.sin(r)*n;if(this.ground.isWater(i,a)||this.blocked(i,a,1.2)||!this.ground.walkable(i,a,.7,.8))continue;let o=this.ground.height(i,a);this.gathering.push(this.lights.addLamp(i,o,a,`lantern`)),e.push({x:i,y:o,z:a});break}}for(let t=0;t<e.length;t++){let n=e[t],r=e[(t+1)%e.length],i=Math.hypot(r.x-n.x,r.z-n.z);if(e.length<3||i>14)continue;let a=Math.max(2,Math.round(i/1.8));for(let e=1;e<a;e++){let t=e/a,i=n.x+(r.x-n.x)*t,o=n.z+(r.z-n.z)*t;if(this.blocked(i,o,.4))continue;let s=n.y+(r.y-n.y)*t+2.75-.7*Math.sin(Math.PI*t);this.gathering.push(this.lights.addLamp(i,s,o,`string`))}}}}}addWindows(e){return this.lights.addWindows(e)}removeWindows(e){this.lights.removeWindows(e),this.unsmoke(e)}addChimney(e,t,n){return this.smoke.add(e,t,n)}removeChimney(e){this.smoke.remove(e)}addLamp(e,t,n,r=`lantern`){return this.lights.addLamp(e,t,n,r)}removeLamp(e){this.lights.removeLamp(e)}setObstacles(e){this.blocked=e,this.ground.blocked=e;for(let e of this.herds.herds)e.rehome();for(let e of this.settlementLife.values())this.snapRing(e);this.placeLanterns()}snapRing(e){let t=e.ring;if(!t)return;let n=t.pts.length;for(let r=0;r<n;r++){let n=t.pts[r],i=Math.atan2(n.z-e.z,n.x-e.x);for(let t of[0,3,-3,6,-6,9,12,15]){let r=e.r+t,a=e.x+Math.cos(i)*r,o=e.z+Math.sin(i)*r;if(!this.blocked(a,o,1.6)&&!this.ground.isWater(a,o)){n.x=a,n.z=o;break}}}n>1&&(t.pts[n-1]=t.pts[0]),t.acc.length=1;for(let e=1;e<n;e++)t.acc.push(t.acc[e-1]+Math.hypot(t.pts[e].x-t.pts[e-1].x,t.pts[e].z-t.pts[e-1].z))}connectBuilt(e){this.bridged=!0,this.built!==e&&(e.onBuild?.(e=>this.sendBuilders(e)),e.whenBuilt?.(()=>this.syncWindows())),this.built=e,this.setObstacles((t,n,r)=>e.blocked({x:t,z:n},r)),this.syncWindows()}sendBuilders(e){if(!e.sites.length)return;let t=new sc(cc(e.centre.x,e.centre.z,Math.floor(this.lifeClock*10))),n=this.nearestRoad(e.centre.x,e.centre.z,140)??e.centre,r=Math.min(5,2+Math.floor(e.sites.length/3)),i=[`merchant`,`farmer`,`shepherd`,`merchant`,`farmer`];for(let a=0;a<r;a++){let r=e.sites[a%e.sites.length],o=n.x-r.x,s=n.z-r.z,c=Math.hypot(o,s);if(c<1){let e=t.next()*Math.PI*2;o=Math.cos(e),s=Math.sin(e)}else o/=c,s/=c;let l=null;for(let e=0;e<10&&!l;e++){let e=r.r+t.range(7,10),n=t.range(-3,3),i=r.x+o*e-s*n,a=r.z+s*e+o*n;this.ground.walkable(i,a,.75)&&!this.blocked(i,a,.8)&&(l={x:i,z:a})}if(!l)continue;let u=this.people.addBuilder(l.x,l.z,r.x+o*(r.r+1.2),r.z+s*(r.r+1.2),i[a]);this.builders.push({w:u,until:this.lifeClock+e.seconds+5+t.range(0,3),home:l,left:-1})}}nearestRoad(e,t,n){let r=null,i=n;for(let n of this.roads){let a=n.bx-n.ax,o=n.bz-n.az,s=Math.max(0,Math.min(1,((e-n.ax)*a+(t-n.az)*o)/(a*a+o*o||1))),c=n.ax+a*s,l=n.az+o*s,u=Math.hypot(c-e,l-t);u<i&&(i=u,r={x:c,z:l})}return r}stepBuilders(e){if(this.lifeClock+=e,!this.builders.length)return;let t=this.lifeClock,n=[];for(let e of this.builders)e.left<0&&t>=e.until?(e.left=t,this.people.sendTo(e.w,e.home.x,e.home.z)):e.left>=0&&(Math.hypot(e.w.x-e.home.x,e.w.z-e.home.z)<.6||t-e.left>15)&&n.push(e.w);n.length&&(this.people.remove(n),this.builders=this.builders.filter(e=>!n.includes(e.w)))}syncWindows(){if(!this.built)return;this.windowGroup>=0&&this.removeWindows(this.windowGroup);let e=this.built.litBuildings().filter(e=>e.kind!==`mill`&&this.explored(e.x,e.z));this.windowGroup=e.length?this.addWindows(e):-1}bridgeBuilt(){if(this.bridged)return;let e=window.hc?.built;e?.home?.settlements.some(e=>e.placed.length)&&this.connectBuilt(e)}fieldSpots(e,t,n,r){let i=[];for(let a=0;a<200&&i.length<r;a++){let r=n.next()*Math.PI*2,a=n.range(35,130),o=e+Math.cos(r)*a,s=t+Math.sin(r)*a;this.ctx.world.cropAt({x:o,y:s})<0||!this.ground.walkable(o,s,.85)||this.nearRoad(o,s,4)||i.some(e=>Math.hypot(e.x-o,e.z-s)<12)||i.push({x:o,z:s})}return i}setRoads(e){this.roads=e,this.people.remove(this.roadWalkers);let t=Yc(e);this.roadWalkers=this.people.addRoadWalkers(t,Math.max(6,t.length*3)),this.carts.set(t,2)}update(e){let t=performance.now();if(this.enabled)this.wasEnabled=!0,this.stepBuilders(e),this.frame(e),this.stats.ms+=(performance.now()-t-this.stats.ms)*.05;else if(this.wasEnabled){this.wasEnabled=!1;for(let e of this.ctx.scene.meshes)e.name.startsWith(`life_`)&&e.setEnabled(!1);this.air.mist=0,this.air.lamps=0,this.air.update()}}frame(e){let t=this.ctx.renderer,n=t.cam.camera.position,r=t.cam.target,i=n.y-r.y<Ol?Dl:-1e9,a=t.atmosphere;this.birds.swallowsOut=a.season===3?0:1;let o=this.timing,s=performance.now(),c=e=>{let t=performance.now();o[e]+=(t-s-o[e])*.05,s=t};this.stats.animals=this.herds.update(e,r.x,r.z,i,n.x,n.y,n.z),c(`herds`),this.ships.update(e,t.time,n.x,n.z),this.carts.update(e,n),c(`ships`);let l=this.ships.poses().filter(e=>e.model===`cog`);this.shipGulls.forEach((e,t)=>{let n=l[t];n&&e.follow&&(e.follow.x=n.x-Math.cos(n.heading)*10,e.follow.z=n.z-Math.sin(n.heading)*10)}),this.stats.birds=this.birds.update(e,r.x,r.z,i),c(`birds`),this.stats.people=this.people.update(e,r.x,r.z,i,n,a.season),c(`people`),this.updateLights(e,n,r.x,r.z),c(`lights`)}updateLights(e,t,r,i){this.bridgeBuilt();let a=this.ctx.renderer,o=a.atmosphere,s=(o.hour%24+24)%24,c=this.lights;c.lamps01=o.lamps,c.windowLamps=Math.max(o.lamps,o.season===3?.4*(1-dc(8,20,o.sunElevation)):0),c.litFrac=.92-.45*dc(23,2,s<12?s+24:s)*(1-dc(4,6.5,s)),c.haze=o.weather;let l=[.6,1,.35,0][o.season];c.fireflies=o.lamps*l*(1-o.weather)*(1-dc(1,4,s<12?s:0)),c.setShipLamps(this.ships.poses().filter(e=>e.model===`cog`).map(e=>({x:e.x-Math.cos(e.heading)*5.6*e.size,y:e.y+4.2*e.size,z:e.z-Math.sin(e.heading)*5.6*e.size}))),c.update(e,t,r,i,a.time);let u=o.season===3;this.smoke.lamps=o.lamps,this.smoke.density=(u?1.35:1)*(1-.4*o.weather),this.smoke.retune(u?9:6,u?1.9:1.5,u?1.15:.9),this.smoke.update(r,i,Dl);let d=a.cam.camera.position;this.weather.amount=o.weather,this.weather.snow=u,this.weather.update(d,a.cam.camera.getDirection(n.Forward(!0)),Math.max(0,this.ground.height(d.x,d.z)));let f=dc(4,5.6,s)*(1-dc(7.6,10,s));this.air.mist=Math.min(1,f*(o.season===1?.8:1.1)+.25*o.weather),this.air.lamps=o.lamps,o.lamps>.01&&this.air.setLights(this.lights.lightPoints(),d.x,d.y,d.z),this.air.update()}};function Al(e){let t=[],n=new Set;for(let[r,i]of e){let e=ve(r);for(let r=0;r<6;r++){if(!(i&1<<r))continue;let a=pe(e,r),o=pe(e,r+1),s=[Math.round(a.x*4),Math.round(a.y*4),Math.round(o.x*4),Math.round(o.y*4)],c=s[0]<s[2]||s[0]===s[2]&&s[1]<s[3]?s.join(`,`):[s[2],s[3],s[0],s[1]].join(`,`);n.has(c)||(n.add(c),t.push({ax:a.x,az:a.y,bx:o.x,bz:o.y}))}}return t}function jl(e){let t=new kl(e);return window.__life=t,t}var Ml=8,Nl=10,Pl=500,Fl=typeof window<`u`&&`ongesturestart`in window;function Il(e,t){return e===0&&t?2:e}var Ll=class{canvas;cam;opts;keys=new Set;pointer={x:-1,y:-1,inside:!1};press=null;lastClick={t:0,x:0,y:0,button:0};touches=new Map;pinch=null;longPress=0;enabled=!0;get pressing(){return this.press!==null}get panning(){return this.press?.mode===`pan`}constructor(e,t,n){this.canvas=e,this.cam=t,this.opts=n,window.addEventListener(`keydown`,e=>this.keyDown(e)),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>this.keys.clear()),e.addEventListener(`pointerdown`,e=>this.down(e)),window.addEventListener(`pointermove`,e=>this.move(e)),window.addEventListener(`pointerup`,e=>this.up(e)),window.addEventListener(`pointercancel`,e=>this.up(e,!0)),e.addEventListener(`wheel`,e=>this.wheel(e),{passive:!1}),e.addEventListener(`contextmenu`,e=>e.preventDefault()),e.addEventListener(`pointerleave`,()=>{this.pointer.inside=!1}),e.addEventListener(`pointerenter`,()=>{this.pointer.inside=!0});for(let e of[`gesturestart`,`gesturechange`,`gestureend`])window.addEventListener(e,e=>this.gesture(e),{passive:!1});window.addEventListener(`wheel`,e=>{e.ctrlKey&&e.preventDefault()},{passive:!1})}gestureLast={scale:1,rotation:0};gesture(e){if(e.preventDefault(),!this.enabled||e.type===`gestureend`)return;let t=e.scale??1,n=e.rotation??0;e.type===`gesturestart`&&(this.gestureLast={scale:1,rotation:0});let r=Math.log(this.gestureLast.scale/Math.max(.01,t))*4;r&&this.cam.zoomBy(r);let i=(n-this.gestureLast.rotation)*Math.PI/180;i&&this.cam.rotate(-i),this.gestureLast={scale:t,rotation:n}}keyDown(e){let t=e.target;(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable)&&this.enabled&&(this.opts.onKey(e)?e.preventDefault():[`KeyW`,`KeyA`,`KeyS`,`KeyD`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`KeyQ`,`KeyE`,`PageUp`,`PageDown`,`Equal`,`Minus`].includes(e.code)&&(this.keys.add(e.code),e.preventDefault()))}down(e){if(this.enabled){if(this.canvas.setPointerCapture(e.pointerId),this.cam.interrupt(),e.pointerType===`touch`){if(this.touches.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.touches.size>1){this.press=null,clearTimeout(this.longPress),this.pinch=Fl?null:this.spread();return}clearTimeout(this.longPress),this.longPress=window.setTimeout(()=>{let e=this.press;e&&!e.moved&&this.touches.size===1&&(this.press=null,this.opts.onClick({button:2,x:e.x,y:e.y,shift:!1,alt:!1,ctrl:!1,double:!1}))},Pl)}this.press={button:Il(e.button,e.ctrlKey),raw:e.button,x:e.clientX,y:e.clientY,moved:!1,mode:null,lastX:e.clientX,lastY:e.clientY},e.button===1&&e.preventDefault()}}spread(){let[e,t]=[...this.touches.values()];return{dist:Math.hypot(t.x-e.x,t.y-e.y),angle:Math.atan2(t.y-e.y,t.x-e.x),x:(e.x+t.x)/2,y:(e.y+t.y)/2}}pinchMove(){let e=this.pinch;if(!e)return;let t=this.spread(),n=this.canvas.getBoundingClientRect(),r=this.cam.groundUnder(t.x-n.left,t.y-n.top)??void 0,i=Math.log(e.dist/Math.max(1,t.dist))*4;i&&this.cam.zoomBy(i,r);let a=t.angle-e.angle;a>Math.PI&&(a-=Math.PI*2),a<-Math.PI&&(a+=Math.PI*2),a&&this.cam.rotate(-a),this.cam.drag(t.x-e.x,t.y-e.y,this.canvas.clientHeight),this.pinch=t}move(e){if(e.pointerType===`touch`&&this.touches.has(e.pointerId)&&(this.touches.set(e.pointerId,{x:e.clientX,y:e.clientY}),this.touches.size>1)){this.pinchMove();return}this.pointer.x=e.clientX,this.pointer.y=e.clientY;let t=this.press;if(!t){e.target===this.canvas&&this.opts.onHover(e.clientX,e.clientY);return}let n=this.canvas.getBoundingClientRect();if(!t.moved&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>Ml&&(t.moved=!0,t.mode=t.button===2||e.altKey?`rotate`:`pan`,t.mode===`pan`&&this.cam.grabStart(t.x-n.left,t.y-n.top)),!t.moved)return;let r=e.clientX-t.lastX,i=e.clientY-t.lastY;t.lastX=e.clientX,t.lastY=e.clientY,t.mode===`rotate`?this.cam.rotate(-r*.004):this.cam.grabMove(e.clientX-n.left,e.clientY-n.top,r,i,this.canvas.clientWidth,this.canvas.clientHeight)}up(e,t=!1){e.pointerType===`touch`&&(this.touches.delete(e.pointerId),clearTimeout(this.longPress),this.touches.size<2&&(this.pinch=null));let n=this.press;if(this.press=null,n?.moved&&document.elementFromPoint(e.clientX,e.clientY)===this.canvas&&this.opts.onHover(e.clientX,e.clientY),!n||n.moved||t||e.button!==n.raw)return;let r=performance.now(),i=this.lastClick,a=r-i.t<320&&i.button===n.button&&Math.hypot(e.clientX-i.x,e.clientY-i.y)<Ml;this.lastClick={t:r,x:e.clientX,y:e.clientY,button:n.button},this.opts.onClick({button:n.button,x:e.clientX,y:e.clientY,shift:e.shiftKey,alt:e.altKey,ctrl:e.ctrlKey||e.metaKey,double:a})}wheel(e){if(e.preventDefault(),!this.enabled)return;let t=this.canvas.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,i=this.cam.groundUnder(n,r)??void 0;if(e.ctrlKey){this.cam.zoomBy(e.deltaY*.06,i);return}if(e.altKey){let t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;this.cam.rotate(-t*(e.deltaMode===1?.05:.004));return}let a=e.deltaMode===1?e.deltaY/3:e.deltaY/100;this.cam.zoomBy(Math.max(-1,Math.min(1,a)),i)}update(e){if(!this.enabled)return;let t=this.keys,n=(t.has(`KeyD`)||t.has(`ArrowRight`)?1:0)-(t.has(`KeyA`)||t.has(`ArrowLeft`)?1:0),r=(t.has(`KeyS`)||t.has(`ArrowDown`)?1:0)-(t.has(`KeyW`)||t.has(`ArrowUp`)?1:0),i=this.pointer;if(this.opts.edgeScroll&&i.inside&&!this.press&&document.hasFocus()&&!this.opts.overUi(i.x,i.y)){let e=this.canvas.clientWidth,t=this.canvas.clientHeight;i.x<Nl?--n:i.x>e-Nl&&(n+=1),i.y<Nl?--r:i.y>t-Nl&&(r+=1)}(n||r)&&this.cam.pan(n,r,e);let a=+!!t.has(`KeyQ`)-!!t.has(`KeyE`);a&&this.cam.rotate(a*1.7*e);let o=(t.has(`PageDown`)||t.has(`Minus`)?1:0)-(t.has(`PageUp`)||t.has(`Equal`)?1:0);o&&this.cam.zoomBy(o*.6*e/.045)}};export{Ot as A,Kt as C,Yt as D,Bt as E,U as M,H as N,Qt as O,V as P,Wt as S,Zt as T,Lt as _,oc as a,en as b,jr as c,sr as d,On as f,$t as g,rn as h,_c as i,Me as j,qt as k,gr as l,an as m,jl as n,Os as o,G as p,vc as r,ea as s,Ll as t,pr as u,Gt as v,Xt as w,Pt as x,Ht as y};