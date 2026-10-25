// Level and story data. Loaded after problems.js, whose generators these levels use.

// Story templates, used in order. `{a}` / `{b}` insert a number. `{a:one|many}` inserts the number
// followed by `one` when it is 1 and `many` otherwise, so verbs that agree go inside it too
// ("{a:dragon is|dragons are}"). Only the two numbers can be 1; the question is always plural.
const WINGS_OF_FIRE_STORIES = Object.freeze([
  "Clay ate {a:cow|cows} for breakfast. Then he ate {b:cow|cows} for lunch. How many cows did Clay eat?",
  "Starflight read {a:scroll|scrolls} on Monday. He read {b:more scroll|more scrolls} on Tuesday. How many scrolls did he read?",
  "{a:SkyWing flies|SkyWings fly} over the mountains. {b:SeaWing swims|SeaWings swim} below. How many dragons is that in all?",
  "Glory turned {a:scale|scales} purple. Then she turned {b:more scale|more scales} gold. How many scales changed color?",
  "{a:dragonet is|dragonets are} in the Jade Mountain library. {b:dragonet comes|dragonets come} in. How many dragonets are in the library now?",
  "Tsunami found {a:shell|shells} on the beach. Sunny found {b:shell|shells}. How many shells did they find together?",
  "Peril accidentally burned {a:scroll|scrolls} on Monday and {b:scroll|scrolls} on Tuesday. How many scrolls did Peril burn?",
  "Kinkajou ate {a:mango|mangoes} and {b:banana|bananas}. How many pieces of fruit did she eat?",
  "Qibli has {a:gold coin|gold coins} in his pouch. He finds {b:more coin|more coins}. How many coins does Qibli have now?",
  "Sunny saw {a:shooting star|shooting stars} last night and {b:shooting star|shooting stars} tonight. How many shooting stars did she see?",
  "{a:RainWing is|RainWings are} napping in the sun. {b:more RainWing joins|more RainWings join} the nap. How many RainWings are napping now?",
  "Moon picked {a:flower|flowers} in the rainforest. Then she picked {b:more flower|more flowers}. How many flowers did Moon pick?",
  "Winter caught {a:fish|fish} in the icy sea. Then he caught {b:more fish|more fish}. How many fish did Winter catch?",
  "Turtle swam {a:lap|laps} around the lake in the morning and {b:lap|laps} in the afternoon. How many laps did Turtle swim?",
  "Clay rolled in the mud {a:time|times} before lunch and {b:time|times} after lunch. How many times did Clay roll in the mud?",
  "A MudWing has {a:ruby|rubies} and {b:emerald|emeralds} in a treasure pile. How many gems are in the pile?",
  "{a:IceWing is|IceWings are} sliding on the ice. {b:more IceWing starts|more IceWings start} sliding too. How many IceWings are sliding?",
  "Blue spun {a:silk thread|silk threads} in the morning. He spun {b:more thread|more threads} at night. How many threads did Blue spin?",
  "Cricket read {a:book|books} last week and {b:book|books} this week. How many books did Cricket read?",
  "Sundew planted {a:seed|seeds} in the morning and {b:seed|seeds} in the afternoon. How many seeds did Sundew plant?",
  "{a:SilkWing flutters|SilkWings flutter} above the treetops. {b:more SilkWing flies|more SilkWings fly} up. How many SilkWings are flying now?",
  "Swordtail did {a:flip|flips} in the air. Then he did {b:more flip|more flips}. How many flips did Swordtail do?",
  "Glory changed colors {a:time|times} before breakfast and {b:time|times} after breakfast. How many times did Glory change colors?",
  "Tsunami won {a:race|races} in the lagoon. Then she won {b:more race|more races}. How many races did Tsunami win?",
  "Starflight has {a:scroll|scrolls} on one shelf and {b:scroll|scrolls} on another shelf. How many scrolls does he have?",
  "Clay carried {a:rock|rocks} out of the cave. Then he carried {b:more rock|more rocks}. How many rocks did Clay carry?",
  "Sunny counted {a:cactus|cacti} in the desert. Then she counted {b:more cactus|more cacti}. How many cacti did she count?",
  "{a:SandWing is|SandWings are} at the oasis. {b:more SandWing lands|more SandWings land} there. How many SandWings are at the oasis now?",
  "Kinkajou turned {a:scale|scales} pink and {b:scale|scales} yellow. How many scales did she change?",
  "Qibli solved {a:puzzle|puzzles} before lunch and {b:puzzle|puzzles} after lunch. How many puzzles did Qibli solve?",
  "Peril melted {a:icicle|icicles} by accident. Then she melted {b:more icicle|more icicles}. How many icicles did Peril melt?",
  "Winter counted {a:snowflake|snowflakes} on his wing. Then {b:more snowflake|more snowflakes} landed. How many snowflakes are on his wing now?",
  "Moon visited {a:classroom|classrooms} on Monday and {b:classroom|classrooms} on Tuesday. How many classrooms did Moon visit?",
  "Turtle found {a:pearl|pearls} in the river and {b:pearl|pearls} in the lake. How many pearls did Turtle find?",
  "Tsunami taught {a:class|classes} on Monday and {b:class|classes} on Tuesday. How many classes did Tsunami teach?",
  "{a:HiveWing marches|HiveWings march} through the Hive. {b:more HiveWing marches|more HiveWings march} behind. How many HiveWings are marching?",
  "{a:LeafWing hides|LeafWings hide} in the trees. {b:more LeafWing hides|more LeafWings hide} in the bushes. How many LeafWings are hiding?",
  "Sundew grew {a:vine|vines} on Monday. She grew {b:more vine|more vines} on Tuesday. How many vines did Sundew grow?",
  "Blue counted {a:butterfly|butterflies} in the garden. Then {b:more butterfly|more butterflies} flew in. How many butterflies are in the garden now?",
  "Cricket asked {a:question|questions} in class. Then she asked {b:more question|more questions}. How many questions did Cricket ask?",
  "Clay ate {a:sheep|sheep} and {b:goat|goats}. How many animals did Clay eat?",
  "Glory's sloth ate {a:leaf|leaves}. Then it ate {b:more leaf|more leaves}. How many leaves did the sloth eat?",
  "Starflight wrote {a:page|pages} of notes in the morning and {b:page|pages} in the evening. How many pages did he write?",
  "Sunny made {a:sandcastle|sandcastles} in the desert. Tsunami made {b:sandcastle|sandcastles} on the beach. How many sandcastles did they make?",
  "{a:SeaWing glows|SeaWings glow} in the dark water. {b:more SeaWing glows|more SeaWings glow} nearby. How many SeaWings are glowing?",
  "{a:NightWing is|NightWings are} watching the moons. {b:more NightWing comes|more NightWings come} to watch. How many NightWings are watching now?",
  "Kinkajou told {a:joke|jokes} at breakfast and {b:joke|jokes} at dinner. How many jokes did Kinkajou tell?",
  "Qibli found {a:scorpion|scorpions} under a rock. Then he found {b:more scorpion|more scorpions}. How many scorpions did Qibli find?",
  "Winter flew {a:mile|miles} north. Then he flew {b:more mile|more miles}. How many miles did Winter fly?",
  "Moon read {a:scroll|scrolls} in the library and {b:scroll|scrolls} in her cave. How many scrolls did Moon read?",
  "Turtle drew {a:picture|pictures} of the ocean. Then he drew {b:more picture|more pictures}. How many pictures did Turtle draw?",
  "Peril roasted {a:fish|fish} for breakfast and {b:fish|fish} for lunch. How many fish did Peril roast?",
  "The Jade Winglet has {a:dragonet|dragonets} in class. The Gold Winglet has {b:dragonet|dragonets}. How many dragonets is that in all?",
  "Clay hugged {a:friend|friends} at breakfast. Then he hugged {b:more friend|more friends}. How many friends did Clay hug?",
  "Tsunami splashed {a:dragon|dragons} in the lake. Then she splashed {b:more dragon|more dragons}. How many dragons did Tsunami splash?",
  "Glory picked {a:mango|mangoes} from one tree and {b:mango|mangoes} from another tree. How many mangoes did Glory pick?",
  "Starflight learned {a:new word|new words} on Monday and {b:new word|new words} on Tuesday. How many new words did he learn?",
  "Sunny found {a:smooth stone|smooth stones} in the sand. Then she found {b:more stone|more stones}. How many stones did Sunny find?",
  "{a:MudWing is|MudWings are} sleeping in the swamp. {b:more MudWing lies|more MudWings lie} down too. How many MudWings are sleeping now?",
  "{a:SkyWing is|SkyWings are} perched on a cliff. {b:more SkyWing lands|more SkyWings land} there. How many SkyWings are on the cliff?",
  "Kinkajou hung upside down for {a:minute|minutes}. Then she hung for {b:more minute|more minutes}. How many minutes did Kinkajou hang upside down?",
  "Qibli carried {a:water skin|water skins} across the desert. Then he carried {b:more water skin|more water skins}. How many water skins did he carry?",
  "Winter built {a:ice tower|ice towers} on Monday and {b:ice tower|ice towers} on Tuesday. How many ice towers did Winter build?",
  "Moon found {a:glowing mushroom|glowing mushrooms} in the rainforest. Then she found {b:more mushroom|more mushrooms}. How many mushrooms did Moon find?",
  "Turtle carried {a:shell|shells} up from the lake. Then he carried {b:more shell|more shells}. How many shells did Turtle carry?",
  "Blue made {a:silk bag|silk bags} for his friends. Then he made {b:more bag|more bags}. How many bags did Blue make?",
  "Cricket found {a:book|books} on one shelf and {b:book|books} on another shelf. How many books did Cricket find?",
  "Swordtail packed {a:snack|snacks} for the trip. Then he packed {b:more snack|more snacks}. How many snacks did Swordtail pack?",
  "Sundew counted {a:flower|flowers} in the garden. Then {b:more flower|more flowers} bloomed. How many flowers are in the garden now?",
  "{a:SilkWing is|SilkWings are} weaving silk. {b:more SilkWing starts|more SilkWings start} weaving. How many SilkWings are weaving now?",
  "{a:LeafWing waters|LeafWings water} the plants. {b:more LeafWing helps|more LeafWings help}. How many LeafWings are watering the plants?",
  "A scavenger has {a:gold coin|gold coins}. Another scavenger has {b:gold coin|gold coins}. How many gold coins do the scavengers have?",
  "A dragon's treasure pile has {a:crown|crowns} and {b:necklace|necklaces}. How many pieces of treasure is that?",
  "Clay helped {a:dragonet|dragonets} with homework. Then he helped {b:more dragonet|more dragonets}. How many dragonets did Clay help?",
  "Tsunami dove into the lagoon {a:time|times} in the morning and {b:time|times} at night. How many times did she dive?",
  "Glory slept in the sun for {a:hour|hours} on Monday and {b:hour|hours} on Tuesday. How many hours did Glory sleep in the sun?",
  "Starflight found {a:map|maps} in the library. Then he found {b:more map|more maps}. How many maps did Starflight find?",
  "Sunny sang {a:song|songs} in the morning and {b:song|songs} at night. How many songs did Sunny sing?",
  "{a:dragonet is|dragonets are} in the art cave. {b:dragonet is|dragonets are} in the music cave. How many dragonets is that in all?",
  "Kinkajou ate {a:banana|bananas} at breakfast. Then she ate {b:more banana|more bananas}. How many bananas did she eat?",
  "Qibli tossed {a:pebble|pebbles} into the oasis. Then he tossed {b:more pebble|more pebbles}. How many pebbles did Qibli toss?",
  "Winter collected {a:icicle|icicles} from the cave. Then he collected {b:more icicle|more icicles}. How many icicles did Winter collect?",
  "Moon wrote {a:letter|letters} to her friends. Then she wrote {b:more letter|more letters}. How many letters did Moon write?",
  "Turtle took {a:nap|naps} on Saturday and {b:nap|naps} on Sunday. How many naps did Turtle take?",
  "Peril lit {a:torch|torches} in the tunnel. Then she lit {b:more torch|more torches}. How many torches did Peril light?",
  "Blue saw {a:firefly|fireflies} at night. Then he saw {b:more firefly|more fireflies}. How many fireflies did Blue see?",
  "Cricket counted {a:bee|bees} near the Hive. Then she counted {b:more bee|more bees}. How many bees did Cricket count?",
  "Sundew picked {a:berry|berries} in the morning and {b:berry|berries} in the afternoon. How many berries did Sundew pick?",
  "Swordtail flew around the tree {a:time|times}. Then he flew around it {b:more time|more times}. How many times did Swordtail fly around the tree?",
  "{a:SandWing is|SandWings are} hiding in the dunes. {b:more SandWing hides|more SandWings hide} there too. How many SandWings are hiding?",
  "{a:IceWing is|IceWings are} at the ice palace. {b:more IceWing arrives|more IceWings arrive}. How many IceWings are at the palace now?",
  "A NightWing found {a:gem|gems} in a cave. Then she found {b:more gem|more gems}. How many gems did the NightWing find?",
  "{a:dragon is|dragons are} at the Jade Mountain feast. {b:more dragon comes|more dragons come}. How many dragons are at the feast now?",
  "Clay stacked {a:log|logs} for the fire. Then he stacked {b:more log|more logs}. How many logs did Clay stack?",
  "Tsunami caught {a:crab|crabs} at the beach. Then she caught {b:more crab|more crabs}. How many crabs did Tsunami catch?",
  "Glory found {a:orchid|orchids} in the rainforest. Kinkajou found {b:orchid|orchids}. How many orchids did they find?",
  "Starflight counted {a:star|stars} in the sky. Sunny counted {b:star|stars}. How many stars did they count?",
  "Sunny gave {a:hug|hugs} to Clay and {b:hug|hugs} to Glory. How many hugs did Sunny give?",
  "Peril warmed {a:cold rock|cold rocks} with her scales. Then she warmed {b:more rock|more rocks}. How many rocks did Peril warm?",
  "Qibli told {a:story|stories} around the campfire. Winter told {b:story|stories}. How many stories did they tell?",
]);

