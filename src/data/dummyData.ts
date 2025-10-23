export interface JournalCover {
  id: string;
  title: string;
  color: string;
  texture: string;
  image_url: string | null;
  is_default: boolean;
}

export interface JournalPage {
  id: string;
  page_number: number;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string | null;
}

export const dummyCovers: JournalCover[] = [
  {
    id: '1',
    title: 'All feelings. One you',
    color: '',
    texture: '',
    image_url: '/journal_covers/Cover1.jpg',
    is_default: true,
  },
  {
    id: '2',
    title: 'Paint your inner world',
    color: '',
    texture: '',
    image_url: '/journal_covers/Cover2.png',
    is_default: false,
  },
  {
    id: '3',
    title: 'Strong enough to feel.',
    color: '',
    texture: '',
    image_url: '/journal_covers/Cover3.jpeg',
    is_default: false,
  },
  {
    id: '4',
    title: 'Made for her, by emotions',
    color: '',
    texture: '',
    image_url: '/journal_covers/Cover4.jpg',
    is_default: false,
  },
];

export const dummyPages: JournalPage[] = [
  {
    id: '1',
    page_number: 1,
    title: 'Welcome to Echo Journal',
    description: 'Your journey into emotional intelligence begins here. This introductory page sets the foundation for self-discovery and emotional awareness.',
    content: 'Welcome to Echo Journal - a companion for exploring the depths of your emotional landscape. Emotional intelligence is the key to understanding yourself and connecting authentically with others.',
    category: 'introduction',
    image_url: null,
  },
  {
    id: '2',
    page_number: 2,
    title: 'Understanding Your Emotions',
    description: 'Learn to identify and name your emotions with clarity. This page provides a comprehensive emotional vocabulary guide.',
    content: 'Emotions are signals from within. Learning to recognize and name them is the first step toward emotional mastery. Use this page to explore the full spectrum of human feelings.',
    category: 'exercises',
    image_url: null,
  },
  {
    id: '3',
    page_number: 3,
    title: 'Daily Emotional Check-In',
    description: 'A structured space for daily reflection on your emotional state, triggers, and responses.',
    content: 'What am I feeling right now? What triggered this emotion? How did I respond? What would I like to do differently? Use these prompts daily to build emotional awareness.',
    category: 'prompts',
    image_url: null,
  },
  {
    id: '4',
    page_number: 4,
    title: 'The Empathy Practice',
    description: 'Develop your ability to understand and share the feelings of others through guided exercises.',
    content: 'Empathy is the bridge to meaningful connections. Practice seeing situations from another perspective. Reflect on how others might feel and why.',
    category: 'exercises',
    image_url: null,
  },
  {
    id: '5',
    page_number: 5,
    title: 'Managing Difficult Emotions',
    description: 'Practical strategies for navigating challenging emotional experiences with grace and resilience.',
    content: 'When strong emotions arise, pause and breathe. Name the emotion. Explore its message. Choose your response with intention. This page offers techniques for emotional regulation.',
    category: 'reflections',
    image_url: null,
  },
  {
    id: '6',
    page_number: 6,
    title: 'Gratitude & Positive Emotions',
    description: 'Cultivate positive emotional states through daily gratitude practice and appreciation.',
    content: 'What brought joy today? Who am I grateful for? What small moments sparked delight? Acknowledging positive emotions amplifies them.',
    category: 'prompts',
    image_url: null,
  },
  {
    id: '7',
    page_number: 7,
    title: 'Emotional Patterns',
    description: 'Identify recurring emotional themes and patterns in your life for deeper self-understanding.',
    content: 'Over time, patterns emerge. Notice your emotional triggers, your default responses, and your growth areas. This awareness is transformative.',
    category: 'reflections',
    image_url: null,
  },
  {
    id: '8',
    page_number: 8,
    title: 'Setting Emotional Boundaries',
    description: 'Learn to protect your emotional well-being through healthy boundary-setting practices.',
    content: 'Boundaries are an act of self-respect. What are you willing to accept? What needs to change? How will you communicate your needs? Define your emotional limits here.',
    category: 'exercises',
    image_url: null,
  },
];
