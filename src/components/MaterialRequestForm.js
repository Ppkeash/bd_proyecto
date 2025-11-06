import React, { useState, useEffect } from 'react';
import {
  getChannels,
  getMaterialsByChannel,
  getCampaigns,
} from '../services/api';
import { createRequest } from '../services/requests';
import ContextInfo from './ContextInfo';
import SingleSelectModal from './SingleSelectModal';
import PreviousCampaignsModal from './PreviousCampaignsModal';
import { getDisplayName, formatQuantity } from '../utils/materialDisplay';
import { getStorageItem } from '../utils/storage';

const zones = ['Fachada', 'Zona de experiencia', 'Mesas asesores'];
const priorities = ['Prioridad 1', 'Prioridad 2', 'Prioridad 3'];

const MaterialRequestForm = ({
  onConfirmRequest,
  onBackToPdv,
  selectedPdvId,
  selectedPdvName,
  selectedRegionId,
  selectedRegionName,
  selectedSubId,
  selectedSubName,
  selectedChannelId,
  tradeType,
}) => {
  const [channels, setChannels] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedMeasures, setSelectedMeasures] = useState('');
  const [customMeasure, setCustomMeasure] = useState('');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [campaignList, setCampaignList] = useState([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPreviousModal, setShowPreviousModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pdvSnapshot, setPdvSnapshot] = useState({});
  const [expandCart, setExpandCart] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');

  const channelName = channels.find((c) => c.id === selectedChannelId)?.name || selectedChannelId;

  useEffect(() => {
    setSelectedMeasures('');
    setCustomMeasure('');
  }, [selectedMaterial]);

  useEffect(() => {
    getChannels().then(setChannels).catch(console.error);
    getCampaigns().then(setCampaignList).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedChannelId) {
      setMaterials([]);
      return;
    }
    getMaterialsByChannel(selectedChannelId).then(setMaterials).catch(console.error);
  }, [selectedChannelId]);

  const availableMeasures = React.useMemo(() => {
    const material = materials.find((m) => m.id === selectedMaterial);
    const base = material?.medidas || [];
    const opts = base.map((m) => ({ id: m, name: m }));
    opts.push({ id: 'otro', name: 'Otro' });
    return opts;
  }, [selectedMaterial, materials]);

  const handleAddToCart = () => {
    const materialDetails = materials.find((m) => m.id === selectedMaterial);
    if (selectedMaterial && quantity > 0 && (selectedMeasures || customMeasure)) {
      const measureDetails =
        selectedMeasures === 'otro'
          ? { id: 'otro', name: customMeasure || 'Personalizado' }
          : { id: selectedMeasures, name: selectedMeasures };
      setCart((prevCart) => [
        ...prevCart,
        {
          id: `${materialDetails.id}-${Date.now()}`,
          material: materialDetails,
          measures: measureDetails,
          quantity,
          notes,
        },
      ]);
      setSelectedMaterial('');
      setQuantity(1);
      setSelectedMeasures('');
      setCustomMeasure('');
      setNotes('');
    } else {
      alert('Por favor, selecciona material, medidas y cantidad válida.');
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddPreviousItems = (req) => {
    const newItems = req.items.map((item) => ({
      ...item,
      id: `${item.material.id}-${Date.now()}-${Math.random()}`,
    }));
    setCart((prev) => [...prev, ...newItems]);
    if (req.campaigns && req.campaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(req.campaigns[0]);
    }
    setShowPreviousModal(false);
  };

  const handleOpenConfirm = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega materiales antes de confirmar.');
      return;
    }
    if (!selectedChannelId || !selectedRegionName || !selectedSubName || !selectedPdvId) {
      alert('Completa todos los campos requeridos.');
      return;
    }
    if (selectedZones.length === 0 || !selectedPriority || !selectedCampaign) {
      alert('Por favor completa Zona, Prioridad y Campaña antes de continuar.');
      return;
    }
    const snap = getStorageItem(`pdv-${selectedPdvId}-data`) || {};
    setPdvSnapshot({
      contactName: snap.contactName || '',
      contactPhone: snap.contactPhone || '',
      city: snap.city || '',
      address: snap.address || '',
      notes: snap.notes || '',
    });
    setShowConfirmModal(true);
  };

  const handleConfirmCart = async () => {
    if (cart.length > 0) {
      const itemsToStore = cart.map((item) => ({
        ...item,
        displayName: getDisplayName(item.material.name),
      }));

      const payload = {
        regionId: selectedRegionId,
        subterritoryId: selectedSubId,
        pdvId: selectedPdvId,
        campaignId: selectedCampaign || null,
        priority: selectedPriority || null,
        zones: selectedZones,
        observations: '',
        items: cart.map((item) => ({
          materialId: item.material.id,
          quantity: item.quantity,
          measureTag: item.measures.id === 'otro' ? 'Otro' : item.measures.name,
          measureCustom: item.measures.id === 'otro' ? item.measures.name : undefined,
          observations: item.notes || null,
        })),
        createdBy: 'usuario@empresa.com',
      };

      try {
        const res = await createRequest(payload);
        alert(`Solicitud creada: #${res.id}`);
      } catch (e) {
        console.error(e);
        alert('No se pudo crear la solicitud');
      }

      onConfirmRequest({
        pdvId: selectedPdvId,
        pdvSnapshot,
        region: selectedRegionName,
        subterritory: selectedSubName,
        zones: selectedZones,
        priority: selectedPriority,
        campaigns: selectedCampaign ? [selectedCampaign] : [],
        channelId: selectedChannelId,
        items: itemsToStore,
      });
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">Solicitar Material POP</h2>
      <p className="text-center text-sm text-gray-600 mb-8">
        PDV: <span className="font-semibold">{selectedPdvName}</span> • {selectedSubName} • {selectedRegionName} • Canal: {channelName}
      </p>

      <div className={`grid gap-6 ${tradeType === 'regional' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {/* Formulario Principal */}
        <div className={tradeType === 'regional' ? 'lg:col-span-2' : ''}>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            {/* Material */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Material</label>
              <button
                onClick={() => setShowMaterialModal(true)}
                className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg text-left hover:border-tigo-blue transition-colors"
              >
                {selectedMaterial
                  ? getDisplayName(materials.find((m) => m.id === selectedMaterial)?.name)
                  : '+ Seleccionar material'}
              </button>
              {selectedMaterial && (
                <p className="text-xs text-gray-600 mt-2">
                  {materials.find((m) => m.id === selectedMaterial)?.requiresCotizacion
                    ? 'Material bajo pedido'
                    : `Stock: ${materials.find((m) => m.id === selectedMaterial)?.stock || 0}`}
                </p>
              )}
            </div>

            {/* Medidas */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Medidas</label>
              <select
                value={selectedMeasures}
                onChange={(e) => setSelectedMeasures(e.target.value)}
                className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue outline-none"
              >
                <option value="">-- Selecciona --</option>
                {availableMeasures.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {selectedMeasures === 'otro' && (
                <input
                  type="text"
                  value={customMeasure}
                  onChange={(e) => setCustomMeasure(e.target.value)}
                  placeholder="Especifica las medidas"
                  className="w-full mt-3 bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue outline-none"
                />
              )}
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Cantidad</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue outline-none"
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">Notas Adicionales</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí..."
                rows="3"
                className="w-full bg-gray-100 border-2 border-gray-300 py-3 px-4 rounded-lg focus:border-tigo-blue outline-none resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-tigo-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-[#00447e] transition-all hover:scale-105"
              >
                Agregar al Carrito
              </button>
              <button
                onClick={() => setShowPreviousModal(true)}
                className="w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-all hover:scale-105"
              >
                Solicitudes Anteriores
              </button>
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Carrito ({cart.length})</h3>
          
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Vacío</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-800">{getDisplayName(item.material.name)}</p>
                      <p className="text-xs text-gray-600">{item.measures.name}</p>
                      <p className="text-xs text-gray-600">x{formatQuantity(item.material.name, item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleClearCart}
              className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
              Vaciar
            </button>
            <button
              onClick={handleOpenConfirm}
              className="w-full bg-tigo-cyan text-white font-semibold py-2 px-4 rounded-lg hover:bg-tigo-cyan/80 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>

        {/* Regional Only */}
        {tradeType === 'regional' && (
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-3 grid md:grid-cols-3 gap-6">
            {/* Zonas */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Zona</h4>
              <div className="space-y-2">
                {zones.map((z) => (
                  <label key={z} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedZones.includes(z)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedZones([...selectedZones, z]);
                        } else {
                          setSelectedZones(selectedZones.filter((s) => s !== z));
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">{z}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Prioridad</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-gray-100 border-2 border-gray-300 py-2 px-3 rounded-lg focus:border-tigo-blue outline-none"
              >
                <option value="">-- Selecciona --</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Campaña */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">Campaña</label>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="w-full bg-gray-100 border-2 border-gray-300 py-2 px-3 rounded-lg text-left text-sm hover:border-tigo-blue transition-colors"
              >
                {selectedCampaign
                  ? campaignList.find((c) => c.id === selectedCampaign)?.name
                  : '+ Seleccionar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {showMaterialModal && (
        <SingleSelectModal
          title="Seleccionar Material"
          items={materials}
          selectedId={selectedMaterial}
          onSelect={setSelectedMaterial}
          search={materialSearch}
          setSearch={setMaterialSearch}
          onClose={() => setShowMaterialModal(false)}
          placeholder="Buscar material"
        />
      )}

      {showCampaignModal && (
        <SingleSelectModal
          title="Seleccionar Campaña"
          items={campaignList}
          selectedId={selectedCampaign}
          onSelect={setSelectedCampaign}
          search={campaignSearch}
          setSearch={setCampaignSearch}
          onClose={() => setShowCampaignModal(false)}
          placeholder="Buscar campaña"
        />
      )}

      {showPreviousModal && (
        <PreviousCampaignsModal
          pdvId={selectedPdvId}
          onSelect={handleAddPreviousItems}
          onClose={() => setShowPreviousModal(false)}
        />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Confirmar Solicitud</h3>

            {/* Info */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Ubicación</p>
                <p className="text-gray-600">{selectedRegionName}</p>
                <p className="text-gray-600">{selectedSubName}</p>
                <p className="text-gray-600">{selectedPdvName}</p>
              </div>
              {Object.keys(pdvSnapshot).some(k => pdvSnapshot[k]) && (
                <div>
                  <p className="font-semibold text-gray-800">Contacto</p>
                  {pdvSnapshot.contactName && <p className="text-gray-600">{pdvSnapshot.contactName}</p>}
                  {pdvSnapshot.contactPhone && <p className="text-gray-600">{pdvSnapshot.contactPhone}</p>}
                  {pdvSnapshot.city && <p className="text-gray-600">{pdvSnapshot.city}</p>}
                </div>
              )}
            </div>

            {/* Carrito Resumen */}
            <div>
              <button
                onClick={() => setExpandCart(!expandCart)}
                className="text-tigo-blue font-semibold text-sm mb-2"
              >
                Carrito ({cart.length}) {expandCart ? '▲' : '▼'}
              </button>
              {expandCart && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-2 rounded text-sm border border-gray-200">
                      <p className="font-medium">{getDisplayName(item.material.name)}</p>
                      <p className="text-xs text-gray-600">{item.measures.name} • x{formatQuantity(item.material.name, item.quantity)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen Final */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
              <p><span className="font-semibold">Zonas:</span> {selectedZones.join(', ')}</p>
              <p><span className="font-semibold">Prioridad:</span> {selectedPriority}</p>
              <p><span className="font-semibold">Campaña:</span> {campaignList.find((c) => c.id === selectedCampaign)?.name}</p>
              <p><span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString('es-CO')}</p>
            </div>

            {/* Botones */}
            <div className="flex flex-col md:flex-row gap-3 justify-end pt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-500 transition-all"
              >
                Revisar
              </button>
              <button
                onClick={handleConfirmCart}
                className="bg-tigo-cyan text-white font-semibold py-2 px-6 rounded-lg hover:bg-tigo-cyan/80 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestForm;
