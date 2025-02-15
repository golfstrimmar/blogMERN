import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import axios from "../API/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";

// Тип для страниц в меню
interface Page {
  name: string;
  path: string;
}

const pages: Page[] = [
  { name: "Home", path: "/" },
  { name: "Posts", path: "/posts" },
  { name: "Login", path: "/login" },
  { name: "Registration", path: "/register" },
];

const ResponsiveAppBar: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = (useState < string) | (null > null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null); // Стейт для хранения элемента меню
  const [scrollY, setScrollY] = useState<number>(0); // Стейт для хранения прокрутки страницы

  // Отслеживание прокрутки страницы
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY); // Обновляем значение прокрутки
    };
    window.addEventListener("scroll", handleScroll); // Добавляем слушатель события прокрутки
    return () => window.removeEventListener("scroll", handleScroll); // Убираем слушатель при размонтировании
  }, []);

  // Проверка состояния авторизации
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 200);
    return () => clearInterval(interval);
  }, [setIsAuthenticated]);

  // Запрос данных пользователя после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setUser(response.data.fullName); // Сохраняем данные пользователя
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated]);

  // Открытие меню
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  // Закрытие меню
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Функция для обновления состояния авторизации
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Отфильтровываем страницы для меню, убираем Login и Registration, если пользователь авторизован
  const filteredPages = pages.filter((page) => {
    if (isAuthenticated) {
      return page.name !== "Login" && page.name !== "Registration";
    }
    return true;
  });

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: scrollY > 50 ? "#033362D3" : "rgb(3,51,98)",
        transition: "background-color 0.3s ease", // Плавное изменение фона
        boxShadow: scrollY > 50 ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none", // Тень при прокрутке
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {filteredPages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    <Link
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {page.name}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {filteredPages.map((page) => (
              <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                <Typography sx={{ textAlign: "center" }}>
                  <Link
                    to={page.path}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "1.2rem",
                    }}
                  >
                    {page.name}
                  </Link>
                </Typography>
              </MenuItem>
            ))}
          </Box>
          {isAuthenticated && user && (
            <Typography
              variant="body2"
              color="white"
              sx={{ marginRight: "20px" }}
            >
              Hallo,
              <Typography variant="h5" color="white">
                {user}
              </Typography>
            </Typography>
          )}
          {isAuthenticated && (
            <Button variant="outlined" color="white" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
