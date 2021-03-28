import React, {useEffect} from "react";
import axios from 'axios';
import {withRouter} from 'react-router-dom';
function LandingPage(props) {

  useEffect(() => {
    axios.get('/api/hello')
    .then(response => console.log(response.data))
  }, [] )

const onClickHandler = () => {
  axios.get('/api/users/logout')
  .then(response => {
      if(response.data.success) {
        //hostory는  react-router-dom 의 withRouter이게 있어야 사용가능
        props.history.push("/login")
      } else {
        alert('Failed to logout');
      }
  })
}

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}
    >
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>
        Log out!
      </button>
    </div>
  );
}

export default withRouter(LandingPage);
