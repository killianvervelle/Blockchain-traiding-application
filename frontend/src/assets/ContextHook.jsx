import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";

/**
 * Custom hook to access the global state.
 * This hook uses the React `useContext` hook to retrieve the global state from `GlobalStateContext`.
 * 
 * @returns {object} The global state context value.
 */

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("No context provided");
  }
  return context;
};
