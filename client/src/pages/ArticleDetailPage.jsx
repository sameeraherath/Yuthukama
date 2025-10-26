import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  Avatar, 
  Chip, 
  Grid,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

// In a real app, this would be fetched from an API
const articles = [
  {
    id: 1,
    title: 'Why Our Platform Matters: Bridging the Opportunity Gap',
    content: `
      <p>In today's rapidly evolving world, access to quality education and mentorship remains unevenly distributed. Millions of underprivileged children face significant barriers that limit their potential simply due to circumstances beyond their control. Our platform was born from a simple yet powerful idea: every child deserves equal opportunities to learn, grow, and succeed, regardless of their background.</p>
      
      <h3>The Current Landscape</h3>
      <p>Research consistently shows that children from underprivileged backgrounds often lack access to the resources and guidance that their more privileged peers take for granted. This opportunity gap manifests in various ways:</p>
      <ul>
        <li>Limited access to quality educational materials</li>
        <li>Fewer mentorship opportunities</li>
        <li>Lack of exposure to diverse career paths</li>
        <li>Insufficient academic support systems</li>
      </ul>

      <h3>Our Approach</h3>
      <p>Our platform addresses these challenges through a multi-faceted approach:</p>
      <ol>
        <li><strong>Mentor Matching:</strong> Connecting children with caring mentors who provide guidance and support.</li>
        <li><strong>Resource Sharing:</strong> Providing access to educational materials and learning resources.</li>
        <li><strong>Community Building:</strong> Creating a supportive network of peers and mentors.</li>
        <li><strong>Skill Development:</strong> Offering workshops and training in essential life and career skills.</li>
      </ol>

      <h3>The Impact</h3>
      <p>Since our launch, we've seen remarkable transformations:</p>
      <ul>
        <li>85% of participating students showed improved academic performance</li>
        <li>92% reported increased confidence in their abilities</li>
        <li>78% discovered new career aspirations through mentorship</li>
      </ul>

      <p>By bridging the opportunity gap, we're not just changing individual lives—we're helping to build a more equitable society where every child has the chance to reach their full potential.</p>
    `,
    date: 'Sep 28, 2023',
    author: 'Yuthukama Team',
    tags: ['Education', 'Social Impact', 'Mentorship']
  },
  // Add other articles with similar structure
];

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find(article => article.id === parseInt(id));

  if (!article) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4">Article not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#1DBF73', borderRadius: '20px' }}
        >
          Back
        </Button>

        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            {article.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <PersonIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {article.author}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon color="action" sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2" color="text.secondary">
                {article.date}
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              '& h2': { 
                mt: 4, 
                mb: 2, 
                color: 'primary.main',
                fontWeight: 'bold'
              },
              '& h3': { 
                mt: 3, 
                mb: 2,
                color: 'text.primary',
                fontWeight: '600'
              },
              '& p': { 
                mb: 3, 
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.secondary'
              },
              '& ul, & ol': {
                pl: 4,
                mb: 3,
                '& li': {
                  mb: 1,
                  lineHeight: 1.7
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {article.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                variant="outlined"
                sx={{ 
                  borderColor: '#1DBF73',
                  color: '#1DBF73',
                  '&:hover': {
                    backgroundColor: 'rgba(29, 191, 115, 0.1)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Want to make a difference?
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/register"
            sx={{
              backgroundColor: '#1DBF73',
              '&:hover': {
                backgroundColor: '#169c5f',
              },
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Join Our Community
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleDetailPage;
