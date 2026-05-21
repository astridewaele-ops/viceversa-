import type { AppState, Notification, OpenHelperQuestion } from "./types";

export function makeNotifications(state: AppState): Notification[] {
  const notifications: Notification[] = [];
  state.questions.forEach((q) => {
    const book = state.books.find((b) => b.id === q.bookId);
    if (!book) return;
    state.users.forEach((u) => {
      if (u.id === q.askerId) return;
      if (!u.emailNotifications) return;
      if (u.nativeLanguage === book.sourceLanguage) {
        notifications.push({
          id: `n-${q.id}-${u.id}`,
          userId: u.id,
          questionId: q.id,
          bookId: q.bookId,
          createdAt: q.createdAt,
          type: "new_question",
        });
      }
    });
  });
  return notifications;
}

export function getOpenQuestionsByHelpers(
  state: AppState,
  userId: string
): OpenHelperQuestion[] {
  const myQuestions = state.questions.filter((q) => q.askerId === userId);
  const helperIds = new Set<string>();
  myQuestions.forEach((q) =>
    q.answers.forEach((a) => {
      if (a.authorId !== userId) helperIds.add(a.authorId);
    })
  );
  const result: OpenHelperQuestion[] = [];
  [...helperIds].forEach((helperId) => {
    const helperOpen = state.questions
      .filter((q) => q.askerId === helperId && q.answers.length === 0)
      .map((q) => ({ ...q, helperId }));
    result.push(...helperOpen);
  });
  return result;
}
