const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
}

export type PostSummary = {
    slug: string;
    title: string;
    excerpt?: string | null;
    coverUrl?: string | null;
    authorName?: string | null;
    publishedAt?: string | null;
};

export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

export type PostDetail = {
    slug: string;
    title: string;
    excerpt?: string | null;
    contentMd: string;
    coverUrl?: string | null;
    authorName?: string | null;
    publishedAt?: string | null;
    updatedAt?: string | null;
};

export type BlogPage = {
    slug: string;
    title: string;
    contentMd: string;
    publishedAt?: string | null;
    updatedAt?: string | null;
};

export async function fetchPosts(page = 0, size = 10) {
    const res = await fetch(`${baseUrl}/public/posts?page=${page}&size=${size}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to load posts");
    return (await res.json()) as PageResponse<PostSummary>;
}

export async function fetchPost(slug: string) {
    const res = await fetch(`${baseUrl}/public/posts/${slug}`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Post not found");
    return (await res.json()) as PostDetail;
}

export async function fetchPage(slug: string) {
    const res = await fetch(`${baseUrl}/public/pages/${slug}`, {
        next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("Page not found");
    return (await res.json()) as BlogPage;
}
