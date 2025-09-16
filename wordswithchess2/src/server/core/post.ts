import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  
  return await reddit.submitCustomPost({
    subredditName,
    title: 'Puzzle #1: A walk in the park',
    splash: {
      appDisplayName: 'Words with Chess',
      heading: "Today's Theme: \n SPACE",
      description: 'Words to spell: \n abet \n cat \n dog \n blob',
      backgroundUri: 'splash.jpg',
      appIconUri: 'icon.png',
      buttonLabel: 'Start',
    },
    postData: {
      // optional: any data your app needs
    }
  });
};
