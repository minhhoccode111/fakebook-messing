import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { Fragment } from "react/jsx-runtime";
import {
  CounterStoreState,
  CounterStoreActions,
  PersonStoreState,
  PersonStoreActions,
} from "@/shared/types";
import { MyButtonInterface } from "@/shared/interfaces";

const useCounterStore = create<CounterStoreState & CounterStoreActions>(
  (set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 })),
    dec: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }),
);

const usePersonStore = create<PersonStoreState & PersonStoreActions>((set) => ({
  firstname: "",
  lastname: "",
  updateFirstname: (firstname) => set(() => ({ firstname })),
  updateLastname: (lastname) => set(() => ({ lastname })),
}));

export default function Index() {
  // zustand store
  const count = useCounterStore((state) => state.count);
  const inc = useCounterStore((state) => state.inc);
  const dec = useCounterStore((state) => state.dec);
  const reset = useCounterStore((state) => state.reset);

  const firstname = usePersonStore((state) => state.firstname);
  const lastname = usePersonStore((state) => state.lastname);
  const updateFirstname = usePersonStore((state) => state.updateFirstname);
  const updateLastname = usePersonStore((state) => state.updateLastname);

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
        <h2 className="font-bold text-2xl">Inputs</h2>
        <label>
          <p className="">Firstname</p>
          <input
            type="text"
            className=""
            value={firstname}
            onChange={(e) => updateFirstname(e.target.value)}
          />
        </label>
        <label>
          <p className="">Lastname</p>
          <input
            type="text"
            className=""
            value={lastname}
            onChange={(e) => updateLastname(e.target.value)}
          />
        </label>
      </div>
    </Fragment>
  );
}

// typescript
function MyButton({ children, onClick }: MyButtonInterface) {
  return <Button onClick={onClick}>{children}</Button>;
}
