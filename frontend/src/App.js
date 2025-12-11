import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css';
import Login from './components/login'
import SignUp from './components/registration'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Complaint from './components/Complaints';
import ComplaintList from './components/ComplaintList';
import Work from './components/Work';
import Verify from './components/otpverification';
import Officer from './components/officer';
import Feedback from './components/feedback';
import FeedbackOff from './components/feedbackOff';
import Find from './components/Find';
import ForgetPass from './components/ForgetPass';
import ResetOTP from './components/Resetopt';
import ChangePassword from './components/changepass';
function App() {
  return (
    <div className="bg-cover bg-center h-screen" >
        <BrowserRouter>
         
         <div className='fixed left-0 top-0 w-full'><Header/></div>
              <Routes>
                <Route path="/" element={<Login/>}/>

                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/change" element={<ForgetPass/>}/>
                <Route path="/otpverification" element={<Verify/>}/>
                <Route path="/reset-otp" element={<Verify/>}/>
                <Route path="/reset-otp" element={<ResetOTP/>}/>
                <Route path="/change-password" element={<ChangePassword/>}/>

                <Route path='/dashboard' element={<Dashboard/>}/>


                <Route path="/complaints" element={<Complaint/>}/>
                <Route path="/complaintList" element={<ComplaintList/>}/>

                <Route path="/work" element={<Work/>}/>
                <Route path="/officerwork" element={<Officer/>}/>

                <Route path="/feedback" element={<Feedback/>}/>
                <Route path="/find" element={<Find/>}/>
                <Route path="/feedbackOff" element={<FeedbackOff/>}/>
              </Routes>
         {/* </div> */}
        </BrowserRouter>
    </div>
  );
}

export default App;
