import React from 'react';
import { getStorageItem } from '../utils/storage';

const PreviousRequests = ({ channelId }) => {
  const history = getStorageItem('requests-history') || {};
  const channelHistory = history[channelId] || [];

  if (channelHistory.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Solicitudes anteriores</h3>
        <p className="text-gray-600">No hay solicitudes registradas.</p>
      </div>
    );
  }

  const materialRequests = channelHistory.filter(r => r.type === 'material');
  const pdvUpdates = channelHistory.filter(r => r.type === 'pdv-update');

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Solicitudes anteriores</h3>
      <div className="space-y-4">
        {materialRequests.length > 0 && (
          <div>
            <h4 className="font-bold mb-1">Materiales</h4>
            <ul className="list-disc list-inside space-y-1">
              {materialRequests.map((req, idx) => (
                <li key={idx} className="text-gray-700">
                  <span className="font-medium">{req.pdvId}</span> -{' '}
                  {new Date(req.timestamp).toLocaleDateString()} - {req.items.length} materiales
                </li>
              ))}
            </ul>
          </div>
        )}
        {pdvUpdates.length > 0 && (
          <div>
            <h4 className="font-bold mb-1">Actualizaciones de PDV</h4>
            <ul className="list-disc list-inside space-y-1">
              {pdvUpdates.map((req, idx) => (
                <li key={idx} className="text-gray-700">
                  <span className="font-medium">{req.pdvId}</span> -{' '}
                  {new Date(req.timestamp).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousRequests;
