const API_URL = "http://localhost:4000/users";

const createUserAPI = async (userData) => {
  const response = await axios.post(API_URL, userData);
  console.log('create user response', response);
  return response.data;
};


const getAllUsersAPI = async () => {
  const response = await axios.get(API_URL);
  console.log('getAllUsersAPI', response);
  return response.data;
};


const deleteUserAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  console.log('delete user response', response);
  return response.data;
};


const updateUserAPI = async (id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  console.log("update user response", response);
  return response.data;
};
