import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { State, Actions } from "@/shared/types/counter";
import { Fragment } from "react/jsx-runtime";

const useStore = create<State & Actions>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default function Index() {
  const count = useStore((state) => state.count);
  const inc = useStore((state) => state.inc);
  const dec = useStore((state) => state.dec);
  const reset = useStore((state) => state.reset);

  return (
    <Fragment>
      <h2 className="font-bold text-2xl">Counter</h2>
      <div className="flex gap-4 items-center justify-center">
        <p className="">count is: {count}</p>
        <MyButton onClick={inc}>inc</MyButton>
        <MyButton onClick={dec}>dec</MyButton>
        <MyButton onClick={reset}>reset</MyButton>
      </div>

      <div className="">
        <h2 className="font-bold text-2xl"></h2>
      </div>
    </Fragment>
  );
}

type MyButtonChildren = string | React.ReactElement;

interface MyButtonInterface {
  children: MyButtonChildren;
  onClick: () => void;
}

function MyButton({ children, onClick }: MyButtonInterface) {
  return <Button onClick={onClick}>{children}</Button>;
}
