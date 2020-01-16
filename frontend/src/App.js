import React, {useEffect, useState} from 'react';

import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

function App() {
  const [dev, setDev] = useState([]);

  useEffect(() => {
    async function loadDevs(){
      const response = await api.get('/devs');
      setDev(response.data);
    }
    loadDevs();
  }, []);

  async function handleAddDev(data){
    const response = await api.post('/devs', data);
    setDev([...dev, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {dev.map(dev => (<DevItem key={dev._id} dev={dev} />))}
        </ul>
      </main>
    </div>
  );
}

export default App;

// Botão remover usuário
// Botão editar usuário
