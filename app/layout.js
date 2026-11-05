import "./globals.css";

export const metadata = {
  title: "Wrap Studio | Vehicle Preview",
  description:
    "Preview commercial vehicles from every angle and find the right finish for your fleet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
