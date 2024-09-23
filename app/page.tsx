import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/loginButton"
export default function Home() {
  return (
    <>
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-sky-400 to-blue-800">
       <div className="spcae-y-6">
        <h1 className="text-5xl font-semibold text-white drop-shadow-md">
          Attendance System
        </h1>
        <div>
          <LoginButton>
          <Button variant="secondary" size="lg">
            Log In
          </Button>
          </LoginButton>
        </div>
       </div>
    </main>

    </>
  );
}
