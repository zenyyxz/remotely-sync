# Remotely Sync branding assets

This directory contains the project logo in its source formats and in several
sizes for use by Remotely Sync.

## Rebuild the image files

The artwork was created with Excalidraw and exported as PNG and SVG. The
following steps describe how the supplied square SVG and PNG sizes were made.

1. Export the drawing from Excalidraw as `logo.png` and `logo.svg`, alongside
   the editable `logo.excalidraw` source.
2. Edit the SVG by hand to make its background transparent. Save the result as
   `logo-transparent.svg`.
3. Use the Python package [`svgutils`](https://github.com/btel/svg_utils) to
   place the artwork on a square canvas. See the
   [composition tutorial](https://svgutils.readthedocs.io/en/latest/tutorials/composing-multipanel_figures.html).

   ```python
   from svgutils.compose import *

   def get_standard_300x300(file_name):
       fig = Figure(
           300,
           300,
           Panel(SVG(file_name)).move(-3, 12),
       )
       return fig

   get_standard_300x300("logo-transparent.svg").save("300x300.svg")
   ```

4. Export the square SVG to PNG at the required dimensions with Inkscape:

   ```bash
   inkscape 300x300.svg -o 300x300.png
   inkscape 300x300.svg -o 50x50.png -w 50 -h 50
   inkscape 300x300.svg -o 64x64.png -w 64 -h 64
   inkscape 300x300.svg -o 256x256.png -w 256 -h 256
   ```

The repository includes 50×50, 64×64, 256×256, and 300×300 PNGs, as well as
the 300×300 SVG.

## License

The logo artwork is licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
