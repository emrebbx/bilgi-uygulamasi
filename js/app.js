(() => {
  const { categories, subcategories, artSubcategories, historySubcategories, turkishHistoryPeriods, questions, flagQuestions, currencyQuestions, currencyCodeQuestions, codeCurrencyQuestions, artQuestions, ancientQuestions, turkishHistoryQuestions, quizLength } = AppData;
  const app = document.querySelector('#app');
  const KEY = 'bilgi-ustasi-progress-v1';

  const defaultProgress = { seenQuestions:[], correctQuestions:[], wrongQuestions:[], learnedQuestions:[], savedQuestions:[], sackHistory:[], sackStudyDays:{}, dungeonQuestions:[], dungeonQueue:[], dungeonCounts:{}, dungeonWrongCounts:{}, dungeonRescued:[], masteryCounts:{}, earnedBadges:[], knowledgePoints:0, scoreVersion:4, dailyLearning:null, dailyStreak:0, lastActivity:null, settings:{ sound:true, music:false, vibration:true, notifications:true } };
  const MASTERY_TARGET = 5;
  const StorageService = {
    getProgress() { try { const saved=JSON.parse(localStorage.getItem(KEY) || '{}'); const migrated={...structuredClone(defaultProgress),...saved,masteryCounts:saved.masteryCounts||{},sackHistory:saved.sackHistory||saved.savedQuestions||[],sackStudyDays:saved.sackStudyDays||{},dungeonQuestions:saved.dungeonQuestions||[],dungeonQueue:saved.dungeonQueue||[],dungeonCounts:saved.dungeonCounts||{},dungeonWrongCounts:saved.dungeonWrongCounts||{},dungeonRescued:saved.dungeonRescued||[],earnedBadges:saved.earnedBadges||[],settings:{...defaultProgress.settings,...(saved.settings||{})}}; if(Number(saved.scoreVersion||0)<4){migrated.knowledgePoints=0;migrated.scoreVersion=4;migrated.dailyLearning=null;} return migrated; } catch { return structuredClone(defaultProgress); } },
    saveProgress(progress) { localStorage.setItem(KEY, JSON.stringify(progress)); }
  };
  let progress = StorageService.getProgress();
  StorageService.saveProgress(progress);
  let quiz = null;
  let lastResult = null;
  let currentRandomFact = null;

  const unique = arr => [...new Set(arr)];
  const pointsForNextLevel = level => 50+(level-1)*25;
  const totalPointsForLevel = level => { let total=0; for(let current=1;current<level;current++) total+=pointsForNextLevel(current); return total; };
  const titleForLevel = level => level>=50?'Bilgi Ustası':level>=35?'Bilge':level>=20?'Bilgi Avcısı':level>=10?'Araştırmacı':level>=5?'Kaşif':'Meraklı';
  function levelState(points=progress.knowledgePoints) { let level=1,remaining=Math.max(0,points); while(remaining>=pointsForNextLevel(level)){remaining-=pointsForNextLevel(level);level++;} const needed=pointsForNextLevel(level); const title=level>=50?'Bilgi Ustası':level>=35?'Bilge':level>=20?'Bilgi Avcısı':level>=10?'Araştırmacı':level>=5?'Kaşif':'Meraklı'; return {level,title,current:remaining,needed,percent:(remaining/needed)*100}; }
  const todayKey = () => new Date().toLocaleDateString('sv-SE');
  function ensureDailyLearning() { if(!progress.dailyLearning||progress.dailyLearning.date!==todayKey()) progress.dailyLearning={date:todayKey(),questionIds:[],categoryIds:[],awarded:[]}; return progress.dailyLearning; }
  function dailyLearningBonus(question) { const daily=ensureDailyLearning(); daily.questionIds=unique([...daily.questionIds,question.id]); daily.categoryIds=unique([...daily.categoryIds,question.categoryId]); let bonus=0; [[10,5],[25,10],[50,20]].forEach(([target,points])=>{const key=`questions-${target}`;if(daily.questionIds.length>=target&&!daily.awarded.includes(key)){daily.awarded.push(key);bonus+=points;}}); if(daily.categoryIds.length>=3&&!daily.awarded.includes('categories-3')){daily.awarded.push('categories-3');bonus+=5;} return bonus; }
  function placeInDungeonOrQueue(id) {
    if(progress.dungeonQuestions.includes(id)) return 'already-dungeon';
    if(progress.dungeonQueue.includes(id)) return 'already-queue';
    if(progress.dungeonQuestions.length<10){progress.dungeonQuestions.push(id);progress.dungeonCounts[id]=0;return 'dungeon-added';}
    if(progress.dungeonQueue.length<5){progress.dungeonQueue.push(id);return 'queue-added';}
    return 'full';
  }
  const escape = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const iconButton = (icon,label,action) => `<button class="icon-btn" data-action="${action}" aria-label="${label}">${icon}</button>`;
  const sackIcon = active => `<svg class="quiz-sack-icon ${active?'active':''}" viewBox="0 0 48 48" aria-hidden="true"><path class="sack-tie" d="M17 10c3 2 11 2 14 0l-3 8H20z"/><path class="sack-body" d="M19 17c-6 5-10 12-9 20 1 5 6 7 14 7s13-2 14-7c1-8-3-15-9-20"/><path class="sack-fold" d="M14 30c5 2 15 2 20 0"/><path class="sack-star" d="m24 23 1.6 3.2 3.5.5-2.5 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.5-2.5 3.5-.5z"/></svg>`;
  const topbar = (title, back='home', right='') => `<header class="topbar">${iconButton('←','Geri',`back:${back}`)}<div class="topbar-title">${title}</div>${right || '<span style="width:44px"></span>'}</header>`;
  const nav = active => `<nav class="bottom-nav" aria-label="Ana navigasyon">
    ${navItem('home','⌂','Ana Sayfa',active)}${navItem('categories','▦','Kategoriler',active)}${navItem('quick','🧠','Hızlı Test',active,true)}${navItem('progress','⌁','İlerlemem',active)}${navItem('more','•••','Diğer',active)}
  </nav>`;
  function navItem(route,icon,label,active,center=false) { const locked=route==='quick'&&progress.wrongQuestions.length<5; return `<button class="nav-item ${center?'center ':''}${locked?'feature-locked ':''}${active===route?'active':''}" data-route="${route}" aria-label="${locked?'Hızlı Test kilitli':label}"><span class="nav-icon">${icon}${locked?'<i class="nav-mini-lock">⌁</i>':''}</span><span>${locked?'Yakında':label}</span></button>`; }
  function render(content, { active='home', showNav=true, pageClass='' }={}) { app.innerHTML = `<main class="app-shell ${showNav?'':'no-nav'}"><div class="page ${pageClass}">${content}</div></main>${showNav?nav(active):''}`; }
  function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),1800); }
  function showPointBurst(label,points) { const old=document.querySelector('.point-popover'); if(old) old.remove(); const el=document.createElement('div'); el.className='point-popover'; el.innerHTML=`<span>★</span><div><small>${escape(label)}</small><strong>+${points} PUAN</strong></div>`; document.body.appendChild(el); requestAnimationFrame(()=>el.classList.add('show')); setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),250);},2400); }
  const metric = id => progress[id].length;
  const topicPrefix = topic => topic === 'painters'
    ? 'art_painters_'
    : topic === 'ancient-civilizations' || topic === 'turkish-history'
      ? `history_${topic}_`
      : topic === 'capital-countries'
        ? 'world_capitals_reverse_'
        : `world_${topic}_`;
  const periodFromType = type => type.startsWith('turkish-history-') ? turkishHistoryPeriods.find(period=>type===`turkish-history-${period.id}`) : null;
  const matchesTopic = (questionId, topic) => topic === 'capitals'
    ? questionId.startsWith('world_capitals_') && !questionId.startsWith('world_capitals_reverse_')
    : periodFromType(topic)
      ? periodFromType(topic).questionIds.some(id=>questionId===`history_turkish-history_${id}`)
      : questionId.startsWith(topicPrefix(topic));
  const topicMetric = (id, topic) => progress[id].filter(questionId => matchesTopic(questionId,topic)).length;
  const categoryAssets = {
    world:'assets/images/ui/category-world-cartoon-v2.png',
    history:'assets/images/ui/category-history-cartoon.png',
    literature:'assets/images/ui/category-literature-cartoon-v2.png',
    science:'assets/images/ui/category-science-cartoon.png',
    art:'assets/images/ui/category-art-cartoon.png',
    cinema:'assets/images/ui/category-cinema-cartoon-v2.png',
    mythology:'assets/images/ui/category-mythology-cartoon-v2.png',
    sports:'assets/images/ui/category-sports-cartoon.png',
    music:'assets/images/ui/category-music-cartoon-v2.png',
    technology:'assets/images/ui/category-technology-cartoon-v2.png',
    human:'assets/images/ui/category-human-cartoon-v2.png',
    games:'assets/images/ui/category-games-cartoon-v2.png'
  };
  const categoryWordmarks = {
    world:'assets/images/ui/wordmark-world-colored-v4.png',
    history:'assets/images/ui/wordmark-history-cartoon.png',
    science:'assets/images/ui/wordmark-science-cartoon.png',
    art:'assets/images/ui/wordmark-art-colored-v4.png',
    literature:'assets/images/ui/wordmark-literature-cartoon.png',
    cinema:'assets/images/ui/wordmark-cinema-colored-v4.png',
    mythology:'assets/images/ui/wordmark-mythology-cartoon.png',
    sports:'assets/images/ui/wordmark-sports-cartoon.png',
    music:'assets/images/ui/wordmark-music-cartoon.png',
    technology:'assets/images/ui/wordmark-technology-colored-v4.png',
    human:'assets/images/ui/wordmark-human-cartoon.png',
    games:'assets/images/ui/wordmark-games-colored-v4.png'
  };
  const badgeDefinitions = [
    ['world','Dünya Gezgini'],['history','Tarih Uzmanı'],['art','Sanat Avcısı'],['literature','Kitap Kurdu'],
    ['science','Bilim İnsanı'],['cinema','Sinema Gurmesi'],['mythology','Efsane Avcısı'],['sports','Spor Hocası'],
    ['music','Nota Ustası'],['technology','Teknoloji Dehası'],['human','İnsan Bilimci'],['games','Oyun Bilgesi']
  ].map(([categoryId,title])=>({categoryId,title,image:categoryAssets[categoryId]})).concat([{categoryId:'sack',title:'Bilgi Arşivcisi',image:'assets/images/ui/quick-saved.png'}]);
  const badgeTiers=[{id:'bronze',name:'Bronz',learned:100,mastered:10,areas:3},{id:'silver',name:'Gümüş',learned:250,mastered:40,areas:5},{id:'gold',name:'Altın',learned:500,mastered:100,areas:8},{id:'master',name:'Usta',learned:1000,mastered:200,areas:10}];
  const sackTiers=[{id:'bronze',name:'Bilgi Toplayıcısı',learned:25,mastered:10,areas:1},{id:'silver',name:'Çuval Bekçisi',learned:75,mastered:40,areas:3},{id:'gold',name:'Bilgi Arşivcisi',learned:150,mastered:100,areas:5},{id:'master',name:'Hafıza Ustası',learned:300,mastered:200,areas:8}];
  const worldTopicAssets = {
    capitals:'assets/images/ui/topic-capitals.png',
    'capital-countries':'assets/images/ui/topic-capital-countries.png',
    flags:'assets/images/ui/topic-flags.png',
    currencies:'assets/images/ui/topic-currencies.png',
    'currency-codes':'assets/images/ui/topic-currencies.png',
    'code-currencies':'assets/images/ui/topic-currencies.png',
    languages:'assets/images/ui/topic-languages.png',
    mountains:'assets/images/ui/topic-mountains.png'
  };
  const allQuestions = [...questions, ...flagQuestions, ...currencyQuestions, ...currencyCodeQuestions, ...codeCurrencyQuestions, ...artQuestions, ...ancientQuestions, ...turkishHistoryQuestions];
  const TEST_SIZE = 30;
  const familiarWorldCodes = `us gb fr de it es tr ru cn jp ca mx br ar au in kr nl ch at gr pt be se no dk fi pl ua ie il eg sa ae ir iq il th id nz za ma cu cz hu ro bg rs hr is`.split(/\s+/);
  const developingWorldCodes = `cl co pe ve uy py bo ec pa cr gt do jm dz tn ly jo lb sy qa kw om pk bd lk np vn my sg ph kz uz az ge am mn ke et ng gh sn tz ug ao mz zw na bw mg sd rw cm ci cd cg`.split(/\s+/);
  const rareWorldCodes = `ad mc sm va li mt lu cy md me mk al ba xk si sk ee lv lt by bz gy sr gf bn bt mv tl kh la mm pg fj ws to tv vu sb nr ki pw fm mh st kn lc vc gd dm ag bs bb cv gm gn gw gq ga sz ls bi dj km mr mu sc sl lr tg bj bf ne td cf er ss so`.split(/\s+/);
  const worldCodeFromQuestion = question => question.flagCode || question.image?.match(/\/([a-z]{2})\.webp$/)?.[1] || '';
  const worldDifficultyRank = (question,index) => {
    const code=worldCodeFromQuestion(question), familiar=familiarWorldCodes.indexOf(code), developing=developingWorldCodes.indexOf(code), rare=rareWorldCodes.indexOf(code);
    if(familiar>=0) return familiar;
    if(developing>=0) return 200+developing;
    if(rare>=0) return 1000+rare;
    return 600+index;
  };
  const artFamiliarity = `art_painters_mona-lisa art_painters_last-supper art_painters_scream art_painters_sunflowers art_painters_great-wave art_painters_guernica art_painters_persistence-memory art_painters_birth-venus art_painters_kiss art_painters_water-lilies art_painters_night-watch art_painters_school-athens art_painters_american-gothic art_painters_las-meninas art_painters_liberty-leading art_painters_arnolfini art_painters_wheat-field art_painters_washington-crossing art_painters_garden-delights art_painters_aristotle-homer`.split(' ');
  const sourceForType = type => {
    const source = type === 'flags'
      ? flagQuestions
      : type === 'currencies'
        ? currencyQuestions
      : type === 'currency-codes'
        ? currencyCodeQuestions
      : type === 'code-currencies'
        ? codeCurrencyQuestions
      : type === 'ancient-civilizations'
        ? ancientQuestions
      : type === 'turkish-history'
        ? turkishHistoryQuestions
      : periodFromType(type)
        ? turkishHistoryQuestions.filter(question=>periodFromType(type).questionIds.some(id=>question.id===`history_turkish-history_${id}`))
      : type === 'painters'
        ? artQuestions
        : type === 'capital-countries'
          ? questions.filter(q=>q.direction==='capital-to-country')
          : questions.filter(q=>q.direction==='country-to-capital');
    if(type==='painters') return [...source].sort((a,b)=>artFamiliarity.indexOf(a.id)-artFamiliarity.indexOf(b.id));
    return source.map((question,index)=>({question,index})).sort((a,b)=>worldDifficultyRank(a.question,a.index)-worldDifficultyRank(b.question,b.index)).map(item=>item.question);
  };
  const testGroups = type => {
    const source=sourceForType(type), groups=[];
    for(let start=0; start<source.length; start+=TEST_SIZE) groups.push(source.slice(start,start+TEST_SIZE));
    return groups;
  };
  function testPicker(type) {
    return `<div class="section-head"><h2>Testler</h2><span class="muted">Her test en fazla 30 soru</span></div><section class="test-grid">${testGroups(type).map((items,index)=>{const learned=items.filter(q=>progress.learnedQuestions.includes(q.id)).length;const done=learned===items.length;return `<button class="test-card ${done?'completed':''}" data-action="start-test:${type}:${index}"><span class="test-number">${done?'✓':index+1}</span><span><strong>Test ${index+1}</strong><small>${items.length} soru · ${learned}/${items.length} öğrenildi</small></span><span class="chevron">›</span></button>`}).join('')}</section>`;
  }

  function home() {
    const activityOptions = {
      capitals:{ title:'Dünya', image:'assets/images/ui/world-hero-minimal.png', route:'category/world', description:'Ülkelerden başkentlere ilerleyerek bilgini geliştir.', learned:topicMetric('learnedQuestions','capitals'), unit:'başkent', showcaseClass:'' },
      'capital-countries':{ title:'Dünya', image:'assets/images/ui/world-hero-minimal.png', route:'category/world', description:'Başkentleri doğru ülkelerle eşleştir.', learned:topicMetric('learnedQuestions','capital-countries'), unit:'ülke', showcaseClass:'' },
      flags:{ title:'Dünya', image:'assets/images/ui/world-hero-minimal.png', route:'category/world', description:'Dünya bayraklarını görsel hafızanla keşfet.', learned:topicMetric('learnedQuestions','flags'), unit:'bayrak', showcaseClass:'' },
      currencies:{ title:'Dünya', image:'assets/images/ui/topic-currencies.png', route:'category/world', description:'Ülkelerin para birimlerini kolaydan zora öğren.', learned:topicMetric('learnedQuestions','currencies'), unit:'para birimi', showcaseClass:'' },
      'currency-codes':{ title:'Dünya', image:'assets/images/ui/topic-currencies.png', route:'category/world', description:'Para birimlerinin uluslararası kodlarını öğren.', learned:topicMetric('learnedQuestions','currency-codes'), unit:'kod', showcaseClass:'' },
      'code-currencies':{ title:'Dünya', image:'assets/images/ui/topic-currencies.png', route:'category/world', description:'Kodları doğru para birimleriyle eşleştir.', learned:topicMetric('learnedQuestions','code-currencies'), unit:'kod', showcaseClass:'' },
      'ancient-civilizations':{ title:'Tarih', image:'assets/images/ui/category-history-cartoon.png', route:'category/history', description:'İlk uygarlıkların dünyayı nasıl şekillendirdiğini keşfet.', learned:topicMetric('learnedQuestions','ancient-civilizations'), unit:'bilgi', showcaseClass:'' },
      'turkish-history':{ title:'Tarih', image:'assets/images/ui/category-history-cartoon.png', route:'category/history', description:'Türk tarihinin önemli dönemlerini ve dönüm noktalarını öğren.', learned:topicMetric('learnedQuestions','turkish-history'), unit:'bilgi', showcaseClass:'' },
      painters:{ title:'Sanat', image:'assets/images/ui/category-art-cartoon.png', route:'category/art', description:'Başyapıtları ve onları yaratan sanatçıları keşfet.', learned:topicMetric('learnedQuestions','painters'), unit:'eser', showcaseClass:'art-showcase' }
    };
    const hasActivity = Boolean(progress.lastActivity && activityOptions[progress.lastActivity.type]);
    const activity = hasActivity ? activityOptions[progress.lastActivity.type] : activityOptions.capitals;
    const featured = categories;
      const level=levelState(); render(`<div class="home-screen"><header class="home-header"><div class="header-profile" data-route="profile" role="button" tabindex="0"><div class="avatar">EU</div><div class="user-meta"><strong>Emre Uğurer</strong><button class="level-link" data-route="level-guide">Seviye ${level.level} · ${level.title}</button><div class="level-track"><i style="width:${level.percent}%"></i></div></div></div><div class="score-medal"><span>★</span><b>${progress.knowledgePoints}</b><small>Puan</small></div><div class="coin-pill"><span>●</span><b>120</b></div>${iconButton('●','Bildirimler','placeholder:Bildirimler')}</header>
      <section class="home-stage"><span class="stage-sticker">⚡ GÜNLÜK MACERA</span><span class="stage-star star-one">★</span><span class="stage-star star-two">✦</span><div class="brand-block"><h1 class="sr-only">Bilgi Ustası</h1><img class="brand-logo" src="assets/images/ui/logo-bilgi-ustasi-cartoon.png" alt="Bilgi Ustası"><div class="tagline">ÖĞREN <i></i> OYNA <i></i> KEŞFET</div></div><div class="world-showcase knowledge-showcase"><img src="assets/images/ui/knowledge-hero-minimal.png" alt="Dünya, bilim, sanat ve sinemayı temsil eden genel bilgi sahnesi"></div></section>
      <section class="hero-card quest-card ${activity.showcaseClass}"><img class="hero-mini" src="${activity.image}" alt=""><div class="hero-copy"><h2>${activity.title}</h2><p>${activity.description}</p><div class="continue-chip">⭐ ${activity.learned} ${activity.unit} öğrendin</div></div><button class="btn" data-route="${activity.route}">${hasActivity?'DEVAM':'BAŞLA'} <span>›</span></button></section>
      <button class="random-fact-feature" data-route="random-fact"><span class="random-fact-feature-icon"><img src="assets/images/ui/quick-daily-info.png" alt=""></span><span><small>HER DOKUNUŞTA YENİ BİR ŞEY</small><strong>Bir Bilgi Keşfet</strong><em>Dünya, tarih ve sanattan rastgele bilgi</em></span><b>KEŞFET ›</b></button>
      <div class="section-head playful-head home-shortcuts-head"><div><span>OYUNCU ÇANTASI</span><h2>Kısa yollar</h2></div></div><section class="quick-grid home-shortcuts">${[['assets/images/ui/quick-medals.png','Madalyalarım','Ödüllerin'],['assets/images/ui/quick-statistics.png','İstatistiklerim','Gelişimin'],['assets/images/ui/quick-missions.png','Görevlerim','Hedeflerin'],['assets/images/ui/quick-saved.png','Bilgi Çuvalım','Kalıcı tekrarların'],['assets/images/ui/quick-missions.png','Bilgi Zindanı','50 doğruda serbest']].map(([i,t,s])=>`<button class="quick-card" ${t==='Bilgi Çuvalım'?'data-route="bag"':t==='Bilgi Zindanı'?'data-route="dungeon"':t==='Madalyalarım'?'data-route="profile"':`data-action="placeholder:${t}"`}><span class="quick-icon"><img src="${i}" alt=""></span><span><strong>${t}</strong><small>${s}</small></span></button>`).join('')}</section>
      <div class="section-head playful-head"><div><span>KEŞİF HARİTASI</span><h2>Kategorini seç</h2></div><button class="text-link" data-route="categories">HEPSİ →</button></div><section class="category-grid featured-grid">${featured.map(categoryCard).join('')}</section>
      </div>`, {active:'home'});
  }
  function categoryCard(c) { const asset=categoryAssets[c.id], wordmark=categoryWordmarks[c.id]; return `<button class="category-card category-id-${c.id} ${c.active?'':'locked'}" ${c.active?`data-route="category/${c.id}"`:'data-action="locked"'} style="--tint:${c.tint}" aria-label="${c.name}">${c.active?'':`<span class="lock" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5.5" y="10" width="13" height="10" rx="3"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/></svg></span>`}${asset?`<img class="category-art" src="${asset}" alt="">`:`<span class="category-icon">${c.icon}</span>`}${wordmark?`<img class="category-wordmark" src="${wordmark}" alt="${c.name}">`:`<strong>${c.name}</strong>`}<small>${c.active?`${c.id==='art'?topicMetric('learnedQuestions','painters'):metric('learnedQuestions')} bilgi öğrendin`:'Yakında keşfedilebilir'}</small></button>`; }
  function categoriesPage() { render(`${topbar('Kategoriler','home')}<div class="eyebrow">Merak ettiğin yeri seç</div><h1>Yeni bir şey keşfet</h1><p class="muted">Bilgini tamamlamak için değil, her gün biraz daha büyütmek için buradasın.</p><section class="category-grid">${categories.map(categoryCard).join('')}</section>`, {active:'categories'}); }
  function worldPage() { render(`${topbar('Dünya','home')}<section class="world-hero"><img src="assets/images/ui/world-category-hero-v2.png" alt="Küre ve pusuladan oluşan Dünya keşif görseli"><div><div class="eyebrow">Dünyayı adım adım keşfet</div><h1>Dünya</h1><p>Başkentlerden zirvelere, gezegenimizin kültürünü ve coğrafyasını öğren.</p></div></section><div class="section-head"><h2>Dünya alanları</h2><span class="muted">${subcategories.length} alan</span></div><section class="sub-list">${subcategories.map(s=>`<button class="sub-card ${s.active?'':'locked'}" ${s.active?`data-route="subcategory/${s.id}"`:'data-action="locked"'}><span class="category-icon topic-art"><img src="${worldTopicAssets[s.id]}" alt=""></span><span class="sub-copy"><strong>${s.name}</strong><small>${s.active?`${topicMetric('learnedQuestions',s.id)} bilgi öğrendin`:'Yeni içerikler hazırlanıyor'}</small></span><span class="chevron">${s.active?'›':'🔒'}</span></button>`).join('')}</section>`, {active:'categories'}); }
  function artPage() { render(`${topbar('Sanat','home')}<section class="art-hero"><img src="assets/images/ui/category-art-cartoon.png" alt="Cartoon tarzda sanat paleti ve fırça"><div><div class="eyebrow">Renkleri ve fikirleri keşfet</div><h1>Sanat</h1><p>Başyapıtları, sanatçıları ve dönemleri öğren.</p></div></section><div class="section-head"><h2>Sanat alanları</h2><span class="muted">${artSubcategories.length} alan</span></div><section class="sub-list">${artSubcategories.map(s=>`<button class="sub-card ${s.active?'':'locked'}" ${s.active?`data-route="subcategory/${s.id}"`:'data-action="locked"'}><span class="category-icon art-topic-icon">${s.icon}</span><span class="sub-copy"><strong>${s.name}</strong><small>${s.active?`${topicMetric('learnedQuestions',s.id)} eser öğrendin`:'Yeni içerikler hazırlanıyor'}</small></span><span class="chevron">${s.active?'›':'🔒'}</span></button>`).join('')}</section>`, {active:'categories'}); }
  function historyPage() { render(`${topbar('Tarih','home')}<section class="history-hero"><img src="assets/images/ui/category-history-cartoon.png" alt="Tarih sütunu görseli"><div><div class="eyebrow">Geçmişin izlerini keşfet</div><h1>Tarih</h1><p>Uygarlıkları, dönüm noktalarını ve insanlığın ortak hafızasını öğren.</p></div></section><div class="section-head"><h2>Tarih alanları</h2><span class="muted">${historySubcategories.length} alan</span></div><section class="sub-list history-topic-list">${historySubcategories.map(s=>`<button class="sub-card ${s.active?'':'locked'}" ${s.active?`data-route="subcategory/${s.id}"`:'data-action="locked"'}><span class="category-icon history-topic-mark">${s.mark}</span><span class="sub-copy"><strong>${s.name}</strong><small>${s.active?`${topicMetric('learnedQuestions',s.id)} bilgi öğrendin`:'Yeni içerikler hazırlanıyor'}</small></span><span class="chevron">${s.active?'›':'🔒'}</span></button>`).join('')}</section>`, {active:'categories'}); }
  function historyTopicPage(type) { const ancient=type==='ancient-civilizations', source=sourceForType(type), title=ancient?'İlk Çağ Uygarlıkları':'Türk Tarihi'; render(`${topbar(title,'category/history')}<div class="eyebrow">Tarih · ${ancient?'Uygarlıkların doğuşu':'Bozkırdan Cumhuriyet’e'}</div><h1>${title}</h1><p class="muted">${ancient?'Mısır, Mezopotamya, Yunan, Roma, Pers ve Amerika uygarlıklarını kolaydan zora keşfet.':'Türk tarihini dönemlere ayrılmış bir öğrenme haritasıyla kronolojik olarak keşfet.'}</p><div class="intro-visual history-intro"><img src="assets/images/ui/category-history-cartoon.png" alt="Tarih kategorisi görseli"></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions',type)} / ${source.length}</strong></div><div class="stat-card"><span>${ancient?'Tekrar gereken':'Ana dönem'}</span><strong>${ancient?`${topicMetric('wrongQuestions',type)} soru`:`${turkishHistoryPeriods.length} bölüm`}</strong></div></section>${ancient?testPicker(type):turkishHistoryCurriculum()}`, {active:'categories'}); }
  function turkishHistoryCurriculum() {
    return `<div class="section-head"><h2>Türk Tarihi öğrenme haritası</h2><span class="muted">Kronolojik sıra</span></div><section class="turkish-history-map">${turkishHistoryPeriods.map(period=>{const type=`turkish-history-${period.id}`, count=sourceForType(type).length, learned=topicMetric('learnedQuestions',type);return `<article class="history-period-card ${count?'':'locked'}"><div class="history-period-head"><span class="history-period-mark">${period.mark}</span><div><h3>${period.title}</h3><small>${count?`${count} soru · ${learned}/${count} öğrenildi`:'Soru havuzu hazırlanıyor'}</small></div></div><ul>${period.topics.map(topic=>`<li>${topic}</li>`).join('')}</ul>${count?`<button class="btn history-period-start" data-route="subcategory/${type}">BÖLÜMÜ ÇALIŞ <span>›</span></button>`:'<span class="history-period-soon">YAKINDA</span>'}</article>`}).join('')}</section>`;
  }
  function readingInvite(type,period) { return `<section class="reading-invite"><div class="reading-invite-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z"/></svg></div><div class="reading-invite-copy"><span>TESTTEN ÖNCE</span><h2>Okumak İstersen</h2><p>${period.title} konu anlatımını kronolojik sırayla inceleyebilirsin.</p></div><button class="btn reading-invite-btn" data-route="reading/${type}">KONU ANLATIMINI AÇ <span>›</span></button></section>`; }
  function turkishHistoryPeriodPage(type) { const period=periodFromType(type), source=sourceForType(type); if(!period){Router.go('subcategory/turkish-history');return;} render(`${topbar(period.title,'subcategory/turkish-history')}<div class="eyebrow">Türk Tarihi · ${period.mark}. dönem</div><h1>${period.title}</h1><p class="muted">${period.topics.join(' · ')}</p>${readingInvite(type,period)}<section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions',type)} / ${source.length}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions',type)} soru</strong></div></section>${testPicker(type)}`, {active:'categories'}); }
  function historyReadingPage(type) { const period=periodFromType(type); if(!period){Router.go('subcategory/turkish-history');return;} render(`${topbar('Okumak İstersen',`subcategory/${type}`)}<div class="eyebrow">Türk Tarihi · Konu anlatımı</div><h1>${period.title}</h1><p class="muted">Bu alan teste başlamadan önce konuyu sakin bir akışta okuyabilmen için hazırlandı.</p><section class="reading-sheet"><header><span>OKUMA PARÇASI</span><h2>Metin eklemeye hazır</h2><p>Göndereceğin konu anlatımı aşağıdaki başlıklara ayrılarak burada gösterilecek.</p></header><div class="reading-outline">${period.topics.map((topic,index)=>`<div><span>${String(index+1).padStart(2,'0')}</span><strong>${topic}</strong></div>`).join('')}</div><div class="reading-placeholder"><i></i><i></i><i></i><p>Konu metni bekleniyor</p></div></section><button class="btn btn-primary btn-block reading-tests-btn" data-route="subcategory/${type}">TESTLERE GEÇ <span>›</span></button>`, {active:'categories'}); }
  function capitalsPage(type='capitals') { const reverse=type==='capital-countries'; const count=sourceForType(type).length; render(`${topbar(reverse?'Başkentten Ülkeye':'Ülkeden Başkente','category/world')}<div class="eyebrow">Dünya · 197 ülke · ${reverse?'Başkent → Ülke':'Ülke → Başkent'}</div><h1>${reverse?'Başkentten Ülkeye':'Ülkeden Başkente'}</h1><p class="muted">${reverse?'Verilen başkentin hangi ülkeye ait olduğunu bul.':'Verilen ülkenin başkentini bul.'} Özel ve tartışmalı durumlar açıklamalarda açıkça belirtilir.</p><div class="intro-visual capitals-intro"><div class="capitals-art"><img src="${reverse?'assets/images/ui/topic-capital-countries.png':'assets/images/ui/topic-capitals.png'}" alt="${reverse?'Başkentten ülkeye':'Ülkeden başkente'} görseli"></div></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions',type)} / ${count}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions',type)} soru</strong></div></section>${testPicker(type)}`, {active:'categories'}); }
  function flagsPage() { render(`${topbar('Bayraklar','category/world')}<div class="eyebrow">Dünya · Görsel hafıza</div><h1>Bayraklar</h1><p class="muted">197 ülke ve devletin bayrağını sabit test gruplarıyla görsel hafızana yerleştir.</p><div class="intro-visual flag-intro"><div class="flag-stack"><img src="assets/images/flags/tr.webp" alt="Türkiye bayrağı"><img src="assets/images/flags/jp.webp" alt="Japonya bayrağı"><img src="assets/images/flags/br.webp" alt="Brezilya bayrağı"></div></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions','flags')} / ${flagQuestions.length}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions','flags')} soru</strong></div></section>${testPicker('flags')}`, {active:'categories'}); }
  function currenciesHubPage() { const learned=topicMetric('learnedQuestions','currencies')+topicMetric('learnedQuestions','currency-codes')+topicMetric('learnedQuestions','code-currencies'); render(`${topbar('Para Birimleri','category/world')}<div class="eyebrow">Dünya · Para bilgisi</div><h1>Para Birimleri</h1><p class="muted">Önce öğrenmek istediğin yönü seç. Ülkeleri, para birimi adlarını ve uluslararası kodları ayrı ayrı çalışabilirsin.</p><div class="intro-visual currency-intro currency-code-intro"><img src="assets/images/ui/topic-currencies.png" alt="Altın para birimleri görseli"><strong>TRY · USD · EUR</strong></div><div class="section-head"><h2>Çalışma biçimi</h2><span class="muted">${learned} bilgi öğrendin</span></div><section class="sub-list currency-mode-list"><button class="sub-card" data-route="subcategory/country-currencies"><span class="category-icon topic-art"><img src="assets/images/ui/topic-currencies.png" alt=""></span><span class="sub-copy"><strong>Ülkeden Para Birimine</strong><small>197 ülke ve devlet</small></span><span class="chevron">›</span></button><button class="sub-card" data-route="subcategory/currency-codes"><span class="category-icon topic-art code-mark">ABC</span><span class="sub-copy"><strong>Para Biriminden Koda</strong><small>${currencyCodeQuestions.length} benzersiz para birimi</small></span><span class="chevron">›</span></button><button class="sub-card" data-route="subcategory/code-currencies"><span class="category-icon topic-art code-mark">TRY</span><span class="sub-copy"><strong>Koddan Para Birimine</strong><small>${codeCurrencyQuestions.length} benzersiz kod</small></span><span class="chevron">›</span></button></section>`, {active:'categories'}); }
  function currenciesPage() { render(`${topbar('Ülkeden Para Birimine','subcategory/currencies')}<div class="eyebrow">Dünya · Ülke → Para birimi</div><h1>Ülkeden Para Birimine</h1><p class="muted">197 ülke ve devletin para birimlerini, en bilinenlerden daha az bilinenlere ilerleyen sabit testlerle öğren.</p><div class="intro-visual currency-intro"><img src="assets/images/ui/topic-currencies.png" alt="Altın para birimleri görseli"></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions','currencies')} / ${currencyQuestions.length}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions','currencies')} soru</strong></div></section>${testPicker('currencies')}`, {active:'categories'}); }
  function currencyCodesPage(type) { const reverse=type==='code-currencies', source=sourceForType(type), title=reverse?'Koddan Para Birimine':'Para Biriminden Koda'; render(`${topbar(title,'subcategory/currencies')}<div class="eyebrow">Dünya · ${reverse?'Kod → Para birimi':'Para birimi → Kod'}</div><h1>${title}</h1><p class="muted">${reverse?'Verilen ISO 4217 kodunun hangi para birimine ait olduğunu bul.':'Verilen para biriminin üç harfli uluslararası kodunu bul.'} Testler en bilinen kodlardan başlayarak ilerler.</p><div class="intro-visual currency-intro currency-code-intro"><img src="assets/images/ui/topic-currencies.png" alt="Para birimi kodları görseli"><strong>TRY · USD · EUR</strong></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions',type)} / ${source.length}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions',type)} soru</strong></div></section>${testPicker(type)}`, {active:'categories'}); }
  function paintersPage() { render(`${topbar('Ressamlar & Eserleri','category/art')}<div class="eyebrow">Sanat · Başyapıtlar</div><h1>Ressamlar & Eserleri</h1><p class="muted">Klasik eserleri ve onları yaratan sanatçıları sabit test gruplarıyla keşfet.</p><div class="art-preview"><img src="assets/images/art/great-wave.jpg" alt="Kanagawa Açıklarında Büyük Dalga"><img src="assets/images/art/wheat-field-cypresses.jpg" alt="Servili Buğday Tarlası"><img src="assets/images/art/aristotle-homer.jpg" alt="Homeros Büstü ile Aristoteles"></div><section class="stat-row"><div class="stat-card"><span>Öğrendiklerin</span><strong>${topicMetric('learnedQuestions','painters')} / ${artQuestions.length}</strong></div><div class="stat-card"><span>Tekrar gereken</span><strong>${topicMetric('wrongQuestions','painters')} soru</strong></div></section>${testPicker('painters')}`, {active:'categories'}); }

  function shuffle(array) { return [...array].sort(()=>Math.random()-.5); }
  function interleave(left, right) {
    const mixed=[];
    for(let index=0; index<Math.max(left.length,right.length); index++) {
      if(left[index]) mixed.push(left[index]);
      if(right[index]) mixed.push(right[index]);
    }
    return mixed;
  }
  function questionOrigin(question) {
    const category={world:'Dünya',history:'Tarih',art:'Sanat'}[question.categoryId]||'Genel Bilgi';
    const topic={capitals:'Başkentler','capital-countries':'Başkentler',flags:'Bayraklar',currencies:'Para Birimleri','currency-codes':'Para Birimi Kodları','code-currencies':'Para Birimi Kodları',painters:'Ressamlar','ancient-civilizations':'İlk Çağ Uygarlıkları','turkish-history':'Türk Tarihi'}[question.subcategoryId]||'Genel';
    const period=question.periodId?turkishHistoryPeriods.find(item=>item.id===question.periodId)?.title:'';
    return `${category} · ${period||topic}`;
  }
  function mixedWrongQuestions() {
    const wrong=allQuestions.filter(question=>progress.wrongQuestions.includes(question.id));
    const groups=Object.values(wrong.reduce((map,question)=>{(map[question.categoryId]??=[]).push(question);return map;},{})).map(shuffle);
    const mixed=[];
    while(groups.some(group=>group.length)) groups.forEach(group=>{if(group.length)mixed.push(group.shift());});
    return mixed;
  }
  function quickTestPage() {
    const wrongCount=mixedWrongQuestions().length;
    if(wrongCount<5) {
      const remaining=5-wrongCount;
      render(`${topbar('Hızlı Test','home')}<section class="quick-test-locked"><div class="quick-lock-mark"><svg viewBox="0 0 24 24"><rect x="5.5" y="10" width="13" height="10" rx="3"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/></svg></div><div class="eyebrow">Biraz daha keşfet</div><h1>Hızlı Test yakında açılacak</h1><p>Önce normal testlerde birkaç soru çöz. Yanlış yaptığın sorular burada sana özel karışık bir tekrar turuna dönüşecek.</p><div class="quick-unlock-count"><strong>${wrongCount}</strong><span>/ 5 yanlış soru</span></div><div class="quick-unlock-track"><i style="width:${(wrongCount/5)*100}%"></i></div><small>${remaining} yanlış soru daha biriktiğinde <b>Kısa Tur</b> açılır.</small><button class="btn btn-primary btn-block" data-route="categories">KATEGORİLERİ KEŞFET</button></section>`, {active:'quick'});
      return;
    }
    const choices=[['Kısa Tur',5,'Hızlı bir tekrar'],['Tam Tur',10,'Dengeli bir çalışma'],['Uzun Tur',15,'Daha uzun tekrar']];
    render(`${topbar('Hızlı Test','home')}<div class="eyebrow">Yanlışlarından öğren</div><h1>Bugün kaç soruluk tur?</h1><p class="muted">Bütün kategorilerde yanlış yaptığın sorular karışık gelir. Seviye yalnızca soru sayısını değiştirir.</p><section class="quick-test-summary"><span>Tekrar havuzun</span><strong>${wrongCount}</strong><small>yanlış soru</small></section><section class="quick-test-choices">${choices.map(([name,count,description],index)=>`<button class="quick-test-choice quick-choice-${index+1} ${wrongCount<count?'disabled':''}" data-action="start-quick:${count}" ${wrongCount<count?'disabled':''}><span class="quick-choice-count">${count}</span><span><strong>${name}</strong><small>${description} · ${count} soru</small></span><i>›</i></button>`).join('')}</section>${wrongCount<5?'<p class="quick-test-hint">Hızlı Test açılması için en az 5 yanlış soru biriktirmen gerekiyor.</p>':'<p class="quick-test-hint">Doğru cevapladığın sorular yanlış havuzundan otomatik çıkar.</p>'}`, {active:'quick'});
  }
  function startQuickTest(size) {
    const pool=mixedWrongQuestions();
    if(pool.length<size){toast(`${size} soruluk tur için ${size-pool.length} yanlış soru daha gerekiyor.`);return;}
    quiz={type:'quick',testIndex:null,mode:'quick',items:pool.slice(0,size),index:0,correct:0,wrong:0,answers:[],answered:false,selected:null};
    Router.go('quiz/quick');
  }
  function startQuiz(type='capitals', onlyWrong=false, onlySaved=false, testIndex=null) {
    const source = sourceForType(type);
    const pool = onlyWrong
      ? source.filter(q=>progress.wrongQuestions.includes(q.id))
      : onlySaved
        ? source.filter(q=>progress.savedQuestions.includes(q.id))
        : source;
    if (!pool.length) { toast(onlySaved?'Bu bölümde çuvala eklenmiş soru yok.':'Tekrar bekleyen yanlışın yok. Harika!'); return; }
    progress.lastActivity = { type, testIndex, updatedAt:new Date().toISOString() };
    StorageService.saveProgress(progress);
    const unseen = pool.filter(q => !progress.seenQuestions.includes(q.id));
    const seen = pool.filter(q => progress.seenQuestions.includes(q.id));
    const fixedGroup = Number.isInteger(testIndex) ? testGroups(type)[testIndex] : null;
    const orderedPool = fixedGroup ? shuffle(fixedGroup) : (onlyWrong ? shuffle(pool) : [...shuffle(unseen), ...shuffle(seen)]);
    quiz = { type, testIndex, mode:onlySaved?'saved':onlyWrong?'wrong':'standard', items:fixedGroup ? orderedPool : orderedPool.slice(0, (onlyWrong||onlySaved) ? orderedPool.length : quizLength), index:0, correct:0, wrong:0, answers:[], answered:false, selected:null };
    Router.go(`quiz/${type}`);
  }
  function startBagTest(size='all') { const pool=shuffle(allQuestions.filter(q=>progress.savedQuestions.includes(q.id))); if(!pool.length){toast('Bilgi Çuvalın henüz boş.');return;} const count=size==='all'?pool.length:Math.min(Number(size),pool.length); quiz={type:'bag',testIndex:null,mode:'saved',items:pool.slice(0,count),index:0,correct:0,wrong:0,answers:[],answered:false,selected:null}; Router.go('quiz/bag'); }
  function promoteDungeonQueue() { if(progress.dungeonQuestions.length>=10||!progress.dungeonQueue.length) return null; const promoted=progress.dungeonQueue.shift(); progress.dungeonQuestions.push(promoted); progress.dungeonCounts[promoted]=progress.dungeonCounts[promoted]||0; return promoted; }
  function startDungeonTest() { const pool=shuffle(allQuestions.filter(q=>progress.dungeonQuestions.includes(q.id))); if(!pool.length){toast('Bilgi Zindanı henüz boş.');return;} quiz={type:'dungeon',testIndex:null,mode:'dungeon',items:pool,index:0,correct:0,wrong:0,answers:[],answered:false,selected:null}; Router.go('quiz/dungeon'); }
  function dungeonReleaseCard(question) { const firstRescue=!progress.dungeonRescued.includes(question.id); return `<section class="dungeon-release"><div class="dungeon-release-icon">⛓</div><div class="eyebrow">50 / 50 DOĞRU</div><h2>Bu bilgi artık serbest!</h2><p>${firstRescue?'Kalıcı öğrenme için tek seferlik <b>+25 Özümseme Bonusu</b> kazandın. ':''}Daha sonra tekrar çalışmak için Bilgi Çuvalı’na eklemek ister misin?</p><div><button class="btn btn-secondary" data-action="release-dungeon:free">SADECE SERBEST BIRAK</button><button class="btn btn-primary" data-action="release-dungeon:bag">ÇUVALA EKLE</button></div></section>`; }
  function dungeonFlashcardPage(question,total) { quiz.flashMode=true; const count=progress.dungeonCounts[question.id]||0, released=count>=50; const back='dungeon'; render(`${topbar('Bilgi Zindanı',back)}<div class="quiz-progress-head"><span>Flash kart · ${quiz.index+1}</span><span>${quiz.index+1} / ${total}</span></div><div class="progress-track"><div class="progress-fill dungeon-flash-progress" style="width:${Math.min(100,((count-25)/25)*100)}%"></div></div><section class="dungeon-phase"><span>II. AŞAMA</span><strong>${Math.min(count,50)} / 50 doğru</strong><small>Seçenek yok; cevabı kendi hafızandan bul.</small></section>${released?dungeonReleaseCard(question):`<section class="flashcard ${quiz.revealed?'revealed':''}"><div class="flashcard-face flashcard-front"><div class="eyebrow">CEVABI HATIRLA</div><h1>${escape(question.question)}</h1>${question.image?`<img src="${escape(question.image)}" alt="">`:''}</div>${quiz.revealed?`<div class="flashcard-face flashcard-back"><div class="eyebrow">DOĞRU CEVAP</div><h2>${escape(question.correctAnswer)}</h2><p>${escape(question.explanation)}</p></div>`:''}</section>${!quiz.revealed?'<button class="btn btn-primary btn-block flash-reveal" data-action="reveal-flashcard">CEVABI GÖSTER</button>':quiz.answered?`<div class="flashcard-result ${quiz.selected===question.correctAnswer?'known':'retry'}"><strong>${quiz.selected===question.correctAnswer?'Hafızandan bildin!':'Bu bilgi biraz daha tekrar istiyor.'}</strong></div><button class="btn btn-primary btn-block" data-action="next-question">${quiz.index===total-1?'SONUCU GÖR':'SONRAKİ'} →</button>`:'<div class="flashcard-actions"><button class="btn btn-secondary" data-action="flash-repeat">HATIRLAYAMADIM</button><button class="btn btn-primary" data-action="flash-known">BİLİYORDUM</button></div>'}`}`, {showNav:false,pageClass:'quiz-screen dungeon-flash-screen'}); }
  function quizPage() {
    if (!quiz) { Router.go('subcategory/capitals'); return; }
    const q=quiz.items[quiz.index], total=quiz.items.length, selected=quiz.selected;
    const options=q.options.map((option,i)=>{ const isCorrect=option===q.correctAnswer, isSelected=option===selected; let state=''; if(quiz.answered && isCorrect) state='correct'; else if(quiz.answered && isSelected) state='wrong'; return `<button class="answer ${state}" data-answer="${escape(option)}" ${quiz.answered?'disabled':''}><span class="answer-letter">${'ABCD'[i]}</span><span>${escape(option)}</span>${quiz.answered&&isCorrect?'<span style="margin-left:auto">✓</span>':''}</button>`; }).join('');
    const labels={flags:'Bayraklar',currencies:'Para Birimleri','currency-codes':'Para Biriminden Koda','code-currencies':'Koddan Para Birimine','ancient-civilizations':'İlk Çağ Uygarlıkları','turkish-history':'Türk Tarihi',painters:'Ressamlar & Eserleri',capitals:'Ülkeden Başkente','capital-countries':'Başkentten Ülkeye'};
    if(periodFromType(quiz.type)) labels[quiz.type]=periodFromType(quiz.type).title;
    const isVisual = Boolean(q.image);
    const masteryCount=progress.masteryCounts?.[q.id]||0;
    const dungeonCount=progress.dungeonCounts[q.id]||0, dungeonWrongCount=Math.min(5,progress.dungeonWrongCounts[q.id]||0);
    const inDungeon=progress.dungeonQuestions.includes(q.id), inDungeonQueue=progress.dungeonQueue.includes(q.id);
    const dungeonSlots=progress.dungeonQuestions.length, dungeonQueueSize=progress.dungeonQueue.length, dungeonFilling=dungeonSlots>=7;
    const dungeonCapacityMini=`<span class="dungeon-capacity-mini ${dungeonFilling?'warning':''}" aria-label="Zindan doluluk oranı ${dungeonSlots}/10, bekleme sırası ${dungeonQueueSize}/5"><span class="capacity-ring" style="--capacity:${dungeonSlots*10}%"><i>${dungeonSlots}</i></span><small>/10 · +${dungeonQueueSize}</small></span>`;
    const dungeonIcon=`<span class="dungeon-button-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path class="dungeon-stone" d="M8 42V21C8 11.6 15.2 4 24 4s16 7.6 16 17v21"/><path class="dungeon-door" d="M14 42V22c0-6.8 4.5-12 10-12s10 5.2 10 12v20"/><path class="dungeon-bars" d="M19 14v28M24 10v32M29 14v28"/><circle cx="24" cy="28" r="3.2"/></svg></span>`;
    const dungeonEventText=quiz.dungeonEvent==='dungeon-added'?'5. yanlış: Bu bilgi otomatik olarak zindana düştü.':quiz.dungeonEvent==='queue-added'?'5. yanlış: Zindan dolu olduğu için bilgi sıraya alındı.':quiz.dungeonEvent==='full'?'Zindan ve bekleme sırası dolu. Yer açıldığında yeniden değerlendirilecek.':'';
    const dungeonControl=quiz.mode==='dungeon'?`<div class="mastery-note dungeon-note"><span>Zindandan kurtulma</span><strong>${dungeonCount} / 50 doğru</strong></div>`:`<div class="dungeon-add dungeon-status ${inDungeon||inDungeonQueue?'active':''} ${dungeonFilling?'filling':''}">${dungeonCapacityMini}${dungeonIcon}<span class="dungeon-button-copy"><small>${inDungeon?'BİLGİ ZİNDANDA':inDungeonQueue?'BEKLEME SIRASINDA':'ZİNDAN ADAYI'}</small><strong>${inDungeon?'50 doğruyla özgürleşir':inDungeonQueue?`Sıradaki yeri: ${progress.dungeonQueue.indexOf(q.id)+1}`:`Yanlış sayacı ${dungeonWrongCount} / 5`}</strong><em>${dungeonEventText||(inDungeon?'Bu bilgi artık yalnızca çalışılarak kurtarılabilir.':inDungeonQueue?'Zindanda yer açılınca otomatik içeri alınır.':dungeonFilling?'Zindan doluyor! Bilgileri iyice öğren, pekiştir ve yer aç.':'Normal testlerde 5 kez yanlış yapılırsa otomatik zindana düşer.')}</em></span></div>`;
    const masteryIcon='<span class="mastery-card-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M15 16a10 10 0 0 1 18 0M34 14l-1 7-7-1"/><path d="M33 32a10 10 0 0 1-18 0M14 34l1-7 7 1"/><path d="M19 17c-5 3-5 12 1 14 1 5 7 6 10 2 6-1 7-9 3-12 1-6-6-9-10-5-1-1-3-1-4 1z"/><path d="M24 18v13M19 23h5M24 27h5"/></svg></span>';
    const masteryCard=selected===q.correctAnswer&&progress.wrongQuestions.includes(q.id)?`<div class="mastery-card">${masteryIcon}<span class="mastery-card-copy"><small>BİLGİYİ SAĞLAMLAŞTIR</small><strong>Pekiştirme ilerlemesi</strong><em>Yanlış havuzundan çıkması için ${MASTERY_TARGET-masteryCount} doğru daha.</em></span><span class="mastery-card-score"><b>${masteryCount}</b><small>/${MASTERY_TARGET}</small></span></div>`:'';
    const masteryNote=masteryCard+dungeonControl;
    const pointReward=quiz.pointAwards?.length?`<section class="point-reward"><span class="point-reward-star">★</span><div><small>PUAN KAZANDIN</small>${quiz.pointAwards.map(item=>`<strong>${escape(item.label)} <b>+${item.points}</b></strong>`).join('')}<em>Toplam puanın: ${progress.knowledgePoints}</em></div></section>`:'';
    const capitalTermNote=/anayasal başkent/i.test(q.question)?'<aside class="capital-term-note"><strong>Anayasal başkent ne demek?</strong><span>Ülkenin anayasasında başkent olarak tanımlanan şehirdir. Hükûmet ve parlamento bazen başka bir şehirde çalışabilir.</span></aside>':/fiilî (yönetim merkezi|başkent)/i.test(q.question)?'<aside class="capital-term-note"><strong>Fiilî merkez ne demek?</strong><span>Resmî veya anayasal unvanı olmasa da devlet yönetiminin gerçekte çalıştığı yerdir.</span></aside>':'';
    if(quiz.mode==='dungeon'&&dungeonCount>=25&&(quiz.flashMode||!quiz.answered||dungeonCount>25)){dungeonFlashcardPage(q,total);return;}
    const feedbackTitle = selected===q.correctAnswer
      ? quiz.mode==='saved' ? 'Doğru! Soru Bilgi Çuvalında kalmaya devam edecek.' : quiz.mode==='dungeon'?'Doğru! Zindandaki bir zincir daha kıldı.':masteryCount>=MASTERY_TARGET?'Bu bilgi artık sağlam!':'Doğru! Bilgini güçlendirdin.'
      : 'Birlikte öğrenelim.';
    render(`${topbar(Number.isInteger(quiz.testIndex)?`Test ${quiz.testIndex+1}`:quiz.type==='quick'?'Hızlı Test':quiz.mode==='saved'?'Bilgi Çuvalı':quiz.mode==='dungeon'?'Bilgi Zindanı':labels[quiz.type]||'Test',quiz.mode==='saved'?'bag':quiz.mode==='dungeon'?'dungeon':quiz.type==='quick'?'quick':`subcategory/${quiz.type}`,iconButton(sackIcon(progress.savedQuestions.includes(q.id)),'Bilgi Çuvalına ekle veya çıkar','bookmark'))}<div class="quiz-progress-head"><span>${quiz.mode==='saved'?'Çuval tekrarı':quiz.mode==='dungeon'?'Zindan tekrarı':quiz.type==='quick'?'Karışık tekrar':Number.isInteger(quiz.testIndex)?`Test ${quiz.testIndex+1} · Soru`:'Soru'} ${quiz.index+1}</span><span>${quiz.index+1} / ${total}</span></div><div class="progress-track"><div class="progress-fill" style="width:${((quiz.index+1)/total)*100}%"></div></div><section class="question-card ${isVisual?'flag-question-card':''}">${quiz.type==='quick'?`<div class="question-origin">${escape(questionOrigin(q))}</div>`:''}<div class="eyebrow">Doğru seçeneği bul</div><h1>${escape(q.question)}</h1>${capitalTermNote}${q.image?`<div class="flag-display art-question-image"><img src="${escape(q.image)}" alt="Soruda tanınması istenen görsel"></div>`:''}</section><section class="answer-list">${options}</section>${quiz.answered?`${pointReward}<div class="feedback"><strong>${feedbackTitle}</strong><br>${escape(q.explanation)}${masteryNote}</div><button class="btn btn-primary btn-block" data-action="next-question">${quiz.index===total-1?'SONUCU GÖR':'SONRAKİ'} →</button>`:''}`, {showNav:false,pageClass:'quiz-screen'});
  }
  function answer(value) {
    if (!quiz || quiz.answered) return;
    const q=quiz.items[quiz.index], correct=value===q.correctAnswer, wasSeen=progress.seenQuestions.includes(q.id), wasWrong=progress.wrongQuestions.includes(q.id), firstLearned=!progress.learnedQuestions.includes(q.id);
    quiz.answered=true; quiz.selected=value; quiz.pointAwards=[]; quiz[correct?'correct':'wrong']++;
    quiz.answers.push({id:q.id, correct, selected:value});
    progress.seenQuestions=unique([...progress.seenQuestions,q.id]);
    if(correct) {
      progress.correctQuestions=unique([...progress.correctQuestions,q.id]); progress.learnedQuestions=unique([...progress.learnedQuestions,q.id]);
      let masteredNow=false;
      if(wasWrong) {
        progress.masteryCounts[q.id]=(progress.masteryCounts[q.id]||0)+1;
        if(progress.masteryCounts[q.id]>=MASTERY_TARGET) { progress.wrongQuestions=progress.wrongQuestions.filter(id=>id!==q.id); masteredNow=true; }
      }
      if(quiz.mode==='dungeon') progress.dungeonCounts[q.id]=Math.min(50,(progress.dungeonCounts[q.id]||0)+1);
      else if(quiz.mode==='bag'||quiz.mode==='saved') progress.sackStudyDays[q.id]=unique([...(progress.sackStudyDays[q.id]||[]),todayKey()]);
      else {
        let earned=0;
        if(!wasSeen){earned+=2;quiz.pointAwards.push({label:'Yeni bilgi',points:2});}
        else if(wasWrong){earned+=1;quiz.pointAwards.push({label:'Pekiştirme doğrusu',points:1});}
        if(masteredNow){earned+=10;quiz.pointAwards.push({label:'5 doğru tamamlandı',points:10});}
        if(firstLearned&&wasWrong){const dailyBonus=dailyLearningBonus(q);if(dailyBonus){earned+=dailyBonus;quiz.pointAwards.push({label:'Günlük öğrenme bonusu',points:dailyBonus});}}
        progress.knowledgePoints+=earned;
      }
    } else {
      progress.wrongQuestions=unique([...progress.wrongQuestions,q.id]);
      progress.masteryCounts[q.id]=0;
      if(!['dungeon','bag','saved'].includes(quiz.mode)) {
        progress.dungeonWrongCounts[q.id]=(progress.dungeonWrongCounts[q.id]||0)+1;
        if(progress.dungeonWrongCounts[q.id]>=5) quiz.dungeonEvent=placeInDungeonOrQueue(q.id);
      }
    }
    updateEarnedBadges(); StorageService.saveProgress(progress); quizPage();
  }
  function nextQuestion() { if (quiz.index < quiz.items.length-1) { quiz.index++; quiz.answered=false; quiz.selected=null; quiz.revealed=false; quiz.flashMode=false; quiz.dungeonEvent=null; quiz.pointAwards=[]; quizPage(); } else { lastResult={...quiz}; quiz=null; Router.go('result'); } }
  function resultPage() { if(!lastResult){Router.go('home');return;} const wrongCount=lastResult.type==='quick'?progress.wrongQuestions.length:topicMetric('wrongQuestions',lastResult.type); const labels={quick:'Hızlı Test',flags:'Bayraklar',painters:'Ressamlar & Eserleri',capitals:'Ülkeden Başkente','capital-countries':'Başkentten Ülkeye'}; render(`${topbar('Test Sonucu','home')}<section class="result-hero"><div class="result-badge">✦</div><div class="eyebrow">${labels[lastResult.type]||'Bilgi'} tamamlandı</div><h1>Bilgini güçlendirdin</h1><p class="muted">Her cevap, yeni bir ayrıntıyı kalıcı hâle getirdiğin bir adım.</p><div class="score-line"><div><strong style="color:var(--color-success)">${lastResult.correct}</strong><span>doğru</span></div><div><strong style="color:var(--color-danger)">${lastResult.wrong}</strong><span>yanlış</span></div></div></section><section class="stat-row"><div class="stat-card"><span>Bugün</span><strong>${lastResult.correct} bilgi güçlendi</strong></div><div class="stat-card"><span>Tekrar bekleyen</span><strong>${wrongCount} soru</strong></div></section><div class="result-actions">${wrongCount?'<button class="btn btn-primary" data-action="retry-wrong">YANLIŞLARI TEKRARLA</button>':''}<button class="btn btn-secondary" data-action="new-test">YENİ TEST</button><button class="text-link" data-route="home">Ana sayfaya dön</button></div>`, {showNav:false}); }

  function badgeProgress(categoryId) {
    if(categoryId==='sack') { const history=progress.sackHistory||[], learned=history.length, mastered=history.filter(id=>(progress.sackStudyDays[id]||[]).length>=3).length, areas=new Set(allQuestions.filter(q=>history.includes(q.id)).map(q=>q.categoryId)).size, tiers=sackTiers; return badgeState(categoryId,learned,mastered,areas,tiers); }
    const pool=allQuestions.filter(question=>question.categoryId===categoryId), ids=new Set(pool.map(question=>question.id));
    const learned=progress.learnedQuestions.filter(id=>ids.has(id)).length;
    const mastered=Object.entries(progress.masteryCounts||{}).filter(([id,count])=>ids.has(id)&&count>=MASTERY_TARGET).length;
    const studiedQuestions=pool.filter(question=>progress.seenQuestions.includes(question.id));
    const areas=new Set(studiedQuestions.map(question=>question.periodId||question.subcategoryId).filter(Boolean)).size;
    return {...badgeState(categoryId,learned,mastered,areas,badgeTiers),total:pool.length};
  }
  function badgeState(categoryId,learned,mastered,areas,tiers) { const earned=tiers.filter(tier=>progress.earnedBadges.includes(`${categoryId}:${tier.id}`)); const next=tiers.find(tier=>!progress.earnedBadges.includes(`${categoryId}:${tier.id}`))||tiers.at(-1); return {learned,mastered,areas,tiers,next,highest:earned.at(-1),unlocked:earned.length>0}; }
  function updateEarnedBadges() { badgeDefinitions.forEach(badge=>{ const state=badgeProgress(badge.categoryId); state.tiers.forEach(tier=>{if(state.learned>=tier.learned&&state.mastered>=tier.mastered&&state.areas>=tier.areas) progress.earnedBadges=unique([...progress.earnedBadges,`${badge.categoryId}:${tier.id}`]);}); }); }
  function badgeShelf() { return `<section class="badge-shelf">${badgeDefinitions.map(badge=>{const state=badgeProgress(badge.categoryId),target=state.next;return `<button class="badge-tile ${state.unlocked?'unlocked':'locked'}" data-route="badge/${badge.categoryId}" aria-label="${badge.title}"><span class="badge-medallion"><img src="${badge.image}" alt=""></span><strong>${badge.title}</strong><small>${state.highest?state.highest.name:`${Math.min(state.learned,target.learned)} / ${target.learned} bilgi`}</small></button>`}).join('')}</section>`; }
  function profilePage() { updateEarnedBadges(); StorageService.saveProgress(progress); const won=badgeDefinitions.filter(badge=>badgeProgress(badge.categoryId).unlocked).length, level=levelState(); render(`${topbar('Profil','home',iconButton('⚙','Ayarlar','route:settings'))}<section class="profile-hero"><div class="avatar large">EU</div><h1>Emre</h1><button class="level-link profile-level-link" data-route="level-guide">Seviye ${level.level} · ${level.title}</button><div class="level-track"><i style="width:${level.percent}%"></i></div><small>${level.current} / ${level.needed} sonraki seviye</small></section><section class="profile-grid">${[['✦',progress.knowledgePoints,'Bilgi puanı'],['✓',metric('learnedQuestions'),'Öğrenilen bilgi'],['◎',metric('seenQuestions'),'Benzersiz soru'],['↻',metric('wrongQuestions'),'Tekrar bekleyen'],['◇',progress.dailyStreak,'Günlük seri'],['★',won,'Uzmanlık rozeti']].map(([i,n,l])=>`<div class="stat-card"><span>${i} ${l}</span><strong>${n}</strong></div>`).join('')}</section><div class="section-head"><div><span>UZMANLIK VİTRİNİ</span><h2>Rozetlerin</h2></div><span class="muted">${won} / ${badgeDefinitions.length}</span></div>${badgeShelf()}`, {active:'more'}); }
  function badgePage(categoryId) { const badge=badgeDefinitions.find(item=>item.categoryId===categoryId); if(!badge){Router.go('profile');return;} const state=badgeProgress(categoryId), category=categories.find(item=>item.id===categoryId), target=state.next, sack=categoryId==='sack'; const rows=[[sack?'Çuvala eklenen benzersiz soru':'Benzersiz bilgi',state.learned,target.learned],[sack?'3 ayrı günde çalışılan':'Kalıcı öğrenme',state.mastered,target.mastered],[sack?'Farklı kategori':'Çalışılan alt alan',state.areas,target.areas]]; render(`${topbar(badge.title,'profile')}<section class="badge-detail ${state.unlocked?'unlocked':'locked'}"><span class="badge-detail-medallion"><img src="${badge.image}" alt="${category?.name||'Bilgi Çuvalı'}"></span><div class="eyebrow">${state.highest?`${state.highest.name.toUpperCase()} KAZANILDI`:'UZMANLIK YOLCULUĞU'}</div><h1>${badge.title}</h1><p>${sack?'Çuval tekrarları puan kazandırmaz; bu rozet düzenli çalışmayı ve gerçek öğrenmeyi ödüllendirir.':'Rozetler sabit hedeflerle açılır ve havuz büyüse bile bir daha geri alınmaz.'}</p></section><section class="badge-requirements">${rows.map(([label,value,goal])=>`<div><span><b>${label}</b><small>${Math.min(value,goal)} / ${goal}</small></span><div class="badge-progress"><i style="width:${Math.min(100,(value/goal)*100)}%"></i></div></div>`).join('')}</section><button class="btn btn-primary btn-block" data-route="${sack?'bag':category?.active?`category/${categoryId}`:'categories'}">${sack?'BİLGİ ÇUVALINA GİT':category?.active?'KATEGORİYE GİT':'KATEGORİLERİ KEŞFET'} <span>›</span></button>`, {active:'more'}); }
  function levelGuidePage() { const current=levelState(), levels=Array.from({length:50},(_,index)=>index+1); const titles=[['1–4','Meraklı'],['5–9','Kaşif'],['10–19','Araştırmacı'],['20–34','Bilgi Avcısı'],['35–49','Bilge'],['50+','Bilgi Ustası']]; render(`${topbar('Seviye Sistemi','home')}<section class="level-guide-hero"><div class="eyebrow">BİLGİYLE YÜKSEL</div><h1>Seviye ${current.level} · ${current.title}</h1><p>${progress.knowledgePoints} toplam puanın var. Sonraki seviyeye ${current.needed-current.current} puan kaldı.</p><div class="level-track"><i style="width:${current.percent}%"></i></div></section><div class="section-head"><div><span>PUANIN MANTIĞI</span><h2>Öğrenmek daha değerli</h2></div></div><section class="score-rules"><div><b>+2</b><span><strong>İlk görüşte doğru</strong><small>Zaten bildiğin bilgi</small></span></div><div><b>+1</b><span><strong>Pekiştirme doğrusu</strong><small>Yanlış havuzundaki her doğru</small></span></div><div><b>+10</b><span><strong>Kalıcı öğrenme</strong><small>5 doğruyla yanlış havuzundan çıkış</small></span></div><div><b>+25</b><span><strong>Özümseme bonusu</strong><small>Zindandan ilk kurtarılış</small></span></div><div><b>0</b><span><strong>Sıradan tekrar</strong><small>Çuval ve Zindan tekrarları puan üretmez</small></span></div></section><p class="score-philosophy">Sıralama en çok bilenleri değil, bilgisini en fazla geliştirenleri öne çıkarır.</p><div class="section-head"><div><span>UNVANLAR</span><h2>Yolculuk basamakları</h2></div></div><section class="level-title-grid">${titles.map(([range,title])=>`<div><strong>${range}</strong><span>${title}</span></div>`).join('')}</section><div class="section-head"><div><span>PUAN EŞİKLERİ</span><h2>Seviye tablosu</h2></div></div><section class="level-table"><header><span>Seviye</span><span>Unvan</span><span>Toplam</span><span>Sonraki</span></header>${levels.map(level=>`<div class="${level===current.level?'current':''}"><b>${level}</b><span>${titleForLevel(level)}</span><strong>${totalPointsForLevel(level)}</strong><small>${level===50?'—':pointsForNextLevel(level)}</small></div>`).join('')}</section><p class="level-guide-note">Her seviye bir öncekinden 25 puan daha uzun sürer. İlk seviyeler hızlı ilerler; ilerledikçe bilgi yolculuğu kademeli olarak zorlaşır.</p>`, {active:'more'}); }
  function savedPage() {
    const groups=[
      {type:'capitals',category:'Dünya',title:'Ülkeden Başkente',icon:'🌍'},
      {type:'capital-countries',category:'Dünya',title:'Başkentten Ülkeye',icon:'🏙️'},
      {type:'flags',category:'Dünya',title:'Bayraklar',icon:'🚩'},
      {type:'currencies',category:'Dünya',title:'Para Birimleri',icon:'◉'},
      {type:'currency-codes',category:'Dünya',title:'Para Biriminden Koda',icon:'ABC'},
      {type:'code-currencies',category:'Dünya',title:'Koddan Para Birimine',icon:'↔'},
      {type:'ancient-civilizations',category:'Tarih',title:'İlk Çağ Uygarlıkları',icon:'I'},
      {type:'turkish-history',category:'Tarih',title:'Türk Tarihi',icon:'VIII'},
      {type:'painters',category:'Sanat',title:'Ressamlar & Eserleri',icon:'🖼️'}
    ].map(group=>({...group,items:allQuestions.filter(q=>matchesTopic(q.id,group.type)&&progress.savedQuestions.includes(q.id))}));
    const total=groups.reduce((sum,group)=>sum+group.items.length,0);
    const content=total===0
      ? `<section class="saved-empty"><div>□</div><h2>Bilgi Çuvalın henüz boş</h2><p class="muted">Unutmak istemediğin sorularda sağ üstteki çuval simgesine dokun. Soruları yalnızca sen çıkarabilirsin.</p><button class="btn btn-primary" data-route="categories">KATEGORİLERİ KEŞFET</button></section>`
      : `<section class="bag-start-panel"><strong>${total} soru çuvalda</strong><p>Puan kasmadan, dilediğin kadar tekrar et.</p><div><button class="btn btn-secondary" data-action="start-bag:5">5 SORU</button><button class="btn btn-secondary" data-action="start-bag:10">10 SORU</button><button class="btn btn-primary" data-action="start-bag:all">TÜMÜ</button></div></section>`+groups.filter(group=>group.items.length).map(group=>`<section class="saved-group"><div class="saved-group-head"><span class="category-icon">${group.icon}</span><div><small>${group.category}</small><h2>${group.title}</h2><p>${group.items.length} soru</p></div><button class="btn btn-primary saved-start" data-action="start-saved:${group.type}">ÇÖZ ›</button></div><div class="saved-list">${group.items.map(q=>`<article class="saved-question">${q.image?`<img src="${escape(q.image)}" alt="">`:''}<p>${escape(q.question)}</p><button data-action="remove-saved:${q.id}" aria-label="Çuvaldan çıkar">×</button></article>`).join('')}</div></section>`).join('');
    render(`${topbar('Bilgi Çuvalım','home')}<div class="eyebrow">Kalıcı tekrar alanın</div><h1>Bilgi Çuvalı</h1><p class="muted">Zorlandığın soruları burada tut. Çuval tekrarları bilgi puanı kazandırmaz; düzenli çalışman özel rozeti ilerletir.</p>${content}`, {active:'more'});
  }
  function dungeonPage() { const items=allQuestions.filter(q=>progress.dungeonQuestions.includes(q.id)), queueItems=progress.dungeonQueue.map(id=>allQuestions.find(q=>q.id===id)).filter(Boolean); render(`${topbar('Bilgi Zindanı','home')}<div class="eyebrow">En zorlu bilgiler için</div><h1>Bilgi Zindanı</h1><p class="muted">Bir bilgi, normal testlerde 5 kez yanlış cevaplandığında otomatik olarak zindana düşer. İlk 25 doğru test, sonraki 25 doğru flash karttır. İlk kez özgürleşen her benzersiz bilgi +25 Özümseme Bonusu kazandırır; tekrarlar puan üretmez. Zindan doluysa en fazla 5 bilgi geliş sırasına alınır.</p><section class="dungeon-capacity"><span>Kapasite</span><strong>${items.length} / 10</strong><div><i style="width:${items.length*10}%"></i></div><small>Bekleme sırası: ${queueItems.length} / 5</small></section>${items.length?`<button class="btn btn-primary btn-block" data-action="start-dungeon">ZİNDANI ÇALIŞTIR</button><section class="saved-list dungeon-list">${items.map(q=>`<article class="saved-question"><p>${escape(q.question)}</p><span>${progress.dungeonCounts[q.id]||0} / 50</span><button data-action="remove-dungeon:${q.id}" aria-label="Zindandan çıkar">×</button></article>`).join('')}</section>`:`<section class="saved-empty"><div>◈</div><h2>Zindan boş</h2><p class="muted">Normal testlerde 5 kez yanlış cevaplanan bilgiler buraya otomatik gelir.</p><button class="btn btn-primary" data-route="categories">SORU ÇÖZMEYE BAŞLA</button></section>`}${queueItems.length?`<div class="section-head"><div><span>BEKLEME SIRASI</span><h2>Sıradaki bilgiler</h2></div><span class="muted">${queueItems.length} / 5</span></div><section class="dungeon-queue-list">${queueItems.map((q,index)=>`<article><b>${index+1}</b><p>${escape(q.question)}</p><button data-action="remove-dungeon-queue:${q.id}" aria-label="Sıradan çıkar">×</button></article>`).join('')}</section>`:''}`, {active:'more'}); }
  function pickRandomFact() {
    const categoryIds=['world','history','art'];
    const categoryId=categoryIds[Math.floor(Math.random()*categoryIds.length)];
    const isUsefulFact=question=>question.explanation && !/bu sorunun doğru cevabıdır|doğru cevap(?:tır| budur)|doğru yanıttır/i.test(question.explanation) && !question.explanation.includes('?');
    const pool=allQuestions.filter(question=>question.categoryId===categoryId && isUsefulFact(question) && question.id!==currentRandomFact?.id);
    const fallback=allQuestions.filter(question=>isUsefulFact(question) && question.id!==currentRandomFact?.id);
    currentRandomFact=pool[Math.floor(Math.random()*pool.length)] || fallback[Math.floor(Math.random()*fallback.length)];
  }
  function randomFactPage(next=false) {
    if(next || !currentRandomFact) pickRandomFact();
    const fact=currentRandomFact;
    const meta={
      world:{name:'Dünya',image:'assets/images/ui/world-category-hero-v2.png'},
      history:{name:'Tarih',image:'assets/images/ui/category-history-cartoon.png'},
      art:{name:'Sanat',image:'assets/images/ui/category-art-cartoon.png'}
    }[fact.categoryId];
    const topicNames={capitals:'Ülkeler ve Başkentler',flags:'Bayraklar',currencies:'Para Birimleri','currency-codes':'Para Birimi Kodları','code-currencies':'Para Birimi Kodları',painters:'Ressamlar ve Eserleri','ancient-civilizations':'İlk Çağ Uygarlıkları','turkish-history':'Türk Tarihi'};
    render(`${topbar('Rastgele Bilgi','home')}<section class="random-fact-hero"><div class="random-fact-orbit"><img src="${escape(fact.image || meta.image)}" alt=""></div><div class="random-fact-category">${meta.name} · ${topicNames[fact.subcategoryId]||'Genel Bilgi'}</div><div class="eyebrow">DOĞRUDAN BİLGİ</div><h1>${escape(fact.explanation)}</h1></section><button class="btn btn-primary btn-block random-fact-next" data-action="random-fact-next">BAŞKA BİLGİ GÖSTER <span>↻</span></button><p class="random-fact-note">Her dokunuşta Dünya, Tarih veya Sanat kategorilerinden yeni bir bilgi gelir.</p>`, {active:'home'});
  }
  function settingsPage() { const groups={SES:[['sound','Ses Efektleri'],['music','Müzik'],['vibration','Titreşim']],BİLDİRİMLER:[['notifications','Bildirimler']]}; render(`${topbar('Ayarlar','profile')}${Object.entries(groups).map(([title,items])=>`<section class="settings-group"><h3>${title}</h3><div class="settings-list">${items.map(([key,label])=>`<div class="setting"><span>${label}</span><button class="switch ${progress.settings[key]?'on':''}" data-toggle="${key}" aria-label="${label}" aria-pressed="${progress.settings[key]}"></button></div>`).join('')}</div></section>`).join('')}<section class="settings-group"><h3>GÖRÜNÜM</h3><div class="settings-list"><div class="setting"><span>Dil</span><span class="muted">Türkçe ›</span></div><div class="setting"><span>Tema</span><span class="muted">Açık ›</span></div></div></section><section class="settings-group"><h3>HESAP</h3><div class="settings-list"><div class="setting"><span>Hesap Bilgileri</span><span>›</span></div><div class="setting"><span>Verileri Senkronize Et</span><span>›</span></div></div></section>`, {active:'more'}); }
  function placeholder(name='Bu alan') { const labels={quick:['🧠','Hızlı Test'],progress:['📈','İlerlemem'],more:['✨','Diğer']}; const [icon,title]=labels[name]||['🚧',name]; render(`${topbar(title,'home')}<section class="placeholder"><div><div class="placeholder-icon">${icon}</div><h1>${title}</h1><p class="muted">Bu deneyim bir sonraki geliştirme aşamasında burada olacak.</p><button class="btn btn-primary" data-route="home">ANA SAYFAYA DÖN</button></div></section>`, {active:labels[name]?name:'home'}); }

  document.addEventListener('click', event => {
    const routeEl=event.target.closest('[data-route]'); if(routeEl){Router.go(routeEl.dataset.route);return;}
    const answerEl=event.target.closest('[data-answer]'); if(answerEl){answer(answerEl.dataset.answer);return;}
    const toggle=event.target.closest('[data-toggle]'); if(toggle){const k=toggle.dataset.toggle; progress.settings[k]=!progress.settings[k]; StorageService.saveProgress(progress); settingsPage();return;}
    const el=event.target.closest('[data-action]'); if(!el)return; const action=el.dataset.action;
    if(action==='start-dungeon'){startDungeonTest();return;}
    if(action.startsWith('remove-dungeon-queue:')){const id=action.slice(21);progress.dungeonQueue=progress.dungeonQueue.filter(x=>x!==id);progress.dungeonWrongCounts[id]=0;StorageService.saveProgress(progress);dungeonPage();toast('Bilgi bekleme sırasından çıkarıldı. Yanlış sayacı sıfırlandı.');return;}
    if(action.startsWith('remove-dungeon:')){const id=action.slice(15);progress.dungeonQuestions=progress.dungeonQuestions.filter(x=>x!==id);progress.dungeonCounts[id]=0;progress.dungeonWrongCounts[id]=0;const promoted=promoteDungeonQueue();StorageService.saveProgress(progress);dungeonPage();toast(promoted?'Bilgi çıkarıldı; sıradaki bilgi zindana girdi.':'Bilgi zindandan çıkarıldı.');return;}
    if(action==='reveal-flashcard'){quiz.revealed=true;quizPage();return;}
    if(action==='flash-known'){answer(quiz.items[quiz.index].correctAnswer);return;}
    if(action==='flash-repeat'){answer('__flashcard_tekrar__');return;}
    if(action.startsWith('release-dungeon:')){const question=quiz.items[quiz.index],addToBag=action.endsWith(':bag'),firstRescue=!progress.dungeonRescued.includes(question.id);progress.dungeonQuestions=progress.dungeonQuestions.filter(id=>id!==question.id);progress.dungeonCounts[question.id]=0;progress.dungeonWrongCounts[question.id]=0;if(firstRescue){progress.dungeonRescued.push(question.id);progress.knowledgePoints+=25;}if(addToBag){progress.savedQuestions=unique([...progress.savedQuestions,question.id]);progress.sackHistory=unique([...progress.sackHistory,question.id]);}const promoted=promoteDungeonQueue();StorageService.saveProgress(progress);toast(`${firstRescue?'+25 Özümseme Bonusu! ':''}${addToBag?'Bilgi çuvala eklendi.':'Bilgi serbest kaldı.'}${promoted?' Sıradaki bilgi zindana girdi.':''}`);nextQuestion();if(firstRescue)showPointBurst('Özümseme bonusu',25);return;}
    if(action==='new-test'&&lastResult?.mode==='saved'){Router.go('bag');return;}
    if(action==='new-test'&&lastResult?.mode==='dungeon'){Router.go('dungeon');return;}
    if(action.startsWith('back:')) Router.back(action.slice(5)); else if(action.startsWith('route:')) Router.go(action.slice(6)); else if(action.startsWith('placeholder:')) placeholder(action.slice(12)); else if(action.startsWith('start-quick:')) startQuickTest(Number(action.slice(12))); else if(action.startsWith('start-bag:')) startBagTest(action.slice(10)); else if(action.startsWith('start-test:')){const [,type,index]=action.split(':');startQuiz(type,false,false,Number(index));} else if(action.startsWith('start-quiz:')) startQuiz(action.slice(11)); else if(action.startsWith('start-saved:')) startQuiz(action.slice(12),false,true); else if(action.startsWith('remove-saved:')){const id=action.slice(13); progress.savedQuestions=progress.savedQuestions.filter(questionId=>questionId!==id); StorageService.saveProgress(progress); savedPage(); toast('Soru çuvaldan çıkarıldı');} else if(action==='random-fact-next') randomFactPage(true); else if(action==='locked') toast('Bu kategori çok yakında keşfe açılacak.'); else if(action==='retry-wrong') lastResult.type==='quick'?startQuickTest(Math.min(lastResult.items.length,progress.wrongQuestions.length)):startQuiz(lastResult.type,true); else if(action==='new-test') lastResult.type==='quick'?Router.go('quick'):lastResult.mode==='bag'?Router.go('bag'):startQuiz(lastResult.type,false,false,lastResult.testIndex); else if(action==='next-question') nextQuestion(); else if(action==='bookmark'){const id=quiz.items[quiz.index].id, adding=!progress.savedQuestions.includes(id); progress.savedQuestions=adding?[...progress.savedQuestions,id]:progress.savedQuestions.filter(x=>x!==id); if(adding) progress.sackHistory=unique([...progress.sackHistory,id]); StorageService.saveProgress(progress); quizPage(); toast(adding?'Bilgi Çuvalına eklendi':'Bilgi Çuvalından çıkarıldı');}
  });
  document.addEventListener('keydown', e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-route]'))Router.go(e.target.dataset.route);});

  Router.add('home',home).add('categories',categoriesPage).add('category/:id',({id})=>id==='world'?worldPage():id==='art'?artPage():id==='history'?historyPage():placeholder()).add('subcategory/:id',({id})=>id==='capitals'?capitalsPage('capitals'):id==='capital-countries'?capitalsPage('capital-countries'):id==='flags'?flagsPage():id==='currencies'?currenciesHubPage():id==='country-currencies'?currenciesPage():id==='currency-codes'||id==='code-currencies'?currencyCodesPage(id):id==='ancient-civilizations'||id==='turkish-history'?historyTopicPage(id):periodFromType(id)?turkishHistoryPeriodPage(id):id==='painters'?paintersPage():placeholder()).add('reading/:id',({id})=>historyReadingPage(id)).add('quiz/:id',quizPage).add('result',resultPage).add('random-fact',()=>randomFactPage(true)).add('saved',savedPage).add('bag',savedPage).add('dungeon',dungeonPage).add('profile',profilePage).add('level-guide',levelGuidePage).add('badge/:id',({id})=>badgePage(id)).add('settings',settingsPage).add('quick',quickTestPage).add('progress',()=>placeholder('progress')).add('more',()=>placeholder('more')).setFallback(()=>Router.go('home')).start();
})();
