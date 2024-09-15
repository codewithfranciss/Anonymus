import { createClient } from "@/utils/supabase/server";
import { redirect, useParams, useRouter } from "next/navigation";
import Room from "../../../components/Room";

export default async function Chatroom({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    data,
    error,
  } = await createClient().from("room").select("*").eq("id", id).single();
  if (!error) {
    console.log(error);
  }

  // if (!data) {
  //   redirect("/expired");
  // }

  return (
    <div className="relative max-w-2xl mx-auto h-[100dvh]">
      <Room name={data.name} />
    </div>
  );
}
