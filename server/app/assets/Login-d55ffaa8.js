import{E as S,ac as w,r as p,ad as g,ae as U,p as C,B as x,af as F,m as R,ag as _,x as P,y as l,ah as B,c as h,G as T,K as A,I as s,ai as D,N as k,R as V,a3 as E,aj as N,ak as y}from"./index-2abd0456.js";import{V as L}from"./VSheet-3e88b24c.js";import{V as O,d as j,c as z,e as G}from"./VCard-6d91b3c2.js";import{V as I}from"./VSpacer-d994dc61.js";function K(){const i=S(),m=w(),t=p(null),u=p(null);return{data:t,error:u,loginUser:v=>{t.value=null,u.value=null,g.post(U("/auth/sign_in"),v,{headers:{}}).then(e=>{var a;(a=e.data)!=null&&a.token&&(i.token=e.data.token,t.value=e.data,m.push("/"))}).catch(e=>u.value=e)},logOutUser:v=>{t.value=null,u.value=null,g.post("/auth/logout",v).then(e=>{var a;(a=e.data)!=null&&a.token&&(i.token=null,t.value=e.data,m.push("/login"))}).catch(e=>u.value=e)}}}const M=C({...x(),...F()},"VForm"),Y=R()({name:"VForm",props:M(),emits:{"update:modelValue":i=>!0,submit:i=>!0},setup(i,m){let{slots:t,emit:u}=m;const c=_(i),d=p();function v(a){a.preventDefault(),c.reset()}function e(a){const f=a,o=c.validate();f.then=o.then.bind(o),f.catch=o.catch.bind(o),f.finally=o.finally.bind(o),u("submit",f),f.defaultPrevented||o.then(n=>{var b;let{valid:r}=n;r&&((b=d.value)==null||b.submit())}),f.preventDefault()}return P(()=>{var a;return l("form",{ref:d,class:["v-form",i.class],style:i.style,novalidate:!0,onReset:v,onSubmit:e},[(a=t.default)==null?void 0:a.call(t,c)])}),B(c,d)}}),Q={__name:"Login",setup(i){const m=p(!1),t=p(null),u=p(null),c=[o=>o&&o.length>0?!0:"You must enter a value."],{error:d,loginUser:v}=K(),e=h({set(){d.value=null},get(){return!!d.value}}),a=h(()=>d.value?d.value.message:null),f=async o=>{v({email:t.value,password:u.value})};return(o,n)=>(T(),A("div",null,[l(D,{modelValue:e.value,"onUpdate:modelValue":n[1]||(n[1]=r=>e.value=r),"multi-line":"",location:"top right",color:"warning"},{actions:s(()=>[l(k,{color:"white",variant:"text",onClick:n[0]||(n[0]=r=>e.value=!1)},{default:s(()=>[V(" Close ")]),_:1})]),default:s(()=>[V(E(a.value)+" ",1)]),_:1},8,["modelValue"]),l(L,{theme:"dark",rounded:"lg",class:"mt-16"},{default:s(()=>[l(O,{variant:"tonal","min-width":"300"},{default:s(()=>[l(j,null,{default:s(()=>[V("Login")]),_:1}),l(Y,{onSubmit:N(f,["prevent"]),modelValue:m.value,"onUpdate:modelValue":n[4]||(n[4]=r=>m.value=r),"validate-on":"lazy input blur"},{default:s(()=>[l(z,null,{default:s(()=>[l(y,{variant:"outlined",rules:c,modelValue:t.value,"onUpdate:modelValue":n[2]||(n[2]=r=>t.value=r),flat:!0,label:"Username",clearable:!0},null,8,["modelValue"]),l(y,{flat:!0,modelValue:u.value,"onUpdate:modelValue":n[3]||(n[3]=r=>u.value=r),rules:c,clearable:!0,type:"password",label:"Password",variant:"outlined"},null,8,["modelValue"])]),_:1}),l(G,null,{default:s(()=>[l(I),l(k,{color:"primary",type:"submit",variant:"tonal",disabled:!m.value},{default:s(()=>[V("Submit ")]),_:1},8,["disabled"])]),_:1})]),_:1},8,["onSubmit","modelValue"])]),_:1})]),_:1})]))}};export{Q as default};
