const DATA_KEY = 'liquid-metal-params';
const MARK_KEY = 'liquid-metal';

figma.showUI(__html__, { width: 1040, height: 700, themeColors: true });

// If the user opened the plugin with a tagged node selected, hydrate the UI.
const sendInitialParams = () => {
  const sel = figma.currentPage.selection;
  const node = sel.length === 1 ? sel[0] : null;
  if (node && node.getPluginData(MARK_KEY)) {
    const raw = node.getPluginData(DATA_KEY);
    if (raw) {
      try {
        figma.ui.postMessage({ type: 'loadParams', params: JSON.parse(raw) });
      } catch (_) {}
    }
  }
};
// Give UI a moment to mount before posting.
setTimeout(sendInitialParams, 50);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'insert') {
    const bytes = new Uint8Array(msg.bytes);
    const image = figma.createImage(bytes);

    const sel = figma.currentPage.selection;
    const target = sel.length === 1 ? sel[0] : null;
    const paramsJson = JSON.stringify(msg.params || {});

    // Priority 1: selection is a previously-tagged Liquid Metal node → update in place.
    // Priority 2: selection is any fillable node → replace its fill.
    // Priority 3: no selection → create a new rectangle.
    if (target && 'fills' in target) {
      target.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
      target.setPluginData(MARK_KEY, 'v1');
      target.setPluginData(DATA_KEY, paramsJson);
      const alreadyTagged = Boolean(sel[0].getPluginData(MARK_KEY));
      figma.notify(alreadyTagged ? 'Updated liquid metal' : 'Applied liquid metal to selection');
    } else {
      const rect = figma.createRectangle();
      rect.resize(msg.width, msg.height);
      rect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash }];
      rect.name = 'Liquid Metal';
      rect.setPluginData(MARK_KEY, 'v1');
      rect.setPluginData(DATA_KEY, paramsJson);
      const c = figma.viewport.center;
      rect.x = Math.round(c.x - msg.width / 2);
      rect.y = Math.round(c.y - msg.height / 2);
      figma.currentPage.appendChild(rect);
      figma.currentPage.selection = [rect];
      figma.viewport.scrollAndZoomIntoView([rect]);
      figma.notify('Inserted liquid metal');
    }
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};
