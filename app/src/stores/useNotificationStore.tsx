import produce from "immer";
import create, { State } from "zustand";

interface NotificationStore extends State {
  notifications: Array<{
    type: string;
    message: string;
    description?: string;
    txid?: string;
  }>;
  set: (x: any) => void;
}

const useNotificationStore = create<NotificationStore>((set, _get) => ({
    notifications: [],
    set: (fn) => set(produce(fn)),
  }))
  
  export default useNotificationStore