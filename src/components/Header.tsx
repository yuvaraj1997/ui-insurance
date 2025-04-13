import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useDashboard, useDashboardDispatch } from "../pages/dashboard/context/DashboardContext";
import { api } from "../utils/api";

const settings = ["Profile", "Logout"];

export default function Header() {
  const dispatch = useDashboardDispatch();
    const { user } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  const handleLoginClick = () => {
    navigate("/auth/login");
  };
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingOptions = async (setting: string) => {

    if (setting == "Logout") {
      await api.logout()
      dispatch({type: "RESET_USER_DATA"})
      navigate("/auth/login")
      return
    } else if (setting == "Profile") {
      navigate("/dashboard/profile")
      return
    }
    setAnchorElUser(null);
  };


  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) {
      return
    }

    const fetchOwnProfile = async () => {
      try {
        const result = await api.ownProfile()

        if (result?.success) {
          dispatch({
            type: "SET_USER_DATA",
            payload: result.data,
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    fetchOwnProfile()
  }, [pathname, dispatch])

  if (pathname.startsWith("/auth")) {
    return <></>;
  }

  if (pathname.startsWith("/dashboard")) {
    return (
      <AppBar position="static" sx={{ marginBottom: "20px" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEBAR" });
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            sx={(theme) => ({
              bgcolor: theme.palette.grey[100],
              mx: "10px",
            })}
            onClick={() => {
              navigate("dashboard/policies/new");
            }}
          >
            + New Policy
          </Button>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.firstName} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleSettingOptions(setting)}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" sx={{ marginBottom: "10px" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Insurance App
        </Typography>
        <Button color="inherit" onClick={handleLoginClick}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
