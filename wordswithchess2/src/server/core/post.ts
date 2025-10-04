import { context, reddit } from '@devvit/web/server';
import { redis } from '@devvit/redis';

var levels = [
  {
    "difficulty": "easy",
    "theme": "Purrfect Pets",
    "color": "orange",
    "words": ["cat", "dog", "rat", "bat", "cow", "pig", "hen", "ram", "bee", "eel", "fox", "cub", "owl", "ant", "yak", "bug", "kid", "colt", "pup", "hog"]
  },
  {
    "difficulty": "medium",
    "theme": "Garden Goodies",
    "color": "green",
    "words": ["rose", "lily", "fern", "moss", "tree", "bush", "leaf", "vine", "soil", "seed", "bark", "twig", "herb", "root", "stem", "crop", "lawn", "reed", "pond", "weed"]
  },
  {
    "difficulty": "hard",
    "theme": "Tiny Critters",
    "color": "yellow",
    "words": ["ant", "bee", "wasp", "moth", "gnat", "slug", "worm", "tick", "flea", "louse", "mite", "crab", "clam", "toad", "frog", "newt", "roach", "gnaw", "snail", "gnaw"]
  },
  {
    "difficulty": "easy",
    "theme": "Yummy Snacks",
    "color": "red",
    "words": ["pie", "ham", "jam", "nut", "bun", "fig", "pea", "cod", "eel", "gum", "ice", "tea", "egg", "yam", "bar", "cup", "pop", "dip", "sip", "sub"]
  },
  {
    "difficulty": "medium",
    "theme": "Cozy Kitchen",
    "color": "purple",
    "words": ["oven", "fork", "spat", "bowl", "sink", "dish", "salt", "meat", "rice", "bean", "stew", "cook", "boil", "milk", "tofu", "eggs", "whip", "roll", "pans", "stir"]
  },
  {
    "difficulty": "hard",
    "theme": "Wild Woods",
    "color": "green",
    "words": ["pine", "oak", "elm", "ash", "yew", "fir", "leaf", "bark", "twig", "fern", "moss", "reed", "pond", "rock", "root", "vine", "crop", "seed", "hill", "wood"]
  },
  {
    "difficulty": "easy",
    "theme": "Playtime Toys",
    "color": "yellow",
    "words": ["car", "doll", "ball", "kite", "drum", "bike", "lego", "cube", "bear", "dice", "rope", "sled", "game", "disc", "yo-yo", "jump", "card", "mask", "ring", "tops"]
  },
  {
    "difficulty": "medium",
    "theme": "Ocean Breeze",
    "color": "blue",
    "words": ["sand", "reef", "fish", "ship", "sail", "wave", "oars", "clam", "crab", "dock", "cove", "tide", "seal", "kelp", "surf", "pear", "rock", "gull", "foam", "whale"]
  },
  {
    "difficulty": "hard",
    "theme": "Night Sky",
    "color": "grey",
    "words": ["star", "moon", "mars", "nova", "ursa", "sol", "sky", "comet", "mete", "axis", "orbs", "ring", "dark", "east", "west", "dawn", "dust", "void", "juno", "mars"]
  },
  {
    "difficulty": "easy",
    "theme": "Sweet Treats",
    "color": "pink",
    "words": ["gum", "pie", "bar", "pop", "cake", "mint", "chip", "cone", "fizz", "soda", "tart", "roll", "milk", "nut", "fig", "bun", "jam", "dip", "sip", "ice"]
  },
  {
    "difficulty": "medium",
    "theme": "Sunny Beach",
    "color": "yellow",
    "words": ["sand", "sun", "wave", "surf", "boat", "swim", "fish", "reef", "dock", "crab", "tide", "pool", "foam", "rock", "salt", "sail", "gull", "clam", "oars", "pear"]
  },
  {
    "difficulty": "hard",
    "theme": "Mountain Trek",
    "color": "grey",
    "words": ["cliff", "rock", "snow", "cold", "peak", "hike", "camp", "tent", "boot", "pack", "path", "wind", "wild", "bear", "eagle", "tree", "rope", "step", "wood", "walk"]
  }
]


export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  var key = "nxtpzzle"
  var next = 0;

  if (!(await redis.exists(key))) {
    console.log('Key exists: ' + (await redis.exists('color')));
    await redis.set(key, '1');
  } else {  
      next = Number(await redis.get(key)); 
  }

  redis.set(key, String(next + 1));

  return await reddit.submitCustomPost({
    subredditName,
    title: `Puzzle #${next+1}: ${levels[next]!["theme"]}`,
    splash: {
      appDisplayName: 'Words with Chess',
      heading: `Puzzle #${next+1}: ${levels[next]!["theme"]}`,
      description: `Difficulty: ${levels[next]!["difficulty"]}`,
      backgroundUri: `splash-${levels[next]!["color"]}.jpg`,
      appIconUri: 'icon.png',
      buttonLabel: 'Start',
    },
    postData: {
      difficulty: levels[next]!["difficulty"],
      words: levels[next]!["words"],
      color: levels[next]!["color"],
      theme: levels[next]!["theme"],
      level: next+1
    }
  });
};


export async function addScore(postId: string, userId: string, score: number ): Promise<{ member: string; score: number; }[]>
{
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  console.log(" adding score")

  var submitted = await redis.zAdd(postId, { score: score, member: userId });
  
  
  console.log(submitted);

  const raw = await redis.zRange(postId, 0, 4);  
  console.log(raw);
  
  return raw;
};

export async function getUserScore(
  postId: string,
  userId: string
): Promise<number | null> {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error("subredditName is required");
  }

  const score = await redis.zScore(postId, userId);
  if (score) 
  {
    return score!; // will be null if userId not in the zset
  }
  else {return 0}
}

