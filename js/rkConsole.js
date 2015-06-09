/**
 * Created by Ravikant on 7/6/15.
 * Desc: This app is a simple version of jsConsole.
 */
var version=0.1;
function RKConsole(options){
    if(!options) options={};
    this.outputId=options.outputId || "output";
    this.formName=options.formName || "consoleForm";
    var consoleTxtId=options.consoleTxtId || "consoleVal";
    var suggestedClass=options.suggestedClass || "suggested";
    this.consoleTxtId=consoleTxtId;
    this.suggestedClass=suggestedClass;
    this.hashConsoleTxtId="#"+consoleTxtId;
    this.dotSuggestedClass="."+suggestedClass;
    this.stdKeyWords=Utils.getStandardKeywords();
    RKHistory.call(this);
}
RKConsole.prototype=new RKHistory(); //inheriting RKConsole from RKHistory
/**
 * Initialize the app and its event handlers
 * @param    none
 * @return   none
 */
RKConsole.prototype.init=function(){
    //Submitting console content
    var that=this;
    $(that.hashConsoleTxtId).bind("enterKey",function(e){
        that.runConsole(); //execute console
    });
    $(that.hashConsoleTxtId).keydown(function(e){
        var keyCode=e.keyCode || e.which;
        if( (keyCode==39 || keyCode==9)){ //37 for right arrow, 9 for TAB
            var suggested=$(that.dotSuggestedClass).text();
            var content=$(that.hashConsoleTxtId).text()+suggested;
            $(that.hashConsoleTxtId).text(content);
            $(that.dotSuggestedClass).text("");
            Utils.setCursorAtEnd($(that.hashConsoleTxtId));
        }
    });
    $(that.hashConsoleTxtId).keyup(function(e){
        var keyCode=e.keyCode || e.which;
        var ele=document.getElementById(that.consoleTxtId);
        var currentPos=Utils.getCursorPosition(ele);
        if(keyCode == 13)
        {
            $(this).trigger("enterKey");
        }else if((keyCode==8 || keyCode==46)){ //backspace & delete
             $(that.dotSuggestedClass).text("");
        }else {
           var suggested=that.getSuggested(currentPos);
            that.showSuggested(suggested);
        }
    });
    $.ctrl('Z', function(event) {
        var content=that.undo();
        $(that.hashConsoleTxtId).text(content);
    });
    $.ctrl('Y', function(event) {
        var content=that.redo();
        $(that.hashConsoleTxtId).text(content);
    });

}

/**
 * Displays output of commands put on console
 * @param    output of executed commands
 * @return   false
 */
RKConsole.prototype.showResult=function(result){
    var lastCommand=this.pastElements[this.pastElements.length-1];
    var li = document.createElement("li");
    if(typeof result=='string'){
        li.innerHTML=">  "+lastCommand +"<br> <<  "+result;
    }else if(typeof result=='object' && (result instanceof DocumentFragment || result instanceof Document || result instanceof Element)){
        li.appendChild(result);
    }else{
        li.innerHTML=">  "+lastCommand +"<br> <<  "+result.toString();
    }
    var outputEle=document.getElementById(this.outputId);
    outputEle.insertBefore(li,outputEle.firstChild);
    $(this.hashConsoleTxtId).text("");
    $(this.dotSuggestedClass).text("");
    return false;
}

/**
 * Executes all commands and displays output of commands put on console
 * @param    none
 * @return   none
 */
RKConsole.prototype.runConsole=function (){
    var consoleContent=$(this.hashConsoleTxtId).text();
    this.addToHistory(consoleContent);
    try{
        var result=eval(this.getAllCommands());
        result=result?result:'undefined';
        return this.showResult(result);
    }catch(e){
        return this.showResult(this.prepareErrorFragment("Error:"+e.message));
    }
}
/**
 * creates error element
 * @param   errMsg:error msg
 * @return  p:paragraph element
 */
RKConsole.prototype.prepareErrorFragment=function(errMsg){
    var p=document.createElement('p');
    p.className="error";
    p.innerHTML=errMsg;
    return p;
}
/**
 * overrides console.log
 * @param   none
 * @return  none
 */
RKConsole.prototype.log=function(){
    var output=[];
    for(var i= 0,len=arguments.length;i<len;i++){
        output.push(eval(arguments[i]));
    }
    rkConsole.showResult( output.join(" "));
}
/**
 * logic for auto-suggest
 * @param   str:input string on which suggestion to be made
 * @return  retObj:contains suggested word and its start and end index on str
 */
RKConsole.prototype.autoSuggest=function(str){
    var retObj;
    if(!str.trim()){
        retObj={completeKeyword:"",startIndex:0,endIndex:0};
        return retObj;
    }
    var strKeys=str.split(".");
    var obj=this.stdKeyWords;
    var retStrArr=[];
    var completeKeyword="",startIndex= 0,endIndex=0;
    for(var index= 0,lenStr=strKeys.length;index<lenStr;index++){
        var cStr=strKeys[index];
        if(!obj) break;
        for(var key in obj){
            if((key.toLowerCase()).indexOf(cStr.toLowerCase())==0){
                retStrArr.push(key);
                completeKeyword=key;
                endIndex+=cStr.length;
                obj=obj[key];
                break;
            }
        }
    }
    endIndex+=strKeys.length-1;
    startIndex=endIndex-cStr.length;
    completeKeyword=retStrArr.length==strKeys.length?completeKeyword:"";
    retObj={completeKeyword:completeKeyword,startIndex:startIndex,endIndex:endIndex};
    return retObj;
}
/**
 * it gets the suggested text
 * @param   currentPos:current position of cursor
 * @return  suggested:suggested text to be shown
 */
RKConsole.prototype.getSuggested=function(currentPos){
    var content=$(this.hashConsoleTxtId).text(); //get console content
    var contentUptoCursor=content.substring(0,currentPos);
    var lastWhiteSpaceIndex=contentUptoCursor.lastIndexOf(" ");
    var suggestionSource=contentUptoCursor.substring(lastWhiteSpaceIndex,contentUptoCursor.length);
    var suggestedObj=this.autoSuggest(suggestionSource.trim());
    var contentSuggested=content.substring(0,suggestedObj.startIndex)+suggestedObj.completeKeyword;
    var suggested=contentSuggested.substring(suggestedObj.endIndex,contentSuggested.length);
    return suggested;
}
/**
 * renders suggested text
 * @param   text:suggested text
 * @return  none
 */
RKConsole.prototype.showSuggested=function(text){
    $(this.dotSuggestedClass).text(text);
}


console.log=RKConsole.prototype.log;//overriding js log with our log
var rkConsole=new RKConsole(); //Instantiate RKConsole App
rkConsole.init(); //Initialize RKConsole