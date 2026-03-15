import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import RegisterForm from "@/features/auth/components/forms/RegisterForm";
import SocialAuth from "@/features/auth/components/SocialAuth";
import { type Metadata } from "next";
import Link from "next/link";
import { DEFAULT_AUTH_PATH } from "@/constant";

export const metadata: Metadata = {
  title: "Register",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RegisterPage(props: PageProps<"/register">) {
  const searchParams = await props.searchParams;

  const redirectUrl =
    (searchParams?.redirect as string | undefined) ?? DEFAULT_AUTH_PATH;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Let’s Get Started!</CardTitle>
        <CardDescription>Sign up to explore amazing features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialAuth redirect={redirectUrl} />
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <RegisterForm redirect={redirectUrl} />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
          Do you have an account?{" "}
          <Link href="/login" className="link">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
