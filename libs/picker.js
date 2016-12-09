var picker = picker || [];

(function ($, picker) {
    "use strict";
    var colorHex = "";
    
    // converter functions
    function RGBtoHSL(color) {
        var r = color[0] /= 255, g = color[1] /= 255, b = color[2] /= 255,
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            chroma = max - min,
            h, s, l = (max + min) / 2;
        s = (l === 1) ? 0 : chroma / (1 - Math.abs(2 * l - 1));
        if (chroma === 0) {
            h = 0;
        } else {
            switch (max) {
            case r: h = ((g - b) / chroma) % 6; break;
            case g: h = (b - r) / chroma + 2; break;
            case b: h = (r - g) / chroma + 4; break;
            }
            h = Math.round(h * 60) % 360;
        }
        return [h, s, l];
    }
    
    function HSLtoRGB(color) {
        var h = color[0] /= 60, s = color[1], l = color[2],
            chroma = (1 - Math.abs(2 * l - 1)) * s,
            x = chroma * (1 - Math.abs(h % 2 - 1)),
            min = l - 0.5 * chroma,
            r, g, b;
        if (h >= 0 && h < 1) {
            r = chroma; g = x; b = 0;
        } else if (h >= 1 && h < 2) {
            r = x; g = chroma; b = 0;
        } else if (h >= 2 && h < 3) {
            r = 0; g = chroma; b = x;
        } else if (h >= 3 && h < 4) {
            r = 0; g = x; b = chroma;
        } else if (h >= 4 && h < 5) {
            r = x; g = 0; b = chroma;
        } else if (h >= 5 && h < 6) {
            r = chroma; g = 0; b = x;
        } else {
            r = 0; g = 0; b = 0;
        }
        return [(r + min) * 255, (g + min) * 255, (b + min) * 255];
    }
    
    // code taken from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function RGBToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    
    // UI functions
    
    // option boxes
    function getSelected() {
        var value = $("input[name='color-radio']:checked");
        if (value.hasClass("radio-hsl")) {
            return "hsl";
        } else if (value.hasClass("radio-rgb")) {
            return "rgb";
        }
    }
    
    // Slider functions
    
    function moveSliderPointer(yValue) {
        var sliderHeight = parseFloat($("#picker-slider").css("height").replace("px","")),
            pointerHeight = parseFloat($(".slider-handler").css("height").replace("px","")),
            pos = $("#picker-slider").offset(),
            yValue = yValue || $("#picker-slider").data("value") * sliderHeight;

        yValue = (typeof yValue === "string") ? parseFloat(yValue.replace("px","")) : yValue;
        $("#picker-slider").data("value", yValue / sliderHeight);
        pos.left = null;
        pos.top += yValue - pointerHeight / 2;
        $(".slider-handler").offset(pos);
    }
    
    function sliderMoveHanlder(args) {
        var pos = $("#picker-slider").offset();
        moveSliderPointer(args.pageY - pos.top);
    }
    
    function initSlider() {
        $("#picker-slider").on("mousedown", function (args) {
            $(this).on("mousemove", sliderMoveHanlder);
            sliderMoveHanlder(args);
        });
        $(".slider-handler").on("mousedown", function (args) {
            $(this).on("mousemove", sliderMoveHanlder);
            sliderMoveHanlder(args);
        });
        $("body").on("mouseup", function () {
            $("#picker-slider").off("mousemove", sliderMoveHanlder);
            $(".slider-handler").off("mousemove", sliderMoveHanlder);
        });
        $(window).on("resize", function () {
           moveSliderPointer();
        });
        moveSliderPointer();
    }
    
    // main UI functions
    function init() {
        initSlider();
    }
    
    $(document).ready(function () {    
        init();
    })
})(jQuery, picker);