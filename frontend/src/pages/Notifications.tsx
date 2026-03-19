import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationCenter from "../components/NotificationCenter";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <NotificationCenter />
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;