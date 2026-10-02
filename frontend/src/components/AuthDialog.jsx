import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "./AuthForm";


export default function AuthDialog({ open, onOpenChange, onSuccess }) {
  const { user } = useAuth();

  // Auto-close when auth succeeds
  useEffect(() => {
    if (user && open) {
      onOpenChange(false);
      onSuccess?.();
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Welcome to Feedants</DialogTitle>
          <DialogDescription>
            Login or create an account to register for this competition.
          </DialogDescription>
        </DialogHeader>

        <AuthForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}