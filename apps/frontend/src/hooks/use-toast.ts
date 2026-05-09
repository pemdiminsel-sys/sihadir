import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant }: any) => {
    console.log("Toast:", title, description, variant);
    setToasts([...toasts, { title, description, variant }]);
  };

  return { toast, toasts };
}
