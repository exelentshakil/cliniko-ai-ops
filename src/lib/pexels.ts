// Zero-dependency Pexels Media Fetcher
// Fetches real contextual imagery & video b-roll for demos with zero client-side SDK bloat.
// RULE: Never add attribution or photo credits in the UI or footer.

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
}

export async function searchPhotos(query: string, perPage = 6): Promise<PexelsPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return getFallbackPhotos(query, perPage);
  }

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
      headers: { Authorization: apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return getFallbackPhotos(query, perPage);
    }

    const data = await res.json();
    return data.photos || getFallbackPhotos(query, perPage);
  } catch {
    return getFallbackPhotos(query, perPage);
  }
}

export async function searchVideos(query: string, perPage = 3): Promise<PexelsVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
      headers: { Authorization: apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.videos || [];
  } catch {
    return [];
  }
}

function getFallbackPhotos(query: string, count: number): PexelsPhoto[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    width: 1280,
    height: 720,
    url: '',
    src: {
      original: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1280&q=80`,
      large2x: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1280&q=80`,
      large: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80`,
      medium: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80`,
      small: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80`,
      tiny: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80`,
    },
    alt: `${query} showcase visual`,
  }));
}
