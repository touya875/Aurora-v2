import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useContext } from 'react';
import NavHeader from './components/Navigation/NavHeader';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer/Footer';
import SidebarPage from './components/AdminPage/SidebarPage';
import { Rings } from 'react-loader-spinner';
import { UserContext } from './context/UserContext';

function App() {
  // const [account, setAccount] = useState({});

  // useEffect(() => {
  //   let session = sessionStorage.getItem('account');
  //   if (session) {
  //     setAccount(JSON.parse(session));
  //   }
  // }, []);
  const { user } = useContext(UserContext);


  return (
    <>
      {user && user.isLoading ?
        <div className='flex flex-col justify-center items-center min-h-screen'>
          <Rings
            height="80"
            width="80"
            radius="9"
            color="blue"
            ariaLabel="loading"
          />
          <div>Đang tải dữ liệu...</div>
        </div>
        :
        <>
          <div className='app-header'>
            <NavHeader />
          </div>

          <div className="app-container">
            <AppRoutes />
          </div>

          <div className="app-footer">
            <Footer />
          </div>
        </>
      }


      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
