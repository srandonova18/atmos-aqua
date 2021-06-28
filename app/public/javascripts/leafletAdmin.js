var map = L.map('map').setView([42.485203077203, 27.479660015985], 15);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=E8aG7t3CynBGOUxNa7kp', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


var options = {
    position: 'topleft', 
    drawMarker: true, 
    drawPolyline: true,
    drawRectangle: true, 
    drawPolygon: true, 
    drawCircle: true, 
    cutPolygon: true, 
    editMode: true, 
    removalMode: true, 
};
map.pm.addControls(options);