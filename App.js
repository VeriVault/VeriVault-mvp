import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContentRegistry from './artifacts/ContentRegistry.json';
import RightsManager from './artifacts/RightsManager.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [contentRegistry, setContentRegistry] = useState(null);
  const [rightsManager, setRightsManager] = useState(null);
  const [account, setAccount] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [metadata, setMetadata] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contentRegistry = new ethers.Contract(
          CONTENT_REGISTRY_ADDRESS,
          ContentRegistry.abi,
          signer
        );
        const rightsManager = new ethers.Contract(
          RIGHTS_MANAGER_ADDRESS,
          RightsManager.abi,
          signer
        );

        setProvider(provider);
        setContentRegistry(contentRegistry);
        setRightsManager(rightsManager);

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
      }
    };

    init();
  }, []);

  const registerContent = async () => {
    try {
      const tx = await contentRegistry.registerContent(contentHash, metadata);
      await tx.wait();
      alert('Content registered successfully!');
    } catch (error) {
      console.error('Error registering content:', error);
    }
  };

  return (
    <div className="App">
      <h1>Content Authentication System</h1>
      <div>
        <h2>Register New Content</h2>
        <input
          type="text"
          placeholder="Content Hash"
          onChange={(e) => setContentHash(e.target.value)}
        />
        <input
          type="text"
          placeholder="Metadata URI"
          onChange={(e) => setMetadata(e.target.value)}
        />
        <button onClick={registerContent}>Register</button>
      </div>
    </div>
  );
}

export default App;
