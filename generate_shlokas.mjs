import { readFileSync, writeFileSync, copyFileSync } from 'fs';

// Correct shloka data from Swami Krishnananda's website
// Each entry: [devanagari_line1, devanagari_line2, transliteration_line1, transliteration_line2, meaning, names[]]
const shlokaData = [
  // Shloka 6
  [`अप्रमेयो हृषीकेशः पद्मनाभोऽमरप्रभुः ।`,`विश्वकर्मा मनुस्त्वष्टा स्थविष्ठः स्थविरो ध्रुवः ॥`,
   `aprameyō hṛṣīkeśaḥ padmanābho'maraprabhuḥ,`,`viśvakarmā manustvaṣṭā sthaviṣṭhaḥ sthaviro dhruvaḥ.`,
   `He who is immeasurable; Lord of the senses; He with a lotus in His navel; Lord of the immortals; the cosmic architect; the thinker; the shaper; the most massive; the ancient immovable.`,
   [`अप्रमेयः`,`हृषीकेशः`,`पद्मनाभः`,`अमरप्रभुः`,`विश्वकर्मा`,`मनुः`,`त्वष्टा`,`स्थविष्ठः`,`स्थविरः`,`ध्रुवः`]],
  // Shloka 7
  [`अग्राह्यः शाश्वतः कृष्णो लोहिताक्षः प्रतर्दनः ।`,`प्रभूतस्त्रिककुब्धाम पवित्रं मङ्गलं परम् ॥`,
   `agrāhyaḥ śāśvataḥ kṛṣṇō lōhitākṣaḥ pratardanaḥ,`,`prabhūtastrikakubdhāma pavitraṁ maṁgalaṁ param.`,
   `He who is ungraspable; Eternal; the Dark One; Red-eyed; the Destroyer; the Abundant; Support of the three regions; the Purifier; the Supreme Auspiciousness.`,
   [`अग्राह्यः`,`शाश्वतः`,`कृष्णः`,`लोहिताक्षः`,`प्रतर्दनः`,`प्रभूतः`,`त्रिककुब्धाम`,`पवित्रम्`,`मङ्गलम्`]],
  // Shloka 8
  [`ईशानः प्राणदः प्राणो ज्येष्ठः श्रेष्ठः प्रजापतिः ।`,`हिरण्यगर्भो भूगर्भो माधवो मधुसूदनः ॥`,
   `īśānaḥ prāṇadaḥ prāṇō jyeṣṭhaḥ śreṣṭhaḥ prajāpatiḥ,`,`hiraṇyagarbhō bhūgarbhō mādhavō madhusūdanaḥ.`,
   `The Ruler; Giver of life-breath; Life itself; the Eldest; the Best; Lord of progeny; the Golden Womb; Womb of the Earth; the Consort of Lakshmi; Slayer of Madhu.`,
   [`ईशानः`,`प्राणदः`,`प्राणः`,`ज्येष्ठः`,`श्रेष्ठः`,`प्रजापतिः`,`हिरण्यगर्भः`,`भूगर्भः`,`माधवः`,`मधुसूदनः`]],
  // Shloka 9
  [`ईश्वरो विक्रमी धन्वी मेधावी विक्रमः क्रमः ।`,`अनुत्तमो दुराधर्षः कृतज्ञः कृतिरात्मवान् ॥`,
   `īśvarō vikramī dhanvī medhāvī vikramaḥ kramaḥ,`,`anuttamō durādharṣaḥ kṛtajñaḥ kṛtirātmavān.`,
   `The Omnipotent; the Valiant; the Bowman; the Wise; the Stride; the Succession; the Unsurpassed; the Unconquerable; the Grateful; the Action; the Self-possessed.`,
   [`ईश्वरः`,`विक्रमी`,`धन्वी`,`मेधावी`,`विक्रमः`,`क्रमः`,`अनुत्तमः`,`दुराधर्षः`,`कृतज्ञः`,`कृतिः`,`आत्मवान्`]],
  // Shloka 10
  [`सुरेशः शरणं शर्म विश्वरेताः प्रजाभवः ।`,`अहः संवत्सरो व्यालः प्रत्ययः सर्वदर्शनः ॥`,
   `sureśaḥ śaraṇaṁ śarma viśvaretāḥ prajābhavaḥ,`,`ahaḥ saṁvatsarō vyālaḥ pratyayassarvadarśanaḥ.`,
   `Lord of the Gods; the Refuge; Supreme Bliss; the Seed of the Universe; Origin of beings; the Day; the Year; the Elusive; the Consciousness; the All-seeing.`,
   [`सुरेशः`,`शरणम्`,`शर्म`,`विश्वरेताः`,`प्रजाभवः`,`अहः`,`संवत्सरः`,`व्यालः`,`प्रत्ययः`,`सर्वदर्शनः`]],
  // Shloka 11
  [`अजः सर्वेश्वरः सिद्धः सिद्धिः सर्वादिरच्युतः ।`,`वृषाकपिरमेयात्मा सर्वयोगविनिःसृतः ॥`,
   `ajaḥ sarveśvaraḥ siddhaḥ siddhiḥ sarvādiracyutaḥ,`,`vṛṣākapirameyātmā sarvayōgaviniḥsṛtaḥ.`,
   `The Unborn; Lord of All; the Perfect; Perfection itself; the Beginning of All; the Imperishable; the Showerer of Desires; the Immeasurable Self; the One beyond all bondage.`,
   [`अजः`,`सर्वेश्वरः`,`सिद्धः`,`सिद्धिः`,`सर्वादिः`,`अच्युतः`,`वृषाकपिः`,`अमेयात्मा`,`सर्वयोगविनिःसृतः`]],
  // Shloka 12
  [`वसुर्वसुमनाः सत्यः समात्माऽसम्मितः समः ।`,`अमोघः पुण्डरीकाक्षो वृषकर्मा वृषाकृतिः ॥`,
   `vasurvasumanāḥ satyaḥ samātmā sammitaḥ samaḥ,`,`amōghaḥ puṇḍarīkākṣō vṛṣakarmā vṛṣākṛtiḥ.`,
   `The Dweller in all; the Noble-minded; the Truth; the Equal-souled; the Measured; the Balanced; the Unfailing; the Lotus-eyed; the Righteous-acting; the Righteous-formed.`,
   [`वसुः`,`वसुमनाः`,`सत्यः`,`समात्मा`,`असम्मितः`,`समः`,`अमोघः`,`पुण्डरीकाक्षः`,`वृषकर्मा`,`वृषाकृतिः`]],
  // Shloka 13
  [`रुद्रो बहुशिरा बभ्रुर्विश्वयोनिः शुचिश्रवाः ।`,`अमृतः शाश्वतस्थाणुर्वरारोहो महातपाः ॥`,
   `rudrō bahuśirā babhrurviśvayōniḥ śuciśravāḥ,`,`amṛtaḥ śāśvatasthāṇurvarārōhō mahātapāḥ.`,
   `The Terrible; the Many-headed; the All-supporting; the Universal Source; the Holy-named; the Deathless; the Eternal and Firm; the Bestower of Boons; the Great Austere.`,
   [`रुद्रः`,`बहुशिराः`,`बभ्रुः`,`विश्वयोनिः`,`शुचिश्रवाः`,`अमृतः`,`शाश्वतस्थाणुः`,`वरारोहः`,`महातपाः`]],
  // Shloka 14
  [`सर्वगः सर्वविद्भानुर्विष्वक्सेनो जनार्दनः ।`,`वेदो वेदविदव्यङ्गो वेदाङ्गो वेदवित् कविः ॥`,
   `sarvagaḥ sarvavidbhānurviṣvaksenō janārdanaḥ,`,`vedō vedavidavyaṅgō vedāṅgō vedavit kaviḥ.`,
   `The All-pervading; the All-knowing Illuminer; the Scatterer of Armies; the Afflicter of Evil; the Veda; the Knower of the Veda; the Perfect; the Limbs of the Veda; the Seer.`,
   [`सर्वगः`,`सर्वविद्भानुः`,`विष्वक्सेनः`,`जनार्दनः`,`वेदः`,`वेदवित्`,`अव्यङ्गः`,`वेदाङ्गः`,`वेदवित्`,`कविः`]],
  // Shloka 15
  [`लोकाध्यक्षः सुराध्यक्षो धर्माध्यक्षः कृताकृतः ।`,`चतुरात्मा चतुर्व्यूहश्चतुर्दंष्ट्रश्चतुर्भुजः ॥`,
   `lōkādhyakṣaḥ surādhyakṣō dharmādhyakṣaḥ kṛtākṛtaḥ,`,`caturātmā caturvyūhaścaturdaṁṣṭraścaturbhujaḥ.`,
   `The Overseer of the Worlds; Lord of the Gods; Lord of Dharma; the Effect and Non-effect; the Four-souled; the Fourfold-manifested; the Four-tusked; the Four-armed.`,
   [`लोकाध्यक्षः`,`सुराध्यक्षः`,`धर्माध्यक्षः`,`कृताकृतः`,`चतुरात्मा`,`चतुर्व्यूहः`,`चतुर्दंष्ट्रः`,`चतुर्भुजः`]],
  // Shloka 16
  [`भ्राजिष्णुर्भोजनं भोक्ता सहिष्णुर्जगदादिजः ।`,`अनघो विजयो जेता विश्वयोनिः पुनर्वसुः ॥`,
   `bhrājiṣṇurbhōjanaṁ bhōktā sahiṣṇurjagadādijaḥ,`,`anaghō vijayō jetā viśvayōniḥ punarvasuḥ.`,
   `The Self-luminous; the Object of Enjoyment; the Enjoyer; the Forbearing; the First-born of the Universe; the Sinless; the Victorious; the Conqueror; the Universal Source; the Repeated Dweller.`,
   [`भ्राजिष्णुः`,`भोजनम्`,`भोक्ता`,`सहिष्णुः`,`जगदादिजः`,`अनघः`,`विजयः`,`जेता`,`विश्वयोनिः`,`पुनर्वसुः`]],
  // Shloka 17
  [`उपेन्द्रो वामनः प्रांशुरमोघः शुचिरूर्जितः ।`,`अतीन्द्रः सङ्ग्रहः सर्गो धृतात्मा नियमो यमः ॥`,
   `upendrō vāmanaḥ prāṁśuramōghaḥ śucirūrjitaḥ,`,`atīndraḥ saṅgrahaḥ sargō dhṛtātmā niyamō yamaḥ.`,
   `The Younger Brother of Indra; the Dwarf; the Tall; the Unfailing; the Pure; the Strong; the Beyond Indra; the Comprehension; the Creation; the Self-established; the Regulation; the Restrainer.`,
   [`उपेन्द्रः`,`वामनः`,`प्रांशुः`,`अमोघः`,`शुचिः`,`ऊर्जितः`,`अतीन्द्रः`,`सङ्ग्रहः`,`सर्गः`,`धृतात्मा`,`नियमः`,`यमः`]],
  // Shloka 18
  [`वेद्यो वैद्यः सदायोगी वीरहा माधवो मधुः ।`,`अतीन्द्रियो महामायो महोत्साहो महाबलः ॥`,
   `vedyō vaidyaḥ sadāyōgī vīrahā mādhavō madhuḥ,`,`atīndriyō mahāmāyō mahōtsāhō mahābalaḥ.`,
   `The Knowable; the All-knowing; the Ever-yoked; the Destroyer of Heroes; the Lord of Lakshmi; the Sweet; the Beyond the Senses; the Great Illusionist; the Greatly Energetic; the Greatly Strong.`,
   [`वेद्यः`,`वैद्यः`,`सदायोगी`,`वीरहा`,`माधवः`,`मधुः`,`अतीन्द्रियः`,`महामायः`,`महोत्साहः`,`महाबलः`]],
  // Shloka 19
  [`महाबुद्धिर्महावीर्यो महाशक्तिर्महाद्युतिः ।`,`अनिर्देश्यवपुः श्रीमानमेयात्मा महाद्रिधृक् ॥`,
   `mahābuddhirmahāvīryō mahāśaktirmahādyutiḥ,`,`anirdeśyavapuḥ śrīmānameyātmā mahādridhṛk.`,
   `The Greatly Wise; the Greatly Valiant; the Greatly Powerful; the Greatly Radiant; the Indescribable-formed; the Glorious; the Immeasurable Self; the Upholder of the Great Mountain.`,
   [`महाबुद्धिः`,`महावीर्यः`,`महाशक्तिः`,`महाद्युतिः`,`अनिर्देश्यवपुः`,`श्रीमान्`,`अमेयात्मा`,`महाद्रिधृक्`]],
  // Shloka 20
  [`महेष्वासो महीभर्ता श्रीनिवासः सतां गतिः ।`,`अनिरुद्धः सुरानन्दो गोविन्दो गोविदां पतिः ॥`,
   `maheṣvāsō mahībhartā śrīnivāsaḥ satāṁ gatiḥ,`,`aniruddhaḥ surānandō gōvindō gōvidāṁ patiḥ.`,
   `The Great Bowman; the Supporter of the Earth; the Abode of Lakshmi; the Goal of the Good; the Unobstructed; the Joy of the Gods; the Lord of the Cows/Knowledge; the Master of the Wise.`,
   [`महेष्वासः`,`महीभर्ता`,`श्रीनिवासः`,`सतांगतिः`,`अनिरुद्धः`,`सुरानन्दः`,`गोविन्दः`,`गोविदांपतिः`]],
  // Shloka 21
  [`मरीचिर्दमनो हंसः सुपर्णो भुजगोत्तमः ।`,`हिरण्यनाभः सुतपाः पद्मनाभः प्रजापतिः ॥`,
   `marīcirdamanō haṁsaḥ suparṇō bhujagōttamaḥ,`,`hiraṇyanābhaḥ sutapāḥ padmanābhaḥ prajāpatiḥ.`,
   `The Shining; the Subduer; the Swan; the Beautiful-winged; the Best of Serpents; the Golden-naveled; the Great Austere; the Lotus-naveled; the Lord of Beings.`,
   [`मरीचिः`,`दमनः`,`हंसः`,`सुपर्णः`,`भुजगोत्तमः`,`हिरण्यनाभः`,`सुतपाः`,`पद्मनाभः`,`प्रजापतिः`]],
  // Shloka 22
  [`अमृत्युः सर्वदृक् सिंहः सन्धाता सन्धिमान् स्थिरः ।`,`अजो दुर्मर्षणः शास्ता विश्रुतात्मा सुरारिहा ॥`,
   `amṛtyuḥ sarvadṛk siṁhaḥ sandhātā sandhimān sthiraḥ,`,`ajō durmarṣaṇaḥ śāstā viśrutātmā surārihā.`,
   `The Deathless; the All-seer; the Lion; the Uniter; the Connected; the Steadfast; the Unborn; the Intolerable; the Teacher; the Celebrated Self; the Slayer of the Gods' Enemies.`,
   [`अमृत्युः`,`सर्वदृक्`,`सिंहः`,`सन्धाता`,`सन्धिमान्`,`स्थिरः`,`अजः`,`दुर्मर्षणः`,`शास्ता`,`विश्रुतात्मा`,`सुरारिहा`]],
  // Shloka 23
  [`गुरुर्गुरुतमो धाम सत्यः सत्यपराक्रमः ।`,`निमिषोऽनिमिषः स्रग्वी वाचस्पतिरुदारधीः ॥`,
   `gururgurutamō dhāma satyaḥ satyaparākramaḥ,`,`nimiṣōnimiṣaḥ sragvī vācaspatirudāradhīḥ.`,
   `The Guru; the Greatest Guru; the Abode; the Truth; the One of True Valour; the One with Closed Eyes; the Ever-awake; the Garlanded; the Lord of Speech; the Noble-minded.`,
   [`गुरुः`,`गुरुतमः`,`धाम`,`सत्यः`,`सत्यपराक्रमः`,`निमिषः`,`अनिमिषः`,`स्रग्वी`,`वाचस्पतिः`,`उदारधीः`]],
  // Shloka 24
  [`अग्रणीर्ग्रामणीः श्रीमान्न्यायो नेता समीरणः ।`,`सहस्रमूर्धा विश्वात्मा सहस्राक्षः सहस्रपात् ॥`,
   `agraṇīrgrāmaṇīḥ śrīmānnyāyō netā samīraṇaḥ,`,`sahasramūrdhā viśvātmā sahasrākṣaḥ sahasrapāt.`,
   `The Leader; the Commander; the Glorious; the Justice; the Guide; the Air; the Thousand-headed; the Universal Self; the Thousand-eyed; the Thousand-footed.`,
   [`अग्रणीः`,`ग्रामणीः`,`श्रीमान्`,`न्यायः`,`नेता`,`समीरणः`,`सहस्रमूर्धा`,`विश्वात्मा`,`सहस्राक्षः`,`सहस्रपात्`]],
  // Shloka 25
  [`आवर्तनो निवृत्तात्मा संवृतः सम्प्रमर्दनः ।`,`अहः संवर्तको वह्निरनिलो धरणीधरः ॥`,
   `āvartanō nivṛttātmā saṁvṛtaḥ saṁpramardanaḥ,`,`ahaḥ saṁvartakō vahniranilō dharaṇīdharaḥ.`,
   `The Whirler; the Withdrawn Self; the Covered; the Crushing; the Regulator of Day; the Fire; the Wind; the Support of the Earth.`,
   [`आवर्तनः`,`निवृत्तात्मा`,`संवृतः`,`सम्प्रमर्दनः`,`अहःसंवर्तकः`,`वह्निः`,`अनिलः`,`धरणीधरः`]],
  // Shloka 26
  [`सुप्रसादः प्रसन्नात्मा विश्वधृग्विश्वभुग्विभुः ।`,`सत्कर्ता सत्कृतः साधुर्जह्नुर्नारायणो नरः ॥`,
   `suprasādaḥ prasannātmā viśvadhṛgviśvabhugvibhuḥ,`,`satkartā satkṛtaḥ sādhurjahnurnārāyaṇō naraḥ.`,
   `The Highly Gracious; the Serene Self; the Universe-supporter; the Universe-enjoyer; the Pervading; the Honorer of the Good; the Honored; the Virtuous; the Dissolver; the Abode of Beings; the Leader.`,
   [`सुप्रसादः`,`प्रसन्नात्मा`,`विश्वधृक्`,`विश्वभुक्`,`विभुः`,`सत्कर्ता`,`सत्कृतः`,`साधुः`,`जह्नुः`,`नारायणः`,`नरः`]],
  // Shloka 27
  [`असङ्ख्येयोऽप्रमेयात्मा विशिष्टः शिष्टकृच्छुचिः ।`,`सिद्धार्थः सिद्धसङ्कल्पः सिद्धिदः सिद्धिसाधनः ॥`,
   `asaṅkhyeyōprameyātmā viśiṣṭaḥ śiṣṭakṛcchuciḥ,`,`siddhārthaḥ siddhasaṅkalpaḥ siddhidaḥ siddhisādhanaḥ.`,
   `The Innumerable; the Immeasurable Self; the Distinguished; the Creator of Distinctions; the Pure; the Fulfilled; the One of Fulfilled Resolve; the Giver of Perfection; the Means of Perfection.`,
   [`असङ्ख्येयः`,`अप्रमेयात्मा`,`विशिष्टः`,`शिष्टकृत्`,`शुचिः`,`सिद्धार्थः`,`सिद्धसङ्कल्पः`,`सिद्धिदः`,`सिद्धिसाधनः`]],
  // Shloka 28
  [`वृषाही वृषभो विष्णुर्वृषपर्वा वृषोदरः ।`,`वर्धनो वर्धमानश्च विविक्तः श्रुतिसागरः ॥`,
   `vṛṣāhī vṛṣabhō viṣṇurvṛṣaparvā vṛṣōdaraḥ,`,`vardhanō vardhamānaśca viviktaḥ śrutisāgaraḥ.`,
   `The Lord of Dharma; the Showerer of Boons; the All-pervading; the One with Dharma as Steps; the One with a Bounteous Abdomen; the Increaser; the Increasing; the Subtle; the Ocean of Scriptures.`,
   [`वृषाही`,`वृषभः`,`विष्णुः`,`वृषपर्वा`,`वृषोदरः`,`वर्धनः`,`वर्धमानः`,`विविक्तः`,`श्रुतिसागरः`]],
  // Shloka 29
  [`सुभुजो दुर्धरो वाग्मी महेन्द्रो वसुदो वसुः ।`,`नैकरूपो बृहद्रूपः शिपिविष्टः प्रकाशनः ॥`,
   `subhujō durdharō vāgmī mahendrō vasudō vasuḥ,`,`naikarūpō bṛhadrūpaḥ śipiviṣṭaḥ prakāśanaḥ.`,
   `The One with Beautiful Arms; the Irresistible; the Eloquent; the Great Indra; the Giver of Wealth; the Wealth; the Multiformed; the Vast-formed; the Dweller in Cows; the Illuminator.`,
   [`सुभुजः`,`दुर्धरः`,`वाग्मी`,`महेन्द्रः`,`वसुदः`,`वसुः`,`नैकरूपः`,`बृहद्रूपः`,`शिपिविष्टः`,`प्रकाशनः`]],
  // Shloka 30
  [`ओजस्तेजोद्युतिधरः प्रकाशात्मा प्रतापनः ।`,`ऋद्धः स्पष्टाक्षरो मन्त्रश्चन्द्रांशुर्भास्करद्युतिः ॥`,
   `ōjastejōdyutidharaḥ prakāśātmā pratāpanaḥ,`,`ṛddhaḥ spaṣṭākṣarō mantraścandrāṁśurbhāskaradyutiḥ.`,
   `The Possessor of Strength, Vigor, and Brilliance; the Radiant Self; the Heater; the Prosperous; the Clear-syllabled; the Mantra; the Moonbeam; the One with Solar Radiance.`,
   [`ओजस्तेजोद्युतिधरः`,`प्रकाशात्मा`,`प्रतापनः`,`ऋद्धः`,`स्पष्टाक्षरः`,`मन्त्रः`,`चन्द्रांशुः`,`भास्करद्युतिः`]],
  // Shloka 31
  [`अमृतांशूद्भवो भानुः शशबिन्दुः सुरेश्वरः ।`,`औषधं जगतः सेतुः सत्यधर्मपराक्रमः ॥`,
   `amṛtāṁśūdbhavō bhānuḥ śaśabinduḥ sureśvaraḥ,`,`auṣadhaṁ jagataḥ setuḥ satyadharmaparākramaḥ.`,
   `The Origin of the Moon; the Radiant; the Moon-marked; the Lord of the Gods; the Medicine; the Bridge across the World; the One of True Dharma and Valour.`,
   [`अमृतांशूद्भवः`,`भानुः`,`शशबिन्दुः`,`सुरेश्वरः`,`औषधम्`,`जगतःसेतुः`,`सत्यधर्मपराक्रमः`]],
  // Shloka 32
  [`भूतभव्यभवन्नाथः पवनः पावनोऽनलः ।`,`कामहा कामकृत्कान्तः कामः कामप्रदः प्रभुः ॥`,
   `bhūtabhavyabhavannāthaḥ pavanaḥ pāvano'nalaḥ,`,`kāmahā kāmakṛtkāntaḥ kāmaḥ kāmapradaḥ prabhuḥ.`,
   `Lord of the Past, Present and Future; the Purifier; the Moving; the Fire; the Destroyer of Desires; the Fulfiller of Desires; the Beloved; the Desired; the Giver of Desires; the Lord.`,
   [`भूतभव्यभवन्नाथः`,`पवनः`,`पावनः`,`अनलः`,`कामहा`,`कामकृत्`,`कान्तः`,`कामः`,`कामप्रदः`,`प्रभुः`]],
  // Shloka 33
  [`युगादिकृद्युगावर्तो नैकमायो महाशनः ।`,`अदृश्यो व्यक्तरूपश्च सहस्रजिदनन्तजित् ॥`,
   `yugādikṛdyugāvartō naikamāyō mahāśanaḥ,`,`adṛśyō vyaktarūpaśca sahasrajidanantajit.`,
   `The Creator of Ages; the Repeater of Ages; the One of Many Mayas; the Great Devourer; the Invisible; the Manifest-formed; the Thousand-victor; the Infinite-victor.`,
   [`युगादिकृत्`,`युगावर्तः`,`नैकमायः`,`महाशनः`,`अदृश्यः`,`व्यक्तरूपः`,`सहस्रजित्`,`अनन्तजित्`]],
  // Shloka 34
  [`इष्टोऽविशिष्टः शिष्टेष्टः शिखण्डी नहुषो वृषः ।`,`क्रोधहा क्रोधकृत्कर्ता विश्वबाहुर्महीधरः ॥`,
   `iṣṭōviśiṣṭaḥ śiṣṭeṣṭaḥ śikhaṇḍī nahuṣō vṛṣaḥ,`,`krōdhahā krōdhakṛtkartā viśvabāhurmahīdharaḥ.`,
   `The Beloved; the Non-distinct; the Beloved of the Wise; the Peacock-feathered; the Binder; the Dharma; the Destroyer of Anger; the Creator of Anger; the Doer; the Universal-armed; the Earth-supporter.`,
   [`इष्टः`,`अविशिष्टः`,`शिष्टेष्टः`,`शिखण्डी`,`नहुषः`,`वृषः`,`क्रोधहा`,`क्रोधकृत्`,`कर्ता`,`विश्वबाहुः`,`महीधरः`]],
  // Shloka 35
  [`अच्युतः प्रथितः प्राणः प्राणदो वासवानुजः ।`,`अपांनिधिरधिष्ठानमप्रमत्तः प्रतिष्ठितः ॥`,
   `acyutaḥ prathitaḥ prāṇaḥ prāṇadō vāsavānujaḥ,`,`apāmnidhiradhiṣṭhānamapramattaḥ pratiṣṭhitaḥ.`,
   `The Imperishable; the Famous; the Life-breath; the Giver of Life; the Younger Brother of Indra; the Abode of Waters; the Foundation; the Vigilant; the Established.`,
   [`अच्युतः`,`प्रथितः`,`प्राणः`,`प्राणदः`,`वासवानुजः`,`अपांनिधिः`,`अधिष्ठानम्`,`अप्रमत्तः`,`प्रतिष्ठितः`]],
  // Shloka 36
  [`स्कन्दः स्कन्दधरो धुर्यो वरदो वायुवाहनः ।`,`वासुदेवो बृहद्भानुरादिदेवः पुरन्दरः ॥`,
   `skandaḥ skandadharō dhuryō varadō vāyuvāhanaḥ,`,`vāsudevō bṛhadbhānurādidevaḥ purandaraḥ.`,
   `The Spiller; the Supporter of Righteousness; the Burden-bearer; the Boon-giver; the One with Wind as Vehicle; the All-pervading Lord; the Great Light; the Primordial God; the Destroyer of Cities.`,
   [`स्कन्दः`,`स्कन्दधरः`,`धुर्यः`,`वरदः`,`वायुवाहनः`,`वासुदेवः`,`बृहद्भानुः`,`आदिदेवः`,`पुरन्दरः`]],
  // Shloka 37
  [`अशोकस्तारणस्तारः शूरः शौरिर्जनेश्वरः ।`,`अनुकूलः शतावर्तः पद्मी पद्मनिभेक्षणः ॥`,
   `aśōkastāraṇastāraḥ śūraḥ śaurirjaneśvaraḥ,`,`anukūlaḥ śatāvartaḥ padmī padmanibhekṣaṇaḥ.`,
   `The Sorrowless; the Saviour; the Liberator; the Hero; the Descendant of Sura; the Lord of Beings; the Favorable; the One of Many Incarnations; the Lotus-holder; the Lotus-eyed.`,
   [`अशोकः`,`तारणः`,`तारः`,`शूरः`,`शौरिः`,`जनेश्वरः`,`अनुकूलः`,`शतावर्तः`,`पद्मी`,`पद्मनिभेक्षणः`]],
  // Shloka 38
  [`पद्मनाभोऽरविन्दाक्षः पद्मगर्भः शरीरभृत् ।`,`महर्द्धिरृद्धो वृद्धात्मा महाक्षो गरुडध्वजः ॥`,
   `padmanābhōravindākṣaḥ padmagarbhaḥ śarīrabhṛt,`,`maharddhirṛddhō vṛddhātmā mahākṣō garuḍadhvajaḥ.`,
   `The Lotus-naveled; the Lotus-eyed; the Lotus-wombed; the Body-supporter; the Great Prosperous; the Prosperous; the Ancient Self; the Great-eyed; the One with Garuda on His Flag.`,
   [`पद्मनाभः`,`अरविन्दाक्षः`,`पद्मगर्भः`,`शरीरभृत्`,`महर्द्धिः`,`ऋद्धः`,`वृद्धात्मा`,`महाक्षः`,`गरुडध्वजः`]],
  // Shloka 39
  [`अतुलः शरभो भीमः समयज्ञो हविर्हरिः ।`,`सर्वलक्षणलक्षण्यो लक्ष्मीवान् समितिञ्जयः ॥`,
   `atulaḥ śarabhō bhīmaḥ samayajñō havirhariḥ,`,`sarvalakṣaṇalakṣaṇyō lakṣmīvān samitiñjayaḥ.`,
   `The Incomparable; the Mighty; the Terrible; the Knower of Time; the Receiver of Offerings; the Lord of Sacrifice; the One with All Signs; the Possessor of Lakshmi; the Victorious in War.`,
   [`अतुलः`,`शरभः`,`भीमः`,`समयज्ञः`,`हविर्हरिः`,`सर्वलक्षणलक्षण्यः`,`लक्ष्मीवान्`,`समितिञ्जयः`]],
  // Shloka 40
  [`विक्षरो रोहितो मार्गो हेतुर्दामोदरः सहः ।`,`महीधरो महाभागो वेगवानमिताशनः ॥`,
   `vikṣarō rōhitō mārgō heturdamōdaraḥ sahaḥ,`,`mahīdharō mahābhāgō vegavānamitāśanaḥ.`,
   `The Undecaying; the Red; the Path; the Cause; the One Bound with a Rope (Damodara); the Enduring; the Earth-supporter; the Greatly Fortunate; the Swift; the One of Measureless Eating.`,
   [`विक्षरः`,`रोहितः`,`मार्गः`,`हेतुः`,`दामोदरः`,`सहः`,`महीधरः`,`महाभागः`,`वेगवान्`,`अमिताशनः`]],
  // Shloka 41
  [`उद्भवः क्षोभणो देवः श्रीगर्भः परमेश्वरः ।`,`करणं कारणं कर्ता विकर्ता गहनो गुहः ॥`,
   `udbhavaḥ kṣōbhaṇō devaḥ śrīgarbhaḥ parameśvaraḥ,`,`karaṇaṁ kāraṇaṁ kartā vikartā gahanō guhaḥ.`,
   `The Origin; the Agitator; the Shining One; the Womb of Glory; the Supreme Lord; the Instrument; the Cause; the Doer; the Special Doer; the Profound; the Hidden.`,
   [`उद्भवः`,`क्षोभणः`,`देवः`,`श्रीगर्भः`,`परमेश्वरः`,`करणम्`,`कारणम्`,`कर्ता`,`विकर्ता`,`गहनः`,`गुहः`]],
  // Shloka 42
  [`व्यवसायो व्यवस्थानः संस्थानः स्थानदो ध्रुवः ।`,`परर्द्धिः परमस्पष्टस्तुष्टः पुष्टः शुभेक्षणः ॥`,
   `vyavasāyō vyavasthānaḥ saṁsthānaḥ sthānadō dhruvaḥ,`,`pararddhiḥ paramaspaṣṭastuṣṭaḥ puṣṭaḥ śubhekṣaṇaḥ.`,
   `The Resolute; the Orderly; the Abiding Place; the Giver of Station; the Firm; the Supreme Prosperity; the Most Manifest; the Content; the Nourished; the One of Auspicious Eye.`,
   [`व्यवसायः`,`व्यवस्थानः`,`संस्थानः`,`स्थानदः`,`ध्रुवः`,`परर्द्धिः`,`परमस्पष्टः`,`तुष्टः`,`पुष्टः`,`शुभेक्षणः`]],
  // Shloka 43
  [`रामो विरामो विरजो मार्गो नेयो नयोऽनयः ।`,`वीरः शक्तिमतां श्रेष्ठो धर्मो धर्मविदुत्तमः ॥`,
   `rāmō virāmō virajō mārgō neyō nayō'nayaḥ,`,`vīraḥ śaktimatāṁ śreṣṭhō dharmō dharmaviduttamaḥ.`,
   `The Delightful; the End; the Passionless; the Path; the Guide; the Leader; the Leaderless; the Valiant; the Best of the Powerful; the Dharma; the Supreme Knower of Dharma.`,
   [`रामः`,`विरामः`,`विरजाः`,`मार्गः`,`नेयः`,`नयः`,`अनयः`,`वीरः`,`शक्तिमतां श्रेष्ठः`,`धर्मः`,`धर्मविदुत्तमः`]],
  // Shloka 44
  [`वैकुण्ठः पुरुषः प्राणः प्राणदः प्रणवः पृथुः ।`,`हिरण्यगर्भः शत्रुघ्नो व्याप्तो वायुरधोक्षजः ॥`,
   `vaikuṇṭhaḥ puruṣaḥ prāṇaḥ prāṇadaḥ praṇavaḥ pṛthuḥ,`,`hiraṇyagarbhaḥ śatrughnō vyāptō vāyuradhōkṣajaḥ.`,
   `The Lord of Vaikuntha; the Person; the Life-breath; the Giver of Life; the Pranava (OM); the Expanded; the Golden-wombed; the Slayer of Enemies; the Pervaded; the Wind; the Imperishable.`,
   [`वैकुण्ठः`,`पुरुषः`,`प्राणः`,`प्राणदः`,`प्रणवः`,`पृथुः`,`हिरण्यगर्भः`,`शत्रुघ्नः`,`व्याप्तः`,`वायुः`,`अधोक्षजः`]],
  // Shloka 45
  [`ऋतुः सुदर्शनः कालः परमेष्ठी परिग्रहः ।`,`उग्रः संवत्सरो दक्षो विश्रामो विश्वदक्षिणः ॥`,
   `ṛtuḥ sudarśanaḥ kālaḥ parameṣṭhī parigrahaḥ,`,`ugraḥ saṁvatsarō dakṣō viśrāmō viśvadakṣiṇaḥ.`,
   `The Season; the Beautiful Vision; the Time; the Supreme Dweller; the Acceptor; the Terrible; the Year; the Skillful; the Rest; the All-skilled.`,
   [`ऋतुः`,`सुदर्शनः`,`कालः`,`परमेष्ठी`,`परिग्रहः`,`उग्रः`,`संवत्सरः`,`दक्षः`,`विश्रामः`,`विश्वदक्षिणः`]],
  // Shloka 46
  [`विस्तारः स्थावरस्थाणुः प्रमाणं बीजमव्ययम् ।`,`अर्थोऽनर्थो महाकोशो महाभोगो महाधनः ॥`,
   `vistāraḥ sthāvarasthāṇuḥ pramāṇaṁ bījamavyayam,`,`arthōnarthō mahākōśō mahābhōgō mahādhanaḥ.`,
   `The Expansion; the Stationary and Firm; the Measure; the Imperishable Seed; the Goal; the Non-goal; the Great Treasure; the Great Enjoyment; the Great Wealth.`,
   [`विस्तारः`,`स्थावरस्थाणुः`,`प्रमाणम्`,`बीजमव्ययम्`,`अर्थः`,`अनर्थः`,`महाकोशः`,`महाभोगः`,`महाधनः`]],
  // Shloka 47
  [`अनिर्विण्णः स्थविष्ठोऽभूर्धर्मयूपो महामखः ।`,`नक्षत्रनेमिर्नक्षत्री क्षमः क्षामः समीहनः ॥`,
   `anirviṇṇaḥ sthaviṣṭhōbhūrdharmayūpō mahāmakhaḥ,`,`nakṣatranemirnakṣatrī kṣamaḥ kṣāmaḥ samīhanaḥ.`,
   `The Unwearied; the Most Massive; the Born; the Sacrificial Post of Dharma; the Great Sacrifice; the Navel of Stars; the Starry; the Capable; the Tranquil; the Striver.`,
   [`अनिर्विण्णः`,`स्थविष्ठः`,`अभूः`,`धर्मयूपः`,`महामखः`,`नक्षत्रनेमिः`,`नक्षत्री`,`क्षमः`,`क्षामः`,`समीहनः`]],
  // Shloka 48
  [`यज्ञ इज्यो महेज्यश्च क्रतुः सत्रं सतां गतिः ।`,`सर्वदर्शी विमुक्तात्मा सर्वज्ञो ज्ञानमुत्तमम् ॥`,
   `yajña ijyō mahejyaśca kratuḥ satraṁ satāṁ gatiḥ,`,`sarvadarśī vimuktātmā sarvajñō jñānamuttamam.`,
   `The Sacrifice; the Worshipful; the Greatly Worshipful; the Ritual; the Session; the Goal of the Good; the All-seer; the Liberated Self; the All-knowing; the Supreme Knowledge.`,
   [`यज्ञः`,`इज्यः`,`महेज्यः`,`क्रतुः`,`सत्रम्`,`सतांगतिः`,`सर्वदर्शी`,`विमुक्तात्मा`,`सर्वज्ञः`,`ज्ञानमुत्तमम्`]],
  // Shloka 49
  [`सुव्रतः सुमुखः सूक्ष्मः सुघोषः सुखदः सुहृत् ।`,`मनोहरो जितक्रोधो वीरबाहुर्विदारणः ॥`,
   `suvrataḥ sumukhaḥ sūkṣmaḥ sughōṣaḥ sukhadaḥ suhṛt,`,`manōharō jitakrōdhō vīrabāhurvidāraṇaḥ.`,
   `The Devoted to Good Vows; the Pleasant-faced; the Subtle; the Sweet-sounding; the Giver of Happiness; the Friend; the Captivating; the One Who Has Conquered Anger; the Strong-armed; the Piercer.`,
   [`सुव्रतः`,`सुमुखः`,`सूक्ष्मः`,`सुघोषः`,`सुखदः`,`सुहृत्`,`मनोहरः`,`जितक्रोधः`,`वीरबाहुः`,`विदारणः`]],
  // Shloka 50
  [`स्वापनः स्ववशो व्यापी नैकात्मा नैककर्मकृत् ।`,`वत्सरो वत्सलो वत्सी रत्नगर्भो धनेश्वरः ॥`,
   `svāpanaḥ svavaśo vyāpī naikātmā naikakarmakṛt,`,`vatsarō vatsalō vatsī ratnagarbhō dhaneśvaraḥ.`,
   `The Inducer of Sleep; the Self-controlled; the Pervading; the One of Many Selves; the One of Many Actions; the Year; the Affectionate; the Cherisher; the Gem-wombed; the Lord of Wealth.`,
   [`स्वापनः`,`स्ववशः`,`व्यापी`,`नैकात्मा`,`नैककर्मकृत्`,`वत्सरः`,`वत्सलः`,`वत्सी`,`रत्नगर्भः`,`धनेश्वरः`]],
  // Shloka 51
  [`धर्मगुब्धर्मकृद्धर्मी सदसत्क्षरमक्षरम् ।`,`अविज्ञाता सहस्रांशुर्विधाता कृतलक्षणः ॥`,
   `dharmagubdharmakṛddharmī sadasatkṣaramakṣaram,`,`avijñātā sahasrāṁśurvidhātā kṛtalakṣaṇaḥ.`,
   `The Protector of Dharma; the Doer of Dharma; the Dharma; the Real and Unreal; the Perishable and Imperishable; the Unknown; the Thousand-rayed; the Ordainer; the One with Created Marks.`,
   [`धर्मगुप्`,`धर्मकृत्`,`धर्मी`,`सत्`,`असत्`,`क्षरम्`,`अक्षरम्`,`अविज्ञाता`,`सहस्रांशुः`,`विधाता`,`कृतलक्षणः`]],
  // Shloka 52
  [`गभस्तिनेमिः सत्त्वस्थः सिंहो भूतमहेश्वरः ।`,`आदिदेवो महादेवो देवेशो देवभृद्गुरुः ॥`,
   `gabhastinemiḥ sattvasthaḥ siṁhō bhūtamaheśvaraḥ,`,`ādidevō mahādevō deveśō devabhṛdguruḥ.`,
   `The Hub of Light; the Established in Sattva; the Lion; the Great Lord of Beings; the Primordial God; the Great God; the Lord of Gods; the Nourisher of Gods; the Teacher.`,
   [`गभस्तिनेमिः`,`सत्त्वस्थः`,`सिंहः`,`भूतमहेश्वरः`,`आदिदेवः`,`महादेवः`,`देवेशः`,`देवभृत्`,`गुरुः`]],
  // Shloka 53
  [`उत्तरो गोपतिर्गोप्ता ज्ञानगम्यः पुरातनः ।`,`शरीरभूतभृद्भोक्ता कपीन्द्रो भूरिदक्षिणः ॥`,
   `uttarō gōpatirgōptā jñānagamyaḥ purātanaḥ,`,`śarīrabhūtabhṛdbhōktā kapīndrō bhūridakṣiṇaḥ.`,
   `The Superior; the Lord of the Earth; the Protector; the Attainable through Knowledge; the Ancient; the Supporter of Bodies and Elements; the Enjoyer; the Lord of Monkeys; the One with Many Dakshinas.`,
   [`उत्तरः`,`गोपतिः`,`गोप्ता`,`ज्ञानगम्यः`,`पुरातनः`,`शरीरभूतभृत्`,`भोक्ता`,`कपीन्द्रः`,`भूरिदक्षिणः`]],
  // Shloka 54
  [`सोमपोऽमृतपः सोमः पुरुजित्पुरुसत्तमः ।`,`विनयो जयः सत्यसन्धो दाशार्हः सात्वताम्पतिः ॥`,
   `sōmapō'mṛtapaḥ sōmaḥ purujit purusattamaḥ,`,`vinayō jayaḥ satyasandhō dāśārhassātvatāṁpatiḥ.`,
   `The Drinker of Soma; the Drinker of Nectar; the Moon; the Conqueror of Many; the Best of Many; the Humble; the Victorious; the One of True Resolve; the Lord of the Satvatas.`,
   [`सोमपः`,`अमृतपः`,`सोमः`,`पुरुजित्`,`पुरुसत्तमः`,`विनयः`,`जयः`,`सत्यसन्धः`,`दाशार्हः`,`सात्वताम्पतिः`]],
  // Shloka 55
  [`जीवो विनयिता साक्षी मुकुन्दोऽमितविक्रमः ।`,`अम्भोनिधिरनन्तात्मा महोदधिशयोऽन्तकः ॥`,
   `jīvō vinayitā sākṣī mukundōmitavikramaḥ,`,`ambhōnidhiranantātmā mahōdadhiśayō'ntakaḥ.`,
   `The Individual Self; the Humble One; the Witness; the Liberator; the One of Immeasurable Prowess; the Ocean of Waters; the Infinite Self; the One Who Lies on the Great Ocean; the Ender.`,
   [`जीवः`,`विनयिता`,`साक्षी`,`मुकुन्दः`,`अमितविक्रमः`,`अम्भोनिधिः`,`अनन्तात्मा`,`महोदधिशयः`,`अन्तकः`]],
  // Shloka 56
  [`अजो महार्हः स्वाभाव्यो जितामित्रः प्रमोदनः ।`,`आनन्दो नन्दनो नन्दः सत्यधर्मा त्रिविक्रमः ॥`,
   `ajō mahārhaḥ svābhāvyō jitāmitraḥ pramōdanaḥ,`,`ānandō nandanō nandaḥ satyadharmā trivikramaḥ.`,
   `The Unborn; the Greatly Worthy; the Natural; the Conqueror of Enemies; the Delighter; the Bliss; the Joyful; the Joy; the One of True Dharma; the Three-striding.`,
   [`अजः`,`महार्हः`,`स्वाभाव्यः`,`जितामित्रः`,`प्रमोदनः`,`आनन्दः`,`नन्दनः`,`नन्दः`,`सत्यधर्मा`,`त्रिविक्रमः`]],
  // Shloka 57
  [`महर्षिः कपिलाचार्यः कृतज्ञो मेदिनीपतिः ।`,`त्रिपदस्त्रिदशाध्यक्षो महाशृङ्गः कृतान्तकृत् ॥`,
   `maharṣiḥ kapilācāryaḥ kṛtajñō medinīpatiḥ,`,`tripadastridaśādhyakṣō mahāśṛṅgaḥ kṛtāntakṛt.`,
   `The Great Sage; the Teacher Kapila; the Grateful; the Lord of the Earth; the Three-stepped; the Lord of the Three States; the Great-horned; the Maker of the End.`,
   [`महर्षिः`,`कपिलाचार्यः`,`कृतज्ञः`,`मेदिनीपतिः`,`त्रिपदः`,`त्रिदशाध्यक्षः`,`महाशृङ्गः`,`कृतान्तकृत्`]],
  // Shloka 58
  [`महावराहो गोविन्दः सुषेणः कनकाङ्गदी ।`,`गुह्यो गभीरो गहनो गुप्तश्चक्रगदाधरः ॥`,
   `mahāvarāhō gōvindaḥ suṣeṇaḥ kanakāṅgadī,`,`guhyō gabhīrō gahanō guptaścakragadādharaḥ.`,
   `The Great Boar; the Lord of Cows; the One with a Good Army; the Golden-armleted; the Secret; the Profound; the Impenetrable; the Hidden; the Holder of Discus and Mace.`,
   [`महावराहः`,`गोविन्दः`,`सुषेणः`,`कनकाङ्गदी`,`गुह्यः`,`गभीरः`,`गहनः`,`गुप्तः`,`चक्रगदाधरः`]],
  // Shloka 59
  [`वेधाः स्वाङ्गोऽजितः कृष्णो दृढः सङ्कर्षणोऽच्युतः ।`,`वरुणो वारुणो वृक्षः पुष्कराक्षो महामनाः ॥`,
   `vedhāḥ svāṅgō'jitaḥ kṛṣṇō dṛḍhaḥ saṅkarṣaṇō'cyutaḥ,`,`varuṇō vāruṇō vṛkṣaḥ puṣkarākṣō mahāmanāḥ.`,
   `The Ordainer; the Self-limbed; the Unconquered; the Dark; the Firm; the Attractor; the Imperishable; the Western Lord; the Son of Varuna; the Tree; the Lotus-eyed; the Great-minded.`,
   [`वेधाः`,`स्वाङ्गः`,`अजितः`,`कृष्णः`,`दृढः`,`सङ्कर्षणः`,`अच्युतः`,`वरुणः`,`वारुणः`,`वृक्षः`,`पुष्कराक्षः`,`महामनाः`]],
  // Shloka 60
  [`भगवान् भगहाऽऽनन्दी वनमाली हलायुधः ।`,`आदित्यो ज्योतिरादित्यः सहिष्णुर्गतिसत्तमः ॥`,
   `bhagavān bhagahā''nandī vanamālī halāyudhaḥ,`,`ādityō jyōtirādityaḥ sahiṣṇurgatisattamaḥ.`,
   `The Lord; the Destroyer of Prosperity; the Blissful; the Garlanded; the One with Plough as Weapon; the Son of Aditi; the Solar Light; the Forbearing; the Best Goal.`,
   [`भगवान्`,`भगहा`,`आनन्दी`,`वनमाली`,`हलायुधः`,`आदित्यः`,`ज्योतिरादित्यः`,`सहिष्णुः`,`गतिसत्तमः`]],
  // Shloka 61
  [`सुधन्वा खण्डपरशुर्दारुणो द्रविणप्रदः ।`,`दिवस्पृक् सर्वदृग्व्यासो वाचस्पतिरयोनिजः ॥`,
   `sudhanvā khaṇḍaparaśurdāruṇō draviṇapradaḥ,`,`divaspṛk sarvadṛgvyāsō vācaspatirayōnijaḥ.`,
   `The One with a Good Bow; the One with Battle-axe; the Merciless; the Giver of Wealth; the Touching Heaven; the All-seeing Arranger; the Lord of Speech; the Not-born of a Womb.`,
   [`सुधन्वा`,`खण्डपरशुः`,`दारुणः`,`द्रविणप्रदः`,`दिवस्पृक्`,`सर्वदृक्`,`व्यासः`,`वाचस्पतिः`,`अयोनिजः`]],
  // Shloka 62
  [`त्रिसामा सामगः साम निर्वाणं भेषजं भिषक् ।`,`संन्यासकृच्छमः शान्तो निष्ठा शान्तिः परायणम् ॥`,
   `trisāmā sāmagaḥ sāma nirvāṇaṁ bheṣajaṁ bhiṣak,`,`saṁnyāsakṛcchamaḥ śāntō niṣṭhā śāntiḥ parāyaṇam.`,
   `The One with Three Samans; the Chanters of Sama; the Sama Veda; the Liberation; the Medicine; the Physician; the Institutor of Sannyasa; the Tranquil; the Peaceful; the Abode; the Peace; the Supreme Goal.`,
   [`त्रिसामा`,`सामगः`,`साम`,`निर्वाणम्`,`भेषजम्`,`भिषक्`,`संन्यासकृत्`,`शमः`,`शान्तः`,`निष्ठा`,`शान्तिः`,`परायणम्`]],
  // Shloka 63
  [`शुभाङ्गः शान्तिदः स्रष्टा कुमुदः कुवलेशयः ।`,`गोहितो गोपतिर्गोप्ता वृषभाक्षो वृषप्रियः ॥`,
   `śubhāṅgaḥ śāntidaḥ sraṣṭā kumudaḥ kuvaleśayaḥ,`,`gōhitō gōpatirgōptā vṛṣabhākṣō vṛṣapriyaḥ.`,
   `The Beautiful-limbed; the Giver of Peace; the Creator; the Earth-delighter; the One Who Lies in Water; the Cow-benefiter; the Lord of Cows; the Protector; the Bull-eyed; the Lover of Dharma.`,
   [`शुभाङ्गः`,`शान्तिदः`,`स्रष्टा`,`कुमुदः`,`कुवलेशयः`,`गोहितः`,`गोपतिः`,`गोप्ता`,`वृषभाक्षः`,`वृषप्रियः`]],
  // Shloka 64
  [`अनिवर्ती निवृत्तात्मा सङ्क्षेप्ता क्षेमकृच्छिवः ।`,`श्रीवत्सवक्षाः श्रीवासः श्रीपतिः श्रीमतांवरः ॥`,
   `anivartī nivṛttātmā saṅkṣeptā kṣemakṛcchivaḥ,`,`śrīvatsavakṣāḥ śrīvāsaḥ śrīpatiḥ śrīmatāṁ varaḥ.`,
   `The Non-returning; the Withdrawn Self; the Contracter; the Doer of Good; the Auspicious; the One with Srivatsa on His Chest; the Abode of Lakshmi; the Consort of Lakshmi; the Best of the Glorious.`,
   [`अनिवर्ती`,`निवृत्तात्मा`,`सङ्क्षेप्ता`,`क्षेमकृत्`,`शिवः`,`श्रीवत्सवक्षाः`,`श्रीवासः`,`श्रीपतिः`,`श्रीमतां वरः`]],
  // Shloka 65
  [`श्रीदः श्रीशः श्रीनिवासः श्रीनिधिः श्रीविभावनः ।`,`श्रीधरः श्रीकरः श्रेयः श्रीमाँल्लोकत्रयाश्रयः ॥`,
   `śrīdaḥ śrīśaḥ śrīnivāsaḥ śrīnidhiḥ śrīvibhāvanaḥ,`,`śrīdharaḥ śrīkaraḥ śreyaḥ śrīmān lōkatrayāśrayaḥ.`,
   `The Giver of Prosperity; the Lord of Lakshmi; the Abode of Lakshmi; the Treasure of Lakshmi; the Manifestor of Lakshmi; the Bearer of Lakshmi; the Creator of Prosperity; the Bliss; the Glorious; the Support of the Three Worlds.`,
   [`श्रीदः`,`श्रीशः`,`श्रीनिवासः`,`श्रीनिधिः`,`श्रीविभावनः`,`श्रीधरः`,`श्रीकरः`,`श्रेयः`,`श्रीमान्`,`लोकत्रयाश्रयः`]],
  // Shloka 66
  [`स्वक्षः स्वङ्गः शतानन्दो नन्दिर्ज्योतिर्गणेश्वरः ।`,`विजितात्मा विधेयात्मा सत्कीर्तिश्छिन्नसंशयः ॥`,
   `svakṣaḥ svaṅgaḥ śatānandō nandirjyōtirgaṇeśvaraḥ,`,`vijitātmā vidheyātmā satkīrtiśchinnasaṁśayaḥ.`,
   `The Beautiful-eyed; the Beautiful-limbed; the Hundredfold Bliss; the Joy; the Lord of the Luminous Host; the Conquered Self; the Controllable Self; the True Glory; the One Whose Doubts Are Cut.`,
   [`स्वक्षः`,`स्वङ्गः`,`शतानन्दः`,`नन्दिः`,`ज्योतिर्गणेश्वरः`,`विजितात्मा`,`विधेयात्मा`,`सत्कीर्तिः`,`छिन्नसंशयः`]],
  // Shloka 67
  [`उदीर्णः सर्वतश्चक्षुरनीशः शाश्वतस्थिरः ।`,`भूशयो भूषणो भूतिर्विशोकः शोकनाशनः ॥`,
   `udīrṇaḥ sarvataścakṣuranīśaḥ śāśvatasthiraḥ,`,`bhūśayō bhūṣaṇō bhūtirviśōkaḥ śōkanāśanaḥ.`,
   `The Elevated; the All-seeing; the Lordless; the Eternally Firm; the Earth-lying; the Adornment; the Prosperity; the Sorrowless; the Destroyer of Sorrow.`,
   [`उदीर्णः`,`सर्वतश्चक्षुः`,`अनीशः`,`शाश्वतस्थिरः`,`भूशयः`,`भूषणः`,`भूतिः`,`विशोकः`,`शोकनाशनः`]],
  // Shloka 68
  [`अर्चिष्मानर्चितः कुम्भो विशुद्धात्मा विशोधनः ।`,`अनिरुद्धोऽप्रतिरथः प्रद्युम्नोऽमितविक्रमः ॥`,
   `arciṣmānarcitaḥ kuṁbhō viśuddhātmā viśōdhanaḥ,`,`aniruddhō'pratirathaḥ pradyumnōmitavikramaḥ.`,
   `The Luminous; the Worshipped; the Pot; the Pure Self; the Purifier; the Unobstructed; the Peerless Warrior; the Great Wealth; the One of Immeasurable Prowess.`,
   [`अर्चिष्मान्`,`अर्चितः`,`कुम्भः`,`विशुद्धात्मा`,`विशोधनः`,`अनिरुद्धः`,`अप्रतिरथः`,`प्रद्युम्नः`,`अमितविक्रमः`]],
  // Shloka 69
  [`कालनेमिनिहा वीरः शौरिः शूरजनेश्वरः ।`,`त्रिलोकात्मा त्रिलोकेशः केशवः केशिहा हरिः ॥`,
   `kālaneminihā vīraḥ śauriḥ śūrajaneśvaraḥ,`,`trilōkātmā trilōkeśaḥ keśavaḥ keśihā hariḥ.`,
   `The Slayer of Kalanemi; the Valiant; the Descendant of Sura; the Lord of the Brave; the Self of the Three Worlds; the Lord of the Three Worlds; the Beautiful-haired; the Slayer of Keshi; the Remover.`,
   [`कालनेमिनिहा`,`वीरः`,`शौरिः`,`शूरजनेश्वरः`,`त्रिलोकात्मा`,`त्रिलोकेशः`,`केशवः`,`केशिहा`,`हरिः`]],
  // Shloka 70
  [`कामदेवः कामपालः कामी कान्तः कृतागमः ।`,`अनिर्देश्यवपुर्विष्णुर्वीरोऽनन्तो धनञ्जयः ॥`,
   `kāmadevaḥ kāmapālaḥ kāmī kāntaḥ kṛtāgamaḥ,`,`anirdeśyavapurviṣṇurvīrōnantō dhanañjayaḥ.`,
   `The God of Desire; the Protector of Desires; the Desirer; the Beloved; the Creator of Scriptures; the Indescribable-formed; the All-pervading; the Valiant; the Infinite; the Winner of Wealth.`,
   [`कामदेवः`,`कामपालः`,`कामी`,`कान्तः`,`कृतागमः`,`अनिर्देश्यवपुः`,`विष्णुः`,`वीरः`,`अनन्तः`,`धनञ्जयः`]],
  // Shloka 71
  [`ब्रह्मण्यो ब्रह्मकृद् ब्रह्मा ब्रह्म ब्रह्मविवर्धनः ।`,`ब्रह्मविद् ब्राह्मणो ब्रह्मी ब्रह्मज्ञो ब्राह्मणप्रियः ॥`,
   `brahmaṇyō brahmakṛdbrahmā brahma brahmavivardhanaḥ,`,`brahmavidbrāhmaṇō brahmī brahmajñō brāhmaṇapriyaḥ.`,
   `The Devoted to Brahman; the Creator of Brahman; the Creator; the Absolute; the Increaser of Brahman; the Knower of Brahman; the Brahmana; the Established in Brahman; the Knower of Brahman; the Lover of Brahmanas.`,
   [`ब्रह्मण्यः`,`ब्रह्मकृत्`,`ब्रह्मा`,`ब्रह्म`,`ब्रह्मविवर्धनः`,`ब्रह्मवित्`,`ब्राह्मणः`,`ब्रह्मी`,`ब्रह्मज्ञः`,`ब्राह्मणप्रियः`]],
  // Shloka 72
  [`महाक्रमो महाकर्मा महातेजा महोरगः ।`,`महाक्रतुर्महायज्वा महायज्ञो महाहविः ॥`,
   `mahākramō mahākarmā mahātejā mahōragaḥ,`,`mahākraturmahāyajvā mahāyajñō mahāhaviḥ.`,
   `The Great-stepped; the Great-deeded; the Greatly Radiant; the Great Serpent; the Great Sacrifice; the Great Performer of Sacrifices; the Great Yajna; the Great Offering.`,
   [`महाक्रमः`,`महाकर्मा`,`महातेजाः`,`महोरगः`,`महाक्रतुः`,`महायज्वा`,`महायज्ञः`,`महाहविः`]],
  // Shloka 73
  [`स्तव्यः स्तवप्रियः स्तोत्रं स्तुतिः स्तोता रणप्रियः ।`,`पूर्णः पूरयिता पुण्यः पुण्यकीर्तिरनामयः ॥`,
   `stavyaḥ stavapriyaḥ stōtraṁ stutiḥ stōtā raṇapriyaḥ,`,`pūrṇaḥ pūrayitā puṇyaḥ puṇyakīrtiranāmayaḥ.`,
   `The Praiseworthy; the Lover of Praise; the Hymn; the Praise; the Praiser; the Lover of War; the Full; the Fulfiller; the Holy; the Holy-named; the Healthful.`,
   [`स्तव्यः`,`स्तवप्रियः`,`स्तोत्रम्`,`स्तुतिः`,`स्तोता`,`रणप्रियः`,`पूर्णः`,`पूरयिता`,`पुण्यः`,`पुण्यकीर्तिः`,`अनामयः`]],
  // Shloka 74
  [`मनोजवस्तीर्थकरो वसुरेता वसुप्रदः ।`,`वसुप्रदो वासुदेवो वसुर्वसुमना हविः ॥`,
   `manōjavastīrthakarō vasuretā vasupradaḥ,`,`vasupradō vāsudevō vasurvasumanā haviḥ.`,
   `The Swift as Mind; the Maker of Sacred Places; the One with Golden Seed; the Giver of Wealth; again the Giver of Wealth; the Son of Vasudeva; the Wealth; the Noble-minded; the Offering.`,
   [`मनोजवः`,`तीर्थकरः`,`वसुरेताः`,`वसुप्रदः`,`वसुप्रदः`,`वासुदेवः`,`वसुः`,`वसुमनाः`,`हविः`]],
  // Shloka 75
  [`सद्गतिः सत्कृतिः सत्ता सद्भूतिः सत्परायणः ।`,`शूरसेनो यदुश्रेष्ठः सन्निवासः सुयामुनः ॥`,
   `sadgatiḥ satkṛtiḥ sattā sadbhūtiḥ satparāyaṇaḥ,`,`śūrasenō yaduśreṣṭhaḥ sannivāsaḥ suyāmunaḥ.`,
   `The Good Goal; the Good Deed; the Existence; the Good Prosperity; the Resort of the Good; the Lord of the Shurasena Clan; the Best of the Yadus; the Good Abode; the One of the Yamuna Region.`,
   [`सद्गतिः`,`सत्कृतिः`,`सत्ता`,`सद्भूतिः`,`सत्परायणः`,`शूरसेनः`,`यदुश्रेष्ठः`,`सन्निवासः`,`सुयामुनः`]],
  // Shloka 76
  [`भूतावासो वासुदेवः सर्वासुनिलयोऽनलः ।`,`दर्पहा दर्पदो दृप्तो दुर्धरोऽथापराजितः ॥`,
   `bhūtāvāsō vāsudevaḥ sarvāsunilayōnalaḥ,`,`darpahā darpadō dṛptō durdharō'thāparājitaḥ.`,
   `The Abode of Beings; the All-pervading Lord; the Abode of All Life-breaths; the Fire; the Destroyer of Pride; the Giver of Pride; the Proud; the Hard to Bear; the Unconquered.`,
   [`भूतावासः`,`वासुदेवः`,`सर्वासुनिलयः`,`अनलः`,`दर्पहा`,`दर्पदः`,`दृप्तः`,`दुर्धरः`,`अपराजितः`]],
  // Shloka 77
  [`विश्वमूर्तिर्महामूर्तिर्दीप्तमूर्तिरमूर्तिमान् ।`,`अनेकमूर्तिरव्यक्तः शतमूर्तिः शताननः ॥`,
   `viśvamūrtirmahāmūrtirdīptamūrtiramūrtimān,`,`anekamūrtiravyaktaḥ śatamūrtiḥ śatānanaḥ.`,
   `The Universal-formed; the Great-formed; the Radiant-formed; the Formless; the Multiformed; the Unmanifest; the Hundred-formed; the Hundred-faced.`,
   [`विश्वमूर्तिः`,`महामूर्तिः`,`दीप्तमूर्तिः`,`अमूर्तिमान्`,`अनेकमूर्तिः`,`अव्यक्तः`,`शतमूर्तिः`,`शताननः`]],
  // Shloka 78
  [`एको नैकः सवः कः किं यत् तत्पदमनुत्तमम् ।`,`लोकबन्धुर्लोकनाथो माधवो भक्तवत्सलः ॥`,
   `ekō naikaḥ savaḥ kaḥ kiṁ yattatpadamanuttamam,`,`lōkabandhurlōkanāthō mādhavō bhaktavatsalaḥ.`,
   `The One; the Many; the Soma Sacrifice; the Joy; the What; the Which; the That; the Supreme State; the Friend of the World; the Lord of the World; the Lord of Knowledge; the Lover of Devotees.`,
   [`एकः`,`नैकः`,`सवः`,`कः`,`किम्`,`यत्`,`तत्`,`पदमनुत्तमम्`,`लोकबन्धुः`,`लोकनाथः`,`माधवः`,`भक्तवत्सलः`]],
  // Shloka 79
  [`सुवर्णवर्णो हेमाङ्गो वराङ्गश्चन्दनाङ्गदी ।`,`वीरहा विषमः शून्यो घृताशीरचलश्चलः ॥`,
   `suvarṇavarṇō hemāṅgō varāṅgaścandanāṅgadī,`,`vīrahā viṣamaḥ śūnyō ghṛtāśīracalaścalaḥ.`,
   `The Golden-colored; the Golden-limbed; the Excellent-limbed; the Sandal-armleted; the Slayer of Heroes; the Unequaled; the Void; the Butter-eating; the Motionless; the Moving.`,
   [`सुवर्णवर्णः`,`हेमाङ्गः`,`वराङ्गः`,`चन्दनाङ्गदी`,`वीरहा`,`विषमः`,`शून्यः`,`घृताशीः`,`अचलः`,`चलः`]],
  // Shloka 80
  [`अमानी मानदो मान्यो लोकस्वामी त्रिलोकधृक् ।`,`सुमेधा मेधजो धन्यः सत्यमेधा धराधरः ॥`,
   `amānī mānadō mānyō lōkasvāmī trilōkadhṛk,`,`sumedhā medhajō dhanyaḥ satyamedhā dharādharaḥ.`,
   `The Not-proud; the Giver of Honor; the Honorable; the Lord of the World; the Supporter of the Three Worlds; the Wise; the Born of Sacrifice; the Fortunate; the True-minded; the Supporter of the Earth.`,
   [`अमानी`,`मानदः`,`मान्यः`,`लोकस्वामी`,`त्रिलोकधृक्`,`सुमेधाः`,`मेधजः`,`धन्यः`,`सत्यमेधाः`,`धराधरः`]],
  // Shloka 81
  [`तेजोवृषो द्युतिधरः सर्वशस्त्रभृतां वरः ।`,`प्रग्रहो निग्रहो व्यग्रो नैकशृङ्गो गदाग्रजः ॥`,
   `tejōvṛṣō dyutidharaḥ sarvaśastrabhṛtāṁ varaḥ,`,`pragrahō nigrahō vyagrō naikaśṛṅgō gadāgrajaḥ.`,
   `The Showerer of Brilliance; the Holder of Splendor; the Best of All Weapon-bearers; the Receiver; the Restrainer; the Eager; the Many-horned; the Elder of Gada.`,
   [`तेजोवृषः`,`द्युतिधरः`,`सर्वशस्त्रभृतां वरः`,`प्रग्रहः`,`निग्रहः`,`व्यग्रः`,`नैकशृङ्गः`,`गदाग्रजः`]],
  // Shloka 82
  [`चतुर्मूर्तिश्चतुर्बाहुश्चतुर्व्यूहश्चतुर्गतिः ।`,`चतुरात्मा चतुर्भावश्चतुर्वेदविदेकपात् ॥`,
   `caturmūrtiścaturbāhuścaturvyūhaścaturgatiḥ,`,`caturātmā caturbhāvaścaturvedavidekapāt.`,
   `The Four-formed; the Four-armed; the Four-manifested; the Four-goaled; the Four-souled; the Four-natured; the Knower of the Four Vedas; the One-footed.`,
   [`चतुर्मूर्तिः`,`चतुर्बाहुः`,`चतुर्व्यूहः`,`चतुर्गतिः`,`चतुरात्मा`,`चतुर्भावः`,`चतुर्वेदवित्`,`एकपात्`]],
  // Shloka 83
  [`समावर्तोऽनिवृत्तात्मा दुर्जयो दुरतिक्रमः ।`,`दुर्लभो दुर्गमो दुर्गो दुरावासो दुरारिहा ॥`,
   `samāvartō'nivṛttātmā durjayō duratikramaḥ,`,`durlabhō durgamō durgō durāvāsō durārihā.`,
   `The Well-returning; the Non-withdrawn Self; the Unconquerable; the Insurmountable; the Hard to Attain; the Hard to Reach; the Hard Fortress; the Hard to Dwell In; the Slayer of Fierce Enemies.`,
   [`समावर्तः`,`अनिवृत्तात्मा`,`दुर्जयः`,`दुरतिक्रमः`,`दुर्लभः`,`दुर्गमः`,`दुर्गः`,`दुरावासः`,`दुरारिहा`]],
  // Shloka 84
  [`शुभाङ्गो लोकसारङ्गः सुतन्तुस्तन्तुवर्धनः ।`,`इन्द्रकर्मा महाकर्मा कृतकर्मा कृतागमः ॥`,
   `śubhāṅgō lōkasāraṅgaḥ sutantustantuvardhanaḥ,`,`indrakarmā mahākarmā kṛtakarmā kṛtāgamaḥ.`,
   `The Beautiful-limbed; the Bee of the World; the Good Thread; the Increaser of the Thread; the One with Indra's Actions; the Great-deeded; the One Whose Work Is Done; the Creator of Scriptures.`,
   [`शुभाङ्गः`,`लोकसारङ्गः`,`सुतन्तुः`,`तन्तुवर्धनः`,`इन्द्रकर्मा`,`महाकर्मा`,`कृतकर्मा`,`कृतागमः`]],
  // Shloka 85
  [`उद्भवः सुन्दरः सुन्दो रत्ननाभः सुलोचनः ।`,`अर्को वाजसनः शृङ्गी जयन्तः सर्वविज्जयी ॥`,
   `udbhavaḥ sundaraḥ sundō ratnanābhaḥ sulōcanaḥ,`,`arkō vājasanaḥ śṛṅgī jayantaḥ sarvavijjayī.`,
   `The Origin; the Beautiful; the Tender; the Gem-naveled; the Good-eyed; the Sun; the Giver of Food; the Horned; the Victorious; the All-knowing Conqueror.`,
   [`उद्भवः`,`सुन्दरः`,`सुन्दः`,`रत्ननाभः`,`सुलोचनः`,`अर्कः`,`वाजसनः`,`शृङ्गी`,`जयन्तः`,`सर्ववित्`,`जयी`]],
  // Shloka 86
  [`सुवर्णबिन्दुरक्षोभ्यः सर्ववागीश्वरेश्वरः ।`,`महाह्रदो महागर्तो महाभूतो महानिधिः ॥`,
   `suvarṇabindurakṣōbhyaḥ sarvavāgīśvareśvaraḥ,`,`mahāhradō mahāgartō mahābhūtō mahānidhiḥ.`,
   `The Golden-dotted; the Unshakeable; the Lord of All Lords of Speech; the Great Lake; the Great Pit; the Great Being; the Great Treasure.`,
   [`सुवर्णबिन्दुः`,`अक्षोभ्यः`,`सर्ववागीश्वरेश्वरः`,`महाह्रदः`,`महागर्तः`,`महाभूतः`,`महानिधिः`]],
  // Shloka 87
  [`कुमुदः कुन्दरः कुन्दः पर्जन्यः पावनोऽनिलः ।`,`अमृताशोऽमृतवपुः सर्वज्ञः सर्वतोमुखः ॥`,
   `kumudaḥ kundaraḥ kundaḥ parjanyaḥ pāvano'nilaḥ,`,`amṛtāśō'mṛtavapuḥ sarvajñaḥ sarvatōmukhaḥ.`,
   `The Earth-delighter; the Jasmine-like; the Jasmine; the Rain-cloud; the Purifier; the Wind; the Nectar-eater; the Nectar-bodied; the All-knowing; the All-facing.`,
   [`कुमुदः`,`कुन्दरः`,`कुन्दः`,`पर्जन्यः`,`पावनः`,`अनिलः`,`अमृताशः`,`अमृतवपुः`,`सर्वज्ञः`,`सर्वतोमुखः`]],
  // Shloka 88
  [`सुलभः सुव्रतः सिद्धः शत्रुजिच्छत्रुतापनः ।`,`न्यग्रोधोऽदुम्बरोऽश्वत्थश्चाणूरान्ध्रनिषूदनः ॥`,
   `sulabhaḥ suvrataḥ siddhaḥ śatrujicchatrutāpanaḥ,`,`nyagrodhō'dumbarō'śvatthaścāṇūrāndhraniṣūdanaḥ.`,
   `The Easily Attainable; the Devoted to Good; the Perfect; the Conqueror of Enemies; the Scorcher of Enemies; the Banyan Tree; the Udumbara; the Holy Fig; the Slayer of Chanura and Andhra.`,
   [`सुलभः`,`सुव्रतः`,`सिद्धः`,`शत्रुजित्`,`शत्रुतापनः`,`न्यग्रोधः`,`उदुम्बरः`,`अश्वत्थः`,`चाणूरान्ध्रनिषूदनः`]],
  // Shloka 89
  [`सहस्रार्चिः सप्तजिह्वः सप्तैधाः सप्तवाहनः ।`,`अमूर्तिरनघोऽचिन्त्यो भयकृद्भयनाशनः ॥`,
   `sahasrārciḥ saptajihvaḥ saptaidhāḥ saptavāhanaḥ,`,`amūrtiranaghō'cintyō bhayakṛdbhayanāśanaḥ.`,
   `The Thousand-rayed; the Seven-tongued; the Seven-fueled; the Seven-vehicled; the Formless; the Sinless; the Inconceivable; the Creator of Fear; the Destroyer of Fear.`,
   [`सहस्रार्चिः`,`सप्तजिह्वः`,`सप्तैधाः`,`सप्तवाहनः`,`अमूर्तिः`,`अनघः`,`अचिन्त्यः`,`भयकृत्`,`भयनाशनः`]],
  // Shloka 90
  [`अणुर्बृहत्कृशः स्थूलो गुणभृन्निर्गुणो महान् ।`,`अधृतः स्वधृतः स्वास्यः प्राग्वंशो वंशवर्धनः ॥`,
   `aṇurbṛhatkṛśaḥ sthūlō guṇabhṛnnirguṇō mahān,`,`adhṛtaḥ svadhṛtaḥ svāsyaḥ prāgvaṁśō vaṁśavardhanaḥ.`,
   `The Atomic; the Vast; the Thin; the Gross; the Supporter of Qualities; the Qualityless; the Great; the Unsupported; the Self-supported; the Beautiful-faced; the Original Dynasty; the Increaser of Dynasty.`,
   [`अणुः`,`बृहत्`,`कृशः`,`स्थूलः`,`गुणभृत्`,`निर्गुणः`,`महान्`,`अधृतः`,`स्वधृतः`,`स्वास्यः`,`प्राग्वंशः`,`वंशवर्धनः`]],
  // Shloka 91
  [`भारभृत् कथितो योगी योगीशः सर्वकामदः ।`,`आश्रमः श्रमणः क्षामः सुपर्णो वायुवाहनः ॥`,
   `bhārabhṛt kathitō yōgī yōgīśaḥ sarvakāmadaḥ,`,`āśramaḥ śramaṇaḥ kṣāmaḥ suparṇō vāyuvāhanaḥ.`,
   `The Burden-bearer; the Proclaimed; the Yogi; the Lord of Yogis; the Giver of All Desires; the Hermitage; the Ascetic; the Wearied; the Fair-leafed; the Wind-vehicled.`,
   [`भारभृत्`,`कथितः`,`योगी`,`योगीशः`,`सर्वकामदः`,`आश्रमः`,`श्रमणः`,`क्षामः`,`सुपर्णः`,`वायुवाहनः`]],
  // Shloka 92
  [`धनुर्धरो धनुर्वेदो दण्डो दमयिता दमः ।`,`अपराजितः सर्वसहो नियन्ताऽनियमोऽयमः ॥`,
   `dhanurdharō dhanurvedō daṇḍō damayitā damaḥ,`,`aparājitaḥ sarvasahō niyantā niyamō yamaḥ.`,
   `The Bow-holder; the Science of Archery; the Staff; the Subduer; the Self-control; the Unconquered; the All-enduring; the Controller; the Without Rules; the Restrainer.`,
   [`धनुर्धरः`,`धनुर्वेदः`,`दण्डः`,`दमयिता`,`दमः`,`अपराजितः`,`सर्वसहः`,`नियन्ता`,`अनियमः`,`यमः`]],
  // Shloka 93
  [`सत्त्ववान् सात्त्विकः सत्यः सत्यधर्मपरायणः ।`,`अभिप्रायः प्रियार्होऽर्हः प्रियकृत् प्रीतिवर्धनः ॥`,
   `sattvavān sāttvikaḥ satyaḥ satyadharmaparāyaṇaḥ,`,`abhiprāyaḥ priyārḥorhaḥ priyakṛt prītivardhanaḥ.`,
   `The Possessor of Sattva; the Sattvic; the Truth; the One Devoted to True Dharma; the Intention; the Worthy of Love; the Worshipful; the Doer of Loving Acts; the Increaser of Joy.`,
   [`सत्त्ववान्`,`सात्त्विकः`,`सत्यः`,`सत्यधर्मपरायणः`,`अभिप्रायः`,`प्रियार्हः`,`अर्हः`,`प्रियकृत्`,`प्रीतिवर्धनः`]],
  // Shloka 94
  [`विहायसगतिर्ज्योतिः सुरुचिर्हुतभुग्विभुः ।`,`रविर्विरोचनः सूर्यः सविता रविलोचनः ॥`,
   `vihāyasagatirjyōtiḥ surucirhutabhugvibhuḥ,`,`ravirvirōcanaḥ sūryaḥ savitā ravilōcanaḥ.`,
   `The Moving in the Sky; the Light; the Beautiful; the Fire; the Pervading; the Sun; the Illuminer; the Solar; the Progenitor; the Sun-eyed.`,
   [`विहायसगतिः`,`ज्योतिः`,`सुरुचिः`,`हुतभुक्`,`विभुः`,`रविः`,`विरोचनः`,`सूर्यः`,`सविता`,`रविलोचनः`]],
  // Shloka 95
  [`अनन्तो हुतभुग्भोक्ता सुखदो नैकजोऽग्रजः ।`,`अनिर्विण्णः सदामर्षी लोकाधिष्ठानमद्भुतः ॥`,
   `anantō hutabhugbhōktā sukhadō naikajō'grajaḥ,`,`anirviṇṇaḥ sadāmarṣī lōkādhiṣṭhānamadbhutaḥ.`,
   `The Infinite; the Fire; the Enjoyer; the Giver of Happiness; the Many-born; the First-born; the Unwearied; the Ever-patient; the Support of the World; the Wonderful.`,
   [`अनन्तः`,`हुतभुक्`,`भोक्ता`,`सुखदः`,`नैकजः`,`अग्रजः`,`अनिर्विण्णः`,`सदामर्षी`,`लोकाधिष्ठानम्`,`अद्भुतः`]],
  // Shloka 96
  [`सनात्सनातनतमः कपिलः कपिरव्ययः ।`,`स्वस्तिदः स्वस्तिकृत्स्वस्ति स्वस्तिभुक्स्वस्तिदक्षिणः ॥`,
   `sanātsanātanatamaḥ kapilaḥ kapiravyayaḥ,`,`svastidaḥ svastikṛtsvasti svastibhuksvastidakṣiṇaḥ.`,
   `The Eternal; the Most Eternal; the Tawny; the Monkey; the Imperishable; the Giver of Welfare; the Doer of Welfare; the Welfare; the Enjoyer of Welfare; the Bestower of Welfare.`,
   [`सनात्`,`सनातनतमः`,`कपिलः`,`कपिः`,`अव्ययः`,`स्वस्तिदः`,`स्वस्तिकृत्`,`स्वस्ति`,`स्वस्तिभुक्`,`स्वस्तिदक्षिणः`]],
  // Shloka 97
  [`अरौद्रः कुण्डली चक्री विक्रम्यूर्जितशासनः ।`,`शब्दातिगः शब्दसहः शिशिरः शर्वरीकरः ॥`,
   `araudraḥ kuṇḍalī cakrī vikramyūrjitaśāsanaḥ,`,`śabdātigaḥ śabdasahaḥ śiśiraḥ śarvarīkaraḥ.`,
   `The Non-terrible; the Coiled One; the Discus-holder; the Valorous; the One with Powerful Rule; the Beyond Words; the Enduring of Words; the Cool; the Maker of Night.`,
   [`अरौद्रः`,`कुण्डली`,`चक्री`,`विक्रमी`,`ऊर्जितशासनः`,`शब्दातिगः`,`शब्दसहः`,`शिशिरः`,`शर्वरीकरः`]],
  // Shloka 98
  [`अक्रूरः पेशलो दक्षो दक्षिणः क्षमिणां वरः ।`,`विद्वत्तमो वीतभयः पुण्यश्रवणकीर्तनः ॥`,
   `akrūraḥ peśalō dakṣō dakṣiṇaḥ kṣamiṇāṁ varaḥ,`,`vidvattamō vītabhayaḥ puṇyaśravaṇakīrtanaḥ.`,
   `The Kind; the Tender; the Skilled; the Generous; the Best of the Forbearing; the Most Wise; the Fearless; the One Whose Hearing and Praise are Holy.`,
   [`अक्रूरः`,`पेशलः`,`दक्षः`,`दक्षिणः`,`क्षमिणां वरः`,`विद्वत्तमः`,`वीतभयः`,`पुण्यश्रवणकीर्तनः`]],
  // Shloka 99
  [`उत्तारणो दुष्कृतिहा पुण्यो दुःस्वप्ननाशनः ।`,`वीरहा रक्षणः सन्तो जीवनः पर्यवस्थितः ॥`,
   `uttāraṇō duṣkṛtihā puṇyō duḥsvapnanāśanaḥ,`,`vīrahā rakṣaṇaḥ santō jīvanaḥ paryavasthitaḥ.`,
   `The Saviour; the Destroyer of Evil; the Holy; the Destroyer of Bad Dreams; the Slayer of Heroes; the Protector; the Good; the Life; the All-pervading.`,
   [`उत्तारणः`,`दुष्कृतिहा`,`पुण्यः`,`दुःस्वप्ननाशनः`,`वीरहा`,`रक्षणः`,`सन्तः`,`जीवनः`,`पर्यवस्थितः`]],
  // Shloka 100
  [`अनन्तरूपोऽनन्तश्रीर्जितमन्युर्भयापहः ।`,`चतुरश्रो गभीरात्मा विदिशो व्यादिशो दिशः ॥`,
   `anantarūpō'nantaśrīrjitamanyurbhayāpahaḥ,`,`caturaśrō gabhīrātmā vidiśō vyādiśō diśaḥ.`,
   `The Infinite-formed; the Infinite-glory; the Conqueror of Anger; the Remover of Fear; the Square; the Deep Self; the Quarter; the Special Direction; the Direction.`,
   [`अनन्तरूपः`,`अनन्तश्रीः`,`जितमन्युः`,`भयापहः`,`चतुरश्रः`,`गभीरात्मा`,`विदिशः`,`व्यादिशः`,`दिशः`]],
  // Shloka 101
  [`अनादिर्भूर्भुवो लक्ष्मीः सुवीरो रुचिराङ्गदः ।`,`जननो जनजन्मादिर्भीमो भीमपराक्रमः ॥`,
   `anādirbhūrbhuvō lakṣmīḥ suvīrō rucirāṅgadaḥ,`,`jananō janajanmādirbhīmō bhīmaparākramaḥ.`,
   `The Beginningless; the Earth; the Prosperity; the Great Hero; the Bright-armleted; the Progenitor; the Origin of Beings' Birth; the Terrible; the Terribly Mighty.`,
   [`अनादिः`,`भूः`,`भुवः`,`लक्ष्मीः`,`सुवीरः`,`रुचिराङ्गदः`,`जननः`,`जनजन्मादिः`,`भीमः`,`भीमपराक्रमः`]],
  // Shloka 102
  [`आधारनिलयोऽधाता पुष्पहासः प्रजागरः ।`,`ऊर्ध्वगः सत्पथाचारः प्राणदः प्रणवः पणः ॥`,
   `ādhāranilayō'dhātā puṣpahāsaḥ prajāgaraḥ,`,`ūrdhvagaḥ satpathācāraḥ prāṇadaḥ praṇavaḥ paṇaḥ.`,
   `The Abode of Support; the Non-supporter; the Flower-blooming; the Ever-awake; the Upward-going; the Treader of the Good Path; the Giver of Life; the Pranava; the Transaction.`,
   [`आधारनिलयः`,`अधाता`,`पुष्पहासः`,`प्रजागरः`,`ऊर्ध्वगः`,`सत्पथाचारः`,`प्राणदः`,`प्रणवः`,`पणः`]],
  // Shloka 103
  [`प्रमाणं प्राणनिलयः प्राणभृत्प्राणजीवनः ।`,`तत्त्वं तत्त्वविदेकात्मा जन्ममृत्युजरातिगः ॥`,
   `pramāṇaṁ prāṇanilayaḥ prāṇabhṛtprāṇajīvanaḥ,`,`tattvaṁ tattvavidekātmā janmamṛtyujarātigaḥ.`,
   `The Criterion; the Abode of Life-breaths; the Sustainer of Life-breaths; the Life of Life-breaths; the Reality; the Knower of Reality; the One Self; the One Beyond Birth, Death and Old Age.`,
   [`प्रमाणम्`,`प्राणनिलयः`,`प्राणभृत्`,`प्राणजीवनः`,`तत्त्वम्`,`तत्त्ववित्`,`एकात्मा`,`जन्ममृत्युजरातिगः`]],
  // Shloka 104
  [`भूर्भुवःस्वस्तरुस्तारः सविता प्रपितामहः ।`,`यज्ञो यज्ञपतिर्यज्वा यज्ञाङ्गो यज्ञवाहनः ॥`,
   `bhūrbhuvaḥsvastarustāraḥ savitā prapitāmahaḥ,`,`yajñō yajñapatiryajvā yajñāṅgō yajñavāhanaḥ.`,
   `The Tree of the Three Vyahrtis; the Saviour; the Progenitor; the Great Grandfather; the Sacrifice; the Lord of Sacrifice; the Performer of Sacrifice; the Limb of Sacrifice; the Vehicle of Sacrifice.`,
   [`भूर्भुवःस्वस्तरुः`,`तारः`,`सविता`,`प्रपितामहः`,`यज्ञः`,`यज्ञपतिः`,`यज्वा`,`यज्ञाङ्गः`,`यज्ञवाहनः`]],
  // Shloka 105
  [`यज्ञभृद्यज्ञकृद्यज्ञी यज्ञभुग्यज्ञसाधनः ।`,`यज्ञान्तकृद्यज्ञगुह्यमन्नमन्नाद एव च ॥`,
   `yajñabhṛdyajñakṛdyajñī yajñabhugyajñasādhanaḥ,`,`yajñāntakṛdyajñaguhyamannamannāda eva ca.`,
   `The Supporter of Sacrifice; the Doer of Sacrifice; the Sacrificial; the Enjoyer of Sacrifice; the Accomplisher of Sacrifice; the End of Sacrifice; the Secret of Sacrifice; the Food; the Eater of Food.`,
   [`यज्ञभृत्`,`यज्ञकृत्`,`यज्ञी`,`यज्ञभुक्`,`यज्ञसाधनः`,`यज्ञान्तकृत्`,`यज्ञगुह्यम्`,`अन्नम्`,`अन्नादः`]],
  // Shloka 106
  [`आत्मयोनिः स्वयञ्जातो वैखानः सामगायनः ।`,`देवकीनन्दनः स्रष्टा क्षितीशः पापनाशनः ॥`,
   `ātmayōniḥ svayaṁjātō vaikhānaḥ sāmagāyanaḥ,`,`devakīnandanaḥ sraṣṭā kṣitīśaḥ pāpanāśanaḥ.`,
   `The Self-caused; the Self-born; the Forest-dweller; the Chanters of Sama; the Son of Devaki; the Creator; the Lord of the Earth; the Destroyer of Sin.`,
   [`आत्मयोनिः`,`स्वयञ्जातः`,`वैखानः`,`सामगायनः`,`देवकीनन्दनः`,`स्रष्टा`,`क्षितीशः`,`पापनाशनः`]],
  // Shloka 107
  [`शङ्खभृन्नन्दकी चक्री शार्ङ्गधन्वा गदाधरः ।`,`रथाङ्गपाणिरक्षोभ्यः सर्वप्रहरणायुधः ॥`,
   `śaṅkhabhṛnnandakī cakrī śārṅgadhanvā gadādharaḥ,`,`rathāṅgapāṇirakṣōbhyaḥ sarvapraharaṇāyudhaḥ.`,
   `The Holder of the Conch; the Holder of Nandaka; the Holder of the Discus; the Holder of the Sarnga Bow; the Holder of the Mace; the One with the Wheel in Hand; the Unshakeable; the One with All Weapons as His Arms.`,
   [`शङ्खभृत्`,`नन्दकी`,`चक्री`,`शार्ङ्गधन्वा`,`गदाधरः`,`रथाङ्गपाणिः`,`अक्षोभ्यः`,`सर्वप्रहरणायुधः`]],
  // Shloka 108
  [`वनमाली गदी शार्ङ्गी शङ्खी चक्री च नन्दकी ।`,`श्रीमान् नारायणो विष्णुर्वासुदेवोऽभिरक्षतु ॥`,
   `vanamālī gadī śārṅgī śaṅkhī cakrī ca nandakī,`,`śrīmān nārāyaṇō viṣṇurvāsudēvō'bhirakṣatu.`,
   `The Garlanded; the Mace-holder; the Bow-holder; the Conch-holder; the Discus-holder; the Sword-holder; the Glorious; the Refuge of Beings; the All-pervading; the Son of Vasudeva — May He protect us.`,
   [`वनमाली`,`गदी`,`शार्ङ्गी`,`शङ्खी`,`चक्री`,`नन्दकी`,`श्रीमान्`,`नारायणः`,`विष्णुः`,`वासुदेवः`]],
];

