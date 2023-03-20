import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Agenda } from "../pages/Agenda";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Agenda />,
      }
    ],
  },
]);