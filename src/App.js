import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Activity from "./pages/Activity";
import NewActivity from "./pages/NewActivity";
import ActivityDetail from "./pages/ActivityDetail";
import Login from "./pages/Login";
import UserDetail from "./pages/UserDetail"; 
import Test from "./components/Test.tsx"
import Chat from "./pages/Chat.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Activity" element={<Activity />}></Route>
          <Route path="/NewActivity" element={<NewActivity />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Test" element={<Test />}></Route>
          <Route path="/Chat" element={<Chat />}></Route>
          <Route path="/UserDetail/:userId" element={<UserDetail />}></Route>
          <Route path="/ActivityDetail/:activityId" element={<ActivityDetail/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;