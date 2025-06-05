(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var Fe;class vt extends Error{}vt.prototype.name="InvalidTokenError";function dr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ur(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return dr(t)}catch{return atob(t)}}function bs(i,t){if(typeof i!="string")throw new vt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new vt(`Invalid token specified: missing part #${e+1}`);let r;try{r=ur(s)}catch(n){throw new vt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new vt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const pr="mu:context",ce=`${pr}:change`;class fr{constructor(t,e){this._proxy=mr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ge extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new fr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ce,t),t}detach(t){this.removeEventListener(ce,t)}}function mr(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const a=i[r];console.log(`Context['${r.toString()}'] <= `,n);const l=Reflect.set(s,r,n,o);if(l){let u=new CustomEvent(ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:r,oldValue:a,value:n}),t.dispatchEvent(u)}else console.log(`Context['${r}] was not set to ${n}`);return l}})}function vr(i,t){const e=$s(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function $s(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return $s(i,r.host)}class gr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ws(i="mu:message"){return(t,...e)=>t.dispatchEvent(new gr(e,i))}class ye{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function yr(i){return t=>({...t,...i})}const he="mu:auth:jwt",xs=class Es extends ye{constructor(t,e){super((s,r)=>this.update(s,r),t,Es.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(br(s)),se(r);case"auth/signout":return e($r()),se(this._redirectForLogin);case"auth/redirect":return se(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};xs.EVENT_TYPE="auth:message";let Ss=xs;const As=ws(Ss.EVENT_TYPE);function se(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class _r extends ge{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:it.authenticateFromLocalStorage()})}connectedCallback(){new Ss(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(he),t}}class it extends rt{constructor(t){super();const e=bs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new it(t);return localStorage.setItem(he,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(he);return t?it.authenticate(t):new rt}}function br(i){return yr({user:it.authenticate(i),token:i})}function $r(){return i=>{const t=i.user;return{user:t&&t.authenticated?rt.deauthenticate(t):t,token:""}}}function wr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function xr(i){return i.authenticated?bs(i.token||""):{}}const R=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:it,Provider:_r,User:rt,dispatch:As,headers:wr,payload:xr},Symbol.toStringTag,{value:"Module"}));function Nt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function de(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const Er=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:de,relay:Nt},Symbol.toStringTag,{value:"Module"})),Sr=new DOMParser;function Ct(i,...t){const e=i.map((o,a)=>a?[t[a-1],o]:[o]).flat().join(""),s=Sr.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function Ft(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const ks=class Ps extends HTMLElement{constructor(){super(),this._state={},Ft(Ps.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Nt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},kr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};ks.template=Ct`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let Ar=ks;function kr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const a=o;a.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const Pr=Object.freeze(Object.defineProperty({__proto__:null,Element:Ar},Symbol.toStringTag,{value:"Module"})),Cs=class Os extends ye{constructor(t){super((e,s)=>this.update(e,s),t,Os.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(Or(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(Tr(s,r));break}}}};Cs.EVENT_TYPE="history:message";let _e=Cs;class Je extends ge{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Cr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),be(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new _e(this.context).attach(this)}}function Cr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Or(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Tr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const be=ws(_e.EVENT_TYPE),$e=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Je,Provider:Je,Service:_e,dispatch:be},Symbol.toStringTag,{value:"Module"}));class O{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Ye(this._provider,t);this._effects.push(r),e(r)}else vr(this._target,this._contextLabel).then(r=>{const n=new Ye(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Ye{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ts=class Is extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new O(this,"blazing:auth"),Ft(Is.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Ir(r,this._state,e,this.authorization).then(n=>ut(n,this)).then(n=>{const o=`mu-rest-form:${s}`,a=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(a)}).catch(n=>{const o="mu-rest-form:error",a=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(a)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ut(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&We(this.src,this.authorization).then(e=>{this._state=e,ut(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&We(this.src,this.authorization).then(r=>{this._state=r,ut(r,this)});break;case"new":s&&(this._state={},ut({},this));break}}};Ts.observedAttributes=["src","new","action"];Ts.template=Ct`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function We(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ut(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const a=o;a.checked=!!r;break;default:o.value=r;break}}}return i}function Ir(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Rs=class Us extends ye{constructor(t,e){super(e,t,Us.EVENT_TYPE,!1)}};Rs.EVENT_TYPE="mu:message";let Ls=Rs;class Rr extends ge{constructor(t,e,s){super(e),this._user=new rt,this._updateFn=t,this._authObserver=new O(this,s)}connectedCallback(){const t=new Ls(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Ur=Object.freeze(Object.defineProperty({__proto__:null,Provider:Rr,Service:Ls},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,we=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),Ke=new WeakMap;let Ns=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ke.set(e,t))}return t}toString(){return this.cssText}};const Lr=i=>new Ns(typeof i=="string"?i:i+"",void 0,xe),Nr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ns(e,i,xe)},jr=(i,t)=>{if(we)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ut.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ge=we?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Lr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Mr,defineProperty:Dr,getOwnPropertyDescriptor:Hr,getOwnPropertyNames:zr,getOwnPropertySymbols:Br,getPrototypeOf:qr}=Object,nt=globalThis,Xe=nt.trustedTypes,Vr=Xe?Xe.emptyScript:"",Ze=nt.reactiveElementPolyfillSupport,gt=(i,t)=>i,jt={toAttribute(i,t){switch(t){case Boolean:i=i?Vr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ee=(i,t)=>!Mr(i,t),Qe={attribute:!0,type:String,converter:jt,reflect:!1,hasChanged:Ee};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),nt.litPropertyMetadata??(nt.litPropertyMetadata=new WeakMap);let tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Dr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Hr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const a=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const t=qr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const e=this.properties,s=[...zr(e),...Br(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ge(r))}else t!==void 0&&e.push(Ge(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return jr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:jt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),a=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:jt;this._$Em=n,this[n]=a.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ee)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[gt("elementProperties")]=new Map,tt[gt("finalized")]=new Map,Ze==null||Ze({ReactiveElement:tt}),(nt.reactiveElementVersions??(nt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mt=globalThis,Dt=Mt.trustedTypes,ts=Dt?Dt.createPolicy("lit-html",{createHTML:i=>i}):void 0,js="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Ms="?"+U,Fr=`<${Ms}>`,J=document,bt=()=>J.createComment(""),$t=i=>i===null||typeof i!="object"&&typeof i!="function",Ds=Array.isArray,Jr=i=>Ds(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",re=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ss=/>/g,z=RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rs=/'/g,is=/"/g,Hs=/^(?:script|style|textarea|title)$/i,Yr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ft=Yr(1),ot=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ns=new WeakMap,q=J.createTreeWalker(J,129);function zs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ts!==void 0?ts.createHTML(t):t}const Wr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=pt;for(let a=0;a<e;a++){const l=i[a];let u,f,h=-1,c=0;for(;c<l.length&&(o.lastIndex=c,f=o.exec(l),f!==null);)c=o.lastIndex,o===pt?f[1]==="!--"?o=es:f[1]!==void 0?o=ss:f[2]!==void 0?(Hs.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=r??pt,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?z:f[3]==='"'?is:rs):o===is||o===rs?o=z:o===es||o===ss?o=pt:(o=z,r=void 0);const d=o===z&&i[a+1].startsWith("/>")?" ":"";n+=o===pt?l+Fr:h>=0?(s.push(u),l.slice(0,h)+js+l.slice(h)+U+d):l+U+(h===-2?a:d)}return[zs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let ue=class Bs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const a=t.length-1,l=this.parts,[u,f]=Wr(t,e);if(this.el=Bs.createElement(u,s),q.currentNode=this.el.content,e===2){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=q.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(js)){const c=f[o++],d=r.getAttribute(h).split(U),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:n,name:p[2],strings:d,ctor:p[1]==="."?Gr:p[1]==="?"?Xr:p[1]==="@"?Zr:Jt}),r.removeAttribute(h)}else h.startsWith(U)&&(l.push({type:6,index:n}),r.removeAttribute(h));if(Hs.test(r.tagName)){const h=r.textContent.split(U),c=h.length-1;if(c>0){r.textContent=Dt?Dt.emptyScript:"";for(let d=0;d<c;d++)r.append(h[d],bt()),q.nextNode(),l.push({type:2,index:++n});r.append(h[c],bt())}}}else if(r.nodeType===8)if(r.data===Ms)l.push({type:2,index:n});else{let h=-1;for(;(h=r.data.indexOf(U,h+1))!==-1;)l.push({type:7,index:n}),h+=U.length-1}n++}}static createElement(t,e){const s=J.createElement("template");return s.innerHTML=t,s}};function at(i,t,e=i,s){var r,n;if(t===ot)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const a=$t(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==a&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),a===void 0?o=void 0:(o=new a(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=at(i,o._$AS(i,t.values),o,s)),t}let Kr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??J).importNode(e,!0);q.currentNode=r;let n=q.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Se(n,n.nextSibling,this,t):l.type===1?u=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(u=new Qr(n,this,t)),this._$AV.push(u),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=q.nextNode(),o++)}return q.currentNode=J,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Se=class qs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),$t(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Jr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==b&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(J.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ue.createElement(zs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Kr(n,this),a=o.u(this.options);o.p(s),this.T(a),this._$AH=o}}_$AC(t){let e=ns.get(t.strings);return e===void 0&&ns.set(t.strings,e=new ue(t)),e}k(t){Ds(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new qs(this.S(bt()),this.S(bt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Jt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=at(this,t,e,0),o=!$t(t)||t!==this._$AH&&t!==ot,o&&(this._$AH=t);else{const a=t;let l,u;for(t=n[0],l=0;l<n.length-1;l++)u=at(this,a[s+l],e,l),u===ot&&(u=this._$AH[l]),o||(o=!$t(u)||u!==this._$AH[l]),u===b?t=b:t!==b&&(t+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Gr=class extends Jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},Xr=class extends Jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},Zr=class extends Jt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??b)===ot)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Qr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}};const os=Mt.litHtmlPolyfillSupport;os==null||os(ue,Se),(Mt.litHtmlVersions??(Mt.litHtmlVersions=[])).push("3.1.3");const ti=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Se(t.insertBefore(bt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let st=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ot}};st._$litElement$=!0,st.finalized=!0,(Fe=globalThis.litElementHydrateSupport)==null||Fe.call(globalThis,{LitElement:st});const as=globalThis.litElementPolyfillSupport;as==null||as({LitElement:st});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ei={attribute:!0,type:String,converter:jt,reflect:!1,hasChanged:Ee},si=(i=ei,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,i)},init(a){return a!==void 0&&this.P(o,void 0,i),a}}}if(s==="setter"){const{name:o}=e;return function(a){const l=this[o];t.call(this,a),this.requestUpdate(o,l,i)}}throw Error("Unsupported decorator location: "+s)};function Vs(i){return(t,e)=>typeof e=="object"?si(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Fs(i){return Vs({...i,state:!0,attribute:!1})}function ri(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ii(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Js={};(function(i){var t=function(){var e=function(h,c,d,p){for(d=d||{},p=h.length;p--;d[h[p]]=c);return d},s=[1,9],r=[1,10],n=[1,11],o=[1,12],a=[5,11,12,13,14,15],l={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,p,g,v,y,Xt){var A=y.length-1;switch(v){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(a,[2,4]),e(a,[2,5]),e(a,[2,6]),e(a,[2,7]),e(a,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(a,[2,10]),e(a,[2,11]),e(a,[2,12]),{1:[2,1]},e(a,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(a,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let p=function(g,v){this.message=g,this.hash=v};throw p.prototype=Error,new p(c,d)}},parse:function(c){var d=this,p=[0],g=[null],v=[],y=this.table,Xt="",A=0,Be=0,ar=2,qe=1,lr=v.slice.call(arguments,1),_=Object.create(this.lexer),D={yy:{}};for(var Zt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Zt)&&(D.yy[Zt]=this.yy[Zt]);_.setInput(c,D.yy),D.yy.lexer=_,D.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Qt=_.yylloc;v.push(Qt);var cr=_.options&&_.options.ranges;typeof D.yy.parseError=="function"?this.parseError=D.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var hr=function(){var Z;return Z=_.lex()||qe,typeof Z!="number"&&(Z=d.symbols_[Z]||Z),Z},E,H,P,te,X={},It,I,Ve,Rt;;){if(H=p[p.length-1],this.defaultActions[H]?P=this.defaultActions[H]:((E===null||typeof E>"u")&&(E=hr()),P=y[H]&&y[H][E]),typeof P>"u"||!P.length||!P[0]){var ee="";Rt=[];for(It in y[H])this.terminals_[It]&&It>ar&&Rt.push("'"+this.terminals_[It]+"'");_.showPosition?ee="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Rt.join(", ")+", got '"+(this.terminals_[E]||E)+"'":ee="Parse error on line "+(A+1)+": Unexpected "+(E==qe?"end of input":"'"+(this.terminals_[E]||E)+"'"),this.parseError(ee,{text:_.match,token:this.terminals_[E]||E,line:_.yylineno,loc:Qt,expected:Rt})}if(P[0]instanceof Array&&P.length>1)throw new Error("Parse Error: multiple actions possible at state: "+H+", token: "+E);switch(P[0]){case 1:p.push(E),g.push(_.yytext),v.push(_.yylloc),p.push(P[1]),E=null,Be=_.yyleng,Xt=_.yytext,A=_.yylineno,Qt=_.yylloc;break;case 2:if(I=this.productions_[P[1]][1],X.$=g[g.length-I],X._$={first_line:v[v.length-(I||1)].first_line,last_line:v[v.length-1].last_line,first_column:v[v.length-(I||1)].first_column,last_column:v[v.length-1].last_column},cr&&(X._$.range=[v[v.length-(I||1)].range[0],v[v.length-1].range[1]]),te=this.performAction.apply(X,[Xt,Be,A,D.yy,P[1],g,v].concat(lr)),typeof te<"u")return te;I&&(p=p.slice(0,-1*I*2),g=g.slice(0,-1*I),v=v.slice(0,-1*I)),p.push(this.productions_[P[1]][0]),g.push(X.$),v.push(X._$),Ve=y[p[p.length-2]][p[p.length-1]],p.push(Ve);break;case 3:return!0}}return!0}},u=function(){var h={EOF:1,parseError:function(d,p){if(this.yy.parser)this.yy.parser.parseError(d,p);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var v=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[v[0],v[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var p,g,v;if(this.options.backtrack_lexer&&(v={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(v.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in v)this[y]=v[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,p,g;this._more||(this.yytext="",this.match="");for(var v=this._currentRules(),y=0;y<v.length;y++)if(p=this._input.match(this.rules[v[y]]),p&&(!d||p[0].length>d[0].length)){if(d=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,v[y]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,v[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,p,g,v){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();l.lexer=u;function f(){this.yy={}}return f.prototype=l,l.Parser=f,new f}();typeof ii<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Js);function Q(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Ys={Root:Q("Root"),Concat:Q("Concat"),Literal:Q("Literal"),Splat:Q("Splat"),Param:Q("Param"),Optional:Q("Optional")},Ws=Js.parser;Ws.yy=Ys;var ni=Ws,oi=Object.keys(Ys);function ai(i){return oi.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ks=ai,li=Ks,ci=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Gs(i){this.captures=i.captures,this.re=i.re}Gs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var hi=li({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ci,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Gs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),di=hi,ui=Ks,pi=ui({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),fi=pi,mi=ni,vi=di,gi=fi;Ot.prototype=Object.create(null);Ot.prototype.match=function(i){var t=vi.visit(this.ast),e=t.match(i);return e||!1};Ot.prototype.reverse=function(i){return gi.visit(this.ast,i)};function Ot(i){var t;if(this?t=this:t=Object.create(Ot.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=mi.parse(i),t}var yi=Ot,_i=yi,bi=_i;const $i=ri(bi);var wi=Object.defineProperty,Xs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&wi(t,e,r),r};class wt extends st{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ft`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new $i(r.path)})),this._historyObserver=new O(this,e),this._authObserver=new O(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ft`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(As(this,"auth/redirect"),ft`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):ft`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ft`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const a=o.route.match(n);if(a)return{...o,path:s,params:a,query:r}}}redirect(t){be(this,"history/redirect",{href:t})}}wt.styles=Nr`
    :host,
    main {
      display: contents;
    }
  `;Xs([Fs()],wt.prototype,"_user");Xs([Fs()],wt.prototype,"_match");const xi=Object.freeze(Object.defineProperty({__proto__:null,Element:wt,Switch:wt},Symbol.toStringTag,{value:"Module"})),Ei=class Zs extends HTMLElement{constructor(){if(super(),Ft(Zs.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ei.template=Ct`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Si=class Qs extends HTMLElement{constructor(){super(),this._array=[],Ft(Qs.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(tr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{de(t,"button.add")?Nt(t,"input-array:add"):de(t,"button.remove")&&Nt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ai(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Si.template=Ct`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function Ai(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(tr(e)))}function tr(i,t){const e=i===void 0?"":`value="${i}"`;return Ct`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function G(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ki=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,Ci=(i,t,e,s)=>{for(var r=Pi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ki(t,e,r),r};class ht extends st{constructor(t){super(),this._pending=[],this._observer=new O(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Ci([Vs()],ht.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt=globalThis,Ae=Lt.ShadowRoot&&(Lt.ShadyCSS===void 0||Lt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ke=Symbol(),ls=new WeakMap;let er=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ke)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ae&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ls.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ls.set(e,t))}return t}toString(){return this.cssText}};const Oi=i=>new er(typeof i=="string"?i:i+"",void 0,ke),S=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new er(e,i,ke)},Ti=(i,t)=>{if(Ae)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Lt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},cs=Ae?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Oi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ii,defineProperty:Ri,getOwnPropertyDescriptor:Ui,getOwnPropertyNames:Li,getOwnPropertySymbols:Ni,getPrototypeOf:ji}=Object,N=globalThis,hs=N.trustedTypes,Mi=hs?hs.emptyScript:"",ie=N.reactiveElementPolyfillSupport,yt=(i,t)=>i,Ht={toAttribute(i,t){switch(t){case Boolean:i=i?Mi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Pe=(i,t)=>!Ii(i,t),ds={attribute:!0,type:String,converter:Ht,reflect:!1,useDefault:!1,hasChanged:Pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),N.litPropertyMetadata??(N.litPropertyMetadata=new WeakMap);let et=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ds){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ri(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Ui(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const a=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ds}static _$Ei(){if(this.hasOwnProperty(yt("elementProperties")))return;const t=ji(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(yt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(yt("properties"))){const e=this.properties,s=[...Li(e),...Ni(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(cs(r))}else t!==void 0&&e.push(cs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ti(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ht).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Ht;this._$Em=r,this[r]=l.fromAttribute(e,a.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??Pe)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:a}=o,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};et.elementStyles=[],et.shadowRootOptions={mode:"open"},et[yt("elementProperties")]=new Map,et[yt("finalized")]=new Map,ie==null||ie({ReactiveElement:et}),(N.reactiveElementVersions??(N.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _t=globalThis,zt=_t.trustedTypes,us=zt?zt.createPolicy("lit-html",{createHTML:i=>i}):void 0,sr="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,rr="?"+L,Di=`<${rr}>`,Y=document,xt=()=>Y.createComment(""),Et=i=>i===null||typeof i!="object"&&typeof i!="function",Ce=Array.isArray,Hi=i=>Ce(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ne=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ps=/-->/g,fs=/>/g,B=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ms=/'/g,vs=/"/g,ir=/^(?:script|style|textarea|title)$/i,zi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),m=zi(1),lt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),gs=new WeakMap,V=Y.createTreeWalker(Y,129);function nr(i,t){if(!Ce(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return us!==void 0?us.createHTML(t):t}const Bi=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=mt;for(let a=0;a<e;a++){const l=i[a];let u,f,h=-1,c=0;for(;c<l.length&&(o.lastIndex=c,f=o.exec(l),f!==null);)c=o.lastIndex,o===mt?f[1]==="!--"?o=ps:f[1]!==void 0?o=fs:f[2]!==void 0?(ir.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=B):f[3]!==void 0&&(o=B):o===B?f[0]===">"?(o=r??mt,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,u=f[1],o=f[3]===void 0?B:f[3]==='"'?vs:ms):o===vs||o===ms?o=B:o===ps||o===fs?o=mt:(o=B,r=void 0);const d=o===B&&i[a+1].startsWith("/>")?" ":"";n+=o===mt?l+Di:h>=0?(s.push(u),l.slice(0,h)+sr+l.slice(h)+L+d):l+L+(h===-2?a:d)}return[nr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class St{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const a=t.length-1,l=this.parts,[u,f]=Bi(t,e);if(this.el=St.createElement(u,s),V.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=V.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const h of r.getAttributeNames())if(h.endsWith(sr)){const c=f[o++],d=r.getAttribute(h).split(L),p=/([.?@])?(.*)/.exec(c);l.push({type:1,index:n,name:p[2],strings:d,ctor:p[1]==="."?Vi:p[1]==="?"?Fi:p[1]==="@"?Ji:Yt}),r.removeAttribute(h)}else h.startsWith(L)&&(l.push({type:6,index:n}),r.removeAttribute(h));if(ir.test(r.tagName)){const h=r.textContent.split(L),c=h.length-1;if(c>0){r.textContent=zt?zt.emptyScript:"";for(let d=0;d<c;d++)r.append(h[d],xt()),V.nextNode(),l.push({type:2,index:++n});r.append(h[c],xt())}}}else if(r.nodeType===8)if(r.data===rr)l.push({type:2,index:n});else{let h=-1;for(;(h=r.data.indexOf(L,h+1))!==-1;)l.push({type:7,index:n}),h+=L.length-1}n++}}static createElement(t,e){const s=Y.createElement("template");return s.innerHTML=t,s}}function ct(i,t,e=i,s){var o,a;if(t===lt)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=Et(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=ct(i,r._$AS(i,t.values),r,s)),t}class qi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??Y).importNode(e,!0);V.currentNode=r;let n=V.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let u;l.type===2?u=new Tt(n,n.nextSibling,this,t):l.type===1?u=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(u=new Yi(n,this,t)),this._$AV.push(u),l=s[++a]}o!==(l==null?void 0:l.index)&&(n=V.nextNode(),o++)}return V.currentNode=Y,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Tt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ct(this,t,e),Et(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==lt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Hi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&Et(this._$AH)?this._$AA.nextSibling.data=t:this.T(Y.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=St.createElement(nr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new qi(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=gs.get(t.strings);return e===void 0&&gs.set(t.strings,e=new St(t)),e}k(t){Ce(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Tt(this.O(xt()),this.O(xt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Yt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=ct(this,t,e,0),o=!Et(t)||t!==this._$AH&&t!==lt,o&&(this._$AH=t);else{const a=t;let l,u;for(t=n[0],l=0;l<n.length-1;l++)u=ct(this,a[s+l],e,l),u===lt&&(u=this._$AH[l]),o||(o=!Et(u)||u!==this._$AH[l]),u===$?t=$:t!==$&&(t+=(u??"")+n[l+1]),this._$AH[l]=u}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Vi extends Yt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Fi extends Yt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ji extends Yt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=ct(this,t,e,0)??$)===lt)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Yi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ct(this,t)}}const oe=_t.litHtmlPolyfillSupport;oe==null||oe(St,Tt),(_t.litHtmlVersions??(_t.litHtmlVersions=[])).push("3.3.0");const Wi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Tt(t.insertBefore(xt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class C extends et{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return lt}}var _s;C._$litElement$=!0,C.finalized=!0,(_s=F.litElementHydrateSupport)==null||_s.call(F,{LitElement:C});const ae=F.litElementPolyfillSupport;ae==null||ae({LitElement:C});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");const Ki={allEvents:[],myEvents:[]};function Gi(i,t,e){switch(console.log("Received message"),i[0]){case"events/load-all":{const{onSuccess:s,onFailure:r}=i[1];fetch("/api/events",{method:"GET",headers:{"Content-Type":"application/json",...R.headers(e)}}).then(n=>{if(n.status===200)return n.json();throw new Error(`Failed to load all events: ${n.status}`)}).then(n=>{const o=n;t(a=>({...a,allEvents:o})),s&&s()}).catch(n=>{r&&r(n)});break}case"events/load-user":{const{userId:s,onSuccess:r,onFailure:n}=i[1];fetch(`/api/events/creator/${encodeURIComponent(s)}`,{method:"GET",headers:{"Content-Type":"application/json",...R.headers(e)}}).then(o=>{if(o.status===200)return o.json();throw new Error(`Failed to load user’s events: ${o.status}`)}).then(o=>{const a=o;t(l=>({...l,myEvents:a})),r&&r()}).catch(o=>{n&&n(o)});break}case"event/create":{const{event:s,onSuccess:r,onFailure:n}=i[1];fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json",...R.headers(e)},body:JSON.stringify(s)}).then(o=>{const a=o;t(l=>{const u=[...l.allEvents,a];let f=l.myEvents;return a.creator===e.userId&&(f=[...l.myEvents,a]),{...l,allEvents:u,myEvents:f}}),r&&r()}).catch(o=>{n&&n(o)});break}case"event/delete":{const{eventId:s,onSuccess:r,onFailure:n}=i[1];fetch(`/api/events/${s}`,{method:"DELETE",headers:{"Content-Type":"application/json",...R.headers(e)}}).then(o=>{if(!o.ok)throw new Error(`Server returned ${o.status}`);return s}).then(o=>{t(a=>{const l=a.allEvents.filter(f=>f.eventId!==o),u=a.myEvents.filter(f=>f.eventId!==o);return{...a,allEvents:l,myEvents:u}}),r==null||r()}).catch(o=>n==null?void 0:n(o));break}case"event/rsvp":{const{eventId:s,userId:r,onSuccess:n,onFailure:o}=i[1];fetch(`/api/events/${s}/rsvp/${r}`,{method:"POST",headers:{"Content-Type":"application/json",...R.headers(e)}}).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return fetch(`/api/events/${s}`,{headers:{"Content-Type":"application/json",...R.headers(e)}})}).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}).then(a=>{t(l=>{const u=l.allEvents.map(h=>h.eventId===a.eventId?a:h),f=l.myEvents.map(h=>h.eventId===a.eventId?a:h);return{...l,allEvents:u,myEvents:f}}),n==null||n()}).catch(a=>o==null?void 0:o(a));break}case"event/unrsvp":{const{eventId:s,userId:r,onSuccess:n,onFailure:o}=i[1];fetch(`/api/events/${s}/rsvp/${r}`,{method:"DELETE",headers:{"Content-Type":"application/json",...R.headers(e)}}).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return fetch(`/api/events/${s}`,{headers:{"Content-Type":"application/json",...R.headers(e)}})}).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}).then(a=>{t(l=>{const u=l.allEvents.map(h=>h.eventId===a.eventId?a:h),f=l.myEvents.map(h=>h.eventId===a.eventId?a:h);return{...l,allEvents:u,myEvents:f}}),n==null||n()}).catch(a=>o==null?void 0:o(a));break}default:{const s=i[0];throw new Error(`Unhandled message type: ${s}`)}}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xi={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:Pe},Zi=(i=Xi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,l,i)},init(a){return a!==void 0&&this.C(o,void 0,i,a),a}}}if(s==="setter"){const{name:o}=e;return function(a){const l=this[o];t.call(this,a),this.requestUpdate(o,l,i)}}throw Error("Unsupported decorator location: "+s)};function x(i){return(t,e)=>typeof e=="object"?Zi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function M(i){return x({...i,state:!0,attribute:!1})}const Qi=S`
    * {
        margin: 0;
        padding: 0;
        font-family: "IBM Plex Serif", serif;
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }

    body {
        background-image: url("/assets/hero_image.webp");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        background-attachment: fixed;
        background-color: var(--color-background);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-normal);
        font-family: var(--font-family-base), serif;
    }

    mu-form::part(form) {
        display: block;
    }

`,k={styles:Qi};var tn=Object.defineProperty,or=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&tn(t,e,r),r};const Oe=class Oe extends C{constructor(){super(...arguments),this.loggedIn=!1}static initializeOnce(){}connectedCallback(){super.connectedCallback(),this._authObserver=new O(this,"SloBucketList:auth"),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return m`
        <li>
            <a
              @click=${t=>{Er.relay(t,"auth:message",["auth/signout"])}}
            >
              Sign Out
            </a>
        </li>
        `}renderSignInButton(){return m`
        <li>
            <a href="/app/login">
              Sign In…
            </a>
        </li>
    `}_onToggle(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}render(){return m`
            
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        ${this.loggedIn?m`
                        <li><a href="/app/my-events">Your Events</a></li>
                        <li><a href="/app/create-event">Create Event</a></li>
                        `:null}
       
                        ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
                        
                        
                        <li class="sign-out"><a slot="actuator">
                            Hello, ${this.userid||"user"}
                        </a></li>
                        <li class="dark-mode-switch">
                            <p>Dark Mode</p>
                            <label class="switch">
                                <input type="checkbox" @change=${this._onToggle}>
                                <span class="slider"></span>
                            </label>
                        </li>
                    </ul>
                </nav>
            </header>

        `}};Oe.styles=[k.styles,S`
            header {
                ul {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    background-color: var(--background-primary);
                }

                li {
                    float: left;
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-normal);
                    font-family: var(--font-family-base), serif;
                }

                li a {
                    display: block;
                    color: var(--text-primary);
                    text-align: center;
                    padding: 14px 16px;
                    text-decoration: none;
                }
                
                li button {
                    display: block;
                    color: var(--text-primary);
                    text-align: center;
                    padding: 14px 16px;
                    text-decoration: none;
                }

                li button:hover {
                    background-color: var(--text-primary-hover);
                    color: white;
                }

                li a:hover {
                    background-color: var(--text-primary-hover);
                    color: white;
                }
            }

            .dark-mode-switch{
                padding: 10px;
                width: 10%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                float: right;
            }

            li p {
                color: var(--text-primary);
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* The slider */
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }
            .sign-out {
                float: right;
            }

            input:checked + .slider {
                background-color: var(--color-primary);
            }

            input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
            }

            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            /* Rounded sliders */
            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                border-radius: 50%;
            }
    `];let At=Oe;or([M()],At.prototype,"loggedIn");or([M()],At.prototype,"userid");var en=Object.defineProperty,Wt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&en(t,e,r),r};const Te=class Te extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return m`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button
            ?disabled=${!this.canSubmit}
            type="submit">
            Login
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Te.styles=[k.styles,S`
      .error:not(:empty) {
          color: var(--color-error);
          border: 1px solid var(--color-error);
          padding: 3px;
      }
        form {
            display: flex;
            flex-direction: column;
        }
      
  `];let W=Te;Wt([M()],W.prototype,"formData");Wt([x()],W.prototype,"api");Wt([x()],W.prototype,"redirect");Wt([M()],W.prototype,"error");G({"login-form":W});const Ie=class Ie extends C{render(){return m`
            
            <main class="card">
                <div class="hero-container">
                    <h2>User Login</h2>
                    <login-form api="/auth/login">
                        <label>
                            <span>Username:</span>
                            <input name="username" autocomplete="off" />
                        </label>
                        <label>
                            <span>Password:</span>
                            <input type="password" name="password" />
                        </label>
                    </login-form>
                    <p
                    >Or did you want to
                        <a href="/app/register">Sign up as a new user</a>?
                    </p>
                </div>
            </main>
            
            
        `}};Ie.styles=[k.styles,S`
            .card{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .hero-container {
                div {
                    display: flex;
                    flex-direction: row;
                    .icon {
                        height: 2em;
                        width: 2em;
                        padding-left: 0.5em;
                    }
                }
                margin: 10px;
                height: 100%;
                width: 50%;
                align-items: center;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-wrap: wrap;
            }
            label, form, slot, button {
                margin: 5px;
            }
            p,span,h2 {
                color: var(--color-primary);
            }

        `];let pe=Ie;var sn=Object.defineProperty,Kt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&sn(t,e,r),r};const Re=class Re extends C{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return m`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button
            ?disabled=${!this.canSubmit}
            type="submit">
            Signup
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==201)throw"Signup failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Re.styles=[k.styles,S`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 3px;
      }
            form {
                display: flex;
                flex-direction: column;
            }
  `];let K=Re;Kt([M()],K.prototype,"formData");Kt([x()],K.prototype,"api");Kt([x()],K.prototype,"redirect");Kt([M()],K.prototype,"error");G({"signup-form":K});const Ue=class Ue extends C{render(){return m`
            
            <main class="card">
                <div class="hero-container">
                    <h2>User Signup</h2>
                    <signup-form api="http://localhost:3000/auth/register">
                        <label>
                            <span>Username:</span>
                            <input name="username" autocomplete="off" />
                        </label>
                        <label>
                            <span>Password:</span>
                            <input type="password" name="password" />
                        </label>
                    </signup-form>
                    <p
                    >Or did you want to
                        <a href="/app/login">Log in</a>?
                    </p>
                </div>
            </main>
            
        `}};Ue.styles=[k.styles,S`
            .card{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .hero-container {
                div {
                    display: flex;
                    flex-direction: row;
                    .icon {
                        height: 2em;
                        width: 2em;
                        padding-left: 0.5em;
                    }
                }
                margin: 10px;
                height: 100%;
                width: 50%;
                align-items: center;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-wrap: wrap;
            }
            label, form, slot, button {
                margin: 5px;
            }
            p,span,h2 {
                color: var(--color-primary);
            }

        `];let fe=Ue;var rn=Object.defineProperty,dt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&rn(t,e,r),r};const Le=class Le extends C{constructor(){super(...arguments),this.mode="all"}render(){const t=this.eventId?this.mode==="all"?`/app/events/${this.eventId}`:`/app/my-events/${this.eventId}`:"#";return m`
            <div class="event-card">
                <div class="event-header">
                    <!-- Click the title to navigate to /events/<eventId> -->
                    <a class="event-title" href="${t}">
                        ${this.name??""}
                    </a>
                    <div class="event-meta">
                        ${this.time?m`<p class="event-time">${this.time}</p>`:null}
                        ${this.location?m`<p class="event-location">${this.location}</p>`:null}
                    </div>
                </div>

                ${this.description?m`
                            <p class="event-description">
                                ${this.description.length>115?`${this.description.slice(0,115)}…`:this.description}
                            </p>
                        `:null}
            </div>
        `}};Le.styles=[k.styles,S`
      .event-card {
        display: flex;
        flex-direction: column;
          background-color: var(--background-secondary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        transition: box-shadow 0.2s ease;
        gap: 0.5rem;
      }
      .event-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          
      }

      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
      }

      .event-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        text-decoration: none;
      }

      .event-time,
      .event-location {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-muted);
      }

      .event-description {
        margin: 0;
        font-size: 1rem;
        color: var(--text-primary);
        line-height: var(--line-height-base);
      }
    `];let T=Le;dt([x({type:String})],T.prototype,"eventId");dt([x({type:String})],T.prototype,"name");dt([x({type:String})],T.prototype,"location");dt([x({type:String})],T.prototype,"time");dt([x({type:String})],T.prototype,"description");dt([x({type:String})],T.prototype,"mode");const Ne=class Ne extends ht{constructor(){super("SloBucketList:model")}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["events/load-all",{onSuccess:()=>console.log("Loaded all events"),onFailure:t=>console.error(t)}])}render(){return m`
            <ul id="events-list-list">
                ${this.model.allEvents.map(t=>m`
                    <li>
                        <event-item
                            eventId=${t.eventId}
                            name=${t.name}
                            location=${t.location}
                            time=${t.time}
                            description=${t.description}
                        ></event-item>
                    </li>
                `)}
          </ul>`}};Ne.styles=[k.styles,S`
            
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
    
            #events-list-list li {
                margin-bottom: 1rem;
            }  `];let Bt=Ne;G({"event-feed":Bt,"event-item":T});const je=class je extends C{render(){return m`
            <section id="home">
                <!-- Hero Section -->
                <section id="hero">
                    <svg class="icon">
                        <use href="/assets/icons/events_icons.svg#icon-bucket"/>
                    </svg>

                    <div><h1>Welcome to the SloBucketList!</h1></div>
                    <div><p>Find, attend, and create local events in San Luis Obispo</p></div>
                </section>

                <div class="hero-container">
                    <div>
                        <h2>All Events</h2>
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-calendar" />
                        </svg>
                    </div>
                    <p>Friday, June 6</p>

                    <event-feed></event-feed>
                </div>
            </section>    
            
        `}};je.styles=[k.styles,S`
            #home{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #hero{
                height: 30%;
                width: 50%;
                margin: 10px;
                align-items: center;
                background-color: var(--background-primary);
                color: var(--text-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                div{
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    h1{
                        padding: 5px;

                    }
                }
            }

            .icon{
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }

            .hero-container {
                div {
                    display: flex;
                    flex-direction: row;
                    .icon {
                        height: 2em;
                        width: 2em;
                        padding-left: 0.5em;
                    }
                }
                margin: 10px;
                height: 100%;
                width: 50%;
                align-items: center;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-wrap: wrap;
            }

            p,
            h2 {
                color: var(--text-primary);
            }

            p{
                margin: 20px;
            }
            
            #events-list {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            event-feed,
            my-events-feed {
                list-style: none;
                width: 100%;
            }

            .icon {
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }
        `];let me=je;const Me=class Me extends ht{constructor(){super("SloBucketList:model"),this._hasDispatchedLoadUser=!1}getCreatorId(){const t=this._user;if(!(t!=null&&t.token))return null;try{const e=t.token.split(".")[1],s=atob(e);return JSON.parse(s).userId??null}catch{return null}}connectedCallback(){super.connectedCallback(),this._authObserver=new O(this,"SloBucketList:auth"),this._authObserver.observe(t=>{this._user=t.user??void 0,this.requestUpdate();const e=this.getCreatorId();e&&(this._hasDispatchedLoadUser||(this._hasDispatchedLoadUser=!0,this.dispatchMessage(["events/load-user",{userId:e,onSuccess:()=>console.log("Loaded my events"),onFailure:s=>console.error(s)}])))}).catch(t=>{console.error("Auth observer error:",t)})}render(){return m`
            <ul id="events-list-list">
        ${this.model.myEvents.length===0?m`<p>You haven’t created any events yet.</p>`:this.model.myEvents.map(t=>m`
                <li>
                    <event-item
                  .eventId=${t.eventId}
                  .name=${t.name}
                  .location=${t.location}
                  .time=${t.time}
                  .description=${t.description}
                  mode="mine"
                ></event-item>
                </li>`)}
      </ul>
    `}};Me.styles=[k.styles,S`
            
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
    
            #events-list-list li {
                margin-bottom: 1rem;
            }  `];let ve=Me;var nn=Object.defineProperty,on=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&nn(t,e,r),r};G({"event-feed":Bt,"my-events-feed":ve,"event-item":T});const De=class De extends C{constructor(){super(...arguments),this.mode="all"}render(){return m`
      <section id="events-list">
        <div id="hero-container">
          <div>
            <h2>${this.mode==="mine"?"My Events":"All Events"}</h2>
            <svg class="icon">
              <use href="/assets/icons/events_icons.svg#icon-calendar" />
            </svg>
          </div>
          <p>Friday, June 6</p>


            <!-- Dynamically render either <event-feed> or <my-events-feed> -->
            ${this.mode==="mine"?m`<my-events-feed></my-events-feed>`:m`<event-feed></event-feed>`}
        </div>
      </section>
    `}};De.styles=[k.styles,S`
      #hero-container {
        div {
          display: flex;
          flex-direction: row;
          .icon {
            height: 2em;
            width: 2em;
            padding-left: 0.5em;
          }
        }
        margin: 10px;
        height: 100%;
        width: 50%;
        align-items: center;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1rem;
        transition: box-shadow 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-wrap: wrap;
      }
            
      p, h2 {
        color: var(--text-primary);
      }
            p{
                margin: 20px;
            }

      #events-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      event-feed,
      my-events-feed {
        list-style: none;
        width: 100%;
      }

      .icon {
        stroke: var(--text-primary);
        fill: var(--background-primary);
      }
    `];let qt=De;on([x({type:String})],qt.prototype,"mode");const w=[];for(let i=0;i<256;++i)w.push((i+256).toString(16).slice(1));function an(i,t=0){return(w[i[t+0]]+w[i[t+1]]+w[i[t+2]]+w[i[t+3]]+"-"+w[i[t+4]]+w[i[t+5]]+"-"+w[i[t+6]]+w[i[t+7]]+"-"+w[i[t+8]]+w[i[t+9]]+"-"+w[i[t+10]]+w[i[t+11]]+w[i[t+12]]+w[i[t+13]]+w[i[t+14]]+w[i[t+15]]).toLowerCase()}let le;const ln=new Uint8Array(16);function cn(){if(!le){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");le=crypto.getRandomValues.bind(crypto)}return le(ln)}const hn=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),ys={randomUUID:hn};function dn(i,t,e){var r;if(ys.randomUUID&&!i)return ys.randomUUID();i=i||{};const s=i.random??((r=i.rng)==null?void 0:r.call(i))??cn();if(s.length<16)throw new Error("Random bytes length must be >= 16");return s[6]=s[6]&15|64,s[8]=s[8]&63|128,an(s)}var un=Object.defineProperty,Gt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&un(t,e,r),r};const Vt=class Vt extends ht{constructor(){super("SloBucketList:model"),this.api="/api/events",this.redirect="/app/events",this.formData={}}firstUpdated(){const t=this.renderRoot.querySelector("mu-form");t&&queueMicrotask(()=>{var s;const e=(s=t.shadowRoot)==null?void 0:s.querySelector("form");e&&e.style.setProperty("display","block","important")})}connectedCallback(){super.connectedCallback(),this._authObserver=new O(this,"SloBucketList:auth"),this._authObserver.observe(t=>{this._user=t.user??void 0,this.requestUpdate()})}getCreatorId(){const t=this._user;if(!(t!=null&&t.token))return null;try{const e=t.token.split(".")[1],s=atob(e);return JSON.parse(s).userId??null}catch{return null}}render(){return m`
            <section id="event-form">
                <div id="hero">
                    <h2>Submit an Event</h2>
                    <p>Fill in all fields below:</p>

                    <mu-form cols="1"
                            .init=${this.formData}
                            @mu-form:submit=${t=>this.handleSubmit(t)}
                    >
                        <!-- Event Name (required) -->
                        <label for="name">Event Name:</label>
                        <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. Summer BBQ"
                                .value=${this.formData.name??""}
                                required
                        />

                        <!-- Location (required) -->
                        <label for="location">Location:</label>
                        <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="e.g. San Luis Obispo, CA"
                                .value=${this.formData.location??""}
                                required
                        />

                        <!-- Time (required) -->
                        <label for="time">Time (YYYY-MM-DD HH:MM):</label>
                        <input
                                type="text"
                                id="time"
                                name="time"
                                placeholder="2025-06-10 18:00"
                                .value=${this.formData.time??""}
                                required
                        />

                        <!-- Description (required) -->
                        <label for="description">Description:</label>
                        <textarea
                                id="description"
                                name="description"
                                placeholder="Brief event description…"
                                required
                        >${this.formData.description??""}</textarea>

                        <!-- ERROR MESSAGE -->
                        <p class="error">${this.error??""}</p>
                    </mu-form>
                </div>
            </section>
        `}handleSubmit(t){var l;const{name:e,location:s,time:r,description:n}=t.detail;if(!(this.api&&(e!=null&&e.trim())&&(s!=null&&s.trim())&&(r!=null&&r.trim())&&(n!=null&&n.trim())&&((l=this._user)!=null&&l.authenticated)))return;const o=this.getCreatorId();if(!o){this.error="Unable to determine your user ID. Please log in again.";return}const a={eventId:dn(),name:e,location:s,time:r,description:n,creator:o,rsvps:[{_id:o,username:this._user.username}]};console.log("Dispatching event/create:",a),this.dispatchMessage(["event/create",{event:a,onSuccess:()=>{$e.dispatch(this,"history/navigate",{href:this.redirect})},onFailure:u=>{this.error=u.message}}])}};Vt.uses=G({"mu-form":Pr.Element}),Vt.styles=[k.styles,S`
            /* Full-screen, centered container */
            #event-form {
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #hero {
                width: 700px;
                padding: 1rem 1.5rem;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            h2 {
                margin: 0;
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
                text-align: center;
            }

            p.subtitle {
                margin: 0;
                font-size: var(--font-size-base);
                color: var(--color-muted);
                text-align: center;
            }

            form {
                display: block;
                flex-direction: column;
                gap: var(--space-4);
            }

            label {
                font-weight: var(--font-weight-semibold);
                color: var(--text-primary);
                margin-bottom: var(--space-1);
            }

            

            input[type="text"],
            textarea {
                width: 100%;
                padding: var(--space-2);
                font-size: var(--font-size-base);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-sm);
                outline: none;
                background-color: var(--color-background);
            }

            input[type="text"]:focus,
            textarea:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
            }

            textarea {
                resize: vertical;
                min-height: 4rem;
            }

            .error {
                color: var(--color-error);
                font-size: var(--font-size-sm);
                margin-top: var(--space-1);
            }

            .button-container {
                display: flex;
                justify-content: center;
            }

            button[type="submit"] {
                padding: var(--space-2) var(--space-4);
                font-size: var(--font-size-base);
                background-color: var(--color-primary);
                color: var(--color-surface);
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            button[type="submit"]:hover:not(:disabled) {
                background-color: var(--color-primary-hover);
            }

            button[type="submit"]:disabled {
                background-color: var(--color-muted);
                cursor: not-allowed;
            }
        `];let j=Vt;Gt([x()],j.prototype,"api");Gt([x()],j.prototype,"redirect");Gt([M()],j.prototype,"formData");Gt([M()],j.prototype,"error");customElements.define("create-event-view",j);var pn=Object.defineProperty,fn=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&pn(t,e,r),r};const He=class He extends ht{constructor(){super("SloBucketList:model")}connectedCallback(){super.connectedCallback(),this._authObserver=new O(this,"SloBucketList:auth"),this._authObserver.observe(t=>{this._user=t.user??void 0,this.requestUpdate()})}getUserId(){const t=this._user;if(!(t!=null&&t.token))return null;try{const e=t.token.split(".")[1],s=atob(e);return JSON.parse(s).userId??null}catch{return null}}get event(){var t;return(t=this.model.allEvents)==null?void 0:t.find(e=>e.eventId===this.eventId)}handleToggleRsvp(){var s;if(!this.eventId)return;const t=this.getUserId();if(!t){console.warn("Cannot determine userId—are you logged in?");return}(t?(s=this.event)==null?void 0:s.rsvps.some(r=>r._id===t):!1)?this.dispatchMessage(["event/unrsvp",{eventId:this.eventId,userId:t,onSuccess:()=>console.log("Un-RSVP succeeded"),onFailure:r=>console.error("Un-RSVP failed",r)}]):this.dispatchMessage(["event/rsvp",{eventId:this.eventId,userId:t,onSuccess:()=>console.log("RSVP succeeded"),onFailure:r=>console.error("RSVP failed",r)}])}render(){if(!this.event)return m`
                <p style="text-align: center; color: var(--color-error)">
                    Event not found.
                </p>
            `;const t=this.getUserId(),s=(t?this.event.rsvps.some(r=>r._id===t):!1)?"Cancel RSVP":"RSVP to this event";return m`
            <div class="detail-card">
                <h2>${this.event.name}</h2>

                <div>
                    <p class="field-label">Location:</p>
                    <p class="field-value">${this.event.location}</p>
                </div>

                <div>
                    <p class="field-label">Time:</p>
                    <p class="field-value">${this.event.time}</p>
                </div>

                <div>
                    <p class="field-label">Description:</p>
                    <p class="field-value">${this.event.description}</p>
                </div>

                <!-- RSVP toggle button -->
                <button class="rsvp-toggle" @click=${this.handleToggleRsvp}>
                    ${s}
                </button>

                <!-- List of user IDs who have RSVPed -->
                <div>
                    <p class="field-label">Currently RSVPed:</p>
                    ${this.event.rsvps.length===0?m`<p class="field-value">No one has RSVPed yet.</p>`:m`
                                <ul class="rsvp-list">
                                    ${this.event.rsvps.map(r=>m`<li>${r.username}</li>`)}
                                </ul>
                            `}
                </div>
            </div>
        `}};He.styles=[k.styles,S`
      .detail-card {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      h2 {
        margin: 0;
        color: var(--text-primary);
      }
      .field-label {
        font-weight: 600;
        color: var(--text-primary);
      }
      .field-value {
        margin: 0.25rem 0 1rem;
        color: var(--text-primary);
      }
      button.rsvp-toggle {
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-primary);
        color: var(--color-surface);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        width: fit-content;
        transition: background-color 0.2s;
      }
      button.rsvp-toggle:hover {
        background-color: var(--color-primary-hover);
      }
      /* Simple styling for the RSVP list */
      .rsvp-list {
        margin-top: 1rem;
        padding-left: var(--space-4);
      }
      .rsvp-list li {
        color: var(--text-primary);
        margin-bottom: var(--space-2);
      }
    `];let kt=He;fn([x({type:String})],kt.prototype,"eventId");customElements.define("event-detail-view",kt);var mn=Object.defineProperty,vn=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&mn(t,e,r),r};const ze=class ze extends ht{constructor(){super("SloBucketList:model")}connectedCallback(){super.connectedCallback(),this._authObserver=new O(this,"SloBucketList:auth"),this._authObserver.observe(t=>{this._user=t.user??void 0,this.requestUpdate()})}getUserId(){const t=this._user;if(!(t!=null&&t.token))return null;try{const e=t.token.split(".")[1],s=atob(e);return JSON.parse(s).userId??null}catch{return null}}get event(){var t,e;return((t=this.model.allEvents)==null?void 0:t.find(s=>s.eventId===this.eventId))??((e=this.model.myEvents)==null?void 0:e.find(s=>s.eventId===this.eventId))}handleDelete(){var e;if(!this.eventId)return;const t=this.getUserId();if(!t){console.warn("Cannot determine userId—are you logged in?");return}if(((e=this.event)==null?void 0:e.creator)!==t){console.warn("You are not the creator of this event.");return}this.dispatchMessage(["event/delete",{eventId:this.eventId,onSuccess:()=>{$e.dispatch(this,"history/navigate",{href:"/app/my-events"})},onFailure:s=>console.error("Delete failed",s)}])}render(){if(!this.event)return m`
        <p style="text-align: center; color: var(--color-error)">
          Event not found.
        </p>
      `;const e=this.getUserId()===this.event.creator;return m`
      <div class="detail-card">
        <h2>${this.event.name}</h2>

        <div>
          <p class="field-label">Location:</p>
          <p class="field-value">${this.event.location}</p>
        </div>

        <div>
          <p class="field-label">Time:</p>
          <p class="field-value">${this.event.time}</p>
        </div>

        <div>
          <p class="field-label">Description:</p>
          <p class="field-value">${this.event.description}</p>
        </div>

        ${e?m`
              <button class="delete-btn" @click=${this.handleDelete}>
                Delete This Event
              </button>
            `:m`
              <p style="color: var(--color-muted)">
                Only the creator can delete this event.
              </p>
            `}
      </div>
    `}};ze.styles=[k.styles,S`
      .detail-card {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      h2 {
        margin: 0;
        color: var(--text-primary);
      }
      .field-label {
        font-weight: 600;
        color: var(--text-primary);
      }
      .field-value {
        margin: 0.25rem 0 1rem;
        color: var(--text-primary);
      }
      button.delete-btn {
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-error);
        color: var(--color-surface);
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        width: fit-content;
        transition: background-color 0.2s;
      }
      button.delete-btn:hover {
        background-color: beige;
      }
    `];let Pt=ze;vn([x({type:String})],Pt.prototype,"eventId");customElements.define("my-event-detail-view",Pt);G({"mu-store":class extends Ur.Provider{constructor(){super(Gi,Ki,"SloBucketList:auth")}},"home-view":me,"login-view":pe,"register-view":fe,"events-view":qt,"create-event-view":j,"event-detail-view":kt,"my-event-detail-view":Pt});const gn=[{path:"/app",view:()=>m`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"},{path:"/app/login",view:()=>m`
      <login-view></login-view>
    `},{path:"/app/register",view:()=>m`
      <register-view></register-view>
    `},{path:"/app/create-event",view:()=>m`
            <create-event-view
                    api="/api/events"
                    redirect="/app/events"
            ></create-event-view>
    `},{path:"/app/events",view:()=>m`
      <events-view mode="all"></events-view>
    `},{path:"/app/events/:eventId",view:({eventId:i})=>m`
            <event-detail-view eventId="${i}"></event-detail-view>
          `},{path:"/app/my-events/:eventId",view:({eventId:i})=>m`
            <my-event-detail-view eventId="${i}"></my-event-detail-view>
          `},{path:"/app/my-events",view:()=>m`
      <events-view mode="mine"></events-view>
    `}];G({"slo-bucket-list-header":At,"mu-auth":R.Provider,"mu-history":$e.Provider,"mu-switch":class extends xi.Element{constructor(){super(gn,"SloBucketList:history","SloBucketList:auth")}}});
