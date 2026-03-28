export type Genre =
  | 'fantasy'
  | 'sci-fi'
  | 'horror'
  | 'mystery'
  | 'romance'
  | 'thriller'
  | 'historical'
  | 'adventure';

export type EndingType = 'victory' | 'defeat' | 'bittersweet' | 'neutral' | 'secret';

export interface StoryTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  backgroundImage?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string;
}

export interface StoryNode {
  id: string;
  storyId: string;
  title: string;
  prose: string;
  imagePrompt: string;
  cachedImageUrl?: string | null;
  choices: Choice[];
  isTerminal: boolean;
  endingType?: EndingType | null;
  endingBadge?: string | null;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  description: string;
  genre: Genre[];
  artStyle: string;
  mood: string;
  estimatedMinutes: number;
  coverImageUrl?: string | null;
  rootNodeId: string;
  isDynamic: boolean;
  theme: StoryTheme;
  createdAt: Date;
  nodes?: StoryNode[];
}

export interface PlayerSession {
  id: string;
  userId?: string | null;
  storyId: string;
  currentNodeId: string;
  choicePath: string[];
  started: Date;
  lastActive: Date;
  completed: boolean;
}

export interface DynamicContext {
  storyId: string;
  story: Pick<Story, 'title' | 'description' | 'genre' | 'artStyle' | 'mood'>;
  choicePath: string[];
  previousProse: string[];
  lastChoice?: string;
  nodeDepth: number;
}

export interface GeneratedScene {
  title: string;
  prose: string;
  imagePrompt: string;
  choices: Choice[];
  isTerminal: boolean;
  endingType?: EndingType;
}
