import Navbar from "../components/Navbar";
import GlobalLoadingSpinner from "../components/GlobalLoadingSpinner";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <GlobalLoadingSpinner />
      <main style={{ paddingTop: "10px" }}>{children}</main>
    </>
  );
};

export default MainLayout;
