import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Link, Head } from "@inertiajs/react";
import React from "react";
import DOMPurify from "dompurify";

const NewsShow = ({ article, relatedArticles }) => {
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const estimateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const textLength = content.replace(/<[^>]*>/g, "").split(" ").length;
        const readingTime = Math.ceil(textLength / wordsPerMinute);
        return readingTime;
    };

    const shareUrl = window.location.href;
    const shareTitle = article.title;

    return (
        <GuestLayout>
            <Head>
                <title>{article.title}</title>
                <meta name="description" content={article.excerpt} />
            </Head>

            {/* Article Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left: Article Content */}
                        <div className="lg:col-span-8">
                            <article>
                                {/* Meta */}
                                <div className="mb-6 text-sm text-gray-500">
                                    {article.category?.name} •{" "}
                                    {formatDate(article.published_at)} •{" "}
                                    {estimateReadingTime(article.content)} menit
                                    baca
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                                    {article.title}
                                </h1>

                                {/* Divider */}
                                <div className="w-16 h-px bg-gray-900 mb-8"></div>

                                {/* Excerpt */}
                                {/* <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    {article.excerpt}
                                </p> */}

                                {/* Featured Image */}
                                <div className="mb-8">
                                    <a
                                        href={`/storage/${article.featured_image_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                                            <img
                                                src={`/storage/${article.featured_image_path}`}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </a>
                                </div>

                                {/* Content */}
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            article.content
                                        ),
                                    }}
                                />

                                {/* Tags */}
                                {article.tags && article.tags.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <h3 className="text-base font-bold text-gray-900 mb-4">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                        Bagikan
                                    </h3>
                                    <div className="flex gap-4">
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                shareUrl
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                shareUrl
                                            )}&text=${encodeURIComponent(
                                                shareTitle
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(
                                                shareTitle + " " + shareUrl
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Right: Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-8">
                                {/* Author */}
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                        Penulis
                                    </h3>
                                    <p className="text-gray-700">
                                        {article.author.name}
                                    </p>
                                </div>

                                {/* Related Articles */}
                                <div className="border-t border-gray-200 pt-8">
                                    <h3 className="text-base font-bold text-gray-900 mb-6">
                                        Berita Terkait
                                    </h3>
                                    <div className="space-y-6">
                                        {relatedArticles.map(
                                            (related, index) => (
                                                <div
                                                    key={related.id}
                                                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                                                >
                                                    <Link
                                                        href={route(
                                                            "public.news.show",
                                                            {
                                                                article:
                                                                    related.slug,
                                                            }
                                                        )}
                                                        className="group"
                                                    >
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {/* Image */}
                                                            <div className="col-span-1">
                                                                <div className="aspect-square overflow-hidden bg-gray-100">
                                                                    <img
                                                                        src={`/storage/${related.featured_image_path}`}
                                                                        alt={
                                                                            related.title
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="col-span-2 space-y-2">
                                                                <h4 className="text-base font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                                                                    {
                                                                        related.title
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatDate(
                                                                        related.published_at
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* View All */}
                                    <div className="mt-6">
                                        <Link
                                            href={route("public.news.index")}
                                            className="inline-flex items-center group"
                                        >
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                                Lihat Semua Berita
                                            </span>
                                            <div className="ml-3 w-8 h-px bg-gray-900 group-hover:w-12 transition-all duration-300"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default NewsShow;
