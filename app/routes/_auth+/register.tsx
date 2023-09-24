import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';

import { type ActionFunctionArgs } from "@remix-run/node";
import { Label } from "~/components/ui/label";
import FormItem from "~/components/form";

const registrationFormSchema = z.object({
  username: z.string({
    description: "Your username is how other users will see you",
  }).min(2, {
    message: "Your username must be at least 2 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 8 characters long",
  }).max(32, {
    message: "Password must be at most 32 characters long",
  }),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('Bloody hell');
  return null;
};

export default function Register() {
  const [form, { email, username, password } ] = useForm({
    id: 'registration-form',
    constraint:getFieldsetConstraint(registrationFormSchema),
    lastSubmission: undefined,
    onValidate({ formData, }) {
      return parse(formData, { schema: registrationFormSchema });
    },
    shouldRevalidate: 'onBlur'
  })

  return (
    <div className="flex items-center content-center justify-center w-screen h-screen">
      <main className="max-w-lg px-6 py-8 mx-auto rounded-lg shadow-md h-fit">
        <h3>Remix</h3>
        <p>Create an account</p>
          <Form method="post" {...form.props}>
            <FormItem>
              <Label htmlFor={username.name}>Username</Label>
              <Input type="text" name={username.name} id={username.name} />
            </FormItem>
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