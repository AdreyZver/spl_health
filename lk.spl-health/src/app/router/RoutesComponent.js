import { Navigate, Route, Routes } from "react-router-dom";
import { CategoriesPage } from "../../pages/CategoriesPage";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { NotFound } from "../../pages/NotFound";
import { ProfilePage } from "../../pages/ProfilePage";
import { ProgramsLessonPage } from "../../pages/ProgramsLessonPage";
import { OrganizationPage } from "../../pages/OrganizationPage";
import { PersonalData } from "../../pages/PersonalData";
import { PrivacyPolicy } from "../../pages/PrivacyPolicy";
import { AuthProvider } from "../AuthProvider";
import { OpenRoutes } from "./OpenRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { OrganizationRoutes } from "./OrganizationRoutes";
import { UserRoutes } from "./UserRoutes";

const protectedRoutes = [
  {
    path: "/profile",
    element: Navigate,
    elementProps: {
      to: '/profile/programs',
      redirect: true
    }
  },
  {
    path: "/profile/:page/*",
    element: ProfilePage,
  },
  {
    element: UserRoutes,
    children: [
      {
        path: "/categories",
        element: CategoriesPage,
        children: [
          {
            path: ":categoryId",
            element: CategoriesPage
          },
          {
            path: ":categoryId/programs/:programId",
            element: CategoriesPage
          }
        ]
      },
      {
        path: "/program/:programId/:repetitor",
        element: ProgramsLessonPage
      }
    ]
  },
  {
    element: OrganizationRoutes,
    children: [
      {
        path: "/organization",
        element: OrganizationPage
      }
    ]
  },
  {
    path: "/",
    element: HomePage,
  },
  {
    path: "*",
    element: NotFound,
  },
];

const renderProtectedRoutes = (routes) => {
  return routes.map((route) => {
    if (route.children?.length) {
      return (
        <Route
          element={<route.element {...route.elementProps} />}
          path={route.path}
        >
          {renderProtectedRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        element={<route.element {...route.elementProps} />}
        path={route.path}
      />
    );
  });
}

export const RoutesComponent = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          {renderProtectedRoutes(protectedRoutes)}
        </Route>

        <Route element={<OpenRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/personal-data" element={<PersonalData />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
