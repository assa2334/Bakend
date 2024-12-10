
import axios from 'axios';
let url = 'http://localhost:9000/api/v8'


// create acount 
export async function signUp(userData) {
  console.log(userData, "userData");
  let apiUrl = `${url}/adduser`;
  let headers = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let data = {
    Name: userData.Name,
    FullName: userData.FullName,
    Email: userData.Email,
    Password: userData.Password,
  };
  if(userData.img){
    data.img = userData.img;
  }

  // Create the request options
  let requestOptions = {
    method: "POST",
    url: apiUrl,
    headers: headers,
    data: JSON.stringify(data),
  };

  try {
    // Send the HTTP request to the signup API
    let response = await axios(requestOptions);
    console.log(response.data, "response.data");

    // Handle the successful response, you can customize this part
    return  response;
  } catch (error) {
    // Handle errors, similar to the login API
    console.error(error.response.status, error.response.data, "api");
    return error.response.data;
  }
}






//login user
export async function Login(userData) {
  console.log(userData, "userData");
  let apiUrl = `${url}/loginUser`;
  let headers = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let data = {
    Email: userData.Email,
    Password: userData.Password,
    email_verified:userData.email_verified || false,
  };

  // Create the request options
  let requestOptions = {
    method: "POST",
    url: apiUrl,
    headers: headers,
    data: JSON.stringify(data),
  };

  try {
    // Send the HTTP request to the signup API
    let response = await axios(requestOptions);
    console.log(response.data, "response.data");

    // Handle the successful response, you can customize this part
    return  response;
  } catch (error) {
    // Handle errors, similar to the login API
    console.error(error.response.status, error.response.data, "api");
    return error.response.data;
  }
}
