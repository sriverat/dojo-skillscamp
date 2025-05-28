const sharp = require('sharp');

sharp('assets/images/dojo-skillscamp.jpg')
  .webp({ quality: 80 })
  .toFile('assets/images/dojo-skillscamp.webp')
  .then(info => { console.log('Conversión exitosa:', info); })
  .catch(err => { console.error('Error en la conversión:', err); }); 