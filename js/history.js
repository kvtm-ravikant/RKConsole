/**
 * Created by Ravikant on 7/6/15.
 * Desc: This module replicates command history.
 */
function RKHistory(){
    this.pastElements=[];
    this.futureElements=[];
}
/**
 * adds history
 * @param    content
 * @return   none
 */
RKHistory.prototype.addToHistory=function(content){
    this.pastElements.push(content);
}
/**
 * Undo functionality
 * @param    content
 * @return   lastContent:content which was undone
 */
RKHistory.prototype.undo=function(){
    if(this.pastElements.length){
        var lastContent=this.pastElements.pop();
        this.futureElements.push(lastContent);
        return lastContent;
    }
    return "";
}
/**
 * Undo functionality
 * @param    none
 * @return   firstContent:content which is redone
 */
RKHistory.prototype.redo=function(){
    if(this.futureElements.length){
        var firstContent=this.futureElements.pop();
        this.pastElements.push(firstContent);
        return firstContent;
    }
    return "";
}
/**
 * gets all history commands
 * @param    none
 * @return   none
 */
RKHistory.prototype.getAllCommands=function(){
    return this.pastElements.join(" ");
}


