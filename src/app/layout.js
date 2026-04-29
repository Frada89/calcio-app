import "./globals.css";

export const metadata = {
  title: "Il Pallone — Calcio Live",
  description: "Notizie, risultati, classifiche, fantacalcio e radio sportiva",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
