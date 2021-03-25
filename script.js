
/////////////////////////////////////// List Manager Module ///////////////////////////////////////

var listManager = {

	order_dict: {

		"list1":[1,2,3],
		"list2":[1,2,3]

	},

	/*

	admission: {

		"list1":["block4"],
		"list2":["block5"]

	},

	*/

	handleDragStartList: handleDragStartList,
	handleDragList: handleDragList,
	handleDragEndList: handleDragEndList,

	handleDragEnterList: handleDragEnterList,
	handleDragOverList: handleDragOverList,
	handleDragLeaveList: handleDragLeaveList,
	handleDropList: handleDropList,

	getParentList: getParentList,
	createKey: createKey

}

function handleDragStartList(e){

	e.target.style.opacity = 0.5

}

function isSuperiorBlock(block1, block2, order){

	// return true if block2 is inmediatly over block1

	var key1 = block1.getAttribute("key")
	var key2 = block2.getAttribute("key")

	for(var i = 0; i < order.length; i++){

		if (order[i] == key1){
			var idx1 = i
		}

		if(order[i] == key2){
			var idx2 = i
		}
	}

	return idx2 == idx1-1

}

function isInferiorBlock(block1, block2, order){

	// return true if block2 is inmediatly below block1

	var key1 = block1.getAttribute("key")
	var key2 = block2.getAttribute("key")

	for(var i = 0; i < order.length; i++){

		if (order[i] == key1){
			var idx1 = i
		}

		if(order[i] == key2){
			var idx2 = i
		}
	}

	return idx2 == idx1+1

}

function swapOrder(block1, block2, order){

	// swap block1 and block2 in order list

	var key1 = block1.getAttribute("key")
	var key2 = block2.getAttribute("key")

	for(var i = 0; i < order.length; i++){

		if (order[i] == key1){
			var idx1 = i
		}

		if(order[i] == key2){
			var idx2 = i
		}
	}

	var aux = order[idx1]
	order[idx1] = order[idx2]
	order[idx2] = aux

}

function handleDragList(e){

	var parent = e.target.parentElement

	var children = e.target.parentElement.children

	for(var i = 0; i < children.length; i++){

		if(isSuperiorBlock(e.target, children[i], this.order_dict[parent.id])){//superior by order
			var block_sup = children[i]
		}
	
		if(isInferiorBlock(e.target, children[i], this.order_dict[parent.id])){//inferior by order
			var block_inf = children[i]
		}

	}
	
	if(block_sup != undefined && e.clientY != 0){
		if (e.clientY < block_sup.getBoundingClientRect().y + block_sup.getBoundingClientRect().height){
			//swap target with block_sup without removing the target

			parent = e.target.parentElement
			parent.removeChild(block_sup)
			parent.insertBefore(block_sup, e.target.nextSibling)

			swapOrder(e.target, block_sup, this.order_dict[parent.id])
			
		}
	}

	if(block_inf != undefined && e.clientY != 0){
		if(e.clientY > block_inf.getBoundingClientRect().y){
			//swap target with block_inf without removing the target

			parent = e.target.parentElement
			parent.removeChild(block_inf)
			parent.insertBefore(block_inf, e.target)

			swapOrder(e.target, block_inf, this.order_dict[parent.id])
		}
	}
	
}

function handleDragEndList(e){

	e.target.style.opacity = 1

}

function getParentList(element){

	while (!(element.id in this.order_dict)){

		element = element.parentElement

	}

	return element

}

function handleDragEnterList(e){
	/*
	var parent_list = this.getParentList(e.target)

	var transparency = document.createElement("div")

	transparency.style.height = "100px"
	transparency.style.width = "100px"
	transparency.style.backgroundColor = "blue"

	console.log("enter")
	console.log(e.target)
	*/
}

function handleDragOverList(e){

	e.preventDefault()

}

function handleDragLeaveList(e){
	/*
	console.log("leave")
	console.log(e.target)
	*/
}

function createKey(parent_list){

	max = 0

	for(var i = 0; i < this.order_dict[parent_list.id].length; i++){

		if (this.order_dict[parent_list.id][i] > max){

			max = this.order_dict[parent_list.id][i]

		}

	}

	return max + 1

}

function isInList_(l, element){

	var res = false

	for(var i = 0; i < l.length; i++){
		if(l[i] == element){res = true}
	}

	return res

}

function handleDropList(e){

	e.preventDefault()

	if (e.dataTransfer.getData("text") != ""){

		var id = e.dataTransfer.getData("text")

		var pickup_block = document.getElementById(id).cloneNode(true)

		if (isInList_(pickup_block.classList, "pickUp")){

			var parent_list = this.getParentList(e.target)
			var key = this.createKey(parent_list)
			pickup_block.classList = ["block"]
			pickup_block.setAttribute("draggable", true)
			pickup_block.setAttribute("key", key)
			pickup_block.setAttribute("ondragstart", "listManager.handleDragStartList(event)") 
			pickup_block.setAttribute("ondrag", "listManager.handleDragList(event)") 
			pickup_block.setAttribute("ondragend", "listManager.handleDragEndList(event)")

			parent_list.appendChild(pickup_block)
			this.order_dict[parent_list.id].push(key)

		}

	}

}

function handleDragStartPickUp(e){

	e.dataTransfer.setData("text", e.target.id)

}

///////////////////////////////////////////////////////////////////////////////////////////////////