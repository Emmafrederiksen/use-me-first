import axios from 'axios';

export default axios.create({
  baseURL: 'https://myfridge-backend.onrender.com/api',
  headers: {
    'Content-type': 'application/json'
  }
});