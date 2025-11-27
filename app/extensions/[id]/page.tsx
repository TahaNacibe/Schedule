"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAppAPI } from '@/contexts/AppAPI';
import { useTheme } from 'next-themes';

interface Manifest {
  name: string;
  main?: string;
}

export default function ExtensionPage() {
  const params = useParams();
  const id = params.id as string;
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { appAPI } = useAppAPI();
  const { theme } = useTheme();
  const handleMessageRef = useRef<(e: MessageEvent) => void>(() => {}); 

  useEffect(() => {
    if (!id) {
      setError('No extension ID');
      return;
    }

    const loadManifest = async () => {
      const exts = await window.electronAPI?.readExtensions() ?? [];
      const ext = exts.find((e: any) => e.id === id);
      if (ext) {
        setManifest(ext.manifest);
      } else {
        setError('Extension not found');
      }
    };
    loadManifest();
  }, [id]);

  // Define handler once, store in ref for stable reference
  handleMessageRef.current = (e: MessageEvent) => {
    console.log('Global message received:', e);  // Catch ALL messages (debug)
    if (e.source !== iframeRef.current?.contentWindow) {
      console.log('Message ignored: Wrong source');
      return;
    }

    const { type, text } = e.data;
    console.log('Extension API call:', type ==="requestData", e.data);
    switch (type) {
      case 'insertText':
        console.log('Inserting text from extension:', text);
        appAPI.insertText(text);
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'apiResponse', payload: { success: true, message: 'Inserted!' } },
          '*'
        );
        break;
      case 'requestData':
        console.log('Extension requesting data:', text);
        //ToDo: get the actually data here don't dust send bullshit like me (u_u)
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'requestData', payload: { success: true, message: 'hello youre gay' } },
          '*'
        );
        break;
      default:
        console.warn('Unknown message:', type);
    }
  };

  useEffect(() => {
    console.log('Setting up message listener for extension API');
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Add global listener immediately (for early messages)
    window.addEventListener('message', handleMessageRef.current);

    // Re-add after iframe load (for safety)
    const onLoad = () => {
      console.log('Iframe loaded, re-adding listener');
      window.addEventListener('message', handleMessageRef.current);
    };

    iframe.addEventListener('load', onLoad);
    if (iframe.contentDocument?.readyState === 'complete') {
      onLoad();  // Already loaded
    }

    return () => {
      window.removeEventListener('message', handleMessageRef.current);
      iframe.removeEventListener('load', onLoad);
    };
  }, [id, manifest]);  // Depend on manifest (runs after load)


  // theme sync
  useEffect(() => {
  if (!iframeRef.current?.contentWindow || !manifest) return;

  const updateThemeInIframe = () => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      { type: 'themeUpdate', payload: { theme } },  // 'light' or 'dark'
      '*'
    );
    console.log('Sent theme update to extension:', theme);
  };

  updateThemeInIframe();  // Send on mount/change
  }, [theme, manifest]);  // Re-send on theme change


  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!manifest) return <div className="p-4">Loading manifest...</div>;

  const entry = manifest.main || 'index.html';
  const iframeSrc = `/extensions/${id}/${entry}`;

  return (
    <div className="flex flex-col pl-12 h-screen w-full">  
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="flex-1 border-0 w-full"  // ← flex-1 fills remaining height, w-full for width
        title={manifest.name}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}