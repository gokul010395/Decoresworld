/* Decoresworld installable Android/iPhone web app — WhatsApp orders only */
(()=>{
'use strict';
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}),{once:true});
}
if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||/\bwv\b|DecoresworldAndroidApp\//i.test(navigator.userAgent))return;
const css=document.createElement('style');
css.textContent='.dw-app-install{position:fixed;bottom:18px;left:16px;z-index:40;display:flex;align-items:center;gap:7px;padding:13px 17px;border:1px solid #b58f56;border-radius:30px;color:#173028;background:#fffaf0;box-shadow:0 8px 25px rgba(14,42,32,.18);font:700 12px/1.3 Arial,sans-serif;cursor:pointer;letter-spacing:.3px}.dw-app-install:hover{background:#f1e8d5}.dw-app-panel{position:fixed;z-index:80;inset:0;background:rgba(7,25,19,.48);display:flex;align-items:center;justify-content:center;padding:20px}.dw-app-panel-inner{position:relative;background:#faf8f2;color:#173028;padding:28px 24px;max-width:410px;width:100%;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.2);font:15px/1.7 Arial,sans-serif}.dw-app-panel h2{font:400 28px/1.2 Georgia,serif;margin:0 20px 14px 0}.dw-app-close{position:absolute;top:9px;right:10px;padding:6px 12px;border:0;background:none;font-size:26px;cursor:pointer;color:#173028}.dw-app-panel p{margin:0 0 11px}@media(min-width:900px){.dw-app-install{bottom:22px;left:22px}}';
document.head.appendChild(css);
const button=document.createElement('button');
button.className='dw-app-install';button.type='button';button.textContent='＋ INSTALL APP';button.setAttribute('aria-label','Install Decoresworld mobile app');document.body.appendChild(button);
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});
window.addEventListener('appinstalled',()=>{button.remove();deferred=null;});
const isIos=/iPad|iPhone|iPod/.test(navigator.userAgent);
function instructions(){
 const overlay=document.createElement('div');overlay.className='dw-app-panel';
 const box=document.createElement('div');box.className='dw-app-panel-inner';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Install instructions');
 const close=document.createElement('button');close.className='dw-app-close';close.type='button';close.textContent='×';close.setAttribute('aria-label','Close');close.onclick=()=>overlay.remove();
 const h=document.createElement('h2');h.textContent='Install Decoresworld';
 const p=document.createElement('p');p.textContent=isIos?'On iPhone: open this website in Safari, tap Share, then choose Add to Home Screen.':'On Android: open this website in Chrome, tap the three-dot menu, then choose Install app or Add to Home screen.';
 const note=document.createElement('p');note.textContent='Your 304 products and WhatsApp order enquiry will be available inside the app. Product photos and WhatsApp need internet access.';
 box.append(close,h,p,note);overlay.appendChild(box);overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});document.body.appendChild(overlay);close.focus();
}
button.onclick=async()=>{
 if(deferred){const p=deferred;deferred=null;try{await p.prompt();const c=await p.userChoice;if(c?.outcome==='accepted'){button.remove();return;}}catch(e){}}
 instructions();
};
})();