const ZELDA_SUBTRACTION_STORIES = Object.freeze([
  "Link had {a:arrow|arrows}. He shot {b:arrow|arrows} at a Bokoblin camp. How many arrows does he have left?",
  "Link found {a:Korok seed|Korok seeds}. He gave {b:seed|seeds} to Hestu. How many Korok seeds does Link have now?",
  "Link had {a:rupee|rupees} in his wallet. He spent {b:rupee|rupees} on a new shield. How many rupees does he have left?",
  "{a:Bokoblin is|Bokoblins are} guarding a camp. Link defeats {b:Bokoblin|Bokoblins}. How many Bokoblins are left?",
  "There are {a:lightroot|lightroots} to find in the Depths. Link has lit {b:lightroot|lightroots}. How many lightroots are still dark?",
  "Link had {a:Zonai charge|Zonai charges} in his battery. He used {b:charge|charges} to power a fan. How many charges are left?",
  "Link picked {a:Hylian shroom|Hylian shrooms}. He cooked {b:shroom|shrooms} into a hearty stew. How many shrooms are left?",
  "Link packed {a:apple|apples} in his basket. A hungry Lynel ate {b:apple|apples}. How many apples are left?",
  "Link carried {a:bomb flower|bomb flowers} into a cave. He threw {b:flower|flowers} at a rock wall. How many bomb flowers does he have left?",
  "{a:Korok is|Koroks are} hiding in the forest. Link finds {b:Korok|Koroks}. How many Koroks are still hiding?",
  "Link caught {a:fish|fish} in the river. He cooked {b:fish|fish} for dinner. How many fish are left?",
  "Purah had {a:photo|photos} in her lab. She gave {b:photo|photos} to Link. How many photos does Purah have left?",
  "{a:Hinox is|Hinoxes are} napping on a hill. {b:Hinox wakes|Hinoxes wake} up and wanders off. How many Hinoxes are still napping?",
  "Link had {a:Brightbloom seed|Brightbloom seeds} for the dark Depths. He used {b:seed|seeds} to light the way. How many seeds are left?",
  "{a:Rito is|Rito are} soaring over Rito Village. {b:Rito lands|Rito land} on a roof. How many Rito are still flying?",
  "Link had {a:hearty radish|hearty radishes} in his bag. He ate {b:radish|radishes}. How many hearty radishes are left?",
  "Sidon had {a:Zora scale|Zora scales}. He gave {b:scale|scales} to Link. How many scales does Sidon have left?",
  "{a:Gerudo warrior is|Gerudo warriors are} training in the desert. {b:warrior goes|warriors go} home for dinner. How many warriors are still training?",
  "Link found {a:treasure chest|treasure chests} in the Depths. He opened {b:chest|chests}. How many chests are still closed?",
  "Link tied {a:balloon|balloons} to a wooden crate. {b:balloon pops|balloons pop}. How many balloons are left on the crate?",
  "Link carried {a:log|logs} for a campfire. He burned {b:log|logs}. How many logs are left?",
  "Tulin collected {a:feather|feathers}. The wind blew away {b:feather|feathers}. How many feathers are left?",
  "Link found {a:Zonai capsule|Zonai capsules}. He opened {b:capsule|capsules}. How many capsules are still closed?",
  "Link had {a:Hasty Elixir|Hasty Elixirs}. He drank {b:elixir|elixirs} after a battle. How many elixirs are left?",
  "{a:Moblin is|Moblins are} at a camp on a floating island. Link knocks {b:Moblin|Moblins} off the edge. How many Moblins are left?",
  "Link saw {a:shrine|shrines} on his map. He finished {b:shrine|shrines}. How many shrines are left to finish?",
  "Link grilled {a:meat skewer|meat skewers}. He shared {b:skewer|skewers} with Riju. How many skewers does Link have left?",
  "Link picked {a:Silent Princess|Silent Princesses}. He gave {b:flower|flowers} to Zelda. How many Silent Princesses does Link have left?",
  "Link mined {a:ruby|rubies} from a Talus. He sold {b:ruby|rubies} at the shop. How many rubies are left?",
  "Link had {a:Zonai wheel|Zonai wheels}. He used {b:wheel|wheels} to build a cart. How many wheels are left?",
  "Link had {a:egg|eggs} in his pouch. He dropped {b:egg|eggs} when he fell off a cliff. How many eggs are left?",
  "{a:Lynel is|Lynels are} roaming the plains. Link defeats {b:Lynel|Lynels}. How many Lynels are left?",
  "Link collected {a:dragon scale|dragon scales} from Naydra. He used {b:scale|scales} to upgrade his armor. How many scales are left?",
  "{a:bird sits|birds sit} on the Great Sky Island. {b:bird flies|birds fly} away. How many birds are still sitting there?",
  "Link is {a:mile|miles} from Hyrule Castle. He rides {b:mile|miles} on his horse. How many miles are left to go?",
  "Link earned {a:rupee|rupees} selling gems. He paid {b:rupee|rupees} to stay at an inn. How many rupees are left?",
  "Link dug up {a:gem|gems} in the Depths. He gave {b:gem|gems} to a Goron. How many gems does Link have left?",
  "Yunobo had {a:rock roast|rock roasts}. He ate {b:roast|roasts}. How many rock roasts are left?",
  "Link stacked {a:stone block|stone blocks} to build a bridge. {b:block falls|blocks fall} into a chasm. How many blocks are still in the bridge?",
  "Link had {a:jar of honey|jars of honey}. He used {b:jar|jars} to bake sweets. How many jars of honey are left?",
]);

