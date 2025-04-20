import Navbar from "../components/Navbar";
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "10px" }}>{children}</main>
    </>
  );
};

export default MainLayout;
