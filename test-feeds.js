// Simple test script to verify the feed endpoints work
const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testFeeds() {
  try {
    console.log('Testing feed endpoints...');
    
    // Test For You endpoint
    console.log('\n1. Testing /api/posts/for-you endpoint...');
    const forYouResponse = await axios.get(`${API_BASE}/api/posts/for-you`, {
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer test-token' // This will fail auth but we can see if endpoint exists
      }
    });
    console.log('✅ For You endpoint exists and responds');
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ For You endpoint exists (auth required as expected)');
    } else {
      console.log('❌ For You endpoint error:', error.message);
    }
  }

  try {
    // Test Following endpoint
    console.log('\n2. Testing /api/posts/following endpoint...');
    const followingResponse = await axios.get(`${API_BASE}/api/posts/following`, {
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer test-token' // This will fail auth but we can see if endpoint exists
      }
    });
    console.log('✅ Following endpoint exists and responds');
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Following endpoint exists (auth required as expected)');
    } else {
      console.log('❌ Following endpoint error:', error.message);
    }
  }

  console.log('\n✅ Feed endpoints test completed!');
}

testFeeds().catch(console.error);

