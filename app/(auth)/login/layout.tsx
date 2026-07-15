import { Toaster } from "react-hot-toast";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="overflow-hidden">
      <body className="overflow-hidden">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
        {children}
      </body>
    </html>
  );
}