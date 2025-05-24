import axios from 'axios';

export const checkLoginStatus = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/check-auth', {withCredentials: true});
    return res.data.loggedIn
  } catch(err) {
    console.log('not logged in!')
  }
}

export const getUsername = async (id) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/users/${id}`, {withCredentials: true});

    if(res.data.success){
      return res.data.username;
    } else {
      console.warn(`user with id ${id} not found`);
    }
  } catch (err) {
    console.log(err)
  }
}

export const getColor = async (id) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/colors/${id}`, {withCredentials: true})
    if (res.data.success) {
      return res.data.color;
    } else {
      console.warn(`color of user with id ${id} not found`)
    }
  } catch (err){
    console.log(err)
  }

}
