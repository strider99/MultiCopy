const electron = require('electron');
const path = require('path');

const {app, clipboard, globalShortcut, Menu, Tray} = electron;
const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 15;



function newMenuTemplate(clipboard, stack){
	return stack.map((item, i) => {
		return {

			label: `Copy: ${formatItem(item)}`,
			click: () => {
				clipboard.writeText(item);
			},
			accelerator: `Ctrl+Shift+${i+1}`
		}
	});
}

function formatItem(item){
	return item && item.length > ITEM_MAX_LENGTH
		? item.substr(0, ITEM_MAX_LENGTH) + '...'
		: item
}

function addToStack(item, stack){
	return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack);
}


function isClipboardChanged(clipboard, onChange) {
	let cache = clipboard.readText();
	let latest;
	setInterval(() => {
		latest = clipboard.readText();
		if(latest !== cache){
			cache = latest;
			onChange(cache);
		}
	},1000);
}

function registerShortcuts( globalShortcut, clipboard, stack) {
	globalShortcut.unregisterAll();
	for(let i = 0; i < STACK_SIZE; i++){
		globalShortcut.register(`Ctrl+Shift+${i+1}`, () => {
			clipboard.writeText(stack[i]);
		});
	}

}
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
		tray.setContextMenu(Menu.buildFromTemplate(newMenuTemplate(clipboard, stack)));
		registerShortcuts(globalShortcut, clipboard, stack);
	});

}

function closeApp(){
	globalShortcut.unregisterAll();
	app.quit();
}
app.on('ready', startApp);
app.on('will-quit', closeApp);