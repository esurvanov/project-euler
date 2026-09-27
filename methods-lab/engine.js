/*
 * Мастерская методов — engine.js  (LAB v1)
 * ------------------------------------------------------------------
 * One WebGLRenderer, one isometric "table" scene; each method is a
 * scene registered from scenes/*.js and played step by step.
 *
 * Scene format (full reference: SCENE_API.md):
 *
 *   LAB.register({
 *     id: 'BinarySearch',                       // = method id from the catalog
 *     steps: [ {caption:'Ищем 52 в ряду', tag:'?'}, ... , {caption:'Ответ найден', tag:'='} ],
 *     view: {yaw:0.35, pitch:0.95, fill:0.86},  // optional camera
 *     build(api){ const r = api.row([4,9,15]); return {r}; },   // create objects once
 *     step(api, s, i){ ... }                    // put the scene into the state of step i
 *   });
 *
 *   step() MUST be idempotent: it sets the full state for step i, whatever
 *   the previous step was (the player jumps back and forth). When the user
 *   advances by one step api.instant === false and setters animate; on any
 *   jump api.instant === true and setters apply at once.
 *
 * Primitives (all return objects with the common methods below):
 *   api.tile(value, {pos:[x,y,z], color, size:0.9, h:0.32, strike, face:'top'|'front'})
 *   api.row(values, {pos, gap:1.1, color, size, h})          -> Group (items, at(i), pos(i))
 *   api.grid(rows, cols, fn(r,c)->value|{value,color}|null, {pos, gap}) -> Group (at(r,c))
 *   api.ring(n, {pos, radius, values, color, start})         -> Group (items around a circle)
 *   api.stack(items, {pos, h:0.36, gap:0.05, size})          -> Group (bottom to top)
 *   api.bar(value, max, {pos, height:3, size:0.8, color})    -> Tile with setValue(v)
 *   api.arc(from, to, {height:0.9, color, head:false, dashed:false}) -> Line (draw(p))
 *   api.arrow(from, to, {color, bend:0, lift:0})             -> Line with a head
 *   api.pointer({color, pos})                                -> Thing with at(target)
 *   api.bracket(a, b, {color, text, dz:0.8})                 -> Thing with set(a,b)
 *   api.text(str, pos, {size:0.45, color:'ink'})             -> flat text on the floor
 *   api.label(html, target, {color})                         -> HTML leader label
 *   api.tree(root, {pos, dx:1.3, dz:1.5, color})             -> {nodes, edges, find(v)}
 *   api.group(things?)                                       -> Group
 *   api.counter(label, {pos, color:'red', unit, value, note, quant, noteFitValue, w, d}) -> 3D scoreboard,
 *       .set(n, {ms, delay}) counts, .setNote(textOrFn) formula line under the board
 *   api.marks(target, ['÷2', {text, color, strike}], {color, dir, gap}) -> operation badges, .show(k, {delay, every})
 *   api.badge(text, {pos, color, strike}); LAB.plural(n, 'шаг', 'шага', 'шагов'); api.label(html, target, {color, dy})
 *   api.meter(max, {pos, length:6, labels, unit, naive, method}) -> red/green bars, .set(naive, method, o)
 *   steps[i].chapter: 'problem' | 'idea' | 'solve' (default 'solve') groups the timeline
 *   api.box(size:[w,h,d], {pos, color})                      -> plain block without text
 * Common methods: color(name,o) dim(o) highlight(o) lift(dy,o) moveTo([x,y,z],o)
 *   fadeIn(o) fadeOut(o) show(bool) setText(v,o) strike(bool,o) pos() top()
 *   o = {delay:ms, ms:duration}. Colors: 'plain' 'blue' 'red' 'violet' 'green'
 *   'amber' 'teal' 'ink' 'dim'.
 * Helpers: api.tween(target, props, o), api.later(fn, delayMs), api.instant,
 *   api.stepIndex, api.fit(), api.view({yaw,pitch,fill}).
 */
