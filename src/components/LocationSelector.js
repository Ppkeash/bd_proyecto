import React, { useState, useEffect } from 'react';
import { regions, subterritories, pdvs } from '../mock/locations';
import SearchBar from './SearchBar';

const LocationSelector = ({ onSelectPdv, selectedChannel }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubterritory, setSelectedSubterritory] = useState('');
  const [availableSubterritories, setAvailableSubterritories] = useState([]);
  const [availablePdvs, setAvailablePdvs] = useState([]);
  const [pdvSearch, setPdvSearch] = useState('');

  useEffect(() => {
    if (selectedRegion) {
      setAvailableSubterritories(subterritories[selectedRegion] || []);
      setSelectedSubterritory('');
      setAvailablePdvs([]);
    } else {
      setAvailableSubterritories([]);
      setSelectedSubterritory('');
      setAvailablePdvs([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedSubterritory) {
      setAvailablePdvs(pdvs[selectedSubterritory] || []);
    } else {
      setAvailablePdvs([]);
    }
  }, [selectedSubterritory]);

  const filteredPdvs = availablePdvs.filter((pdv) =>
    pdv.name.toLowerCase().includes(pdvSearch.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona Ubicación</h2>

      <div className="mb-4">
        <label htmlFor="region-select" className="block text-gray-700 text-sm font-bold mb-2">Región:</label>
        <select
          id="region-select"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Selecciona una región</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>{region.name}</option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div className="mb-4">
          <label htmlFor="subterritory-select" className="block text-gray-700 text-sm font-bold mb-2">Subterritorio:</label>
          <select
            id="subterritory-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={selectedSubterritory}
            onChange={(e) => setSelectedSubterritory(e.target.value)}
          >
            <option value="">Selecciona un subterritorio</option>
            {availableSubterritories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedSubterritory && (
        <div className="mb-6">
          <label htmlFor="pdv-select" className="block text-gray-700 text-sm font-bold mb-2">Punto de Venta (PDV):</label>
          <SearchBar
            value={pdvSearch}
            onChange={setPdvSearch}
            placeholder="Buscar PDV"
          />
          <select
            id="pdv-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            onChange={(e) => onSelectPdv(e.target.value)}
          >
            <option value="">Selecciona un PDV</option>
            {filteredPdvs.map((pdv) => (
              <option key={pdv.id} value={pdv.id}>{pdv.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;