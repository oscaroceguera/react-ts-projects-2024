import { useContext } from "react";
import { ActivityContext } from "../context/ActivityContent";

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context)
    throw new Error(
      "el hook useActivty debe ser utilizado en un ActivityPrivider"
    );

  return context;
};
