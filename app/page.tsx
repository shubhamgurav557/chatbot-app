import LandingLayout from "./landing/layout";
import LandingPage from "./landing/page";

export default function Home() {
  return (
    <>
      <LandingLayout>
        <LandingPage />
      </LandingLayout>
    </>
  );
}
