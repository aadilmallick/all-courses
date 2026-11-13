import {writeFileSync} from 'node:fs';
const rows=`bonjour|hello|Bonjour, je m’appelle Nora.|Hello, my name is Nora.|social
bonsoir|good evening|Bonsoir, vous êtes ici ?|Good evening, are you here?|social
salut|hi|Salut, ça va ?|Hi, how are you?|social
au revoir|goodbye|Au revoir et à demain !|Goodbye and see you tomorrow!|social
à bientôt|see you soon|Merci et à bientôt !|Thank you and see you soon!|social
merci|thank you|Merci pour votre aide.|Thank you for your help.|social
s’il vous plaît|please (polite or plural)|Un café, s’il vous plaît.|A coffee, please.|social
pardon|sorry; pardon|Pardon, vous pouvez répéter ?|Sorry, can you repeat?|repair
oui|yes|Oui, je suis ici.|Yes, I am here.|basics
non|no|Non, je ne comprends pas.|No, I do not understand.|basics
peut-être|perhaps|Peut-être demain.|Perhaps tomorrow.|basics
d’accord|okay; agreed|D’accord, à deux heures.|Okay, at two o’clock.|social
bienvenue|welcome|Bienvenue à Paris !|Welcome to Paris!|social
enchanté / enchantée|pleased to meet you|Enchantée, je m’appelle Lina.|Pleased to meet you, my name is Lina.|social
je|I|Je suis ici.|I am here.|pronouns
tu|you (familiar singular)|Tu es à Paris ?|Are you in Paris?|pronouns
il|he; it (masculine)|Il est français.|He is French.|pronouns
elle|she; it (feminine)|Elle est ici.|She is here.|pronouns
nous|we|Nous sommes à Boston.|We are in Boston.|pronouns
vous|you (polite or plural)|Vous êtes Nora ?|Are you Nora?|pronouns
ils|they (masculine or mixed)|Ils sont ici.|They are here.|pronouns
elles|they (feminine)|Elles sont à Lyon.|They are in Lyon.|pronouns
on|one; we (conversational)|On est ici.|We are here.|pronouns
moi|me (stressed form)|Moi aussi.|Me too.|pronouns
et|and|Nora et Sami sont ici.|Nora and Sami are here.|connections
mais|but|C’est petit, mais c’est intéressant.|It is small, but it is interesting.|connections
ou|or|Deux ou douze ?|Two or twelve?|connections
aussi|also; too|J’apprends aussi.|I am learning too.|connections
ici|here|La gare est ici.|The station is here.|place
là|there|Le café est là.|The café is there.|place
où|where|Où est la table ?|Where is the table?|questions
quand|when|Le rendez-vous, c’est quand ?|When is the appointment?|questions
comment|how|Comment ça s’écrit ?|How is that written?|questions
pourquoi|why|Pourquoi le français ?|Why French?|questions
combien|how much; how many|Combien de livres ?|How many books?|questions
qui|who|Qui est là ?|Who is there?|questions
être|to be|Je suis à Paris.|I am in Paris.|verbs
avoir|to have|J’ai un livre.|I have a book.|verbs
s’appeler|to be called|Je m’appelle Sami.|My name is Sami.|verbs
habiter|to live; to reside|J’habite à Boston.|I live in Boston.|verbs
parler|to speak|Vous parlez anglais ?|Do you speak English?|verbs
apprendre|to learn|J’apprends le français.|I am learning French.|verbs
comprendre|to understand|Je ne comprends pas.|I do not understand.|verbs
répéter|to repeat|Vous pouvez répéter ?|Can you repeat?|verbs
écrire|to write|Comment ça s’écrit ?|How is that written?|verbs
le nom|name; surname|Votre nom, s’il vous plaît ?|Your name, please?|identity
le prénom|first name|Mon prénom est Nora.|My first name is Nora.|identity
la personne|person|C’est une personne intéressante.|That is an interesting person.|people
l’ami (m.)|male friend|C’est un ami.|He is a friend.|people
l’amie (f.)|female friend|C’est une amie.|She is a friend.|people
la famille|family|Ma famille est ici.|My family is here.|people
l’homme (m.)|man|L’homme est à la gare.|The man is at the station.|people
la femme|woman|La femme est ici.|The woman is here.|people
l’enfant (m. or f.)|child|L’enfant est à l’école.|The child is at school.|people
la ville|city; town|C’est une petite ville.|It is a small town.|places
le pays|country|C’est un grand pays.|It is a large country.|places
la maison|house|C’est une petite maison.|It is a small house.|places
l’école (f.)|school|L’école est ici.|The school is here.|places
la gare|station|Où est la gare ?|Where is the station?|places
le café|café; coffee|Le café est à Paris.|The café is in Paris.|places
la rue|street|C’est une petite rue.|It is a small street.|places
le livre|book|C’est un livre intéressant.|It is an interesting book.|objects
la table|table|Le livre est sur la table.|The book is on the table.|objects
la question|question|Je ne comprends pas la question.|I do not understand the question.|learning
le mot|word|Comment s’écrit ce mot ?|How is this word written?|learning
la phrase|sentence; phrase|C’est une petite phrase.|It is a short sentence.|learning
le français|French (language)|J’apprends le français.|I am learning French.|languages
l’anglais (m.)|English (language)|Je parle anglais.|I speak English.|languages
la langue|language|Le français est une langue.|French is a language.|languages
un peu|a little|Je parle un peu français.|I speak a little French.|quantity
beaucoup|a lot; much|Merci beaucoup.|Thank you very much.|quantity
bien|well|Je vais bien.|I am well.|basics
mal|badly; poorly|J’entends mal.|I cannot hear well.|basics
petit / petite|small|C’est une petite maison.|It is a small house.|description
grand / grande|big; tall|C’est une grande ville.|It is a big city.|description
facile|easy|Ce n’est pas facile.|It is not easy.|description
difficile|difficult|C’est une question difficile.|It is a difficult question.|description
intéressant / intéressante|interesting|Le livre est intéressant.|The book is interesting.|description
lentement|slowly|Plus lentement, s’il vous plaît.|More slowly, please.|repair
aujourd’hui|today|Je suis ici aujourd’hui.|I am here today.|time
demain|tomorrow|À demain !|See you tomorrow!|time
hier|yesterday|Hier, c’était lundi.|Yesterday was Monday.|time
le matin|morning|Le matin, je dis bonjour.|In the morning, I say hello.|time
le soir|evening|Le soir, je lis.|In the evening, I read.|time
le jour|day|C’est un grand jour.|It is a big day.|time
la semaine|week|Je suis ici pour une semaine.|I am here for a week.|time
l’heure (f.)|hour; time of day|Il est une heure.|It is one o’clock.|time
le rendez-vous|appointment|J’ai un rendez-vous lundi.|I have an appointment on Monday.|time
lundi|Monday|Le rendez-vous est lundi.|The appointment is on Monday.|time
mardi|Tuesday|À mardi !|See you on Tuesday!|time
mercredi|Wednesday|Nous parlons le mercredi.|We speak on Wednesdays.|time
jeudi|Thursday|Je suis ici jeudi.|I am here on Thursday.|time
vendredi|Friday|À vendredi !|See you on Friday!|time
samedi|Saturday|Le café est ouvert samedi.|The café is open on Saturday.|time
dimanche|Sunday|C’est dimanche.|It is Sunday.|time
avoir faim|to be hungry|J’ai faim.|I am hungry.|needs
avoir soif|to be thirsty|Vous avez soif ?|Are you thirsty?|needs
avoir froid|to feel cold|J’ai froid.|I am cold.|needs
avoir besoin de|to need|J’ai besoin d’aide.|I need help.|needs
l’aide (f.)|help|Merci pour votre aide.|Thank you for your help.|needs`;
const vocab=rows.split('\n').map(r=>{const[fr,en,example,translation,tag]=r.split('|');return {fr,en,example,translation,tag};});
const pairs=[
['Bonjour, je m’appelle Nora.','Hello, my name is Nora.','S’appeler supplies the naming expression.'],
['J’habite à Boston.','I live in Boston.','Use à with a city in this construction.'],
['Vous parlez anglais ?','Do you speak English?','A statement can become a conversational question through intonation.'],
['Je ne comprends pas.','I do not understand.','Ne and pas frame the finite verb.'],
['Vous pouvez répéter, s’il vous plaît ?','Can you repeat, please?','Vous is appropriate for polite singular or plural address.'],
['Nous sommes ici.','We are here.','Nous takes sommes.'],
['J’ai vingt ans.','I am twenty years old.','French uses avoir for age.'],
['Il y a un livre sur la table.','There is a book on the table.','Il y a presents an existing object.'],
['Où est la gare ?','Where is the station?','Où has an accent and asks about place.'],
['C’est une petite maison.','It is a small house.','Maison is feminine; petite agrees.'],
['Je suis à Paris aujourd’hui.','I am in Paris today.','Être expresses location here.'],
['J’apprends le français.','I am learning French.','The language follows apprendre with the definite article here.'],
['Je parle un peu français.','I speak a little French.','Un peu expresses a small amount.'],
['Elle est ici pour une semaine.','She is here for a week.','Pour gives the intended length of the stay here.'],
['C’est intéressant, mais ce n’est pas facile.','It is interesting, but it is not easy.','Mais connects contrasting evaluations.'],
['J’ai un rendez-vous lundi.','I have an appointment on Monday.','Lundi without an article identifies a particular Monday in context.'],
['J’ai froid.','I am cold.','Avoir froid is a fixed expression.'],
['Vous êtes ici ?','Are you here?','Vous requires êtes.'],
['Comment ça s’écrit ?','How is that written?','Learn this useful repair phrase as a whole.'],
['Merci pour votre aide.','Thank you for your help.','Pour introduces what you are thanking someone for.']
];
const sentences=pairs.map(([fr,en,note])=>({fr,en,note,alternativesFr:[],alternativesEn:[]}));
sentences[2].alternativesFr=['Est-ce que vous parlez anglais ?'];sentences[2].alternativesEn=['Do you speak English'];sentences[3].alternativesEn=["I don’t understand."];sentences[9].alternativesEn=['This is a small house.'];sentences[19].alternativesEn=['Thanks for your help.'];
const items=[
['Je ___ Nora.',['suis','est','êtes','sommes'],0,'Je takes suis, the first-person present of être.'],
['Vous ___ ici.',['est','êtes','sont','es'],1,'Vous takes êtes.'],
['I am twenty years old: J’___ vingt ans.',['ai','suis','est','être'],0,'Age uses avoir: j’ai vingt ans.'],
['Choose the article for table.',['le','un','la','du'],2,'Table is feminine: la table.'],
['Choose a correct negative.',['Je pas suis ici.','Je ne suis pas ici.','Je suis ne ici.','Je ne ici pas.'],1,'Ne and pas surround the finite verb suis.'],
['Nous ___ à Paris.',['suis','sommes','êtes','sont'],1,'Nous takes sommes.'],
['There is a book: ___ un livre.',['Il est','Il y a','Il a y','C’est a'],1,'Il y a means there is or there are.'],
['Where is the station? ___ est la gare ?',['Ou','Où','Qui','Combien'],1,'Où with a grave accent means where; ou means or.'],
['A small house: une ___ maison.',['petit','petits','petite','petites'],2,'Maison is feminine singular, so petite agrees.'],
['I am cold: J’___ froid.',['suis','être','ai','est'],2,'French uses avoir froid.'],
['Polite speech to an unfamiliar adult: ___ parlez anglais ?',['Tu','Vous','Je','Nous'],1,'Vous is a useful polite opening to an unfamiliar adult.'],
['Choose the ordinary written form.',['Je ai un livre.','J’ai un livre.','J’a un livre.','Je suis un livre avoir.'],1,'Je elides before the vowel in ai.'],
['In les amis, a common liaison sound is ___.',['z','t','k','none ever'],0,'The plural article commonly links with /z/ before amis.'],
['Which phrase means I need help?',['J’ai besoin d’aide.','Je suis aide.','Je besoin aide.','J’ai aide besoin.'],0,'Avoir besoin de is the construction; de elides before aide.'],
['The plural of le livre is ___.',['la livres','les livre','les livres','le livres'],2,'Use plural article les and plural spelling livres.']
];
const grammar=items.map(([prompt,options,answer,explanation])=>({prompt,options,answer,explanation}));
const titles=['First meeting','Vowel contrasts','Consonants and rhythm','Noun phrases','Subjects and être','Avoir and personal details','Questions and repair','Time and appointments','Reading and retelling','First conversation portfolio'];
const outcomes=['Introduce yourself and use a repair phrase.','Distinguish /u/ and /y/ and recognize common nasal vowels.','Read short phrases with meaningful grouping.','Use articles and basic gender agreement.','Build accurate identity and location sentences.','Give age, possession, and basic needs.','Ask and answer predictable polite questions.','Arrange and confirm a simple appointment.','Extract the message from a short French introduction.','Complete a short introduction and interaction with reflection.'];
const units=titles.map((title,i)=>({title,outcome:outcomes[i],tasks:[`Read and work through Chapter 1’s ${title.toLowerCase()} material (2h).`,'Focused listening and pronunciation (2h); vocabulary and spaced review (2h).','Interaction or recorded speaking (2h); reading and writing (1h); exercises and reflection (1h).']}));
if(vocab.length!==100)throw Error('Expected 100 foundation entries, got '+vocab.length);
writeFileSync(new URL('../data/ch01.json',import.meta.url),JSON.stringify({chapter:1,level:'A0–A1',title:'Sounds, sense, and first conversations',units,vocab,sentences,grammar},null,2));
