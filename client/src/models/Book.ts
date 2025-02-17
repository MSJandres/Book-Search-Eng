export interface Book {
  bookId: string;
  title: string;
  authors: string[],
  description: string | null;
  image: string;
}
