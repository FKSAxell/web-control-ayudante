import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Notifications from "@material-ui/icons/Notifications";
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UsuariosPage from "views/Usuarios/Usuarios";
import FacultadesPage from "views/Faculltades/Facultades";
import {House} from "@material-ui/icons";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Perfil de Usuario",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "Clases",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Recursos",
    icon: LibraryBooks,
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Notificationes",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: Person,
    component: UsuariosPage,
    layout: "/admin",
  },
  {
    path: "/facultades",
    name: "Facultades",
    icon: House,
    component: FacultadesPage,
    layout: "/admin",
  },
];

export default dashboardRoutes;
