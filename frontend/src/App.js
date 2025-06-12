import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import ChitCloseForm from './components/ChitcloseForm'; // make sure file name casing matches
import CustomerForm from './components/CustomerForm';
import LoginPage from './components/LoginPage';
import Homepage from './components/Homepage';
import ChitIdForm from './components/ChitIdForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/customer" element={<CustomerForm />} />
        <Route path="/transaction" element={<TransactionForm />} />
        <Route path="/chitclose" element={<ChitCloseForm />} />
        <Route path="/chitids" element={<ChitIdForm />} />
      </Routes>
    </Router>
  );
}

export default App;