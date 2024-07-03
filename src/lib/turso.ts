import { createClient } from '@libsql/client';

export const db = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export async function getBlogPosts() {
  const result = await db.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
  return result.rows;
}

export async function getBlogPostBySlug(slug: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM blog_posts WHERE slug = ?',
    args: [slug]
  });
  return result.rows[0];
}

export async function createBlogPost(slug: string, title: string, content: string, excerpt: string, thumbnailUrl: string) {
  const result = await db.execute({
    sql: 'INSERT INTO blog_posts (slug, title, content, excerpt, thumbnail_url) VALUES (?, ?, ?, ?, ?)',
    args: [slug, title, content, excerpt, thumbnailUrl]
  });
  return result;
}

export async function updateBlogPost(slug: string, title: string, content: string, excerpt: string, thumbnailUrl: string) {
  const result = await db.execute({
    sql: 'UPDATE blog_posts SET title = ?, content = ?, excerpt = ?, thumbnail_url = ? WHERE slug = ?',
    args: [title, content, excerpt, thumbnailUrl, slug]
  });
  return result;
}

export async function deleteBlogPost(slug: string) {
  const result = await db.execute({
    sql: 'DELETE FROM blog_posts WHERE slug = ?',
    args: [slug]
  });
  return result;
}

export async function searchBlogPosts(query: string) {
  const result = await db.execute({
    sql: `
      SELECT * FROM blog_posts 
      WHERE title LIKE ? OR content LIKE ? 
      ORDER BY created_at DESC
    `,
    args: [`%${query}%`, `%${query}%`]
  });
  return result.rows;
}