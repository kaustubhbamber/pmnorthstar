import { books, getBookBySlug } from "@/data/books";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "northstar book review";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const book = getBookBySlug(params.slug, books);
  if (!book) {
    return ogImage({
      eyebrow: "Book",
      title: "Book not found",
    });
  }
  return ogImage({
    eyebrow: `Book · ${book.category}`,
    title: book.title,
    subtitle: `by ${book.author}`,
    description: book.description,
  });
}
