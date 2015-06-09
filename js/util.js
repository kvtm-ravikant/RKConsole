/**
 * Created by Ravikant on 7/6/15.
 * Desc: Utilty functions for app
 */
var Utils={
    /**
     * Gets map of limited standard keywords of javascript
     * @param    none
     * @return   map
     */
    "getStandardKeywords":function(){
        var map={};
        function listProperties(root){
            var propCnt = 0;
            var obj={};
            for (var prop in root){
                if (excludeProps.indexOf(prop) === -1 && (typeof root[prop] === "undefined" || root[prop] === null || typeof root[prop].nodeName === "undefined" || root[prop].nodeName === "")) {
                    if (typeof root[prop] !== "undefined" && root[prop] !== null && typeof root[prop] !== "function" && typeof root[prop] === "object") {
                        obj[prop]={};
                    } else {
                        obj[prop]={};
                    }
                    propCnt++;
                }
            }
            return obj;
        }
        excludeProps=[];
        map["window"]={};
        map["window"]=listProperties(window);

        excludeProps = ["mimeTypes", "plugins"];
        map["window"]["clientInformation"]={};
        map["window"]["clientInformation"]=listProperties(window.clientInformation);
        map["window"]["navigator"]=listProperties(window.navigator);

        excludeProps = ["scripts", "children", "defaultView", "childNodes"];
        map["document"]=listProperties(document);

        excludeProps = [];
        map["document"]["scripts"]={};
        map["document"]=listProperties(document.scripts);

        excludeProps = [];
        map["document"]["children"]={};
        listProperties(document.children,"document.children");

        excludeProps = [];
        map["document"]["childnodes"]={};
        listProperties(document.childNodes,"document.childNodes");
        for(var key in map.window){
            map[key]=map.window[key];
        }
        return map;
    },
    /**
     * Moves cursor to the end of the element
     * @param    ele: DOM element
     * @return   none
     */
    "setCursorAtEnd":function (ele) {
        var cursor=ele.get(0);
        cursor.focus();
        var range, selection;
        if (document.createRange) {//Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(cursor);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        } else if (document.selection) {//IE 8 and lower
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(cursor);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    },
    /**
     * get current cursor position on the given element
     * @param    node: DOM element
     * @return   none
     */
    "getCursorPosition":function(node){
        var range = window.getSelection().getRangeAt(0);
        var treeWalker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            function(node) {
                var nodeRange = document.createRange();
                nodeRange.selectNodeContents(node);
                return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
                    NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
            false
        );

        var charCount = 0;
        while (treeWalker.nextNode()) {
            charCount += treeWalker.currentNode.length;
        }
        if (range.startContainer.nodeType == 3) {
            charCount += range.startOffset;
        }
        return charCount;
    }
}
