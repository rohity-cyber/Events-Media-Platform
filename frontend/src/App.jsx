import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import RoleDashboard from "./pages/RoleDashboard";

import Events from "./pages/Events";
import Albums from "./pages/Albums";

import Gallery from "./pages/Gallery";
import MediaUpload from "./pages/MediaUpload";

import Search from "./pages/Search";

import Notifications from "./pages/Notifications";
import ActivityFeed from "./pages/ActivityFeed";

import Profile from "./pages/Profile";
import MyPhotos from "./pages/MyPhotos";
import Favourites from "./pages/Favourites";

import AdminUsers from "./pages/AdminUsers";
import Moderation from "./pages/Moderation";

import AccessDenied from "./pages/AccessDenied";

import SharedMedia
from "./pages/SharedMedia";

import ProtectedRoute
from "./components/ProtectedRoute";

import RoleRoute
from "./components/RoleRoute";

function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/shared/:id"
          element={<SharedMedia />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/role-dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <RoleRoute
              roles={[
                "admin",
                "photographer"
              ]}
            >
              <Events />
            </RoleRoute>
          }
        />

        <Route
          path="/albums"
          element={
            <RoleRoute
              roles={[
                "admin",
                "photographer"
              ]}
            >
              <Albums />
            </RoleRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <RoleRoute
              roles={[
                "admin",
                "photographer"
              ]}
            >
              <MediaUpload />
            </RoleRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <RoleRoute
              roles={[
                "admin"
              ]}
            >
              <ActivityFeed />
            </RoleRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-photos"
          element={
            <ProtectedRoute>
              <MyPhotos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <RoleRoute
              roles={[
                "admin"
              ]}
            >
              <AdminUsers />
            </RoleRoute>
          }
        />

        <Route
          path="/moderation"
          element={
            <RoleRoute
              roles={[
                "admin"
              ]}
            >
              <Moderation />
            </RoleRoute>
          }
        />

        <Route
          path="/access-denied"
          element={
            <ProtectedRoute>
              <AccessDenied />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;