(function(){
'use strict';
var LAB = window.LAB = window.LAB || {};
LAB.version = '1';
LAB.scenes = LAB.scenes || {};
LAB.errors = LAB.errors || [];
LAB.register = function(def){
  try{
    if(!def || typeof def.id !== 'string') throw new Error('register: id is required');
    if(!Array.isArray(def.steps) || !def.steps.length) throw new Error(def.id + ': steps[] is required');
    if(typeof def.build !== 'function' || typeof def.step !== 'function') throw new Error(def.id + ': build() and step() are required');
    LAB.scenes[def.id] = def;
    if(LAB._onRegister) LAB._onRegister(def.id);
  }catch(e){ LAB.errors.push(String(e && e.message || e)); if(window.console) console.warn('[LAB]', e); }
};
if(!window.THREE){ LAB.noGL = true; return; }

/* ---------------- tokens & palette ---------------- */
function tok(n){ return (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim() || '#888888'; }
var SEM = {blue:'--blue', red:'--red', violet:'--violet', green:'--good', amber:'--ochre', teal:'--sys', ink:'--ink', plain:'--graphite', dim:'--mute'};
LAB.colors = Object.keys(SEM);
function C(css){ return new THREE.Color(css); }
function palette(name){
  var paper = C(tok('--paper'));
  if(name === 'dim') return {fill: paper.clone().lerp(C(tok('--graphite')), 0.03), edge: C(tok('--rule')), text: tok('--mute')};
  if(name === 'plain') return {fill: paper.clone().lerp(C(tok('--graphite')), 0.2), edge: C(tok('--ink')), text: tok('--ink')};
  if(name === 'ink') return {fill: paper.clone().lerp(C(tok('--ink')), 0.15), edge: C(tok('--ink')), text: tok('--ink')};
  var c = tok(SEM[name] || '--ink');
  return {fill: paper.clone().lerp(C(c), 0.32), edge: C(c), text: c};
}
function reducedMotion(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
function V(p){ return p && p.isVector3 ? p.clone() : new THREE.Vector3(p ? p[0] || 0 : 0, p ? p[1] || 0 : 0, p ? p[2] || 0 : 0); }

/* ---------------- tweens ---------------- */
var E = LAB._E = {instant: true, dirty: true, tweens: [], ticks: [], layoutDirty: true, pad: {l: 0, r: 0, t: 0, b: 0}, padIter: 0};
function ease(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }
function tween(target, props, o){
  o = o || {};
  var i, k, tw;
  for(i = E.tweens.length - 1; i >= 0; i--){
    tw = E.tweens[i];
    if(tw.target === target){ for(k in props) delete tw.to[k]; if(!Object.keys(tw.to).length && !tw.keep) E.tweens.splice(i, 1); }
  }
  var ms = o.ms != null ? o.ms : 420, delay = o.delay || 0;
  if(E.instant || reducedMotion() || (ms <= 0 && delay <= 0)){
    if(o.onStart) o.onStart();
    for(k in props) target[k] = props[k];
    if(o.onDone) o.onDone();
    E.dirty = true; return;
  }
  E.tweens.push({target: target, to: Object.assign({}, props), from: null, t0: performance.now() + delay, ms: Math.max(1, ms), onStart: o.onStart, onDone: o.onDone, keep: !Object.keys(props).length});
  E.dirty = true;
}
function later(fn, delay){ tween({}, {}, {delay: delay || 0, ms: 1, onStart: fn}); }
function runTweens(now){
  for(var i = E.tweens.length - 1; i >= 0; i--){
    var tw = E.tweens[i], k;
    if(now < tw.t0) continue;
    if(!tw.from){ tw.from = {}; for(k in tw.to) tw.from[k] = tw.target[k]; if(tw.onStart) tw.onStart(); }
    var p = Math.min(1, (now - tw.t0)/tw.ms), e = ease(p);
    for(k in tw.to) tw.target[k] = tw.from[k] + (tw.to[k] - tw.from[k])*e;
    if(p >= 1){ E.tweens.splice(i, 1); if(tw.onDone) tw.onDone(); }
  }
  return E.tweens.length > 0;
}
function killTweens(){
  // finish pending callbacks so the state is consistent, then drop
  var list = E.tweens.slice(); E.tweens.length = 0;
  list.forEach(function(tw){ if(!tw.from && tw.onStart) tw.onStart(); for(var k in tw.to) tw.target[k] = tw.to[k]; if(tw.onDone) tw.onDone(); });
}
function tweenColor(color, target, o){ tween(color, {r: target.r, g: target.g, b: target.b}, o); }
LAB.tween = tween; LAB.later = later;

/* ---------------- shared geometry ---------------- */
var GEO = null;
function geo(){
  if(!GEO){
    var box = new THREE.BoxGeometry(1, 1, 1);
    GEO = {box: box, boxEdges: new THREE.EdgesGeometry(box), plane: new THREE.PlaneGeometry(1, 1),
      cone: new THREE.ConeGeometry(0.12, 0.34, 14), sphere: new THREE.SphereGeometry(0.5, 20, 14)};
    Object.keys(GEO).forEach(function(k){ GEO[k].userData.shared = true; });
  }
  return GEO;
}
function textCanvas(w, h){ var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
var FONT = '"IBM Plex Mono", ui-monospace, Menlo, monospace';

/* ---------------- Thing ---------------- */
function Thing(api, obj){
  this.api = api; this.obj = obj; this.base = obj.position.clone(); this._lift = 0; this._col = 'plain'; this._op = 1; this.mats = [];
  api._things.push(this);
}
Thing.prototype.pos = function(){ var p = this.obj.position; return [p.x, p.y, p.z]; };
Thing.prototype.top = function(){ var p = this.obj.position; return [p.x, p.y + (this.h || 0), p.z]; };
Thing.prototype._place = function(o){ tween(this.obj.position, {x: this.base.x, y: this.base.y + this._lift, z: this.base.z}, o); return this; };
Thing.prototype.moveTo = function(p, o){ this.base.copy(V(p)); return this._place(o); };
Thing.prototype.lift = function(dy, o){ this._lift = dy || 0; return this._place(o); };
Thing.prototype.opacity = function(v, o){
  var self = this; o = o || {}; this._op = v;
  var op = Object.assign({}, o);
  op.onStart = function(){ if(v > 0) self.obj.visible = true; };
  op.onDone = function(){ if(v <= 0) self.obj.visible = false; };
  if(!this.mats.length){ tween({}, {}, Object.assign({ms: 1}, op)); return this; }
  this.mats.forEach(function(m, i){ tween(m, {opacity: v*(m.userData.k == null ? 1 : m.userData.k)}, i ? o : op); });
  return this;
};
Thing.prototype.fadeIn = function(o){ return this.opacity(1, o); };
Thing.prototype.fadeOut = function(o){ return this.opacity(0, o); };
Thing.prototype.show = function(v){ var was = E.instant; E.instant = true; this.opacity(v === false ? 0 : 1); E.instant = was; return this; };
Thing.prototype.color = function(name, o){ this._col = name || 'plain'; this._applyColor(o); return this; };
Thing.prototype.dim = function(o){ return this.color('dim', o); };
Thing.prototype.highlight = function(o){ return this.color('violet', o); };
Thing.prototype._applyColor = function(){};
Thing.prototype.setText = function(){ return this; };
Thing.prototype.strike = function(){ return this; };
Thing.prototype._theme = function(){ var w = E.instant; E.instant = true; this._applyColor(); E.instant = w; };

/* ---------------- Tile ---------------- */
function Tile(api, value, o){
  o = o || {}; var G = geo();
  var s = o.size || 0.9, h = o.h != null ? o.h : 0.32, face = o.face || 'top';
  var g = new THREE.Group();
  var box = new THREE.Mesh(G.box, new THREE.MeshLambertMaterial({transparent: true}));
  var edges = new THREE.LineSegments(G.boxEdges, new THREE.LineBasicMaterial({transparent: true}));
  var cv = textCanvas(192, 192), tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4;
  var fm = new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false});
  var plane = new THREE.Mesh(G.plane, fm);
  g.add(box); g.add(edges); g.add(plane);
  Thing.call(this, api, g);
  this.box = box; this.edges = edges; this.plane = plane; this.cv = cv; this.tex = tex; this.face = face;
  this.s = s; this.hs = {h: h}; this.h = h; this.value = value; this._strike = !!o.strike;
  this.mats = [box.material, edges.material, fm];
  if(o.pos) { g.position.copy(V(o.pos)); this.base.copy(g.position); }
  this._shape();
  this._col = o.color || 'plain'; this._theme();
  api._add(this);
  var self = this; api._ticks.push(function(){ if(self.h !== self.hs.h){ self.h = self.hs.h; self._shape(); } });
}
Tile.prototype = Object.create(Thing.prototype);
Tile.prototype._shape = function(){
  var s = this.s, h = Math.max(0.001, this.h);
  this.box.scale.set(s, h, s); this.box.position.y = h/2;
  this.edges.scale.copy(this.box.scale); this.edges.position.y = h/2;
  if(this.face === 'front'){ this.plane.rotation.set(0, 0, 0); this.plane.scale.set(s, Math.min(s, h), 1); this.plane.position.set(0, h/2, s/2 + 0.003); }
  else { this.plane.rotation.set(-Math.PI/2, 0, 0); this.plane.scale.set(s, s, 1); this.plane.position.set(0, h + 0.003, 0); }
};
Tile.prototype._draw = function(){
  var c = this.cv.getContext('2d'), W = 192, t = this.value == null ? '' : String(this.value), pal = palette(this._col);
  c.clearRect(0, 0, W, W);
  var fs = t.length <= 2 ? 92 : t.length === 3 ? 74 : t.length === 4 ? 58 : Math.max(24, Math.floor(250/t.length));
  c.font = '600 ' + fs + 'px ' + FONT; c.fillStyle = pal.text; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(t, W/2, W/2 + 4);
  if(this._strike){ c.strokeStyle = pal.text; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(W*0.2, W*0.66); c.lineTo(W*0.8, W*0.34); c.stroke(); }
  this.tex.needsUpdate = true; E.dirty = true;
};
Tile.prototype._applyColor = function(o){
  var pal = palette(this._col), self = this;
  var oo = Object.assign({}, o || {}); oo.onStart = function(){ self._draw(); };
  tweenColor(this.box.material.color, pal.fill, oo);
  tweenColor(this.edges.material.color, pal.edge, o);
};
Tile.prototype.setText = function(v, o){ var self = this; later(function(){ self.value = v; self._draw(); }, o && o.delay); return this; };
Tile.prototype.strike = function(v, o){ var self = this; later(function(){ self._strike = v !== false; self._draw(); }, o && o.delay); return this; };
Tile.prototype.height = function(h, o){ tween(this.hs, {h: h}, o); return this; };

/* ---------------- Box (no text) ---------------- */
function Box(api, size, o){
  o = o || {}; var G = geo(); var g = new THREE.Group();
  var box = new THREE.Mesh(G.box, new THREE.MeshLambertMaterial({transparent: true}));
  var edges = new THREE.LineSegments(G.boxEdges, new THREE.LineBasicMaterial({transparent: true}));
  g.add(box); g.add(edges);
  Thing.call(this, api, g);
  size = size || [1, 1, 1];
  box.scale.set(size[0], size[1], size[2]); box.position.y = size[1]/2; edges.scale.copy(box.scale); edges.position.y = size[1]/2;
  this.box = box; this.edges = edges; this.h = size[1]; this.mats = [box.material, edges.material];
  if(o.pos){ g.position.copy(V(o.pos)); this.base.copy(g.position); }
  this._col = o.color || 'plain'; this._theme(); api._add(this);
}
Box.prototype = Object.create(Thing.prototype);
Box.prototype._applyColor = function(o){ var pal = palette(this._col); tweenColor(this.box.material.color, pal.fill, o); tweenColor(this.edges.material.color, pal.edge, o); };

/* ---------------- Line (arc / arrow / polyline) ---------------- */
function Line(api, pts, o){
  o = o || {};
  var geom = new THREE.BufferGeometry().setFromPoints(pts);
  var mat = o.dashed ? new THREE.LineDashedMaterial({transparent: true, dashSize: 0.16, gapSize: 0.1}) : new THREE.LineBasicMaterial({transparent: true});
  var line = new THREE.Line(geom, mat); if(o.dashed) line.computeLineDistances();
  var g = new THREE.Group(); g.add(line);
  Thing.call(this, api, g);
  this.line = line; this.n = pts.length; this.prog = {p: 1}; this.mats = [mat]; this._lastN = -1;
  if(o.head){
    var cone = new THREE.Mesh(geo().cone, new THREE.MeshBasicMaterial({transparent: true}));
    var a = pts[pts.length - 2], b = pts[pts.length - 1], d = new THREE.Vector3().subVectors(b, a).normalize();
    var len = 0; for(var q = 1; q < pts.length; q++) len += pts[q].distanceTo(pts[q - 1]);
    var hs = Math.max(0.35, Math.min(1, len/3.2))*(o.headScale || 0.75);
    cone.scale.setScalar(hs);
    cone.position.copy(b).addScaledVector(d, -0.17*hs); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
    g.add(cone); this.cone = cone; this.mats.push(cone.material);
  }
  this._col = o.color || 'blue'; this._theme(); api._add(this);
  var self = this;
  api._ticks.push(function(){
    var n = Math.max(0, Math.min(self.n, Math.round(self.n*self.prog.p)));
    if(n !== self._lastN){ self._lastN = n; self.line.geometry.setDrawRange(0, n); E.dirty = true; }
    if(self.cone){ var cv = self.prog.p > 0.97; if(self.cone.visible !== cv){ self.cone.visible = cv; E.dirty = true; } }
  });
}
Line.prototype = Object.create(Thing.prototype);
Line.prototype._applyColor = function(o){ var pal = palette(this._col); var self = this; this.mats.forEach(function(m){ tweenColor(m.color, pal.edge, o); }); };
Line.prototype.draw = function(p, o){ tween(this.prog, {p: p}, Object.assign({ms: 520}, o || {})); return this; };
Line.prototype.fadeIn = function(o){ this.prog.p = E.instant || reducedMotion() ? this.prog.p : 0; this.opacity(1, o); return this.draw(1, o); };
Line.prototype.fadeOut = function(o){ return this.opacity(0, o); };

function endpoint(t, lift){
  if(t && t.top) { var p = t.top(); return new THREE.Vector3(p[0], p[1] + (lift || 0), p[2]); }
  var v = V(t); v.y += lift || 0; return v;
}

/* ---------------- Group ---------------- */
function Group(api, items){
  var g = new THREE.Group();
  Thing.call(this, api, g);
  this.items = []; api._add(this);
  var self = this; (items || []).forEach(function(t){ self.add(t); });
}
Group.prototype = Object.create(Thing.prototype);
Group.prototype.add = function(t){ if(t && t.obj){ this.api._root.remove(t.obj); this.obj.add(t.obj); this.items.push(t); } return t; };
Group.prototype.at = function(i){ return this.items[i]; };
Group.prototype.each = function(fn){ this.items.forEach(fn); return this; };
Group.prototype.pos = function(i){ if(i == null) return Thing.prototype.pos.call(this); var t = this.items[i]; if(!t) return [0, 0, 0]; var v = t.obj.getWorldPosition(new THREE.Vector3()); return [v.x, v.y, v.z]; };
['color', 'dim', 'highlight', 'strike', 'fadeIn', 'fadeOut', 'show'].forEach(function(m){
  Group.prototype[m] = function(a, b){ this.items.forEach(function(t){ t[m](a, b); }); if(m === 'color') this._col = a; return this; };
});
Group.prototype.opacity = function(v, o){ this.items.forEach(function(t){ t.opacity(v, o); }); return this; };

/* ---------------- floor text ---------------- */
function Text(api, str, pos, o){
  o = o || {};
  var size = o.size || 0.45, cv = textCanvas(1024, 128), tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4;
  var mat = new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false});
  var m = new THREE.Mesh(geo().plane, mat); m.rotation.x = -Math.PI/2;
  var g = new THREE.Group(); g.add(m);
  Thing.call(this, api, g);
  this.m = m; this.cv = cv; this.tex = tex; this.size = size; this.str = String(str); this.align = o.align || 'center'; this.mats = [mat];
  g.position.copy(V(pos)); g.position.y += 0.005; this.base.copy(g.position);
  this._col = o.color || 'ink'; this._theme(); api._add(this);
}
Text.prototype = Object.create(Thing.prototype);
Text.prototype._draw = function(){
  var pal = palette(this._col), c = this.cv.getContext('2d');
  c.font = '600 84px ' + FONT;
  var w = Math.max(32, Math.min(4096, Math.ceil(c.measureText(this.str).width) + 24));
  if(w !== this.cv.width){
    this.cv = textCanvas(w, 128); var old = this.tex;
    this.tex = new THREE.CanvasTexture(this.cv); this.tex.anisotropy = 4;
    this.m.material.map = this.tex; this.m.material.needsUpdate = true; if(old) old.dispose();
    c = this.cv.getContext('2d');
  }
  c.clearRect(0, 0, w, 128); c.font = '600 84px ' + FONT; c.fillStyle = pal.text; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(this.str, 12, 68);
  this.tex.needsUpdate = true;
  var W = this.size*w/128*1.0;
  this.m.scale.set(W, this.size, 1);
  this.m.position.x = this.align === 'left' ? W/2 : this.align === 'right' ? -W/2 : 0;
  E.dirty = true;
};
Text.prototype._applyColor = function(){ this._draw(); };
Text.prototype.setText = function(v, o){ var self = this; later(function(){ var nv = String(v); if(nv !== self.str){ self.str = nv; self._draw(); E.layoutDirty = true; } }, o && o.delay); return this; };

/* ---------------- HTML labels ---------------- */
function Label(api, html, target, o){
  o = o || {};
  var el = document.createElement('div'); el.className = 'lb' + (o.color ? ' c-' + o.color : '');
  el.innerHTML = '<svg class="ld" viewBox="0 0 18 18"><line x1="0" y1="18" x2="18" y2="0"/></svg><i class="an"></i><span class="lt"></span>';
  el.lastChild.innerHTML = html;
  api._layer.appendChild(el);
  this._part = api._partTag;
  this.el = el; this.target = target; this.vis = true; this.fl = false; this.sw = 0; this.api = api; this.dy = o.dy || 0.15;
  api._labels.push(this);
}
Label.prototype.setText = function(html, o){ var self = this; later(function(){ self.el.lastChild.innerHTML = html; self.sw = 0; E.layoutDirty = true; E.dirty = true; }, o && o.delay); return this; };
Label.prototype.to = function(target, o){ var self = this; later(function(){ self.target = target; E.layoutDirty = true; E.dirty = true; }, o && o.delay); return this; };
Label.prototype.show = function(v, o){ var self = this; later(function(){ var nv = v !== false; if(nv !== self.vis){ self.vis = nv; E.layoutDirty = true; } E.dirty = true; }, o && o.delay); return this; };
Label.prototype.color = function(name){ this.el.className = 'lb' + (name ? ' c-' + name : '') + (this.fl ? ' l' : ''); return this; };
Label.prototype.fadeIn = function(o){ return this.show(true, o); };
Label.prototype.fadeOut = function(o){ return this.show(false, o); };
Label.prototype._world = function(v){
  var t = this.target;
  if(t && t.obj){
    if(t instanceof Tile && t.face !== 'front'){
      // top face, back edge: the dot sits above the digit instead of on it
      t.box.updateWorldMatrix(true, false); v.set(-0.38, 0.5, -0.38).applyMatrix4(t.box.matrixWorld); v.y += 0.01; return v;
    }
    if(t.box){ t.box.updateWorldMatrix(true, false); v.set(0, 0.5, 0).applyMatrix4(t.box.matrixWorld); v.y += this.dy; return v; }
    if(t instanceof Group && t.items.length){
      var c = new THREE.Vector3(), n = 0; t.items.forEach(function(it){ if(it.obj){ c.add(it.obj.getWorldPosition(new THREE.Vector3())); n++; } });
      v.copy(c.multiplyScalar(1/Math.max(1, n))); v.y += this.dy; return v;
    }
    t.obj.getWorldPosition(v); v.y += (t.h || 0) + this.dy; return v;
  }
  v.copy(V(t)); return v;
};

/* ---------------- Counter (3D scoreboard) ---------------- */
/* ---------------- language (RU / EN) ---------------- */
var LANG = 'ru';
function T(ru, en){ return LANG === 'en' ? en : ru; }
LAB.untranslated = {};
function noteMissing(id, what){ if(!id) return; if(!LAB.untranslated[id]){ LAB.untranslated[id] = 0; if(window.console) console.warn('[RU] untranslated in EN:', id, what || ''); } LAB.untranslated[id]++; }
/* {ru, en} -> string of the current language; a bare string counts as RU (flagged in EN if it has Cyrillic) */
function tr(v, id){
  if(v == null) return v;
  if(typeof v === 'object'){ var r = v[LANG]; if(r == null){ r = v.ru; if(LANG === 'en') noteMissing(id, String(r).slice(0, 40)); } return r; }
  if(LANG === 'en' && /[А-Яа-яЁё]/.test(String(v))) noteMissing(id, String(v).slice(0, 40));
  return v;
}
LAB.L = T; LAB.t = function(o, id){ return tr(o, id); }; LAB.lang = function(){ return LANG; };
LAB.setLang = function(l){
  l = l === 'en' ? 'en' : 'ru'; if(l === LANG) return false; LANG = l;
  if(typeof S !== 'undefined' && S && S.def){ var id = S.def.id, st = S.idx; LAB.open(id); LAB.go(st); }
  return true;
};
/* numbers: RU 1 000 000 and 2,5; EN 1,000,000 and 2.5 */
function fmt(v, digits){
  var x = +v; if(!isFinite(x)) return x > 0 ? '∞' : String(v);
  var d = digits == null ? (x === Math.round(x) ? 0 : 1) : digits, r = +x.toFixed(d);
  if(LANG === 'en') return r.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: d});
  var s = Math.abs(r) >= 10000 ? r.toLocaleString('ru-RU', {maximumFractionDigits: d}).replace(/[\u00a0\u202f]/g, ' ') : String(r).replace('.', ',');
  return s;
}
LAB.fmt = fmt;
function fmtNum(v){ return fmt(Math.round(v), 0); }
function plural(n, one, few, many){
  if(LANG === 'en') return Math.abs(+n) === 1 ? one : few;
  var x = Math.abs(+n);
  if(x !== Math.floor(x)) return few;
  var d10 = x % 10, d100 = x % 100;
  if(d10 === 1 && d100 !== 11) return one;
  if(d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return few;
  return many;
}
LAB.plural = plural;
var UNITS = {'шагов':['шаг','шага','шагов'],'операций':['операция','операции','операций'],'сравнений':['сравнение','сравнения','сравнений'],
  'делений':['деление','деления','делений'],'проверок':['проверка','проверки','проверок'],'умножений':['умножение','умножения','умножений'],
  'сложений':['сложение','сложения','сложений'],'прыжков':['прыжок','прыжка','прыжков'],'чисел':['число','числа','чисел'],'ячеек':['ячейка','ячейки','ячеек'],
  'клеток':['клетка','клетки','клеток'],'вычёркиваний':['вычёркивание','вычёркивания','вычёркиваний'],'итераций':['итерация','итерации','итераций'],
  'вызовов':['вызов','вызова','вызовов'],'пар':['пара','пары','пар'],'вариантов':['вариант','варианта','вариантов'],'элементов':['элемент','элемента','элементов'],
  'кандидатов':['кандидат','кандидата','кандидатов'],'запросов':['запрос','запроса','запросов'],'обменов':['обмен','обмена','обменов'],
  'чтений':['чтение','чтения','чтений'],'записей':['запись','записи','записей'],'проходов':['проход','прохода','проходов'],'действий':['действие','действия','действий'],
  'цифр':['цифра','цифры','цифр'],'делителей':['делитель','делителя','делителей'],'путей':['путь','пути','путей'],'слоёв':['слой','слоя','слоёв']};
/* "38" + "проверок делением" -> "38 проверок делением"; "1" -> "1 проверка делением". Unknown first word: kept as written. */
function pluralUnit(n, unit){
  if(!unit) return '';
  if(LANG === 'en'){ var we = String(unit).split(' '); if(Math.abs(+n) === 1 && /[^s]s$/.test(we[0])) we[0] = we[0].replace(/s$/, ''); return we.join(' '); }
  var w = String(unit).split(' '), f = UNITS[w[0].toLowerCase()];
  if(f && isFinite(+n)){ w[0] = plural(+n, f[0], f[1], f[2]); }
  return w.join(' ');
}
LAB.pluralUnit = pluralUnit;
function wrap2(c, text, maxW){
  var words = String(text).split(' '), l1 = '', i;
  for(i = 0; i < words.length; i++){ var t = l1 ? l1 + ' ' + words[i] : words[i]; if(c.measureText(t).width > maxW && l1) break; l1 = t; }
  return [l1, words.slice(i).join(' ')];
}
function Counter(api, label, o){
  o = o || {}; var G = geo(), w = o.w || 4.2, h = o.h || 0.3, d = o.d || 2.0;
  var g = new THREE.Group();
  var box = new THREE.Mesh(G.box, new THREE.MeshLambertMaterial({transparent: true}));
  var edges = new THREE.LineSegments(G.boxEdges, new THREE.LineBasicMaterial({transparent: true}));
  box.scale.set(w, h, d); box.position.y = h/2; edges.scale.copy(box.scale); edges.position.y = h/2;
  var CW = 768, CH = Math.round(768*d/w), cv = textCanvas(CW, CH), tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4;
  var fm = new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false});
  var plane = new THREE.Mesh(G.plane, fm); plane.rotation.x = -Math.PI/2; plane.scale.set(w, d, 1); plane.position.y = h + 0.003;
  g.add(box); g.add(edges); g.add(plane);
  Thing.call(this, api, g);
  this.box = box; this.edges = edges; this.cv = cv; this.tex = tex; this.h = h; this.w = w; this.d = d; this.CW = CW; this.CH = CH;
  this.label = label == null ? '' : String(label); this.unit = o.unit || ''; this.val = {v: o.value || 0}; this.shown = null;
  this.fmt = o.format || fmtNum; this.quant = o.quant || 0;
  this.noteSrc = o.note || ''; this.noteStr = null;
  // headline: a floor Text lying on the board top (child of the counter), so the layout engine turns it into
  // an HTML text when it projects below 12 px or collides; the canvas only carries the big number
  var hs = o.labelSize || 0.34;
  var head = new Text(api, this.label, [0, 0, 0], {size: hs, color: o.color || 'red', align: 'left'});
  api._root.remove(head.obj); g.add(head.obj);
  var tw = head.m.scale.x; if(tw > w - 0.3){ head.size = Math.max(0.18, hs*(w - 0.3)/tw); head._draw(); }
  head.obj.position.set(-w/2 + 0.14, h + 0.006, -d/2 + head.size*0.75); head.base.copy(head.obj.position);
  this.head = head;
  var note = new Text(api, '', [0, 0, 0], {size: o.noteSize || 0.46, color: o.noteColor || 'ink', align: 'left'});
  api._root.remove(note.obj); g.add(note.obj);
  note.obj.position.set(-w/2, 0.005, d/2 + 0.38); note.base.copy(note.obj.position);
  head._obsW = 6; note._obsW = 3; g.userData.counter = this;
  this.note = note; this.mats = [box.material, edges.material, fm].concat(note.mats, head.mats);
  var n0 = typeof this.noteSrc === 'function' ? String(this.noteSrc(o.noteFitValue != null ? o.noteFitValue : 0)) : String(this.noteSrc || '');
  note.str = n0; note._draw();
  if(o.pos){ g.position.copy(V(o.pos)); this.base.copy(g.position); }
  this._col = o.color || 'red'; this._theme(); api._add(this);
  var self = this;
  api._ticks.push(function(){
    var v = self.quant ? Math.round(self.val.v/self.quant)*self.quant : self.val.v;
    var t = self.fmt(v); if(t !== self.shown){ self.shown = t; self._draw(); }
    var ns = typeof self.noteSrc === 'function' ? String(self.noteSrc(Math.round(v))) : String(self.noteSrc || '');
    if(ns !== self.noteStr){ self.noteStr = ns; self.note.str = ns; self.note._draw(); }
  });
}
Counter.prototype = Object.create(Thing.prototype);
Counter.prototype._draw = function(){
  var c = this.cv.getContext('2d'), pal = palette(this._col), W = this.CW, H = this.CH;
  c.clearRect(0, 0, W, H); c.fillStyle = pal.text; c.textBaseline = 'middle';
  c.font = '600 60px ' + FONT; c.textAlign = 'left';
  var t = this.shown != null ? this.shown : this.fmt(this.val.v), fs = Math.min(Math.floor(H*0.44), t.length <= 4 ? 170 : Math.floor(700/t.length));
  c.font = '600 ' + fs + 'px ' + FONT; c.textAlign = 'right'; c.fillText(t, W - 26, H - fs*0.58);
  var tw = c.measureText(t).width;
  this._numRects = [{x0: W - 26 - tw - 8, x1: W - 18, y0: H - fs*1.1, y1: H - fs*0.1}];   // canvas px of the big number (layout keep-out zone)
  if(this.unit){ c.font = '500 40px ' + FONT; c.textAlign = 'left'; var us = pluralUnit(t.replace(/\s/g, ''), this.unit); c.fillText(us, 22, H - 34); this._numRects.push({x0: 16, x1: 28 + c.measureText(us).width, y0: H - 58, y1: H - 10}); }
  this.tex.needsUpdate = true; E.dirty = true;
};
Counter.prototype._applyColor = function(o){
  if(this.head && this.head._col !== this._col){ this.head._col = this._col; this.head._draw(); }
  var pal = palette(this._col), self = this, oo = Object.assign({}, o || {}); oo.onStart = function(){ self._draw(); };
  tweenColor(this.box.material.color, pal.fill, oo); tweenColor(this.edges.material.color, pal.edge, o);
};
Counter.prototype.set = function(n, o){ tween(this.val, {v: n}, Object.assign({ms: 900}, o || {})); return this; };
Counter.prototype.setLabel = function(t, o){ var self = this; later(function(){ self.label = String(t); if(self.head){ self.head.str = self.label; self.head._draw(); E.layoutDirty = true; } self._draw(); }, o && o.delay); return this; };
Counter.prototype.setNote = function(t, o){ var self = this; later(function(){ self.noteSrc = t; }, o && o.delay); return this; };
Counter.prototype.setText = function(v, o){ return this.set(+v || 0, o); };

