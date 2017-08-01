const electron = require('electron');
const path = require('path');

const {app, clipboard, Menu, Tray} = electron;
const STACK_SIZE = 10;

function startApp(){
	let stack = [];
	const tray = new Tray(path.join('src','icon.png'));
	let template = [
		{
			label: '<empty>',
			enabled: false
		}
	];
	let menu = Menu.buildFromTemplate(template);
	tray.setContextMenu(menu);

	isClipboardChanged(clipboard, text => {
		stack = addToStack(text, stack);
		console.log("stack is ",stack);
	});
}

function addToStack(item, stack){
	return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack);
}



function isClipboardChanged(clipboard, onChange) {
	let cache = clipboard.readText();
	setInterval(() => {
		latest = clipboard.readText();
		if(latest !== cache){
			cache = latest;
			onChange(cache);
		}
	});
}

function closeApp(){
	app.quit();
}
app.on('ready', startApp);
app.on('closed', closeApp);