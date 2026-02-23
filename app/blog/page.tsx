import Link from "next/link";
import { fetchPosts } from "@/src/lib/api";

export default async function BlogIndex() {
    const data = await fetchPosts(0, 10);

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h1>Blog</h1>

            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 16 }}>
                {data.content.map((p) => (
                    <li key={p.slug} style={{ border: "1px solid #eee", padding: 16, borderRadius: 12 }}>
                        <h2 style={{ margin: 0 }}>
                            <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                        </h2>
                        {p.excerpt ? <p style={{ marginTop: 8 }}>{p.excerpt}</p> : null}
                        <small>
                            {p.authorName ? `by ${p.authorName} · ` : ""}
                            {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ""}
                        </small>
                    </li>
                ))}
            </ul>
        </main>
    );
}
