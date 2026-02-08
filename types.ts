
export enum ContentType {
  NoCommentary = 'No Commentary',
  Walkthrough = 'Walkthrough',
  Gameplay = 'Gameplay',
  FullGame = 'Full Game',
  StoryMode = 'Story Mode',
  TipsAndTricks = 'Tips & Tricks',
  Highlights = 'Highlights',
  Speedrun = 'Speedrun',
  Other = 'Other gameplay-based formats'
}

export interface JTubeInput {
  gameTitle: string;
  contentType: ContentType;
  gameGenre?: string;
  gameLink?: string;
  donationLink?: string;
  language?: string;
  targetRegion?: string;
}

export interface JTubeOutput {
  titles: string[];
  description: string;
  tags: string;
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}
