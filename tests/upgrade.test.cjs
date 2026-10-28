const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function load(file,overrides={}){
 const source=fs.readFileSync(file,'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const module={exports:{}};
 vm.runInNewContext(compiled,{exports:module.exports,require:name=>overrides[name]||require(name),Date,Math,Set,Array,JSON});
 return module.exports;
}
function harness(){let state; const ReactStub={...React,useState:initial=>{state??=initial;return [state,next=>{state=typeof next==='function'?next(state):next;}];}};return load('src/components/shared/Pagination.tsx',{react:ReactStub}).usePagination;}
test('pagination visits remaining records without skipping or repeating',()=>{const usePage=harness();const data=Array.from({length:22},(_,i)=>i);let result=usePage(data,'all',12);assert.equal(result.items.length,12);result.setPage(2);result=usePage(data,'all',12);assert.equal(result.items[0],12);assert.equal(result.items.length,10);assert.equal(result.pages,2);});
test('changing search resets page and does not restore a stale page when clearing search',()=>{const usePage=harness();const data=Array.from({length:30},(_,i)=>i);let result=usePage(data,'all');result.setPage(3);result=usePage(data.slice(0,3),'filtered');assert.equal(result.page,1);result=usePage(data,'all');assert.equal(result.page,1);});
test('deletion clamps the last page and empty results remain navigable',()=>{const usePage=harness();let result=usePage(Array(20).fill(1),'all');result.setPage(3);result=usePage(Array(8).fill(1),'all');assert.equal(result.page,1);result=usePage([],'all');assert.equal(result.pages,1);assert.equal(result.items.length,0);});
test('page-size changes reset to page one',()=>{const usePage=harness();let result=usePage(Array(30).fill(1),'all');result.setPage(3);result.setSize(24);result=usePage(Array(30).fill(1),'all');assert.equal(result.page,1);assert.equal(result.items.length,24);});
const Charts=load('src/components/dashboard/RequestCharts.tsx').default;
test('charts show data-derived totals and every actual request status',()=>{const date=new Date().toISOString();const html=renderToStaticMarkup(React.createElement(Charts,{loading:false,error:false,items:[{status:'PENDING',createdAt:date,kind:'Rental'},{status:'PENDING',createdAt:date,kind:'Tour'},{status:'ACTIVE',createdAt:date,kind:'Rental'}]}));assert.match(html,/3 total/);assert.match(html,/pending/);assert.match(html,/active/);assert.match(html,/3 requests/);});
test('charts show explicit empty and failure states rather than invented totals',()=>{const empty=renderToStaticMarkup(React.createElement(Charts,{items:[],loading:false,error:false}));assert.match(empty,/No requests to chart/);const error=renderToStaticMarkup(React.createElement(Charts,{items:[],loading:false,error:true}));assert.match(error,/Charts are unavailable/);assert.doesNotMatch(error,/0 total/);});
test('theme boot defaults to original light and restores only an explicit dark preference',()=>{const layout=fs.readFileSync('src/app/layout.tsx','utf8');const script=layout.match(/__html: "([^"]+)"/)[1];for(const preference of [null,'light','dark']){let dark;vm.runInNewContext(script,{document:{documentElement:{classList:{toggle:(name,on)=>{assert.equal(name,'dark');dark=on;}}}},localStorage:{getItem:()=>preference}});assert.equal(dark,preference==='dark');}});
