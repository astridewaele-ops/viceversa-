import type {
  AppState,
  Book,
  CalendarEvent,
  CoverPattern,
  Folder,
  FolderSection,
  Language,
  Question,
  User,
} from "@/lib/types";
import { createClient } from "./client";

// ============== DB-row-vormen (snake_case) ==============

interface DbProfile {
  id: string;
  name: string;
  native_language: Language;
  translates_to: Language;
  bio: string | null;
  joined_at: string;
  email_notifications: boolean;
}

interface DbBook {
  id: string;
  code: string;
  title: string;
  author: string;
  year: number | null;
  source_language: Language;
  target_language: Language;
  translator_id: string | null;
  cover_bg: string | null;
  cover_accent: string | null;
  cover_pattern: string | null;
  created_at: string;
}

interface DbAnswer {
  id: string;
  question_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

interface DbQuestion {
  id: string;
  book_id: string;
  asker_id: string;
  title: string;
  passage: string | null;
  page: string | null;
  body: string;
  tags: string[];
  created_at: string;
  folder_id: string | null;
  answers?: DbAnswer[];
}

interface DbEvent {
  id: string;
  title: string;
  link: string | null;
  event_date: string;
  added_by: string;
  created_at: string;
}

interface DbFolder {
  id: string;
  section: FolderSection;
  name: string;
  user_id: string;
  created_at: string;
}

// ============== Mappers DB → TS ==============

function mapProfile(p: DbProfile, email = ""): User {
  return {
    id: p.id,
    name: p.name,
    email,
    nativeLanguage: p.native_language,
    translates: [p.translates_to],
    verified: true,
    joined: p.joined_at.slice(0, 10),
    bio: p.bio ?? "",
    emailNotifications: p.email_notifications,
  };
}

function mapBook(b: DbBook): Book {
  return {
    id: b.id,
    code: b.code,
    title: b.title,
    author: b.author,
    year: b.year ?? new Date().getFullYear(),
    sourceLanguage: b.source_language,
    targetLanguage: b.target_language,
    translator: b.translator_id ?? "",
    coverStyle: {
      bg: b.cover_bg ?? "#3a2f1f",
      accent: b.cover_accent ?? "#c4a559",
      pattern: (b.cover_pattern ?? "horizontal") as CoverPattern,
    },
  };
}

function mapQuestion(q: DbQuestion): Question {
  return {
    id: q.id,
    bookId: q.book_id,
    askerId: q.asker_id,
    title: q.title,
    passage: q.passage ?? "",
    page: q.page ?? "",
    text: q.body,
    tags: q.tags,
    createdAt: q.created_at.slice(0, 10),
    folderId: q.folder_id ?? null,
    answers: (q.answers ?? []).map((a) => ({
      id: a.id,
      authorId: a.author_id,
      text: a.body,
      createdAt: a.created_at.slice(0, 10),
    })),
  };
}

function mapEvent(e: DbEvent): CalendarEvent {
  return {
    id: e.id,
    title: e.title,
    link: e.link ?? "",
    eventDate: e.event_date,
    addedBy: e.added_by,
    createdAt: e.created_at.slice(0, 10),
  };
}

function mapFolder(f: DbFolder): Folder {
  return {
    id: f.id,
    section: f.section,
    name: f.name,
    userId: f.user_id,
    createdAt: f.created_at.slice(0, 10),
  };
}

// ============== Fetch ==============

export async function fetchAppState(currentUserEmail: string): Promise<AppState> {
  const supabase = createClient();
  const [profilesRes, booksRes, questionsRes, eventsRes, foldersRes] =
    await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("books").select("*").order("created_at", { ascending: true }),
      supabase
        .from("questions")
        .select("*, answers(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true }),
      supabase
        .from("folders")
        .select("*")
        .order("created_at", { ascending: true }),
    ]);

  const profiles = (profilesRes.data as DbProfile[] | null) ?? [];
  const books = (booksRes.data as DbBook[] | null) ?? [];
  const questions = (questionsRes.data as DbQuestion[] | null) ?? [];
  const events = (eventsRes.data as DbEvent[] | null) ?? [];
  const folders = (foldersRes.data as DbFolder[] | null) ?? [];

  return {
    users: profiles.map((p) => mapProfile(p, "")),
    books: books.map(mapBook),
    questions: questions.map(mapQuestion),
    events: events.map(mapEvent),
    folders: folders.map(mapFolder),
  };
}

// ============== Profielbeheer ==============

export async function ensureProfile(
  userId: string,
  fallback: { name: string; nativeLanguage: Language }
): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("fetch profile", error);
    return null;
  }
  if (data) return mapProfile(data as DbProfile);
  return null;
}

