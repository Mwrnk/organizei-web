export type CardData = {
  id: string;
  title: string;
  userId: string;
  pdfs?: {
    url: string;
    filename: string;
    uploaded_at: string;
    size_kb?: number;
  }[];
};
