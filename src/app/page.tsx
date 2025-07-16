import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center py-5">
      <h1 className="text-3xl font-bold font-sans font-light">Book And Wisdom</h1>
      <p className="text-sm text-gray-500">书, حكمة - Shū, Hikma</p>
      <Link href="/kits"><Button>Get Start</Button></Link>
    </div>
  );
}