// Equal groups: `{a}` groups of `{b}`, in either order, so each story reads right both ways round.
const MULTIPLICATION_STORIES = Object.freeze([
  "{a:dragonet has|dragonets each have} {b:scroll|scrolls} in a backpack. How many scrolls is that in all?",
  "Link cooked {a:meal|meals}. Each meal used {b:Hylian shroom|Hylian shrooms}. How many shrooms did he use?",
  "Glory has {a:pile|piles} of treasure. Each pile has {b:gem|gems}. How many gems does Glory have?",
  "Link opened {a:treasure chest|treasure chests} in the Depths. Each chest had {b:rupee|rupees}. How many rupees did he find?",
  "Sunny planted {a:row|rows} of flowers. Each row has {b:flower|flowers}. How many flowers did she plant?",
  "{a:Korok has|Koroks each have} {b:Korok seed|Korok seeds}. How many Korok seeds is that in all?",
  "Clay ate {b:cow|cows} every day for {a:day|days}. How many cows did he eat?",
  "Link carried {a:bundle|bundles} of arrows. Each bundle had {b:arrow|arrows}. How many arrows did he carry?",
  "{a:SeaWing carries|SeaWings each carry} {b:pearl|pearls}. How many pearls is that in all?",
  "Link built {a:Zonai cart|Zonai carts}. Each cart has {b:wheel|wheels}. How many wheels did he use?",
  "Starflight put {b:scroll|scrolls} on each of {a:shelf|shelves}. How many scrolls are on the shelves?",
  "Link planted {a:row|rows} of Silent Princesses. Each row has {b:flower|flowers}. How many flowers did he plant?",
  "Kinkajou has {a:vine|vines} with {b:ripe mango|ripe mangoes} on each one. How many mangoes is that?",
  "Link picked {b:apple|apples} from each of {a:tree|trees}. How many apples did he pick?",
  "Tsunami caught {b:fish|fish} in each of {a:net|nets}. How many fish did she catch?",
  "Each Bokoblin has {b:arrow|arrows}. There are {a:Bokoblin|Bokoblins} in the camp. How many arrows is that in all?",
  "Each IceWing guard has {b:icicle spear|icicle spears}. There are {a:guard|guards}. How many spears is that?",
  "Link attached {b:Zonai fan|Zonai fans} to each of {a:raft|rafts}. How many fans did he use?",
  "Peril lit {a:torch|torches}. Each torch burned for {b:hour|hours}. How many hours did the torches burn in all?",
  "Purah has {a:shelf|shelves} of photos. Each shelf has {b:photo|photos}. How many photos does she have?",
  "{a:RainWing naps|RainWings each nap} for {b:hour|hours}. How many nap hours is that in all?",
  "Link cooked {b:egg|eggs} for each of {a:hungry Goron|hungry Gorons}. How many eggs did he cook?",
  "Moon read {b:scroll|scrolls} on each of {a:day|days}. How many scrolls did she read?",
  "Sidon gave {b:Zora scale|Zora scales} to each of {a:soldier|soldiers}. How many scales did he give out?",
  "Blue spun {b:silk thread|silk threads} for each of {a:friend|friends}. How many threads did he spin?",
  "Link walked {b:mile|miles} each day for {a:day|days}. How many miles did he walk?",
  "Qibli has {a:water skin|water skins}. Each water skin holds {b:cup|cups} of water. How many cups is that in all?",
  "Tulin did {b:loop|loops} in the air on each of {a:flight|flights}. How many loops did he do in all?",
  "Winter built {a:ice tower|ice towers}. Each tower has {b:window|windows}. How many windows is that?",
  "Link tied {b:balloon|balloons} to each of {a:crate|crates}. How many balloons did he tie?",
  "Cricket has {a:jar|jars} of honey. Each jar has {b:spoonful|spoonfuls}. How many spoonfuls is that in all?",
  "Each Lynel dropped {b:horn|horns}. Link defeated {a:Lynel|Lynels}. How many horns did he collect?",
  "Swordtail did {b:flip|flips} in each of {a:show|shows}. How many flips did he do?",
  "Link fed {b:carrot|carrots} to each of {a:horse|horses}. How many carrots did he use?",
  "Turtle found {b:shell|shells} on each of {a:beach|beaches}. How many shells did he find?",
  "Riju hung {b:lantern|lanterns} on each of {a:tent|tents}. How many lanterns did she hang?",
  "Sundew has {a:flower pot|flower pots}. Each pot has {b:seed|seeds}. How many seeds did she plant?",
  "Yunobo ate {b:rock roast|rock roasts} at each of {a:meal|meals}. How many rock roasts did he eat?",
  "{a:SkyWing flew|SkyWings each flew} {b:mile|miles} in the race. How many miles did they fly in all?",
  "Link stacked {a:stack|stacks} of stone blocks. Each stack has {b:block|blocks}. How many blocks is that?",
]);