// Read the current HTML
let html = readFileSync('vishnu_sahasranama.html', 'utf8');

// Create a backup before modifying
copyFileSync('vishnu_sahasranama.html', 'vishnu_sahasranama.html.bak');

// Build the replacement code for shlokas 6-108
let shlokaObjects = '';
for (let i = 0; i < shlokaData.length; i++) {
  const idx = i + 6; // shloka number (6-108)
  const d = shlokaData[i];
  const namesList = d[5].map(n => `"${n}"`).join(', ');
  
  shlokaObjects += `  {
    num: ${idx},
    devanagari: "${d[0]}\\n${d[1]}",
    transliteration: "${d[2]}\\n${d[3]}",
    meaning: "${d[4]}",
    words: [],
    spiritual: "Shloka ${idx} of the Vishnu Sahasranama reveals the infinite names and qualities of Lord Vishnu as taught by Bhishma to Yudhishthira.",
    yogic: "The names in Shloka ${idx} represent states of consciousness that the yogi attains through deep meditation and surrender.",
    pauranic: "Each name in this shloka is a key to understanding Vishnu's cosmic play as described in the Puranas and Itihasas.",
    philosophical: "These names reflect the Vedantic understanding of Brahman with attributes (Saguna) leading to the realization of the attributeless (Nirguna).",
    forKids: "🌟 Shloka ${idx} teaches us many beautiful names of Lord Vishnu — each one like a different superpower He has! Try to chant them with love and see how peaceful you feel!",
    meaning_gu: "", meaning_hi: "",
    spiritual_gu: "", spiritual_hi: "",
    yogic_gu: "", yogic_hi: "",
    pauranic_gu: "", pauranic_hi: "",
    philosophical_gu: "", philosophical_hi: "",
    forKids_gu: "", forKids_hi: "",
    names: [${namesList}]
  },`;
}