/* ---------------- Badge (operation mark) ---------------- */
function Badge(api, text, o){
  o = o || {}; var G = geo(), str = String(text), n = Math.max(1, str.length);
  var w = o.w || Math.max(0.5, 0.16 + 0.25*n), h = 0.07, d = o.d || 0.46;
  var g = new THREE.Group();
  var box = new THREE.Mesh(G.box, new THREE.MeshLambertMaterial({transparent: true}));
  var edges = new THREE.LineSegments(G.boxEdges, new THREE.LineBasicMaterial({transparent: true}));
  box.scale.set(w, h, d); box.position.y = h/2; edges.scale.copy(box.scale); edges.position.y = h/2;
  var cv = textCanvas(Math.min(2048, Math.round(256*w/d)), 256), tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4;
  var fm = new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false});
  var plane = new THREE.Mesh(G.plane, fm); plane.rotation.x = -Math.PI/2; plane.scale.set(w, d, 1); plane.position.y = h + 0.003;
  g.add(box); g.add(edges); g.add(plane);
  Thing.call(this, api, g);
  this.box = box; this.edges = edges; this.cv = cv; this.tex = tex; this.h = h; this.mats = [box.material, edges.material, fm];
  this.str = str; this._strike = !!o.strike;
  if(o.pos){ g.position.copy(V(o.pos)); this.base.copy(g.position); }
  this._col = o.color || 'amber'; this._theme(); api._add(this);
}
Badge.prototype = Object.create(Thing.prototype);
Badge.prototype._draw = function(){
  var c = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height, pal = palette(this._col);
  c.clearRect(0, 0, W, H); c.fillStyle = pal.text; c.textAlign = 'center'; c.textBaseline = 'middle';
  var fs = 170; c.font = '600 ' + fs + 'px ' + FONT;
  while(fs > 60 && c.measureText(this.str).width > W - 30){ fs -= 10; c.font = '600 ' + fs + 'px ' + FONT; }
  c.fillText(this.str, W/2, H/2 + 8);
  if(this._strike){ c.strokeStyle = pal.text; c.lineWidth = 14; c.beginPath(); c.moveTo(W*0.08, H*0.72); c.lineTo(W*0.92, H*0.3); c.stroke(); }
  this.tex.needsUpdate = true; E.dirty = true;
};
Badge.prototype._applyColor = Tile.prototype._applyColor;
Badge.prototype.setText = function(v, o){ var self = this; later(function(){ self.str = String(v); self._draw(); }, o && o.delay); return this; };
Badge.prototype.strike = function(v, o){ var self = this; later(function(){ self._strike = v !== false; self._draw(); }, o && o.delay); return this; };

/* ---------------- api factory ---------------- */
function makeApi(root, layer){
  var api = {_root: root, _layer: layer, _things: [], _labels: [], _ticks: [], instant: true, stepIndex: 0};
  api._add = function(t){ api._root.add(t.obj); return t; };
  api.tween = tween; api.later = later; api.colors = LAB.colors;
  api.tile = function(v, o){ return new Tile(api, v, o); };
  api.box = function(size, o){ return new Box(api, size, o); };
  api.group = function(items){ return new Group(api, items); };
  function unpack(v){ return (v !== null && typeof v === 'object') ? v : {value: v}; }
  api.row = function(values, o){
    o = o || {}; var gap = o.gap || 1.1, p = V(o.pos), n = values.length, g = new Group(api);
    values.forEach(function(v, i){
      var u = unpack(v);
      g.add(new Tile(api, u.value, {pos: [p.x + (i - (n - 1)/2)*gap, p.y, p.z], color: u.color || o.color, strike: u.strike, size: o.size, h: o.h, face: o.face}));
    });
    return g;
  };
  api.grid = function(rows, cols, fn, o){
    o = o || {}; var gap = o.gap || 1.1, p = V(o.pos), g = new Group(api); g.cells = [];
    for(var r = 0; r < rows; r++){
      g.cells.push([]);
      for(var c = 0; c < cols; c++){
        var v = fn ? fn(r, c) : r*cols + c, t = null;
        if(v !== null && v !== undefined){ var u = unpack(v); t = g.add(new Tile(api, u.value, {pos: [p.x + (c - (cols - 1)/2)*gap, p.y, p.z + (r - (rows - 1)/2)*gap], color: u.color || o.color, strike: u.strike, size: o.size, h: o.h})); }
        g.cells[r].push(t);
      }
    }
    g.at = function(r, c){ return c == null ? g.items[r] : (g.cells[r] || [])[c] || null; };
    return g;
  };
  api.ring = function(n, o){
    o = o || {}; var p = V(o.pos), R = o.radius || Math.max(1.6, n*0.3), st = o.start || 0, g = new Group(api);
    for(var i = 0; i < n; i++){
      var a = st + i*2*Math.PI/n, v = o.values ? o.values[i] : i, u = unpack(v);
      g.add(new Tile(api, u.value, {pos: [p.x + R*Math.sin(a), p.y, p.z - R*Math.cos(a)], color: u.color || o.color, size: o.size || 0.8, h: o.h}));
    }
    g.radius = R; g.center = [p.x, p.y, p.z];
    g.angle = function(i){ return st + i*2*Math.PI/n; };
    return g;
  };
  api.stack = function(items, o){
    o = o || {}; var p = V(o.pos), h = o.h || 0.36, gap = o.gap != null ? o.gap : 0.05, g = new Group(api);
    items.forEach(function(v, i){ var u = unpack(v); g.add(new Tile(api, u.value, {pos: [p.x, p.y + i*(h + gap), p.z], color: u.color || o.color, size: o.size || 0.9, h: h, face: 'front'})); });
    return g;
  };
  api.bar = function(value, max, o){
    o = o || {}; var H = o.height || 3;
    var t = new Tile(api, o.text === false ? '' : value, {pos: o.pos, color: o.color || 'blue', size: o.size || 0.8, h: Math.max(0.02, H*value/max)});
    t.setValue = function(v, oo){ t.height(Math.max(0.02, H*v/max), oo); if(o.text !== false) t.setText(v, oo); return t; };
    return t;
  };
  api.arc = function(from, to, o){
    o = o || {}; var a = endpoint(from, 0.02), b = endpoint(to, 0.02), mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += o.height != null ? o.height : Math.max(0.6, a.distanceTo(b)*0.45);
    var pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(28);
    return new Line(api, pts, {color: o.color || 'blue', head: o.head, dashed: o.dashed, headScale: o.headScale});
  };
  api.arrow = function(from, to, o){
    o = o || {}; var a = endpoint(from, o.lift || 0.05), b = endpoint(to, o.lift || 0.05), pts;
    if(o.bend){ var mid = a.clone().add(b).multiplyScalar(0.5); mid.y += o.bend; pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(24); }
    else pts = [a, b];
    return new Line(api, pts, {color: o.color || 'ink', head: true, dashed: o.dashed, headScale: o.headScale});
  };
  api.line = function(points, o){ return new Line(api, points.map(V), o || {}); };
  api.pointer = function(o){
    o = o || {}; var g = new THREE.Group();
    var cone = new THREE.Mesh(geo().cone, new THREE.MeshLambertMaterial({transparent: true})); cone.rotation.x = Math.PI; cone.position.y = 0.2; cone.scale.set(1.4, 1.2, 1.4);
    var stem = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(0, 0.95, 0)]), new THREE.LineBasicMaterial({transparent: true}));
    g.add(cone); g.add(stem);
    var t = new Thing(api, g); t.mats = [cone.material, stem.material]; t.h = 1;
    t._applyColor = function(oo){ var pal = palette(t._col); tweenColor(cone.material.color, pal.edge, oo); tweenColor(stem.material.color, pal.edge, oo); };
    t.at = function(target, oo){ var p = endpoint(target, 0.12); return t.moveTo([p.x, p.y, p.z], oo); };
    t._col = o.color || 'violet'; t._theme(); api._add(t);
    if(o.pos) t.at(o.pos);
    return t;
  };
  api.bracket = function(a, b, o){
    o = o || {}; var dz = o.dz != null ? o.dz : 0.8;
    var geom = new THREE.BufferGeometry(); geom.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(18), 3));
    var mat = new THREE.LineBasicMaterial({transparent: true});
    var seg = new THREE.LineSegments(geom, mat); var g = new THREE.Group(); g.add(seg);
    var t = new Thing(api, g); t.mats = [mat]; t.span = {x0: 0, x1: 0, z: 0, y: 0.02};
    var txt = o.text != null ? new Text(api, o.text, [0, 0, 0], {color: o.color || 'ink', size: 0.36}) : null;
    t._applyColor = function(oo){ var pal = palette(t._col); tweenColor(mat.color, pal.edge, oo); if(txt) txt.color(t._col); };
    t.set = function(A, B, oo){
      var pa = endpoint(A, 0), pb = endpoint(B, 0), half = (o.half != null ? o.half : 0.45);
      tween(t.span, {x0: Math.min(pa.x, pb.x) - half, x1: Math.max(pa.x, pb.x) + half, z: Math.max(pa.z, pb.z) + dz}, oo);
      if(txt) txt.moveTo([(pa.x + pb.x)/2, 0, Math.max(pa.z, pb.z) + dz + 0.35], oo);
      return t;
    };
    t.setText = function(v, oo){ if(txt) txt.setText(v, oo); return t; };
    var last = '';
    api._ticks.push(function(){
      var s = t.span, key = s.x0.toFixed(3) + s.x1.toFixed(3) + s.z.toFixed(3);
      if(key === last) return; last = key;
      var arr = geom.attributes.position.array, y = s.y, k = 0;
      function P(x, yy, z){ arr[k++] = x; arr[k++] = yy; arr[k++] = z; }
      P(s.x0, y, s.z); P(s.x1, y, s.z); P(s.x0, y, s.z - 0.22); P(s.x0, y, s.z + 0.001); P(s.x1, y, s.z - 0.22); P(s.x1, y, s.z + 0.001);
      geom.attributes.position.needsUpdate = true; geom.computeBoundingSphere(); E.dirty = true;
    });
    var baseOpacity = t.opacity;
    t.opacity = function(v, oo){ baseOpacity.call(t, v, oo); if(txt) txt.opacity(v, oo); return t; };
    t._col = o.color || 'ink'; t._theme(); api._add(t);
    t.set(a, b); return t;
  };
  api.text = function(str, pos, o){ return new Text(api, trS(str), pos, o); };
  api.counter = function(label, o){ if(o && typeof o.note === 'string') o.note = trS(o.note); return new Counter(api, trS(label), o); };
  function trS(v){ return typeof v === 'string' || (v && typeof v === 'object' && (v.ru != null || v.en != null)) ? tr(v, S && S.def && S.def.id) : v; }
  api.plural = plural; api.L = T; api.t = function(o){ return tr(o, S && S.def && S.def.id); }; api.lang = LANG; api.fmt = fmt;
  api.badge = function(text, o){ return new Badge(api, trS(text), o); };
  api.marks = function(target, list, o){
    o = o || {}; var g = new Group(api), wp = new THREE.Vector3();
    if(target && target.obj) target.obj.getWorldPosition(wp); else wp.copy(V(target));
    var half = (target && target.s ? target.s : 0.9)/2, gap = o.gap || 0.54, dir = o.dir === 'front' ? 1 : -1;
    (list || []).forEach(function(it, k){
      var u = (it !== null && typeof it === 'object') ? it : {text: it};
      g.add(new Badge(api, u.text, {pos: [wp.x, o.y != null ? o.y : (target && target.h ? target.h : 0), wp.z + dir*(half + 0.3 + k*gap)], color: u.color || o.color || 'amber', strike: u.strike}));
    });
    g.show = function(k, oo){
      oo = oo || {}; var d0 = oo.delay || 0, ev = oo.every != null ? oo.every : 90;
      g.items.forEach(function(b, i){ if(i < k) b.fadeIn({delay: d0 + i*ev}); else b.fadeOut(); });
      return g;
    };
    return g;
  };
  api.meter = function(max, o){
    o = o || {}; var p = V(o.pos), L = o.length || 6, labels = o.labels || [T('в лоб', 'head-on'), T('с приёмом', 'with the method')];
    var units = o.units || [o.unit || '', o.unit || ''];   // genitive plural, agreed with the number
    var g = new Group(api), prox = {a: 0, b: 0}, fmt = o.format || fmtNum;
    var ts = o.textSize || 0.46, gap = Math.max(0.5, ts*1.3);   // row pitch follows the real text height, so the two legends never touch
    var bars = [['red', -gap], ['green', gap]].map(function(d){ return g.add(new Box(api, [0.02, 0.22, Math.min(0.5, gap*1.1)], {pos: [p.x, p.y, p.z + d[1]], color: d[0]})); });
    var names = labels.map(function(t, k){ return g.add(new Text(api, t, [p.x - 0.25, p.y, p.z + (k ? gap : -gap)], {align: 'right', size: ts, color: k ? 'green' : 'red'})); });
    var vals = [0, 1].map(function(k){ return g.add(new Text(api, '', [p.x + 0.25, p.y, p.z + (k ? gap : -gap)], {align: 'left', size: ts, color: k ? 'green' : 'red'})); });
    var frame = g.add(api.line([[p.x, p.y + 0.01, p.z - gap - 0.4], [p.x, p.y + 0.01, p.z + gap + 0.4]], {color: 'ink'}));
    names.concat(vals).forEach(function(t){ t._obsW = 6; t._meter = true; });
    g.max = max; g.length = L; g.bars = bars; g.names = names; g.values = vals; g.frame = frame;
    var last = '';
    api._ticks.push(function(){
      var key = prox.a.toFixed(3) + '|' + prox.b.toFixed(3); if(key === last) return; last = key;
      [prox.a, prox.b].forEach(function(v, k){
        var len = Math.max(0.02, L*Math.min(1, v/(g.max || 1))), b = bars[k];
        b.box.scale.x = len; b.edges.scale.x = len; b.box.position.x = len/2; b.edges.position.x = len/2;
        vals[k].obj.position.x = p.x + len + 0.25;
      });
      E.dirty = true;
    });
    g.set = function(naive, method, oo){
      oo = oo || {}; tween(prox, {a: naive, b: method}, Object.assign({ms: 800}, oo));
      later(function(){ vals[0].setText(fmt(naive) + (units[0] ? ' ' + pluralUnit(naive, units[0]) : '')); vals[1].setText(fmt(method) + (units[1] ? ' ' + pluralUnit(method, units[1]) : '')); }, oo.delay);
      return g;
    };
    g.set(o.naive || 0, o.method || 0);
    return g;
  };
  api.label = function(html, target, o){ return new Label(api, trS(html), target, o); };
  api.tree = function(root, o){
    o = o || {}; var p = V(o.pos), dx = o.dx || 1.3, dz = o.dz || 1.5, nodes = [], edges = [], leaf = 0;
    function lay(n, d, parent){
      var kids = n.children || [], x;
      if(!kids.length){ x = leaf++; } else { var xs = kids.map(function(k){ return lay(k, d + 1, n); }); x = (xs[0] + xs[xs.length - 1])/2; }
      n._x = x; n._d = d; nodes.push(n); return x;
    }
    lay(root, 0, null);
    var shift = (leaf - 1)/2, maxD = Math.max.apply(null, nodes.map(function(n){ return n._d; }));
    nodes.forEach(function(n){ n.thing = new Tile(api, n.value != null ? n.value : n.v, {pos: [p.x + (n._x - shift)*dx, p.y, p.z + (n._d - maxD/2)*dz], color: n.color || o.color, size: o.size || 0.8}); });
    nodes.forEach(function(n){ (n.children || []).forEach(function(k){ var e = api.arrow(n.thing, k.thing, {color: o.edgeColor || 'plain', lift: 0.02}); e.from = n; e.to = k; edges.push(e); }); });
    return {nodes: nodes, edges: edges, root: root, find: function(v){ for(var i = 0; i < nodes.length; i++){ var nv = nodes[i].value != null ? nodes[i].value : nodes[i].v; if(nv === v) return nodes[i].thing; } return null; }};
  };
  api.fit = function(){ E.fitNow = true; E.dirty = true; };
  api.view = function(v){ if(!v) return; if(v.yaw != null) E.yaw = v.yaw; if(v.pitch != null) E.pitch = v.pitch; if(v.fill) E.fill = v.fill; E.fitNow = true; E.dirty = true; };
  return api;
}

