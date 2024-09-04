import Home from "../home/home";
import Latest from "../latest-upload/latest";
import PopularByGernes from "../popular-by-gernes/popbygernes";

function LandingPage() {
  return (
    <>
      <Home />
      <Latest />
      <PopularByGernes />
    </>
  );
}
export default LandingPage;
