const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  history: () => ipcRenderer.invoke('demo:history'),
  start: prompt => ipcRenderer.invoke('demo:start', prompt),
  decide: value => ipcRenderer.invoke('demo:decide', value),
  cancel: runId => ipcRenderer.invoke('demo:cancel', runId),
  onEvent: receive => {
    const listener = (_event, value) => receive(value);
    ipcRenderer.on('demo:event', listener);
    return () => ipcRenderer.removeListener('demo:event', listener);
  }
});
