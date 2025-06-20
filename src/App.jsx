
import { useEffect } from "react";
import { Route, Routes } from "react-router";
import { routes } from "./routes";
import DashboardLayoutNavigationLinks from "./Layout/DashboardLayoutNaviagtionLinks";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { browserSessionPersistence, getAuth, setPersistence, signOut } from "firebase/auth";
import { app } from "./firebase";

const App = () => {
  const auth = getAuth(app);
  setPersistence(auth, browserSessionPersistence);


useEffect(() => {
  const handleTabClose = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const logoutTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    console.log(logoutTime)
    const date = new Date().toISOString().split("T")[0];
    const docPath = `Attendance/${user.uid}_${date}`;
    console.log(docPath)
    const projectId = app.options.projectId;
    console.log(projectId)
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}?updateMask.fieldPaths=logoutTime&currentDocument.exists=true`;
console.log(url)
    const data = {
      fields: {
        logoutTime: { stringValue: logoutTime },
      },
    };

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    const token = await user.getIdToken();

    navigator.sendBeacon(
      `${url}&access_token=${token}`,
      blob
    );
  };

  window.addEventListener("unload", handleTabClose);

  return () => {
    window.removeEventListener("unload", handleTabClose);
  };
}, []);

  return (
    <div>
      <Routes>
        {routes.map((item, index) => {
          const routeElement = item.element;
          const needsLayout = [
            "/Dashboard", "/user/:userId", "/LeaveForm", , "/ratings/:userId",
            "/AdminLeaveQueue", "/", "/MyAttendance", "/PaidHolidays","yourPerformance","/RulesAndRegulations"
          ].includes(item.path);

          return (
            <Route
              key={index}
              path={item.path}
              element={
                needsLayout ? (
                  <DashboardLayoutNavigationLinks>
                    {routeElement}
                  </DashboardLayoutNavigationLinks>
                ) : (
                  routeElement
                )
              }
            />
          );
        })}
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;


// AdminLeaveQueue
// dashboard
// dashboardlayoutnavigation