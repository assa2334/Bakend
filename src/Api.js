
import axios from 'axios';


let url = 'http://localhost:9000/api/v8'
const storedUser = localStorage.getItem('user');

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
  let requestOptions = {
    method: "POST",
    url: apiUrl,
    headers: headers,
    data: JSON.stringify(data),
  };
  
  try {
    let response = await axios(requestOptions);
    return  response;
  } catch (error) {
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
  let requestOptions = {
    method: "POST",
    url: apiUrl,
    headers: headers,
    data: JSON.stringify(data),
  };
  
  try {
    let response = await axios(requestOptions);
    return  response;
  } catch (error) {
    console.error(error.response.status, error.response.data, "api");
    return error.response.data;
  }
}


export async function UserList () {
    let apiUrl = `${url}/FindUser`;
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${JSON.parse(storedUser).Token}`,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
    };
    
    try {
      console.log(requestOptions);
      let response = await axios(requestOptions);
      console.log(response.data, "response.data");
      return  response;
    } catch (error) {
      console.error(error.response.status, error.response.data, "api");
      return error.response.data;
    }
}

//craete Conversation
export async function Conversation (props) {
    let apiUrl = `${url}/conversation`;
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${JSON.parse(storedUser).Token}`,
    };
    let data = {
      senderid:`${JSON.parse(storedUser).id}`,
      receiverid:props,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
      data: JSON.stringify(data),
    };
    
    try {
      console.log(requestOptions);
      let response = await axios(requestOptions);
      console.log(response.data, "response.data");
      return  response;
    } catch (error) {
      console.error(error.response.status, error.response.data, "api");
      return error.response.data;
    }
}

// find message
export async function messagefind (props) {
    let apiUrl = `${url}/findmessage`;
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${JSON.parse(storedUser).Token}`,
    };
    let data = {
      conversation:props,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
      data: JSON.stringify(data),
    };
    try {
      console.log(requestOptions);
      let response = await axios(requestOptions);
      console.log(response.data, "response.data");
        return  response;
    } catch (error) {
      console.error(error.response.status, error.response.data, "api");
      return error.response.data;
    }
}
// send message
export async function messageSend (props) {
    let apiUrl = `${url}/sendmessage`;
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${JSON.parse(storedUser).Token}`,
    };
    let data = {
      conversation:props.conversation,
      sender:`${JSON.parse(storedUser).id}`,
      recipient:props.recipient,
      text:props.text,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
      data: JSON.stringify(data),
    };
    
    try {
    

      console.log(requestOptions);
      let response = await axios(requestOptions);
      console.log(response.data, "response.data");
      return  response;
    } catch (error) {
      console.error(error.response.status, error.response.data, "api");
      return error.response.data;
    }
}

export async function uploadFile(props) {
  const apiUrl = `${url}/Uploadfile`; // Replace with your actual backend endpoint

  // Ensure all required fields are provided
  if (!props.conversation || !props.recipient || !props.file) {
      console.error('Missing required parameters for upload');
      return { error: 'Missing required parameters' };
  }
  

  let formData = new FormData();
  formData.append('conversation', props.conversation);
  formData.append('sender', `${JSON.parse(storedUser).id}`);
  formData.append('recipient', props.recipient);
  formData.append('file', props.file);
  formData.append('Type', props.Type);
  
  const headers = {
      Accept: '*/*',
      'Content-Type': 'multipart/form-data',
      token: `${JSON.parse(storedUser).Token}`,
  };
console.log(formData.get('file'))
  
  const requestOptions = {
      method: 'POST',
      url: apiUrl,
      headers: headers,
      data: formData,
  };

  try {
    console.log(requestOptions,'fdfdfdfdfgdfgdfd');
    
      console.log('Request Options:', requestOptions);
      const response = await axios(requestOptions);
      console.log('Response Data:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error:', error.response?.status, error.response?.data);
      return { error: error.response?.data || 'Upload failed' };
  }
}

export async function uploadVideo(props) {
  const apiUrl = `${url}/UploadVideo`;
  console.log('call api',props);
  
  // Ensure all required fields are provided
  if (!props) {
      console.error('File is required for upload');
      return { error: 'File is required' };
  }

  let formData = new FormData();
  formData.append('file', props);

  const storedUser = localStorage.getItem('user'); // Replace with your storage mechanism
  const headers = {
      Accept: '*/*',
      'Content-Type': 'multipart/form-data',
      token: `${JSON.parse(storedUser).Token}`,
  };

  try {
      console.log('Uploading video...');
      const response = await axios.post(apiUrl, formData, { headers });
      console.log('Video uploaded successfully:', response);
      return response; // Return the response from the server
  } catch (error) {
    console.log(error, "response.data");
      console.error('Error uploading video:', error.response?.status, error.response?.data);
      return { error: error.response?.data || 'Upload failed' };
  }
}
