"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  assignQuestionFolder,
  createProfile,
  deleteAnswer,
  deleteEvent,
  deleteFolder,
  deleteQuestion,
  fetchAppState,
  insertAnswer,
  insertBook,
  insertEvent,
  insertFolder,
  insertQuestion,
  updateAnswerBody,
  updateEmailNotifications,
  updateQuestionBody,
} from "@/lib/supabase/queries";
import type {
  AppState,
  FolderSection,
  Language,
  Question,
  View,
} from "@/lib/types";
import { VERTICAL_RHYTHM } from "@/lib/constants";
import { getOpenQuestionsByHelpers, makeNotifications } from "@/lib/helpers";

import { ViceVersa } from "@/components/brand/ViceVersa";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { ProfileSetup } from "@/components/auth/ProfileSetup";
import { BookCover } from "@/components/library/BookCover";
import { CatalogueLabel } from "@/components/library/CatalogueLabel";
import { BookView } from "@/components/library/BookView";
import { ReciprocitySection } from "@/components/library/ReciprocitySection";
import { ArchiveView } from "@/components/repertorium/ArchiveView";
import { CategoryView } from "@/components/repertorium/CategoryView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { FolderView } from "@/components/folders/FolderView";
import {
  AskQuestionModal,
  type QuestionDraft,
} from "@/components/modals/AskQuestionModal";
import { AddBookModal, type BookDraft } from "@/components/modals/AddBookModal";
import { AddEventModal, type EventDraft } from "@/components/modals/AddEventModal";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { InboxModal } from "@/components/modals/InboxModal";
import {
  EmailPreviewModal,
  type EmailPreviewInfo,
} from "@/components/modals/EmailPreviewModal";
import { CreateFolderModal } from "@/components/modals/CreateFolderModal";
import { AddToFolderModal } from "@/components/modals/AddToFolderModal";

type FilterDir = "all" | "NL-FR" | "FR-NL";
type Stage = "loading" | "anon" | "needs-profile" | "ready";

const EMPTY_STATE: AppState = {
  users: [],
  books: [],
  questions: [],
  events: [],
  folders: [],
};

