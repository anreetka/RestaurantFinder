import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RestaurantdetailPage from './routes/RestaurantdetailPage';
import UpdatePage from './routes/UpdatePage';
import Home from './routes/Home';
import { RestaurantsContextProvider } from './content/RestaurantsContext';

const App = () => {
    return (
        <RestaurantsContextProvider><div className="container">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/restaurants/:id/update" element={<UpdatePage />} />
                    <Route exact path="/restaurants/:id" element={<RestaurantdetailPage />} />
                </Routes>
            </BrowserRouter>
        </div>

        </RestaurantsContextProvider>

    );

};

export default App;