import Header from "../common/Header";
import Footer from "../common/Footer";
import HomeButton from "./HomeButton";
import PostCreateForm from "./PostCreateForm";
import "../../css/community/PostCreateForm.css";

const PostCreate = () => {
  return (
    <>
      <Header />
      <HomeButton showBack={true} />
      <div className="post-create-container">
        <PostCreateForm />
      </div>
      <Footer />
    </>
  );
}
export default PostCreate;