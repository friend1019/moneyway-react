
import HomeButton from "./HomeButton";
import PostCreateForm from "./PostCreateForm";
import "../../css/community/PostCreateForm.css";

const PostCreate = () => {
  return (
    <>
      <HomeButton showBack={true} />
      <div className="post-create-container">
        <PostCreateForm />
      </div>
    </>
  );
}
export default PostCreate;