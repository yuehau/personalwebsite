(function(){
  var WA='https://wa.me/60147058125?text=';
  function wa(t){return WA+encodeURIComponent(t);}
  var waBtn='<a class="wa-cta" target="_blank" rel="noopener" href="'+wa('Hi Yue Hau, I have a question about Allianz insurance.')+'">💬 Chat with me on WhatsApp</a>';
  var KB=[
   {k:['price','cost','how much','premium','afford','expensive','cheap','budget','rm','monthly','fee','rate'],
    a:'Great question! Premiums depend on your age, health, the plan type and how much coverage you want. As a rough guide: personal accident plans can start around <b>RM30–50/month</b>, while comprehensive medical &amp; life plans usually run <b>RM100–RM400+/month</b>. I always tailor it to your budget — let me prepare a personalised quote.',
    c:['What plans do you offer?','Is there a free consultation?']},
   {k:['plan','product','offer','types','cover','coverage','what do you','options','protection'],
    a:'I help you with five core areas of protection:<br>🛡️ <b>Life</b> — income protection for your family<br>🏥 <b>Medical</b> — hospital &amp; surgical bills covered<br>💰 <b>Savings</b> — for education, retirement &amp; goals<br>❤️ <b>Critical Illness</b> — lump-sum payout for serious illness<br>🚑 <b>Personal Accident</b> — protection from injuries.',
    c:['How much does it cost?','Which plan is best for me?']},
   {k:['medical','hospital','health','card','surgery','clinic','ward','admission','hospitalisation','hospitalization'],
    a:'My medical plans give you a <b>medical card</b> so you can get admitted to hospital and have your bills handled — covering hospitalisation, surgery and treatment. Many come with high annual limits and cashless admission at panel hospitals.',
    c:['How do claims work?','How much does it cost?']},
   {k:['life','death','family','breadwinner','income','dependent','protect my family','passing'],
    a:'Life insurance ensures that if anything happens to you, your family receives a payout to replace your income, settle debts and keep their lifestyle secure. It\'s the foundation of a solid financial plan, especially if people depend on you.',
    c:['What about critical illness?','Book a free consultation']},
   {k:['saving','invest','retire','retirement','education','child','endowment','future','wealth','goal'],
    a:'My savings &amp; investment-linked plans help you grow money steadily for goals like your children\'s education or your retirement — while keeping a layer of protection. It\'s a disciplined way to build wealth over time.',
    c:['How much should I save?','Talk to me about it']},
   {k:['critical','illness','cancer','heart','stroke','serious','ci','36','diagnosis'],
    a:'Critical illness cover pays you a <b>lump sum</b> on diagnosis of conditions like cancer, heart attack or stroke — so you can focus on recovery instead of money worries. It covers a wide list of conditions.',
    c:['What does it cost?','Which plan is best for me?']},
   {k:['accident','pa','injury','personal accident','disability','fracture'],
    a:'Personal Accident cover protects you against accidental injury, disability or death — with payouts for hospitalisation, medical expenses and more. It\'s affordable and a smart add-on for everyone.',
    c:['How much is it?','Book a consultation']},
   {k:['claim','payout','reimburse','how to claim','claiming'],
    a:'Claims are simpler than most people think — and I personally guide you through every step. You notify me, we gather the documents (bills, reports, forms), and I help submit everything to Allianz so it\'s processed smoothly. You\'re never alone in the process.',
    c:['What documents do I need?','Talk to me']},
   {k:['who','you','about','agent','license','licensed','qualified','legit','scam','real','trust','genuine','experience'],
    a:'I\'m <b>Chin Yue Hau</b>, a licensed Financial Advisor with <b>Allianz Life Insurance Malaysia Berhad</b>, part of PIP Agency at SBS Team Sdn Bhd in Sunway SPK Damansara. Allianz is one of the world\'s largest and most trusted insurers, and I hold a 5.0★ Google rating from my clients.',
    c:['Where is your office?','Book a free consultation']},
   {k:['allianz','company','insurer','reliable','strong'],
    a:'Allianz is one of the <b>largest and most trusted insurance groups in the world</b>, operating in 70+ countries, and consistently ranked the #1 global insurance brand. In Malaysia, Allianz is known for strong claims payouts and financial stability.',
    c:['What plans do you offer?','Chat with me']},
   {k:['where','location','office','address','area','klang','valley','kl','pj','petaling','shah alam','subang','cheras','puchong','ampang','damansara','near','meet'],
    a:'My office is at <b>SBS Team Sdn Bhd (PIP Agency), 11 Jalan Daun Inai 21, Sunway SPK Damansara, 52200 KL</b>. I cover the <b>whole Klang Valley</b> — KL, PJ, Shah Alam, Subang, Cheras, Puchong, Klang, Ampang &amp; Damansara — and I also do online consultations by WhatsApp or video call.',
    c:['Book an appointment','How do I get started?']},
   {k:['start','begin','sign up','buy','apply','quote','consultation','free','appointment','book','get started','how do i','next step'],
    a:'Getting started is easy and there\'s <b>no obligation</b>:<br>1️⃣ Message me on WhatsApp<br>2️⃣ We have a quick chat about your needs &amp; budget<br>3️⃣ I prepare a tailored plan and guide you through it.<br>The first consultation is completely <b>free</b>.',
    c:['Which plan is best for me?','How much does it cost?']},
   {k:['document','ic','mykad','need','require','requirement','paperwork'],
    a:'To get started you usually just need your <b>IC/MyKad</b> and some basic details about your health and budget. I\'ll let you know exactly what\'s needed for your specific plan — nothing complicated.',
    c:['Book a free consultation','What plans do you offer?']},
   {k:['pay','payment','auto debit','credit card','method','installment','deduct'],
    a:'Premiums can be paid <b>monthly, quarterly, half-yearly or yearly</b>, via auto-debit, credit/debit card or online banking — whatever is most convenient for you.',
    c:['How much does it cost?','Talk to me']},
   {k:['best','recommend','suitable','which plan','for me','should i','advice','my situation'],
    a:'The best plan really depends on your age, family situation, budget and goals — that\'s exactly what I help you figure out. Tell me a bit about yourself and I\'ll recommend the right mix of protection for you.',
    c:['Book a free consultation']},
   {k:['hi','hello','hey','good morning','good evening','halo'],
    a:'Hi there! 👋 I\'m Yue Hau\'s assistant. I can answer quick questions about Allianz insurance plans, costs and how things work. What would you like to know?',
    c:['What plans do you offer?','How much does it cost?','Is there a free consultation?']},
   {k:['thank','thanks','great','okay','nice','awesome'],
    a:'You\'re very welcome! 😊 Whenever you\'re ready, just message me on WhatsApp and I\'ll help you personally.',
    c:['Book a free consultation']}
  ];
  var body=document.getElementById('chatBody'),chips=document.getElementById('chatChips'),
      form=document.getElementById('chatForm'),input=document.getElementById('chatInput'),
      chat=document.getElementById('chat'),launcher=document.getElementById('askLauncher'),started=false;
  function open(){chat.classList.add('open');launcher.style.display='none';if(!started){started=true;greet();}input.focus();}
  function close(){chat.classList.remove('open');launcher.style.display='flex';}
  launcher.addEventListener('click',open);
  document.getElementById('chatClose').addEventListener('click',close);
  function add(text,who){var d=document.createElement('div');d.className='msg '+who;d.innerHTML=text;body.appendChild(d);body.scrollTop=body.scrollHeight;return d;}
  function setChips(arr){chips.innerHTML='';(arr||[]).forEach(function(q){var b=document.createElement('button');b.className='chip-q';b.textContent=q;b.onclick=function(){ask(q);};chips.appendChild(b);});}
  function typing(){var d=document.createElement('div');d.className='msg bot typing';d.innerHTML='<span></span><span></span><span></span>';body.appendChild(d);body.scrollTop=body.scrollHeight;return d;}
  function greet(){add('Hi! 👋 I\'m <b>Yue Hau\'s assistant</b>. Ask me anything about Allianz protection — or tap a question below. For anything detailed, I\'ll connect you straight to Yue Hau on WhatsApp.','bot');setChips(['What plans do you offer?','How much does it cost?','How do claims work?','Is there a free consultation?']);}
  function match(q){
    var norm=q.toLowerCase().replace(/[^\w\s]/g,' '),toks={};
    norm.split(/\s+/).forEach(function(t){if(t)toks[t]=1;});
    var best=null,bestScore=0;
    KB.forEach(function(e){var sc=0;e.k.forEach(function(kw){
      var hit = kw.indexOf(' ')>-1 ? norm.indexOf(kw)>-1 : kw.length>=4 ? norm.indexOf(kw)>-1 : toks[kw]===1;
      if(hit)sc+=kw.length;});
      if(sc>bestScore){bestScore=sc;best=e;}});
    return bestScore>0?best:null;
  }
  function ask(q){
    add(q,'me');setChips([]);var t=typing();
    setTimeout(function(){t.remove();var e=match(q);
      if(e){add(e.a+'<br>'+waBtn,'bot');setChips(e.c);}
      else{add('That\'s a great question — I want to make sure you get an accurate answer, so let me connect you directly with Yue Hau. He replies quickly on WhatsApp! 👇<br>'+waBtn,'bot');setChips(['What plans do you offer?','How much does it cost?']);}
    },650);
  }
  form.addEventListener('submit',function(ev){ev.preventDefault();var v=input.value.trim();if(!v)return;input.value='';ask(v);});
})();
