import React from 'react';
import './App.scss';
import { ContextProvider } from 'contexts/contextProvider';
import { ShoppingCart } from 'ShoppingCart';

const App: React.FC = () => {
    return (
        <div className="App">
            <ContextProvider>
                <ShoppingCart></ShoppingCart>
            </ContextProvider>
        </div>
    );
};

export default App;
