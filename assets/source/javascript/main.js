(function( $, window, document, UNDEFINED ){

    var	$win = $(window),
		size = 'unknown',
		NULL = null,
		tap_evt = 'click';
		
	if ( 'touchend' in window )
	{
		tap_evt = 'touchend';
	}
	
	/*! Get the Media Query */
	getActiveMQ = function()
	{
		$('<div id="getActiveMQ-watcher"></div>')
			.appendTo('body')
			.hide();
		
		var computed = window.getComputedStyle,
			watcher = document.getElementById('getActiveMQ-watcher');
			if ( 'currentStyle' in watcher )
			{
				getActiveMQ = function()
				{
					return watcher.currentStyle['fontFamily'].replace(/['"]/g,'');
				};
			}
			else if ( computed )
			{
				getActiveMQ = function()
				{
					return computed( watcher, null ).getPropertyValue( 'font-family' ).replace(/['"]/g,'');
				};
			}
			else
			{
				getActiveMQ = function()
				{
					return 'unknown';
				};
			}
			return getActiveMQ();
	};

    /*! resize watcher */
	window.watchResize = function(callback)
	{
		var resizing;
		function done()
		{
			clearTimeout( resizing );
			resizing = NULL;
			callback();
		}
		$win.resize(function(){
			if ( resizing )
			{
				clearTimeout( resizing );
				resizing = NULL;
			}
			resizing = setTimeout( done, 50 );
		});
		// init
		callback();
	};
	window.watchResize(function(){
		size = getActiveMQ();
	});
	
	/*! A fix for theWebKit Resize Bug https://bugs.webkit.org/show_bug.cgi?id=53166. */
	$(window).on('load',function(){
		window.watchResize(function(){
			var $body = $('body');
			$body.css('overflow', 'hidden').height();
			$body.css('overflow', 'auto');
		});
	});

	/*! Adaptive Images */
	window.watchResize(function(){
		
		var $img = $('<img alt=""/>'),
			$els = $('[data-image]');
		if ( size == 'break-4' )
		{
			$els.each(function(){
				
				var $el = $(this),
					attrs = {
						src: $el.data('image')
					},
					incoming = $el.data('image-attr').split(';'),
					len = incoming.length,
					prop;
				
				if ( ! $el.is('[data-imaged]') )
				{
					while ( len-- )
					{
						if ( incoming[len] == '' ) continue;

						prop = incoming[len].split(':');
						attrs[ prop[0] ] = prop[1];
					}

					$img.clone()
						.attr( attrs )
						.prependTo(
							$el.attr('data-imaged','')
						 );
				}
					
			});
		}

	});
	
})( jQuery, this, this.document );