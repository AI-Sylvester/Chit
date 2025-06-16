// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import CustomerForm from './components/CustomerForm';
import LoginPage from './components/LoginPage';
import Homepage from './components/Homepage';
import ChitIdForm from './components/ChitIdForm';
import Layout from './components/Layout';
import TodayRateManager from './components/TodayRateForm';
import ChitRegisterForm from './components/ChitRegisterForm';
import ChitRegisterList from './components/ChitRegisterList';
import ChitRegisterView from './components/ChitView';
import TransactionTable from './components/TransactionView';
import ChitRegisterTable from './components/ChitregisterTable';
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
                <Route path="chitview" element={<ChitRegisterView />} />
                <Route path="chitids" element={<ChitIdForm />} />
                <Route path="todayrate" element={<TodayRateManager />} />
                <Route path="chitregister" element={<ChitRegisterForm />} />
                  <Route path="chitregisterlist" element={<ChitRegisterList />} /> 
                  <Route path="transview" element={<TransactionTable />} /> 
                   <Route path="chittable" element={<ChitRegisterTable />} /> 
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
