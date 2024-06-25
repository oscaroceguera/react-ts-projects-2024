import { Dispatch } from "react";
import type { MenuItem } from "../types";
import { OrderActions } from "../reducers/order-reducer";

type MenuItemProps = {
  item: MenuItem;
  dispatch: Dispatch<OrderActions>;
};

export default function MenuItem(props: MenuItemProps) {
  return (
    <button
      className="border-2 border-teal-400 w-full p-3 flex justify-between hover:bg-teal-200 rounded-lg"
      onClick={() =>
        props.dispatch({ type: "add-item", payload: { item: props.item } })
      }
    >
      <p>{props.item.name}</p>
      <p className="font-black">${props.item.price}</p>
    </button>
  );
}
