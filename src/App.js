import { Routes, Route, Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//users
import Navbar from './components/users/Navbar';
import Footer from './components/users/Footer';
import Home from './routes/users/Home';
import Product from './routes/users/Product';
import Detail from './routes/users/Detail';
import Cart from './routes/users/Cart';
import Login from './routes/users/Login';
import Register from './routes/users/Register';
import OrderInformation from './routes/users/OrderInformation';
import Coupon from './routes/users/Coupon';
import Payment from './routes/users/Payment';
import CompleteOrder from './routes/users/CompleteOrder';
import InfoCustomer from './routes/users/InfoCustomer';
import ChangePassword from './routes/users/ChangePassword';
import OrderManagement from './routes/users/OrderManagement';
import OrderDetail from './routes/users/OrderDetail';
import Search from './routes/users/Search';
//admin
import HomeAdmin from './routes/admin/HomeAdmin';
import ProductManagement from './routes/admin/ProductAdmin';
import OrderAdmin from './routes/admin/OrderAdmin';
import OrderDetailAdmin from './routes/admin/OrderDetailAdmin';
import UserAdmin from './routes/admin/UserAdmin';
import BlackList from './routes/admin/BlackList';
//Pgae404
import PageDoseNotExist from './routes/Page_Does_Not_Exist/PageDoseNotExist';

function App() {
  const [orderCount, setOrderCount] = useState(0);
  const [orderid, setOrderid] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [isAtTop, setIsAtTop] = useState(true);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const Avatar = useCallback(async () => {
    await axios.get(`http://localhost:1234/user-by-username/${username}`)
      .then(res => {
        if (res) {
          setAvatar(res.data[0].avatar);
        } else {
          setAvatar('');
        }
      }).catch(err => console.log(err));
  }, [username]);
  useEffect(() => {
    Avatar()
  }, [Avatar]);
  const Name = useCallback(async () => {
    await axios.get(`http://localhost:1234/user-by-username/${username}`)
      .then(res => {
        if (res && res.data) {
          setName(res.data[0].name);
        } else {
          setName(``);
        }
      }).catch(err => console.log(err));
  }, [username]);
  useEffect(() => {
    Name();
  }, [Name]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setIsAtTop(false);
      } else {
        setIsAtTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const getOrderID = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:1234/check-order-exist/${username}`);
      if (res.data && res.data.length > 0) {
        setOrderid(res.data[0].orderid);
      } else {
        await axios.get(`http://localhost:1234/add-order/${username}`)
          .then(addorder => {
            if (addorder) {
              setOrderid(addorder.data.orderid);
            } else {
              setOrderid('');
            }
          }).catch(errAddOrder => console.log(errAddOrder));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [username]);
  useEffect(() => {
    getOrderID();
  }, [getOrderID]);
  useEffect(() => {
    axios.get('http://localhost:1234/')
      .then(res => {
        if (res.data.success === true) {
          setRole(res.data.role);
          setUsername(res.data.username);
        } else {
          setRole('');
          setUsername('');
        }
      })
  }, [role, username]);
  const fetchData = async () => {
    try {
      if (orderid) {
        const response = await axios.get('http://localhost:1234/orderdetail-quantity/' + orderid);
        if (response && response.data.length > 0) {
          setOrderCount(response.data[0].ordercount);
        }
      } else {
        setOrderCount(0);
      }
    } catch (error) {
      console.error('Error fetching order quantity:', error);
    }
  };
  useEffect(() => {
    fetchData();
  });
  return (
    <>
      <div className='all-app'>
        <Navbar name={name} avatar={avatar} role={role} />
        <div className='routes'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/product' element={<Product scrollToTop={handleScrollToTop} />} />
            <Route path='/product/:id/:typeid/:categoryid/:colorid/:memoryid' element={<Detail updateQuantityOrderDetail={fetchData} scrollToTop={handleScrollToTop} />} />
            <Route path='/cart' element={<Cart updateQuantityOrderDetail={fetchData} />} />
            <Route path='/order-information' element={<OrderInformation getOrderID={getOrderID} orderid={orderid} />} />
            <Route path='/coupon' element={<Coupon orderid={orderid} />} />
            <Route path='/payment' element={<Payment updateQuantityOrderDetail={fetchData} />} />
            <Route path='/complete-order' element={<CompleteOrder />} />
            <Route path='/info-customer' element={<InfoCustomer username={username} updateName={Name} updateAvatar={Avatar} />} />
            <Route path='/change-password' element={<ChangePassword username={username} />} />
            <Route path='/order-management' element={<OrderManagement username={username} />} />
            <Route path='/order-detail' element={<OrderDetail updateQuantityOrderDetail={fetchData} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            {
              role === 1 && username === 'admin' && (
                <>
                  <Route path='/admin' element={<HomeAdmin />} />
                  <Route path='/product-admin' element={<ProductManagement />} />
                  <Route path='/order-admin' element={<OrderAdmin />} />
                  <Route path='/order-detail-admin' element={<OrderDetailAdmin scrollToTop={handleScrollToTop} />} />
                  <Route path='/user-admin' element={<UserAdmin />} />
                  <Route path='/blacklist' element={<BlackList />} />
                </>
              )
            }
            <Route path='*' element={<PageDoseNotExist />} />
          </Routes>
          {
            username !== '' ? (
              <Link to='/cart'>
                <div className='shopping-cart'>
                  <i className="fa-solid fa-cart-shopping fa-beat"></i>
                  {orderCount >= 0 && (
                    <span className="product-count-overlay">
                      {orderCount}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <></>
            )
          }
          <div className={`scroll-to-top ${isAtTop ? 'hidden' : 'visible'}`}>
            <button
              className={`scroll-to-top-button`}
              onClick={handleScrollToTop}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
        <Footer />
      </div>

      <ToastContainer className='toast-container'
        position="top-center"
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