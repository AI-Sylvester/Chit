// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import ChitCloseForm from './components/ChitcloseForm';
import CustomerForm from './components/CustomerForm';
import LoginPage from './components/LoginPage';
import Homepage from './components/Homepage';
import ChitIdForm from './components/ChitIdForm';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Routes under layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="home" element={<Homepage />} />
                <Route path="customer" element={<CustomerForm />} />
                <Route path="transaction" element={<TransactionForm />} />
                <Route path="chitclose" element={<ChitCloseForm />} />
                <Route path="chitids" element={<ChitIdForm />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
