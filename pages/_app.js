import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/responsive-table.css';

import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}
export default MyApp;
