import{u as w,_ as u}from"./Api-5f4d9ff9.js";import{a as C,V as x}from"./VSheet-e2e86de1.js";import{r as v,o as B,a2 as I,c as d,S as N,G as f,H as V,I as e,y as a,R as h,a3 as T,J as U,ai as A,N as k,O as L,al as R}from"./index-402cf893.js";import{e as j,c as z,V as D}from"./VCard-654271fb.js";import{V as G}from"./VToolbar-bcc7e219.js";const q={__name:"Backup",setup(H){const{post:b,data:o,error:c}=w(),r=v([]),_=v(!0);let m;B(()=>{i(),m=setInterval(()=>{i()},3e4)}),I(()=>clearInterval(m));const g=s=>!!r.value.find(t=>t.uuid===s.uuid),i=()=>b("lsblk"),p=d(()=>!!c.value),y=d(()=>{if(!o.value)return[];const s=u.first(o.value.result);return u.keys(s).map(n=>({key:n,title:u.capitalize(u.kebabCase(n)),removable:!0})).concat([{key:"status",title:"Status"}])}),S=d(()=>o.value?o.value.result:[]);return(s,t)=>{const n=N("v-data-table");return f(),V(C,{rounded:"lg",class:"pt-6 pb-6 px-6 bg-black",width:"100%","min-height":"70vh",theme:"dark"},{default:e(()=>[a(A,{modelValue:p.value,"onUpdate:modelValue":t[0]||(t[0]=l=>p.value=l),"multi-line":"",timeout:2e3,location:"top",color:"error"},{actions:e(()=>[]),default:e(()=>[h(T(U(c))+" ",1)]),_:1},8,["modelValue"]),a(D,{flat:"",class:"pt-6 pb-6 bg-black",theme:"dark",width:"100%",height:"70vh",rounded:"lg"},{default:e(()=>[a(j,null,{default:e(()=>[a(x),a(k,{color:"seconary",variant:"tonal",onClick:t[1]||(t[1]=l=>i()),icon:"mdi-refresh"})]),_:1}),a(z,null,{default:e(()=>[a(n,{density:"compact",hover:!0,modelValue:r.value,"onUpdate:modelValue":t[2]||(t[2]=l=>r.value=l),"item-value":"uuid","return-object":"","select-strategy":"single",items:S.value,headers:y.value,"show-select":_.value},{top:e(()=>[a(G,{elevation:0,class:"rounded-t-lg",title:"Select device for backup"},{default:e(()=>[r.value.length>0?(f(),V(k,{key:0,color:"primary"},{default:e(()=>[h("Run")]),_:1})):L("",!0)]),_:1})]),"item.status":e(({item:l})=>[a(R,{indeterminate:g(l),color:"yellow-darken-2"},null,8,["indeterminate"])]),_:2},1032,["modelValue","items","headers","show-select"])]),_:1})]),_:1})]),_:1})}}};export{q as default};
