import { Card, CardContent, Typography, Button, Box, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <Card 
      component={RouterLink}
      to={`/articles/${article.id}`}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            '&:hover': {
              color: '#1DBF73',
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }
          }}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
            {article.excerpt}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              {article.date}
            </Typography>
            <Typography 
              variant="button" 
              sx={{ 
                color: '#1DBF73', 
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                '&:hover': { 
                  color: '#169c5f',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px'
                } 
              }}
            >
              Read More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
