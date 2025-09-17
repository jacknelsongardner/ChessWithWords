import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  
  return await reddit.submitCustomPost({
    subredditName,
    title: 'Puzzle #1: A Walk in the Park',
    splash: {
      appDisplayName: 'Words with Chess',
      heading: "Puzzle #1 : A Walk in the Park",
      //description: 'Words to spell: \n abet \n cat \n dog \n blob',
      backgroundUri: 'splash.jpg',
      appIconUri: 'icon.png',
      buttonLabel: 'Start',
    },
    postData: {
      difficulty: "hard",
      words: ["at", "bat", "blob", "hat"]
    }
  });
};
