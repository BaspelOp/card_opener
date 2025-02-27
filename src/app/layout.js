import LayoutWrapper from "./layoutWrapper";

export const metadata = {
  title: "Card Opener",
  description: "Open a card",
};

export default function RootLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
