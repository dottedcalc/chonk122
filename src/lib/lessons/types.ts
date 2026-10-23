export type LessonPage = { title: string; minutes: number; body: React.ReactNode };

export type Lesson = { n: number; title: string; pages: LessonPage[] };
