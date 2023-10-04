import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import type { Submission } from '@conform-to/react';
import { useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';

import { type ActionFunctionArgs } from "@remix-run/node";
import { Label } from "~/components/ui/label";
import FormItem from "~/components/form";
import { getUserByEmail, verifyLogin } from "~/utils/models/user.server";
import { typedjson } from "remix-typedjson";
import { createUserSession } from "~/utils/server/user.server";
import { useEffect } from "react";

// Remember, you can add more login types to your form,
// including Google, Discord, Github, etc.
enum LoginType {
  FORM = 'form',
}

const loginFormSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Please enter a valid email address",
  }),
  password: z.string({
    required_error: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters long",
  }).max(32, {
    message: "Password must be at most 32 characters long",
  }),
  type: z.enum([LoginType.FORM]),
});

type ActionData = Submission<{
  email: string;
  password: string;
  type: LoginType;
}>

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData.entries());

  const type = form.type as LoginType;
  const email = form.email as string;
  const password = form.password as string;

  const submission = parse(formData, { schema: loginFormSchema });

  if (submission.intent !== 'submit' || !submission.value) {
    return typedjson<ActionData>(submission, { status: 400 })
  }

  // You can extend your form here and even add more fields,
  // just remember to pass them via the form!
  const redirectTo = null;

  switch (type) {
    case LoginType.FORM:
      const validUser = await getUserByEmail(email);

      if (!validUser) {
        return typedjson<ActionData>({
          intent: 'submit',
          payload: {
            email: email,
            password: '****',
            type: LoginType.FORM,
          },
          error: {
            email: ['No user found with this email address'],
          }
        }, { status: 400 })
      }

      const user = await verifyLogin(email, password);

      if (!user) {
        return typedjson<ActionData>(
          { error: { email: ["Invalid password. Try again"] }, intent: "submit", payload: { email, password: '****', type } },
          { status: 400 }
        );
      }

      return createUserSession({
        request,
        userId: user.id,
        redirectTo: typeof redirectTo === "string" ? redirectTo : "/dashboard",
      });
    default:
      return new Response('Invalid login type', { status: 400 });
  }
}

export default function Login() {
  const actionData = useActionData();
  const [form, { email, password, type }] = useForm({
    id: 'login-form',
    constraint: getFieldsetConstraint(loginFormSchema),
    lastSubmission: actionData,
    onValidate({ formData, }) {
      return parse(formData, { schema: loginFormSchema });
    },
    shouldRevalidate: 'onBlur'
  })

  useEffect(() => {
    console.log('actionData', actionData);
  }, [actionData]);

  return (
    <div className="flex items-center content-center justify-center w-screen h-screen">
      <main className="max-w-lg px-6 py-8 mx-auto rounded-lg shadow-md h-fit">
        <h3>Remix</h3>
        <p>Log in to your account</p>
        <div>
          {/* A simple preset choice */}
        </div>
        <Form method="post" {...form.props}>
          <FormItem>
            <Label htmlFor={email.name}>Email</Label>
            <Input type="email" name={email.name} id={email.name} />
          </FormItem>
          <FormItem>
            <Label htmlFor={password.name}>Password</Label>
            <Input type="password" name={password.name} id={password.name} />
          </FormItem>
          <Input type="hidden" name={type.name} value={LoginType.FORM} />
          <Button type="submit">Submit</Button>
        </Form>
      </main>
    </div>
  )
}