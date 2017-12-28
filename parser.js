//LR parser
//test grammar is simple +* expression parser
/*var rules=[
	{lhs:"",rhs:["sum","eof"]},
	{lhs:"sum",rhs:["product"]},
	{lhs:"sum",rhs:["product","+","sum"]},
	{lhs:"product",rhs:["value"]},
	{lhs:"product",rhs:["value","*","product"]},
	{lhs:"value",rhs:["(","sum",")"]},
	{lhs:"value",rhs:["number"]}
]*/
//generate dotted rules
function generate(rules){
	var drules=[]
	var idrules={} //dotted rules with dot at start arranged by initial word
	var edrules=[] //dotted rules with dot at end
	var nonterminals=[]
	for(var i=0;i<rules.length;i++){
		if(!nonterminals.includes(rules[i].lhs)){
			nonterminals.push(rules[i].lhs)
		}
		for(var j=0;j<=rules[i].rhs.length;j++){
			if(j==0){
				if(!idrules[rules[i].lhs]){
					idrules[rules[i].lhs]=[]
				}
				idrules[rules[i].lhs].push(drules.length)
			}
			if(j==rules[i].rhs.length){
				edrules.push(drules.length)
			}
			drules.push(Object.assign({dot:j},rules[i]))
		}
	}
	function same(x,y){
		if(x.length!=y.length){
			return false
		}
		for(var i=0;i<x.length;i++){
			if(x[i]!=y[i]){
				return false
			}
		}
		return true
	}
	//compute item sets
	var sets=[]
	var queue=[[0]] //sets that need to be constructed
	var i=0 //index in queue
	var completed=[] //sets completed
	var transitions=[] //transition table
	while(queue.length>i){
		if(completed.some(a=>same(a,queue[i]))){
			i++
			continue
		}
		var set=queue[i] //current item set
		var j=0 //index in set to close
		var added=[]
		while(j<set.length){
			var rule=drules[set[j]]
			var term=rule.rhs[rule.dot]
			//console.log(j,set.length,term,added)
			if(nonterminals.includes(term)&&!added.includes(term)){
				added.push(term)
				set=set.concat(idrules[term])
			}
			j++
		}
		sets.push(set)
		completed.push(queue[i])
		// console.log(added)
		var exists=multipart(drules,set).map(a=>a.rhs[a.dot]) //nonterminals after the dot
		//console.log(exists)
		transitions.push({})
		var row=transitions[transitions.length-1]
		for(var k=0;k<exists.length;k++){
			if(exists[k]==exists[k-1]){
				continue
			}
			var next=[] //kernel after shifting
			for(var l=0;l<set.length;l++){ //add required elements to new kernel
				var rule=drules[set[l]]
				if(rule.dot<rule.rhs.length&&rule.rhs[rule.dot]==exists[k]){
					next.push(set[l]+1)
				}
			}
			var temp=index(next,queue)
			if(temp>-1){
				row[exists[k]]=temp
			}else{
				row[exists[k]]=queue.length
				queue.push(next)
			}
		}
		i++
	}
	function index(x,y){
		for(var i=0;i<y.length;i++){
			if(same(x,y[i])){
				return i
			}
		}
		return -1
	}
	function multipart(x,y){
		return x.filter((a,b)=>y.includes(b))
	}
	//fix transitions
	for(var i=0;i<transitions.length;i++){

	}
	//firstsets
	var first={}
	for(var i=0;i<nonterminals.length;i++){
		first[nonterminals[i]]=[]
	}
	var changed=1
	while(changed){
		changed=0
		for(var i=0;i<rules.length;i++){
			var rule=rules[i]
			if(!first[rule.lhs].includes(rule.rhs[0])){
				first[rule.lhs].push(rule.rhs[0])
				changed=1 //add first element of transition
			}
			
		}
		for(var j=0;j<nonterminals.length;j++){
			for(var k=0;k<nonterminals.length;k++){
				var a=nonterminals[j]
				var b=nonterminals[k]
				if(first[a].includes(b)){
					if(!first[b].every(x=>first[a].includes(x))){
						first[a]=first[a].concat(first[b].filter(x=>!first[a].includes(x)))
						changed=1
					}
				}
			}
		}
	}
	//followsets
	var unions={} //followsets that include other followsets
	var follows={}
	for(var i=0;i<nonterminals.length;i++){
		unions[nonterminals[i]]=[]
		follows[nonterminals[i]]=[]
	}
	changed=1
	while(changed){
		changed=0
		for(var i=0;i<rules.length;i++){
			for(var j=0;j<rules[i].rhs.length;j++){
				var term=rules[i].rhs[j]
				if(nonterminals.includes(term)){
					if(j+1==rules[i].rhs.length&&!unions[term].includes(rules[i].lhs)){
						unions[term].push(rules[i].lhs)
						changed=1
					}
					if(j+1<rules[i].rhs.length){
						var next=rules[i].rhs[j+1]
						if(nonterminals.includes[next]){
							if(!first[next].every(a=>follows[term].includes(a))){
								follows[term]=follows[term].concat(first[next].filter(a=>!follows[term].includes(a)))
							}	
						}else if(!follows[term].includes(next)){
							follows[term].push(next)
						}
					}
				}
			}
		}
		for(var j=0;j<nonterminals.length;j++){
			for(var k=0;k<nonterminals.length;k++){
				var a=nonterminals[j]
				var b=nonterminals[k]
				if(unions[a].includes(b)){
					if(!follows[b].every(x=>follows[a].includes(x))){
						follows[a]=follows[a].concat(follows[b].filter(x=>!follows[a].includes(x)))
						changed=1
					}
				}
			}
		}
	}
	//compute tables
	var shift=transitions //combined action/goto table
	var reduce=new Array(sets.length)
	for(var i=0;i<sets.length;i++){
		var temp=sets[i].find(a=>edrules.includes(a))
		if(temp){
			reduce[i]=temp
		}
	}
	//actually parse
	return function(input){
		input.push({type:"eof",terminal:true,text:""}) //EOF symbol
		var stack=[]
		var states=[0]
		var char=0
		while(char<input.length){
			var reduction=reduce[states[states.length-1]]
			if(reduction&&follows[drules[reduction].lhs].includes(input[char].type)){
				var rule=drules[reduction]
				states.length-=rule.rhs.length
				var tree={type:rule.lhs,terminal:false,contents:stack.slice(-rule.rhs.length,stack.length)}
				stack.length-=rule.rhs.length
				stack.push(tree)
				states.push(shift[states[states.length-1]][rule.lhs])
			}else{
				stack.push(input[char])
				states.push(shift[states[states.length-1]][input[char].type])
				char++
			}
		}
		stack.pop() //no need for EOF symbol
		return stack
	}
}
/*var preinput=[3.14,"*","(",4.3,"*",1,"+",56,")"] //convenience array
var input=[]
for(var i=0;i<preinput.length;i++){
	if(typeof preinput[i]=="number"){
		input.push({type:"number",terminal:true,text:preinput[i]})
	}else{
		input.push({type:preinput[i],terminal:true,text:preinput[i]})
	}
}
var out=generate(rules)(input)*/
