"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "../../../../i18n-config";
import clsx from "clsx";


export default function LocaleSwitcher(props: { lang: any; }) {
  const pathname = usePathname();
  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    // console.log(" LocaleSwitcher result:"+   segments.join("/"));
    return segments.join("/");
  };
  return (
   <div  className="flex flex-row items-center leading-none text-white "> 
      
      <ul >
        {i18n.locales.map((locale) => {
          return (
            <li key={locale}>
              <Link href={redirectedPathname(locale)}   
              className={clsx(
                            {
                              'bg-sky-100 text-blue-600': locale === props.lang,
                            },
                          )}          
              
              >{locale}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
