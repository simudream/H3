/* <copyright>
 * Copyright (c) 2012 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 </copyright> */

var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Globals = require("reels/globals").Globals,
    CanvasRenderer = require("reels/render").CanvasRenderer;

exports.Gameboard = Montage.create(Component, {
    tileLayer: {
        value: null
    },

    effectLayer: {
        value: null
    },

    renderer: {
        value: null
    },

    gameState: {
        value: null
    },

    inputActive: {
        value: false
    },

    templateDidLoad: {
        value: function() {
            this.tileLayer.width = Globals.board.width;
            this.tileLayer.height = Globals.board.height;

            this.effectLayer.width = Globals.board.width;
            this.effectLayer.height = Globals.board.height;

            this.renderer = CanvasRenderer.create().init(this.tileLayer, this.effectLayer);
            this.gameState.render = this.renderer;

            this.gameState.addEventListener("startRound", this, false);
            this.gameState.addEventListener("endRound", this, false);

            var self = this;

            this.effectLayer.addEventListener("mousedown", this, false);
            this.effectLayer.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);

            this.effectLayer.addEventListener("touchstart", this, false);
            this.effectLayer.addEventListener("touchmove", this, false);
            document.addEventListener("touchend", this, false);
            
            /*this.effectLayer.ontouchstart = function(event) { that.on_touch_down(event); return false; }
            this.effectLayer.ontouchmove = function(event) { that.on_touch_move(event, false); return false; } 
            document.ontouchend = function(event) { that.on_input_end(); return false; }
            
            this.effectLayer.addEventListener( 'MozTouchDown', function(event) { 
                that.on_mouse_down(event); return false; 
            }, false );
            
            this.effectLayer.addEventListener( 'MozTouchMove', function(event) { 
                that.on_mouse_move(event, false); return false; 
            }, false );
            
            document.addEventListener( 'MozTouchUp', function(event) { 
                that.on_input_end(); return false; 
            }, false );*/
        }
    },

    handleStartRound: {
        value: function() {
            this._lastFrameTime = this.timeStarted;
            this.needsDraw = true;
        }
    },

    handleEndRound: {
        value: function() {
            
        }
    },

    handleMousedown: {
        value: function(event) {
            this.inputActive = true;
            this.handleMousemove(event, true);
            return false;
        }
    },

    handleMousemove: {
        value: function(event, first) {
            if(this.inputActive) {
                var target = event.target;
                var x = event.pageX - this._element.offsetLeft;
                var y = event.pageY - this._element.offsetTop;
                
                this.gameState.addPoint(x, y, first);
                return false;
            }
        }
    },

    handleMouseup: {
        value: function() {
            if(this.inputActive) {
                this.inputActive = false;
                this.gameState.finishPath();
                return false;
            }
        }
    },

    handleTouchstart: {
        value: function(event) {
            this.inputActive = true;
            this.handleTouchmove(event, true);
            return false;
        }
    },

    handleTouchmove: {
        value: function(event, first) {
            if(this.inputActive) {
                var target = event.target;
                var x = event.touches[0].pageX - this._element.offsetLeft;
                var y = event.touches[0].pageY - this._element.offsetTop;
                
                this.gameState.addPoint(x, y, first);
                
                event.preventDefault();
                return false;
            }
        }
    },

    handleTouchend: {
        value: function() {
            if(this.inputActive) {
                this.inputActive = false;
                this.gameState.finishPath();
                return false;
            }
        }
    },

    _lastFrameTime: {
        value: null
    },

    draw: {
        value: function() {
            if(!this.gameState.roundStarted) { return; }

            var newFrameTime = Date.now();
            this.gameState.onFrame(newFrameTime, newFrameTime - this._lastFrameTime);
            this._lastFrameTime = newFrameTime;

            this.needsDraw = true; // Schedule the next draw
        }
    }
});
