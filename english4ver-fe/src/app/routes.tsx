import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { CoursePage } from "./pages/CoursePage";
import { UnitPage } from "./pages/UnitPage";
import { MatchPage } from "./pages/MatchPage";
import { CreateSetPage } from "./pages/CreateSetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/create",
    Component: CreateSetPage,
  },
  {
    path: "/course/:courseId",
    Component: CoursePage,
  },
  {
    path: "/unit/:courseId/:unitId",
    Component: UnitPage,
  },
  {
    path: "/unit/:courseId/:unitId/match",
    Component: MatchPage,
  },
]);
