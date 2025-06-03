(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var Ne;class dt extends Error{}dt.prototype.name="InvalidTokenError";function rr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ir(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return rr(t)}catch{return atob(t)}}function ls(i,t){if(typeof i!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let r;try{r=ir(s)}catch(n){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const nr="mu:context",se=`${nr}:change`;class or{constructor(t,e){this._proxy=ar(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class he extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new or(t,this),this.style.display="contents"}attach(t){return this.addEventListener(se,t),t}detach(t){this.removeEventListener(se,t)}}function ar(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let p=new CustomEvent(se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function lr(i,t){const e=cs(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function cs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return cs(i,r.host)}class cr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function hs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new cr(e,i))}class ue{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function hr(i){return t=>({...t,...i})}const re="mu:auth:jwt",us=class ds extends ue{constructor(t,e){super((s,r)=>this.update(s,r),t,ds.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(dr(s)),Xt(r);case"auth/signout":return e(pr()),Xt(this._redirectForLogin);case"auth/redirect":return Xt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};us.EVENT_TYPE="auth:message";let ps=us;const fs=hs(ps.EVENT_TYPE);function Xt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class ur extends he{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:et.authenticateFromLocalStorage()})}connectedCallback(){new ps(this.context,this.redirect).attach(this)}}class tt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(re),t}}class et extends tt{constructor(t){super();const e=ls(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(re,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(re);return t?et.authenticate(t):new tt}}function dr(i){return hr({user:et.authenticate(i),token:i})}function pr(){return i=>{const t=i.user;return{user:t&&t.authenticated?tt.deauthenticate(t):t,token:""}}}function fr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function mr(i){return i.authenticated?ls(i.token||""):{}}const ms=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:ur,User:tt,dispatch:fs,headers:fr,payload:mr},Symbol.toStringTag,{value:"Module"}));function Tt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function ie(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const gr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ie,relay:Tt},Symbol.toStringTag,{value:"Module"})),vr=new DOMParser;function Et(i,...t){const e=i.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=vr.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function Ht(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const gs=class vs extends HTMLElement{constructor(){super(),this._state={},Ht(vs.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Tt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},_r(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};gs.template=Et`
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
  `;let yr=gs;function _r(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const $r=Object.freeze(Object.defineProperty({__proto__:null,Element:yr},Symbol.toStringTag,{value:"Module"})),ys=class _s extends ue{constructor(t){super((e,s)=>this.update(e,s),t,_s.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(wr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(Ar(s,r));break}}}};ys.EVENT_TYPE="history:message";let de=ys;class Le extends he{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=br(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),pe(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new de(this.context).attach(this)}}function br(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function wr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Ar(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const pe=hs(de.EVENT_TYPE),$s=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Le,Provider:Le,Service:de,dispatch:pe},Symbol.toStringTag,{value:"Module"}));class z{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Me(this._provider,t);this._effects.push(r),e(r)}else lr(this._target,this._contextLabel).then(r=>{const n=new Me(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const bs=class ws extends HTMLElement{constructor(){super(),this._state={},this._user=new tt,this._authObserver=new z(this,"blazing:auth"),Ht(ws.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Er(r,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&je(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&je(this.src,this.authorization).then(r=>{this._state=r,lt(r,this)});break;case"new":s&&(this._state={},lt({},this));break}}};bs.observedAttributes=["src","new","action"];bs.template=Et`
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
  `;function je(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function lt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function Er(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const As=class Es extends ue{constructor(t,e){super(e,t,Es.EVENT_TYPE,!1)}};As.EVENT_TYPE="mu:message";let Ss=As;class Sr extends he{constructor(t,e,s){super(e),this._user=new tt,this._updateFn=t,this._authObserver=new z(this,s)}connectedCallback(){const t=new Ss(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const xr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Sr,Service:Ss},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,fe=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),He=new WeakMap;let xs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=He.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&He.set(e,t))}return t}toString(){return this.cssText}};const Pr=i=>new xs(typeof i=="string"?i:i+"",void 0,me),kr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new xs(e,i,me)},Cr=(i,t)=>{if(fe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ct.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ie=fe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Pr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Or,defineProperty:Tr,getOwnPropertyDescriptor:Rr,getOwnPropertyNames:Ur,getOwnPropertySymbols:Nr,getPrototypeOf:Lr}=Object,st=globalThis,De=st.trustedTypes,Mr=De?De.emptyScript:"",ze=st.reactiveElementPolyfillSupport,pt=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?Mr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ge=(i,t)=>!Or(i,t),Be={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),st.litPropertyMetadata??(st.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Be){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Tr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Rr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Be}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Lr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,s=[...Ur(e),...Nr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ie(r))}else t!==void 0&&e.push(Ie(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Cr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Rt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Rt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[pt("elementProperties")]=new Map,Z[pt("finalized")]=new Map,ze==null||ze({ReactiveElement:Z}),(st.reactiveElementVersions??(st.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,Nt=Ut.trustedTypes,Fe=Nt?Nt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ps="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,ks="?"+T,jr=`<${ks}>`,B=document,gt=()=>B.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",Cs=Array.isArray,Hr=i=>Cs(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,qe=/>/g,M=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),We=/'/g,Ye=/"/g,Os=/^(?:script|style|textarea|title)$/i,Ir=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ht=Ir(1),rt=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Je=new WeakMap,H=B.createTreeWalker(B,129);function Ts(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const Dr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=ct;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=Ve:f[1]!==void 0?o=qe:f[2]!==void 0?(Os.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=r??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?M:f[3]==='"'?Ye:We):o===Ye||o===We?o=M:o===Ve||o===qe?o=ct:(o=M,r=void 0);const h=o===M&&i[l+1].startsWith("/>")?" ":"";n+=o===ct?a+jr:u>=0?(s.push(p),a.slice(0,u)+Ps+a.slice(u)+T+h):a+T+(u===-2?l:h)}return[Ts(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let ne=class Rs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Dr(t,e);if(this.el=Rs.createElement(p,s),H.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ps)){const c=f[o++],h=r.getAttribute(u).split(T),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Br:d[1]==="?"?Fr:d[1]==="@"?Vr:It}),r.removeAttribute(u)}else u.startsWith(T)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Os.test(r.tagName)){const u=r.textContent.split(T),c=u.length-1;if(c>0){r.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],gt()),H.nextNode(),a.push({type:2,index:++n});r.append(u[c],gt())}}}else if(r.nodeType===8)if(r.data===ks)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(T,u+1))!==-1;)a.push({type:7,index:n}),u+=T.length-1}n++}}static createElement(t,e){const s=B.createElement("template");return s.innerHTML=t,s}};function it(i,t,e=i,s){var r,n;if(t===rt)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=vt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=it(i,o._$AS(i,t.values),o,s)),t}let zr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??B).importNode(e,!0);H.currentNode=r;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new ve(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new qr(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=B,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ve=class Us{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),vt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Hr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==_&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ne.createElement(Ts(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new zr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new ne(t)),e}k(t){Cs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Us(this.S(gt()),this.S(gt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},It=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=it(this,l[s+a],e,a),p===rt&&(p=this._$AH[a]),o||(o=!vt(p)||p!==this._$AH[a]),p===_?t=_:t!==_&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Br=class extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},Fr=class extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Vr=class extends It{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??_)===rt)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},qr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};const Ke=Ut.litHtmlPolyfillSupport;Ke==null||Ke(ne,ve),(Ut.litHtmlVersions??(Ut.litHtmlVersions=[])).push("3.1.3");const Wr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new ve(t.insertBefore(gt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Q=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return rt}};Q._$litElement$=!0,Q.finalized=!0,(Ne=globalThis.litElementHydrateSupport)==null||Ne.call(globalThis,{LitElement:Q});const Xe=globalThis.litElementPolyfillSupport;Xe==null||Xe({LitElement:Q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yr={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:ge},Jr=(i=Yr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ns(i){return(t,e)=>typeof e=="object"?Jr(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ls(i){return Ns({...i,state:!0,attribute:!1})}function Kr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Xr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ms={};(function(i){var t=function(){var e=function(u,c,h,d){for(h=h||{},d=u.length;d--;h[u[d]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,g,m,v,qt){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(g,m){this.message=g,this.hash=m};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],g=[null],m=[],v=this.table,qt="",A=0,Te=0,Qs=2,Re=1,tr=m.slice.call(arguments,1),y=Object.create(this.lexer),N={yy:{}};for(var Wt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Wt)&&(N.yy[Wt]=this.yy[Wt]);y.setInput(c,N.yy),N.yy.lexer=y,N.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var Yt=y.yylloc;m.push(Yt);var er=y.options&&y.options.ranges;typeof N.yy.parseError=="function"?this.parseError=N.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var sr=function(){var K;return K=y.lex()||Re,typeof K!="number"&&(K=h.symbols_[K]||K),K},w,L,S,Jt,J={},Pt,C,Ue,kt;;){if(L=d[d.length-1],this.defaultActions[L]?S=this.defaultActions[L]:((w===null||typeof w>"u")&&(w=sr()),S=v[L]&&v[L][w]),typeof S>"u"||!S.length||!S[0]){var Kt="";kt=[];for(Pt in v[L])this.terminals_[Pt]&&Pt>Qs&&kt.push("'"+this.terminals_[Pt]+"'");y.showPosition?Kt="Parse error on line "+(A+1)+`:
`+y.showPosition()+`
Expecting `+kt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Kt="Parse error on line "+(A+1)+": Unexpected "+(w==Re?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Kt,{text:y.match,token:this.terminals_[w]||w,line:y.yylineno,loc:Yt,expected:kt})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+L+", token: "+w);switch(S[0]){case 1:d.push(w),g.push(y.yytext),m.push(y.yylloc),d.push(S[1]),w=null,Te=y.yyleng,qt=y.yytext,A=y.yylineno,Yt=y.yylloc;break;case 2:if(C=this.productions_[S[1]][1],J.$=g[g.length-C],J._$={first_line:m[m.length-(C||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(C||1)].first_column,last_column:m[m.length-1].last_column},er&&(J._$.range=[m[m.length-(C||1)].range[0],m[m.length-1].range[1]]),Jt=this.performAction.apply(J,[qt,Te,A,N.yy,S[1],g,m].concat(tr)),typeof Jt<"u")return Jt;C&&(d=d.slice(0,-1*C*2),g=g.slice(0,-1*C),m=m.slice(0,-1*C)),d.push(this.productions_[S[1]][0]),g.push(J.$),m.push(J._$),Ue=v[d[d.length-2]][d[d.length-1]],d.push(Ue);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===g.length?this.yylloc.first_column:0)+g[g.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(d=this._input.match(this.rules[m[v]]),d&&(!h||d[0].length>h[0].length)){if(h=d,g=v,this.options.backtrack_lexer){if(c=this.test_match(d,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Xr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ms);function X(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var js={Root:X("Root"),Concat:X("Concat"),Literal:X("Literal"),Splat:X("Splat"),Param:X("Param"),Optional:X("Optional")},Hs=Ms.parser;Hs.yy=js;var Zr=Hs,Gr=Object.keys(js);function Qr(i){return Gr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Is=Qr,ti=Is,ei=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ds(i){this.captures=i.captures,this.re=i.re}Ds.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var si=ti({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(ei,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ds({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),ri=si,ii=Is,ni=ii({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),oi=ni,ai=Zr,li=ri,ci=oi;St.prototype=Object.create(null);St.prototype.match=function(i){var t=li.visit(this.ast),e=t.match(i);return e||!1};St.prototype.reverse=function(i){return ci.visit(this.ast,i)};function St(i){var t;if(this?t=this:t=Object.create(St.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ai.parse(i),t}var hi=St,ui=hi,di=ui;const pi=Kr(di);var fi=Object.defineProperty,zs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&fi(t,e,r),r};class yt extends Q{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ht`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new pi(r.path)})),this._historyObserver=new z(this,e),this._authObserver=new z(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fs(this,"auth/redirect"),ht`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):ht`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ht`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){pe(this,"history/redirect",{href:t})}}yt.styles=kr`
    :host,
    main {
      display: contents;
    }
  `;zs([Ls()],yt.prototype,"_user");zs([Ls()],yt.prototype,"_match");const mi=Object.freeze(Object.defineProperty({__proto__:null,Element:yt,Switch:yt},Symbol.toStringTag,{value:"Module"})),gi=class Bs extends HTMLElement{constructor(){if(super(),Ht(Bs.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};gi.template=Et`
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
  `;const vi=class Fs extends HTMLElement{constructor(){super(),this._array=[],Ht(Fs.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Vs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ie(t,"button.add")?Tt(t,"input-array:add"):ie(t,"button.remove")&&Tt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],yi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};vi.template=Et`
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
  `;function yi(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Vs(e)))}function Vs(i,t){const e=i===void 0?"":`value="${i}"`;return Et`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function at(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var _i=Object.defineProperty,$i=Object.getOwnPropertyDescriptor,bi=(i,t,e,s)=>{for(var r=$i(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&_i(t,e,r),r};class qs extends Q{constructor(t){super(),this._pending=[],this._observer=new z(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}bi([Ns()],qs.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,ye=Ot.ShadowRoot&&(Ot.ShadyCSS===void 0||Ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),Ze=new WeakMap;let Ws=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ze.set(e,t))}return t}toString(){return this.cssText}};const wi=i=>new Ws(typeof i=="string"?i:i+"",void 0,_e),P=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ws(e,i,_e)},Ai=(i,t)=>{if(ye)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ot.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ge=ye?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return wi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ei,defineProperty:Si,getOwnPropertyDescriptor:xi,getOwnPropertyNames:Pi,getOwnPropertySymbols:ki,getPrototypeOf:Ci}=Object,U=globalThis,Qe=U.trustedTypes,Oi=Qe?Qe.emptyScript:"",Gt=U.reactiveElementPolyfillSupport,ft=(i,t)=>i,Lt={toAttribute(i,t){switch(t){case Boolean:i=i?Oi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},$e=(i,t)=>!Ei(i,t),ts={attribute:!0,type:String,converter:Lt,reflect:!1,useDefault:!1,hasChanged:$e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),U.litPropertyMetadata??(U.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Si(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=xi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ts}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Ci(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Pi(e),...ki(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ge(r))}else t!==void 0&&e.push(Ge(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Lt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??$e)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ft("elementProperties")]=new Map,G[ft("finalized")]=new Map,Gt==null||Gt({ReactiveElement:G}),(U.reactiveElementVersions??(U.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Mt=mt.trustedTypes,es=Mt?Mt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ys="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Js="?"+R,Ti=`<${Js}>`,F=document,_t=()=>F.createComment(""),$t=i=>i===null||typeof i!="object"&&typeof i!="function",be=Array.isArray,Ri=i=>be(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ss=/-->/g,rs=/>/g,j=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),is=/'/g,ns=/"/g,Ks=/^(?:script|style|textarea|title)$/i,Ui=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),b=Ui(1),nt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),os=new WeakMap,I=F.createTreeWalker(F,129);function Xs(i,t){if(!be(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return es!==void 0?es.createHTML(t):t}const Ni=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ut?f[1]==="!--"?o=ss:f[1]!==void 0?o=rs:f[2]!==void 0?(Ks.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=r??ut,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?j:f[3]==='"'?ns:is):o===ns||o===is?o=j:o===ss||o===rs?o=ut:(o=j,r=void 0);const h=o===j&&i[l+1].startsWith("/>")?" ":"";n+=o===ut?a+Ti:u>=0?(s.push(p),a.slice(0,u)+Ys+a.slice(u)+R+h):a+R+(u===-2?l:h)}return[Xs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class bt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Ni(t,e);if(this.el=bt.createElement(p,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=I.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Ys)){const c=f[o++],h=r.getAttribute(u).split(R),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Mi:d[1]==="?"?ji:d[1]==="@"?Hi:Dt}),r.removeAttribute(u)}else u.startsWith(R)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ks.test(r.tagName)){const u=r.textContent.split(R),c=u.length-1;if(c>0){r.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],_t()),I.nextNode(),a.push({type:2,index:++n});r.append(u[c],_t())}}}else if(r.nodeType===8)if(r.data===Js)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(R,u+1))!==-1;)a.push({type:7,index:n}),u+=R.length-1}n++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}}function ot(i,t,e=i,s){var o,l;if(t===nt)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=$t(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=ot(i,r._$AS(i,t.values),r,s)),t}class Li{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??F).importNode(e,!0);I.currentNode=r;let n=I.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new xt(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Ii(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=F,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class xt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),$t(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ri(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=bt.createElement(Xs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Li(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=os.get(t.strings);return e===void 0&&os.set(t.strings,e=new bt(t)),e}k(t){be(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new xt(this.O(_t()),this.O(_t()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!$t(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=ot(this,l[s+a],e,a),p===nt&&(p=this._$AH[a]),o||(o=!$t(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mi extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class ji extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Hi extends Dt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??$)===nt)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ii{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const te=mt.litHtmlPolyfillSupport;te==null||te(bt,xt),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.0");const Di=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new xt(t.insertBefore(_t(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const D=globalThis;class E extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Di(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return nt}}var as;E._$litElement$=!0,E.finalized=!0,(as=D.litElementHydrateSupport)==null||as.call(D,{LitElement:E});const ee=D.litElementPolyfillSupport;ee==null||ee({LitElement:E});(D.litElementVersions??(D.litElementVersions=[])).push("4.2.0");const zi={};function Bi(i,t,e){switch(console.log("Received message"),i[0]){case"event/create":{const{event:s,onSuccess:r,onFailure:n}=i[1];fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json",...ms.headers(e)},body:JSON.stringify(s)}).then(o=>{if(o.status===201||o.status===200)return o.json();throw new Error(`Created event failed: ${o.status}`)}).then(()=>{r&&r()}).catch(o=>{n&&n(o)});break}default:{const s=i[0];throw new Error(`Unhandled message type: ${s}`)}}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:$e},Vi=(i=Fi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function x(i){return(t,e)=>typeof e=="object"?Vi(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function O(i){return x({...i,state:!0,attribute:!1})}const qi=P`
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

`,k={styles:qi};var Wi=Object.defineProperty,Zs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Wi(t,e,r),r};const we=class we extends E{constructor(){super(...arguments),this.loggedIn=!1}static initializeOnce(){}connectedCallback(){super.connectedCallback(),this._authObserver=new z(this,"SloBucketList:auth"),this._authObserver.observe(t=>{const{user:e}=t;e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0)})}renderSignOutButton(){return b`
        <li>
        <button
          @click=${t=>{gr.relay(t,"auth:message",["auth/signout"])}}
        >
          Sign Out
        </button>
        </li>
        `}renderSignInButton(){return b`
        <li>
            <a href="/login">
              Sign In…
            </a>
        </li>
    `}_onToggle(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}render(){return b`
            
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/events">Events</a></li>
                        <li><a href="/create-event">Create Event</a></li>
                        
                        
                        <li class="dark-mode-switch">
                            <p>Dark Mode</p>
                            <label class="switch">
                                <input type="checkbox" @change=${this._onToggle}>
                                <span class="slider"></span>
                            </label>
                        </li>
                        <li><a slot="actuator">
                            Hello, ${this.userid||"user"}
                        </a></li>
                        ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
                        
                    </ul>
                </nav>
            </header>

        `}};we.styles=[k.styles,P`
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
    `];let wt=we;Zs([O()],wt.prototype,"loggedIn");Zs([O()],wt.prototype,"userid");var Yi=Object.defineProperty,zt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Yi(t,e,r),r};const Ae=class Ae extends E{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
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
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Ae.styles=[k.styles,P`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 3px;
      }
  `];let V=Ae;zt([O()],V.prototype,"formData");zt([x()],V.prototype,"api");zt([x()],V.prototype,"redirect");zt([O()],V.prototype,"error");at({"login-form":V});const Ee=class Ee extends E{render(){return b`
            <h2>User Login</h2>
            <main id="home">
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
            </main>
            <p
            >Or did you want to
                <a href="register">Sign up as a new user</a>?
            </p>
            
        `}};Ee.styles=[k.styles,P`
         

        `];let oe=Ee;var Ji=Object.defineProperty,Bt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ji(t,e,r),r};const Se=class Se extends E{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
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
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==201)throw"Signup failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Se.styles=[k.styles,P`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 3px;
      }
  `];let q=Se;Bt([O()],q.prototype,"formData");Bt([x()],q.prototype,"api");Bt([x()],q.prototype,"redirect");Bt([O()],q.prototype,"error");at({"signup-form":q});const xe=class xe extends E{render(){return b`
            <h2>User Signup</h2>
            <main class="card">
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
            </main>
            <p
            >Or did you want to
                <a href="login.html">Log in</a>?
            </p>
        `}};xe.styles=[k.styles,P`
         

        `];let ae=xe;const Pe=class Pe extends E{render(){return b`
            <section id="home">
                <!-- Hero Section -->
                <div id="hero-container">
                    <section id="hero">
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-bucket"/>
                        </svg>

                        <div><h1>Welcome to the SloBucketList!</h1></div>
                        <div><p>Find, attend, and create local events in San Luis Obispo</p></div>
                    </section>
                </div>
            </section>    
            
        `}};Pe.styles=[k.styles,P`
            #home{
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            #hero-container{
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #hero{
                height: 30%;
                width: 50%;
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
        

        `];let le=Pe;var Ki=Object.defineProperty,Ft=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ki(t,e,r),r};const ke=class ke extends E{render(){return b`
            <div>
                <img src="${this.imgSrc}" alt="${this.alt} width="25%" />
                <a href="${this.href}"><p>${this.name}</p></a>
            </div>
        `}};ke.styles=[k.styles,P`
            p, h2{
                color: var(--text-primary);
            }
            

            div {
                display: flex;
                align-items: center;
                background-color: var(--background-primary);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 1rem;
                transition: box-shadow 0.2s ease;
            }

            div:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }

            div img {
                flex: 0 0 20%;
                height: auto;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 1rem;
            }

             div a p {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                text-align: center;
                flex: 1;
                color: var(--text-primary);
                text-decoration: none;
            }
    `];let W=ke;Ft([x({attribute:"img-public"})],W.prototype,"imgSrc");Ft([x()],W.prototype,"alt");Ft([x()],W.prototype,"href");Ft([x()],W.prototype,"name");var Xi=Object.defineProperty,Gs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Xi(t,e,r),r};const Ce=class Ce extends E{constructor(){super(...arguments),this.events=[],this._authObserver=new z(this,"SloBucketList:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user}).then(()=>{this.src&&this.hydrate(this.src)})}get authorization(){var t;if((t=this._user)!=null&&t.authenticated)return{Authorization:`Bearer ${this._user.token}`}}hydrate(t){fetch(t,{headers:this.authorization}).then(e=>{if(!e.ok)throw new Error(`Failed to fetch: ${e.status}`);return e.json()}).then(e=>{this.events=e}).catch(e=>{console.error("Error hydrating event feed:",e)})}render(){return b`
      <ul id="events-list-list">
        ${this.events.map(t=>b`
                <li>
                    <event-item
                            img-src=${t.imgSrc}
                            alt=${t.alt}
                            href=${t.href}
                            name=${t.name}
                    ></event-item>
                </li>
            `)}
      </ul>
    `}};Ce.styles=[k.styles,P`
            
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
            }
    
            #events-list-list li {
                margin-bottom: 1rem;
            }  `];let At=Ce;Gs([x()],At.prototype,"src");Gs([O()],At.prototype,"events");at({"event-feed":At,"event-item":W});const Oe=class Oe extends E{render(){return b`
            <section id="events-list">
                <div id="hero-container">
                    <div>
                        <h2>Events</h2>
                        <svg class="icon">
                            <use href="/assets/icons/events_icons.svg#icon-calendar"/>
                        </svg>
                    </div>
                    <p>Wednesday, Apr 9</p>
                </div>
                <event-feed src="/api/events"></event-feed>
            </section>
        `}};Oe.styles=[k.styles,P`
            #hero-container{
                div{
                    display: flex;
                    flex-direction: row;
                    .icon{
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

            p, h2{
                color: var(--text-primary);
            }

            #events-list {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            event-feed {
                list-style: none;
                width: 50%;
            }

            .icon{
                stroke: var(--text-primary);
                fill: var(--background-primary);
            }

        `];let ce=Oe;var Zi=Object.defineProperty,Vt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Zi(t,e,r),r};const jt=class jt extends qs{constructor(){super("SloBucketList:model"),this.api="/api/events",this.redirect="/events",this.formData={}}render(){return b`
            <section id="event-form">
                <div id="hero">
                    <h2>Submit an Event</h2>
                    <p>Fill in all fields below:</p>

                    <mu-form
                            .init=${this.formData}
                            @mu-form:submit=${t=>this.handleSubmit(t)}
                    >
                        <label for="eventId">Event ID:</label>
                        <input
                                type="text"
                                id="eventId"
                                name="eventId"
                                .value=${this.formData.eventId??""}
                        />

                        <label for="imgSrc">Image URL (imgSrc):</label>
                        <input
                                type="text"
                                id="imgSrc"
                                name="imgSrc"
                                .value=${this.formData.imgSrc??""}
                        />

                        <label for="alt">Alt Text:</label>
                        <input
                                type="text"
                                id="alt"
                                name="alt"
                                .value=${this.formData.alt??""}
                        />

                        <label for="href">Link (href):</label>
                        <input
                                type="text"
                                id="href"
                                name="href"
                                .value=${this.formData.href??""}
                        />

                        <label for="name">Event Name:</label>
                        <input
                                type="text"
                                id="name"
                                name="name"
                                .value=${this.formData.name??""}
                        />

                        <label for="location">Location:</label>
                        <input
                                type="text"
                                id="location"
                                name="location"
                                .value=${this.formData.location??""}
                        />

                        <label for="time">Time (e.g. “2025-06-10 18:00”):</label>
                        <input
                                type="text"
                                id="time"
                                name="time"
                                .value=${this.formData.time??""}
                        />

                        <button
                                type="submit"
                                ?disabled=${!this.canSubmit}
                        >
                            Submit Event
                        </button>
                        <p class="error">${this.error??""}</p>
                    </mu-form>
                </div>
            </section>
        `}get canSubmit(){const{eventId:t,imgSrc:e,alt:s,href:r,name:n,location:o,time:l}=this.formData;return!!(this.api&&t&&e&&s&&r&&n&&o&&l)}handleSubmit(t){const e=t.detail;console.log("Dispatching message"),this.dispatchMessage(["event/create",{event:e,onSuccess:()=>{$s.dispatch(this,"history/navigate",{href:this.redirect})},onFailure:s=>{this.error=s.message}}])}};jt.uses=at({"mu-form":$r.Element}),jt.styles=[k.styles,P`
      /* (Reuse the same CSS you already had) */
      #event-form {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      #hero {
        width: 400px;
        padding: 1rem 1.5rem;
        background-color: var(--background-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      h2 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }
      label {
        font-weight: 600;
        color: var(--text-primary);
      }
      input[type="text"] {
        padding: 0.5rem;
        font-size: var(--font-size-base);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        outline: none;
      }
      input[type="text"]:focus {
        border-color: var(--color-primary);
      }
      button[type="submit"] {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: var(--font-size-base);
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      button[type="submit"]:disabled {
        background-color: var(--color-muted);
        cursor: not-allowed;
      }
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: 0.5rem;
        border-radius: var(--radius-sm);
      }
    `];let Y=jt;Vt([x()],Y.prototype,"api");Vt([x()],Y.prototype,"redirect");Vt([O()],Y.prototype,"formData");Vt([O()],Y.prototype,"error");at({"mu-store":class extends xr.Provider{constructor(){super(Bi,zi,"SloBucketList:auth")}},"home-view":le,"login-view":oe,"register-view":ae,"events-view":ce,"create-event-view":Y});const Gi=[{path:"/app",view:()=>b`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"},{path:"/login",view:()=>b`
      <login-view></login-view>
    `},{path:"/register",view:()=>b`
      <register-view></register-view>
    `},{path:"/create-event",view:()=>b`
            <create-event-view
                    api="/api/events"
                    redirect="/events"
            ></create-event-view>
    `},{path:"/events",view:()=>b`
      <events-view></events-view>
    `}];at({"slo-bucket-list-header":wt,"mu-auth":ms.Provider,"mu-history":$s.Provider,"mu-switch":class extends mi.Element{constructor(){super(Gi,"SloBucketList:history","SloBucketList:auth")}}});
