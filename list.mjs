//import {popups} from "/node_modules/@d3x0r/popups/popups.mjs" 

import { JSOX } from "/node_modules/jsox/lib/jsox.mjs"

export class TreeItem {
}

export class TreeList {
}

export function createList(opts, toString) {
	var selected = null;
	var groups = [];
	var itemOpens = false;
	//	console.log("Cliff here with toString");
	//	console.log(toString);
	var groupList = {
		divTable: opts.parent,
		itemList :[],
		push(group, toString_, opens, opts) {
			//var itemList = this.divTable.childNodes;
			let priorItem = null;
			var nextItem = null;
			let index = 0;
			if( !opts.inOrder ) {
				// alphabet sort - using insertBefore based on content text
				for (let _nextItem of this.itemList) {
					nextItem = _nextItem.treeLabel;
					if (toString(group) < nextItem.textContent) {
						priorItem = _nextItem;
						break;
					}else index++;
				}
				nextItem = priorItem && priorItem.newLi;
			}else {
				nextItem = null;
			}
			const newLi = document.createElement("LI");
			newLi.className = "listItem listContainer list-item-" + opts.suffix;
			const newLiText = document.createElement("span");
			newLiText.className = "listItemText"
			newLi.appendChild(newLiText);

			newLi.addEventListener("click", (e) => {
				e.preventDefault();
				if (selected)
					selected.classList.remove("selected");
				newLi.classList.add("selected");
				selected = newLi;
			})

			var newSubList = document.createElement("UL");
			newSubList.className = "listSubList";
			if (opts.parentItem)
				opts.parentItem.enableOpen(opts.thisItem);
			if (opens) {
				//	this.enableOpen(newLi);
			}

			var treeLabel = document.createElement("span");
			treeLabel.textContent = toString(group);
			treeLabel.className = "listItemLabel list-item-label-"+opts.suffix;
			newLi.appendChild(treeLabel);

			//var newSubDiv = document.createElement( "DIV");
			newLi.appendChild(newSubList);

			//newSubList.appendChild( newSubDiv);
			var newRow;
			var listParams;
			var subItems = createList(listParams = { inOrder:opts?.inOrder, suffix:opts.suffix+"-" + (( opts?.suffix)||"sub"), thisItem: null, parentItem: this, parent: newSubList }, toString_, true);
			
			groups.push(newRow = {
				opens: false, group: group
				, item: newLi
				, itemText: treeLabel
				, subItems: subItems
				, parent: opts
				, enableDrag( a,b,c ){
					//newLi.setAttribute("draggable", true);
					//newLi.addEventListener("dragstart", (evt) => {
					//	console.log( "dragstart thing?");
					//} );

					console.log( "Enable drag on the item itself... (should use its list instead?)");
				}
			});
			listParams.thisItem = newRow;

			//console.log( "insert:", newLi.textContent, "BEFORE:", nextItem?nextItem.textContent:"NULL" );
			this.itemList.splice( index, 0, {newLi, nextItem, treeLabel, newSubList} )
			this.divTable.insertBefore(newLi, nextItem);//) appendChild( newLi );

			return newRow;
		},
		enableOpen(item) {
			if (item.opens) return;
			item.opens = true;
			var treeKnob = document.createElement("span");
			treeKnob.textContent = "-";
			treeKnob.className = "knobOpen";
			item.item.insertBefore(treeKnob, item.item.childNodes[0]);
			treeKnob.addEventListener("click", (e) => {
				e.preventDefault();
				if (treeKnob.className === "knobClosed") {
					treeKnob.className = "knobOpen";
					treeKnob.textContent = "-";
					item.subItems.items.forEach(sub => {
						sub.item.style.display = "";
					})
				} else {
					treeKnob.className = "knobClosed";
					treeKnob.textContent = "+";
					item.subItems.items.forEach(sub => {
						sub.item.style.display = "none";
					})

				}
			})
		},
		enableDrag(type, item, key1, item2, key2) {
			if( type.indexOf( "order") > 0 ){
				//debugger;
				;//item.classList.add("can-remove");
			} else if (type.indexOf("Remove") > 0) {
				item.item.classList.add("can-remove");
			} else {
				item.item.classList.add("can-add");
			}
			item.item.setAttribute("draggable", true);
			item.item.addEventListener("dragstart", (evt) => {
				//if( evt.dataTransfer.getData("text/plain" ) )
				//	evt.preventDefault();
				if (item2)
					evt.dataTransfer.setData("text/" + type, item.group[key1] + "," + item2.group[key2])
				else
					evt.dataTransfer.setData("text/" + type, item.group[key1])
				evt.dataTransfer.setData("text/plain", evt.dataTransfer.getData("text/plain") + JSOX.stringify({ type: type, val1: item.group[key1], val2: item2 && item2.group[key2] }));
				//console.log("Cliff here at dragstart:", type);
				if (item)
					evt.dataTransfer.setData("text/item", item.group[key1]);
				if (item2)
					evt.dataTransfer.setData("text/item2", item2.group[key2]);
			})
		},
		insertBefore( oldItem, beforeItem ){

		},
		enableDrop(type, item, cbDrop) {
			console.log("drop type ", type, item);

			item.item.classList.add("can-add");
			item.item.addEventListener("dragover", (evt) => {
				evt.preventDefault();
				evt.dataTransfer.dropEffect = "move";
				//console.log("Cliff here at Dragover:", evt.dataTransfer.getData("text/plain"), evt);
				item.item.classList.add("drag-over");
			})
			item.item.addEventListener("dragleave", (evt) => {
				//console.log("cliff here in dragleave");
				evt.preventDefault();
				item.item.classList.remove("drag-over");
			})
			item.item.addEventListener("drop", (evt) => {
				evt.preventDefault();
				var objType = evt.dataTransfer.getData("text/plain");
				JSOX.begin((event) => {
					if (type === event.type) {
						console.log("drop of:", evt.dataTransfer.getData("text/plain"));
						const dropIn = item.item.getBoundingClientRect();

						cbDrop( event.val1,
							 {x:evt.clientX-dropIn.x,y:evt.clientY-dropIn.y, h:dropIn.height, w:dropIn.width, evt:evt }
								);
					}
				}).write(objType);
				item.item.classList.remove("drag-over");
			})
		},
		update(group) {
			var item = groups.find(group_ => group_.group === group);
			item.itemText.textContent = toString(group);
		},
		get items() {
			return groups;
		},
		reset() {
			this.itemList.length = 0;
			while (this.divTable.childNodes.length)
				this.divTable.childNodes[0].remove();
		}
	}
	return groupList;
}
