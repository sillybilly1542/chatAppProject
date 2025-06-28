import LoginForm from "@/components/LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page (){
  const cookieStore = await cookies();
  const loggedIn = cookieStore.get('loggedIn');

  if (loggedIn) {
    redirect('/app')
  }

  return(
    <div className="flex flex-col h-[calc(100vh-3.5rem)] items-center">
      <h1 className="text-3xl font-semibold mb-2 mt-[calc(50vh-13.0625rem)]">Chat App</h1> 
      <LoginForm />
    </div>
  );
}