// `{a}` is the total and `{b}` is how many ways it is split, so the answer is always a ÷ b. Some
// stories share equally and some pack into groups; the math is the same.
const DIVISION_STORIES = Object.freeze([
  "Starflight shared {a:scroll|scrolls} equally among {b:dragonet|dragonets}. How many scrolls did each dragonet get?",
  "Link split {a:arrow|arrows} into {b:equal bundle|equal bundles}. How many arrows are in each bundle?",
  "Glory has {a:mango|mangoes}. She puts {b:mango|mangoes} in each basket. How many baskets does she fill?",
  "Link has {a:Korok seed|Korok seeds}. He packs {b:seed|seeds} in each pouch. How many pouches does he fill?",
  "Tsunami caught {a:fish|fish} and put them into {b:equal basket|equal baskets}. How many fish are in each basket?",
  "Link has {a:rupee|rupees} to share equally among {b:Goron|Gorons}. How many rupees does each Goron get?",
  "Clay has {a:cow|cows} to share equally among {b:hungry dragon|hungry dragons}. How many cows does each dragon get?",
  "Link has {a:Hylian shroom|Hylian shrooms}. He uses {b:shroom|shrooms} in each stew. How many stews can he cook?",
  "Sunny has {a:flower|flowers}. She puts {b:flower|flowers} in each vase. How many vases does she fill?",
  "Purah has {a:photo|photos}. She puts {b:photo|photos} on each page. How many pages does she fill?",
  "Moon has {a:scroll|scrolls}. She puts {b:scroll|scrolls} on each shelf. How many shelves does she fill?",
  "Link has {a:Zonai charge|Zonai charges} to share equally among {b:machine|machines}. How many charges does each machine get?",
  "Peril has {a:torch|torches} to put into {b:tunnel|tunnels}, the same number in each. How many torches go in each tunnel?",
  "Link has {a:Zonai wheel|Zonai wheels}. Each cart needs {b:wheel|wheels}. How many carts can he build?",
  "Blue has {a:silk thread|silk threads}. He uses {b:thread|threads} for each bag. How many bags can he make?",
  "Link has {a:apple|apples} to feed {b:horse|horses}, the same number to each. How many apples does each horse get?",
  "Kinkajou has {a:banana|bananas} to share equally among {b:friend|friends}. How many bananas does each friend get?",
  "Sidon has {a:Zora scale|Zora scales}. He gives {b:scale|scales} to each soldier. How many soldiers get scales?",
  "Winter built an ice wall with {a:block|blocks}. Each row has {b:block|blocks}. How many rows are there?",
  "Link has {a:log|logs} for {b:campfire|campfires}, the same number for each. How many logs go on each fire?",
  "Qibli has {a:gold coin|gold coins}. He puts the same number in each of {b:pouch|pouches}. How many coins are in each pouch?",
  "Riju has {a:lantern|lanterns}. She hangs {b:lantern|lanterns} on each tent. How many tents get lanterns?",
  "Cricket has {a:jar|jars} of honey. She packs {b:jar|jars} in each box. How many boxes does she need?",
  "Link caught {a:fish|fish}. He cooks {b:fish|fish} in each meal. How many meals does he make?",
  "Swordtail has {a:snack|snacks} to share equally among {b:dragonet|dragonets}. How many snacks does each one get?",
  "Tulin has {a:feather|feathers} to share equally among {b:Rito|Rito}. How many feathers does each Rito get?",
  "Turtle has {a:shell|shells}. He puts {b:shell|shells} in each pile. How many piles does he make?",
  "Link has {a:bomb flower|bomb flowers}. He packs {b:flower|flowers} in each bag. How many bags does he fill?",
  "Sundew has {a:seed|seeds}. She plants the same number in each of {b:pot|pots}. How many seeds go in each pot?",
  "Yunobo has {a:rock roast|rock roasts} to share equally among {b:Goron|Gorons}. How many rock roasts does each Goron get?",
  "{a:dragonet is|dragonets are} lined up in rows of {b:dragonet|dragonets}. How many rows are there?",
  "Link has {a:ruby|rubies} from a Talus. He puts {b:ruby|rubies} in each pouch. How many pouches does he fill?",
  "Starflight has {a:page|pages} of notes to read in {b:day|days}, the same number each day. How many pages does he read each day?",
  "Link has {a:Brightbloom seed|Brightbloom seeds} for {b:cave|caves}, the same number for each. How many seeds go to each cave?",
  "Glory has {a:orchid|orchids}. She puts {b:orchid|orchids} in each bunch. How many bunches does she make?",
  "Link has {a:balloon|balloons}. He ties {b:balloon|balloons} to each crate. How many crates does he lift?",
  "Clay has {a:rock|rocks} to carry in {b:trip|trips}, the same number each trip. How many rocks does he carry each trip?",
  "Link has {a:egg|eggs} to cook for {b:hungry traveler|hungry travelers}, the same number each. How many eggs does each traveler get?",
  "Tsunami has {a:pearl|pearls}. She puts {b:pearl|pearls} in each necklace. How many necklaces does she make?",
  "Link has {a:stone block|stone blocks}. He stacks {b:block|blocks} in each tower. How many towers can he build?",
]);

