export interface APIResBook {
  id: number;
  title: string;
  author: string;
  rating?: number;
  cover?: string;
  reading_status: string;
  bookshelf: APIResBookshelf;
}

export interface APIQueryBook {
  title?: string;
  rating?: number;
  reading_status?: string;
  bookshelf?: number;
  author?: string;
  cover?: number;
}

export interface APIResBookshelf {
  id: number;
  name: string;
  user: number;
}

export interface APIQueryBookshelf {
  name: string;
  user: number;
}

export interface APIQueryLogin {
  username: string;
  password: string;
}

export interface APIQueryRegister {
  username: string;
  email: string;
  password: string;
}

export interface APIResRegister {
  token: string;
}

export interface APIResUser {
  id: number;
  username: string;
  email: string;
}

export interface OPLIBBook {
  title: string;
  author_name: string[];
  key: string;
  cover_i: number;
  first_publish_year: number;
}

export interface OPLIBSearchQuery {
  title: string;
  author: string;
}

export interface OPLIBSearchResponse {
  num_found: number;
  docs: OPLIBBook[];
}
