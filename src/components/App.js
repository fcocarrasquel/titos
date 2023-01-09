import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Tokens from './Tokens';
import Footer from './Footer';
import Lottery from './Lottery';
import Winner from './Winner';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter >
                <div style={{ backgroundColor: '#343a40'}} className="App">
                    <div>
                        <Routes >
                            <Route path="/" element={<Tokens />} />
                            <Route path="/lottery" element={<Lottery />} />
                            <Route path="/winner" element={<Winner />} />
                        </Routes>
                    </div>
                <Footer />
                </div>
            </BrowserRouter>
        );
    }

}

export default App;