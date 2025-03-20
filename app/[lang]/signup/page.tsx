import AcmeLogo from '@/app/[lang]/ui/acme-logo';
import { Suspense } from 'react';
import SignUpForm from '../ui/signup-form';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';


 export default async function SignUpPage(props: {
   params: Promise<{ lang: Locale }>;
 }) {
   const { lang } = await props.params;
   const dictionary = await getDictionary(lang);

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <SignUpForm dictionary={dictionary.signup_page}/>
        </Suspense>
      </div>
    </main>
  );
}