/* ---------------- stage ---------------- */
var S = LAB._S = null;
function hasGL(){ try{ var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }catch(e){ return false; } }

LAB.mount = function(opt){
  opt = opt || {};
  var host = opt.stage;
  LAB.ui = opt;
  if(!host || !hasGL()){ LAB.noGL = true; return false; }
  var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setClearColor(0x000000, 0);
  var canvas = renderer.domElement; canvas.className = 'gl'; host.appendChild(canvas);
  var layer = document.createElement('div'); layer.className = 'lbls'; host.appendChild(layer);
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  var dl = new THREE.DirectionalLight(0xffffff, 0.35); dl.position.set(5, 12, 8); scene.add(dl);
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 500);
  S = LAB._S = {host: host, renderer: renderer, canvas: canvas, layer: layer, scene: scene, cam: cam, world: null, grid: null, api: null, def: null, state: null,
    w: 1, h: 1, zoom: 1, visible: true, idx: 0, playing: false, holdUntil: 0};
  E.yaw = 0.3; E.pitch = 0.95; E.fill = 0.86;
  bindControls(canvas);
  var ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if(ro) ro.observe(host); else window.addEventListener('resize', resize);
  resize();
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ S.visible = e.isIntersecting; if(S.visible) E.dirty = true; }); }).observe(host);
  var mo = function(){ themeChanged(); };
  if(window.matchMedia){ var mq = matchMedia('(prefers-color-scheme: dark)'); if(mq.addEventListener) mq.addEventListener('change', mo); }
  new MutationObserver(mo).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ themeChanged(); });
  bindPlayer();
  requestAnimationFrame(loop);
  return true;
};
function resize(){
  if(!S) return; var w = S.host.clientWidth, h = S.host.clientHeight; if(!w || !h) return;
  S.w = w; S.h = h; S.renderer.setSize(w, h, false); E.dirty = true; E.layoutDirty = true; E.pad = {l: 0, r: 0, t: 0, b: 0}; E.padIter = 0;
}
function themeChanged(){
  if(!S || !S.api) return;
  S.api._things.forEach(function(t){ t._theme(); if(t instanceof Text) t.sw = 0; });
  S.api._labels.forEach(function(L){ L.sw = 0; }); E.layoutDirty = true;
  if(S.gridMats){ S.gridMats[0].color.set(tok('--g3d-minor')); S.gridMats[1].color.set(tok('--g3d-major')); }
  E.dirty = true;
}
function bindControls(c){
  var ptrs = new Map(), down = null;
  c.addEventListener('pointerdown', function(e){ try{ c.setPointerCapture(e.pointerId); }catch(_){} ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY}); down = {x: e.clientX, y: e.clientY}; S.dragging = true; });
  c.addEventListener('pointermove', function(e){
    var p = ptrs.get(e.pointerId); if(!p) return;
    if(ptrs.size >= 2){
      var a0 = Array.from(ptrs.values()), d0 = Math.hypot(a0[0].x - a0[1].x, a0[0].y - a0[1].y);
      p.x = e.clientX; p.y = e.clientY;
      var a1 = Array.from(ptrs.values()), d1 = Math.hypot(a1[0].x - a1[1].x, a1[0].y - a1[1].y);
      if(d0 > 0 && d1 > 0) S.zoom = clamp(S.zoom*d1/d0, 0.5, 3);
      E.dirty = true; return;
    }
    var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
    E.yaw -= dx*0.008; E.pitch = clamp(E.pitch + dy*0.006, 0.15, 1.5); E.dirty = true;
  });
  var up = function(e){ ptrs.delete(e.pointerId); if(!ptrs.size){ S.dragging = false; E.layoutDirty = true; E.dirty = true; } };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  c.addEventListener('wheel', function(e){
    var nz = clamp(S.zoom*Math.exp(-e.deltaY*0.0012), 0.5, 3);
    if(Math.abs(nz - S.zoom) < 1e-4) return;
    e.preventDefault(); S.zoom = nz; E.dirty = true;
    clearTimeout(S.wheelT); S.wheelT = setTimeout(function(){ E.layoutDirty = true; E.dirty = true; }, 180);
  }, {passive: false});
}
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
LAB.resetView = function(){ if(!S) return; var v = (S.def && S.def.view) || {}; E.yaw = v.yaw != null ? v.yaw : 0.25; E.pitch = v.pitch != null ? v.pitch : 0.95; E.fill = v.fill || 0.86; S.zoom = 1; E.fitNow = true; E.dirty = true; };

function computeFit(){
  if(S.genPart >= 0 && S.gen && S.gen.parts[S.genPart]){ applyFit(S.gen.parts[S.genPart].fit); return; }
  var pts = [];
  S.world.updateMatrixWorld(true);
  S.world.traverse(function(o){
    if(!o.isMesh && !o.isLine && !o.isLineSegments) return;
    if(!o.visible || o.userData.noFit) return;
    var p = o; while(p && p !== S.world){ if(!p.visible) return; p = p.parent; }
    var b = new THREE.Box3().setFromObject(o); if(b.isEmpty()) return;
    for(var i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z));
  });
  if(!pts.length) pts.push(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 1, 2));
  var box = new THREE.Box3().setFromPoints(pts);
  S.fitPts = pts; S.center = box.getCenter(new THREE.Vector3());
  S.sceneFit = {pts: pts, box: box, center: S.center};
  buildGrid(box);
}
function fitOf(group){
  var pts = []; group.updateMatrixWorld(true);
  group.traverse(function(o){
    if(!o.isMesh && !o.isLine && !o.isLineSegments) return;
    if(o.userData.noFit) return;
    var b = new THREE.Box3().setFromObject(o); if(b.isEmpty()) return;
    for(var i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z));
  });
  if(!pts.length) pts.push(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 1, 2));
  var box = new THREE.Box3().setFromPoints(pts);
  return {pts: pts, box: box, center: box.getCenter(new THREE.Vector3())};
}
function applyFit(f){ if(!f) return; S.fitPts = f.pts; S.center = f.center; buildGrid(f.box); }
function buildGrid(box){
  if(S.grid){ S.scene.remove(S.grid); S.grid.traverse(function(o){ if(o.geometry) o.geometry.dispose(); }); }
  var m = 2, x0 = Math.floor(box.min.x - m), x1 = Math.ceil(box.max.x + m), z0 = Math.floor(box.min.z - m), z1 = Math.ceil(box.max.z + m);
  var a = [], b = [], st = 0.25, i;
  for(i = 0; x0 + i*st <= x1 + 1e-6; i++){ var x = x0 + i*st; (i % 4 === 0 ? b : a).push(x, -0.004, z0, x, -0.004, z1); }
  for(i = 0; z0 + i*st <= z1 + 1e-6; i++){ var z = z0 + i*st; (i % 4 === 0 ? b : a).push(x0, -0.004, z, x1, -0.004, z); }
  var g = new THREE.Group();
  if(!S.gridMats) S.gridMats = [new THREE.LineBasicMaterial(), new THREE.LineBasicMaterial()];
  S.gridMats[0].color.set(tok('--g3d-minor')); S.gridMats[1].color.set(tok('--g3d-major'));
  [a, b].forEach(function(arr, k){ var ge = new THREE.BufferGeometry(); ge.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); g.add(new THREE.LineSegments(ge, S.gridMats[k])); });
  S.grid = g; S.scene.add(g);
}
function place(){
  var cam = S.cam, W = S.w, H = S.h, cp = Math.cos(E.pitch), R = 80, c = S.center || new THREE.Vector3();
  cam.position.set(c.x + R*cp*Math.sin(E.yaw), c.y + R*Math.sin(E.pitch), c.z + R*cp*Math.cos(E.yaw));
  cam.lookAt(c); cam.updateMatrixWorld();
  var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, v = new THREE.Vector3();
  (S.fitPts || []).forEach(function(p){ v.copy(p).applyMatrix4(cam.matrixWorldInverse); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); });
  if(x0 > x1){ x0 = -3; x1 = 3; y0 = -2; y1 = 2; }
  var dx = Math.max(x1 - x0, 1.6), dy = Math.max(y1 - y0, 1.6), cx = (x0 + x1)/2, cy = (y0 + y1)/2;
  x0 = cx - dx/2; x1 = cx + dx/2; y0 = cy - dy/2; y1 = cy + dy/2;
  var P = E.pad || {l: 0, r: 0, t: 0, b: 0}, fill = E.fill || 0.86;
  var k = Math.min(W*fill/dx, H*fill/dy, Math.max(1, W - P.l - P.r - 8)/dx, Math.max(1, H - P.t - P.b - 8)/dy)*S.zoom;
  var exX = W - dx*k, exY = H - dy*k;
  var ml = P.l + (exX - P.l - P.r)/2, mt = P.t + (exY - P.t - P.b)/2;
  cam.left = x0 - ml/k; cam.right = cam.left + W/k; cam.top = y1 + mt/k; cam.bottom = cam.top - H/k;
  cam.updateProjectionMatrix();
}
/* ---------------- label layout: collision-avoiding placement ----------------
 * HTML labels (api.label) and floor texts that are too small or overlap objects (converted to HTML)
 * are placed by one deterministic pass: 8 directions x 3 leader lengths (+ centre for texts), the
 * candidate with the least penalty (overlap with objects / texts / placed labels, frame overflow,
 * leader length, direction preference, bonus for keeping the previous choice) wins. The pass runs
 * only when E.layoutDirty is set (step change, end of tweens, resize, end of camera move, label
 * show/text change); between passes each label keeps its choice and follows its anchor. */
