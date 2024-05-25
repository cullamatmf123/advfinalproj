
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import BookPage from './pages/book';
import BookCard from './pages/bookcard';



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/*' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignUpPage/>}/>
            <Route path='/bookcard' element={<BookCard/>}/>
            <Route path='/book' element={<BookPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
