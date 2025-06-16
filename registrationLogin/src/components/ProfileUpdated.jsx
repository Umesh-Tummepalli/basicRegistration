import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Card from './Card';
const ProfileUpdated = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState([])
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to login if no token
      return;
    }
    const fetchData = async () => {
          try {
            // You can add a token verification endpoint or just check if token exists
            const response = await axios.get('http://localhost:3000/api/products', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log(response.data)
            setdata(response.data.products);
          } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            navigate('/');
          }
        };
        fetchData();
  }, [navigate]);
  return (
     <div  clasName="text-black flex items-center w-full ">
        {
            data.map((item,index)=>{
                return(
                    <Card key={index} id={item.id} thumbnail={item.thumbnail} title={item.title} description={item.description}/>
                )
            })
        }
    </div>
  );
};

export default ProfileUpdated;