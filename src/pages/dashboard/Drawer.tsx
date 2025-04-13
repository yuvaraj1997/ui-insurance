import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useDashboard, useDashboardDispatch } from "./context/DashboardContext";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from "react-router-dom";

const routes = [
  { label: "Dashboard", path: "", icon: <DashboardIcon /> },
  { label: "My Policies", path: "policies", icon: <ArticleIcon /> },
];

export default function DashboardDrawer() {
  const dispatch = useDashboardDispatch();
  const { showSidebar } = useDashboard();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  return (
    <Drawer anchor="left" open={showSidebar} onClose={toggleDrawer}>
      <List>
        {routes.map((path) => (
          <ListItem key={path.label} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(path.path);
                toggleDrawer();
              }}
            >
              <ListItemIcon>{path.icon}</ListItemIcon>
              <ListItemText primary={path.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
