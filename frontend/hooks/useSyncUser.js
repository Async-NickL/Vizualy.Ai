import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useUserStore } from "@/store/user";

export const useSyncUser = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [syncing, setSyncing] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        setSyncing(true);
        const token = await getToken();
        const res = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email:
              user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses?.[0]?.emailAddress ||
              "",
            name: user.fullName || user.username || "",
          }),
        });
        const data = await res.json();
        setUser(data.user_id, data.email);
        setSyncing(false);
      }
    };
    syncUser();
  }, [isLoaded, user, setUser, getToken]);

  return { syncing };
};
