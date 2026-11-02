import { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url || 'https://academy.jpsmartsolutions.com';

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const supabase = createPublicClient();
    const { data: courses } = await supabase
      .from('courses')
      .select('slug, updated_at')
      .eq('status', 'published');

    const courseUrls: MetadataRoute.Sitemap = (courses || []).map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updated_at ? new Date(course.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticUrls, ...courseUrls];
  } catch (err) {
    console.error('[sitemap] Failed to fetch dynamic course routes at build time:', err);
    return staticUrls;
  }
}
