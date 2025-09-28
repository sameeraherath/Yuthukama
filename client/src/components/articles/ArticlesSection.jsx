import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Pagination, 
  Stack 
} from '@mui/material';
import ArticleCard from './ArticleCard';
import { Link } from 'react-router-dom';

// Articles about the platform's social impact
const articles = [
  {
    id: 1,
    title: 'Why Our Platform Matters: Bridging the Opportunity Gap',
    excerpt: 'Discover how our platform is creating equal opportunities for underprivileged children by connecting them with mentors and resources they wouldn\'t have access to otherwise.',
    date: 'Sep 28, 2023',
    image: 'https://source.unsplash.com/800x600/?education,equality',
  },
  {
    id: 2,
    title: 'The Ripple Effect: How Mentorship Transforms Communities',
    excerpt: 'Learn how investing in one child\'s education and mentorship creates positive change that extends to families and entire communities.',
    date: 'Sep 25, 2023',
    image: 'https://source.unsplash.com/800x600/?mentor,child',
  },
  {
    id: 3,
    title: 'Breaking the Cycle: Education as a Tool for Social Change',
    excerpt: 'Explore how access to quality education and guidance can help break the cycle of poverty for underprivileged children.',
    date: 'Sep 20, 2023',
    image: 'https://source.unsplash.com/800x600/?education,poverty',
  },
  {
    id: 4,
    title: 'The Power of Community in Child Development',
    excerpt: 'Understand how a supportive community plays a crucial role in the holistic development of children from underprivileged backgrounds.',
    date: 'Sep 18, 2023',
    image: 'https://source.unsplash.com/800x600/?community,children',
  },
  {
    id: 5,
    title: 'Digital Inclusion: Why It Matters for Underprivileged Youth',
    excerpt: 'Learn how our platform is bridging the digital divide and providing essential tech skills to children who need them most.',
    date: 'Sep 15, 2023',
    image: 'https://source.unsplash.com/800x600/?technology,children',
  },
  {
    id: 6,
    title: 'Success Stories: Lives Transformed Through Mentorship',
    excerpt: 'Heartwarming stories of children who have overcome challenges and achieved their dreams with the help of our platform\'s mentors.',
    date: 'Sep 10, 2023',
    image: 'https://source.unsplash.com/800x600/?success,graduation',
  },
];

const ArticlesSection = () => {
  const [page, setPage] = useState(1);
  const articlesPerPage = 3;
  const pageCount = Math.ceil(articles.length / articlesPerPage);
  const currentArticles = articles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }} id="articles">
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 6
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              color: 'text.primary',
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '50px',
                height: '4px',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1DBF73',
                borderRadius: '2px',
              }
            }}
          >
            Impact Stories & Insights
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}
          >
            Discover how our platform is making a difference in the lives of underprivileged children and communities through education, mentorship, and community support.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {currentArticles.map((article) => (
            <Grid item xs={12} md={4} key={article.id}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>

        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Stack spacing={2}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#1DBF73',
                    '&.Mui-selected': {
                      backgroundColor: '#1DBF73',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#169c5f',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(29, 191, 115, 0.1)',
                    },
                  },
                }}
              />
            </Stack>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            component={Link}
            to="/articles"
            sx={{
              color: '#1DBF73',
              borderColor: '#1DBF73',
              '&:hover': {
                backgroundColor: '#1DBF73',
                color: 'white',
                borderColor: '#1DBF73',
              },
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Explore More Stories
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticlesSection;
