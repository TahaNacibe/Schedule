"use client"
import { useAppAPI } from '@/contexts/AppAPI';
import Link from 'next/link';
import { useState } from 'react';

export default function InstallPage() {
    const [status, setStatus] = useState('');  // For messages
  const [extensions, setExtensions] = useState<Array<Extensions>>([]);  // For storing extensions
  const {updateExtensions} = useAppAPI();

  const handleInstall = async () => {
    const url = 'https://www.dropbox.com/scl/fi/wlepq01a2rl6kukvkpc0b/new-ext.zip?rlkey=vugikm46lufuxjao1hkobpqgb&st=4rgrbgfj&dl=1';  // Replace with your real URL
    setStatus('Installing...');

    if (window.electronAPI) {
      const result = await window.electronAPI.installExtension(url);
      if (result.success) {
        setStatus(`Installed: ${result.name}`);
        //Todo: make that update only the new one
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } else {
      setStatus('Electron API not ready (dev mode?)');
    }
    };
    

  const handleRead = async () => {
    setStatus('Reading...');

    if (window.electronAPI) {
      const extensionsList = await window.electronAPI.readExtensions();
      if(extensionsList && extensionsList.length > 0) {
        setExtensions(extensionsList);
        updateExtensions(extensionsList);
          console.log("updated extensions in context");
        setStatus(`loaded ${extensionsList.length} extensions.`);
      }
    } else {
      setStatus('Electron API not ready (dev mode?)');
    }
  };

  return (
    <div className='pl-16 flex flex-col'>
      <h1>Install Extension</h1>
      <button onClick={handleInstall} className='cursor-pointer'>Download & Install Test Extension</button>
      <button onClick={handleRead} className='cursor-pointer'>Read Extension</button>
          <p>{status}</p>
          {
              extensions && extensions.length > 0 && (
                  <div>
                      <h2>Installed Extensions:</h2>
                      {extensions.map((ext, index) => (
                          <Link href={`/extensions/${ext.id}`} key={ext.id}>
                                <h3>{index + 1}. {ext.manifest.name} (v{ext.manifest.version})</h3>
                          </Link>
                      ))}
                  </div>
              )
          }
    </div>
  );
}