/* Decoresworld WhatsApp enquiries and PayPal invoicing */
(() => {
  'use strict';
  const phone = '917904378890';
  const money = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'});
  const waUrl = message => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  const hello = 'Hello Decoresworld! I found your website and would like to ask about your handmade products and international shipping.';
  function makeLink(label,message,cls) {
    const a=document.createElement('a');
    a.href=waUrl(message); a.target='_blank'; a.rel='noopener noreferrer';
    a.className=cls; a.textContent=label;
    a.setAttribute('aria-label',label+' (opens WhatsApp)');
    return a;
  }
  function summary(paypal) {
    const ids=[...new Set(bag)];
    const lines=ids.map((id,i)=>{
      const p=products.find(x=>x.id===id);
      return p ? (i+1)+'. '+p.title+' | Qty: '+bag.filter(x=>x===id).length+' | '+money.format(p.price)+' each' : '';
    }).filter(Boolean).join('\n');
    const total=bag.reduce((sum,id)=>sum+(products.find(p=>p.id===id)?.price||0),0);
    return 'Hello Decoresworld, I would like to '+(paypal?'request a secure PayPal invoice for':'order')+' the following products:\n\n'+lines+'\n\nCatalogue subtotal: '+money.format(total)+' (shipping not included).\nPlease confirm options, availability, destination shipping and final price.'+(paypal?'\nAfter I approve the final quote, please send me a secure PayPal Business invoice for payment.':'')+'\nThank you!';
  }
  const style=document.createElement('style');
  style.textContent='.dw-whatsapp-top{display:inline-flex;padding:12px 15px;background:#24543e;color:white;font-size:12px;font-weight:700;white-space:nowrap}.dw-whatsapp-top:hover,.dw-wa:hover{background:#155c3b;color:white}.dw-floating{position:fixed;bottom:22px;right:22px;z-index:18;background:#1c754d;color:#fff;padding:15px 19px;border-radius:35px;font-size:13px;font-weight:700;box-shadow:0 8px 24px #132a2045}.dw-floating:hover{background:#135d3c;color:#fff}.dw-wa,.dw-invoice{display:flex;align-items:center;justify-content:center;margin-top:10px;padding:13px 16px;width:100%;font-size:12px;font-weight:700;text-align:center}.dw-wa{background:#1c754d;color:white;border:1px solid #1c754d}.dw-invoice{background:#fffdf9;border:1px solid #173028;color:#173028}.dw-invoice:hover{background:#f1eee8}.dw-payment{padding:54px 6%;background:#eceae2;text-align:center;color:#173028}.dw-payment h2{font:500 38px "Playfair Display",serif;margin:14px auto}.dw-payment p{max-width:720px;margin:16px auto;color:#526158;line-height:1.8}.dw-paynote{font-size:12px!important;line-height:1.7!important;color:#637067!important}@media(max-width:700px){.dw-whatsapp-top{display:none}.dw-floating{bottom:13px;right:12px;padding:13px 16px}.dw-payment h2{font-size:29px}}';
  document.head.appendChild(style);
  const nav=document.querySelector('.nav'),cartbutton=document.querySelector('.cartbutton');
  if(nav&&cartbutton) nav.insertBefore(makeLink('WHATSAPP ↗',hello,'dw-whatsapp-top'),cartbutton);
  document.body.appendChild(makeLink('✆  WhatsApp Order',hello,'dw-floating'));
  const footer=document.querySelector('.footer');
  if(footer){
    const info=document.createElement('section');info.className='dw-payment';info.id='payments';
    info.innerHTML='<span class="eyebrow">INTERNATIONAL ORDERS</span><h2>Secure PayPal Invoicing</h2><p>Choose your handmade pieces and send an enquiry via WhatsApp. We will confirm options, availability, international shipping and your final quote. Once you approve it, we can issue a secure PayPal Business invoice.</p><p class="dw-paynote">No card information is collected by this website. Requesting an invoice does not place or pay for an order.</p>';
    info.appendChild(makeLink('ENQUIRE ABOUT PAYPAL PAYMENT ↗','Hello Decoresworld, I would like to pay for my international order by secure PayPal Business invoice. Please confirm next steps.','button'));
    footer.parentNode.insertBefore(info,footer);
    const contact=document.querySelector('.footgrid > div:last-child p');
    if(contact){contact.textContent='';contact.appendChild(makeLink('WhatsApp: +91 79043 78890 ↗',hello,''));contact.appendChild(document.createElement('br'));contact.appendChild(document.createTextNode('International orders • PayPal invoices on request'));}
  }
  const originalDetail=window.openDetail;
  if(typeof originalDetail==='function') window.openDetail=function(id){
    originalDetail(id);
    const p=products.find(x=>x.id===id),panel=document.querySelector('#detail > div:last-child');
    const button=panel?.querySelector('button.button');
    if(!p||!button) return;
    const msg='Hello Decoresworld! I would like to order:\n'+p.title+'\nCatalogue price: '+money.format(p.price)+'\nPlease confirm item options, stock and shipping cost.';
    button.insertAdjacentElement('afterend',makeLink('ORDER THIS PRODUCT ON WHATSAPP ↗',msg,'dw-wa'));
  };
  const originalCart=window.openCart;
  if(typeof originalCart==='function') window.openCart=function(){
    originalCart();
    const drawer=document.querySelector('#cartOverlay .drawer'),copy=drawer?.querySelector('button[onclick="copyEnquiry()"]');
    if(!copy||!bag.length) return;
    drawer.querySelectorAll('.dw-newaction').forEach(el=>el.remove());
    const order=makeLink('SEND ORDER VIA WHATSAPP ↗',summary(false),'dw-wa dw-newaction');
    copy.insertAdjacentElement('afterend',order);
    const invoice=makeLink('REQUEST PAYPAL INVOICE ↗',summary(true),'dw-invoice dw-newaction');
    order.insertAdjacentElement('afterend',invoice);
    const note=document.createElement('p');note.className='dw-paynote dw-newaction';note.textContent='PayPal payment is available after we confirm the order and send you a secure invoice. Catalogue totals exclude international shipping and custom options.';
    invoice.insertAdjacentElement('afterend',note);
  };
})();