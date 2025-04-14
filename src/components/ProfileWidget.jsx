import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfileWidget() {
  const { user, auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [role, setRole] = useState(null); // null instead of "Developer"
  const [loading, setLoading] = useState(true); // track loading

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "userProfiles", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.role) setRole(data.role);
          else setRole("Developer"); // fallback
        } else {
          setRole("Developer");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setRole("Developer");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });

      await setDoc(doc(db, "userProfiles", user.uid), {
        role,
      }, { merge: true });

      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // 🧼 Skeleton/fallback while loading
  if (loading) {
    return (
      <div className="p-4 bg-muted rounded-xl shadow-md space-y-3 animate-pulse w-64 h-36">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-muted rounded-xl shadow-md space-y-3">
      <img src={user?.photoURL || "/default-avatar.png"} alt="Avatar" className="w-16 h-16 rounded-full" />
      <div>
        <h2 className="text-lg font-bold">{user?.displayName || "Anonymous"}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">{role}</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2 w-full">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Update your display name, photo, and role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" />
            <Input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="Photo URL" />
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
