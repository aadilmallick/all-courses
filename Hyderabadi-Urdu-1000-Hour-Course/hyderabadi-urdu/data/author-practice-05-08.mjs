import{writeFileSync}from'node:fs';
const bank=[];
const types={E:'translate-to-english',U:'translate-to-urdu',G:'grammar',L:'listening',S:'speaking'};
function chapter(ch,text){let index=0;for(const line of text.trim().split('\n')){const[type,roman,english,explanation,answersRaw='',choicesRaw='',local='']=line.split('|');const answers=answersRaw?answersRaw.split('~'):[type==='E'?english:roman];let prompt=type==='E'?`Translate into English: ${roman}`:type==='U'?`Translate into Roman Urdu/Hindi: ${english}`:type==='L'?'Listen, type the Roman words you hear, and give the English meaning.':type==='S'?`Say this meaning aloud in Roman Urdu/Hindi: ${english}`:english;bank.push({id:`c${String(ch).padStart(2,'0')}-${String(++index).padStart(3,'0')}`,chapter:ch,type:types[type],prompt,roman,english:type==='G'?explanation.split('||')[0]:english,answers,explanation,register:local==='local'?'hyderabadi':'shared',...(choicesRaw?{choices:choicesRaw.split('~')}:{})});}if(index!==30)throw new Error(`chapter${ch}:${index}`);}
chapter(5,`
E|Maine kal chai pi.|I drank tea yesterday.|Pi agrees with feminine chai, not the gender of the person drinking.|
E|Meri behen ghar aayi.|My sister came home.|Aayi follows the feminine subject behen in an intransitive perfective.|
E|Hum pehle yahan rehte the.|We used to live here.|Rehte the describes an earlier repeated or continuing living situation.|
E|Maine Ammi ko dekha.|I saw Ammi.|The specific person object has ko; dekha uses default masculine singular agreement.|
E|Bachche khel rahe the.|The children were playing.|Rahe the puts the listener inside an ongoing past action.|
E|Uske baad kya hua?|What happened after that?|Hua reports a completed occurrence; uske baad anchors the sequence.|
U|Maine paani piya.|I drank water.|Paani is masculine and unmarked, so the transitive perfective is piya.|
U|Ali ne kitaab padhi.|Ali read a book.|Ne marks the doer and padhi follows feminine kitaab.|
U|Ammi ne mujhe chai di.|Ammi gave me tea.|Mujhe is the recipient; unmarked chai still controls feminine di.|
U|Main kal bazaar gaya.|I went to the market yesterday. Use a male speaker.|Jaana is intransitive here, so main stays unmarked and gaya follows the male speaker.|
U|Main khaana bana rahi thi.|I was making food. Use a female speaker.|Bana rahi thi is past progressive and follows the female subject; there is no ne.|
U|Main roz chai peeta tha.|I used to drink tea every day. Use a male speaker.|The habitual peeta tha follows the male subject rather than the object chai.|
G|Ali ne chai pi.|Choose: Ali ne chai ___ .|Chai is feminine and unmarked, so choose pi.|pi|pi~piya~piye|
G|Maine Sara ko dekha.|Choose: Maine Sara ko ___ .|Sara ko is a marked direct object, so use default dekha.|dekha|dekha~dekhi~dekheen|
G|Meri behen gayi.|Choose: Meri behen ___ .|Behen is feminine; the intransitive perfective is gayi.|gayi|gayi~gaya~gaye|
G|Humne do kele khaye.|Choose: Humne do kele ___ .|The unmarked object do kele is masculine plural and controls khaye.|khaye|khaye~khaya~khayi|
G|Bhai ne Ammi ko kitaab di.|Choose: Bhai ne Ammi ko kitaab ___ .|Ammi ko is a recipient; feminine kitaab controls di.|di|di~diya~diye|
G|Main kaam kar raha tha.|Choose the male past progressive: Main kaam ___ .|Kar raha tha means was working; kiya would present a completed episode.|kar raha tha|kar raha tha~kiya~karta hoon|
L|Maine sabzi khareedi.|I bought vegetables.|Listen for the feminine ee ending in khareedi, agreeing with sabzi.|
L|Kal hum ghar par the.|We were at home yesterday.|The past auxiliary the supplies the past-state meaning.|
L|Nani ne khaana banaya.|Nani made food.|The unmarked masculine noun khaana controls banaya.|
L|Mera bhai der se aaya.|My brother came late.|Der se means late; aaya follows the masculine subject.|
L|Kya aapne khaana khaya?|Have you eaten?|Aapne is a respectful doer form; khaana is the masculine object.|
L|Mereku pehle kaiku nahin bulaya?|Why did you not call me earlier?|Mereku and kaiku are local family forms for mujhe and kyun.|||local
S|Kal main ghar par tha.|I was at home yesterday. Use a male speaker.|Use tha for the male speaker's past state; do not add an action verb.|
S|Kal main ghar par thi.|I was at home yesterday. Use a female speaker.|Use thi for the female speaker's past state.|
S|Phir kya hua?|What happened then?|Give phir a clear boundary before kya hua; this invites a story continuation.|
S|Maine aapko phone kiya tha.|I had called you.|The completed phone event has maine and the past reference tha.|
S|Humne saath khaana khaya.|We ate together.|Humne marks the doers; saath supplies together.|
S|Main samajh nahin paya.|I could not manage to understand. Use a male speaker.|Paya follows the subject in this ability-result construction; do not use maine.|
`);
chapter(6,`
E|Main kal aaunga.|I will come tomorrow.|Aaunga is the first-person future used by a male speaker.|
E|Mujhe jaldi jaana padega.|I will have to leave early.|Mujhe plus infinitive and padega presents a future necessity.|
E|Hum kab chalein?|When shall we leave?|Chalein is a proposal form rather than a definite prediction.|
E|Main Urdu bol sakti hoon.|I can speak Urdu.|The action stem bol combines with sakti hoon for a female speaker.|
E|Aapko aaraam karna chahiye.|You should rest.|Chahiye gives advice with the experiencer marked aapko.|
E|Mujhe jaana nahin padta.|I do not have to go.|Negating padta removes the necessity; it does not prohibit going.|
U|Main kal phone karungi.|I will call tomorrow. Use a female speaker.|Karungi is the female first-person future.|
U|Kya main yahan baith sakta hoon?|May I sit here? Use a male speaker.|Sakna can ask permission; baith is the bare action stem.|
U|Main Urdu seekhna chahta hoon.|I want to learn Urdu. Use a male speaker.|Wanting uses main with chahta hoon; seekhna retains its infinitive.|
U|Mujhe kal kaam karna hai.|I need to work tomorrow.|The scheduled task uses mujhe plus infinitive and hai.|
U|Dheere boliye taaki main samajh sakun.|Please speak slowly so that I can understand.|Taaki introduces purpose; sakun is first-person subjunctive.|
U|Agar waqt mile, toh main aaunga.|If I get time, I will come. Use a male speaker.|Mile is the prospective condition; aaunga is the future consequence.|
G|Main phone karun?|Choose Shall I call?: Main phone ___ ?|Karun proposes an action and does not change with speaker gender.|karun|karun~karunga~kiya|
G|Main bol sakti hoon.|Choose the female ability phrase: Main ___ .|Sakna follows the bare stem bol and agrees with the female subject.|bol sakti hoon|bol sakti hoon~bolna sakti hoon~bol sakta hai|
G|Mujhe jaana pada.|Choose I had to go: Mujhe jaana ___ .|Pada presents a completed past necessity.|pada|pada~padega~padta hai|
G|Aap kal aayein.|Choose the respectful condition: Agar aap kal ___ .|Aayein is the respectful subjunctive in a prospective if-clause.|aayein|aayein~aaya~aata|
G|Mujhe kitaab padhni chahiye.|Choose: Mujhe kitaab ___ chahiye.|The infinitive agrees with feminine kitaab, giving padhni.|padhni|padhni~padhna~padhne|
G|Aapke paas waqt ho.|Choose If you have time: Agar ___ .|Available time uses the possession frame aapke paas waqt ho.|aapke paas waqt ho|aapke paas waqt ho~aap waqt hain~aapko waqt hain|
L|Hum saat baje aayenge.|We will come at seven.|Saat baje is the time expression; aayenge is plural future.|
L|Main aaj nahin aa sakta.|I cannot come today.|Listen for nahin and sakta: they change the event into a denied possibility.|
L|Mujhe aath baje nikalna hai.|I need to leave at eight.|The departure is a scheduled requirement with mujhe and hai.|
L|Kya main madad karun?|Shall I help?|Karun makes an offer, not a report that help already happened.|
L|Kal shaam chalein?|Shall we go tomorrow evening?|The proposal ends in chalein; the subject can be supplied by context.|
L|Thodi der ich chalenge.|We will go for just a little while.|Local ich adds restrictive emphasis like shared hi; the promised duration stays short.|||local
S|Main aapko kal phone karunga.|I will call you tomorrow. Use a male speaker.|Use aapko for respectful you and karunga for the male speaker.|
S|Agar der ho, toh main phone karungi.|If I am late, I will call. Use a female speaker.|Keep the condition ho distinct from the future karungi.|
S|Mujhe ab jaana chahiye.|I should go now.|This advice-to-self frame does not change according to the speaker's gender.|
S|Kya aap meri madad kar sakti hain?|Can you help me? Address a woman respectfully.|Sakti hain follows the female respectful addressee; meri agrees with madad.|
S|Main kal phone nahin kar payi.|I could not manage to call yesterday. Use a female speaker.|Payi reports the unsuccessful opportunity with the female subject main.|
S|Hum yahin baithen?|Shall we sit right here?|Yahin adds here precisely; baithen makes a shared proposal.|
`);
chapter(7,`
E|Mujhe bhook lagi hai.|I am hungry.|Bhook is feminine, so lagi does not change with the speaker's gender.|
E|Mujhe neend aa rahi hai.|I am sleepy.|Neend is feminine and the expression literally presents sleep as coming.|
E|Ali apni kitaab padh raha hai.|Ali is reading his own book.|Apni points back to Ali and agrees with feminine kitaab.|
E|Hum ek doosre ki madad karte hain.|We help each other.|Ek doosre gives reciprocity; madad takes the possessive relation ki.|
E|Mere sar mein dard hai.|My head hurts.|The discomfort is located with sar mein; this is language practice, not a diagnosis.|
E|Mujhe aapki yaad aa rahi hai.|I miss you.|Yaad is feminine; aapki respectfully identifies the person missed.|
U|Mujhe pyaas lagi hai.|I am thirsty.|Use dative mujhe and feminine lagi with pyaas.|
U|Ammi ko thand lag rahi thi.|Ammi was feeling cold.|Thand is feminine and the past progressive is lag rahi thi.|
U|Main apni kitaab bhool gaya.|I forgot my own book. Use a male speaker.|Apni agrees with kitaab; gaya follows the male subject in bhool gaya.|
U|Mujhe doctor se baat karni hai.|I need to talk to a doctor.|The person spoken with takes se; feminine baat gives karni.|
U|Mera matlab yeh nahin tha.|That is not what I meant.|The phrase repairs an interpretation with the past form tha.|
U|Hum saath rehte hain.|We live together.|Saath supplies together; no reciprocal object is necessary.|
G|Mujhe pyaas lagi hai.|Choose: Mujhe pyaas ___ hai.|Pyaas is feminine, so the experience form is lagi.|lagi|lagi~laga~lage|
G|Mujhe dar lag raha hai.|Choose: Mujhe dar lag ___ hai.|Dar is masculine; raha follows dar, not the gender of the experiencer.|raha|raha~rahi~raheen|
G|Sara apna bag leti hai.|Choose Sara takes her own bag: Sara ___ bag leti hai.|Apna follows the masculine possession bag, even though Sara is female.|apna|apna~apni~uski|
G|Mujhe yaad hai.|Choose I remember: ___ yaad hai.|The remembered-information construction uses mujhe.|mujhe|mujhe~main~maine|
G|Apna khayal rakhiye.|Choose the respectful request: Apna khayal ___ .|Rakhiye is respectful; khayal is masculine and takes apna.|rakhiye|rakhiye~rakho~rakhta|
G|Ali ne apne bhai ko phone kiya.|Choose Ali called his own brother: Ali ne ___ bhai ko phone kiya.|Apne is the oblique form before masculine bhai ko and points to Ali.|apne|apne~apna~apni|
L|Mujhe garmi lag rahi hai.|I feel hot.|Garmi is a feminine experience noun, so listen for rahi.|
L|Mujhe theek se maloom nahin.|I do not know exactly.|The final nahin negates the information claim.|
L|Aapko kab se dard hai?|How long have you had pain?|Kab se asks for the starting point, not the location.|
L|Vo apna phone le gaya.|He took his own phone away.|Apna ties ownership to vo, the male subject.|
L|Mereku bura laga.|I felt bad.|Local mereku fills the experiencer role of shared mujhe.|||local
L|Aapse baat karke achha laga.|It was nice talking to you.|The whole expression evaluates the experience of speaking with the addressee.|
S|Apna khayal rakhiye.|Take care of yourself. Address an elder.|Keep the respectful request rakhiye and a warm delivery.|
S|Kya main aapke liye kuch laun?|Shall I bring something for you?|Laun offers an action; aapke liye means for you respectfully.|
S|Mujhe aapki yaad aati hai.|I miss you regularly.|Aati hai gives the recurring feeling rather than a single moment.|
S|Main is baare mein baat nahin karna chahti.|I do not want to discuss this. Use a female speaker.|Chahti follows the female subject; the negative marks the desired limit.|
S|Kya aap mere saath chal sakte hain?|Can you come with me? Address a man respectfully.|Mere saath expresses accompaniment; sakte hain is respectful masculine ability.|
S|Abhi nahin, shukriya.|Not right now, thank you.|A clear short refusal can remain polite without adding an untrue promise.|
`);
chapter(8,`
E|Jo kitaab maine padhi, vo achhi thi.|The book I read was good.|Jo identifies the book; vo resumes it; padhi follows feminine kitaab.|
E|Jab main aaya, tab sab so rahe the.|When I came, everyone was sleeping.|Aaya supplies the completed arrival; so rahe the gives ongoing background.|
E|Jahan hum rehte the, vahan ek dukaan thi.|There was a shop where we used to live.|Jahan and vahan connect the same location across two clauses.|
E|Ammi ne kaha ki khaana tayyar hai.|Ammi said that the food is ready.|Ki introduces the content of Ammi's message.|
E|Main subah se yahan hoon.|I have been here since morning.|Se identifies the starting point of a continuing state.|
E|Main shaam tak kaam khatam karunga.|I will finish the work by evening.|Tak is an endpoint; with completion it naturally means by.|
U|Nikalne se pehle phone kijiye.|Call before leaving.|The infinitive becomes oblique nikalne before se pehle.|
U|Ammi ko phone karke main so gayi.|After calling Ammi, I went to sleep. Use a female speaker.|The final intransitive so gayi follows main; do not carry maine from a separate phone sentence.|
U|Jitni chai chahiye, utni lijiye.|Take as much tea as you want.|Jitni and utni follow feminine chai.|
U|Unhone poochha ki aap kab aayenge.|They asked when you will come. Address a man respectfully.|Poochha reports a question and ki introduces its content.|
U|Baarish ho rahi thi, lekin hum gaye.|It was raining, but we went.|Lekin marks the contrast between background rain and the completed departure.|
U|Mujhe lagta hai ki aap theek keh rahe hain.|I think you are right. Address a man respectfully.|Mujhe lagta hai frames an opinion and ki marks its content; keh rahe hain makes right about a statement explicit.|
G|Jab aap pahunchein, phone kijiye.|Choose When you arrive: ___ aap pahunchein, phone kijiye.|Jab treats arrival as the expected occasion; agar would mean if.|jab|jab~agar~kyun|
G|Jis aadmi ko maine dekha, vo yahan rehta hai.|Choose: Jis aadmi ___ maine dekha...|The identified human is a direct object and takes ko.|ko|ko~ki~mein|
G|Aane ke baad baithiye.|Choose: Aane ___ baad baithiye.|The fixed postpositional connection is ke baad.|ke|ke~se~ko|
G|Jiski kitaab yahan hai, usko phone kijiye.|Choose whose book: ___ kitaab yahan hai...|Jiski uses feminine possession because kitaab is feminine.|jiski|jiski~jiska~jiske|
G|Main subah se shaam tak yahan hoon.|Choose from morning until evening: subah ___ shaam ___ .|Se marks the start and tak marks the endpoint.|se tak|se tak~tak se~ko ki|
G|Ammi ne kaha ki vo aayengi.|Choose the content connector: Ammi ne kaha ___ vo aayengi.|Ki introduces what was said; the possessive sound-alike is a different construction.|ki|ki~ka~ko|
L|Jis se maine baat ki, vo mere mamu hain.|The person I spoke with is my maternal uncle.|Jis se expresses the talking-with relation; vo is the subject of identification.|
L|Ghar aane ke baad main aaraam karta hoon.|I rest after coming home.|Aane ke baad organizes the sequence and the final verb supplies the habitual viewpoint.|
L|Aate waqt doodh le aaiye.|Please bring milk on your way here.|Aate waqt connects bringing milk to the trip toward the relevant place.|
L|Jab bhi baarish hoti hai, hum ghar mein rehte hain.|Whenever it rains, we stay at home.|Jab bhi makes the connection recurring rather than one past occasion.|
L|Jumme ko shaam tak pahunch jayenge.|They will arrive by Friday evening.|The named day removes kal ambiguity; tak marks the arrival deadline.|
L|Jo chai mez par hai, vo aapki hai.|The tea on the table is yours.|The relative clause identifies chai and aapki agrees with its feminine gender.|
S|Pehle main yeh bata doon.|First let me explain this.|Use this turn-opening frame, pause, and then supply a real explanation.|
S|Mera matlab yeh hai ki hum kal mil sakte hain.|What I mean is that we can meet tomorrow.|Ki separates the clarification frame from the message being clarified.|
S|Jahan aap baithna chahein, vahan baithiye.|Sit wherever you would like.|Chahein leaves the place open for the respectful addressee to choose.|
S|Haath dho kar baithiye.|Wash your hands and sit down. Be respectful.|Dho kar links the same person's earlier action with the polite final request.|
S|Main nikalne se pehle phone karungi.|I will call before leaving. Use a female speaker.|Nikalne se pehle is the time phrase and karungi carries the female future.|
S|Unhone kaha ki vo mangal ko aayenge.|They said they will come on Tuesday.|Naming Tuesday makes the reported plan clearer than an ambiguous kal.|
`);
const grammarMeanings={
'c05-013':'Ali drank tea.','c05-014':'I saw Sara.','c05-015':'My sister went.','c05-016':'We ate two bananas.','c05-017':'My brother gave Ammi a book.','c05-018':'I was working.',
'c06-013':'Shall I call?','c06-014':'I can speak.','c06-015':'I had to go.','c06-016':'You may come tomorrow.','c06-017':'I should read the book.','c06-018':'You have time.',
'c07-013':'I am thirsty.','c07-014':'I feel afraid.','c07-015':'Sara takes her own bag.','c07-016':'I remember.','c07-017':'Take care of yourself.','c07-018':'Ali called his own brother.',
'c08-013':'When you arrive, please call.','c08-014':'The man I saw lives here.','c08-015':'Sit down after coming.','c08-016':'Call the person whose book is here.','c08-017':'I am here from morning until evening.','c08-018':'Ammi said that she will come.'};
for(const row of bank)if(grammarMeanings[row.id])row.english=grammarMeanings[row.id];
if(bank.length!==120)throw new Error(bank.length);
writeFileSync(new URL('./practice-05-08.json',import.meta.url),JSON.stringify(bank,null,2)+'\n');
console.log(Object.fromEntries([5,6,7,8].map(ch=>[ch,Object.fromEntries(Object.entries(types).map(([k,t])=>[t,bank.filter(x=>x.chapter===ch&&x.type===t).length]))])));
