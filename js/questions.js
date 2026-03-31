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
    keyword: "can you",
    answers: [
      "can you get pregnant from a swimming pool",
      "can you freeze cheese",
      "can you overdose on melatonin",
      "can you boil water in a microwave",
      "can you get covid twice"
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
    keyword: "how long does",
    answers: [
      "how long does covid last",
      "how long does a cold last",
      "how long does it take to get a passport",
      "how long does it take to boil an egg",
      "how long does food poisoning last"
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
    keyword: "how do you",
    answers: [
      "how do you spell beautiful",
      "how do you get mono",
      "how do you know if you have appendicitis",
      "how do you whittle a knife",
      "how do you get pink eye"
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
    keyword: "how to be",
    answers: [
      "how to be happy",
      "how to be more confident",
      "how to be a good friend",
      "how to be a morning person",
      "how to be productive"
    ]
  }
];

function getGameQuestions(count = 5) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
