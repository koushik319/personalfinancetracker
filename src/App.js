import './App.css';
import HeaderNav from './Pages/HeaderNav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './LoginAndSignUp/PageNotFound';
import LoginAndSignUp from './LoginAndSignUp/LoginAndSignUp';
import DashBoard from './FinanceTrackerCRUD/DashBoard'
import ExpenseTracker from './FinanceTrackerCRUD/ExpenseTracker';
import ExpenseList from './FinanceTrackerCRUD/ExpenseList';
function App() {
  return (
    <div className="">
      <BrowserRouter>
          <HeaderNav/>
              <Routes>
                  <Route path="/" element={<LoginAndSignUp/>}/>
                  <Route path='/dashboard' element={<DashBoard/>}/>
                  <Route path="/expenses" element={<ExpenseTracker />} /> 
                  <Route path="/expenselist" element={<ExpenseList/>}/>
                  <Route path="*" element={<PageNotFound/>}/>
              </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