var DIRS = [[1, -1, 0], [-1, -1, 1], [0, -1, 2], [1, 0, 3], [-1, 0, 3], [1, 1, 4], [-1, 1, 5], [0, 1, 5]];
var DISTS = [18, 34, 56];
function candBox(ax, ay, c, lw, lh){
  if(c.d === 0) return {l: ax - lw/2, t: ay - lh/2, r: ax + lw/2, b: ay + lh/2, ex: ax, ey: ay};
  var f = (c.dx && c.dy) ? 0.75 : 1, ex = ax + c.dx*c.d*f, ey = ay + c.dy*c.d*f;
  var l = c.dx > 0 ? ex : c.dx < 0 ? ex - lw : ex - lw/2, t = c.dy < 0 ? ey - lh : c.dy > 0 ? ey : ey - lh/2;
  return {l: l, t: t, r: l + lw, b: t + lh, ex: ex, ey: ey};
}
function frameOut(r, w, h){ var i = rectInter(r, {l: 2, t: 2, r: w - 2, b: h - 2}); return (r.r - r.l)*(r.b - r.t) - (i ? i.a : 0); }
function segIn(x1, y1, x2, y2, r){   // length (px) of the segment inside rect r, by sampling
  var n = 12, inn = 0, L = Math.hypot(x2 - x1, y2 - y1); if(L < 1) return 0;
  for(var i = 0; i < n; i++){ var f = (i + 0.5)/n, x = x1 + (x2 - x1)*f, y = y1 + (y2 - y1)*f; if(x > r.l && x < r.r && y > r.t && y < r.b) inn++; }
  return L*inn/n;
}
function chooseSpot(it, lw, lh, obs, placed, w, h, leaders){
  var cands = [], best = null, bestPen = 1e18, prev = it.L.choice;
  if(it.kind === 'text') cands.push({dx: 0, dy: 0, d: 0, pref: 0});
  DIRS.forEach(function(D){ DISTS.forEach(function(d){ cands.push({dx: D[0], dy: D[1], d: d, pref: D[2] + (it.kind === 'text' ? 1 : 0)}); }); });
  cands.forEach(function(c){
    var box = candBox(it.ax, it.ay, c, lw, lh), pen = 0;
    var lead = c.d > 0;
    if(lead) (it.digits || []).forEach(function(q){
      if(it.ownDigit && q.t === it.ownDigit) return;
      pen += segIn(it.ax, it.ay, box.ex, box.ey, q.r)*40;
      var i = rectInter(box, q.r); if(i) pen += i.a*6;
    });
    (it.ui || []).forEach(function(q){ var i = rectInter(box, q); if(i) pen += i.a*30; });
    if(it.counter){ var cr = it.counterRect, cx = (box.l + box.r)/2, cy = (box.t + box.b)/2;
      pen += Math.max(0, Math.max(cr.l - cx, cx - cr.r, cr.t - cy, cy - cr.b))*3; }
    obs.forEach(function(o){
      if(!o.hard && o.owner && it.owner && (isAncestor(o.owner, it.owner) || isAncestor(it.owner, o.owner)) && it.kind === 'text') return;
      var i = rectInter(box, o.r); if(i) pen += i.a*(o.w || 1);
      if(lead && o.hard) pen += segIn(it.ax, it.ay, box.ex, box.ey, o.r)*40;   // a leader must not strike through a big number
    });
    placed.forEach(function(q){ var i = rectInter(box, q); if(i) pen += i.a*3; if(lead) pen += segIn(it.ax, it.ay, box.ex, box.ey, q)*30; });
    (leaders || []).forEach(function(s){ if(s) pen += segIn(s[0], s[1], s[2], s[3], box)*30; });   // someone else's leader through this text
    pen += frameOut(box, w, h)*4 + c.d*0.6 + (c.d > DISTS[1] && !(it.kind === 'text' && it.L._noLead) ? (it.voidAnchor ? 400 : 0) : 0) + c.pref*8;
    if(prev && prev.dx === c.dx && prev.dy === c.dy && prev.d === c.d) pen -= 60;
    if(pen < bestPen){ bestPen = pen; best = c; }
  });
  return best;
}
function renderItem(it, c, box){
  if(it.kind === 'text' && it.L._noLead != null && c.d > 0 && it.L._noLead){ c = {dx: c.dx, dy: c.dy, d: c.d, pref: c.pref, hide: true}; }
  var el = it.el, ax = it.ax, ay = it.ay, svg = el.firstChild, an = svg.nextSibling, lt = el.lastChild;
  el.style.display = ''; el.style.opacity = '';
  el.style.transform = 'translate(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px)';
  lt.style.left = (box.l - ax).toFixed(1) + 'px'; lt.style.top = (box.t - ay).toFixed(1) + 'px'; lt.style.bottom = 'auto'; lt.style.right = 'auto';
  if(c.d === 0 || c.hide){ svg.style.display = 'none'; an.style.display = 'none'; }
  else {
    var ex = box.ex - ax, ey = box.ey - ay, x0 = Math.min(0, ex) - 1, y0 = Math.min(0, ey) - 1, W = Math.abs(ex) + 2, H = Math.abs(ey) + 2, ln = svg.firstChild;
    svg.style.display = ''; an.style.display = '';
    if(svg.hasAttribute('viewBox')) svg.removeAttribute('viewBox');
    svg.setAttribute('width', W); svg.setAttribute('height', H);
    svg.style.left = x0 + 'px'; svg.style.top = y0 + 'px'; svg.style.width = W + 'px'; svg.style.height = H + 'px'; svg.style.transform = 'none';
    ln.setAttribute('x1', -x0); ln.setAttribute('y1', -y0); ln.setAttribute('x2', ex - x0); ln.setAttribute('y2', ey - y0);
  }
  el.classList.toggle('lbs', c.dy > 0);
}
function textEl(t){
  if(!t._el){
    var el = document.createElement('div');
    el.innerHTML = '<svg class="ld"><line/></svg><i class="an"></i><span class="lt"></span>';
    S.layer.appendChild(el); t._el = el; t._elStr = null;
  }
  var cls = 'lb ftx c-' + (t._col || 'ink');
  if(t._el.className.replace(' lbs', '') !== cls) t._el.className = cls;
  if(t._elStr !== t.str){ t._el.lastChild.textContent = t.str; t._elStr = t.str; t.sw = 0; }
  return t._el;
}
function project(doLayout){
  var api = S.api; if(!api) return;
  var w = S.w, h = S.h, v = new THREE.Vector3(), items = [];
  var objs = null, nums = null;
  function getObjs(){ if(!objs) objs = solidRects(); return objs; }
  function getNums(){ if(!nums) nums = counterNumRects(); return nums; }
  api._labels.forEach(function(L){
    var cp = S.genPart >= 0 ? S.genPart : undefined;
    if(!L.vis || L._part !== cp || (L.target && L.target.obj && !isShown(L.target.obj))){ L.el.style.display = 'none'; return; }
    L._world(v); var q = toScreen(v);
    if(q.z > 1 || q.z < -1 || q.x < 0 || q.x > w || q.y < 0 || q.y > h){ L.el.style.display = 'none'; return; }
    items.push({kind: 'label', L: L, el: L.el, ax: q.x, ay: q.y, owner: L.target && L.target.obj});
  });
  var texts = floorTexts(), keptTextRects = [];
  api._things.forEach(function(t){ if(t instanceof Text && t._el && texts.indexOf(t) < 0) t._el.style.display = 'none'; });
  texts.forEach(function(t){
    if(doLayout){
      var fpx = textFontPx(t), rs = meshRects(t.m, 0), area = 0;
      rs.forEach(function(r){ area += Math.max(1, (r.r - r.l)*(r.b - r.t)); });
      var ov = 0;
      getObjs().forEach(function(o){ if(isAncestor(o.t.obj, t.obj)) return; var i = interLists(rs, o.rs); if(i) ov += i.a; });
      getNums().forEach(function(o){ if(t === o.t.head) return; var i = interList(o.r, rs); if(i) ov += i.a*4; });
      uiRects().forEach(function(q){ var i = interList(q, rs); if(i) ov += i.a*4; });
      var ovT = 0; keptTextRects.forEach(function(k){ var i = interLists(rs, k); if(i) ovT += i.a; });
      ov /= area; ovT /= area;
      t._conv = t._conv ? !(fpx >= 13.5 && ov < 0.03 && ovT < 0.03) : (fpx < 12 || ov > 0.08 || ovT > 0.08);
      if(!t._conv) keptTextRects.push(rs);
    }
    t.m.visible = !t._conv;
    if(t._conv){
      var el = textEl(t); t.m.updateWorldMatrix(true, false);
      var q = toScreen(new THREE.Vector3().setFromMatrixPosition(t.m.matrixWorld));
      if(q.x < 0 || q.x > w || q.y < 0 || q.y > h){ el.style.display = 'none'; return; }
      items.push({kind: 'text', L: t, el: el, ax: q.x, ay: q.y, owner: t.obj});
    } else if(t._el) t._el.style.display = 'none';
  });
  items.forEach(function(it){ var L = it.L; if(!L.sw){ it.el.style.display = ''; L.sw = it.el.lastChild.offsetWidth; L.sh = it.el.lastChild.offsetHeight; } });
  var obs = null;
  function getObs(){
    if(obs) return obs;
    obs = [];
    getObjs().forEach(function(o){ var wt = o.t instanceof Counter ? 4 : 1; o.rs.forEach(function(r){ obs.push({r: r, owner: o.t.obj, w: wt}); }); });
    ui.forEach(function(r){ obs.push({r: r, w: 30, hard: true}); });
    texts.forEach(function(t){ if(!t._conv) meshRects(t.m, 0).forEach(function(r){ obs.push({r: r, owner: t.obj, w: t._obsW || 0.7}); }); });
    getNums().forEach(function(o){ obs.push({r: o.r, owner: o.t.obj, w: 14, hard: true}); });
    return obs;
  }
  var digs = null, ui = uiRects();
  if(doLayout){
    digs = digitRects(); var solid = getObjs();
    items.forEach(function(it){
      it.digits = digs; it.ui = ui;
      var inObj = solid.some(function(o){ return o.rs.some(function(r){ return inRect(it.ax, it.ay, {l: r.l - 6, t: r.t - 6, r: r.r + 6, b: r.b + 6}); }); });
      it.voidAnchor = !inObj; if(it.kind === 'text') it.L._noLead = !inObj;
      if(it.kind === 'label' && it.L.target instanceof Tile) it.ownDigit = it.L.target;
      if(it.kind === 'text'){ var p = it.L.obj.parent; while(p && !(p.userData && p.userData.counter)) p = p.parent;
        if(p){ it.ownDigit = p.userData.counter; if(it.L === p.userData.counter.note){ it.counter = p.userData.counter; it.counterRect = unionRect(meshRects(it.counter.box, 0)); } } }
    });
  }
  var placed = [], leaders = [];
  items.forEach(function(it){
    var L = it.L, lw = L.sw || 40, lh = L.sh || 16, c = L.choice;
    if(doLayout || !c){ c = chooseSpot(it, lw, lh, getObs(), placed, w, h, leaders); L.choice = c; }
    var box = candBox(it.ax, it.ay, c, lw, lh);
    placed.push(box); leaders.push(c.d > 0 && !(it.kind === 'text' && L._noLead) ? [it.ax, it.ay, box.ex, box.ey, it.el, it.voidAnchor] : null);
  });
  if(doLayout && items.length > 1){
    // second pass: each item re-chooses knowing every other item's final box and leader (not only earlier ones)
    items.forEach(function(it, i){
      var L = it.L, lw = L.sw || 40, lh = L.sh || 16;
      var others = placed.filter(function(_, j){ return j !== i; }), ol = leaders.filter(function(s, j){ return s && j !== i; });
      var c = chooseSpot(it, lw, lh, getObs(), others, w, h, ol); L.choice = c;
      var box = candBox(it.ax, it.ay, c, lw, lh); placed[i] = box; leaders[i] = c.d > 0 && !(it.kind === 'text' && L._noLead) ? [it.ax, it.ay, box.ex, box.ey, it.el, it.voidAnchor] : null;
    });
  }
  items.forEach(function(it, i){ renderItem(it, it.L.choice, placed[i]); });
  leaders = leaders.filter(function(s){ return s; });
  S.lastPlaced = placed; S.lastLeaders = leaders;
  if(doLayout && S.fitPts){
    var extra = placed.slice(); texts.forEach(function(t){ if(!t._conv) meshRects(t.m, 0).forEach(function(r){ extra.push(r); }); });
    if(!extra.length) return;
    var C = {l: 1e9, t: 1e9, r: -1e9, b: -1e9};
    S.fitPts.forEach(function(p){ var q = toScreen(p); C.l = Math.min(C.l, q.x); C.r = Math.max(C.r, q.x); C.t = Math.min(C.t, q.y); C.b = Math.max(C.b, q.y); });
    var U = unionRect(extra), P = E.pad, grow = false;
    var need = {l: Math.min(w*0.3, Math.max(0, C.l - U.l + 6)), r: Math.min(w*0.3, Math.max(0, U.r - C.r + 6)), t: Math.min(h*0.3, Math.max(0, C.t - U.t + 6)), b: Math.min(h*0.3, Math.max(0, U.b - C.b + 6))};
    var out = {l: U.l < 2, r: U.r > w - 2, t: U.t < 2, b: U.b > h - 2};
    ['l', 'r', 't', 'b'].forEach(function(k){ if(out[k] && need[k] > P[k] + 6){ P[k] = need[k]; grow = true; } });
    if(grow && (E.padIter || 0) < 3){ E.padIter = (E.padIter || 0) + 1; E.layoutDirty = true; E.dirty = true; }
  }
}
/* ---------------- screen geometry, overlap audit ---------------- */
function isShown(o){ while(o){ if(!o.visible) return false; o = o.parent; } return true; }
function thingAlpha(t){ return t.mats && t.mats.length ? t.mats[0].opacity : 1; }
var _pv = new THREE.Vector3();
function toScreen(p){ _pv.copy(p).project(S.cam); return {x: (_pv.x*0.5 + 0.5)*S.w, y: (-_pv.y*0.5 + 0.5)*S.h, z: _pv.z}; }
function meshRects(mesh, shrink){
  mesh.updateWorldMatrix(true, false);
  var g = mesh.geometry; if(!g.boundingBox) g.computeBoundingBox();
  var bb = g.boundingBox, sc = new THREE.Vector3(); mesh.getWorldScale(sc);
  var ex = [(bb.max.x - bb.min.x)*Math.abs(sc.x), (bb.max.y - bb.min.y)*Math.abs(sc.y), (bb.max.z - bb.min.z)*Math.abs(sc.z)];
  var ax = ex[0] >= ex[2] ? 0 : 2, other = Math.max(1e-3, Math.min(ex[0] || 1e9, ex[2] || 1e9, ex[1] || 1e9));
  if(ex[1] > 0 && ex[1] < 1e-6) other = Math.max(1e-3, Math.min(ex[0], ex[2]));
  var k = Math.max(1, Math.min(32, Math.round(ex[ax]/Math.max(other, 0.25)/1.2)));
  var out = [], v = new THREE.Vector3(), lo = ax === 0 ? bb.min.x : bb.min.z, hi = ax === 0 ? bb.max.x : bb.max.z;
  for(var s = 0; s < k; s++){
    var a0 = lo + (hi - lo)*s/k, a1 = lo + (hi - lo)*(s + 1)/k, l = 1e9, t = 1e9, r = -1e9, b = -1e9;
    for(var i = 0; i < 8; i++){
      var cx = ax === 0 ? (i & 1 ? a1 : a0) : (i & 1 ? bb.max.x : bb.min.x), cz = ax === 2 ? (i & 4 ? a1 : a0) : (i & 4 ? bb.max.z : bb.min.z);
      v.set(cx, i & 2 ? bb.max.y : bb.min.y, cz).applyMatrix4(mesh.matrixWorld);
      var q = toScreen(v); l = Math.min(l, q.x); r = Math.max(r, q.x); t = Math.min(t, q.y); b = Math.max(b, q.y);
    }
    if(shrink){ var sx = (r - l)*shrink, sy = (b - t)*shrink; l += sx; r -= sx; t += sy; b -= sy; }
    out.push({l: l, t: t, r: r, b: b});
  }
  return out;
}
function unionRect(rs){ var u = {l: 1e9, t: 1e9, r: -1e9, b: -1e9}; rs.forEach(function(r){ u.l = Math.min(u.l, r.l); u.t = Math.min(u.t, r.t); u.r = Math.max(u.r, r.r); u.b = Math.max(u.b, r.b); }); return u; }
function interList(r, rs){ var a = 0, w = 0, h = 0; rs.forEach(function(q){ var i = rectInter(r, q); if(i){ a += i.a; w = Math.max(w, i.w); h = Math.max(h, i.h); } }); return a > 0 ? {a: a, w: w, h: h} : null; }
function interLists(ra, rb){ var a = 0, w = 0, h = 0; ra.forEach(function(r){ var i = interList(r, rb); if(i){ a += i.a; w = Math.max(w, i.w); h = Math.max(h, i.h); } }); return a > 0 ? {a: a, w: w, h: h} : null; }
function rectInter(a, b){ var w = Math.min(a.r, b.r) - Math.max(a.l, b.l), h = Math.min(a.b, b.b) - Math.max(a.t, b.t); return (w > 0 && h > 0) ? {w: w, h: h, a: w*h} : null; }
function isAncestor(a, o){ while(o){ if(o === a) return true; o = o.parent; } return false; }
function thingName(t){
  if(t instanceof Counter) return 'counter "' + t.label + '"';
  if(t instanceof Badge) return 'badge "' + t.str + '"';
  if(t instanceof Tile) return 'tile ' + (t.value == null ? '' : t.value);
  if(t instanceof Text) return 'text "' + t.str + '"';
  return 'box';
}
/* screen rects of the big number (and unit line) on every visible counter: a hard keep-out zone */
function counterNumRects(){
  var out = [], v = new THREE.Vector3();
  S.api._things.forEach(function(t){
    if(!(t instanceof Counter) || !t._numRects || !isShown(t.obj) || thingAlpha(t) < 0.3) return;
    t.obj.updateWorldMatrix(true, false);
    t._numRects.forEach(function(q, k){
      var l = 1e9, tp = 1e9, r = -1e9, b = -1e9;
      [[q.x0, q.y0], [q.x1, q.y0], [q.x0, q.y1], [q.x1, q.y1]].forEach(function(c){
        v.set(-t.w/2 + t.w*c[0]/t.CW, t.h + 0.003, -t.d/2 + t.d*c[1]/t.CH).applyMatrix4(t.obj.matrixWorld);
        var s = toScreen(v); l = Math.min(l, s.x); r = Math.max(r, s.x); tp = Math.min(tp, s.y); b = Math.max(b, s.y);
      });
      out.push({t: t, r: {l: l, t: tp, r: r, b: b}, name: 'counter "' + t.label + '" ' + (k ? 'unit' : 'number ' + (t.shown || ''))});
    });
  });
  return out;
}
/* screen rects of digits printed on tile faces (+ counter numbers): leaders must not cross them */
function digitRects(){
  var out = counterNumRects().map(function(o){ return {r: o.r, t: o.t, name: o.name}; });
  S.api._things.forEach(function(t){
    if(!(t instanceof Tile) || t.value == null || String(t.value) === '' || !isShown(t.obj) || thingAlpha(t) < 0.3) return;
    meshRects(t.plane, 0.2).forEach(function(r){ out.push({r: r, t: t, name: 'tile ' + t.value}); });
  });
  return out;
}
function uiRects(){
  var out = []; if(!S.host.querySelectorAll) return out;
  S.host.querySelectorAll('.sui').forEach(function(el){ if(el.offsetParent !== null){ var r = domRect(el); out.push({l: r.l - 4, t: r.t - 4, r: r.r + 4, b: r.b + 4}); } });
  return out;
}
function inRect(x, y, r){ return x > r.l && x < r.r && y > r.t && y < r.b; }
/* solid obstacles: tiles, boxes (not flat floor plates), counters, badges */
function solidThings(){
  var out = [];
  S.api._things.forEach(function(t){
    if(!t.box || !isShown(t.obj) || thingAlpha(t) < 0.3) return;
    if(t instanceof Box && t.box.scale.y < 0.06) return;
    out.push(t);
  });
  return out;
}
function solidRects(){ return solidThings().map(function(t){ return {t: t, rs: meshRects(t.box, t instanceof Badge ? 0 : 0.05), name: thingName(t)}; }); }
function floorTexts(){ return S.api._things.filter(function(t){ return t instanceof Text && t.str && isShown(t.obj) && thingAlpha(t) >= 0.3; }); }
function textFontPx(t){
  t.m.updateWorldMatrix(true, false);
  var a = toScreen(new THREE.Vector3(0, 0.5, 0).applyMatrix4(t.m.matrixWorld)), b = toScreen(new THREE.Vector3(0, -0.5, 0).applyMatrix4(t.m.matrixWorld));
  return Math.hypot(a.x - b.x, a.y - b.y)*0.62;
}
function domRect(el){ var h = S.host.getBoundingClientRect(), r = el.getBoundingClientRect(); return {l: r.left - h.left, t: r.top - h.top, r: r.right - h.left, b: r.bottom - h.top}; }
LAB.layoutNow = function(){
  if(!S || !S.api) return;
  for(var it = 0; it < 4; it++){
    S.api._ticks.forEach(function(f){ f(); });
    if(E.fitNow && S.world){ E.fitNow = false; computeFit(); }
    place(); S.world.updateMatrixWorld(true);
    E.layoutDirty = false; project(true); S.renderer.render(S.scene, S.cam);
    if(!E.layoutDirty) break;
  }
};
LAB.debugOverlaps = function(){
  if(!S || !S.api) return null;
  LAB.layoutNow();
  var W = S.w, H = S.h, items = [], counts = {'text-small': 0, 'label-object': 0, 'label-label': 0, 'text-object': 0, 'text-text': 0, 'label-text': 0, 'label-frame': 0, 'text-frame': 0, 'label-number': 0, 'text-number': 0, 'leader-label': 0, 'leader-void': 0, 'leader-digit': 0, 'label-ui': 0};
  var digs = digitRects(), uis = uiRects();
  var objs = solidRects(), nums = counterNumRects();
  var labels = [], texts = [];
  S.api._labels.forEach(function(L){ if(L.el.style.display === 'none') return; labels.push({name: 'label "' + L.el.lastChild.textContent + '"', rs: [domRect(L.el.lastChild)], owner: L.target && L.target.obj, el: L.el}); });
  floorTexts().forEach(function(t){
    if(t._conv && t._el && t._el.style.display !== 'none') texts.push({name: 'text "' + t.str + '"', rs: [domRect(t._el.lastChild)], owner: t.obj, html: true, el: t._el});
    else texts.push({name: 'text "' + t.str + '"', rs: meshRects(t.m, 0), owner: t.obj});
  });
  function add(type, a, b, i){ if(i && i.w >= 3 && i.h >= 3 && i.a >= 12){ counts[type]++; items.push({type: type, a: a, b: b, area: Math.round(i.a)}); } }
  function frame(type, x){ var u = unionRect(x.rs), o = Math.max(0, -u.l) + Math.max(0, u.r - W) + Math.max(0, -u.t) + Math.max(0, u.b - H); if(o > 2){ counts[type]++; items.push({type: type, a: x.name, b: 'frame', area: Math.round(o)}); } }
  labels.forEach(function(L, i){
    objs.forEach(function(o){ add('label-object', L.name, o.name, interLists(L.rs, o.rs)); });
    for(var j = i + 1; j < labels.length; j++) add('label-label', L.name, labels[j].name, interLists(L.rs, labels[j].rs));
    texts.forEach(function(T){ add('label-text', L.name, T.name, interLists(L.rs, T.rs)); });
    frame('label-frame', L);
    nums.forEach(function(o){ add('label-number', L.name, o.name, interList(o.r, L.rs)); });
  });
  labels.concat(texts.filter(function(T){ return T.html; })).forEach(function(X){ uis.forEach(function(q){ add('label-ui', X.name, 'scene buttons', interList(q, X.rs)); }); });
  (S.lastLeaders || []).forEach(function(s){
    var len = Math.hypot(s[2] - s[0], s[3] - s[1]), nm = 'leader of "' + s[4].lastChild.textContent + '"';
    var onAny = objs.some(function(o){ return o.rs.some(function(r){ return inRect(s[0], s[1], {l: r.l - 3, t: r.t - 3, r: r.r + 3, b: r.b + 3}); }); }) || texts.some(function(T){ return !T.html && T.rs.some(function(r){ return inRect(s[0], s[1], r); }); });
    if(len > 40 && !onAny){ counts['leader-void']++; items.push({type: 'leader-void', a: nm, b: 'anchor off objects', area: Math.round(len)}); }
    var tgt = null; S.api._labels.forEach(function(L){ if(L.el === s[4]) tgt = L.target; });
    digs.forEach(function(q){ if(q.t === tgt) return; var sl = segIn(s[0], s[1], s[2], s[3], q.r);
      if(sl >= 4){ counts['leader-digit']++; items.push({type: 'leader-digit', a: nm, b: q.name, area: Math.round(sl)}); } });
  });
  (S.lastLeaders || []).forEach(function(s){
    labels.concat(texts.filter(function(T){ return T.html; })).forEach(function(X){
      if(X.el === s[4]) return; var len = segIn(s[0], s[1], s[2], s[3], X.rs[0]);
      if(len >= 4){ counts['leader-label']++; items.push({type: 'leader-label', a: 'leader of "' + s[4].lastChild.textContent + '"', b: X.name, area: Math.round(len)}); }
    });
  });
  floorTexts().forEach(function(t){ if(t._conv) return; var f = textFontPx(t); if(f < 12){ counts['text-small']++; items.push({type: 'text-small', a: 'text "' + t.str + '"', b: Math.round(f*10)/10 + 'px', area: 0}); } });
  texts.forEach(function(T, i){
    objs.forEach(function(o){ if(isAncestor(o.t.obj, T.owner)) return; add('text-object', T.name, o.name, interLists(T.rs, o.rs)); });
    for(var j = i + 1; j < texts.length; j++) add('text-text', T.name, texts[j].name, interLists(T.rs, texts[j].rs));
    frame('text-frame', T);
    nums.forEach(function(o){ if(o.t.head && o.t.head.obj === T.owner) return; add('text-number', T.name, o.name, interList(o.r, T.rs)); });
  });
  var total = 0; for(var k in counts) total += counts[k];
  return {id: S.def && S.def.id, step: S.idx, total: total, counts: counts, items: items};
};

