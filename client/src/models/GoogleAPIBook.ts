export interface GoogleAPIVolumeInfo {
  title: string;
  authors: string[];
  description: string | null;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface GoogleAPIBook {
    id: string;
    volumeInfo: GoogleAPIVolumeInfo;
}