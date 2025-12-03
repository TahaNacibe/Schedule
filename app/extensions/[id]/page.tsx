"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAppAPI } from '@/contexts/AppAPI';
import { useTheme } from 'next-themes';

type RequestTypes = "requestDb" | "requestExternalDb" | "requestExternalLink" | "requestSocial";

interface ApiRequestMessage {
  type: RequestTypes;
  payload: any; // Specific to each type, e.g., { collection_name, ext_id, ... } for requestDb
}

interface ApiResponseMessage {
  type: 'apiResponse';
  payload: {
    success: boolean;
    data?: any;
    error?: string;
  };
}

export default function ExtensionPage() {
  const params = useParams();
  const id = params.id as string;
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  const handleMessageRef = useRef<(e: MessageEvent) => void>(() => { }); 
  const { storageApi, externalApi, externalExtensionApi, socialApi } = useAppAPI();

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
  handleMessageRef.current = async (e: MessageEvent<ApiRequestMessage | any>) => {
    if (e.source !== iframeRef.current?.contentWindow) {
      console.log('Message ignored: Wrong source');
      return;
    }

    const { type, payload } = e.data as ApiRequestMessage;
    console.log('Extension API call:', type, payload);

    let response: ApiResponseMessage = {
      type: 'apiResponse',
      payload: { success: false, error: 'Unknown request type' }
    };

    try {
      switch (type) {
        case 'requestDb':
          // Use storageApi for local DB requests
          if (payload.collection_name && payload.ext_id && payload.user_id) {
            const res = await storageApi.requestFetchDataFromDb(
              payload.collection_name,
              payload.ext_id,
              payload.user_id,
              payload.fetch_count || null,
              payload.target_id || null,
              payload.order_by || "desc"
            );
            response.payload = { success: res.success, data: res.data, error: res.message };
          } else {
            response.payload.error = 'Missing required params for requestDb';
          }
          break;

        case 'requestExternalDb':
          // Use externalExtensionApi for inter-extension DB requests
          if (payload.targetExt_id && payload.targetExt_allowList && payload.collection_name
            && payload.activeExt_id && payload.user_id) {
            const res = await externalExtensionApi.requestFetchDataFromDb(
              payload.targetExt_id,
              payload.targetExt_allowList,
              payload.collection_name,
              payload.activeExt_id,
              payload.user_id,
              payload.fetch_count || null,
              payload.targetItem_id || null,
              payload.order_by || "desc"
            );
            response.payload = { success: res.success, data: res.data, error: res.message };
          } else {
            response.payload.error = 'Missing required params for requestExternalDb';
          }
          break;

        case 'requestExternalLink':
          // Use externalApi for HTTP requests
          if (payload.endpoint && payload.request_type) {
            const res = await externalApi.requestExternalUrl(
              payload.endpoint,
              payload.request_type,
              payload.data
            );
            response.payload = { success: res.success, data: res.data, error: res.message };
          } else {
            response.payload.error = 'Missing required params for requestExternalLink';
          }
          break;

        case 'requestSocial':
          // Use socialApi for friend-related requests
          if (payload.user_id) {
            if (payload.action === 'friendList') {
              const res = await socialApi.requestUsersFriendList(payload.user_id);
              response.payload = { success: res.success, data: res.data, error: res.message };
            } else if (payload.action === 'profile') {
              const res = await socialApi.requestUserProfile(payload.user_id);
              response.payload = { success: res.success, data: res.data, error: res.message };
            } else {
              response.payload.error = 'Invalid action for requestFriends';
            }
          } else {
            response.payload.error = 'Missing user_id for requestFriends';
          }
          break;

        default:
          response.payload.error = 'Unknown request type';
      }
    } catch (err) {
      console.error('API request error:', err);
      response.payload = { success: false, error: (err as Error).message };
    }

    // Send response back to iframe
    iframeRef.current?.contentWindow?.postMessage({
      ...response,
      payload: {
        ...response.payload,
        requestId: payload.requestId
      }
    }, '*');
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