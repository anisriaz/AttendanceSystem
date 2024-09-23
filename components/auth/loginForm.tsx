"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/cardWrapper"

import { LoginSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/formError";
import { FormSuccess } from "@/components/formSuccess";
import { Login } from "@/actions/login"


interface LoginResponse {
  error?: string; 
  success?: string;  
}

export const LoginForm = () => {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof LoginSchema>>({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

  

//   const onSubmit = (values: z.infer<typeof LoginSchema>) => {
//     setError("")
//     setSuccess("")
//     startTransition(() => {
//       Login(values)
//       .then((data) => {
//         if (data?.error) {
//           form.reset();
//           setError(data.error)
//         }
//         if (data?.success) {
//           form.reset();
//           setSuccess(data.success);
//         }
//       })
//       .catch(() => setError("Something went wrong"))
//   });
// };

const form = useForm<z.infer<typeof LoginSchema>>({
  resolver: zodResolver(LoginSchema),
  defaultValues: {
      email: "",
      password: "",
  },
});

const onSubmit = (values: z.infer<typeof LoginSchema>) => {
  setError("");
  setSuccess("");

  startTransition(() => {
      Login(values)
      .then((data) => {
          if (data?.error) {
              setError(data.error);
          } else if (data?.success) {
              form.reset(); 
              setSuccess(data.success); 
          }
      })
      .catch(() => setError("Something went wrong")); 
  });
};






  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">
                      Forgot Password
                    </Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            Log in
            {/* {showTwoFactor ? "Confirm" : "Login"} */}
          </Button>
        </form>
      </Form>
    </CardWrapper>

  )

}

