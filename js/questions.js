const QUESTIONS = [
  {
    keyword: "why is",
    answers: [
      "why is the sky blue",
      "why is my eye twitching",
      "why is the ocean salty",
      "why is my poop green",
      "why is pluto not a planet"
    ]
  },
  {
    keyword: "why do cats",
    answers: [
      "why do cats purr",
      "why do cats knead",
      "why do cats hate water",
      "why do cats meow",
      "why do cats eat grass"
    ]
  },
  {
    keyword: "why do dogs",
    answers: [
      "why do dogs eat grass",
      "why do dogs lick you",
      "why do dogs bark",
      "why do dogs howl",
      "why do dogs spin before lying down"
    ]
  },
  {
    keyword: "why do we",
    answers: [
      "why do we dream",
      "why do we yawn",
      "why do we have eyebrows",
      "why do we get goosebumps",
      "why do we laugh"
    ]
  },
  {
    keyword: "why do i",
    answers: [
      "why do i keep waking up at 3am",
      "why do i feel dizzy",
      "why do i sweat so much",
      "why do i have no friends",
      "why do i feel so tired"
    ]
  },
  {
    keyword: "why is my",
    answers: [
      "why is my poop black",
      "why is my hair falling out",
      "why is my eye twitching",
      "why is my stomach hurting",
      "why is my cat not eating"
    ]
  },
  {
    keyword: "can you",
    answers: [
      "can you not freeze meat",
      "can you freeze cheese",
      "can you overdose on melatonin",
      "can you boil water in a microwave",
      "can you roll a 6 die twice"
    ]
  },
  {
    keyword: "can dogs eat",
    answers: [
      "can dogs eat grapes",
      "can dogs eat watermelon",
      "can dogs eat bananas",
      "can dogs eat cheese",
      "can dogs eat apples"
    ]
  },
  {
    keyword: "can cats eat",
    answers: [
      "can cats eat cheese",
      "can cats eat eggs",
      "can cats eat bread",
      "can cats eat chocolate",
      "can cats eat tuna"
    ]
  },
  {
    keyword: "how to get rid of",
    answers: [
      "how to get rid of fruit flies",
      "how to get rid of ants",
      "how to get rid of acne",
      "how to get rid of hiccups",
      "how to get rid of a cold"
    ]
  },
  {
    keyword: "how to make",
    answers: [
      "how to make money",
      "how to make pancakes",
      "how to make slime",
      "how to make french toast",
      "how to make a resume"
    ]
  },
  {
    keyword: "how to lose",
    answers: [
      "how to lose weight",
      "how to lose belly fat",
      "how to lose weight fast",
      "how to lose face fat",
      "how to lose 10 pounds"
    ]
  },
  {
    keyword: "how to be",
    answers: [
      "how to be happy",
      "how to be more confident",
      "how to be a good friend",
      "how to be a morning person",
      "how to be productive"
    ]
  },
  {
    keyword: "how long does",
    answers: [
      "how long does a fever last",
      "how long does a cold last",
      "how long does it take to get a passport",
      "how long does it take to boil an egg",
      "how long does food poisoning last"
    ]
  },
  {
    keyword: "how do you",
    answers: [
      "how do you spell beautiful",
      "how do you get mono",
      "how do you know if you have a cold",
      "how do you whittle a knife",
      "how do you get pink eye"
    ]
  },
  {
    keyword: "what happens if you",
    answers: [
      "what happens if you swallow gum",
      "what happens if you don't sleep",
      "what happens if you eat mold",
      "what happens if you drink bleach",
      "what happens if you shave a cat"
    ]
  },
  {
    keyword: "what does",
    answers: [
      "what does it mean when your left hand itches",
      "what does dreaming about teeth falling out mean",
      "what does it feel like to be drunk",
      "what does the fox say",
      "what does sus mean"
    ]
  },
  {
    keyword: "what is the",
    answers: [
      "what is the meaning of life",
      "what is the tallest mountain in the world",
      "what is the biggest animal in the world",
      "what is the most popular sport in the world",
      "what is the fastest animal"
    ]
  },
  {
    keyword: "is it bad to",
    answers: [
      "is it bad to crack your knuckles",
      "is it bad to swallow watermelon seeds",
      "is it bad to sleep with wet hair",
      "is it bad to eat before bed",
      "is it bad to hold in a sneeze"
    ]
  },
  {
    keyword: "is it possible to",
    answers: [
      "is it possible to be allergic to water",
      "is it possible to sneeze with your eyes open",
      "is it possible to die of boredom",
      "is it possible to be double jointed",
      "is it possible to go to space"
    ]
  },
  {
    keyword: "why can't i",
    answers: [
      "why can't i sleep",
      "why can't i lose weight",
      "why can't i cry",
      "why can't i focus",
      "why can't i stop eating"
    ]
  },
  {
    keyword: "am i",
    answers: [
      "am i pregnant",
      "am i depressed",
      "am i in love",
      "am i lactose intolerant",
      "am i having a heart attack"
    ]
  },
  {
    keyword: "should i",
    answers: [
      "should i get a dog",
      "should i go to the doctor",
      "should i break up with my boyfriend",
      "should i go to college",
      "should i cut my hair"
    ]
  },
  {
    keyword: "what if i",
    answers: [
      "what if i swallowed a spider",
      "what if i never sleep again",
      "what if i drink expired milk",
      "what if i stop eating sugar",
      "what if i ate only meat"
    ]
  },
  {
    keyword: "is it normal to",
    answers: [
      "is it normal to talk to yourself",
      "is it normal to not like people",
      "is it normal to cry for no reason",
      "is it normal to dream every night",
      "is it normal to sleep 10 hours"
    ]
  },
  {
    keyword: "do i have",
    answers: [
      "do i have adhd",
      "do i have anxiety",
      "do i have depression",
      "do i have a cavity",
      "do i have sleep apnea"
    ]
  },
  {
    keyword: "what are the symptoms of",
    answers: [
      "what are the symptoms of a cold",
      "what are the symptoms of diabetes",
      "what are the symptoms of anxiety",
      "what are the symptoms of appendicitis",
      "what are the symptoms of a blood clot"
    ]
  },
  {
    keyword: "how much does",
    answers: [
      "how much does a dentist cost",
      "how much does it cost to build a house",
      "how much does a lawyer cost",
      "how much does liposuction cost",
      "how much does a wedding cost"
    ]
  },
  {
    keyword: "how many",
    answers: [
      "how many calories in an egg",
      "how many ounces in a cup",
      "how many weeks in a year",
      "how many countries in the world",
      "how many calories should i eat a day"
    ]
  },
  {
    keyword: "what to do when",
    answers: [
      "what to do when bored",
      "what to do when you can't sleep",
      "what to do when you're sad",
      "what to do when someone is having a seizure",
      "what to do when you get stung by a bee"
    ]
  },
  {
    keyword: "why am i",
    answers: [
      "why am i always tired",
      "why am i so hungry",
      "why am i not hungry",
      "why am i shaking",
      "why am i so cold"
    ]
  },
  {
    keyword: "does it hurt to",
    answers: [
      "does it hurt to get a tattoo",
      "does it hurt to get stitches",
      "does it hurt to get your ears pierced",
      "does it hurt to get wisdom teeth removed",
      "does it hurt to give birth"
    ]
  },
  {
    keyword: "what to eat when",
    answers: [
      "what to eat when sick",
      "what to eat when nauseous",
      "what to eat when constipated",
      "what to eat when you have diarrhea",
      "what to eat when pregnant"
    ]
  },
  {
    keyword: "how to tell if",
    answers: [
      "how to tell if someone likes you",
      "how to tell if eggs are bad",
      "how to tell if avocado is ripe",
      "how to tell if chicken is cooked",
      "how to tell if you have a concussion"
    ]
  },
  {
    keyword: "why does my",
    answers: [
      "why does my eye keep twitching",
      "why does my back hurt",
      "why does my stomach hurt",
      "why does my head hurt",
      "why does my nose keep bleeding"
    ]
  },
  {
    keyword: "what is the difference between",
    answers: [
      "what is the difference between affect and effect",
      "what is the difference between a cold and the flu",
      "what is the difference between alzheimer's and dementia",
      "what is the difference between weather and climate",
      "what is the difference between vegan and vegetarian"
    ]
  },
  {
    keyword: "who invented",
    answers: [
      "who invented the internet",
      "who invented the telephone",
      "who invented pizza",
      "who invented the light bulb",
      "who invented basketball"
    ]
  },
  {
    keyword: "where is",
    answers: [
      "where is my phone",
      "where is area 51",
      "where is the appendix located",
      "where is the love",
      "where is chuck norris"
    ]
  },
  {
    keyword: "when did",
    answers: [
      "when did world war 2 end",
      "when did dinosaurs go extinct",
      "when did the cold war end",
      "when did the titanic sink",
      "when did the berlin wall fall"
    ]
  },
  {
    keyword: "what causes",
    answers: [
      "what causes hiccups",
      "what causes acne",
      "what causes high blood pressure",
      "what causes kidney stones",
      "what causes dandruff"
    ]
  },
  {
    keyword: "i accidentally",
    answers: [
      "i accidentally swallowed gum",
      "i accidentally ate mold",
      "i accidentally swallowed a bug",
      "i accidentally drank bleach",
      "i accidentally ate a bug"
    ]
  },
  {
    keyword: "my dog ate",
    answers: [
      "my dog ate chocolate",
      "my dog ate a sock",
      "my dog ate a grape",
      "my dog ate a bee",
      "my dog ate cat poop"
    ]
  },
  {
    keyword: "what body parts can you",
    answers: [
      "what body parts can you live without",
      "what body parts can you donate",
      "what body parts can you break without feeling pain",
      "what body parts can you pierce",
      "what body parts can you crack"
    ]
  },
  {
    keyword: "do animals",
    answers: [
      "do animals dream",
      "do animals laugh",
      "do animals know they will die",
      "do animals feel pain",
      "do animals have feelings"
    ]
  },
  {
    keyword: "why are",
    answers: [
      "why are cats afraid of cucumbers",
      "why are flamingos pink",
      "why are sloths slow",
      "why are dogs better than cats",
      "why are humans so smart"
    ]
  },
  {
    keyword: "can you 3d print",
    answers: [
      "can you 3d print a gun",
      "can you 3d print a house",
      "can you 3d print metal",
      "can you 3d print food",
      "can you 3d print a car"
    ]
  },
  {
    keyword: "what would happen if",
    answers: [
      "what would happen if the sun exploded",
      "what would happen if there was no gravity",
      "what would happen if the moon disappeared",
      "what would happen if everyone jumped at once",
      "what would happen if you fell into a black hole"
    ]
  },
  {
    keyword: "how to survive",
    answers: [
      "how to survive a zombie apocalypse",
      "how to survive a bear attack",
      "how to survive a tornado",
      "how to survive a shark attack",
      "how to survive in the wild"
    ]
  },
  {
    keyword: "are humans",
    answers: [
      "are humans animals",
      "are humans the only animals that cry",
      "are humans made of stardust",
      "are humans the smartest animal",
      "are humans still evolving"
    ]
  },
  {
    keyword: "how to start",
    answers: [
      "how to start a business",
      "how to start a conversation",
      "how to start a fire",
      "how to start a diet",
      "how to start meditating"
    ]
  },
  {
    keyword: "what do",
    answers: [
      "what do dreams mean",
      "what do foxes eat",
      "what do owls eat",
      "what do snails eat",
      "what do ants eat"
    ]
  },
  {
    keyword: "is there a",
    answers: [
      "is there a cure for cancer",
      "is there a cure for herpes",
      "is there a santa claus",
      "is there a god",
      "is there life on mars"
    ]
  },
  {
    keyword: "how to stop",
    answers: [
      "how to stop hiccups",
      "how to stop snoring",
      "how to stop sweating",
      "how to stop biting your nails",
      "how to stop overthinking"
    ]
  },
  {
    keyword: "what is",
    answers: [
      "what is love",
      "what is gluten",
      "what is a meme",
      "what is bitcoin",
      "what is the illuminati"
    ]
  },
  {
    keyword: "can you die from",
    answers: [
      "can you die from a broken heart",
      "can you die from swallowing gum",
      "can you die from laughing",
      "can you die from boredom",
      "can you die from hiccups"
    ]
  },
  {
    keyword: "why is everyone",
    answers: [
      "why is everyone so mean",
      "why is everyone depressed",
      "why is everyone leaving twitter",
      "why is everyone getting married",
      "why is everyone rich except me"
    ]
  },
  {
    keyword: "how to know if",
    answers: [
      "how to know if someone is lying",
      "how to know if you're in love",
      "how to know if a mole is cancerous",
      "how to know if your appendix burst",
      "how to know if you have anxiety"
    ]
  },
  {
    keyword: "why don't",
    answers: [
      "why don't we have jet packs yet",
      "why don't people recycle",
      "why don't dogs live longer",
      "why don't humans have tails",
      "why don't planes fly over the pacific ocean"
    ]
  },
  {
    keyword: "what to do if",
    answers: [
      "what to do if you're being stalked",
      "what to do if you swallow a tooth",
      "what to do if bitten by a dog",
      "what to do if your car breaks down",
      "what to do if you find a baby bird"
    ]
  },
  {
    keyword: "how to deal with",
    answers: [
      "how to deal with anxiety",
      "how to deal with a narcissist",
      "how to deal with loneliness",
      "how to deal with rejection",
      "how to deal with stress"
    ]
  },
  {
    keyword: "is eating",
    answers: [
      "is eating boogers bad for you",
      "is eating before bed bad",
      "is eating too much fruit bad",
      "is eating standing up bad",
      "is eating ice bad for your teeth"
    ]
  },
  {
    keyword: "why do people",
    answers: [
      "why do people sleepwalk",
      "why do people snore",
      "why do people get tattoos",
      "why do people lie",
      "why do people cheat"
    ]
  }
];

function getGameQuestions(count = 5) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
