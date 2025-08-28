import { Avatar, Box, Button, Container, Typography, Divider, Chip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Google, GitHub, Logout } from '@mui/icons-material';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Determine which provider was used
  const provider = user.avatar_url ? 'GitHub' : 'Google';
  const providerIcon = provider === 'GitHub' ? <GitHub /> : <Google />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        {/* User Avatar Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={user.picture || user.avatar_url}
            sx={{ 
              width: 120, 
              height: 120,
              mb: 2
            }}
          />
          <Chip
            icon={providerIcon}
            label={`Signed in with ${provider}`}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>

        {/* User Info Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {user.name || user.login}
          </Typography>
          
          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
              {user.email || 'No email provided'}
            </Typography>
          </Box>

          {/* Additional Info Section - Dynamic based on provider */}
          {provider === 'GitHub' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                GitHub Profile
              </Typography>
              <Typography variant="body1">
                <a 
                  href={`https://github.com/${user.login}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'inherit' }}
                >
                  github.com/{user.login}
                </a>
              </Typography>
            </Box>
          )}

          {/* Logout Button */}
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            startIcon={<Logout />}
            fullWidth
            sx={{ mt: 3 }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;