export async function createProfile(
  userId: string,
  name: string,
  nativeLanguage: Language
): Promise<User | null> {
  const supabase = createClient();
  const translatesTo: Language = nativeLanguage === "NL" ? "FR" : "NL";
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      name,
      native_language: nativeLanguage,
      translates_to: translatesTo,
    })
    .select()
    .single();
  if (error) {
    console.error("create profile", error);
    return null;
  }
  return mapProfile(data as DbProfile);
}

export async function updateEmailNotifications(
  userId: string,
  enabled: boolean
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from("profiles")
    .update({ email_notifications: enabled })
    .eq("id", userId);
}

// ============== Mutaties — vraag, antwoord, boek, event ==============

export interface QuestionInput {
  bookId: string;
  title: string;
  passage: string;
  page: string;
  text: string;
  tags: string[];
}

export async function insertQuestion(
  askerId: string,
  q: QuestionInput
): Promise<Question | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("questions")
    .insert({
      book_id: q.bookId,
      asker_id: askerId,
      title: q.title,
      passage: q.passage,
      page: q.page,
      body: q.text,
      tags: q.tags,
    })
    .select("*, answers(*)")
    .single();
  if (error) {
    console.error("insert question", error);
    return null;
  }
  return mapQuestion(data as DbQuestion);
}

export async function insertAnswer(
  authorId: string,
  questionId: string,
  text: string
): Promise<{ id: string; questionId: string; authorId: string; text: string; createdAt: string } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("answers")
    .insert({ question_id: questionId, author_id: authorId, body: text })
    .select()
    .single();
  if (error) {
    console.error("insert answer", error);
    return null;
  }
  const a = data as DbAnswer;
  return {
    id: a.id,
    questionId: a.question_id,
    authorId: a.author_id,
    text: a.body,
    createdAt: a.created_at.slice(0, 10),
  };
}

export async function updateQuestionBody(
  questionId: string,
  text: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("questions")
    .update({ body: text })
    .eq("id", questionId);
  if (error) {
    console.error("update question", error);
    return false;
  }
  return true;
}

export async function deleteQuestion(questionId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);
  if (error) {
    console.error("delete question", error);
    return false;
  }
  return true;
}

export async function updateAnswerBody(
  answerId: string,
  text: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("answers")
    .update({ body: text })
    .eq("id", answerId);
  if (error) {
    console.error("update answer", error);
    return false;
  }
  return true;
}

export async function deleteAnswer(answerId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("answers")
    .delete()
    .eq("id", answerId);
  if (error) {
    console.error("delete answer", error);
    return false;
  }
  return true;
}

// ============== Folders ==============

export async function insertFolder(
  userId: string,
  section: FolderSection,
  name: string
): Promise<Folder | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("folders")
    .insert({ section, name, user_id: userId })
    .select()
    .single();
  if (error) {
    console.error("insert folder", error);
    return null;
  }
  return mapFolder(data as DbFolder);
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("folders").delete().eq("id", folderId);
  if (error) {
    console.error("delete folder", error);
    return false;
  }
  return true;
}

export async function assignQuestionFolder(
  questionId: string,
  folderId: string | null
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("questions")
    .update({ folder_id: folderId })
    .eq("id", questionId);
  if (error) {
    console.error("assign question folder", error);
    return false;
  }
  return true;
}

export interface BookInput {
  title: string;
  author: string;
  year: number;
  sourceLanguage: Language;
  targetLanguage: Language;
  coverStyle: { bg: string; accent: string; pattern: CoverPattern };
}

export async function insertBook(
  translatorId: string,
  b: BookInput,
  existingCodes: string[]
): Promise<Book | null> {
  let n = 1;
  while (existingCodes.includes(`${b.sourceLanguage} · ${String(n).padStart(3, "0")}`)) n++;
  const code = `${b.sourceLanguage} · ${String(n).padStart(3, "0")}`;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .insert({
      code,
      title: b.title,
      author: b.author,
      year: b.year,
      source_language: b.sourceLanguage,
      target_language: b.targetLanguage,
      translator_id: translatorId,
      cover_bg: b.coverStyle.bg,
      cover_accent: b.coverStyle.accent,
      cover_pattern: b.coverStyle.pattern,
    })
    .select()
    .single();
  if (error) {
    console.error("insert book", error);
    return null;
  }
  return mapBook(data as DbBook);
}

export interface EventInput {
  title: string;
  link: string;
  eventDate: string;
}

export async function insertEvent(
  addedBy: string,
  e: EventInput
): Promise<CalendarEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: e.title,
      link: e.link || null,
      event_date: e.eventDate,
      added_by: addedBy,
    })
    .select()
    .single();
  if (error) {
    console.error("insert event", error);
    return null;
  }
  return mapEvent(data as DbEvent);
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) {
    console.error("delete event", error);
    return false;
  }
  return true;
}
