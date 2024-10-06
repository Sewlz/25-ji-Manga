import Home from "../../components/home/home";
import Latest from "../../components/latest-upload/latest";
import PopularByGernes from "../../components/popular-by-gernes/popbygernes";

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
