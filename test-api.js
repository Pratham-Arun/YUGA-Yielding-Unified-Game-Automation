import axios from 'axios';

async function testWorldGen() {
  try {
    const response = await axios.post('http://localhost:4000/api/ai/generate-world', {
      prompt: 'A medieval village',
      models: {
        worldGen: 'gpt-4',
        npcGen: 'gpt-4',
        balancing: 'gpt-4'
      }
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

testWorldGen();
