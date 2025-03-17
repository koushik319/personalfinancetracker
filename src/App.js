import './App.css';
import HeaderNav from './Pages/HeaderNav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './LoginAndSignUp/PageNotFound';
import LoginAndSignUp from './LoginAndSignUp/LoginAndSignUp';
//import DashBoard from './FinanceTrackerCRUD/Dashboard';
import DashBoard from './FinanceTrackerCRUD/DashBoard'
import AddExpense from './FinanceTrackerCRUD/AddExpense';
import ExpenseTracker from './FinanceTrackerCRUD/ExpenseTracker';
import ExpenseList from './FinanceTrackerCRUD/ExpenseList';
function App() {
  return (
    <div className="">
      <BrowserRouter>
          <HeaderNav/>
              <Routes>
                  <Route path="/" element={<LoginAndSignUp/>}/>
                  {/* <Route path="/dashboard" element={<DashBoard/>}/> */}
                  <Route path='/dashboard' element={<DashBoard/>}/>
                  {/* <Route path='/update/:id' element={<UpdateDetails/>}/> */}
                  <Route path='/addexpense/:id' element={<AddExpense/>}/>
                  <Route path="/expenses" element={<ExpenseTracker />} /> 
                  <Route path="/expenselist" element={<ExpenseList/>}/>
                  <Route path="*" element={<PageNotFound/>}/>
              </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
