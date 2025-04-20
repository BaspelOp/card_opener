import LayoutWrapper from "./layoutWrapper";

export const metadata = {
  title: {
    default: "Kartičkový Svět!",
    template: "%s | Kartičkový Svět!"
  },
  description: "Objevte, sbírejte a otevírejte vzrušující balíčky karet."
};

export default function RootLayout({ children }) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
