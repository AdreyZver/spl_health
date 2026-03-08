import React from 'react';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { RoutesComponent } from "./app/router/RoutesComponent";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Theme preset={presetGpnDefault}>
      <BrowserRouter>
        <RoutesComponent />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </Theme>
  );
}

export default App;
