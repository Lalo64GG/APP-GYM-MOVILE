const { withAndroidManifest } = require('@expo/config-plugins');

function addToolsToManifest(androidManifest) {
  // Añadir el namespace tools a la etiqueta manifest
  const manifest = androidManifest.manifest;
  if (!manifest.$) {
    manifest.$ = {};
  }
  manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
  return androidManifest;
}

function modifyNotificationColorMetadata(androidManifest) {
  // Buscar y modificar la entrada meta-data para el color de notificación
  const manifest = androidManifest.manifest;
  const application = manifest.application[0];
  const metaDataArray = application['meta-data'] || [];

  for (const metaData of metaDataArray) {
    if (
      metaData.$?.['android:name'] === 
      'com.google.firebase.messaging.default_notification_color'
    ) {
      // Añadir el atributo tools:replace
      metaData.$['tools:replace'] = 'android:resource';
      break;
    }
  }

  return androidManifest;
}

module.exports = function withAndroidNotificationColor(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addToolsToManifest(config.modResults);
    config.modResults = modifyNotificationColorMetadata(config.modResults);
    return config;
  });
};