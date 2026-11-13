import {writeFileSync} from 'node:fs';
const rows=[];
function group(topic,chapter,pos,text,make){for(const line of text.trim().split('\n')){const[roman,english,gender='-',example,translation]=line.split('|');const pair=example?[example,translation]:make(roman,english,gender);rows.push({roman,english,pos,gender,topic,chapter,example:pair[0],translation:pair[1],register:['hau','nakko','kaiku','mereku','tereku'].includes(roman)?'hyderabadi':'shared'});}}
group('function',1,'function',`
main|I|-|Main yahan hoon.|I am here.
hum|we|-|Hum tayyar hain.|We are ready.
tum|you; familiar|-|Tum kahan ho?|Where are you?
aap|you; respectful|-|Aap kaise hain?|How are you?
yeh|this; this person|-|Yeh mera ghar hai.|This is my house.
vo|that; he; she; they|-|Vo ghar par hain.|They are at home.
mujhe|to me; me|-|Mujhe paani chahiye.|I need water.
humein|to us; us|-|Humein waqt chahiye.|We need time.
tumhe|to you; familiar|-|Tumhe kya chahiye?|What do you need?
aapko|to you; respectful|-|Aapko chai chahiye?|Would you like tea?
usko|to him; to her|-|Usko phone kijiye.|Call him or her.
unko|to them; respectful him or her|-|Unko bata dijiye.|Tell them.
mera|my; masculine|-|Mera naam Ali hai.|My name is Ali.
hamara|our; masculine|-|Hamara ghar paas hai.|Our house is nearby.
tumhara|your; familiar masculine|-|Tumhara naam kya hai?|What is your name?
aapka|your; respectful masculine|-|Aapka bag yahan hai.|Your bag is here.
uska|his; her; its masculine possession|-|Uska ghar door hai.|His or her house is far.
unka|their; respectful possession|-|Unka naam Sara hai.|Her name is Sara.
apna|one's own; masculine|-|Apna bag lijiye.|Take your own bag.
khud|self; personally|-|Main khud karunga.|I will do it myself.
kaun|who|-|Kaun aaya?|Who came?
kya|what; question marker|-|Yeh kya hai?|What is this?
kahan|where|-|Aap kahan hain?|Where are you?
kab|when|-|Aap kab aayenge?|When will you come?
kyun|why|-|Aap kyun gaye?|Why did you go?
kaise|how|-|Yeh kaise hota hai?|How does this happen?
kitna|how much; masculine|-|Kitna paani chahiye?|How much water is needed?
kaisa|what kind; masculine|-|Kaisa khaana chahiye?|What kind of food do you want?
kiska|whose; masculine|-|Yeh kiska bag hai?|Whose bag is this?
kaunsa|which; masculine|-|Kaunsa kamra hai?|Which room is it?
haan|yes|-|Haan, main aaunga.|Yes, I will come.
nahin|no; not|-|Main ghar par nahin hoon.|I am not at home.
ji|respectful acknowledgment|-|Ji, batayiye.|Yes, please tell me.
aur|and; more|-|Chai aur paani lijiye.|Have tea and water.
lekin|but|-|Main aaunga lekin der se.|I will come, but late.
ya|or|-|Chai ya paani?|Tea or water?
toh|then; so|-|Toh hum chalein?|Then shall we leave?
bhi|also; even|-|Main bhi aaunga.|I will come too.
hi|restrictive emphasis; only|-|Main hi gaya tha.|I was the one who went.
sirf|only|-|Sirf ek chahiye.|Only one is needed.
ka|of; masculine possession|-|Ali ka ghar hai.|It is Ali's house.
ki|of; feminine possession; that|-|Yeh Ammi ki kitaab hai.|This is Ammi's book.
ke|of; plural or oblique possession|-|Yeh mere bhai ke joote hain.|These are my brother's shoes.
ko|to; object marker|-|Ammi ko phone karo.|Call Ammi.
se|from; with; by|-|Main ghar se aaya.|I came from home.
mein|in|-|Paani glass mein hai.|The water is in the glass.
par|on; at|-|Kitaab mez par hai.|The book is on the table.
tak|until; as far as|-|Shaam tak aaiye.|Come by evening.
ne|perfective doer marker|-|Ali ne chai pi.|Ali drank tea.
liye|for; in ke liye|-|Yeh aapke liye hai.|This is for you.
saath|with; together|-|Mere saath aaiye.|Come with me.
paas|near; possession with ke paas|-|Mere paas waqt hai.|I have time.
taraf|direction; side|f|Is taraf aaiye.|Come this way.
baare|about; in ke baare mein|-|Aap kis baare mein soch rahe hain?|What are you thinking about?
koi|someone; any|-|Koi aaya hai.|Someone has come.
kuch|something; some|-|Kuch kha lijiye.|Have something to eat.
sab|all; everyone|-|Sab yahan hain.|Everyone is here.
har|every|-|Har din sunta hoon.|I listen every day.
doosra|other; second|-|Doosra glass lijiye.|Take the other glass.
ek doosre|each other|-|Hum ek doosre ki madad karte hain.|We help each other.
hau|yes; local|-|Hau, main aa raha hoon.|Yes, I am coming.
nakko|do not; not wanted; context dependent|-|Chai nakko, shukriya.|No tea, thank you.
kaiku|why; local|-|Tum kaiku gaye?|Why did you go?
mereku|to me; local|-|Mereku paani chahiye.|I need water.
tereku|to you; familiar or intimate local|-|Tereku kya chahiye?|What do you need?
`);
group('numbers',3,'number',`
sifar|zero
ek|one
do|two
teen|three
chaar|four
paanch|five
chhe|six
saat|seven
aath|eight
nau|nine
das|ten
gyarah|eleven
barah|twelve
terah|thirteen
chaudah|fourteen
pandrah|fifteen
solah|sixteen
satrah|seventeen
atharah|eighteen
unnees|nineteen
bees|twenty
ikkees|twenty-one
baees|twenty-two
teis|twenty-three
chaubees|twenty-four
pachchees|twenty-five
chhabbees|twenty-six
sattaees|twenty-seven
atthaees|twenty-eight
untees|twenty-nine
tees|thirty
iktees|thirty-one
battees|thirty-two
taintees|thirty-three
chauntees|thirty-four
paintees|thirty-five
chhattees|thirty-six
saintees|thirty-seven
artees|thirty-eight
untaalees|thirty-nine
chaalees|forty
iktaalees|forty-one
bayaalees|forty-two
taintaalees|forty-three
chavaalees|forty-four
paintaalees|forty-five
chhiyaalees|forty-six
saintaalees|forty-seven
artaalees|forty-eight
unchaas|forty-nine
pachaas|fifty
`,(r,e)=>[r==='ek'?`Mere paas ek rupaya hai.`:`Mere paas ${r} rupaye hain.`,`I have ${e} rupee${r==='ek'?'':'s'}.`]);
group('family',2,'noun',`
Ammi|mother; family address|f|Ammi ghar par hain.|Ammi is at home.
Abbu|father; family address|m|Abbu aa rahe hain.|Abbu is coming.
maa|mother|f|Meri maa yahan hain.|My mother is here.
baap|father; register sensitive|m|Vo do bachchon ka baap hai.|He is the father of two children.
bhai|brother|m|Mera bhai aa gaya.|My brother has arrived.
behen|sister|f|Meri behen yahan hai.|My sister is here.
beta|son|m|Unka beta padhta hai.|Their son studies.
beti|daughter|f|Unki beti khel rahi hai.|Their daughter is playing.
bachcha|child|m|Bachcha so raha hai.|The child is sleeping.
bachchi|girl child|f|Bachchi khel rahi hai.|The girl is playing.
dada|paternal grandfather|m|Dada baat kar rahe hain.|Grandfather is talking.
dadi|paternal grandmother|f|Dadi ghar par hain.|Grandmother is at home.
nana|maternal grandfather|m|Nana ko phone kijiye.|Call maternal grandfather.
nani|maternal grandmother|f|Nani ki yaad aati hai.|I miss maternal grandmother.
chacha|father's younger brother|m|Chacha kal aayenge.|My paternal uncle will come tomorrow.
taya|father's elder brother|m|Taya se baat kijiye.|Speak with father's elder brother.
phuppi|father's sister|f|Phuppi ne chai banayi.|My paternal aunt made tea.
mamu|mother's brother|m|Mamu Hyderabad mein rehte hain.|My maternal uncle lives in Hyderabad.
khala|mother's sister|f|Khala ko khaana pasand hai.|My maternal aunt likes the food.
chachi|wife of father's younger brother|f|Chachi aa rahi hain.|My paternal uncle's wife is coming.
taayi|wife of father's elder brother|f|Taayi ka phone aaya.|Father's elder brother's wife called.
phuppa|husband of father's sister|m|Phuppa yahan baithe hain.|My paternal aunt's husband is sitting here.
mami|wife of mother's brother|f|Mami ne bulaya hai.|My maternal uncle's wife has invited us.
khalu|husband of mother's sister|m|Khalu ke saath aaiye.|Come with my maternal aunt's husband.
shauhar|husband|m|Unke shauhar yahan hain.|Her husband is here.
biwi|wife|f|Meri biwi kaam karti hai.|My wife works.
miyaan|husband; form of address|m|Unke miyaan abhi aaye.|Her husband just arrived.
rishtedaar|relative|m|Hamare rishtedaar aa rahe hain.|Our relatives are coming.
parivaar|family; shared Hindi word|m|Mera parivaar yahan hai.|My family is here.
ghar wale|family members; people at home|m.pl|Ghar wale kaise hain?|How is everyone at home?
`);
group('home',3,'noun',`
ghar|home; house|m
kamra|room|m
darwaza|door|m
khidki|window|f
mez|table|f
kursi|chair|f
bistar|bed; bedding|m
takiya|pillow|m
chaadar|sheet|f
kambal|blanket|m
farsh|floor|m
deewar|wall|f
chhat|roof; ceiling|f
seedhi|stair; ladder|f
rasoi|kitchen; shared Hindi word|f
baavarchikhana|kitchen; Urdu word|m
bathroom|bathroom|m
nal|tap|m
balti|bucket|f
sabun|soap|m
tauliya|towel|m
aaina|mirror|m
kangi|comb|f
chaabi|key|f
taala|lock|m
bijli|electricity|f
pankha|fan|m
batti|light; lamp|f
chulha|stove|m
fridge|refrigerator|m
bartan|utensil; dish|m
chamach|spoon|m
thaali|plate; platter|f
piyaali|cup|f
glass|drinking glass|m
chhuri|knife|f
dabba|box; container|m
thaila|bag; shopping sack|m
kooda|rubbish; trash|m
jhaadu|broom|f
`,(r,e,g)=>[`Yeh ${r} ${g==='f'?'saaf':'saaf'} hai.`,`This ${e.split(';')[0]} is clean.`]);
group('verbs',3,'verb',`
hona|to be; to happen|-|Sab theek hoga.|Everything will be all right.
karna|to do
jaana|to go
aana|to come
lena|to take
dena|to give
khaana|to eat
peena|to drink
bolna|to speak
kehna|to say
sunna|to hear; listen
dekhna|to see; watch
padhna|to read; study
likhna|to write
samajhna|to understand
jaanna|to know
seekhna|to learn
sikhana|to teach
poochhna|to ask a question
batana|to tell; explain
uthna|to get up; rise
sona|to sleep
baithna|to sit
khada hona|to stand up; be standing
chalna|to walk; function
daudna|to run
rukna|to stop; stay briefly
rehna|to live; stay
milna|to meet; be found
bulana|to call over; invite
phone karna|to telephone
bhejna|to send
rakhna|to put; keep
uthana|to lift; pick up
laana|to bring
le jaana|to take away
chhodna|to leave; let go
pakadna|to hold; catch
kholna|to open
band karna|to close; switch off
banana|to make
pakana|to cook
dhona|to wash
nahana|to bathe
saaf karna|to clean
pehenna|to wear; put on
utarna|to descend; get off
utaarna|to remove; take off
khareedna|to buy
bechna|to sell
maangna|to ask for; request
chahna|to want
pasand karna|to like
lagna|to seem; feel; attach|-|Mujhe thand lag rahi hai.|I feel cold.
sochna|to think
yaad rakhna|to remember; keep in mind
bhoolna|to forget
hansna|to laugh
rona|to cry
khelna|to play
kaam karna|to work
madad karna|to help
intezaar karna|to wait
koshish karna|to try
shuru karna|to start
khatam karna|to finish
badalna|to change
samjhana|to explain
dohrana|to repeat
chunna|to choose
ginna|to count
tolna|to weigh
kaatna|to cut
daalna|to put in; add
nikalna|to leave; emerge
nikaalna|to take out; remove
bharna|to fill
girana|to drop; cause to fall
girna|to fall
tootna|to break; intransitive
todna|to break something
judna|to join; become connected
jodna|to join things; add
chalana|to drive; operate
pahunchna|to arrive; reach
lautna|to return
baantna|to share out; divide
bachna|to remain; be saved
bachana|to save; protect
dhakna|to cover
talna|to fry
ubaalna|to boil something
garam karna|to heat; warm up
thanda karna|to cool something
chakhna|to taste
chabana|to chew
nigalna|to swallow
chhoona|to touch
dhoondhna|to look for
paana|to obtain; manage to|-|Main samajh nahin paya.|I could not manage to understand.
`,(r,e)=>[`Mujhe ${r} hai.`,`I need ${e.split(';')[0]}.`]);
group('time',3,'time word',`
aaj|today|-|Aaj chhutti hai.|Today is a day off.
kal|yesterday or tomorrow; context decides|-|Kal main aaya tha.|I came yesterday.
parson|day before yesterday or day after tomorrow|-|Parson hum milenge.|We will meet the day after tomorrow.
ab|now|-|Ab chaliye.|Let us go now.
abhi|right now; just now|-|Main abhi aaya.|I just arrived.
tab|then; at that time|-|Tab main ghar par tha.|I was at home then.
pehle|before; first|-|Pehle paani peejiye.|Drink water first.
baad|after; later|-|Khaane ke baad aaiye.|Come after the meal.
phir|then; again|-|Phir kya hua?|What happened then?
dobara|again|-|Dobara kahiye.|Say it again.
subah|morning|f|Subah jaldi aaiye.|Come early in the morning.
dopahar|afternoon; midday|f|Dopahar mein milte hain.|Let us meet in the afternoon.
shaam|evening|f|Shaam ko phone kijiye.|Call in the evening.
raat|night|f|Raat ko der ho gayi.|It became late at night.
din|day|m|Aaj achha din hai.|Today is a good day.
hafta|week|m|Agle hafte aaiye.|Come next week.
mahina|month|m|Ek mahina ho gaya.|A month has passed.
saal|year|m|Main har saal aata hoon.|I come every year.
waqt|time|m|Aapke paas waqt hai?|Do you have time?
ghanta|hour|m|Ek ghanta rukiye.|Wait one hour.
minute|minute|m|Do minute rukiye.|Wait two minutes.
baje|o'clock; time expression|-|Saat baje aaiye.|Come at seven.
aadha|half; masculine|-|Aadha ghanta lagega.|It will take half an hour.
pauna|quarter to; three quarters|-|Paune saat baje hain.|It is quarter to seven.
sava|quarter past; one and a quarter|-|Sava saat baje hain.|It is quarter past seven.
saadhe|half past; half more|-|Saadhe saat baje hain.|It is half past seven.
roz|every day|-|Main roz sunta hoon.|I listen every day.
hamesha|always|-|Vo hamesha madad karte hain.|They always help.
aksar|often|-|Hum aksar milte hain.|We often meet.
kabhi|ever; sometimes in context|-|Kabhi ghar aaiye.|Come home sometime.
jaldi|soon; early; quickly|-|Jaldi aaiye.|Come soon.
der|lateness; a while|f|Der ho gayi.|It has become late.
itvaar|Sunday|m|Itvaar ko milte hain.|Let us meet on Sunday.
peer|Monday; Urdu day name|m|Peer ko kaam hai.|There is work on Monday.
mangal|Tuesday|m|Mangal ko aaiye.|Come on Tuesday.
budh|Wednesday|m|Budh ko chhutti hai.|Wednesday is a day off.
jumeraat|Thursday; Urdu day name|f|Jumeraat ko aaiye.|Come on Thursday.
jumma|Friday; Urdu day name|m|Jumme ko phone kijiye.|Call on Friday.
sanichar|Saturday; shared Hindi day name|m|Sanichar ko milte hain.|Let us meet on Saturday.
`);
group('food',4,'noun',`
paani|water|m
chai|tea|f
doodh|milk|m
coffee|coffee|f
naashta|breakfast; snack|m
roti|flatbread|f
chaawal|rice; usually plural agreement|m.pl
daal|lentils; lentil dish|f
sabzi|vegetable; vegetable dish|f
gosht|meat|m
murghi|chicken; hen|f
machhli|fish|f
anda|egg|m
dahi|yogurt|m
makhan|butter|m
ghee|clarified butter|m
tel|oil|m
namak|salt|m
cheeni|sugar|f
mirch|chili; pepper|f
haldi|turmeric|f
zeera|cumin|m
dhaniya|coriander|m
adrak|ginger|f
lehsun|garlic|m
pyaaz|onion|f
tamatar|tomato|m
aaloo|potato|m
baingan|eggplant|m
bhindi|okra|f
palak|spinach|f
gajar|carrot|f
matar|peas|m.pl
kheera|cucumber|m
nimbu|lemon; lime|m
phal|fruit|m
seb|apple|m
kela|banana|m
aam|mango|m
santra|orange|m
angoor|grapes|m.pl
anaar|pomegranate|m
papita|papaya|m
tarbooz|watermelon|m
khajoor|date fruit|f
badam|almond|m
kaaju|cashew|m
kishmish|raisins|f
atta|whole-wheat flour|m
maida|refined flour|m
besan|chickpea flour|m
sooji|semolina|f
chana|chickpea|m
rajma|kidney beans|m
paneer|fresh cheese|m
biryani|biryani rice dish|f
khichdi|rice and lentil dish|f
haleem|slow-cooked grain and meat dish|m
nihari|slow-cooked meat stew|f
qorma|braised curry|m
salan|curry; gravy|m
achaar|pickle condiment|m
chutney|chutney condiment|f
raita|yogurt side dish|m
salad|salad|m
soop|soup|m
mithai|sweets|f
kheer|milk rice pudding|f
seviyan|vermicelli; sweet dish|f.pl
double ka meetha|Hyderabadi bread dessert|m
lassi|yogurt drink|f
sharbat|sweet drink|m
juice|juice|m
biscuit|biscuit; cookie|m
papad|crisp lentil wafer|m
`,(r,e)=>[`Mujhe ${r} chahiye.`,`I would like ${e.split(';')[0]}.`]);
group('descriptors',2,'descriptor',`
achha|good; masculine|-|Yeh achha hai.|This is good.
bura|bad; masculine|-|Yeh bura nahin hai.|This is not bad.
bada|big; elder; masculine|-|Ghar bada hai.|The house is big.
chhota|small; younger; masculine|-|Kamra chhota hai.|The room is small.
naya|new; masculine|-|Yeh naya hai.|This is new.
purana|old; not new; masculine|-|Yeh purana ghar hai.|This is an old house.
lamba|long; tall; masculine|-|Raasta lamba hai.|The route is long.
naata|short in height; masculine|-|Vo mujhse naata hai.|He is shorter than me.
ooncha|high; masculine|-|Darwaza ooncha hai.|The door is high.
neecha|low; masculine|-|Mez neechi hai.|The table is low.
mota|thick; fat; masculine|-|Yeh kapda mota hai.|This fabric is thick.
patla|thin; masculine|-|Yeh kapda patla hai.|This fabric is thin.
chauda|wide; masculine|-|Raasta chauda hai.|The road is wide.
tang|narrow; tight|-|Kamra tang hai.|The room is cramped.
gehra|deep; masculine|-|Paani gehra hai.|The water is deep.
uthla|shallow; masculine|-|Yahan paani uthla hai.|The water is shallow here.
saaf|clean; clear|-|Paani saaf hai.|The water is clean.
ganda|dirty; masculine|-|Glass ganda hai.|The glass is dirty.
garam|hot|-|Khaana garam hai.|The food is hot.
thanda|cold; masculine|-|Paani thanda hai.|The water is cold.
taaza|fresh|-|Khaana taaza hai.|The food is fresh.
baasi|stale|-|Yeh khaana baasi hai.|This food is stale.
meetha|sweet; masculine|-|Aam meetha hai.|The mango is sweet.
khatta|sour; masculine|-|Nimbu khatta hai.|The lemon is sour.
kadwa|bitter; masculine|-|Yeh kadwa hai.|This is bitter.
namkeen|salty; savory|-|Yeh namkeen hai.|This is salty.
teekha|spicy; sharp; masculine|-|Khaana teekha hai.|The food is spicy.
pheeka|bland; masculine|-|Salan pheeka hai.|The curry is bland.
kaccha|raw; unripe; masculine|-|Aam kaccha hai.|The mango is unripe.
pakka|cooked; ripe; certain; masculine|-|Yeh pakka hai?|Is this certain?
naram|soft|-|Roti naram hai.|The flatbread is soft.
sakht|hard; strict|-|Yeh bahut sakht hai.|This is very hard.
geela|wet; masculine|-|Farsh geela hai.|The floor is wet.
sookha|dry; masculine|-|Kapda sookha hai.|The cloth is dry.
bhara|full; masculine|-|Glass bhara hai.|The glass is full.
khaali|empty; free|-|Kamra khaali hai.|The room is empty.
khula|open; masculine|-|Darwaza khula hai.|The door is open.
band|closed; off|-|Darwaza band hai.|The door is closed.
sasta|inexpensive; masculine|-|Yeh sasta hai.|This is inexpensive.
mehnga|expensive; masculine|-|Yeh mehnga hai.|This is expensive.
muft|free of charge|-|Yeh muft hai.|This is free of charge.
bhaari|heavy|-|Bag bhaari hai.|The bag is heavy.
halka|light in weight; masculine|-|Bag halka hai.|The bag is light.
tez|fast; strong; sharp|-|Pankha tez hai.|The fan is fast.
dheema|slow; low in intensity; masculine|-|Pankha dheema hai.|The fan is slow.
dheere|slowly|-|Dheere boliye.|Speak slowly.
aasaan|easy|-|Yeh aasaan hai.|This is easy.
mushkil|difficult|-|Yeh mushkil hai.|This is difficult.
sahi|correct; right|-|Yeh sahi hai.|This is correct.
ghalat|incorrect; wrong|-|Yeh ghalat hai.|This is incorrect.
theek|all right; correct|-|Sab theek hai.|Everything is all right.
tayyar|ready|-|Khaana tayyar hai.|The food is ready.
zaroori|necessary; important|-|Yeh zaroori hai.|This is necessary.
kaafi|enough; quite|-|Itna kaafi hai.|This much is enough.
kam|less; little|-|Namak kam hai.|There is little salt.
zyada|more; too much|-|Cheeni zyada hai.|There is too much sugar.
bahut|very; a lot|-|Bahut achha hai.|It is very good.
thoda|a little; masculine|-|Thoda paani dijiye.|Give me a little water.
poora|whole; complete; masculine|-|Poora din laga.|It took the whole day.
adhoora|incomplete; masculine|-|Kaam adhoora hai.|The work is incomplete.
aadha-adhoora|half finished; masculine|-|Kaam aadha-adhoora hai.|The work is half finished.
barabar|equal; evenly|-|Dono barabar hain.|Both are equal.
alag|different; separate|-|Yeh alag hai.|This is different.
ek jaisa|alike; masculine|-|Dono ek jaise hain.|Both are alike.
seedha|straight; direct; masculine|-|Seedha jaiye.|Go straight.
ulta|upside down; opposite; masculine|-|Yeh ulta hai.|This is upside down.
gol|round|-|Mez gol hai.|The table is round.
tedha|crooked; masculine|-|Yeh tedha hai.|This is crooked.
kareeb|near; approximately|-|Ghar kareeb hai.|The house is nearby.
door|far|-|Ghar door hai.|The house is far away.
andar|inside|-|Andar aaiye.|Come inside.
bahar|outside|-|Bahar rukiye.|Wait outside.
oopar|above; upstairs|-|Oopar aaiye.|Come upstairs.
neeche|below; downstairs|-|Neeche baithiye.|Sit below.
aage|ahead; in front|-|Aage jaiye.|Go ahead.
peechhe|behind; back|-|Peechhe dekhiye.|Look behind.
daayein|to the right|-|Daayein mudiye.|Turn right.
baayein|to the left|-|Baayein mudiye.|Turn left.
beech|middle|-|Beech mein rakhiye.|Put it in the middle.
yahan|here|-|Yahan aaiye.|Come here.
vahan|there|-|Vahan baithiye.|Sit there.
idhar|this way; here|-|Idhar dekhiye.|Look this way.
udhar|that way; there|-|Udhar jaiye.|Go that way.
laal|red|-|Yeh laal hai.|This is red.
neela|blue; masculine|-|Yeh neela hai.|This is blue.
hara|green; masculine|-|Yeh hara hai.|This is green.
peela|yellow; masculine|-|Yeh peela hai.|This is yellow.
kaala|black; masculine|-|Yeh kaala hai.|This is black.
safed|white|-|Yeh safed hai.|This is white.
bhoora|brown; masculine|-|Yeh bhoora hai.|This is brown.
gulaabi|pink|-|Yeh gulaabi hai.|This is pink.
baingani|purple|-|Yeh baingani hai.|This is purple.
narangi|orange-colored|-|Yeh narangi hai.|This is orange-colored.
sunahra|golden; masculine|-|Yeh sunahra hai.|This is golden.
chaandi jaisa|silver-colored; masculine|-|Yeh chaandi jaisa hai.|This is silver-colored.
halka rang|light color|m|Halka rang chuniye.|Choose a light color.
gehra rang|dark color|m|Gehra rang chuniye.|Choose a dark color.
bilkul|completely; exactly|-|Bilkul theek hai.|It is completely all right.
lagbhag|approximately|-|Lagbhag das log hain.|There are approximately ten people.
taqreeban|approximately; Urdu word|-|Taqreeban saat baje hain.|It is approximately seven.
`);
const contextual=`ghar|Main ghar ja raha hoon.|I am going home.
kamra|Kamra saaf hai.|The room is clean.
darwaza|Darwaza band kijiye.|Close the door.
khidki|Khidki khuli hai.|The window is open.
mez|Kitaab mez par hai.|The book is on the table.
kursi|Kursi yahan rakhiye.|Put the chair here.
bistar|Bistar tayyar hai.|The bed is ready.
takiya|Takiya kahan hai?|Where is the pillow?
chaadar|Chaadar saaf hai.|The sheet is clean.
kambal|Kambal le lijiye.|Take a blanket.
farsh|Farsh geela hai.|The floor is wet.
deewar|Deewar safed hai.|The wall is white.
chhat|Chhat par aaiye.|Come onto the roof.
seedhi|Seedhi par dheere chaliye.|Go slowly on the stairs.
rasoi|Rasoi mein paani hai.|There is water in the kitchen.
baavarchikhana|Baavarchikhane mein chai hai.|There is tea in the kitchen.
bathroom|Bathroom kahan hai?|Where is the bathroom?
nal|Nal band kijiye.|Turn off the tap.
balti|Balti mein paani hai.|There is water in the bucket.
sabun|Sabun se haath dhoyiye.|Wash your hands with soap.
tauliya|Tauliya yahan hai.|The towel is here.
aaina|Aaina saaf hai.|The mirror is clean.
kangi|Kangi kahan rakhi hai?|Where is the comb?
chaabi|Chaabi mere paas hai.|I have the key.
taala|Taala laga hai.|It is locked.
bijli|Bijli aa gayi.|The electricity has come back.
pankha|Pankha chala dijiye.|Turn on the fan.
batti|Batti band kar dijiye.|Turn off the light.
chulha|Chulha band hai.|The stove is off.
fridge|Doodh fridge mein hai.|The milk is in the refrigerator.
bartan|Bartan dho lijiye.|Wash the dishes.
chamach|Ek chamach dijiye.|Give me a spoon.
thaali|Thaali yahan rakhiye.|Put the plate here.
piyaali|Piyaali mein chai hai.|There is tea in the cup.
glass|Glass khaali hai.|The glass is empty.
chhuri|Chhuri mez par hai.|The knife is on the table.
dabba|Dabba khol dijiye.|Open the box.
thaila|Thaila saath lijiye.|Take a bag with you.
kooda|Kooda bahar rakhiye.|Put the rubbish outside.
jhaadu|Jhaadu kahan hai?|Where is the broom?
karna|Aap kya kar rahe hain?|What are you doing?
jaana|Mujhe ghar jaana hai.|I need to go home.
aana|Kal aaiye.|Come tomorrow.
lena|Yeh le lijiye.|Take this.
dena|Mujhe paani dijiye.|Give me water.
khaana|Kuch kha lijiye.|Have something to eat.
peena|Paani pee lijiye.|Have some water.
bolna|Dheere boliye.|Speak slowly.
kehna|Aapne kya kaha?|What did you say?
sunna|Meri baat suniye.|Listen to me.
dekhna|Yeh dekhiye.|Look at this.
padhna|Main kitaab padhta hoon.|I read a book.
likhna|Apna naam likhiye.|Write your name.
samajhna|Main samajh gaya.|I understood.
jaanna|Main unko jaanta hoon.|I know them.
seekhna|Main Urdu seekh raha hoon.|I am learning Urdu.
sikhana|Mujhe yeh lafz sikhaiye.|Teach me this word.
poochhna|Unse poochhiye.|Ask them.
batana|Mujhe bataiye.|Tell me.
uthna|Main jaldi uthta hoon.|I get up early.
sona|Bachcha so raha hai.|The child is sleeping.
baithna|Yahan baithiye.|Sit here.
khada hona|Yahan khade ho jaiye.|Stand here.
chalna|Dheere chaliye.|Walk slowly.
daudna|Bachche daud rahe hain.|The children are running.
rukna|Zara rukiye.|Please wait a moment.
rehna|Aap kahan rehte hain?|Where do you live?
milna|Kal milte hain.|Let us meet tomorrow.
bulana|Bhai ko bulaiye.|Call your brother over.
phone karna|Main kal phone karunga.|I will call tomorrow.
bhejna|Message bhej dijiye.|Send a message.
rakhna|Yeh yahan rakhiye.|Put this here.
uthana|Bag utha lijiye.|Pick up the bag.
laana|Paani le aaiye.|Bring water.
le jaana|Yeh ghar le jaiye.|Take this home.
chhodna|Mujhe yahan chhod dijiye.|Drop me here.
pakadna|Mera bag pakdiye.|Hold my bag.
kholna|Darwaza kholiye.|Open the door.
band karna|Batti band kar dijiye.|Turn off the light.
banana|Main chai bana raha hoon.|I am making tea.
pakana|Main khaana paka raha hoon.|I am cooking food.
dhona|Haath dhoyiye.|Wash your hands.
nahana|Main subah nahata hoon.|I bathe in the morning.
saaf karna|Mez saaf kijiye.|Clean the table.
pehenna|Joote pehen lijiye.|Put on your shoes.
utarna|Yahan utariye.|Get off here.
utaarna|Joote utaar dijiye.|Take off your shoes.
khareedna|Maine sabzi khareedi.|I bought vegetables.
bechna|Vo phal bechte hain.|They sell fruit.
maangna|Unse madad maangiye.|Ask them for help.
chahna|Main Urdu bolna chahta hoon.|I want to speak Urdu.
pasand karna|Main yeh rang pasand karta hoon.|I like this color.
sochna|Main soch raha hoon.|I am thinking.
yaad rakhna|Yeh baat yaad rakhiye.|Remember this point.
bhoolna|Main naam bhool gaya.|I forgot the name.
hansna|Bachche hans rahe hain.|The children are laughing.
rona|Bachcha ro raha hai.|The child is crying.
khelna|Hum cricket khelte hain.|We play cricket.
kaam karna|Main ghar se kaam karta hoon.|I work from home.
madad karna|Meri madad kijiye.|Help me.
intezaar karna|Mera intezaar kijiye.|Wait for me.
koshish karna|Phir koshish kijiye.|Try again.
shuru karna|Ab shuru kijiye.|Start now.
khatam karna|Main kaam khatam karunga.|I will finish the work.
badalna|Waqt badal gaya.|The time has changed.
samjhana|Dobara samjhaiye.|Explain again.
dohrana|Yeh jumla dohraiye.|Repeat this sentence.
chunna|Ek rang chuniye.|Choose a color.
ginna|Paise gin lijiye.|Count the money.
tolna|Sabzi tol dijiye.|Weigh the vegetables.
kaatna|Pyaaz kaatiye.|Cut the onion.
daalna|Thoda namak daaliye.|Add a little salt.
nikalna|Main ab nikal raha hoon.|I am leaving now.
nikaalna|Kitaab nikaaliye.|Take out the book.
bharna|Glass bhar dijiye.|Fill the glass.
girana|Paani mat giraiye.|Do not spill the water.
girna|Glass gir gaya.|The glass fell.
tootna|Glass toot gaya.|The glass broke.
todna|Isko mat todiye.|Do not break this.
judna|Do hisse jud gaye.|The two parts joined.
jodna|Dono hisse jodiye.|Join both parts.
chalana|Pankha chala dijiye.|Turn on the fan.
pahunchna|Main ghar pahunch gaya.|I reached home.
lautna|Main kal lautunga.|I will return tomorrow.
baantna|Khaana baant dijiye.|Share out the food.
bachna|Thoda khaana bacha hai.|Some food is left.
bachana|Thoda waqt bachaiye.|Save a little time.
dhakna|Khaana dhak dijiye.|Cover the food.
talna|Pyaaz tal lijiye.|Fry the onion.
ubaalna|Paani ubaal lijiye.|Boil the water.
garam karna|Khaana garam kijiye.|Warm the food.
thanda karna|Chai thandi kar lijiye.|Let the tea cool.
chakhna|Yeh chakh kar dekhiye.|Taste this.
chabana|Dheere chabaiye.|Chew slowly.
nigalna|Aaraam se nigaliye.|Swallow carefully.
chhoona|Garam bartan mat chhuiye.|Do not touch the hot pot.
dhoondhna|Main chaabi dhoondh raha hoon.|I am looking for the key.`;
for(const line of contextual.split('\n')){const [roman,example,translation]=line.split('|');const row=rows.find(r=>r.roman===roman);if(!row)throw new Error(roman);Object.assign(row,{example,translation});}
const counts=Object.groupBy(rows,r=>r.topic);console.log(Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v.length])));
if(rows.length!==500)throw new Error(`Expected500 got${rows.length}`);
const duplicates=rows.filter((r,i)=>rows.findIndex(x=>x.roman.toLowerCase()===r.roman.toLowerCase())!==i);if(duplicates.length)throw new Error(JSON.stringify(duplicates));
const header=['id','roman','english','pos','gender','topic','chapter','example','translation','register'];
writeFileSync(new URL('./vocab-001-500.tsv',import.meta.url),header.join('\t')+'\n'+rows.map((r,i)=>[i+1,...header.slice(1).map(k=>r[k])].join('\t')).join('\n')+'\n');
