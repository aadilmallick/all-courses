import fs from 'node:fs';
const groups=[
['travel',11,`
safar|journey|m|Safar lamba tha.|The journey was long.
musaafir|traveller|m|Musaafir intezaar kar rahe hain.|The travellers are waiting.
raasta|route|m|Yeh raasta chhota hai.|This route is short.
manzil|destination|f|Hamaari manzil qareeb hai.|Our destination is near.
faasla|distance|m|Kitna faasla hai?|How far is it?
raftaar|speed|f|Raftaar kam rakhiye.|Keep the speed low.
mod|turn|m|Agle mod par rukiye.|Stop at the next turn.
pul|bridge|m|Pul ke baad daayen muriye.|Turn right after the bridge.
chauraaha|crossroads|m|Chauraahe par bahut bheer hai.|There is a big crowd at the crossroads.
sarak|road|f|Sarak band hai.|The road is closed.
footpath|pavement|m|Footpath par chaliye.|Walk on the pavement.
traffic|road traffic|m|Aaj traffic bahut hai.|There is a lot of traffic today.
jaam|traffic jam|m|Hum jaam mein phans gaye.|We got stuck in a traffic jam.
sawaari|ride or passenger transport|f|Sawaari mil gayi.|We found a ride.
riksha|rickshaw|m|Riksha yahaan rok dijiye.|Stop the rickshaw here.
auto|auto-rickshaw|m|Auto ka kiraaya kitna hai?|How much is the auto fare?
taxi|taxi|f|Taxi aa gayi hai.|The taxi has arrived.
bus|bus|f|Bus kab aayegi?|When will the bus arrive?
rail|railway train|f|Rail waqt par aayi.|The train arrived on time.
metro|metro train|f|Metro se jaana aasaan hai.|Going by metro is easy.
hawaai jahaaz|aeroplane|m|Hawaai jahaaz der se aaya.|The aeroplane arrived late.
kishti|boat|f|Kishti dheere chal rahi hai.|The boat is moving slowly.
cycle|bicycle|f|Meri cycle baahar hai.|My bicycle is outside.
motorcycle|motorcycle|f|Motorcycle aahista chalaaiye.|Ride the motorcycle slowly.
truck|lorry|m|Truck raaste mein khara hai.|The lorry is standing in the way.
driver|driver|m|Driver ko pata bata dijiye.|Tell the driver the address.
conductor|bus conductor|m|Conductor se ticket lijiye.|Get a ticket from the conductor.
ticket|travel ticket|m|Ticket sambhaal kar rakhiye.|Keep the ticket safe.
kiraaya|fare or rent|m|Kiraaya pehle poochh lijiye.|Ask the fare first.
petrol|petrol|m|Petrol kam hai.|There is little petrol left.
diesel|diesel|m|Is gaari mein diesel lagta hai.|This vehicle uses diesel.
brake|brake|m|Brake theek se kaam nahin kar raha.|The brake is not working properly.
steering|steering wheel|m|Steering mazbooti se pakriye.|Hold the steering wheel firmly.
seat|seat|f|Yeh seat khaali hai?|Is this seat free?
platform|railway platform|m|Platform badal gaya hai.|The platform has changed.
station|station|m|Station yahaan se door hai.|The station is far from here.
adda|transport stand|m|Bus ka adda kahaan hai?|Where is the bus stand?
hawaai adda|airport|m|Hawaai adde tak kitna waqt lagega?|How long will it take to reach the airport?
samaan|luggage|m|Apna saamaan dekh lijiye.|Check your luggage.
suitcase|suitcase|m|Suitcase bhaari hai.|The suitcase is heavy.
passport|passport|m|Passport mere paas hai.|I have the passport.
visa|visa|m|Visa abhi nahin mila.|The visa has not arrived yet.
booking|reservation|f|Booking ki tasdeeq ho gayi.|The reservation has been confirmed.
rawaangi|departure|f|Rawaangi ka waqt badal gaya.|The departure time has changed.
aamad|arrival|f|Aamad ka waqt likha hai.|The arrival time is written.
waapsi|return trip|f|Waapsi ka ticket bhi le lijiye.|Get the return ticket too.
qayaam|stay|m|Aapka qayaam kitne din ka hai?|How many days is your stay?
sarhad|border|f|Sarhad par jaanch ho rahi hai.|Checks are taking place at the border.
naqsha|map|m|Naqshe mein raasta dekhiye.|Look at the route on the map.
paidal|on foot|adj|-|Hum paidal jaayenge.|We will go on foot.
`],
['city-services',11,`
bazaar|market|m|Bazaar shaam ko khulta hai.|The market opens in the evening.
dukaan|shop|f|Dukaan abhi band hai.|The shop is closed at the moment.
dukaandaar|shopkeeper|m|Dukaandaar se poochhiye.|Ask the shopkeeper.
graahak|customer|m|Graahak intezaar kar rahe hain.|The customers are waiting.
raseed|receipt|f|Raseed de dijiye.|Please give me the receipt.
bill|bill|m|Bill mein galti hai.|There is an error in the bill.
qeemat|price|f|Iski qeemat kya hai?|What is its price?
raqam|amount of money|f|Raqam dobara gin lijiye.|Count the amount again.
naqd|cash|m|Kya naqd de sakte hain?|Can we pay cash?
chhutta|small change|m|Mere paas chhutta nahin hai.|I do not have small change.
qarz|debt or loan|m|Qarz waqt par dena hai.|The loan must be repaid on time.
qist|instalment|f|Pehli qist de di hai.|The first instalment has been paid.
kharch|expense|m|Kharch ka andaaza lagaaiye.|Estimate the expense.
bachat|saving|f|Isse waqt ki bachat hogi.|This will save time.
bank|bank|m|Bank kitne baje band hota hai?|What time does the bank close?
khaata|account|m|Mera khaata is bank mein hai.|My account is at this bank.
hisaab|calculation or account|m|Hisaab saaf rakhiye.|Keep the accounts clear.
khidmat|service|f|Aapki khidmat ka shukriya.|Thank you for your service.
sahoolat|facility or convenience|f|Yahaan achchhi sahoolat hai.|There is a good facility here.
intezaam|arrangement|m|Intezaam ho gaya hai.|The arrangement has been made.
zimmedaar|responsible|adj|-|Zimmedaar shakhs ko bulaaiye.|Call the person responsible.
mistri|repair worker|m|Mistri kal aayenge.|The repair worker will come tomorrow.
darzi|tailor|m|Darzi se kurta silwaaya.|I had a kurta made by the tailor.
naai|barber|m|Naai ki dukaan qareeb hai.|The barber shop is near.
dhobi|laundry worker|m|Kapre dhobi ko de diye.|I gave the clothes to the laundry worker.
mazdoor|labourer|m|Mazdoor kaam kar rahe hain.|The workers are working.
chowkeedaar|watchman|m|Chowkeedaar se poochh lijiye.|Ask the watchman.
safaai|cleaning|f|Yahaan safaai ho rahi hai.|Cleaning is taking place here.
kachra|rubbish|m|Kachra dabbe mein daaliye.|Put the rubbish in the bin.
naali|drain|f|Naali band ho gayi hai.|The drain has become blocked.
meter|utility meter|m|Meter ki reading dekh lijiye.|Check the meter reading.
katauti|cut or reduction|f|Aaj bijli ki katauti hai.|There is a power cut today.
paani ki line|water supply line|f|Paani ki line theek ho gayi.|The water supply line has been repaired.
hifaazat|protection or safety|f|Bachchon ki hifaazat zaroori hai.|The safety of children is important.
marammat|repair|f|Marammat mein waqt lagega.|The repair will take time.
kharabi|fault|f|Kharabi kahaan hai?|Where is the fault?
shikaayat|complaint|f|Meri ek shikaayat hai.|I have a complaint.
sifarish|recommendation|f|Aapki sifarish ka shukriya.|Thank you for your recommendation.
ijaazat|permission|f|Andar aane ki ijaazat hai?|May I come in?
daakhila|entry or admission|m|Daakhila yahaan se hai.|Entry is from here.
nikas|exit or outlet|m|Nikas ka raasta kahaan hai?|Where is the exit route?
qanoon|law|m|Qanoon sabke liye hai.|The law applies to everyone.
police|police|f|Police aa gayi hai.|The police have arrived.
thaana|police station|m|Thaana qareeb hai.|The police station is nearby.
daftar|office|m|Daftar aaj band hai.|The office is closed today.
khirki|window or service counter|f|Ticket ki khirki udhar hai.|The ticket counter is over there.
qatar|queue|f|Qatar mein khare rahiye.|Please stand in the queue.
mohr|stamp or seal|f|Kaaghaz par mohr chahiye.|The paper needs a stamp.
form|form|m|Form bhar dijiye.|Please fill in the form.
dastakhat|signature|m|Yahaan dastakhat kijiye.|Sign here.
`],
['work',11,`
naukri|job|f|Mujhe nayi naukri mili hai.|I have found a new job.
rozgaar|employment|m|Woh rozgaar dhoondh rahe hain.|They are looking for employment.
pesha|profession|m|Aapka pesha kya hai?|What is your profession?
kaarobaar|business|m|Unka kaarobaar achchha chal raha hai.|Their business is going well.
company|company|f|Company ne waqt badal diya.|The company changed the schedule.
idara|organisation|m|Yeh ek chhota idara hai.|This is a small organisation.
amla|staff|m|Amle ko bhi suniye.|Listen to the staff too.
saathi|colleague or companion|m|Mere saathi madad karenge.|My colleagues will help.
afsar|officer or manager|m|Afsar se baat kijiye.|Speak to the officer.
manager|manager|m|Manager abhi masroof hain.|The manager is busy at the moment.
mulaazim|employee|m|Mulaazim waqt par aaye.|The employees arrived on time.
maalik|owner or employer|m|Maalik se ijaazat lijiye.|Get permission from the owner.
tankhaah|salary|f|Tankhaah mil gayi hai.|The salary has been paid.
ujrat|wages or fee|f|Ujrat pehle tai kar lijiye.|Agree the wages beforehand.
mehnat|hard work|f|Aapki mehnat nazar aa rahi hai.|Your hard work is evident.
zimmedaari|responsibility|f|Yeh meri zimmedaari hai.|This is my responsibility.
farz|duty|m|Apna farz nibhaaiye.|Fulfil your duty.
mansuba|plan or project|m|Mansuba taiyaar hai.|The plan is ready.
mansoobabandi|planning|f|Pehle mansoobabandi karte hain.|Let us plan first.
mulaaqaat|meeting|f|Mulaaqaat kal hogi.|The meeting will take place tomorrow.
ijlaas|formal meeting|m|Ijlaas shuru ho gaya.|The meeting has started.
baithak|sitting or meeting|f|Kal ek chhoti baithak hai.|There is a small meeting tomorrow.
agenda|agenda|m|Agenda pehle bhej dijiye.|Send the agenda first.
report|report|f|Report shaam tak chahiye.|The report is needed by evening.
nateeja|result|m|Nateeja kal milega.|The result will be available tomorrow.
kaamyaabi|success|f|Yeh sabki kaamyaabi hai.|This is a success for everyone.
naakaami|failure|f|Naakaami se bhi seekh sakte hain.|We can learn from failure too.
taraqqi|progress or promotion|f|Unki taraqqi ho gayi.|They have been promoted.
tajurba|experience|m|Mujhe is kaam ka tajurba hai.|I have experience of this work.
mahaarat|skill or expertise|f|Yeh mahaarat waqt se aati hai.|This skill develops with time.
tarbiyat|training or upbringing|f|Naye logon ki tarbiyat ho rahi hai.|The new people are being trained.
mashq|practice|f|Roz thodi mashq kijiye.|Practise a little every day.
waqt ki paabandi|punctuality|phrase|-|Waqt ki paabandi zaroori hai.|Punctuality is important.
chhutti|leave or holiday|f|Mujhe kal chhutti chahiye.|I need leave tomorrow.
haazri|attendance|f|Haazri yahaan lagaaiye.|Mark attendance here.
ghairhaazri|absence|f|Meri ghairhaazri ki wajah bata dijiye.|Explain the reason for my absence.
isteefa|resignation|m|Unhone isteefa de diya.|They have resigned.
muqaabla|competition|m|Muqaabla sakht hai.|The competition is tough.
mauqa|opportunity|m|Mujhe ek mauqa dijiye.|Give me an opportunity.
shart|condition|f|Yeh shart manzoor hai.|This condition is acceptable.
muwaahida|agreement or contract|m|Muwaahida parh lijiye.|Read the agreement.
faayda|benefit or profit|m|Iska kya faayda hoga?|What benefit will it bring?
nuqsaan|loss or harm|m|Nuqsaan kam hua hai.|The loss was small.
nafa|profit|m|Is saal nafa hua.|There was a profit this year.
khusoosiyat|feature or characteristic|f|Iski khaas khusoosiyat kya hai?|What is its special feature?
maqsad|purpose or objective|m|Kaam ka maqsad saaf hai.|The purpose of the work is clear.
tarjeeh|priority or preference|f|Is kaam ko tarjeeh dijiye.|Give this work priority.
meeyaar|standard or quality|m|Meeyaar behtar ho gaya.|The standard has improved.
peshkash|offer or presentation|f|Aapki peshkash dilchasp hai.|Your offer is interesting.
waada|promise|m|Main apna waada poora karoonga.|I will keep my promise.
`],
['study-technology',11,`
taaleem|education|f|Taaleem sabke liye zaroori hai.|Education is important for everyone.
madrasa|school|m|Bachche madrase gaye hain.|The children have gone to school.
school|school|m|School qareeb hai.|The school is nearby.
college|college|m|Woh college mein parhti hain.|She studies at college.
university|university|f|University shehar se door hai.|The university is far from the city.
ustaad|teacher|m|Ustaad se sawaal poochhiye.|Ask the teacher a question.
ustaani|female teacher|f|Ustaani ne samjha diya.|The teacher explained it.
taalib-e-ilm|student|m|Woh taalib-e-ilm hain.|They are students.
shaagird|pupil or apprentice|m|Shaagird seekh rahe hain.|The pupils are learning.
sabaq|lesson|m|Aaj ka sabaq parhiye.|Read the lesson for today.
baab|chapter|m|Yeh baab dobara parhiye.|Read this chapter again.
jawaab|answer|m|Jawaab soch kar dijiye.|Think before giving the answer.
imtihaan|examination|m|Imtihaan agle hafte hai.|The examination is next week.
parcha|exam paper or sheet|m|Parcha aasaan tha.|The paper was easy.
number|mark or number|m|Mere achchhe number aaye.|I got good marks.
sanad|certificate|f|Sanad sambhaal kar rakhiye.|Keep the certificate safe.
kaaghaz|paper|m|Kaaghaz mez par hai.|The paper is on the table.
qalam|pen|m|Mujhe qalam chahiye.|I need a pen.
pencil|pencil|f|Pencil se likhiye.|Write in pencil.
daayri|diary|f|Daayri mein likh lijiye.|Note it in the diary.
safha|page|m|Agla safha kholiye.|Open the next page.
lafz|word|m|Is lafz ka matlab kya hai?|What does this word mean?
jumla|sentence|m|Ek poora jumla kahiye.|Say a complete sentence.
maani|meaning|m|Iske do maani hain.|It has two meanings.
talaffuz|pronunciation|m|Talaffuz sun kar dohraaiye.|Listen to the pronunciation and repeat.
qaaida|rule|m|Qaaida samajh mein aa gaya.|I understood the rule.
misaal|example|f|Ek aur misaal dijiye.|Give another example.
tarjuma|translation|m|Tarjuma apne alfaaz mein kijiye.|Translate in your own words.
aawaaz|voice or sound|f|Aawaaz saaf hai.|The sound is clear.
tasveer|picture|f|Tasveer bhej dijiye.|Send the picture.
video|video|f|Video phir se dekhiye.|Watch the video again.
recording|recording|f|Recording sun lijiye.|Listen to the recording.
computer|computer|m|Computer band ho gaya.|The computer switched off.
laptop|laptop|m|Laptop mere paas hai.|I have the laptop.
mobile|mobile phone|m|Mobile charge kar lijiye.|Charge the mobile phone.
internet|internet|m|Internet nahin chal raha.|The internet is not working.
website|website|f|Website khul gayi hai.|The website has opened.
email|email|f|Email bhej di hai.|I have sent the email.
paighaam|message|m|Paighaam mil gaya.|I received the message.
raabta|contact or connection|m|Raabta toot gaya.|The connection was lost.
signal|signal|m|Yahaan signal kam hai.|The signal is weak here.
password|password|m|Password kisi ko mat bataaiye.|Do not tell anyone the password.
file|file|f|File mehfooz hai.|The file is safe.
folder|folder|m|Folder khol dijiye.|Open the folder.
screen|screen|f|Screen saaf kijiye.|Clean the screen.
keyboard|keyboard|m|Keyboard par likhiye.|Type on the keyboard.
charger|charger|m|Charger kahaan hai?|Where is the charger?
battery|battery|f|Battery khatam ho gayi.|The battery has run out.
microphone|microphone|m|Microphone chalu kijiye.|Turn on the microphone.
speaker|loudspeaker|m|Speaker ki aawaaz kam kijiye.|Turn down the speaker volume.
`],
['body',7,`
sar|head|m|Mere sar mein dard hai.|My head hurts.
chehra|face|m|Apna chehra dho lijiye.|Wash your face.
aankh|eye|f|Meri aankh mein paani aa raha hai.|My eye is watering.
kaan|ear|m|Mere kaan mein dard hai.|My ear hurts.
naak|nose|f|Naak band hai.|My nose is blocked.
munh|mouth|m|Munh kholiye.|Open your mouth.
daant|tooth|m|Mere daant mein dard hai.|My tooth hurts.
gardan|neck|f|Gardan dheere ghumaaiye.|Turn your neck slowly.
kandha|shoulder|m|Mera kandha dukh raha hai.|My shoulder hurts.
baazu|arm|m|Baazu upar kijiye.|Raise your arm.
kohni|elbow|f|Kohni par chot lagi.|My elbow was hurt.
kalaai|wrist|f|Kalaai mein dard hai.|My wrist hurts.
haath|hand|m|Haath dho lijiye.|Wash your hands.
ungli|finger|f|Meri ungli kat gayi.|I cut my finger.
angutha|thumb|m|Anguthe par patti hai.|There is a bandage on the thumb.
naakhun|nail|m|Naakhun chhote rakhiye.|Keep your nails short.
seena|chest|m|Seene mein takleef hai.|There is discomfort in my chest.
peeth|back|f|Peeth seedhi rakhiye.|Keep your back straight.
kamar|waist or lower back|f|Kamar mein dard hai.|My lower back hurts.
pet|stomach or belly|m|Mera pet bhar gaya.|I am full.
ghutna|knee|m|Ghutne par chot lagi.|The knee was injured.
taang|leg|f|Meri taang dukh rahi hai.|My leg hurts.
pair|foot|m|Pair mein kaanta chubh gaya.|A thorn got into my foot.
aeri|heel|f|Aeri mein dard hai.|My heel hurts.
talva|sole of the foot|m|Talve par chot lagi.|The sole of the foot was hurt.
jild|skin|f|Meri jild khushk hai.|My skin is dry.
haddi|bone|f|Haddi ko chot lagi hai.|The bone has been injured.
khoon|blood|m|Khoon aa raha hai.|There is bleeding.
saans|breath|f|Saans lene mein mushkil hai.|It is difficult to breathe.
dhadkan|heartbeat|f|Dhadkan tez hai.|The heartbeat is fast.
dimaagh|brain or mind|m|Dimaagh thak gaya hai.|My mind is tired.
dil|heart|m|Dil ki baat kahiye.|Say what is in your heart.
zubaan|tongue or language|f|Zubaan par chot hai.|There is an injury on the tongue.
gala|throat|m|Mera gala kharaab hai.|I have a sore throat.
hont|lip|m|Hont khushk hain.|My lips are dry.
gaal|cheek|m|Gaal par nishaan hai.|There is a mark on the cheek.
maatha|forehead|m|Maatha garam lag raha hai.|The forehead feels warm.
bhaun|eyebrow|f|Bhaun ke paas chot hai.|There is an injury near the eyebrow.
jabra|jaw|m|Jabre mein dard hai.|My jaw hurts.
putli|pupil of the eye|f|Aankh ki putli saaf nazar aa rahi hai.|The pupil of the eye is clearly visible.
pasli|rib|f|Pasli mein dard hai.|My rib hurts.
jigar|liver|m|Doctor ne jigar ki jaanch ki.|The doctor checked the liver.
gurda|kidney|m|Gurde ki jaanch hui.|The kidney was checked.
doctor|doctor|m|Doctor se waqt lena hai.|I need to make an appointment with the doctor.
phephra|lung|m|Doctor ne phephre ki jaanch ki.|The doctor checked the lung.
rag|vein or tendon|f|Haath ki rag nazar aa rahi hai.|The vein in the hand is visible.
paseena|sweat|m|Paseena aa raha hai.|I am sweating.
aansoo|tear|m|Aankhon mein aansoo aa gaye.|Tears came to the eyes.
qad|height|m|Unka qad lamba hai.|They are tall.
wazan|weight|m|Iska wazan kitna hai?|How much does it weigh?
`],
['health',7,`
sehat|health|f|Apni sehat ka khayaal rakhiye.|Take care of your health.
tabiyat|state of health or disposition|f|Aapki tabiyat kaisi hai?|How are you feeling?
beemaari|illness|f|Beemaari ki wajah maaloom nahin.|The cause of the illness is not known.
mareez|patient|m|Mareez intezaar kar rahe hain.|The patients are waiting.
dard|pain|m|Dard kab shuru hua?|When did the pain start?
takleef|discomfort or trouble|f|Aapko kya takleef hai?|What is troubling you?
bukhaar|fever|m|Mujhe bukhaar hai.|I have a fever.
zukhaam|cold illness|m|Mujhe zukhaam ho gaya.|I have caught a cold.
khaansi|cough|f|Khaansi raat ko barh jaati hai.|The cough gets worse at night.
chheenk|sneeze|f|Mujhe chheenk aa rahi hai.|I am about to sneeze.
ulti|vomiting|f|Subah ulti hui.|I vomited in the morning.
matli|nausea|f|Mujhe matli ho rahi hai.|I feel nauseated.
chakkar|dizziness|m|Mujhe chakkar aa rahe hain.|I feel dizzy.
kamzori|weakness|f|Abhi kamzori hai.|I still feel weak.
thakaawat|fatigue|f|Safar se thakaawat ho gayi.|The journey caused fatigue.
soojan|swelling|f|Soojan kam ho gayi.|The swelling has decreased.
chot|injury|f|Chot kahaan lagi?|Where were you hurt?
zakham|wound|m|Zakham saaf hai.|The wound is clean.
kharish|itching|f|Jild par kharish hai.|The skin is itchy.
allergy|allergy|f|Mujhe is dawa se allergy hai.|I am allergic to this medicine.
qabz|constipation|f|Mujhe qabz hai.|I am constipated.
dast|diarrhoea|m|Bachche ko dast hain.|The child has diarrhoea.
saans ki tangi|shortness of breath|phrase|-|Saans ki tangi ho rahi hai.|I am experiencing shortness of breath.
hosh|consciousness|m|Unko hosh aa gaya.|They regained consciousness.
behoshi|unconsciousness|f|Behoshi kab hui?|When did the loss of consciousness occur?
dawa|medicine|f|Yeh dawa kis liye hai?|What is this medicine for?
goli|tablet or pill|f|Goli ka naam likh dijiye.|Write down the name of the tablet.
khuraak|dose or diet|f|Dawa ki khuraak likh dijiye.|Write down the medicine dosage.
marham|ointment|m|Marham ka naam kya hai?|What is the ointment called?
patti|bandage|f|Patti badalni hai.|The bandage needs changing.
sui|needle or injection|f|Sui se darr lagta hai.|I am afraid of needles.
teeka|vaccination or injection|m|Teeke ki taareekh kya hai?|What is the vaccination date?
ilaaj|treatment|m|Ilaaj chal raha hai.|Treatment is ongoing.
parhez|dietary restriction or avoidance|m|Kya kisi cheez se parhez hai?|Should anything be avoided?
aaraam|rest or comfort|m|Mujhe thoda aaraam chahiye.|I need some rest.
neend|sleep|f|Raat ko neend nahin aayi.|I could not sleep at night.
bhook|hunger|f|Mujhe bhook nahin hai.|I am not hungry.
pyaas|thirst|f|Bahut pyaas lagi hai.|I am very thirsty.
jaanch|examination or check|f|Jaanch kab hogi?|When will the examination take place?
test|medical test|m|Test ka nateeja aa gaya.|The test result has arrived.
muaina|medical examination|m|Doctor muaina karenge.|The doctor will examine the patient.
appointment|appointment|f|Appointment kal ki hai.|The appointment is for tomorrow.
aspataal|hospital|m|Aspataal qareeb hai.|The hospital is nearby.
clinic|clinic|m|Clinic kab khulta hai?|When does the clinic open?
dawaakhaana|dispensary or clinic|m|Dawaakhaana udhar hai.|The dispensary is over there.
pharmacy|pharmacy|f|Pharmacy abhi khuli hai.|The pharmacy is open now.
ambulance|ambulance|f|Ambulance bulaaiye.|Call an ambulance.
nurse|nurse|f|Nurse se poochhiye.|Ask the nurse.
operation|operation|m|Operation kal hoga.|The operation will be tomorrow.
shifa|recovery or healing|f|Aapki shifa ki dua hai.|I pray for your recovery.
`],
['feelings-personality',7,`
khushi|happiness|f|Aapko dekhkar khushi hui.|I am happy to see you.
gham|sorrow|m|Unke gham mein shareek hain.|We share their sorrow.
udaasi|sadness|f|Aaj kuchh udaasi hai.|I feel a little sad today.
pareshaani|worry or difficulty|f|Pareshaani ki baat nahin.|There is no need to worry.
fikr|concern|f|Mujhe aapki fikr hai.|I am concerned about you.
darr|fear|m|Mujhe andhere se darr lagta hai.|I am afraid of the dark.
ghussa|anger|m|Ghussa kam ho gaya.|The anger has subsided.
sharm|shyness or shame|f|Mujhe sharm aa rahi hai.|I feel shy.
hairet|surprise|f|Mujhe bahut hairet hui.|I was very surprised.
fakhr|pride|m|Mujhe aap par fakhr hai.|I am proud of you.
afsos|regret or sorrow|m|Mujhe der hone ka afsos hai.|I am sorry about being late.
ummeed|hope|f|Ummeed hai sab theek hoga.|I hope everything will be fine.
maayoosi|disappointment|f|Maayoosi ki zaroorat nahin.|There is no need for disappointment.
sukoon|peace of mind|m|Yahaan sukoon milta hai.|I find peace here.
bechaini|restlessness|f|Mujhe bechaini ho rahi hai.|I feel restless.
sabr|patience|m|Thoda sabr kijiye.|Please be patient.
bharosa|trust|m|Mujhe aap par bharosa hai.|I trust you.
aitemaad|confidence or trust|m|Aitemaad dheere barhta hai.|Confidence grows gradually.
shak|doubt or suspicion|m|Mujhe is baat par shak hai.|I have doubts about this.
yaqeen|certainty or belief|m|Mujhe yaqeen nahin aa raha.|I cannot believe it.
mohabbat|love|f|Ghar waalon se mohabbat hai.|I love my family.
pyaar|love or affection|m|Bachchon ko pyaar dijiye.|Give the children my love.
nafrat|hatred|f|Nafrat se masla hal nahin hota.|Hatred does not solve a problem.
izzat|respect|f|Buzurgon ki izzat kijiye.|Respect elders.
qadr|appreciation or value|f|Main aapki madad ki qadr karta hoon.|I appreciate your help.
rehm|mercy or compassion|m|Kamzor par rehm kijiye.|Show compassion to the weak.
hamdardi|sympathy|f|Aapki hamdardi ka shukriya.|Thank you for your sympathy.
dilchaspi|interest|f|Mujhe is mein dilchaspi hai.|I am interested in this.
shauq|enthusiasm or hobby|m|Aapko kis cheez ka shauq hai?|What are you interested in?
khwaahish|wish|f|Yeh meri khwaahish hai.|This is my wish.
iraada|intention|m|Aapka kya iraada hai?|What do you intend to do?
hausla|courage or encouragement|m|Aapne mera hausla barhaaya.|You encouraged me.
himmat|courage|f|Himmat mat haariye.|Do not lose courage.
rawaiya|attitude or behaviour|m|Unka rawaiya narm tha.|Their attitude was gentle.
aadat|habit|f|Yeh achchhi aadat hai.|This is a good habit.
akhlaaq|manners or character|m|Unke akhlaaq achchhe hain.|They have good manners.
meherbaan|kind|adj|-|Aap bahut meherbaan hain.|You are very kind.
imaandaar|honest|adj|-|Woh imaandaar shakhs hain.|They are an honest person.
khudgarz|selfish|adj|-|Khudgarz rawaiya theek nahin.|Selfish behaviour is not right.
sharmeela|shy|adj|-|Bachcha thoda sharmeela hai.|The child is a little shy.
milansaar|sociable|adj|-|Woh bahut milansaar hain.|They are very sociable.
sanjeeda|serious|adj|-|Yeh sanjeeda baat hai.|This is a serious matter.
hansmukh|cheerful|adj|-|Woh hansmukh insaan hain.|They are a cheerful person.
ziddi|stubborn|adj|-|Itna ziddi mat baniye.|Do not be so stubborn.
laaparwaah|careless|adj|-|Main laaparwaah nahin hona chaahti.|I do not want to be careless.
mehnati|hard-working|adj|-|Woh mehnati hain.|They are hard-working.
sust|sluggish or lazy|adj|-|Aaj main sust hoon.|I feel sluggish today.
chaalaak|clever or crafty|adj|-|Woh bahut chaalaak hai.|That person is very clever.
samajhdaar|sensible|adj|-|Aap samajhdaar hain.|You are sensible.
wafaadaar|loyal|adj|-|Woh wafaadaar dost hain.|They are a loyal friend.
`],
['weather-nature-clothing',11,`
mausam|weather or season|m|Aaj mausam achchha hai.|The weather is good today.
baarish|rain|f|Baarish shuru ho gayi.|It has started raining.
dhoop|sunshine|f|Dhoop bahut tez hai.|The sunshine is very strong.
saaya|shade or shadow|m|Saaye mein baithiye.|Sit in the shade.
hawa|wind or air|f|Hawa thandi hai.|The wind is cool.
aandhi|windstorm|f|Aandhi aa rahi hai.|A windstorm is coming.
toofaan|storm|m|Toofaan guzar gaya.|The storm has passed.
baadal|cloud|m|Baadal chhaa gaye hain.|Clouds have gathered.
garmi|heat or summer|f|Garmi barh rahi hai.|It is getting hotter.
sardi|cold or winter|f|Sardi shuru ho gayi.|Winter has begun.
nami|humidity or moisture|f|Aaj hawa mein nami hai.|The air is humid today.
bijli ki chamak|lightning|phrase|-|Bijli ki chamak nazar aayi.|Lightning was visible.
garaj|thunder|f|Baadalon ki garaj suni?|Did you hear the thunder?
boond|drop|f|Baarish ki boond giri.|A drop of rain fell.
baadh|flood|f|Baadh se raasta band hai.|The road is closed because of flooding.
darakht|tree|m|Darakht ke neeche baithiye.|Sit under the tree.
pauda|plant|m|Paude ko paani dijiye.|Water the plant.
patta|leaf|m|Patta gir gaya.|The leaf fell.
phool|flower|m|Phool ki khushboo achchhi hai.|The flower smells lovely.
mitti|soil or earth|f|Mitti geeli hai.|The soil is wet.
patthar|stone|m|Raaste mein patthar hai.|There is a stone in the path.
pahaad|mountain|m|Pahaad door nazar aa raha hai.|The mountain is visible in the distance.
darya|river|m|Darya mein paani zyaada hai.|There is a lot of water in the river.
jheel|lake|f|Jheel ke paas chalte hain.|Let us walk near the lake.
samundar|sea|m|Samundar qareeb hai.|The sea is near.
baagh|garden|m|Baagh mein phool hain.|There are flowers in the garden.
parinda|bird|m|Parinda ud gaya.|The bird flew away.
jaanwar|animal|m|Jaanwar ko tang mat kijiye.|Do not bother the animal.
kutta|dog|m|Kutta so raha hai.|The dog is sleeping.
billi|cat|f|Billi baahar gayi hai.|The cat has gone outside.
kameez|shirt|f|Kameez saaf hai.|The shirt is clean.
shalwaar|shalwar trousers|f|Shalwaar taiyaar hai.|The shalwar is ready.
kurta|kurta|m|Kurta silwaana hai.|I need to have a kurta made.
dupatta|scarf|m|Dupatta yahaan hai.|The scarf is here.
saari|sari|f|Saari bahut khoobsoorat hai.|The sari is beautiful.
patloon|trousers|f|Patloon lambi hai.|The trousers are long.
jacket|jacket|f|Jacket pehen lijiye.|Put on a jacket.
sweater|sweater|m|Sweater garam hai.|The sweater is warm.
topi|cap|f|Topi kahaan hai?|Where is the cap?
juraab|sock|f|Ek juraab nahin mil rahi.|I cannot find one sock.
joota|shoe|m|Joota tang hai.|The shoe is tight.
chappal|sandal or slipper|f|Chappal baahar rakhiye.|Leave the sandals outside.
chashma|spectacles|m|Mera chashma kahaan hai?|Where are my glasses?
rumal|handkerchief|m|Rumal mere paas hai.|I have a handkerchief.
dastaana|glove|m|Dastaana pehen lijiye.|Put on a glove.
button|button|m|Button toot gaya.|The button broke.
zip|zip|f|Zip band nahin ho rahi.|The zip will not close.
jeb|pocket|f|Chaabi jeb mein hai.|The key is in the pocket.
aasteen|sleeve|f|Aasteen lambi hai.|The sleeve is long.
kapra|cloth or garment|m|Yeh kapra narm hai.|This cloth is soft.
`],
['community-events',11,`
mohalla|neighbourhood|m|Hamaara mohalla puraana hai.|Our neighbourhood is old.
pados|neighbouring area|m|Woh mere pados mein rehte hain.|They live in my neighbourhood.
padosi|neighbour|m|Padosi ne madad ki.|The neighbour helped.
basti|settlement|f|Basti mein school hai.|There is a school in the settlement.
shehar|city|m|Aap kis shehar se hain?|Which city are you from?
gaon|village|m|Hamaara gaon door hai.|Our village is far away.
mulk|country|m|Aap kis mulk mein rehte hain?|Which country do you live in?
riyaasat|state|f|Yeh badi riyaasat hai.|This is a large state.
zila|district|m|Aapka zila kaunsa hai?|Which is your district?
aabaadi|population|f|Shehar ki aabaadi barh rahi hai.|The city population is growing.
muashra|society|m|Muashra badal raha hai.|Society is changing.
qaum|community or nation|f|Har qaum ki apni kahaani hai.|Every community has its own story.
riwaaj|custom|m|Hamaare yahaan yeh riwaaj hai.|This is the custom in our community.
riwaayat|tradition|f|Yeh puraani riwaayat hai.|This is an old tradition.
tehzeeb|culture or refinement|f|Zubaan tehzeeb se judi hai.|Language is connected with culture.
pehchaan|identity or recognition|f|Zubaan hamaari pehchaan ka hissa hai.|Language is part of our identity.
virsa|heritage|m|Yeh hamaara virsa hai.|This is our heritage.
taareekh|history or date|f|Is jagah ki taareekh dilchasp hai.|The history of this place is interesting.
yaadgaar|memorial or keepsake|f|Yeh ek yaadgaar hai.|This is a keepsake.
tehwaar|festival|m|Tehwaar par sab milte hain.|Everyone meets at the festival.
jashn|celebration|m|Jashn ghar mein hoga.|The celebration will be at home.
daawat|invitation or feast|f|Daawat ka shukriya.|Thank you for the invitation.
mehmaan|guest|m|Mehmaan aa gaye hain.|The guests have arrived.
mezbaan|host|m|Mezbaan ka shukriya ada kijiye.|Thank the host.
shaadi|wedding or marriage|f|Shaadi agle mahine hai.|The wedding is next month.
nikah|marriage ceremony|m|Nikah kal hoga.|The marriage ceremony is tomorrow.
rishta|relationship or marriage proposal|m|Hamaara rishta puraana hai.|Our relationship goes back a long way.
mangni|engagement|f|Mangni ki taareekh tai ho gayi.|The engagement date has been fixed.
dulha|bridegroom|m|Dulha aa gaya.|The bridegroom has arrived.
dulhan|bride|f|Dulhan taiyaar hai.|The bride is ready.
saalgirah|anniversary or birthday|f|Aapki saalgirah mubaarak ho.|Happy anniversary or birthday.
paidaaish|birth|f|Bachche ki paidaaish par mubaarakbaad.|Congratulations on the birth of the child.
wafaat|death respectful|f|Unki wafaat ka sunkar afsos hua.|I was saddened to hear of their death.
janaaza|funeral|m|Janaaza kab hai?|When is the funeral?
taaziyat|condolence|f|Main taaziyat ke liye aaya hoon.|I have come to offer condolences.
dua|prayer or good wish|f|Aapki dua chahiye.|I ask for your prayers.
ibaadat|worship|f|Ibaadat ke liye waqt rakhiye.|Set aside time for worship.
masjid|mosque|f|Masjid qareeb hai.|The mosque is nearby.
mandir|temple|m|Mandir udhar hai.|The temple is over there.
mazaar|shrine or tomb|m|Mazaar par log aaye hain.|People have come to the shrine.
roza|fast|m|Aaj mera roza hai.|I am fasting today.
iftaar|breaking of the fast|m|Iftaar ka waqt ho gaya.|It is time to break the fast.
sehri|predawn meal in fasting|f|Sehri ke liye uthi hoon.|I have got up for the predawn meal.
eid|Eid festival|f|Eid mubaarak ho.|Happy Eid.
khairaat|charity|f|Unhone khairaat di.|They gave charity.
atiya|donation|m|Atiya dena chaahte hain.|They want to give a donation.
jalsa|public gathering|m|Jalsa shaam ko hai.|The gathering is in the evening.
mehfil|social or artistic gathering|f|Mehfil mein baat hui.|We spoke at the gathering.
mushaira|poetry gathering|m|Mushaira der tak chala.|The poetry gathering went on late.
geet|song|m|Yeh geet mujhe pasand hai.|I like this song.
`],
['discussion',9,`
raay|opinion|f|Aapki raay kya hai?|What is your opinion?
khayaal|thought or idea|m|Yeh achchha khayaal hai.|This is a good idea.
daleel|argument or reasoned evidence|f|Aapki daleel samajh mein aayi.|I understood your argument.
saboot|evidence|m|Is baat ka saboot kya hai?|What evidence is there for this?
wajah|reason|f|Wajah saaf bataaiye.|Explain the reason clearly.
sabab|cause|m|Iska sabab kya hai?|What caused it?
asar|effect|m|Iska asar baad mein hoga.|Its effect will appear later.
masla|problem or issue|m|Masla hal ho gaya.|The problem has been solved.
hal|solution|m|Koi aur hal dhoondhte hain.|Let us find another solution.
faisla|decision|m|Faisla milkar karte hain.|Let us decide together.
tajweez|proposal|f|Yeh sirf tajweez hai.|This is only a proposal.
mashwara|advice or consultation|m|Aapka mashwara chahiye.|I would like your advice.
tasdeeq|confirmation|f|Tasdeeq abhi nahin hui.|It has not been confirmed yet.
tardeed|denial or refutation|f|Unhone khabar ki tardeed ki.|They denied the report.
ittefaaq|agreement or coincidence|m|Mujhe is baat se ittefaaq hai.|I agree with this point.
ikhtilaaf|disagreement or difference|m|Hamaara ikhtilaaf tareeqe par hai.|Our disagreement is about the method.
sehmat|in agreement|adj|-|Main aapse sehmat hoon.|I agree with you.
raazi|willing or agreed|adj|-|Kya sab raazi hain?|Does everyone agree?
manzoor|acceptable or approved|adj|-|Yeh shart manzoor hai.|This condition is acceptable.
munasib|suitable|adj|-|Yeh waqt munasib hai.|This time is suitable.
na-munasib|inappropriate|adj|-|Yeh sawaal na-munasib hai.|This question is inappropriate.
haqeeqat|reality or fact|f|Haqeeqat kuchh aur hai.|The reality is different.
imkaan|possibility|m|Iska imkaan hai.|It is possible.
andesha|apprehension or risk|m|Der hone ka andesha hai.|There is a risk of delay.
andaaza|estimate or guess|m|Yeh mera andaaza hai.|This is my estimate.
farq|difference|m|Dono mein kya farq hai?|What is the difference between the two?
misaal ke taur par|for example|phrase|-|Misaal ke taur par yeh dekhiye.|Look at this for example.
aam taur par|generally|adv|-|Aam taur par hum jaldi aate hain.|We generally arrive early.
filhaal|for the present|adv|-|Filhaal yahi theek hai.|This is fine for now.
baharhaal|in any case|adv|-|Baharhaal hamein bata dijiye.|In any case, let us know.
phir bhi|nevertheless|adv|-|Phir bhi koshish karte hain.|Let us try nevertheless.
halaanki|although|conj|-|Halaanki door hai, hum jaayenge.|Although it is far, we will go.
basharte ki|provided that|conj|-|Hum jaayenge basharte ki waqt ho.|We will go provided there is time.
warna|otherwise|conj|-|Jaldi chaliye warna der hogi.|Hurry or we will be late.
lihaaza|therefore|adv|-|Lihaaza pehle tasdeeq kijiye.|Therefore, confirm first.
chunaanche|consequently|adv|-|Chunaanche programme badal gaya.|Consequently, the plan changed.
bajaaye|instead of|post|-|Chaar ke bajaaye paanch baje milen.|Let us meet at five instead of four.
alaawa|apart from|post|-|Iske alaawa kya chahiye?|What else is needed apart from this?
baawajood|despite|post|-|Baarish ke baawajood woh aaye.|They came despite the rain.
mutabiq|according to|post|-|Aapke mutabiq kya hua?|According to you, what happened?
mutalliq|concerning|post|-|Iske mutalliq baat karte hain.|Let us talk about this.
darasal|actually or in fact|adv|-|Darasal mujhe waqt maaloom nahin tha.|Actually, I did not know the time.
yaani|that is to say|adv|-|Yaani hum kal milenge?|So you mean we will meet tomorrow?
bilfarz|supposing|adv|-|Bilfarz baarish ho to kya karenge?|Supposing it rains, what will we do?
kaash|if only|part|-|Kaash hum paas rehte.|If only we lived nearby.
haalaat|circumstances|m|Haalaat badal gaye hain.|The circumstances have changed.
soorat-e-haal|situation|f|Soorat-e-haal samajh lijiye.|Understand the situation.
nuqta|point in discussion|m|Aapka nuqta samajh gaya.|I understood your point.
nazariya|viewpoint|m|Har shakhs ka nazariya alag hai.|Each person has a different viewpoint.
galatfehmi|misunderstanding|f|Galatfehmi door ho gayi.|The misunderstanding has been cleared up.
`]
];
const rows=[];let id=501;
for(const [topic,chapter,block] of groups){
 const lines=block.trim().split('\n').map(s=>s.trim()).filter(Boolean);
 console.log(topic,lines.length);
 for(const line of lines){
  const a=line.split('|');let roman,english,pos,gender,example,translation;
  if(a.length===5){[roman,english,gender,example,translation]=a;pos='noun';}
  else if(a.length===6){[roman,english,pos,gender,example,translation]=a;}
  else throw Error('bad '+line);
  rows.push({id:id++,roman,english,pos,gender,topic,chapter,example,translation,register:'shared'});
 }
}
if(rows.length!==500)throw Error('Expected 500, got '+rows.length);
const header=['id','roman','english','pos','gender','topic','chapter','example','translation','register'];
const root=new URL('../',import.meta.url);
fs.writeFileSync(new URL('data/vocab-501-1000.tsv',root),header.join('\t')+'\n'+rows.map(r=>header.map(k=>r[k]).join('\t')).join('\n')+'\n');
console.log('Saved',rows.length,rows[0].id,rows.at(-1).id);