function makeEasySubtraction() {
  const a = randInt(2, 10);
  return [a, randInt(1, a - 1)];
}

// b is bigger than a's ones digit, so the subtraction always dips back under 10.
function makeCrossTenSubtraction() {
  return pairWhere(() => [randInt(11, 18), randInt(2, 9)], (a, b) => b > a % 10);
}

const EASY_TABLES = Object.freeze([2, 5, 10]);
const MEDIUM_TABLES = Object.freeze([3, 4]);
const HARD_TABLES = Object.freeze([6, 7, 8, 9]);

function makeMultiplication(tables) {
  return inRandomOrder([pick(tables), randInt(1, 10)]);
}

// One factor from a hard table, the other from 2 to 10, so new facts mix with review ones.
function makeHardMultiplication() {
  return inRandomOrder([pick(HARD_TABLES), randInt(2, 10)]);
}

// Built from the multiplication fact, so the answer is always a whole number from 2 to 10.
function makeDivision(divisors) {
  const divisor = pick(divisors);
  return [divisor * randInt(2, 10), divisor];
}

function eitherOf(makeFirst, makeSecond) {
  return () => (Math.random() < 0.5 ? makeFirst() : makeSecond());
}

const makeEasyMultiplication = () => makeMultiplication(EASY_TABLES);
const makeMediumMultiplication = () => makeMultiplication(MEDIUM_TABLES);
const makeEasyDivision = () => makeDivision(EASY_TABLES);
const makeMediumDivision = () => makeDivision(MEDIUM_TABLES);

