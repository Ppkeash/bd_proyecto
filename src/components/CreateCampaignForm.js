import React, { useState } from 'react';
import { campaigns } from '../mock/campaigns';
import { channels } from '../mock/channels';
import { materials } from '../mock/materials';
import { channelMaterials } from '../mock/channelMaterials';
import MaterialSelectorModal from './MaterialSelectorModal';
import { getDisplayName, formatQuantity } from '../utils/materialDisplay';

/**
 * Formulario para crear una campaña nueva.
 * Guarda temporalmente la información en localStorage.
 */
const CreateCampaignForm = ({ onBack }) => {
  // Nombre de la campaña
  const [name, setName] = useState('');
  // Prioridad única (1, 2 o 3)
  const [priority, setPriority] = useState('1');
  // Canales asociados
  const [selectedChannels, setSelectedChannels] = useState([]);
  // Materiales asignados con cantidades y medidas { [id]: { quantity, measure, customMeasure } }
  const [selectedMaterials, setSelectedMaterials] = useState({});
  // Búsqueda de materiales para filtrar la lista en el modal
  const [materialSearch, setMaterialSearch] = useState('');
  // Control de visibilidad del modal de materiales
  const [showMaterials, setShowMaterials] = useState(false);

  // Guarda la campaña en localStorage
  const handleSubmit = () => {
    if (
      !name ||
      selectedChannels.length === 0 ||
      Object.keys(selectedMaterials).length === 0 ||
      Object.values(selectedMaterials).some(
        (m) => !(m.measure || m.customMeasure),
      )
    ) {
      alert('Completa todos los campos para guardar la campaña');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('campaigns')) || campaigns;
    const newCampaign = {
      id: `camp-${Date.now()}`,
      name,
      priority,
      channels: selectedChannels,
      materials: Object.entries(selectedMaterials).map(([id, data]) => ({
        id,
        quantity: data.quantity,
        measures:
          data.measure === 'otro'
            ? { id: 'otro', name: data.customMeasure || 'Personalizado' }
            : { id: data.measure, name: data.measure },
      })),
    };
    localStorage.setItem('campaigns', JSON.stringify([...stored, newCampaign]));
    onBack();
  };
  const toggleMaterial = (id, stock) =>
    setSelectedMaterials((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        delete updated[id];
      } else if (stock > 0) {
        updated[id] = { quantity: 1, measure: '', customMeasure: '' };
      }
      return updated;
    });

  const updateMaterialQuantity = (id, qty) =>
    setSelectedMaterials((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: qty },
    }));

  const updateMaterialMeasure = (id, measure) =>
    setSelectedMaterials((prev) => ({
      ...prev,
      [id]: { ...prev[id], measure, ...(measure !== 'otro' && { customMeasure: '' }) },
    }));

  const updateCustomMeasure = (id, value) =>
    setSelectedMaterials((prev) => ({
      ...prev,
      [id]: { ...prev[id], customMeasure: value },
    }));

  const materialsWithChannels = React.useMemo(() => {
    const result = {};
    Object.entries(channelMaterials).forEach(([ch, mats]) => {
      mats.forEach(({ id }) => {
        if (!result[id]) result[id] = [];
        result[id].push(ch);
      });
    });
    materials.forEach((m) => {
      if (m.requiresCotizacion && m.canalesPermitidos) {
        if (!result[m.id]) result[m.id] = [];
        m.canalesPermitidos.forEach((ch) => {
          if (!result[m.id].includes(ch)) result[m.id].push(ch);
        });
      }
    });
    return materials.map((m) => ({
      ...m,
      channels: result[m.id]?.map(
        (cid) => channels.find((c) => c.id === cid)?.name || cid,
      ),
    }));
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Crear campaña</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la campaña"
        className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />

      <div>
        <h3 className="font-semibold mb-2">Prioridad</h3>
        <select
          className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="1">Prioridad 1</option>
          <option value="2">Prioridad 2</option>
          <option value="3">Prioridad 3</option>
        </select>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Canales</h3>
        {channels.map((c) => (
          <label key={c.id} className="block">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedChannels.includes(c.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedChannels([...selectedChannels, c.id]);
                } else {
                  setSelectedChannels(selectedChannels.filter((id) => id !== c.id));
                }
              }}
            />
            {c.name}
          </label>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Materiales</h3>
        <button
          type="button"
          onClick={() => setShowMaterials(true)}
          className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg hover:bg-gray-200"
        >
          Seleccionar materiales
        </button>
        {Object.keys(selectedMaterials).length > 0 && (
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {Object.entries(selectedMaterials).map(([id, data]) => {
              const mat = materialsWithChannels.find((m) => m.id === id);
              const measureOptions = (mat?.medidas || []).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ));
              measureOptions.push(
                <option key="otro" value="otro">
                  Otro
                </option>,
              );
              return (
                <li key={id} className="mb-2">
                  {getDisplayName(mat?.name || id)}{' '}
                  {mat?.requiresCotizacion &&
                    '(Cotizable – sin stock predeterminado) '}
                  ({mat?.channels ? mat.channels.join(', ') : ''}) - {formatQuantity(mat?.name || id, data.quantity)}
                  <select
                    className="mt-1 w-full bg-gray-100 border border-gray-300 py-1 px-2 rounded"
                    value={data.measure}
                    onChange={(e) => updateMaterialMeasure(id, e.target.value)}
                  >
                    <option value="">Selecciona las medidas</option>
                    {measureOptions}
                  </select>
                  {data.measure === 'otro' && (
                    <input
                      type="text"
                      className="mt-2 w-full bg-gray-100 border border-gray-300 py-1 px-2 rounded"
                      placeholder="Especifica las medidas"
                      value={data.customMeasure}
                      onChange={(e) => updateCustomMeasure(id, e.target.value)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showMaterials && (
        <MaterialSelectorModal
          materials={materialsWithChannels}
          selectedMaterials={selectedMaterials}
          onToggle={toggleMaterial}
          onQuantityChange={updateMaterialQuantity}
          search={materialSearch}
          setSearch={setMaterialSearch}
          onClose={() => setShowMaterials(false)}
        />
      )}

      <div className="space-y-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
        >
          Guardar
        </button>
        <button
          onClick={onBack}
          className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CreateCampaignForm;
