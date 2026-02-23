import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchPage } from "@/src/lib/api";

export default async function CmsPage({ params }: { params: { slug: string } }) {
    const page = await fetchPage(params.slug);

    return (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h1>{page.title}</h1>
            <article style={{ lineHeight: 1.6 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.contentMd}</ReactMarkdown>
            </article>
        </main>
    );
}
