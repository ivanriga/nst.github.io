import '@/app/[lang]/ui/global.css';
import { i18n, type Locale } from "../../i18n-config";
import { inter } from '@/app/[lang]/ui/fonts';
import { Metadata } from 'next';
 

 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));

}


export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}


/*
export default function RootLayout({
  children,
params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;
  return (
    <html lang={params.lang}>
       <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
*/