


L.Icon.Glyph = L.Icon.extend({
	options: {
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
		// 		iconUrl: 'glyph-marker-icon.png',
		// 		iconSize: [35, 45],
		// 		iconAnchor:   [17, 42],
		// 		popupAnchor: [1, -32],
		// 		shadowAnchor: [10, 12],
		// 		shadowSize: [36, 16],
		// 		bgPos: (Point)
		className: 'z-1000',
		prefix: '',
		glyph: 'home',
		glyphColor: 'red',
		glyphSize: '11px',	// in CSS units
		glyphAnchor: [0, -1]	// In pixels, counting from the center of the image.
	},

	createIcon: function () {
		var div = document.createElement('div'),
			options = this.options;

		if (options.glyph) {
			div.appendChild(this._createGlyph());
		}

		this._setIconStyles(div, options.className);
		return div;
	},

	_createGlyph: function () {
		var glyphClass,
			textContent,
			options = this.options;

		if (!options.prefix) {
			glyphClass = '';
			textContent = options.glyph;
		} else if (options.glyph.slice(0, options.prefix.length + 1) === options.prefix + "-") {
			glyphClass = options.glyph;
		} else {
			glyphClass = options.prefix + "-" + options.glyph;
		}

		var span = L.DomUtil.create('span', options.prefix + ' ' + glyphClass);
		span.style.fontSize = options.glyphSize;
		span.style.color = options.glyphColor;
		span.style.width = options.iconSize[0] + 'px';
		span.style.lineHeight = options.iconSize[1] + 'px';
		span.style.textAlign = 'center';
		span.style.marginLeft = options.glyphAnchor[0] + 'px';
		span.style.marginTop = options.glyphAnchor[1] + 'px';
		span.style.pointerEvents = 'none';

		if (textContent) {
			span.innerHTML = textContent;
			span.style.display = 'inline-block';
		}

		return span;
	},

	_setIconStyles: function (div, name) {
		if (name === 'shadow') {
			return L.Icon.prototype._setIconStyles.call(this, div, name);
		}

		var options = this.options,
			size = L.point(options['iconSize']),
			anchor = L.point(options.iconAnchor);

		if (!anchor && size) {
			anchor = size.divideBy(2, true);
		}

		div.className = 'leaflet-marker-icon leaflet-glyph-icon ' + name;
		var src = this._getIconUrl('icon');
		if (src) {
			div.style.backgroundImage = "url('" + src + "')";
		}

		if (options.bgPos) {
			div.style.backgroundPosition = (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
		}
		if (options.bgSize) {
			div.style.backgroundSize = (options.bgSize.x) + 'px ' + (options.bgSize.y) + 'px';
		}

		if (anchor) {
			div.style.marginLeft = (-anchor.x) + 'px';
			div.style.marginTop = (-anchor.y) + 'px';
		}

		if (size) {
			div.style.width = size.x + 'px';
			div.style.height = size.y + 'px';
		}
	}
});

L.icon.glyph = function (options) {
	return new L.Icon.Glyph(options);
};


// Base64-encoded version of glyph-marker-icon.png
L.Icon.Glyph.prototype.options.iconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjhDQTY0NjkwQTczMTFFOUI5MzZCRTdENzlCQTlCMUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjhDQTY0NkEwQTczMTFFOUI5MzZCRTdENzlCQTlCMUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2OENBNjQ2NzBBNzMxMUU5QjkzNkJFN0Q3OUJBOUIxQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2OENBNjQ2ODBBNzMxMUU5QjkzNkJFN0Q3OUJBOUIxQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi7AUVAAAAVmSURBVHja7FZNbFVFFD5n5t773it9pYCAhj/Db8Tws6JsEJqKuhAxEhWQ6EbRlYa4ITEmsHRDojtYuABJTIRAJGriAlqNUSQEtAgphhYwKjRAbWnpe/femeM3c9+jVVrpq+KKm8x7986cc745Z853zrCI0L1+FP0Pz32Q+yD37gkuKu1fyqxoOkd0nSzdAnVmKUX9ImGO+ekcqWZhWsbEs7GrPJb7yyRdoNhJLfbLUOljA2KoiD33WkMRM3XZ0hDIKOAOeXuj0m/A2ZnZlAz7JZpAPJ+Y1qast+PzNMYujH0jejLC3KoZOvwwDyMGH9bNJAmMD/5FKMFgKhCFIf5peZGDvSR2M6Zfwej+J5DNs3S032C7MVzmGEGhzG21aC7xwunE9TkSF6zzV8l2dALNgedJIgSV1FONWrXfsukaTJ4bCWRtpMP9KQJtAEBxrw+N3rKa9OurSTXNIQ7rK7liSZIBsscvktndRuajNsiXyEYTKSSZVlDBCYgsgODvzjB3sU+w+plBfU+ZObCwLEkvrIcUHXqLgnXN3huRHqLBZGhLBYSJJyFUeUqPtFL83PtEaYzwTSSNPYY2PXtZ7KNnbULqFEXUr/O7xAHAnCT9gA4o9827pNc9Trb0C0nfFeQTDLg4Vge+3bxb1+tavDypEOHrd37iPViMrbxZ5cnUhzl4LREccZriEym471XSTU2I/QWEAfMufCM9PqzWy+kVK7ye03d2DKDqVfAeJnJqtuItEWQtFMTeIr1qKemXniQbX8pSi+/CNM5S0MnrzU+QfmyZt5OAWJOY8y0q3KgWs26J3TmkJiPItuaMJoPx6B6M5JGTh57etiabMoZSF1VWz6oy0UJPMTtI3DCZ1Kq5EMEhqxorjpfvgf48b8fZc3YLxEtUwDxZ/Kf1PKAHJpKY8rhqlNeb0kC8aLq352KjmKcoGcYVLuYQYnym4+z7iXh9Z6d6XO4knI+364VnMiHDAh5nuXV6qbdTBYE3fQoMv8KVqi8dV4mu9RHr3LgwOEDJud7n7bCzh18tckkh+9odJqsCyHWD7NfgBjXi4GxtCF6+0etL7w3sueBJCMZ8r/4Q+Sx0ruisr5gP2rJI5sOhun7XE6dM3ut/lXlVsQf7B1SPjQ+D7SVXbxy6aT1N5tBRUrk5kByjN5Bz8ubwUTLHTnk7jjosch6rx51H5U6bvFPnjikI/XHFm/aQOfMDqeL87DBHu2W6eayr4jzI/0jxxj1en4MITQ1Ltrx1BspVlXG7BlA1keEkYQNgS1Ru2kHp58eIC7NBrgfRCiPy5VVx9o9vN+/W0y9aqbxyB/SQqNAvws5JEzvENu/oBr7N7Id2BxMuQKBQdnUM/cSXmZfXkN5a6SfBhKF+krp+conMHvSTva1Z1NBP6ly3smlrWUzzEsnCPRyEXuRw+fNB/sSA2MC6+eGd8RGUiwXTQDR0wX70l/PdZM9dqPAhT4TO6IKdt6b1DEkzQKgK8vf2i1NPV8ZKteZE6o3v35Hv8d5gxehQAa72eHF8IGzpU8CtH8u962S/SZaCtz/ramEIUSrC4h1DMO8op1yyiHG3lfW1XO66uk28tCT2aDBKQ5FKGNxGbtoUVyd6ezw3SHcYLZHYj4s+IHfepRgJ8qs1z+B197+9pm76VpJPCpUEEa/EVAeAdjPoAI78V3fhF1JJOyIAKV9smb4z5R1jAbgrSKcp0SmM0CT0U1peb+BHCKA+m17E8s4xd4Aa6mxHyaYHCyraUBa7c6bfX0bMxPcr154s3cxquE/wbs6KJP+m62op6BsalD4Qm3gq3q+N2ZOwtq5xORbbWQuABwlqA7mREh/0N8Uanj8FGADMGEKYIrbwogAAAABJRU5ErkJggg==';


