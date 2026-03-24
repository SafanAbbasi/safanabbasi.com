import ProfileHeader from "@/components/ProfileHeader";
import LinkButton from "@/components/LinkButton";
import Footer from "@/components/Footer";
import { links } from "@/data/links";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-6 py-8">
        <ProfileHeader />
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}
