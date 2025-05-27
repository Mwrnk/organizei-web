export type CardData = {
  id: string;
  title: string;
  userId: string;
  createdAt?: string; // <== Adiciona isso para a data
  updatedAt?: string; // (opcional, se quiser também)
  pdfs?: {
    url: string;
    filename: string;
    uploaded_at: string;
    size_kb?: number;
  }[];
  image_url?: string[]; // Se tiver imagens
  content?: string;
  priority?: string;
  is_published?: boolean;
};
