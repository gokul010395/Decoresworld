/* Decoresworld: real-rate USD display and selected variations in WhatsApp enquiries */
(function () {
'use strict';
var rate=null, rateDate='',currency='INR', choices=[], activeProduct=null;
var moneyINR=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2});
var moneyUSD=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
function price(n){return currency==='USD' && rate ? moneyUSD.format(n*rate) : moneyINR.format(n)}
function messageFor(p,opts){
  var values=Object.entries(opts||{}).map(function(pair){return pair[0]+': '+pair[1]}).join('\n');
  return 'Hello Decoresworld! I am interested in this product:\n\n'+p.title+
  '\nCatalogue price: '+moneyINR.format(p.price)+(values?'\n'+values:'')+
  '\n\nPlease confirm the selected options, final price and international shipping.';
}
function refreshPrices(){
  try {
    if(typeof filtered==='function'){
      var arr=filtered().slice(0,limit);
      document.querySelectorAll('.product .productText .price').forEach(function(el,i){
        if(arr[i])el.textContent=price(arr[i].price);
      });
    }
    if(activeProduct){
      var el=document.querySelector('#detail .price');
      if(el)el.textContent=price(activeProduct.price);
    }
    var cartTotal=document.getElementById('carttotal');
    if(cartTotal && typeof bag!=='undefined' && bag.length){
      var total=bag.reduce(function(sum,id){var p=products.find(function(q){return q.id===id});return sum+(p?p.price:0)},0);
      cartTotal.textContent='Catalogue subtotal: '+price(total);
    }
    document.querySelectorAll('#cartlines .cartline').forEach(function(el,i){
      var key=[...new Set(bag)][i],p=products.find(function(q){return q.id===key});
      if(p){var n=bag.filter(function(id){return id===key}).length;var amt=el.querySelector('p');if(amt)amt.textContent=n+' × '+price(p.price)}
    });
  }catch(e){console.warn('Price display unavailable',e)}
}
var tools=document.querySelector('.tools');
if(tools){
  var select=document.createElement('select');
  select.id='dwCurrency';select.className='sort';
  select.setAttribute('aria-label','Display currency (indicative conversion)');
  select.innerHTML='<option value="INR">₹ INR</option><option value="USD">$ USD (estimate)</option>';
  tools.insertBefore(select,tools.querySelector('.sort'));
  var note=document.createElement('span');
  note.id='dwRateNote';note.className='dw-small';note.textContent='USD conversion loads from daily reference rates. Final quote confirmed on WhatsApp.';
  tools.appendChild(note);
  select.addEventListener('change',function(){
    if(this.value==='USD'&&!rate){this.value='INR';note.textContent='USD reference rate is temporarily unavailable; INR prices remain correct.';return}
    currency=this.value;
    note.textContent=currency==='USD'?'Approx. USD at daily reference rate ('+rateDate+'). Final quotation may differ.':'INR catalogue prices; shipping and options confirmed separately.';
    refreshPrices();
  });
  fetch('https://api.frankfurter.dev/v2/rate/INR/USD')
    .then(function(res){if(!res.ok)throw Error('Rate unavailable');return res.json()})
    .then(function(data){if(!Number.isFinite(Number(data.rate))||Number(data.rate)<=0)throw Error('Invalid rate');rate=Number(data.rate);rateDate=data.date||'latest';})
    .catch(function(){note.textContent='USD reference rate unavailable right now; INR prices are shown.'});
}
var originalRender=window.render;
if(typeof originalRender==='function')window.render=function(){var r=originalRender.apply(this,arguments);refreshPrices();return r};
var oldDetail=window.openDetail;
if(typeof oldDetail==='function')window.openDetail=function(id){
  oldDetail(id);
  activeProduct=products.find(function(p){return p.id===id})||null;
  var p=activeProduct,detail=document.getElementById('detail');if(!p||!detail)return;
  var optbox=document.createElement('div');optbox.className='dw-options';
  if(p.variations && p.variations.length){
    p.variations.forEach(function(v,i){
      var row=document.createElement('label');row.className='dw-option';
      row.appendChild(document.createTextNode(v.name+' '));
      var menu=document.createElement('select');menu.dataset.option=v.name;menu.required=true;
      var placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Choose '+v.name;menu.appendChild(placeholder);
      String(v.values||'').split(',').map(function(x){return x.trim()}).filter(Boolean).forEach(function(val){
        var o=document.createElement('option');o.value=val;o.textContent=val;menu.appendChild(o);
      });
      row.appendChild(menu);optbox.appendChild(row);
    });
    var button=detail.querySelector('button.button');
    if(button)button.insertAdjacentElement('beforebegin',optbox);
    if(button)button.onclick=function(){
      var missing=[...optbox.querySelectorAll('select')].find(function(s){return !s.value});
      if(missing){missing.focus();alert('Please choose '+missing.dataset.option+' before adding to your bag.');return}
      window.addToCart(id);closeOverlay('detailOverlay');window.openCart();
    };
  }
  function selected(){var o={};optbox.querySelectorAll('select').forEach(function(s){if(s.value)o[s.dataset.option]=s.value});return o}
  var buttonWA=detail.querySelector('a.dw-order');
  function updateWA(){
    if(!buttonWA)return;
    buttonWA.href='https://wa.me/917904378890?text='+encodeURIComponent(messageFor(p,selected()));
  }
  if(buttonWA){
    buttonWA.addEventListener('click',function(e){
      var missing=[...optbox.querySelectorAll('select')].find(function(s){return !s.value});
      if(missing){e.preventDefault();missing.focus();alert('Please choose '+missing.dataset.option+' first.')}
    });
    optbox.addEventListener('change',updateWA);updateWA();
  }
  refreshPrices();
};
var oldAdd=window.addToCart;
if(typeof oldAdd==='function')window.addToCart=function(id){
  var selected={};
  document.querySelectorAll('#detail .dw-options select').forEach(function(s){if(s.value)selected[s.dataset.option]=s.value});
  choices.push({id:id,options:selected});
  return oldAdd(id);
};
var oldRemove=window.removeItem;
if(typeof oldRemove==='function')window.removeItem=function(id){
 choices=choices.filter(function(entry){return entry.id!==id});
 return oldRemove(id);
};
function bagMessage(){
  var lines=bag.map(function(id,i){
    var p=products.find(function(q){return q.id===id});
    if(!p)return '';
    var entry=choices[i],o=entry&&entry.id===id?entry.options:{};
    var selected=Object.entries(o).map(function(pair){return '   '+pair[0]+': '+pair[1]}).join('\n');
    return (i+1)+'. '+p.title+'\n   '+moneyINR.format(p.price)+(selected?'\n'+selected:'');
  }).filter(Boolean);
  var total=bag.reduce(function(sum,id){var p=products.find(function(q){return q.id===id});return sum+(p?p.price:0)},0);
  return 'Hello Decoresworld! I would like to enquire about the following products:\n\n'+lines.join('\n\n')+
   '\n\nCatalogue subtotal: '+moneyINR.format(total)+' (excluding shipping).\nPlease confirm customization, availability, shipping and final quote.';
}
var oldCart=window.openCart;
if(typeof oldCart==='function')window.openCart=function(){
 oldCart();
 var drawer=document.querySelector('#cartOverlay .drawer');
 if(!drawer)return;
 drawer.querySelectorAll('.dw-selected-summary').forEach(function(node){node.remove()});
 if(bag.length){
  var summary=document.createElement('div');summary.className='dw-selected-summary';
  choices.forEach(function(ch,i){if(!Object.keys(ch.options).length)return;
    var p=document.createElement('p');p.textContent='Item '+(i+1)+' options: '+Object.entries(ch.options).map(function(o){return o[0]+': '+o[1]}).join(' | ');summary.appendChild(p);
  });
  var waBtn=drawer.querySelector('a.dw-cart-order');
  if(waBtn){waBtn.href='https://wa.me/917904378890?text='+encodeURIComponent(bagMessage());waBtn.insertAdjacentElement('beforebegin',summary)}
 }
 refreshPrices();
};
var originalCopy=window.copyEnquiry;
if(typeof originalCopy==='function')window.copyEnquiry=function(){
 if(!bag.length)return;
 var msg=bagMessage();
 if(navigator.clipboard && window.isSecureContext){
  navigator.clipboard.writeText(msg).then(function(){document.getElementById('copyok').textContent='Order enquiry copied with selected options!'}).catch(function(){if(typeof fallbackCopy==='function')fallbackCopy(msg)});
 } else if(typeof fallbackCopy==='function')fallbackCopy(msg);
};
var extras=document.createElement('style');
extras.textContent='.dw-options{display:flex;flex-direction:column;gap:12px;padding:13px 0}.dw-option{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700;color:#173028}.dw-option select{border:1px solid #c4cec5;background:#fffdf9;padding:12px;color:#173028;max-width:320px}.dw-selected-summary{padding:10px 0 15px;font-size:12px;color:#4d6355;line-height:1.5}.dw-selected-summary p{margin:6px 0}#dwRateNote{max-width:230px;display:inline-block}';
document.head.appendChild(extras);
if(new URLSearchParams(location.search).has('product')){
 var id=Number(new URLSearchParams(location.search).get('product'));
 if(Number.isInteger(id)&&id>0&&products.some(function(p){return p.id===id})){
  setTimeout(function(){window.openDetail(id)},300);
 }
}
})();