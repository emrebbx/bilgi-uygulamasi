window.AppData = (() => {
  const categories = [
    ['world','Dünya','🌍','#e2f5ff'], ['history','Tarih','🏛️','#fff2de'], ['art','Sanat','🎨','#f7eaff'],
    ['literature','Edebiyat','📚','#fff0e8'], ['science','Bilim','🔬','#e8f8f2'], ['cinema','Sinema','🎬','#edf0ff'],
    ['mythology','Mitoloji','⚡','#fff6d9'], ['sports','Spor','🏅','#e8f7ff'], ['music','Müzik','🎵','#fbeaff'],
    ['technology','Teknoloji','💻','#e8f2ff'], ['human','İnsan','🧠','#ffeef0'], ['games','Video Oyunları','🎮','#eef0ff']
  ].map(([id,name,icon,tint]) => ({ id, name, icon, tint, active: id === 'world' || id === 'art' || id === 'history' }));

  const subcategories = [
    { id:'capitals', categoryId:'world', name:'Ülkeden Başkente', icon:'🌍', active:true },
    { id:'capital-countries', categoryId:'world', name:'Başkentten Ülkeye', icon:'🏙️', active:true },
    { id:'flags', categoryId:'world', name:'Bayraklar', icon:'🚩', active:true },
    { id:'currencies', categoryId:'world', name:'Para Birimleri', icon:'🪙', active:true },
    { id:'languages', categoryId:'world', name:'Resmî Diller', icon:'🗣️' },
    { id:'mountains', categoryId:'world', name:'Dağlar & Zirveler', icon:'🏔️' }
  ];

  const artSubcategories = [
    { id:'painters', categoryId:'art', name:'Ressamlar & Eserleri', icon:'🖼️', active:true },
    { id:'art-movements', categoryId:'art', name:'Sanat Akımları', icon:'🎨' },
    { id:'sculpture', categoryId:'art', name:'Heykel & Heykeltıraşlar', icon:'🏺' },
    { id:'museums', categoryId:'art', name:'Müzeler & Koleksiyonlar', icon:'🏛️' },
    { id:'techniques', categoryId:'art', name:'Teknikler & Malzemeler', icon:'🖌️' },
    { id:'art-history', categoryId:'art', name:'Sanat Tarihi & Dönemler', icon:'⌛' }
  ];

  const historySubcategories = [
    { id:'ancient-civilizations', categoryId:'history', name:'İlk Çağ Uygarlıkları', mark:'I', active:true },
    { id:'empires', categoryId:'history', name:'İmparatorluklar', mark:'II' },
    { id:'middle-ages', categoryId:'history', name:'Orta Çağ', mark:'III' },
    { id:'modern-history', categoryId:'history', name:'Yeni ve Yakın Çağ', mark:'IV' },
    { id:'wars-treaties', categoryId:'history', name:'Savaşlar ve Antlaşmalar', mark:'V' },
    { id:'revolutions', categoryId:'history', name:'Devrimler ve Dönüm Noktaları', mark:'VI' },
    { id:'historical-figures', categoryId:'history', name:'Tarihî Kişiler', mark:'VII' },
    { id:'turkish-history', categoryId:'history', name:'Türk Tarihi', mark:'VIII', active:true }
  ];

  // 193 BM üyesi, iki BM gözlemci devleti ve ayrıca Kosova ile Tayvan.
  // Özel başkent düzenine sahip ülkelerde soru ve açıklama yanıltıcı olmayacak biçimde özelleştirilmiştir.
  const capitalRecords = [
    ['afghanistan','Afganistan','Kabil'],
    ['albania','Arnavutluk','Tiran'],
    ['algeria','Cezayir','Cezayir'],
    ['andorra','Andorra','Andorra la Vella'],
    ['angola','Angola','Luanda'],
    ['antigua-barbuda','Antigua ve Barbuda','Saint John’s'],
    ['argentina','Arjantin','Buenos Aires'],
    ['armenia','Ermenistan','Erivan'],
    ['australia','Avustralya','Canberra'],
    ['austria','Avusturya','Viyana'],
    ['azerbaijan','Azerbaycan','Bakü'],
    ['bahamas','Bahamalar','Nassau'],
    ['bahrain','Bahreyn','Manama'],
    ['bangladesh','Bangladeş','Dakka'],
    ['barbados','Barbados','Bridgetown'],
    ['belarus','Belarus','Minsk'],
    ['belgium','Belçika','Brüksel'],
    ['belize','Belize','Belmopan'],
    ['benin','Benin','Porto-Novo','Porto-Novo resmî başkenttir; hükûmetin büyük bölümü ve ekonomik merkez Cotonou’dadır.','Benin’in resmî başkenti hangisidir?'],
    ['bhutan','Bhutan','Thimphu'],
    ['bolivia','Bolivya','Sucre','Sucre, Bolivya Anayasası’nda başkent olarak tanımlandığı için “anayasal başkent” denir. Ancak yürütme ve yasama organları La Paz’da çalışır; bu nedenle La Paz fiilî hükûmet merkezidir.','Bolivya’nın anayasal başkenti hangisidir?'],
    ['bosnia-herzegovina','Bosna-Hersek','Saraybosna'],
    ['botswana','Botsvana','Gaborone'],
    ['brazil','Brezilya','Brasília'],
    ['brunei','Brunei','Bandar Seri Begawan'],
    ['bulgaria','Bulgaristan','Sofya'],
    ['burkina-faso','Burkina Faso','Ouagadougou'],
    ['burundi','Burundi','Gitega','Gitega 2019’da siyasi başkent oldu; Bujumbura ekonomik merkez olarak önemini korur.'],
    ['cabo-verde','Cabo Verde','Praia'],
    ['cambodia','Kamboçya','Phnom Penh'],
    ['cameroon','Kamerun','Yaoundé'],
    ['canada','Kanada','Ottawa'],
    ['central-african-republic','Orta Afrika Cumhuriyeti','Bangui'],
    ['chad','Çad','N’Djamena'],
    ['chile','Şili','Santiago'],
    ['china','Çin','Pekin'],
    ['colombia','Kolombiya','Bogotá'],
    ['comoros','Komorlar','Moroni'],
    ['dr-congo','Demokratik Kongo Cumhuriyeti','Kinşasa'],
    ['congo','Kongo Cumhuriyeti','Brazzaville'],
    ['costa-rica','Kosta Rika','San José'],
    ['cote-divoire','Fildişi Sahili','Yamoussoukro','Yamoussoukro resmî başkenttir; Abidjan en büyük şehir ve hükûmetin önemli merkezidir.','Fildişi Sahili’nin resmî başkenti hangisidir?'],
    ['croatia','Hırvatistan','Zagreb'],
    ['cuba','Küba','Havana'],
    ['cyprus','Kıbrıs Cumhuriyeti','Lefkoşa'],
    ['czechia','Çekya','Prag'],
    ['denmark','Danimarka','Kopenhag'],
    ['djibouti','Cibuti','Cibuti'],
    ['dominica','Dominika','Roseau'],
    ['dominican-republic','Dominik Cumhuriyeti','Santo Domingo'],
    ['ecuador','Ekvador','Quito'],
    ['egypt','Mısır','Kahire'],
    ['el-salvador','El Salvador','San Salvador'],
    ['equatorial-guinea','Ekvator Ginesi','Ciudad de la Paz','Ciudad de la Paz, Ocak 2026’da Malabo’nun yerine ülkenin başkenti ilan edildi.'],
    ['eritrea','Eritre','Asmara'],
    ['estonia','Estonya','Tallinn'],
    ['eswatini','Esvatini','Mbabane','Mbabane, Esvatini’nin idarî başkentidir; Lobamba ise kraliyet ve yasama merkezidir.','Esvatini’nin idarî başkenti hangisidir?'],
    ['ethiopia','Etiyopya','Addis Ababa'],
    ['fiji','Fiji','Suva'],
    ['finland','Finlandiya','Helsinki'],
    ['france','Fransa','Paris'],
    ['gabon','Gabon','Libreville'],
    ['gambia','Gambiya','Banjul'],
    ['georgia','Gürcistan','Tiflis'],
    ['germany','Almanya','Berlin'],
    ['ghana','Gana','Akra'],
    ['greece','Yunanistan','Atina'],
    ['grenada','Grenada','Saint George’s'],
    ['guatemala','Guatemala','Guatemala'],
    ['guinea','Gine','Konakri'],
    ['guinea-bissau','Gine-Bissau','Bissau'],
    ['guyana','Guyana','Georgetown'],
    ['haiti','Haiti','Port-au-Prince'],
    ['honduras','Honduras','Tegucigalpa'],
    ['hungary','Macaristan','Budapeşte'],
    ['iceland','İzlanda','Reykjavík'],
    ['india','Hindistan','Yeni Delhi'],
    ['indonesia','Endonezya','Jakarta','Nusantara yeni başkent olarak planlanmış olsa da gerekli başkanlık kararnamesi henüz yürürlüğe girmediği için Jakarta başkent statüsünü korumaktadır.','Endonezya’nın günümüzdeki başkenti hangisidir?'],
    ['iran','İran','Tahran'],
    ['iraq','Irak','Bağdat'],
    ['ireland','İrlanda','Dublin'],
    ['israel','İsrail','Kudüs','İsrail Kudüs’ü başkenti ilan eder; şehrin uluslararası statüsü ve Doğu Kudüs meselesi ihtilaflıdır.','İsrail’in başkent ilan ettiği şehir hangisidir?'],
    ['italy','İtalya','Roma'],
    ['jamaica','Jamaika','Kingston'],
    ['japan','Japonya','Tokyo'],
    ['jordan','Ürdün','Amman'],
    ['kazakhstan','Kazakistan','Astana'],
    ['kenya','Kenya','Nairobi'],
    ['kiribati','Kiribati','Güney Tarawa'],
    ['north-korea','Kuzey Kore','Pyongyang'],
    ['south-korea','Güney Kore','Seul'],
    ['kuwait','Kuveyt','Kuveyt'],
    ['kyrgyzstan','Kırgızistan','Bişkek'],
    ['laos','Laos','Vientiane'],
    ['latvia','Letonya','Riga'],
    ['lebanon','Lübnan','Beyrut'],
    ['lesotho','Lesotho','Maseru'],
    ['liberia','Liberya','Monrovia'],
    ['libya','Libya','Trablus'],
    ['liechtenstein','Lihtenştayn','Vaduz'],
    ['lithuania','Litvanya','Vilnius'],
    ['luxembourg','Lüksemburg','Lüksemburg'],
    ['madagascar','Madagaskar','Antananarivo'],
    ['malawi','Malavi','Lilongwe'],
    ['malaysia','Malezya','Kuala Lumpur','Kuala Lumpur resmî başkenttir; federal idarî merkez Putrajaya’dadır.','Malezya’nın resmî başkenti hangisidir?'],
    ['maldives','Maldivler','Malé'],
    ['mali','Mali','Bamako'],
    ['malta','Malta','Valletta'],
    ['marshall-islands','Marshall Adaları','Majuro'],
    ['mauritania','Moritanya','Nuakşot'],
    ['mauritius','Mauritius','Port Louis'],
    ['mexico','Meksika','Meksiko'],
    ['micronesia','Mikronezya Federal Devletleri','Palikir'],
    ['moldova','Moldova','Kişinev'],
    ['monaco','Monako','Monako'],
    ['mongolia','Moğolistan','Ulan Batur'],
    ['montenegro','Karadağ','Podgorica'],
    ['morocco','Fas','Rabat'],
    ['mozambique','Mozambik','Maputo'],
    ['myanmar','Myanmar','Naypyidaw'],
    ['namibia','Namibya','Windhoek'],
    ['nauru','Nauru','Yaren','Nauru’nun resmî olarak belirlenmiş bir başkenti yoktur; hükûmet Yaren bölgesindedir.','Resmî başkenti olmayan Nauru’nun fiilî yönetim merkezi neresidir?'],
    ['nepal','Nepal','Katmandu'],
    ['netherlands','Hollanda','Amsterdam','Amsterdam, Hollanda Anayasası’nda başkent olarak yazılı olduğu için “anayasal başkent” denir. Hükûmet, parlamento ve yüksek mahkemeler ise Lahey’dedir.','Hollanda’nın anayasal başkenti hangisidir?'],
    ['new-zealand','Yeni Zelanda','Wellington'],
    ['nicaragua','Nikaragua','Managua'],
    ['niger','Nijer','Niamey'],
    ['nigeria','Nijerya','Abuja'],
    ['north-macedonia','Kuzey Makedonya','Üsküp'],
    ['norway','Norveç','Oslo'],
    ['oman','Umman','Maskat'],
    ['pakistan','Pakistan','İslamabad'],
    ['palau','Palau','Ngerulmud'],
    ['panama','Panama','Panama'],
    ['papua-new-guinea','Papua Yeni Gine','Port Moresby'],
    ['paraguay','Paraguay','Asunción'],
    ['peru','Peru','Lima'],
    ['philippines','Filipinler','Manila'],
    ['poland','Polonya','Varşova'],
    ['portugal','Portekiz','Lizbon'],
    ['qatar','Katar','Doha'],
    ['romania','Romanya','Bükreş'],
    ['russia','Rusya','Moskova'],
    ['rwanda','Ruanda','Kigali'],
    ['saint-kitts-nevis','Saint Kitts ve Nevis','Basseterre'],
    ['saint-lucia','Saint Lucia','Castries'],
    ['saint-vincent','Saint Vincent ve Grenadinler','Kingstown'],
    ['samoa','Samoa','Apia'],
    ['san-marino','San Marino','San Marino'],
    ['sao-tome-principe','São Tomé ve Príncipe','São Tomé'],
    ['saudi-arabia','Suudi Arabistan','Riyad'],
    ['senegal','Senegal','Dakar'],
    ['serbia','Sırbistan','Belgrad'],
    ['seychelles','Seyşeller','Victoria'],
    ['sierra-leone','Sierra Leone','Freetown'],
    ['singapore','Singapur','Singapur'],
    ['slovakia','Slovakya','Bratislava'],
    ['slovenia','Slovenya','Ljubljana'],
    ['solomon-islands','Solomon Adaları','Honiara'],
    ['somalia','Somali','Mogadişu'],
    ['south-africa','Güney Afrika','Pretoria','Pretoria idarî ve yürütme, Cape Town yasama, Bloemfontein ise yargı başkentidir.','Güney Afrika’nın idarî ve yürütme başkenti hangisidir?'],
    ['south-sudan','Güney Sudan','Juba'],
    ['spain','İspanya','Madrid'],
    ['sri-lanka','Sri Lanka','Sri Jayawardenepura Kotte','Sri Jayawardenepura Kotte Sri Lanka’nın yasama başkentidir; Kolombo ise yürütme ve yargı merkezi olarak anılır.','Sri Lanka’nın yasama başkenti hangisidir?'],
    ['sudan','Sudan','Hartum','Hartum resmî başkenttir; iç savaş sırasında hükûmetin geçici idarî merkezi Port Sudan olmuştur.','Sudan’ın resmî başkenti hangisidir?'],
    ['suriname','Surinam','Paramaribo'],
    ['sweden','İsveç','Stockholm'],
    ['switzerland','İsviçre','Bern','İsviçre’nin anayasasında resmî bir başkent tanımlanmaz; Bern federal şehir ve fiilî başkenttir.','İsviçre’nin federal şehri ve fiilî başkenti hangisidir?'],
    ['syria','Suriye','Şam'],
    ['tajikistan','Tacikistan','Duşanbe'],
    ['tanzania','Tanzanya','Dodoma','Dodoma resmî başkenttir; Darüsselam ülkenin en büyük şehri ve önemli idarî merkezidir.','Tanzanya’nın resmî başkenti hangisidir?'],
    ['thailand','Tayland','Bangkok'],
    ['timor-leste','Doğu Timor','Dili'],
    ['togo','Togo','Lomé'],
    ['tonga','Tonga','Nukuʻalofa'],
    ['trinidad-tobago','Trinidad ve Tobago','Port of Spain'],
    ['tunisia','Tunus','Tunus'],
    ['turkey','Türkiye','Ankara'],
    ['turkmenistan','Türkmenistan','Aşkabat'],
    ['tuvalu','Tuvalu','Funafuti'],
    ['uganda','Uganda','Kampala'],
    ['ukraine','Ukrayna','Kyiv'],
    ['united-arab-emirates','Birleşik Arap Emirlikleri','Abu Dabi'],
    ['united-kingdom','Birleşik Krallık','Londra'],
    ['united-states','Amerika Birleşik Devletleri','Washington, DC'],
    ['uruguay','Uruguay','Montevideo'],
    ['uzbekistan','Özbekistan','Taşkent'],
    ['vanuatu','Vanuatu','Port Vila'],
    ['venezuela','Venezuela','Caracas'],
    ['vietnam','Vietnam','Hanoi'],
    ['yemen','Yemen','Sana','Sana, Yemen’in hukukî düzeninde başkent kabul edildiği için “anayasal başkent” olarak anılır. Devam eden iç savaş nedeniyle uluslararası tanınan hükûmet geçici olarak Aden’den çalışmaktadır.','Yemen’in anayasal başkenti hangisidir?'],
    ['zambia','Zambiya','Lusaka'],
    ['zimbabwe','Zimbabve','Harare'],
    ['vatican','Vatikan','Vatikan','Vatikan, BM’de Kutsal Makam tarafından temsil edilen gözlemci devlettir.'],
    ['palestine','Filistin Devleti','Doğu Kudüs','Filistin Devleti Doğu Kudüs’ü başkent olarak talep eder; idarî merkez Ramallah’tadır ve statü ihtilaflıdır.','Filistin Devleti’nin başkent olarak talep ettiği şehir hangisidir?'],
    ['kosovo','Kosova','Priştine','Kosova kısmen tanınan bir devlettir ve BM üyesi değildir.'],
    ['taiwan','Tayvan','Taipei','Tayvan, resmî adıyla Çin Cumhuriyeti, sınırlı diplomatik tanınmaya sahiptir ve BM üyesi değildir.']
  ];

  const countryCodes = `
    af al dz ad ao ag ar am au at az bs bh bd bb by be bz bj bt bo ba bw br bn bg bf bi cv kh cm ca cf td cl cn co km cd cg cr ci hr cu cy cz dk dj dm do ec eg sv gq er ee sz et fj fi fr ga gm ge de gh gr gd gt gn gw gy ht hn hu is in id ir iq ie il it jm jp jo kz ke ki kp kr kw kg la lv lb ls lr ly li lt lu mg mw my mv ml mt mh mr mu mx fm md mc mn me ma mz mm na nr np nl nz ni ne ng mk no om pk pw pa pg py pe ph pl pt qa ro ru rw kn lc vc ws sm st sa sn rs sc sl sg sk si sb so za ss es lk sd sr se ch sy tj tz th tl tg to tt tn tr tm tv ug ua ae gb us uy uz vu ve vn ye zm zw va ps xk tw
  `.trim().split(/\s+/);
  if (countryCodes.length !== capitalRecords.length) throw new Error('Ülke ve bayrak kodu sayıları eşleşmiyor.');

  const capitalPool = capitalRecords.map(record => record[2]);
  const countryPool = capitalRecords.map(record => record[1]);
  const hash = text => [...text].reduce((value, char) => ((value * 31) + char.charCodeAt(0)) >>> 0, 7);
  const makeOptions = (id, answer, pool = capitalPool) => {
    const alternatives = pool.filter(item => item !== answer);
    const start = hash(id) % alternatives.length;
    const distractors = [];
    for (let offset = 0; distractors.length < 3; offset += 37) {
      const candidate = alternatives[(start + offset) % alternatives.length];
      if (!distractors.includes(candidate)) distractors.push(candidate);
    }
    const options = [...distractors, answer];
    const rotation = hash(`${id}-rotation`) % options.length;
    return [...options.slice(rotation), ...options.slice(0, rotation)];
  };

  // Birden fazla merkez kullanan veya başkent taşıyan ülkeler tek bir
  // birleşik şıkla ele verilmez; her işlev ve dönem ayrı bilgi olarak sorulur.
  const specialCapitalRecords = [
    ['south-africa-legislative','Güney Afrika','Güney Afrika’nın yasama başkenti hangisidir?','Cape Town','Parlamentonun bulunduğu Cape Town, Güney Afrika’nın yasama başkentidir.'],
    ['south-africa-judicial','Güney Afrika','Güney Afrika’nın yargı başkenti hangisidir?','Bloemfontein','Yüksek Temyiz Mahkemesinin bulunduğu Bloemfontein, Güney Afrika’nın yargı başkentidir.'],
    ['eswatini-legislative','Esvatini','Esvatini’nin kraliyet ve yasama merkezi hangisidir?','Lobamba','Lobamba kraliyet merkezi ve yasama başkentidir; Mbabane idarî başkenttir.'],
    ['sri-lanka-executive','Sri Lanka','Sri Lanka’nın yürütme ve yargı merkezi olarak anılan şehri hangisidir?','Kolombo','Kolombo yürütme ve yargı merkezi olarak anılır; Sri Jayawardenepura Kotte yasama başkentidir.'],
    ['bolivia-government','Bolivya','Bolivya’nın hükûmet merkezi ve fiilî başkenti hangisidir?','La Paz','Sucre anayasal başkenttir; yürütme ve yasama organları La Paz’da çalışır.'],
    ['netherlands-government','Hollanda','Hollanda hükûmetinin ve parlamentosunun bulunduğu şehir hangisidir?','Lahey','Amsterdam anayasal başkenttir; hükûmet, parlamento ve yüksek mahkemeler Lahey’dedir.'],
    ['malaysia-administrative','Malezya','Malezya’nın federal idarî merkezi hangisidir?','Putrajaya','Kuala Lumpur resmî başkenttir; federal yönetimin idarî merkezi Putrajaya’dır.'],
    ['benin-government','Benin','Benin hükûmetinin fiilen çalıştığı şehir hangisidir?','Cotonou','Porto-Novo resmî başkenttir; hükûmetin büyük bölümü Cotonou’da çalışır.'],
    ['indonesia-future','Endonezya','Endonezya’nın gelecekte başkent yapmayı planladığı şehir hangisidir?','Nusantara','Nusantara planlanan yeni başkenttir; resmî geçiş tamamlanıncaya kadar Jakarta başkenttir.'],
    ['equatorial-guinea-former','Ekvator Ginesi','Ciudad de la Paz’dan önce Ekvator Ginesi’nin başkenti hangi şehirdi?','Malabo','Malabo, Ocak 2026’da başkent Ciudad de la Paz’a taşınana kadar ülkenin başkentiydi.'],
    ['burundi-former','Burundi','Gitega’dan önce Burundi’nin siyasi başkenti hangisiydi?','Bujumbura','Gitega 2019’da siyasi başkent oldu; Bujumbura ekonomik merkez olarak önemini korur.'],
    ['tanzania-former','Tanzanya','Dodoma’dan önce Tanzanya’nın başkenti hangisiydi?','Darüsselam','Dodoma resmî başkenttir; eski başkent Darüsselam en büyük şehir ve önemli bir ekonomik merkezdir.'],
    ['palestine-administrative','Filistin Devleti','Filistin Yönetimi’nin fiilî idarî merkezi hangisidir?','Ramallah','Filistin Devleti Doğu Kudüs’ü başkent olarak talep eder; Filistin Yönetimi’nin fiilî idarî merkezi Ramallah’tır.']
  ];
  const specialCapitalPool = [...new Set([...capitalPool,...specialCapitalRecords.map(record=>record[3])])];
  const capitalTestOne = new Map((window.CapitalTestOne||[]).map(item=>[item.id,item]));

  const questions = capitalRecords.flatMap(([id, country, correctAnswer, note, customQuestion], index) => {
    const lesson=capitalTestOne.get(id);
    const explanation = lesson?.explanation || note || `${correctAnswer}, ${country} ülkesinin başkentidir.`;
    return [
      {
        id: `world_capitals_${id}`,
        categoryId: 'world',
        subcategoryId: 'capitals',
        direction: 'country-to-capital',
        question: customQuestion || `${country} ülkesinin başkenti hangisidir?`,
        options: lesson?.options || makeOptions(id, correctAnswer),
        correctAnswer,
        acceptedAnswers:lesson?.acceptedAnswers||[],
        mainFact:lesson?.mainFact,
        detail:lesson?.detail,
        learningOrder:lesson?.learningOrder,
        flagCode: countryCodes[index],
        explanation
      },
      {
        id: `world_capitals_reverse_${id}`,
        categoryId: 'world',
        subcategoryId: 'capitals',
        direction: 'capital-to-country',
        question: `${correctAnswer} hangi ülkenin başkentidir?`,
        options: makeOptions(`reverse-${id}`, country, countryPool),
        correctAnswer: country,
        flagCode: countryCodes[index],
        explanation
      }
    ];
  }).concat(specialCapitalRecords.flatMap(([id,country,question,correctAnswer,explanation])=>[
    {
      id:`world_capitals_${id}`,
      categoryId:'world',
      subcategoryId:'capitals',
      direction:'country-to-capital',
      question,
      options:makeOptions(id,correctAnswer,specialCapitalPool),
      correctAnswer,
      explanation
    },
    {
      id:`world_capitals_reverse_${id}`,
      categoryId:'world',
      subcategoryId:'capitals',
      direction:'capital-to-country',
      question:`${correctAnswer}, hangi ülkenin başkent düzeninde yer alan bir merkezdir?`,
      options:makeOptions(`reverse-${id}`,country,countryPool),
      correctAnswer:country,
      explanation
    }
  ]));

  const flagQuestions = capitalRecords.map(([id, country], index) => ({
    id: `world_flags_${id}`,
    categoryId: 'world',
    subcategoryId: 'flags',
    question: 'Bu bayrak hangi ülkeye aittir?',
    options: makeOptions(`flag-${id}`, country, countryPool),
    correctAnswer: country,
    image: `assets/images/flags/${countryCodes[index]}.webp`,
    explanation: `${country} bayrağını gördün. Renkleri, oranı ve sembolleri ülkenin resmî bayrak tasarımını oluşturur.`
  }));

  // ISO 4217'nin 1 Ocak 2026 tarihli güncel listesi temel alınmıştır.
  const currencySpecs = `
    AFN ALL DZD EUR AOA XCD ARS AMD AUD EUR AZN BSD BHD BDT BBD BYN EUR BZD XOF BTN BOB BAM BWP BRL BND EUR XOF BIF CVE KHR XAF CAD XAF XAF CLP CNY COP KMF CDF XAF CRC XOF EUR CUP EUR CZK DKK DJF XCD DOP USD EGP USD XAF ERN EUR SZL ETB FJD EUR EUR XAF GMD GEL EUR GHS EUR XCD GTQ GNF XOF GYD HTG HNL HUF ISK INR IDR IRR IQD EUR ILS EUR JMD JPY JOD KZT KES AUD KPW KRW KWD KGS LAK EUR LBP LSL LRD LYD CHF EUR EUR MGA MWK MYR MVR XOF EUR USD MRU MUR MXN USD MDL EUR MNT EUR MAD MZN MMK NAD AUD NPR EUR NZD NIO XOF NGN MKD NOK OMR PKR USD PAB+USD PGK PYG PEN PHP PLN EUR QAR RON RUB RWF XCD XCD XCD WST EUR STN SAR XOF RSD SCR SLE SGD EUR EUR SBD SOS ZAR SSP EUR LKR SDG SRD SEK CHF SYP TJS TZS THB USD XOF TOP TTD TND TRY TMT AUD UGX UAH AED GBP USD UYU UZS VUV VES VND YER ZMW ZWG EUR MULTI EUR TWD
  `.trim().split(/\s+/);
  if (currencySpecs.length !== capitalRecords.length) throw new Error('Ülke ve para birimi sayıları eşleşmiyor.');
  const currencyDisplay = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['tr'], { type:'currency' }) : null;
  // Sorunun içindeki ülke adı cevabı ele vermesin: kendi başına ayırt edici
  // para birimlerinde milliyet sıfatı kullanılmaz. Dolar, peso, rupi, won,
  // dinar gibi ortak adlarda ise para birimini ayırmak için niteleyici korunur.
  const currencyFallbacks = { PAB:'Panama balboası', USD:'Dolar', EUR:'Euro', TRY:'Lira' };
  const conciseCurrencyNames = {
    GBP:'Sterlin', JPY:'Yen', CNY:'Yuan', RUB:'Ruble', CZK:'Koruna', HUF:'Forint',
    PLN:'Zloti', UAH:'Grivna', GEL:'Lari', AZN:'Manat', KZT:'Tenge', KGS:'Som',
    BDT:'Taka', IDR:'Rupiah', MYR:'Ringgit', MVR:'Rufiyaa', THB:'Baht', VND:'Dong',
    ETB:'Birr', BWP:'Pula', LSL:'Loti', SZL:'Lilangeni', MGA:'Ariary', MRU:'Ugiya',
    ZMW:'Kvaça', ZWG:'Zimbabwe Gold', PGK:'Kina', WST:'Tala', TOP:'Paʻanga',
    VUV:'Vatu', STN:'Dobra', GHS:'Cedi', HTG:'Gurd', PYG:'Guarani', GTQ:'Quetzal',
    HNL:'Lempira', NIO:'Cordoba', CRC:'Kolon', UYU:'Uruguay pesosu'
  };
  const currencyName = code => conciseCurrencyNames[code] || currencyFallbacks[code] || currencyDisplay?.of(code) || code;
  const currencyLabel = spec => spec === 'MULTI'
    ? 'İsrail yeni şekeli (ILS), Ürdün dinarı (JOD) ve ABD doları (USD)'
    : spec.split('+').map(code => `${currencyName(code)} (${code})`).join(' ve ');
  const currencyPool = [...new Set(currencySpecs.map(currencyLabel))];
  const currencyNotes = {
    pa:'Panama’da balboa (PAB) ve ABD doları (USD) resmî para birimleridir; balboa ABD dolarına bire bir sabitlenmiştir.',
    ps:'Filistin Devleti’nin tek bir evrensel resmî para birimi yoktur; İsrail yeni şekeli (ILS), Ürdün dinarı (JOD) ve ABD doları (USD) yaygın biçimde kullanılır.',
    bg:'Bulgaristan, 1 Ocak 2026 tarihinde Euro’yu (EUR) resmî para birimi olarak kabul etti.',
    zw:'Zimbabwe’nin ISO 4217 para birimi Zimbabwe Gold’dur (ZWG).',
    bt:'Bhutan’ın ulusal para birimi ngultrumdur; Hindistan rupisi de ülkede kabul edilir.',
    ls:'Lesotho’nun ulusal para birimi lotidir; Güney Afrika randı da yasal ödeme aracıdır.',
    na:'Namibya’nın ulusal para birimi Namibya dolarıdır; Güney Afrika randı da yasal ödeme aracıdır.'
  };
  const currencyQuestions = capitalRecords.map(([id, country], index) => {
    const spec = currencySpecs[index];
    const correctAnswer = currencyLabel(spec);
    return {
      id:`world_currencies_${id}`,
      categoryId:'world',
      subcategoryId:'currencies',
      question:`${country} ülkesinin para birimi hangisidir?`,
      options:makeOptions(`currency-${id}`, correctAnswer, currencyPool),
      correctAnswer,
      flagCode:countryCodes[index],
      explanation:currencyNotes[id] || `${country} için doğru para birimi ${correctAnswer}.`
    };
  });

  const currencyCodePriority = `TRY USD EUR GBP JPY CHF CNY RUB CAD AUD INR BRL MXN KRW SAR AED SEK NOK DKK PLN CZK HUF RON BGN ZAR EGP ILS QAR KWD SGD HKD NZD ARS CLP COP PEN UYU THB IDR MYR PHP VND PKR BDT UAH`.split(' ');
  const uniqueCurrencyCodes = [...new Set(currencySpecs.flatMap(spec => spec === 'MULTI' ? ['ILS','JOD','USD'] : spec.split('+')))];
  const orderedCurrencyCodes = [...uniqueCurrencyCodes].sort((left,right) => {
    const leftIndex=currencyCodePriority.indexOf(left), rightIndex=currencyCodePriority.indexOf(right);
    return (leftIndex<0?1000+uniqueCurrencyCodes.indexOf(left):leftIndex) - (rightIndex<0?1000+uniqueCurrencyCodes.indexOf(right):rightIndex);
  });
  const currencyNamePool = orderedCurrencyCodes.map(currencyName);
  const currencyCodeQuestions = orderedCurrencyCodes.map(code => ({
    id:`world_currency-codes_${code.toLowerCase()}`,
    categoryId:'world',
    subcategoryId:'currency-codes',
    question:`${currencyName(code)} para biriminin uluslararası kodu hangisidir?`,
    options:makeOptions(`currency-code-${code}`, code, orderedCurrencyCodes),
    correctAnswer:code,
    explanation:`${currencyName(code)} para biriminin ISO 4217 kodu ${code}’dir.`
  }));
  const codeCurrencyQuestions = orderedCurrencyCodes.map(code => ({
    id:`world_code-currencies_${code.toLowerCase()}`,
    categoryId:'world',
    subcategoryId:'code-currencies',
    question:`${code} hangi para biriminin uluslararası kodudur?`,
    options:makeOptions(`code-currency-${code}`, currencyName(code), currencyNamePool),
    correctAnswer:currencyName(code),
    explanation:`${code}, ${currencyName(code)} para biriminin ISO 4217 kodudur.`
  }));

  const artQuestions = [
    ['great-wave','Bu eserin sanatçısı kimdir?',['Katsushika Hokusai','Hiroshige','Yayoi Kusama','Takashi Murakami'],'Katsushika Hokusai','Kanagawa Açıklarında Büyük Dalga, Hokusai’nin Fuji Dağı’nın Otuz Altı Görünümü dizisindeki ahşap baskıdır.','assets/images/art/great-wave.jpg'],
    ['washington-crossing','Bu eserin sanatçısı kimdir?',['Emanuel Leutze','John Singer Sargent','Grant Wood','Edward Hopper'],'Emanuel Leutze','Washington Delaware’i Geçerken, Emanuel Leutze tarafından 1851’de yapılmıştır.','assets/images/art/washington-crossing.jpg'],
    ['wheat-field','Bu eserin sanatçısı kimdir?',['Claude Monet','Paul Cézanne','Vincent van Gogh','Paul Gauguin'],'Vincent van Gogh','Servili Buğday Tarlası, Vincent van Gogh’un 1889 tarihli eseridir.','assets/images/art/wheat-field-cypresses.jpg'],
    ['aristotle-homer','Bu eserin sanatçısı kimdir?',['Johannes Vermeer','Rembrandt','Frans Hals','Peter Paul Rubens'],'Rembrandt','Homeros Büstü ile Aristoteles, Rembrandt’ın 1653 tarihli eseridir.','assets/images/art/aristotle-homer.jpg'],
    ['mona-lisa','Mona Lisa adlı eserin ressamı kimdir?',['Michelangelo','Leonardo da Vinci','Raffaello','Sandro Botticelli'],'Leonardo da Vinci','Leonardo da Vinci, Mona Lisa üzerinde 16. yüzyılın başlarında çalışmıştır.'],
    ['guernica','Guernica adlı eserin ressamı kimdir?',['Salvador Dalí','Joan Miró','Pablo Picasso','Diego Rivera'],'Pablo Picasso','Picasso, Guernica’yı 1937’de savaşın yıkıcılığına tepki olarak yaptı.'],
    ['persistence-memory','Belleğin Azmi adlı eserin ressamı kimdir?',['René Magritte','Salvador Dalí','Max Ernst','Paul Klee'],'Salvador Dalí','Eriyen saatleriyle tanınan Belleğin Azmi, Dalí’nin sürrealist eseridir.'],
    ['birth-venus','Venüs’ün Doğuşu adlı eserin ressamı kimdir?',['Sandro Botticelli','Titian','Caravaggio','Giorgione'],'Sandro Botticelli','Venüs’ün Doğuşu, Erken Rönesans sanatçısı Botticelli’nin en tanınmış eserlerindendir.'],
    ['school-athens','Atina Okulu freskinin sanatçısı kimdir?',['Donatello','Raffaello','Leonardo da Vinci','Michelangelo'],'Raffaello','Raffaello, Atina Okulu’nda Antik Çağ filozoflarını anıtsal bir kompozisyonda buluşturur.'],
    ['night-watch','Gece Devriyesi adlı eserin ressamı kimdir?',['Rembrandt','Johannes Vermeer','Frans Hals','Jan van Eyck'],'Rembrandt','Gece Devriyesi, Rembrandt’ın hareketli grup portresi anlayışıyla öne çıkar.'],
    ['kiss','Öpücük adlı altın tonlu tablonun ressamı kimdir?',['Egon Schiele','Gustav Klimt','Edvard Munch','Henri Matisse'],'Gustav Klimt','Öpücük, Gustav Klimt’in altın döneminin simgesel eserlerinden biridir.'],
    ['water-lilies','Nilüferler dizisi hangi ressama aittir?',['Pierre-Auguste Renoir','Claude Monet','Edgar Degas','Édouard Manet'],'Claude Monet','Monet, Giverny’deki bahçesinin nilüferlerini yıllar boyunca tekrar tekrar resmetti.'],
    ['american-gothic','American Gothic adlı eserin ressamı kimdir?',['Grant Wood','Andrew Wyeth','Edward Hopper','Norman Rockwell'],'Grant Wood','Grant Wood’un 1930 tarihli American Gothic eseri Amerikan Bölgeselciliğinin simgelerindendir.'],
    ['las-meninas','Las Meninas adlı eserin ressamı kimdir?',['El Greco','Francisco Goya','Diego Velázquez','Bartolomé Murillo'],'Diego Velázquez','Velázquez’in Las Meninas’ı, bakış açısı ve ressamın kendisini kompozisyona katmasıyla ünlüdür.'],
    ['scream','Çığlık adlı eserin sanatçısı kimdir?',['Edvard Munch','Gustav Klimt','Egon Schiele','Wassily Kandinsky'],'Edvard Munch','Çığlık, Edvard Munch’un kaygı ve yabancılaşma duygusunu güçlü biçimde yansıtan eseridir.'],
    ['sunflowers','Ayçiçekleri dizisi hangi ressama aittir?',['Vincent van Gogh','Claude Monet','Paul Gauguin','Henri de Toulouse-Lautrec'],'Vincent van Gogh','Van Gogh, Arles döneminde vazodaki ayçiçeklerini konu alan bir dizi yaptı.'],
    ['last-supper','Son Akşam Yemeği adlı duvar resminin sanatçısı kimdir?',['Leonardo da Vinci','Michelangelo','Raffaello','Tintoretto'],'Leonardo da Vinci','Leonardo’nun Son Akşam Yemeği Milano’daki Santa Maria delle Grazie manastırındadır.'],
    ['liberty-leading','Halka Yol Gösteren Özgürlük adlı eserin ressamı kimdir?',['Théodore Géricault','Eugène Delacroix','Jacques-Louis David','Jean-Auguste-Dominique Ingres'],'Eugène Delacroix','Delacroix’nın eseri 1830 Temmuz Devrimi’ni alegorik biçimde anlatır.'],
    ['garden-delights','Dünyevi Zevkler Bahçesi adlı eserin ressamı kimdir?',['Hieronymus Bosch','Pieter Bruegel','Albrecht Dürer','Jan van Eyck'],'Hieronymus Bosch','Dünyevi Zevkler Bahçesi, Bosch’un ayrıntılı üç panelli eseridir.'],
    ['arnolfini','Arnolfini’nin Evlenmesi adlı eserin ressamı kimdir?',['Jan van Eyck','Hans Holbein','Rogier van der Weyden','Albrecht Dürer'],'Jan van Eyck','Jan van Eyck’ın 1434 tarihli eseri ayrıntılı yağlı boya tekniğiyle tanınır.']
  ].map(([id,question,options,correctAnswer,explanation,image])=>({ id:`art_painters_${id}`, categoryId:'art', subcategoryId:'painters', question, options, correctAnswer, explanation, ...(image?{image}:{}) }));

  const makeHistoryQuestions = (topic, rows) => rows.map(([id, question, correctAnswer, alternatives, explanation, detail]) => ({
    id:`history_${topic}_${id}`,
    categoryId:'history',
    subcategoryId:topic,
    question,
    options:makeOptions(`history-${topic}-${id}`, correctAnswer, [correctAnswer, ...alternatives]),
    correctAnswer,
    explanation,
    ...(detail?{detail}:{})
  }));

  const ancientQuestions = makeHistoryQuestions('ancient-civilizations', [
    ['nile','Antik Mısır uygarlığı hangi nehrin çevresinde gelişmiştir?','Nil',['Fırat','İndus','Sarı Irmak'],'Nil Nehri’nin düzenli taşkınları Antik Mısır tarımını ve yerleşimini destekledi.'],
    ['pharaoh','Antik Mısır hükümdarlarına verilen unvan hangisidir?','Firavun',['Konsül','Satrap','Arkhon'],'Firavun, Antik Mısır’ın siyasî ve dinî lideri kabul edilirdi.'],
    ['hieroglyph','Antik Mısır’ın resim karakterli yazı sisteminin adı nedir?','Hiyeroglif',['Çivi yazısı','Linear B','Fenike alfabesi'],'Hiyeroglifler anıtlarda, mezarlarda ve dinî metinlerde kullanıldı.'],
    ['mesopotamia','Mezopotamya hangi iki nehir arasındaki bölgedir?','Dicle ve Fırat',['Nil ve Kongo','İndus ve Ganj','Tuna ve Ren'],'Mezopotamya adı, Dicle ve Fırat nehirleri arasındaki bölgeyi ifade eder.'],
    ['cuneiform','Çivi yazısını geliştiren uygarlık hangisidir?','Sümerler',['Romalılar','İnkalar','Fenikeliler'],'Sümerler, kil tabletler üzerine işlenen çivi yazısının ilk örneklerini geliştirdi.'],
    ['hammurabi','Hammurabi Kanunları hangi uygarlığa aittir?','Babil',['Mısır','Urartu','Maya'],'Babil Kralı Hammurabi’nin kanunları, yazılı hukuk tarihinin önemli örneklerindendir.'],
    ['athens','Doğrudan demokrasi uygulamalarıyla tanınan Antik Yunan polis devleti hangisidir?','Atina',['Sparta','Korint','Teb'],'Atina’da yurttaşlar belirli siyasî kararlara doğrudan katılabiliyordu.'],
    ['sparta','Askerî eğitim ve disiplinle öne çıkan Antik Yunan polis devleti hangisidir?','Sparta',['Atina','Milet','Efes'],'Sparta toplumu askerî eğitim ve sıkı disiplin üzerine kuruluydu.'],
    ['rome-peninsula','Roma uygarlığı hangi yarımadada doğmuştur?','İtalya Yarımadası',['İber Yarımadası','Arap Yarımadası','Balkan Yarımadası'],'Roma, İtalya Yarımadası’nın orta kesiminde kurulup Akdeniz’e yayıldı.'],
    ['latin','Roma İmparatorluğu’nun temel yönetim ve kültür dillerinden biri hangisidir?','Latince',['Sanskritçe','Akadca','Aramice'],'Latince, Batı Roma dünyasının yönetim ve hukuk diliydi.'],
    ['colosseum','Gladyatör karşılaşmalarıyla tanınan Roma yapısı hangisidir?','Kolezyum',['Parthenon','Ziggurat','Stonehenge'],'Roma’daki Kolezyum büyük gösteriler ve gladyatör karşılaşmaları için kullanıldı.'],
    ['alexander','Büyük İskender hangi krallığın hükümdarıydı?','Makedonya',['Lidya','Asur','Kartaca'],'Büyük İskender, Makedonya kralı olarak geniş bir imparatorluk kurdu.'],
    ['royal-road','Kral Yolu hangi imparatorluk döneminde geniş bir haberleşme ağına dönüştü?','Pers İmparatorluğu',['İnka İmparatorluğu','Roma İmparatorluğu','Gupta İmparatorluğu'],'Ahameniş Persleri Kral Yolu’nu yönetim ve haberleşmede kullandı.'],
    ['phoenicians','Akdeniz ticareti ve alfabenin yayılmasıyla tanınan uygarlık hangisidir?','Fenikeliler',['Hititler','Sümerler','Etrüskler'],'Fenikeli denizciler alfabe temelli yazının Akdeniz’de yayılmasında etkili oldu.'],
    ['hattusa','Hitit İmparatorluğu’nun başkenti hangisidir?','Hattuşa',['Ninova','Ur','Memfis'],'Hattuşa, günümüzde Çorum sınırlarında bulunan Hitit başkentidir.'],
    ['kadesh','Kadeş Antlaşması hangi iki güç arasında yapılmıştır?','Mısır ve Hititler',['Roma ve Kartaca','Persler ve Yunanlar','Asur ve Babil'],'Kadeş Antlaşması Mısır ile Hititler arasındaki çatışmaların ardından yapıldı.'],
    ['indus-city','Mohenjo-daro hangi uygarlığın önemli kentlerinden biridir?','İndus Vadisi Uygarlığı',['Olmek Uygarlığı','Minos Uygarlığı','Urartu Uygarlığı'],'Mohenjo-daro, planlı yapısıyla İndus Vadisi Uygarlığı’nın önemli merkezidir.'],
    ['terracotta','Terrakotta Ordusu hangi Çin hükümdarı için hazırlanmıştır?','Qin Shi Huang',['Kubilay Han','Wu Zetian','Konfüçyüs'],'Terrakotta askerleri Çin’in ilk imparatoru Qin Shi Huang’ın mezar kompleksi için yapıldı.'],
    ['silk-road','İpek Yolu temel olarak Çin’i hangi bölgeye bağlayan ticaret ağının parçasıydı?','Orta Asya ve Akdeniz dünyasına',['Avustralya’ya','Güney Amerika’ya','Sahra Altı Afrika’ya'],'İpek Yolu, Doğu Asya ile Orta Asya ve Akdeniz dünyası arasında mal ve fikir taşıdı.'],
    ['maya','Gelişmiş takvimleri ve şehir devletleriyle tanınan Orta Amerika uygarlığı hangisidir?','Maya',['İnka','Fenike','Asur'],'Maya uygarlığı yazı, matematik, astronomi ve takvim çalışmalarıyla tanınır.'],
    ['aztec-capital','Aztek İmparatorluğu’nun başkenti hangisidir?','Tenochtitlan',['Cusco','Teotihuacan','Chichén Itzá'],'Tenochtitlan, günümüz Mexico City bölgesinde kurulmuş Aztek başkentiydi.'],
    ['inca-region','İnka İmparatorluğu ağırlıklı olarak hangi coğrafyada gelişmiştir?','And Dağları',['Sahra Çölü','Mezopotamya Ovası','İskandinavya'],'İnka İmparatorluğu, Güney Amerika’daki And Dağları boyunca yayıldı.'],
    ['hannibal','Hannibal hangi devletin komutanıydı?','Kartaca',['Roma','Makedonya','Pers'],'Hannibal, İkinci Pön Savaşı’nda Roma’ya karşı savaşan Kartacalı komutandı.','İkinci Pön Savaşı, MÖ 218–201 yılları arasında Akdeniz hâkimiyeti için Kartaca ile Roma arasında yapıldı. Hannibal ordusunu ve savaş fillerini Alplerden geçirerek İtalya’ya girdi; ancak savaş sonunda Roma galip geldi.'],
    ['minoan','Minos uygarlığı hangi adada gelişmiştir?','Girit',['Sicilya','Kıbrıs','Sardinya'],'Minos uygarlığının merkezi Girit Adası’ndaki Knossos çevresiydi.'],
    ['linear-b','Linear B yazısı hangi uygarlıkla ilişkilidir?','Miken',['Fenike','Olmek','Urartu'],'Linear B, Miken saraylarında kullanılan erken bir Yunanca yazı sistemidir.'],
    ['nineveh','Ninova hangi imparatorluğun önemli başkentlerinden biriydi?','Asur',['Hitit','İnka','Aksum'],'Ninova, Yeni Asur İmparatorluğu’nun büyük siyasî ve kültürel merkezlerinden biriydi.'],
    ['lydia-coin','Madeni paranın erken sistemli kullanımını geliştirmesiyle tanınan Anadolu uygarlığı hangisidir?','Lidyalılar',['Frigler','Urartular','İyonlar'],'Lidyalılar, elektrondan basılan erken madeni paralarla tanınır.'],
    ['urartu-center','Urartu Krallığı’nın merkez bölgesi hangi gölün çevresindeydi?','Van Gölü',['Tuz Gölü','Beyşehir Gölü','İznik Gölü'],'Urartu Krallığı Van Gölü çevresinde gelişti; başlıca merkezi Tuşpa’ydı.'],
    ['olmec','Olmek uygarlığı hangi kültür bölgesinde gelişmiştir?','Mezoamerika',['Mezopotamya','Polinezya','İndus Vadisi'],'Olmekler, Meksika Körfezi kıyılarındaki erken Mezoamerika uygarlıklarındandır.'],
    ['satrapy','Ahameniş Pers İmparatorluğu’nun idarî eyaletlerine ne ad verilirdi?','Satraplık',['Nomos','Polis','Tema'],'Pers eyaletleri satraplık, yöneticileri ise satrap olarak adlandırılırdı.']
  ]);

  const turkishHistoryQuestions = makeHistoryQuestions('turkish-history', [
    ['gokturk','Adında “Türk” sözcüğünü kullanan ilk devlet hangisidir?','Göktürk Kağanlığı',['Uygur Kağanlığı','Karahanlılar','Gazneliler'],'Göktürk Kağanlığı, Türk adını devlet adı olarak kullanan ilk siyasî oluşumdur.'],
    ['orkhon','Orhun Yazıtları hangi Türk devleti dönemine aittir?','II. Göktürk Kağanlığı',['Büyük Selçuklu Devleti','Osmanlı Devleti','Türkiye Selçuklu Devleti'],'Orhun Yazıtları Bilge Kağan, Kül Tigin ve Tonyukuk adına II. Göktürk döneminde dikildi.'],
    ['kut','Eski Türk devlet geleneğinde hükümdarlık yetkisinin ilahî kaynağını anlatan kavram hangisidir?','Kut',['Tımar','Ahilik','Devşirme'],'Kut anlayışı, yönetme yetkisinin Gök Tanrı tarafından verildiğini ifade eder.'],
    ['uyghur','Yerleşik yaşam ve şehir kültürüyle öne çıkan erken Türk devleti hangisidir?','Uygur Kağanlığı',['Avrupa Hun Devleti','Avar Kağanlığı','Hazar Kağanlığı'],'Uygurlar yerleşik yaşam, şehirleşme, sanat ve yazılı kültürde önemli gelişmeler gösterdi.'],
    ['manzikert-date','Malazgirt Meydan Muharebesi hangi yılda gerçekleşmiştir?','1071',['1040','1176','1243'],'1071 Malazgirt Zaferi, Anadolu’daki Türk yerleşiminin hızlanmasında dönüm noktası oldu.'],
    ['manzikert-ruler','Malazgirt Savaşı’nda Büyük Selçuklu hükümdarı kimdi?','Alp Arslan',['Tuğrul Bey','Melikşah','Kılıç Arslan'],'Sultan Alp Arslan, 1071’de Bizans İmparatoru Romen Diyojen’e karşı zafer kazandı.'],
    ['anatolian-seljuk','Başkentini Konya’ya taşıyan Anadolu Türk devleti hangisidir?','Türkiye Selçuklu Devleti',['Karahanlılar','Memlükler','Gazneliler'],'Türkiye Selçuklu Devleti’nin başlıca siyasî ve kültürel merkezi Konya oldu.'],
    ['ottoman-founder','Osmanlı Beyliği’nin kurucusu kabul edilen kişi kimdir?','Osman Bey',['Orhan Bey','Ertuğrul Gazi','I. Murad'],'Osman Bey, kendi adıyla anılan Osmanlı hanedanının ve beyliğinin kurucusu kabul edilir.'],
    ['conquest-date','İstanbul’un fethi hangi yılda gerçekleşmiştir?','1453',['1402','1517','1526'],'Fatih Sultan Mehmed komutasındaki Osmanlı ordusu İstanbul’u 1453’te fethetti.'],
    ['conqueror','İstanbul’u fetheden Osmanlı padişahı kimdir?','Fatih Sultan Mehmed',['Yıldırım Bayezid','Kanuni Sultan Süleyman','Yavuz Sultan Selim'],'II. Mehmed, İstanbul’un fethinden sonra Fatih unvanıyla anıldı.'],
    ['selim-egypt','Mısır’ı Osmanlı topraklarına katan padişah kimdir?','Yavuz Sultan Selim',['II. Bayezid','II. Mahmud','I. Ahmed'],'Yavuz Sultan Selim’in 1516-1517 seferleriyle Suriye ve Mısır Osmanlı egemenliğine girdi.'],
    ['suleiman','En uzun süre tahtta kalan Osmanlı padişahı kimdir?','Kanuni Sultan Süleyman',['Fatih Sultan Mehmed','II. Abdülhamid','I. Murad'],'Kanuni Sultan Süleyman 1520’den 1566’ya kadar hüküm sürdü.'],
    ['tanzimat','Tanzimat Fermanı hangi yılda ilan edilmiştir?','1839',['1808','1856','1876'],'Gülhane Hatt-ı Hümayunu olarak da bilinen Tanzimat Fermanı 1839’da ilan edildi.'],
    ['first-constitution','Osmanlı Devleti’nin ilk anayasasının adı nedir?','Kanun-ı Esasi',['Teşkilât-ı Esasiye','Sened-i İttifak','Islahat Fermanı'],'Kanun-ı Esasi 1876’da ilan edilerek Birinci Meşrutiyet dönemini başlattı.'],
    ['second-constitutional','II. Meşrutiyet hangi yılda ilan edilmiştir?','1908',['1876','1909','1912'],'II. Meşrutiyet 1908’de meclisin yeniden açılmasıyla başladı.'],
    ['balkan-wars','Balkan Savaşları hangi yıllarda gerçekleşmiştir?','1912-1913',['1908-1909','1914-1915','1919-1920'],'Birinci ve İkinci Balkan savaşları 1912 ile 1913 yıllarında gerçekleşti.'],
    ['ww1-side','Osmanlı Devleti I. Dünya Savaşı’na hangi blokta katılmıştır?','İttifak Devletleri',['İtilaf Devletleri','Bağlantısızlar','Kutsal İttifak'],'Osmanlı Devleti Almanya ve müttefiklerinin bulunduğu İttifak Devletleri yanında savaşa girdi.'],
    ['gallipoli','Çanakkale Savaşları hangi dünya savaşı sırasında gerçekleşmiştir?','I. Dünya Savaşı',['Kırım Savaşı','II. Dünya Savaşı','Balkan Savaşları'],'Çanakkale cepheleri 1915-1916 yıllarında I. Dünya Savaşı sırasında açıldı.'],
    ['mudros','Mondros Ateşkes Antlaşması hangi yılda imzalanmıştır?','1918',['1914','1919','1920'],'Mondros Ateşkes Antlaşması 30 Ekim 1918’de imzalandı.'],
    ['samsun','Mustafa Kemal Paşa Samsun’a hangi tarihte çıktı?','19 Mayıs 1919',['23 Nisan 1920','30 Ağustos 1922','29 Ekim 1923'],'19 Mayıs 1919, Millî Mücadele’nin başlangıç simgelerinden biri kabul edilir.'],
    ['erzurum','“Vatan bir bütündür, parçalanamaz” kararı hangi kongrede vurgulanmıştır?','Erzurum Kongresi',['Sivas Kongresi','Balıkesir Kongresi','Alaşehir Kongresi'],'Erzurum Kongresi’nde millî sınırlar içindeki vatanın bir bütün olduğu vurgulandı.'],
    ['sivas','Millî cemiyetlerin Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti altında birleştiği kongre hangisidir?','Sivas Kongresi',['Erzurum Kongresi','Amasya Görüşmeleri','Londra Konferansı'],'Sivas Kongresi’nde bölgesel direniş cemiyetleri tek çatı altında birleştirildi.'],
    ['tbmm','Türkiye Büyük Millet Meclisi ne zaman açılmıştır?','23 Nisan 1920',['19 Mayıs 1919','20 Ocak 1921','1 Kasım 1922'],'TBMM 23 Nisan 1920’de Ankara’da açıldı.'],
    ['sakarya','“Hattı müdafaa yoktur, sathı müdafaa vardır” sözü hangi savaşla ilişkilidir?','Sakarya Meydan Muharebesi',['I. İnönü Savaşı','Büyük Taarruz','Kütahya-Eskişehir Savaşları'],'Mustafa Kemal Paşa bu emri 1921 Sakarya Meydan Muharebesi sırasında verdi.'],
    ['great-offensive','Büyük Taarruz hangi yılda başlamıştır?','1922',['1920','1921','1923'],'Büyük Taarruz 26 Ağustos 1922’de başladı ve 30 Ağustos zaferiyle sonuçlandı.'],
    ['lausanne','Türkiye’nin uluslararası bağımsızlığını tanıyan temel barış antlaşması hangisidir?','Lozan Barış Antlaşması',['Sevr Antlaşması','Moskova Antlaşması','Ankara Antlaşması'],'Lozan Barış Antlaşması 24 Temmuz 1923’te imzalandı.'],
    ['republic','Türkiye Cumhuriyeti ne zaman ilan edilmiştir?','29 Ekim 1923',['23 Nisan 1920','1 Kasım 1922','3 Mart 1924'],'Cumhuriyet 29 Ekim 1923’te ilan edildi ve Mustafa Kemal ilk cumhurbaşkanı seçildi.'],
    ['caliphate','Halifelik hangi yılda kaldırılmıştır?','1924',['1922','1923','1928'],'Halifelik 3 Mart 1924 tarihinde kaldırıldı.'],
    ['alphabet','Yeni Türk harfleri hangi yılda kabul edilmiştir?','1928',['1924','1930','1934'],'Latin temelli yeni Türk alfabesi 1 Kasım 1928’de kabul edildi.'],
    ['hatay','Hatay hangi yılda Türkiye’ye katılmıştır?','1939',['1923','1936','1945'],'Hatay Meclisinin kararıyla Hatay 1939’da Türkiye’ye katıldı.']
  ]);

  const turkishHistoryPeriods = [
    {
      id:'pre-islamic', mark:'I', title:'İslamiyet Öncesi Türk Tarihi',
      topics:['Orta Asya ve İlk Türkler','Asya Hun Devleti','Avrupa Hun Devleti','Göktürkler','Uygurlar','Diğer Türk Devletleri ve Toplulukları','İlk Türklerde Kültür ve Medeniyet'],
      questionIds:['gokturk','orkhon','kut','uyghur']
    },
    {
      id:'first-turkish-islamic', mark:'II', title:'İlk Türk-İslam Devletleri',
      topics:['Türklerin İslamiyet’i Kabulü','Karahanlılar','Gazneliler','Büyük Selçuklu Devleti','Diğer Türk-İslam Devletleri','Türk-İslam Kültür ve Medeniyeti'],
      questionIds:['manzikert-date','manzikert-ruler']
    },
    {
      id:'anatolian-seljuks', mark:'III', title:'Anadolu Selçukluları ve Beylikler',
      topics:['Anadolu’nun Türkleşmesi ve İlk Türk Beylikleri','Türkiye Selçuklu Devleti','İkinci Dönem Anadolu Beylikleri','Anadolu’da Türk-İslam Kültür ve Medeniyeti'],
      questionIds:['anatolian-seljuk']
    },
    {
      id:'ottoman', mark:'IV', title:'Osmanlı Tarihi',
      topics:['Kuruluş Dönemi','Yükseliş Dönemi','17. Yüzyıl Osmanlı Tarihi','18. Yüzyıl Osmanlı Tarihi','19. Yüzyıl Osmanlı Tarihi','Osmanlı’nın Son Dönemi','Osmanlı Kültür ve Medeniyeti'],
      questionIds:['ottoman-founder','conquest-date','conqueror','selim-egypt','suleiman','tanzimat','first-constitution','second-constitutional','balkan-wars','ww1-side','gallipoli','mudros']
    },
    {
      id:'national-struggle-ataturk', mark:'V', title:'Millî Mücadele ve Atatürk Dönemi',
      topics:['Millî Mücadele’ye Hazırlık','TBMM ve Kurtuluş Savaşı','Cumhuriyet’in Kuruluşu ve İnkılaplar','Atatürk İlkeleri','Atatürk Dönemi İç Politikası','Atatürk Dönemi Dış Politikası'],
      questionIds:['samsun','erzurum','sivas','tbmm','sakarya','great-offensive','lausanne','republic','caliphate','alphabet','hatay']
    },
    {
      id:'republic', mark:'VI', title:'Cumhuriyet Dönemi',
      topics:['İnönü Dönemi ve II. Dünya Savaşı','Çok Partili Hayata Geçiş ve Demokrat Parti Dönemi','1960–1980 Dönemi','1980–2000 Dönemi','2000 Sonrası Türkiye','Cumhuriyet Dönemi Kültür, Toplum ve Ekonomi'],
      questionIds:[]
    },
    {
      id:'turkic-world', mark:'VII', title:'Türk Dünyası',
      topics:['Azerbaycan ve Kafkasya Türkleri','Orta Asya Türk Cumhuriyetleri','Kıbrıs Türk Tarihi','Diğer Türk Toplulukları','Çağdaş Türk Dünyası'],
      questionIds:[]
    }
  ];

  // Sorular yalnızca doğrudan bilgi ölçer; otomatik eşleştirme sorusu üretilmez.
  const turkishHistoryFacts = {
    'pre-islamic':[
      ['asia-huns','Asya Hun Devleti’nin bilinen en güçlü hükümdarı kimdir?','Mete Han'],['mete-date','Mete Han’ın tahta çıkışı geleneksel olarak hangi yıla tarihlenir?','MÖ 209'],['onlu','Onlu askerî teşkilat kiminle ilişkilendirilir?','Mete Han'],['europe-huns','Avrupa Hun Devleti’nin en tanınmış hükümdarı kimdir?','Attila'],['gokturk-name','Türk adını devlet adı olarak kullanan ilk siyasî teşkilat hangisidir?','Göktürk Kağanlığı'],['gokturk-founder','I. Göktürk Kağanlığı’nın kurucusu kimdir?','Bumin Kağan'],['orkhon','Orhun Yazıtları hangi alfabe ile yazılmıştır?','Göktürk alfabesi'],['tonyukuk','Kendi adına yazıt diktiren Türk devlet adamı kimdir?','Tonyukuk'],['uyghur-capital','Uygur Kağanlığı’nın başkenti neresidir?','Karabalgasun'],['uyghur-life','Yerleşik yaşama geçen ilk Türk devletlerinden biri hangisidir?','Uygurlar'],['kut','Hükümdarlık yetkisinin ilahî kaynağını anlatan kavram nedir?','Kut'],['kurultay','Eski Türklerde devlet işlerinin görüşüldüğü meclise ne denirdi?','Kurultay'],['tore','Eski Türklerde yazısız hukuk kurallarına ne denirdi?','Töre'],['kurgan','Eski Türk mezarlarına verilen ad nedir?','Kurgan'],['balbal','Mezar çevresine dikilen taş heykellere ne denirdi?','Balbal']
    ],
    'first-turkish-islamic':[
      ['talas','Türklerle Müslüman Arapların yakınlaşmasını hızlandıran savaş hangisidir?','Talas Savaşı'],['karahanli','İslamiyet’i kabul eden ilk Türk devleti hangisidir?','Karahanlılar'],['satuk','İslamiyet’i kabul eden Karahanlı hükümdarı kimdir?','Satuk Buğra Han'],['kutadgu','Kutadgu Bilig’in yazarı kimdir?','Yusuf Has Hacib'],['divan-lugat','Dîvânu Lugâti’t-Türk’ün yazarı kimdir?','Kaşgarlı Mahmud'],['atabetul','Atabetü’l-Hakayık’ın yazarı kimdir?','Edip Ahmet Yüknekî'],['gazne-founder','Gaznelileri imparatorluk hâline getiren hükümdar kimdir?','Gazneli Mahmud'],['biruni','Gazneli sarayında çalışan büyük bilgin kimdir?','Bîrûnî'],['dandanakan','Büyük Selçuklu Devleti’nin kuruluşunu kesinleştiren savaş hangisidir?','Dandanakan Savaşı'],['tugrul','Büyük Selçuklu Devleti’nin ilk sultanı kimdir?','Tuğrul Bey'],['alp','Malazgirt Zaferi’nin Selçuklu hükümdarı kimdir?','Alp Arslan'],['meliksah','Büyük Selçukluların en geniş sınırlara ulaştığı hükümdar kimdir?','Melikşah'],['nizamulmulk','Siyasetnâme’nin yazarı kimdir?','Nizâmülmülk'],['nizamiye','Büyük Selçukluların ünlü yükseköğretim kurumları hangileridir?','Nizamiye Medreseleri'],['ikta','Selçuklularda vergi gelirinin hizmet karşılığı tahsisine ne denirdi?','İkta']
    ],
    'anatolian-seljuks':[
      ['manzikert','Anadolu’nun Türkleşmesini hızlandıran 1071 savaşı hangisidir?','Malazgirt Savaşı'],['danismend','Sivas merkezli ilk Türk beyliği hangisidir?','Danişmentliler'],['saltuk','Erzurum çevresinde kurulan ilk Türk beyliği hangisidir?','Saltuklular'],['mengucek','Erzincan ve Divriği çevresinde kurulan beylik hangisidir?','Mengücekliler'],['artuk','Mardin ve çevresinde hüküm süren beylik hangisidir?','Artuklular'],['seljuk-founder','Türkiye Selçuklu Devleti’nin kurucusu kimdir?','Kutalmışoğlu Süleyman Şah'],['first-capital','Türkiye Selçuklularının ilk başkenti neresidir?','İznik'],['konya','Türkiye Selçuklularının uzun süreli başkenti neresidir?','Konya'],['miryokefalon','Bizans’ın Anadolu’yu geri alma ümidini büyük ölçüde bitiren savaş hangisidir?','Miryokefalon Savaşı'],['alaeddin','Türkiye Selçuklularının en parlak dönem hükümdarı kimdir?','I. Alâeddin Keykubad'],['kosedag','Türkiye Selçuklularını Moğol baskısı altına sokan savaş hangisidir?','Kösedağ Savaşı'],['caravanserai','Ticaret yollarındaki konaklama yapılarına ne denirdi?','Kervansaray'],['ahi','Esnaf dayanışma teşkilatına ne denirdi?','Ahilik'],['karaman','Türkçeyi resmî dil ilan etmesiyle bilinen beylik hangisidir?','Karamanoğulları'],['ottoman-beylik','Bilecik ve Söğüt çevresinde gelişen beylik hangisidir?','Osmanoğulları']
    ],
    'ottoman':[
      ['founder','Osmanlı Beyliği’nin kurucusu kimdir?','Osman Bey'],['bursa','Bursa’yı fethederek başkent yapan hükümdar kimdir?','Orhan Bey'],['edirne','Edirne’yi fetheden Osmanlı hükümdarı kimdir?','I. Murad'],['ankara','1402 Ankara Savaşı’nda Osmanlıların rakibi kimdi?','Timur'],['conquest','İstanbul’u fetheden padişah kimdir?','Fatih Sultan Mehmed'],['caldiran','1514 Çaldıran Savaşı hangi devletle yapıldı?','Safevî Devleti'],['egypt','Mısır’ı Osmanlı yönetimine katan padişah kimdir?','Yavuz Sultan Selim'],['mohacs','1526 Mohaç Zaferi hangi padişah dönemindedir?','Kanuni Sultan Süleyman'],['karlofca','Osmanlı’nın büyük çapta toprak kaybettiği 1699 antlaşması hangisidir?','Karlofça Antlaşması'],['tulip','Lâle Devri hangi padişah dönemindedir?','III. Ahmed'],['tanzimat','Tanzimat Fermanı hangi yıl ilan edildi?','1839'],['constitution','İlk Osmanlı anayasasının adı nedir?','Kanun-ı Esasi'],['second','II. Meşrutiyet hangi yıl ilan edildi?','1908'],['mudros','Osmanlı için I. Dünya Savaşı’nı bitiren ateşkes hangisidir?','Mondros Ateşkes Antlaşması'],['timar','Dirlik gelirlerine dayalı askerî-idarî sisteme ne denirdi?','Tımar sistemi']
    ],
    'national-struggle-ataturk':[
      ['samsun','Mustafa Kemal’in Samsun’a çıktığı tarih nedir?','19 Mayıs 1919'],['amasya','Millî Mücadele’nin amacı ve yöntemini açıklayan genelge hangisidir?','Amasya Genelgesi'],['erzurum','“Vatan bir bütündür” kararı hangi kongrede alındı?','Erzurum Kongresi'],['sivas','Millî cemiyetler hangi kongrede birleştirildi?','Sivas Kongresi'],['tbmm','TBMM hangi tarihte açıldı?','23 Nisan 1920'],['inonu','Düzenli ordunun Batı Cephesi’ndeki ilk başarısı hangisidir?','I. İnönü Savaşı'],['sakarya','Başkomutanlık Meydan Muharebesi olarak da anılan 1921 savaşı hangisidir?','Sakarya Meydan Muharebesi'],['offensive','Büyük Taarruz hangi tarihte başladı?','26 Ağustos 1922'],['mudanya','Silahlı mücadeleyi fiilen bitiren ateşkes hangisidir?','Mudanya Ateşkesi'],['lausanne','Yeni Türk devletinin bağımsızlığını tanıyan antlaşma hangisidir?','Lozan Barış Antlaşması'],['republic','Cumhuriyet hangi tarihte ilan edildi?','29 Ekim 1923'],['caliphate','Halifelik hangi yıl kaldırıldı?','1924'],['alphabet','Yeni Türk harfleri hangi yıl kabul edildi?','1928'],['surname','Soyadı Kanunu hangi yıl kabul edildi?','1934'],['hatay','Hatay hangi yıl Türkiye’ye katıldı?','1939']
    ],
    'republic':[
      ['inonu-president','Atatürk’ten sonra cumhurbaşkanı kim oldu?','İsmet İnönü'],['ww2','Türkiye II. Dünya Savaşı’nın büyük bölümünde nasıl bir politika izledi?','Savaş dışında kalma'],['un','Türkiye Birleşmiş Milletlere hangi yıl kurucu üye oldu?','1945'],['multi','Türkiye’de çok partili hayata kalıcı geçiş hangi yıl başladı?','1946'],['dp','1950 seçimlerini hangi parti kazandı?','Demokrat Parti'],['menderes','1950-1960 arasında başbakanlık yapan siyasetçi kimdir?','Adnan Menderes'],['nato','Türkiye NATO’ya hangi yıl katıldı?','1952'],['korea','Türkiye 1950’de hangi savaşa asker gönderdi?','Kore Savaşı'],['1960','27 Mayıs askerî müdahalesi hangi yıl gerçekleşti?','1960'],['constitution61','1961 Anayasası hangi süreçten sonra hazırlandı?','27 Mayıs müdahalesi'],['cyprus74','Kıbrıs Barış Harekâtı hangi yıl yapıldı?','1974'],['1980','12 Eylül askerî müdahalesi hangi yıl gerçekleşti?','1980'],['constitution82','Hâlen yürürlükte olan anayasa hangi yıl halkoyuna sunuldu?','1982'],['customs','Türkiye-AB Gümrük Birliği hangi yıl yürürlüğe girdi?','1996'],['currency','Türk lirasından altı sıfır hangi yıl atıldı?','2005']
    ],
    'turkic-world':[
      ['azerbaijan-capital','Azerbaycan’ın başkenti neresidir?','Bakü'],['azerbaijan-independence','Azerbaycan bağımsızlığını yeniden hangi yıl ilan etti?','1991'],['kazakhstan-capital','Kazakistan’ın başkenti neresidir?','Astana'],['kyrgyzstan-capital','Kırgızistan’ın başkenti neresidir?','Bişkek'],['uzbekistan-capital','Özbekistan’ın başkenti neresidir?','Taşkent'],['turkmenistan-capital','Türkmenistan’ın başkenti neresidir?','Aşkabat'],['turkic-independence','Orta Asya Türk cumhuriyetlerinin çoğu hangi devletin dağılmasıyla bağımsız oldu?','Sovyetler Birliği'],['trnc','Kuzey Kıbrıs Türk Cumhuriyeti hangi yıl ilan edildi?','1983'],['cyprus-operation','Kıbrıs Barış Harekâtı hangi yıl yapıldı?','1974'],['tatarstan','Tataristan’ın başkenti neresidir?','Kazan'],['gagauz','Gagavuz Yeri hangi ülke sınırları içindedir?','Moldova'],['east-turkestan','Doğu Türkistan olarak da anılan bölgenin resmî adı nedir?','Sincan Uygur Özerk Bölgesi'],['turkic-council','Türk Devletleri Teşkilatının eski adı nedir?','Türk Keneşi'],['turansez','TÜRKSOY hangi alanda iş birliği yürütür?','Türk kültürü ve sanatı'],['alphabet','Ortak Türk Alfabesi çalışmalarının temel amacı nedir?','Türk dilleri arasında yazı birliğini güçlendirmek']
    ]
  };
  const preIslamicUnits = [
    [
      ['central-asia','İlk Türk topluluklarının ana yurdu kabul edilen bölge neresidir?','Orta Asya'],['altai','Türklerin erken dönem kültür çevrelerinden biri sayılan dağlar hangileridir?','Altay Dağları'],['steppe','Orta Asya Türk yaşamını şekillendiren geniş otlak coğrafyasına ne denir?','Bozkır'],['nomadic','Mevsimlere göre otlak değiştirmeye dayalı yaşam biçimi nedir?','Konargöçer yaşam'],['horse','Bozkır kültüründe ulaşım ve savaş gücünün temel hayvanı hangisidir?','At'],['herding','Erken Türk ekonomisinin temel geçim kaynağı neydi?','Hayvancılık'],['yurt','Taşınabilir Türk çadırına ne ad verilir?','Yurt'],['sakha','Sakalar hangi adla da bilinir?','İskitler'],['tomris','Saka hükümdarı olarak tanınan kadın hükümdar kimdir?','Tomris Hatun'],['alp-er','Saka çevresiyle ilişkilendirilen destan kahramanı kimdir?','Alp Er Tunga'],['shu','Saka Türkleriyle ilişkilendirilen destan hangisidir?','Şu Destanı'],['migration','Boyların iklim, nüfus ve otlak nedenleriyle yer değiştirmesine ne denir?','Göç'],['oxus','Orta Asya’nın önemli tarihî nehirlerinden Ceyhun’un günümüzdeki adı nedir?','Amu Derya'],['jaxartes','Seyhun Nehri’nin günümüzdeki adı nedir?','Siri Derya'],['balgasun','Eski Türklerde şehir için kullanılan sözcüklerden biri hangisidir?','Balık']
    ],
    [
      ['teoman','Asya Hun Devleti’nin bilinen ilk hükümdarı kimdir?','Teoman'],['mete','Asya Hun Devleti’nin en güçlü hükümdarı kimdir?','Mete Han'],['mete-year','Mete Han’ın tahta çıkışı hangi yıla tarihlenir?','MÖ 209'],['decimal','Onlu askerî sistem kiminle ilişkilendirilir?','Mete Han'],['modu','Çin kaynaklarında Mete Han hangi adla anılır?','Mao-tun'],['shanyu','Hun hükümdarlarının kullandığı unvan hangisidir?','Şanyu'],['china','Asya Hunlarının başlıca siyasî rakibi hangi devletti?','Çin'],['wall','Çin’in kuzeyden gelen akınlara karşı güçlendirdiği savunma yapısı hangisidir?','Çin Seddi'],['heqin','Çin ile Hunlar arasındaki evlilik ve barış siyasetine ne ad verilir?','Heqin'],['kiok','Mete Han’dan sonra hükümdar olan oğlu kimdir?','Ki-ok'],['civil-war','Asya Hunlarının zayıflamasında hangi iç sorun etkili oldu?','Taht mücadeleleri'],['split','Asya Hun Devleti hangi iki kola ayrıldı?','Kuzey ve Güney Hunları'],['south','Çin egemenliğini kabul eden kol hangisidir?','Güney Hunları'],['north','Batıya yönelen Hun toplulukları ağırlıkla hangi koldandı?','Kuzey Hunları'],['organization','Hun siyasî yapısının temel toplumsal birimi neydi?','Boy']
    ],
    [
      ['balamir','Avrupa Hun Devleti’nin kurucusu kabul edilen hükümdar kimdir?','Balamir'],['migration-start','Kavimler Göçü’nü hızlandıran topluluk hangisidir?','Hunlar'],['migration-year','Kavimler Göçü geleneksel olarak hangi yılda başlatılır?','375'],['uldir','Doğu Roma üzerine sefer yapan erken Hun hükümdarı kimdir?','Uldız'],['rua','Attila’dan önce Hun birliğini güçlendiren hükümdar kimdir?','Rua'],['attila','Avrupa Hunlarının en tanınmış hükümdarı kimdir?','Attila'],['bled','Attila başlangıçta devleti hangi kardeşiyle yönetti?','Bleda'],['margus','Doğu Roma ile 434’te yapılan antlaşma hangisidir?','Margos Antlaşması'],['anatolia','Hunların Anadolu’ya ilk akınları hangi hükümdarlar döneminde yapıldı?','Uldız dönemi'],['catalaunian','Attila’nın Batı Roma ve müttefikleriyle savaştığı 451 muharebesi hangisidir?','Katalaun Ovası Savaşı'],['italy','Attila 452’de hangi yarımadaya sefer düzenledi?','İtalya Yarımadası'],['capital-hun','Avrupa Hunlarının merkezi hangi havzada bulunuyordu?','Macaristan Ovası'],['death','Attila hangi yıl öldü?','453'],['sons','Attila’nın ölümünden sonra devleti zayıflatan temel olay neydi?','Oğulları arasındaki mücadele'],['legacy','Avrupa Hun hâkimiyetinin sona erdiği savaş hangisidir?','Nedao Savaşı']
    ],
    [
      ['founder','I. Göktürk Devleti’nin kurucusu kimdir?','Bumin Kağan'],['year','Göktürk Kağanlığı hangi yıl kuruldu?','552'],['name','Türk adını devlet adı yapan ilk devlet hangisidir?','Göktürk Kağanlığı'],['otuken','Göktürklerin yönetim merkezi kabul edilen bölge neresidir?','Ötüken'],['istemijabgu','Devletin batı kanadını yöneten kişi kimdi?','İstemi Yabgu'],['avar-end','Göktürkler bağımsızlıklarını hangi devlete karşı kazandı?','Avar Kağanlığı'],['silk','İstemi Yabgu hangi ticaret yolunda üstünlük kurmaya çalıştı?','İpek Yolu'],['sassanid','Göktürkler Akhunlara karşı hangi devletle iş birliği yaptı?','Sasani Devleti'],['byzantium','Sasanilere karşı ilişki kurulan devlet hangisidir?','Bizans İmparatorluğu'],['split','I. Göktürk Devleti hangi iki kola ayrıldı?','Doğu ve Batı Göktürkler'],['kutluk','II. Göktürk Devleti’nin kurucusu kimdir?','Kutluk Kağan'],['ilteris','Kutluk Kağan’ın aldığı unvan hangisidir?','İlteriş'],['tonyukuk','II. Göktürklerin ünlü devlet adamı ve veziri kimdir?','Tonyukuk'],['bilge','II. Göktürk Devleti’nin kağanlarından biri kimdir?','Bilge Kağan'],['kultigin','Bilge Kağan’ın komutan kardeşi kimdir?','Kül Tigin']
    ],
    [
      ['founder','Uygur Kağanlığı’nın kurucusu kimdir?','Kutluk Bilge Kül Kağan'],['year','Uygur Kağanlığı hangi yıl kuruldu?','744'],['capital','Uygur Kağanlığı’nın başkenti neresidir?','Karabalgasun'],['tribe','Uygurlar hangi boylar birliğinin önemli üyesiydi?','Dokuz Oğuzlar'],['bayan','Uygurların güçlenmesini sağlayan kağan kimdir?','Bayan Çor Kağan'],['manichaeism','Bögü Kağan döneminde benimsenen din hangisidir?','Maniheizm'],['bogu','Maniheizmi benimseyen Uygur kağanı kimdir?','Bögü Kağan'],['settled','Uygurları önceki bozkır devletlerinden ayıran yaşam özelliği nedir?','Yerleşik yaşam'],['agriculture','Yerleşik Uygur ekonomisinde gelişen üretim alanı hangisidir?','Tarım'],['printing','Uygurların kullandığı çoğaltma tekniklerinden biri hangisidir?','Blok baskı'],['alphabet','Uygurların Soğd yazısından geliştirdiği alfabe hangisidir?','Uygur alfabesi'],['mongol','Uygur alfabesini daha sonra kullanan topluluk hangisidir?','Moğollar'],['collapse','Uygur Kağanlığı’nı 840’ta yıkan topluluk hangisidir?','Kırgızlar'],['gansu','Kağanlık sonrasında kurulan Uygur devletlerinden biri hangisidir?','Kansu Uygur Devleti'],['turfan','Doğu Türkistan’da kurulan Uygur devleti hangisidir?','Turfan Uygur Devleti']
    ],
    [
      ['avar','Avrupa’da güçlü bir kağanlık kuran Türk topluluğu hangisidir?','Avarlar'],['istanbul','İstanbul’u kuşatan ilk Türk topluluğu hangisidir?','Avarlar'],['khazar','Hazar Devleti hangi denizin kuzeyinde gelişti?','Hazar Denizi'],['judaism','Museviliği benimseyen yönetici tabakasıyla tanınan devlet hangisidir?','Hazar Kağanlığı'],['tolerance','Dinî hoşgörüsüyle tanınan erken Türk devleti hangisidir?','Hazar Kağanlığı'],['bulgar','Büyük Bulgar Devleti’nin kurucusu kimdir?','Kubrat Han'],['danube','Tuna Bulgarları zamanla hangi kültür çevresinde Slavlaştı?','Balkanlar'],['volga','İslamiyet’i kabul eden Bulgar kolu hangisidir?','İtil Bulgarları'],['karluk','Talas Savaşı’nda Abbasileri destekleyen Türk topluluğu hangisidir?','Karluklar'],['turgesh','Emevilerin Orta Asya ilerleyişine direnen devlet hangisidir?','Türgişler'],['sulu','Türgişlerin güçlü hükümdarı kimdir?','Sulu Kağan'],['kirghiz','Uygur Kağanlığı’na son veren topluluk hangisidir?','Kırgızlar'],['pecheneg','Bizans ve Ruslarla mücadele eden kuzey bozkır topluluğu hangisidir?','Peçenekler'],['kipchak','Kıpçakların yaşadığı bozkır hangi adla bilinir?','Deşt-i Kıpçak'],['oghuz','Büyük Selçuklu ve Osmanlı hanedanlarının çıktığı topluluk hangisidir?','Oğuzlar']
    ],
    [
      ['ogus','Eski Türk toplumunun en küçük birimi nedir?','Oguş'],['urug','Aileler birliğine ne ad verilirdi?','Urug'],['boy','Urugların birleşmesiyle oluşan topluluk nedir?','Boy'],['budun','Boyların birleşmesiyle oluşan halka ne denirdi?','Budun'],['il','Teşkilatlanmış devlete ne denirdi?','İl'],['kut','Yönetme yetkisinin ilahî kaynağını anlatan kavram nedir?','Kut'],['tore','Toplumsal hukuk kurallarının adı nedir?','Töre'],['kurultay','Devlet işlerinin görüşüldüğü meclis hangisidir?','Kurultay'],['hatun','Kağanın eşine verilen unvan nedir?','Hatun'],['double','Ülkenin doğu ve batı kanatlarıyla yönetilmesine ne denir?','İkili teşkilat'],['tamga','Boyların ayırt edici işaretine ne denir?','Tamga'],['kurgan','Mezar yapısına ne ad verilirdi?','Kurgan'],['balbal','Mezar çevresindeki taş heykellere ne denirdi?','Balbal'],['yuğ','Cenaze törenine ne ad verilirdi?','Yuğ'],['toy','Şölen ve ziyafet niteliğindeki toplantıya ne denirdi?','Toy']
    ]
  ];
  turkishHistoryFacts['pre-islamic']=preIslamicUnits.flatMap((unit,unitIndex)=>unit.map(([id,...rest])=>[`${unitIndex+1}-${id}`,...rest]));
  let expandedTurkishHistoryQuestions = Object.entries(turkishHistoryFacts).flatMap(([periodId,facts])=>facts.map(([id,question,answer],index)=>{
    const peers=facts.filter((_,peerIndex)=>peerIndex!==index);
    const alternatives=[...new Set(peers.map(f=>f[2]).filter(value=>value!==answer))].slice(0,3);
    const direct=makeHistoryQuestions('turkish-history',[[`${periodId}-${id}-a`,question,answer,alternatives,`${answer}, bu sorunun doğru cevabıdır.`]])[0];
    direct.periodId=periodId;
    return direct;
  }));
  const suppliedPreIslamicTest1Rows = [
    ['hayvancilik','Orta Asya’da yaşayan eski Türk topluluklarında hayvancılığın ekonomik yaşamda önemli bir yer edinmesinde aşağıdakilerden hangisi daha etkili olmuştur?',['Deniz ticaretinin gelişmiş olması','Geniş bozkır ve otlakların bulunması','Tarım ürünlerinin ihraç edilmesi','Büyük liman şehirlerinin kurulması'],'Geniş bozkır ve otlakların bulunması','Orta Asya’nın geniş bozkırları ve otlakları, hayvancılığa dayalı konargöçer yaşam biçiminin gelişmesine uygun bir ortam sağlamıştır.'],
    ['onlu-sistem','Türk tarihinde bilinen ilk düzenli ordu teşkilatlarından birini oluşturan ve “onlu sistem” ile ilişkilendirilen hükümdar kimdir?',['Bumin Kağan','Bilge Kağan','Mete Han','Attila'],'Mete Han','Mete Han, Türk askerî tarihinde onlu sistemle özdeşleşmiş hükümdardır. Geleneksel Türk Kara Kuvvetleri kuruluş tarihi de MÖ 209’a dayandırılır.'],
    ['mete-rakip','Asya Hun Devleti’nin en güçlü dönemlerinden birini yaşatan Mete Han’ın mücadele ettiği başlıca devlet aşağıdakilerden hangisidir?',['Bizans İmparatorluğu','Çin','Sasani Devleti','Roma İmparatorluğu'],'Çin','Asya Hunlarının dış politikasında Çin ile yapılan mücadeleler önemli bir yer tutmuştur.'],
    ['kavimler-gocu','Kavimler Göçü’nün Avrupa tarihinde meydana getirdiği gelişmelerden biri aşağıdakilerden hangisidir?',['Avrupa’nın siyasi yapısının değişmesi','İpek Yolu’nun ilk kez kurulması','İstanbul’un Türkler tarafından fethedilmesi','Haçlı Seferlerinin başlaması'],'Avrupa’nın siyasi yapısının değişmesi','Kavimler Göçü Avrupa’daki nüfus ve güç dengelerini değiştirmiş, yeni siyasi oluşumların ortaya çıkmasına katkıda bulunmuştur.'],
    ['attila','Avrupa Hun Devleti denildiğinde adı en çok öne çıkan hükümdar aşağıdakilerden hangisidir?',['Attila','Mete Han','Kutluk Kağan','Bumin Kağan'],'Attila','Attila döneminde Avrupa Hun Devleti büyük bir siyasi ve askerî güç hâline gelmiştir.'],
    ['turk-adi','“Türk” adını devlet adı olarak kullanan ilk Türk devleti hangisidir?',['Uygurlar','Asya Hunları','Göktürkler','Hazarlar'],'Göktürkler','Göktürkler, Türk adını devlet adı olarak kullanan ilk siyasi teşkilat kabul edilir.'],
    ['gokturk-kurucu','Göktürk Devleti’nin kurucusu aşağıdakilerden hangisidir?',['Bumin Kağan','Mete Han','Attila','Moyençur'],'Bumin Kağan','Bumin Kağan, 552 yılında Göktürk Devleti’ni kurmuştur.'],
    ['istemi','Göktürklerin batı kanadının yönetiminde önemli rol oynayan ve İpek Yolu siyasetiyle tanınan kişi kimdir?',['Tonyukuk','İstemi Yabgu','Kültigin','Kutluk Kağan'],'İstemi Yabgu','İstemi Yabgu, Göktürklerin batı siyaseti ve İpek Yolu üzerindeki mücadelelerinde önemli rol oynamıştır.'],
    ['ikinci-gokturk','II. Göktürk Devleti’nin kurulmasına öncülük eden hükümdar aşağıdakilerden hangisidir?',['Kutluk Kağan','Teoman','Attila','Satuk Buğra Han'],'Kutluk Kağan','Kutluk Kağan, Çin egemenliğine karşı bağımsızlık mücadelesi vererek II. Göktürk Devleti’ni kurmuştur.'],
    ['orhun-onem','Orhun Yazıtları’nın Türk tarihi açısından en önemli özelliklerinden biri aşağıdakilerden hangisidir?',['İslamiyet’in kabulünü anlatmaları','Osmanlı Türkçesiyle yazılmış olmaları','Türk tarihinin en eski Türkçe yazılı kaynakları arasında bulunmaları','Anadolu’da hazırlanmış olmaları'],'Türk tarihinin en eski Türkçe yazılı kaynakları arasında bulunmaları','8. yüzyıla ait Orhun Yazıtları, Türk dili ve tarihi açısından günümüze ulaşan en önemli erken dönem yazılı kaynaklarındandır.'],
    ['kultigin','Orhun Yazıtları’nda adına yazıt dikilmiş olan devlet adamı aşağıdakilerden hangisidir?',['Kültigin','Teoman','Attila','İstemi Yabgu'],'Kültigin','Orhun bölgesindeki en önemli yazıtlar Bilge Kağan, Kültigin ve Tonyukuk ile ilişkilidir.'],
    ['tonyukuk','Göktürk devlet yönetiminde Bilge Kağan’ın önemli danışmanlarından biri olan ve adına yazıt bulunan kişi kimdir?',['Tonyukuk','Mete Han','Bayan Çor','Alp Er Tunga'],'Tonyukuk','Tonyukuk, II. Göktürk Devleti’nin önemli devlet adamı, komutanı ve danışmanlarından biridir.'],
    ['uygur-yerlesik','İslamiyet öncesi büyük Türk devletleri arasında yerleşik yaşam ve şehir kültürüyle özellikle öne çıkan devlet hangisidir?',['Asya Hunları','Avrupa Hunları','Uygurlar','Peçenekler'],'Uygurlar','Uygurlar, önceki büyük bozkır Türk devletlerine kıyasla yerleşik yaşam, şehirleşme, tarım ve ticarette daha belirgin bir gelişme göstermiştir.'],
    ['maniheizm','Uygurların Maniheizmi benimsemesi aşağıdaki alanlardan hangisinde önemli değişikliklere yol açmıştır?',['Yaşam tarzı ve kültür','Türk adının ilk kez kullanılması','Anadolu’nun fethedilmesi','İslam hukukunun uygulanması'],'Yaşam tarzı ve kültür','Maniheizmin benimsenmesi Uygurların toplumsal ve kültürel yaşamını etkilemiş, yerleşik hayatın güçlenmesiyle birlikte farklı bir kültürel yapı gelişmiştir.'],
    ['uygur-kultur','Uygurların kültür tarihinde aşağıdakilerden hangisiyle öne çıktığı söylenebilir?',['Deniz imparatorluğu kurmaları','Yerleşik şehir kültürünü geliştirmeleri','Anadolu’da ilk Türk beyliğini kurmaları','İslamiyet’i kabul eden ilk Türk devleti olmaları'],'Yerleşik şehir kültürünü geliştirmeleri','Uygurlar şehirler kurmuş; tarım, ticaret, yazılı kültür ve sanat alanlarında önemli gelişmeler göstermiştir.'],
    ['kut','İslamiyet öncesi Türk devletlerinde hükümdara yönetme yetkisinin Tanrı tarafından verildiği düşüncesine ne ad verilir?',['Töre','Kut','Kurultay','Tamga'],'Kut','Kut anlayışına göre hükümdarın yönetme yetkisinin ilahi bir kaynağa dayandığı kabul edilirdi.'],
    ['tore','Eski Türklerde devlet ve toplum hayatını düzenleyen geleneksel hukuk kurallarının bütününe ne ad verilirdi?',['Töre','Ferman','Şeriat','Kanunname'],'Töre','Töre; gelenek, görenek ve hukuk kurallarından oluşan toplumsal düzenin temel unsurlarındandı.'],
    ['kurultay','İslamiyet öncesi Türk devletlerinde önemli devlet meselelerinin görüşüldüğü meclise genel olarak ne ad verilir?',['Divan','Kurultay','Meclis-i Mebusan','Enderun'],'Kurultay','Kurultay veya toy, devlet işlerinin görüşüldüğü siyasi toplantı ve danışma meclisi niteliğindeydi.'],
    ['kagan','Eski Türklerde hükümdar için kullanılan unvanlardan biri aşağıdakilerden hangisidir?',['Kağan','Vezir','Sadrazam','Şeyhülislam'],'Kağan','Kağan, hakan ve han gibi unvanlar farklı dönemlerde Türk hükümdarları tarafından kullanılmıştır.'],
    ['ikili','Eski Türk devletlerinin zaman zaman doğu ve batı olmak üzere iki yönetim bölümüne ayrılması hangi kavramla açıklanır?',['İkta sistemi','Devşirme sistemi','İkili teşkilat','Tımar sistemi'],'İkili teşkilat','İkili teşkilatta devletin doğu ve batı kanatları bulunur, asıl hükümdar genellikle doğu kanadında yer alırdı.'],
    ['yug','Eski Türklerde ölen kişinin ardından düzenlenen cenaze törenine ne ad verilirdi?',['Toy','Yuğ','Şölen','Kurultay'],'Yuğ','Yuğ, eski Türklerde ölen kişinin ardından gerçekleştirilen cenaze törenidir.'],
    ['balbal','Eski Türk mezarlarının çevresine dikilen ve genellikle ölen kişinin hayattayken öldürdüğü düşmanları simgelediği kabul edilen taşlara ne ad verilir?',['Balbal','Kitabe','Kümbet','Menhir'],'Balbal','Balballar, eski Türk mezar kültürünün en tanınmış unsurlarındandır.'],
    ['kurgan','Eski Türklerde mezar için kullanılan ad aşağıdakilerden hangisidir?',['Kurgan','Medrese','Kümbet','Külliye'],'Kurgan','Kurganlar, özellikle bozkır kültürlerinde görülen mezar yapılarıdır ve arkeolojik açıdan eski Türk yaşamına ilişkin önemli bilgiler sağlar.'],
    ['hazar-din','Hazar Kağanlığı’nın yönetici çevresinin benimsediği din aşağıdakilerden hangisidir?',['Musevilik','Şintoizm','Hinduizm','Zerdüştlük'],'Musevilik','Hazar Kağanlığı’nın özellikle yönetici tabakasının Museviliği benimsemesi Türk tarihi açısından dikkat çekici bir örnektir.'],
    ['avar','İstanbul’u kuşatan Türk topluluklarından biri aşağıdakilerden hangisidir?',['Avarlar','Kırgızlar','Karluklar','Türgişler'],'Avarlar','Avarlar, 626 yılında Sasanilerle eş zamanlı olarak Konstantinopolis’e yönelik büyük bir kuşatmada yer almıştır.'],
    ['talas','751 Talas Savaşı’nda Abbasilerin yanında yer alarak Çin kuvvetlerine karşı savaşan Türk topluluğu hangisidir?',['Karluklar','Peçenekler','Avarlar','Bulgarlar'],'Karluklar','Karlukların Talas Savaşı’nda Abbasilerin tarafında yer alması, Türklerle Müslümanlar arasındaki yakınlaşmanın önemli aşamalarından biri kabul edilir.'],
    ['kirgiz','Uygur Kağanlığı’nın 840 yılında yıkılmasında etkili olan Türk topluluğu aşağıdakilerden hangisidir?',['Kırgızlar','Hazarlar','Avarlar','Peçenekler'],'Kırgızlar','Yenisey Kırgızlarının saldırıları sonucunda Ötüken merkezli Uygur Kağanlığı 840 yılında sona ermiştir.'],
    ['atli-birlik','Eski Türklerin atı askerî alanda etkin biçimde kullanması aşağıdaki yeteneklerden hangisini özellikle artırmıştır?',['Deniz aşırı sefer yapma','Hızlı hareket ve manevra','Kale savunması','Kuşatma makineleri üretme'],'Hızlı hareket ve manevra','Atlı birlikler bozkır ordularına geniş alanlarda hızlı hareket etme, ani saldırı ve geri çekilme gibi önemli avantajlar sağlamıştır.'],
    ['goc-nedeni','Orta Asya’daki Türk topluluklarının farklı bölgelere göç etmelerinde aşağıdakilerden hangisi etkili olan nedenlerden biridir?',['Otlakların yetersizleşmesi','Okyanus ticaretinin durması','Sömürge elde etme düşüncesi','Sanayi ham maddesi arayışı'],'Otlakların yetersizleşmesi','İklim değişiklikleri, kuraklık, otlak sıkıntısı, nüfus artışı ve siyasi mücadeleler Türk göçlerinin başlıca nedenleri arasında gösterilir.'],
    ['satuk','Satuk Buğra Han hangi Türk devletinin hükümdarıdır?',['Uygur Kağanlığı','Karahanlılar','Avrupa Hun Devleti','Göktürk Kağanlığı'],'Karahanlılar','Satuk Buğra Han, Karahanlı hükümdarıdır ve Türklerin İslamlaşma tarihinde önemli bir yere sahiptir.']
  ];
  const suppliedPreIslamicTest1 = suppliedPreIslamicTest1Rows.map(([id,question,options,correctAnswer,explanation])=>({id:`history_turkish-history_pre-islamic-supplied-${id}`,categoryId:'history',subcategoryId:'turkish-history',periodId:'pre-islamic',question,options,correctAnswer,explanation}));
  const generatedPreIslamic = expandedTurkishHistoryQuestions.filter(question=>question.periodId==='pre-islamic');
  expandedTurkishHistoryQuestions = [...suppliedPreIslamicTest1, ...generatedPreIslamic.slice(30), ...expandedTurkishHistoryQuestions.filter(question=>question.periodId!=='pre-islamic')];
  turkishHistoryPeriods.forEach(period=>{period.questionIds=expandedTurkishHistoryQuestions.filter(question=>question.periodId===period.id).map(question=>question.id.replace('history_turkish-history_',''));});

  // Yeni içerik dönemi: kategori iskeleti korunur, bütün eski soru havuzları devre dışıdır.
  const emptyQuestions = [];
  const freshCapitalQuestions = window.WorldCapitalQuestions || [];
  const emptyTurkishHistoryPeriods = turkishHistoryPeriods.map(period=>({...period,questionIds:[]}));
  return { categories, subcategories, artSubcategories, historySubcategories, turkishHistoryPeriods:emptyTurkishHistoryPeriods, questions:freshCapitalQuestions, flagQuestions:emptyQuestions, currencyQuestions:emptyQuestions, currencyCodeQuestions:emptyQuestions, codeCurrencyQuestions:emptyQuestions, artQuestions:emptyQuestions, ancientQuestions:emptyQuestions, turkishHistoryQuestions:emptyQuestions, quizLength: 10 };
})();
