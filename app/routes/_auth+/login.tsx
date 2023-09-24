import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';

import { type ActionFunctionArgs } from "@remix-run/node";
import { Label } from "~/components/ui/label";
import FormItem from "~/components/form";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }).max(32, {
    message: "Password must be at most 32 characters long",
  }),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
}

export default function Login() {
  const [form, { email, password }] = useForm({
    id: 'registration-form',
    constraint: getFieldsetConstraint(loginFormSchema),
    lastSubmission: undefined,
    onValidate({ formData, }) {
      return parse(formData, { schema: loginFormSchema });
    },
    shouldRevalidate: 'onBlur'
  })

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
          <Button type="submit">Submit</Button>
        </Form>
      </main>
    </div>
  )
}