import Footer from "../components/sections/Footer";
import Navbar from "../components/Navbar";
import { Tab, Tabs } from "../components/Tabs";

const UserHistoryPage = () => {
  return (
    <div className="flex flex-col space-y-4 h-screen w-screen justify-between">
      <Navbar />
      <div className="container mx-auto justify-self-start h-full">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-semibold text-md md:text-xl  text-primary-900">
            You can checkout the the payment and exams History you have made.
          </h2>
          <Tabs>
            <Tab label="Exams">
              <h4>EXAMS HISTORY</h4>
            </Tab>
            <Tab label="Payment">
              <h4>PAYMENT HISTORY</h4>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserHistoryPage;
