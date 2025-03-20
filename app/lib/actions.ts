'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Console } from 'console';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { getDictionary } from '@/get-dictionary';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type Registerstate = {
  errors?: {
    email?: string[];
    name?: string[];
    password?: string[];
    retypepassword?: string[];
  };
  message?: string | null;
  // currdictionary: any;
};



const RegisterSchema = z.object({

  email: z.string().email('Please provide a valid email address.'),
  name: z.string().min(1, { message: "Name cannot be empty" }),
  password: z.string().min(8, { message: "Password cannot be empty" })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one digit",
    })
    .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
      message: "Password must contain at least one special character",
    }),
  retypepassword: z.string()
})
  .refine(
    (data) => data.password === data.retypepassword,
    {
      message: "ErrorRetypePassword",
      path: ["retypepassword"], // This specifies which field the error should be attached to
    }
  )

  ;
const RefisterUser = RegisterSchema;




export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // console.log('Missing Fields. Failed to Create Invoice....');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    // We'll log the error to the console for now
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

export async function authenticateAction(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function registerUserAction(
  prevState: State,
  formData: FormData,
) {
  const validatedFields = RefisterUser.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    retypepassword: formData.get("retypepassword"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Sign Up.',
    };
  }
  try {
    const { email, name, password, retypepassword } = validatedFields.data;
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = randomUUID(); // Generates a version 4 UUID

    await sql`
  INSERT INTO users (id, name, email, password)
  VALUES (${uuid}, ${name}, ${email}, ${hashedPassword})
  ON CONFLICT (id) DO NOTHING;
  `;
  } catch (error) {
    // We'll log the error to the console for now
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }

  redirect('/login');
}

export async function registerUser(prevState: Registerstate, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = RefisterUser.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    retypepassword: formData.get("retypepassword"),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('Missing Fields. Failed to Create User....');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }
  // Prepare data for insertion into the database
  const { email, name, password, retypepassword } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const uuid = randomUUID(); // Generates a version 4 UUID
  console.log("uuid="+uuid);
  try {
   await sql`
  INSERT INTO users (id, name, email, password)
  VALUES (${uuid}, ${name}, ${email}, ${hashedPassword})
  ON CONFLICT (id) DO NOTHING;
  `;
  } catch (error) {
    // We'll log the error to the console for now
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }
  redirect('/login');
}


