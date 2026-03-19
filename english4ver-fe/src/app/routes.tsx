import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { CoursePage } from "./pages/CoursePage";
import { UnitPage } from "./pages/UnitPage";
import { MatchPage } from "./pages/MatchPage";
import { CreateUnitPage } from "./pages/CreateUnitPage";
import { CreateCoursePage } from "./pages/CreateCoursePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/create-course",
    Component: CreateCoursePage,
  },
  {
    path: "/course/:courseId",
    Component: CoursePage,
  },
  {
    path: "/course/:courseId/create-unit",
    Component: CreateUnitPage,
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
