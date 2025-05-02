import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">WT - Web Tools</h1>
      <Link href="/tools"><Button>Get Start</Button></Link>
    </div>
  );
}
