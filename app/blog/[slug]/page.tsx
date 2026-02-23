import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchPost } from "@/src/lib/api";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await fetchPost(params.slug);

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h1>{post.title}</h1>

            <div style={{ marginBottom: 16 }}>
                <small>
                    {post.authorName ? `by ${post.authorName} · ` : ""}
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                </small>
            </div>

            {post.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={post.coverUrl}
                    alt=""
                    style={{ width: "100%", borderRadius: 12, marginBottom: 16 }}
                />
            ) : null}

            {post.excerpt ? <p style={{ opacity: 0.8 }}>{post.excerpt}</p> : null}

            <article style={{ lineHeight: 1.6 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMd}</ReactMarkdown>
            </article>
        </main>
    );
}
