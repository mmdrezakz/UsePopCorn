import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
 import './index.css';
 import App from './App';

  // import StarRating from './StarRating';

//   function Test(){
//   const [showRate,setShowRate] = useState(0)

//   return(<div>
//       <StarRating  onSetRating={setShowRate}/>
//       <p>rating in video is : {showRate}</p>
//    </div>)
//  }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <App /> 
     {/* <StarRating tedad={5} />
    <StarRating tedad={10} color='blue' />
    <StarRating tedad={8} color='red'  size={10}  /> 
    <Test /> */}
    


  </React.StrictMode>
);

