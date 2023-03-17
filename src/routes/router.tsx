import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Schedule } from "../pages/Schedule";
import { Agenda } from "../pages/Agenda";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Agenda />,
      }, {
        path: "/schedule",
        element: <Schedule />,
      },
    ],
  },
]);