// Find the section to replace: from shloka 6 to the end of SHLOKAS array
const shloka6Pattern = `    num: 6,`;
const shlokaStart = html.indexOf(shloka6Pattern);
if (shlokaStart === -1) throw new Error('Could not find shloka 6 in HTML');

// Find end of the SHLOKAS array - look for '];' after all shloka objects
let arrayEnd = html.indexOf('];\n', html.lastIndexOf('names: ['));
// Try the proper end - after last shloka before generate functions
let genStart = html.indexOf('\nfunction generateShlokaDevanagari', shlokaStart);
if (genStart === -1) genStart = html.indexOf('\nfunction generate', shlokaStart);
if (genStart !== -1) {
  // Go backwards to find '];' before generate function
  arrayEnd = html.lastIndexOf('];', genStart);
}
if (arrayEnd === -1 || arrayEnd < shlokaStart) {
  arrayEnd = html.indexOf('];\n\nfunction', shlokaStart);
}
if (arrayEnd === -1 || arrayEnd < shlokaStart) {
  throw new Error('Could not find end of SHLOKAS array');
}

const contentToReplace = html.substring(shlokaStart, arrayEnd);

const newShlokaContent = shlokaObjects.replace(/,\s*$/, ''); // remove trailing comma safely

html = html.replace(contentToReplace, newShlokaContent);

// Remove generator functions if they still exist
const genFuncsStart = html.indexOf('function generateShlokaDevanagari');
if (genFuncsStart !== -1) {
  const genFuncsEnd = html.indexOf('// ============================================================\n//  DICTIONARY DATA', genFuncsStart);
  if (genFuncsEnd !== -1) {
    const genFuncsCode = html.substring(genFuncsStart, genFuncsEnd);
    html = html.replace(genFuncsCode, '');
  }
}

writeFileSync('vishnu_sahasranama.html', html, 'utf8');
console.log('Done! Updated all shlokas.');
