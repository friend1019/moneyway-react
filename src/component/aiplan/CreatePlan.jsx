import Header from "../common/Header";
import Footer from "../common/Footer";
import PlanFormSection from "./PlanFormSection";
import "../../css/aiplan/CreatePlan.css";

const CreatePlan = () => {

  return (
    <>
      <Header />
      <div className="create-plan-container">
        <PlanFormSection />
      </div>
      <Footer />
    </>
  );
};

export default CreatePlan;