// `alias` is the level's permanent saved-data key and is never shown. Changing one orphans
// that level's saved stars and round history, so rename `name` freely but leave `alias` alone.
const ADDITION_LEVELS = [
  {
    alias: 'add-1digit-1digit-sum-to-10',
    name: 'Easy', example: '7 + 2', color: '#22b573',
    make: () => pairWhere(() => [randInt(1, 9), randInt(1, 9)], (a, b) => a + b <= 10),
  },
  {
    alias: 'add-double-1to10',
    name: 'Doubles', example: 'Double 6', color: '#14b8a6',
    promptFor: a => `Double ${a}`,
    make: () => { const n = randInt(1, 10); return [n, n]; },
  },
  {
    alias: 'bridge-to-ten-1to9',
    name: 'Bridge to Ten', example: '7 → 10', color: '#ec4899',
    promptFor: a => `Bridge to Ten: ${a}`,
    answerFor: (a, b) => b,
    make: () => { const given = randInt(1, 9); return [given, 10 - given]; },
  },
  {
    alias: 'add-1digit-1digit-sum-over-10',
    name: 'Medium', example: '8 + 5', color: '#3fa7f5',
    make: () => pairWhere(() => [randInt(2, 9), randInt(2, 9)], (a, b) => a + b > 10),
  },
  {
    alias: 'story-wings-of-fire-1digit-1digit',
    name: 'Wings of Fire', example: '🐉 stories', color: '#e8590c',
    stories: WINGS_OF_FIRE_STORIES,
    make: () => [randInt(2, 9), randInt(2, 9)],
  },
  {
    alias: 'add-teen-1digit-sum-to-20',
    name: 'Hard', example: '12 + 7', color: '#ffb627',
    make: () => pairWhere(() => [randInt(10, 19), randInt(1, 9)], (a, b) => a + b <= 20),
  },
  {
    alias: 'add-teen-1digit-sum-over-20',
    name: 'Extra Hard', example: '15 + 8', color: '#ff8a3d',
    make: () => pairWhere(() => [randInt(12, 19), randInt(2, 9)], (a, b) => a + b > 20),
  },
  {
    alias: 'add-teen-teen',
    name: 'Super Hard', example: '12 + 17', color: '#ef5a5a',
    make: () => [randInt(10, 19), randInt(10, 19)],
  },
  {
    alias: 'add-2digit-1digit-make-next-ten',
    name: 'Tens Easy', example: '23 + 7', color: '#a25ce8',
    make: () => {
      const a = twoDigitNotEndingInZero(11, 99);
      return [a, nextTen(a) - a];
    },
  },
  {
    alias: 'add-2digit-2digit-make-ten',
    name: 'Tens Medium', example: '61 + 29', color: '#6c4ee0',
    make: () => {
      // b's ones digit completes a's to 10, and the total stays at or under 100.
      const a = twoDigitNotEndingInZero(11, 89);
      const extraTens = randInt(1, (100 - nextTen(a)) / 10);
      return [a, nextTen(a) - a + extraTens * 10];
    },
  },
];

