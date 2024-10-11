var __defProp=Object.defineProperty;var __defProps=Object.defineProperties;var __getOwnPropDescs=Object.getOwnPropertyDescriptors;var __getOwnPropSymbols=Object.getOwnPropertySymbols;var __hasOwnProp=Object.prototype.hasOwnProperty;var __propIsEnum=Object.prototype.propertyIsEnumerable;var __defNormalProp=(obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:true,configurable:true,writable:true,value}):obj[key]=value;var __spreadValues=(a,b)=>{for(var prop in b||(b={}))if(__hasOwnProp.call(b,prop))__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b)){if(__propIsEnum.call(b,prop))__defNormalProp(a,prop,b[prop])}return a};var __spreadProps=(a,b)=>__defProps(a,__getOwnPropDescs(b));var __accessCheck=(obj,member,msg)=>{if(!member.has(obj))throw TypeError("Cannot "+msg)};var __privateGet=(obj,member,getter)=>{__accessCheck(obj,member,"read from private field");return getter?getter.call(obj):member.get(obj)};var __privateAdd=(obj,member,value)=>{if(member.has(obj))throw TypeError("Cannot add the same private member more than once");member instanceof WeakSet?member.add(obj):member.set(obj,value)};var __privateSet=(obj,member,value,setter)=>{__accessCheck(obj,member,"write to private field");setter?setter.call(obj,value):member.set(obj,value);return value};var __privateMethod=(obj,member,method)=>{__accessCheck(obj,member,"access private method");return method};var __async=(__this,__arguments,generator)=>{return new Promise((resolve,reject)=>{var fulfilled=value=>{try{step(generator.next(value))}catch(e){reject(e)}};var rejected=value=>{try{step(generator.throw(value))}catch(e){reject(e)}};var step=x=>x.done?resolve(x.value):Promise.resolve(x.value).then(fulfilled,rejected);step((generator=generator.apply(__this,__arguments)).next())})};var BrowserRouteType="BrowserRoute";var HashRouteType="HashRoute";var DefaultNestedLevel=0;var _404RRoute={element:()=>{throw new Error("Page not found")},params:{},isSubRoute:false,nestedLevel:DefaultNestedLevel};var DefaultRoute={"*":_404RRoute};var _location,_routes,_disposeCb,_splitPath,splitPath_fn,_setParamsKeys,setParamsKeys_fn,_setParamsValues,setParamsValues_fn,_getQueryString,getQueryString_fn,_getHash,getHash_fn,_getParams,getParams_fn,_getPath,getPath_fn,_checkEqualPath,checkEqualPath_fn,_removeQueryParams,removeQueryParams_fn,_removeHash,removeHash_fn,_removeQueryParamsAndHash,removeQueryParamsAndHash_fn,_getRoute,getRoute_fn,_directRoute,directRoute_fn,_directNestedRoute,directNestedRoute_fn,_updateHistory,updateHistory_fn,_unMount,unMount_fn,_isNotSameRoute,isNotSameRoute_fn,_routePath,routePath_fn,_push,push_fn,_setLocation,setLocation_fn,_routeConfig,routeConfig_fn;var RouterManagement=class{constructor(){__privateAdd(this,_splitPath);__privateAdd(this,_setParamsKeys);__privateAdd(this,_setParamsValues);__privateAdd(this,_getQueryString);__privateAdd(this,_getHash);__privateAdd(this,_getParams);__privateAdd(this,_getPath);__privateAdd(this,_checkEqualPath);__privateAdd(this,_removeQueryParams);__privateAdd(this,_removeHash);__privateAdd(this,_removeQueryParamsAndHash);__privateAdd(this,_getRoute);__privateAdd(this,_directRoute);__privateAdd(this,_directNestedRoute);__privateAdd(this,_updateHistory);__privateAdd(this,_unMount);__privateAdd(this,_isNotSameRoute);__privateAdd(this,_routePath);__privateAdd(this,_push);__privateAdd(this,_setLocation);__privateAdd(this,_routeConfig);__privateAdd(this,_location,{pathname:"/",params:{},search:{},hash:""});__privateAdd(this,_routes,DefaultRoute);__privateAdd(this,_disposeCb,{});this.routeType=BrowserRouteType}getRoutes(){return __privateGet(this,_routes)}go(searchPathname,options){if(this.routeType===HashRouteType&&!searchPathname.startsWith("/#")){searchPathname=`/#`+searchPathname}__privateMethod(this,_push,push_fn).call(this,searchPathname,options)}dispose(cb){if(cb){const{pathname}=this.getLocation();__privateGet(this,_disposeCb)[pathname]=cb}}getLocation(){return __privateGet(this,_location)}back(){window.history.back()}forward(){window.history.forward()}refresh(){window.location.reload()}replace(searchPathname,state){let pathname=searchPathname;if(this.routeType===HashRouteType){pathname=`/#${searchPathname}`}__privateMethod(this,_push,push_fn).call(this,pathname,{state,addToHistory:false},true)}config(routeData,basePath=""){__privateMethod(this,_routeConfig,routeConfig_fn).call(this,routeData,basePath)}resolveElement(element){return __async(this,null,function*(){const result=element();if(result instanceof Promise){return yield result}return result})}};_location=new WeakMap;_routes=new WeakMap;_disposeCb=new WeakMap;_splitPath=new WeakSet;splitPath_fn=function(path){return path.split("/").slice(2)};_setParamsKeys=new WeakSet;setParamsKeys_fn=function(paramsKey){return paramsKey.reduce((obj,key)=>__spreadProps(__spreadValues({},obj),{[key]:""}),{})};_setParamsValues=new WeakSet;setParamsValues_fn=function({paramsKey,paramsValue}){return paramsKey.reduce((obj,key,index)=>{var _a;return __spreadProps(__spreadValues({},obj),{[key]:(_a=paramsValue[index])!=null?_a:""})},{})};_getQueryString=new WeakSet;getQueryString_fn=function(path){const pathWithoutHash=__privateMethod(this,_removeHash,removeHash_fn).call(this,path);const str=pathWithoutHash.indexOf("?");if(str>-1){const queryString=pathWithoutHash.slice(str+1);const queryStringArr=queryString.split("&");return queryStringArr.reduce((obj,queryParams)=>{const[key,value]=queryParams.split("=");return __spreadProps(__spreadValues({},obj),{[key]:value})},{})}return{}};_getHash=new WeakSet;getHash_fn=function(path){const str=path.lastIndexOf("#");return str>-1?path.slice(str):""};_getParams=new WeakSet;getParams_fn=function({pathname,searchedPathname}){const routeInfo=__privateGet(this,_routes)[pathname];const paramsValue=__privateMethod(this,_splitPath,splitPath_fn).call(this,searchedPathname);const paramsKey=Object.keys(routeInfo.params);return __privateMethod(this,_setParamsValues,setParamsValues_fn).call(this,{paramsKey,paramsValue})};_getPath=new WeakSet;getPath_fn=function(inputStr){const pattern=/^\/[a-zA-Z0-9\\-]*|[\\/]/;const match=inputStr.match(pattern);return match==null?void 0:match[0]};_checkEqualPath=new WeakSet;checkEqualPath_fn=function({searchedPathname,pathname}){const searchPathnameArr=__privateMethod(this,_removeQueryParamsAndHash,removeQueryParamsAndHash_fn).call(this,searchedPathname).split("/");const pathnameArr=pathname.split("/");if(searchPathnameArr.length===pathnameArr.length){return pathnameArr.every((path,index)=>path.indexOf(":")>=0||path.indexOf(":")<0&&searchPathnameArr[index]===path)}return false};_removeQueryParams=new WeakSet;removeQueryParams_fn=function(path){const paramsPos=path.indexOf("?");return paramsPos>-1?path.slice(0,paramsPos):path};_removeHash=new WeakSet;removeHash_fn=function(path){const hashPosition=path.indexOf("#");return hashPosition>-1?path.slice(0,hashPosition):path};_removeQueryParamsAndHash=new WeakSet;removeQueryParamsAndHash_fn=function(path){const pathWithoutHash=__privateMethod(this,_removeHash,removeHash_fn).call(this,path);return __privateMethod(this,_removeQueryParams,removeQueryParams_fn).call(this,pathWithoutHash)};_getRoute=new WeakSet;getRoute_fn=function(searchedPathname){const searchedPath=__privateMethod(this,_getPath,getPath_fn).call(this,searchedPathname);let routeData=__privateGet(this,_routes)["*"];let pathInfo="*";for(const pathname in __privateGet(this,_routes)){const routeInfo=__privateGet(this,_routes)[pathname];const path=__privateMethod(this,_getPath,getPath_fn).call(this,pathname);if(!__privateMethod(this,_checkEqualPath,checkEqualPath_fn).call(this,{searchedPathname,pathname})){continue}pathInfo=pathname;if(pathname===searchedPathname){routeData=routeInfo;break}if(!searchedPath||path===searchedPath){routeData=__spreadProps(__spreadValues({},routeInfo),{params:__privateMethod(this,_getParams,getParams_fn).call(this,{pathname,searchedPathname:__privateMethod(this,_removeQueryParamsAndHash,removeQueryParamsAndHash_fn).call(this,searchedPathname)})});break}}return __spreadProps(__spreadValues({},routeData),{pathname:pathInfo,search:__privateMethod(this,_getQueryString,getQueryString_fn).call(this,searchedPathname),hash:__privateMethod(this,_getHash,getHash_fn).call(this,searchedPathname)})};_directRoute=new WeakSet;directRoute_fn=function(routeRenderEle,routeData){const{nestedLevel,element}=routeData;const routeEle=routeRenderEle[nestedLevel];if(routeEle){routeEle.innerHTML="";if(element instanceof Promise){element.then(el=>{if(el instanceof Element||el instanceof DocumentFragment){routeEle.appendChild(el)}else{console.error("L'elemento restituito dalla promessa non \xE8 un Element o DocumentFragment valido")}})}else if(element instanceof Element||element instanceof DocumentFragment){routeEle.appendChild(element)}else{console.error("L'elemento fornito non \xE8 un Element o DocumentFragment valido")}}};_directNestedRoute=new WeakSet;directNestedRoute_fn=function(searchPathname,routeData){const{nestedLevel,pathname}=routeData;const renderRouteEle=[...document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')];const routeElementsLen=renderRouteEle.length-1;const cleanPath=__privateMethod(this,_removeQueryParamsAndHash,removeQueryParamsAndHash_fn).call(this,searchPathname).split("/");const pathArr=pathname==="*"?cleanPath.slice(1):cleanPath.slice(1,nestedLevel+2);const searchPathArr=pathArr.splice(routeElementsLen);let nextPath=routeElementsLen>0?`/${pathArr.splice(0,routeElementsLen).join("/")}`:"";const fragment=document.createDocumentFragment();for(const[index,path]of searchPathArr.entries()){const renderEleFragment=[...fragment.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')];const routeFragmentEle=index===0?fragment:renderEleFragment[index-1];const routeInfo=__privateMethod(this,_getRoute,getRoute_fn).call(this,`${nextPath}/${path}`);nextPath+=`/${path}`;if(routeInfo.pathname==="*"){const element=__privateGet(this,_routes)["*"].element();if(element instanceof Promise){element.then(el=>routeFragmentEle==null?void 0:routeFragmentEle.appendChild(el))}else{routeFragmentEle==null?void 0:routeFragmentEle.appendChild(element)}break}else{const element=routeInfo.element();if(element instanceof Promise){element.then(el=>routeFragmentEle==null?void 0:routeFragmentEle.appendChild(el))}else{routeFragmentEle==null?void 0:routeFragmentEle.appendChild(element)}}}const routeEle=renderRouteEle[routeElementsLen];if(routeEle){routeEle.innerHTML="";routeEle.appendChild(fragment)}};_updateHistory=new WeakSet;updateHistory_fn=function({addToHistory,replaceState,state,pathname}){if(replaceState){history.replaceState(state,"",pathname)}else if(addToHistory){history.pushState(__spreadProps(__spreadValues({},state),{pathname}),"",pathname)}};_unMount=new WeakSet;unMount_fn=function(){var _a,_b;const{pathname:closingRoutePath}=this.getLocation();(_b=(_a=__privateGet(this,_disposeCb))[closingRoutePath])==null?void 0:_b.call(_a);delete __privateGet(this,_disposeCb)[closingRoutePath]};_isNotSameRoute=new WeakSet;isNotSameRoute_fn=function(searchPathname){const{pathname:closingRoutePath}=this.getLocation();return closingRoutePath==="/"||closingRoutePath!==searchPathname};_routePath=new WeakSet;routePath_fn=function(pathname){if(this.routeType===HashRouteType){return pathname.slice(2)}return pathname};_push=new WeakSet;push_fn=function(searchPathname,options,replaceState=false){const routePath=__privateMethod(this,_routePath,routePath_fn).call(this,searchPathname);if(__privateMethod(this,_isNotSameRoute,isNotSameRoute_fn).call(this,routePath)){const{state={},addToHistory=true}=options!=null?options:{};const routeData=__privateMethod(this,_getRoute,getRoute_fn).call(this,routePath);const{params,search,hash,pathname,nestedLevel}=routeData;__privateMethod(this,_unMount,unMount_fn).call(this);__privateMethod(this,_setLocation,setLocation_fn).call(this,{pathname:routePath,params,search,hash});__privateMethod(this,_updateHistory,updateHistory_fn).call(this,{addToHistory,replaceState,state,pathname:searchPathname});const routeRenderEle=[...document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')];if(routeRenderEle.length-1>=nestedLevel&&pathname!=="*"){__privateMethod(this,_directRoute,directRoute_fn).call(this,routeRenderEle,routeData)}else{__privateMethod(this,_directNestedRoute,directNestedRoute_fn).call(this,routePath,routeData)}window.scrollTo(0,0)}};_setLocation=new WeakSet;setLocation_fn=function(obj){__privateSet(this,_location,obj)};_routeConfig=new WeakSet;routeConfig_fn=function(routeData,basePath="",nestedLevel=DefaultNestedLevel){routeData.forEach(routeInfo=>{const pathname=`${basePath}${routeInfo.pathname}`;const paramsKey=__privateMethod(this,_splitPath,splitPath_fn).call(this,pathname.replaceAll(":",""));__privateGet(this,_routes)[pathname]={element:routeInfo.element,params:pathname.indexOf(":")>=0?__privateMethod(this,_setParamsKeys,setParamsKeys_fn).call(this,paramsKey):{},isSubRoute:Boolean(basePath),nestedLevel};if(routeInfo.children){__privateMethod(this,_routeConfig,routeConfig_fn).call(this,routeInfo.children,pathname,nestedLevel+1)}})};var _routeSetup,_init,init_fn,_backListener,backListener_fn,_addListener,addListener_fn,_checkRouteSetup,checkRouteSetup_fn,_appendHash,appendHash_fn;var RouterSetup=class extends RouterManagement{constructor(){super(...arguments);__privateAdd(this,_init);__privateAdd(this,_backListener);__privateAdd(this,_addListener);__privateAdd(this,_checkRouteSetup);__privateAdd(this,_appendHash);__privateAdd(this,_routeSetup,false)}browserRoute(routeData){const{origin,href}=new URL(window.location.href);__privateMethod(this,_init,init_fn).call(this,BrowserRouteType,routeData);const pathname=href.slice(origin.length);this.go(pathname)}hashRoute(routeData){const{origin,href}=new URL(window.location.href);__privateMethod(this,_init,init_fn).call(this,HashRouteType,routeData);let pathname=href.slice(origin.length);__privateMethod(this,_appendHash,appendHash_fn).call(this);if(!pathname.startsWith("/#")){pathname=`/#${pathname}`;window.location.href=`${origin}${pathname}`}this.go(pathname)}};_routeSetup=new WeakMap;_init=new WeakSet;init_fn=function(routeType,routeData){this.routeType=routeType;__privateMethod(this,_checkRouteSetup,checkRouteSetup_fn).call(this);this.config(routeData);__privateMethod(this,_backListener,backListener_fn).call(this);__privateMethod(this,_addListener,addListener_fn).call(this)};_backListener=new WeakSet;backListener_fn=function(){window.addEventListener("popstate",event=>{const{pathname=""}=event.state||{};if(pathname){this.go(pathname,{state:{},addToHistory:false})}})};_addListener=new WeakSet;addListener_fn=function(){const links=document.querySelectorAll('a[data-vanilla-route-link="spa"]');if(links){links.forEach(link=>{link.addEventListener("click",event=>{var _a;event.preventDefault();const href=(_a=event.target.getAttribute("href"))!=null?_a:"";this.go(href)})})}};_checkRouteSetup=new WeakSet;checkRouteSetup_fn=function(){if(__privateGet(this,_routeSetup)){this.go("/404");throw new Error("In the application you can only have 1 Route setup using either browserRoute() or hashRoute().")}__privateSet(this,_routeSetup,true)};_appendHash=new WeakSet;appendHash_fn=function(){const links=document.querySelectorAll('a[data-vanilla-route-link="spa"]');if(links){links.forEach(link=>{const pathname=link.href.slice(link.origin.length);link.href=`/#${pathname}`})}};var Router=new RouterSetup;var BrowserRoute=routes=>Router.browserRoute(routes);var HashRoute=routes=>Router.hashRoute(routes);var routeLocation=()=>Router.getLocation();var router=()=>Router.getRoutes();export{BrowserRoute,BrowserRouteType,DefaultNestedLevel,DefaultRoute,HashRoute,HashRouteType,Router,_404RRoute,routeLocation,router};
