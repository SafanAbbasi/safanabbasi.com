import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import PreviewContent from "./PreviewContent";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export default function PreviewPage() {
  return (
    <div className={`${bricolage.variable} ${dmSans.variable}`}>
      <PreviewContent />
    </div>
  );
}
