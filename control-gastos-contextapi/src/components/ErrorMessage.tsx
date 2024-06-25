import { PropsWithChildren } from "react";

// type ErrorMessageProps = {
//   children: ReactNode;
// };

export default function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <p className="bg-red-600 p-2 text-white fotn-bold text-sm text-center">
      {children}
    </p>
  );
}