function loop(now){
  requestAnimationFrame(loop);
  if(!S) return;
  var busy = runTweens(now);
  if(S.api) S.api._ticks.forEach(function(f){ f(); });
  if(E.fitNow && S.world){ E.fitNow = false; computeFit(); E.dirty = true; }
  if(S.playing && !busy && now >= S.holdUntil){
    if(S.holdUntil === 0){ S.holdUntil = now + (reducedMotion() ? 2400 : 1500); }
    else { S.holdUntil = 0; if(S.idx < S.def.steps.length - 1) go(S.idx + 1, true); else setPlaying(false); }
  }
  if(!S.visible) return;
  if(S.wasBusy && !busy) E.layoutDirty = true;
  S.wasBusy = busy;
  if(busy || E.dirty || E.layoutDirty){
    place(); S.world.updateMatrixWorld(true);
    var doL = !!E.layoutDirty && !busy && !S.dragging; if(doL) E.layoutDirty = false;
    project(doL);                                   // before render: it may hide floor texts converted to HTML
    S.renderer.render(S.scene, S.cam); E.dirty = busy || !!E.layoutDirty;
  }
}


/* ---------------- generated chapters: compare + props (built from the method passport) ----------------
 * Every scene gets up to four extra steps after its own last step: compare (a) on the example,
 * compare (b) on the scale (only if the passport has a scale), props (a) complexity ladder,
 * props (b) contract. The scene's own objects live under S.sceneRoot and are hidden while a
 * generated step is shown; each generated step has its own group and its own camera fit. */
