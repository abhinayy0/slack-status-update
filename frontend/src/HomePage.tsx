import React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import BasicTable from "./TableComp";

interface HomeProps {
  // Define any props here if needed
}

const HomePage: React.FC<HomeProps> = () => {
  return (
    <div>
      <ResponsiveAppBar />
      <BasicTable />
    </div>
  );
};

export default HomePage;
