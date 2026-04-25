# Liquid Metal Shader

WebGL2 shader playground with two modes:

- **Mesh metal** — domain-warped FBM field with chromatic ramp, optional SVG masking, sweep band, multi-stop color ramp, and a randomize button.
- **Liquid metal** — port of [paper-design/liquid-logo](https://github.com/paper-design/liquid-logo) (PolyForm Shield 1.0.0). Upload an SVG → Poisson-solved gradient → striped liquid metal pattern with refraction.

`index.html` is a self-contained standalone (open in any modern browser).
`figma-plugin/` is the same tool packaged as a Figma plugin that inserts the rendered PNG directly into the file.

Spacebar pauses/unpauses both modes for picking export frames.
