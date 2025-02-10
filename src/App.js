import React from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home/Home.jsx";
import Add from "./pages/Add/AddGig.jsx";
import Messages from "./pages/MyMessages/MyMessage.jsx";
import Message from "./pages/Message/Message.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import Login from "./pages/login/Login.jsx";
import CategoryModal from "./pages/SignUp/SelectCategories";
import SkillModal from "./pages/SignUp/SelectSkills";
import BudgetLinkedinModal from "./pages/SignUp/BudgetLinkedin";
import MyGigs from "./pages/MyGigs/MyGig.jsx";
import MyGig from "./pages/MyGig/MyGig.jsx";
import ClientIntro from "./pages/ClientIntro/Intro.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext.jsx";
import { toast, Toaster } from "react-hot-toast";
import ViewGigs from "./pages/ViewGigs/ViewGigs.jsx";
import ViewAllGigs from "./pages/ViewAllGigs/Gig.jsx";
import ViewGig from "./pages/ViewGig/ViewGig.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import Order from "./pages/MyOrder/MyOrder.jsx";
import ViewOrder from "./pages/ViewOrder/ViewOrder.jsx";
import ProfilePage from "./pages/MyProfile/MyProfile.jsx";
import styles from "./App.module.css";
import MainDashboard from "./pages/MyProfile/MainDashboard.jsx";
import ProfileAbout from "./pages/MyProfile/ProfileAbout.jsx";
import RatingsActivity from "./pages/MyProfile/Activity.jsx";
import OrdersActivity from "./pages/MyProfile/OrderActivity.jsx";
import MyClientProfile from "./pages/ClientProfile/ClientProfile.jsx";
import ClientOrders from "./pages/ClientProfile/ClientOrders.jsx";
import ClientRatings from "./pages/ClientProfile/ClientRatings.jsx";
import CreatePosting from "./pages/CreatePosting/CreatePosting.jsx";
import JobBoard from "./pages/ClientJobBoard/ClientJobBoard.jsx";
function App() {
  const Layout = () => {
    return (
      <div className={styles.App}>
        {/* Your app content */}

        <Toaster
          toastOptions={{
            position: "bottom-center",
            style: {
              backgroundColor: "#333",
              color: "#fff",
              padding: "16px",
              fontSize: "14px",
              borderRadius: "8px",

              zIndex: 9999, // Ensure the toast is above modal
            },
            success: {
              duration: 7000,
              style: {
                backgroundColor: "#4caf50",
                color: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                backgroundColor: "#dc3545",
                color: "#fff",
              },
            },
          }}
        />

        <div className={styles.pageContainer}>
          <Navbar />

          <main>
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gig/:id",
          element: <MyGig />,
        },
        {
          path: "/orders",
          element: <Order />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/signUp",
          element: <SignUp />,
          children: [
            {
              path: "selectCategory",
              element: <CategoryModal />,
            },
            {
              path: "selectSkill",
              element: <SkillModal />,
            },
            {
              path: "selectBudget",
              element: <BudgetLinkedinModal />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/clientIntro",
          element: <ClientIntro />,
        },
        {
          path: "/viewGigs",
          element: <ViewGigs />,
        },
        {
          path: "/viewAllGigs",
          element: <ViewAllGigs />,
        },
        {
          path: "/viewGig/:id",
          element: <ViewGig />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
        {
          path: "/order/:id",
          element: <ViewOrder />,
        },
        {
          path: "/myFreelancerProfile",
          element: <ProfilePage />,
          children: [
            {
              path: "",
              element: <MainDashboard />,
            },
            {
              path: "about",
              element: <ProfileAbout />,
            },
            {
              path: "ratings",
              element: <RatingsActivity />,
            },
            {
              path: "orders",
              element: <OrdersActivity />,
            },
          ],
        },
        {
          path: "/myClientProfile",
          element: <MyClientProfile />,
          children: [
            {
              path: "",
              element: <MainDashboard />,
            },
            {
              path: "about",
              element: <ProfileAbout />,
            },
            {
              path: "ratings",
              element: <ClientRatings />,
            },
            {
              path: "orders",
              element: <ClientOrders />,
            },
          ],
        },
        {
          path: "/createJobPosting",
          element: <CreatePosting />,
        },
        {
          path: "/clientJobs",
          element: <JobBoard />,
        },
      ],
    },
    {},
  ]);
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