export default function HomePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [authUser, setAuthUser] = useState<SupabaseAuthUser | null>(null);
  const [state, setState] = useState<AppState>(EMPTY_STATE);

  const [view, setView] = useState<View>({ page: "home" });
  const [showAskModal, setShowAskModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState<EmailPreviewInfo | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [filterDir, setFilterDir] = useState<FilterDir>("all");
  const [createFolderSection, setCreateFolderSection] =
    useState<FolderSection | null>(null);
  const [addToFolderId, setAddToFolderId] = useState<string | null>(null);

  // Auth-subscription: één keer opzetten bij mount.
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setAuthUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setAuthUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") {
        router.push("/auth/update-password");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // Data ophalen wanneer er een ingelogde gebruiker is.
  useEffect(() => {
    if (!authUser) {
      setState(EMPTY_STATE);
      setStage("anon");
      return;
    }
    let cancelled = false;
    setStage("loading");
    fetchAppState(authUser.email ?? "").then((newState) => {
      if (cancelled) return;
      setState(newState);
      const myProfile = newState.users.find((u) => u.id === authUser.id);
      setStage(myProfile ? "ready" : "needs-profile");
    });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const currentUser = useMemo(() => {
    if (!authUser) return null;
    const profile = state.users.find((u) => u.id === authUser.id);
    if (!profile) return null;
    return { ...profile, email: authUser.email ?? "" };
  }, [authUser, state.users]);

  const notifications = useMemo(
    () =>
      currentUser
        ? makeNotifications(state).filter((n) => n.userId === currentUser.id)
        : [],
    [state, currentUser]
  );
  const openByHelpers = useMemo(
    () => (currentUser ? getOpenQuestionsByHelpers(state, currentUser.id) : []),
    [state, currentUser]
  );

  // ============== Handlers ==============

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setView({ page: "home" });
  };

  const handleProfileSetup = async (name: string, nativeLanguage: Language) => {
    if (!authUser) return;
    const profile = await createProfile(authUser.id, name, nativeLanguage);
    if (!profile) {
      throw new Error("Profiel aanmaken is mislukt. Probeer het opnieuw.");
    }
    setState((s) => ({ ...s, users: [...s.users, profile] }));
    setStage("ready");
  };

  const handleAskQuestion = async (draft: QuestionDraft & { bookId: string }) => {
    if (!currentUser) return;
    const newQ = await insertQuestion(currentUser.id, draft);
    if (!newQ) return;
    setState((s) => ({ ...s, questions: [newQ, ...s.questions] }));
    const book = state.books.find((b) => b.id === draft.bookId);
    if (!book) return;
    const targets = state.users.filter(
      (u) =>
        u.nativeLanguage === book.sourceLanguage &&
        u.id !== currentUser.id &&
        u.emailNotifications
    );
    setShowEmailPreview({ question: newQ, book, targets });
  };

  const handleAddAnswer = async (questionId: string, text: string) => {
    if (!currentUser) return;
    const result = await insertAnswer(currentUser.id, questionId, text);
    if (!result) return;
    const answer = {
      id: result.id,
      authorId: result.authorId,
      text: result.text,
      createdAt: result.createdAt,
    };
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, answer] } : q
      ),
    }));
  };

  const handleAddBook = async (draft: BookDraft) => {
    if (!currentUser) return;
    const newBook = await insertBook(
      currentUser.id,
      draft,
      state.books.map((b) => b.code)
    );
    if (!newBook) return;
    setState((s) => ({ ...s, books: [...s.books, newBook] }));
  };

  const handleAddEvent = async (draft: EventDraft) => {
    if (!currentUser) return;
    const newEvent = await insertEvent(currentUser.id, draft);
    if (!newEvent) throw new Error("Toevoegen mislukt.");
    setState((s) => ({ ...s, events: [...s.events, newEvent] }));
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser) return;
    const ok = await deleteEvent(eventId);
    if (!ok) return;
    setState((s) => ({
      ...s,
      events: s.events.filter((e) => e.id !== eventId),
    }));
  };

  const handleEditQuestion = async (questionId: string, text: string) => {
    if (!currentUser) return;
    const ok = await updateQuestionBody(questionId, text);
    if (!ok) return;
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === questionId ? { ...q, text } : q
      ),
    }));
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentUser) return;
    const ok = await deleteQuestion(questionId);
    if (!ok) return;
    setState((s) => ({
      ...s,
      questions: s.questions.filter((q) => q.id !== questionId),
    }));
    if (view.page === "book" && view.focusQuestion === questionId) {
      setView({ page: "book", bookId: view.bookId });
    }
  };

  const handleEditAnswer = async (
    questionId: string,
    answerId: string,
    text: string
  ) => {
    if (!currentUser) return;
    const ok = await updateAnswerBody(answerId, text);
    if (!ok) return;
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id !== questionId
          ? q
          : {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text } : a
              ),
            }
      ),
    }));
  };

  const handleDeleteAnswer = async (questionId: string, answerId: string) => {
    if (!currentUser) return;
    const ok = await deleteAnswer(answerId);
    if (!ok) return;
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id !== questionId
          ? q
          : { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
      ),
    }));
  };

  const handleCreateFolder = async (
    section: FolderSection,
    name: string
  ) => {
    if (!currentUser) return;
    const folder = await insertFolder(currentUser.id, section, name);
    if (!folder) throw new Error("Map aanmaken mislukt.");
    setState((s) => ({ ...s, folders: [...s.folders, folder] }));
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!currentUser) return;
    const ok = await deleteFolder(folderId);
    if (!ok) return;
    setState((s) => ({
      ...s,
      folders: s.folders.filter((f) => f.id !== folderId),
      questions: s.questions.map((q) =>
        q.folderId === folderId ? { ...q, folderId: null } : q
      ),
    }));
    setView({ page: "archive" });
  };

  const handleAssignQuestionToFolder = async (
    questionId: string,
    folderId: string | null
  ) => {
    if (!currentUser) return;
    const ok = await assignQuestionFolder(questionId, folderId);
    if (!ok) return;
    setState((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === questionId ? { ...q, folderId } : q
      ),
    }));
  };

  const handleToggleNotifications = async () => {
    if (!currentUser) return;
    const newValue = !currentUser.emailNotifications;
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === currentUser.id ? { ...u, emailNotifications: newValue } : u
      ),
    }));
    await updateEmailNotifications(currentUser.id, newValue);
  };

  // ============== Render ==============

  if (stage === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fafaf8" }}
      >
        <div className="cargo-mono">Laden…</div>
      </div>
    );
  }

  if (stage === "anon") {
    return <AuthScreen />;
  }

  if (stage === "needs-profile" && authUser) {
    return (
      <ProfileSetup
        email={authUser.email ?? ""}
        onSubmit={handleProfileSetup}
      />
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  const filteredBooks = state.books.filter((b) => {
    if (filterDir === "all") return true;
    if (filterDir === "NL-FR") return b.sourceLanguage === "NL";
    if (filterDir === "FR-NL") return b.sourceLanguage === "FR";
    return true;
  });
  const selectedBook =
    view.page === "book"
      ? state.books.find((b) => b.id === view.bookId) ?? null
      : null;
  const bookQuestions =
    view.page === "book"
      ? state.questions.filter((q) => q.bookId === view.bookId)
      : [];

  const navColor = (active: boolean) => (active ? "#111" : "#999");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafaf8",
        color: "#111",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: "#fafaf8",
          borderBottom: "1px solid #e8e8e3",
        }}
      >
        <div className="vv-page py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setView({ page: "home" })}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                letterSpacing: "-0.01em",
                color: "#111",
                fontWeight: 400,
              }}
            >
              <ViceVersa />
            </button>
            <nav className="flex items-center gap-5">
              <button
                onClick={() => setView({ page: "home" })}
                className="cargo-mono transition-colors"
                style={{
                  color: navColor(view.page === "home" || view.page === "book"),
                }}
              >
                Bibliotheek
              </button>
              <button
                onClick={() => setView({ page: "archive" })}
                className="cargo-mono transition-colors"
                style={{
                  color: navColor(
                    view.page === "archive" || view.page === "category"
                  ),
                }}
              >
                Repertorium
              </button>
              <button
                onClick={() => setView({ page: "calendar" })}
                className="cargo-mono transition-colors"
                style={{
                  color: navColor(view.page === "calendar"),
                }}
              >
                Kalender
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowInbox(true)}
              className="cargo-mono flex items-center gap-1.5 hover:text-black transition-colors"
              style={{ color: notifications.length > 0 ? "#111" : "#999" }}
            >
              <Inbox className="w-3 h-3" strokeWidth={1.5} />{" "}
              {notifications.length > 0
                ? `Inbox (${notifications.length})`
                : "Inbox"}
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="cargo-mono hover:text-black transition-colors"
              style={{ color: "#666" }}
            >
              {currentUser.name}
            </button>
            <button
              onClick={handleLogout}
              className="cargo-mono hover:text-black transition-colors"
              style={{ color: "#999" }}
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="vv-page">
        {view.page === "home" && (
          <>
            <section className="pt-20 pb-16 animate-fadeIn">
              <div className="cargo-mono mb-3" style={{ color: "#999" }}>
                Index № 1 — Bibliotheek · Boeken
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 300,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  maxWidth: 900,
                }}
              >
                Vragen per boek
              </h1>
            </section>

            {openByHelpers.length > 0 && (
              <ReciprocitySection
                questions={openByHelpers}
                state={state}
                onOpen={(bookId) => setView({ page: "book", bookId })}
              />
            )}

            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 py-6 border-t border-b"
              style={{ borderColor: "#e8e8e3" }}
            >
              <button
                onClick={() => setFilterDir("all")}
                className={`cargo-mono transition-colors ${
                  filterDir === "all"
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                Alle ({state.books.length})
              </button>
              <button
                onClick={() => setFilterDir("NL-FR")}
                className={`cargo-mono transition-colors ${
                  filterDir === "NL-FR"
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                NL→FR ({state.books.filter((b) => b.sourceLanguage === "NL").length})
              </button>
              <button
                onClick={() => setFilterDir("FR-NL")}
                className={`cargo-mono transition-colors ${
                  filterDir === "FR-NL"
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                }`}
              >
                FR→NL ({state.books.filter((b) => b.sourceLanguage === "FR").length})
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setShowAddBookModal(true)}
                className="cargo-mono flex items-center gap-1.5 hover:text-black transition-colors"
                style={{ color: "#666" }}
              >
                + Boek toevoegen
              </button>
            </div>

            {state.books.length === 0 ? (
              <section className="py-24">
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "#666",
                    maxWidth: 600,
                  }}
                >
                  Nog geen boeken in de bibliotheek. Klik rechts op &quot;+ Boek
                  toevoegen&quot; om het eerste boek aan te maken.
                </p>
              </section>
            ) : (
              <section className="py-24">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-32">
                  {filteredBooks.map((book, idx) => {
                    const questionsCount = state.questions.filter(
                      (q) => q.bookId === book.id
                    ).length;
                    const offset = VERTICAL_RHYTHM[idx % VERTICAL_RHYTHM.length];
                    return (
                      <button
                        key={book.id}
                        onClick={() => setView({ page: "book", bookId: book.id })}
                        className="flex flex-col items-start text-left group animate-fadeIn"
                        style={{
                          marginTop: offset,
                          animationDelay: `${idx * 40}ms`,
                        }}
                      >
                        <div className="transition-transform duration-300 group-hover:scale-105">
                          <BookCover book={book} w={140} h={210} />
                        </div>
                        <div className="mt-3">
                          <CatalogueLabel
                            book={book}
                            questionsCount={questionsCount}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <footer
              className="border-t py-12 mt-20"
              style={{ borderColor: "#e8e8e3" }}
            >
              <div className="cargo-mono" style={{ color: "#999" }}>
                <ViceVersa /> — Een hulplijn voor vertalers
              </div>
            </footer>
          </>
        )}

        {view.page === "book" && selectedBook && (
          <BookView
            book={selectedBook}
            questions={bookQuestions}
            users={state.users}
            currentUserId={currentUser.id}
            focusQuestionId={view.focusQuestion}
            onBack={() => setView(view.origin || { page: "home" })}
            onAsk={() => setShowAskModal(true)}
            onAnswer={handleAddAnswer}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onEditAnswer={handleEditAnswer}
            onDeleteAnswer={handleDeleteAnswer}
          />
        )}

        {view.page === "archive" && (
          <ArchiveView
            questions={state.questions}
            folders={state.folders}
            onOpenCategory={(tag) => setView({ page: "category", tag })}
            onOpenFolder={(folderId) =>
              setView({ page: "folder", section: "repertorium", folderId })
            }
            onNewFolder={() => setCreateFolderSection("repertorium")}
          />
        )}

        {view.page === "category" && (
          <CategoryView
            tag={view.tag}
            state={state}
            onBack={() => setView({ page: "archive" })}
            onOpenQuestion={(q: Question) =>
              setView({
                page: "book",
                bookId: q.bookId,
                focusQuestion: q.id,
                origin: { page: "category", tag: view.tag },
              })
            }
          />
        )}

        {view.page === "calendar" && (
          <CalendarView
            events={state.events}
            users={state.users}
            currentUserId={currentUser.id}
            onAdd={() => setShowAddEvent(true)}
            onDelete={handleDeleteEvent}
          />
        )}

        {view.page === "folder" && (() => {
          const folder = state.folders.find((f) => f.id === view.folderId);
          if (!folder) {
            return (
              <div className="py-12">
                <button
                  onClick={() => setView({ page: "archive" })}
                  className="cargo-back mb-8"
                >
                  ← Terug
                </button>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "#666",
                  }}
                >
                  Dit dossier bestaat niet meer.
                </p>
              </div>
            );
          }
          return (
            <FolderView
              folder={folder}
              state={state}
              currentUserId={currentUser.id}
              onBack={() => setView({ page: "archive" })}
              onAddItem={() => setAddToFolderId(folder.id)}
              onRemoveItem={async (itemId) => {
                await handleAssignQuestionToFolder(itemId, null);
              }}
              onDeleteFolder={async () => {
                await handleDeleteFolder(folder.id);
              }}
              onOpenQuestion={(q: Question) =>
                setView({
                  page: "book",
                  bookId: q.bookId,
                  focusQuestion: q.id,
                  origin: {
                    page: "folder",
                    section: "repertorium",
                    folderId: folder.id,
                  },
                })
              }
            />
          );
        })()}
      </main>

      {showAskModal && selectedBook && (
        <AskQuestionModal
          book={selectedBook}
          state={state}
          onClose={() => setShowAskModal(false)}
          onSubmit={(q) => {
            handleAskQuestion({ ...q, bookId: selectedBook.id });
            setShowAskModal(false);
          }}
        />
      )}
      {showAddBookModal && (
        <AddBookModal
          onClose={() => setShowAddBookModal(false)}
          onSubmit={(b) => {
            handleAddBook(b);
            setShowAddBookModal(false);
          }}
        />
      )}
      {showAddEvent && (
        <AddEventModal
          onClose={() => setShowAddEvent(false)}
          onSubmit={async (draft) => {
            await handleAddEvent(draft);
          }}
        />
      )}
      {showProfile && (
        <ProfileModal
          user={currentUser}
          questions={state.questions}
          books={state.books}
          users={state.users}
          onClose={() => setShowProfile(false)}
          onToggleNotifications={handleToggleNotifications}
        />
      )}
      {showInbox && (
        <InboxModal
          user={currentUser}
          notifications={notifications}
          state={state}
          onClose={() => setShowInbox(false)}
          onOpenQuestion={(bookId) => {
            setShowInbox(false);
            setView({ page: "book", bookId });
          }}
        />
      )}
      {showEmailPreview && (
        <EmailPreviewModal
          info={showEmailPreview}
          onClose={() => setShowEmailPreview(null)}
        />
      )}
      {createFolderSection && (
        <CreateFolderModal
          sectionLabel="repertorium"
          onClose={() => setCreateFolderSection(null)}
          onSubmit={async (name) => {
            await handleCreateFolder(createFolderSection, name);
          }}
        />
      )}
      {addToFolderId && (() => {
        const folder = state.folders.find((f) => f.id === addToFolderId);
        if (!folder) return null;
        const availableQuestions = state.questions.filter(
          (q) => q.folderId !== folder.id
        );
        return (
          <AddToFolderModal
            folderName={folder.name}
            questions={availableQuestions}
            books={state.books}
            onClose={() => setAddToFolderId(null)}
            onPick={async (itemId) => {
              await handleAssignQuestionToFolder(itemId, folder.id);
            }}
          />
        );
      })()}
    </div>
  );
}
