(function(){
	function pow(x,y){
		return Math.pow(x,y)
	}
	function step(x){ //Step an ExE.
		var expr=-1
		var rep=0
		var rep2=0
		var sep=0
		var sep2=-1
		var rule=1
		var op=0
		const opcodes="EABCDFGH"
		var length=x.length
		//expr is the start of the current ExE expression
		//rep is the end of the replicated part of the expression for rule 2
		//rep2 is the end of the replication wall for rules 2 and 3
		//sep is the location of the separator used in rule 2
		//sep2 is the end of the separator used in rule 3
		//op is the base operation (0 is 10^x, 1 is x+1, 2 is x*10, 3 is x^10)
		//rule is the rule (1 is E, 2 is #)
		for(var i=0;i<length;i++){
			if(opcodes.search("\\"+x[i])>-1){
				expr=i
				rep=sep=i+1
				rep2=sep2=i+1
				rule=1
				op=opcodes.search(x[i])
			}else if(x[i]=="#"||x[i]=="z"){
				if(x[i+1]=="#"||x[i+1]=="z"){
					rule=3
					rep=sep
					sep=i+1
					while(x[i]=="#"||x[i]=="z"){
						i++
					}
					rep2=sep2
					sep2=i
					i--
				}else{
					rule=2
					rep=sep
					sep=i+1
					rep2=sep2
					sep2=i
				}
			}
		}
		console.log(expr,rep,rep2,sep,sep2,rule)
		if(expr==-1){
			return x
		}
		if(rule==2&&x.slice(sep,length)==0){
			return x.slice(0,expr)+x.slice(rep,sep-1)
		}
		if(rule==3&&x.slice(sep2,length)==1){
			return x.slice(0,sep-1)
		}
		if(rule==2&&x.slice(sep,length)<1){
			var bound=x.slice(rep,sep-1)
			if(op>=4||op==0){
				bound=Math.log10(bound)
			}else if(op==2){
				bound=bound/10
			}else if(op==3){
				bound=pow(bound,0.1)
			}else if(op==1){
				bound=bound-1
			}
			console.log(x.slice(rep,sep-1),bound)
			if(op>=4){
				return x.slice(0,expr)+"E"+(x.slice(sep,length)*x.slice(rep,sep-1)+(1-x.slice(sep,length))*bound)
			}else{
				return x.slice(0,rep)+(x.slice(sep,length)*x.slice(rep,sep-1)+(1-x.slice(sep,length))*bound)
			}
		}
		/*if(rule==2&&x.slice(sep+1,length)==1){
			return x.slice(0,sep)
		}*/
		if(rule==1){
			var ret=x.slice(expr+1,length)
			if(op==0){
				ret=pow(10,ret)
			}else if(op==1){
				ret=+ret+1
			}else if(op==2||op==4){
				ret*=10
			}else if(op==3){
				ret=pow(ret,10)
			}else if(op>=5&&op<=7){
				//note to self: Move to separate core
				const chars="EFGH"
				if(ret<1){
					ret=chars[op-5]+ret
				}else{
					ret=chars[op-5]+chars[op-4]+(ret-1)
				}
			}
			return x.slice(0,expr)+ret
		}else if(rule==2){
			return x.slice(0,expr)+x.slice(expr,rep)+x.slice(expr,sep)+(x.slice(sep,length)-1)
		}else if(rule==3){
			return x.slice(0,sep2-1)+x.slice(rep2,sep2)+(x.slice(sep2,length)-1)
		}
	}
	function calculate(x,n){
		if(n){
			return step(calculate(x,n-1))
		}else{
			return x
		}
	}
	googol.notations.exe=step
})()