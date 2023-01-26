
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { createContext , useState} from 'react';
import Mainpage from './components/mainpage/mainpage';
import Playpage from './components/playpage/playpage';

import { FieldSizeContext } from "./context";
//import logo from './logo.svg';
import './App.css';


function App() {
  const [fieldSize, setFieldSize] = useState(4)





  return (

    <FieldSizeContext.Provider value={{fieldSize,setFieldSize}}>
    <BrowserRouter>
    <Routes>
      <Route path="/play" element={<Playpage></Playpage>}></Route>

      <Route path="*" element={<Mainpage></Mainpage>}></Route>


    </Routes>
    </BrowserRouter>
    </FieldSizeContext.Provider>


  );
}

export default App;
