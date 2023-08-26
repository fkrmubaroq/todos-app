import { ReactNode } from "react";
import { createPortal } from "react-dom";
type PortalInterface = {
  children: ReactNode;
};

export default function Portal({ children }: PortalInterface) {
  return createPortal(children, document.body);
}
