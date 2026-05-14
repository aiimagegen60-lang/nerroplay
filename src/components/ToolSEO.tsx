import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ToolSEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export default function ToolSEO({ title, description, path, image }: ToolSEOProps) {
  const fullUrl = `https://nerroplay.online${path}`;
  const siteName = 'NERROPLAY';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || 'https://nerroplay.online/og-image.png'} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || 'https://nerroplay.online/og-image.png'} />
    </Helmet>
  );
}
