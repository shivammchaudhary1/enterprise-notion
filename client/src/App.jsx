import React from "react";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./allRoutes/AllRoutes";
import AuthProvider from "./components/auth/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <AllRoutes />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
