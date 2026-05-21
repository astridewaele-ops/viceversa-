export type Language = "NL" | "FR";

export type CoverPattern =
  | "horizontal"
  | "ornate"
  | "vertical"
  | "minimal"
  | "wavy"
  | "modern"
  | "tropical";

export interface CoverStyle {
  bg: string;
  accent: string;
  pattern: CoverPattern;
}

export interface User {
  id: string;
  name: string;
  email: string;
  nativeLanguage: Language;
  translates: Language[];
  verified: boolean;
  joined: string;
  bio: string;
}

export interface Book {
  id: string;
  code: string;
  title: string;
  author: string;
  year: number;
  sourceLanguage: Language;
  targetLanguage: Language;
  translator: string;
  coverStyle: CoverStyle;
}

export interface Answer {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Question {
  id: string;
  bookId: string;
  askerId: string;
  title: string;
  passage: string;
  page: string;
  tags: string[];
  text: string;
  createdAt: string;
  answers: Answer[];
}

export type VademecumCategory = "subsidies" | "workshops" | "uitgeverijen";

export interface VademecumEntry {
  id: string;
  category: VademecumCategory;
  name: string;
  forWhom: string;
  deadline: string;
  link: string;
  addedBy: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  books: Book[];
  questions: Question[];
  vademecum: VademecumEntry[];
}

export interface Notification {
  id: string;
  userId: string;
  questionId: string;
  bookId: string;
  createdAt: string;
  type: "new_question";
}

export type OpenHelperQuestion = Question & { helperId: string };

export type View =
  | { page: "home" }
  | { page: "book"; bookId: string; focusQuestion?: string; origin?: View }
  | { page: "archive" }
  | { page: "category"; tag: string }
  | { page: "vademecum" }
  | { page: "vademecum-category"; vcat: VademecumCategory };
