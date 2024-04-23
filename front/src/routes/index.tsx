import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { State, Actions } from "@/shared/types/counter";

const useStore = create<State & Actions>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

function Index() {
  const inc = useStore((state) => state.inc);
  const dec = useStore((state) => state.dec);
  const count = useStore((state) => state.count);
  const reset = useStore((state) => state.reset);

  return (
    <div className="h-screen grid place-items-center">
      <p className="">count is: {count}</p>
      <Button onClick={inc}>inc</Button>
      <Button onClick={dec}>dec</Button>
      <Button onClick={reset}>reset</Button>
    </div>
  );
}

export default Index;
