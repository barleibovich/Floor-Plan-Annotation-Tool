# Floor Plan Annotation Tool

A small web app I built to annotate doors and windows on a floor plan image.

## What it does

- Lets you upload a floor plan image.  
- You can draw boxes by clicking and dragging on the image.  
- After drawing, it asks you to give the box a label (like "Front Door").  
- All boxes are shown in a table with their position and size.  
- You can delete a box either by clicking it on the image (with confirmation) or from the table.  
- Hovering over any existing box highlights its border in blue.  
- Everything is saved in localStorage so it stays even after refresh.

## Extra stuff I added

- I used Tailwind CSS to keep the design clean and consistent.  
- While drawing a new box, a temporary blue overlay shows the preview until you release the mouse.  
- Alerts if you try to draw a box overlapping an existing one.  
- There's also a "Reset" button to clear localStorage and start fresh.

## How to use

1. Open `index.html` in your browser.  
2. Upload a floor plan image.  
3. Click and drag to create boxes.  
4. Enter a label.  
5. See and manage all annotations in the table below.

## Tech used

- HTML  
- JavaScript  
- Canvas API  
- Tailwind CSS  
- localStorage  
