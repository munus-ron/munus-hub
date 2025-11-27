import { useSession } from "next-auth/react";
import { AvatarImage } from "@/components/ui/avatar";

export default function UserProfile() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please sign in</div>;
  }

  const profilePicSrc = session.user?.image ?? "/placeholder.svg";

  return <AvatarImage src={profilePicSrc} />;
}
