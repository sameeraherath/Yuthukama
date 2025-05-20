import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkUserSession } from "../../features/auth/authAPI";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // First check if we have a valid session
        const sessionResult = await dispatch(checkUserSession()).unwrap();
        console.log("Session check result:", sessionResult);

        // If admin check passes, fetch dashboard data
        await fetchDashboardData();
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        setError(error.message || "Failed to initialize dashboard");
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [dashboardStats, userStats] = await Promise.all([
        axios.get("/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/user-stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        ...dashboardStats.data,
        userGrowth: userStats.data.userGrowth,
      });
      setLoading(false);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError(err.response?.data?.message || "Error fetching dashboard data");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!stats) return null;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">{stats.activeUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">New Users</Typography>
            <Typography variant="h4">{stats.newUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Posts</Typography>
            <Typography variant="h4">{stats.totalPosts}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* User Growth Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Growth
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