var CXL = ['O(1)', 'O(log n)', 'O(√n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'];
var CXW_RU = ['не растёт', 'как логарифм', 'как корень', 'пропорционально n', 'чуть быстрее n', 'как квадрат', 'удваивается с каждым n'];
var CXW_EN = ['does not grow', 'like a logarithm', 'like a square root', 'in step with n', 'a bit faster than n', 'like n squared', 'doubles with each n'];
function pnum(x){
  if(typeof x === 'number') return x; if(x == null) return NaN;
  var t = String(x).replace(/[\s ]/g, '');
  if(/^∞$|бесконеч/i.test(t)) return Infinity;
  var m = t.match(/^~?(\d+(?:[.,]\d+)?)\^(\d+)$/); if(m) return Math.pow(+m[1].replace(',', '.'), +m[2]);
  m = t.match(/^~?(\d+(?:[.,]\d+)?)$/); return m ? +m[1].replace(',', '.') : NaN;
}
function niceK(maxc){
  if(!(maxc > 60)) return 1;
  var need = maxc/45, seq = [1, 2, 5], b = 1;
  for(;;){ for(var i = 0; i < 3; i++){ var k = seq[i]*b; if(k >= need) return k; } b *= 10; }
}
function sentence(s){ s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
/* growth classes on log scale: lg(n) = log10 f(n) */
function lgFact(n){ if(n < 1) return 0; return (n*Math.log(n) - n + 0.5*Math.log(2*Math.PI*n) + 1/(12*n))*Math.LOG10E; }
var GCL = {
  '1': {w: 'не растёт', we: 'does not grow', o: 'O(1)', lg: function(n){ return 0; }},
  log: {w: 'очень медленно', we: 'very slowly', o: 'O(log n)', lg: function(n){ return Math.log10(Math.max(1, Math.log2(n))); }},
  sqrt: {w: 'как корень из n', we: 'like the square root of n', o: 'O(√n)', lg: function(n){ return 0.5*Math.log10(n); }},
  n: {w: 'вместе с n', we: 'in step with n', o: 'O(n)', lg: function(n){ return Math.log10(n); }},
  nlogn: {w: 'чуть быстрее n', we: 'a bit faster than n', o: 'O(n log n)', lg: function(n){ return Math.log10(n) + Math.log10(Math.max(1, Math.log2(n))); }},
  n2: {w: 'как n × n', we: 'like n × n', o: 'O(n²)', lg: function(n){ return 2*Math.log10(n); }},
  n3: {w: 'как n × n × n', we: 'like n × n × n', o: 'O(n³)', lg: function(n){ return 3*Math.log10(n); }},
  '2n': {w: 'вдвое с каждым +1 к n', we: 'doubling with each +1 to n', o: 'O(2ⁿ)', lg: function(n){ return n*Math.LOG10E*Math.LN2; }},
  nf: {w: 'как 1 · 2 · 3 · … · n', we: 'like 1 · 2 · 3 · … · n', o: 'O(n!)', lg: lgFact}
};
function supN(k){ return String(k).replace(/\d/g, function(d){ return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }).replace('-', '⁻'); }
function fmtLg(lg){
  if(!isFinite(lg)) return '∞';
  if(lg < 6) return fmtNum(Math.pow(10, lg));
  var e = Math.floor(lg + 1e-9), m = Math.pow(10, lg - e);
  if(m > 9.95){ e++; m = 1; }
  return (m < 1.05 ? '' : fmt(Math.round(m*10)/10, 1) + '·') + '10' + supN(e);
}
/* passport of the current language: EN overlay P.en is merged over the RU fields */
function mergeDeep(a, b){ if(b == null) return a; if(typeof a !== 'object' || a === null || Array.isArray(a) || typeof b !== 'object' || Array.isArray(b)) return b; var o = {}, k; for(k in a) o[k] = a[k]; for(k in b) o[k] = mergeDeep(a[k], b[k]); return o; }
function locP(P){ return LANG === 'en' && P && P.en ? mergeDeep(P, P.en) : P; }
function storyOf(P, id){ var s = P && P.story; if(!s) return null; if(s.ru || s.en){ var r = s[LANG]; if(!r){ r = s.ru; if(LANG === 'en') noteMissing(id, 'story'); } return r || null; } return s; }
LAB.locP = locP; LAB.storyOf = storyOf;
function buildGen(api, world, id, def){
  var D = window.LAB_DATA, P0 = D && D.props && D.props[id]; if(!P0) return null;
  var P = locP(P0);
  var CXW = LANG === 'en' ? CXW_EN : CXW_RU; function gw(k){ return LANG === 'en' ? GCL[k].we : GCL[k].w; }
  var nv = P.naive || {}, mv = P.method || {}, pr = P.props || {}, parts = [];
  var ST = storyOf(P0, id), TN = T('в лоб', 'head-on'), TM = ST && ST.trick ? ST.trick : T('с методом', 'with the method');
  function stc(s){ return String(s || '').replace(/[.\s]+$/, ''); }
  function lc(s){ s = stc(s); return s.charAt(0).toLowerCase() + s.slice(1); }
  function trimF(f, c){ var k = String(c).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return String(f || '').replace(new RegExp('\\s*(=|→)\\s*~?' + k + '(\\s+[а-яёa-z-]+)*\\s*$', 'i'), '').replace(new RegExp('^' + k + '\\s*=\\s*'), '').trim(); }
  var genRoot = new THREE.Group(); world.add(genRoot);
  function part(fn, view){
    var g = new THREE.Group(); g.visible = false; genRoot.add(g); api._root = g; api._partTag = parts.length;
    var st = fn(); var pt = {group: g, view: view || {yaw: 0.3, pitch: 0.95, fill: 0.86}, step: st.step, caption: st.caption, tag: st.tag, chapter: st.chapter, key: st.key};
    parts.push(pt); return pt;
  }
  var unitN = nv.unit || T('операций', 'operations'), unitM = mv.unit || nv.unit || T('операций', 'operations');
  var a = pnum(nv.cost), b = pnum(mv.cost), aInf = !isFinite(a) && a === Infinity;
  var gain = P.gainText || ((a > 0 && b > 0 && isFinite(a) && a/b > 1.001) ? T('в ' + fmt(a/b >= 10 ? Math.round(a/b) : Math.round(a/b*10)/10, 1) + ' ' + plural(Math.round(a/b), 'раз', 'раза', 'раз') + ' меньше', fmt(a/b >= 10 ? Math.round(a/b) : Math.round(a/b*10)/10, 1) + '× less work') : '');
  /* compare (a): two stacks of operation cubes */
  if(nv.cost != null && mv.cost != null){
    part(function(){
      var fin = [a, b].filter(function(v){ return isFinite(v) && v >= 0; }), k = niceK(Math.max.apply(null, fin.concat([1])));
      var cN = aInf ? 45 : Math.ceil(Math.max(0, a)/k), cM = isFinite(b) ? Math.ceil(Math.max(0, b)/k) : 45;
      var cs = 0.42, gp = 0.05;
      function stack(n, px, col){
        var arr = [];
        for(var i = 0; i < n; i++){ var layer = Math.floor(i/9), r = i % 9;
          arr.push(api.box([cs, cs, cs], {pos: [px + (r % 3 - 1)*(cs + gp), layer*(cs + 0.03), -1.6 + (Math.floor(r/3) - 1)*(cs + gp)], color: col})); }
        return arr;
      }
      var red = stack(cN, -3, 'red'), green = stack(cM, 3, 'green');
      var fmtN = aInf ? function(){ return '∞'; } : (a === Math.round(a) ? undefined : function(v){ return String(Math.round(v*1000)/1000).replace('.', ','); });
      var fmtM = b === Math.round(b) ? undefined : function(v){ return String(Math.round(v*1000)/1000).replace('.', ','); };
      var bN = api.counter(TN, {pos: [-3, 0, 1.4], color: 'red', unit: unitN, format: fmtN});
      var bM = api.counter(TM, {pos: [3, 0, 1.4], color: 'green', unit: unitM, format: fmtM});
      var zz = 3.2;
      function fl(str, sz, col){ if(!str) return []; var ws = String(str).split(' '), ln = [], cur = '', mx = Math.round(42*0.36/sz), ts = [];
        ws.forEach(function(w){ if(cur && (cur + ' ' + w).length > mx){ ln.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }); if(cur) ln.push(cur);
        ln.forEach(function(l){ ts.push(api.text(l, [-5.1, 0, zz], {size: sz, color: col, align: 'left'})); zz += sz*2.1; }); zz += 0.35; return ts; }
      if(!ST){ fl(nv.formula ? TN + ': ' + trimF(nv.formula, nv.cost) : '', 0.36, 'red'); fl(mv.formula ? TM + ': ' + trimF(mv.formula, mv.cost) : '', 0.36, 'green'); }
      var gT = ST ? [] : fl(gain, 0.42, 'green');
      if(!ST || k > 1) fl(T('1 кубик = ', '1 cube = ') + (k === 1 ? '1 ' + pluralUnit(1, unitN) : fmtNum(k) + ' ' + pluralUnit(k, unitN) + T(' (стопка округлена вверх)', ' (stack rounded up)')), 0.34, 'plain');
      var inf = aInf ? api.text('∞', [-3, 0, -3.1], {size: 0.8, color: 'red'}) : null;
      var cap = ST && ST.gain ? ST.gain[0] : T('На примере: в лоб ', 'In the example: head-on ') + (aInf ? T('бесконечно много', 'endlessly many') : nv.cost) + ' ' + pluralUnit(aInf ? 5 : a, unitN) + T(', с методом ', ', with the method ') + mv.cost + ' ' + pluralUnit(b, unitM) + (gain ? ' — ' + gain : '') + '.';
      return {chapter: 'compare', key: 'example', tag: T('итог', 'result'), caption: cap, step: function(anim){
        var all = red.concat(green), n = all.length;
        all.forEach(function(t, i){ t.show(false); t.fadeIn(anim ? {delay: 150 + Math.round(i*1300/Math.max(1, n)), ms: 220} : {}); });
        bN.set(aInf ? 0 : a, anim ? {ms: 1300} : {}); bM.set(isFinite(b) ? b : 0, anim ? {ms: 900} : {});
        gT.forEach(function(t){ t.show(false); t.fadeIn(anim ? {delay: 1500} : {}); });
      }};
    });
  }
  /* compare (b): growth on the real scale, log-log axes; numbers from passport scale.plot */
  var PL = P.scale && P.scale.plot;
  if(PL && GCL[PL.nc] && GCL[PL.mc]){
    part(function(){
      var W = 9, H = 5, Lx = Math.max(1, PL.n), inf = PL.naive === 'inf';
      var bud = PL.budget === null ? null : (PL.budget || {lg: 8, text: T('за 1 секунду компьютер успевает ≈ 10⁸ операций', 'a computer does ≈ 10⁸ operations per second')});
      var yTop = Math.max(3, Math.ceil(Math.max(PL.method, bud ? bud.lg : 0, (!inf && PL.naive <= 24) ? PL.naive : 0) + 0.6));
      function X(l){ return W*l/Lx; } function Y(v){ return H*Math.max(0, v)/yTop; }
      function vtext(str, pos, o){ var t = api.text(str, pos, o); t.obj.rotation.x = Math.PI/2; return t; }
      function curve(key, val){
        var off = val - GCL[key].lg(Math.pow(10, Lx)), pts = [], exit = null;
        for(var i = 0; i <= 90; i++){ var l = Lx*i/90, v = off + GCL[key].lg(Math.pow(10, l));
          if(v > yTop){ var pl = pts.length ? pts[pts.length - 1] : [0, 0, 0], pv = pl[1]*yTop/H, lx = Lx*(i - 1)/90, f = (yTop - pv)/Math.max(1e-9, v - pv), le = lx + (l - lx)*Math.min(1, Math.max(0, f)); pts.push([X(le), H, 0]); exit = X(le); break; }
          pts.push([X(l), Y(v), 0]); }
        return {pts: pts, exit: exit};
      }
      /* axes, ticks */
      api.line([[0, 0, 0], [W + 0.5, 0, 0]], {color: 'ink'}); api.line([[0, 0, 0], [0, H + 0.4, 0]], {color: 'ink'});
      var sx = Math.max(1, Math.ceil(Lx/6)), sy = Math.max(1, Math.ceil(yTop/6));
      for(var k = 0; k <= Lx + 1e-9; k += sx){ if(W - X(k) < 0.9 && k > 0) continue; api.line([[X(k), 0, 0], [X(k), -0.12, 0]], {color: 'ink'}); vtext(k === 0 ? '1' : k === 1 ? '10' : '10' + supN(k), [X(k), -0.42, 0], {size: 0.3, color: 'plain'}); }
      for(var j = sy; j <= yTop; j += sy){ api.line([[0, Y(j), 0], [-0.12, Y(j), 0]], {color: 'ink'}); vtext(j === 1 ? '10' : '10' + supN(j), [-0.22, Y(j), 0], {size: 0.3, color: 'plain', align: 'right'}); }
      var yt = api.text((PL.y || T('операций', 'operations')) + T(' — деление вверх: ×10', ' — each gridline up: ×10'), [-1.25, H/2, 0], {size: 0.32, color: 'ink'}); yt.obj.rotation.order = 'ZYX'; yt.obj.rotation.set(Math.PI/2, 0, Math.PI/2);
      vtext((PL.nName || T('размер задачи n', 'problem size n')) + T(' — деление вправо: ×10 →', ' — each gridline right: ×10 →'), [W/2, -0.95, 0], {size: 0.32, color: 'ink'});
      if(bud){ api.line([[0, Y(bud.lg), 0], [W + 0.3, Y(bud.lg), 0]], {color: 'amber', dashed: true}); vtext(bud.text, [0.2, Y(bud.lg) + 0.28, 0], {size: 0.28, color: 'amber', align: 'left'}); }
      /* marker at real n */
      api.line([[W, 0, 0], [W, H + 0.2, 0]], {color: 'plain', dashed: true});
      vtext('n = ' + fmtLg(PL.n), [W, -0.42, 0], {size: 0.32, color: 'ink'});
      var cM = curve(PL.mc, PL.method), lnM = api.line(cM.pts, {color: 'green'});
      var dM = api.box([0.2, 0.2, 0.2], {pos: [W, Y(PL.method) - 0.1, 0], color: 'green'});
      var hd = function(s){ return String(s || '').split(/\s[—–]\s/)[0].trim(); };
      var tN = hd(P.scale.naive), tM = hd(P.scale.method);
      var labs = [], lnN = null, dN = null, upN = null;
      labs.push(api.label(esc(TM + ': ' + tM + (PL.method >= 6 ? ' ≈ ' + fmtLg(PL.method) : '')), dM, {color: 'green', dy: 0.05}));
      if(inf){
        upN = api.arrow([W - 0.35, 0, 0], [W - 0.35, H + 0.6, 0], {color: 'red'});
        dN = [W - 0.35, H + 0.6, 0];
        labs.push(api.label(esc(TN + ': ' + tN + ' — ∞'), dN, {color: 'red', dy: 0.05}));
      } else {
        var cN = curve(PL.nc, PL.naive); lnN = api.line(cN.pts, {color: 'red'});
        if(cN.exit != null){
          upN = api.arrow([cN.exit, H, 0], [cN.exit, H + 0.7, 0], {color: 'red'});
          dN = [cN.exit, H + 0.7, 0];
          labs.push(api.label(esc(TN + T(' при n = ', ' at n = ') + fmtLg(PL.n) + ': ' + tN + ' ≈ ' + fmtLg(PL.naive) + T(' — выше графика', ' — above the chart')), dN, {color: 'red', dy: 0.05}));
        } else {
          dN = api.box([0.2, 0.2, 0.2], {pos: [W, Y(PL.naive) - 0.1, 0], color: 'red'});
          labs.push(api.label(esc(TN + ': ' + tN + (PL.naive >= 6 ? ' ≈ ' + fmtLg(PL.naive) : '')), dN, {color: 'red', dy: 0.05}));
        }
      }
      labs.forEach(function(L){ L.el.lastChild.style.whiteSpace = 'normal'; L.el.lastChild.style.width = 'max-content'; L.el.lastChild.style.maxWidth = '260px'; });
      var est = PL.est || '';
      api.text(TN + ': ' + (inf ? T('работа не кончается', 'the work never ends') : T('работа растёт ', 'work grows ') + gw(PL.nc) + '  ' + GCL[PL.nc].o) + (/naive|both/.test(est) ? T(' — форма примерная', ' — shape is approximate') : ''), [0, 0, 3.0], {size: 0.34, color: 'red', align: 'left'});
      api.text(TM + T(': работа растёт ', ': work grows ') + gw(PL.mc) + '  ' + GCL[PL.mc].o + (/method|both/.test(est) ? T(' — форма примерная', ' — shape is approximate') : ''), [0, 0, 3.6], {size: 0.34, color: 'green', align: 'left'});
      api.text(T('линия — как растёт работа, когда задача становится больше', 'each line shows how the work grows as the problem gets bigger'), [0, 0, 4.2], {size: 0.3, color: 'plain', align: 'left'});
      var cap = ST && ST.gain && ST.gain[1] ? ST.gain[1] : T('На масштабе задачи (', 'At full scale (') + String(P.scale.n || '').replace(/\.$/, '') + T('): в лоб ', '): head-on ') + String(P.scale.naive || '—').replace(/\.$/, '') + T(', с методом ', ', with the method ') + String(P.scale.method || '—').replace(/\.$/, '') + '.';
      return {chapter: 'compare', key: 'scale', tag: T('на больших числах', 'at scale'), caption: cap, step: function(anim){
        [lnN, lnM].forEach(function(c, i){ if(!c) return; c.show(false); c.fadeIn(anim ? {delay: 150 + i*500, ms: 500} : {}); });
        if(upN){ upN.show(false); upN.fadeIn(anim ? {delay: 700, ms: 300} : {}); }
      }};
    }, {yaw: 0.12, pitch: 0.3, fill: 0.86});
  }
  /* props (b): contract input -> method -> output */
  if(pr.input || pr.output || pr.gives || (pr.needs || []).length){
    part(function(){
      var bi = api.box([2.6, 0.35, 1.3], {pos: [-4.6, 0, 0], color: 'plain'}), bm = api.box([2.6, 0.7, 1.5], {pos: [0, 0, 0], color: 'green'}), bo = api.box([2.6, 0.35, 1.3], {pos: [4.6, 0, 0], color: 'plain'});
      var bw = ST ? TM : T('приём', 'method'), tm = api.text(bw, [0, 0.71, 0.3], {size: bw.length > 8 ? 0.3 : 0.5, color: 'green'}); bm.obj.add(tm.obj);
      api.text(T('дано', 'given'), [-4.6, 0.36, 0], {size: 0.4, color: 'ink'}); api.text(T('ответ', 'answer'), [4.6, 0.36, 0], {size: 0.4, color: 'ink'});
      api.arrow([-3.25, 0.2, 0], [-1.35, 0.2, 0], {color: 'ink'}); api.arrow([1.35, 0.2, 0], [3.25, 0.2, 0], {color: 'ink'});
      var labs = [];
      if(pr.input && !ST) labs.push(api.label(esc(pr.input), bi, {color: 'ink'}));
      if(pr.output && !ST) labs.push(api.label(esc(pr.output), bo, {color: 'ink'}));
      var ex = String(pr.exact == null ? '' : pr.exact), exl = ex.toLowerCase();
      var exK = (pr.exact === true || /^(true|exact|точн)/.test(exl)) ? 'exact' : /prob|вероят|random|случ/.test(exl) ? 'prob' : 'est';
      var exW = exK === 'exact' ? T('ответ точный', 'exact answer') : exK === 'prob' ? T('вероятностный', 'probabilistic') : (ex && ex !== 'false' ? ex : T('оценка', 'estimate'));
      api.badge(exW, {pos: [0, 0.7, -0.45], color: exK === 'exact' ? 'green' : exK === 'prob' ? 'amber' : 'blue'});
      var needs = ((ST && ST.needs) || pr.needs || []).slice(0, 4), nt = [];
      needs.forEach(function(nd, j){ var t = api.tile(j + 1, {pos: [-4.6 + j*0.0, 0, -2.2 - j*1.0], color: 'green', size: 0.6, h: 0.2}); nt.push(t); labs.push(api.label(esc(nd), t, {color: 'green'})); });
      if(needs.length) api.text(T('что нужно заранее:', 'needed beforehand:'), [-5.9, 0, -1.5], {size: 0.32, color: 'green', align: 'left'});
      var gz = 1.6, gtx = ST ? T('что гарантирует: ', 'guarantees: ') + lc(ST.guarantees) : pr.gives ? T('что гарантирует: ', 'guarantees: ') + stc(pr.gives) : '';
      if(gtx){ var gw = gtx.split(' '), gl = [], gc = ''; gw.forEach(function(w){ if(gc && (gc + ' ' + w).length > 52){ gl.push(gc); gc = w; } else gc = gc ? gc + ' ' + w : w; }); if(gc) gl.push(gc);
        gl.forEach(function(l){ api.text(l, [-5.9, 0, gz], {size: 0.34, color: 'ink', align: 'left'}); gz += 0.72; }); }
      labs.forEach(function(L){ L.el.lastChild.style.whiteSpace = 'normal'; L.el.lastChild.style.width = 'max-content'; L.el.lastChild.style.maxWidth = '300px'; });
      var cap = ST ? T('Когда применять: ', 'When to use: ') + stc(ST.whenToUse) + T('. Что нужно заранее: ', '. Needed beforehand: ') + (ST.needs || []).map(stc).join('; ') + T('. Что гарантирует: ', '. Guarantees: ') + stc(ST.guarantees) + '.' : T('Когда применять: дано ', 'When to use: given ') + stc(pr.input || '—') + T(', нужно получить ', ', find ') + stc(pr.output || '—') + (pr.gives ? T('. Что гарантирует: ', '. Guarantees: ') + stc(pr.gives) : '') + '.';
      return {chapter: 'props', key: 'use', tag: T('когда применять', 'when to use'), caption: cap, step: function(anim){
        nt.forEach(function(t, j){ t.show(false); t.fadeIn(anim ? {delay: 200 + j*250, ms: 250} : {}); });
      }};
    });
  }
  /* props (a): complexity ladder */
  if(pr.timeRank || pr.spaceRank){
    part(function(){
      var tr = +pr.timeRank || 0, sr = +pr.spaceRank || 0, steps = [];
      for(var k = 0; k < 7; k++){
        var x = (k - 3)*1.6, h = 0.25 + 0.45*k;
        steps.push({x: x, h: h, b: api.box([1.1, h, 1.1], {pos: [x, 0, 0], color: (k + 1 === tr ? 'blue' : k + 1 === sr ? 'teal' : 'plain')})});
        api.text(CXW[k], [x, 0, k % 2 ? 1.75 : 1.1], {size: 0.3, color: 'ink'});
        api.text(CXL[k], [x, 0, k % 2 ? 2.2 : 1.55], {size: 0.24, color: 'plain'});
      }
      var mk = [];
      if(tr){ var st = steps[tr - 1]; mk.push({b: api.badge(T('работа', 'work'), {w: 1.1, pos: [st.x, st.h, sr === tr ? -0.28 : 0], color: 'blue'}), h: st.h, txt: ST && ST.work ? ST.work : pr.timePlain || pr.time, col: 'blue'}); }
      if(sr){ var ss = steps[sr - 1]; mk.push({b: api.badge(T('память', 'memory'), {w: 1.1, pos: [ss.x, ss.h, sr === tr ? 0.28 : 0], color: 'teal'}), h: ss.h, txt: ST ? null : pr.spacePlain || pr.space, col: 'teal'}); }
      var zz = 3.0;
      mk.forEach(function(m){ if(!m.txt) return; var ws = ((m.col === 'blue' ? T('сколько работы: ', 'how much work: ') : T('сколько памяти: ', 'how much memory: ')) + m.txt).split(' '), ln = [], cur = '';
        ws.forEach(function(w){ if(cur && (cur + ' ' + w).length > 46){ ln.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; }); if(cur) ln.push(cur);
        m.ts = ln.map(function(l){ var t = api.text(l, [-5.1, 0, zz], {size: 0.34, color: m.col, align: 'left'}); zz += 0.72; return t; }); zz += 0.3; });
      var cap = ST && ST.work ? T('Сколько работы: ', 'How much work: ') + stc(ST.work) + '.' : T('Сколько работы: ', 'How much work: ') + stc(pr.timePlain || pr.time || '—') + T('; сколько памяти: ', '; how much memory: ') + stc(pr.spacePlain || pr.space || '—') + '.';
      return {chapter: 'props', key: 'work', tag: T('сколько работы', 'how much work'), caption: cap, step: function(anim){
        mk.forEach(function(m, i){ (m.ts || []).forEach(function(t){ t.show(false); t.fadeIn(anim ? {delay: 700 + i*400, ms: 300} : {}); }); m.b.lift(-m.h - 0.1); m.b.show(false); if(anim){ m.b.fadeIn({delay: 200 + i*400, ms: 200}); m.b.lift(0, {delay: 200 + i*400, ms: 700}); } else { m.b.show(true); m.b.lift(0); } });
      }};
    });
  }
  api._root = S.sceneRoot; api._partTag = undefined;
  parts.forEach(function(pt){ pt.group.visible = true; pt.fit = fitOf(pt.group); pt.group.visible = false; });
  return {root: genRoot, parts: parts};
}
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
function setPart(p){
  if(S.genPart === p) return;
  var was = S.genPart; S.genPart = p;
  S.sceneRoot.visible = p < 0;
  if(S.gen) S.gen.parts.forEach(function(pt, j){ pt.group.visible = j === p; });
  var v = p < 0 ? ((S.def && S.def.view) || {}) : S.gen.parts[p].view;
  if(p >= 0 || was >= 0){ E.yaw = v.yaw != null ? v.yaw : 0.25; E.pitch = v.pitch != null ? v.pitch : 0.95; E.fill = v.fill || 0.86; S.zoom = 1; }
  applyFit(p < 0 ? S.sceneFit : S.gen.parts[p].fit);
  E.pad = {l: 0, r: 0, t: 0, b: 0}; E.padIter = 0; E.layoutDirty = true; E.dirty = true;
}
function augment(def, gen){
  var n0 = def.steps.length, parts = gen ? gen.parts : [];
  var a = Object.create(def);
  a.sceneSteps = n0;
  a.steps = def.steps.map(function(st){ var c = {}; for(var k in st) c[k] = st[k]; c.caption = tr(st.caption, def.id); if(st.tag != null) c.tag = tr(st.tag, def.id); return c; })
    .concat(parts.map(function(pt){ return {chapter: pt.chapter, caption: pt.caption, tag: pt.tag, key: pt.key}; }));
  a.step = function(api, st, i){
    if(i < n0){ setPart(-1); return def.step(api, st, i); }
    var k = i - n0; setPart(k); parts[k].step(!api.instant);
  };
  return a;
}

/* ---------------- scene lifecycle ---------------- */
function disposeWorld(){
  killTweens();
  if(S.world){
    S.scene.remove(S.world);
    S.world.traverse(function(o){
      if(o.geometry && !(o.geometry.userData && o.geometry.userData.shared)) o.geometry.dispose();
      if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(function(m){ if(m.map) m.map.dispose(); m.dispose(); }); }
    });
  }
  S.layer.innerHTML = '';
  S.world = null; S.api = null; S.def = null; S.state = null; S.gen = null; S.genPart = -1; S.sceneRoot = null;
}
LAB.has = function(id){ return !!LAB.scenes[id]; };
LAB.open = function(id){
  if(!S) return false;
  setPlaying(false); disposeWorld();
  var def = LAB.scenes[id]; if(!def){ renderTimeline(null); E.dirty = true; return false; }
  var world = new THREE.Group(); S.scene.add(world); S.world = world;
  var sceneRoot = new THREE.Group(); world.add(sceneRoot); S.sceneRoot = sceneRoot; S.genPart = -1; S.gen = null;
  var api = makeApi(sceneRoot, S.layer); S.api = api; S.def = def;
  var v = def.view || {}; E.yaw = v.yaw != null ? v.yaw : 0.25; E.pitch = v.pitch != null ? v.pitch : 0.95; E.fill = v.fill || 0.86; S.zoom = 1;
  E.pad = {l: 0, r: 0, t: 0, b: 0}; E.padIter = 0; E.layoutDirty = true;
  try{
    E.instant = true; api.instant = true;
    S.state = def.build(api) || {};
    computeFit();
    try{ S.gen = buildGen(api, world, id, def); }catch(gerr){ S.gen = null; LAB.errors.push(id + ' (compare/props): ' + (gerr && gerr.message || gerr)); if(window.console) console.warn('[LAB]', gerr); }
    api._root = sceneRoot; api._partTag = undefined;
    S.def = augment(def, S.gen);
    S.idx = 0; api.stepIndex = 0; S.def.step(api, S.state, 0);
  }catch(err){
    LAB.errors.push(id + ': ' + (err && err.message || err)); if(window.console) console.warn('[LAB]', id, err);
    disposeWorld(); renderTimeline(null);
    if(LAB.ui && LAB.ui.onError) LAB.ui.onError(id, err);
    return false;
  }
  E.dirty = true; renderTimeline(S.def); updateCaption();
  return true;
};
function go(i, animate){
  if(!S || !S.def) return;
  var n = S.def.steps.length; i = clamp(i, 0, n - 1);
  if(!animate) killTweens();
  E.instant = !animate; S.api.instant = !animate; S.api.stepIndex = i;
  try{ S.def.step(S.api, S.state, i); }catch(err){ LAB.errors.push(S.def.id + ' step ' + i + ': ' + (err && err.message || err)); if(window.console) console.warn('[LAB]', err); }
  E.instant = true; S.api.instant = true;
  S.idx = i; E.dirty = true; E.layoutDirty = true; E.padIter = 0; updateCaption();
}
LAB.go = function(i){ setPlaying(false); go(i, false); };
LAB.next = function(){ if(!S || !S.def) return; setPlaying(false); if(S.idx < S.def.steps.length - 1) go(S.idx + 1, true); };
LAB.prev = function(){ if(!S || !S.def) return; setPlaying(false); go(S.idx - 1, false); };
LAB.first = function(){ if(!S || !S.def) return; setPlaying(false); go(0, false); };
function setPlaying(v){
  if(!S) return; S.playing = !!v && !!S.def; S.holdUntil = 0;
  var b = LAB.ui && LAB.ui.btnPlay; if(b){ b.setAttribute('aria-pressed', String(S.playing)); b.setAttribute('aria-label', S.playing ? T('Пауза', 'Pause') : T('Играть', 'Play')); if(LAB.ui.onPlay) LAB.ui.onPlay(S.playing); }
}
LAB.toggle = function(){
  if(!S || !S.def) return;
  if(S.playing){ setPlaying(false); return; }
  if(S.idx >= S.def.steps.length - 1) go(0, false);
  setPlaying(true); S.holdUntil = performance.now() + 500;
};
LAB.current = function(){ return S && S.def ? {id: S.def.id, step: S.idx, steps: S.def.steps.length, chapter: chapOf(S.def, S.idx), sceneSteps: S.def.sceneSteps} : null; };
LAB.steps = function(){ return S && S.def ? S.def.steps.map(function(st, i){ return {caption: String(st.caption), chapter: chapOf(S.def, i), tag: tagOf(S.def, i), key: st.key || null}; }) : []; };
LAB._sceneVisible = function(){ return !!(S && S.sceneRoot && S.sceneRoot.visible); };

/* ---------------- player UI ---------------- */
function tagOf(def, i){ var s = def.steps[i]; if(s.tag) return s.tag; return i === 0 ? '?' : i === def.steps.length - 1 ? '=' : String(i + 1); }
var CHAP = {problem: 'Проблема', idea: 'Идея', solve: 'Решение', compare: 'Сравнение', props: 'Свойства'};
var CHAP_EN = {problem: 'Problem', idea: 'Idea', solve: 'Solution', compare: 'Comparison', props: 'Properties'};
function chN(c){ return (LANG === 'en' ? CHAP_EN : CHAP)[c]; }
LAB.chapterName = chN;
LAB.chapters = CHAP;
function chapOf(def, i){ var c = def.steps[i] && def.steps[i].chapter; return CHAP[c] ? c : 'solve'; }
LAB.chapterOf = function(i){ return S && S.def ? chapOf(S.def, i) : null; };
function renderTimeline(def){
  var tl = LAB.ui && LAB.ui.timeline; if(!tl) return;
  if(!def){ tl.innerHTML = ''; if(LAB.ui.caption) LAB.ui.caption.textContent = ''; return; }
  var runs = [];
  def.steps.forEach(function(s, i){ var c = chapOf(def, i); if(!runs.length || runs[runs.length - 1].c !== c) runs.push({c: c, idx: []}); runs[runs.length - 1].idx.push(i); });
  tl.innerHTML = runs.map(function(r){
    return '<div class="chap ch-' + r.c + '" style="flex:' + r.idx.length + ' 1 0"><button type="button" class="chh" data-i="' + r.idx[0] + '" title="' + T('К началу главы', 'Go to the start of this chapter') + '">' + chN(r.c) + '</button><div class="segs">' +
      r.idx.map(function(i){ var s = def.steps[i];
        return '<button type="button" class="seg" data-i="' + i + '" aria-label="' + chN(r.c) + T(', шаг ', ', step ') + (i + 1) + ': ' + String(s.caption).replace(/"/g, '&quot;') + '"><b>' + (i + 1) + '</b><span>' + String(tagOf(def, i)).replace(/</g, '&lt;') + '</span></button>';
      }).join('') + '</div></div>';
  }).join('');
}
function updateCaption(){
  var ui = LAB.ui; if(!ui || !S || !S.def) return;
  var ch = chapOf(S.def, S.idx);
  if(ui.timeline){
    Array.prototype.forEach.call(ui.timeline.querySelectorAll('.seg'), function(b){ var i = +b.dataset.i; b.classList.toggle('done', i < S.idx); b.setAttribute('aria-current', i === S.idx ? 'step' : 'false'); });
    Array.prototype.forEach.call(ui.timeline.querySelectorAll('.chap'), function(c){ c.classList.toggle('on', c.classList.contains('ch-' + ch)); });
  }
  if(ui.caption){ var s = S.def.steps[S.idx]; ui.caption.className = ui.caption.className.replace(/\s*cap-\w+/g, '') + ' cap-' + ch; ui.caption.innerHTML = '<b>' + chN(ch) + T(' · шаг ', ' · step ') + (S.idx + 1) + ' / ' + S.def.steps.length + '</b>' + String(s.caption).replace(/</g, '&lt;'); }
  if(ui.onStep) ui.onStep(S.idx);
}
function bindPlayer(){
  var ui = LAB.ui || {};
  if(ui.btnFirst) ui.btnFirst.addEventListener('click', LAB.first);
  if(ui.btnPrev) ui.btnPrev.addEventListener('click', LAB.prev);
  if(ui.btnNext) ui.btnNext.addEventListener('click', LAB.next);
  if(ui.btnPlay) ui.btnPlay.addEventListener('click', LAB.toggle);
  if(ui.btnReset) ui.btnReset.addEventListener('click', LAB.resetView);
  if(ui.timeline) ui.timeline.addEventListener('click', function(e){
    var b = e.target.closest('.seg, .chh'); if(!b || !S || !S.def) return; var i = +b.dataset.i;
    setPlaying(false); if(i === S.idx + 1) go(i, true); else go(i, false);
  });
  document.addEventListener('keydown', function(e){
    var t = e.target, tag = t && t.tagName;
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    if(e.altKey || e.ctrlKey || e.metaKey) return;
    if(!S || !S.def) return;
    if(t && t.closest && t.closest('[role="tablist"]') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) return;
    if(e.key === 'ArrowRight'){ e.preventDefault(); LAB.next(); }
    else if(e.key === 'ArrowLeft'){ e.preventDefault(); LAB.prev(); }
    else if(e.key === ' ' || e.key === 'Spacebar'){ if(tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY') return; e.preventDefault(); LAB.toggle(); }
  });
}
})();
