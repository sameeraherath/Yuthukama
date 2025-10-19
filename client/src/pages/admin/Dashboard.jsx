import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Pagination,
  InputAdornment,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PostAdd as PostAddIcon,
  Message as MessageIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import axios from "axios";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User management state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchUsers();
    } else if (activeTab === 2) {
      fetchAnalytics();
    }
  }, [activeTab, currentPage, searchTerm, roleFilter, verifiedFilter]);

  const initializeDashboard = async () => {
    try {
      await fetchDashboardData();
      setLoading(false);
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      setError(error.message || "Failed to initialize dashboard");
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Dashboard data error:", err);
      setError(err.response?.data?.message || "Error fetching dashboard data");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(verifiedFilter !== 'all' && { verified: verifiedFilter }),
      });

      const response = await axios.get(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Users fetch error:", err);
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/analytics?period=30d", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.response?.data?.message || "Error fetching analytics");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const updateUser = async (userId, updateData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh users list
      await fetchUsers();
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Update user error:", err);
      setError(err.response?.data?.message || "Error updating user");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh users list
      await fetchUsers();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete user error:", err);
      setError(err.response?.data?.message || "Error deleting user");
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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="User Management" />
        <Tab label="Analytics" />
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 0 && stats && <OverviewTab stats={stats} />}
      
      {/* User Management Tab */}
      {activeTab === 1 && (
        <UserManagementTab
          users={users}
          pagination={pagination}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          verifiedFilter={verifiedFilter}
          setVerifiedFilter={setVerifiedFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      )}
      
      {/* Analytics Tab */}
      {activeTab === 2 && analytics && <AnalyticsTab analytics={analytics} />}

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        user={selectedUser}
        onSave={updateUser}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        user={selectedUser}
        onConfirm={deleteUser}
      />
    </Box>
  );
};

// Enhanced Statistics Cards Component
const OverviewTab = ({ stats }) => (
  <Box>
    {/* Enhanced Statistics Cards */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3,
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <PeopleIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h6" color="text.primary">Total Users</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
            {stats.totalUsers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            +{stats.newUsersThisWeek} this week
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3,
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <TrendingUpIcon sx={{ mr: 1, fontSize: 28, color: 'success.main' }} />
            <Typography variant="h6" color="text.primary">Active Users</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'success.main' }}>
            {stats.activeUsers}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3,
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <PostAddIcon sx={{ mr: 1, fontSize: 28, color: 'info.main' }} />
            <Typography variant="h6" color="text.primary">Total Posts</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'info.main' }}>
            {stats.totalPosts}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            +{stats.newPostsToday} today
          </Typography>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3,
          textAlign: 'center',
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <MessageIcon sx={{ mr: 1, fontSize: 28, color: 'warning.main' }} />
            <Typography variant="h6" color="text.primary">Avg. Engagement</Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: 'warning.main' }}>
            {stats.avgEngagement}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Likes + Comments
          </Typography>
        </Card>
      </Grid>
    </Grid>

    {/* Additional Stats Row */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 2, 
          textAlign: "center",
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <VerifiedIcon sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6" color="text.primary">Verified Users</Typography>
          </Box>
          <Typography variant="h4" color="success.main">{stats.verifiedUsers}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 2, 
          textAlign: "center",
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h6" color="text.primary">Unverified</Typography>
          </Box>
          <Typography variant="h4" color="warning.main">{stats.unverifiedUsers}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 2, 
          textAlign: "center",
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Typography variant="h6" color="text.primary">Total Messages</Typography>
          <Typography variant="h4" color="text.primary">{stats.totalMessages}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 2, 
          textAlign: "center",
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}>
          <Typography variant="h6" color="text.primary">Total Views</Typography>
          <Typography variant="h4" color="text.primary">{stats.totalViews}</Typography>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// User Management Tab Component
const UserManagementTab = ({
  users,
  pagination,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  verifiedFilter,
  setVerifiedFilter,
  currentPage,
  setCurrentPage,
  onEditUser,
  onDeleteUser
}) => (
  <Box>
    {/* Search and Filters */}
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ minWidth: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Role</InputLabel>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="user">Users</MenuItem>
          <MenuItem value="admin">Admins</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Verified</InputLabel>
        <Select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Verified</MenuItem>
          <MenuItem value="false">Unverified</MenuItem>
        </Select>
      </FormControl>
    </Box>
    
    {/* Users Table */}
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Posts</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={user.profilePicture} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user.username || user.name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.stats?.followers || 0} followers
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip 
                  label={user.role} 
                  color={user.role === 'admin' ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={user.isEmailVerified ? 'Verified' : 'Unverified'}
                  color={user.isEmailVerified ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>
              <TableCell>{user.stats?.posts || 0}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEditUser(user)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDeleteUser(user)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Pagination */}
    {pagination.totalPages > 1 && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pagination.totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>
    )}
  </Box>
);

// Analytics Tab Component
const AnalyticsTab = ({ analytics }) => (
  <Grid container spacing={3}>
    {/* User Growth Chart */}
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>User Growth</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Grid>
    
    {/* Post Activity Chart */}
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Post Activity</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.postActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="posts" fill="#8884d8" name="Posts" />
            <Bar dataKey="totalLikes" fill="#82ca9d" name="Likes" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Grid>
    
    {/* Content Types Pie Chart */}
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Content Types</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.contentTypes}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {analytics.contentTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </Grid>

    {/* Top Users Table */}
    <Grid item xs={12} md={6}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Top Users by Activity</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Posts</TableCell>
                <TableCell>Likes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.topUsers.slice(0, 5).map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={user.profilePicture} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2">{user.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.postCount}</TableCell>
                  <TableCell>{user.totalLikes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  </Grid>
);

// Edit User Dialog Component
const EditUserDialog = ({ open, onClose, user, onSave }) => {
  const [role, setRole] = useState(user?.role || 'user');
  const [isEmailVerified, setIsEmailVerified] = useState(user?.isEmailVerified || false);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setIsEmailVerified(user.isEmailVerified);
    }
  }, [user]);

  const handleSave = () => {
    onSave(user._id, { role, isEmailVerified });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={isEmailVerified}
                onChange={(e) => setIsEmailVerified(e.target.checked)}
              />
            }
            label="Email Verified"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete User Dialog Component
const DeleteUserDialog = ({ open, onClose, user, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(user._id);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete user "{user?.username}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDashboard;
