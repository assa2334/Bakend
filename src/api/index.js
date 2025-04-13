
import axios from 'axios';


let url = 'http://localhost:9000/api/v8'




 function storedUser() {
  const token = JSON.parse(localStorage.getItem('user'));
  return token;
}
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
    console.log(data, "data");
    // console.log(requestOptions, "requestOptions");
    return  response;
  } catch (error) {
    console.log(error.response.status, error.response.data, "api");
    return error.response.data;
  }
}

export async function emailverify(userData) {
  console.log(userData, "userData");
  let token  =await storedUser();
  let apiUrl = `${url}/emailverify`; // Correct API endpoint
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };


  let data = {
    Email:token.Email, 
    otp: userData,  
  };

  let requestOptions = {
    method: "POST",
    headers: headers,
    data: JSON.stringify(data),
    url: apiUrl,
  };

  try {
    console.log(requestOptions);
    console.log(data, "data");
    
    
    let response = await axios(requestOptions);
    return response;
  } catch (error) {
    console.error(error.response?.status, error.response?.data, "API Error");
    return error.response?.data || "An error occurred";
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
    let value =await storedUser();
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${value.Token}`,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
    };
    console.log(value.Token, "value.Token");
    
    
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

export async function UserListforadmin () {
    let apiUrl = `${url}/getUser`;
    let value =await storedUser();
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${value.Token}`,
    };
    let requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: headers,
    };
    console.log(value.Token, "value.Token");
    
    
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
    let value = await storedUser();
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${value.Token}`,
    };
    let data = {
      senderid:`${value.id}`,
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
    let value =await storedUser();
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${value.Token}`,
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
    let value =await storedUser();
    let headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "token":`${value.Token}`,
    };
    let data = {
      conversation:props.conversation,
      sender:`${value.id}`,
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
    console.log(props, "hello subhan");
    
  // Ensure all required fields are provided
  // if (!props.conversation || !props.recipient || !props.file) {
  //     console.error('Missing required parameters for upload');
  //     return { error: 'Missing required parameters' };
  // }
  
  const user = storedUser(); 
  const formData = new FormData();
  formData.append('conversation', props.conversation);
  formData.append('sender', `${user.id}`);
  formData.append('recipient', props.recipient);
  formData.append('file', props.file);
  formData.append('Type', props.Type);
  
  const headers = {
      Accept: '*/*',
      'Content-Type': 'multipart/form-data',
      token: `${user.Token}`,
  };
console.log(formData.get('file'),"hello subhan")
  
  const requestOptions = {
      method: 'POST',
      url: apiUrl,
      headers: headers,
      data: formData,
  };

  try {
      console.log('hello subhan', requestOptions);
      const response = await axios(requestOptions);
      console.log('hello subhan', response.data);
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
