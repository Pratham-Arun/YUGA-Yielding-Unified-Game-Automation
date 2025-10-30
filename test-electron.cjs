// Simple test to verify Electron works
console.log('Testing Electron...');

try {
  const electron = require('electron');
  console.log('Electron loaded successfully!');
  console.log('Electron version:', process.versions.electron);
  
  const { app } = electron;
  console.log('App object:', typeof app);
  
  if (app) {
    console.log('✅ Electron is working!');
    app.quit();
  } else {
    console.log('❌ App object is undefined');
  }
} catch (error) {
  console.error('❌ Error loading Electron:', error.message);
}
