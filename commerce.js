/* DECORESWORLD — WhatsApp-only ordering (no online payment collection) */
(() => {
'use strict';
const PHONE = '917904378890';
const INR_PRICE = new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR'});
const wa = msg => 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
const greeting = 'Hello Decoresworld! I am visiting your website and would like to enquire about your handmade wooden decor products.';
function link(label, message, cls) {
  const a=document.createElement('a');
  a.href=wa(message);a.target='_blank';a.rel='noopener noreferrer';
  a.className=cls;a.textContent=label;
  a.setAttribute('aria-label', label + ' – opens WhatsApp');return a;
}
const style=document.createElement('style');
style.textContent='.dw-toplink{font-size:12px;font-weight:700;letter-spacing:.04em}.dw-floating{position:fixed;right:22px;bottom:22px;z-index:40;background:#1b7550;color:#fff;padding:14px 19px;border-radius:35px;text-decoration:none;font-size:13px;font-weight:700;box-shadow:0 9px 24px #153b2a44}.dw-floating:hover{background:#115f3c;color:#fff}.dw-order{display:block;background:#1b7550;color:#fff;border:1px solid #1b7550;padding:14px 16px;text-align:center;font-weight:700;font-size:12px;letter-spacing:.04em;margin-top:12px;text-decoration:none;cursor:pointer}.dw-order:hover{background:#115f3c;color:#fff}.dw-help{background:#f2f0e9;padding:40px 7%;text-align:center;color:#193c2f}.dw-help h2{font-family:Playfair Display,serif;font-weight:500;font-size:clamp(25px,3vw,38px);margin:12px auto}.dw-help p{max-width:700px;margin:12px auto;line-height:1.7;color:#52665b}.dw-help .dw-order{max-width:320px;margin:22px auto 8px}.dw-small{color:#697b6d;font-size:12px;line-height:1.6}@media(max-width:700px){.dw-floating{right:12px;bottom:12px;padding:13px 16px}}';
document.head.appendChild(style);
const navLinks=document.querySelector('.navlinks');
if(navLinks) {
 const etsyNav=[...navLinks.querySelectorAll('a')].find(a=>a.href.includes('etsy.com'));
 if(etsyNav)etsyNav.remove();
 navLinks.appendChild(link('WHATSAPP ORDERS ↗',greeting,'dw-toplink'));
}
document.body.appendChild(link('✆  Order on WhatsApp',greeting,'dw-floating'));
const notice=document.querySelector('#cartOverlay .notice');
if(notice)notice.textContent='This is a WhatsApp order enquiry, not a paid checkout. Product availability, customization, international shipping and final price will be confirmed with you before payment. Adding to your bag does not place an order.';
const footContact=document.querySelector('.footgrid > div:last-child');
if(footContact){
 footContact.innerHTML='<b>WhatsApp Orders</b><p></p>';
 const p=footContact.querySelector('p');
 p.appendChild(link('WhatsApp: +91 79043 78890 ↗',greeting,''));
 p.appendChild(document.createElement('br'));
 p.appendChild(document.createTextNode('Handmade to order • Worldwide enquiries welcome'));
}
const footer=document.querySelector('footer.footer');
if(footer) {
 const section=document.createElement('section');
 section.className='dw-help';section.id='contact';
 section.innerHTML='<div class="eyebrow">HANDMADE • PERSONALISED • WORLDWIDE</div><h2>Order with us on WhatsApp</h2><p>Browse our collection, add your favourites to the enquiry bag and send us your choices. We will confirm sizing, craftsmanship, availability and delivery costs before you decide to order.</p>';
 section.appendChild(link('CHAT WITH DECORESWORLD ↗',greeting,'dw-order'));
 const note=document.createElement('p');note.className='dw-small';
 note.textContent='WhatsApp enquiries only. Online payments are not enabled on this website yet.';
 section.appendChild(note);footer.parentNode.insertBefore(section,footer);
}
const originalDetail=window.openDetail;
if(typeof originalDetail==='function')window.openDetail=function(id){
 originalDetail(id);
 const p=products.find(x=>x.id===id);
 const panel=document.querySelector('#detail > div:last-child');
 const addButton=panel?.querySelector('button.button');
 if(!p||!addButton)return;
 const msg='Hello Decoresworld! I am interested in this product:\n\n'+p.title+'\nCatalogue price: '+INR_PRICE.format(p.price)+'\n\nPlease confirm available size/options, order price and delivery to my country.';
 addButton.insertAdjacentElement('afterend',link('ORDER THIS ITEM ON WHATSAPP ↗',msg,'dw-order'));
};
function bagMessage(){
 const ids=[...new Set(bag)];let sum=0;
 const lines=ids.map((id,i)=>{
  const p=products.find(x=>x.id===id);if(!p)return '';
  const qty=bag.filter(x=>x===id).length;sum+=p.price*qty;
  return (i+1)+'. '+p.title+'\n   Qty: '+qty+' × '+INR_PRICE.format(p.price);
 }).filter(Boolean);
 return 'Hello Decoresworld! I would like to enquire about these items from your website:\n\n'+lines.join('\n\n')+'\n\nCatalogue subtotal: '+INR_PRICE.format(sum)+' (shipping not included).\nPlease confirm options, availability, shipping and final quotation. Thank you!';
}
const originalCart=window.openCart;
if(typeof originalCart==='function')window.openCart=function(){
 originalCart();
 const drawer=document.querySelector('#cartOverlay .drawer');
 const copy=drawer?.querySelector('button[onclick="copyEnquiry()"]');
 drawer?.querySelectorAll('.dw-cart-order').forEach(el=>el.remove());
 if(!copy||!bag.length)return;
 const button=link('SEND YOUR ORDER VIA WHATSAPP ↗',bagMessage(),'dw-order dw-cart-order');
 copy.insertAdjacentElement('afterend',button);
 const note=document.createElement('p');note.className='dw-small dw-cart-order';
 note.textContent='Enquiry only: no charge now. International shipping and final pricing will be confirmed through WhatsApp.';
 button.insertAdjacentElement('afterend',note);
};
})();
