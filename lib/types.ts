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
  emailNotifications: boolean;
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
  folderId?: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  link: string;
  location: string;
  eventDate: string;
  addedBy: string;
  createdAt: string;
}

export type FolderSection = "repertorium";

export interface Folder {
  id: string;
  section: FolderSection;
  name: string;
  userId: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  books: Book[];
  questions: Question[];
  events: CalendarEvent[];
  folders: Folder[];
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
  | { page: "calendar" }
  | { page: "folder"; section: FolderSection; folderId: string };
