#!/usr/bin/env node
const { spawn } = require('child_process')

const APP_URL = process.env.APP_URL || 'http://localhost:1010'

async function wait(ms){ return new Promise(r=>setTimeout(r,ms)) }
async function waitForReady(url, timeoutMs=60_000){
  const start=Date.now()
  while(Date.now()-start<timeoutMs){
    try{ const res=await fetch(url); if(res.ok) return true }catch{}
    await wait(1000)
  }
  return false
}

function run(cmd,args,opts={}){ return new Promise((resolve,reject)=>{
  const p=spawn(cmd,args,{stdio:'inherit',...opts});
  p.on('exit',code=>code===0?resolve():reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)))
  p.on('error',reject)
})}

async function main(){
  let devProc=null, started=false
  if(!(await waitForReady(APP_URL,2000))){
    devProc=spawn('npm',['run','dev'],{stdio:'inherit'})
    started=true
    if(!(await waitForReady(APP_URL,90_000))) throw new Error('Dev not ready')
  }
  try{
    console.log('\n[Demo] Running popup RPA with monitoring...')
    await run('npx',['playwright','test','tests/ui/popup-journey.spec.ts','--reporter=list'])
    console.log('\n[Demo] Passed on first run.')
  }catch(err){
    console.log('\n[Demo] Initial run failed, re-running with tracing...')
    await run('npx',['playwright','test','tests/ui/popup-journey.spec.ts','--reporter=list','--trace','on'])
    console.log('\n[Demo] Second run completed (see test-results for traces).')
  }finally{
    if(started && devProc) devProc.kill('SIGINT')
  }
}

main().catch(e=>{ console.error(e); process.exit(1) })

