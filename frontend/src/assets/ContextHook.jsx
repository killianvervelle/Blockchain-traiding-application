import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("No context provided");
  }
  return context;
};
