//
// @author xwcoder@outlook.com
// zepto patch file
// patch list:
//  - remove setTimeout of tap event exec, in touch.js
//  - add tapClick event
//      video won't work in tap event callback in ios 5 and before
//  - add uc browser detect
//  - add some functionality
//
//
//
// tapClick event
//  trigger click event in tap event callback.
//  don't support propagation because tapClick is two event actually



;( function ( $ ) {
    $.fn._on = $.fn.on;

    $.fn.on = function ( event, selector, callback) {
        if ( event == 'tapClick' ) {
            return !selector || $.isFunction(selector) ?
              this.bindTapClick(event, selector || callback) : this.delegate(selector, event, callback)
        }
        return this._on( event, selector, callback );
        //return !selector || $.isFunction(selector) ?
        //  this.bind(event, selector || callback) : this.delegate(selector, event, callback)
    }

    $.fn.bindTapClick = function ( m, callback ) {

        this.bind( 'click', function ( event ) {
            if ( event && event.isMock ) {
                if ( $.isFunction( callback ) ) {
                    var r = callback.call( this, event );
                    //return r;
                    return false;
                }
            }
            e.stopPropagation();
            //return false;
            return; 
        } );

        this.bind( 'tap', function () {
            var event = document.createEvent( 'MouseEvents' );
            event.initEvent( 'click', true, true );
            event.isMock = true;
            $( this ).trigger( event );
            return false;
        } );
    };    

    [ 'tapClick' ].forEach( function ( m ) {
        $.fn[ m ] = function ( callback ) {
            return this.bind( m, callback );
        } ;
    } );

} )( Zepto );


// uc browser detect

;( function ( $ ) {
    if ( !$.browser ) {
        $.browser = {};
    }
    var ua = navigator.userAgent;
    var uc = ua.match(/UCBrowser\/([\d.]+)/);

    if ( uc ) {
        $.browser.uc = true;    
        $.browser.version = uc[ 1 ];
    }
} )( Zepto );

// 
// some functionality
//  - namespace
//  - inherit
//  - cookie

;( function ( $ ) {

    $.extend( $, {

        namespace : function () {
            var args = Array.prototype.slice.call( arguments );
            $.each( args, function ( index, item ) {
                var d = item.split( '.' ); 
                if ( typeof window[ d[0] ] == 'undefined' ) {
                    window[ d[0] ] = {};
                }
                var o = window[ d[0] ];
                for ( var i = 1, len = d.length; i < len; i++ ) {
                    o[ d[i] ] = o[ d[i] ] || {};
                    o = o[ d[i] ];
                }
            } );
        },

        inherit : function ( sb, sp, overide ) {
            var F = function () {};
            F.prototype = sp.prototype;
            sb.prototype = new F();
            sb.prototype.constructor = sb;

            sb.prototype.superClass = sp.prototype;
            
            overide = overide || {};
            sohuHD.extend( sb.prototype, overide );

            if ( sp.prototype.constructor === Object.prototype.constructor ) {
                sp.prototype.constructor = sp;
            }
        },
        
        cookie : function ( name, value, opts ) {
            if ( typeof value == 'undefined' ) {
                var i = (new RegExp("(?:^|; )" + name + "=([^;]*)")).exec(document.cookie);
                if (!i) return "";
                return i[1] || ""
            }
            opts = opts || {},
            value === null && (value = "", opts.expires = -1);
            var d = "";
            if (opts.expires && (typeof opts.expires == "number" || opts.expires.toUTCString)) {
                var e;
                typeof opts.expires == "number" ? (e = new Date, e.setTime(e.getTime() + opts.expires * 24 * 60 * 60 * 1e3)) : e = opts.expires,
                d = "; expires=" + e.toUTCString()
            }
            var f = opts.path ? "; path=" + opts.path : "",
                g = opts.domain ? "; domain=" + opts.domain : "",
                h = opts.secure ? "; secure" : "";
            document.cookie = [name, "=", value, d, f, g, h].join("")
        }
    } );
} )( Zepto );
