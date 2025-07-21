import React from "react";
import "../../css/community/CommunityMain.css"; 
import Header from "../common/Header";
import Footer from "../common/Footer";
import PostCreateForm from "./PostCreateForm";

const CommunityMain = () => {
  return (
    <>
      <Header />
      <div className="community-container">
        <PostCreateForm />
      </div>
      <Footer />
    </>
  );
};
export default CommunityMain;
