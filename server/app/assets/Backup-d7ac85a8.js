import{u as S,_ as u}from"./Api-5b3a002d.js";import{r as v,o as g,a2 as C,c as d,S as w,G as f,K as x,y as t,I as a,ai as B,R as V,a3 as I,J as N,N as _,H as T,O as U,ay as A}from"./index-009675d2.js";import{V as L,e as R,c as j}from"./VCard-e2ba95ee.js";import{V as z}from"./VSpacer-8f77e624.js";import{V as D}from"./VToolbar-73ee91ac.js";const E={style:{width:"100%"}},P={__name:"Backup",setup(G){const{post:k,data:l,error:c}=S(),r=v([]);v(!0);let m;g(()=>{i(),m=setInterval(()=>{i()},3e4)}),C(()=>clearInterval(m));const h=s=>!!r.value.find(e=>e.uuid===s.uuid),i=()=>k("lsblk"),p=d(()=>!!c.value),y=d(()=>{if(!l.value)return[];const s=u.first(l.value.result);return u.keys(s).map(n=>({key:n,title:u.capitalize(u.kebabCase(n)),removable:!0})).concat([{key:"status",title:"Status"}])}),b=d(()=>l.value?l.value.result:[]);return(s,e)=>{const n=w("v-data-table");return f(),x("div",E,[t(B,{modelValue:p.value,"onUpdate:modelValue":e[0]||(e[0]=o=>p.value=o),"multi-line":"",timeout:2e3,location:"top",color:"error"},{actions:a(()=>[]),default:a(()=>[V(I(N(c))+" ",1)]),_:1},8,["modelValue"]),t(L,{flat:"",class:"pt-6 pb-6",theme:"dark",width:"100%",height:"70vh",rounded:"lg"},{default:a(()=>[t(R,null,{default:a(()=>[t(z),t(_,{color:"seconary",variant:"tonal",onClick:e[1]||(e[1]=o=>i()),icon:"mdi-refresh"})]),_:1}),t(j,null,{default:a(()=>[t(n,{modelValue:r.value,"onUpdate:modelValue":e[2]||(e[2]=o=>r.value=o),"item-value":"uuid","return-object":"","select-strategy":"single",items:b.value,headers:y.value,"show-select":"showSelect"},{top:a(()=>[t(D,{elevation:8,title:"Select device for backup"},{default:a(()=>[r.value.length>0?(f(),T(_,{key:0,color:"primary"},{default:a(()=>[V("Run")]),_:1})):U("",!0)]),_:1})]),"item.status":a(({item:o})=>[t(A,{indeterminate:h(o),color:"yellow-darken-2"},null,8,["indeterminate"])]),_:2},1032,["modelValue","items","headers"])]),_:1})]),_:1})])}}};export{P as default};
