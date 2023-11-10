import{u as X,b as be,V as we,c as Z,_ as Ie}from"./VList-0234bda4.js";import{e as Pe,c as Y}from"./VSheet-c6e48fa9.js";import{p as k,A as F,J as V,d as C,r as A,c as h,aH as N,g as ke,I as xe,aI as ne,M as ue,H as O,aw as _,aj as Ve,aJ as T,aK as G,S as x,m as Be,l as De,n as _e,q as Ae,t as y,o as Ce,a8 as Me,P as K,Q as q,R as S,_ as B,a9 as D,aF as Te,X as ee,T as Fe,W as Ee,U as Le,Z as te,a0 as j,a7 as Oe,a6 as Ke}from"./index-8e99d87e.js";import{b as ae,e as je,d as le,V as re}from"./VCard-9bc943d0.js";import{V as Ne,a as Ge}from"./VRow-d39b4134.js";const Re=k({expandOnClick:Boolean,showExpand:Boolean,expanded:{type:Array,default:()=>[]}},"DataTable-expand"),$e=Symbol.for("vuetify:datatable:expanded");function Ue(t){const a=F(t,"expandOnClick"),e=V(t,"expanded",t.expanded,n=>new Set(n),n=>[...n.values()]);function l(n,u){const s=new Set(e.value);u?s.add(n.value):s.delete(n.value),e.value=s}function r(n){return e.value.has(n.value)}function d(n){l(n,!r(n))}const f={expand:l,expanded:e,expandOnClick:a,isExpanded:r,toggleExpand:d};return C($e,f),f}const We=k({groupBy:{type:Array,default:()=>[]}},"DataTable-group"),ze=Symbol.for("vuetify:data-table-group");function He(t){const{groupBy:a,sortBy:e}=t,l=A(new Set),r=h(()=>a.value.map(s=>({...s,order:s.order??!1})).concat(e.value));function d(s){return l.value.has(s.id)}function f(s){const o=new Set(l.value);d(s)?o.delete(s.id):o.add(s.id),l.value=o}function n(s){function o(c){const m=[];for(const g of c.items)"type"in g&&g.type==="group"?m.push(...o(g)):m.push(g);return m}return o({type:"group",items:s,id:"dummy",key:"dummy",value:"dummy",depth:0})}const u={sortByWithGroups:r,toggleGroup:f,opened:l,groupBy:a,extractRows:n,isGroupOpen:d};return C(ze,u),u}function Je(t,a){if(!t.length)return[];const e=new Map;for(const l of t){const r=N(l.raw,a);e.has(r)||e.set(r,[]),e.get(r).push(l)}return e}function se(t,a){let e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,l=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"root";if(!a.length)return[];const r=Je(t,a[0]),d=[],f=a.slice(1);return r.forEach((n,u)=>{const s=a[0],o=`${l}_${s}_${u}`;d.push({depth:e,id:o,key:s,value:u,items:f.length?se(n,f,e+1,o):n,type:"group"})}),d}function oe(t,a){const e=[];for(const l of t)"type"in l&&l.type==="group"?(l.value!=null&&e.push(l),(a.has(l.id)||l.value==null)&&e.push(...oe(l.items,a))):e.push(l);return e}function Qe(t,a,e){return{flatItems:h(()=>{if(!a.value.length)return t.value;const r=se(t.value,a.value.map(d=>d.key));return oe(r,e.value)})}}function Xe(t){let{page:a,itemsPerPage:e,sortBy:l,groupBy:r,search:d}=t;const f=ke("VDataTable"),n=h(()=>({page:a.value,itemsPerPage:e.value,sortBy:l.value,groupBy:r.value,search:d.value}));let u=null;xe(n,()=>{ne(u,n.value)||((u==null?void 0:u.search)!==n.value.search&&(a.value=1),f.emit("update:options",n.value),u=n.value)},{deep:!0,immediate:!0})}const Ze=k({page:{type:[Number,String],default:1},itemsPerPage:{type:[Number,String],default:10}},"DataTable-paginate"),Ye=Symbol.for("vuetify:data-table-pagination");function qe(t){const a=V(t,"page",void 0,l=>+(l??1)),e=V(t,"itemsPerPage",void 0,l=>+(l??10));return{page:a,itemsPerPage:e}}function et(t){const{page:a,itemsPerPage:e,itemsLength:l}=t,r=h(()=>e.value===-1?0:e.value*(a.value-1)),d=h(()=>e.value===-1?l.value:Math.min(l.value,r.value+e.value)),f=h(()=>e.value===-1||l.value===0?1:Math.ceil(l.value/e.value));ue(()=>{a.value>f.value&&(a.value=f.value)});function n(m){e.value=m,a.value=1}function u(){a.value=O(a.value+1,1,f.value)}function s(){a.value=O(a.value-1,1,f.value)}function o(m){a.value=O(m,1,f.value)}const c={page:a,itemsPerPage:e,startIndex:r,stopIndex:d,pageCount:f,itemsLength:l,nextPage:u,prevPage:s,setPage:o,setItemsPerPage:n};return C(Ye,c),c}function tt(t){const{items:a,startIndex:e,stopIndex:l,itemsPerPage:r}=t;return{paginatedItems:h(()=>r.value<=0?a.value:a.value.slice(e.value,l.value))}}const at={showSelectAll:!1,allSelected:()=>[],select:t=>{var l;let{items:a,value:e}=t;return new Set(e?[(l=a[0])==null?void 0:l.value]:[])},selectAll:t=>{let{selected:a}=t;return a}},ce={showSelectAll:!0,allSelected:t=>{let{currentPage:a}=t;return a},select:t=>{let{items:a,value:e,selected:l}=t;for(const r of a)e?l.add(r.value):l.delete(r.value);return l},selectAll:t=>{let{value:a,currentPage:e,selected:l}=t;return ce.select({items:e,value:a,selected:l})}},ie={showSelectAll:!0,allSelected:t=>{let{allItems:a}=t;return a},select:t=>{let{items:a,value:e,selected:l}=t;for(const r of a)e?l.add(r.value):l.delete(r.value);return l},selectAll:t=>{let{value:a,allItems:e,selected:l}=t;return ie.select({items:e,value:a,selected:l})}},lt=k({showSelect:Boolean,selectStrategy:{type:[String,Object],default:"page"},modelValue:{type:Array,default:()=>[]},valueComparator:{type:Function,default:ne}},"DataTable-select"),rt=Symbol.for("vuetify:data-table-selection");function nt(t,a){let{allItems:e,currentPage:l}=a;const r=V(t,"modelValue",t.modelValue,i=>new Set(_(i).map(v=>{var I;return((I=e.value.find(P=>t.valueComparator(v,P.value)))==null?void 0:I.value)??v})),i=>[...i.values()]),d=h(()=>e.value.filter(i=>i.selectable)),f=h(()=>l.value.filter(i=>i.selectable)),n=h(()=>{if(typeof t.selectStrategy=="object")return t.selectStrategy;switch(t.selectStrategy){case"single":return at;case"all":return ie;case"page":default:return ce}});function u(i){return _(i).every(v=>r.value.has(v.value))}function s(i){return _(i).some(v=>r.value.has(v.value))}function o(i,v){const I=n.value.select({items:i,value:v,selected:new Set(r.value)});r.value=I}function c(i){o([i],!u([i]))}function m(i){const v=n.value.selectAll({value:i,allItems:d.value,currentPage:f.value,selected:new Set(r.value)});r.value=v}const g=h(()=>r.value.size>0),b=h(()=>{const i=n.value.allSelected({allItems:d.value,currentPage:f.value});return!!i.length&&u(i)}),p={toggleSelect:c,select:o,selectAll:m,isSelected:u,isSomeSelected:s,someSelected:g,allSelected:b,showSelectAll:n.value.showSelectAll};return C(rt,p),p}const ut=k({sortBy:{type:Array,default:()=>[]},customKeySort:Object,multiSort:Boolean,mustSort:Boolean},"DataTable-sort"),st=Symbol.for("vuetify:data-table-sort");function ot(t){const a=V(t,"sortBy"),e=F(t,"mustSort"),l=F(t,"multiSort");return{sortBy:a,mustSort:e,multiSort:l}}function ct(t){const{sortBy:a,mustSort:e,multiSort:l,page:r}=t,d=u=>{if(u.key==null)return;let s=a.value.map(c=>({...c}))??[];const o=s.find(c=>c.key===u.key);o?o.order==="desc"?e.value?o.order="asc":s=s.filter(c=>c.key!==u.key):o.order="desc":l.value?s=[...s,{key:u.key,order:"asc"}]:s=[{key:u.key,order:"asc"}],a.value=s,r&&(r.value=1)};function f(u){return!!a.value.find(s=>s.key===u.key)}const n={sortBy:a,toggleSort:d,isSorted:f};return C(st,n),n}function it(t,a,e,l){const r=Ve();return{sortedItems:h(()=>e.value.length?dt(a.value,e.value,r.current.value,{...t.customKeySort,...l==null?void 0:l.value}):a.value)}}function dt(t,a,e,l){const r=new Intl.Collator(e,{sensitivity:"accent",usage:"sort"});return[...t].sort((d,f)=>{for(let n=0;n<a.length;n++){const u=a[n].key,s=a[n].order??"asc";if(s===!1)continue;let o=N(d.raw,u),c=N(f.raw,u);if(s==="desc"&&([o,c]=[c,o]),l!=null&&l[u]){const m=l[u](o,c);if(!m)continue;return m}if(o instanceof Date&&c instanceof Date)return o.getTime()-c.getTime();if([o,c]=[o,c].map(m=>m!=null?m.toString().toLocaleLowerCase():m),o!==c)return T(o)&&T(c)?0:T(o)?-1:T(c)?1:!isNaN(o)&&!isNaN(c)?Number(o)-Number(c):r.compare(o,c)}return 0})}const ft=k({items:{type:Array,default:()=>[]},itemValue:{type:[String,Array,Function],default:"id"},itemSelectable:{type:[String,Array,Function],default:null},returnObject:Boolean},"DataIterator-items");function mt(t,a){const e=t.returnObject?a:G(a,t.itemValue),l=G(a,t.itemSelectable,!0);return{type:"item",value:e,selectable:l,raw:a}}function vt(t,a){const e=[];for(const l of a)e.push(mt(t,l));return e}function gt(t){return{items:h(()=>vt(t,t.items))}}const yt=(t,a,e)=>t==null||a==null?-1:t.toString().toLocaleLowerCase().indexOf(a.toString().toLocaleLowerCase()),pt=k({customFilter:Function,customKeyFilter:Object,filterKeys:[Array,String],filterMode:{type:String,default:"intersection"},noFilter:Boolean},"filter");function ht(t,a,e){var n;const l=[],r=(e==null?void 0:e.default)??yt,d=e!=null&&e.filterKeys?_(e.filterKeys):!1,f=Object.keys((e==null?void 0:e.customKeyFilter)??{}).length;if(!(t!=null&&t.length))return l;e:for(let u=0;u<t.length;u++){const[s,o=s]=_(t[u]),c={},m={};let g=-1;if(a&&!(e!=null&&e.noFilter)){if(typeof s=="object"){const i=d||Object.keys(o);for(const v of i){const I=G(o,v,o),P=(n=e==null?void 0:e.customKeyFilter)==null?void 0:n[v];if(g=P?P(I,a,s):r(I,a,s),g!==-1&&g!==!1)P?c[v]=g:m[v]=g;else if((e==null?void 0:e.filterMode)==="every")continue e}}else g=r(s,a,s),g!==-1&&g!==!1&&(m.title=g);const b=Object.keys(m).length,p=Object.keys(c).length;if(!b&&!p||(e==null?void 0:e.filterMode)==="union"&&p!==f&&!b||(e==null?void 0:e.filterMode)==="intersection"&&(p!==f||!b))continue}l.push({index:u,matches:{...m,...c}})}return l}function St(t,a,e,l){const r=A([]),d=A(new Map),f=h(()=>l!=null&&l.transform?x(a).map(u=>[u,l.transform(u)]):x(a));ue(()=>{const u=typeof e=="function"?e():x(e),s=typeof u!="string"&&typeof u!="number"?"":String(u),o=ht(f.value,s,{customKeyFilter:{...t.customKeyFilter,...x(l==null?void 0:l.customKeyFilter)},default:t.customFilter,filterKeys:t.filterKeys,filterMode:t.filterMode,noFilter:t.noFilter}),c=x(a),m=[],g=new Map;o.forEach(b=>{let{index:p,matches:i}=b;const v=c[p];m.push(v),g.set(v.value,i)}),r.value=m,d.value=g});function n(u){return d.value.get(u.value)}return{filteredItems:r,filteredMatches:d,getMatches:n}}const bt=k({search:String,loading:Boolean,...Be(),...ft(),...lt(),...ut(),...Ze({itemsPerPage:5}),...Re(),...We(),...pt(),...De()},"VDataIterator"),wt=_e()({name:"VDataIterator",props:bt(),emits:{"update:modelValue":t=>!0,"update:groupBy":t=>!0,"update:page":t=>!0,"update:itemsPerPage":t=>!0,"update:sortBy":t=>!0,"update:options":t=>!0,"update:expanded":t=>!0},setup(t,a){let{slots:e}=a;const l=V(t,"groupBy"),r=F(t,"search"),{items:d}=gt(t),{filteredItems:f}=St(t,d,r,{transform:M=>M.raw}),{sortBy:n,multiSort:u,mustSort:s}=ot(t),{page:o,itemsPerPage:c}=qe(t),{toggleSort:m}=ct({sortBy:n,multiSort:u,mustSort:s,page:o}),{sortByWithGroups:g,opened:b,extractRows:p,isGroupOpen:i,toggleGroup:v}=He({groupBy:l,sortBy:n}),{sortedItems:I}=it(t,f,g),{flatItems:P}=Qe(I,l,b),R=h(()=>P.value.length),{startIndex:$,stopIndex:U,pageCount:w,prevPage:W,nextPage:de,setItemsPerPage:fe,setPage:me}=et({page:o,itemsPerPage:c,itemsLength:R}),{paginatedItems:E}=tt({items:P,startIndex:$,stopIndex:U,itemsPerPage:c}),z=h(()=>p(E.value)),{isSelected:ve,select:ge,selectAll:ye,toggleSelect:pe}=nt(t,{allItems:d,currentPage:z}),{isExpanded:he,toggleExpand:Se}=Ue(t);Xe({page:o,itemsPerPage:c,sortBy:n,groupBy:l,search:r});const L=h(()=>({page:o.value,itemsPerPage:c.value,sortBy:n.value,pageCount:w.value,toggleSort:m,prevPage:W,nextPage:de,setPage:me,setItemsPerPage:fe,isSelected:ve,select:ge,selectAll:ye,toggleSelect:pe,isExpanded:he,toggleExpand:Se,isGroupOpen:i,toggleGroup:v,items:z.value,groupedItems:E.value}));return Ae(()=>y(t.tag,{class:["v-data-iterator",t.class],style:t.style},{default:()=>{var M,H,J,Q;return[(M=e.header)==null?void 0:M.call(e,L.value),E.value.length?(J=e.default)==null?void 0:J.call(e,L.value):(H=e["no-data"])==null?void 0:H.call(e),(Q=e.footer)==null?void 0:Q.call(e,L.value)]}})),{}}}),It={class:"text-subtitle-2"},Dt={__name:"Backup",setup(t){const{post:a,data:e,error:l}=X(),{post:r,data:d,error:f}=X(),n=A([]),u=A(!0);let s;Ce(()=>{c(),s=setInterval(()=>{c()},3e4)}),Me(()=>clearInterval(s));const o=async p=>{let i;console.log(g(p.raw)),g(p.raw)?i=!1:i=!0,await r("mount",{device:{...p.raw,mount:i}}),c()},c=()=>a("lsblk"),m=h(()=>!!l.value),g=p=>(Oe(p)&&(p=Ke(p)),Ie.get(p,"mountpoint",null)!==null),b=h(()=>e.value?e.value.result:[]);return(p,i)=>(K(),q(Pe,{rounded:"lg",class:"pt-6 pb-6 px-6 bg-black",width:"100%","min-height":"70vh",theme:"dark"},{default:S(()=>[y(Te,{modelValue:m.value,"onUpdate:modelValue":i[0]||(i[0]=v=>m.value=v),"multi-line":"",timeout:2e3,location:"top",color:"error"},{actions:S(()=>[]),default:S(()=>[B(D(x(l))+" ",1)]),_:1},8,["modelValue"]),y(re,{flat:"",class:"pt-6 pb-6 bg-black",theme:"dark",width:"100%","min-height":"70vh",rounded:"lg"},{default:S(()=>[y(ae,null,{default:S(()=>[B("List of usb-flash drives")]),_:1}),y(je,null,{default:S(()=>[y(Y),y(ee,{color:"seconary",variant:"tonal",onClick:i[1]||(i[1]=v=>c()),icon:"mdi-refresh"})]),_:1}),y(le,null,{default:S(()=>[y(wt,{modelValue:n.value,"onUpdate:modelValue":i[2]||(i[2]=v=>n.value=v),items:b.value,"item-value":"name","show-select":u.value,"select-strategy":"single","return-object":""},{default:S(({items:v,isExpanded:I,toggleExpand:P,select:R,toggleSelect:$,isSelected:U})=>[y(Ne,null,{default:S(()=>[(K(!0),Fe(Le,null,Ee(v,w=>(K(),q(Ge,{key:w.raw.name,cols:"12",sm:"12",md:"6"},{default:S(()=>[y(re,{rounded:"lg"},{default:S(()=>[y(ae,{class:"d-flex align-center"},{default:S(()=>[y(te,{color:"green",icon:"mdi-usb-flash-drive",start:"",size:"18"}),j("h4",null,[B(D(w.raw.name)+" ",1),j("span",It,"("+D(w.raw.uuid)+")",1)]),y(Y),y(ee,{onClick:W=>o(w),color:g(w.raw)?"warning":"white",variant:"plain"},{default:S(()=>[y(te,{size:"32"},{default:S(()=>[B(D(g(w.raw)?"mdi-eject":"mdi-play"),1)]),_:2},1024)]),_:2},1032,["onClick","color"])]),_:2},1024),y(le,null,{default:S(()=>[B(D(w.raw.label||"UNKNOWN-LABEL "),1)]),_:2},1024),y(be),j("div",null,[y(we,{density:"compact",lines:!1},{default:S(()=>[y(Z,{title:`Mountpoint: ${w.raw.mountpoint}`},null,8,["title"]),y(Z,{title:`Filesystem: ${w.raw.fstype}`},null,8,["title"])]),_:2},1024)])]),_:2},1024)]),_:2},1024))),128))]),_:2},1024)]),_:1},8,["modelValue","items","show-select"])]),_:1})]),_:1})]),_:1}))}};export{Dt as default};