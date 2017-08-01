const electron = require('electron');
const path = require('path');

const {app, Tray} = electron;

function startApp(){
	const tray = new Tray(path.join('src','icon.png'));
}

function closeApp(){
	app.quit();
}

app.on('ready', startApp);
app.on('closed', closeApp);