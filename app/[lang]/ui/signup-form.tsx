'use client';
import { lusitana } from '@/app/[lang]/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { Registerstate, registerUser } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { getDictionary } from '@/get-dictionary';


export default function SignUpForm({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["signup_page"];
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const initialState: Registerstate = { message: null, errors: {} };
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          {dictionary.SignUpTitle}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              {dictionary.Email}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder={dictionary.EnterEmail}
                aria-describedby="email-error"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              {dictionary.Name}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="name"
                name="name"
                placeholder={dictionary.EnterName}
                required
                minLength={4}
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              {dictionary.Password}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder={dictionary.EnterPassword}
                required
                minLength={8}
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {dictionary.GlobalError}
                  </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="retypepassword"
            >
              {dictionary["RetypePassword"]}
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="retypepassword"
                type="password"
                name="retypepassword"
                placeholder={dictionary.EnterRetypePassword}
                required
                minLength={8}
                aria-describedby="retypepassword-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="retypepassword-error" aria-live="polite" aria-atomic="true">
              {state.errors?.retypepassword &&
                state.errors.retypepassword.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {dictionary.ErrorRetypePassword}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" >
          {dictionary.SignUp} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1">
          {state.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}


/*
return (
<form action={formAction} className="space-y-3">
<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
  <h1 className={`${lusitana.className} mb-3 text-2xl`}>
  Sign Up To Get Started!
  </h1>
  <div className="w-full">
    <div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="email"
      >
        Email
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
    <div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="name"
      >
        Name
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="name"
          type="name"
          name="name"
          placeholder="Enter your Name"
          required
        />
        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
    <div className="mt-4">
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="password"
      >
        Password
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          required
          minLength={6}
        />
        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
    <div className="mt-4">
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor="retypepassword"
      >
        Retype Password
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="retypepassword"
          type="password"
          name="retypepassword"
          placeholder="Retype password"
          required
          minLength={6}
        />
        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>

  </div>


  <input type="hidden" name="redirectTo" value={callbackUrl} />
  {/* <Button className="mt-4 w-full" aria-disabled={isPending}> }
  Sign Up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
  </Button>
  <div className="flex h-8 items-end space-x-1">
  {errors. && (
      <>
        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        <p className="text-sm text-red-500">{errorMessage.message}</p>
      </>
    )}
  </div>
</div>
</form>
);



}

*/
