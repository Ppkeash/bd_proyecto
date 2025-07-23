const express = require('express');
const { Client, Authenticator } = require('minecraft-launcher-core');
const path = require('path');

/**
 * Servidor sencillo para lanzar Minecraft desde
 * peticiones HTTP locales.
 */
const app = express();
app.use(express.json());

app.post('/play', async (req, res) => {
  const { username, version } = req.body;
  if (!username || !version) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const launcher = new Client();
  const opts = {
    authorization: await Authenticator.getAuth(username),
    root: path.join(__dirname, 'minecraft'),
    version: { number: version, type: 'release' },
    memory: { max: '2G', min: '1G' }
  };

  try {
    launcher.launch(opts);
    launcher.on('data', (e) => console.log(e.toString()));
    launcher.on('close', (code) => console.log('Minecraft cerrado con c\u00f3digo', code));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Servidor de launcher activo en puerto 3001'));
