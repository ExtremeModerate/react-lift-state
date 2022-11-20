import React from 'react';
import './App.scss';
import { ContextProvider } from 'contexts/contextProvider';
import { MyApp } from 'MyApp';

const App: React.FC = () => {
    return (
        <div className="App">
            <ContextProvider>
                <MyApp></MyApp>
            </ContextProvider>
        </div>
    );
};

export default App;
