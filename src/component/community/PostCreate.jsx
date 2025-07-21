import Header from "../common/Header";
import Footer from "../common/Footer";
import PostCreateForm from "./PostCreateForm";

const containerStyle = {
  minHeight: "66rem",
  padding: "2rem",
  backgroundColor: "#F6F6F6",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const PostCreate = () => {
  return (
    <>
      <Header />
      <div style={containerStyle}>
        <PostCreateForm />
      </div>
      <Footer />
    </>
  );
};

export default PostCreate;