const SUBTRACTION_LEVELS = [
  {
    alias: 'sub-within-10',
    name: 'Easy', example: '7 − 2', color: '#38bdf8',
    make: makeEasySubtraction,
  },
  {
    alias: 'sub-teen-1digit-cross-ten',
    name: 'Medium', example: '13 − 6', color: '#6366f1',
    make: makeCrossTenSubtraction,
  },
  {
    alias: 'story-zelda-totk-subtraction',
    name: 'Word Problems', example: '🗡️ stories', color: '#0ea5a4',
    stories: ZELDA_SUBTRACTION_STORIES,
    make: eitherOf(makeEasySubtraction, makeCrossTenSubtraction),
  },
  {
    alias: 'sub-2digit-up-to-10',
    name: 'Hard', example: '52 − 7', color: '#d946ef',
    make: () => [randInt(21, 99), randInt(1, 10)],
  },
];

const MULTIPLICATION_LEVELS = [
  {
    alias: 'mul-tables-2-5-10',
    name: 'Easy', example: '5 × 4', color: '#84cc16',
    make: makeEasyMultiplication,
  },
  {
    alias: 'mul-tables-3-4',
    name: 'Medium', example: '3 × 7', color: '#eab308',
    make: makeMediumMultiplication,
  },
  {
    alias: 'story-wings-totk-multiplication',
    name: 'Word Problems', example: '🐉🗡️ stories', color: '#f97316',
    stories: MULTIPLICATION_STORIES,
    make: eitherOf(makeEasyMultiplication, makeMediumMultiplication),
  },
  {
    alias: 'mul-one-factor-6-to-9',
    name: 'Hard', example: '7 × 8', color: '#dc2626',
    make: makeHardMultiplication,
  },
];

const DIVISION_LEVELS = [
  {
    alias: 'div-by-2-5-10',
    name: 'Easy', example: '20 ÷ 5', color: '#2dd4bf',
    make: makeEasyDivision,
  },
  {
    alias: 'div-by-3-4',
    name: 'Medium', example: '12 ÷ 3', color: '#a78bfa',
    make: makeMediumDivision,
  },
  {
    alias: 'story-wings-totk-division',
    name: 'Word Problems', example: '🐉🗡️ stories', color: '#fb7185',
    stories: DIVISION_STORIES,
    make: eitherOf(makeEasyDivision, makeMediumDivision),
  },
  {
    alias: 'div-by-6-to-9',
    name: 'Hard', example: '56 ÷ 7', color: '#0f766e',
    make: () => makeDivision(HARD_TABLES),
  },
];

function withOperator(op, levels) {
  return levels.map(level => ({ ...level, op }));
}

const LEVELS = Object.freeze([
  ...withOperator('add', ADDITION_LEVELS),
  ...withOperator('subtract', SUBTRACTION_LEVELS),
  ...withOperator('multiply', MULTIPLICATION_LEVELS),
  ...withOperator('divide', DIVISION_LEVELS),
]);
